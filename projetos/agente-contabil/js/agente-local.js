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
  limparPergunta,
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
  if (/mes retrasado/.test(t)) return { mes: mesAnterior(atual, 2) };
  if (/(mes passado|ultimo mes|mes anterior)/.test(t)) return { mes: mesAnterior(atual) };
  if (/(este|esse|neste|nesse|deste|desse) mes|mes atual/.test(t)) return { mes: atual };
  // "ano passado" antes de "no ano", senão "no ano passado" viraria o ano atual
  if (/ano passado/.test(t)) return { ano: Number(hoje.slice(0, 4)) - 1 };
  if (/(este|esse|neste|nesse|deste|desse) ano|no ano|ano todo/.test(t)) return { ano: Number(hoje.slice(0, 4)) };
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
  // Sem conta citada, "qual o saldo?" e "quanto tenho?" falam do banco
  const c =
    acharConta(estado, alvo) ||
    acharConta(estado, t) ||
    (/saldo|quanto|caixa|dinheiro/.test(t) ? acharConta(estado, 'banco') : null);
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
  'Como está a empresa?',
  'Quanto vou pagar de DAS?',
  'Qual o meu Fator R?',
  'Qual foi o lucro do mês passado?',
  'Como lançar a compra de um computador?',
  'O que vence nos próximos dias?',
  'Mostra o balanço patrimonial',
  'Tem algo a classificar?',
  'Simula o DAS com faturamento de R$ 70 mil',
  'DRE deste ano',
  'Razão do banco',
  'Quem são meus maiores clientes?',
  'Compara outubro com setembro',
  'Quanto custa contratar alguém de R$ 4.000?',
  'Quanto posso distribuir de lucro?',
  'O que falta para fechar o mês?',
  'Qual o meu ponto de equilíbrio?',
  'O que é RBT12?'
];

function respostaAjuda(entendeu = true) {
  return (
    p(
      entendeu
        ? 'Eu leio o extrato da empresa, faço os lançamentos e respondo com os números. Experimente:'
        : 'Não entendi bem essa pergunta. Tente com outras palavras, ou escolha uma destas:'
    ) +
    `<ul class="resposta-lista">${EXEMPLOS.map(e => `<li><button type="button" class="btn-texto" data-pergunta="${html(e)}">${html(e)}</button></li>`).join('')}</ul>`
  );
}

// ---------- Gestão: panorama, comparações, clientes e decisões ----------
const sugestoes = lista =>
  `<div class="sugestoes">${lista.map(s => `<button type="button" data-pergunta="${html(s)}">${html(s)}</button>`).join('')}</div>`;
const sinal = v => (v >= 0 ? '+' : '−');

function respostaVisaoGeral(estado) {
  const r = ferramenta('visao_geral').executar(estado);
  const v = r.variacao_da_receita_pct;
  const atencao = [];
  if (r.anexo_do_mes_atual === 'V' && r.fator_r_pct != null)
    atencao.push(`o Fator R está em ${pctTexto(r.fator_r_pct)} e o DAS deste mês vai para o Anexo V`);
  if (r.movimentos_sem_conta)
    atencao.push(
      `${r.movimentos_sem_conta} ${r.movimentos_sem_conta === 1 ? 'movimento está' : 'movimentos estão'} sem conta`
    );
  return (
    p(
      `Em ${nomeMes(r.ultimo_mes_fechado)}, a empresa faturou ${forte(r.receita)}${v != null ? ` (${sinal(v)}${pctTexto(Math.abs(v))} sobre o mês anterior)` : ''} e teve ${r.lucro >= 0 ? 'lucro' : 'prejuízo'} de ${forte(Math.abs(r.lucro))}, margem de ${pctTexto(r.margem_pct)}.`
    ) +
    p(
      `Hoje há ${forte(r.saldo_no_banco_hoje)} no banco. O próximo DAS é de ${forte(r.proximo_das.valor)} e vence em ${dataCurta(r.proximo_das.vencimento)}.${atencao.length ? ` <strong>Atenção:</strong> ${html(atencao.join('; '))}.` : ''}`
    ) +
    (r.proximos_vencimentos.length
      ? livroMini({
          titulo: 'Próximos vencimentos',
          linhas: r.proximos_vencimentos.map(o => [`${dataCurta(o.data)}  ${o.obrigacao}`, o.valor ?? ''])
        })
      : '') +
    sugestoes([
      r.anexo_do_mes_atual === 'V' ? 'Qual o meu Fator R?' : 'Quanto vou pagar de DAS?',
      r.movimentos_sem_conta ? 'Tem algo a classificar?' : 'O que falta para fechar o mês?',
      'Quem são meus maiores clientes?'
    ])
  );
}

