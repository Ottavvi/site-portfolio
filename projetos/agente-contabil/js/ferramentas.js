// Ferramentas do agente contábil: as mesmas para o agente local e para o modo Claude.
import * as C from './contabil.js';
import { aliquotaEfetiva, ANEXOS, FATOR_R_MINIMO, LIMITE_SIMPLES, MEI, SUBLIMITE_ICMS_ISS } from './impostos.js';
import { obrigacoes } from './obrigacoes.js';
import { OPERACOES } from './plano.js';
import { reclassificar } from './estado.js';
import { dinheiro, hojeISO, mesAnterior, mesDe, normalizar, somar } from './util.js';

const arred = v => Math.round(v * 100) / 100;
const pct = v => Math.round(v * 10000) / 100;
const MES = { type: 'string', description: 'Mês AAAA-MM. Se omitido, o último mês fechado.' };
const ultimoFechado = () => mesAnterior(C.mesAtual());

const SINONIMOS = {
  banco: ['banco', 'caixa', 'conta corrente', 'dinheiro em conta'],
  'receita-servicos': ['receita', 'faturamento', 'vendas', 'servicos prestados'],
  das: ['das', 'simples', 'imposto', 'impostos'],
  'das-a-recolher': ['das a recolher', 'imposto a pagar', 'simples a recolher'],
  aluguel: ['aluguel', 'coworking'],
  salarios: ['salario', 'salarios', 'folha'],
  prolabore: ['pro-labore', 'pro labore', 'prolabore'],
  encargos: ['encargos', 'fgts', 'inss'],
  terceiros: ['terceiros', 'freela', 'freelas', 'prestadores'],
  nuvem: ['nuvem', 'servidores', 'cloud', 'hospedagem'],
  marketing: ['marketing', 'anuncios', 'publicidade'],
  softwares: ['software', 'softwares', 'assinaturas', 'ferramentas'],
  distribuicao: ['distribuicao', 'lucros distribuidos', 'dividendos'],
  imobilizado: ['imobilizado', 'computadores', 'equipamentos', 'notebooks'],
  capital: ['capital', 'capital social'],
  tarifas: ['tarifa', 'tarifas', 'banco tarifas']
};

export function acharConta(estado, texto) {
  if (!texto) return null;
  const t = normalizar(texto);
  const analiticas = estado.plano.filter(c => c.id);
  return (
    analiticas.find(c => c.id === t || c.codigo === t) ||
    analiticas.find(c => normalizar(c.nome) === t) ||
    analiticas.find(c => normalizar(c.nome).includes(t)) ||
    analiticas.find(c => SINONIMOS[c.id]?.some(s => t === s || t.includes(s))) ||
    null
  );
}

function periodo({ mes, ano, de, ate } = {}) {
  if (de && ate) return { de, ate, rotulo: `de ${de} a ${ate}` };
  if (ano) return { ...C.periodoDoAno(ano), rotulo: `em ${ano}` };
  const m = mes || ultimoFechado();
  return { ...C.periodoDoMes(m), rotulo: `em ${m.slice(5)}/${m.slice(0, 4)}`, mes: m };
}

