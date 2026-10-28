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
<p>Num site com muitos módulos, o navegador só descobre que <code>main.js</code> importa <code>api.js</code> depois de baixar <code>main.js</code>. <code>&lt;link rel="modulepreload" href="api.js"&gt;</code> no <code>&lt;head&gt;</code> avisa antes, e os downloads acontecem em paralelo.</p>
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
        }
      ]
    }
  ]
};
