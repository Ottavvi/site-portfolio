// Empresa de exemplo: uma pequena empresa de desenvolvimento de software no Simples Nacional, com dois
// funcionários e um sócio que recebe pró-labore. São 18 meses de extrato bancário (o último é o mês atual).
// A receita cresce mais rápido que a folha, então o Fator R cai abaixo de 28% nos meses recentes e o DAS passa a
// ser calculado no Anexo V: é a situação que o agente aponta. Nomes de clientes e fornecedores são inventados.
import { apuracao, limparCache } from './contabil.js';
import { classificar, PLANO_PADRAO } from './plano.js';
import { diasNoMes, hojeISO, id, mesAnterior, mesDe } from './util.js';

function aleatorio(semente) {
  return () => {
    semente |= 0;
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const EMPRESA_DEMO = {
  nome: 'Lumen Tecnologia Ltda',
  cnpj: '00.000.000/0001-00 (fictício)',
  atividade: 'Desenvolvimento de software sob encomenda',
  regime: 'simples',
  anexo: 'V',
  fatorR: true,
  atividadeMei: 'servicos',
  capitalInicial: 40000
};

export function gerarDemo() {
  const sorte = aleatorio(4242);
  const entre = (min, max) => Math.round((min + sorte() * (max - min)) * 100) / 100;
  const escolher = lista => lista[Math.floor(sorte() * lista.length)];
  const hoje = hojeISO();
  const atual = mesDe(hoje);
  const primeiro = mesAnterior(atual, 17);
  const movimentos = [];
  const lancar = (data, descricao, valor) => {
    if (data <= hoje) movimentos.push({ id: id(), data, descricao, valor: Math.round(valor * 100) / 100 });
  };
  const clientes = [
    'MERCADO BOM DIA LTDA',
    'CLINICA VIVA BEM',
    'ESCOLA NOVOS SABERES',
    'TRANSPORTES RAPIDO SUL',
    'IMOBILIARIA PORTO SEGURO',
    'ACADEMIA FORCA TOTAL',
    'COOPERATIVA AGRO VALE'
  ];
  const freelas = [
    'FREELA ANA DESIGNER UX',
    'FREELA BRUNO DEV MOBILE',
    'FREELA CARLA QA TESTES',
    'FREELA DIEGO DEV BACKEND'
  ];

  for (let k = 0; k < 18; k++) {
    const mes = mesAnterior(primeiro, -k);
    const ultimo = diasNoMes(mes);
    const dia = d => `${mes}-${String(Math.min(d, ultimo)).padStart(2, '0')}`;

    // Receita: cresce ~R$ 1.800 por mês, dividida entre 3 a 6 clientes
    const alvo = 24000 + k * 1800 + entre(-2500, 2500);
    const quantos = 3 + Math.floor(sorte() * 4);
    let restante = alvo;
    for (let c = 0; c < quantos; c++) {
      const valor = c === quantos - 1 ? restante : Math.round((alvo / quantos) * entre(0.6, 1.4));
      restante -= valor;
      if (valor > 0)
        lancar(
          dia(2 + Math.floor(sorte() * 26)),
          `${sorte() < 0.5 ? 'TED RECEBIDA' : 'PIX RECEBIDO'} ${escolher(clientes)}`,
          valor
        );
    }
    lancar(dia(ultimo), 'RENDIMENTO CONTA REMUNERADA', entre(20, 60));

    // Pessoal: salários brutos de R$ 8.500 (pagos líquidos), pró-labore de R$ 2.500 (líquido de INSS 11%)
    lancar(dia(5), 'PAGAMENTO SALARIOS FOLHA', -7565);
    lancar(dia(5), 'PRO-LABORE SOCIO', -2225);
    lancar(dia(6), 'VALE REFEICAO BENEFICIO', -880);
    if (k > 0) {
      lancar(dia(20), 'DARF DCTFWEB INSS E IRRF', -1210);
      lancar(dia(20), 'FGTS DIGITAL GUIA MENSAL', -680);
    }

    // Despesas administrativas e comerciais
    lancar(dia(3), 'PAGAMENTO COWORKING ESPACO CENTRAL', -2800);
    lancar(dia(10), 'HONORARIOS ESCRITORIO CONTABIL', -690);
    lancar(dia(12), 'INTERNET FIBRA EMPRESARIAL', -219.9);
    lancar(dia(8), 'ASSINATURA FERRAMENTAS DEV', -460);
    lancar(dia(1), 'TARIFA PACOTE DE SERVICOS PJ', -89.9);
    lancar(dia(17), 'ANUNCIOS ONLINE IMPULSIONAMENTO', -entre(500, 1400));
    if (sorte() < 0.3) lancar(dia(22), 'PAPELARIA MATERIAL ESCRITORIO', -entre(80, 260));

    // Custos dos projetos
    lancar(dia(15), 'NUVEM SERVIDORES CLOUD', -(900 + k * 45 + entre(-150, 150)));
    const terceiros = 2 + Math.floor(sorte() * 2);
    for (let t = 0; t < terceiros; t++)
      lancar(dia(9 + t * 7), `PIX ENVIADO ${escolher(freelas)}`, -entre(2200, 3600 + k * 120));
    // De vez em quando, um pagamento que o agente não sabe classificar sozinho
    if (k % 5 === 3) lancar(dia(26), 'PIX ENVIADO JOAO CARLOS SILVA', -entre(300, 900));

    // Computadores novos (vão para o ativo e depreciam)
    if (k === 9) lancar(dia(14), 'COMPRA NOTEBOOKS LOJA TECH EQUIPAMENTOS', -9800);
    // Distribuição de lucros a cada trimestre
    // Distribuição de lucros todo mês, a partir do terceiro
    if (k >= 2) lancar(dia(25), 'DISTRIBUICAO DE LUCROS SOCIO', -Math.round(entre(5000, 8000)));
  }

  const plano = structuredClone(PLANO_PADRAO);
  const estadoTemporario = {
    empresa: { ...EMPRESA_DEMO, inicio: `${primeiro}-01` },
    plano,
    movimentos: movimentos.map(m => ({ ...m, conta: classificar(m, [], plano) })),
    versaoDados: -1
  };
  // DAS: cada mês fechado é pago no dia 20 do mês seguinte, com o valor da apuração
  limparCache();
  for (let k = 0; k < 17; k++) {
    const mes = mesAnterior(primeiro, -k);
    const ap = apuracao(estadoTemporario, mes);
    const pagamento = `${mesAnterior(mes, -1)}-20`;
    if (pagamento <= hoje) {
      estadoTemporario.movimentos.push({
        id: id(),
        data: pagamento,
        descricao: 'PAGAMENTO DAS SIMPLES NACIONAL',
        valor: -ap.das,
        conta: 'das-a-recolher'
      });
    }
  }
  limparCache();
  estadoTemporario.movimentos.sort((a, b) => a.data.localeCompare(b.data));
  return estadoTemporario;
}
