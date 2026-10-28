// Ferramentas do agente contábil: as mesmas para o agente local e para o modo Claude.
import * as C from './contabil.js';
import { aliquotaEfetiva, ANEXOS, FATOR_R_MINIMO, MEI } from './impostos.js';
import { obrigacoes } from './obrigacoes.js';
import { OPERACOES } from './plano.js';
import { reclassificar } from './estado.js';
import { hojeISO, mesAnterior, mesDe, normalizar, somar } from './util.js';

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
        minimo_pct: FATOR_R_MINIMO * 100,
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
  }
];

export const ferramenta = nome => FERRAMENTAS.find(f => f.name === nome);
