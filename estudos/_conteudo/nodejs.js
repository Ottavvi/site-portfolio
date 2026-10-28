// Trilha de Node.js. O que só existe no Node (fs, http, process...) aparece em trechos para rodar no seu computador.
// Os exemplos com "Experimente" e os desafios são JavaScript puro, que roda igual no navegador e no Node: ler
// argumentos, um roteador e uma cadeia de middlewares, como os do Express por dentro.
// Atenção: crases e ${ dos exemplos precisam de barra invertida. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'nodejs',
  area: 'Back-end e dados',
  titulo: 'Node.js',
  sigla: 'Nd',
  resumo: 'JavaScript no servidor: arquivos, APIs, pacotes do npm e scripts que automatizam tarefas.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Rodar JavaScript fora do navegador, npm e scripts de linha de comando.',
      modulos: [
        {
          titulo: 'Primeiros passos',
          itens: [
            {
              id: 'o-que-e-node',
              titulo: 'O que é o Node.js',
              resumo: 'Rodar arquivos, o objeto process, módulos e o package.json.',
              minutos: 10,
              corpo: `
<p>O <strong>Node.js</strong> pega o motor de JavaScript do Chrome e o coloca fora do navegador, com acesso a arquivos, rede e sistema operacional. Com ele, a mesma linguagem do front-end faz servidores, APIs, scripts de automação e ferramentas como o Vite e o Prettier.</p>

<h2>Rodar um arquivo</h2>
<p>Instale a versão LTS em nodejs.org e, no terminal:</p>
${trecho(`// ola.js
const nome = process.argv[2] ?? 'mundo';
console.log(\`Olá, \${nome}! Node \${process.version} em \${process.platform}\`);`)}
${trecho(`$ node ola.js Ana
Olá, Ana! Node v22.11.0 em win32`)}
<p>No Node não existe <code>window</code> nem <code>document</code>. No lugar, há objetos como <code>process</code> (argumentos, variáveis de ambiente, encerrar o programa) e os <strong>módulos do próprio Node</strong>: <code>node:fs</code> (arquivos), <code>node:path</code> (caminhos), <code>node:http</code> (servidores), <code>node:crypto</code>...</p>
<ul>
  <li><code>process.argv</code>: os argumentos. Os dois primeiros são o caminho do <code>node</code> e do script; os seus começam no índice 2.</li>
  <li><code>process.env</code>: variáveis de ambiente, como <code>process.env.PORT</code>.</li>
  <li><code>process.exit(1)</code>: encerra com código de erro (0 é sucesso). Scripts de CI usam isso para dizer que algo falhou.</li>
</ul>

<h2>package.json</h2>
<p>Todo projeto Node tem um <code>package.json</code>, criado com <code>npm init -y</code>. Ele guarda nome, dependências e <strong>scripts</strong>:</p>
${trecho(`{
  "name": "minha-api",
  "type": "module",
  "scripts": {
    "dev": "node --watch servidor.js",
    "start": "node servidor.js",
    "test": "node --test"
  }
}`)}
<p><code>"type": "module"</code> liga os Módulos ES (<code>import</code>/<code>export</code>), iguais aos do navegador. Sem ele, o Node usa o formato antigo, CommonJS (<code>require</code> e <code>module.exports</code>), que você ainda vai encontrar muito. <code>npm run dev</code> roda o script <code>dev</code>; <code>--watch</code> reinicia o programa a cada arquivo salvo.</p>

<h2>A mesma linguagem</h2>
<p>Tudo o que não depende do navegador funciona igual nos dois lados. Este código roda no Node e aqui:</p>
${codigo(`<script>
  const vendas = [120, 80, 230, 95];
  const total = vendas.reduce((a, b) => a + b, 0);
  console.log('Total:', total, '| média:', total / vendas.length);
  console.log(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total));
</script>`)}
${dica('Use sempre a versão LTS (Long Term Support) do Node em projetos: ela recebe correções por anos. As versões ímpares são experimentais.')}
`,
              quiz: [
                {
                  pergunta: 'O que existe no Node mas não no navegador?',
                  opcoes: ['document', 'process', 'window'],
                  certa: 1,
                  explicacao:
                    'process dá acesso a argumentos, ambiente e saída do programa. document e window são do navegador.'
                },
                {
                  pergunta: 'Em node script.js relatorio.csv, onde está "relatorio.csv"?',
                  opcoes: ['process.argv[0]', 'process.argv[1]', 'process.argv[2]'],
                  certa: 2,
                  explicacao: 'Os dois primeiros são o node e o script.'
                },
                {
                  pergunta: 'O que "type": "module" no package.json faz?',
                  opcoes: ['Instala módulos', 'Liga import/export (Módulos ES)', 'Cria um módulo novo'],
                  certa: 1,
                  explicacao: 'Sem ele, os arquivos .js usam require (CommonJS).'
                }
              ]
            },
            {
              id: 'npm-e-pacotes',
              titulo: 'npm e pacotes',
              resumo: 'Instalar, versões, dependências de desenvolvimento e segurança.',
              minutos: 10,
              corpo: `
<p>O <strong>npm</strong> é o gerenciador de pacotes do Node: dá acesso a milhões de bibliotecas prontas.</p>
${trecho(`npm install express          # dependência do app (vai em "dependencies")
npm install -D prettier      # só para desenvolver (vai em "devDependencies")
npm install                  # instala tudo o que está no package.json
npm uninstall express
npx prettier --write .       # roda uma ferramenta sem instalar globalmente`)}
<ul>
  <li><code>node_modules/</code> é a pasta com os pacotes. Ela é enorme e recriada pelo <code>npm install</code>: vai no <code>.gitignore</code>, nunca no Git.</li>
  <li><code>package-lock.json</code> trava a versão exata de cada pacote (e dos pacotes dos pacotes). <strong>Vai</strong> no Git: garante que todo mundo, e o servidor, instale exatamente o mesmo.</li>
  <li><code>npm ci</code> instala exatamente o que está no lock, sem atualizar nada. É o comando para CI e deploy.</li>
</ul>

<h2>Versões</h2>
<p>Pacotes seguem o <strong>versionamento semântico</strong> <code>MAIOR.MENOR.CORREÇÃO</code>: a correção não muda nada visível, a menor acrescenta recursos sem quebrar e a maior pode quebrar. No package.json:</p>
<ul>
  <li><code>"^4.21.2"</code>: aceita 4.x.x mais novas (o padrão do npm).</li>
  <li><code>"~4.21.2"</code>: aceita só correções, 4.21.x.</li>
  <li><code>"4.21.2"</code>: só exatamente essa.</li>
</ul>
${codigo(`<script>
  // Como o ^ decide se uma versão serve
  function aceitaCircunflexo(base, candidata) {
    const [b, c] = [base, candidata].map(v => v.split('.').map(Number));
    if (c[0] !== b[0]) return false;
    return c[1] > b[1] || (c[1] === b[1] && c[2] >= b[2]);
  }
  for (const v of ['4.21.2', '4.22.0', '4.21.1', '5.0.0']) {
    console.log('^4.21.2 aceita', v, '?', aceitaCircunflexo('4.21.2', v));
  }
</script>`)}

<h2>Antes de instalar</h2>
<p>Cada pacote é código de outra pessoa rodando na sua máquina e no seu servidor. Antes de adicionar um:</p>
<ul>
  <li>Veja se você realmente precisa: muita coisa já vem no Node ou no próprio JavaScript (<code>fetch</code>, <code>crypto.randomUUID()</code>, <code>Intl</code>, <code>node:test</code>).</li>
  <li>Confira downloads semanais, data da última versão e se o repositório está vivo.</li>
  <li>Rode <code>npm audit</code> de vez em quando: ele lista vulnerabilidades conhecidas nas dependências.</li>
  <li>Cuidado com nomes parecidos com pacotes famosos (<em>typosquatting</em>): <code>expresss</code> não é o <code>express</code>.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'O que vai para o Git?',
                  opcoes: ['node_modules', 'package-lock.json', 'Os dois'],
                  certa: 1,
                  explicacao: 'O lock garante versões iguais; node_modules é recriado pelo npm install.'
                },
                {
                  pergunta: 'Qual versão "^2.3.1" aceita?',
                  opcoes: ['3.0.0', '2.9.0', '2.3.0'],
                  certa: 1,
                  explicacao: 'O ^ aceita versões menores e correções novas, sem mudar o número maior.'
                },
                {
                  pergunta: 'Onde instalar o Prettier num projeto?',
                  opcoes: ['dependencies', 'devDependencies (npm install -D)', 'Em lugar nenhum'],
                  certa: 1,
                  explicacao: 'Ele só é usado para desenvolver, não pelo app rodando.'
                }
              ]
            },
            {
              id: 'desafio-argumentos',
              tipo: 'desafio',
              titulo: 'Desafio: ler argumentos de um script',
              resumo: 'Transforme process.argv num objeto de opções.',
              minutos: 18,
              enunciado: `
<p>Scripts de linha de comando recebem opções como <code>node relatorio.js vendas.csv --mes 10 --formato=pdf --verbose</code>. Escreva <code>lerArgumentos(lista)</code>, que recebe a lista de argumentos (já sem os dois primeiros do <code>process.argv</code>) e devolve um objeto:</p>
<ul>
  <li><code>--nome valor</code> e <code>--nome=valor</code> viram <code>{ nome: 'valor' }</code>.</li>
  <li>Uma opção sem valor (seguida de outra opção ou no fim) vira <code>true</code>: <code>--verbose</code> → <code>{ verbose: true }</code>.</li>
  <li>Valores que são números viram número: <code>--mes 10</code> → <code>{ mes: 10 }</code>.</li>
  <li>O que não é opção vai, em ordem, para a lista <code>_</code>: <code>{ _: ['vendas.csv'] }</code>. A lista sempre existe, mesmo vazia.</li>
</ul>`,
              inicial: `<script>
  function lerArgumentos(lista) {
    const resultado = { _: [] };
    // percorra a lista aqui
    return resultado;
  }

  // Num script de verdade: lerArgumentos(process.argv.slice(2))
  console.log(lerArgumentos(['vendas.csv', '--mes', '10', '--formato=pdf', '--verbose']));
</script>
`,
              testes: [
                [
                  'Argumentos soltos vão para _, em ordem',
                  doc => {
                    const r = doc.defaultView.eval('lerArgumentos')(['a.csv', 'b.csv']);
                    return JSON.stringify(r) === JSON.stringify({ _: ['a.csv', 'b.csv'] });
                  }
                ],
                [
                  '--nome valor e --nome=valor viram propriedades',
                  doc => {
                    const r = doc.defaultView.eval('lerArgumentos')(['--formato=pdf', '--saida', 'relatorio.pdf']);
                    return r.formato === 'pdf' && r.saida === 'relatorio.pdf' && r._.length === 0;
                  }
                ],
                [
                  'Opção sem valor vira true',
                  doc => {
                    const r = doc.defaultView.eval('lerArgumentos')(['--verbose', '--mes', '3', '--forcar']);
                    return r.verbose === true && r.forcar === true;
                  }
                ],
                [
                  'Números viram número',
                  doc => {
                    const r = doc.defaultView.eval('lerArgumentos')([
                      'dados.csv',
                      '--mes',
                      '10',
                      '--limite=2.5',
                      '--nome',
                      'Ana'
                    ]);
                    return r.mes === 10 && r.limite === 2.5 && r.nome === 'Ana' && r._[0] === 'dados.csv';
                  }
                ]
              ],
              solucao: `<script>
  function converter(valor) {
    return valor !== '' && !Number.isNaN(Number(valor)) ? Number(valor) : valor;
  }

  function lerArgumentos(lista) {
    const resultado = { _: [] };
    for (let i = 0; i < lista.length; i++) {
      const arg = lista[i];
      if (!arg.startsWith('--')) {
        resultado._.push(arg);
        continue;
      }
      const [nome, valorJunto] = arg.slice(2).split(/=(.*)/);
      if (valorJunto !== undefined) {
        resultado[nome] = converter(valorJunto);
      } else if (i + 1 < lista.length && !lista[i + 1].startsWith('--')) {
        resultado[nome] = converter(lista[++i]);
      } else {
        resultado[nome] = true;
      }
    }
    return resultado;
  }

  console.log(lerArgumentos(['vendas.csv', '--mes', '10', '--formato=pdf', '--verbose']));
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Arquivos, código assíncrono e o primeiro servidor HTTP.',
      modulos: [
        {
          titulo: 'Arquivos e servidores',
          itens: [
            {
              id: 'arquivos',
              titulo: 'Arquivos e caminhos',
              resumo: 'fs/promises, path, JSON em arquivo e erros comuns.',
              minutos: 12,
              corpo: `
<p>Ler e escrever arquivos é uma das tarefas mais comuns em Node: gerar relatórios, processar CSVs, salvar configurações. Use a versão com Promises do módulo <code>fs</code>, que combina com <code>await</code>:</p>
${trecho(`import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const pasta = path.join(import.meta.dirname, 'dados');      // a pasta deste arquivo + /dados
await mkdir(pasta, { recursive: true });                    // cria se não existir

await writeFile(path.join(pasta, 'notas.txt'), 'primeira linha\\n', 'utf8');
const texto = await readFile(path.join(pasta, 'notas.txt'), 'utf8');
console.log(texto);

console.log(await readdir(pasta));                          // nomes dos arquivos da pasta`)}
<ul>
  <li>Sempre informe <code>'utf8'</code>: sem ele, <code>readFile</code> devolve bytes (um <code>Buffer</code>), não texto.</li>
  <li>Monte caminhos com <code>path.join</code>, nunca juntando texto com <code>/</code>: ele usa a barra certa no Windows e no Linux.</li>
  <li><code>import.meta.dirname</code> é a pasta do arquivo atual. Caminhos relativos soltos (<code>'dados/x.txt'</code>) são relativos à pasta de onde você <strong>rodou</strong> o comando, o que pega muita gente de surpresa.</li>
</ul>

<h2>JSON em arquivo</h2>
${trecho(`async function lerJson(arquivo, padrao) {
  try {
    return JSON.parse(await readFile(arquivo, 'utf8'));
  } catch (erro) {
    if (erro.code === 'ENOENT') return padrao;   // o arquivo não existe (ainda)
    throw erro;                                   // outro problema: deixa estourar
  }
}

const config = await lerJson('config.json', { porta: 3000 });
await writeFile('config.json', JSON.stringify(config, null, 2));`)}
<p>Erros do sistema de arquivos têm um <code>code</code>: <code>ENOENT</code> (não existe), <code>EACCES</code> (sem permissão), <code>EISDIR</code> (é uma pasta). Trate os que você espera e deixe os outros aparecerem.</p>

<h2>Por que tudo é assíncrono</h2>
<p>O Node roda o seu JavaScript numa linha só. Enquanto espera o disco ou a rede, ele atende outras coisas: é assim que um único processo dá conta de milhares de conexões. Por isso as funções de entrada e saída devolvem Promises. As versões <code>Sync</code> (<code>readFileSync</code>) travam tudo enquanto esperam; servem para scripts pequenos, nunca dentro de um servidor.</p>
${codigo(`<script>
  // O mesmo princípio no navegador: três "leituras" de 300 ms em paralelo levam 300 ms, não 900
  const ler = (nome, ms) => new Promise(r => setTimeout(() => r(nome + ' lido'), ms));

  (async () => {
    let inicio = performance.now();
    await ler('a', 300); await ler('b', 300); await ler('c', 300);
    console.log('em sequência:', Math.round(performance.now() - inicio), 'ms');

    inicio = performance.now();
    const todos = await Promise.all([ler('a', 300), ler('b', 300), ler('c', 300)]);
    console.log(todos, 'em paralelo:', Math.round(performance.now() - inicio), 'ms');
  })();
</script>`)}
${dica('Para arquivos grandes (um CSV de 2 GB), não leia tudo de uma vez: use <code>createReadStream</code> com o módulo <code>readline</code> para processar linha por linha, com memória constante.')}
`,
              quiz: [
                {
                  pergunta: 'O que readFile(arquivo) devolve sem o "utf8"?',
                  opcoes: ['Texto', 'Um Buffer (bytes)', 'null'],
                  certa: 1,
                  explicacao: 'Informe a codificação para receber texto.'
                },
                {
                  pergunta: 'O que o código de erro ENOENT significa?',
                  opcoes: ['Sem permissão', 'O arquivo ou pasta não existe', 'Disco cheio'],
                  certa: 1,
                  explicacao: 'Error NO ENTry: não há entrada com esse caminho.'
                },
                {
                  pergunta: 'Por que evitar readFileSync dentro de um servidor?',
                  opcoes: [
                    'Ele é proibido',
                    'Ele trava o processo inteiro enquanto lê, e ninguém mais é atendido',
                    'Ele não lê UTF-8'
                  ],
                  certa: 1,
                  explicacao: 'O Node tem uma linha de execução só; bloqueá-la trava todo mundo.'
                }
              ]
            },
            {
              id: 'servidor-http',
              titulo: 'Um servidor HTTP',
              resumo: 'node:http, rotas, JSON e o Express.',
              minutos: 13,
              corpo: `
<h2>Com o módulo http</h2>
<p>Um servidor recebe pedidos (método, endereço, cabeçalhos, corpo) e devolve respostas (status, cabeçalhos, corpo):</p>
${trecho(`// servidor.js
import { createServer } from 'node:http';

const produtos = [{ id: 1, nome: 'Café', preco: 62.9 }];

const servidor = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'GET' && url.pathname === '/api/produtos') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(produtos));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ erro: 'Não encontrado' }));
});

servidor.listen(3000, () => console.log('http://localhost:3000'));`)}
<p>Rode com <code>node servidor.js</code> e abra <code>http://localhost:3000/api/produtos</code> no navegador. Para parar, <kbd>Ctrl</kbd>+<kbd>C</kbd> no terminal.</p>

<h2>Com o Express</h2>
<p>O módulo <code>http</code> é a base, mas montar rotas, ler o corpo e tratar erros na mão dá trabalho. O <strong>Express</strong> é o framework mais usado para isso:</p>
${trecho(`import express from 'express';

const app = express();
app.use(express.json());           // lê o corpo JSON dos pedidos

const produtos = [{ id: 1, nome: 'Café', preco: 62.9 }];

app.get('/api/produtos', (req, res) => {
  res.json(produtos);
});

app.get('/api/produtos/:id', (req, res) => {
  const produto = produtos.find(p => p.id === Number(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produto);
});

app.post('/api/produtos', (req, res) => {
  const { nome, preco } = req.body;
  if (!nome || typeof preco !== 'number') {
    return res.status(400).json({ erro: 'Informe nome e preco (número)' });
  }
  const novo = { id: produtos.length + 1, nome, preco };
  produtos.push(novo);
  res.status(201).json(novo);
});

app.listen(3000);`)}
<ul>
  <li><code>:id</code> na rota é um <strong>parâmetro</strong>: chega em <code>req.params.id</code> (sempre como texto).</li>
  <li><code>?busca=café</code> chega em <code>req.query.busca</code>.</li>
  <li>Os status contam o que aconteceu: <code>200</code> ok, <code>201</code> criado, <code>400</code> pedido inválido, <code>401</code> sem login, <code>404</code> não existe, <code>500</code> erro no servidor.</li>
</ul>
${dica('Para testar rotas POST sem escrever um front-end, use a extensão REST Client ou Thunder Client do VS Code, ou o comando <code>curl -X POST -H "Content-Type: application/json" -d "{\\"nome\\":\\"Chá\\",\\"preco\\":22}" http://localhost:3000/api/produtos</code>.')}

<h2>Como um roteador funciona por dentro</h2>
<p>Um roteador compara o método e o caminho do pedido com uma lista de rotas. O próximo desafio é escrever um, e este exemplo mostra a parte mais curiosa: transformar <code>/produtos/:id</code> numa expressão regular:</p>
${codigo(`<script>
  function compilar(caminho) {
    const nomes = [];
    const regex = caminho.replace(/:(\\w+)/g, (_, nome) => {
      nomes.push(nome);
      return '([^/]+)';
    });
    return { regex: new RegExp('^' + regex + '$'), nomes };
  }

  const rota = compilar('/lojas/:loja/produtos/:id');
  const achou = '/lojas/centro/produtos/42'.match(rota.regex);
  console.log(String(rota.regex), achou && Object.fromEntries(rota.nomes.map((n, i) => [n, achou[i + 1]])));
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'Qual status responder quando um produto foi criado?',
                  opcoes: ['200', '201', '204'],
                  certa: 1,
                  explicacao: '201 Created: o recurso novo foi criado.'
                },
                {
                  pergunta: 'Na rota /api/produtos/:id, onde chega o id?',
                  opcoes: ['req.query.id', 'req.params.id', 'req.body.id'],
                  certa: 1,
                  explicacao: 'Parâmetros do caminho ficam em req.params, sempre como texto.'
                },
                {
                  pergunta: 'Para que serve app.use(express.json())?',
                  opcoes: ['Responder em JSON', 'Ler o corpo JSON dos pedidos e colocar em req.body', 'Validar o JSON'],
                  certa: 1,
                  explicacao: 'Sem ele, req.body fica undefined nos POST com JSON.'
                }
              ]
            },
            {
              id: 'desafio-roteador',
              tipo: 'desafio',
              titulo: 'Desafio: um mini roteador',
              resumo: 'Escreva o roteador de uma API, com parâmetros e 404.',
              minutos: 25,
              enunciado: `
<p>Escreva <code>criarRoteador()</code>, que devolve um objeto com:</p>
<ul>
  <li><code>get(caminho, funcao)</code> e <code>post(caminho, funcao)</code>: registram rotas. O caminho pode ter parâmetros, como <code>/produtos/:id</code>.</li>
  <li><code>tratar(pedido)</code>: recebe <code>{ metodo, url, corpo }</code>, acha a primeira rota com o mesmo método e caminho, e devolve o que a função da rota devolver. A função recebe <code>{ params, query, corpo }</code>.</li>
  <li><code>query</code> vem do que estiver depois do <code>?</code> na url (use <code>URLSearchParams</code>), como objeto: <code>?q=café&amp;limite=2</code> → <code>{ q: 'café', limite: '2' }</code>.</li>
  <li>Sem rota: devolve <code>{ status: 404, corpo: { erro: 'Não encontrado' } }</code>.</li>
</ul>`,
              inicial: `<script>
  function criarRoteador() {
    const rotas = [];
    return {
      get(caminho, funcao) {},
      post(caminho, funcao) {},
      tratar(pedido) {}
    };
  }

  // Uma API de exemplo usando o roteador
  const produtos = [{ id: 1, nome: 'Café' }, { id: 2, nome: 'Chá' }];
  const app = criarRoteador();
  app.get('/produtos', ({ query }) => ({ status: 200, corpo: produtos.filter(p => p.nome.includes(query.q ?? '')) }));
  app.get('/produtos/:id', ({ params }) => {
    const p = produtos.find(p => p.id === Number(params.id));
    return p ? { status: 200, corpo: p } : { status: 404, corpo: { erro: 'Produto não encontrado' } };
  });

  console.log(app.tratar({ metodo: 'GET', url: '/produtos/2' }));
</script>
`,
              testes: [
                [
                  'Rota simples com GET',
                  doc => {
                    const app = doc.defaultView.eval('criarRoteador')();
                    app.get('/ping', () => ({ status: 200, corpo: 'pong' }));
                    const r = app.tratar({ metodo: 'GET', url: '/ping' });
                    return r && r.status === 200 && r.corpo === 'pong';
                  }
                ],
                [
                  'Parâmetros do caminho chegam em params',
                  doc => {
                    const app = doc.defaultView.eval('criarRoteador')();
                    app.get('/lojas/:loja/produtos/:id', ({ params }) => ({ status: 200, corpo: params }));
                    const r = app.tratar({ metodo: 'GET', url: '/lojas/centro/produtos/42' });
                    return (
                      r &&
                      r.corpo.loja === 'centro' &&
                      r.corpo.id === '42' &&
                      app.tratar({ metodo: 'GET', url: '/lojas/centro/produtos' }).status === 404
                    );
                  }
                ],
                [
                  'query vem do que está depois do ?',
                  doc => {
                    const app = doc.defaultView.eval('criarRoteador')();
                    app.get('/busca', ({ query }) => ({ status: 200, corpo: query }));
                    const r = app.tratar({ metodo: 'GET', url: '/busca?q=caf%C3%A9&limite=2' });
                    return r && r.corpo.q === 'café' && r.corpo.limite === '2';
                  }
                ],
                [
                  'O método importa, POST recebe o corpo, e o resto é 404',
                  doc => {
                    const app = doc.defaultView.eval('criarRoteador')();
                    app.post('/produtos', ({ corpo }) => ({ status: 201, corpo: { criado: corpo.nome } }));
                    const criado = app.tratar({ metodo: 'POST', url: '/produtos', corpo: { nome: 'Chá' } });
                    const get = app.tratar({ metodo: 'GET', url: '/produtos' });
                    return (
                      criado &&
                      criado.status === 201 &&
                      criado.corpo.criado === 'Chá' &&
                      get.status === 404 &&
                      get.corpo.erro === 'Não encontrado'
                    );
                  }
                ]
              ],
              solucao: `<script>
  function criarRoteador() {
    const rotas = [];

    function registrar(metodo, caminho, funcao) {
      const nomes = [];
      const padrao = caminho.replace(/:(\\w+)/g, (_, nome) => {
        nomes.push(nome);
        return '([^/]+)';
      });
      rotas.push({ metodo, regex: new RegExp('^' + padrao + '$'), nomes, funcao });
    }

    return {
      get: (caminho, funcao) => registrar('GET', caminho, funcao),
      post: (caminho, funcao) => registrar('POST', caminho, funcao),
      tratar({ metodo, url, corpo }) {
        const [caminho, busca = ''] = url.split('?');
        const query = Object.fromEntries(new URLSearchParams(busca));
        for (const rota of rotas) {
          const achou = rota.metodo === metodo && caminho.match(rota.regex);
          if (achou) {
            const params = Object.fromEntries(rota.nomes.map((nome, i) => [nome, decodeURIComponent(achou[i + 1])]));
            return rota.funcao({ params, query, corpo });
          }
        }
        return { status: 404, corpo: { erro: 'Não encontrado' } };
      }
    };
  }

  const produtos = [{ id: 1, nome: 'Café' }, { id: 2, nome: 'Chá' }];
  const app = criarRoteador();
  app.get('/produtos', ({ query }) => ({ status: 200, corpo: produtos.filter(p => p.nome.includes(query.q ?? '')) }));
  app.get('/produtos/:id', ({ params }) => {
    const p = produtos.find(p => p.id === Number(params.id));
    return p ? { status: 200, corpo: p } : { status: 404, corpo: { erro: 'Produto não encontrado' } };
  });

  console.log(app.tratar({ metodo: 'GET', url: '/produtos/2' }));
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Uma API de verdade: banco, segurança, middlewares, testes e deploy.',
      modulos: [
        {
          titulo: 'API para produção',
          itens: [
            {
              id: 'api-com-banco',
              titulo: 'Banco de dados, variáveis de ambiente e segurança',
              resumo: 'SQLite no Node, consultas parametrizadas, .env e senhas.',
              minutos: 14,
              corpo: `
<h2>Banco de dados</h2>
<p>Um array em memória some quando o servidor reinicia. Para guardar de verdade, use um banco. O SQLite é ótimo para começar (e para muitos projetos em produção): é um arquivo, sem servidor à parte. O Node 22 já traz um módulo para ele:</p>
${trecho(`import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('loja.db');
db.exec(\`CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY, nome TEXT NOT NULL, preco REAL NOT NULL
)\`);

const inserir = db.prepare('INSERT INTO produtos (nome, preco) VALUES (?, ?)');
const buscarPorNome = db.prepare('SELECT * FROM produtos WHERE nome LIKE ?');

inserir.run('Café em grãos', 62.9);
console.log(buscarPorNome.all('%café%'));`)}
<p>A trilha de <strong>SQLite</strong> deste site ensina a linguagem SQL com exemplos que rodam aqui mesmo.</p>

<h2>Nunca monte SQL juntando texto</h2>
${trecho(`// NUNCA: se busca for  x' OR '1'='1  a consulta devolve tudo; com  '; DROP TABLE...  apaga
db.prepare(\`SELECT * FROM usuarios WHERE email = '\${busca}'\`);

// SEMPRE: o ? é preenchido pelo banco, como valor, nunca como código
db.prepare('SELECT * FROM usuarios WHERE email = ?').get(busca);`)}
<p>Isso se chama <strong>injeção de SQL</strong> e é uma das falhas mais exploradas da web. Consultas parametrizadas (com <code>?</code>) resolvem por completo.</p>

<h2>Variáveis de ambiente</h2>
<p>Senhas de banco, chaves de API e a porta mudam entre o seu computador e o servidor, e <strong>não podem ir para o Git</strong>. Elas ficam em variáveis de ambiente; em desenvolvimento, num arquivo <code>.env</code> que está no <code>.gitignore</code>:</p>
${trecho(`# .env (no .gitignore!)
PORT=3000
DATABASE_PATH=./loja.db
JWT_SECRET=troque-isto-por-um-texto-longo-e-aleatorio`)}
${trecho(`// node --env-file=.env servidor.js   (o Node 20+ lê o arquivo sozinho)
const porta = Number(process.env.PORT ?? 3000);
if (!process.env.JWT_SECRET) {
  console.error('Falta JWT_SECRET no ambiente');
  process.exit(1);
}`)}
${dica('Deixe no repositório um <code>.env.example</code> com os nomes das variáveis e valores falsos. Quem clonar o projeto sabe o que precisa configurar.')}

<h2>Senhas de usuários</h2>
<p>Nunca guarde a senha em si. Guarde um <strong>hash lento com sal</strong>, feito para isso (scrypt, bcrypt ou argon2). O módulo <code>node:crypto</code> tem o scrypt:</p>
${trecho(`import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);

async function gerarHash(senha) {
  const sal = randomBytes(16).toString('hex');
  const hash = await scryptAsync(senha, sal, 64);
  return \`\${sal}:\${hash.toString('hex')}\`;
}

async function conferir(senha, guardado) {
  const [sal, hashHex] = guardado.split(':');
  const hash = await scryptAsync(senha, sal, 64);
  return timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));
}`)}
<p>Outras proteções básicas de uma API: validar todo dado que chega (bibliotecas como <strong>zod</strong> ajudam), limitar tentativas de login (<em>rate limit</em>), responder erros sem expor detalhes internos e liberar o CORS só para os domínios do seu front-end.</p>
`,
              quiz: [
                {
                  pergunta: 'Como evitar injeção de SQL?',
                  opcoes: ['Escapando aspas à mão', 'Usando consultas parametrizadas com ?', 'Usando só SELECT'],
                  certa: 1,
                  explicacao: 'O banco trata o valor como dado, nunca como parte do comando.'
                },
                {
                  pergunta: 'Onde ficam as chaves de API e senhas do banco?',
                  opcoes: ['No código', 'Em variáveis de ambiente (.env fora do Git)', 'No package.json'],
                  certa: 1,
                  explicacao: 'Assim elas mudam por ambiente e não vazam pelo repositório.'
                },
                {
                  pergunta: 'Como guardar a senha de um usuário?',
                  opcoes: [
                    'Em texto puro',
                    'Criptografada com uma chave',
                    'Como hash lento com sal (scrypt, bcrypt, argon2)'
                  ],
                  certa: 2,
                  explicacao: 'Um hash não pode ser revertido, e o sal impede comparar com tabelas prontas.'
                }
              ]
            },
            {
              id: 'middlewares-testes-e-deploy',
              titulo: 'Middlewares, testes e deploy',
              resumo: 'A cadeia de middlewares, node:test e como publicar uma API.',
              minutos: 13,
              corpo: `
<h2>Middlewares</h2>
<p>Um <strong>middleware</strong> é uma função que roda antes (e às vezes depois) das rotas: registra o pedido, confere o login, lê o corpo, trata erros. No Express, cada um recebe <code>(req, res, next)</code> e chama <code>next()</code> para passar adiante, ou responde e encerra a cadeia:</p>
${trecho(`app.use((req, res, next) => {
  const inicio = Date.now();
  res.on('finish', () => console.log(req.method, req.url, res.statusCode, Date.now() - inicio + 'ms'));
  next();
});

function exigirLogin(req, res, next) {
  if (!req.headers.authorization) return res.status(401).json({ erro: 'Faça login' });
  next();
}

app.get('/api/pedidos', exigirLogin, (req, res) => { /* ... */ });

// Tratador de erros: 4 parâmetros, registrado por último
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno' });
});`)}

<h2>Testes com node:test</h2>
<p>O Node já vem com um executor de testes. Arquivos <code>*.test.js</code> são encontrados sozinhos por <code>node --test</code>:</p>
${trecho(`// precos.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aplicarDesconto } from './precos.js';

test('10% de desconto', () => {
  assert.equal(aplicarDesconto(100, 0.1), 90);
});

test('desconto inválido lança erro', () => {
  assert.throws(() => aplicarDesconto(100, 2), /inválido/);
});`)}
<p>Com <code>"test": "node --test"</code> no package.json, <code>npm test</code> roda tudo, e um workflow do GitHub Actions pode rodar a cada push (veja a trilha de GitHub Actions).</p>

<h2>Publicar</h2>
<ul>
  <li><strong>Plataformas</strong> como Render, Railway e Fly.io leem o seu repositório, rodam <code>npm ci</code> e <code>npm start</code>, e dão um endereço com HTTPS. Configure as variáveis de ambiente no painel delas.</li>
  <li>Use a porta que a plataforma informa: <code>process.env.PORT</code>.</li>
  <li>Num servidor próprio (VPS), um gerenciador como o <strong>PM2</strong> ou o systemd reinicia o app se ele cair, e um proxy (Nginx, Caddy) cuida do HTTPS.</li>
  <li>Front-end estático (como este site) não precisa de Node no servidor: GitHub Pages, Netlify e Vercel bastam.</li>
</ul>
${codigo(`<script>
  // A ideia da cadeia de middlewares, em miniatura: cada um decide se chama o próximo
  const cadeia = [
    (ctx, proximo) => { ctx.log.push('registrar'); return proximo(); },
    (ctx, proximo) => (ctx.logado ? proximo() : 'parou: 401'),
    () => 'rota respondeu 200'
  ];
  function rodar(ctx, i = 0) {
    return cadeia[i](ctx, () => rodar(ctx, i + 1));
  }
  console.log(rodar({ log: [], logado: true }));
  console.log(rodar({ log: [], logado: false }));
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'O que um middleware faz para passar o pedido adiante?',
                  opcoes: ['return true', 'Chama next()', 'Chama res.send()'],
                  certa: 1,
                  explicacao: 'Sem next() (ou uma resposta), o pedido fica pendurado.'
                },
                {
                  pergunta: 'Como rodar os testes escritos com node:test?',
                  opcoes: ['node test', 'node --test (ou npm test)', 'npx jest'],
                  certa: 1,
                  explicacao: 'O próprio Node acha os arquivos *.test.js e roda.'
                },
                {
                  pergunta: 'Em que porta a API deve escutar numa plataforma como o Render?',
                  opcoes: ['Sempre 3000', 'A de process.env.PORT', '80'],
                  certa: 1,
                  explicacao: 'A plataforma decide a porta e informa pela variável de ambiente.'
                }
              ]
            },
            {
              id: 'desafio-middlewares',
              tipo: 'desafio',
              titulo: 'Desafio: cadeia de middlewares',
              resumo: 'Componha middlewares assíncronos com next, como no Express e no Koa.',
              minutos: 25,
              enunciado: `
<p>Escreva <code>compor(middlewares)</code>, que recebe uma lista de funções <code>async (ctx, next)</code> e devolve uma função <code>async (ctx)</code> que roda a cadeia:</p>
<ul>
  <li>Cada middleware roda na ordem e só chama o próximo se fizer <code>await next()</code>. Código depois do <code>await next()</code> roda na volta (como o Koa).</li>
  <li>Um middleware que não chama <code>next</code> encerra a cadeia.</li>
  <li>Chamar <code>next()</code> duas vezes no mesmo middleware lança um erro.</li>
</ul>
<p>Depois, escreva o middleware <code>exigirToken</code>: se <code>ctx.headers.authorization</code> não for <code>'Bearer segredo'</code>, coloca <code>ctx.status = 401</code> e <code>ctx.corpo = { erro: 'Não autorizado' }</code> e para a cadeia.</p>`,
              inicial: `<script>
  function compor(middlewares) {
    return async function (ctx) {
    };
  }

  async function exigirToken(ctx, next) {
  }

  // Exemplo de uso
  const app = compor([
    async (ctx, next) => {
      const inicio = performance.now();
      await next();
      console.log(ctx.status, Math.round(performance.now() - inicio) + 'ms');
    },
    exigirToken,
    async ctx => {
      ctx.status = 200;
      ctx.corpo = { pedidos: [] };
    }
  ]);

  app({ headers: { authorization: 'Bearer segredo' } });
</script>
`,
              testes: [
                [
                  'Os middlewares rodam na ordem, ida e volta',
                  async doc => {
                    const compor = doc.defaultView.eval('compor');
                    const ordem = [];
                    await compor([
                      async (c, next) => {
                        ordem.push('a1');
                        await next();
                        ordem.push('a2');
                      },
                      async (c, next) => {
                        ordem.push('b1');
                        await next();
                        ordem.push('b2');
                      },
                      async () => {
                        ordem.push('c');
                      }
                    ])({});
                    return ordem.join() === 'a1,b1,c,b2,a2';
                  }
                ],
                [
                  'Quem não chama next encerra a cadeia',
                  async doc => {
                    const compor = doc.defaultView.eval('compor');
                    let chegou = false;
                    const ctx = {};
                    await compor([
                      async c => {
                        c.status = 403;
                      },
                      async () => {
                        chegou = true;
                      }
                    ])(ctx);
                    return !chegou && ctx.status === 403;
                  }
                ],
                [
                  'Chamar next duas vezes lança erro',
                  async doc => {
                    const compor = doc.defaultView.eval('compor');
                    try {
                      await compor([
                        async (c, next) => {
                          await next();
                          await next();
                        },
                        async () => {}
                      ])({});
                      return false;
                    } catch {
                      return true;
                    }
                  }
                ],
                [
                  'exigirToken barra sem o token certo e deixa passar com ele',
                  async doc => {
                    const w = doc.defaultView;
                    const app = w.eval('compor')([
                      w.eval('exigirToken'),
                      async c => {
                        c.status = 200;
                        c.corpo = 'ok';
                      }
                    ]);
                    const sem = { headers: {} };
                    const errado = { headers: { authorization: 'Bearer outro' } };
                    const certo = { headers: { authorization: 'Bearer segredo' } };
                    await app(sem);
                    await app(errado);
                    await app(certo);
                    return (
                      sem.status === 401 &&
                      sem.corpo?.erro === 'Não autorizado' &&
                      errado.status === 401 &&
                      certo.status === 200
                    );
                  }
                ]
              ],
              solucao: `<script>
  function compor(middlewares) {
    return async function (ctx) {
      async function rodar(i) {
        const middleware = middlewares[i];
        if (!middleware) return;
        let chamou = false;
        await middleware(ctx, async () => {
          if (chamou) throw new Error('next() chamado mais de uma vez');
          chamou = true;
          await rodar(i + 1);
        });
      }
      await rodar(0);
    };
  }

  async function exigirToken(ctx, next) {
    if (ctx.headers?.authorization !== 'Bearer segredo') {
      ctx.status = 401;
      ctx.corpo = { erro: 'Não autorizado' };
      return;
    }
    await next();
  }

  const app = compor([
    async (ctx, next) => {
      const inicio = performance.now();
      await next();
      console.log(ctx.status, Math.round(performance.now() - inicio) + 'ms');
    },
    exigirToken,
    async ctx => {
      ctx.status = 200;
      ctx.corpo = { pedidos: [] };
    }
  ]);

  app({ headers: { authorization: 'Bearer segredo' } });
</script>`
            }
          ]
        },
        {
          titulo: 'Eventos, streams e login',
          itens: [
            {
              id: 'eventos-e-streams',
              titulo: 'Eventos e streams',
              resumo: 'EventEmitter, ler arquivos enormes aos pedaços e pipeline.',
              minutos: 12,
              corpo: `
<h2>EventEmitter</h2>
<p>Boa parte do Node é baseada em <strong>eventos</strong>: o servidor emite <code>request</code>, um arquivo emite <code>data</code> e <code>end</code>, um processo emite <code>exit</code>. A classe <code>EventEmitter</code> é a base disso, e você pode usá-la nos seus módulos:</p>
${trecho(`import { EventEmitter } from 'node:events';

class Pedidos extends EventEmitter {
  criar(pedido) {
    // ... salva no banco
    this.emit('criado', pedido);
  }
}

const pedidos = new Pedidos();
pedidos.on('criado', p => console.log('Enviar e-mail de confirmação para', p.email));
pedidos.on('criado', p => console.log('Atualizar estoque de', p.itens.length, 'itens'));
pedidos.once('criado', () => console.log('Primeiro pedido do dia!'));   // só na primeira vez
pedidos.criar({ email: 'ana@cafe.com', itens: [1, 2] });`)}
<p>Quem cria o pedido não precisa conhecer quem reage a ele: o e-mail e o estoque se inscrevem no evento. Esse desacoplamento é o padrão <strong>observador</strong>. O navegador tem a mesma ideia no <code>EventTarget</code>, que você já usa com <code>addEventListener</code>, e o próximo desafio é escrever um emissor do zero.</p>

<h2>Streams: aos pedaços</h2>
<p>Ler um CSV de 3 GB com <code>readFile</code> tenta pôr 3 GB na memória. Um <strong>stream</strong> entrega o arquivo em pedaços pequenos, e a memória usada fica constante:</p>
${trecho(`import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const linhas = createInterface({ input: createReadStream('vendas-2026.csv', 'utf8') });
let total = 0;
for await (const linha of linhas) {
  const valor = Number(linha.split(';')[3]?.replace(',', '.'));
  if (!Number.isNaN(valor)) total += valor;
}
console.log('Total:', total.toFixed(2));`)}

<h2>pipeline</h2>
<p>Streams se encaixam como canos: ler, transformar, comprimir, gravar. <code>pipeline</code> liga tudo, cuida do controle de fluxo (não lê mais rápido do que consegue gravar) e fecha tudo se der erro no meio:</p>
${trecho(`import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('relatorio.csv'),
  createGzip(),
  createWriteStream('relatorio.csv.gz')
);`)}
${dica('Num servidor, a resposta (<code>res</code>) também é um stream. Para enviar um arquivo grande, use <code>pipeline(createReadStream(arquivo), res)</code> em vez de ler tudo para depois responder.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a vantagem do padrão de eventos no exemplo dos pedidos?',
                  opcoes: [
                    'Fica mais rápido',
                    'Quem cria o pedido não precisa conhecer quem reage a ele',
                    'Usa menos memória'
                  ],
                  certa: 1,
                  explicacao: 'Novas reações (um log, uma métrica) se inscrevem sem mudar o código do pedido.'
                },
                {
                  pergunta: 'Por que usar stream para um arquivo de 3 GB?',
                  opcoes: [
                    'readFile não lê CSV',
                    'Para processar aos pedaços, com memória constante',
                    'É mais fácil de escrever'
                  ],
                  certa: 1,
                  explicacao: 'readFile tentaria carregar o arquivo inteiro na memória.'
                },
                {
                  pergunta: 'O que pipeline faz além de ligar os streams?',
                  opcoes: [
                    'Nada',
                    'Controla o fluxo entre eles e fecha tudo se der erro no meio',
                    'Converte para JSON'
                  ],
                  certa: 1,
                  explicacao: 'Sem ele, um erro no meio pode deixar arquivos abertos.'
                }
              ]
            },
            {
              id: 'autenticacao',
              titulo: 'Login: sessões, cookies e JWT',
              resumo: 'Como uma API sabe quem está fazendo o pedido, e os cuidados de cada jeito.',
              minutos: 13,
              corpo: `
<p>HTTP não tem memória: cada pedido chega sozinho. Depois do login, a API precisa de um jeito de reconhecer a pessoa nos pedidos seguintes. Há dois caminhos principais.</p>

<h2>Sessão com cookie</h2>
<ol>
  <li>A pessoa envia e-mail e senha. O servidor confere o hash da senha.</li>
  <li>O servidor cria uma sessão (um registro no banco ou em memória, com um id aleatório e longo) e devolve o id num cookie.</li>
  <li>O navegador manda o cookie sozinho em todo pedido seguinte; o servidor procura a sessão pelo id.</li>
</ol>
${trecho(`res.setHeader('Set-Cookie',
  \`sessao=\${idAleatorio}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=\${60 * 60 * 24 * 7}\`);`)}
<ul>
  <li><code>HttpOnly</code>: o JavaScript da página não consegue ler o cookie (protege contra roubo por XSS).</li>
  <li><code>Secure</code>: só vai por HTTPS.</li>
  <li><code>SameSite=Lax</code>: não é enviado em pedidos vindos de outros sites (protege contra CSRF na maioria dos casos).</li>
</ul>
<p>Sair é apagar a sessão no servidor: a partir dali, o id não vale mais nada.</p>

<h2>JWT</h2>
<p>Um <strong>JWT</strong> (JSON Web Token) é um texto em três partes separadas por ponto: cabeçalho, conteúdo (<em>payload</em>) e assinatura. O servidor assina o conteúdo com uma chave secreta; ao receber o token de volta, confere a assinatura e confia no conteúdo sem consultar o banco.</p>
${codigo(`<pre id="saida"></pre>
<script>
  // Um JWT de exemplo (assinatura falsa). Repare: o conteúdo NÃO é criptografado, só codificado
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJzdWIiOiI0MiIsIm5vbWUiOiJBbmEiLCJwYXBlbCI6ImFkbWluIiwiZXhwIjoxOTI0OTk1NjAwfQ.' +
    'assinatura-de-exemplo';

  const [cabecalho, conteudo] = token.split('.').map(parte => {
    try { return JSON.parse(atob(parte.replace(/-/g, '+').replace(/_/g, '/'))); } catch { return null; }
  });
  document.querySelector('#saida').textContent = JSON.stringify({ cabecalho, conteudo }, null, 2) +
    '\\nExpira em: ' + new Date(conteudo.exp * 1000).toLocaleString('pt-BR');
</script>`)}
<ul>
  <li>Qualquer um <strong>lê</strong> o conteúdo de um JWT. Nunca coloque nele dados sensíveis.</li>
  <li>Ninguém consegue <strong>alterar</strong> sem invalidar a assinatura. Por isso o servidor sempre verifica (com uma biblioteca como <code>jose</code>), e nunca apenas decodifica.</li>
  <li>Como não há registro no servidor, um JWT não pode ser "desligado" antes de expirar: use validade curta (minutos) e um token de renovação guardado com cuidado.</li>
</ul>
${dica('Para um site com front-end e API no mesmo domínio, sessão com cookie HttpOnly costuma ser o caminho mais simples e seguro. JWT brilha quando vários serviços diferentes precisam confiar no mesmo login. E serviços prontos, como Firebase Auth (usado na área de estudos deste site), resolvem o login todo para você.')}
`,
              quiz: [
                {
                  pergunta: 'O que o atributo HttpOnly de um cookie faz?',
                  opcoes: [
                    'Só funciona em HTTP',
                    'Impede o JavaScript da página de ler o cookie',
                    'Apaga o cookie ao fechar'
                  ],
                  certa: 1,
                  explicacao: 'Um script injetado (XSS) não consegue roubá-lo.'
                },
                {
                  pergunta: 'O conteúdo de um JWT é secreto?',
                  opcoes: [
                    'Sim, é criptografado',
                    'Não: qualquer um decodifica e lê; a assinatura só impede alterações',
                    'Depende do navegador'
                  ],
                  certa: 1,
                  explicacao: 'Por isso nada sensível vai no payload.'
                },
                {
                  pergunta: 'Por que JWTs costumam ter validade curta?',
                  opcoes: [
                    'Para economizar espaço',
                    'Porque não dá para cancelar um JWT antes de ele expirar',
                    'É exigência do HTTPS'
                  ],
                  certa: 1,
                  explicacao: 'Sem registro no servidor, só a expiração encerra um token roubado.'
                }
              ]
            },
            {
              id: 'desafio-emissor',
              tipo: 'desafio',
              titulo: 'Desafio: um emissor de eventos',
              resumo: 'Escreva on, off, once e emit, como o EventEmitter do Node.',
              minutos: 25,
              enunciado: `
<p>Escreva a classe <code>Emissor</code>:</p>
<ul>
  <li><code>on(evento, funcao)</code>: inscreve a função e devolve uma <strong>função que cancela</strong> a inscrição.</li>
  <li><code>off(evento, funcao)</code>: cancela a inscrição.</li>
  <li><code>once(evento, funcao)</code>: a função roda só na primeira emissão.</li>
  <li><code>emit(evento, ...dados)</code>: chama as funções inscritas, <strong>na ordem de inscrição</strong>, com os dados. Devolve quantas foram chamadas.</li>
  <li>Como no Node: emitir <code>'error'</code> sem ninguém inscrito <strong>lança</strong> o erro recebido.</li>
</ul>`,
              inicial: `<script>
  class Emissor {
    on(evento, funcao) {}
    off(evento, funcao) {}
    once(evento, funcao) {}
    emit(evento, ...dados) {}
  }

  const pedidos = new Emissor();
  pedidos.on('criado', p => console.log('E-mail para', p.email));
  pedidos.emit('criado', { email: 'ana@cafe.com' });
</script>
`,
              testes: [
                [
                  'on e emit chamam as funções em ordem, com os dados, e emit devolve a quantidade',
                  doc => {
                    const e = new (doc.defaultView.eval('Emissor'))();
                    const ordem = [];
                    e.on('x', (a, b) => ordem.push('1:' + a + b));
                    e.on('x', a => ordem.push('2:' + a));
                    const n = e.emit('x', 'a', 'b');
                    return n === 2 && ordem.join() === '1:ab,2:a' && e.emit('nada') === 0;
                  }
                ],
                [
                  'off e a função devolvida por on cancelam a inscrição',
                  doc => {
                    const e = new (doc.defaultView.eval('Emissor'))();
                    let a = 0;
                    let b = 0;
                    const fa = () => a++;
                    e.on('x', fa);
                    const cancelar = e.on('x', () => b++);
                    e.emit('x');
                    e.off('x', fa);
                    cancelar();
                    e.emit('x');
                    return a === 1 && b === 1;
                  }
                ],
                [
                  'once roda só uma vez',
                  doc => {
                    const e = new (doc.defaultView.eval('Emissor'))();
                    let n = 0;
                    e.once('x', () => n++);
                    e.emit('x');
                    e.emit('x');
                    return n === 1;
                  }
                ],
                [
                  "emit('error') sem ouvinte lança o erro; com ouvinte, não",
                  doc => {
                    const e = new (doc.defaultView.eval('Emissor'))();
                    const erro = new Error('falhou');
                    let lancou = null;
                    try {
                      e.emit('error', erro);
                    } catch (x) {
                      lancou = x;
                    }
                    let recebido = null;
                    e.on('error', x => (recebido = x));
                    e.emit('error', erro);
                    return lancou === erro && recebido === erro;
                  }
                ]
              ],
              solucao: `<script>
  class Emissor {
    #ouvintes = new Map(); // evento → lista de funções

    on(evento, funcao) {
      if (!this.#ouvintes.has(evento)) this.#ouvintes.set(evento, []);
      this.#ouvintes.get(evento).push(funcao);
      return () => this.off(evento, funcao);
    }

    off(evento, funcao) {
      const lista = this.#ouvintes.get(evento) ?? [];
      const i = lista.indexOf(funcao);
      if (i !== -1) lista.splice(i, 1);
    }

    once(evento, funcao) {
      const umaVez = (...dados) => {
        this.off(evento, umaVez);
        funcao(...dados);
      };
      return this.on(evento, umaVez);
    }

    emit(evento, ...dados) {
      const lista = [...(this.#ouvintes.get(evento) ?? [])]; // cópia: once remove durante o laço
      if (evento === 'error' && lista.length === 0) throw dados[0];
      for (const funcao of lista) funcao(...dados);
      return lista.length;
    }
  }

  const pedidos = new Emissor();
  pedidos.on('criado', p => console.log('E-mail para', p.email));
  pedidos.emit('criado', { email: 'ana@cafe.com' });
</script>`
            }
          ]
        }
      ]
    }
  ]
};
