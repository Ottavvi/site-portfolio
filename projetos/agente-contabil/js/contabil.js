// O motor contábil: transforma o extrato classificado em lançamentos de partidas dobradas e monta os relatórios
// (diário, razão, balancete, DRE e balanço), além da apuração do Simples Nacional mês a mês.
//
// Regime: os lançamentos do banco seguem o caixa (data do pagamento ou do recebimento). O DAS é apurado por
// competência no último dia de cada mês fechado (débito em Simples Nacional, crédito em Simples a recolher), e o
// pagamento no mês seguinte baixa a dívida. Computadores entram no ativo e depreciam 20% ao ano.
import { aliquotaEfetiva, anexoPeloFatorR, folhaQueFalta, MEI } from './impostos.js';
import { agrupar, diasNoMes, hojeISO, mesAnterior, mesDe, somar } from './util.js';

const arred = v => Math.round(v * 100) / 100;
export const fimDoMes = mes => `${mes}-${String(diasNoMes(mes)).padStart(2, '0')}`;
export const mesAtual = () => mesDe(hojeISO());
const DEPRECIACAO_MENSAL = 0.2 / 12;

export const conta = (estado, id) => estado.plano.find(c => c.id === id);
export const contaPorCodigo = (estado, codigo) => estado.plano.find(c => c.codigo === codigo);

// Meses fechados: do primeiro movimento até o mês passado (o mês atual ainda está aberto)
export function mesesComDados(estado) {
  if (!estado.movimentos.length) return [];
  const primeiro = mesDe(estado.empresa.inicio || estado.movimentos[0].data);
  const lista = [];
  for (let m = primeiro; m <= mesAtual(); m = mesAnterior(m, -1)) lista.push(m);
  return lista;
}
export const mesesFechados = estado => mesesComDados(estado).filter(m => m < mesAtual());

// ---------- Apuração do Simples Nacional ----------
// Receita do mês: créditos em Receita de serviços (o regime de caixa é uma opção do Simples).
// RBT12: receita dos 12 meses anteriores. No começo da empresa (menos de 12 meses), a lei manda proporcionalizar:
// média dos meses anteriores × 12 (no primeiro mês, a própria receita × 12).
// Fator R: folha dos 12 meses anteriores (salários, pró-labore e encargos; benefícios ficam fora) ÷ RBT12.
export function receitaDoMes(estado, mes) {
  return somar(
    estado.movimentos.filter(m => mesDe(m.data) === mes && m.conta === 'receita-servicos'),
    m => m.valor
  );
}
export function folhaDoMes(estado, mes) {
  const contasFolha = new Set(estado.plano.filter(c => c.folha).map(c => c.id));
  return -somar(
    estado.movimentos.filter(m => mesDe(m.data) === mes && contasFolha.has(m.conta)),
    m => m.valor
  );
}

const cacheApuracao = new Map();
export function limparCache() {
  cacheApuracao.clear();
}

