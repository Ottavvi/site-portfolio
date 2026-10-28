// Studio fictício. Edite aqui modalidades, grade, planos e equipe.
export const MODALIDADES = {
  aparelhos: {
    nome: 'Pilates nos aparelhos',
    cor: '#f2a65a',
    cap: 4,
    desc: 'Reformer, cadillac e chair. Turmas de até 4 pessoas, com ajuste de mola para o seu corpo.'
  },
  solo: {
    nome: 'Pilates solo',
    cor: '#9cc5b9',
    cap: 10,
    desc: 'No colchonete, com bola, faixa e anel. Força de centro e mobilidade da coluna.'
  },
  yoga: {
    nome: 'Yoga',
    cor: '#c9a7d8',
    cap: 12,
    desc: 'Hatha suave e vinyasa, com respiração guiada e 10 minutos de relaxamento no fim.'
  },
  funcional: {
    nome: 'Funcional leve',
    cor: '#e8d47a',
    cap: 8,
    desc: 'Circuito de 45 minutos com peso livre e elástico. Sem salto, sem impacto.'
  }
};

export const EQUIPE = [
  {
    nome: 'Marina Duarte',
    papel: 'Fisioterapeuta, pilates clínico',
    sobre: 'Trabalha com dor lombar, pós-parto e reabilitação de joelho. Fundou o Alento em 2018.'
  },
  {
    nome: 'Caio Ferraz',
    papel: 'Educador físico, funcional e pilates',
    sobre: 'Prepara corredores amadores e quem quer voltar a treinar depois de muito tempo parado.'
  },
  {
    nome: 'Lia Tanaka',
    papel: 'Professora de yoga',
    sobre: 'Formada em hatha yoga, dá as aulas da manhã cedo e de sábado. Fala baixo e pede pouco.'
  }
];

const P = { marina: 'Marina', caio: 'Caio', lia: 'Lia' };

// [dia (1=seg), hora, modalidade, professora, nível]
const GRADE = [
  [1, '07:00', 'yoga', 'lia', 'Todos'],
  [1, '08:00', 'aparelhos', 'marina', 'Iniciante'],
  [1, '12:15', 'solo', 'caio', 'Todos'],
  [1, '18:00', 'aparelhos', 'marina', 'Intermediário'],
  [1, '19:00', 'funcional', 'caio', 'Todos'],
  [1, '20:00', 'aparelhos', 'caio', 'Iniciante'],
  [2, '07:00', 'aparelhos', 'marina', 'Todos'],
  [2, '09:00', 'solo', 'marina', 'Iniciante'],
  [2, '12:15', 'yoga', 'lia', 'Todos'],
  [2, '18:00', 'funcional', 'caio', 'Todos'],
  [2, '19:00', 'aparelhos', 'marina', 'Iniciante'],
  [2, '20:00', 'yoga', 'lia', 'Todos'],
  [3, '07:00', 'yoga', 'lia', 'Todos'],
  [3, '08:00', 'aparelhos', 'marina', 'Iniciante'],
  [3, '12:15', 'funcional', 'caio', 'Todos'],
  [3, '18:00', 'aparelhos', 'marina', 'Intermediário'],
  [3, '19:00', 'solo', 'caio', 'Todos'],
  [3, '20:00', 'aparelhos', 'caio', 'Iniciante'],
  [4, '07:00', 'aparelhos', 'marina', 'Todos'],
  [4, '09:00', 'solo', 'marina', 'Iniciante'],
  [4, '12:15', 'yoga', 'lia', 'Todos'],
  [4, '18:00', 'funcional', 'caio', 'Todos'],
  [4, '19:00', 'aparelhos', 'marina', 'Iniciante'],
  [4, '20:00', 'solo', 'caio', 'Intermediário'],
  [5, '07:00', 'yoga', 'lia', 'Todos'],
  [5, '08:00', 'aparelhos', 'marina', 'Iniciante'],
  [5, '12:15', 'solo', 'caio', 'Todos'],
  [5, '18:00', 'aparelhos', 'caio', 'Todos'],
  [6, '08:00', 'yoga', 'lia', 'Todos'],
  [6, '09:00', 'aparelhos', 'marina', 'Todos'],
  [6, '10:00', 'funcional', 'caio', 'Todos']
];

function sorte(t) {
  let h = 2166136261;
  for (const c of t) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0) / 4294967296;
}

export const AULAS = GRADE.map(([dia, hora, mod, prof, nivel]) => {
  const cap = MODALIDADES[mod].cap;
  const ocupadas = Math.min(cap, Math.floor(sorte(`${dia}${hora}${mod}`) * (cap + 1.4)));
  return { id: `${dia}-${hora}-${mod}`, dia, hora, mod, prof: P[prof], nivel, cap, ocupadas };
});

export const DIAS = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// Preço mensal por frequência semanal; desconto por fidelidade
export const PLANOS = [
  { vezes: 1, aparelhos: 290, livre: 210 },
  { vezes: 2, aparelhos: 460, livre: 320 },
  { vezes: 3, aparelhos: 590, livre: 410 }
];
export const PERIODOS = [
  { id: 'mensal', nome: 'Mensal', desconto: 0 },
  { id: 'trimestral', nome: 'Trimestral', desconto: 0.08 },
  { id: 'semestral', nome: 'Semestral', desconto: 0.15 }
];
