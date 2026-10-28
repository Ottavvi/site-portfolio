// Trilha de TypeScript. O editor roda o compilador de verdade no navegador (modo strict): mostra os erros de tipo e
// depois roda o JavaScript gerado (js/estudos-ambientes.js). Não há DOM tipado: só console, setTimeout e fetch.
// Os testes leem window.__erros (os erros de tipo), window.__codigo (o texto) e window.__checar(trecho), que confere o
// código com um trecho a mais no fim (para ver se uma chamada errada é barrada); as funções rodam com w.eval('nome').
// Atenção: crases e ${ dos exemplos precisam de barra invertida. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'typescript',
  area: 'Desenvolvimento web',
  titulo: 'TypeScript',
  sigla: 'TS',
  linguagem: 'typescript',
  resumo: 'JavaScript com tipos: o editor avisa o erro antes de ele chegar a quem usa o site.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Tipos básicos, inferência, funções e o formato dos objetos.',
      modulos: [
        {
          titulo: 'Primeiros tipos',
          itens: [
            {
              id: 'por-que-typescript',
              titulo: 'Por que TypeScript',
              resumo: 'O que o compilador faz, tipos básicos e inferência.',
              minutos: 10,
              corpo: `
<p>Em JavaScript, <code>total("10", 5)</code> roda sem reclamar e devolve <code>"105"</code>. O erro só aparece depois, para quem usa o site. O <strong>TypeScript</strong> é JavaScript com <strong>tipos</strong>: você diz o que cada variável e cada função espera, e o compilador avisa os erros enquanto você escreve, antes de o código rodar.</p>
<p>O navegador não entende TypeScript. O compilador (<code>tsc</code>, ou ferramentas como o Vite) confere os tipos e gera JavaScript comum, só que sem os tipos. Neste editor acontece o mesmo: em cima do resultado aparecem os erros de tipo e, no console, a saída do programa.</p>
${codigo(`function total(preco: number, quantidade: number): number {
  return preco * quantidade;
}

console.log(total(10, 3));
console.log(total("10", 3)); // o compilador reclama desta linha`)}
${dica('As mensagens de erro vêm em inglês, como no VS Code e no terminal. Vale aprender a ler as mais comuns: "Type X is not assignable to type Y" quer dizer "você pôs um X onde se esperava um Y".')}

<h2>Os tipos básicos</h2>
${codigo(`let nome: string = 'Ana';
let idade: number = 31;          // inteiros e decimais são todos number
let ativo: boolean = true;
let tags: string[] = ['vip', 'sp'];
let ponto: [number, number] = [10, 20];  // tupla: tamanho e tipos fixos

idade = 'trinta e um';  // erro: string não é number
console.log(nome, idade, ativo, tags, ponto);`)}

<h2>Inferência</h2>
<p>Você não precisa anotar tudo. Quando o valor inicial já diz o tipo, o TypeScript <strong>infere</strong>:</p>
${codigo(`let cidade = 'Recife';     // inferido como string
const precos = [10, 20, 30]; // number[]
const dobro = precos.map(p => p * 2); // number[] também

cidade = 42; // erro, mesmo sem anotação nenhuma
console.log(dobro);`)}
<p>A regra prática: anote os <strong>parâmetros</strong> das funções (o TypeScript não tem como adivinhar o que vão passar) e deixe a inferência cuidar do resto. Anotar o retorno é opcional, mas ajuda: se a função mudar e passar a devolver outra coisa, o erro aparece nela, não em quem a chama.</p>

<h2>any: desligar a checagem</h2>
<p>O tipo <code>any</code> aceita qualquer coisa e desliga a verificação daquela variável. Às vezes é uma saída de emergência, mas cada <code>any</code> é um buraco por onde os erros voltam. No modo <code>strict</code> (o deste editor e o recomendado), um parâmetro sem tipo é um erro: "implicitly has an 'any' type".</p>
`,
              quiz: [
                {
                  pergunta: 'O navegador roda TypeScript diretamente?',
                  opcoes: ['Sim', 'Não: o compilador gera JavaScript sem os tipos', 'Só o Chrome'],
                  certa: 1,
                  explicacao: 'Os tipos servem durante o desenvolvimento e somem no JavaScript gerado.'
                },
                {
                  pergunta: 'O que o TypeScript infere em: const precos = [10, 20]?',
                  opcoes: ['any', 'number[]', 'string[]'],
                  certa: 1,
                  explicacao: 'O valor inicial já diz que é um array de números.'
                },
                {
                  pergunta: 'O que é recomendado sempre anotar?',
                  opcoes: ['Todas as variáveis', 'Os parâmetros das funções', 'Nada'],
                  certa: 1,
                  explicacao: 'Sem a anotação, o parâmetro vira any implícito, que o modo strict não aceita.'
                }
              ]
            },
            {
              id: 'objetos-e-interfaces',
              titulo: 'Objetos, interfaces e uniões de valores',
              resumo: 'interface, type, propriedades opcionais, readonly e tipos literais.',
              minutos: 12,
              corpo: `
<h2>O formato de um objeto</h2>
<p>Uma <code>interface</code> descreve as propriedades que um objeto tem e o tipo de cada uma:</p>
${codigo(`interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;     // opcional: pode faltar
  readonly sku: string;   // só leitura depois de criado
}

const cafe: Produto = { id: 1, nome: 'Café 1kg', preco: 62.9, sku: 'CAF-1' };
cafe.preco = 59.9;   // ok
cafe.sku = 'outro';  // erro: readonly

const caneca: Produto = { id: 2, nome: 'Caneca' }; // erro: faltam preco e sku
console.log(cafe.descricao?.toUpperCase() ?? 'sem descrição');`)}
<p>Propriedade opcional pode ser <code>undefined</code>. O TypeScript obriga você a tratar isso antes de usar, por exemplo com <code>?.</code> e <code>??</code>, e assim evita o clássico "Cannot read properties of undefined".</p>

<h2>type</h2>
<p>O <code>type</code> dá um nome a qualquer tipo. Para objetos, faz quase o mesmo que a interface; a diferença é que ele também serve para uniões e outras combinações:</p>
${codigo(`type Id = number | string;      // união: um OU outro
type Ponto = { x: number; y: number };

function mostrar(id: Id) {
  console.log('Id:', id);
}
mostrar(10);
mostrar('A-10');
mostrar(true); // erro`)}

<h2>Tipos literais</h2>
<p>Um tipo pode ser um <strong>valor exato</strong>. Unir alguns deles cria uma lista fechada de opções, e o editor completa e confere sozinho:</p>
${codigo(`type Status = 'pendente' | 'pago' | 'enviado' | 'cancelado';

interface Pedido {
  id: number;
  status: Status;
  itens: { produtoId: number; quantidade: number }[];
}

const pedido: Pedido = { id: 1, status: 'pago', itens: [{ produtoId: 3, quantidade: 2 }] };
pedido.status = 'entregue'; // erro: não está na lista
console.log(pedido);`)}
${dica('Interface ou type para objetos? Tanto faz na maior parte das vezes. Uma convenção comum: interface para o formato de objetos, type para uniões e o resto. O importante é manter um padrão no projeto.')}
`,
              quiz: [
                {
                  pergunta: 'O que o ? em descricao?: string significa?',
                  opcoes: ['A propriedade é opcional', 'A propriedade é nula', 'A propriedade é privada'],
                  certa: 0,
                  explicacao: 'Ela pode faltar; o tipo dela vira string | undefined.'
                },
                {
                  pergunta: "Com type Status = 'pago' | 'enviado', o que acontece em status = 'entregue'?",
                  opcoes: ['Funciona', 'Erro de tipo: o valor não está na lista', 'Vira string'],
                  certa: 1,
                  explicacao: 'Tipos literais criam uma lista fechada de valores aceitos.'
                },
                {
                  pergunta: 'O que readonly impede?',
                  opcoes: ['Ler a propriedade', 'Mudar a propriedade depois de criado o objeto', 'Copiar o objeto'],
                  certa: 1,
                  explicacao: 'A checagem é do compilador; no JavaScript gerado, a propriedade é comum.'
                }
              ]
            },
            {
              id: 'desafio-tipar-carrinho',
              tipo: 'desafio',
              titulo: 'Desafio: tipar o carrinho',
              resumo: 'Crie as interfaces e tipe as funções até zerar os erros.',
              minutos: 18,
              enunciado: `
<p>O código do carrinho veio de um projeto em JavaScript e está cheio de erros de tipo. Conserte:</p>
<ul>
  <li>Crie a <code>interface Item</code> com <code>nome</code> (texto), <code>preco</code> (número), <code>quantidade</code> (número) e <code>cupom</code> opcional (texto).</li>
  <li>Tipe <code>subtotal(item: Item): number</code> e <code>total(itens: Item[]): number</code>.</li>
  <li>Crie <code>type Frete = 'normal' | 'expresso'</code> e use em <code>custoDoFrete(tipo: Frete): number</code> (normal custa 10 e expresso 25).</li>
  <li>O código deve ficar <strong>sem nenhum erro de tipo</strong> e <strong>sem usar any</strong>.</li>
</ul>`,
              inicial: `function subtotal(item) {
  return item.preco * item.quantidade;
}

function total(itens) {
  return itens.reduce((soma, item) => soma + subtotal(item), 0);
}

function custoDoFrete(tipo) {
  return tipo === 'expresso' ? 25 : 10;
}

const carrinho = [
  { nome: 'Café', preco: 62.9, quantidade: 2 },
  { nome: 'Caneca', preco: 34.5, quantidade: 1, cupom: 'BEMVINDO' }
];
console.log(total(carrinho) + custoDoFrete('expresso'));
`,
              testes: [
                ['O código não tem erros de tipo', async doc => doc.defaultView.__erros.length === 0],
                ['Não usa any', async doc => !/\bany\b/.test(doc.defaultView.__codigo)],
                [
                  'A interface Item tem cupom opcional',
                  async doc => {
                    const w = doc.defaultView;
                    return (
                      /interface\s+Item\b/.test(w.__codigo) &&
                      w.__checar("const _a: Item = { nome: 'x', preco: 1, quantidade: 1 };").length === 0 &&
                      w.__checar("const _b: Item = { nome: 'x', preco: '1', quantidade: 1 };").length > 0 &&
                      w.__checar("const _c: Item = { nome: 'x', preco: 1 };").length > 0
                    );
                  }
                ],
                [
                  'total recusa itens errados e devolve number',
                  async doc => {
                    const w = doc.defaultView;
                    return (
                      w.__checar("total([{ nome: 'x', preco: '10', quantidade: 1 }]);").length > 0 &&
                      w.__checar('const _t: string = total([]);').length > 0 &&
                      w.eval(
                        "total([{ nome: 'a', preco: 10, quantidade: 3 }, { nome: 'b', preco: 5, quantidade: 1 }])"
                      ) === 35
                    );
                  }
                ],
                [
                  "custoDoFrete só aceita 'normal' ou 'expresso'",
                  async doc => {
                    const w = doc.defaultView;
                    return (
                      w.__checar("custoDoFrete('normal'); custoDoFrete('expresso');").length === 0 &&
                      w.__checar("custoDoFrete('voador');").length > 0 &&
                      w.eval("custoDoFrete('normal')") === 10
                    );
                  }
                ]
              ],
              solucao: `interface Item {
  nome: string;
  preco: number;
  quantidade: number;
  cupom?: string;
}

type Frete = 'normal' | 'expresso';

function subtotal(item: Item): number {
  return item.preco * item.quantidade;
}

function total(itens: Item[]): number {
  return itens.reduce((soma, item) => soma + subtotal(item), 0);
}

function custoDoFrete(tipo: Frete): number {
  return tipo === 'expresso' ? 25 : 10;
}

const carrinho: Item[] = [
  { nome: 'Café', preco: 62.9, quantidade: 2 },
  { nome: 'Caneca', preco: 34.5, quantidade: 1, cupom: 'BEMVINDO' }
];
console.log(total(carrinho) + custoDoFrete('expresso'));`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Estreitar tipos, uniões discriminadas, genéricos e tipos utilitários.',
      modulos: [
        {
          titulo: 'Tipos que se adaptam',
          itens: [
            {
              id: 'unioes-e-estreitamento',
              titulo: 'Uniões e estreitamento',
              resumo: 'typeof, in, uniões discriminadas e o never para não esquecer casos.',
              minutos: 13,
              corpo: `
<p>Com uma união (<code>string | number</code>), o TypeScript só deixa usar o que vale para <strong>todos</strong> os tipos dela. Para usar o resto, você precisa provar qual é o tipo naquele ponto, e ele <strong>estreita</strong> o tipo sozinho depois de um <code>if</code>:</p>
${codigo(`function formatar(valor: string | number): string {
  if (typeof valor === 'number') {
    return valor.toFixed(2);     // aqui valor é number
  }
  return valor.toUpperCase();    // aqui só pode ser string
}
console.log(formatar(3.14159), formatar('oi'));`)}
<p>Funcionam do mesmo jeito: <code>typeof</code>, <code>instanceof</code>, <code>Array.isArray</code>, comparar com <code>null</code> e o operador <code>in</code> (a propriedade existe no objeto?).</p>

<h2>Uniões discriminadas</h2>
<p>O padrão mais útil do TypeScript: vários formatos de objeto com uma propriedade em comum, de valor literal, que diz qual é qual:</p>
${codigo(`type Pagamento =
  | { tipo: 'pix'; chave: string }
  | { tipo: 'cartao'; numero: string; parcelas: number }
  | { tipo: 'boleto'; vencimento: string };

function descrever(p: Pagamento): string {
  switch (p.tipo) {
    case 'pix':
      return 'Pix para ' + p.chave;
    case 'cartao':
      return 'Cartão em ' + p.parcelas + 'x';   // p.parcelas só existe aqui
    case 'boleto':
      return 'Boleto até ' + p.vencimento;
  }
}
console.log(descrever({ tipo: 'cartao', numero: '4111', parcelas: 3 }));`)}

<h2>never: não esquecer nenhum caso</h2>
<p>Se alguém adicionar <code>{ tipo: 'dinheiro' }</code> à união, o <code>switch</code> acima fica incompleto em silêncio. Um <code>default</code> que atribui a <code>never</code> transforma o esquecimento em erro de compilação:</p>
${codigo(`type Forma = { tipo: 'circulo'; raio: number } | { tipo: 'quadrado'; lado: number } | { tipo: 'triangulo'; base: number; altura: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case 'circulo':
      return Math.PI * f.raio ** 2;
    case 'quadrado':
      return f.lado ** 2;
    default:
      const naoTratado: never = f; // erro: o triângulo ficou de fora
      return naoTratado;
  }
}`)}
${dica('Modelar o estado de uma tela como união discriminada evita estados impossíveis: <code>{ fase: "carregando" } | { fase: "erro"; mensagem: string } | { fase: "pronto"; dados: Produto[] }</code>. Não existe "carregando com dados e com erro ao mesmo tempo".')}
`,
              quiz: [
                {
                  pergunta: 'Depois de if (typeof valor === "number") return ..., o que valor é no resto da função?',
                  opcoes: ['number', 'string (o que sobrou da união string | number)', 'any'],
                  certa: 1,
                  explicacao: 'O TypeScript acompanha o fluxo e tira da união o que já foi tratado.'
                },
                {
                  pergunta: 'O que caracteriza uma união discriminada?',
                  opcoes: [
                    'Todos os tipos são iguais',
                    'Uma propriedade em comum, com valor literal diferente em cada formato',
                    'Usar classes'
                  ],
                  certa: 1,
                  explicacao: 'A propriedade (tipo, kind, status) diz qual formato é aquele.'
                },
                {
                  pergunta: 'Para que serve atribuir a never no default?',
                  opcoes: [
                    'Deixar o código mais rápido',
                    'Dar erro de compilação se algum caso da união não foi tratado',
                    'Ignorar erros'
                  ],
                  certa: 1,
                  explicacao: 'Se sobrou algum caso, ele não cabe em never e o compilador avisa.'
                }
              ]
            },
            {
              id: 'genericos-e-utilitarios',
              titulo: 'Genéricos e tipos utilitários',
              resumo: 'Funções que servem para qualquer tipo sem perder a checagem; Partial, Pick, Omit e Record.',
              minutos: 13,
              corpo: `
<h2>Genéricos</h2>
<p>Uma função que devolve o primeiro item de uma lista funciona para números, textos ou produtos. Com <code>any</code>, o tipo se perde. Com um <strong>parâmetro de tipo</strong> (<code>&lt;T&gt;</code>), ela continua sabendo o que entrou:</p>
${codigo(`function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}

const n = primeiro([10, 20]);        // number | undefined
const s = primeiro(['a', 'b']);      // string | undefined
console.log(n?.toFixed(1), s?.toUpperCase());

// Um tipo genérico: o mesmo formato de resposta para qualquer dado
interface Resposta<T> {
  dados: T;
  pagina: number;
}
const r: Resposta<string[]> = { dados: ['x'], pagina: 1 };
console.log(r.dados.length);`)}
<p>É assim que <code>Array&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code> e <code>Map&lt;K, V&gt;</code> funcionam.</p>

<h2>Restringir o genérico</h2>
<p>Às vezes o <code>T</code> precisa ter algo. <code>extends</code> exige isso, e <code>keyof T</code> é a união dos nomes das propriedades de <code>T</code>:</p>
${codigo(`function maisCaro<T extends { preco: number }>(itens: T[]): T {
  return itens.reduce((a, b) => (b.preco > a.preco ? b : a));
}

function valores<T, K extends keyof T>(itens: T[], chave: K): T[K][] {
  return itens.map(item => item[chave]);
}

const produtos = [{ nome: 'Café', preco: 62.9 }, { nome: 'Chá', preco: 22 }];
console.log(maisCaro(produtos).nome);
console.log(valores(produtos, 'nome'));     // string[]
console.log(valores(produtos, 'estoque'));  // erro: não existe`)}

<h2>Tipos utilitários</h2>
<p>O TypeScript traz tipos prontos que derivam um tipo de outro, sem repetir:</p>
${codigo(`interface Cliente { id: number; nome: string; email: string; telefone: string }

type NovoCliente = Omit<Cliente, 'id'>;                  // sem o id (o banco gera)
type Alteracao = Partial<Cliente>;                       // tudo opcional
type Contato = Pick<Cliente, 'email' | 'telefone'>;      // só essas duas
type PorEstado = Record<string, Cliente[]>;              // objeto: chave texto, valor lista

function atualizar(id: number, mudancas: Partial<Omit<Cliente, 'id'>>) {
  console.log('Atualizando', id, mudancas);
}
atualizar(7, { telefone: '(81) 99999-0000' });
atualizar(7, { id: 8 }); // erro: id não pode ser alterado`)}
${dica('Outros utilitários do dia a dia: <code>Readonly&lt;T&gt;</code>, <code>Required&lt;T&gt;</code>, <code>ReturnType&lt;typeof funcao&gt;</code> (o tipo que uma função devolve) e <code>Awaited&lt;T&gt;</code> (o que uma Promise entrega).')}
`,
              quiz: [
                {
                  pergunta: 'Qual a vantagem de primeiro<T>(lista: T[]): T sobre usar any?',
                  opcoes: [
                    'Nenhuma',
                    'O tipo de quem entra é mantido na saída, e a checagem continua',
                    'Fica mais rápido'
                  ],
                  certa: 1,
                  explicacao: 'Com any, o resultado perderia o tipo e os erros voltariam.'
                },
                {
                  pergunta: "O que Omit<Cliente, 'id'> produz?",
                  opcoes: ['Só o id', 'Cliente sem a propriedade id', 'Cliente com id opcional'],
                  certa: 1,
                  explicacao: 'Pick escolhe propriedades; Omit tira.'
                },
                {
                  pergunta: 'O que K extends keyof T exige?',
                  opcoes: ['Que K seja um número', 'Que K seja o nome de uma propriedade de T', 'Que T seja um array'],
                  certa: 1,
                  explicacao: 'Por isso valores(produtos, "estoque") dá erro.'
                }
              ]
            },
            {
              id: 'desafio-estado-da-tela',
              tipo: 'desafio',
              titulo: 'Desafio: o estado da tela',
              resumo: 'Uma união discriminada, um switch completo e um genérico.',
              minutos: 22,
              enunciado: `
<p>Modele o estado da tela de pedidos:</p>
<ul>
  <li><code>type Estado</code>: uma união discriminada pela propriedade <code>fase</code>: <code>{ fase: 'carregando' }</code>, <code>{ fase: 'erro'; mensagem: string }</code> e <code>{ fase: 'pronto'; pedidos: string[] }</code>.</li>
  <li><code>texto(estado: Estado): string</code>: devolve <code>'Carregando…'</code>, <code>'Erro: '</code> + a mensagem, ou <code>'N pedidos'</code> (com N o tamanho da lista). Use um <code>switch</code> com um <code>default</code> que atribui a <code>never</code>.</li>
  <li><code>ultimo&lt;T&gt;(lista: T[]): T | undefined</code>: o último item da lista, mantendo o tipo.</li>
  <li>Sem erros de tipo e sem <code>any</code>.</li>
</ul>`,
              inicial: `// type Estado = ...

function texto(estado) {
}

function ultimo(lista) {
}

console.log(texto({ fase: 'pronto', pedidos: ['#1', '#2'] }));
`,
              testes: [
                [
                  'O código não tem erros de tipo e não usa any',
                  async doc => doc.defaultView.__erros.length === 0 && !/\bany\b/.test(doc.defaultView.__codigo)
                ],
                [
                  'Estado aceita só os três formatos',
                  async doc => {
                    const w = doc.defaultView;
                    return (
                      w.__checar(
                        "const _e1: Estado = { fase: 'carregando' }; const _e2: Estado = { fase: 'erro', mensagem: 'x' }; const _e3: Estado = { fase: 'pronto', pedidos: [] };"
                      ).length === 0 &&
                      w.__checar("const _e4: Estado = { fase: 'erro' };").length > 0 &&
                      w.__checar("const _e5: Estado = { fase: 'pronto', pedidos: [1] };").length > 0 &&
                      w.__checar("const _e6: Estado = { fase: 'vazio' };").length > 0
                    );
                  }
                ],
                [
                  'texto devolve o texto de cada fase',
                  async doc => {
                    const w = doc.defaultView;
                    return (
                      w.eval("texto({ fase: 'carregando' })") === 'Carregando…' &&
                      w.eval("texto({ fase: 'erro', mensagem: 'sem rede' })") === 'Erro: sem rede' &&
                      w.eval("texto({ fase: 'pronto', pedidos: ['a', 'b', 'c'] })") === '3 pedidos'
                    );
                  }
                ],
                [
                  'O switch usa never para não esquecer casos',
                  async doc =>
                    /:\s*never\b/.test(doc.defaultView.__codigo) && /switch\s*\(/.test(doc.defaultView.__codigo)
                ],
                [
                  'ultimo é genérico e mantém o tipo',
                  async doc => {
                    const w = doc.defaultView;
                    return (
                      w.eval('ultimo([1, 2, 3])') === 3 &&
                      w.eval('ultimo([])') === undefined &&
                      w.__checar("const _u: string | undefined = ultimo(['a']);").length === 0 &&
                      w.__checar("const _v: number | undefined = ultimo(['a']);").length > 0
                    );
                  }
                ]
              ],
              solucao: `type Estado =
  | { fase: 'carregando' }
  | { fase: 'erro'; mensagem: string }
  | { fase: 'pronto'; pedidos: string[] };

function texto(estado: Estado): string {
  switch (estado.fase) {
    case 'carregando':
      return 'Carregando…';
    case 'erro':
      return 'Erro: ' + estado.mensagem;
    case 'pronto':
      return estado.pedidos.length + ' pedidos';
    default:
      const naoTratado: never = estado;
      return naoTratado;
  }
}

function ultimo<T>(lista: T[]): T | undefined {
  return lista[lista.length - 1];
}

console.log(texto({ fase: 'pronto', pedidos: ['#1', '#2'] }));`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Dados que vêm de fora, as const, satisfies e o TypeScript num projeto de verdade.',
      modulos: [
        {
          titulo: 'TypeScript no mundo real',
          itens: [
            {
              id: 'dados-de-fora',
              titulo: 'Dados de fora: unknown e validação',
              resumo: 'Os tipos não existem em tempo de execução: valide o que vem da API.',
              minutos: 13,
              corpo: `
<h2>O limite dos tipos</h2>
<p>Os tipos somem no JavaScript gerado. Se você escreve <code>const pedido: Pedido = await resposta.json()</code>, o TypeScript <strong>acredita</strong> em você, mas nada confere se a API mandou mesmo um pedido. Se ela mudar, o erro aparece longe dali.</p>

<h2>unknown</h2>
<p><code>unknown</code> é o oposto seguro do <code>any</code>: aceita qualquer valor, mas não deixa usar nada até você conferir o que é. É o tipo certo para tudo que vem de fora (JSON, localStorage, mensagens):</p>
${codigo(`const vindo: unknown = JSON.parse('{"id": 1, "total": 99.9}');

console.log(vindo.total); // erro: não sabemos o que é

if (typeof vindo === 'object' && vindo !== null && 'total' in vindo && typeof vindo.total === 'number') {
  console.log(vindo.total.toFixed(2)); // agora pode
}`)}

<h2>Type guard: uma função que prova o tipo</h2>
<p>Uma função com retorno <code>x is Tipo</code> ensina o TypeScript: se ela devolver <code>true</code>, o valor é daquele tipo dali em diante.</p>
${codigo(`interface Pedido { id: number; total: number }

function ehPedido(x: unknown): x is Pedido {
  return (
    typeof x === 'object' && x !== null &&
    typeof (x as Pedido).id === 'number' &&
    typeof (x as Pedido).total === 'number'
  );
}

const dados: unknown = JSON.parse('[{"id":1,"total":10},{"id":"2"}]');
const pedidos = Array.isArray(dados) ? dados.filter(ehPedido) : [];
console.log(pedidos); // Pedido[]: só o que passou na checagem`)}
<p>Em projetos maiores, bibliotecas como o <strong>Zod</strong> fazem isso de forma declarativa: você descreve o formato uma vez e ganha a validação e o tipo juntos.</p>

<h2>as const e satisfies</h2>
${codigo(`// as const: o valor vira literal e somente leitura
const FRETES = ['normal', 'expresso', 'retirada'] as const;
type Frete = (typeof FRETES)[number];   // 'normal' | 'expresso' | 'retirada'

// satisfies: confere o formato sem perder o tipo exato
const cores = {
  primaria: '#0b7a6f',
  erro: '#b42318'
} satisfies Record<string, string>;
cores.primaria.toUpperCase(); // ok: o TS sabe que primaria existe

const f: Frete = 'retirada';
console.log(FRETES, f);`)}
${dica('O <code>as</code> (como em <code>x as Pedido</code>) não converte nada: só manda o compilador acreditar. Use o mínimo possível, e de preferência dentro de uma função de checagem, como no <code>ehPedido</code>.')}
`,
              quiz: [
                {
                  pergunta: 'O que o TypeScript confere em const p: Pedido = await resposta.json()?',
                  opcoes: [
                    'Que a API mandou um pedido válido',
                    'Nada: json() devolve any e o tipo é só uma promessa sua',
                    'Só o id'
                  ],
                  certa: 1,
                  explicacao: 'Em tempo de execução não há tipos. É preciso validar.'
                },
                {
                  pergunta: 'Qual a diferença entre any e unknown?',
                  opcoes: [
                    'Nenhuma',
                    'unknown aceita qualquer valor, mas exige checagem antes de usar',
                    'unknown só aceita objetos'
                  ],
                  certa: 1,
                  explicacao: 'any desliga a checagem; unknown obriga a fazer.'
                },
                {
                  pergunta: 'O que uma função com retorno x is Pedido faz?',
                  opcoes: [
                    'Converte x em Pedido',
                    'Quando devolve true, o TypeScript passa a tratar x como Pedido',
                    'Lança erro se não for Pedido'
                  ],
                  certa: 1,
                  explicacao: 'É um type guard: a checagem que você escreveu vira informação de tipo.'
                }
              ]
            },
            {
              id: 'typescript-no-projeto',
              titulo: 'TypeScript num projeto de verdade',
              resumo: 'tsconfig, strict, tsc --noEmit, Vite, módulos e tipos de bibliotecas.',
              minutos: 11,
              corpo: `
<h2>Instalar e configurar</h2>
${trecho(`npm install --save-dev typescript
npx tsc --init          # cria o tsconfig.json`)}
<p>O <code>tsconfig.json</code> diz como compilar. As opções que mais importam:</p>
${trecho(`{
  "compilerOptions": {
    "target": "ES2022",          // qual JavaScript gerar
    "module": "ESNext",          // import/export
    "moduleResolution": "Bundler",
    "strict": true,              // liga todas as checagens importantes
    "noUncheckedIndexedAccess": true, // lista[0] pode ser undefined
    "outDir": "dist"
  },
  "include": ["src"]
}`)}
${dica('Comece projetos novos com <code>"strict": true</code>. Ligar depois, num projeto grande, gera centenas de erros de uma vez.')}

<h2>Quem compila</h2>
<ul>
  <li><strong>tsc</strong>: confere os tipos e gera o JavaScript. <code>npx tsc --noEmit</code> só confere, ótimo para rodar no GitHub Actions.</li>
  <li><strong>Vite</strong> (e esbuild, swc): <em>apagam</em> os tipos muito rápido, sem conferir. Por isso, num projeto com Vite, rode o <code>tsc --noEmit</code> à parte (o template <code>npm create vite@latest</code> com TypeScript já faz isso no <code>npm run build</code>).</li>
  <li><strong>Node</strong>: as versões recentes já rodam arquivos <code>.ts</code> diretamente, também só apagando os tipos.</li>
</ul>

<h2>Módulos e tipos</h2>
${trecho(`// tipos.ts
export interface Produto { id: number; nome: string; preco: number }

// carrinho.ts
import type { Produto } from './tipos';  // "import type" some no JavaScript gerado
export function total(itens: Produto[]) { /* ... */ }`)}

<h2>Bibliotecas</h2>
<p>A maioria das bibliotecas já vem com tipos. As antigas, escritas em JavaScript, costumam ter os tipos num pacote separado mantido pela comunidade: <code>npm install --save-dev @types/nome-da-biblioteca</code>. Os arquivos <code>.d.ts</code> só têm declarações de tipo, sem código.</p>

<h2>Sem trocar de linguagem</h2>
<p>Num projeto em JavaScript, dá para ganhar boa parte da checagem sem converter nada: ponha <code>// @ts-check</code> no topo do arquivo e descreva os tipos em comentários JSDoc. O VS Code passa a apontar os erros.</p>
${trecho(`// @ts-check

/**
 * @param {number} preco
 * @param {number} quantidade
 * @returns {number}
 */
function total(preco, quantidade) {
  return preco * quantidade;
}`)}
`,
              quiz: [
                {
                  pergunta: 'Num projeto com Vite, quem confere os tipos?',
                  opcoes: ['O Vite', 'O tsc (por exemplo, tsc --noEmit no build ou no CI)', 'O navegador'],
                  certa: 1,
                  explicacao: 'O Vite só apaga os tipos, para ser rápido.'
                },
                {
                  pergunta: 'Para que serve o pacote @types/alguma-coisa?',
                  opcoes: [
                    'Instalar a biblioteca',
                    'Dar tipos a uma biblioteca escrita em JavaScript que não traz os seus',
                    'Converter JavaScript em TypeScript'
                  ],
                  certa: 1,
                  explicacao: 'São só arquivos .d.ts com as declarações.'
                },
                {
                  pergunta: 'O que // @ts-check faz num arquivo .js?',
                  opcoes: [
                    'Converte o arquivo para TypeScript',
                    'Liga a checagem de tipos no editor, com os tipos vindos do JSDoc',
                    'Nada'
                  ],
                  certa: 1,
                  explicacao: 'Uma porta de entrada sem mudar a linguagem do projeto.'
                }
              ]
            },
            {
              id: 'desafio-validar-api',
              tipo: 'desafio',
              titulo: 'Desafio: validar o que veio da API',
              resumo: 'Type guard, unknown e um agrupamento genérico com keyof.',
              minutos: 25,
              enunciado: `
<p>A API de reservas manda JSON que às vezes vem quebrado. Escreva, <strong>sem any e sem erros de tipo</strong>:</p>
<ul>
  <li><code>interface Reserva</code> com <code>id</code> (número), <code>hospede</code> (texto), <code>noites</code> (número) e <code>quarto</code> do tipo <code>'casal' | 'triplo'</code>.</li>
  <li><code>ehReserva(x: unknown): x is Reserva</code>: confere cada propriedade (inclusive se o quarto é um dos dois valores).</li>
  <li><code>lerReservas(json: string): Reserva[]</code>: converte o texto e devolve só as reservas válidas. JSON inválido ou que não seja um array devolve <code>[]</code>.</li>
  <li><code>agruparPor&lt;T, K extends keyof T&gt;(itens: T[], chave: K)</code>: devolve um objeto com uma lista de itens para cada valor da chave, como <code>{ casal: [...], triplo: [...] }</code>. Tipe o retorno como <code>Record&lt;string, T[]&gt;</code>.</li>
</ul>`,
              inicial: `// interface Reserva ...

function ehReserva(x: unknown): x is Reserva {
  return false;
}

function lerReservas(json: string) {
}

function agruparPor(itens, chave) {
}

const texto = '[{"id":1,"hospede":"Ana","noites":2,"quarto":"casal"},{"id":"x"}]';
console.log(lerReservas(texto));
`,
              testes: [
                [
                  'Sem erros de tipo e sem any',
                  async doc => doc.defaultView.__erros.length === 0 && !/\bany\b/.test(doc.defaultView.__codigo)
                ],
                [
                  'ehReserva aceita só reservas completas e com quarto válido',
                  async doc => {
                    const w = doc.defaultView;
                    const f = w.eval('ehReserva');
                    return (
                      f({ id: 1, hospede: 'Ana', noites: 2, quarto: 'casal' }) === true &&
                      f({ id: 1, hospede: 'Ana', noites: 2, quarto: 'suite' }) === false &&
                      f({ id: '1', hospede: 'Ana', noites: 2, quarto: 'casal' }) === false &&
                      f({ id: 1, hospede: 'Ana', quarto: 'triplo' }) === false &&
                      f(null) === false &&
                      f('texto') === false
                    );
                  }
                ],
                [
                  'lerReservas devolve só as válidas, e [] para JSON ruim',
                  async doc => {
                    const f = doc.defaultView.eval('lerReservas');
                    const r = f('[{"id":1,"hospede":"Ana","noites":2,"quarto":"casal"},{"id":"x"},7]');
                    return (
                      Array.isArray(r) &&
                      r.length === 1 &&
                      r[0].hospede === 'Ana' &&
                      f('{quebrado').length === 0 &&
                      f('{"id":1}').length === 0
                    );
                  }
                ],
                [
                  'lerReservas devolve Reserva[] e agruparPor só aceita chaves que existem',
                  async doc => {
                    const w = doc.defaultView;
                    return (
                      w.__checar("const _r: Reserva[] = lerReservas('[]');").length === 0 &&
                      w.__checar("const _s: string[] = lerReservas('[]');").length > 0 &&
                      w.__checar("agruparPor(lerReservas('[]'), 'quarto');").length === 0 &&
                      w.__checar("agruparPor(lerReservas('[]'), 'cama');").length > 0
                    );
                  }
                ],
                [
                  'agruparPor junta os itens pelo valor da chave',
                  async doc => {
                    const f = doc.defaultView.eval('agruparPor');
                    const r = f(
                      [
                        { id: 1, quarto: 'casal' },
                        { id: 2, quarto: 'triplo' },
                        { id: 3, quarto: 'casal' }
                      ],
                      'quarto'
                    );
                    return (
                      r.casal?.map(x => x.id).join() === '1,3' &&
                      r.triplo?.map(x => x.id).join() === '2' &&
                      Object.keys(r).length === 2
                    );
                  }
                ]
              ],
              solucao: `interface Reserva {
  id: number;
  hospede: string;
  noites: number;
  quarto: 'casal' | 'triplo';
}

function ehReserva(x: unknown): x is Reserva {
  if (typeof x !== 'object' || x === null) return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.id === 'number' &&
    typeof r.hospede === 'string' &&
    typeof r.noites === 'number' &&
    (r.quarto === 'casal' || r.quarto === 'triplo')
  );
}

function lerReservas(json: string): Reserva[] {
  let dados: unknown;
  try {
    dados = JSON.parse(json);
  } catch {
    return [];
  }
  return Array.isArray(dados) ? dados.filter(ehReserva) : [];
}

function agruparPor<T, K extends keyof T>(itens: T[], chave: K): Record<string, T[]> {
  const grupos: Record<string, T[]> = {};
  for (const item of itens) {
    const valor = String(item[chave]);
    (grupos[valor] ??= []).push(item);
  }
  return grupos;
}

const texto = '[{"id":1,"hospede":"Ana","noites":2,"quarto":"casal"},{"id":"x"}]';
console.log(lerReservas(texto));`
            }
          ]
        }
      ]
    }
  ]
};