export function apuracao(estado, mes) {
  const chave = `${mes}|${estado.versaoDados}`;
  if (cacheApuracao.has(chave)) return cacheApuracao.get(chave);
  const e = estado.empresa;
  const receita = receitaDoMes(estado, mes);
  const inicio = mesDe(e.inicio || estado.movimentos[0]?.data || `${mes}-01`);
  const anteriores = Array.from({ length: 12 }, (_, i) => mesAnterior(mes, i + 1)).filter(m => m >= inicio);
  const receitasAnteriores = anteriores.map(m => receitaDoMes(estado, m));
  const folhasAnteriores = anteriores.map(m => folhaDoMes(estado, m));
  let rbt12;
  let folha12;
  let proporcional = false;
  if (anteriores.length >= 12) {
    rbt12 = somar(receitasAnteriores);
    folha12 = somar(folhasAnteriores);
  } else if (anteriores.length) {
    proporcional = true;
    rbt12 = (somar(receitasAnteriores) / anteriores.length) * 12;
    folha12 = (somar(folhasAnteriores) / anteriores.length) * 12;
  } else {
    proporcional = true;
    rbt12 = receita * 12;
    folha12 = folhaDoMes(estado, mes) * 12;
  }
  let resultado;
  if (e.regime === 'mei') {
    const ano = Number(mes.slice(0, 4));
    resultado = { mes, regime: 'mei', receita, das: MEI.das(ano, e.atividadeMei), rbt12, proporcional };
  } else {
    const fatorR = rbt12 ? folha12 / rbt12 : 0;
    const anexo = anexoPeloFatorR(e.anexo, e.fatorR, fatorR);
    const aliq = aliquotaEfetiva(anexo, rbt12);
    const das = arred(receita * aliq.efetiva);
    // Comparação: quanto seria no outro anexo (só para atividades com Fator R)
    let alternativa = null;
    if (e.fatorR) {
      const outro = anexo === 'V' ? 'III' : 'V';
      const a2 = aliquotaEfetiva(outro, rbt12);
      alternativa = { anexo: outro, efetiva: a2.efetiva, das: arred(receita * a2.efetiva) };
    }
    resultado = {
      mes,
      regime: 'simples',
      receita,
      rbt12,
      folha12,
      fatorR,
      anexo,
      faixa: aliq.faixa,
      nominal: aliq.nominal,
      deduzir: aliq.deduzir,
      efetiva: aliq.efetiva,
      das,
      alternativa,
      proporcional,
      folhaQueFalta: e.fatorR ? folhaQueFalta(rbt12, folha12) : 0
    };
  }
  cacheApuracao.set(chave, resultado);
  return resultado;
}

// ---------- Livro diário ----------
// Cada lançamento: { id, data, historico, origem, partidas: [{ conta, tipo: 'D'|'C', valor }] }
export function livro(estado) {
  if (livro.cache?.versao === estado.versaoDados) return livro.cache.lancamentos;
  const lancamentos = [];
  const e = estado.empresa;
  if (e.capitalInicial) {
    lancamentos.push({
      id: 'abertura',
      data: e.inicio,
      historico: 'Integralização do capital social',
      origem: 'abertura',
      partidas: [
        { conta: 'banco', tipo: 'D', valor: e.capitalInicial },
        { conta: 'capital', tipo: 'C', valor: e.capitalInicial }
      ]
    });
  }
  for (const m of estado.movimentos) {
    const valor = Math.abs(m.valor);
    lancamentos.push({
      id: m.id,
      data: m.data,
      historico: m.descricao,
      origem: 'banco',
      movimento: m.id,
      partidas:
        m.valor > 0
          ? [
              { conta: 'banco', tipo: 'D', valor },
              { conta: m.conta, tipo: 'C', valor }
            ]
          : [
              { conta: m.conta, tipo: 'D', valor },
              { conta: 'banco', tipo: 'C', valor }
            ]
    });
  }
  // Fechamento de cada mês: apuração do DAS e depreciação
  const compras = estado.movimentos.filter(m => m.conta === 'imobilizado' && m.valor < 0);
  for (const mes of mesesFechados(estado)) {
    const ap = apuracao(estado, mes);
    if (ap.das > 0) {
      lancamentos.push({
        id: `das-${mes}`,
        data: fimDoMes(mes),
        historico: `Apuração do Simples Nacional de ${mes.slice(5)}/${mes.slice(0, 4)}${ap.regime === 'mei' ? ' (DAS-MEI)' : ` (Anexo ${ap.anexo}, ${(ap.efetiva * 100).toFixed(2).replace('.', ',')}%)`}`,
        origem: 'apuracao',
        partidas: [
          { conta: 'das', tipo: 'D', valor: ap.das },
          { conta: 'das-a-recolher', tipo: 'C', valor: ap.das }
        ]
      });
    }
    // Depreciação: começa no mês seguinte ao da compra e para quando chega ao valor do bem (60 meses)
    let depreciacao = 0;
    for (const c of compras) {
      const meses =
        (Number(mes.slice(0, 4)) - Number(c.data.slice(0, 4))) * 12 + Number(mes.slice(5)) - Number(c.data.slice(5, 7));
      if (meses >= 1 && meses <= 60) depreciacao += -c.valor * DEPRECIACAO_MENSAL;
    }
    if (depreciacao > 0) {
      lancamentos.push({
        id: `dep-${mes}`,
        data: fimDoMes(mes),
        historico: `Depreciação de equipamentos de ${mes.slice(5)}/${mes.slice(0, 4)} (20% ao ano)`,
        origem: 'depreciacao',
        partidas: [
          { conta: 'depreciacao', tipo: 'D', valor: arred(depreciacao) },
          { conta: 'depreciacao-acumulada', tipo: 'C', valor: arred(depreciacao) }
        ]
      });
    }
  }
  lancamentos.sort((a, b) => a.data.localeCompare(b.data) || (a.origem === 'abertura' ? -1 : 0));
  livro.cache = { versao: estado.versaoDados, lancamentos };
  return lancamentos;
}

