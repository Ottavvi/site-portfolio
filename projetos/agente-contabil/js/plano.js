// Plano de contas simplificado para uma pequena empresa de serviços no Simples Nacional, e as regras que
// classificam cada linha do extrato bancário numa conta (a contrapartida do banco no lançamento).
import { chaveDoEstabelecimento, normalizar } from './util.js';

// natureza: devedora (aumenta com débito) ou credora (aumenta com crédito). grupo: conta sintética (só soma).
export const PLANO_PADRAO = [
  { codigo: '1', nome: 'Ativo', grupo: true },
  { codigo: '1.1', nome: 'Ativo circulante', grupo: true },
  { codigo: '1.1.1', id: 'banco', nome: 'Banco conta movimento', natureza: 'devedora' },
  { codigo: '1.2', nome: 'Ativo não circulante', grupo: true },
  { codigo: '1.2.1', id: 'imobilizado', nome: 'Computadores e equipamentos', natureza: 'devedora' },
  { codigo: '1.2.2', id: 'depreciacao-acumulada', nome: '(−) Depreciação acumulada', natureza: 'credora' },
  { codigo: '2', nome: 'Passivo', grupo: true },
  { codigo: '2.1', nome: 'Passivo circulante', grupo: true },
  { codigo: '2.1.1', id: 'das-a-recolher', nome: 'Simples Nacional a recolher', natureza: 'credora' },
  { codigo: '2.2', nome: 'Patrimônio líquido', grupo: true },
  { codigo: '2.2.1', id: 'capital', nome: 'Capital social', natureza: 'credora' },
  { codigo: '2.2.2', id: 'lucros-acumulados', nome: 'Lucros acumulados', natureza: 'credora' },
  { codigo: '2.2.3', id: 'distribuicao', nome: '(−) Lucros distribuídos', natureza: 'devedora' },
  { codigo: '3', nome: 'Receitas', grupo: true },
  { codigo: '3.1', id: 'receita-servicos', nome: 'Receita de serviços', natureza: 'credora', dre: 'receita' },
  { codigo: '3.2', id: 'receita-financeira', nome: 'Receitas financeiras', natureza: 'credora', dre: 'financeira' },
  { codigo: '3.9', id: 'receita-a-classificar', nome: 'Entradas a classificar', natureza: 'credora', dre: 'outras' },
  { codigo: '4', nome: 'Deduções da receita', grupo: true },
  { codigo: '4.1', id: 'das', nome: 'Simples Nacional (DAS)', natureza: 'devedora', dre: 'deducao' },
  { codigo: '5', nome: 'Custos dos serviços', grupo: true },
  { codigo: '5.1', id: 'terceiros', nome: 'Serviços de terceiros', natureza: 'devedora', dre: 'custo' },
  { codigo: '5.2', id: 'nuvem', nome: 'Servidores e nuvem dos projetos', natureza: 'devedora', dre: 'custo' },
  { codigo: '6', nome: 'Despesas operacionais', grupo: true },
  { codigo: '6.1', nome: 'Pessoal', grupo: true },
  { codigo: '6.1.1', id: 'salarios', nome: 'Salários', natureza: 'devedora', dre: 'pessoal', folha: true },
  {
    codigo: '6.1.2',
    id: 'encargos',
    nome: 'Encargos (FGTS e INSS)',
    natureza: 'devedora',
    dre: 'pessoal',
    folha: true
  },
  { codigo: '6.1.3', id: 'prolabore', nome: 'Pró-labore', natureza: 'devedora', dre: 'pessoal', folha: true },
  { codigo: '6.1.4', id: 'beneficios', nome: 'Benefícios', natureza: 'devedora', dre: 'pessoal' },
  { codigo: '6.2', nome: 'Administrativas', grupo: true },
  { codigo: '6.2.1', id: 'aluguel', nome: 'Aluguel e coworking', natureza: 'devedora', dre: 'administrativa' },
  { codigo: '6.2.2', id: 'contabilidade', nome: 'Contabilidade', natureza: 'devedora', dre: 'administrativa' },
  { codigo: '6.2.3', id: 'telecom', nome: 'Internet e telefone', natureza: 'devedora', dre: 'administrativa' },
  { codigo: '6.2.4', id: 'softwares', nome: 'Softwares e assinaturas', natureza: 'devedora', dre: 'administrativa' },
  { codigo: '6.2.5', id: 'material', nome: 'Material de escritório', natureza: 'devedora', dre: 'administrativa' },
  { codigo: '6.2.6', id: 'depreciacao', nome: 'Depreciação', natureza: 'devedora', dre: 'administrativa' },
  { codigo: '6.3', nome: 'Comerciais', grupo: true },
  { codigo: '6.3.1', id: 'marketing', nome: 'Marketing e anúncios', natureza: 'devedora', dre: 'comercial' },
  { codigo: '6.4', nome: 'Financeiras', grupo: true },
  { codigo: '6.4.1', id: 'tarifas', nome: 'Tarifas bancárias', natureza: 'devedora', dre: 'financeira-despesa' },
  { codigo: '6.4.2', id: 'juros', nome: 'Juros e multas', natureza: 'devedora', dre: 'financeira-despesa' },
  {
    codigo: '6.9',
    id: 'despesa-a-classificar',
    nome: 'Saídas a classificar',
    natureza: 'devedora',
    dre: 'administrativa'
  }
];

