// Comparador de regimes: MEI, Simples Nacional e Lucro Presumido (estimativa mensal).
// Simplificações, todas mostradas na tela:
// - Receita e folha iguais todos os meses (RBT12 = faturamento do mês × 12).
// - Lucro Presumido de serviços: presunção de 32% para IRPJ e CSLL, PIS 0,65%, COFINS 3%, ISS de 3%
//   (varia de 2% a 5% por município) e INSS patronal de 20% sobre a folha (sem RAT e terceiros).
// - Comércio e indústria no Presumido dependem do ICMS de cada produto: o comparador não estima.
import { ANEXOS, MEI, aliquotaEfetiva, anexoPeloFatorR, FATOR_R_MINIMO, LIMITE_SIMPLES } from './impostos.js';

export const ATIVIDADES = {
  comercio: { nome: 'Comércio (loja, e-commerce)', anexo: 'I', mei: 'comercio', presumido: false },
  industria: { nome: 'Indústria e fabricação', anexo: 'II', mei: 'comercio', presumido: false },
  servicos: { nome: 'Serviços gerais (salão, oficina, academia)', anexo: 'III', mei: 'servicos', presumido: true },
  intelectual: {
    nome: 'Serviços intelectuais (TI, consultoria, engenharia)',
    anexo: 'V',
    fatorR: true,
    mei: null,
    presumido: true
  },
  obras: { nome: 'Obras, limpeza e vigilância', anexo: 'IV', mei: 'servicos', presumido: true }
};

const ISS = 0.03;
const CPP = 0.2;

export function comparar(atividadeId, faturamento, folha, ano = 2026) {
  const at = ATIVIDADES[atividadeId];
  const rbt12 = faturamento * 12;
  const resultado = [];

  // MEI
  const limiteMei = MEI.limite(ano);
  if (!at.mei) {
    resultado.push({
      id: 'mei',
      nome: 'MEI',
      disponivel: false,
      motivo: 'Atividades intelectuais (TI, consultoria, engenharia) não podem ser MEI.'
    });
  } else if (rbt12 > limiteMei) {
    resultado.push({
      id: 'mei',
      nome: 'MEI',
      disponivel: false,
      motivo: `Faturamento de ${moeda(rbt12)} por ano passa do limite de ${moeda(limiteMei)} do MEI.`
    });
  } else {
    const das = MEI.das(ano, at.mei);
    resultado.push({
      id: 'mei',
      nome: 'MEI',
      disponivel: true,
      mensal: das,
      linhas: [['DAS-MEI (valor fixo)', das]],
      nota: 'Pode ter no máximo 1 empregado. INSS do dono já incluso no DAS.'
    });
  }

  // Simples
  if (rbt12 > LIMITE_SIMPLES) {
    resultado.push({
      id: 'simples',
      nome: 'Simples Nacional',
      disponivel: false,
      motivo: 'Acima de R$ 4,8 milhões por ano a empresa não pode ficar no Simples.'
    });
  } else {
    const fatorR = faturamento > 0 ? folha / faturamento : 0;
    const anexo = anexoPeloFatorR(at.anexo, !!at.fatorR, fatorR);
    const ef = aliquotaEfetiva(anexo, rbt12);
    const das = faturamento * ef.efetiva;
    const linhas = [[`DAS no ${ANEXOS[anexo].nome.split(' (')[0]}, alíquota de ${pct(ef.efetiva)}`, das]];
    if (anexo === 'IV') linhas.push(['INSS patronal (fora do DAS no Anexo IV)', folha * CPP]);
    const item = {
      id: 'simples',
      nome: 'Simples Nacional',
      disponivel: true,
      mensal: linhas.reduce((s, l) => s + l[1], 0),
      linhas,
      anexo
    };
    if (at.fatorR) {
      item.fatorR = fatorR;
      if (anexo === 'V') {
        const folhaNecessaria = faturamento * FATOR_R_MINIMO;
        const efIII = aliquotaEfetiva('III', rbt12);
        // no Anexo III o INSS patronal já está no DAS; o custo extra é o INSS de 11% do sócio sobre o pró-labore a mais
        const economia = das - faturamento * efIII.efetiva - (folhaNecessaria - folha) * 0.11;
        item.dica = { folhaNecessaria, aumento: folhaNecessaria - folha, economia };
      }
    }
    resultado.push(item);
  }

  // Lucro Presumido
  if (!at.presumido) {
    resultado.push({
      id: 'presumido',
      nome: 'Lucro Presumido',
      disponivel: false,
      motivo: 'Para comércio e indústria, a conta depende do ICMS de cada produto. Fazemos essa simulação na reunião.'
    });
  } else {
    const base = faturamento * 0.32;
    const irpj = base * 0.15 + Math.max(0, base - 20000) * 0.1;
    const csll = base * 0.09;
    const pis = faturamento * 0.0065;
    const cofins = faturamento * 0.03;
    const iss = faturamento * ISS;
    const inss = folha * CPP;
    const linhas = [
      ['IRPJ (15% sobre 32% da receita, + adicional)', irpj],
      ['CSLL (9% sobre 32% da receita)', csll],
      ['PIS e COFINS (3,65%)', pis + cofins],
      ['ISS (3%, varia por cidade)', iss],
      ['INSS patronal (20% da folha)', inss]
    ];
    resultado.push({
      id: 'presumido',
      nome: 'Lucro Presumido',
      disponivel: true,
      mensal: linhas.reduce((s, l) => s + l[1], 0),
      linhas
    });
  }

  const disponiveis = resultado.filter(r => r.disponivel);
  const menor = disponiveis.reduce((m, r) => (!m || r.mensal < m.mensal ? r : m), null);
  if (menor) menor.melhor = true;
  for (const r of disponiveis) r.percentual = faturamento ? r.mensal / faturamento : 0;
  return resultado;
}

export function moeda(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}
export function pct(v) {
  return `${(v * 100).toFixed(2).replace('.', ',')}%`;
}
