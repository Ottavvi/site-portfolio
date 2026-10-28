// Agente contábil local: entende perguntas em português sobre a contabilidade da empresa e responde com os números
// do livro. Sem internet e sem chave. Usa as mesmas ferramentas do modo Claude.
import * as C from './contabil.js';
import { acharConta, ferramenta } from './ferramentas.js';
import { OPERACOES } from './plano.js';
import {
  dataCurta,
  dinheiro,
  hojeISO,
  html,
  indiceDoMes,
  mesAnterior,
  mesDe,
  mesPorExtenso,
  normalizar
} from './util.js';

const p = texto => `<p>${texto}</p>`;
const forte = v => `<strong>${typeof v === 'number' ? dinheiro(v) : html(v)}</strong>`;
const pctTexto = v => `${String(Math.round(v * 100) / 100).replace('.', ',')}%`;
const nomeMes = mes => mesPorExtenso(mes);

// ---------- Peças visuais ----------
// Mini livro: linhas com valor alinhado à direita, totais com traço duplo
export function livroMini({ titulo, linhas, nota }) {
  return `<div class="livro-mini">
    ${titulo ? `<p class="livro-mini-titulo">${html(titulo)}</p>` : ''}
    <table>${linhas
      .map(
        ([rotulo, valor, tipo]) =>
          `<tr class="${tipo || ''}"><th scope="row">${html(rotulo)}</th><td>${typeof valor === 'number' ? dinheiro(valor) : html(valor ?? '')}</td></tr>`
      )
      .join('')}</table>
    ${nota ? `<p class="livro-mini-nota">${html(nota)}</p>` : ''}
  </div>`;
}

// Razonete (conta em T): débitos à esquerda, créditos à direita
export function razonete(nome, debitos = [], creditos = []) {
  const coluna = itens => itens.map(v => `<span>${typeof v === 'number' ? dinheiro(v) : html(v)}</span>`).join('');
  return `<div class="razonete"><p class="razonete-nome">${html(nome)}</p><div class="razonete-corpo"><div class="razonete-d">${coluna(debitos)}</div><div class="razonete-c">${coluna(creditos)}</div></div></div>`;
}