export function filtrarLancamentos(estado, { de, ate, mes, conta: idConta, busca } = {}) {
  const termo = busca ? busca.toLowerCase() : '';
  return livro(estado).filter(l => {
    if (mes && mesDe(l.data) !== mes) return false;
    if (de && l.data < de) return false;
    if (ate && l.data > ate) return false;
    if (idConta && !l.partidas.some(p => p.conta === idConta)) return false;
    if (termo && !l.historico.toLowerCase().includes(termo)) return false;
    return true;
  });
}

// ---------- Razão de uma conta ----------
export function razao(estado, idConta, { de, ate } = {}) {
  const c = conta(estado, idConta);
  const sinal = c.natureza === 'devedora' ? 1 : -1;
  let saldo = 0;
  const linhas = [];
  let saldoAnterior = 0;
  for (const l of livro(estado)) {
    for (const p of l.partidas.filter(p => p.conta === idConta)) {
      const efeito = (p.tipo === 'D' ? 1 : -1) * sinal * p.valor;
      if (de && l.data < de) {
        saldoAnterior += efeito;
        continue;
      }
      if (ate && l.data > ate) continue;
      if (!linhas.length) saldo = saldoAnterior;
      saldo += efeito;
      linhas.push({
        data: l.data,
        historico: l.historico,
        debito: p.tipo === 'D' ? p.valor : 0,
        credito: p.tipo === 'C' ? p.valor : 0,
        saldo
      });
    }
  }
  return { conta: c, saldoAnterior, linhas, saldoFinal: linhas.length ? saldo : saldoAnterior };
}

// ---------- Balancete de verificação ----------
// Para cada conta analítica: saldo anterior, débitos e créditos do período e saldo final. Os grupos somam os filhos.
// O total de débitos tem que ser igual ao de créditos: é a prova das partidas dobradas.
export function balancete(estado, { de, ate = hojeISO() } = {}) {
  const linhas = new Map(estado.plano.map(c => [c.codigo, { conta: c, anterior: 0, debitos: 0, creditos: 0 }]));
  for (const l of livro(estado)) {
    if (l.data > ate) continue;
    for (const p of l.partidas) {
      const c = conta(estado, p.conta);
      const linha = linhas.get(c.codigo);
      const efeito = (p.tipo === 'D' ? 1 : -1) * (c.natureza === 'devedora' ? 1 : -1) * p.valor;
      if (de && l.data < de) linha.anterior += efeito;
      else if (p.tipo === 'D') linha.debitos += p.valor;
      else linha.creditos += p.valor;
    }
  }
  const lista = estado.plano.map(c => {
    const l = linhas.get(c.codigo);
    const sinal = c.natureza === 'devedora' ? 1 : -1;
    return { ...l, final: l.anterior + sinal * (l.debitos - l.creditos) };
  });
  // Grupos: soma das contas filhas, convertendo a natureza para a do grupo pelo primeiro dígito
  for (const linha of lista.filter(l => l.conta.grupo)) {
    const filhas = lista.filter(l => !l.conta.grupo && l.conta.codigo.startsWith(`${linha.conta.codigo}.`));
    const naturezaGrupo = ['1', '4', '5', '6'].includes(linha.conta.codigo[0]) ? 'devedora' : 'credora';
    linha.debitos = somar(filhas, f => f.debitos);
    linha.creditos = somar(filhas, f => f.creditos);
    linha.anterior = somar(filhas, f => (f.conta.natureza === naturezaGrupo ? 1 : -1) * f.anterior);
    linha.final = somar(filhas, f => (f.conta.natureza === naturezaGrupo ? 1 : -1) * f.final);
  }
  const analiticas = lista.filter(l => !l.conta.grupo);
  return {
    linhas: lista.filter(l => l.anterior || l.debitos || l.creditos || l.final),
    totalDebitos: arred(somar(analiticas, l => l.debitos)),
    totalCreditos: arred(somar(analiticas, l => l.creditos))
  };
}