// Contas que uma linha do extrato pode receber (o banco é sempre o outro lado)
export const contasDeMovimento = plano =>
  plano.filter(
    c =>
      c.id &&
      c.id !== 'banco' &&
      c.id !== 'depreciacao-acumulada' &&
      c.id !== 'depreciacao' &&
      c.id !== 'das' &&
      c.id !== 'lucros-acumulados'
  );

// Palavras-chave da descrição -> conta. A primeira que bate vence; o sinal do valor desempata entradas e saídas.
const REGRAS = [
  ['das-a-recolher', ['das simples', 'pagamento das', 'simples nacional']],
  ['distribuicao', ['distribuicao de lucro', 'lucros socio', 'dividendos socio']],
  ['prolabore', ['pro-labore', 'pro labore', 'prolabore']],
  ['salarios', ['salario', 'folha de pagamento', 'pagamento salarios']],
  ['encargos', ['fgts', 'dctfweb', 'inss', 'gps ', 'darf previdenciario']],
  ['beneficios', ['vale refeicao', 'vale alimentacao', 'plano de saude', 'beneficio']],
  ['capital', ['integralizacao', 'aporte socio', 'aporte de capital']],
  ['imobilizado', ['notebook', 'computador', 'monitor', 'equipamento', 'moveis']],
  ['aluguel', ['aluguel', 'coworking', 'condominio']],
  ['contabilidade', ['contabil', 'contabilidade', 'escritorio contabil']],
  ['telecom', ['internet', 'telefone', 'celular', 'fibra']],
  ['nuvem', ['nuvem servidores', 'servidor', 'hospedagem', 'cloud']],
  ['softwares', ['assinatura', 'software', 'licenca', 'ferramentas']],
  ['marketing', ['anuncio', 'anuncios', 'marketing', 'publicidade', 'impulsionamento']],
  ['terceiros', ['freela', 'desenvolvedor', 'designer', 'prestador', 'consultor']],
  ['material', ['papelaria', 'material', 'escritorio']],
  ['tarifas', ['tarifa', 'cesta de servicos', 'pacote de servicos', 'iof']],
  ['juros', ['juros', 'multa', 'encargos atraso']],
  ['receita-financeira', ['rendimento', 'remuneracao conta', 'resgate rendimento']]
];

export function classificar(movimento, aprendidas = [], plano = PLANO_PADRAO) {
  const chave = chaveDoEstabelecimento(movimento.descricao);
  const regra = aprendidas.find(r => r.chave === chave && Math.sign(r.sinal) === Math.sign(movimento.valor));
  if (regra) return regra.conta;
  const texto = ` ${normalizar(movimento.descricao)} `;
  const entrada = movimento.valor > 0;
  for (const [conta, palavras] of REGRAS) {
    if (!palavras.some(p => texto.includes(p))) continue;
    const c = plano.find(x => x.id === conta);
    const ehEntrada = c.natureza === 'credora' && !['das-a-recolher'].includes(conta);
    if (conta === 'capital' || conta === 'imobilizado' || conta === 'das-a-recolher' || ehEntrada === entrada)
      return conta;
  }
  if (entrada)
    return /recebid|ted|pix|transferencia|deposito|boleto/.test(texto) ? 'receita-servicos' : 'receita-a-classificar';
  return 'despesa-a-classificar';
}

