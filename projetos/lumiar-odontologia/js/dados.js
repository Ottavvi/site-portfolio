// Dados da clínica (fictícia). Preços de referência para particular.
export const EQUIPE = [
  {
    id: 'helena',
    nome: 'Dra. Helena Prado',
    cro: 'CRO-SP 00000',
    area: 'Clínica geral e estética',
    sobre: 'Doze anos de consultório. Cuida de clareamento, facetas e da primeira avaliação de quase todo mundo.',
    dias: [1, 2, 3, 4, 5, 6],
    cor: '#6b2f4e'
  },
  {
    id: 'rafael',
    nome: 'Dr. Rafael Okada',
    cro: 'CRO-SP 00001',
    area: 'Ortodontia e implantes',
    sobre: 'Especialista em ortodontia. Planeja alinhadores em 3D e faz implantes guiados por tomografia.',
    dias: [1, 3, 5],
    cor: '#173d35'
  },
  {
    id: 'bia',
    nome: 'Dra. Beatriz Nunes',
    cro: 'CRO-SP 00002',
    area: 'Odontopediatria',
    sobre: 'Atende do primeiro dente aos 14 anos. Tem paciência infinita e uma gaveta cheia de adesivos.',
    dias: [2, 4, 6],
    cor: '#9a6a1f'
  }
];

export const TRATAMENTOS = [
  {
    id: 'avaliacao',
    nome: 'Avaliação e limpeza',
    desc: 'Exame completo, raspagem do tártaro, polimento e flúor.',
    preco: 180,
    min: 40,
    profs: ['helena', 'rafael', 'bia']
  },
  {
    id: 'clareamento',
    nome: 'Clareamento',
    desc: 'Consultório + moldeira para casa. Duas sessões e acompanhamento por 3 semanas.',
    preco: 1200,
    min: 60,
    profs: ['helena']
  },
  {
    id: 'restauracao',
    nome: 'Restauração em resina',
    desc: 'Cárie ou dente lascado, com resina na cor do dente.',
    preco: 260,
    min: 50,
    profs: ['helena', 'rafael']
  },
  {
    id: 'canal',
    nome: 'Tratamento de canal',
    desc: 'Com anestesia e localizador apical. Em geral, uma ou duas sessões.',
    preco: 950,
    min: 90,
    profs: ['helena']
  },
  {
    id: 'ortodontia',
    nome: 'Ortodontia e alinhadores',
    desc: 'Consulta de planejamento com escaneamento 3D. Mensalidade a partir de R$ 220.',
    preco: 250,
    min: 60,
    profs: ['rafael']
  },
  {
    id: 'implante',
    nome: 'Implante dentário',
    desc: 'Avaliação com tomografia. O valor inclui pino, componente e coroa.',
    preco: 3400,
    min: 60,
    profs: ['rafael']
  },
  {
    id: 'infantil',
    nome: 'Consulta infantil',
    desc: 'Primeira consulta, orientação de escovação para pais e aplicação de flúor.',
    preco: 160,
    min: 40,
    profs: ['bia']
  }
];

// Horário de funcionamento por dia da semana (0 = domingo)
export const EXPEDIENTE = {
  0: null,
  1: [8, 19],
  2: [8, 19],
  3: [8, 19],
  4: [8, 19],
  5: [8, 19],
  6: [8, 12]
};
export const ALMOCO = [12, 13];
export const PASSO = 30; // minutos
