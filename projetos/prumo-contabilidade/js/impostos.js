// Simples Nacional e MEI: tabelas, alíquota efetiva, Fator R e limites.
// Tabelas dos Anexos I a V da LC 123/2006 (redação da LC 155/2016), em vigor em 2026.
// MEI: limite de R$ 81 mil em 2026; a LC 238/2026 sobe para R$ 110 mil em 2027 e R$ 140 mil em 2028.
// DAS-MEI 2026: 5% do salário mínimo (R$ 1.621) = R$ 81,05, mais R$ 1 de ICMS e/ou R$ 5 de ISS.

// [limite superior da faixa, alíquota nominal, parcela a deduzir]
export const ANEXOS = {
  I: {
    nome: 'Anexo I (comércio)',
    faixas: [
      [180000, 0.04, 0],
      [360000, 0.073, 5940],
      [720000, 0.095, 13860],
      [1800000, 0.107, 22500],
      [3600000, 0.143, 87300],
      [4800000, 0.19, 378000]
    ]
  },
  II: {
    nome: 'Anexo II (indústria)',
    faixas: [
      [180000, 0.045, 0],
      [360000, 0.078, 5940],
      [720000, 0.1, 13860],
      [1800000, 0.112, 22500],
      [3600000, 0.147, 85500],
      [4800000, 0.3, 720000]
    ]
  },
  III: {
    nome: 'Anexo III (serviços)',
    faixas: [
      [180000, 0.06, 0],
      [360000, 0.112, 9360],
      [720000, 0.135, 17640],
      [1800000, 0.16, 35640],
      [3600000, 0.21, 125640],
      [4800000, 0.33, 648000]
    ]
  },
  IV: {
    nome: 'Anexo IV (serviços: construção, limpeza, vigilância, advocacia)',
    faixas: [
      [180000, 0.045, 0],
      [360000, 0.09, 8100],
      [720000, 0.102, 12420],
      [1800000, 0.14, 39780],
      [3600000, 0.22, 183780],
      [4800000, 0.33, 828000]
    ]
  },
  V: {
    nome: 'Anexo V (serviços intelectuais e técnicos)',
    faixas: [
      [180000, 0.155, 0],
      [360000, 0.18, 4500],
      [720000, 0.195, 9900],
      [1800000, 0.205, 17100],
      [3600000, 0.23, 62100],
      [4800000, 0.305, 540000]
    ]
  }
};
export const LIMITE_SIMPLES = 4800000;
export const SUBLIMITE_ICMS_ISS = 3600000;
export const FATOR_R_MINIMO = 0.28;

export const MEI = {
  limitePorAno: { 2026: 81000, 2027: 110000, 2028: 140000 },
  salarioMinimo: { 2025: 1518, 2026: 1621 },
  adicional: { comercio: 1, servicos: 5, ambos: 6 },
  // Valor do DAS-MEI no ano: 5% do salário mínimo + ICMS (R$ 1) e/ou ISS (R$ 5)
  das(ano, atividade) {
    const minimo = this.salarioMinimo[ano] || this.salarioMinimo[2026];
    return Math.round((minimo * 0.05 + this.adicional[atividade]) * 100) / 100;
  },
  limite(ano) {
    return this.limitePorAno[ano] || (ano < 2026 ? 81000 : this.limitePorAno[2028]);
  }
};

// Alíquota efetiva = (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12
export function aliquotaEfetiva(anexo, rbt12) {
  const tabela = ANEXOS[anexo].faixas;
  if (rbt12 <= 0) return { faixa: 1, nominal: tabela[0][1], deduzir: 0, efetiva: tabela[0][1] };
  let i = tabela.findIndex(([limite]) => rbt12 <= limite);
  if (i < 0) i = tabela.length - 1; // acima de R$ 4,8 milhões a empresa sai do Simples; a conta usa a última faixa
  const [, nominal, deduzir] = tabela[i];
  return { faixa: i + 1, nominal, deduzir, efetiva: (rbt12 * nominal - deduzir) / rbt12 };
}

// Anexo aplicado: atividades sujeitas ao Fator R vão para o III quando a folha dos 12 meses é 28% ou mais da receita
export function anexoPeloFatorR(anexoBase, sujeitaFatorR, fatorR) {
  if (!sujeitaFatorR) return anexoBase;
  return fatorR >= FATOR_R_MINIMO ? 'III' : 'V';
}

// Quanto a folha de 12 meses precisa crescer para chegar a 28% da receita de 12 meses
export function folhaQueFalta(rbt12, folha12) {
  return Math.max(rbt12 * FATOR_R_MINIMO - folha12, 0);
}
