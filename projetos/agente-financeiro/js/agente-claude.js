// Modo Claude: a pergunta vai para a API da Anthropic junto com a lista de ferramentas. O modelo decide quais
// consultar, o app executa cada uma aqui no navegador (com os dados locais) e devolve o resultado, até o modelo
// escrever a resposta final. Só os resultados das ferramentas chamadas saem do computador, não o extrato inteiro.
import { FERRAMENTAS, ferramenta } from './ferramentas.js';
import { dataLonga, hojeISO, html } from './util.js';

const URL_API = 'https://api.anthropic.com/v1/messages';
const MAX_VOLTAS = 8;

function sistema(estado) {
  return `Você é o Agente Financeiro, um assistente que ajuda ${estado.nome || 'a pessoa'} a entender e organizar o próprio dinheiro a partir do extrato bancário dela.
Hoje é ${dataLonga(hojeISO())}.

Como trabalhar:
- Antes de citar qualquer número, consulte as ferramentas. Nunca invente valores.
- Responda em português do Brasil, em tom direto e amigável, com no máximo 2 parágrafos curtos. Use listas só quando ajudarem a comparar.
- Valores sempre em reais no formato R$ 1.234,56. Datas no formato 12/10.
- Quando a pessoa pedir uma mudança (orçamento, meta), use a ferramenta correspondente e diga o que mudou.
- Gastos guardados em aplicação ou poupança não são despesa: são dinheiro guardado.
- Você não é consultor de investimentos: não recomende produtos financeiros específicos. Pode explicar conceitos e mostrar os números.
- Se a pergunta não tiver relação com as finanças da pessoa, responda em uma frase e volte ao assunto.`;
}

// Histórico curto em texto (as últimas trocas), para o modelo entender perguntas de continuação
function historico(conversa) {
  return conversa
    .filter(m => m.texto)
    .slice(-8)
    .map(m => ({
      role: m.autor === 'pessoa' ? 'user' : 'assistant',
      content: m.texto
    }));
}

export async function perguntarAoClaude(estado, pergunta, { aoUsarFerramenta } = {}) {
  const { chaveApi, modelo } = estado.ajustes;
  if (!chaveApi) throw new Error('Informe sua chave da API da Anthropic nos ajustes para usar o modo Claude.');
  const mensagens = [...historico(estado.conversa), { role: 'user', content: pergunta }];
  // A API exige que a conversa comece pela pessoa e alterne os papéis
  while (mensagens.length && mensagens[0].role !== 'user') mensagens.shift();
  const desfazer = [];
  const usadas = [];

  for (let volta = 0; volta < MAX_VOLTAS; volta++) {
    let resposta;
    try {
      resposta = await fetch(URL_API, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': chaveApi,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: modelo || 'claude-sonnet-5-5',
          max_tokens: 1500,
          system: sistema(estado),
          tools: FERRAMENTAS.map(({ name, description, input_schema }) => ({
            name,
            description,
            input_schema
          })),
          messages: mensagens
        })
      });
    } catch {
      throw new Error('Não consegui falar com a API da Anthropic. Confira a conexão com a internet.');
    }
    const dados = await resposta.json().catch(() => ({}));
    if (!resposta.ok) {
      const motivo = dados?.error?.message || `erro ${resposta.status}`;
      if (resposta.status === 401)
        throw new Error('A chave da API foi recusada. Confira se ela está certa nos ajustes.');
      if (resposta.status === 429)
        throw new Error('Muitas perguntas seguidas para a API. Espere um minuto e tente de novo.');
      throw new Error(`A API da Anthropic respondeu com um erro: ${motivo}`);
    }
    mensagens.push({ role: 'assistant', content: dados.content });
    if (dados.stop_reason !== 'tool_use') {
      const texto = dados.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n\n')
        .trim();
      return { texto, html: markdownSimples(texto), desfazer, usadas };
    }
    const resultados = [];
    for (const bloco of dados.content.filter(b => b.type === 'tool_use')) {
      aoUsarFerramenta?.(bloco.name);
      usadas.push(bloco.name);
      let resultado;
      try {
        const f = ferramenta(bloco.name);
        resultado = f ? f.executar(estado, bloco.input || {}) : { erro: `Ferramenta desconhecida: ${bloco.name}` };
        if (resultado?.desfazer) desfazer.push(resultado.desfazer);
      } catch (erro) {
        resultado = { erro: String(erro.message || erro) };
      }
      resultados.push({
        type: 'tool_result',
        tool_use_id: bloco.id,
        content: JSON.stringify(resultado),
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
