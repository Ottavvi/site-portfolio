// Ferramentas do agente: o que ele sabe consultar (e, em dois casos, mudar) nos dados.
// São as mesmas para o agente local e para o modo Claude: no modo Claude, o modelo escolhe qual chamar e com quais
// parâmetros; no local, o interpretador de perguntas faz essa escolha.
import * as A from './analise.js';
import { mudou } from './estado.js';
import { hojeISO, id, mesDe, normalizar, somar } from './util.js';

const arred = v => Math.round(v * 100) / 100;
const MES = {
  type: 'string',
  description: 'Mês no formato AAAA-MM. Se omitido, o mês atual.'
};

export function acharCategoria(estado, texto) {
  if (!texto) return null;
  const t = normalizar(texto);
  return (
    estado.categorias.find(c => c.id === t) ||
    estado.categorias.find(c => normalizar(c.nome) === t) ||
    estado.categorias.find(c => normalizar(c.nome).includes(t) || t.includes(normalizar(c.nome))) ||
    null
  );
}

const transacaoSimples = (estado, t) => ({
  data: t.data,
  descricao: t.descricao,
  valor: t.valor,
  categoria: estado.categorias.find(c => c.id === t.categoria)?.nome || t.categoria
});

export const FERRAMENTAS = [
  {
    name: 'resumo_do_mes',
    description:
      'Entradas, saídas, resultado (entradas menos saídas) e gastos por categoria de um mês, com a média dos 3 meses anteriores de cada categoria. Valores guardados em aplicação não contam como gasto.',
    input_schema: { type: 'object', properties: { mes: MES } },
    executar(estado, { mes = A.mesAtual() } = {}) {
      const r = A.resumoDoMes(estado, mes);
      return {
        mes,
        entradas: arred(r.entradas),
        saidas: arred(r.saidas),
        resultado: arred(r.resultado),
        guardado_em_aplicacao: arred(r.guardado),
        saldo_no_fim_do_mes: arred(r.saldoFinal),
        gastos_por_categoria: r.porCategoria.map(l => ({
          categoria: l.categoria.nome,
          total: arred(l.total),
          media_3_meses_anteriores: arred(l.mediaAnterior),
          orcamento: l.orcamento || null
        })),
        entradas_por_categoria: r.entradasPorCategoria.map(l => ({
          categoria: l.categoria.nome,
          total: arred(l.total)
        }))
      };
    }
  },
  {
    name: 'buscar_transacoes',
    description:
      'Procura transações por texto da descrição, categoria, período, tipo e valor mínimo. Devolve o total e até 40 transações (as maiores primeiro, se ordenar_por_valor for verdadeiro).',
    input_schema: {
      type: 'object',
      properties: {
        busca: {
          type: 'string',
          description: 'Trecho da descrição, por exemplo "mercadinho" ou "streamflix".'
        },
        categoria: {
          type: 'string',
          description: 'Nome da categoria, por exemplo "Mercado" ou "Transporte".'
        },
        mes: MES,
        de: { type: 'string', description: 'Data inicial AAAA-MM-DD.' },
        ate: { type: 'string', description: 'Data final AAAA-MM-DD.' },
        tipo: {
          type: 'string',
          enum: ['saida', 'entrada'],
          description: 'Só gastos ou só entradas.'
        },
        minimo: {
          type: 'number',
          description: 'Valor mínimo (em reais, sem sinal).'
        },
        ordenar_por_valor: { type: 'boolean' }
      }
    },
    executar(estado, entrada = {}) {
      const categoria = acharCategoria(estado, entrada.categoria);
      let lista = A.filtrar(estado, { ...entrada, categoria: categoria?.id });
      if (entrada.ordenar_por_valor) lista = [...lista].sort((a, b) => Math.abs(b.valor) - Math.abs(a.valor));
      else lista = [...lista].reverse();
      return {
        quantidade: lista.length,
        total: arred(somar(lista, t => t.valor)),
        transacoes: lista.slice(0, 40).map(t => transacaoSimples(estado, t))
      };
    }
  },
  {
    name: 'evolucao_mensal',
    description:
      'Entradas, saídas e resultado de cada um dos últimos meses (até 13), do mais antigo para o mais recente.',
    input_schema: {
      type: 'object',
      properties: { meses: { type: 'integer', minimum: 2, maximum: 13 } }
    },
    executar(estado, { meses = 6 } = {}) {
      return A.serieMensal(estado, Math.min(Math.max(meses, 2), 13)).map(m => ({
        mes: m.mes,
        entradas: arred(m.entradas),
        saidas: arred(m.saidas),
        resultado: arred(m.resultado)
      }));
    }
  },
  {
    name: 'contas_recorrentes',
    description:
      'Gastos e entradas que se repetem todo mês (aluguel, assinaturas, salário...), com valor médio, dia de costume, custo por ano e se é nova (começou há menos de 75 dias).',
    input_schema: { type: 'object', properties: {} },
    executar(estado) {
      return A.recorrentes(estado).map(r => ({
        nome: r.nome,
        tipo: r.entrada ? 'entrada' : 'gasto',
        categoria: estado.categorias.find(c => c.id === r.categoria)?.nome,
        valor_medio: arred(r.valorMedio),
        valor_varia: r.variavel,
        dia_de_costume: r.diaTipico,
        por_ano: arred(r.porAno),
        desde: r.desde,
        nova: r.nova
      }));
    }
  },
  {
    name: 'previsao_de_saldo',
    description:
      'Previsão do saldo da conta para os próximos dias, a partir do saldo de hoje, das contas recorrentes e da média de gastos variáveis. Mostra o menor saldo previsto e quando ele acontece. No cenário conservador, não conta com entradas variáveis (clientes, extras).',
    input_schema: {
      type: 'object',
      properties: {
        dias: { type: 'integer', minimum: 7, maximum: 120 },
        conservador: { type: 'boolean' }
      }
    },
    executar(estado, { dias = 60, conservador = false } = {}) {
      const p = A.previsao(estado, Math.min(Math.max(dias, 7), 120), {
        comEntradasVariaveis: !conservador
      });
      const fimDeMes = p.serie.filter((ponto, i) => {
        const proximo = p.serie[i + 1];
        return !proximo || mesDe(proximo.data) !== mesDe(ponto.data);
      });
      return {
        saldo_hoje: arred(p.serie[0].saldo),
        menor_saldo: arred(p.menor.saldo),
        data_do_menor_saldo: p.menor.data,
        saldo_final: arred(p.final),
        saldo_no_fim_de_cada_mes: fimDeMes.map(ponto => ({
          data: ponto.data,
          saldo: arred(ponto.saldo)
        })),
        gasto_variavel_por_mes: arred(p.gastoVariavelMensal),
        entrada_variavel_por_mes_considerada: conservador ? 0 : arred(p.entradaVariavelMensal),
        proximos_lancamentos_fixos: p.eventos
          .slice(0, 12)
          .map(e => ({ data: e.data, nome: e.nome, valor: arred(e.valor) }))
      };
    }
  },
  {
    name: 'orcamentos',
    description:
      'Orçamento de cada categoria no mês: limite, quanto já foi gasto, projeção para o fim do mês e situação (ok, risco ou estourou).',
    input_schema: { type: 'object', properties: { mes: MES } },
    executar(estado, { mes = A.mesAtual() } = {}) {
      return A.orcamentos(estado, mes).map(o => ({
        categoria: o.categoria.nome,
        limite: o.limite,
        gasto: arred(o.gasto),
        projecao_fim_do_mes: arred(o.projecao),
        situacao: o.situacao
      }));
    }
  },
  {
    name: 'metas',
    description:
      'Metas de dinheiro guardado: alvo, quanto já tem, prazo, quanto precisa guardar por mês e se isso cabe na sobra média dos últimos 6 meses.',
    input_schema: { type: 'object', properties: {} },
    executar(estado) {
      const sobra = A.serieMensal(estado, 6).map(m => m.resultado);
      return {
        sobra_media_por_mes: arred(sobra.reduce((a, b) => a + b, 0) / sobra.length),
        metas: A.metas(estado).map(m => ({
          nome: m.nome,
          alvo: m.alvo,
          guardado: m.guardado,
          prazo: m.prazo,
          falta: arred(m.falta),
          precisa_por_mes: arred(m.porMes),
          cabe_na_sobra_media: m.cabe
        }))
      };
    }
  },
  {
    name: 'posso_gastar',
    description:
      'Avalia se dá para fazer um gasto agora: simula o saldo dos próximos 45 dias com o gasto e confere o orçamento da categoria. Responde sim, cuidado ou não.',
    input_schema: {
      type: 'object',
      properties: {
        valor: { type: 'number', description: 'Valor do gasto em reais.' },
        categoria: { type: 'string' }
      },
      required: ['valor']
    },
    executar(estado, { valor, categoria }) {
      const c = acharCategoria(estado, categoria);
      const r = A.podeGastar(estado, valor, c?.id);
      return {
        resposta: r.resposta,
        menor_saldo_depois_do_gasto: arred(r.menorDepois),
        data_do_menor_saldo: r.dataDoMenor,
        categoria: c?.nome || null,
        folga_no_orcamento_da_categoria: r.folgaOrcamento == null ? null : arred(r.folgaOrcamento)
      };
    }
  },
  {
    name: 'alertas',
    description:
      'Alertas do mês: saldo que pode ficar negativo, orçamentos estourados ou em risco, gastos fora do comum, contas novas e categorias que subiram muito.',
    input_schema: { type: 'object', properties: { mes: MES } },
    executar(estado, { mes = A.mesAtual() } = {}) {
      return A.alertas(estado, mes);
    }
  },
  {
    name: 'definir_orcamento',
    description: 'Muda o orçamento mensal de uma categoria de gasto. Use só quando a pessoa pedir.',
    input_schema: {
      type: 'object',
      properties: {
        categoria: { type: 'string' },
        valor: {
          type: 'number',
          description: 'Novo limite mensal em reais (0 tira o orçamento).'
        }
      },
      required: ['categoria', 'valor']
    },
    muda: true,
    executar(estado, { categoria, valor }) {
      const c = acharCategoria(estado, categoria);
      if (!c || c.tipo !== 'saida') return { erro: `Não achei a categoria de gasto "${categoria}".` };
      const anterior = c.orcamento || 0;
      c.orcamento = Math.max(0, Math.round(valor));
      mudou();
      return {
        feito: true,
        categoria: c.nome,
        anterior,
        novo: c.orcamento,
        desfazer: {
          ferramenta: 'definir_orcamento',
          entrada: { categoria: c.nome, valor: anterior }
        }
      };
    }
  },
  {
    name: 'criar_meta',
    description: 'Cria uma meta de dinheiro guardado. Use só quando a pessoa pedir.',
    input_schema: {
      type: 'object',
      properties: {
        nome: { type: 'string' },
        alvo: { type: 'number' },
        prazo: { type: 'string', description: 'Data AAAA-MM-DD.' },
        guardado: {
          type: 'number',
          description: 'Quanto já tem guardado para ela.'
        }
      },
      required: ['nome', 'alvo', 'prazo']
    },
    muda: true,
    executar(estado, { nome, alvo, prazo, guardado = 0 }) {
      if (!(alvo > 0) || !/^\d{4}-\d{2}-\d{2}$/.test(prazo) || prazo <= hojeISO())
        return {
          erro: 'Preciso de um valor maior que zero e um prazo no futuro.'
        };
      const meta = { id: id(), nome, alvo, guardado, prazo };
      estado.metas.push(meta);
      mudou();
      return { feito: true, meta };
    }
  }
];

export const ferramenta = nome => FERRAMENTAS.find(f => f.name === nome);
