// Modo Claude: a pergunta vai para a API da Anthropic junto com a lista de ferramentas. O modelo decide quais
// consultar, o app executa cada uma aqui no navegador (com os dados locais) e devolve o resultado, até o modelo
// escrever a resposta final. Só os resultados das ferramentas chamadas saem do computador, não o extrato inteiro.
//
// A resposta chega em streaming (o texto aparece enquanto é escrito), o começo de cada pedido fica em cache na API
// (ferramentas e instruções não são cobradas por inteiro a cada volta) e erros passageiros são tentados de novo.
import { FERRAMENTAS, ferramenta } from './ferramentas.js';
import { dataLonga, hojeISO, html } from './util.js';

const URL_API = 'https://api.anthropic.com/v1/messages';
const MAX_VOLTAS = 8;
const TENTATIVAS = 3;
// Nestes modelos, se o filtro de segurança recusar uma pergunta por engano, a própria API refaz o pedido no modelo
// recomendado para aquele caso. O Haiku não tem esse recurso.
const COM_FALLBACK = new Set(['claude-opus-5-5', 'claude-sonnet-5-5']);

// Montadas uma vez e sempre na mesma ordem: qualquer mudança aqui invalidaria o cache.
// Ferramentas "internas" (como as de desfazer) não são oferecidas ao modelo.
const DEFINICOES = FERRAMENTAS.filter(f => !f.interna).map(({ name, description, input_schema }) => ({
  name,
  description,
  input_schema
}));

function sistema(estado) {
  return `Você é o Agente Financeiro, um assistente que ajuda ${estado.nome || 'a pessoa'} a entender e organizar o próprio dinheiro a partir do extrato bancário dela.
Hoje é ${dataLonga(hojeISO())}.

Como trabalhar:
- Antes de citar qualquer número, consulte as ferramentas. Nunca invente valores. Quando precisar de várias consultas independentes, peça todas de uma vez.
- Se a pergunta não disser o período, use o mês atual e diga qual período considerou.
- Responda em português do Brasil, em tom direto e amigável, com no máximo 2 parágrafos curtos. Use listas só quando ajudarem a comparar.
- Valores sempre em reais no formato R$ 1.234,56. Datas no formato 12/10.
- Quando a pessoa pedir uma mudança (orçamento, meta), use a ferramenta correspondente e diga o que mudou. O app mostra um botão de desfazer.
- Gastos guardados em aplicação ou poupança não são despesa: são dinheiro guardado.
- Você não é consultor de investimentos: não recomende produtos financeiros específicos. Pode explicar conceitos e mostrar os números.
- Se a pergunta não tiver relação com as finanças da pessoa, responda em uma frase e volte ao assunto.`;
}

// Histórico curto em texto (as últimas trocas), para o modelo entender perguntas de continuação
function historico(conversa) {
  return conversa
    .filter(m => m.texto)
    .slice(-8)
    .map(m => ({ role: m.autor === 'pessoa' ? 'user' : 'assistant', content: m.texto }));
}

const esperar = ms => new Promise(r => setTimeout(r, ms));

function erroDaApi(status, motivo) {
  if (status === 401) return new Error('A chave da API foi recusada. Confira se ela está certa nos ajustes.');
  if (status === 403)
    return new Error('Essa chave não tem permissão para usar o modelo escolhido. Troque o modelo nos ajustes.');
  if (status === 429) return new Error('Muitas perguntas seguidas para a API. Espere um minuto e tente de novo.');
  if (status === 529 || status >= 500)
    return new Error('A API da Anthropic está sobrecarregada agora. Tente de novo em alguns minutos.');
  return new Error(`A API da Anthropic respondeu com um erro: ${motivo || `erro ${status}`}`);
}

