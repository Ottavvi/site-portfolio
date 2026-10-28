// Estado do sistema: ordens de serviço salvas no navegador, com dados de exemplo na primeira vez.

export const STATUS = [
  { id: 'recebido', nome: 'Recebido', cor: '#8a94a6' },
  { id: 'analise', nome: 'Em análise', cor: '#d08a1c' },
  { id: 'aprovacao', nome: 'Aguardando aprovação', cor: '#b5478e' },
  { id: 'conserto', nome: 'Em conserto', cor: '#2f5bea' },
  { id: 'pronto', nome: 'Pronto para retirar', cor: '#1f8a5b' },
  { id: 'entregue', nome: 'Entregue', cor: '#4b5563' }
];

export const TIPOS = ['Celular', 'Notebook', 'Tablet', 'Console', 'Outro'];
export const GARANTIA_DIAS = 90;

const CHAVE = 'bancada:estado';

export function hojeISO(d = new Date()) {
  const z = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}
export function somarDias(iso, n) {
  const [a, m, d] = iso.split('-').map(Number);
  return hojeISO(new Date(a, m - 1, d + n));
}
export const agoraISO = () => new Date().toISOString();

export function totalOS(os) {
  const bruto = os.itens.reduce((s, i) => s + i.qtd * i.valor, 0);
  return Math.max(0, bruto - (os.desconto || 0));
}

function exemplo() {
  const h = hojeISO();
  const quando = (dias, hora = '10:30') => `${somarDias(h, dias)}T${hora}:00`;
  const base = [
    [
      'Mariana Lopes',
      '(11) 98123-4455',
      'Celular',
      'Samsung Galaxy A54',
      'Tela trincada depois de queda, touch funcionando.',
      'Capinha',
      'conserto',
      -3,
      [
        ['Tela AMOLED A54 (peça)', 1, 690, 'peca'],
        ['Troca de tela', 1, 180, 'servico']
      ]
    ],
    [
      'Rafael Prado',
      '(11) 99876-1200',
      'Notebook',
      'Dell Inspiron 15 3520',
      'Muito lento e esquentando. Desliga sozinho jogando.',
      'Carregador',
      'aprovacao',
      -2,
      [
        ['Limpeza interna e pasta térmica', 1, 160, 'servico'],
        ['SSD 512 GB NVMe (peça)', 1, 289, 'peca'],
        ['Clonagem do sistema', 1, 90, 'servico']
      ]
    ],
    [
      'Juliana Matos',
      '(11) 97777-3030',
      'Celular',
      'iPhone 12',
      'Bateria acabando em poucas horas, saúde em 71%.',
      '',
      'pronto',
      -5,
      [
        ['Bateria iPhone 12 (peça)', 1, 320, 'peca'],
        ['Troca de bateria', 1, 120, 'servico']
      ]
    ],
    [
      'Carlos Eduardo',
      '(11) 96543-2109',
      'Console',
      'PlayStation 5',
      'Não reconhece disco. Barulho ao inserir.',
      'Cabo HDMI',
      'analise',
      -1,
      []
    ],
    [
      'Ana Beatriz Reis',
      '(11) 95555-8181',
      'Tablet',
      'iPad 9ª geração',
      'Não carrega. Conector com mau contato.',
      'Cabo e fonte',
      'recebido',
      0,
      []
    ],
    [
      'Pedro Henrique',
      '(11) 94444-0909',
      'Celular',
      'Motorola Moto G84',
      'Alto-falante baixo e chiando.',
      '',
      'conserto',
      -2,
      [
        ['Alto-falante (peça)', 1, 85, 'peca'],
        ['Troca de alto-falante', 1, 90, 'servico']
      ]
    ],
    [
      'Luciana Freitas',
      '(11) 93333-7070',
      'Notebook',
      'Lenovo IdeaPad 3',
      'Teclado com teclas falhando (A, S, D).',
      'Carregador',
      'entregue',
      -12,
      [
        ['Teclado IdeaPad 3 (peça)', 1, 210, 'peca'],
        ['Troca de teclado', 1, 120, 'servico']
      ]
    ],
    [
      'Gustavo Nunes',
      '(11) 92222-6060',
      'Celular',
      'Xiaomi Redmi Note 13',
      'Caiu na água. Não liga.',
      '',
      'entregue',
      -20,
      [['Banho químico e limpeza de placa', 1, 220, 'servico']]
    ],
    [
      'Fernanda Alves',
      '(11) 91111-5050',
      'Celular',
      'iPhone 13',
      'Câmera traseira tremendo e sem foco.',
      'Capinha',
      'pronto',
      -4,
      [
        ['Módulo de câmera traseira (peça)', 1, 480, 'peca'],
        ['Troca de câmera', 1, 150, 'servico']
      ]
    ]
  ];
  const ordens = base.map(([nome, fone, tipo, modelo, defeito, acessorios, status, dias, itens], i) => {
    const criada = quando(dias - 1, ['09:10', '11:40', '14:05', '16:20'][i % 4]);
    const ordem = STATUS.findIndex(s => s.id === status);
    const historico = [{ quando: criada, texto: 'OS aberta no balcão' }];
    STATUS.slice(1, ordem + 1).forEach((s, k) =>
      historico.push({
        quando: quando(Math.min(0, dias + k), '15:00'),
        texto: `Status: ${s.nome}`
      })
    );
    const os = {
      num: 1040 + i,
      criada,
      cliente: { nome, fone },
      aparelho: { tipo, modelo, serie: '' },
      defeito,
      acessorios,
      prazo: somarDias(h, dias + 5),
      status,
      itens: itens.map(([desc, qtd, valor, t]) => ({
        desc,
        qtd,
        valor,
        tipo: t
      })),
      desconto: 0,
      historico,
      obs: ''
    };
    if (status === 'entregue') {
      os.entregue = somarDias(h, dias + 4);
      os.pagamento = i % 2 ? 'Pix' : 'Cartão de crédito';
    }
    return os;
  });
  return {
    seq: 1040 + base.length,
    ordens,
    loja: {
      nome: 'Bancada Assistência Técnica',
      fone: '(11) 3000-0000',
      endereco: 'Rua Teodoro Sampaio, 900 · Pinheiros'
    }
  };
}

export function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo && Array.isArray(salvo.ordens)) return salvo;
  } catch {
    /* sem armazenamento ou dado inválido */
  }
  return exemplo();
}

export function salvar(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
    return true;
  } catch {
    return false;
  }
}

export function recomecar() {
  return exemplo();
}
