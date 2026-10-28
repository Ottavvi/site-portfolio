// Agente local: entende perguntas em português sobre o dinheiro e responde com os números do extrato.
// Funciona sem internet e sem chave de API. Ele reconhece a intenção (quanto gastei, posso gastar, previsão...),
// o período, a categoria e valores citados, chama as mesmas ferramentas do modo Claude e monta a resposta.
import * as A from './analise.js';
import { ferramenta, acharCategoria } from './ferramentas.js';
import { linhaPrevisao } from './graficos.js';
import {
  dataCurta,
  dataLonga,
  dinheiro,
  hojeISO,
  html,
  indiceDoMes,
  mesAnterior,
  mesDe,
  mesPorExtenso,
  normalizar,
  somar,
  somarDias,
  somarMeses
} from './util.js';

// ---------- Peças de resposta ----------
// Recibo: o jeito do agente mostrar números, como uma notinha de caixa
export function recibo({ titulo, linhas = [], total, nota }) {
  return `<div class="recibo">
    ${titulo ? `<p class="recibo-titulo">${html(titulo)}</p>` : ''}
    <dl>${linhas
      .map(
        ([rotulo, valor, cor]) =>
          `<div><dt>${cor ? `<i style="background:${cor}"></i>` : ''}${html(rotulo)}</dt><dd>${typeof valor === 'number' ? dinheiro(valor) : html(valor)}</dd></div>`
      )
      .join('')}</dl>
    ${total ? `<div class="recibo-total"><span>${html(total[0])}</span><strong>${typeof total[1] === 'number' ? dinheiro(total[1]) : html(total[1])}</strong></div>` : ''}
    ${nota ? `<p class="recibo-nota">${html(nota)}</p>` : ''}
  </div>`;
}
const p = texto => `<p>${texto}</p>`;
const forte = valor => `<strong>${typeof valor === 'number' ? dinheiro(valor) : html(valor)}</strong>`;
const nomeCat = (estado, idCat) => estado.categorias.find(c => c.id === idCat)?.nome || idCat;
const corCat = (estado, idCat) => estado.categorias.find(c => c.id === idCat)?.cor;

// ---------- Entendendo a pergunta ----------
const SINONIMOS = {
  mercado: ['mercado', 'supermercado', 'feira', 'hortifruti', 'atacarejo'],
  alimentacao: ['comer fora', 'restaurante', 'delivery', 'ifood', 'lanche', 'comida', 'padaria', 'pizza', 'cafe'],
  transporte: ['transporte', 'uber', 'corrida', 'gasolina', 'combustivel', 'posto', 'carro', 'onibus'],
  contas: [
    'luz',
    'energia',
    'agua',
    'internet',
    'conta de celular',
    'plano de celular',
    'contas da casa',
    'conta de luz'
  ],
  moradia: ['aluguel', 'condominio', 'moradia'],
  saude: ['saude', 'farmacia', 'remedio', 'academia', 'medico'],
  assinaturas: ['assinatura', 'assinaturas', 'streaming'],
  lazer: ['lazer', 'cinema', 'show', 'passeio', 'diversao', 'viagem'],
  compras: ['compras', 'roupa', 'roupas', 'loja', 'eletronico', 'eletronicos'],
  educacao: ['curso', 'cursos', 'educacao', 'estudo', 'livro'],
  impostos: ['imposto', 'impostos', 'das', 'tarifa', 'tarifas', 'banco'],
  salario: ['salario'],
  freelas: ['freela', 'freelas', 'clientes', 'cliente', 'trabalhos']
};

export function extrairCategoria(estado, t) {
  for (const c of estado.categorias) {
    if (t.includes(normalizar(c.nome))) return c;
  }
  for (const [idCat, palavras] of Object.entries(SINONIMOS)) {
    if (palavras.some(palavra => new RegExp(`\\b${palavra}\\b`).test(t)))
      return estado.categorias.find(c => c.id === idCat) || null;
  }
  return null;
}

export function extrairValor(t) {
  const m =
    t.match(/r\$\s*([\d.]+(?:,\d{1,2})?)\s*(mil)?/) ||
    t.match(/([\d.]+(?:,\d{1,2})?)\s*(mil)?\s*(reais|conto|pila)/) ||
    t.match(/\b(\d+(?:[.,]\d+)?)\s*(mil)\b/) ||
    t.match(/(?:gastar|comprar|pagar|de|por|para|pra)\s+([\d.]+(?:,\d{1,2})?)\b/);
  if (!m) return null;
  let valor = Number(m[1].replace(/\./g, '').replace(',', '.'));
  if (m[2] === 'mil') valor *= 1000;
  return valor > 0 ? valor : null;
}