// Faz o pedido e tenta de novo (com espera crescente) em erros passageiros: rede, 429, 5xx e sobrecarga (529)
async function chamarApi(estado, mensagens) {
  const modelo = estado.ajustes.modelo || 'claude-sonnet-5-5';
  const fallback = COM_FALLBACK.has(modelo);
  const corpo = JSON.stringify({
    model: modelo,
    max_tokens: 16000,
    stream: true,
    // Esforço médio: bom para conversa com consultas; o modelo pensa o necessário sem demorar demais
    output_config: { effort: 'medium' },
    // Cache automático: guarda ferramentas, instruções e a conversa até aqui para as próximas voltas
    cache_control: { type: 'ephemeral' },
    system: sistema(estado),
    tools: DEFINICOES,
    messages: mensagens,
    ...(fallback ? { fallbacks: 'default' } : {})
  });
  const cabecalhos = {
    'content-type': 'application/json',
    'x-api-key': estado.ajustes.chaveApi,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
    ...(fallback ? { 'anthropic-beta': 'server-side-fallback-2026-07-01' } : {})
  };
  for (let tentativa = 1; ; tentativa++) {
    let resposta;
    try {
      resposta = await fetch(URL_API, { method: 'POST', headers: cabecalhos, body: corpo });
    } catch {
      if (tentativa < TENTATIVAS) {
        await esperar(1000 * tentativa);
        continue;
      }
      throw new Error('Não consegui falar com a API da Anthropic. Confira a conexão com a internet.');
    }
    if (resposta.ok) return resposta;
    const dados = await resposta.json().catch(() => ({}));
    const passageiro = resposta.status === 429 || resposta.status >= 500;
    if (passageiro && tentativa < TENTATIVAS) {
      const pedido = Number(resposta.headers.get('retry-after'));
      await esperar(pedido > 0 && pedido <= 20 ? pedido * 1000 : 1500 * 2 ** (tentativa - 1));
      continue;
    }
    throw erroDaApi(resposta.status, dados?.error?.message);
  }
}

// Lê os eventos do streaming (SSE) e monta a mensagem completa, avisando a tela do texto que já chegou
async function lerStream(resposta, { aoEscrever, aoPensar } = {}) {
  const leitor = resposta.body.pipeThrough(new TextDecoderStream()).getReader();
  const msg = { content: [], stop_reason: null };
  const jsonParcial = {};
  let buffer = '';
  let textoAoVivo = '';

  const tratar = ev => {
    switch (ev.type) {
      case 'message_start':
        Object.assign(msg, ev.message, { content: [] });
        break;
      case 'content_block_start': {
        const bloco = { ...ev.content_block };
        msg.content[ev.index] = bloco;
        if (bloco.type === 'tool_use') jsonParcial[ev.index] = '';
        if (bloco.type === 'thinking') aoPensar?.();
        break;
      }
      case 'content_block_delta': {
        const bloco = msg.content[ev.index];
        const d = ev.delta;
        if (d.type === 'text_delta') {
          bloco.text += d.text;
          textoAoVivo += d.text;
          aoEscrever?.(textoAoVivo);
        } else if (d.type === 'input_json_delta') jsonParcial[ev.index] += d.partial_json;
        else if (d.type === 'thinking_delta') bloco.thinking = (bloco.thinking || '') + d.thinking;
        else if (d.type === 'signature_delta') bloco.signature = d.signature;
        break;
      }
      case 'content_block_stop':
        if (ev.index in jsonParcial) {
          // Entrada cortada (por exemplo, no limite de tokens) vira null e não é executada
          try {
            msg.content[ev.index].input = jsonParcial[ev.index] ? JSON.parse(jsonParcial[ev.index]) : {};
          } catch {
            msg.content[ev.index].input = null;
          }
        }
        break;
      case 'message_delta':
        Object.assign(msg, ev.delta);
        break;
      case 'error':
        throw erroDaApi(ev.error?.type === 'overloaded_error' ? 529 : 500, ev.error?.message);
    }
  };

  for (;;) {
    const { value, done } = await leitor.read();
    if (done) break;
    buffer += value.replace(/\r\n/g, '\n');
    let fim;
    while ((fim = buffer.indexOf('\n\n')) >= 0) {
      const evento = buffer.slice(0, fim);
      buffer = buffer.slice(fim + 2);
      const dados = evento
        .split('\n')
        .filter(l => l.startsWith('data:'))
        .map(l => l.slice(5).trimStart())
        .join('\n');
      if (dados) tratar(JSON.parse(dados));
    }
  }
  msg.content = msg.content.filter(Boolean);
  return msg;
}

// O que volta para a API na próxima volta. Depois de uma troca de modelo no meio da resposta (bloco "fallback"),
// só os textos de antes da troca podem ser reenviados. Blocos de texto vazios também são recusados pela API.
function paraReenviar(conteudo) {
  const troca = conteudo.findLastIndex(b => b.type === 'fallback');
  return conteudo.filter(
    (b, i) => b.type !== 'fallback' && (i > troca || b.type === 'text') && !(b.type === 'text' && !b.text)
  );
}

