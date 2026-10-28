// Todas as contas do agente: resumo do mês, gastos recorrentes, previsão de saldo, orçamentos, metas e alertas.
// As funções recebem o estado e devolvem números prontos; as telas e o chat só formatam.
import {
  agrupar,
  chaveDoEstabelecimento,
  desvio,
  diasEntre,
  diasNoMes,
  dinheiro,
  hojeISO,
  media,
  mediana,
  mesAnterior,
  mesDe,
  mesPorExtenso,
  normalizar,
  somar,
  somarDias,
  somarMeses
} from './util.js';

export const tipoDe = (estado, t) =>
  estado.categorias.find(c => c.id === t.categoria)?.tipo || (t.valor > 0 ? 'entrada' : 'saida');
export const ehGasto = (estado, t) => tipoDe(estado, t) === 'saida';
export const ehEntrada = (estado, t) => tipoDe(estado, t) === 'entrada';
const valorGasto = t => -t.valor; // gastos são negativos no extrato; estornos (positivos) abatem

export const mesAtual = () => mesDe(hojeISO());

export function mesesComDados(estado) {
  return [...new Set(estado.transacoes.map(t => mesDe(t.data)))].sort();
}

// Filtro geral usado pela tela de transações e pelas ferramentas do agente
export function filtrar(estado, { de, ate, mes, categoria, busca, tipo, minimo, maximo } = {}) {
  const termo = busca ? normalizar(busca) : '';
  return estado.transacoes.filter(t => {
    if (mes && mesDe(t.data) !== mes) return false;
    if (de && t.data < de) return false;
    if (ate && t.data > ate) return false;
    if (categoria && t.categoria !== categoria) return false;
    if (tipo && tipoDe(estado, t) !== tipo) return false;
    if (termo && !normalizar(t.descricao).includes(termo)) return false;
    if (minimo != null && Math.abs(t.valor) < minimo) return false;
    if (maximo != null && Math.abs(t.valor) > maximo) return false;
    return true;
  });
}

export function saldoEm(estado, data = hojeISO()) {
  return (
    estado.saldoInicial +
    somar(
      estado.transacoes.filter(t => t.data <= data),
      t => t.valor
    )
  );
}

// ---------- Resumo de um mês ----------
export function resumoDoMes(estado, mes) {
  const doMes = filtrar(estado, { mes });
  const entradas = somar(
    doMes.filter(t => ehEntrada(estado, t)),
    t => t.valor
  );
  const saidas = somar(
    doMes.filter(t => ehGasto(estado, t)),
    valorGasto
  );
  const guardado = -somar(
    doMes.filter(t => tipoDe(estado, t) === 'neutra'),
    t => t.valor
  );
  const anteriores = [1, 2, 3].map(n => mesAnterior(mes, n));
  const porCategoria = estado.categorias
    .filter(c => c.tipo === 'saida')
    .map(c => {
      const itens = doMes.filter(t => t.categoria === c.id);
      const total = somar(itens, valorGasto);
      const mediaAnterior = media(anteriores.map(m => somar(filtrar(estado, { mes: m, categoria: c.id }), valorGasto)));
      return {
        categoria: c,
        total,
        quantidade: itens.length,
        mediaAnterior,
        orcamento: c.orcamento || 0
      };
    })
    .filter(linha => linha.total > 0 || linha.orcamento > 0)
    .sort((a, b) => b.total - a.total);
  const entradasPorCategoria = estado.categorias
    .filter(c => c.tipo === 'entrada')
    .map(c => ({
      categoria: c,
      total: somar(
        doMes.filter(t => t.categoria === c.id),
        t => t.valor
      )
    }))
    .filter(linha => linha.total > 0)
    .sort((a, b) => b.total - a.total);
  return {
    mes,
    entradas,
    saidas,
    resultado: entradas - saidas,
    guardado,
    porCategoria,
    entradasPorCategoria,
    quantidade: doMes.length,
    saldoFinal: saldoEm(estado, `${mes}-31`)
  };
}

export function serieMensal(estado, quantos = 12, ate = mesAtual()) {
  const meses = Array.from({ length: quantos }, (_, i) => mesAnterior(ate, quantos - 1 - i));
  return meses.map(mes => {
    const r = resumoDoMes(estado, mes);
    return {
      mes,
      entradas: r.entradas,
      saidas: r.saidas,
      resultado: r.resultado
    };
  });
}