export function aprender(aprendidas, movimento, conta) {
  const chave = chaveDoEstabelecimento(movimento.descricao);
  if (!chave) return aprendidas;
  const sinal = Math.sign(movimento.valor);
  return [...aprendidas.filter(r => !(r.chave === chave && r.sinal === sinal)), { chave, sinal, conta }];
}

// Como lançar operações comuns (o agente usa para explicar partidas dobradas)
export const OPERACOES = [
  {
    nome: 'Receber de um cliente por um serviço',
    palavras: ['receb', 'cliente', 'servico prestado', 'venda de servico', 'nota fiscal', 'faturamento'],
    partidas: [
      ['D', 'banco'],
      ['C', 'receita-servicos']
    ],
    explicacao: 'O dinheiro entra no banco (ativo aumenta: débito) e nasce uma receita (crédito).'
  },
  {
    nome: 'Pagar uma despesa (aluguel, internet, software)',
    palavras: ['pagar aluguel', 'pagamento de aluguel', 'aluguel', 'despesa', 'internet', 'conta de luz', 'assinatura'],
    partidas: [
      ['D', 'aluguel'],
      ['C', 'banco']
    ],
    explicacao: 'A despesa aumenta (débito) e o banco diminui (crédito). Troque "Aluguel" pela conta da despesa.'
  },
  {
    nome: 'Comprar um computador à vista',
    palavras: ['computador', 'notebook', 'equipamento', 'imobilizado', 'comprar maquina'],
    partidas: [
      ['D', 'imobilizado'],
      ['C', 'banco']
    ],
    explicacao:
      'Não é despesa: o computador vira um bem da empresa (ativo não circulante). A despesa aparece aos poucos, pela depreciação de 20% ao ano.'
  },
  {
    nome: 'Depreciação mensal de equipamentos',
    palavras: ['deprecia'],
    partidas: [
      ['D', 'depreciacao'],
      ['C', 'depreciacao-acumulada']
    ],
    explicacao: 'Todo mês, 1/60 do valor do computador vira despesa (20% ao ano, 5 anos), sem mexer no banco.'
  },
  {
    nome: 'Apurar o DAS do mês (competência)',
    palavras: ['apurar das', 'provisao do das', 'provisionar', 'apuracao', 'competencia'],
    partidas: [
      ['D', 'das'],
      ['C', 'das-a-recolher']
    ],
    explicacao:
      'No fim do mês o imposto já é devido: vira dedução da receita (débito) e uma dívida a pagar (crédito), mesmo antes do pagamento.'
  },
  {
    nome: 'Pagar o DAS',
    palavras: ['pagar das', 'pagamento do das', 'pagar o simples', 'pagar imposto'],
    partidas: [
      ['D', 'das-a-recolher'],
      ['C', 'banco']
    ],
    explicacao:
      'A dívida com o Simples acaba (passivo diminui: débito) e o banco diminui (crédito). A despesa já foi lançada na apuração.'
  },
  {
    nome: 'Pagar salários',
    palavras: ['salario', 'folha', 'funcionario'],
    partidas: [
      ['D', 'salarios'],
      ['C', 'banco']
    ],
    explicacao: 'Salários são despesa de pessoal (débito) e entram no Fator R. O FGTS e o INSS vão em Encargos.'
  },
  {
    nome: 'Pagar pró-labore ao sócio',
    palavras: ['pro-labore', 'pro labore', 'prolabore', 'retirada do socio'],
    partidas: [
      ['D', 'prolabore'],
      ['C', 'banco']
    ],
    explicacao:
      'Pró-labore é a remuneração pelo trabalho do sócio: é despesa e conta na folha do Fator R. Sobre ele incide INSS de 11%.'
  },
  {
    nome: 'Distribuir lucros ao sócio',
    palavras: ['distribuir lucro', 'distribuicao de lucro', 'lucros ao socio', 'dividendo'],
    partidas: [
      ['D', 'distribuicao'],
      ['C', 'banco']
    ],
    explicacao:
      'Não é despesa: é a parte do lucro que sai para o sócio, e reduz o patrimônio líquido. Não entra no Fator R.'
  },
  {
    nome: 'Sócio coloca dinheiro na empresa (capital)',
    palavras: ['integralizar', 'aporte', 'capital social', 'socio colocou'],
    partidas: [
      ['D', 'banco'],
      ['C', 'capital']
    ],
    explicacao:
      'O banco aumenta (débito) e o capital social também (crédito): é dinheiro do sócio investido, não receita.'
  }
];
