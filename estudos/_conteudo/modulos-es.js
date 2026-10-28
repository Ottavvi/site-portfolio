// Trilha de Módulos ES. O editor desta trilha aceita vários arquivos: a primeira parte é a página (HTML) e cada linha
// "// --- nome.js ---" começa um arquivo novo. Os './nome.js' dos import apontam para esses arquivos.
// Os testes leem o código de cada arquivo em window.__arquivos e conferem o resultado na página.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'modulos-es',
  area: 'Desenvolvimento web',
  titulo: 'Módulos ES',
  sigla: 'ES',
  linguagem: 'modulos',
  resumo: 'import e export para dividir o código em arquivos, sem ferramenta de build.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Dividir o código em arquivos com import e export.',
      modulos: [
        {
          titulo: 'Import e export',
          itens: [
            {
              id: 'por-que-modulos',
              titulo: 'Por que dividir em módulos',
              resumo: 'type="module", export e import, e como o editor desta trilha simula arquivos.',
              minutos: 9,
              corpo: `
<p>Quando um site cresce, um único <code>app.js</code> com mil linhas vira um problema: tudo enxerga tudo, uma variável <code>total</code> de um lado sobrescreve a <code>total</code> do outro, e ninguém sabe de onde vem cada função. Os <strong>módulos</strong> resolvem isso: cada arquivo tem o seu próprio escopo e diz explicitamente o que <strong>exporta</strong> e o que <strong>importa</strong>.</p>

<h2>Os arquivos desta trilha</h2>
<p>Nesta trilha, o editor finge que existem vários arquivos. A primeira parte é a página HTML, e cada linha <code>// --- nome.js ---</code> começa um arquivo novo:</p>
${codigo(`<p id="saida"></p>
<script type="module" src="./main.js"></script>

// --- matematica.js ---
export function somar(a, b) {
  return a + b;
}

export const PI = 3.14159;

// --- main.js ---
import { somar, PI } from './matematica.js';

document.querySelector('#saida').textContent = \`2 + 3 = \${somar(2, 3)} e PI vale \${PI}\`;`)}

<h2>As três regras básicas</h2>
<ul>
  <li>O script precisa de <code>type="module"</code>. Sem isso, o navegador não aceita <code>import</code>.</li>
  <li><code>export</code> na frente de uma função, classe ou variável deixa ela disponível para outros arquivos. O que não é exportado fica privado.</li>
  <li><code>import { nome } from './arquivo.js'</code> traz o que foi exportado. O caminho começa com <code>./</code> (ou <code>../</code>) e <strong>termina com .js</strong>: no navegador, não dá para omitir a extensão.</li>
</ul>
${dica('Abrir um <code>index.html</code> com módulos direto do disco (<code>file://</code>) não funciona: o navegador bloqueia. Use um servidor local, como <code>npx serve .</code> ou a extensão Live Server do VS Code.')}

<h2>O que fica privado</h2>
${codigo(`<p id="saida"></p>
<script type="module" src="./main.js"></script>

// --- contador.js ---
let valor = 0; // não exportado: ninguém de fora consegue mexer direto

export function incrementar() {
  valor++;
  return valor;
}

// --- main.js ---
import { incrementar } from './contador.js';

incrementar();
incrementar();
document.querySelector('#saida').textContent = 'Contador: ' + incrementar();
console.log(typeof valor); // "undefined": a variável é privada do módulo`)}
`,
              quiz: [
                {
                  pergunta: 'O que é obrigatório na tag script para usar import?',
                  opcoes: ['defer', 'type="module"', 'async'],
                  certa: 1,
                  explicacao: 'Só scripts com type="module" podem usar import e export.'
                },
                {
                  pergunta: 'No navegador, como importar do arquivo util.js na mesma pasta?',
                  opcoes: ["from 'util'", "from './util.js'", "from 'util.js'"],
                  certa: 1,
                  explicacao:
                    'O caminho precisa começar com ./ e ter a extensão. Nomes sem caminho só funcionam com import map.'
                },
                {
                  pergunta: 'O que acontece com uma variável não exportada de um módulo?',
                  opcoes: ['Vira global', 'Fica privada daquele arquivo', 'Dá erro'],
                  certa: 1,
                  explicacao: 'Cada módulo tem escopo próprio: só o que é exportado sai dele.'
                }
              ]
            },
            {
              id: 'formas-de-exportar',
              titulo: 'Formas de exportar e importar',
              resumo: 'Exportação padrão, renomear com as, import * e reexportar.',
              minutos: 10,
              corpo: `
<h2>Exportação com nome e exportação padrão</h2>
<p>Um módulo pode ter várias exportações <strong>com nome</strong> e no máximo uma exportação <strong>padrão</strong> (<code>export default</code>). A padrão é importada sem chaves, com o nome que você quiser:</p>
${codigo(`<ul id="lista"></ul>
<script type="module" src="./main.js"></script>

// --- tarefa.js ---
export default class Tarefa {
  constructor(titulo) {
    this.titulo = titulo;
    this.feita = false;
  }
}

export function criarVarias(titulos) {
  return titulos.map(t => new Tarefa(t));
}

// --- main.js ---
import Tarefa, { criarVarias } from './tarefa.js';

const tarefas = [new Tarefa('Estudar'), ...criarVarias(['Treinar', 'Ler'])];
for (const t of tarefas) {
  const li = document.createElement('li');
  li.textContent = t.titulo;
  document.querySelector('#lista').append(li);
}`)}
${dica('Muitos times preferem só exportações com nome: o nome fica igual em todo o projeto, a busca acha todos os usos e o editor completa o import sozinho.')}

<h2>Renomear e importar tudo</h2>
${trecho(`// Renomear na importação (útil quando dois módulos exportam o mesmo nome)
import { formatar as formatarData } from './datas.js';
import { formatar as formatarMoeda } from './dinheiro.js';

// Renomear na exportação
function calcularTotal() { /* ... */ }
export { calcularTotal as total };

// Importar tudo num objeto
import * as datas from './datas.js';
datas.formatar(new Date());`)}

<h2>Reexportar: um arquivo de entrada</h2>
<p>Quando uma pasta tem vários módulos, é comum criar um arquivo que reexporta tudo. Quem usa importa de um lugar só:</p>
${codigo(`<p id="saida"></p>
<script type="module" src="./main.js"></script>

// --- texto.js ---
export const maiusculas = t => t.toUpperCase();

// --- numeros.js ---
export const dobro = n => n * 2;

// --- utils.js ---
export { maiusculas } from './texto.js';
export * from './numeros.js';

// --- main.js ---
import { maiusculas, dobro } from './utils.js';
document.querySelector('#saida').textContent = maiusculas('ok ') + dobro(21);`)}
`,
              quiz: [
                {
                  pergunta: 'Quantas exportações padrão um módulo pode ter?',
                  opcoes: ['Nenhuma', 'No máximo uma', 'Quantas quiser'],
                  certa: 1,
                  explicacao: 'Uma default e quantas exportações com nome quiser.'
                },
                {
                  pergunta: 'Como importar a exportação padrão de grafico.js?',
                  opcoes: [
                    "import { default } from './grafico.js'",
                    "import Grafico from './grafico.js'",
                    "import * from './grafico.js'"
                  ],
                  certa: 1,
                  explicacao: 'A padrão vem sem chaves, e você escolhe o nome local.'
                },
                {
                  pergunta: 'Para que serve import { formatar as formatarData }?',
                  opcoes: ['Copiar a função', 'Usar outro nome local para a função importada', 'Exportar de novo'],
                  certa: 1,
                  explicacao: 'O as renomeia, evitando conflito com outro formatar.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Como os módulos se comportam e como organizar um projeto.',
      modulos: [
        {
          titulo: 'Organizar um projeto',
          itens: [
            {
              id: 'como-modulos-funcionam',
              titulo: 'Como os módulos funcionam',
              resumo: 'Modo estrito, execução única, defer e await no topo.',
              minutos: 11,
              corpo: `
<p>Módulos não são só scripts com <code>import</code>. Eles têm algumas regras diferentes que vale conhecer:</p>
<ul>
  <li><strong>Modo estrito sempre</strong>: atribuir a uma variável não declarada dá erro, em vez de criar uma global sem querer.</li>
  <li><strong>Escopo próprio</strong>: <code>const</code> e <code>function</code> no topo do módulo não viram propriedades de <code>window</code>.</li>
  <li><strong>Rodam uma vez só</strong>: se dez arquivos importarem o mesmo módulo, ele é executado uma vez e todos recebem a mesma instância.</li>
  <li><strong>São adiados</strong>: <code>type="module"</code> já se comporta como <code>defer</code>. O HTML inteiro é lido antes, então dá para buscar elementos sem esperar o <code>DOMContentLoaded</code>.</li>
</ul>

<h2>Um módulo é executado uma vez</h2>
<p>Isso permite guardar estado compartilhado num módulo, como uma configuração ou um "store" simples:</p>
${codigo(`<p id="saida"></p>
<script type="module" src="./main.js"></script>

// --- config.js ---
console.log('config.js executou');
export const config = { tema: 'claro' };

// --- tema.js ---
import { config } from './config.js';
export function escurecer() { config.tema = 'escuro'; }

// --- main.js ---
import { config } from './config.js';
import { escurecer } from './tema.js';

escurecer();
document.querySelector('#saida').textContent = 'Tema: ' + config.tema;`)}
<p>Repare no console: "config.js executou" aparece uma vez só, e a mudança feita por <code>tema.js</code> é vista em <code>main.js</code>.</p>

<h2>Importações são ligações vivas</h2>
<p>O que você importa não é uma cópia: é uma ligação com a variável do outro módulo. Se ela mudar lá, muda aqui. Mas só quem exporta pode reatribuir: tentar <code>contador = 5</code> no arquivo que importou dá erro.</p>

<h2>await no topo</h2>
<p>Dentro de módulos, dá para usar <code>await</code> fora de funções. O módulo que importa espera esse terminar:</p>
${codigo(`<p id="saida">Carregando…</p>
<script type="module" src="./main.js"></script>

// --- dados.js ---
const espera = ms => new Promise(r => setTimeout(r, ms));
await espera(500);
export const produtos = ['Café', 'Chá', 'Filtro'];

// --- main.js ---
import { produtos } from './dados.js';
document.querySelector('#saida').textContent = produtos.join(', ');`)}
${dica('Await no topo é ótimo para carregar uma configuração, mas segura todos os módulos que dependem daquele. Para coisas lentas, prefira carregar depois, com <code>import()</code> (próximo nível).')}
`,
              quiz: [
                {
                  pergunta: 'Dez módulos importam config.js. Quantas vezes ele executa?',
                  opcoes: ['Dez', 'Uma', 'Nenhuma'],
                  certa: 1,
                  explicacao:
                    'O navegador guarda o módulo depois da primeira vez e entrega a mesma instância para todos.'
                },
                {
                  pergunta: 'Um script type="module" precisa esperar o DOMContentLoaded para achar elementos?',
                  opcoes: ['Sim, sempre', 'Não: ele já roda depois do HTML ser lido, como defer', 'Só no Chrome'],
                  certa: 1,
                  explicacao: 'Módulos são adiados por padrão.'
                },
                {
                  pergunta: 'O que acontece ao atribuir a uma variável nunca declarada num módulo?',
                  opcoes: ['Cria uma global', 'Dá ReferenceError (modo estrito)', 'Nada'],
                  certa: 1,
                  explicacao: 'Módulos rodam sempre em modo estrito, que transforma esse descuido em erro.'
                }
              ]
            },
            {
              id: 'desafio-loja-modular',
              tipo: 'desafio',
              titulo: 'Desafio: carrinho em módulos',
              resumo: 'Divida o código de um carrinho em três módulos.',
              minutos: 20,
              enunciado: `
<p>O carrinho funciona, mas está tudo em <code>main.js</code>. Reorganize em módulos:</p>
<ul>
  <li><code>dinheiro.js</code> exporta (com nome) a função <code>formatar(valor)</code>, que devolve o valor em reais com <code>Intl.NumberFormat</code>.</li>
  <li><code>carrinho.js</code> tem como <strong>exportação padrão</strong> a função que calcula o total dos itens (preço vezes quantidade).</li>
  <li><code>main.js</code> importa as duas e mostra o total formatado em <code>#total</code>, sem definir nenhuma das funções.</li>
</ul>`,
              inicial: `<p>Total do carrinho: <strong id="total"></strong></p>
<script type="module" src="./main.js"></script>

// --- dinheiro.js ---

// --- carrinho.js ---

// --- main.js ---
const itens = [
  { nome: 'Café', preco: 62.9, quantidade: 2 },
  { nome: 'Caneca', preco: 34.5, quantidade: 1 }
];

function formatar(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function total(lista) {
  return lista.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

document.querySelector('#total').textContent = formatar(total(itens));
`,
              testes: [
                [
                  'dinheiro.js exporta a função formatar',
                  doc =>
                    /export\s+(function\s+formatar\b|const\s+formatar\b|\{[^}]*\bformatar\b)/.test(
                      doc.defaultView.__arquivos['dinheiro.js'] || ''
                    )
                ],
                [
                  'carrinho.js tem uma exportação padrão',
                  doc => /export\s+default\b/.test(doc.defaultView.__arquivos['carrinho.js'] || '')
                ],
                [
                  'main.js importa dos dois módulos e não define as funções',
                  doc => {
                    const main = doc.defaultView.__arquivos['main.js'] || '';
                    return (
                      /from\s+['"]\.\/dinheiro\.js['"]/.test(main) &&
                      /from\s+['"]\.\/carrinho\.js['"]/.test(main) &&
                      !/function\s+(formatar|total)\b/.test(main)
                    );
                  }
                ],
                [
                  '#total mostra R$ 160,30',
                  async doc => {
                    await doc.defaultView.__esperar(100);
                    return doc.querySelector('#total').textContent.replace(/\s/g, ' ') === 'R$ 160,30';
                  }
                ]
              ],
              solucao: `<p>Total do carrinho: <strong id="total"></strong></p>
<script type="module" src="./main.js"></script>

// --- dinheiro.js ---
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatar(valor) {
  return moeda.format(valor);
}

// --- carrinho.js ---
export default function total(lista) {
  return lista.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

// --- main.js ---
import { formatar } from './dinheiro.js';
import total from './carrinho.js';

const itens = [
  { nome: 'Café', preco: 62.9, quantidade: 2 },
  { nome: 'Caneca', preco: 34.5, quantidade: 1 }
];

document.querySelector('#total').textContent = formatar(total(itens));`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Carregar código só quando precisa e usar bibliotecas sem build.',
      modulos: [
        {
          titulo: 'Carregar sob demanda',
          itens: [
            {
              id: 'import-dinamico',
              titulo: 'import() e import maps',
              resumo: 'Carregar módulos sob demanda e usar bibliotecas pelo nome.',
              minutos: 12,
              corpo: `
<h2>import(): carregar quando precisar</h2>
<p>O <code>import</code> normal carrega tudo antes de a página começar. Mas um editor de imagens, um gráfico pesado ou a tela de administração não precisam ser baixados por quem nunca vai usá-los. <code>import('./arquivo.js')</code> carrega o módulo na hora e devolve uma <strong>Promise</strong> com as exportações:</p>
${codigo(`<button id="abrir">Mostrar relatório</button>
<div id="area"></div>
<script type="module" src="./main.js"></script>

// --- relatorio.js ---
console.log('relatorio.js foi baixado agora');
export function desenhar(elemento) {
  elemento.innerHTML = '<h2>Relatório</h2><p>Vendas do mês: 42</p>';
}

// --- main.js ---
document.querySelector('#abrir').addEventListener('click', async () => {
  const { desenhar } = await import('./relatorio.js');
  desenhar(document.querySelector('#area'));
});`)}
<p>Abra o console e clique: a mensagem só aparece no clique. Clicar de novo não baixa outra vez, porque o módulo fica guardado.</p>
${dica('Ferramentas como o Vite fazem isso automaticamente: cada <code>import()</code> vira um arquivo separado no build ("code splitting").')}

<h2>Import maps: bibliotecas pelo nome</h2>
<p>Em projetos com npm, escrevemos <code>import confetti from 'canvas-confetti'</code>. No navegador puro, um nome sem caminho não significa nada... a menos que um <strong>import map</strong> diga para onde ele aponta:</p>
${trecho(`<script type="importmap">
{
  "imports": {
    "dayjs": "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm"
  }
}
</script>

<script type="module">
  import dayjs from 'dayjs';
  console.log(dayjs().format('DD/MM/YYYY'));
</script>`)}
<p>O import map precisa vir <strong>antes</strong> de qualquer módulo. Fixe sempre a versão exata da biblioteca na URL, para uma atualização não quebrar o site sem aviso.</p>

<h2>Pré-carregar</h2>
<p>Num site com muitos módulos, o navegador só descobre que <code>main.js</code> importa <code>api.js</code> depois de baixar <code>main.js</code>. <code>&lt;link rel=&quot;modulepreload&quot; href=&quot;api.js&quot;&gt;</code> no <code>&lt;head&gt;</code> avisa antes, e os downloads acontecem em paralelo.</p>
`,
              quiz: [
                {
                  pergunta: "O que import('./grafico.js') devolve?",
                  opcoes: ['O módulo direto', 'Uma Promise com as exportações do módulo', 'undefined'],
                  certa: 1,
                  explicacao: 'Por isso usamos await (ou .then) para pegar as exportações.'
                },
                {
                  pergunta: 'Para que serve um import map?',
                  opcoes: [
                    'Minificar o código',
                    "Dizer para onde aponta um nome como 'dayjs' num import",
                    'Listar os arquivos do projeto'
                  ],
                  certa: 1,
                  explicacao: 'Ele traduz nomes "nus" para URLs, sem precisar de build.'
                },
                {
                  pergunta: 'Qual a vantagem de carregar um módulo pesado com import()?',
                  opcoes: [
                    'Ele roda mais rápido',
                    'Quem nunca usa aquela parte não baixa o código',
                    'Não precisa de export'
                  ],
                  certa: 1,
                  explicacao: 'A página inicial fica mais leve, e o módulo é baixado só quando for usado.'
                }
              ]
            },
            {
              id: 'desafio-sob-demanda',
              tipo: 'desafio',
              titulo: 'Desafio: abas carregadas sob demanda',
              resumo: 'Cada aba carrega o seu módulo com import() só quando é aberta.',
              minutos: 22,
              enunciado: `
<p>A página tem duas abas. O conteúdo de cada uma está num módulo (<code>perfil.js</code> e <code>pedidos.js</code>), e cada módulo tem uma exportação padrão: uma função que recebe o elemento <code>#painel</code> e desenha o conteúdo.</p>
<ul>
  <li><code>main.js</code> <strong>não</strong> pode importar as abas no topo (nada de <code>import ... from</code> delas).</li>
  <li>Clicar num botão com <code>data-aba</code> carrega o módulo daquela aba com <code>import()</code> e chama a exportação padrão com o <code>#painel</code>.</li>
  <li>Antes de qualquer clique, nenhum dos dois módulos foi executado (cada um avisa em <code>window.carregados</code> quando roda).</li>
</ul>`,
              inicial: `<nav>
  <button data-aba="perfil">Perfil</button>
  <button data-aba="pedidos">Pedidos</button>
</nav>
<div id="painel">Escolha uma aba.</div>
<script>window.carregados = [];</script>
<script type="module" src="./main.js"></script>

// --- perfil.js ---
window.carregados.push('perfil');
export default function desenhar(painel) {
  painel.innerHTML = '<h2>Perfil</h2><p>Ana Souza, cliente desde 2024.</p>';
}

// --- pedidos.js ---
window.carregados.push('pedidos');
export default function desenhar(painel) {
  painel.innerHTML = '<h2>Pedidos</h2><p>3 pedidos entregues.</p>';
}

// --- main.js ---
import desenharPerfil from './perfil.js';
import desenharPedidos from './pedidos.js';

const painel = document.querySelector('#painel');
document.querySelector('[data-aba="perfil"]').addEventListener('click', () => desenharPerfil(painel));
document.querySelector('[data-aba="pedidos"]').addEventListener('click', () => desenharPedidos(painel));
`,
              testes: [
                [
                  'main.js não importa as abas no topo',
                  doc =>
                    !/import\s+[\w{}\s,*]+\s+from\s+['"]\.\/(perfil|pedidos)\.js['"]/.test(
                      doc.defaultView.__arquivos['main.js'] || ''
                    )
                ],
                [
                  'Antes de clicar, nenhum módulo de aba foi carregado',
                  async doc => {
                    await doc.defaultView.__esperar(150);
                    return (
                      Array.isArray(doc.defaultView.carregados) &&
                      doc.defaultView.carregados.length === 0 &&
                      /import\s*\(/.test(doc.defaultView.__arquivos['main.js'] || '')
                    );
                  }
                ],
                [
                  'Clicar em Pedidos carrega só pedidos.js e mostra o conteúdo',
                  async doc => {
                    doc.querySelector('[data-aba="pedidos"]').click();
                    for (let i = 0; i < 20 && !doc.querySelector('#painel h2'); i++)
                      await doc.defaultView.__esperar(50);
                    return (
                      doc.querySelector('#painel h2')?.textContent === 'Pedidos' &&
                      doc.defaultView.carregados.join() === 'pedidos'
                    );
                  }
                ],
                [
                  'Clicar em Perfil troca o conteúdo',
                  async doc => {
                    doc.querySelector('[data-aba="perfil"]').click();
                    for (let i = 0; i < 20 && doc.querySelector('#painel h2')?.textContent !== 'Perfil'; i++) {
                      await doc.defaultView.__esperar(50);
                    }
                    return doc.querySelector('#painel h2')?.textContent === 'Perfil';
                  }
                ]
              ],
              solucao: `<nav>
  <button data-aba="perfil">Perfil</button>
  <button data-aba="pedidos">Pedidos</button>
</nav>
<div id="painel">Escolha uma aba.</div>
<script>window.carregados = [];</script>
<script type="module" src="./main.js"></script>

// --- perfil.js ---
window.carregados.push('perfil');
export default function desenhar(painel) {
  painel.innerHTML = '<h2>Perfil</h2><p>Ana Souza, cliente desde 2024.</p>';
}

// --- pedidos.js ---
window.carregados.push('pedidos');
export default function desenhar(painel) {
  painel.innerHTML = '<h2>Pedidos</h2><p>3 pedidos entregues.</p>';
}

// --- main.js ---
const painel = document.querySelector('#painel');
const abas = {
  perfil: () => import('./perfil.js'),
  pedidos: () => import('./pedidos.js')
};

document.querySelectorAll('[data-aba]').forEach(botao => {
  botao.addEventListener('click', async () => {
    const modulo = await abas[botao.dataset.aba]();
    modulo.default(painel);
  });
});`
            }
          ]
        },
        {
          titulo: 'Projetos maiores',
          itens: [
            {
              id: 'organizar-um-projeto',
              titulo: 'Organizar pastas e dependências',
              resumo: 'Pastas por funcionalidade, arquivo de entrada e dependências circulares.',
              minutos: 11,
              corpo: `
<h2>Pastas por funcionalidade</h2>
<p>Há dois jeitos comuns de organizar módulos. Por <strong>tipo</strong> (<code>componentes/</code>, <code>servicos/</code>, <code>utils/</code>) e por <strong>funcionalidade</strong> (<code>carrinho/</code>, <code>login/</code>, <code>produtos/</code>). Em projetos que crescem, o segundo costuma ganhar: tudo o que é do carrinho fica junto, e apagar ou mudar uma funcionalidade mexe numa pasta só.</p>
${trecho(`js/
  main.js                 ← ponto de entrada: liga as partes
  compartilhado/
    dinheiro.js           ← formatar moeda, usado por várias funcionalidades
    api.js
  carrinho/
    index.js              ← o que o resto do app pode usar do carrinho
    estado.js
    desenhar.js
  produtos/
    index.js
    busca.js`)}
<p>O <code>index.js</code> de cada pasta reexporta só o que é público (<code>export { adicionar, total } from './estado.js'</code>). Os outros arquivos da pasta são detalhes internos, que podem mudar sem quebrar quem usa.</p>

<h2>A direção das dependências</h2>
<p>Uma regra simples evita a maior parte dos problemas: as importações devem "descer". <code>main.js</code> importa as funcionalidades; as funcionalidades importam <code>compartilhado/</code>; e <code>compartilhado/</code> não importa nenhuma funcionalidade.</p>

<h2>Dependências circulares</h2>
<p>Quando <code>a.js</code> importa <code>b.js</code> e <code>b.js</code> importa <code>a.js</code>, há um ciclo. Módulos ES até permitem, mas um dos dois começa a rodar antes de o outro terminar, e usar no topo do arquivo algo que ainda não foi criado dá erro:</p>
${trecho(`// usuarios.js
import { totalDoUsuario } from './pedidos.js';
export const MOEDA = 'R$';

// pedidos.js
import { MOEDA } from './usuarios.js';
export const ROTULO = 'Total em ' + MOEDA;   // ReferenceError: Cannot access 'MOEDA' before initialization`)}
<p>A solução quase sempre é a mesma: o que os dois precisam vai para um <strong>terceiro módulo</strong>, que nenhum dos dois importa de volta (uma <code>config.js</code> ou algo em <code>compartilhado/</code>). O próximo desafio é exatamente esse.</p>
${dica('Ferramentas como o <code>madge</code> (<code>npx madge --circular js/</code>) listam os ciclos de um projeto. No editor desta trilha, um ciclo aparece como "Não foi possível carregar um módulo".')}

<h2>Exportar funções, não estado solto</h2>
<p>Um módulo que exporta uma variável que qualquer um pode alterar vira um ponto de bugs. Exporte funções que mexem no estado, e o estado fica privado:</p>
${codigo(`<ul id="lista"></ul>
<script type="module" src="./main.js"></script>

// --- carrinho.js ---
const itens = [];                         // privado: ninguém de fora mexe direto

export function adicionar(nome, preco) {
  if (preco <= 0) throw new Error('Preço inválido');
  itens.push({ nome, preco });
}
export const listar = () => itens.map(i => ({ ...i }));   // cópias, não o original
export const total = () => itens.reduce((s, i) => s + i.preco, 0);

// --- main.js ---
import { adicionar, listar, total } from './carrinho.js';

adicionar('Café', 62.9);
adicionar('Caneca', 34.5);
listar()[0].preco = 0;                    // mexe na cópia, não no carrinho
document.querySelector('#lista').innerHTML =
  listar().map(i => \`<li>\${i.nome}: \${i.preco}</li>\`).join('') + \`<li><strong>Total: \${total()}</strong></li>\`;`)}
`,
              quiz: [
                {
                  pergunta: 'Qual a vantagem de organizar pastas por funcionalidade?',
                  opcoes: [
                    'Menos arquivos',
                    'Tudo de uma funcionalidade fica junto, e mudá-la mexe numa pasta só',
                    'É obrigatório nos módulos'
                  ],
                  certa: 1,
                  explicacao: 'Em projetos grandes, isso facilita achar, mudar e apagar código.'
                },
                {
                  pergunta: 'Como resolver um ciclo em que a.js e b.js importam um do outro?',
                  opcoes: [
                    'Juntar tudo num arquivo só, sempre',
                    'Levar o que os dois usam para um terceiro módulo',
                    'Trocar import por require'
                  ],
                  certa: 1,
                  explicacao: 'O terceiro módulo não importa nenhum dos dois, e o ciclo desaparece.'
                },
                {
                  pergunta: 'Por que listar() devolve cópias dos itens?',
                  opcoes: [
                    'Para ser mais rápido',
                    'Para quem usa não alterar o estado interno sem querer',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'O estado só muda pelas funções do módulo, onde há validação.'
                }
              ]
            },
            {
              id: 'do-navegador-ao-vite',
              titulo: 'Do navegador ao Vite',
              resumo: 'Quando usar um bundler, pacotes do npm e variáveis de ambiente.',
              minutos: 10,
              corpo: `
<p>Tudo nesta trilha funciona no navegador sem ferramenta nenhuma, e isso basta para muitos sites (este portfólio é assim). Um <strong>bundler</strong> como o <strong>Vite</strong> passa a valer a pena quando:</p>
<ul>
  <li>você quer usar muitos pacotes do npm com <code>import x from 'nome-do-pacote'</code>;</li>
  <li>usa JSX, TypeScript ou outra coisa que o navegador não entende direto;</li>
  <li>o site tem dezenas de módulos e o número de arquivos baixados começa a pesar.</li>
</ul>

<h2>O que o Vite faz</h2>
${trecho(`npm create vite@latest meu-site -- --template vanilla
cd meu-site
npm install
npm run dev       # servidor que recarrega na hora a cada arquivo salvo
npm run build     # gera a pasta dist/ otimizada para publicar`)}
<ul>
  <li>Em desenvolvimento, ele serve os seus módulos quase como estão (rápido), resolvendo os nomes de pacotes.</li>
  <li>No build, ele <strong>junta</strong> os módulos em poucos arquivos, <strong>minifica</strong>, cria nomes com hash para o cache (<code>main-4f2a.js</code>) e separa os <code>import()</code> dinâmicos em arquivos próprios.</li>
  <li><strong>Tree shaking</strong>: o que um pacote exporta mas você não importa fica de fora. Por isso <code>import { debounce } from 'lodash-es'</code> é bem menor que importar a biblioteca inteira.</li>
</ul>

<h2>Variáveis de ambiente</h2>
<p>O Vite coloca em <code>import.meta.env</code> as variáveis dos arquivos <code>.env</code> que começam com <code>VITE_</code>:</p>
${trecho(`# .env.production
VITE_API_URL=https://api.meusite.com

// em qualquer módulo
const resposta = await fetch(\`\${import.meta.env.VITE_API_URL}/produtos\`);
if (import.meta.env.DEV) console.log('modo de desenvolvimento');`)}
${dica('Tudo o que vai para o front-end é público: qualquer pessoa vê no navegador. Nunca coloque uma chave secreta numa variável VITE_, mesmo que ela esteja num .env.')}

<h2>CommonJS ainda existe</h2>
<p>Você vai encontrar <code>require()</code> e <code>module.exports</code> em pacotes antigos e em código Node. Bundlers e o Node convertem entre os dois formatos, mas misturar no mesmo arquivo não funciona. Em código novo, use sempre <code>import</code>/<code>export</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'O que é tree shaking?',
                  opcoes: [
                    'Reordenar os arquivos',
                    'Deixar de fora do build o que foi exportado mas nunca importado',
                    'Atualizar pacotes'
                  ],
                  certa: 1,
                  explicacao: 'Por isso importar só o que usa deixa o site menor.'
                },
                {
                  pergunta: 'Uma chave secreta de API pode ir numa variável VITE_?',
                  opcoes: [
                    'Sim, se estiver no .env',
                    'Não: tudo o que vai para o front-end é público',
                    'Só em produção'
                  ],
                  certa: 1,
                  explicacao: 'O build coloca o valor dentro do JavaScript que o navegador baixa.'
                },
                {
                  pergunta: 'Qual comando gera os arquivos para publicar?',
                  opcoes: ['npm run dev', 'npm run build', 'npm install'],
                  certa: 1,
                  explicacao: 'O build gera a pasta dist/.'
                }
              ]
            },
            {
              id: 'desafio-dependencia-circular',
              tipo: 'desafio',
              titulo: 'Desafio: quebrar uma dependência circular',
              resumo: 'Dois módulos que se importam: reorganize para o ciclo sumir.',
              minutos: 18,
              enunciado: `
<p><code>usuarios.js</code> e <code>pedidos.js</code> importam um do outro, e a página não carrega. Reorganize:</p>
<ul>
  <li>Crie um terceiro módulo com a constante <code>MOEDA</code> (só um arquivo pode exportar <code>MOEDA</code>).</li>
  <li>Não pode haver nenhum ciclo de importação entre os arquivos.</li>
  <li>A página precisa mostrar <code>Total em R$ | Ana: R$ 75.50</code> em <code>#saida</code>.</li>
</ul>`,
              inicial: `<p id="saida"></p>
<script type="module" src="./main.js"></script>

// --- usuarios.js ---
import { totalDoUsuario } from './pedidos.js';

export const MOEDA = 'R$';

export function resumo(nome) {
  return nome + ': ' + MOEDA + ' ' + totalDoUsuario(nome).toFixed(2);
}

// --- pedidos.js ---
import { MOEDA } from './usuarios.js';

const pedidos = [
  { cliente: 'Ana', valor: 50 },
  { cliente: 'Ana', valor: 25.5 },
  { cliente: 'Rui', valor: 10 }
];

export const ROTULO = 'Total em ' + MOEDA;

export function totalDoUsuario(nome) {
  return pedidos.filter(p => p.cliente === nome).reduce((s, p) => s + p.valor, 0);
}

// --- main.js ---
import { resumo } from './usuarios.js';
import { ROTULO } from './pedidos.js';

document.querySelector('#saida').textContent = ROTULO + ' | ' + resumo('Ana');
`,
              testes: [
                [
                  'Só um arquivo exporta MOEDA',
                  doc => {
                    const arquivos = Object.values(doc.defaultView.__arquivos);
                    return arquivos.filter(codigo => /export\s+const\s+MOEDA\b/.test(codigo)).length === 1;
                  }
                ],
                [
                  'Não há nenhum ciclo de importação',
                  doc => {
                    const arquivos = doc.defaultView.__arquivos;
                    const deps = nome =>
                      [...(arquivos[nome] || '').matchAll(/from\s+['"]\.\/([\w.-]+\.js)['"]/g)].map(m => m[1]);
                    const visitando = new Set();
                    const feitos = new Set();
                    const temCiclo = nome => {
                      if (visitando.has(nome)) return true;
                      if (feitos.has(nome)) return false;
                      visitando.add(nome);
                      const ciclo = deps(nome).some(temCiclo);
                      visitando.delete(nome);
                      feitos.add(nome);
                      return ciclo;
                    };
                    return Object.keys(arquivos).length >= 4 && !Object.keys(arquivos).some(temCiclo);
                  }
                ],
                [
                  '#saida mostra "Total em R$ | Ana: R$ 75.50"',
                  async doc => {
                    await doc.defaultView.__esperar(100);
                    return doc.querySelector('#saida').textContent === 'Total em R$ | Ana: R$ 75.50';
                  }
                ]
              ],
              solucao: `<p id="saida"></p>
<script type="module" src="./main.js"></script>

// --- config.js ---
export const MOEDA = 'R$';

// --- usuarios.js ---
import { MOEDA } from './config.js';
import { totalDoUsuario } from './pedidos.js';

export function resumo(nome) {
  return nome + ': ' + MOEDA + ' ' + totalDoUsuario(nome).toFixed(2);
}

// --- pedidos.js ---
import { MOEDA } from './config.js';

const pedidos = [
  { cliente: 'Ana', valor: 50 },
  { cliente: 'Ana', valor: 25.5 },
  { cliente: 'Rui', valor: 10 }
];

export const ROTULO = 'Total em ' + MOEDA;

export function totalDoUsuario(nome) {
  return pedidos.filter(p => p.cliente === nome).reduce((s, p) => s + p.valor, 0);
}

// --- main.js ---
import { resumo } from './usuarios.js';
import { ROTULO } from './pedidos.js';

document.querySelector('#saida').textContent = ROTULO + ' | ' + resumo('Ana');`
            }
          ]
        }
      ]
    }
  ]
};