const textoDe = conteudo =>
  conteudo
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
    .trim();

export async function perguntarAoClaude(estado, pergunta, { aoUsarFerramenta, aoEscrever, aoPensar } = {}) {
  if (!estado.ajustes.chaveApi)
    throw new Error('Informe sua chave da API da Anthropic nos ajustes para usar o modo Claude.');
  const mensagens = [...historico(estado.conversa), { role: 'user', content: pergunta }];
  // A API exige que a conversa comece pela pessoa
  while (mensagens.length && mensagens[0].role !== 'user') mensagens.shift();
  const desfazer = [];
  const usadas = [];

  for (let volta = 0; volta < MAX_VOLTAS; volta++) {
    const resposta = await chamarApi(estado, mensagens);
    const msg = await lerStream(resposta, { aoEscrever, aoPensar });

    if (msg.stop_reason === 'refusal')
      throw new Error('O modelo preferiu não responder a essa pergunta. Tente escrever de outro jeito.');

    const conteudo = paraReenviar(msg.content);
    mensagens.push({ role: 'assistant', content: conteudo });
    if (msg.stop_reason === 'pause_turn') continue;

    if (msg.stop_reason !== 'tool_use') {
      let texto = textoDe(msg.content);
      if (msg.stop_reason === 'max_tokens')
        texto += '\n\n*(A resposta ficou longa demais e foi cortada. Peça um resumo ou uma parte de cada vez.)*';
      if (!texto) texto = 'Não consegui montar uma resposta. Tente perguntar de novo.';
      return { texto, html: markdownSimples(texto), desfazer, usadas };
    }

    // Todas as consultas pedidas nesta volta voltam juntas, numa mensagem só
    const resultados = [];
    for (const bloco of conteudo.filter(b => b.type === 'tool_use')) {
      aoUsarFerramenta?.(bloco.name);
      if (!usadas.includes(bloco.name)) usadas.push(bloco.name);
      let resultado;
      try {
        const f = ferramenta(bloco.name);
        if (!f || f.interna) resultado = { erro: `Ferramenta desconhecida: ${bloco.name}` };
        else if (bloco.input == null) resultado = { erro: 'Os parâmetros chegaram incompletos. Tente de novo.' };
        else resultado = f.executar(estado, bloco.input);
      } catch (erro) {
        resultado = { erro: String(erro.message || erro) };
      }
      // O "desfazer" é só para o botão do app; o modelo não precisa ver
      let paraModelo = resultado;
      if (resultado && !Array.isArray(resultado) && resultado.desfazer) {
        const { desfazer: comoDesfazer, ...resto } = resultado;
        desfazer.push(comoDesfazer);
        paraModelo = resto;
      }
      resultados.push({
        type: 'tool_result',
        tool_use_id: bloco.id,
        content: JSON.stringify(paraModelo ?? null),
        is_error: Boolean(resultado?.erro)
      });
    }
    mensagens.push({ role: 'user', content: resultados });
  }
  throw new Error(
    'O modelo consultou ferramentas demais sem chegar a uma resposta. Tente uma pergunta mais específica.'
  );
}

// Markdown mínimo do que o modelo costuma usar: parágrafos, listas, negrito e itálico. Tudo escapado antes.
export function markdownSimples(texto) {
  const blocos = html(texto).split(/\n{2,}/);
  return blocos
    .map(bloco => {
      const linhas = bloco.split('\n');
      const inline = l =>
        l.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|\s)\*(.+?)\*/g, '$1<em>$2</em>');
      if (linhas.every(l => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
        const ordenada = /^\s*\d+\./.test(linhas[0]);
        return `<${ordenada ? 'ol' : 'ul'} class="resposta-lista">${linhas.map(l => `<li>${inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ''))}</li>`).join('')}</${ordenada ? 'ol' : 'ul'}>`;
      }
      if (/^#{1,4}\s/.test(bloco)) return `<p><strong>${inline(bloco.replace(/^#+\s/, ''))}</strong></p>`;
      return `<p>${linhas.map(inline).join('<br>')}</p>`;
    })
    .join('');
}