// Devolve { mes } ou { de, ate, rotulo }; null se a pergunta não fala de período
export function extrairPeriodo(t) {
  const hoje = hojeISO();
  const atual = mesDe(hoje);
  if (/\b(hoje)\b/.test(t)) return { de: hoje, ate: hoje, rotulo: 'hoje' };
  if (/\bontem\b/.test(t))
    return {
      de: somarDias(hoje, -1),
      ate: somarDias(hoje, -1),
      rotulo: 'ontem'
    };
  if (/(essa|esta|nesta|nessa) semana/.test(t))
    return { de: somarDias(hoje, -6), ate: hoje, rotulo: 'nos últimos 7 dias' };
  if (/semana passada/.test(t))
    return {
      de: somarDias(hoje, -13),
      ate: somarDias(hoje, -7),
      rotulo: 'na semana passada'
    };
  if (/(mes passado|ultimo mes|mes anterior)/.test(t)) return { mes: mesAnterior(atual) };
  if (/(este|esse|neste|nesse|deste|desse) mes|mes atual|no mes\b/.test(t)) return { mes: atual };
  let m = t.match(/ultimos?\s+(\d+|dois|tres|quatro|seis|doze)\s+mes/);
  if (m) {
    const n = { dois: 2, tres: 3, quatro: 4, seis: 6, doze: 12 }[m[1]] || Number(m[1]);
    return {
      de: `${mesAnterior(atual, n - 1)}-01`,
      ate: hoje,
      rotulo: `nos últimos ${n} meses`
    };
  }
  if (/(este|esse|neste|nesse) ano/.test(t))
    return {
      de: `${hoje.slice(0, 4)}-01-01`,
      ate: hoje,
      rotulo: `em ${hoje.slice(0, 4)}`
    };
  m = t.match(
    /\b(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b(?:\s+de)?\s*(\d{4})?/
  );
  if (m) {
    const indice = indiceDoMes(m[1]);
    let ano = m[2] ? Number(m[2]) : Number(hoje.slice(0, 4));
    const mes = `${ano}-${String(indice + 1).padStart(2, '0')}`;
    if (!m[2] && mes > atual) ano -= 1;
    return { mes: `${ano}-${String(indice + 1).padStart(2, '0')}` };
  }
  m = t.match(/\b(?:em|de)\s+(20\d{2})\b/);
  if (m) return { de: `${m[1]}-01-01`, ate: `${m[1]}-12-31`, rotulo: `em ${m[1]}` };
  return null;
}
const rotuloPeriodo = periodo => (periodo.mes ? `em ${mesPorExtenso(periodo.mes)}` : periodo.rotulo);

// Palavra que parece nome de estabelecimento ("quanto gastei no mercadinho são jorge")
function extrairBusca(estado, t) {
  const m = t.match(/\b(?:com|no|na|em|do|da)\s+(?:o |a )?([a-z0-9][a-z0-9 ]{2,30})/);
  if (!m) return null;
  const palavras = m[1]
    .split(' ')
    .filter(w => w.length > 2 && !['mes', 'ano', 'passado', 'esse', 'este', 'ultimos', 'semana'].includes(w));
  for (let n = Math.min(palavras.length, 3); n >= 1; n--) {
    const termo = palavras.slice(0, n).join(' ');
    if (estado.transacoes.some(tr => normalizar(tr.descricao).includes(termo))) return termo;
  }
  return null;
}

// ---------- Respostas ----------
function respostaQuantoGastei(estado, t, periodo) {
  const categoria = extrairCategoria(estado, t);
  const busca = categoria ? null : extrairBusca(estado, t);
  const per = periodo || { mes: A.mesAtual() };
  const r = ferramenta('buscar_transacoes').executar(estado, {
    ...per,
    categoria: categoria?.nome,
    busca,
    tipo: categoria?.tipo === 'entrada' ? 'entrada' : 'saida',
    ordenar_por_valor: true
  });
  const alvo = categoria ? categoria.nome.toLowerCase() : busca ? `"${busca}"` : 'tudo';
  if (!r.quantidade) return p(`Não achei gastos com ${html(alvo)} ${html(rotuloPeriodo(per))}.`);
  const total = Math.abs(r.total);
  let comparacao = '';
  if (per.mes && categoria) {
    const anteriores = [1, 2, 3].map(n => mesAnterior(per.mes, n));
    const mediaAnt =
      anteriores.reduce(
        (s, m) =>
          s +
          Math.abs(
            ferramenta('buscar_transacoes').executar(estado, {
              mes: m,
              categoria: categoria.nome,
              tipo: 'saida'
            }).total
          ),
        0
      ) / 3;
    if (mediaAnt > 0) {
      const dif = total / mediaAnt - 1;
      comparacao =
        Math.abs(dif) < 0.08
          ? ' Está na média dos 3 meses anteriores.'
          : ` Isso é ${Math.round(Math.abs(dif) * 100)}% ${dif > 0 ? 'acima' : 'abaixo'} da média dos 3 meses anteriores (${dinheiro(mediaAnt)}).`;
    }
  }
  const linhas = r.transacoes
    .slice(0, 6)
    .map(tr => [`${dataCurta(tr.data)}  ${A.nomeBonito(tr.descricao)}`, Math.abs(tr.valor)]);
  return (
    p(
      `Você gastou ${forte(total)} com ${html(alvo)} ${html(rotuloPeriodo(per))}, em ${r.quantidade} ${r.quantidade === 1 ? 'lançamento' : 'lançamentos'}.${comparacao}`
    ) +
    recibo({
      titulo: r.quantidade > 6 ? 'Os maiores' : 'Lançamentos',
      linhas,
      total: ['Total', total],
      nota: r.quantidade > 6 ? `Mais ${r.quantidade - 6} na tela de transações.` : ''
    })
  );
}

function respostaEntradas(estado, periodo) {
  const per = periodo || { mes: A.mesAtual() };
  const r = ferramenta('buscar_transacoes').executar(estado, {
    ...per,
    tipo: 'entrada'
  });
  if (!r.quantidade) return p(`Não achei entradas ${html(rotuloPeriodo(per))}.`);
  const porCat = {};
  for (const tr of A.filtrar(estado, { ...per, tipo: 'entrada' }))
    porCat[tr.categoria] = (porCat[tr.categoria] || 0) + tr.valor;
  return (
    p(`Entraram ${forte(r.total)} ${html(rotuloPeriodo(per))}.`) +
    recibo({
      linhas: Object.entries(porCat)
        .sort((a, b) => b[1] - a[1])
        .map(([c, v]) => [nomeCat(estado, c), v, corCat(estado, c)]),
      total: ['Total', r.total]
    })
  );
}

function respostaResumo(estado, periodo) {
  const mes = periodo?.mes || A.mesAtual();
  const r = ferramenta('resumo_do_mes').executar(estado, { mes });
  const corrente = mes === A.mesAtual();
  const frase =
    r.resultado >= 0
      ? `${corrente ? 'Até agora, ' : ''}${mesPorExtenso(mes)} ${corrente ? 'está' : 'fechou'} no azul: entraram ${forte(r.entradas)} e saíram ${forte(r.saidas)}, sobra de ${forte(r.resultado)}.`
      : `${corrente ? 'Até agora, ' : ''}${mesPorExtenso(mes)} ${corrente ? 'está' : 'fechou'} no vermelho: saíram ${forte(r.saidas)} e entraram ${forte(r.entradas)}, ${forte(-r.resultado)} a mais do que entrou.`;
  const top = r.gastos_por_categoria
    .slice(0, 6)
    .map(l => [l.categoria, l.total, estado.categorias.find(c => c.nome === l.categoria)?.cor]);
  const alertas = corrente
    ? A.alertas(estado, mes)
        .filter(a => a.nivel !== 'bom')
        .slice(0, 3)
    : [];
  return (
    p(frase.charAt(0).toUpperCase() + frase.slice(1)) +
    recibo({
      titulo: 'Para onde foi',
      linhas: top,
      total: ['Gastos do mês', r.saidas],
      nota:
        r.guardado_em_aplicacao > 0 ? `Além disso, ${dinheiro(r.guardado_em_aplicacao)} foram para a aplicação.` : ''
    }) +
    (alertas.length
      ? `<ul class="resposta-alertas">${alertas.map(a => `<li class="nivel-${a.nivel}"><strong>${html(a.titulo)}.</strong> ${html(a.detalhe)}</li>`).join('')}</ul>`
      : '')
  );
}

function respostaSaldo(estado) {
  const prev = ferramenta('previsao_de_saldo').executar(estado, { dias: 40 });
  const fim = prev.saldo_no_fim_de_cada_mes[0];
  return (
    p(`Seu saldo hoje é ${forte(prev.saldo_hoje)}.`) +
    p(
      `Se o mês seguir o ritmo de sempre, ${dataLonga(fim.data).replace(/ de \d{4}$/, '')} fecha com cerca de ${forte(fim.saldo)}. O ponto mais baixo deve ser ${forte(prev.menor_saldo)}, em ${dataCurta(prev.data_do_menor_saldo)}.`
    )
  );
}

function respostaPrevisao(estado, t) {
  const conservador = /(sem (freela|cliente|extra)|pior caso|conservador|pessimista)/.test(t);
  const dias = /(tres|3) meses|90 dias/.test(t) ? 90 : /(dois|2) meses|60 dias/.test(t) ? 60 : 45;
  const prev = ferramenta('previsao_de_saldo').executar(estado, {
    dias,
    conservador
  });
  const serie = A.previsao(estado, dias, {
    comEntradasVariaveis: !conservador
  });
  const negativo = prev.menor_saldo < 0;
  return (
    p(
      negativo
        ? `Atenção: nos próximos ${dias} dias o saldo pode chegar a ${forte(prev.menor_saldo)} em ${dataCurta(prev.data_do_menor_saldo)}. Dá tempo de ajustar: adie compras grandes ou reduza os gastos variáveis.`
        : `Nos próximos ${dias} dias a conta não fica negativa. O menor saldo previsto é ${forte(prev.menor_saldo)}, em ${dataCurta(prev.data_do_menor_saldo)}, e o saldo termina o período perto de ${forte(prev.saldo_final)}.`
    ) +
    `<div class="resposta-grafico">${linhaPrevisao(serie.serie, { altura: 180, menor: serie.menor })}</div>` +
    recibo({
      titulo: conservador ? 'Cenário sem entradas extras' : 'Como calculei',
      linhas: [
        ['Saldo hoje', prev.saldo_hoje],
        ['Gastos variáveis por mês (média)', -prev.gasto_variavel_por_mes],
        ['Entradas de clientes por mês', conservador ? 'não contei' : prev.entrada_variavel_por_mes_considerada],
        ...prev.saldo_no_fim_de_cada_mes.map(f => [`Fim de ${mesPorExtenso(mesDe(f.data)).split(' ')[0]}`, f.saldo])
      ],
      nota: 'As contas fixas entram no dia em que costumam cair.'
    })
  );
}

function respostaPossoGastar(estado, t) {
  const valor = extrairValor(t);
  if (!valor) return p('Quanto você quer gastar? Por exemplo: "posso gastar R$ 600 em roupa?"');
  const categoria = extrairCategoria(estado, t);
  const r = ferramenta('posso_gastar').executar(estado, {
    valor,
    categoria: categoria?.nome
  });
  const abertura = {
    sim: 'Pode, sim.',
    cuidado: 'Pode, mas com cuidado.',
    nao: 'Agora não é uma boa ideia.'
  }[r.resposta];
  const motivos = [];
  motivos.push(
    r.menor_saldo_depois_do_gasto < 0
      ? `Com esse gasto o saldo ficaria em ${forte(r.menor_saldo_depois_do_gasto)} perto de ${dataCurta(r.data_do_menor_saldo)}.`
      : `Mesmo com esse gasto, o menor saldo previsto nas próximas semanas fica em ${forte(r.menor_saldo_depois_do_gasto)} (${dataCurta(r.data_do_menor_saldo)}).`
  );
  if (r.folga_no_orcamento_da_categoria != null) {
    motivos.push(
      r.folga_no_orcamento_da_categoria >= valor
        ? `Cabe no orçamento de ${html(r.categoria.toLowerCase())}: ainda sobram ${forte(r.folga_no_orcamento_da_categoria)} este mês.`
        : r.folga_no_orcamento_da_categoria > 0
          ? `Mas passa do orçamento de ${html(r.categoria.toLowerCase())}, que só tem ${forte(r.folga_no_orcamento_da_categoria)} de folga este mês.`
          : `Mas o orçamento de ${html(r.categoria.toLowerCase())} deste mês já acabou.`
    );
  }
  const metas = A.metas(estado).filter(m => !m.cabe);
  if (r.resposta !== 'nao' && metas.length)
    motivos.push(
      `Lembre que a meta "${html(metas[0].nome)}" já está apertada: precisa de ${forte(metas[0].porMes)} por mês.`
    );
  return p(`<strong>${abertura}</strong> ${motivos.join(' ')}`);
}

function respostaRecorrentes(estado, t) {
  const lista = ferramenta('contas_recorrentes')
    .executar(estado)
    .filter(r => r.tipo === 'gasto');
  const soAssinaturas = /assinatura|streaming/.test(t);
  const itens = soAssinaturas ? lista.filter(r => r.categoria === 'Assinaturas') : lista;
  if (!itens.length)
    return p('Ainda não achei gastos que se repetem todo mês. Preciso de pelo menos dois ou três meses de extrato.');
  const total = somar(itens, r => r.valor_medio);
  const novas = itens.filter(r => r.nova);
  return (
    p(
      `${soAssinaturas ? 'Suas assinaturas' : 'Suas contas fixas'} somam ${forte(total)} por mês, ${forte(total * 12)} por ano.` +
        (novas.length
          ? ` ${novas.length === 1 ? 'Uma delas é nova' : `${novas.length} são novas`}: ${novas.map(n => html(n.nome)).join(', ')}.`
          : '')
    ) +
    recibo({
      linhas: itens.map(r => [`${r.nome}${r.nova ? ' (nova)' : ''}  · dia ${r.dia_de_costume}`, r.valor_medio]),
      total: ['Por mês', total],
      nota: itens.some(r => r.valor_varia) ? 'Contas de valor variável (luz, água) entram pela média.' : ''
    })
  );
}

function respostaOrcamentos(estado, t) {
  // "muda o orçamento de mercado para 700"
  const valor = extrairValor(t);
  const categoria = extrairCategoria(estado, t);
  if (
    /(muda|mude|coloca|coloque|define|defina|ajusta|ajuste|aumenta|aumente|diminui|diminua|reduz)/.test(t) &&
    valor &&
    categoria
  ) {
    const r = ferramenta('definir_orcamento').executar(estado, {
      categoria: categoria.nome,
      valor
    });
    if (r.erro) return p(html(r.erro));
    return (
      p(
        `Pronto: o orçamento de ${html(r.categoria.toLowerCase())} passou de ${forte(r.anterior)} para ${forte(r.novo)} por mês.`
      ) +
      `<button type="button" class="btn-texto" data-desfazer='${html(JSON.stringify(r.desfazer))}'>Desfazer</button>`
    );
  }
  const lista = ferramenta('orcamentos').executar(estado, {});
  const estourados = lista.filter(o => o.situacao === 'estourou');
  const risco = lista.filter(o => o.situacao === 'risco');
  const frase = estourados.length
    ? `${estourados.length === 1 ? 'Um orçamento já passou' : `${estourados.length} orçamentos já passaram`} do limite este mês: ${estourados.map(o => html(o.categoria.toLowerCase())).join(', ')}.`
    : 'Nenhum orçamento passou do limite este mês.';
  return (
    p(
      frase +
        (risco.length
          ? ` E ${risco.map(o => html(o.categoria.toLowerCase())).join(', ')} ${risco.length === 1 ? 'deve passar' : 'devem passar'} até o fim do mês.`
          : '')
    ) +
    recibo({
      linhas: lista.map(o => [
        `${o.categoria}  ${Math.round((o.gasto / o.limite) * 100)}%${o.situacao === 'estourou' ? ' ⚠' : ''}`,
        `${dinheiro(o.gasto)} de ${dinheiro(o.limite)}`
      ]),
      nota: 'Para mudar um limite, peça por exemplo: "muda o orçamento de mercado para 700".'
    })
  );
}

function respostaMetas(estado) {
  const r = ferramenta('metas').executar(estado);
  if (!r.metas.length)
    return p('Você ainda não tem metas. Crie uma na tela de metas, por exemplo uma reserva de emergência.');
  return (
    p(`Nos últimos 6 meses sobraram, em média, ${forte(r.sobra_media_por_mes)} por mês.`) +
    r.metas
      .map(m =>
        recibo({
          titulo: m.nome,
          linhas: [
            ['Alvo', m.alvo],
            ['Já guardado', m.guardado],
            ['Prazo', dataCurta(m.prazo) + '/' + m.prazo.slice(0, 4)],
            ['Precisa guardar por mês', m.precisa_por_mes]
          ],
          nota: m.cabe_na_sobra_media
            ? 'Cabe na sua sobra média.'
            : 'Não cabe na sobra média: alongue o prazo ou corte algum gasto.'
        })
      )
      .join('')
  );
}

function respostaMaiores(estado, periodo) {
  const per = periodo || { mes: A.mesAtual() };
  const r = ferramenta('buscar_transacoes').executar(estado, {
    ...per,
    tipo: 'saida',
    ordenar_por_valor: true
  });
  if (!r.quantidade) return p(`Não achei gastos ${html(rotuloPeriodo(per))}.`);
  return (
    p(`Os maiores gastos ${html(rotuloPeriodo(per))}:`) +
    recibo({
      linhas: r.transacoes
        .slice(0, 8)
        .map(tr => [`${dataCurta(tr.data)}  ${A.nomeBonito(tr.descricao)}`, Math.abs(tr.valor)])
    })
  );
}

function respostaComparar(estado, t) {
  const meses = [
    ...t.matchAll(/\b(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b/g)
  ].map(m => extrairPeriodo(m[1]).mes);
  const [b, a] = meses.length >= 2 ? [meses[1], meses[0]] : [A.mesAtual(), mesAnterior(A.mesAtual())];
  const ra = A.resumoDoMes(estado, a);
  const rb = A.resumoDoMes(estado, b);
  const linhas = estado.categorias
    .filter(c => c.tipo === 'saida')
    .map(c => {
      const va = ra.porCategoria.find(l => l.categoria.id === c.id)?.total || 0;
      const vb = rb.porCategoria.find(l => l.categoria.id === c.id)?.total || 0;
      return { c, va, vb, dif: vb - va };
    })
    .filter(l => l.va || l.vb)
    .sort((x, y) => Math.abs(y.dif) - Math.abs(x.dif));
  const mais = linhas.filter(l => l.dif > 0).slice(0, 2);
  return (
    p(
      `Em ${mesPorExtenso(b)} os gastos foram ${forte(rb.saidas)}, contra ${forte(ra.saidas)} em ${mesPorExtenso(a)} (${rb.saidas >= ra.saidas ? '+' : '−'}${dinheiro(Math.abs(rb.saidas - ra.saidas))}).` +
        (mais.length
          ? ` O que mais subiu: ${mais.map(l => `${html(l.c.nome.toLowerCase())} (+${dinheiro(l.dif)})`).join(' e ')}.`
          : '')
    ) +
    recibo({
      titulo: `${mesPorExtenso(a).split(' ')[0]} → ${mesPorExtenso(b).split(' ')[0]}`,
      linhas: linhas.slice(0, 8).map(l => [l.c.nome, `${dinheiro(l.va)} → ${dinheiro(l.vb)}`, l.c.cor])
    })
  );
}

function respostaDicas(estado) {
  const mes = A.mesAtual();
  const r = A.resumoDoMes(estado, mes);
  const sugestoes = [];
  const novas = A.recorrentes(estado).filter(x => x.nova && !x.entrada);
  for (const n of novas)
    sugestoes.push(
      `Rever <strong>${html(n.nome)}</strong>, que começou há pouco: ${dinheiro(n.valorMedio)} por mês, ${dinheiro(n.porAno)} por ano.`
    );
  for (const l of r.porCategoria) {
    if (l.mediaAnterior > 50 && l.total > l.mediaAnterior * 1.15 && l.categoria.id !== 'moradia') {
      sugestoes.push(
        `Voltar <strong>${html(l.categoria.nome.toLowerCase())}</strong> para a média de ${dinheiro(l.mediaAnterior)} economiza ${dinheiro(l.total - l.mediaAnterior)} neste mês.`
      );
    }
  }
  const comerFora = r.porCategoria.find(l => l.categoria.id === 'alimentacao');
  if (comerFora && comerFora.quantidade >= 6) {
    sugestoes.push(
      `Foram ${comerFora.quantidade} pedidos e refeições fora este mês. Trocar dois por semana por comida de casa deve poupar perto de ${dinheiro((comerFora.total / comerFora.quantidade) * 8 * 0.6)} por mês.`
    );
  }
  const assin = A.recorrentes(estado).filter(x => x.categoria === 'assinaturas');
  if (assin.length >= 3)
    sugestoes.push(
      `Você tem ${assin.length} assinaturas que somam ${dinheiro(somar(assin, x => x.valorMedio))} por mês. Vale revezar: assinar uma por vez.`
    );
  if (!sugestoes.length)
    return p(
      'Seus gastos deste mês estão dentro do padrão dos meses anteriores. Se quiser guardar mais, defina uma meta e eu calculo quanto separar por mês.'
    );
  return (
    p('Onde dá para economizar, pelos seus números:') +
    `<ul class="resposta-lista">${sugestoes
      .slice(0, 5)
      .map(s => `<li>${s}</li>`)
      .join('')}</ul>`
  );
}

export const EXEMPLOS = [
  'Como está meu mês?',
  'Quanto gastei com mercado em setembro?',
  'Posso gastar R$ 600 em roupa?',
  'Vai sobrar dinheiro no fim do mês?',
  'Quais são minhas assinaturas?',
  'Onde posso economizar?',
  'Compara este mês com o mês passado',
  'Quais foram os maiores gastos do mês?',
  'Como estão minhas metas?',
  'Muda o orçamento de mercado para 750'
];

function respostaAjuda() {
  return (
    p('Eu leio o seu extrato e respondo com os números. Experimente perguntar:') +
    `<ul class="resposta-lista">${EXEMPLOS.map(e => `<li><button type="button" class="btn-texto" data-pergunta="${html(e)}">${html(e)}</button></li>`).join('')}</ul>`
  );
}

// ---------- Ponto de entrada ----------
export function responder(estado, pergunta) {
  const t = ` ${normalizar(pergunta).replace(/[?!.]/g, ' ')} `.replace(/\s+/g, ' ');
  if (!estado.transacoes.length)
    return p(
      'Ainda não tenho nenhum extrato. Importe um arquivo CSV ou OFX do seu banco na tela Importar, ou carregue os dados de exemplo.'
    );
  const periodo = extrairPeriodo(t);

  if (/(posso|da pra|da para|consigo|cabe)\s+(gastar|comprar|pagar|torrar)|posso (fazer|comprar)/.test(t))
    return respostaPossoGastar(estado, t);
  if (/orcamento|limite/.test(t)) return respostaOrcamentos(estado, t);
  if (/assinatura|recorrent|todo mes|contas fixas|gastos fixos|mensalidade|streaming/.test(t))
    return respostaRecorrentes(estado, t);
  if (/meta|objetivo|reserva|juntar|poupar para/.test(t)) return respostaMetas(estado);
  if (
    /(previs|vai sobrar|sobrar no fim|fim do mes|proximos (dias|meses)|vai faltar|ficar negativ|no vermelho|aguentar)/.test(
      t
    )
  )
    return respostaPrevisao(estado, t);
  if (/compar|diferenca entre|versus| vs /.test(t)) return respostaComparar(estado, t);
  if (/econom|cortar|reduzir|dica|onde (estou )?gast(o|ando) (muito|demais)/.test(t)) return respostaDicas(estado);
  if (/maior(es)? (gasto|compra|despesa)|mais car|onde mais gastei|gastei mais/.test(t))
    return respostaMaiores(estado, periodo);
  if (/(quanto|qto) (recebi|entrou|ganhei|faturei)|entradas|minha renda|quanto ganhei/.test(t))
    return respostaEntradas(estado, periodo);
  if (/saldo|quanto (eu )?tenho|tenho na conta/.test(t)) return respostaSaldo(estado);
  if (/quanto|gastei|gasto|paguei|despesa/.test(t)) {
    if (extrairCategoria(estado, t) || extrairBusca(estado, t)) return respostaQuantoGastei(estado, t, periodo);
    return respostaResumo(estado, periodo);
  }
  if (/resumo|como (esta|estou|to|anda|foi|ficou)|situacao|panorama|balanco/.test(t))
    return respostaResumo(estado, periodo);
  if (extrairCategoria(estado, t) && periodo) return respostaQuantoGastei(estado, t, periodo);
  return respostaAjuda();
}
