// Trilha de JavaScript: níveis (iniciante, intermediário e avançado), cada um com módulos, aulas (com quiz) e desafios.
// Os testes dos desafios pegam as funções da pessoa com o eval do próprio resultado (doc.defaultView.eval), que enxerga
// até const e class, e simulam cliques e envios de formulário. O console do editor fica em window.__saida.
// Atenção: corpo, inicial e solucao são template strings; crases e ${ dos exemplos precisam de barra invertida.
// Depois de editar, rode `node ferramentas/gerar-estudos.js` para gerar as páginas em estudos/javascript/.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'javascript',
  area: 'Desenvolvimento web',
  titulo: 'JavaScript',
  sigla: 'JS',
  resumo: 'Variáveis, funções, eventos e o DOM: fazer a página reagir ao que a pessoa faz.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'A linguagem do zero: variáveis, decisões, funções, listas e objetos.',
      modulos: [
        {
          titulo: 'Primeiros passos',
          itens: [
            {
              id: 'o-que-e-javascript',
              titulo: 'O que é JavaScript',
              resumo: 'Onde o código fica, o console e como o navegador lê um script.',
              minutos: 8,
              corpo: `
<p>JavaScript é a linguagem de programação da web. O HTML diz o que cada parte da página é, o CSS diz como ela parece, e o JavaScript faz a página <strong>reagir</strong>: abrir um menu, validar um formulário, buscar dados novos sem recarregar.</p>
<p>Ele também roda fora do navegador (no Node.js, por exemplo), mas nesta trilha vamos usá-lo onde nasceu: na página.</p>

<h2>A tag &lt;script&gt;</h2>
<p>O código JavaScript vai dentro de uma tag <code>&lt;script&gt;</code>, ou num arquivo separado ligado com <code>&lt;script src=&quot;app.js&quot; defer&gt;&lt;/script&gt;</code>. O navegador executa as instruções de cima para baixo, uma por vez.</p>
${codigo(`<h1>Olá!</h1>

<script>
  console.log('Primeira linha');
  console.log('Segunda linha');
  console.log(2 + 3);
</script>`)}
${dica('Clique em <strong>Experimente</strong>: o editor desta trilha tem um <strong>Console</strong> embaixo do resultado. Tudo o que você passar para <code>console.log()</code> aparece lá, assim como os erros.')}

<h2>O console</h2>
<p><code>console.log()</code> mostra valores no console. É a ferramenta mais usada para entender o que o código está fazendo, de quem começa a quem programa há décadas. No navegador, o console fica nas ferramentas de desenvolvedor (tecla <kbd>F12</kbd>).</p>

<h2>Instruções e comentários</h2>
<p>Cada instrução costuma terminar com ponto e vírgula. Ele é opcional na maioria dos casos, mas usar sempre evita surpresas. Comentários explicam o código e são ignorados pelo navegador:</p>
${trecho(`// Comentário de uma linha

/* Comentário
   de várias linhas */`)}

<h2>Quando algo dá errado</h2>
<p>Se o navegador não entende uma linha, ele mostra um erro no console e <strong>para de executar aquele script</strong> naquele ponto. Ler a mensagem de erro é uma habilidade: ela diz o tipo do problema e, quase sempre, a linha.</p>
${codigo(`<script>
  console.log('Isto aparece');
  console.lg('Erro de digitação');
  console.log('Isto não aparece, o script parou acima');
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'Qual é o papel do JavaScript numa página?',
                  opcoes: ['Estrutura do conteúdo', 'Aparência', 'Comportamento e interação'],
                  certa: 2,
                  explicacao: 'HTML cuida da estrutura, CSS da aparência e JavaScript do comportamento.'
                },
                {
                  pergunta: 'Para que serve console.log()?',
                  opcoes: ['Mostrar um valor no console', 'Escrever um texto na página', 'Salvar um arquivo'],
                  certa: 0,
                  explicacao:
                    'Ele escreve no console, que é invisível para quem visita. É uma ferramenta de quem programa.'
                },
                {
                  pergunta: 'O que acontece quando uma linha do script tem um erro?',
                  opcoes: [
                    'O navegador pula só aquela linha',
                    'O script para naquele ponto e o erro aparece no console',
                    'A página fica em branco'
                  ],
                  certa: 1,
                  explicacao: 'O resto daquele script não roda. A página e outros scripts continuam funcionando.'
                }
              ]
            },
            {
              id: 'variaveis-e-tipos',
              titulo: 'Variáveis e tipos',
              resumo: 'let, const, textos, números, booleanos e template strings.',
              minutos: 10,
              corpo: `
<p>Uma <strong>variável</strong> é um nome que guarda um valor para usar depois. Em JavaScript moderno, há duas formas de criar uma:</p>
<ul>
  <li><code>const</code>: o valor não pode ser trocado depois. Use por padrão.</li>
  <li><code>let</code>: o valor pode mudar. Use quando precisar reatribuir, como num contador.</li>
</ul>
${codigo(`<script>
  const nome = 'Ana';
  let pontos = 10;
  pontos = pontos + 5;

  console.log(nome);
  console.log(pontos);
</script>`)}
${dica('Você vai encontrar <code>var</code> em códigos antigos. Ele funciona, mas tem regras de escopo que causam bugs. Em código novo, use <code>const</code> e <code>let</code>.')}

<h2>Os tipos básicos</h2>
<ul>
  <li><strong>string</strong> (texto): entre aspas simples, duplas ou crases. <code>'Olá'</code></li>
  <li><strong>number</strong>: inteiros e decimais, com ponto. <code>42</code>, <code>3.14</code></li>
  <li><strong>boolean</strong>: <code>true</code> ou <code>false</code>.</li>
  <li><strong>undefined</strong>: a variável existe, mas ainda não tem valor.</li>
  <li><strong>null</strong>: "nenhum valor", colocado de propósito.</li>
</ul>
<p><code>typeof</code> diz o tipo de um valor: <code>typeof 42</code> é <code>'number'</code>.</p>

<h2>Template strings</h2>
<p>Com crases, dá para colocar valores no meio do texto usando <code>\${ }</code>. É bem mais legível que juntar pedaços com <code>+</code>:</p>
${codigo(`<script>
  const produto = 'café';
  const preco = 18.5;
  const quantidade = 2;

  console.log('Comprei ' + quantidade + ' pacotes de ' + produto);
  console.log(\`Comprei \${quantidade} pacotes de \${produto} por R$ \${preco * quantidade}\`);
</script>`)}

<h2>Cuidado: texto que parece número</h2>
<p>O que vem de um campo de formulário é sempre texto. Somar dois textos <em>junta</em> os dois, em vez de somar:</p>
${codigo(`<script>
  console.log('2' + '3');                 // "23"
  console.log(Number('2') + Number('3')); // 5
  console.log(Number('abc'));             // NaN: "não é um número"
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'Quando usar let em vez de const?',
                  opcoes: ['Sempre', 'Quando o valor precisar ser trocado depois', 'Para textos'],
                  certa: 1,
                  explicacao:
                    'const é o padrão. let é para valores que mudam, como um contador ou um total que vai somando.'
                },
                {
                  pergunta: "Qual o resultado de '5' + '5'?",
                  opcoes: ['10', "'55'", 'Um erro'],
                  certa: 1,
                  explicacao: 'Com dois textos, o + junta os dois. Para somar, converta antes com Number().'
                },
                {
                  pergunta: 'Qual linha mostra "Olá, Ana" com template string, sendo nome = "Ana"?',
                  opcoes: ["'Olá, ${nome}'", '`Olá, ${nome}`', '"Olá, " nome'],
                  certa: 1,
                  explicacao: 'Só as crases interpretam o ${ }. Com aspas simples, o texto sai literal.'
                }
              ]
            },
            {
              id: 'decisoes',
              titulo: 'Comparações e decisões',
              resumo: 'if, else, ===, && e || para o código escolher um caminho.',
              minutos: 10,
              corpo: `
<h2>Comparando valores</h2>
<p>Comparações resultam em <code>true</code> ou <code>false</code>:</p>
<ul>
  <li><code>===</code> igual e <code>!==</code> diferente;</li>
  <li><code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code> maior, menor e as versões "ou igual".</li>
</ul>
${dica("Use sempre <code>===</code> (três sinais). O <code>==</code> tenta converter os tipos antes de comparar e dá resultados estranhos, como <code>0 == ''</code> ser verdadeiro.")}

<h2>if, else if e else</h2>
<p>O <code>if</code> executa um bloco só quando a condição é verdadeira. <code>else if</code> testa outra condição, e <code>else</code> pega todo o resto:</p>
${codigo(`<script>
  const temperatura = 31;

  if (temperatura >= 30) {
    console.log('Está quente, leve água.');
  } else if (temperatura >= 18) {
    console.log('Clima agradável.');
  } else {
    console.log('Leve um casaco.');
  }
</script>`)}
<p>As condições são testadas na ordem e só o primeiro bloco verdadeiro roda.</p>

<h2>E, ou, não</h2>
<ul>
  <li><code>a &amp;&amp; b</code>: verdadeiro se <strong>os dois</strong> forem verdadeiros.</li>
  <li><code>a || b</code>: verdadeiro se <strong>pelo menos um</strong> for.</li>
  <li><code>!a</code>: inverte.</li>
</ul>
${codigo(`<script>
  const idade = 17;
  const comResponsavel = true;

  if (idade >= 18 || comResponsavel) {
    console.log('Pode entrar');
  }
  if (idade >= 16 && idade < 18) {
    console.log('Voto facultativo');
  }
</script>`)}

<h2>Valores "verdadeiros" e "falsos"</h2>
<p>Num <code>if</code>, qualquer valor vira verdadeiro ou falso. São falsos: <code>false</code>, <code>0</code>, <code>''</code> (texto vazio), <code>null</code>, <code>undefined</code> e <code>NaN</code>. Todo o resto é verdadeiro. Por isso <code>if (nome)</code> é um jeito curto de perguntar "o nome foi preenchido?".</p>

<h2>O operador ternário</h2>
<p>Para escolher entre dois valores numa linha só: <code>condição ? valorSeSim : valorSeNão</code>.</p>
${codigo(`<script>
  const itens = 1;
  console.log(\`\${itens} \${itens === 1 ? 'item' : 'itens'} no carrinho\`);
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que preferir === a ==?',
                  opcoes: [
                    '=== é mais rápido de digitar',
                    '=== compara sem converter os tipos, evitando resultados estranhos',
                    '== não existe mais'
                  ],
                  certa: 1,
                  explicacao: "Com ==, '1' == 1 é verdadeiro. Com ===, tipo e valor precisam bater."
                },
                {
                  pergunta: 'Com idade = 20, qual condição é falsa?',
                  opcoes: ['idade > 18 && idade < 30', 'idade < 18 || idade === 20', 'idade < 18 && idade === 20'],
                  certa: 2,
                  explicacao: 'Com &&, as duas partes precisam ser verdadeiras, e idade < 18 é falsa.'
                },
                {
                  pergunta: 'Qual destes valores é falso num if?',
                  opcoes: ["'0' (texto com zero)", "'' (texto vazio)", '[] (lista vazia)'],
                  certa: 1,
                  explicacao: "Só o texto vazio é falso. '0' é um texto com conteúdo, e listas são sempre verdadeiras."
                }
              ]
            },
            {
              id: 'funcoes',
              titulo: 'Funções',
              resumo: 'Parâmetros, return e arrow functions: código com nome para reaproveitar.',
              minutos: 11,
              corpo: `
<p>Uma <strong>função</strong> é um bloco de código com nome, que você escreve uma vez e usa quantas vezes quiser. Ela pode receber valores (os <strong>parâmetros</strong>) e devolver um resultado com <code>return</code>.</p>
${codigo(`<script>
  function calcularDesconto(preco, porcentagem) {
    const desconto = preco * porcentagem / 100;
    return preco - desconto;
  }

  console.log(calcularDesconto(100, 10)); // 90
  console.log(calcularDesconto(250, 20)); // 200
</script>`)}

<h2>return devolve e encerra</h2>
<p>Quando a função chega num <code>return</code>, ela devolve o valor e para ali. Uma função sem <code>return</code> devolve <code>undefined</code>. Um erro comum é usar <code>console.log</code> achando que está devolvendo algo: ele só mostra, não devolve.</p>
${codigo(`<script>
  function classificar(nota) {
    if (nota >= 7) return 'Aprovado';
    if (nota >= 5) return 'Recuperação';
    return 'Reprovado';
  }

  console.log(classificar(8.5));
  console.log(classificar(6));
  console.log(classificar(3));
</script>`)}

<h2>Parâmetros com valor padrão</h2>
${trecho(`function saudar(nome = 'visitante') {
  return \`Olá, \${nome}!\`;
}
saudar();       // "Olá, visitante!"
saudar('Bia');  // "Olá, Bia!"`)}

<h2>Arrow functions</h2>
<p>Uma forma mais curta, muito usada para funções pequenas. Se o corpo for uma expressão só, o <code>return</code> fica implícito:</p>
${codigo(`<script>
  const dobro = numero => numero * 2;
  const somar = (a, b) => a + b;
  const ehPar = n => n % 2 === 0;

  console.log(dobro(21));
  console.log(somar(2, 3));
  console.log(ehPar(7));
</script>`)}
<p>O <code>%</code> é o resto da divisão: <code>7 % 2</code> é 1, por isso 7 não é par.</p>
${dica('Bons nomes de função começam com um verbo e dizem o que ela faz: <code>calcularFrete</code>, <code>formatarData</code>, <code>ehValido</code>. Se for difícil dar um nome, talvez a função esteja fazendo coisas demais.')}
`,
              quiz: [
                {
                  pergunta: 'O que uma função sem return devolve?',
                  opcoes: ['0', 'undefined', 'O último valor calculado'],
                  certa: 1,
                  explicacao:
                    'Sem return explícito, a função devolve undefined, mesmo que tenha feito contas por dentro.'
                },
                {
                  pergunta: 'Qual a diferença entre return e console.log dentro de uma função?',
                  opcoes: [
                    'Nenhuma',
                    'return devolve o valor para quem chamou; console.log só mostra no console',
                    'console.log devolve e return mostra'
                  ],
                  certa: 1,
                  explicacao: 'Só o return entrega o resultado para o resto do código usar.'
                },
                {
                  pergunta: 'Qual arrow function devolve o triplo de um número?',
                  opcoes: ['n => { n * 3 }', 'n => n * 3', 'n => return n * 3'],
                  certa: 1,
                  explicacao: 'Sem chaves, a expressão é devolvida. Com chaves, seria preciso escrever return.'
                }
              ]
            },
            {
              id: 'desafio-funcoes',
              tipo: 'desafio',
              titulo: 'Desafio: funções da loja',
              resumo: 'Escreva quatro funções pequenas usando variáveis, decisões e return.',
              minutos: 20,
              enunciado: `
<p>Uma loja precisa de algumas funções para o site. Os nomes e os parâmetros já estão no código: falta escrever o que cada uma faz. Os testes chamam suas funções com vários valores diferentes, então elas precisam <strong>devolver</strong> o resultado com <code>return</code>.</p>
<ul>
  <li><code>saudacao(nome)</code> devolve <code>"Olá, NOME!"</code>.</li>
  <li><code>ehPar(numero)</code> devolve <code>true</code> ou <code>false</code>.</li>
  <li><code>frete(valor)</code> devolve <code>0</code> para compras a partir de 200 e <code>25</code> para as menores.</li>
  <li><code>classificarNota(nota)</code> devolve <code>"Aprovado"</code> (7 ou mais), <code>"Recuperação"</code> (5 até menos de 7) ou <code>"Reprovado"</code>.</li>
</ul>`,
              inicial: `<script>
  function saudacao(nome) {
    // devolva "Olá, NOME!"
  }

  function ehPar(numero) {
  }

  function frete(valor) {
  }

  function classificarNota(nota) {
  }

  // Teste aqui, o resultado aparece no Console:
  console.log(saudacao('Ana'));
</script>
`,
              testes: [
                [
                  'saudacao("Ana") devolve "Olá, Ana!"',
                  doc => {
                    const f = doc.defaultView.eval('typeof saudacao === "function" ? saudacao : null');
                    return f('Ana') === 'Olá, Ana!' && f('Rui') === 'Olá, Rui!';
                  }
                ],
                [
                  'ehPar devolve true para pares e false para ímpares',
                  doc => {
                    const f = doc.defaultView.eval('typeof ehPar === "function" ? ehPar : null');
                    return f(4) === true && f(0) === true && f(7) === false && f(-3) === false;
                  }
                ],
                [
                  'frete é 25 abaixo de 200 e 0 a partir de 200',
                  doc => {
                    const f = doc.defaultView.eval('typeof frete === "function" ? frete : null');
                    return f(50) === 25 && f(199.99) === 25 && f(200) === 0 && f(350) === 0;
                  }
                ],
                [
                  'classificarNota devolve Aprovado, Recuperação ou Reprovado',
                  doc => {
                    const f = doc.defaultView.eval('typeof classificarNota === "function" ? classificarNota : null');
                    return (
                      f(10) === 'Aprovado' &&
                      f(7) === 'Aprovado' &&
                      f(6.9) === 'Recuperação' &&
                      f(5) === 'Recuperação' &&
                      f(4.9) === 'Reprovado'
                    );
                  }
                ]
              ],
              solucao: `<script>
  function saudacao(nome) {
    return \`Olá, \${nome}!\`;
  }

  function ehPar(numero) {
    return numero % 2 === 0;
  }

  function frete(valor) {
    return valor >= 200 ? 0 : 25;
  }

  function classificarNota(nota) {
    if (nota >= 7) return 'Aprovado';
    if (nota >= 5) return 'Recuperação';
    return 'Reprovado';
  }

  console.log(saudacao('Ana'));
</script>`
            }
          ]
        },
        {
          titulo: 'Listas e objetos',
          itens: [
            {
              id: 'arrays',
              titulo: 'Arrays',
              resumo: 'Listas de valores: índices, length, push e laços com for...of.',
              minutos: 10,
              corpo: `
<p>Um <strong>array</strong> guarda vários valores em ordem, numa variável só. Ele é escrito entre colchetes, com os itens separados por vírgula.</p>
${codigo(`<script>
  const frutas = ['maçã', 'banana', 'uva'];

  console.log(frutas[0]);      // o primeiro item tem índice 0
  console.log(frutas[2]);
  console.log(frutas.length);  // quantos itens
  console.log(frutas[frutas.length - 1]); // o último
</script>`)}

<h2>Mudando a lista</h2>
<ul>
  <li><code>push(item)</code> acrescenta no fim; <code>pop()</code> tira o último.</li>
  <li><code>unshift(item)</code> acrescenta no começo; <code>shift()</code> tira o primeiro.</li>
  <li><code>includes(item)</code> diz se o item está na lista.</li>
  <li><code>indexOf(item)</code> diz em que posição ele está (ou -1, se não estiver).</li>
  <li><code>splice(posição, quantos)</code> remove itens do meio.</li>
</ul>
${codigo(`<script>
  const tarefas = ['estudar', 'lavar louça'];
  tarefas.push('ir à feira');
  console.log(tarefas);
  console.log(tarefas.includes('estudar'));

  const posicao = tarefas.indexOf('lavar louça');
  tarefas.splice(posicao, 1);
  console.log(tarefas);
</script>`)}
${dica('Um array criado com <code>const</code> ainda pode ganhar e perder itens. O <code>const</code> impede só de trocar a lista inteira por outra.')}

<h2>Percorrendo a lista</h2>
<p>O <code>for...of</code> passa por cada item, do primeiro ao último:</p>
${codigo(`<script>
  const precos = [12.5, 8, 30];
  let total = 0;

  for (const preco of precos) {
    total = total + preco;
  }
  console.log(\`Total: \${total}\`);
</script>`)}
<p>Quando você precisa do índice, existe o <code>for</code> clássico, que repete enquanto a condição for verdadeira:</p>
${codigo(`<script>
  const nomes = ['Ana', 'Bruno', 'Carla'];
  for (let i = 0; i < nomes.length; i++) {
    console.log(\`\${i + 1}º lugar: \${nomes[i]}\`);
  }
</script>`)}
`,
              quiz: [
                {
                  pergunta: "Em const cores = ['azul', 'verde', 'rosa'], quanto vale cores[1]?",
                  opcoes: ["'azul'", "'verde'", "'rosa'"],
                  certa: 1,
                  explicacao: 'Os índices começam em 0: azul é o 0, verde o 1 e rosa o 2.'
                },
                {
                  pergunta: 'Como acrescentar um item no fim de um array?',
                  opcoes: ['lista.push(item)', 'lista.add(item)', 'lista[0] = item'],
                  certa: 0,
                  explicacao: 'push acrescenta no fim. lista[0] = item trocaria o primeiro.'
                },
                {
                  pergunta: 'O que indexOf devolve quando o item não está na lista?',
                  opcoes: ['0', 'undefined', '-1'],
                  certa: 2,
                  explicacao: '-1 significa "não encontrei", porque 0 é uma posição válida.'
                }
              ]
            },
            {
              id: 'objetos',
              titulo: 'Objetos',
              resumo: 'Agrupar dados com nome: propriedades, métodos e listas de objetos.',
              minutos: 10,
              corpo: `
<p>Um array guarda itens em ordem. Um <strong>objeto</strong> guarda dados com <strong>nome</strong>: cada valor tem uma chave que diz o que ele é. É a forma natural de representar uma coisa do mundo real, como um produto ou uma pessoa.</p>
${codigo(`<script>
  const produto = {
    nome: 'Café especial',
    preco: 32.9,
    emEstoque: true,
    tags: ['grãos', 'torra média']
  };

  console.log(produto.nome);
  console.log(produto['preco']);
  console.log(produto.tags[0]);
</script>`)}
<p>Use o ponto (<code>produto.nome</code>) na maior parte do tempo. Os colchetes servem quando o nome da chave está numa variável: <code>produto[campo]</code>.</p>

<h2>Mudando e acrescentando</h2>
${codigo(`<script>
  const pessoa = { nome: 'Bia', idade: 29 };
  pessoa.idade = 30;           // muda
  pessoa.cidade = 'Recife';    // acrescenta
  delete pessoa.idade;         // remove
  console.log(pessoa);

  console.log(Object.keys(pessoa));   // as chaves
  console.log('cidade' in pessoa);    // a chave existe?
</script>`)}

<h2>Métodos</h2>
<p>Uma função guardada num objeto se chama <strong>método</strong>. Dentro dele, <code>this</code> é o próprio objeto:</p>
${trecho(`const conta = {
  saldo: 100,
  depositar(valor) {
    this.saldo += valor;
  }
};
conta.depositar(50); // conta.saldo agora é 150`)}

<h2>Listas de objetos</h2>
<p>A combinação mais comum na vida real: um array em que cada item é um objeto. É assim que chegam os dados de quase toda API.</p>
${codigo(`<script>
  const pedidos = [
    { cliente: 'Ana', valor: 120 },
    { cliente: 'Bruno', valor: 45.5 },
    { cliente: 'Carla', valor: 89 }
  ];

  for (const pedido of pedidos) {
    console.log(\`\${pedido.cliente}: R$ \${pedido.valor.toFixed(2)}\`);
  }
</script>`)}
<p><code>toFixed(2)</code> formata o número com duas casas decimais, o que é bom para dinheiro.</p>
`,
              quiz: [
                {
                  pergunta: "Como ler o preço de const item = { nome: 'Pão', preco: 1.5 }?",
                  opcoes: ['item[preco]', 'item.preco', 'item(preco)'],
                  certa: 1,
                  explicacao:
                    "item.preco ou item['preco'] (com aspas). Sem aspas, item[preco] procuraria uma variável chamada preco."
                },
                {
                  pergunta: 'Quando preferir um objeto a um array?',
                  opcoes: [
                    'Quando cada valor tem um significado diferente e precisa de nome',
                    'Quando a ordem importa',
                    'Nunca, arrays são mais rápidos'
                  ],
                  certa: 0,
                  explicacao:
                    'Nome, preço e estoque são coisas diferentes: objeto. Uma sequência de preços é uma lista: array.'
                },
                {
                  pergunta: 'Dentro de um método, o que é this?',
                  opcoes: ['A janela do navegador', 'O próprio objeto dono do método', 'A função'],
                  certa: 1,
                  explicacao: 'Chamado como objeto.metodo(), o this aponta para o objeto.'
                }
              ]
            },
            {
              id: 'metodos-de-array',
              titulo: 'Métodos de array',
              resumo: 'map, filter, find, reduce e sort: transformar listas sem laços manuais.',
              minutos: 12,
              corpo: `
<p>Os arrays têm métodos que recebem uma função e fazem o trabalho do laço por você. O código fica mais curto e diz <em>o que</em> está sendo feito, não <em>como</em>.</p>

<h2>map: transformar cada item</h2>
<p>Devolve um array novo, do mesmo tamanho, com o resultado da função para cada item.</p>
${codigo(`<script>
  const precos = [10, 25, 40];
  const comImposto = precos.map(preco => preco * 1.1);
  console.log(comImposto);

  const produtos = [{ nome: 'Café' }, { nome: 'Chá' }];
  console.log(produtos.map(p => p.nome));
</script>`)}

<h2>filter: ficar só com alguns</h2>
<p>Devolve um array novo só com os itens para os quais a função devolveu verdadeiro.</p>
${codigo(`<script>
  const notas = [9, 4.5, 7, 3, 8];
  const aprovadas = notas.filter(nota => nota >= 7);
  console.log(aprovadas);
</script>`)}

<h2>find, some e every</h2>
<ul>
  <li><code>find</code> devolve o <strong>primeiro</strong> item que combina (ou <code>undefined</code>).</li>
  <li><code>some</code> diz se <strong>algum</strong> combina; <code>every</code>, se <strong>todos</strong> combinam.</li>
</ul>
${codigo(`<script>
  const usuarios = [
    { nome: 'Ana', admin: false },
    { nome: 'Rui', admin: true }
  ];
  console.log(usuarios.find(u => u.nome === 'Rui'));
  console.log(usuarios.some(u => u.admin));
  console.log(usuarios.every(u => u.admin));
</script>`)}

<h2>reduce: juntar tudo num valor</h2>
<p><code>reduce</code> percorre a lista carregando um acumulador. O segundo argumento é o valor inicial dele. É o jeito clássico de somar:</p>
${codigo(`<script>
  const carrinho = [
    { nome: 'Caneca', preco: 35, quantidade: 2 },
    { nome: 'Camiseta', preco: 59.9, quantidade: 1 }
  ];
  const total = carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  console.log(total.toFixed(2));
</script>`)}

<h2>sort: ordenar</h2>
<p>Cuidado: sem argumentos, <code>sort</code> ordena como texto, e <code>[10, 9, 1].sort()</code> dá <code>[1, 10, 9]</code>. Para números, passe uma função de comparação. E saiba que <code>sort</code> muda o array original; para não mexer nele, use <code>toSorted</code>.</p>
${codigo(`<script>
  const idades = [32, 5, 18, 100];
  console.log(idades.toSorted((a, b) => a - b)); // crescente
  console.log(idades.toSorted((a, b) => b - a)); // decrescente
  console.log(['Rui', 'ana', 'Bia'].toSorted((a, b) => a.localeCompare(b, 'pt-BR')));
</script>`)}
${dica('Os métodos se encadeiam: <code>pedidos.filter(p =&gt; p.pago).map(p =&gt; p.valor)</code> lê como uma frase: "dos pedidos pagos, pegue o valor".')}
`,
              quiz: [
                {
                  pergunta: 'Qual método devolve um array novo só com os itens que passam numa condição?',
                  opcoes: ['map', 'filter', 'find'],
                  certa: 1,
                  explicacao: 'filter filtra. map transforma todos, e find devolve só o primeiro que combina.'
                },
                {
                  pergunta: 'O que [3, 1, 2].map(n => n * 10) devolve?',
                  opcoes: ['[30, 10, 20]', '60', '[10, 20, 30]'],
                  certa: 0,
                  explicacao: 'map mantém a ordem e o tamanho, transformando cada item.'
                },
                {
                  pergunta: 'Por que [10, 9, 1].sort() dá [1, 10, 9]?',
                  opcoes: [
                    'É um bug do navegador',
                    'Sem função de comparação, sort compara os itens como texto',
                    'sort ordena do maior para o menor'
                  ],
                  certa: 1,
                  explicacao: "Como texto, '10' vem antes de '9'. Use (a, b) => a - b para números."
                }
              ]
            },
            {
              id: 'desafio-lista-de-compras',
              tipo: 'desafio',
              titulo: 'Desafio: lista de compras',
              resumo: 'Some, filtre e formate uma lista de objetos com os métodos de array.',
              minutos: 20,
              enunciado: `
<p>A lista de compras é um array de objetos com <code>nome</code>, <code>preco</code> e <code>quantidade</code>. Escreva as funções abaixo. Os testes usam outras listas, então as funções devem trabalhar com o parâmetro <code>itens</code>, não com a variável <code>compras</code>.</p>
<ul>
  <li><code>total(itens)</code>: soma de preço × quantidade de todos os itens.</li>
  <li><code>nomesAcimaDe(itens, valor)</code>: array com os nomes dos itens cujo preço é maior que <code>valor</code>.</li>
  <li><code>maisCaro(itens)</code>: o nome do item de maior preço.</li>
  <li><code>formatarReais(valor)</code>: o valor como texto no formato <code>"R$ 12,50"</code>.</li>
</ul>`,
              inicial: `<script>
  const compras = [
    { nome: 'Arroz', preco: 24.9, quantidade: 1 },
    { nome: 'Feijão', preco: 8.5, quantidade: 2 },
    { nome: 'Azeite', preco: 39.9, quantidade: 1 },
    { nome: 'Banana', preco: 0.8, quantidade: 6 }
  ];

  function total(itens) {
  }

  function nomesAcimaDe(itens, valor) {
  }

  function maisCaro(itens) {
  }

  function formatarReais(valor) {
  }

  console.log(formatarReais(total(compras)));
</script>
`,
              testes: [
                [
                  'total soma preço × quantidade',
                  doc => {
                    const f = doc.defaultView.eval('typeof total === "function" ? total : null');
                    const lista = [
                      { nome: 'A', preco: 10, quantidade: 3 },
                      { nome: 'B', preco: 2.5, quantidade: 2 }
                    ];
                    return Math.abs(f(lista) - 35) < 0.001 && f([]) === 0;
                  }
                ],
                [
                  'nomesAcimaDe devolve só os nomes dos itens mais caros que o valor',
                  doc => {
                    const f = doc.defaultView.eval('typeof nomesAcimaDe === "function" ? nomesAcimaDe : null');
                    const lista = [
                      { nome: 'Leite', preco: 6, quantidade: 1 },
                      { nome: 'Queijo', preco: 45, quantidade: 1 },
                      { nome: 'Vinho', preco: 80, quantidade: 1 }
                    ];
                    return (
                      JSON.stringify(f(lista, 40)) === '["Queijo","Vinho"]' && JSON.stringify(f(lista, 100)) === '[]'
                    );
                  }
                ],
                [
                  'maisCaro devolve o nome do item de maior preço',
                  doc => {
                    const f = doc.defaultView.eval('typeof maisCaro === "function" ? maisCaro : null');
                    return (
                      f([
                        { nome: 'X', preco: 3, quantidade: 9 },
                        { nome: 'Y', preco: 50, quantidade: 1 },
                        { nome: 'Z', preco: 7, quantidade: 1 }
                      ]) === 'Y' && f([{ nome: 'Único', preco: 1, quantidade: 1 }]) === 'Único'
                    );
                  }
                ],
                [
                  'formatarReais(12.5) devolve "R$ 12,50"',
                  doc => {
                    const f = doc.defaultView.eval('typeof formatarReais === "function" ? formatarReais : null');
                    const limpar = texto => String(texto).replace(/\s/g, ' ');
                    return (
                      limpar(f(12.5)) === 'R$ 12,50' && limpar(f(3)) === 'R$ 3,00' && limpar(f(0.1 + 0.2)) === 'R$ 0,30'
                    );
                  }
                ],
                [
                  'Não mudar o array recebido',
                  doc => {
                    const w = doc.defaultView;
                    const lista = [
                      { nome: 'B', preco: 1, quantidade: 1 },
                      { nome: 'A', preco: 9, quantidade: 1 }
                    ];
                    const antes = JSON.stringify(lista);
                    w.eval('[total, nomesAcimaDe, maisCaro]').forEach(f => f(lista, 0));
                    return JSON.stringify(lista) === antes;
                  }
                ]
              ],
              solucao: `<script>
  const compras = [
    { nome: 'Arroz', preco: 24.9, quantidade: 1 },
    { nome: 'Feijão', preco: 8.5, quantidade: 2 },
    { nome: 'Azeite', preco: 39.9, quantidade: 1 },
    { nome: 'Banana', preco: 0.8, quantidade: 6 }
  ];

  function total(itens) {
    return itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  }

  function nomesAcimaDe(itens, valor) {
    return itens.filter(item => item.preco > valor).map(item => item.nome);
  }

  function maisCaro(itens) {
    return itens.toSorted((a, b) => b.preco - a.preco)[0].nome;
  }

  function formatarReais(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  }

  console.log(formatarReais(total(compras)));
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'JavaScript na página: o DOM, eventos, formulários, erros, código assíncrono e APIs.',
      modulos: [
        {
          titulo: 'DOM e eventos',
          itens: [
            {
              id: 'o-dom',
              titulo: 'O DOM',
              resumo: 'Encontrar, ler, mudar, criar e remover elementos da página.',
              minutos: 11,
              corpo: `
<p>Quando o navegador lê o HTML, ele monta uma árvore de objetos na memória: o <strong>DOM</strong> (<em>Document Object Model</em>). Cada tag vira um objeto que o JavaScript pode ler e mudar, e a tela se atualiza na hora.</p>

<h2>Encontrar elementos</h2>
<ul>
  <li><code>document.querySelector('seletor')</code> devolve o <strong>primeiro</strong> elemento que combina com um seletor CSS (ou <code>null</code>).</li>
  <li><code>document.querySelectorAll('seletor')</code> devolve <strong>todos</strong>, numa lista que dá para percorrer com <code>for...of</code>.</li>
</ul>
${dica('São os mesmos seletores da trilha de CSS: <code>#id</code>, <code>.classe</code>, <code>nav a</code>. Quem sabe CSS já sabe encontrar elementos.')}

<h2>Ler e mudar</h2>
${codigo(`<h1 id="titulo">Bem-vindo</h1>
<p class="aviso">Carregando...</p>
<a id="link" href="#">Saiba mais</a>

<script>
  const titulo = document.querySelector('#titulo');
  titulo.textContent = 'Olá de novo!';

  const aviso = document.querySelector('.aviso');
  aviso.classList.add('pronto');
  aviso.textContent = 'Tudo carregado.';
  aviso.style.color = 'green';

  document.querySelector('#link').setAttribute('href', 'https://developer.mozilla.org');
</script>`)}
<ul>
  <li><code>textContent</code>: o texto do elemento.</li>
  <li><code>classList.add</code>, <code>remove</code>, <code>toggle</code> e <code>contains</code>: mexem nas classes. É o jeito preferido de mudar a aparência: o visual fica no CSS e o JavaScript só troca a classe.</li>
  <li><code>setAttribute</code> e <code>getAttribute</code>: atributos. Muitos têm atalho: <code>link.href</code>, <code>img.src</code>, <code>input.value</code>.</li>
</ul>

<h2>Criar e remover</h2>
${codigo(`<ul id="lista"></ul>

<script>
  const lista = document.querySelector('#lista');
  const frutas = ['Manga', 'Caju', 'Acerola'];

  for (const fruta of frutas) {
    const item = document.createElement('li');
    item.textContent = fruta;
    lista.append(item);
  }

  lista.firstElementChild.remove();
</script>`)}

<h2>Cuidado com innerHTML</h2>
<p><code>innerHTML</code> troca o conteúdo por um HTML inteiro. É prático, mas perigoso com texto que veio de uma pessoa: se alguém digitar <code>&lt;img src=x onerror="..."&gt;</code>, o navegador executa. Para texto, use sempre <code>textContent</code>, que mostra os caracteres como são.</p>

<h2>Onde colocar o script</h2>
<p>O script só encontra elementos que já foram lidos. Por isso ele vai no fim do <code>&lt;body&gt;</code> ou, melhor, no <code>&lt;head&gt;</code> com <code>defer</code>, que espera o HTML inteiro.</p>
`,
              quiz: [
                {
                  pergunta: "O que document.querySelector('.card') devolve?",
                  opcoes: ['Todos os elementos com a classe card', 'O primeiro elemento com a classe card', 'Um texto'],
                  certa: 1,
                  explicacao: 'querySelector devolve o primeiro, ou null. Para todos, use querySelectorAll.'
                },
                {
                  pergunta: 'Por que preferir textContent a innerHTML para mostrar o nome que a pessoa digitou?',
                  opcoes: [
                    'É mais rápido',
                    'textContent não interpreta HTML, então não executa código malicioso',
                    'innerHTML não funciona com nomes'
                  ],
                  certa: 1,
                  explicacao:
                    'Com innerHTML, um texto com tags vira HTML de verdade, o que abre espaço para ataques (XSS).'
                },
                {
                  pergunta: 'Qual a forma recomendada de mudar a aparência de um elemento pelo JavaScript?',
                  opcoes: [
                    'Mudar várias propriedades em element.style',
                    'Adicionar ou remover uma classe com classList',
                    'Recriar o elemento'
                  ],
                  certa: 1,
                  explicacao: 'O estilo continua no CSS, e o JavaScript só diz em que estado o elemento está.'
                }
              ]
            },
            {
              id: 'eventos',
              titulo: 'Eventos',
              resumo: 'addEventListener, o objeto do evento e a delegação de eventos.',
              minutos: 11,
              corpo: `
<p>Um <strong>evento</strong> é algo que acontece na página: um clique, uma tecla, o texto de um campo mudando, a página terminando de carregar. Com <code>addEventListener</code>, você diz "quando isto acontecer, rode esta função".</p>
${codigo(`<button id="curtir">♡ Curtir</button>
<p id="contagem">0 curtidas</p>

<script>
  const botao = document.querySelector('#curtir');
  const contagem = document.querySelector('#contagem');
  let curtidas = 0;

  botao.addEventListener('click', () => {
    curtidas++;
    contagem.textContent = \`\${curtidas} \${curtidas === 1 ? 'curtida' : 'curtidas'}\`;
  });
</script>`)}
${dica('Você vai ver <code>onclick="..."</code> direto no HTML em tutoriais antigos. Prefira <code>addEventListener</code>: mantém o JavaScript fora do HTML e permite vários ouvintes no mesmo elemento.')}

<h2>Eventos mais usados</h2>
<ul>
  <li><code>click</code>: clique ou toque (e também Enter ou espaço num botão, pelo teclado).</li>
  <li><code>input</code>: o valor de um campo mudou, a cada tecla.</li>
  <li><code>change</code>: o valor mudou e a pessoa saiu do campo (ou marcou um checkbox).</li>
  <li><code>submit</code>: um formulário foi enviado.</li>
  <li><code>keydown</code>: uma tecla foi apertada.</li>
</ul>

<h2>O objeto do evento</h2>
<p>A função recebe um objeto com detalhes do que aconteceu. <code>event.target</code> é o elemento que recebeu a ação; <code>event.key</code> é a tecla:</p>
${codigo(`<label>Seu nome <input id="nome"></label>
<p id="ola">Olá!</p>

<script>
  const campo = document.querySelector('#nome');
  campo.addEventListener('input', event => {
    const nome = event.target.value.trim();
    document.querySelector('#ola').textContent = nome ? \`Olá, \${nome}!\` : 'Olá!';
  });
  campo.addEventListener('keydown', event => {
    if (event.key === 'Escape') campo.value = '';
  });
</script>`)}

<h2>Delegação de eventos</h2>
<p>Eventos "sobem" pela árvore: um clique num <code>li</code> também é um clique na <code>ul</code>. Em vez de pôr um ouvinte em cada item, ponha um só no pai e veja quem foi clicado. Assim, itens criados depois também funcionam:</p>
${codigo(`<ul id="cores">
  <li>Vermelho</li>
  <li>Azul</li>
</ul>
<button id="mais">Adicionar Verde</button>

<script>
  const cores = document.querySelector('#cores');
  cores.addEventListener('click', event => {
    const item = event.target.closest('li');
    if (item) console.log('Clicou em', item.textContent);
  });
  document.querySelector('#mais').addEventListener('click', () => {
    const li = document.createElement('li');
    li.textContent = 'Verde';
    cores.append(li);
  });
</script>`)}
<p><code>closest('li')</code> sobe a partir do elemento clicado até achar um <code>li</code>, o que funciona mesmo se o item tiver outras tags dentro.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual evento avisa a cada tecla digitada num campo?',
                  opcoes: ['change', 'input', 'submit'],
                  certa: 1,
                  explicacao: 'input dispara a cada mudança. change só quando a pessoa termina e sai do campo.'
                },
                {
                  pergunta: 'O que é event.target?',
                  opcoes: ['A função que trata o evento', 'O elemento onde a ação aconteceu', 'O tipo do evento'],
                  certa: 1,
                  explicacao: 'É o elemento que recebeu o clique, a tecla etc.'
                },
                {
                  pergunta: 'Qual a vantagem da delegação de eventos?',
                  opcoes: [
                    'Um ouvinte só no pai atende todos os filhos, inclusive os criados depois',
                    'Os eventos ficam mais rápidos',
                    'Impede que o evento suba'
                  ],
                  certa: 0,
                  explicacao: 'Como o evento sobe até o pai, basta um ouvinte para a lista inteira.'
                }
              ]
            },
            {
              id: 'formularios-com-js',
              titulo: 'Formulários com JavaScript',
              resumo: 'submit, preventDefault, ler os campos e mostrar mensagens de erro.',
              minutos: 11,
              corpo: `
<p>Formulários são a principal forma de a pessoa mandar informações para o site. O JavaScript entra para validar com mais detalhe, mostrar o resultado sem recarregar a página e enviar os dados para uma API.</p>

<h2>Escute o submit, não o clique</h2>
<p>Ouça o evento <code>submit</code> do <code>&lt;form&gt;</code>, não o <code>click</code> do botão. Ele dispara tanto no clique quanto ao apertar Enter num campo, e só depois que a validação do HTML (como <code>required</code>) passou. <code>event.preventDefault()</code> impede o navegador de recarregar a página.</p>
${codigo(`<form id="cadastro">
  <label>E-mail <input name="email" type="email" required></label>
  <label>Senha <input name="senha" type="password" required minlength="8"></label>
  <button>Criar conta</button>
</form>
<p id="mensagem" role="status"></p>

<script>
  const form = document.querySelector('#cadastro');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const dados = new FormData(form);
    const email = dados.get('email');
    document.querySelector('#mensagem').textContent = \`Conta criada para \${email}.\`;
    form.reset();
  });
</script>`)}
<ul>
  <li><code>new FormData(form)</code> lê todos os campos pelo atributo <code>name</code>. <code>Object.fromEntries(new FormData(form))</code> transforma tudo num objeto.</li>
  <li>Um campo também pode ser lido direto: <code>form.elements.email.value</code> ou <code>input.value</code>.</li>
  <li><code>form.reset()</code> limpa o formulário.</li>
</ul>

<h2>Validações que o HTML não faz</h2>
<p>Para regras próprias, como "as senhas precisam ser iguais", você pode usar <code>setCustomValidity</code>: o navegador mostra a sua mensagem no lugar das dele e bloqueia o envio.</p>
${codigo(`<form id="senhas">
  <label>Senha <input id="s1" type="password" required></label>
  <label>Repita a senha <input id="s2" type="password" required></label>
  <button>Salvar</button>
</form>

<script>
  const s1 = document.querySelector('#s1');
  const s2 = document.querySelector('#s2');
  const conferir = () => s2.setCustomValidity(s1.value === s2.value ? '' : 'As senhas não são iguais.');
  s1.addEventListener('input', conferir);
  s2.addEventListener('input', conferir);
</script>`)}
<p>Texto vazio em <code>setCustomValidity('')</code> significa "está válido".</p>

<h2>Limpe o que veio digitado</h2>
<p>Use <code>.trim()</code> para tirar espaços do começo e do fim: um nome com três espaços não é um nome. E lembre que todo valor de campo é texto; converta com <code>Number()</code> antes de fazer contas.</p>
${dica('A validação no navegador é para ajudar a pessoa. Quem recebe os dados (o servidor) precisa validar de novo, porque qualquer um pode desligar o JavaScript ou enviar dados direto.')}
`,
              quiz: [
                {
                  pergunta: 'Por que ouvir o submit do formulário em vez do click do botão?',
                  opcoes: [
                    'O submit também dispara com Enter e respeita a validação do HTML',
                    'O click não funciona em botões',
                    'Tanto faz'
                  ],
                  certa: 0,
                  explicacao: 'O submit cobre todos os jeitos de enviar e só acontece se os campos forem válidos.'
                },
                {
                  pergunta: 'O que event.preventDefault() faz num submit?',
                  opcoes: [
                    'Valida o formulário',
                    'Impede o envio padrão, que recarregaria a página',
                    'Limpa os campos'
                  ],
                  certa: 1,
                  explicacao:
                    'Sem ele, o navegador envia o formulário e recarrega. Com ele, o JavaScript cuida de tudo.'
                },
                {
                  pergunta: 'A validação feita no JavaScript do navegador é suficiente?',
                  opcoes: ['Sim', 'Não: o servidor precisa validar de novo', 'Só se usar setCustomValidity'],
                  certa: 1,
                  explicacao:
                    'O código do navegador pode ser desligado ou contornado. Ele melhora a experiência, não garante nada.'
                }
              ]
            },
            {
              id: 'desafio-lista-de-tarefas',
              tipo: 'desafio',
              titulo: 'Desafio: lista de tarefas',
              resumo: 'Faça uma lista de tarefas funcionar com eventos e o DOM.',
              minutos: 25,
              enunciado: `
<p>O HTML de uma lista de tarefas está pronto, mas nada funciona. Escreva o JavaScript para que:</p>
<ul>
  <li>enviar o formulário acrescente um <code>&lt;li&gt;</code> com o texto digitado na <code>#lista</code>;</li>
  <li>texto vazio (ou só com espaços) não vire tarefa;</li>
  <li>o campo fique vazio depois de adicionar;</li>
  <li>o <code>#contador</code> mostre quantas tarefas existem;</li>
  <li>clicar numa tarefa marque e desmarque a classe <code>feita</code>.</li>
</ul>
<p>Os testes digitam e clicam de verdade no resultado.</p>`,
              inicial: `<style>
  .feita { text-decoration: line-through; color: #888; }
  #lista li { cursor: pointer; padding: 4px 0; }
</style>

<form id="nova">
  <label for="tarefa">Nova tarefa</label>
  <input id="tarefa" autocomplete="off">
  <button>Adicionar</button>
</form>
<ul id="lista"></ul>
<p id="contador">0 tarefas</p>

<script>
  const form = document.querySelector('#nova');
  const campo = document.querySelector('#tarefa');
  const lista = document.querySelector('#lista');
  const contador = document.querySelector('#contador');

  // Escreva seu código aqui
</script>
`,
              testes: [
                [
                  'Enviar o formulário acrescenta um <li> com o texto na #lista',
                  doc => {
                    const lista = doc.querySelector('#lista');
                    const antes = lista.children.length;
                    doc.querySelector('#tarefa').value = 'Comprar pão';
                    doc.querySelector('#nova').requestSubmit();
                    return (
                      lista.children.length === antes + 1 && lista.lastElementChild.textContent.includes('Comprar pão')
                    );
                  }
                ],
                [
                  'Texto vazio ou só com espaços não vira tarefa',
                  doc => {
                    const lista = doc.querySelector('#lista');
                    doc.querySelector('#tarefa').value = 'Regar as plantas';
                    doc.querySelector('#nova').requestSubmit();
                    const antes = lista.children.length;
                    doc.querySelector('#tarefa').value = '   ';
                    doc.querySelector('#nova').requestSubmit();
                    return antes > 0 && lista.children.length === antes;
                  }
                ],
                [
                  'O campo fica vazio depois de adicionar',
                  doc => {
                    const campo = doc.querySelector('#tarefa');
                    const lista = doc.querySelector('#lista');
                    const antes = lista.children.length;
                    campo.value = 'Lavar a louça';
                    doc.querySelector('#nova').requestSubmit();
                    return lista.children.length > antes && campo.value === '';
                  }
                ],
                [
                  'O #contador mostra quantas tarefas existem',
                  doc => {
                    doc.querySelector('#tarefa').value = 'Estudar JavaScript';
                    doc.querySelector('#nova').requestSubmit();
                    const total = doc.querySelector('#lista').children.length;
                    return total > 0 && doc.querySelector('#contador').textContent.includes(String(total));
                  }
                ],
                [
                  'Clicar numa tarefa marca e desmarca a classe feita',
                  doc => {
                    doc.querySelector('#tarefa').value = 'Ligar para a vó';
                    doc.querySelector('#nova').requestSubmit();
                    const item = doc.querySelector('#lista').lastElementChild;
                    if (!item) return false;
                    item.click();
                    const marcou = item.classList.contains('feita');
                    item.click();
                    return marcou && !item.classList.contains('feita');
                  }
                ],
                [
                  'Usar addEventListener, sem onclick ou onsubmit no HTML',
                  doc => {
                    const js = [...doc.querySelectorAll('script:not([data-base])')].map(s => s.textContent).join('\n');
                    return /addEventListener/.test(js) && !doc.querySelector('[onclick], [onsubmit]');
                  }
                ]
              ],
              solucao: `<style>
  .feita { text-decoration: line-through; color: #888; }
  #lista li { cursor: pointer; padding: 4px 0; }
</style>

<form id="nova">
  <label for="tarefa">Nova tarefa</label>
  <input id="tarefa" autocomplete="off">
  <button>Adicionar</button>
</form>
<ul id="lista"></ul>
<p id="contador">0 tarefas</p>

<script>
  const form = document.querySelector('#nova');
  const campo = document.querySelector('#tarefa');
  const lista = document.querySelector('#lista');
  const contador = document.querySelector('#contador');

  const atualizarContador = () => {
    const total = lista.children.length;
    contador.textContent = \`\${total} \${total === 1 ? 'tarefa' : 'tarefas'}\`;
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    const texto = campo.value.trim();
    if (!texto) return;
    const item = document.createElement('li');
    item.textContent = texto;
    lista.append(item);
    campo.value = '';
    atualizarContador();
  });

  lista.addEventListener('click', event => {
    event.target.closest('li')?.classList.toggle('feita');
  });
</script>`
            }
          ]
        },
        {
          titulo: 'Erros, tempo e dados',
          itens: [
            {
              id: 'erros-e-depuracao',
              titulo: 'Erros e depuração',
              resumo: 'Ler mensagens de erro, try/catch e lançar os próprios erros.',
              minutos: 10,
              corpo: `
<p>Todo código tem erros em algum momento. A diferença entre quem trava e quem resolve está em <strong>ler a mensagem</strong> e saber investigar.</p>

<h2>Os erros mais comuns</h2>
<ul>
  <li><strong>ReferenceError: x is not defined</strong>: você usou um nome que não existe. Quase sempre é erro de digitação ou a variável foi criada em outro escopo.</li>
  <li><strong>TypeError: Cannot read properties of null</strong>: você tentou usar algo que é <code>null</code> ou <code>undefined</code>. Muito comum com <code>querySelector</code> que não achou o elemento.</li>
  <li><strong>TypeError: x is not a function</strong>: você chamou com <code>()</code> algo que não é função.</li>
  <li><strong>SyntaxError</strong>: o código está mal escrito (um parêntese ou chave faltando) e nem começa a rodar.</li>
</ul>
${codigo(`<script>
  const botao = document.querySelector('#nao-existe');
  console.log(botao); // null: o seletor não achou nada
  botao.addEventListener('click', () => {}); // TypeError
</script>`)}

<h2>Investigando</h2>
<ul>
  <li>Espalhe <code>console.log</code> para ver o valor das variáveis em cada etapa.</li>
  <li>Nas ferramentas do navegador (<kbd>F12</kbd>), a aba <strong>Sources</strong> (ou Fontes) permite pausar o código numa linha e ver tudo naquele momento. Escrever <code>debugger;</code> no código faz o mesmo.</li>
  <li>Reduza o problema: comente partes até descobrir qual linha causa o erro.</li>
</ul>

<h2>try e catch</h2>
<p>Alguns erros são esperados: um texto que deveria ser JSON e não é, uma rede que caiu. Com <code>try...catch</code>, o programa trata o erro em vez de parar:</p>
${codigo(`<script>
  const texto = '{ nome: Ana }'; // JSON inválido: faltam aspas

  try {
    const dados = JSON.parse(texto);
    console.log(dados);
  } catch (erro) {
    console.log('Não consegui ler os dados:', erro.message);
  } finally {
    console.log('O finally roda sempre, com ou sem erro.');
  }
</script>`)}

<h2>Lançando os próprios erros</h2>
<p>Quando uma função recebe algo que não faz sentido, é melhor avisar com <code>throw</code> do que devolver um resultado errado em silêncio:</p>
${codigo(`<script>
  function dividir(a, b) {
    if (b === 0) throw new Error('Não dá para dividir por zero.');
    return a / b;
  }

  try {
    console.log(dividir(10, 2));
    console.log(dividir(1, 0));
  } catch (erro) {
    console.log(erro.message);
  }
</script>`)}
${dica('Não use <code>try...catch</code> para esconder erros. Um <code>catch</code> vazio faz o problema sumir da tela e continuar existindo. Trate o erro (mostre uma mensagem, tente de novo) ou deixe ele aparecer.')}
`,
              quiz: [
                {
                  pergunta: 'O que costuma causar "Cannot read properties of null" logo após um querySelector?',
                  opcoes: [
                    'O seletor não encontrou nenhum elemento',
                    'O navegador está desatualizado',
                    'Falta ponto e vírgula'
                  ],
                  certa: 0,
                  explicacao: 'querySelector devolve null quando não acha nada, e não dá para chamar métodos em null.'
                },
                {
                  pergunta: 'Quando o bloco finally é executado?',
                  opcoes: ['Só se houver erro', 'Só se não houver erro', 'Sempre'],
                  certa: 2,
                  explicacao: 'O finally roda em qualquer caso, o que é útil para esconder um "carregando...".'
                },
                {
                  pergunta: 'Qual é o problema de um catch vazio?',
                  opcoes: [
                    'Deixa o código mais lento',
                    'Esconde o erro, que continua acontecendo sem ninguém saber',
                    'Não compila'
                  ],
                  certa: 1,
                  explicacao: 'O erro some do console, mas o bug continua lá. Sempre faça algo no catch.'
                }
              ]
            },
            {
              id: 'assincrono',
              titulo: 'Código assíncrono',
              resumo: 'setTimeout, Promises e async/await: lidar com o que demora.',
              minutos: 12,
              corpo: `
<p>Algumas coisas demoram: buscar dados na internet, esperar um tempo, ler um arquivo. Se o JavaScript ficasse parado esperando, a página inteira congelaria. Em vez disso, ele <strong>agenda</strong> o que fazer depois e segue em frente.</p>

<h2>setTimeout</h2>
${codigo(`<script>
  console.log('1. Antes');
  setTimeout(() => console.log('3. Um segundo depois'), 1000);
  console.log('2. Depois do setTimeout');
</script>`)}
<p>Repare na ordem: o "2" aparece antes do "3", porque o <code>setTimeout</code> só agenda a função. <code>setInterval</code> repete de tempos em tempos, até ser parado com <code>clearInterval</code>.</p>

<h2>Promises</h2>
<p>Uma <strong>Promise</strong> é um objeto que representa um resultado que ainda vai chegar. Ela pode ser <strong>cumprida</strong> (deu certo, com um valor) ou <strong>rejeitada</strong> (deu errado, com um erro). Quase toda API moderna devolve Promises, como o <code>fetch</code>, que veremos na próxima aula.</p>
${codigo(`<script>
  function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  esperar(500)
    .then(() => console.log('Meio segundo depois'))
    .catch(erro => console.log('Deu errado:', erro));
</script>`)}

<h2>async e await</h2>
<p>Encadear <code>.then()</code> fica confuso quando há muitas etapas. Dentro de uma função marcada com <code>async</code>, o <code>await</code> "espera" a Promise e o código fica com cara de código normal, de cima para baixo. Os erros são tratados com o <code>try...catch</code> de sempre:</p>
${codigo(`<script>
  const esperar = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function preparar() {
    console.log('Fervendo a água...');
    await esperar(800);
    console.log('Passando o café...');
    await esperar(800);
    console.log('Café pronto ☕');
  }

  preparar();
  console.log('Enquanto isso, a página continua respondendo.');
</script>`)}
${dica('Uma função <code>async</code> sempre devolve uma Promise. Para usar o resultado dela em outra função, essa outra também precisa usar <code>await</code> (ou <code>.then</code>).')}

<h2>Várias coisas ao mesmo tempo</h2>
<p>Dois <code>await</code> seguidos esperam um depois do outro. Se as tarefas não dependem uma da outra, <code>Promise.all</code> roda todas juntas e espera a última:</p>
${trecho(`const [usuario, pedidos] = await Promise.all([
  buscarUsuario(id),
  buscarPedidos(id)
]);`)}
`,
              quiz: [
                {
                  pergunta:
                    "Em console.log('A'); setTimeout(() => console.log('B'), 0); console.log('C'); qual é a ordem?",
                  opcoes: ['A, B, C', 'A, C, B', 'B, A, C'],
                  certa: 1,
                  explicacao: 'Mesmo com 0 ms, o setTimeout só agenda. O código que já está rodando termina antes.'
                },
                {
                  pergunta: 'Onde é possível usar await?',
                  opcoes: [
                    'Em qualquer lugar',
                    'Dentro de funções async (e no topo de módulos)',
                    'Só dentro de setTimeout'
                  ],
                  certa: 1,
                  explicacao:
                    'await só funciona dentro de funções async ou no nível de cima de um script type="module".'
                },
                {
                  pergunta: 'Para que serve Promise.all?',
                  opcoes: [
                    'Esperar várias Promises que rodam ao mesmo tempo',
                    'Cancelar Promises',
                    'Transformar código síncrono em assíncrono'
                  ],
                  certa: 0,
                  explicacao: 'Ele inicia tudo junto e devolve os resultados na mesma ordem, economizando tempo.'
                }
              ]
            },
            {
              id: 'fetch-e-json',
              titulo: 'fetch e JSON',
              resumo: 'Buscar dados de uma API, tratar erros e mostrar o resultado na página.',
              minutos: 12,
              corpo: `
<p>Uma <strong>API</strong> é um endereço que devolve dados em vez de páginas. É assim que um site mostra a previsão do tempo, o endereço de um CEP ou os produtos de uma loja sem recarregar.</p>

<h2>JSON</h2>
<p>Os dados quase sempre chegam em <strong>JSON</strong>, um texto com o mesmo formato dos objetos e arrays do JavaScript (com as chaves sempre entre aspas duplas). Dois métodos convertem nos dois sentidos:</p>
${codigo(`<script>
  const texto = '{"nome":"Ana","linguagens":["JS","Python"]}';
  const objeto = JSON.parse(texto);  // texto → objeto
  console.log(objeto.linguagens[0]);

  const deVolta = JSON.stringify({ ok: true, total: 3 }); // objeto → texto
  console.log(deVolta);
</script>`)}

<h2>fetch</h2>
<p><code>fetch(endereço)</code> faz a requisição e devolve uma Promise com a resposta. <code>resposta.json()</code> lê o corpo e converte o JSON (também é uma Promise). Este exemplo consulta um CEP na API pública ViaCEP:</p>
${codigo(`<form id="busca">
  <label>CEP <input name="cep" value="01001000" inputmode="numeric"></label>
  <button>Buscar</button>
</form>
<p id="resultado" role="status"></p>

<script>
  const saida = document.querySelector('#resultado');

  async function buscarCep(cep) {
    saida.textContent = 'Buscando...';
    try {
      const resposta = await fetch(\`https://viacep.com.br/ws/\${cep}/json/\`);
      if (!resposta.ok) throw new Error(\`Erro \${resposta.status}\`);
      const dados = await resposta.json();
      if (dados.erro) throw new Error('CEP não encontrado.');
      saida.textContent = \`\${dados.logradouro}, \${dados.bairro} - \${dados.localidade}/\${dados.uf}\`;
    } catch (erro) {
      saida.textContent = \`Não deu: \${erro.message}\`;
    }
  }

  document.querySelector('#busca').addEventListener('submit', event => {
    event.preventDefault();
    const cep = new FormData(event.target).get('cep').replace(/[^0-9]/g, '');
    buscarCep(cep);
  });
</script>`)}

<h2>Os três cuidados de toda requisição</h2>
<ol>
  <li><strong>Mostre que está carregando.</strong> A rede pode levar segundos, e um botão que não reage parece quebrado.</li>
  <li><strong>Confira <code>resposta.ok</code>.</strong> O <code>fetch</code> só rejeita a Promise quando a rede falha. Um erro 404 ou 500 chega como resposta "normal", e é você quem precisa checar.</li>
  <li><strong>Trate o erro para a pessoa.</strong> Uma mensagem clara na tela, não só no console.</li>
</ol>

<h2>Enviando dados</h2>
${trecho(`await fetch('/api/pedidos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ produto: 12, quantidade: 2 })
});`)}
${dica('Nem toda API aceita ser chamada de qualquer site. Quando o navegador mostra um erro de <strong>CORS</strong>, é o servidor da API que não autorizou o seu domínio, e isso não se resolve no JavaScript da página.')}
`,
              quiz: [
                {
                  pergunta: 'O que JSON.parse faz?',
                  opcoes: [
                    'Transforma um objeto em texto',
                    'Transforma um texto JSON em objeto',
                    'Envia dados para uma API'
                  ],
                  certa: 1,
                  explicacao: 'parse lê o texto. stringify faz o caminho contrário.'
                },
                {
                  pergunta: 'O fetch rejeita a Promise quando o servidor responde 404?',
                  opcoes: ['Sim', 'Não: é preciso conferir resposta.ok', 'Só em POST'],
                  certa: 1,
                  explicacao:
                    'O fetch só falha sozinho quando não há resposta (sem rede, por exemplo). Códigos de erro precisam ser checados.'
                },
                {
                  pergunta: 'Por que mostrar um "Buscando..." durante a requisição?',
                  opcoes: [
                    'Porque o fetch exige',
                    'Para a pessoa saber que algo está acontecendo enquanto a rede responde',
                    'Para deixar a requisição mais rápida'
                  ],
                  certa: 1,
                  explicacao: 'Sem retorno visual, a pessoa clica de novo ou acha que o site quebrou.'
                }
              ]
            },
            {
              id: 'desafio-dados-da-api',
              tipo: 'desafio',
              titulo: 'Desafio: tratar dados de uma API',
              resumo: 'Leia JSON com segurança, valide pedidos e some os valores por cliente.',
              minutos: 20,
              enunciado: `
<p>Uma API de pedidos às vezes devolve dados quebrados. Escreva três funções que deixam o resto do sistema seguro:</p>
<ul>
  <li><code>lerPedidos(texto)</code>: converte o texto JSON num array. Se o texto for inválido ou não for um array, devolve <code>[]</code> em vez de dar erro.</li>
  <li><code>validarPedido(pedido)</code>: lança um <code>Error</code> (com mensagem) se o pedido não tiver <code>cliente</code> ou se o <code>valor</code> não for um número maior que zero. Se estiver tudo certo, devolve <code>true</code>.</li>
  <li><code>totalPorCliente(pedidos)</code>: devolve um objeto com o total de cada cliente, como <code>{ "Ana": 30, "Rui": 5 }</code>.</li>
</ul>`,
              inicial: `<script>
  const resposta = '[{"cliente":"Ana","valor":20},{"cliente":"Rui","valor":5},{"cliente":"Ana","valor":10}]';

  function lerPedidos(texto) {
  }

  function validarPedido(pedido) {
  }

  function totalPorCliente(pedidos) {
  }

  console.log(totalPorCliente(lerPedidos(resposta)));
</script>
`,
              testes: [
                [
                  'lerPedidos converte um JSON válido num array',
                  doc => {
                    const f = doc.defaultView.eval('typeof lerPedidos === "function" ? lerPedidos : null');
                    const r = f('[{"cliente":"Bia","valor":7}]');
                    return Array.isArray(r) && r.length === 1 && r[0].cliente === 'Bia';
                  }
                ],
                [
                  'lerPedidos devolve [] para texto inválido, sem dar erro',
                  doc => {
                    const f = doc.defaultView.eval('typeof lerPedidos === "function" ? lerPedidos : null');
                    const r = f('{quebrado');
                    return Array.isArray(r) && r.length === 0;
                  }
                ],
                [
                  'lerPedidos devolve [] quando o JSON não é um array',
                  doc => {
                    const f = doc.defaultView.eval('typeof lerPedidos === "function" ? lerPedidos : null');
                    const a = f('{"cliente":"Ana"}');
                    const b = f('null');
                    return Array.isArray(a) && a.length === 0 && Array.isArray(b) && b.length === 0;
                  }
                ],
                [
                  'validarPedido devolve true para um pedido certo',
                  doc => {
                    const f = doc.defaultView.eval('typeof validarPedido === "function" ? validarPedido : null');
                    return f({ cliente: 'Ana', valor: 12.5 }) === true;
                  }
                ],
                [
                  'validarPedido lança um Error com mensagem para pedidos errados',
                  doc => {
                    const f = doc.defaultView.eval('typeof validarPedido === "function" ? validarPedido : null');
                    const lancou = pedido => {
                      try {
                        f(pedido);
                        return false;
                      } catch (erro) {
                        return erro instanceof doc.defaultView.Error && erro.message.length > 0;
                      }
                    };
                    return (
                      lancou({ cliente: 'Ana', valor: 0 }) &&
                      lancou({ cliente: 'Ana', valor: -3 }) &&
                      lancou({ cliente: 'Ana', valor: '10' }) &&
                      lancou({ valor: 10 })
                    );
                  }
                ],
                [
                  'totalPorCliente soma os valores de cada cliente',
                  doc => {
                    const f = doc.defaultView.eval('typeof totalPorCliente === "function" ? totalPorCliente : null');
                    const r = f([
                      { cliente: 'Ana', valor: 20 },
                      { cliente: 'Rui', valor: 5 },
                      { cliente: 'Ana', valor: 10 }
                    ]);
                    return (
                      r.Ana === 30 && r.Rui === 5 && Object.keys(r).length === 2 && Object.keys(f([])).length === 0
                    );
                  }
                ]
              ],
              solucao: `<script>
  const resposta = '[{"cliente":"Ana","valor":20},{"cliente":"Rui","valor":5},{"cliente":"Ana","valor":10}]';

  function lerPedidos(texto) {
    try {
      const dados = JSON.parse(texto);
      return Array.isArray(dados) ? dados : [];
    } catch {
      return [];
    }
  }

  function validarPedido(pedido) {
    if (!pedido.cliente) throw new Error('O pedido não tem cliente.');
    if (typeof pedido.valor !== 'number' || pedido.valor <= 0) {
      throw new Error('O valor do pedido precisa ser um número maior que zero.');
    }
    return true;
  }

  function totalPorCliente(pedidos) {
    const totais = {};
    for (const pedido of pedidos) {
      totais[pedido.cliente] = (totais[pedido.cliente] ?? 0) + pedido.valor;
    }
    return totais;
  }

  console.log(totalPorCliente(lerPedidos(resposta)));
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'JavaScript moderno e organizado: desestruturação, closures e classes.',
      modulos: [
        {
          titulo: 'JavaScript moderno',
          itens: [
            {
              id: 'desestruturacao-e-spread',
              titulo: 'Desestruturação e spread',
              resumo: 'Tirar valores de objetos e arrays, copiar, juntar, ?. e ??.',
              minutos: 11,
              corpo: `
<p>O JavaScript moderno tem atalhos que deixam o código mais curto e mais claro. Você vai encontrá-los em todo código atual, especialmente em React.</p>

<h2>Desestruturação</h2>
<p>Tira valores de um objeto ou array direto para variáveis:</p>
${codigo(`<script>
  const usuario = { nome: 'Ana', idade: 29, cidade: 'Recife' };
  const { nome, cidade } = usuario;
  console.log(nome, cidade);

  const { idade: anos, plano = 'grátis' } = usuario; // renomear e valor padrão
  console.log(anos, plano);

  const [primeiro, segundo] = ['ouro', 'prata', 'bronze'];
  console.log(primeiro, segundo);
</script>`)}
<p>Funciona também nos parâmetros, o que deixa claro o que a função espera:</p>
${trecho(`function cartao({ nome, cargo = 'Sem cargo' }) {
  return \`\${nome} · \${cargo}\`;
}
cartao({ nome: 'Rui' }); // "Rui · Sem cargo"`)}

<h2>Spread: espalhar</h2>
<p>Os três pontos <code>...</code> espalham os itens de um array ou as propriedades de um objeto. É o jeito comum de copiar e juntar sem mudar o original:</p>
${codigo(`<script>
  const base = ['HTML', 'CSS'];
  const tudo = [...base, 'JavaScript'];
  console.log(base, tudo);

  const padrao = { tema: 'claro', fonte: 16 };
  const escolhas = { tema: 'escuro' };
  const config = { ...padrao, ...escolhas }; // o que vem depois vence
  console.log(config);

  console.log(Math.max(...[4, 9, 2]));
</script>`)}
${dica('A cópia com spread é <strong>rasa</strong>: objetos dentro do objeto continuam sendo os mesmos. Para uma cópia completa, use <code>structuredClone(objeto)</code>.')}

<h2>Rest: juntar o resto</h2>
<p>Os mesmos três pontos, do outro lado do sinal de igual, juntam "o resto":</p>
${codigo(`<script>
  const { senha, ...publico } = { nome: 'Ana', email: 'ana@ex.com', senha: '123' };
  console.log(publico); // sem a senha

  function somar(...numeros) {
    return numeros.reduce((a, b) => a + b, 0);
  }
  console.log(somar(1, 2, 3, 4));
</script>`)}

<h2>?. e ??</h2>
<ul>
  <li><code>a?.b</code> (encadeamento opcional): se <code>a</code> for <code>null</code> ou <code>undefined</code>, devolve <code>undefined</code> em vez de dar erro.</li>
  <li><code>a ?? b</code> (coalescência nula): usa <code>b</code> só se <code>a</code> for <code>null</code> ou <code>undefined</code>. Diferente do <code>||</code>, ele mantém <code>0</code> e <code>''</code>.</li>
</ul>
${codigo(`<script>
  const pedido = { cliente: { nome: 'Bia' }, desconto: 0 };
  console.log(pedido.entrega?.endereco);      // undefined, sem erro
  console.log(pedido.cliente?.nome);
  console.log(pedido.desconto || 10);         // 10: o || descartou o zero
  console.log(pedido.desconto ?? 10);         // 0: o ?? manteve
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'O que const { nome } = pessoa faz?',
                  opcoes: [
                    'Cria um objeto novo com a chave nome',
                    'Cria a variável nome com o valor de pessoa.nome',
                    'Apaga pessoa.nome'
                  ],
                  certa: 1,
                  explicacao: 'É o mesmo que const nome = pessoa.nome, só que mais curto.'
                },
                {
                  pergunta: 'Qual o resultado de { ...{ a: 1, b: 2 }, ...{ b: 3 } }?',
                  opcoes: ['{ a: 1, b: 2 }', '{ a: 1, b: 3 }', '{ b: 3 }'],
                  certa: 1,
                  explicacao: 'As propriedades se juntam e, quando repetem, a última vence.'
                },
                {
                  pergunta: 'Com quantidade = 0, quanto vale quantidade ?? 1?',
                  opcoes: ['0', '1', 'undefined'],
                  certa: 0,
                  explicacao: '?? só troca null e undefined. Com ||, o zero seria trocado por 1.'
                }
              ]
            },
            {
              id: 'escopo-e-closures',
              titulo: 'Escopo e closures',
              resumo: 'Onde cada variável existe e funções que lembram de onde nasceram.',
              minutos: 11,
              corpo: `
<h2>Escopo</h2>
<p><strong>Escopo</strong> é a região do código onde uma variável existe. Variáveis criadas com <code>let</code> e <code>const</code> só existem dentro do bloco <code>{ }</code> em que nasceram, e nos blocos de dentro dele.</p>
${codigo(`<script>
  const site = 'Portfólio'; // escopo global: vale em tudo

  function mostrar() {
    const secao = 'Projetos'; // só existe dentro de mostrar
    if (true) {
      const item = 'Pousada'; // só existe dentro do if
      console.log(site, secao, item);
    }
    console.log(typeof item); // "undefined": fora do bloco
  }
  mostrar();
</script>`)}
<p>Escopos pequenos são uma vantagem: menos nomes visíveis ao mesmo tempo significa menos chance de uma parte do código atrapalhar outra.</p>

<h2>Closures</h2>
<p>Uma função criada dentro de outra continua tendo acesso às variáveis de fora, <strong>mesmo depois que a função de fora terminou</strong>. Essa "memória" se chama <strong>closure</strong>.</p>
${codigo(`<script>
  function criarContador() {
    let valor = 0;
    return {
      somar: () => ++valor,
      zerar: () => (valor = 0)
    };
  }

  const visitas = criarContador();
  const cliques = criarContador();
  visitas.somar();
  visitas.somar();
  cliques.somar();
  console.log(visitas.somar()); // 3
  console.log(cliques.somar()); // 2: cada contador tem o seu valor
</script>`)}
<p>Ninguém de fora consegue mexer em <code>valor</code> diretamente: só pelas funções que o contador devolveu. É um jeito de ter <strong>dados privados</strong>.</p>

<h2>Closures no dia a dia</h2>
<p>Você já usou closures sem perceber: toda função passada para <code>addEventListener</code> ou <code>setTimeout</code> lembra das variáveis de onde foi criada. Um caso clássico é o <em>debounce</em>, que só executa uma função quando a pessoa para de digitar:</p>
${codigo(`<label>Buscar <input id="busca"></label>
<script>
  function debounce(funcao, ms) {
    let espera;
    return (...args) => {
      clearTimeout(espera);
      espera = setTimeout(() => funcao(...args), ms);
    };
  }

  const buscar = debounce(texto => console.log('Buscando por', texto), 400);
  document.querySelector('#busca').addEventListener('input', e => buscar(e.target.value));
</script>`)}
${dica('O laço <code>for (let i = 0; ...)</code> cria um <code>i</code> novo a cada volta, e cada closure guarda o seu. Com o antigo <code>var</code>, todas compartilhavam o mesmo, e esse era um dos bugs mais famosos do JavaScript.')}
`,
              quiz: [
                {
                  pergunta: 'Uma const criada dentro de um if existe depois do if?',
                  opcoes: ['Sim', 'Não, só dentro do bloco', 'Só se for um número'],
                  certa: 1,
                  explicacao: 'let e const têm escopo de bloco: somem quando o bloco termina.'
                },
                {
                  pergunta: 'O que é uma closure?',
                  opcoes: [
                    'Uma função que fecha a página',
                    'Uma função que lembra das variáveis do lugar onde foi criada',
                    'Um bloco try/catch'
                  ],
                  certa: 1,
                  explicacao:
                    'A função interna mantém acesso ao escopo de fora, mesmo depois que ele terminou de rodar.'
                },
                {
                  pergunta: 'No exemplo criarContador, por que visitas e cliques não se misturam?',
                  opcoes: [
                    'Cada chamada de criarContador cria um novo valor, guardado pela sua closure',
                    'Porque usam const',
                    'Porque estão em linhas diferentes'
                  ],
                  certa: 0,
                  explicacao: 'Cada chamada cria um escopo novo, com o seu próprio valor.'
                }
              ]
            },
            {
              id: 'classes',
              titulo: 'Classes',
              resumo: 'Moldes de objetos com constructor, métodos, getters e campos privados.',
              minutos: 12,
              corpo: `
<p>Quando você precisa de vários objetos com a mesma forma e o mesmo comportamento (vários produtos, vários usuários, várias contas), uma <strong>classe</strong> funciona como um molde. Cada objeto criado a partir dela é uma <strong>instância</strong>.</p>
${codigo(`<script>
  class Conta {
    constructor(titular, saldoInicial = 0) {
      this.titular = titular;
      this.saldo = saldoInicial;
    }

    depositar(valor) {
      this.saldo += valor;
    }

    sacar(valor) {
      if (valor > this.saldo) throw new Error('Saldo insuficiente.');
      this.saldo -= valor;
    }
  }

  const conta = new Conta('Ana', 100);
  conta.depositar(50);
  conta.sacar(30);
  console.log(conta.titular, conta.saldo);
</script>`)}
<ul>
  <li><code>constructor</code> roda ao criar a instância com <code>new</code> e prepara os dados.</li>
  <li><code>this</code> é a instância que está sendo usada.</li>
  <li>Os métodos são compartilhados por todas as instâncias.</li>
</ul>

<h2>Campos privados e getters</h2>
<p>No exemplo acima, qualquer um pode escrever <code>conta.saldo = 1000000</code>. Um campo com <code>#</code> na frente só pode ser usado dentro da classe. E um <code>get</code> é um método que se lê como propriedade:</p>
${codigo(`<script>
  class Conta {
    #saldo = 0;
    #extrato = [];

    depositar(valor) {
      if (valor <= 0) throw new Error('Valor inválido.');
      this.#saldo += valor;
      this.#extrato.push({ tipo: 'depósito', valor });
    }

    get saldo() {
      return this.#saldo;
    }

    get extrato() {
      return [...this.#extrato]; // uma cópia: quem recebe não altera o original
    }
  }

  const conta = new Conta();
  conta.depositar(80);
  console.log(conta.saldo);   // 80, sem parênteses
  conta.saldo = 1000000;      // ignorado: só existe o get
  console.log(conta.saldo);
</script>`)}

<h2>Herança</h2>
<p><code>extends</code> cria uma classe a partir de outra, e <code>super</code> chama o que existe na classe de cima:</p>
${trecho(`class ContaPoupanca extends Conta {
  renderJuros(taxa) {
    this.depositar(this.saldo * taxa);
  }
}`)}
${dica('Herança parece elegante, mas cadeias longas ficam difíceis de entender. Na maior parte do tempo, funções e objetos simples resolvem; use classes quando houver estado com regras para protegê-lo.')}
`,
              quiz: [
                {
                  pergunta: 'Quando o constructor de uma classe é executado?',
                  opcoes: ['Ao declarar a classe', 'Ao criar uma instância com new', 'Ao chamar qualquer método'],
                  certa: 1,
                  explicacao: 'new Conta(...) cria o objeto e roda o constructor para preparar os dados.'
                },
                {
                  pergunta: 'O que o # na frente de um campo faz?',
                  opcoes: ['Torna o campo privado à classe', 'Transforma o campo num número', 'Torna o campo estático'],
                  certa: 0,
                  explicacao: 'Campos com # só podem ser lidos e escritos de dentro da própria classe.'
                },
                {
                  pergunta: 'Por que o getter extrato devolve [...this.#extrato] em vez de this.#extrato?',
                  opcoes: [
                    'Para deixar mais rápido',
                    'Para quem recebe não conseguir mudar a lista interna',
                    'Porque getters só devolvem arrays novos'
                  ],
                  certa: 1,
                  explicacao:
                    'Devolver o próprio array deixaria qualquer um fazer push nele, contornando as regras da classe.'
                }
              ]
            },
            {
              id: 'desafio-carrinho',
              tipo: 'desafio',
              titulo: 'Desafio: carrinho de compras',
              resumo: 'Escreva uma classe com estado privado, regras e getters.',
              minutos: 30,
              enunciado: `
<p>Escreva a classe <code>Carrinho</code> de uma loja. Cada produto é um objeto com <code>id</code>, <code>nome</code> e <code>preco</code>. A classe precisa:</p>
<ul>
  <li><code>adicionar(produto, quantidade = 1)</code>: acrescenta o produto. Se ele já estiver no carrinho, soma a quantidade em vez de repetir o item. Quantidade menor que 1 lança um <code>Error</code>.</li>
  <li><code>remover(id)</code>: tira o produto do carrinho.</li>
  <li><code>get total</code>: soma de preço × quantidade.</li>
  <li><code>get quantidade</code>: quantas unidades há no total.</li>
  <li><code>get itens</code>: uma <strong>cópia</strong> da lista, com objetos <code>{ produto, quantidade }</code>.</li>
</ul>
<p>Guarde a lista num campo privado (<code>#</code>), para que ninguém mexa nela de fora.</p>`,
              inicial: `<script>
  class Carrinho {
    // Escreva a classe aqui
  }

  const carrinho = new Carrinho();
  carrinho.adicionar?.({ id: 1, nome: 'Caneca', preco: 35 }, 2);
  console.log(carrinho.total);
</script>
`,
              testes: [
                [
                  'Um carrinho novo começa vazio (total 0, quantidade 0)',
                  doc => {
                    const C = doc.defaultView.eval('typeof Carrinho === "function" ? Carrinho : null');
                    const c = new C();
                    return c.total === 0 && c.quantidade === 0 && Array.isArray(c.itens) && c.itens.length === 0;
                  }
                ],
                [
                  'adicionar soma no total (preço × quantidade)',
                  doc => {
                    const C = doc.defaultView.eval('typeof Carrinho === "function" ? Carrinho : null');
                    const c = new C();
                    c.adicionar({ id: 1, nome: 'Caneca', preco: 10 }, 2);
                    c.adicionar({ id: 2, nome: 'Café', preco: 5.5 });
                    return Math.abs(c.total - 25.5) < 0.001 && c.quantidade === 3;
                  }
                ],
                [
                  'Adicionar o mesmo produto soma a quantidade, sem repetir o item',
                  doc => {
                    const C = doc.defaultView.eval('typeof Carrinho === "function" ? Carrinho : null');
                    const c = new C();
                    c.adicionar({ id: 7, nome: 'Livro', preco: 40 });
                    c.adicionar({ id: 7, nome: 'Livro', preco: 40 }, 2);
                    return c.itens.length === 1 && c.itens[0].quantidade === 3 && c.quantidade === 3;
                  }
                ],
                [
                  'remover tira o produto do carrinho',
                  doc => {
                    const C = doc.defaultView.eval('typeof Carrinho === "function" ? Carrinho : null');
                    const c = new C();
                    c.adicionar({ id: 1, nome: 'A', preco: 10 });
                    c.adicionar({ id: 2, nome: 'B', preco: 20 });
                    c.remover(1);
                    return c.itens.length === 1 && c.itens[0].produto.id === 2 && c.total === 20;
                  }
                ],
                [
                  'Quantidade menor que 1 lança um Error',
                  doc => {
                    const C = doc.defaultView.eval('typeof Carrinho === "function" ? Carrinho : null');
                    const c = new C();
                    try {
                      c.adicionar({ id: 1, nome: 'A', preco: 10 }, 0);
                      return false;
                    } catch (erro) {
                      return erro instanceof doc.defaultView.Error && c.quantidade === 0;
                    }
                  }
                ],
                [
                  'itens devolve uma cópia: mudar a lista de fora não muda o carrinho',
                  doc => {
                    const C = doc.defaultView.eval('typeof Carrinho === "function" ? Carrinho : null');
                    const c = new C();
                    c.adicionar({ id: 1, nome: 'A', preco: 10 });
                    const lista = c.itens;
                    lista.push({ produto: { id: 9, nome: 'Intruso', preco: 999 }, quantidade: 1 });
                    lista.length = 0;
                    return c.itens.length === 1 && c.total === 10;
                  }
                ],
                [
                  'Guardar a lista num campo privado (#)',
                  doc => {
                    const C = doc.defaultView.eval('typeof Carrinho === "function" ? Carrinho : null');
                    const c = new C();
                    c.adicionar({ id: 1, nome: 'A', preco: 10 });
                    const js = [...doc.querySelectorAll('script:not([data-base])')].map(s => s.textContent).join('\n');
                    return /#[A-Za-z_]\w*\s*(=|;)/.test(js) && Object.keys(c).length === 0;
                  }
                ]
              ],
              solucao: `<script>
  class Carrinho {
    #itens = [];

    adicionar(produto, quantidade = 1) {
      if (quantidade < 1) throw new Error('A quantidade precisa ser pelo menos 1.');
      const existente = this.#itens.find(item => item.produto.id === produto.id);
      if (existente) {
        existente.quantidade += quantidade;
      } else {
        this.#itens.push({ produto, quantidade });
      }
    }

    remover(id) {
      this.#itens = this.#itens.filter(item => item.produto.id !== id);
    }

    get total() {
      return this.#itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
    }

    get quantidade() {
      return this.#itens.reduce((soma, item) => soma + item.quantidade, 0);
    }

    get itens() {
      return this.#itens.map(item => ({ ...item }));
    }
  }

  const carrinho = new Carrinho();
  carrinho.adicionar({ id: 1, nome: 'Caneca', preco: 35 }, 2);
  console.log(carrinho.total);
</script>`
            }
          ]
        }
      ]
    }
  ]
};
