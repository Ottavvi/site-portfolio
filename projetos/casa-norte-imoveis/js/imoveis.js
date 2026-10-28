// Carteira de imóveis (fictícia), gerada de forma estável: sempre os mesmos 28 imóveis.

export const BAIRROS = [
  { nome: 'Batel', m2: 13500 },
  { nome: 'Água Verde', m2: 10200 },
  { nome: 'Juvevê', m2: 10800 },
  { nome: 'Ahú', m2: 9400 },
  { nome: 'Cabral', m2: 9900 },
  { nome: 'Bacacheri', m2: 7600 },
  { nome: 'Centro Cívico', m2: 9100 },
  { nome: 'Mercês', m2: 8400 }
];

export const TIPOS = ['Apartamento', 'Casa', 'Sobrado', 'Studio'];

const RUAS = [
  'Rua Itupava',
  'Rua Mateus Leme',
  'Av. João Gualberto',
  'Rua Bom Jesus',
  'Rua Amintas de Barros',
  'Rua Fernando Amaro',
  'Rua Dep. Mário de Barros',
  'Rua Padre Anchieta',
  'Rua Coronel Dulcídio',
  'Rua Chichorro Júnior',
  'Rua Holanda',
  'Rua Prof. Brandão'
];
const EXTRAS = [
  'Sacada com churrasqueira',
  'Aceita pet',
  'Portaria 24h',
  'Piscina',
  'Academia',
  'Mobiliado',
  'Quintal',
  'Vista livre',
  'Perto do Bosque do Papa',
  'Bicicletário',
  'Lareira',
  'Energia solar'
];

function gerador(semente) {
  let s = semente;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function arred(v, passo) {
  return Math.round(v / passo) * passo;
}

export function carteira() {
  const r = gerador(47);
  const lista = [];
  for (let i = 0; i < 28; i++) {
    const tipo = TIPOS[i % 7 === 3 ? 3 : i % 5 === 1 ? 1 : i % 6 === 2 ? 2 : 0];
    const bairro = BAIRROS[Math.floor(r() * BAIRROS.length)];
    const quartos = tipo === 'Studio' ? 1 : tipo === 'Apartamento' ? 1 + Math.floor(r() * 3) : 2 + Math.floor(r() * 3);
    const area = arred(
      tipo === 'Studio'
        ? 28 + r() * 14
        : tipo === 'Apartamento'
          ? 42 + quartos * 22 + r() * 30
          : 90 + quartos * 30 + r() * 70,
      1
    );
    const vagas = tipo === 'Studio' ? (r() > 0.6 ? 1 : 0) : Math.min(3, Math.max(1, Math.round(quartos / 1.5 + r())));
    const negocio = i % 3 === 0 ? 'alugar' : 'comprar';
    const fator = 0.82 + r() * 0.36 + (tipo === 'Casa' || tipo === 'Sobrado' ? -0.12 : 0);
    const venda = arred(area * bairro.m2 * fator, 5000);
    const condominio = tipo === 'Casa' ? 0 : arred(area * (9 + r() * 7), 10);
    const iptu = arred((venda * 0.0045) / 12, 5);
    const aluguel = arred(venda * (0.0042 + r() * 0.0012), 50);
    const extras = EXTRAS.filter(() => r() > 0.72).slice(0, 4);
    if (tipo === 'Casa' && !extras.includes('Quintal')) extras.unshift('Quintal');
    lista.push({
      id: `CN${String(1047 + i * 13).padStart(5, '0')}`,
      tipo,
      negocio,
      bairro: bairro.nome,
      rua: RUAS[Math.floor(r() * RUAS.length)],
      quartos,
      suites: quartos > 1 && r() > 0.45 ? 1 : 0,
      banheiros: Math.max(1, quartos - (r() > 0.5 ? 1 : 0)),
      vagas,
      area,
      preco: negocio === 'comprar' ? venda : aluguel,
      condominio,
      iptu,
      extras,
      andar: tipo === 'Apartamento' || tipo === 'Studio' ? 1 + Math.floor(r() * 18) : null,
      dias: Math.floor(r() * 40), // há quantos dias foi anunciado
      cor: Math.floor(r() * 5),
      ano: 1985 + Math.floor(r() * 40)
    });
  }
  return lista;
}

export function titulo(im) {
  const q = im.tipo === 'Studio' ? 'Studio' : `${im.tipo} com ${im.quartos} ${im.quartos === 1 ? 'quarto' : 'quartos'}`;
  return `${q} no ${im.bairro}`.replace('no Água', 'na Água');
}