const MESES_RE =
  /\b(janeiro|fevereiro|marco|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\b(?:\s+de)?(?:\s+(20\d{2}))?/g;

function respostaComparar(estado, t, periodo) {
  let periodos = [...t.matchAll(MESES_RE)].map(m => extrairPeriodo(` ${m[0]} `).mes);
  if (periodos.length < 2) {
    const anos = [...t.matchAll(/\b(20\d{2})\b/g)].map(m => m[1]);
    if (anos.length >= 2) periodos = anos;
  }
  if (periodos.length < 2) {
    const base = periodo?.mes || mesAnterior(C.mesAtual());
    periodos = [mesAnterior(base), base];
  }
  const [a, b] = periodos.slice(0, 2).sort();
  const r = ferramenta('comparar_periodos').executar(estado, { a, b });
  if (r.erro) return p(html(r.erro));
  const rotulo = x => (x.length === 4 ? x : nomeMes(x));
  const curto = x => (x.length === 4 ? x : `${x.slice(5)}/${x.slice(2, 4)}`);
  const varia = (x, y) => (x ? ` (${sinal(y - x)}${pctTexto(Math.abs((y / x - 1) * 100))})` : '');
  const linha = (nome, chave) => [nome, `${dinheiro(r.a[chave])} → ${dinheiro(r.b[chave])}`];
  const mudou = r.contas_que_mais_mudaram.filter(c => !c.conta.startsWith('3.')).slice(0, 2);
  return (
    p(
      `Em ${rotulo(b)} a receita foi ${forte(r.b.receita)}${varia(r.a.receita, r.b.receita)} e o lucro, ${forte(r.b.lucro)}, contra ${forte(r.a.lucro)} em ${rotulo(a)}. A margem foi de ${pctTexto(r.a.margem_pct)} para ${pctTexto(r.b.margem_pct)}.` +
        (mudou.length
          ? ` Nas despesas, o que mais mudou: ${mudou.map(c => `${html(c.conta.replace(/^[\d.]+ /, '').toLowerCase())} (${sinal(c.diferenca)}${dinheiro(Math.abs(c.diferenca))})`).join(' e ')}.`
          : '')
    ) +
    livroMini({
      titulo: `${curto(a)} → ${curto(b)}`,
      linhas: [
        linha('Receita bruta', 'receita'),
        linha('(−) DAS', 'das'),
        linha('(−) Custo dos serviços', 'custos'),
        linha('(−) Despesas operacionais', 'despesas_operacionais'),
        [...linha('= Lucro líquido', 'lucro'), 'total']
      ]
    })
  );
}

function respostaClientes(estado, t, periodo) {
  const tipo = /fornecedor|para quem|com quem|paguei|pago para/.test(t) ? 'fornecedores' : 'clientes';
  const r = ferramenta('clientes_e_fornecedores').executar(estado, {
    tipo,
    ...(periodo?.mes ? { mes: periodo.mes } : periodo?.ano ? { ano: periodo.ano } : {}),
    limite: 8
  });
  if (!r.quantidade) return p(`Não achei ${tipo} ${html(r.periodo)}.`);
  const maior = r.lista[0];
  let frase;
  if (tipo === 'clientes') {
    const risco =
      r.participacao_do_maior_pct >= 30
        ? ' É uma dependência alta: perder esse cliente pesaria muito no faturamento.'
        : r.participacao_do_maior_pct >= 20
          ? ' Vale ficar de olho: um quinto da receita vem de um cliente só.'
          : ' A receita está bem distribuída entre os clientes.';
    frase = `${html(r.periodo.charAt(0).toUpperCase() + r.periodo.slice(1))}, ${r.quantidade} clientes pagaram ${forte(r.total)}. O maior, ${forte(maior.nome)}, responde por ${pctTexto(r.participacao_do_maior_pct)} da receita, e os 3 maiores somam ${pctTexto(r.participacao_dos_3_maiores_pct)}.${risco}`;
  } else {
    frase = `${html(r.periodo.charAt(0).toUpperCase() + r.periodo.slice(1))}, a empresa pagou ${forte(r.total)} a ${r.quantidade} fornecedores (sem contar folha, impostos e lucros). O maior é ${forte(maior.nome)}, com ${pctTexto(maior.participacao_pct)}.`;
  }
  return (
    p(frase) +
    livroMini({
      titulo: tipo === 'clientes' ? 'Maiores clientes' : 'Maiores fornecedores',
      linhas: [
        ...r.lista.map(g => [`${g.nome}  ${pctTexto(g.participacao_pct)}`, g.total]),
        ['Total', r.total, 'total']
      ]
    }) +
    sugestoes([tipo === 'clientes' ? 'Quem são meus maiores fornecedores?' : 'Quem são meus maiores clientes?'])
  );
}

function respostaImpostosPagos(estado, periodo) {
  const ano = periodo?.ano || Number((periodo?.mes || hojeISO()).slice(0, 4));
  const r = ferramenta('impostos_pagos').executar(estado, { ano });
  if (!r.meses_apurados) return p(`Ainda não há meses fechados em ${ano}.`);
  return (
    p(
      `Em ${ano} (${r.meses_apurados} ${r.meses_apurados === 1 ? 'mês apurado' : 'meses apurados'}), a empresa recolheu ${forte(r.das_total)} de DAS, uma alíquota média de ${pctTexto(r.aliquota_media_do_das_pct)} sobre a receita de ${forte(r.receita)}. Somando ${forte(r.encargos_da_folha_pagos)} de encargos da folha, a carga chega a ${pctTexto(r.carga_total_sobre_a_receita_pct)} do faturamento.` +
        (r.meses_no_anexo_v
          ? ` Os ${r.meses_no_anexo_v} meses no Anexo V custaram ${forte(r.das_a_mais_por_meses_no_anexo_v)} a mais de DAS.`
          : '')
    ) +
    livroMini({
      titulo: 'DAS por competência',
      linhas: [
        ...r.por_mes.map(m => [`${m.mes.slice(5)}/${m.mes.slice(0, 4)}  Anexo ${m.anexo}`, m.das]),
        ['Total', r.das_total, 'total']
      ],
      nota: 'O DAS de cada mês é pago no dia 20 do mês seguinte.'
    })
  );
}

function respostaLimiteSimples(estado) {
  const r = ferramenta('limite_do_simples').executar(estado);
  if (r.aviso) return respostaMei(estado);
  return (
    p(
      `No ritmo deste ano, a empresa deve faturar cerca de ${forte(r.projecao_ate_dezembro)} em ${r.ano}, ${pctTexto(r.uso_do_limite_pct)} do limite de ${forte(r.limite_do_simples)} do Simples. ${r.folga_ate_o_sublimite > 0 ? `Ainda há ${forte(r.folga_ate_o_sublimite)} de folga até o sublimite de ${dinheiro(r.sublimite_iss_icms)}.` : `A projeção já passa do sublimite de ${dinheiro(r.sublimite_iss_icms)}: o ISS deve sair do DAS.`}`
    ) + p(`<em>${html(r.regras)}</em>`)
  );
}

function respostaPontoEquilibrio(estado) {
  const r = ferramenta('ponto_de_equilibrio').executar(estado);
  if (r.erro) return p(html(r.erro));
  if (r.ponto_de_equilibrio_mensal == null)
    return p(
      'Os custos variáveis passam da receita: qualquer faturamento a mais aumenta o prejuízo. Vale rever os preços.'
    );
  const cem = v => dinheiro(v).replace(/,00$/, '');
  return (
    p(
      `Para não ter prejuízo, a empresa precisa faturar pelo menos ${forte(r.ponto_de_equilibrio_mensal)} por mês. Nos últimos ${r.meses_considerados.length} meses ela faturou em média ${forte(r.receita_media_mensal)}: uma margem de segurança de ${pctTexto(r.margem_de_seguranca_pct)}.`
    ) +
    p(
      `De cada ${cem(100)} faturados, ${cem(Math.round(r.custos_variaveis_pct))} vão para o DAS e o custo dos serviços, e sobram ${cem(Math.round(r.margem_de_contribuicao_pct))} para pagar as despesas fixas de ${forte(r.despesas_fixas_por_mes)} por mês.`
    )
  );
}

function respostaContratacao(estado, t) {
  const m =
    t.match(/r\$\s*([\d.]+(?:,\d{1,2})?)\s*(mil)?/) ||
    t.match(/\b(\d+(?:[.,]\d+)?)\s*(mil)\b/) ||
    t.match(/(?:salario|ganhando|ganha|de)\s+(?:de\s+)?([\d.]{3,}(?:,\d{1,2})?)/);
  if (!m) return p('Qual seria o salário? Por exemplo: "quanto custa contratar alguém de R$ 4.000?"');
  const salario = Number(m[1].replace(/\./g, '').replace(',', '.')) * (m[2] === 'mil' ? 1000 : 1);
  const q = t.match(/\b(\d+|dois|duas|tres|quatro|cinco)\s+(funcionarios|pessoas|devs|desenvolvedores|empregados)/);
  const quantidade = q ? { dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5 }[q[1]] || Number(q[1]) : 1;
  const r = ferramenta('simular_contratacao').executar(estado, { salario_mensal: salario, quantidade });
  if (r.erro) return p(html(r.erro));
  const quem = quantidade === 1 ? 'Um funcionário' : `${quantidade} funcionários`;
  const e = r.efeito_no_simples;
  let efeito = '';
  if (e && e.anexo_hoje === 'V' && e.anexo_depois === 'III')
    efeito = `Há um efeito bom no Simples: com essa folha, o Fator R iria de ${pctTexto(e.fator_r_hoje_pct)} para ${pctTexto(e.fator_r_depois_de_12_meses_pct)} em 12 meses e o DAS sairia do Anexo V para o III, cerca de ${forte(e.economia_de_das_por_mes)} a menos por mês. Na prática, o custo líquido fica perto de ${forte(r.custo_liquido_por_mes)}.`;
  else if (e)
    efeito = `O Fator R iria de ${pctTexto(e.fator_r_hoje_pct)} para ${pctTexto(e.fator_r_depois_de_12_meses_pct)} em 12 meses${e.anexo_hoje === 'III' ? ', o que ajuda a manter a empresa no Anexo III' : ''}.`;
  return (
    p(
      `${quem} com salário de ${forte(salario)} ${quantidade === 1 ? 'custa' : 'custam'} cerca de ${forte(r.custo_mensal_total)} por mês para a empresa (${String(r.custo_por_real_de_salario).replace('.', ',')} vezes o salário), contando 13º, férias com 1/3 e FGTS.`
    ) +
    (efeito ? p(efeito) : '') +
    livroMini({
      titulo: 'Custo mensal estimado',
      linhas: [
        ['Salários', r.composicao.salarios],
        ['13º (1/12 por mês)', r.composicao.provisao_13o],
        ['Férias + 1/3 (1/12 por mês)', r.composicao.provisao_ferias_com_terco],
        ['FGTS (8%)', r.composicao.fgts],
        ...(r.composicao.inss_patronal ? [['INSS patronal', r.composicao.inss_patronal]] : []),
        ['Total por mês', r.custo_mensal_total, 'total']
      ],
      nota: r.observacao
    })
  );
}

function respostaDistribuicao(estado) {
  const r = ferramenta('distribuicao_de_lucros').executar(estado);
  const abertura =
    r.disponivel_pelo_lucro <= 0
      ? `Em ${r.ano} a empresa já distribuiu ${forte(r.distribuido_no_ano)}, e todo o lucro acumulado já foi para os sócios. Distribuir mais agora seria retirar além do lucro, o que pode ser tributado.`
      : `Em ${r.ano} a empresa já distribuiu ${forte(r.distribuido_no_ano)}. Ainda há ${forte(r.disponivel_pelo_lucro)} de lucro acumulado para distribuir. Guardando o DAS a recolher (${dinheiro(r.reserva_sugerida.das_a_recolher)}) e um mês de custos e despesas (${dinheiro(r.reserva_sugerida.um_mes_de_custos_e_despesas)}), cabem ${forte(r.cabe_no_caixa)} no caixa: hoje dá para distribuir até ${forte(r.da_para_distribuir_hoje)}.`;
  return p(abertura) + p(`<em>${html(r.regras)}</em>`);
}

function respostaFechamento(estado, periodo) {
  const r = ferramenta('fechamento_do_mes').executar(estado, periodo?.mes ? { mes: periodo.mes } : {});
  const marca = { ok: '✓', pendente: '⚠', 'a vencer': '⏳' };
  const abertura = r.pendentes
    ? `Para fechar ${nomeMes(r.mes)}, ${r.pendentes === 1 ? 'falta 1 item' : `faltam ${r.pendentes} itens`}:`
    : `${nomeMes(r.mes).replace(/^./, c => c.toUpperCase())} está em dia: tudo lançado e conferido. Só falta pagar o que ainda vai vencer:`;
  return (
    p(abertura) +
    `<ul class="resposta-lista">${r.itens
      .map(i => `<li>${marca[i.situacao] || ''} <strong>${html(i.item)}</strong>: ${html(i.detalhe)}</li>`)
      .join('')}</ul>`
  );
}

// ---------- Glossário: "o que é RBT12?" ----------
const GLOSSARIO = [
  [
    ['rbt12', 'receita bruta dos 12'],
    'RBT12',
    'Receita bruta dos 12 meses anteriores ao mês apurado. É ela que define a faixa e a alíquota do Simples; por isso o DAS de um mês depende do ano inteiro.',
    'Quanto vou pagar de DAS?'
  ],
  [
    ['fator r'],
    'Fator R',
    'Folha de pagamento dos 12 meses (salários, pró-labore e encargos) dividida pela receita dos 12 meses. Em atividades como desenvolvimento de software, 28% ou mais leva o DAS para o Anexo III; abaixo disso, para o Anexo V, bem mais caro.',
    'Qual o meu Fator R?'
  ],
  [
    ['das'],
    'DAS',
    'Documento de Arrecadação do Simples Nacional: a guia única que junta os impostos da empresa (IRPJ, CSLL, PIS, Cofins, ISS e o INSS patronal). Vence no dia 20 do mês seguinte.',
    'Quanto vou pagar de DAS?'
  ],
  [
    ['simples nacional', 'simples'],
    'Simples Nacional',
    'Regime de tributação para empresas com faturamento de até R$ 4,8 milhões por ano. Os impostos são pagos numa guia só (o DAS), com alíquota que cresce com a receita.',
    'Vou passar do limite do Simples?'
  ],
  [
    ['anexo'],
    'Anexos do Simples',
    'Tabelas de alíquotas por tipo de atividade: I (comércio), II (indústria), III, IV e V (serviços). Cada uma tem seis faixas de receita.',
    'Qual o meu Fator R?'
  ],
  [
    ['aliquota efetiva'],
    'Alíquota efetiva',
    'A porcentagem que a empresa paga de fato: (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12. Fica sempre abaixo da nominal da faixa.',
    'Quanto vou pagar de DAS?'
  ],
  [
    ['pro-labore', 'pro labore', 'prolabore'],
    'Pró-labore',
    'A remuneração do sócio pelo trabalho na empresa, como um salário. Tem INSS de 11% (do sócio) e pode ter IR. Entra no Fator R, ao contrário da distribuição de lucros.',
    'Qual o meu Fator R?'
  ],
  [
    ['distribuicao de lucro', 'dividendo'],
    'Distribuição de lucros',
    'A parte do lucro que vai para os sócios. É isenta de IR quando a contabilidade comprova o lucro, com a retenção de 10% sobre o que passar de R$ 50 mil por mês para a mesma pessoa (desde 2026).',
    'Quanto posso distribuir de lucro?'
  ],
  [
    ['partidas dobradas', 'partida dobrada'],
    'Partidas dobradas',
    'O método da contabilidade: todo lançamento tem um débito e um crédito de mesmo valor. Por isso a soma dos débitos é sempre igual à dos créditos.',
    'Mostra o balancete'
  ],
  [
    ['debito', 'credito'],
    'Débito e crédito',
    'Os dois lados de um lançamento. Débito aumenta contas de ativo e despesa; crédito aumenta passivo, patrimônio e receita. Receber de um cliente, por exemplo: débito no banco, crédito em receita.',
    'Como lançar o recebimento de um cliente?'
  ],
  [
    ['dre', 'demonstracao do resultado'],
    'DRE',
    'Demonstração do Resultado do Exercício: receita menos impostos, custos e despesas, até chegar ao lucro ou prejuízo do período.',
    'Qual foi o lucro do mês passado?'
  ],
  [
    ['balancete'],
    'Balancete',
    'Lista de todas as contas com débitos, créditos e saldo até uma data. Serve para conferir que débitos e créditos batem.',
    'Mostra o balancete'
  ],
  [
    ['balanco', 'balanco patrimonial'],
    'Balanço patrimonial',
    'Foto da empresa numa data: o que ela tem (ativo), o que deve (passivo) e o que é dos sócios (patrimônio líquido). Ativo = passivo + patrimônio líquido.',
    'Mostra o balanço patrimonial'
  ],
  [
    ['razao'],
    'Razão',
    'O histórico de uma conta, lançamento por lançamento, com o saldo depois de cada um.',
    'Razão do banco'
  ],
  [
    ['ativo'],
    'Ativo',
    'Bens e direitos da empresa: dinheiro no banco, computadores, valores a receber.',
    'Mostra o balanço patrimonial'
  ],
  [
    ['passivo'],
    'Passivo',
    'Obrigações da empresa com terceiros: impostos a recolher, fornecedores, empréstimos.',
    'Mostra o balanço patrimonial'
  ],
  [
    ['patrimonio liquido'],
    'Patrimônio líquido',
    'O que sobra para os sócios: capital investido mais lucros acumulados, menos lucros distribuídos.',
    'Mostra o balanço patrimonial'
  ],
  [
    ['regime de caixa', 'caixa'],
    'Regime de caixa',
    'Receitas e despesas contam no dia em que o dinheiro entra ou sai do banco. É o que o app usa para os lançamentos do extrato.',
    'Qual foi o lucro do mês passado?'
  ],
  [
    ['competencia'],
    'Regime de competência',
    'Receitas e despesas contam no mês a que se referem, não no dia do pagamento. O DAS, por exemplo, é da competência do mês da receita, embora seja pago no mês seguinte.',
    'Quanto vou pagar de DAS?'
  ],
  [
    ['depreciacao'],
    'Depreciação',
    'O desgaste de um bem ao longo do tempo, lançado aos poucos como despesa. Computadores depreciam 20% ao ano.',
    'Como lançar a compra de um computador?'
  ],
  [
    ['ponto de equilibrio'],
    'Ponto de equilíbrio',
    'O faturamento mínimo para pagar todas as despesas sem lucro nem prejuízo.',
    'Qual o meu ponto de equilíbrio?'
  ],
  [
    ['margem de contribuicao'],
    'Margem de contribuição',
    'O que sobra de cada real faturado depois dos custos que variam com a venda (impostos e custo dos serviços), para pagar as despesas fixas.',
    'Qual o meu ponto de equilíbrio?'
  ],
  [
    ['mei'],
    'MEI',
    'Microempreendedor individual: faturamento de até R$ 81 mil em 2026, um imposto fixo mensal (DAS-MEI) e no máximo um empregado.',
    'O que vence nos próximos dias?'
  ],
  [
    ['defis'],
    'DEFIS',
    'Declaração anual das empresas do Simples, com receita, folha e lucros distribuídos do ano anterior. Vence em 31 de março.',
    'O que vence nos próximos dias?'
  ],
  [
    ['dctfweb'],
    'DCTFWeb',
    'Declaração mensal das contribuições previdenciárias (INSS da folha e do pró-labore). Gera a guia do INSS.',
    'O que vence nos próximos dias?'
  ],
  [
    ['fgts'],
    'FGTS',
    'Fundo de Garantia: 8% do salário de cada funcionário, depositado todo mês pelo FGTS Digital até o dia 20.',
    'Quanto custa contratar alguém de R$ 4.000?'
  ]
];
const acharTermo = t => GLOSSARIO.find(([chaves]) => chaves.some(k => new RegExp(`\\b${k}\\b`).test(t)));

function respostaGlossario(t) {
  const [, termo, texto, pergunta] = acharTermo(t);
  return p(`<strong>${html(termo)}:</strong> ${html(texto)}`) + sugestoes([pergunta]);
}

// Palavras que o agente conhece: erros de digitação perto delas são corrigidos ("qual o fatr r", "balancte")
const VOCABULARIO = `lancar lancamento lancamentos contabilizar registrar partida debito credito fator anexo prolabore
simular simula simulacao faturar faturamento faturei limite desenquadramento vence vencimento vencimentos prazo prazos
obrigacao obrigacoes calendario declaracao declaracoes imposto impostos simples aliquota tributo tributos classificar
balancete balanco patrimonio patrimonial ativo passivo razao saldo extrato lucro prejuizo resultado margem receita
evolucao crescimento ultimos despesa despesas gastos gastei paguei custo custos aluguel salario salarios encargos
marketing softwares nuvem terceiros computador depreciacao distribuicao distribuir dividendos capital tarifas passado
retrasado cliente clientes fornecedor fornecedores contratar funcionario funcionarios equilibrio fechamento fechar
pendencia pendencias compara comparar tributaria significa explica empresa panorama competencia
janeiro fevereiro marco abril maio junho julho agosto setembro outubro novembro dezembro`.split(/\s+/);

// A ordem importa: a primeira regra que bater decide o que a pessoa quer
const INTENCOES = [
  [
    'glossario',
    t => /\b(o que (e|eh|significa|quer dizer)|explica|explique|significado|definicao)\b/.test(t) && acharTermo(t)
  ],
  ['comoLancar', t => /(como (lanc|contabiliz|registr)|partida|debito e credito|lancamento d[aeo] )/.test(t)],
  [
    'visaoGeral',
    t =>
      /como (esta|estao|anda|vai|vao|ta) (a |as |o |os )?(empresa|coisas|negocio|financas|numeros)|como estamos|visao geral|panorama|resumo (geral|da empresa)|situacao da empresa|^ resumo $/.test(
        t
      )
  ],
  [
    'fechamento',
    t => /fechar o mes|fechamento|pendencia|pendente|checklist|o que falta|falta (algo|alguma coisa)/.test(t)
  ],
  ['contratacao', t => /contrat|funcionario|empregado|\bclt\b|admitir/.test(t)],
  ['distribuicao', t => /distribu|dividendo|retirar (o )?lucro|tirar (o )?lucro/.test(t)],
  [
    'pontoEquilibrio',
    t => /ponto de equilibrio|faturar no minimo|quanto preciso faturar|minimo para nao|nao ter prejuizo|empatar/.test(t)
  ],
  [
    'limiteSimples',
    t => /limite do simples|sair do simples|passar do limite|estourar o limite|sublimite|milhoes/.test(t)
  ],
  [
    'impostosPagos',
    t =>
      /(paguei|pagamos|pago|pagos|recolhi|recolhemos|gastei|gastamos)\s+(de |em |com )?(imposto|das\b|tribut)|impostos? pagos?|carga tributaria|total de (imposto|das)/.test(
        t
      )
  ],
  [
    'clientes',
    t =>
      /client|fornecedor|quem (mais )?(me )?(pagou|paga|comprou)|de quem (recebi|recebo)|para quem|com quem (gastei|gasto)/.test(
        t
      )
  ],
  ['comparar', t => /compar|versus| vs |diferenca entre/.test(t)],
  ['fatorR', t => /\bfat?o?r r\b|anexo (iii|v|3|5)\b|pro.?labore/.test(t)],
  ['simulacao', t => /simul|se eu faturar| e se /.test(t)],
  ['mei', t => /\bmei\b|limite do mei|desenquadr/.test(t)],
  ['obrigacoes', t => /vence|venciment|prazo|obrigac|calendario|agenda|declarac|defis|dasn/.test(t)],
  ['apuracao', t => /\bdas\b|imposto|simples|aliquota|tribut/.test(t)],
  ['aClassificar', t => /a classificar|sem conta|nao classific|sem classific/.test(t)],
  ['balancete', t => /balancete|bate|fecha(m)? os/.test(t)],
  ['balanco', t => /balanco|patrimon|ativo|passivo/.test(t)],
  ['razao', t => /razao|saldo|extrato da conta|quanto (eu )?(tenho|temos)|em caixa|no banco/.test(t)],
  ['dre', t => /\bdre\b|lucro|prejuizo|resultado|margem|fatur|receita/.test(t)],
  ['evolucao', t => /evolu|mes a mes|crescimento|ultimos meses/.test(t)],
  ['gastos', t => /despesa|gast|paguei|custo/.test(t)],
  ['ajuda', t => /ajuda|o que (voce )?(sabe|faz|consegue)|como (funciona|usar)/.test(t)]
];

// Memória curta da conversa: depois de "qual foi o lucro de setembro?", entende "e em agosto?";
// depois de "quanto gastei com aluguel este ano?", entende "e com marketing?"
let ultima = null;
const CONTINUAVEIS = new Set(['dre', 'apuracao', 'gastos', 'clientes', 'impostosPagos', 'fechamento']);
const temConta = (estado, t) => Boolean(acharConta(estado, t.replace(/.*\b(com|de|em)\s+/, '')));

export function responder(estado, pergunta) {
  const t = limparPergunta(pergunta, VOCABULARIO);
  if (!estado.movimentos.length)
    return p(
      'Ainda não há extrato da empresa. Importe um CSV ou OFX na tela Importar, ou carregue a empresa de exemplo nos ajustes.'
    );
  if (/classifi\w* .+ como /.test(t)) {
    ultima = null;
    return respostaReclassificar(estado, t, pergunta);
  }
  let periodo = extrairPeriodo(t);
  let intencao = INTENCOES.find(([, regra]) => regra(t))?.[0];
  let tResposta = t;

  // Continuação: "e em agosto?", "e no ano passado?", "e com marketing?"
  if (ultima && CONTINUAVEIS.has(ultima.intencao) && !intencao && /^ e /.test(t)) {
    const contaNova = ultima.intencao === 'gastos' && temConta(estado, t);
    if (periodo || contaNova) {
      intencao = ultima.intencao;
      if (!contaNova) tResposta = ultima.t;
      periodo ||= ultima.periodo;
    }
  }
  ultima = CONTINUAVEIS.has(intencao) ? { intencao, t: tResposta, periodo } : null;

  switch (intencao) {
    case 'glossario':
      return respostaGlossario(t);
    case 'comoLancar':
      return respostaComoLancar(estado, t);
    case 'visaoGeral':
      return respostaVisaoGeral(estado);
    case 'fechamento':
      return respostaFechamento(estado, periodo);
    case 'contratacao':
      return respostaContratacao(estado, t);
    case 'distribuicao':
      return respostaDistribuicao(estado);
    case 'pontoEquilibrio':
      return respostaPontoEquilibrio(estado);
    case 'limiteSimples':
      return respostaLimiteSimples(estado);
    case 'impostosPagos':
      return respostaImpostosPagos(estado, periodo);
    case 'clientes':
      return respostaClientes(estado, tResposta, periodo);
    case 'comparar':
      return respostaComparar(estado, t, periodo);
    case 'fatorR':
      return respostaFatorR(estado);
    case 'simulacao':
      return respostaSimulacao(estado, t);
    case 'mei':
      return respostaMei(estado);
    case 'obrigacoes':
      return respostaObrigacoes(estado);
    case 'apuracao':
      return respostaApuracao(estado, tResposta, periodo);
    case 'aClassificar':
      return respostaAClassificar(estado);
    case 'balancete':
      return respostaBalancete(estado);
    case 'balanco':
      return respostaBalanco(estado);
    case 'razao':
      return respostaRazao(estado, t);
    case 'dre':
      return respostaDRE(estado, periodo);
    case 'evolucao':
      return respostaEvolucao(estado);
    case 'gastos':
      return respostaGastos(estado, tResposta, periodo);
    case 'ajuda':
      return respostaAjuda();
    default:
      return respostaAjuda(false);
  }
}
