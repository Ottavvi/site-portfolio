// Trilha de APIs e HTTP. O editor é o de HTML (com console). Os exemplos com "Experimente" chamam APIs públicas de
// verdade (JSONPlaceholder, que aceita CORS); os desafios não dependem da internet: os testes trocam o fetch da página
// por um servidor de mentira (w.fetch = ...) e conferem o que a função da pessoa pediu e o que ela fez com a resposta.
// Atenção: crases e ${ dos exemplos precisam de barra invertida. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'apis-http',
  area: 'Back-end e dados',
  titulo: 'APIs e HTTP',
  sigla: 'API',
  resumo: 'Como front e back conversam: HTTP, JSON, fetch, REST, autenticação, CORS e chamadas que não quebram.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Pedidos e respostas: métodos, status, cabeçalhos, URLs e JSON.',
      modulos: [
        {
          titulo: 'Como a web conversa',
          itens: [
            {
              id: 'o-que-e-http',
              titulo: 'HTTP: pedido e resposta',
              resumo: 'Métodos, códigos de status e cabeçalhos.',
              minutos: 11,
              corpo: `
<p>Toda vez que o navegador abre uma página, carrega uma imagem ou envia um formulário, ele manda um <strong>pedido HTTP</strong> para um servidor e recebe uma <strong>resposta</strong>. Uma <strong>API</strong> é um servidor que, em vez de páginas, responde dados (quase sempre em JSON) para outros programas usarem: o app do banco, o painel de vendas, o seu front-end.</p>

<h2>O pedido</h2>
${trecho(`GET /posts/1 HTTP/1.1
Host: jsonplaceholder.typicode.com
Accept: application/json`)}
<p>Um pedido tem um <strong>método</strong> (o que fazer), um <strong>caminho</strong> (em quê), <strong>cabeçalhos</strong> (informações extras) e, às vezes, um <strong>corpo</strong> (os dados enviados).</p>
<ul>
  <li><code>GET</code>: buscar. Não muda nada no servidor.</li>
  <li><code>POST</code>: criar algo novo (um pedido, um cadastro).</li>
  <li><code>PUT</code> e <code>PATCH</code>: substituir inteiro ou alterar uma parte.</li>
  <li><code>DELETE</code>: apagar.</li>
</ul>

<h2>A resposta</h2>
${trecho(`HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{ "userId": 1, "id": 1, "title": "sunt aut facere..." }`)}
<p>O <strong>código de status</strong> diz como foi, pela casa da centena:</p>
<ul>
  <li><strong>2xx, deu certo</strong>: 200 OK, 201 Created (criado), 204 No Content (certo, sem corpo).</li>
  <li><strong>3xx, vá para outro lugar</strong>: 301 e 302 redirecionam, 304 diz "use o que você já tem em cache".</li>
  <li><strong>4xx, o erro é de quem pediu</strong>: 400 pedido malformado, 401 não autenticado, 403 sem permissão, 404 não existe, 422 dados inválidos, 429 pedidos demais.</li>
  <li><strong>5xx, o erro é do servidor</strong>: 500 erro interno, 502 e 503 servidor fora ou sobrecarregado.</li>
</ul>

<h2>Experimente</h2>
<p>O <code>fetch</code> faz o pedido pelo JavaScript. Abra o resultado e veja no console o status, um cabeçalho e os dados:</p>
${codigo(`<script>
  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(resposta => {
      console.log('Status:', resposta.status, resposta.ok);
      console.log('Tipo:', resposta.headers.get('content-type'));
      return resposta.json();
    })
    .then(post => console.log('Título:', post.title));
</script>`)}
${dica('Na aba <strong>Rede</strong> (Network) das ferramentas do navegador (F12), cada pedido aparece com método, status, cabeçalhos e corpo. É a primeira coisa a olhar quando uma integração não funciona.')}
`,
              quiz: [
                {
                  pergunta: 'Qual método se usa para criar um cadastro novo?',
                  opcoes: ['GET', 'POST', 'DELETE'],
                  certa: 1,
                  explicacao: 'GET só busca; POST envia dados para criar algo.'
                },
                {
                  pergunta: 'A API respondeu 404. De quem é o problema?',
                  opcoes: ['Do servidor, que caiu', 'De quem pediu: o recurso não existe', 'Da internet'],
                  certa: 1,
                  explicacao: '4xx são erros do lado de quem pediu; 5xx, do servidor.'
                },
                {
                  pergunta: 'O que o status 401 indica?',
                  opcoes: ['Não autenticado: falta login ou token', 'Deu certo', 'Servidor fora do ar'],
                  certa: 0,
                  explicacao: '401 é "quem é você?"; 403 é "sei quem você é, mas não pode".'
                }
              ]
            },
            {
              id: 'urls-e-json',
              titulo: 'URLs, parâmetros e JSON',
              resumo: 'Montar URLs sem erro com URL e URLSearchParams, e converter JSON.',
              minutos: 10,
              corpo: `
<h2>As partes de uma URL</h2>
${trecho(`https://api.loja.com:443/v1/produtos?categoria=cafe&pagina=2#topo
\\___/   \\__________/ \\_/ \\__________/ \\____________________/ \\__/
protocolo   host     porta  caminho        parâmetros (query)   fragmento`)}
<p>Os <strong>parâmetros</strong> vêm depois do <code>?</code>, no formato <code>nome=valor</code>, separados por <code>&amp;</code>. Servem para filtrar, ordenar e paginar.</p>

<h2>Não monte URL somando textos</h2>
<p>Espaços, acentos e símbolos como <code>&amp;</code> precisam ser <strong>codificados</strong> (o espaço vira <code>%20</code> ou <code>+</code>). Somar textos à mão quebra na primeira busca por "pão &amp; café". O objeto <code>URL</code> cuida disso:</p>
${codigo(`<script>
  const url = new URL('https://api.loja.com/v1/produtos');
  url.searchParams.set('busca', 'pão & café');
  url.searchParams.set('pagina', 2);
  console.log(url.toString());

  // E o caminho de volta: ler os parâmetros de uma URL
  const lida = new URL('https://site.com/busca?q=caneca&ordem=preco');
  console.log(lida.searchParams.get('q'), lida.searchParams.get('ordem'));
  console.log(lida.searchParams.get('naoTem')); // null
</script>`)}
<p>Para um formulário ou um objeto inteiro, <code>new URLSearchParams({ busca: 'x', pagina: 1 })</code> gera o texto <code>busca=x&amp;pagina=1</code>.</p>

<h2>JSON</h2>
<p>JSON é o formato de texto que as APIs usam. Parece um objeto do JavaScript, com regras mais rígidas: chaves sempre entre aspas duplas, sem vírgula sobrando, sem funções, sem <code>undefined</code> e sem datas (que viajam como texto).</p>
${codigo(`<script>
  const pedido = { cliente: 'Ana', itens: [{ id: 3, qtd: 2 }], data: new Date('2026-10-28') };
  const texto = JSON.stringify(pedido);
  console.log(texto);                     // a data virou texto ISO

  const devolta = JSON.parse(texto);
  console.log(devolta.itens[0].qtd);      // 2
  console.log(typeof devolta.data);       // string: precisa de new Date() para virar data

  try {
    JSON.parse("{ cliente: 'Ana' }");     // inválido: chave sem aspas e aspas simples
  } catch (erro) {
    console.log('JSON inválido:', erro.message);
  }
</script>`)}
${dica('<code>JSON.stringify(objeto, null, 2)</code> gera o texto indentado com 2 espaços, muito mais fácil de ler no console.')}
`,
              quiz: [
                {
                  pergunta: "O que acontece com 'pão & café' numa URL montada somando textos?",
                  opcoes: [
                    'Nada, funciona',
                    'O & é lido como separador de parâmetros e a busca quebra',
                    'O navegador recusa'
                  ],
                  certa: 1,
                  explicacao: 'searchParams.set codifica o & (vira %26) e o problema some.'
                },
                {
                  pergunta: 'Qual destes é JSON válido?',
                  opcoes: ["{ nome: 'Ana' }", '{ "nome": "Ana" }', '{ "nome": "Ana", }'],
                  certa: 1,
                  explicacao: 'Chaves e textos entre aspas duplas, sem vírgula sobrando.'
                },
                {
                  pergunta: 'Depois de JSON.parse, uma data que veio da API é:',
                  opcoes: ['Um Date', 'Um texto', 'Um número'],
                  certa: 1,
                  explicacao: 'JSON não tem tipo de data; ela viaja e volta como texto.'
                }
              ]
            },
            {
              id: 'desafio-urls-e-status',
              tipo: 'desafio',
              titulo: 'Desafio: URLs e status',
              resumo: 'Monte URLs de busca e explique os códigos de status.',
              minutos: 15,
              enunciado: `
<p>Escreva duas funções:</p>
<ul>
  <li><code>urlDeBusca(base, filtros)</code>: recebe a URL base e um objeto de filtros e devolve a URL completa em texto, com cada filtro como parâmetro. <strong>Ignore</strong> filtros vazios (<code>''</code>, <code>null</code> ou <code>undefined</code>). Os valores precisam ser codificados (use <code>URL</code>).</li>
  <li><code>tipoDeStatus(codigo)</code>: devolve <code>'sucesso'</code> para 200 a 299, <code>'redirecionamento'</code> para 300 a 399, <code>'erro do cliente'</code> para 400 a 499, <code>'erro do servidor'</code> para 500 a 599 e <code>'desconhecido'</code> para o resto.</li>
</ul>`,
              inicial: `<script>
  function urlDeBusca(base, filtros) {
  }

  function tipoDeStatus(codigo) {
  }

  console.log(urlDeBusca('https://api.loja.com/produtos', { busca: 'café', pagina: 2, cor: '' }));
  console.log(tipoDeStatus(404));
</script>
`,
              testes: [
                [
                  'urlDeBusca põe os filtros como parâmetros',
                  doc => {
                    const f = doc.defaultView.eval('typeof urlDeBusca === "function" ? urlDeBusca : null');
                    const u = new URL(f('https://api.loja.com/produtos', { busca: 'caneca', pagina: 2 }));
                    return (
                      u.origin + u.pathname === 'https://api.loja.com/produtos' &&
                      u.searchParams.get('busca') === 'caneca' &&
                      u.searchParams.get('pagina') === '2'
                    );
                  }
                ],
                [
                  'urlDeBusca codifica espaços, acentos e &',
                  doc => {
                    const f = doc.defaultView.eval('typeof urlDeBusca === "function" ? urlDeBusca : null');
                    const texto = f('https://api.loja.com/produtos', { busca: 'pão & café' });
                    return !texto.includes(' ') && new URL(texto).searchParams.get('busca') === 'pão & café';
                  }
                ],
                [
                  'urlDeBusca ignora filtros vazios',
                  doc => {
                    const f = doc.defaultView.eval('typeof urlDeBusca === "function" ? urlDeBusca : null');
                    const u = new URL(f('https://api.loja.com/produtos', { a: '', b: null, c: undefined, d: 0 }));
                    return [...u.searchParams.keys()].join() === 'd' && u.searchParams.get('d') === '0';
                  }
                ],
                [
                  'tipoDeStatus classifica pela centena',
                  doc => {
                    const f = doc.defaultView.eval('typeof tipoDeStatus === "function" ? tipoDeStatus : null');
                    return (
                      f(200) === 'sucesso' &&
                      f(204) === 'sucesso' &&
                      f(301) === 'redirecionamento' &&
                      f(404) === 'erro do cliente' &&
                      f(429) === 'erro do cliente' &&
                      f(503) === 'erro do servidor' &&
                      f(99) === 'desconhecido' &&
                      f(600) === 'desconhecido'
                    );
                  }
                ]
              ],
              solucao: `<script>
  function urlDeBusca(base, filtros) {
    const url = new URL(base);
    for (const [nome, valor] of Object.entries(filtros)) {
      if (valor === '' || valor === null || valor === undefined) continue;
      url.searchParams.set(nome, valor);
    }
    return url.toString();
  }

  function tipoDeStatus(codigo) {
    if (codigo >= 200 && codigo <= 299) return 'sucesso';
    if (codigo >= 300 && codigo <= 399) return 'redirecionamento';
    if (codigo >= 400 && codigo <= 499) return 'erro do cliente';
    if (codigo >= 500 && codigo <= 599) return 'erro do servidor';
    return 'desconhecido';
  }

  console.log(urlDeBusca('https://api.loja.com/produtos', { busca: 'café', pagina: 2, cor: '' }));
  console.log(tipoDeStatus(404));
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'fetch de verdade: erros, envio de dados e o desenho de uma API REST.',
      modulos: [
        {
          titulo: 'fetch e REST',
          itens: [
            {
              id: 'fetch-na-pratica',
              titulo: 'fetch na prática: erros e envio de dados',
              resumo: 'response.ok, try/catch, POST com JSON e tempo limite.',
              minutos: 13,
              corpo: `
<h2>A pegadinha do fetch</h2>
<p>O <code>fetch</code> só rejeita a Promise quando a rede falha (sem internet, servidor inalcançável). Um 404 ou um 500 <strong>não</strong> são erro para ele: a Promise resolve normalmente. Quem confere é você, com <code>resposta.ok</code> (verdadeiro para 200 a 299):</p>
${codigo(`<script>
  async function buscarJson(url) {
    const resposta = await fetch(url);
    if (!resposta.ok) {
      throw new Error(\`A API respondeu \${resposta.status}\`);
    }
    return resposta.json();
  }

  buscarJson('https://jsonplaceholder.typicode.com/users/1')
    .then(usuario => console.log('Achei:', usuario.name))
    .catch(erro => console.log('Falhou:', erro.message));

  buscarJson('https://jsonplaceholder.typicode.com/users/9999')
    .then(usuario => console.log('Achei:', usuario.name))
    .catch(erro => console.log('Falhou:', erro.message));
</script>`)}

<h2>Enviar dados</h2>
<p>Para criar algo, mande o método, o cabeçalho dizendo que o corpo é JSON e o corpo já convertido em texto:</p>
${codigo(`<script>
  async function criarPost(titulo) {
    const resposta = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titulo, body: 'Texto', userId: 1 })
    });
    if (!resposta.ok) throw new Error(\`Erro \${resposta.status}\`);
    return resposta.json();
  }

  criarPost('Meu primeiro POST').then(criado => console.log('Criado com id', criado.id));
</script>`)}
${dica('Esquecer o <code>JSON.stringify</code> envia o texto "[object Object]". Esquecer o <code>Content-Type</code> faz muitos servidores não entenderem o corpo. São os dois erros mais comuns em POST.')}

<h2>Mostrar o que está acontecendo</h2>
<p>Pedidos demoram. Uma boa interface mostra três estados: <strong>carregando</strong>, <strong>erro</strong> (com uma mensagem útil e, se possível, um botão para tentar de novo) e <strong>pronto</strong>. E desabilita o botão de enviar enquanto espera, para a pessoa não mandar o mesmo pedido duas vezes.</p>

<h2>Tempo limite</h2>
<p>Por padrão, um pedido pode ficar esperando minutos. <code>AbortSignal.timeout</code> desiste depois de um tempo:</p>
${trecho(`try {
  const resposta = await fetch(url, { signal: AbortSignal.timeout(5000) });
} catch (erro) {
  if (erro.name === 'TimeoutError') console.log('A API demorou demais.');
}`)}
`,
              quiz: [
                {
                  pergunta: 'A API respondeu 500. O que o fetch faz?',
                  opcoes: [
                    'Rejeita a Promise',
                    'Resolve normalmente; é preciso conferir resposta.ok',
                    'Tenta de novo sozinho'
                  ],
                  certa: 1,
                  explicacao: 'O fetch só rejeita em falha de rede.'
                },
                {
                  pergunta: 'O que falta neste POST: fetch(url, { method: "POST", body: dados })?',
                  opcoes: [
                    'Nada',
                    'JSON.stringify(dados) e o cabeçalho Content-Type: application/json',
                    'O método GET'
                  ],
                  certa: 1,
                  explicacao: 'O corpo precisa ser texto, e o servidor precisa saber que é JSON.'
                },
                {
                  pergunta: 'Por que desabilitar o botão enquanto o pedido está em andamento?',
                  opcoes: [
                    'Para a página ficar mais bonita',
                    'Para evitar que o mesmo pedido seja enviado duas vezes',
                    'É exigência do fetch'
                  ],
                  certa: 1,
                  explicacao: 'Dois cliques rápidos viram dois pedidos, duas compras, dois cadastros.'
                }
              ]
            },
            {
              id: 'rest',
              titulo: 'REST: recursos, verbos e paginação',
              resumo: 'Como uma API bem desenhada organiza as rotas e as respostas.',
              minutos: 11,
              corpo: `
<p><strong>REST</strong> é o estilo mais comum de desenhar APIs. A ideia central: a URL diz <strong>o recurso</strong> (um substantivo) e o método diz <strong>a ação</strong>.</p>
${trecho(`GET    /produtos           lista os produtos
GET    /produtos/42        um produto
POST   /produtos           cria um produto (devolve 201 e o produto criado)
PATCH  /produtos/42        altera parte do produto 42
DELETE /produtos/42        apaga (devolve 204, sem corpo)
GET    /clientes/7/pedidos os pedidos do cliente 7`)}
<p>Repare: nada de <code>/criarProduto</code> ou <code>/apagarProduto?id=42</code>. Os verbos ficam nos métodos.</p>

<h2>Idempotência</h2>
<p>Um método é <strong>idempotente</strong> quando repetir o pedido dá o mesmo efeito de fazer uma vez. <code>GET</code>, <code>PUT</code> e <code>DELETE</code> são: apagar o produto 42 duas vezes deixa o mesmo resultado. <code>POST</code> não é: dois POST criam dois pedidos. Por isso, repetir sozinho um pedido que falhou só é seguro nos idempotentes.</p>

<h2>Listas grandes: paginação</h2>
<p>Ninguém devolve 100 mil produtos de uma vez. A API divide em páginas:</p>
${trecho(`GET /produtos?pagina=2&limite=20

{
  "dados": [ ... 20 produtos ... ],
  "pagina": 2,
  "totalDePaginas": 15
}`)}
<p>Outro formato comum é o <strong>cursor</strong>: a resposta traz um <code>proximo</code> com o endereço da página seguinte, e ele vem <code>null</code> na última. Funciona melhor quando os dados mudam enquanto se lê.</p>

<h2>Erros que ajudam</h2>
<p>Uma boa API devolve o status certo <strong>e</strong> um corpo que explica:</p>
${trecho(`HTTP/1.1 422 Unprocessable Entity

{ "erro": "dados inválidos", "campos": { "email": "formato inválido" } }`)}
${dica('Versione a API desde o começo (<code>/v1/produtos</code>). Quando precisar mudar algo que quebra quem já usa, crie a <code>/v2</code> e mantenha a antiga por um tempo.')}
`,
              quiz: [
                {
                  pergunta: 'Qual rota segue o estilo REST para apagar o produto 42?',
                  opcoes: ['POST /apagarProduto?id=42', 'DELETE /produtos/42', 'GET /produtos/42/apagar'],
                  certa: 1,
                  explicacao: 'O recurso na URL, a ação no método.'
                },
                {
                  pergunta: 'Por que repetir automaticamente um POST que falhou é arriscado?',
                  opcoes: [
                    'POST não é idempotente: pode criar o mesmo registro duas vezes',
                    'POST não aceita repetição',
                    'Não é arriscado'
                  ],
                  certa: 0,
                  explicacao: 'Talvez o primeiro tenha chegado e só a resposta se perdeu.'
                },
                {
                  pergunta: 'Na paginação por cursor, como saber que acabou?',
                  opcoes: ['Quando dá 404', 'Quando o campo proximo vem null', 'Depois de 10 páginas'],
                  certa: 1,
                  explicacao: 'Sem endereço para a próxima página, não há mais dados.'
                }
              ]
            },
            {
              id: 'desafio-cliente-da-api',
              tipo: 'desafio',
              titulo: 'Desafio: o cliente da API de tarefas',
              resumo: 'GET com verificação de erro e POST com JSON.',
              minutos: 20,
              enunciado: `
<p>Escreva as funções que o app usa para falar com a API de tarefas em <code>https://api.exemplo.com/tarefas</code>. Os testes trocam o <code>fetch</code> por um servidor de mentira, então nada vai para a internet.</p>
<ul>
  <li><code>listarTarefas()</code>: faz um GET em <code>https://api.exemplo.com/tarefas</code> e devolve o array que veio em JSON. Se a resposta não for ok, lança um <code>Error</code> cuja mensagem contém o status (por exemplo, "Erro 500").</li>
  <li><code>criarTarefa(titulo)</code>: faz um POST no mesmo endereço, com o cabeçalho <code>Content-Type: application/json</code> e o corpo <code>{"titulo": ..., "feita": false}</code>. Devolve a tarefa criada (o JSON da resposta). Se a resposta não for ok, lança um <code>Error</code> com o status.</li>
</ul>
<p>As duas são <code>async</code>.</p>`,
              inicial: `<script>
  const API = 'https://api.exemplo.com/tarefas';

  async function listarTarefas() {
  }

  async function criarTarefa(titulo) {
  }
</script>
`,
              testes: [
                [
                  'listarTarefas faz GET no endereço certo e devolve o array',
                  async doc => {
                    const w = doc.defaultView;
                    const f = w.eval('typeof listarTarefas === "function" ? listarTarefas : null');
                    let pedido;
                    w.fetch = async (url, opcoes = {}) => {
                      pedido = { url: String(url), metodo: (opcoes.method || 'GET').toUpperCase() };
                      return new w.Response('[{"id":1,"titulo":"Estudar","feita":false}]', { status: 200 });
                    };
                    const r = await f();
                    return (
                      pedido.url === 'https://api.exemplo.com/tarefas' &&
                      pedido.metodo === 'GET' &&
                      Array.isArray(r) &&
                      r[0].titulo === 'Estudar'
                    );
                  }
                ],
                [
                  'listarTarefas lança um Error com o status quando a resposta não é ok',
                  async doc => {
                    const w = doc.defaultView;
                    const f = w.eval('typeof listarTarefas === "function" ? listarTarefas : null');
                    w.fetch = async () => new w.Response('{"erro":"fora do ar"}', { status: 503 });
                    try {
                      await f();
                      return false;
                    } catch (erro) {
                      return String(erro.message).includes('503');
                    }
                  }
                ],
                [
                  'criarTarefa faz POST com Content-Type JSON e o corpo certo',
                  async doc => {
                    const w = doc.defaultView;
                    const f = w.eval('typeof criarTarefa === "function" ? criarTarefa : null');
                    let pedido;
                    w.fetch = async (url, opcoes = {}) => {
                      pedido = { url: String(url), ...opcoes };
                      return new w.Response('{"id":7,"titulo":"Ler","feita":false}', { status: 201 });
                    };
                    await f('Ler');
                    const cabecalhos = new w.Headers(pedido.headers);
                    const corpo = JSON.parse(pedido.body);
                    return (
                      pedido.url === 'https://api.exemplo.com/tarefas' &&
                      String(pedido.method).toUpperCase() === 'POST' &&
                      (cabecalhos.get('content-type') || '').includes('application/json') &&
                      corpo.titulo === 'Ler' &&
                      corpo.feita === false
                    );
                  }
                ],
                [
                  'criarTarefa devolve a tarefa criada',
                  async doc => {
                    const w = doc.defaultView;
                    const f = w.eval('typeof criarTarefa === "function" ? criarTarefa : null');
                    w.fetch = async () => new w.Response('{"id":7,"titulo":"Ler","feita":false}', { status: 201 });
                    const r = await f('Ler');
                    return r && r.id === 7;
                  }
                ],
                [
                  'criarTarefa lança um Error com o status quando a API recusa',
                  async doc => {
                    const w = doc.defaultView;
                    const f = w.eval('typeof criarTarefa === "function" ? criarTarefa : null');
                    w.fetch = async () => new w.Response('{"erro":"título vazio"}', { status: 422 });
                    try {
                      await f('');
                      return false;
                    } catch (erro) {
                      return String(erro.message).includes('422');
                    }
                  }
                ]
              ],
              solucao: `<script>
  const API = 'https://api.exemplo.com/tarefas';

  async function listarTarefas() {
    const resposta = await fetch(API);
    if (!resposta.ok) throw new Error(\`Erro \${resposta.status}\`);
    return resposta.json();
  }

  async function criarTarefa(titulo) {
    const resposta = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, feita: false })
    });
    if (!resposta.ok) throw new Error(\`Erro \${resposta.status}\`);
    return resposta.json();
  }
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Autenticação, CORS e chamadas que aguentam falhas.',
      modulos: [
        {
          titulo: 'Segurança e resiliência',
          itens: [
            {
              id: 'autenticacao-e-cors',
              titulo: 'Autenticação, chaves e CORS',
              resumo: 'Tokens, onde guardar chaves e por que o navegador bloqueia pedidos.',
              minutos: 13,
              corpo: `
<h2>Quem é você?</h2>
<p>APIs privadas precisam saber quem está pedindo. Os jeitos mais comuns:</p>
<ul>
  <li><strong>Chave de API</strong>: um código secreto enviado num cabeçalho (<code>x-api-key: ...</code>). Identifica o <em>sistema</em> que chama.</li>
  <li><strong>Token de acesso</strong>: depois do login, o servidor devolve um token (muitas vezes um JWT) que vai em cada pedido: <code>Authorization: Bearer eyJhbGc...</code>. Identifica a <em>pessoa</em> e expira.</li>
  <li><strong>Cookie de sessão</strong>: o servidor grava um cookie <code>HttpOnly</code> no login e o navegador manda sozinho a cada pedido. O JavaScript nem consegue ler, o que protege contra roubo por XSS.</li>
</ul>
${trecho(`const resposta = await fetch('https://api.exemplo.com/minha-conta', {
  headers: { Authorization: \`Bearer \${token}\` }
});`)}

<h2>Chave secreta não vai para o front-end</h2>
<p>Tudo o que está no JavaScript do site pode ser lido por qualquer visitante (F12 → Fontes). Uma chave paga de API colocada ali vai ser copiada. O caminho certo é um pequeno <strong>back-end intermediário</strong>: o front chama o seu servidor, e só ele, que guarda a chave numa variável de ambiente, chama a API paga.</p>
${dica('Chaves "públicas" existem e podem ir no front, como a configuração do Firebase ou a chave do Google Maps restrita ao seu domínio. A diferença é que elas foram feitas para isso e a proteção está nas regras do servidor, não no segredo.')}

<h2>CORS</h2>
<p>Por segurança, o navegador não deixa o JavaScript de <code>site-a.com</code> ler a resposta de <code>api-b.com</code>, a menos que <code>api-b.com</code> autorize. Essa autorização é o <strong>CORS</strong>, um cabeçalho na resposta:</p>
${trecho(`Access-Control-Allow-Origin: https://site-a.com`)}
<ul>
  <li>O erro "blocked by CORS policy" aparece no navegador, mas <strong>a correção é no servidor</strong> da API. Não há nada a mudar no fetch.</li>
  <li>Pedidos com cabeçalhos especiais (como <code>Authorization</code>) ou JSON fazem o navegador mandar antes um <strong>preflight</strong>: um pedido <code>OPTIONS</code> perguntando se pode.</li>
  <li>O CORS é uma regra <em>do navegador</em>. Um script em Node ou o Postman chamam a mesma API sem bloqueio nenhum, por isso não é uma proteção do servidor.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Onde guardar a chave secreta de uma API paga?',
                  opcoes: [
                    'No JavaScript do site, escondida',
                    'Num back-end, numa variável de ambiente; o front chama esse back-end',
                    'No localStorage'
                  ],
                  certa: 1,
                  explicacao: 'Tudo que vai para o navegador pode ser lido por quem visita.'
                },
                {
                  pergunta: 'Apareceu "blocked by CORS policy". Onde se corrige?',
                  opcoes: ['No fetch do front-end', 'No servidor da API, com os cabeçalhos de CORS', 'No navegador'],
                  certa: 1,
                  explicacao: 'É a API que diz quais origens podem ler as respostas dela.'
                },
                {
                  pergunta: 'Qual cabeçalho leva o token de acesso?',
                  opcoes: ['Content-Type', 'Authorization: Bearer ...', 'Accept'],
                  certa: 1,
                  explicacao: 'O padrão é Authorization com o tipo Bearer.'
                }
              ]
            },
            {
              id: 'chamadas-resilientes',
              titulo: 'Chamadas resilientes',
              resumo: 'Tentar de novo com espera crescente, 429, chamadas em paralelo e cache.',
              minutos: 13,
              corpo: `
<p>Redes falham, servidores ficam lentos e APIs limitam quantos pedidos você pode fazer. Código de produção espera por isso.</p>

<h2>Tentar de novo, com calma</h2>
<p>Erros passageiros (falha de rede, 502, 503, 429) muitas vezes somem na segunda tentativa. A técnica padrão é o <strong>recuo exponencial</strong>: esperar 0,5 s, depois 1 s, depois 2 s, para não piorar um servidor que já está sobrecarregado.</p>
${codigo(`<script>
  const esperar = ms => new Promise(r => setTimeout(r, ms));

  async function comRetentativas(funcao, tentativas = 3) {
    for (let i = 1; ; i++) {
      try {
        return await funcao();
      } catch (erro) {
        if (i >= tentativas) throw erro;
        const ms = 500 * 2 ** (i - 1);
        console.log(\`Tentativa \${i} falhou (\${erro.message}). Esperando \${ms} ms...\`);
        await esperar(ms);
      }
    }
  }

  // Uma função que falha duas vezes e depois funciona
  let vezes = 0;
  comRetentativas(async () => {
    vezes++;
    if (vezes < 3) throw new Error('rede instável');
    return 'deu certo na tentativa ' + vezes;
  }).then(console.log);
</script>`)}
<ul>
  <li>Não repita erros que não vão mudar: 400, 401, 403, 404 e 422 continuarão iguais.</li>
  <li>Com 429 (pedidos demais), respeite o cabeçalho <code>Retry-After</code>, que diz quantos segundos esperar.</li>
  <li>Lembre da idempotência: repetir um POST pode duplicar o pedido.</li>
</ul>

<h2>Em paralelo</h2>
<p>Pedidos independentes não precisam esperar um pelo outro. <code>Promise.all</code> dispara todos e espera o conjunto; <code>Promise.allSettled</code> espera todos mesmo que algum falhe:</p>
${codigo(`<script>
  const base = 'https://jsonplaceholder.typicode.com';
  const inicio = performance.now();
  Promise.all([
    fetch(base + '/users/1').then(r => r.json()),
    fetch(base + '/posts?userId=1').then(r => r.json()),
    fetch(base + '/todos?userId=1').then(r => r.json())
  ]).then(([usuario, posts, tarefas]) => {
    console.log(usuario.name, '·', posts.length, 'posts ·', tarefas.length, 'tarefas');
    console.log('Tempo:', Math.round(performance.now() - inicio), 'ms');
  });
</script>`)}

<h2>Não pedir o que você já tem</h2>
<p>Um <code>Map</code> guardando as respostas por URL evita repetir pedidos iguais (por exemplo, abrir o mesmo produto duas vezes). Guarde a <strong>Promise</strong>, não o resultado: assim dois pedidos simultâneos para a mesma URL viram um só.</p>
${trecho(`const cache = new Map();
function buscarComCache(url) {
  if (!cache.has(url)) cache.set(url, fetch(url).then(r => r.json()));
  return cache.get(url);
}`)}
${dica('Numa busca enquanto a pessoa digita, combine debounce (espera ela parar de digitar) com AbortController (cancela o pedido anterior). Senão, a resposta de "caf" pode chegar depois da de "café" e mostrar o resultado errado.')}
`,
              quiz: [
                {
                  pergunta: 'Qual erro vale a pena tentar de novo?',
                  opcoes: ['404', '503', '401'],
                  certa: 1,
                  explicacao: '503 (servidor indisponível) costuma ser passageiro. Os outros vão continuar iguais.'
                },
                {
                  pergunta: 'O que é recuo exponencial?',
                  opcoes: [
                    'Esperar cada vez mais entre as tentativas (0,5 s, 1 s, 2 s...)',
                    'Fazer pedidos cada vez maiores',
                    'Tentar de novo imediatamente'
                  ],
                  certa: 0,
                  explicacao: 'Dá tempo para o servidor se recuperar.'
                },
                {
                  pergunta: 'Por que o cache guarda a Promise, e não o resultado?',
                  opcoes: [
                    'Ocupa menos memória',
                    'Dois pedidos ao mesmo tempo para a mesma URL viram um só',
                    'Promises não expiram'
                  ],
                  certa: 1,
                  explicacao: 'O segundo pedido recebe a mesma Promise que ainda está em andamento.'
                }
              ]
            },
            {
              id: 'desafio-todas-as-paginas',
              tipo: 'desafio',
              titulo: 'Desafio: retentativas e paginação',
              resumo: 'Repita só o que vale a pena e junte todas as páginas de uma API.',
              minutos: 25,
              enunciado: `
<p>Escreva duas funções <code>async</code>. Os testes simulam a API, então nada vai para a internet.</p>
<ul>
  <li><code>comRetentativas(funcao, tentativas)</code>: chama <code>funcao()</code> (que devolve uma Promise) até dar certo, no máximo <code>tentativas</code> vezes, e devolve o resultado. Se todas falharem, lança o último erro. <strong>Não tente de novo</strong> quando o erro tiver a propriedade <code>status</code> entre 400 e 499 <strong>exceto 429</strong>: lance na hora. (Não precisa esperar entre as tentativas.)</li>
  <li><code>buscarTodas(url)</code>: a API devolve páginas no formato <code>{ "dados": [...], "proximo": "url da próxima" }</code>, e <code>proximo</code> é <code>null</code> na última. Busque a primeira página em <code>url</code>, siga o <code>proximo</code> até acabar e devolva um array com os <code>dados</code> de todas as páginas, na ordem.</li>
</ul>`,
              inicial: `<script>
  async function comRetentativas(funcao, tentativas) {
  }

  async function buscarTodas(url) {
  }
</script>
`,
              testes: [
                [
                  'comRetentativas devolve o resultado quando dá certo depois de falhar',
                  async doc => {
                    const f = doc.defaultView.eval('typeof comRetentativas === "function" ? comRetentativas : null');
                    let vezes = 0;
                    const r = await f(async () => {
                      vezes++;
                      if (vezes < 3) throw new Error('rede');
                      return 'ok';
                    }, 5);
                    return r === 'ok' && vezes === 3;
                  }
                ],
                [
                  'comRetentativas desiste depois de N tentativas e lança o último erro',
                  async doc => {
                    const f = doc.defaultView.eval('typeof comRetentativas === "function" ? comRetentativas : null');
                    let vezes = 0;
                    try {
                      await f(async () => {
                        vezes++;
                        throw new Error('falha ' + vezes);
                      }, 3);
                      return false;
                    } catch (erro) {
                      return vezes === 3 && erro.message === 'falha 3';
                    }
                  }
                ],
                [
                  'comRetentativas não repete erros 4xx, mas repete o 429',
                  async doc => {
                    const f = doc.defaultView.eval('typeof comRetentativas === "function" ? comRetentativas : null');
                    let vezes404 = 0;
                    try {
                      await f(async () => {
                        vezes404++;
                        throw Object.assign(new Error('não existe'), { status: 404 });
                      }, 3);
                    } catch {}
                    let vezes429 = 0;
                    const r = await f(async () => {
                      vezes429++;
                      if (vezes429 < 2) throw Object.assign(new Error('calma'), { status: 429 });
                      return 'ok';
                    }, 3);
                    return vezes404 === 1 && vezes429 === 2 && r === 'ok';
                  }
                ],
                [
                  'buscarTodas segue o proximo e junta os dados de todas as páginas',
                  async doc => {
                    const w = doc.defaultView;
                    const f = w.eval('typeof buscarTodas === "function" ? buscarTodas : null');
                    const paginas = {
                      'https://api.exemplo.com/itens': { dados: [1, 2], proximo: 'https://api.exemplo.com/itens?p=2' },
                      'https://api.exemplo.com/itens?p=2': { dados: [3], proximo: 'https://api.exemplo.com/itens?p=3' },
                      'https://api.exemplo.com/itens?p=3': { dados: [4, 5], proximo: null }
                    };
                    const pedidos = [];
                    w.fetch = async url => {
                      pedidos.push(String(url));
                      return new w.Response(JSON.stringify(paginas[String(url)]), { status: 200 });
                    };
                    const r = await f('https://api.exemplo.com/itens');
                    return JSON.stringify(r) === '[1,2,3,4,5]' && pedidos.length === 3;
                  }
                ],
                [
                  'buscarTodas funciona com uma página só',
                  async doc => {
                    const w = doc.defaultView;
                    const f = w.eval('typeof buscarTodas === "function" ? buscarTodas : null');
                    w.fetch = async () => new w.Response('{"dados":["a"],"proximo":null}', { status: 200 });
                    const r = await f('https://api.exemplo.com/outra');
                    return JSON.stringify(r) === '["a"]';
                  }
                ]
              ],
              solucao: `<script>
  async function comRetentativas(funcao, tentativas) {
    for (let i = 1; ; i++) {
      try {
        return await funcao();
      } catch (erro) {
        const definitivo = erro.status >= 400 && erro.status < 500 && erro.status !== 429;
        if (definitivo || i >= tentativas) throw erro;
      }
    }
  }

  async function buscarTodas(url) {
    const todos = [];
    let proxima = url;
    while (proxima) {
      const resposta = await fetch(proxima);
      if (!resposta.ok) throw new Error(\`Erro \${resposta.status}\`);
      const pagina = await resposta.json();
      todos.push(...pagina.dados);
      proxima = pagina.proximo;
    }
    return todos;
  }
</script>`
            }
          ]
        }
      ]
    }
  ]
};
