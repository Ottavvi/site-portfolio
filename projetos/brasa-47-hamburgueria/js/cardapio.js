// Cardápio (fictício). camadas = de baixo para cima, sem os pães.
export const BURGERS = [
  {
    id: 'classico',
    nome: 'Clássico 47',
    desc: 'Smash 90 g, queijo prato, alface, tomate e molho da casa no brioche.',
    preco: 29,
    camadas: ['molho-casa', 'alface', 'tomate', 'carne', 'prato']
  },
  {
    id: 'smash-duplo',
    nome: 'Smash duplo',
    desc: 'Duas carnes prensadas na chapa, dois cheddar, cebola roxa e picles.',
    preco: 33,
    camadas: ['picles', 'carne', 'cheddar', 'carne', 'cheddar', 'cebola']
  },
  {
    id: 'bacon-brasa',
    nome: 'Bacon brasa',
    desc: 'Burger de 180 g, cheddar, bacon em tiras, cebola crispy e barbecue. Pão australiano.',
    preco: 39,
    camadas: ['barbecue', 'carne-180', 'cheddar', 'bacon', 'crispy'],
    pao: 'australiano'
  },
  {
    id: 'egg',
    nome: 'Egg burger',
    desc: 'Smash, prato, ovo com gema mole, bacon e maionese de alho.',
    preco: 35,
    camadas: ['alho', 'carne', 'prato', 'bacon', 'ovo']
  },
  {
    id: 'triplo',
    nome: 'Triplo do 47',
    desc: 'Três smash, três cheddar e cebola caramelizada. Para quem veio com fome.',
    preco: 44,
    camadas: ['carne', 'cheddar', 'carne', 'cheddar', 'carne', 'cheddar', 'caramelizada']
  },
  {
    id: 'veggie',
    nome: 'Veggie de grão-de-bico',
    desc: 'Hambúrguer de grão-de-bico e cogumelos, alface, tomate e maionese de alho.',
    preco: 31,
    camadas: ['alho', 'alface', 'tomate', 'veggie']
  }
];

export const ACOMPANHAMENTOS = [
  { id: 'batata-p', nome: 'Batata frita (individual)', desc: 'Corte palito, casca fina e sal de páprica.', preco: 12 },
  { id: 'batata-g', nome: 'Batata frita (para dividir)', desc: '450 g com cheddar e bacon por cima.', preco: 28 },
  { id: 'onion', nome: 'Onion rings', desc: '10 anéis empanados na cerveja, com maionese de alho.', preco: 18 },
  { id: 'combo', nome: 'Vira combo', desc: 'Batata individual + refrigerante lata. Some a qualquer burger.', preco: 15 }
];

export const BEBIDAS = [
  { id: 'refri', nome: 'Refrigerante lata', desc: 'Cola, cola zero, guaraná ou laranja.', preco: 7 },
  { id: 'suco', nome: 'Suco natural 400 ml', desc: 'Laranja, limão com hortelã ou maracujá.', preco: 11 },
  { id: 'cerveja', nome: 'Cerveja IPA 473 ml', desc: 'Artesanal da cervejaria do bairro.', preco: 19 },
  { id: 'milkshake', nome: 'Milkshake', desc: 'Doce de leite, Ovomaltine ou morango. 400 ml.', preco: 21 }
];

// Monte o seu
export const MONTE = {
  base: 22,
  paes: [
    { id: 'brioche', nome: 'Brioche', preco: 0 },
    { id: 'australiano', nome: 'Australiano', preco: 2 },
    { id: 'semgluten', nome: 'Sem glúten', preco: 4 }
  ],
  carnes: [
    { qtd: 1, nome: '1 smash', preco: 0 },
    { qtd: 2, nome: '2 smash', preco: 8 },
    { qtd: 3, nome: '3 smash', preco: 15 }
  ],
  queijos: [
    { id: 'cheddar', nome: 'Cheddar', preco: 0 },
    { id: 'prato', nome: 'Prato', preco: 0 },
    { id: 'nenhum', nome: 'Sem queijo', preco: 0 }
  ],
  extras: [
    { id: 'bacon', nome: 'Bacon', preco: 5 },
    { id: 'ovo', nome: 'Ovo', preco: 3 },
    { id: 'caramelizada', nome: 'Cebola caramelizada', preco: 3 },
    { id: 'crispy', nome: 'Cebola crispy', preco: 3 },
    { id: 'picles', nome: 'Picles', preco: 2 },
    { id: 'salada', nome: 'Alface e tomate', preco: 2 },
    { id: 'cebola', nome: 'Cebola roxa', preco: 0 }
  ],
  molhos: [
    { id: 'molho-casa', nome: 'Da casa' },
    { id: 'barbecue', nome: 'Barbecue' },
    { id: 'alho', nome: 'Maionese de alho' },
    { id: 'sem', nome: 'Sem molho' }
  ]
};

export const BAIRROS = [
  { nome: 'Vila Madalena', taxa: 5 },
  { nome: 'Pinheiros', taxa: 6 },
  { nome: 'Sumaré', taxa: 7 },
  { nome: 'Perdizes', taxa: 8 },
  { nome: 'Alto de Pinheiros', taxa: 8 },
  { nome: 'Lapa', taxa: 10 }
];

// terça a domingo, 18h às 23h30
export const HORARIO = { dias: [0, 2, 3, 4, 5, 6], abre: 18 * 60, fecha: 23 * 60 + 30 };
export const WHATSAPP = '5511900000047';