// ---------- Entendendo a pergunta ----------
function extrairPeriodo(t) {
  const hoje = hojeISO();
  const atual = mesDe(hoje);
  if (/(mes passado|ultimo mes|mes anterior)/.test(t)) return { mes: mesAnterior(atual) };
  if (/(este|esse|neste|nesse|deste|desse) mes|mes atual/.test(t)) return { mes: atual };
  if (/(este|esse|neste|nesse|deste|desse) ano|no ano|ano todo/.test(t)) return { ano: Number(hoje.slice(0, 4)) };
  if (/ano passado/.test(t)) return { ano: Number(hoje.slice(0, 4)) - 1 };
  let m = t.match(
    /\b(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b(?:\s+de)?\s*(\d{4})?/
  );
  if (m) {
    let ano = m[2] ? Number(m[2]) : Number(hoje.slice(0, 4));
    const mes = `${ano}-${String(indiceDoMes(m[1]) + 1).padStart(2, '0')}`;
    if (!m[2] && mes > atual) ano -= 1;
    return { mes: `${ano}-${String(indiceDoMes(m[1]) + 1).padStart(2, '0')}` };
  }
  m = t.match(/\b(?:em|de)\s+(20\d{2})\b/);
  if (m) return { ano: Number(m[1]) };
  return null;
}
function extrairValor(t) {
  const m =
    t.match(/r\$\s*([\d.]+(?:,\d{1,2})?)\s*(mil)?/) ||
    t.match(/([\d.]+(?:,\d{1,2})?)\s*(mil)?\s*(reais|por mes|mensais)/) ||
    t.match(/\b(\d+(?:[.,]\d+)?)\s*(mil)\b/) ||
    t.match(/(?:faturar|faturamento de|receita de)\s+([\d.]+(?:,\d{1,2})?)/);
  if (!m) return null;
  let v = Number(m[1].replace(/\./g, '').replace(',', '.'));
  if (m[2] === 'mil') v *= 1000;
  return v > 0 ? v : null;
}
const rotuloPeriodo = per => (per.mes ? `em ${nomeMes(per.mes)}` : `em ${per.ano}`);

// ---------- Respostas ----------
function respostaComoLancar(estado, t) {
  const achadas = OPERACOES.filter(o => o.palavras.some(palavra => t.includes(palavra)));
  if (!achadas.length) {
    return (
      p('Posso mostrar o lançamento (débito e crédito) destas operações:') +
      `<ul class="resposta-lista">${OPERACOES.map(o => `<li><button type="button" class="btn-texto" data-pergunta="Como lançar: ${html(o.nome.toLowerCase())}?">${html(o.nome)}</button></li>`).join('')}</ul>`
    );
  }
  const op = achadas[0];
  const valor = extrairValor(t) || 1000;
  const conta = id => estado.plano.find(c => c.id === id);
  const [deb, cred] = [op.partidas.find(x => x[0] === 'D')[1], op.partidas.find(x => x[0] === 'C')[1]];
  return (
    p(`<strong>${html(op.nome)}</strong>. ${html(op.explicacao)}`) +
    `<div class="razonetes">${razonete(`${conta(deb).codigo} ${conta(deb).nome}`, [valor], [])}${razonete(`${conta(cred).codigo} ${conta(cred).nome}`, [], [valor])}</div>` +
    livroMini({
      titulo: 'No livro diário',
      linhas: [
        [`D  ${conta(deb).codigo} ${conta(deb).nome}`, valor],
        [`C  ${conta(cred).codigo} ${conta(cred).nome}`, valor]
      ],
      nota: 'Todo lançamento tem débitos e créditos iguais: é isso que faz o balancete fechar.'
    })
  );
}

function respostaApuracao(estado, t, periodo) {
  // "Quanto vou pagar" fala do próximo DAS (o do mês em aberto); sem isso, o último mês fechado
  const futuro = /vou pagar|proximo|vai ser|vai ficar|a pagar|deste mes|desse mes/.test(t);
  const mes = periodo?.mes || (futuro ? C.mesAtual() : mesAnterior(C.mesAtual()));
  const a = ferramenta('apuracao_simples').executar(estado, { mes });
  if (a.regime === 'MEI')
    return p(
      `Como MEI, o DAS de ${nomeMes(mes)} é fixo: ${forte(a.das_mei)}, com vencimento no dia 20 do mês seguinte.`
    );
  const corrente = mes === C.mesAtual();
  let texto = `${corrente ? 'Se o mês fechasse hoje, o' : 'O'} DAS de ${nomeMes(mes)} ${corrente ? 'seria' : 'ficou em'} ${forte(a.das)}, vencendo em ${dataCurta(a.vencimento)}. Alíquota efetiva de ${pctTexto(a.aliquota_efetiva_pct)} no Anexo ${a.anexo}, ${a.faixa}ª faixa.`;
  if (a.se_fosse_no_outro_anexo && a.anexo === 'V') {
    texto += ` <strong>Atenção:</strong> o Fator R ficou em ${pctTexto(a.fator_r_pct)}, abaixo de 28%. No Anexo III seriam ${forte(a.se_fosse_no_outro_anexo.das)}.`;
  }
  return (
    p(texto) +
    livroMini({
      titulo: `Apuração de ${nomeMes(mes)}`,
      linhas: [
        ['Receita do mês', a.receita_do_mes],
        [
          `Receita dos 12 meses anteriores (RBT12)${a.rbt12_proporcional_inicio_de_atividade ? ', proporcional' : ''}`,
          a.rbt12
        ],
        ['Folha dos 12 meses', a.folha_12_meses],
        ['Fator R', pctTexto(a.fator_r_pct)],
        [`Alíquota nominal (Anexo ${a.anexo}, faixa ${a.faixa})`, pctTexto(a.aliquota_nominal_pct)],
        ['Parcela a deduzir', a.parcela_a_deduzir],
        ['Alíquota efetiva', pctTexto(a.aliquota_efetiva_pct)],
        ['DAS', a.das, 'total']
      ],
      nota: 'Alíquota efetiva = (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12.'
    })
  );
}

function respostaFatorR(estado) {
  const r = ferramenta('fator_r').executar(estado, { mes: C.mesAtual() });
  if (r.aviso) return p(html(r.aviso));
  if (r.anexo_atual === 'III') {
    return p(
      `O Fator R está em ${forte(pctTexto(r.fator_r_pct))}, acima dos 28%: o DAS sai pelo Anexo III, o mais barato para a sua atividade. A folha dos últimos 12 meses é ${forte(r.folha_12_meses)} para uma receita de ${forte(r.receita_12_meses)}. Se a receita crescer mais rápido que a folha, ele cai: vale acompanhar todo mês.`
    );
  }
  return (
    p(
      `O Fator R está em ${forte(pctTexto(r.fator_r_pct))}, abaixo de 28%, então o DAS deste mês sai pelo <strong>Anexo V</strong>: ${forte(r.das_no_anexo_atual)} em vez de ${forte(r.das_no_outro_anexo)} no Anexo III, uma diferença de ${forte(r.economia_de_das_no_mes)} só neste mês.`
    ) +
    p(
      `Para voltar aos 28%, a folha dos 12 meses precisa de mais ${forte(r.folha_que_falta_em_12_meses)}. Um jeito comum é subir o pró-labore em cerca de ${forte(r.aumento_mensal_de_pro_labore_por_12_meses)} por mês. O INSS de 11% sobre esse aumento custa perto de ${forte(r.custo_extra_inss_do_socio_por_mes)} por mês, bem menos que a diferença no DAS.`
    ) +
    p(`<em>${html(r.observacao)}</em>`)
  );
}

function respostaSimulacao(estado, t) {
  const receita = extrairValor(t);
  if (!receita)
    return p('Qual receita mensal você quer simular? Por exemplo: "simula o DAS com faturamento de R$ 60 mil".');
  const r = ferramenta('simular_das').executar(estado, { receita_mensal: receita });
  return p(
    `Faturando ${forte(receita)} num mês, com receita de 12 meses de ${forte(r.rbt12)} e Fator R de ${pctTexto(r.fator_r_pct)}, o DAS seria ${forte(r.das)} (${html(r.nome_do_anexo)}, alíquota efetiva de ${pctTexto(r.aliquota_efetiva_pct)}).`
  );
}

function respostaDRE(estado, periodo) {
  const per = periodo || { mes: mesAnterior(C.mesAtual()) };
  const d = ferramenta('dre').executar(estado, per);
  const valor = rotulo => d.linhas.find(l => l.linha.startsWith(rotulo))?.valor || 0;
  const lucro = valor('= Lucro líquido');
  const receita = valor('Receita bruta');
  return (
    p(
      `${rotuloPeriodo(per).replace(/^em/, 'Em')}, a empresa faturou ${forte(receita)} e ${lucro >= 0 ? `teve lucro de ${forte(lucro)}` : `teve prejuízo de ${forte(-lucro)}`}: margem líquida de ${pctTexto(d.margem_liquida_pct)}.`
    ) +
    livroMini({
      titulo: `DRE ${rotuloPeriodo(per)}`,
      linhas: d.linhas.map(l => [
        l.linha,
        l.valor,
        l.linha.startsWith('=') ? (l.linha.includes('Lucro líquido') ? 'total final' : 'total') : ''
      ]),
      nota: 'Regime de caixa nas receitas e despesas; o DAS entra por competência.'
    })
  );
}

function respostaBalanco(estado) {
  const b = ferramenta('balanco_patrimonial').executar(estado, {});
  return (
    p(
      `O balanço de hoje ${b.confere ? 'fecha' : 'não fecha'}: ativo de ${forte(b.total_ativo)} e passivo mais patrimônio líquido de ${forte(b.total_passivo_mais_pl)}.`
    ) +
    livroMini({
      titulo: 'Ativo',
      linhas: [...b.ativo.map(l => [l.item, l.valor]), ['Total do ativo', b.total_ativo, 'total']]
    }) +
    livroMini({
      titulo: 'Passivo e patrimônio líquido',
      linhas: [
        ...b.passivo.map(l => [l.item, l.valor]),
        ...b.patrimonio_liquido.map(l => [l.item, l.valor]),
        ['Total', b.total_passivo_mais_pl, 'total']
      ]
    })
  );
}

function respostaBalancete(estado) {
  const b = ferramenta('balancete').executar(estado, {});
  return p(
    `O balancete até hoje soma ${forte(b.total_debitos)} em débitos e ${forte(b.total_creditos)} em créditos: ${b.fechado ? 'os dois lados batem, como manda o método das partidas dobradas.' : 'há uma diferença, confira os lançamentos manuais.'} Veja todas as contas na tela Balancete.`
  );
}

function respostaRazao(estado, t) {
  const alvo = t.replace(/.*(razao|saldo|extrato)\s+(da|do|de)?\s*(conta)?\s*/, '').trim();
  const c = acharConta(estado, alvo) || acharConta(estado, t);
  if (!c) return p('De qual conta? Por exemplo: "razão do banco" ou "saldo da conta aluguel".');
  const r = ferramenta('razao').executar(estado, { conta: c.id });
  return (
    p(
      `A conta ${forte(r.conta)} tem saldo ${c.natureza === 'devedora' ? 'devedor' : 'credor'} de ${forte(r.saldo_final)}, em ${r.lancamentos} lançamentos.`
    ) +
    livroMini({
      titulo: 'Últimos lançamentos',
      linhas: r.ultimas
        .slice(-6)
        .map(l => [
          `${dataCurta(l.data)}  ${l.historico}`,
          l.debito ? `D ${dinheiro(l.debito)}` : `C ${dinheiro(l.credito)}`
        ])
    })
  );
}

function respostaObrigacoes(estado) {
  const lista = ferramenta('obrigacoes').executar(estado, { dias: 45 });
  if (!lista.length) return p('Nada vence nos próximos 45 dias.');
  return (
    p(`Nos próximos 45 dias:`) +
    livroMini({
      linhas: lista.map(o => [
        `${dataCurta(o.data)}  ${o.obrigacao}`,
        o.valor ?? (o.em_dias === 0 ? 'hoje' : `em ${o.em_dias} dias`)
      ]),
      nota: 'Datas ajustadas só para fins de semana. Confira feriados na agenda tributária.'
    })
  );
}

function respostaAClassificar(estado) {
  const lista = ferramenta('a_classificar').executar(estado);
  if (!lista.length) return p('Todos os movimentos do extrato já têm conta. Nada a classificar.');
  return (
    p(
      `${lista.length} ${lista.length === 1 ? 'movimento ficou' : 'movimentos ficaram'} sem conta. Escolha a conta na tela Lançamentos (o agente aprende para os próximos) ou me diga, por exemplo: "classifica JOAO CARLOS como serviços de terceiros".`
    ) + livroMini({ linhas: lista.slice(0, 8).map(m => [`${dataCurta(m.data)}  ${m.descricao}`, m.valor]) })
  );
}

function respostaReclassificar(estado, t, original) {
  const m = original.match(/classifi\w*\s+(.+?)\s+como\s+(.+?)[?.!]*$/i);
  if (!m) return p('Diga assim: "classifica JOAO CARLOS como serviços de terceiros".');
  const r = ferramenta('reclassificar').executar(estado, { descricao: m[1], conta: m[2] });
  if (r.erro) return p(html(r.erro));
  return (
    p(
      `Pronto: "${html(r.movimento)}" agora está em ${forte(r.nova_conta)}${r.movimentos_alterados > 1 ? `, junto com mais ${r.movimentos_alterados - 1} do mesmo lugar` : ''}. O agente vai usar essa conta nos próximos.`
    ) + `<button type="button" class="btn-texto" data-desfazer='${html(JSON.stringify(r.desfazer))}'>Desfazer</button>`
  );
}

function respostaGastos(estado, t, periodo) {
  const c = acharConta(estado, t.replace(/.*(com|de|em)\s+/, '')) || acharConta(estado, t);
  const per = periodo || { mes: mesAnterior(C.mesAtual()) };
  if (!c) {
    const d = C.dre(estado, per.mes ? C.periodoDoMes(per.mes) : C.periodoDoAno(per.ano));
    const despesas = d.linhas
      .filter(l => l.detalhe && l.valor < 0)
      .flatMap(l => l.detalhe)
      .sort((a, b) => b.valor - a.valor);
    return (
      p(`As maiores despesas ${rotuloPeriodo(per)}:`) +
      livroMini({ linhas: despesas.slice(0, 8).map(x => [`${x.conta.codigo} ${x.conta.nome}`, x.valor]) })
    );
  }
  const r = ferramenta('buscar_movimentos').executar(estado, { conta: c.id, ...(per.mes ? { mes: per.mes } : {}) });
  const lista = per.ano ? r.movimentos.filter(m => m.data.startsWith(String(per.ano))) : r.movimentos;
  const total = Math.abs(lista.reduce((s, m) => s + m.valor, 0));
  return (
    p(
      `${c.nome} ${rotuloPeriodo(per)}: ${forte(total)} em ${lista.length} ${lista.length === 1 ? 'movimento' : 'movimentos'}.`
    ) +
    (lista.length
      ? livroMini({ linhas: lista.slice(0, 6).map(m => [`${dataCurta(m.data)}  ${m.descricao}`, Math.abs(m.valor)]) })
      : '')
  );
}

function respostaEvolucao(estado) {
  const lista = ferramenta('evolucao_mensal').executar(estado, { meses: 6 });
  return (
    p('Os últimos 6 meses:') +
    livroMini({
      linhas: lista.map(m => [
        `${nomeMes(m.mes)}${m.fechado ? '' : ' (em aberto)'}`,
        `${dinheiro(m.receita)} · lucro ${dinheiro(m.lucro)}`
      ])
    })
  );
}

function respostaMei(estado) {
  const r = ferramenta('situacao_mei').executar(estado, {});
  return (
    p(
      `Em ${r.ano}, o faturamento soma ${forte(r.faturamento_no_ano)} (${pctTexto(r.uso_do_limite_pct)} do limite de ${forte(r.limite)}). No ritmo atual, fecha o ano em ${forte(r.projecao_ate_dezembro)}.`
    ) + p(html(r.regras))
  );
}

export const EXEMPLOS = [
  'Quanto vou pagar de DAS?',
  'Qual o meu Fator R?',
  'Qual foi o lucro do mês passado?',
  'Como lançar a compra de um computador?',
  'O que vence nos próximos dias?',
  'Mostra o balanço patrimonial',
  'Tem algo a classificar?',
  'Simula o DAS com faturamento de R$ 70 mil',
  'DRE deste ano',
  'Razão do banco'
];

function respostaAjuda() {
  return (
    p('Eu leio o extrato da empresa, faço os lançamentos e respondo com os números. Experimente:') +
    `<ul class="resposta-lista">${EXEMPLOS.map(e => `<li><button type="button" class="btn-texto" data-pergunta="${html(e)}">${html(e)}</button></li>`).join('')}</ul>`
  );
}

export function responder(estado, pergunta) {
  const t = ` ${normalizar(pergunta).replace(/[?!]/g, ' ')} `.replace(/\s+/g, ' ');
  if (!estado.movimentos.length)
    return p(
      'Ainda não há extrato da empresa. Importe um CSV ou OFX na tela Importar, ou carregue a empresa de exemplo nos ajustes.'
    );
  const periodo = extrairPeriodo(t);
  if (/classifi\w* .+ como /.test(t)) return respostaReclassificar(estado, t, pergunta);
  if (/(como (lanc|lanço|contabiliz|registr)|partida|debito e credito|lancamento d[aeo] )/.test(t))
    return respostaComoLancar(estado, t);
  if (/fator r|anexo (iii|v|3|5)\b|pro.?labore/.test(t)) return respostaFatorR(estado);
  if (/simul|se eu faturar| e se /.test(t)) return respostaSimulacao(estado, t);
  if (/\bmei\b|limite do mei|desenquadr/.test(t)) return respostaMei(estado);
  if (/vence|venciment|prazo|obrigac|calendario|agenda|declarac|defis|dasn/.test(t)) return respostaObrigacoes(estado);
  if (/\bdas\b|imposto|simples|aliquota|tribut/.test(t)) return respostaApuracao(estado, t, periodo);
  if (/a classificar|sem conta|nao classific|sem classific/.test(t)) return respostaAClassificar(estado);
  if (/balancete|bate|fecha(m)? os/.test(t)) return respostaBalancete(estado);
  if (/balanco|patrimon|ativo|passivo/.test(t)) return respostaBalanco(estado);
  if (/razao|saldo da conta|extrato da conta|saldo do banco|saldo em banco/.test(t)) return respostaRazao(estado, t);
  if (/\bdre\b|lucro|prejuizo|resultado|margem|faturou|faturamento/.test(t)) return respostaDRE(estado, periodo);
  if (/evolu|mes a mes|crescimento|ultimos meses/.test(t)) return respostaEvolucao(estado);
  if (/despesa|gast|paguei|custo/.test(t)) return respostaGastos(estado, t, periodo);
  return respostaAjuda();
}