// ---------- DRE ----------
export function dre(estado, { de, ate }) {
  const soma = filtro => {
    let total = 0;
    for (const l of livro(estado)) {
      if (l.data < de || l.data > ate) continue;
      for (const p of l.partidas) {
        const c = conta(estado, p.conta);
        if (!filtro(c)) continue;
        total += (p.tipo === 'D' ? 1 : -1) * (c.natureza === 'devedora' ? 1 : -1) * p.valor;
      }
    }
    return arred(total);
  };
  const porConta = filtro =>
    estado.plano
      .filter(c => c.id && filtro(c))
      .map(c => ({ conta: c, valor: soma(x => x === c) }))
      .filter(l => l.valor);
  const receitaBruta = soma(c => c.dre === 'receita') + soma(c => c.dre === 'outras');
  const deducoes = soma(c => c.dre === 'deducao');
  const receitaLiquida = receitaBruta - deducoes;
  const custos = soma(c => c.dre === 'custo');
  const lucroBruto = receitaLiquida - custos;
  const pessoal = soma(c => c.dre === 'pessoal');
  const administrativas = soma(c => c.dre === 'administrativa');
  const comerciais = soma(c => c.dre === 'comercial');
  const despesasOperacionais = pessoal + administrativas + comerciais;
  const resultadoOperacional = lucroBruto - despesasOperacionais;
  const financeiro = soma(c => c.dre === 'financeira') - soma(c => c.dre === 'financeira-despesa');
  const resultado = arred(resultadoOperacional + financeiro);
  return {
    de,
    ate,
    linhas: [
      {
        rotulo: 'Receita bruta de serviços',
        valor: receitaBruta,
        nivel: 0,
        detalhe: porConta(c => c.dre === 'receita' || c.dre === 'outras')
      },
      { rotulo: '(−) Simples Nacional (DAS)', valor: -deducoes, nivel: 1 },
      { rotulo: '= Receita líquida', valor: receitaLiquida, nivel: 0, total: true },
      {
        rotulo: '(−) Custo dos serviços prestados',
        valor: -custos,
        nivel: 1,
        detalhe: porConta(c => c.dre === 'custo')
      },
      { rotulo: '= Lucro bruto', valor: lucroBruto, nivel: 0, total: true },
      { rotulo: '(−) Despesas com pessoal', valor: -pessoal, nivel: 1, detalhe: porConta(c => c.dre === 'pessoal') },
      {
        rotulo: '(−) Despesas administrativas',
        valor: -administrativas,
        nivel: 1,
        detalhe: porConta(c => c.dre === 'administrativa')
      },
      {
        rotulo: '(−) Despesas comerciais',
        valor: -comerciais,
        nivel: 1,
        detalhe: porConta(c => c.dre === 'comercial')
      },
      { rotulo: '= Resultado operacional', valor: resultadoOperacional, nivel: 0, total: true },
      {
        rotulo: '(±) Resultado financeiro',
        valor: financeiro,
        nivel: 1,
        detalhe: porConta(c => c.dre === 'financeira' || c.dre === 'financeira-despesa')
      },
      { rotulo: '= Lucro líquido do período', valor: resultado, nivel: 0, total: true, final: true }
    ],
    receitaBruta,
    deducoes,
    custos,
    despesasOperacionais,
    pessoal,
    resultado,
    margem: receitaBruta ? resultado / receitaBruta : 0
  };
}