// ---------- Gastos e entradas que se repetem todo mês ----------
// Agrupa pelo nome do estabelecimento; é recorrente se apareceu em pelo menos 3 dos últimos 6 meses (ou nos 2
// últimos seguidos, para pegar assinaturas novas), com valor parecido e perto do mesmo dia do mês.
export function recorrentes(estado, referencia = hojeISO()) {
  const inicio = somarMeses(referencia, -6);
  const recentes = estado.transacoes.filter(
    t => t.data > inicio && t.data <= referencia && tipoDe(estado, t) !== 'neutra'
  );
  const grupos = agrupar(recentes, t => `${t.valor > 0 ? '+' : '-'}${chaveDoEstabelecimento(t.descricao)}`);
  const lista = [];
  for (const itens of Object.values(grupos)) {
    const porMes = agrupar(itens, t => mesDe(t.data));
    const meses = Object.keys(porMes).sort();
    if (meses.length < 2) continue;
    // Mais de duas por mês é gasto frequente (mercado, corrida), não conta fixa
    if (itens.length > meses.length * 1.5) continue;
    const valores = itens.map(t => Math.abs(t.valor));
    const valorMedio = media(valores);
    const variacao = valorMedio ? desvio(valores) / valorMedio : 1;
    const dias = itens.map(t => Number(t.data.slice(8)));
    const diaTipico = Math.round(mediana(dias));
    const ultimo = itens.at(-1);
    const seguidos =
      meses.length >= 2 &&
      meses.at(-1) >= mesAnterior(mesDe(referencia), 1) &&
      meses.at(-2) >= mesAnterior(mesDe(referencia), 2);
    const recorrente = (meses.length >= 3 || seguidos) && variacao <= 0.25 && desvio(dias) <= 5;
    if (!recorrente) continue;
    const primeiroDeTodos = estado.transacoes.find(
      t =>
        `${t.valor > 0 ? '+' : '-'}${chaveDoEstabelecimento(t.descricao)}` ===
        `${ultimo.valor > 0 ? '+' : '-'}${chaveDoEstabelecimento(ultimo.descricao)}`
    );
    lista.push({
      nome: nomeBonito(ultimo.descricao),
      chave: chaveDoEstabelecimento(ultimo.descricao),
      categoria: ultimo.categoria,
      entrada: ultimo.valor > 0,
      valorMedio,
      variavel: variacao > 0.08,
      diaTipico,
      ultimo: ultimo.data,
      desde: primeiroDeTodos.data,
      nova: diasEntre(primeiroDeTodos.data, referencia) <= 75,
      porAno: valorMedio * 12
    });
  }
  return lista.sort((a, b) => b.valorMedio - a.valorMedio);
}

