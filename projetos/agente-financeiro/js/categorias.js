// Categorias e regras de classificação automática.
// As cores das categorias de gasto vêm das cédulas do real (R$ 2, 5, 10, 20, 50, 100 e 200), para o app ter
// a cara do dinheiro que ele organiza.
import { chaveDoEstabelecimento, normalizar } from './util.js';

export const CATEGORIAS_PADRAO = [
  // Gastos
  {
    id: 'moradia',
    nome: 'Moradia',
    tipo: 'saida',
    cor: '#2c6e9e',
    orcamento: 1550
  }, // azul da nota de 100
  {
    id: 'contas',
    nome: 'Contas da casa',
    tipo: 'saida',
    cor: '#5c7f9c',
    orcamento: 450
  }, // azul-acinzentado da de 2
  {
    id: 'mercado',
    nome: 'Mercado',
    tipo: 'saida',
    cor: '#b8901a',
    orcamento: 800
  }, // amarelo da de 20
  {
    id: 'alimentacao',
    nome: 'Comer fora',
    tipo: 'saida',
    cor: '#c46a24',
    orcamento: 520
  }, // laranja da de 50
  {
    id: 'transporte',
    nome: 'Transporte',
    tipo: 'saida',
    cor: '#b0473b',
    orcamento: 380
  }, // vermelho da de 10
  { id: 'saude', nome: 'Saúde', tipo: 'saida', cor: '#2e8475', orcamento: 350 },
  {
    id: 'assinaturas',
    nome: 'Assinaturas',
    tipo: 'saida',
    cor: '#7a57a0',
    orcamento: 140
  }, // roxo da de 5
  { id: 'lazer', nome: 'Lazer', tipo: 'saida', cor: '#b2557c', orcamento: 200 },
  {
    id: 'compras',
    nome: 'Compras',
    tipo: 'saida',
    cor: '#8a765c',
    orcamento: 250
  }, // sépia da de 200
  {
    id: 'educacao',
    nome: 'Educação',
    tipo: 'saida',
    cor: '#4d7a3a',
    orcamento: 200
  },
  {
    id: 'impostos',
    nome: 'Impostos e tarifas',
    tipo: 'saida',
    cor: '#6a6f76',
    orcamento: 120
  },
  {
    id: 'outros',
    nome: 'Outros gastos',
    tipo: 'saida',
    cor: '#97a0aa',
    orcamento: 0
  },
  // Entradas
  { id: 'salario', nome: 'Salário', tipo: 'entrada', cor: '#1f7a56' },
  {
    id: 'freelas',
    nome: 'Trabalhos e clientes',
    tipo: 'entrada',
    cor: '#3c9a6c'
  },
  { id: 'rendimentos', nome: 'Rendimentos', tipo: 'entrada', cor: '#64b08a' },
  {
    id: 'outras-entradas',
    nome: 'Outras entradas',
    tipo: 'entrada',
    cor: '#94c7ab'
  },
  // Neutra: dinheiro que só muda de lugar (entre contas próprias, aplicação e resgate)
  {
    id: 'transferencia',
    nome: 'Entre minhas contas',
    tipo: 'neutra',
    cor: '#b9c1ca'
  }
];

// Palavras que indicam a categoria. A ordem importa: a primeira regra que bate vence.
const REGRAS_PADRAO = [
  ['rendimentos', ['rendimento', 'juros recebidos', 'dividendo', 'remuneracao conta']],
  [
    'transferencia',
    ['aplicacao', 'resgate', 'transf mesma titularidade', 'entre contas', 'poupanca', 'cdb', 'tesouro']
  ],
  ['salario', ['salario', 'folha de pagamento', 'pagamento de salario', 'vencimentos']],
  ['moradia', ['aluguel', 'condominio', 'iptu', 'imobiliaria']],
  [
    'contas',
    [
      'energia',
      'eletrica',
      'agua',
      'saneamento',
      'internet',
      'fibra',
      'telefone',
      'celular',
      'recarga',
      'gas ',
      'netfibra'
    ]
  ],
  ['mercado', ['mercado', 'mercadinho', 'atacarejo', 'atacado', 'hortifruti', 'acougue', 'feira']],
  [
    'alimentacao',
    ['restaurante', 'lanchonete', 'padaria', 'pizzaria', 'delivery', 'ifood', 'cafe', 'hamburgueria', 'sorveteria']
  ],
  [
    'transporte',
    [
      'posto',
      'combustivel',
      'gasolina',
      'etanol',
      'corrida',
      'transporte app',
      'onibus',
      'metro',
      'estacionamento',
      'pedagio',
      'oficina'
    ]
  ],
  [
    'saude',
    ['farmacia', 'drogaria', 'clinica', 'laboratorio', 'plano de saude', 'odonto', 'medico', 'hospital', 'academia']
  ],
  ['assinaturas', ['streamflix', 'musicaplay', 'assinatura', 'nuvem', 'mensalidade app', 'premium']],
  ['lazer', ['cinema', 'teatro', 'show', 'ingresso', 'viagem', 'hotel', 'pousada', 'passagem', 'parque']],
  ['compras', ['loja', 'magazine', 'shopping', 'roupa', 'calcado', 'eletronico', 'marketplace', 'casa e decoracao']],
  ['educacao', ['curso', 'escola', 'faculdade', 'livraria', 'livro', 'ead']],
  [
    'impostos',
    [
      ' das ',
      'das-mei',
      'das mei',
      'imposto',
      'tarifa',
      'iof',
      'anuidade',
      'juros',
      'multa',
      'taxa bancaria',
      'cesta de servicos'
    ]
  ]
];

// Classifica uma transação. Primeiro as regras aprendidas com a pessoa (pelo nome do estabelecimento),
// depois as palavras-chave padrão, e por fim "outros" pelo sinal do valor.
export function classificar(transacao, regrasAprendidas = []) {
  const chave = chaveDoEstabelecimento(transacao.descricao);
  const aprendida = regrasAprendidas.find(regra => regra.chave === chave);
  if (aprendida) return aprendida.categoria;

  const texto = ` ${normalizar(transacao.descricao)} `;
  const entrada = transacao.valor > 0;
  for (const [categoria, palavras] of REGRAS_PADRAO) {
    if (palavras.some(palavra => texto.includes(palavra))) {
      const tipo = CATEGORIAS_PADRAO.find(c => c.id === categoria).tipo;
      // Uma regra de gasto não serve para entrada (um estorno de mercado não é "mercado" como receita)
      if (tipo === 'neutra' || (tipo === 'entrada') === entrada) return categoria;
    }
  }
  if (entrada) return /pix|ted|transferencia|deposito/.test(texto) ? 'freelas' : 'outras-entradas';
  return 'outros';
}

// Quando a pessoa muda a categoria de uma transação, o app guarda a regra para o mesmo estabelecimento
export function aprenderRegra(regras, descricao, categoria) {
  const chave = chaveDoEstabelecimento(descricao);
  if (!chave) return regras;
  return [...regras.filter(regra => regra.chave !== chave), { chave, categoria }];
}