export const periodoDoMes = mes => ({ de: `${mes}-01`, ate: fimDoMes(mes) });
export const periodoDoAno = ano => ({ de: `${ano}-01-01`, ate: `${ano}-12-31` });

// ---------- Balanço patrimonial ----------
// Ativo = Passivo + Patrimônio líquido. O resultado dos anos anteriores aparece em Lucros acumulados e o do ano
// em curso como Resultado do exercício (sem lançamento de encerramento).
export function balanco(estado, data = hojeISO()) {
  const b = balancete(estado, { ate: data });
  const saldo = id => b.linhas.find(l => l.conta.id === id)?.final || 0;
  const ano = data.slice(0, 4);
  const inicioDoAno = `${ano}-01-01`;
  const primeiraData = livro(estado)[0]?.data || inicioDoAno;
  const anosAnteriores =
    primeiraData < inicioDoAno ? dre(estado, { de: primeiraData, ate: `${Number(ano) - 1}-12-31` }).resultado : 0;
  const doAno = dre(estado, { de: inicioDoAno > primeiraData ? inicioDoAno : primeiraData, ate: data }).resultado;
  const ativo = [
    { rotulo: 'Banco conta movimento', valor: saldo('banco'), grupo: 'Ativo circulante' },
    { rotulo: 'Computadores e equipamentos', valor: saldo('imobilizado'), grupo: 'Ativo não circulante' },
    { rotulo: '(−) Depreciação acumulada', valor: -saldo('depreciacao-acumulada'), grupo: 'Ativo não circulante' }
  ].filter(l => l.valor);
  const passivo = [
    { rotulo: 'Simples Nacional a recolher', valor: saldo('das-a-recolher'), grupo: 'Passivo circulante' }
  ].filter(l => l.valor);
  const pl = [
    { rotulo: 'Capital social', valor: saldo('capital'), grupo: 'Patrimônio líquido' },
    {
      rotulo: 'Lucros acumulados de anos anteriores',
      valor: arred(anosAnteriores + saldo('lucros-acumulados')),
      grupo: 'Patrimônio líquido'
    },
    { rotulo: `Resultado de ${ano}`, valor: doAno, grupo: 'Patrimônio líquido' },
    { rotulo: '(−) Lucros distribuídos', valor: -saldo('distribuicao'), grupo: 'Patrimônio líquido' }
  ].filter(l => l.valor);
  const totalAtivo = arred(somar(ativo, l => l.valor));
  const totalPassivo = arred(somar(passivo, l => l.valor));
  const totalPL = arred(somar(pl, l => l.valor));
  return {
    data,
    ativo,
    passivo,
    pl,
    totalAtivo,
    totalPassivo,
    totalPL,
    fecha: Math.abs(totalAtivo - totalPassivo - totalPL) < 0.05
  };
}

// ---------- Caixa por mês (entradas e saídas do banco) ----------
export function caixaMensal(estado, meses) {
  return meses.map(mes => {
    const doMes = estado.movimentos.filter(m => mesDe(m.data) === mes);
    return {
      mes,
      entradas: somar(
        doMes.filter(m => m.valor > 0),
        m => m.valor
      ),
      saidas: -somar(
        doMes.filter(m => m.valor < 0),
        m => m.valor
      )
    };
  });
}

export const saldoBanco = (estado, data = hojeISO()) => razao(estado, 'banco', { ate: data }).saldoFinal;

// Movimentos agrupados por conta (para listas e o agente)
export const movimentosPorConta = (estado, filtro = () => true) =>
  agrupar(estado.movimentos.filter(filtro), m => m.conta);