const A_CLASSIFICAR = new Set(['despesa-a-classificar', 'receita-a-classificar']);
const nomeProprio = texto => texto.replace(/\b\p{L}/gu, letra => letra.toUpperCase());
// Nome do cliente ou fornecedor sem as palavras do banco ("TED RECEBIDA ACADEMIA FORCA" -> "Academia Forca")
const nomeDoParceiro = descricao =>
  nomeProprio(
    normalizar(descricao)
      .replace(/\b(recebid[oa]s?|enviad[oa]s?|transf\w*|ted|doc|pix|pagamento|pagto|boleto|credito|debito)\b/g, ' ')
      .replace(/[0-9*#/\\.:,-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ') || normalizar(descricao)
  );

// Os 12 meses fechados mais recentes
function ultimos12Meses() {
  const fim = ultimoFechado();
  return { de: `${mesAnterior(fim, 11)}-01`, ate: C.fimDoMes(fim), rotulo: 'nos últimos 12 meses' };
}

// Médias por mês dos últimos meses fechados, separando o que varia com a receita (DAS e custo dos serviços)
// do que é fixo (pessoal, administrativas, comerciais e financeiras)
function mediaMensal(estado, quantos = 3) {
  const meses = C.mesesFechados(estado).slice(-Math.min(Math.max(quantos, 1), 12));
  if (!meses.length) return null;
  const d = C.dre(estado, { de: `${meses[0]}-01`, ate: C.fimDoMes(meses.at(-1)) });
  const n = meses.length;
  return {
    meses,
    receita: d.receitaBruta / n,
    custos: d.custos / n,
    fixas: (d.receitaBruta - d.deducoes - d.custos - d.resultado) / n,
    variaveisPct: d.receitaBruta ? (d.deducoes + d.custos) / d.receitaBruta : 0
  };
}

export const FERRAMENTAS = [
  {
    name: 'dre',
    description:
      'Demonstração do resultado (DRE) de um mês, de um ano ou de um intervalo: receita bruta, DAS, custos, despesas por grupo e lucro líquido, com o detalhe por conta.',
    input_schema: {
      type: 'object',
      properties: { mes: MES, ano: { type: 'integer' }, de: { type: 'string' }, ate: { type: 'string' } }
    },
    executar(estado, entrada = {}) {
      const p = periodo(entrada);
      const d = C.dre(estado, p);
      return {
        periodo: p.rotulo,
        linhas: d.linhas.map(l => ({
          linha: l.rotulo,
          valor: arred(l.valor),
          contas: l.detalhe?.map(x => ({ conta: x.conta.nome, valor: arred(x.valor) }))
        })),
        margem_liquida_pct: pct(d.margem)
      };
    }
  },
  {
    name: 'evolucao_mensal',
    description:
      'Receita, DAS, despesas totais e lucro de cada um dos últimos meses (até 18), do mais antigo ao mais recente.',
    input_schema: { type: 'object', properties: { meses: { type: 'integer', minimum: 2, maximum: 18 } } },
    executar(estado, { meses = 6 } = {}) {
      const lista = C.mesesComDados(estado).slice(-Math.min(Math.max(meses, 2), 18));
      return lista.map(m => {
        const d = C.dre(estado, C.periodoDoMes(m));
        return {
          mes: m,
          receita: arred(d.receitaBruta),
          das: arred(d.deducoes),
          lucro: arred(d.resultado),
          margem_pct: pct(d.margem),
          fechado: m < C.mesAtual()
        };
      });
    }
  },
  {
    name: 'balancete',
    description:
      'Balancete de verificação até uma data: saldo de cada conta, total de débitos e de créditos (que precisam ser iguais).',
    input_schema: {
      type: 'object',
      properties: { ate: { type: 'string', description: 'Data AAAA-MM-DD. Padrão: hoje.' } }
    },
    executar(estado, { ate = hojeISO() } = {}) {
      const b = C.balancete(estado, { ate });
      return {
        ate,
        contas: b.linhas
          .filter(l => !l.conta.grupo)
          .map(l => ({
            codigo: l.conta.codigo,
            conta: l.conta.nome,
            debitos: arred(l.debitos),
            creditos: arred(l.creditos),
            saldo: arred(l.final)
          })),
        total_debitos: b.totalDebitos,
        total_creditos: b.totalCreditos,
        fechado: Math.abs(b.totalDebitos - b.totalCreditos) < 0.01
      };
    }
  },
  {
    name: 'balanco_patrimonial',
    description:
      'Balanço patrimonial numa data: ativo, passivo e patrimônio líquido, e se o ativo é igual a passivo + PL.',
    input_schema: {
      type: 'object',
      properties: { data: { type: 'string', description: 'AAAA-MM-DD. Padrão: hoje.' } }
    },
    executar(estado, { data = hojeISO() } = {}) {
      const b = C.balanco(estado, data);
      const linhas = l => l.map(x => ({ item: x.rotulo, valor: arred(x.valor) }));
      return {
        data,
        ativo: linhas(b.ativo),
        passivo: linhas(b.passivo),
        patrimonio_liquido: linhas(b.pl),
        total_ativo: b.totalAtivo,
        total_passivo_mais_pl: arred(b.totalPassivo + b.totalPL),
        confere: b.fecha
      };
    }
  },
  {
    name: 'razao',
    description:
      'Razão de uma conta: cada lançamento com débito, crédito e saldo, num período. Devolve as últimas 30 linhas.',
    input_schema: {
      type: 'object',
      properties: {
        conta: { type: 'string', description: 'Nome, código ou apelido da conta (ex.: "banco", "6.2.1", "aluguel").' },
        de: { type: 'string' },
        ate: { type: 'string' }
      },
      required: ['conta']
    },
    executar(estado, { conta, de, ate }) {
      const c = acharConta(estado, conta);
      if (!c) return { erro: `Não achei a conta "${conta}". Use plano_de_contas para ver os nomes.` };
      const r = C.razao(estado, c.id, { de, ate });
      return {
        conta: `${c.codigo} ${c.nome}`,
        natureza: c.natureza,
        saldo_anterior: arred(r.saldoAnterior),
        saldo_final: arred(r.saldoFinal),
        lancamentos: r.linhas.length,
        ultimas: r.linhas.slice(-30).map(l => ({
          data: l.data,
          historico: l.historico,
          debito: arred(l.debito),
          credito: arred(l.credito),
          saldo: arred(l.saldo)
        }))
      };
    }
  },
  {
    name: 'buscar_movimentos',
    description:
      'Procura movimentos do extrato por texto, conta, mês ou tipo (entrada/saída). Devolve total e até 40 movimentos, os maiores primeiro.',
    input_schema: {
      type: 'object',
      properties: {
        busca: { type: 'string' },
        conta: { type: 'string' },
        mes: MES,
        tipo: { type: 'string', enum: ['entrada', 'saida'] }
      }
    },
    executar(estado, { busca, conta, mes, tipo } = {}) {
      const c = conta ? acharConta(estado, conta) : null;
      const termo = busca ? normalizar(busca) : '';
      const lista = estado.movimentos
        .filter(
          m =>
            (!mes || mesDe(m.data) === mes) &&
            (!c || m.conta === c.id) &&
            (!termo || normalizar(m.descricao).includes(termo)) &&
            (!tipo || (tipo === 'entrada') === m.valor > 0)
        )
        .sort((a, b) => Math.abs(b.valor) - Math.abs(a.valor));
      return {
        quantidade: lista.length,
        total: arred(somar(lista, m => m.valor)),
        movimentos: lista.slice(0, 40).map(m => ({
          data: m.data,
          descricao: m.descricao,
          valor: m.valor,
          conta: estado.plano.find(x => x.id === m.conta)?.nome
        }))
      };
    }
  },
  {
    name: 'apuracao_simples',
    description:
      'Apuração do Simples Nacional (ou DAS-MEI) de um mês: receita do mês, receita dos 12 meses anteriores (RBT12), Fator R, anexo, faixa, alíquota nominal, parcela a deduzir, alíquota efetiva e valor do DAS. Mostra também quanto seria no outro anexo.',
    input_schema: { type: 'object', properties: { mes: MES } },
    executar(estado, { mes = ultimoFechado() } = {}) {
      const a = C.apuracao(estado, mes);
      if (a.regime === 'mei') return { mes, regime: 'MEI', receita_do_mes: arred(a.receita), das_mei: a.das };
      return {
        mes,
        regime: 'Simples Nacional',
        receita_do_mes: arred(a.receita),
        rbt12: arred(a.rbt12),
        rbt12_proporcional_inicio_de_atividade: a.proporcional,
        folha_12_meses: arred(a.folha12),
        fator_r_pct: pct(a.fatorR),
        anexo: a.anexo,
        faixa: a.faixa,
        aliquota_nominal_pct: pct(a.nominal),
        parcela_a_deduzir: a.deduzir,
        aliquota_efetiva_pct: pct(a.efetiva),
        das: a.das,
        vencimento: `${mesAnterior(mes, -1)}-20`,
        se_fosse_no_outro_anexo: a.alternativa
          ? { anexo: a.alternativa.anexo, aliquota_efetiva_pct: pct(a.alternativa.efetiva), das: a.alternativa.das }
          : null
      };
    }
  },
  {
    name: 'fator_r',
    description:
      'Fator R (folha de 12 meses ÷ receita de 12 meses) do mês e quanto a folha (por exemplo o pró-labore) precisaria crescer para chegar a 28% e o DAS cair do Anexo V para o III, com a economia estimada.',
    input_schema: { type: 'object', properties: { mes: MES } },
    executar(estado, { mes = C.mesAtual() } = {}) {
      const e = estado.empresa;
      if (e.regime === 'mei') return { aviso: 'MEI não usa Fator R.' };
      if (!e.fatorR) return { aviso: `A atividade cadastrada (Anexo ${e.anexo}) não depende do Fator R.` };
      const a = C.apuracao(estado, mes);
      const economiaMensal = a.anexo === 'V' && a.alternativa ? a.das - a.alternativa.das : 0;
      const folhaExtra = a.folhaQueFalta;
      return {
        mes,
        fator_r_pct: pct(a.fatorR),
        minimo_pct: pct(FATOR_R_MINIMO),
        anexo_atual: a.anexo,
        folha_12_meses: arred(a.folha12),
        receita_12_meses: arred(a.rbt12),
        folha_que_falta_em_12_meses: arred(folhaExtra),
        aumento_mensal_de_pro_labore_por_12_meses: arred(folhaExtra / 12),
        das_no_anexo_atual: a.das,
        das_no_outro_anexo: a.alternativa?.das,
        economia_de_das_no_mes: arred(economiaMensal),
        custo_extra_inss_do_socio_por_mes: arred((folhaExtra / 12) * 0.11),
        observacao:
          'O Fator R olha os 12 meses anteriores: subir o pró-labore agora melhora a média aos poucos. Sobre o pró-labore há INSS de 11% (e pode haver IRPF do sócio). Confirme a estratégia com a contabilidade.'
      };
    }
  },
  {
    name: 'simular_das',
    description:
      'Simula o DAS para uma receita mensal, com a receita de 12 meses (RBT12) e a folha mensal informadas ou as atuais.',
    input_schema: {
      type: 'object',
      properties: {
        receita_mensal: { type: 'number' },
        rbt12: { type: 'number', description: 'Receita dos últimos 12 meses. Se omitida, usa a da empresa.' },
        folha_mensal: {
          type: 'number',
          description: 'Folha mensal (salários + pró-labore + encargos). Se omitida, usa a média atual.'
        },
        anexo: { type: 'string', enum: ['I', 'II', 'III', 'IV', 'V'] }
      },
      required: ['receita_mensal']
    },
    executar(estado, { receita_mensal, rbt12, folha_mensal, anexo }) {
      const atual = C.apuracao(estado, C.mesAtual());
      const r12 = rbt12 || atual.rbt12 || receita_mensal * 12;
      const folha12 = folha_mensal != null ? folha_mensal * 12 : atual.folha12 || 0;
      const fatorR = r12 ? folha12 / r12 : 0;
      const e = estado.empresa;
      const anexoUsado = anexo || (e.fatorR ? (fatorR >= FATOR_R_MINIMO ? 'III' : 'V') : e.anexo);
      const a = aliquotaEfetiva(anexoUsado, r12);
      return {
        anexo: anexoUsado,
        nome_do_anexo: ANEXOS[anexoUsado].nome,
        rbt12: arred(r12),
        fator_r_pct: pct(fatorR),
        faixa: a.faixa,
        aliquota_efetiva_pct: pct(a.efetiva),
        das: arred(receita_mensal * a.efetiva)
      };
    }
  },
  {
    name: 'situacao_mei',
    description:
      'Para MEI: faturamento acumulado no ano, limite do ano, projeção até dezembro e o que acontece se passar do limite.',
    input_schema: { type: 'object', properties: { ano: { type: 'integer' } } },
    executar(estado, { ano = Number(hojeISO().slice(0, 4)) } = {}) {
      const receita = somar(
        estado.movimentos.filter(m => m.conta === 'receita-servicos' && m.data.startsWith(String(ano))),
        m => m.valor
      );
      const mesesPassados = ano === Number(hojeISO().slice(0, 4)) ? Number(hojeISO().slice(5, 7)) : 12;
      const projecao = (receita / Math.max(mesesPassados, 1)) * 12;
      const limite = MEI.limite(ano);
      return {
        ano,
        limite,
        faturamento_no_ano: arred(receita),
        uso_do_limite_pct: pct(receita / limite),
        projecao_ate_dezembro: arred(projecao),
        das_mei_mensal: MEI.das(ano, estado.empresa.atividadeMei),
        regras:
          'Até 20% acima do limite: paga DAS complementar sobre o excesso e vira ME no ano seguinte. Mais de 20% acima: o desenquadramento vale desde janeiro do próprio ano. Limites: R$ 81 mil em 2026, R$ 110 mil em 2027 e R$ 140 mil em 2028 (LC 238/2026).'
      };
    }
  },
  {
    name: 'obrigacoes',
    description:
      'Próximos vencimentos e declarações da empresa (DAS, FGTS Digital, DCTFWeb, DEFIS ou DASN-SIMEI), com o valor do DAS quando já apurado.',
    input_schema: { type: 'object', properties: { dias: { type: 'integer', minimum: 7, maximum: 400 } } },
    executar(estado, { dias = 45 } = {}) {
      return obrigacoes(estado, dias).map(o => ({
        data: o.data,
        em_dias: o.emDias,
        obrigacao: o.nome,
        valor: o.valor ? arred(o.valor) : null
      }));
    }
  },
  {
    name: 'plano_de_contas',
    description: 'Lista o plano de contas: código, nome, natureza (devedora ou credora) e se é grupo.',
    input_schema: { type: 'object', properties: {} },
    executar(estado) {
      return estado.plano.map(c => ({
        codigo: c.codigo,
        nome: c.nome,
        natureza: c.natureza || 'grupo',
        id: c.id || null
      }));
    }
  },
  {
    name: 'como_lancar',
    description:
      'Exemplos de lançamento (débito e crédito) para operações comuns: receber de cliente, pagar despesa, comprar computador, depreciação, apurar e pagar DAS, salários, pró-labore, distribuição de lucros, aporte de capital.',
    input_schema: { type: 'object', properties: { operacao: { type: 'string' } } },
    executar(estado, { operacao = '' } = {}) {
      const t = normalizar(operacao);
      const achadas = OPERACOES.filter(o => o.palavras.some(p => t.includes(p)));
      return (achadas.length ? achadas : OPERACOES).map(o => ({
        operacao: o.nome,
        lancamento: o.partidas.map(
          ([tipo, id]) =>
            `${tipo === 'D' ? 'Débito' : 'Crédito'}: ${estado.plano.find(c => c.id === id).codigo} ${estado.plano.find(c => c.id === id).nome}`
        ),
        explicacao: o.explicacao
      }));
    }
  },
  {
    name: 'a_classificar',
    description:
      'Movimentos do extrato que o agente não conseguiu classificar e ficaram em "Entradas a classificar" ou "Saídas a classificar".',
    input_schema: { type: 'object', properties: {} },
    executar(estado) {
      return estado.movimentos
        .filter(m => m.conta === 'despesa-a-classificar' || m.conta === 'receita-a-classificar')
        .map(m => ({ id: m.id, data: m.data, descricao: m.descricao, valor: m.valor }));
    }
  },
  {
    name: 'reclassificar',
    description:
      'Muda a conta de um movimento (pelo id ou por um trecho da descrição) e aplica aos outros do mesmo lugar. Use só quando a pessoa pedir.',
    input_schema: {
      type: 'object',
      properties: { id: { type: 'string' }, descricao: { type: 'string' }, conta: { type: 'string' } },
      required: ['conta']
    },
    muda: true,
    executar(estado, { id, descricao, conta }) {
      const c = acharConta(estado, conta);
      if (!c) return { erro: `Não achei a conta "${conta}".` };
      const m = id
        ? estado.movimentos.find(x => x.id === id)
        : estado.movimentos.find(x => normalizar(x.descricao).includes(normalizar(descricao || '')));
      if (!m) return { erro: 'Não achei o movimento.' };
      const r = reclassificar(m, c.id);
      return {
        feito: true,
        movimento: m.descricao,
        nova_conta: `${c.codigo} ${c.nome}`,
        movimentos_alterados: r.alterados,
        desfazer: { ferramenta: 'reclassificar', entrada: { id: m.id, conta: r.antes } }
      };
    }
  },
  // ---------- Gestão: panorama, comparações, clientes, limites e decisões ----------
  {
    name: 'visao_geral',
    description:
      'Panorama da empresa: resultado do último mês fechado comparado ao anterior, saldo no banco, próximo DAS, Fator R, movimentos sem conta e próximos vencimentos. Bom ponto de partida para "como está a empresa?".',
    input_schema: { type: 'object', properties: {} },
    executar(estado) {
      const mes = ultimoFechado();
      const d = C.dre(estado, C.periodoDoMes(mes));
      const dAnt = C.dre(estado, C.periodoDoMes(mesAnterior(mes)));
      const ap = C.apuracao(estado, mes);
      const atual = estado.empresa.regime === 'mei' ? null : C.apuracao(estado, C.mesAtual());
      return {
        ultimo_mes_fechado: mes,
        receita: arred(d.receitaBruta),
        lucro: arred(d.resultado),
        margem_pct: pct(d.margem),
        mes_anterior: { mes: mesAnterior(mes), receita: arred(dAnt.receitaBruta), lucro: arred(dAnt.resultado) },
        variacao_da_receita_pct: dAnt.receitaBruta ? pct(d.receitaBruta / dAnt.receitaBruta - 1) : null,
        saldo_no_banco_hoje: arred(C.saldoBanco(estado)),
        proximo_das: { competencia: mes, valor: ap.das, vencimento: `${mesAnterior(mes, -1)}-20` },
        fator_r_pct: atual && estado.empresa.fatorR ? pct(atual.fatorR) : null,
        anexo_do_mes_atual: atual?.anexo || null,
        movimentos_sem_conta: estado.movimentos.filter(m => A_CLASSIFICAR.has(m.conta)).length,
        proximos_vencimentos: obrigacoes(estado, 20)
          .slice(0, 4)
          .map(o => ({ data: o.data, obrigacao: o.nome, valor: o.valor ? arred(o.valor) : null }))
      };
    }
  },
  {
    name: 'comparar_periodos',
    description:
      'Compara a DRE de dois períodos (meses AAAA-MM ou anos AAAA): receita, DAS, custos, despesas, lucro e margem, e as contas que mais mudaram.',
    input_schema: {
      type: 'object',
      properties: {
        a: { type: 'string', description: 'Período base: AAAA-MM ou AAAA.' },
        b: { type: 'string', description: 'Período comparado: AAAA-MM ou AAAA.' }
      },
      required: ['a', 'b']
    },
    executar(estado, { a, b }) {
      const per = x => {
        const s = String(x);
        if (/^\d{4}$/.test(s)) return { ...C.periodoDoAno(Number(s)), rotulo: s };
        if (/^\d{4}-\d{2}$/.test(s)) return { ...C.periodoDoMes(s), rotulo: s };
        return null;
      };
      const pa = per(a);
      const pb = per(b);
      if (!pa || !pb) return { erro: 'Use períodos no formato AAAA-MM (mês) ou AAAA (ano).' };
      const da = C.dre(estado, pa);
      const db = C.dre(estado, pb);
      const linha = d => ({
        receita: arred(d.receitaBruta),
        das: arred(d.deducoes),
        custos: arred(d.custos),
        despesas_operacionais: arred(d.despesasOperacionais),
        lucro: arred(d.resultado),
        margem_pct: pct(d.margem)
      });
      const porConta = d => new Map(d.linhas.flatMap(l => l.detalhe || []).map(x => [x.conta.id, x]));
      const ma = porConta(da);
      const mb = porConta(db);
      const mudancas = [...new Set([...ma.keys(), ...mb.keys()])]
        .map(idConta => {
          const c = (ma.get(idConta) || mb.get(idConta)).conta;
          const va = ma.get(idConta)?.valor || 0;
          const vb = mb.get(idConta)?.valor || 0;
          return { conta: `${c.codigo} ${c.nome}`, valor_a: arred(va), valor_b: arred(vb), diferenca: arred(vb - va) };
        })
        .filter(x => x.diferenca)
        .sort((x, y) => Math.abs(y.diferenca) - Math.abs(x.diferenca))
        .slice(0, 6);
      return {
        periodo_a: pa.rotulo,
        periodo_b: pb.rotulo,
        a: linha(da),
        b: linha(db),
        contas_que_mais_mudaram: mudancas
      };
    }
  },
  {
    name: 'clientes_e_fornecedores',
    description:
      'Ranking de clientes (quem mais pagou à empresa) ou de fornecedores (com quem a empresa mais gastou, sem folha, impostos e lucros), com a participação de cada um. Mostra a concentração: quanto da receita depende do maior cliente. Padrão: últimos 12 meses fechados.',
    input_schema: {
      type: 'object',
      properties: {
        tipo: { type: 'string', enum: ['clientes', 'fornecedores'] },
        mes: { type: 'string', description: 'Mês AAAA-MM (opcional).' },
        ano: { type: 'integer' },
        limite: { type: 'integer', minimum: 1, maximum: 30 }
      }
    },
    executar(estado, { tipo = 'clientes', mes, ano, limite = 10 } = {}) {
      const p = mes || ano ? periodo({ mes, ano }) : ultimos12Meses();
      const deFornecedor = new Set(
        estado.plano
          .filter(c => ['custo', 'administrativa', 'comercial'].includes(c.dre) && c.id !== 'depreciacao')
          .map(c => c.id)
      );
      const filtro =
        tipo === 'fornecedores'
          ? m => deFornecedor.has(m.conta)
          : m => m.conta === 'receita-servicos' || m.conta === 'receita-a-classificar';
      const grupos = new Map();
      for (const m of estado.movimentos) {
        if (m.data < p.de || m.data > p.ate || !filtro(m)) continue;
        const nome = nomeDoParceiro(m.descricao);
        // Agrupa pelas duas primeiras palavras: "Clinica Viva" e "Clinica Viva Bem" são o mesmo cliente
        const chave = nome.split(' ').slice(0, 2).join(' ');
        const g = grupos.get(chave) || { nome: '', total: 0, movimentos: 0, ultimo: m.data, conta: m.conta };
        if (nome.length > g.nome.length) g.nome = nome;
        g.total += Math.abs(m.valor);
        g.movimentos += 1;
        if (m.data > g.ultimo) g.ultimo = m.data;
        grupos.set(chave, g);
      }
      const lista = [...grupos.values()].sort((x, y) => y.total - x.total);
      const total = somar(lista, g => g.total);
      const fatia = n => (total ? pct(somar(lista.slice(0, n), g => g.total) / total) : 0);
      return {
        tipo,
        periodo: p.rotulo,
        total: arred(total),
        quantidade: lista.length,
        participacao_do_maior_pct: fatia(1),
        participacao_dos_3_maiores_pct: fatia(3),
        lista: lista.slice(0, Math.min(Math.max(limite, 1), 30)).map(g => ({
          nome: g.nome,
          total: arred(g.total),
          participacao_pct: total ? pct(g.total / total) : 0,
          movimentos: g.movimentos,
          ultimo_movimento: g.ultimo,
          ...(tipo === 'fornecedores' ? { conta: estado.plano.find(c => c.id === g.conta)?.nome } : {})
        }))
      };
    }
  },
  {
    name: 'impostos_pagos',
    description:
      'Quanto a empresa pagou de impostos num ano (ou intervalo): DAS apurado mês a mês (por competência), encargos da folha (FGTS e INSS), alíquota média e carga sobre a receita. Mostra também quanto a mais saiu por meses no Anexo V.',
    input_schema: {
      type: 'object',
      properties: { ano: { type: 'integer' }, de: { type: 'string' }, ate: { type: 'string' } }
    },
    executar(estado, { ano, de, ate } = {}) {
      const p = de && ate ? periodo({ de, ate }) : periodo({ ano: ano || Number(hojeISO().slice(0, 4)) });
      const meses = C.mesesFechados(estado).filter(m => m >= p.de.slice(0, 7) && m <= p.ate.slice(0, 7));
      const porMes = meses.map(m => {
        const a = C.apuracao(estado, m);
        return {
          mes: m,
          receita: arred(a.receita),
          das: a.das,
          anexo: a.anexo || 'MEI',
          extra_por_estar_no_anexo_v: a.anexo === 'V' && a.alternativa ? arred(a.das - a.alternativa.das) : 0
        };
      });
      const receita = somar(porMes, x => x.receita);
      const das = somar(porMes, x => x.das);
      const encargos = -somar(
        estado.movimentos.filter(m => m.conta === 'encargos' && m.data >= p.de && m.data <= p.ate),
        m => m.valor
      );
      return {
        periodo: p.rotulo,
        meses_apurados: porMes.length,
        receita: arred(receita),
        das_total: arred(das),
        aliquota_media_do_das_pct: receita ? pct(das / receita) : 0,
        encargos_da_folha_pagos: arred(encargos),
        carga_total_sobre_a_receita_pct: receita ? pct((das + encargos) / receita) : 0,
        meses_no_anexo_v: porMes.filter(x => x.anexo === 'V').length,
        das_a_mais_por_meses_no_anexo_v: arred(somar(porMes, x => x.extra_por_estar_no_anexo_v)),
        por_mes: porMes,
        observacao:
          'DAS por competência (o do mês é pago no dia 20 do mês seguinte). No Simples, o INSS patronal está dentro do DAS (exceto no Anexo IV).'
      };
    }
  },
  {
    name: 'limite_do_simples',
    description:
      'Faturamento do ano, projeção até dezembro e a folga até o sublimite de R$ 3,6 milhões (ISS/ICMS fora do DAS) e o limite de R$ 4,8 milhões do Simples Nacional, com as regras de desenquadramento.',
    input_schema: { type: 'object', properties: {} },
    executar(estado) {
      if (estado.empresa.regime === 'mei') return { aviso: 'A empresa é MEI: use situacao_mei para o limite do MEI.' };
      const ano = Number(hojeISO().slice(0, 4));
      const receitaDoAno = somar(
        estado.movimentos.filter(m => m.conta === 'receita-servicos' && m.data.startsWith(String(ano))),
        m => m.valor
      );
      const fechados = C.mesesFechados(estado).filter(m => m.startsWith(String(ano)));
      const receitaFechados = somar(fechados, m => C.receitaDoMes(estado, m));
      const projecao = fechados.length ? (receitaFechados / fechados.length) * 12 : receitaDoAno;
      return {
        ano,
        faturamento_no_ano_ate_hoje: arred(receitaDoAno),
        projecao_ate_dezembro: arred(projecao),
        rbt12_atual: arred(C.apuracao(estado, C.mesAtual()).rbt12),
        sublimite_iss_icms: SUBLIMITE_ICMS_ISS,
        limite_do_simples: LIMITE_SIMPLES,
        uso_do_limite_pct: pct(projecao / LIMITE_SIMPLES),
        folga_ate_o_sublimite: arred(SUBLIMITE_ICMS_ISS - projecao),
        folga_ate_o_limite: arred(LIMITE_SIMPLES - projecao),
        regras:
          'O limite vale para a receita do ano-calendário. Passando de R$ 3,6 milhões, ISS e ICMS saem do DAS a partir do ano seguinte (ou já no mês seguinte, se passar mais de 20%). Passando de R$ 4,8 milhões, a empresa é excluída do Simples a partir do ano seguinte; se passar mais de 20% (R$ 5,76 milhões), a exclusão vale já a partir do mês seguinte ao excesso. Confirme com a contabilidade.'
      };
    }
  },
  {
    name: 'ponto_de_equilibrio',
    description:
      'Faturamento mínimo por mês para não ter prejuízo, pela média dos últimos meses fechados: margem de contribuição (receita menos DAS e custo dos serviços), despesas fixas e margem de segurança.',
    input_schema: { type: 'object', properties: { meses: { type: 'integer', minimum: 1, maximum: 12 } } },
    executar(estado, { meses = 3 } = {}) {
      const m = mediaMensal(estado, meses);
      if (!m) return { erro: 'Ainda não há meses fechados para calcular.' };
      const margem = 1 - m.variaveisPct;
      const pe = margem > 0 ? m.fixas / margem : null;
      return {
        meses_considerados: m.meses,
        receita_media_mensal: arred(m.receita),
        custos_variaveis_pct: pct(m.variaveisPct),
        margem_de_contribuicao_pct: pct(margem),
        despesas_fixas_por_mes: arred(m.fixas),
        ponto_de_equilibrio_mensal: pe == null ? null : arred(pe),
        margem_de_seguranca_pct: pe && m.receita ? pct((m.receita - pe) / m.receita) : null,
        observacao:
          'Considera como variáveis o DAS e o custo dos serviços (terceiros, nuvem); pessoal, administrativas, comerciais e financeiras como fixas. A alíquota do DAS muda com a faixa e o anexo.'
      };
    }
  },
  {
    name: 'simular_contratacao',
    description:
      'Estima o custo mensal de contratar funcionários CLT (salário, 13º, férias com 1/3, FGTS e, quando houver, INSS patronal) e o efeito da nova folha no Fator R e no DAS.',
    input_schema: {
      type: 'object',
      properties: {
        salario_mensal: { type: 'number', description: 'Salário bruto mensal de cada pessoa, em reais.' },
        quantidade: { type: 'integer', minimum: 1, maximum: 50 }
      },
      required: ['salario_mensal']
    },
    executar(estado, { salario_mensal, quantidade = 1 }) {
      if (!(salario_mensal > 0)) return { erro: 'Informe o salário mensal.' };
      const e = estado.empresa;
      const mei = e.regime === 'mei';
      const salarios = salario_mensal * quantidade;
      const decimo = salarios / 12;
      const ferias = (salarios / 12) * (4 / 3);
      const base = salarios + decimo + ferias;
      const fgts = base * 0.08;
      // MEI paga 3% de INSS patronal; no Simples só o Anexo IV paga o INSS patronal fora do DAS (cerca de 20% + RAT)
      const inss = mei ? base * 0.03 : e.anexo === 'IV' ? base * 0.22 : 0;
      const custo = base + fgts + inss;
      let efeito = null;
      if (!mei && e.fatorR) {
        const a = C.apuracao(estado, C.mesAtual());
        if (a.rbt12) {
          const fatorDepois = (a.folha12 + custo * 12) / a.rbt12;
          const anexoDepois = fatorDepois >= FATOR_R_MINIMO ? 'III' : 'V';
          const receitaMedia = a.rbt12 / 12;
          const dasHoje = receitaMedia * aliquotaEfetiva(a.anexo, a.rbt12).efetiva;
          const dasDepois = receitaMedia * aliquotaEfetiva(anexoDepois, a.rbt12).efetiva;
          efeito = {
            fator_r_hoje_pct: pct(a.fatorR),
            fator_r_depois_de_12_meses_pct: pct(fatorDepois),
            anexo_hoje: a.anexo,
            anexo_depois: anexoDepois,
            das_mensal_medio_hoje: arred(dasHoje),
            das_mensal_medio_depois: arred(dasDepois),
            economia_de_das_por_mes: arred(dasHoje - dasDepois)
          };
        }
      }
      return {
        salario_mensal,
        quantidade,
        custo_mensal_total: arred(custo),
        custo_por_real_de_salario: arred(custo / salarios),
        composicao: {
          salarios: arred(salarios),
          provisao_13o: arred(decimo),
          provisao_ferias_com_terco: arred(ferias),
          fgts: arred(fgts),
          inss_patronal: arred(inss)
        },
        efeito_no_simples: efeito,
        custo_liquido_por_mes: arred(custo - (efeito?.economia_de_das_por_mes || 0)),
        observacao: `Estimativa sem vale-transporte, refeição, plano de saúde e outros benefícios. ${mei ? 'O MEI pode ter um empregado, com salário mínimo ou o piso da categoria.' : 'Nos Anexos III e V o INSS patronal já está no DAS.'} O Fator R melhora aos poucos: a folha nova entra na média dos 12 meses mês a mês.`
      };
    }
  },
  {
    name: 'distribuicao_de_lucros',
    description:
      'Quanto a empresa já distribuiu de lucros no ano, quanto ainda há de lucro acumulado para distribuir e quanto cabe no caixa hoje, guardando o DAS a recolher e um mês de despesas. Inclui as regras de tributação de dividendos.',
    input_schema: { type: 'object', properties: { ano: { type: 'integer' } } },
    executar(estado, { ano = Number(hojeISO().slice(0, 4)) } = {}) {
      const b = C.balanco(estado, hojeISO());
      const linhaPL = inicio => b.pl.find(l => l.rotulo.startsWith(inicio))?.valor || 0;
      const lucroAcumulado = linhaPL('Lucros acumulados') + linhaPL('Resultado de');
      const jaDistribuido = -linhaPL('(−) Lucros');
      const disponivel = lucroAcumulado - jaDistribuido;
      const doAno = estado.movimentos.filter(m => m.conta === 'distribuicao' && m.data.startsWith(String(ano)));
      const porMes = {};
      for (const m of doAno) porMes[mesDe(m.data)] = (porMes[mesDe(m.data)] || 0) + Math.abs(m.valor);
      const maior = Object.entries(porMes).sort((x, y) => y[1] - x[1])[0];
      const media = mediaMensal(estado, 3);
      const umMes = media ? media.fixas + media.custos : 0;
      const dasARecolher = b.passivo.find(l => l.rotulo.startsWith('Simples'))?.valor || 0;
      const saldo = C.saldoBanco(estado);
      const cabeNoCaixa = Math.max(saldo - dasARecolher - umMes, 0);
      return {
        ano,
        lucro_acumulado_ate_hoje: arred(lucroAcumulado),
        ja_distribuido_no_total: arred(jaDistribuido),
        distribuido_no_ano: arred(somar(Object.values(porMes))),
        disponivel_pelo_lucro: arred(disponivel),
        saldo_no_banco: arred(saldo),
        reserva_sugerida: { das_a_recolher: arred(dasARecolher), um_mes_de_custos_e_despesas: arred(umMes) },
        cabe_no_caixa: arred(cabeNoCaixa),
        da_para_distribuir_hoje: arred(Math.max(Math.min(disponivel, cabeNoCaixa), 0)),
        maior_distribuicao_mensal_no_ano: maior ? { mes: maior[0], valor: arred(maior[1]) } : null,
        regras:
          'Lucro distribuído ao sócio é isento de IR quando a contabilidade comprova o lucro. Desde 2026 (Lei 15.270/2025), se a empresa paga mais de R$ 50 mil num mês à mesma pessoa física, há retenção de 10% de IR sobre o valor pago no mês. Confirme valores e datas com a contabilidade.'
      };
    }
  },
  {
    name: 'fechamento_do_mes',
    description:
      'Checklist de fechamento de um mês: extrato classificado, balancete fechando, DAS apurado e pago, folha e pró-labore lançados e as obrigações da competência que ainda vão vencer.',
    input_schema: { type: 'object', properties: { mes: MES } },
    executar(estado, { mes = ultimoFechado() } = {}) {
      const itens = [];
      const item = (nome, situacao, detalhe) => itens.push({ item: nome, situacao, detalhe });
      const doMes = estado.movimentos.filter(m => mesDe(m.data) === mes);
      const semConta = doMes.filter(m => A_CLASSIFICAR.has(m.conta));
      if (!doMes.length) item('Extrato do mês importado', 'pendente', 'Nenhum movimento neste mês.');
      else
        item(
          'Movimentos classificados',
          semConta.length ? 'pendente' : 'ok',
          semConta.length
            ? `${semConta.length} de ${doMes.length} movimentos ainda sem conta.`
            : `${doMes.length} movimentos, todos com conta.`
        );
      const bal = C.balancete(estado, { ate: C.fimDoMes(mes) });
      const fecha = Math.abs(bal.totalDebitos - bal.totalCreditos) < 0.01;
      item(
        'Balancete fechando',
        fecha ? 'ok' : 'pendente',
        fecha ? 'Débitos iguais aos créditos.' : 'Débitos e créditos diferentes.'
      );
      const ap = C.apuracao(estado, mes);
      const vencimento = `${mesAnterior(mes, -1)}-20`;
      const pago = estado.movimentos.some(m => mesDe(m.data) === mesAnterior(mes, -1) && m.conta === 'das-a-recolher');
      item(
        `DAS de ${mes.slice(5)}/${mes.slice(0, 4)}`,
        pago ? 'ok' : hojeISO() <= vencimento ? 'a vencer' : 'pendente',
        `${dinheiro(ap.das)}, vence em ${vencimento.slice(8)}/${vencimento.slice(5, 7)}${pago ? ' (pago)' : ''}.`
      );
      for (const [idConta, nome] of [
        ['salarios', 'Salários'],
        ['prolabore', 'Pró-labore']
      ]) {
        if (!estado.movimentos.some(m => m.conta === idConta)) continue;
        const noMes = doMes.some(m => m.conta === idConta);
        item(nome, noMes ? 'ok' : 'pendente', noMes ? 'Lançado no mês.' : 'Nenhum pagamento neste mês.');
      }
      const competencia = `${mes.slice(5)}/${mes.slice(0, 4)}`;
      for (const o of obrigacoes(estado, 75).filter(o => o.nome.includes(competencia) && !/^DAS/.test(o.nome)))
        item(o.nome, 'a vencer', `Vence em ${o.data.slice(8)}/${o.data.slice(5, 7)}.`);
      return { mes, pendentes: itens.filter(i => i.situacao === 'pendente').length, itens };
    }
  }
];

export const ferramenta = nome => FERRAMENTAS.find(f => f.name === nome);