// "CARTAO STREAMFLIX ASSINATURA" -> "Streamflix assinatura"
export function nomeBonito(descricao) {
  const limpo = String(descricao)
    .replace(/^((PIX (ENVIADO|RECEBIDO)|CARTAO|DEBITO AUT|BOLETO|PAGAMENTO( DE)?|COMPRA|TED|DOC)\s+)+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

// ---------- Previsão do saldo ----------
// Parte do saldo de hoje e soma, dia a dia: as contas recorrentes no dia de costume, os gastos variáveis na média
// diária dos últimos 3 meses e, no cenário esperado, as entradas variáveis (clientes) pela mediana mensal.
export function previsao(estado, dias = 90, { comEntradasVariaveis = true } = {}) {
  const hoje = hojeISO();
  const fixos = recorrentes(estado, hoje);
  const chavesFixas = new Set(fixos.map(f => `${f.entrada ? '+' : '-'}${f.chave}`));
  const ehFixa = t => chavesFixas.has(`${t.valor > 0 ? '+' : '-'}${chaveDoEstabelecimento(t.descricao)}`);
  const ultimos = [1, 2, 3].map(n => mesAnterior(mesDe(hoje), n));
  const gastoVariavelMensal = media(
    ultimos.map(mes =>
      somar(
        filtrar(estado, { mes }).filter(t => ehGasto(estado, t) && !ehFixa(t)),
        valorGasto
      )
    )
  );
  const seisMeses = [1, 2, 3, 4, 5, 6].map(n => mesAnterior(mesDe(hoje), n));
  const entradaVariavelMensal = mediana(
    seisMeses.map(mes =>
      somar(
        filtrar(estado, { mes }).filter(t => ehEntrada(estado, t) && !ehFixa(t)),
        t => t.valor
      )
    )
  );
  const guardarMensal = media(
    ultimos.map(
      mes =>
        -somar(
          filtrar(estado, { mes }).filter(t => tipoDe(estado, t) === 'neutra'),
          t => t.valor
        )
    )
  );

  let saldo = saldoEm(estado, hoje);
  // O que já caiu neste mês não entra de novo
  const jaPagos = new Set(
    filtrar(estado, { mes: mesDe(hoje) }).map(t => `${t.valor > 0 ? '+' : '-'}${chaveDoEstabelecimento(t.descricao)}`)
  );
  const serie = [{ data: hoje, saldo }];
  const eventos = [];
  let menor = { data: hoje, saldo };
  for (let d = 1; d <= dias; d++) {
    const data = somarDias(hoje, d);
    const mes = mesDe(data);
    const dia = Number(data.slice(8));
    const ultimoDia = diasNoMes(mes);
    for (const f of fixos) {
      const diaDoMes = Math.min(f.diaTipico, ultimoDia);
      if (dia !== diaDoMes) continue;
      if (mes === mesDe(hoje) && jaPagos.has(`${f.entrada ? '+' : '-'}${f.chave}`)) continue;
      const valor = f.entrada ? f.valorMedio : -f.valorMedio;
      saldo += valor;
      eventos.push({ data, nome: f.nome, valor });
    }
    saldo -= gastoVariavelMensal / ultimoDia;
    if (dia === Math.min(6, ultimoDia)) saldo -= guardarMensal;
    if (comEntradasVariaveis) saldo += entradaVariavelMensal / ultimoDia;
    serie.push({ data, saldo });
    if (saldo < menor.saldo) menor = { data, saldo };
  }
  return {
    serie,
    eventos,
    menor,
    final: saldo,
    gastoVariavelMensal,
    entradaVariavelMensal,
    guardarMensal,
    fixos
  };
}

// ---------- Orçamentos ----------
export function orcamentos(estado, mes = mesAtual()) {
  const hoje = hojeISO();
  const corrente = mes === mesDe(hoje);
  const diaHoje = corrente ? Number(hoje.slice(8)) : diasNoMes(mes);
  return estado.categorias
    .filter(c => c.tipo === 'saida' && c.orcamento > 0)
    .map(c => {
      const gasto = somar(filtrar(estado, { mes, categoria: c.id }), valorGasto);
      // Projeção: o que já foi gasto mais o que, nos 3 meses anteriores, costumava ser gasto depois deste dia
      // (assim o aluguel pago no dia 10 não é "projetado" de novo até o fim do mês)
      const restante = corrente
        ? media(
            [1, 2, 3].map(n =>
              somar(
                filtrar(estado, {
                  mes: mesAnterior(mes, n),
                  categoria: c.id
                }).filter(t => Number(t.data.slice(8)) > diaHoje),
                valorGasto
              )
            )
          )
        : 0;
      const projecao = gasto + restante;
      return {
        categoria: c,
        gasto,
        limite: c.orcamento,
        uso: gasto / c.orcamento,
        projecao,
        sobra: c.orcamento - gasto,
        situacao: gasto > c.orcamento ? 'estourou' : projecao > c.orcamento * 1.05 ? 'risco' : 'ok'
      };
    })
    .sort((a, b) => b.uso - a.uso);
}

// ---------- Metas ----------
export function metas(estado) {
  const hoje = hojeISO();
  const sobraMedia = media(serieMensal(estado, 6, mesAnterior(mesDe(hoje))).map(m => m.resultado));
  return estado.metas.map(meta => {
    const falta = Math.max(meta.alvo - meta.guardado, 0);
    const meses = Math.max(Math.ceil(diasEntre(hoje, meta.prazo) / 30.4), 1);
    const porMes = falta / meses;
    return {
      ...meta,
      falta,
      meses,
      porMes,
      progresso: meta.alvo ? meta.guardado / meta.alvo : 0,
      cabe: porMes <= Math.max(sobraMedia, 0)
    };
  });
}

// ---------- Gastos fora do comum ----------
// Uma compra é fora do comum quando passa de 3 vezes a mediana da categoria nos 6 meses anteriores (e de R$ 200)
export function foraDoComum(estado, mes = mesAtual()) {
  const inicio = `${mesAnterior(mes, 6)}-01`;
  const fim = `${mes}-01`;
  return filtrar(estado, { mes, tipo: 'saida' })
    .filter(t => {
      // Compara com o mesmo estabelecimento quando ele tem histórico (a conta de luz com as contas de luz);
      // se não tiver, com a categoria toda
      const anteriores = filtrar(estado, {
        de: inicio,
        categoria: t.categoria,
        tipo: 'saida'
      }).filter(h => h.data < fim);
      const mesmoLugar = anteriores.filter(
        h => chaveDoEstabelecimento(h.descricao) === chaveDoEstabelecimento(t.descricao)
      );
      const historico = (mesmoLugar.length >= 2 ? mesmoLugar : anteriores).map(h => -h.valor);
      const base = Math.max(mediana(historico), 1);
      return -t.valor >= 200 && -t.valor > base * 3;
    })
    .sort((a, b) => a.valor - b.valor);
}

// ---------- Alertas e observações do agente ----------
// Cada alerta tem um nível (atencao, aviso ou bom), um título curto e um detalhe com os números
export function alertas(estado, mes = mesAtual()) {
  const lista = [];
  const prev = previsao(estado, 60);
  if (prev.menor.saldo < 0) {
    lista.push({
      nivel: 'atencao',
      titulo: `O saldo pode ficar negativo em ${new Date(`${prev.menor.data}T12:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}`,
      detalhe: `Mantendo o ritmo atual de gastos, a conta chega a ${dinheiro(prev.menor.saldo)}. Corte gastos variáveis ou adie uma compra.`
    });
  }
  // Gasto fora do comum que sozinho explica o orçamento estourado vira um alerta só
  const anomalias = foraDoComum(estado, mes)
    .slice(0, 3)
    .map(t => ({ ...t })); // cópias: o campo "estourou" não pode ir parar no extrato salvo
  for (const o of orcamentos(estado, mes)) {
    const culpado = anomalias.find(t => t.categoria === o.categoria.id && -t.valor > o.gasto * 0.5);
    if (culpado && o.situacao !== 'ok') {
      culpado.estourou = o;
      continue;
    }
    if (o.situacao === 'estourou') {
      lista.push({
        nivel: 'atencao',
        titulo: `${o.categoria.nome} passou do orçamento`,
        detalhe: `Gastou ${dinheiro(o.gasto)} de ${dinheiro(o.limite)} (${Math.round(o.uso * 100)}%).`
      });
    } else if (o.situacao === 'risco') {
      lista.push({
        nivel: 'aviso',
        titulo: `${o.categoria.nome} deve passar do orçamento`,
        detalhe: `Neste ritmo fecha o mês em ${dinheiro(o.projecao)}, para um limite de ${dinheiro(o.limite)}.`
      });
    }
  }
  for (const t of anomalias) {
    lista.push({
      nivel: t.estourou ? 'atencao' : 'aviso',
      titulo: `Gasto fora do comum: ${nomeBonito(t.descricao)}`,
      detalhe: `${dinheiro(-t.valor)} em ${t.data.split('-').reverse().join('/')}, bem acima do normal nessa categoria.${
        t.estourou
          ? ` Sozinho, ele levou o orçamento de ${t.estourou.categoria.nome.toLowerCase()} a ${dinheiro(t.estourou.gasto)} (limite de ${dinheiro(t.estourou.limite)}).`
          : ''
      }`
    });
  }
  for (const r of recorrentes(estado).filter(r => r.nova && !r.entrada)) {
    lista.push({
      nivel: 'aviso',
      titulo: `Conta nova todo mês: ${r.nome}`,
      detalhe: `${dinheiro(r.valorMedio)} por mês desde ${r.desde.split('-').reverse().join('/')}, ${dinheiro(r.porAno)} por ano. Ainda usa?`
    });
  }
  const resumo = resumoDoMes(estado, mes);
  for (const linha of resumo.porCategoria) {
    if (
      linha.mediaAnterior > 80 &&
      linha.total > linha.mediaAnterior * 1.4 &&
      !lista.some(a => a.titulo.startsWith(linha.categoria.nome))
    ) {
      lista.push({
        nivel: 'aviso',
        titulo: `${linha.categoria.nome} subiu ${Math.round((linha.total / linha.mediaAnterior - 1) * 100)}%`,
        detalhe: `${dinheiro(linha.total)} em ${mesPorExtenso(mes)}, contra uma média de ${dinheiro(linha.mediaAnterior)} nos 3 meses anteriores.`
      });
    }
  }
  const anterior = resumoDoMes(estado, mesAnterior(mes));
  if (anterior.resultado > 0 && anterior.quantidade) {
    lista.push({
      nivel: 'bom',
      titulo: `Sobraram ${dinheiro(anterior.resultado)} em ${mesPorExtenso(anterior.mes)}`,
      detalhe: `Entraram ${dinheiro(anterior.entradas)} e saíram ${dinheiro(anterior.saidas)}, sem contar o que foi guardado.`
    });
  }
  const ordem = { atencao: 0, aviso: 1, bom: 2 };
  return lista.sort((a, b) => ordem[a.nivel] - ordem[b.nivel]);
}

// ---------- "Posso gastar R$ X?" ----------
export function podeGastar(estado, valor, idCategoria) {
  const prev = previsao(estado, 45);
  const menorDepois = prev.menor.saldo - valor;
  const orc = idCategoria ? orcamentos(estado).find(o => o.categoria.id === idCategoria) : null;
  const folgaOrcamento = orc ? orc.limite - orc.gasto : null;
  let resposta;
  if (menorDepois < 0) resposta = 'nao';
  else if (menorDepois < 500 || (folgaOrcamento != null && folgaOrcamento < valor)) resposta = 'cuidado';
  else resposta = 'sim';
  return {
    resposta,
    menorDepois,
    dataDoMenor: prev.menor.data,
    orcamento: orc,
    folgaOrcamento
  };
}
