// Trilha de HTML: níveis (iniciante, intermediário e avançado), cada um com módulos, aulas (com quiz) e desafios
// (com testes que conferem o código).
// Depois de editar, rode `node ferramentas/gerar-estudos.js` para gerar as páginas em estudos/html/.
const { codigo, dica } = require('./ajuda');

module.exports = {
  id: 'html',
  area: 'Desenvolvimento web',
  titulo: 'HTML',
  sigla: 'HTML',
  resumo: 'A estrutura de toda página da web: textos, links, imagens, semântica, tabelas e formulários.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Do zero: a estrutura de uma página, textos, links, imagens, semântica e acessibilidade básica.',
      modulos: [
        {
          titulo: 'Primeiros passos',
          itens: [
            {
              id: 'o-que-e-html',
              titulo: 'O que é HTML',
              resumo: 'Tags, elementos, atributos e o esqueleto de toda página.',
              minutos: 8,
              corpo: `
<p>HTML (<em>HyperText Markup Language</em>) é a linguagem que descreve o <strong>conteúdo e a estrutura</strong> de uma página: o que é título, o que é parágrafo, onde há um link ou uma imagem. Ele não cuida da aparência (isso é com o CSS) nem do comportamento (isso é com o JavaScript).</p>

<h2>Tags e elementos</h2>
<p>O HTML marca cada pedaço do conteúdo com <strong>tags</strong>. A maioria vem em par: uma de abertura e uma de fechamento, com uma barra. Tudo junto (abertura, conteúdo e fechamento) forma um <strong>elemento</strong>.</p>
${codigo(`<p>Este é um parágrafo.</p>`)}
<p>Alguns elementos não têm conteúdo e, por isso, não têm tag de fechamento. São os chamados elementos vazios, como a quebra de linha <code>&lt;br&gt;</code> e a imagem <code>&lt;img&gt;</code>.</p>

<h2>Atributos</h2>
<p>Atributos ficam dentro da tag de abertura e dão informações extras ao elemento, sempre no formato <code>nome="valor"</code>.</p>
${codigo(`<a href="https://developer.mozilla.org">Documentação da MDN</a>`)}
<p>Aqui, <code>href</code> diz para onde o link leva. Cada elemento tem seus atributos próprios, e alguns, como <code>id</code>, <code>class</code> e <code>lang</code>, valem para qualquer um.</p>

<h2>O esqueleto da página</h2>
<p>Todo documento HTML segue a mesma estrutura básica:</p>
${codigo(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Minha primeira página</title>
  </head>
  <body>
    <h1>Olá, mundo!</h1>
    <p>Esta é a minha primeira página.</p>
  </body>
</html>`)}
<ul>
  <li><code>&lt;!doctype html&gt;</code> avisa o navegador que a página usa o HTML atual.</li>
  <li><code>&lt;html lang="pt-BR"&gt;</code> envolve tudo e informa o idioma, o que ajuda leitores de tela e o Google.</li>
  <li><code>&lt;head&gt;</code> guarda informações sobre a página que não aparecem nela: a codificação de caracteres, o título da aba e a configuração para celular.</li>
  <li><code>&lt;body&gt;</code> guarda tudo o que aparece na tela.</li>
</ul>
${dica('A linha <code>meta name="viewport"</code> é o que faz a página se ajustar à largura do celular. Sem ela, o celular mostra a página como se fosse uma tela de computador, bem pequena.')}

<h2>Aninhamento</h2>
<p>Elementos ficam uns dentro dos outros, e o que abre por último fecha primeiro. Indentar o código (recuar as linhas de dentro) deixa essa hierarquia fácil de enxergar.</p>
${codigo(`<p>Isto é <strong>muito importante</strong>.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Qual é o papel do HTML numa página?',
                  opcoes: [
                    'Definir as cores e o layout',
                    'Descrever o conteúdo e a estrutura',
                    'Controlar o que acontece ao clicar'
                  ],
                  certa: 1,
                  explicacao:
                    'O HTML descreve o que cada parte é. Aparência é papel do CSS e comportamento, do JavaScript.'
                },
                {
                  pergunta: 'Onde fica o título que aparece na aba do navegador?',
                  opcoes: ['No <h1>, dentro do <body>', 'No <title>, dentro do <head>', 'No atributo lang do <html>'],
                  certa: 1,
                  explicacao: 'O <title> fica no <head>. O <h1> é o título visível dentro da página, que é outra coisa.'
                },
                {
                  pergunta: 'Em <a href="contato.html">Fale comigo</a>, o que é href?',
                  opcoes: ['Uma tag', 'Um atributo', 'O conteúdo do elemento'],
                  certa: 1,
                  explicacao: 'href é um atributo da tag <a>: fica na abertura, no formato nome="valor".'
                }
              ]
            },
            {
              id: 'textos-e-listas',
              titulo: 'Textos e listas',
              resumo: 'Títulos, parágrafos, ênfase e listas ordenadas e não ordenadas.',
              minutos: 7,
              corpo: `
<h2>Títulos</h2>
<p>Existem seis níveis de título, de <code>&lt;h1&gt;</code> (o mais importante) a <code>&lt;h6&gt;</code>. Eles formam o sumário da página: o <code>h1</code> é o assunto principal, cada <code>h2</code> é uma seção, cada <code>h3</code> é uma parte de uma seção, e assim por diante.</p>
${codigo(`<h1>Receitas da vó</h1>
<h2>Bolos</h2>
<h3>Bolo de cenoura</h3>
<h3>Bolo de fubá</h3>
<h2>Doces</h2>`)}
${dica('Escolha o nível pelo lugar na hierarquia, não pelo tamanho da letra. O tamanho se ajusta depois, com CSS. Pular níveis (de h2 direto para h4) atrapalha quem navega por leitor de tela.')}

<h2>Parágrafos e ênfase</h2>
<p>Cada bloco de texto vai num <code>&lt;p&gt;</code>. O navegador ignora quebras de linha e espaços repetidos no código: quem separa os blocos são as tags.</p>
<ul>
  <li><code>&lt;strong&gt;</code> marca algo como importante (aparece em negrito).</li>
  <li><code>&lt;em&gt;</code> dá ênfase, como uma mudança na entonação (aparece em itálico).</li>
  <li><code>&lt;br&gt;</code> quebra a linha dentro do mesmo bloco, útil em endereços e poemas. Não use para separar parágrafos.</li>
</ul>
${codigo(`<p>O prazo é <strong>sexta-feira</strong>, e eu <em>realmente</em> preciso de ajuda.</p>
<p>Rua das Flores, 123<br>Centro</p>`)}

<h2>Listas</h2>
<p>Use <code>&lt;ul&gt;</code> quando a ordem não importa e <code>&lt;ol&gt;</code> quando importa, como num passo a passo. Cada item vai num <code>&lt;li&gt;</code>.</p>
${codigo(`<h2>Ingredientes</h2>
<ul>
  <li>3 cenouras</li>
  <li>4 ovos</li>
  <li>2 xícaras de açúcar</li>
</ul>

<h2>Modo de preparo</h2>
<ol>
  <li>Bata as cenouras com os ovos.</li>
  <li>Misture o açúcar.</li>
  <li>Asse por 40 minutos.</li>
</ol>`)}
<p>Listas podem ficar umas dentro das outras: basta colocar uma nova <code>&lt;ul&gt;</code> ou <code>&lt;ol&gt;</code> dentro de um <code>&lt;li&gt;</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'Como escolher entre <h2> e <h3>?',
                  opcoes: ['Pelo tamanho de letra que eu quero', 'Pela posição na hierarquia do conteúdo', 'Tanto faz'],
                  certa: 1,
                  explicacao: 'Títulos formam o sumário da página. O tamanho visual se ajusta com CSS.'
                },
                {
                  pergunta: 'Qual lista usar para o passo a passo de uma instalação?',
                  opcoes: ['<ul>', '<ol>', 'Vários <p>'],
                  certa: 1,
                  explicacao: 'Num passo a passo a ordem importa, então a lista é ordenada: <ol>.'
                },
                {
                  pergunta: 'Qual é a forma certa de separar dois parágrafos?',
                  opcoes: ['Dois <br> seguidos', 'Um <p> para cada um', 'Uma linha em branco no código'],
                  certa: 1,
                  explicacao:
                    'Cada bloco de texto é um <p>. O navegador ignora linhas em branco no código, e <br> serve só para quebrar a linha dentro de um mesmo bloco.'
                }
              ]
            },
            {
              id: 'links-e-imagens',
              titulo: 'Links e imagens',
              resumo: 'Como ligar páginas, abrir sites externos e mostrar imagens com acessibilidade.',
              minutos: 8,
              corpo: `
<h2>Links</h2>
<p>O elemento <code>&lt;a&gt;</code> (de <em>anchor</em>, âncora) cria um link. O destino vai no atributo <code>href</code>, e o texto entre as tags é o que a pessoa clica.</p>
${codigo(`<a href="https://www.wikipedia.org">Wikipédia</a>
<a href="sobre.html">Sobre mim</a>
<a href="#contato">Ir para o contato</a>
<a href="mailto:voce@exemplo.com">Mande um e-mail</a>`)}
<ul>
  <li><strong>Endereço completo</strong> (com <code>https://</code>): leva a outro site.</li>
  <li><strong>Caminho relativo</strong> (<code>sobre.html</code>, <code>../index.html</code>): leva a uma página do mesmo site, a partir da pasta atual. <code>..</code> quer dizer "a pasta de cima".</li>
  <li><strong>#id</strong>: leva a um elemento da própria página que tenha aquele <code>id</code>.</li>
  <li><strong>mailto:</strong> abre o programa de e-mail.</li>
</ul>
<p>Para abrir em outra aba, use <code>target="_blank"</code> junto com <code>rel="noreferrer"</code>, que impede o site aberto de controlar a sua aba.</p>
${codigo(`<a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>`)}
${dica('Escreva o texto do link dizendo para onde ele leva. "Clique aqui" não ajuda quem usa leitor de tela, que costuma ouvir a lista de links da página fora de contexto.')}

<h2>Imagens</h2>
<p>A imagem é um elemento vazio: <code>&lt;img&gt;</code> não tem fechamento. Dois atributos são essenciais:</p>
<ul>
  <li><code>src</code>: o endereço da imagem.</li>
  <li><code>alt</code>: um texto que descreve a imagem. Ele é lido por leitores de tela, aparece se a imagem não carregar e ajuda o Google a entender a página.</li>
</ul>
${codigo(`<img src="https://picsum.photos/id/1025/400/260" alt="Cachorro da raça pug enrolado num cobertor" width="400" height="260">`)}
<p>Informar <code>width</code> e <code>height</code> reserva o espaço da imagem antes de ela carregar, e assim o texto não "pula" na tela. Se a imagem for só decoração, use <code>alt=""</code> (vazio), para o leitor de tela pular.</p>

<h2>Imagem com link</h2>
<p>Dá para colocar uma imagem dentro de um link. Nesse caso, o <code>alt</code> deve dizer para onde o link leva.</p>
${codigo(`<a href="index.html">
  <img src="https://picsum.photos/id/1062/120/80" alt="Página inicial" width="120" height="80">
</a>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o atributo alt de uma imagem?',
                  opcoes: [
                    'Definir o tamanho da imagem',
                    'Descrever a imagem para quem não pode vê-la',
                    'Mostrar uma legenda embaixo da imagem'
                  ],
                  certa: 1,
                  explicacao:
                    'O alt é lido por leitores de tela e aparece se a imagem falhar. Para legenda visível existe o <figcaption>.'
                },
                {
                  pergunta:
                    'Você está em blog/post.html e quer um link para index.html, que fica na pasta de cima. Qual href?',
                  opcoes: ['index.html', '../index.html', '/blog/index.html'],
                  certa: 1,
                  explicacao: '.. sobe uma pasta. Só "index.html" procuraria dentro da própria pasta blog/.'
                },
                {
                  pergunta: 'O que fazer com o alt de uma imagem puramente decorativa?',
                  opcoes: ['Deixar vazio: alt=""', 'Escrever "imagem"', 'Apagar o atributo'],
                  certa: 0,
                  explicacao:
                    'alt vazio avisa que a imagem não traz informação, e o leitor de tela pula. Sem o atributo, alguns leitores leem o nome do arquivo.'
                }
              ]
            },
            {
              id: 'desafio-sobre-mim',
              tipo: 'desafio',
              titulo: 'Desafio: página "Sobre mim"',
              resumo: 'Junte tudo do módulo numa pequena página de apresentação.',
              minutos: 15,
              enunciado: `
<p>Monte uma página de apresentação com o que você viu neste módulo. O código começa quase vazio: escreva no editor e veja o resultado ao lado. Cada item da lista fica verde quando estiver certo.</p>`,
              inicial: `<h1>Seu nome aqui</h1>
`,
              testes: [
                ['Ter exatamente um título principal <h1>', doc => doc.querySelectorAll('h1').length === 1],
                [
                  'Ter pelo menos um parágrafo <p> com texto',
                  doc => [...doc.querySelectorAll('p')].some(p => p.textContent.trim().length > 0)
                ],
                ['Usar <strong> ou <em> para destacar algo', doc => !!doc.querySelector('strong, em')],
                [
                  'Ter uma lista (<ul> ou <ol>) com pelo menos 3 itens',
                  doc => [...doc.querySelectorAll('ul, ol')].some(l => l.querySelectorAll(':scope > li').length >= 3)
                ],
                [
                  'Ter um link com href e texto',
                  doc => [...doc.querySelectorAll('a[href]')].some(a => a.textContent.trim().length > 0)
                ],
                [
                  'Ter uma imagem com alt preenchido',
                  doc => [...doc.querySelectorAll('img')].some(i => (i.getAttribute('alt') || '').trim().length > 0)
                ]
              ],
              solucao: `<h1>Ana Souza</h1>
<p>Sou estudante e estou aprendendo <strong>HTML</strong>.</p>
<img src="https://picsum.photos/id/64/200/200" alt="Foto de Ana sorrindo" width="200" height="200">
<h2>Coisas de que eu gosto</h2>
<ul>
  <li>Programar</li>
  <li>Ler</li>
  <li>Andar de bicicleta</li>
</ul>
<p>Veja meus projetos no <a href="https://github.com">GitHub</a>.</p>`
            }
          ]
        },
        {
          titulo: 'Estrutura e semântica',
          itens: [
            {
              id: 'html-semantico',
              titulo: 'HTML semântico',
              resumo: 'header, nav, main, section, article, aside e footer: dar sentido à estrutura.',
              minutos: 9,
              corpo: `
<p>Dá para montar uma página inteira só com <code>&lt;div&gt;</code>, um elemento genérico, sem significado. Mas o navegador, o Google e os leitores de tela entendem muito melhor a página quando cada parte usa o elemento que diz o que ela é. Isso é HTML <strong>semântico</strong>.</p>

<h2>Os elementos de estrutura</h2>
<ul>
  <li><code>&lt;header&gt;</code>: o cabeçalho, com logo e, muitas vezes, o menu.</li>
  <li><code>&lt;nav&gt;</code>: um bloco de links de navegação.</li>
  <li><code>&lt;main&gt;</code>: o conteúdo principal. Só um por página.</li>
  <li><code>&lt;section&gt;</code>: uma seção temática, normalmente com um título.</li>
  <li><code>&lt;article&gt;</code>: um conteúdo que faz sentido sozinho, como um post, uma notícia ou um produto.</li>
  <li><code>&lt;aside&gt;</code>: um conteúdo complementar, como uma barra lateral.</li>
  <li><code>&lt;footer&gt;</code>: o rodapé, da página ou de um artigo.</li>
</ul>
${codigo(`<header>
  <strong>Meu Blog</strong>
  <nav>
    <a href="#">Início</a>
    <a href="#">Sobre</a>
  </nav>
</header>

<main>
  <article>
    <h1>Aprendendo HTML semântico</h1>
    <p>Hoje eu aprendi a estruturar uma página...</p>
  </article>

  <aside>
    <h2>Posts recentes</h2>
    <ul>
      <li><a href="#">Meu primeiro site</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>Feito por mim, 2026.</p>
</footer>`)}

<h2>E a div, quando usar?</h2>
<p>A <code>&lt;div&gt;</code> continua útil quando nenhum elemento semântico se encaixa, normalmente para agrupar coisas só por causa do layout. O mesmo vale para o <code>&lt;span&gt;</code>, a versão para pedaços de texto dentro de uma linha.</p>
${dica('Uma boa pergunta: "se eu tirasse todo o CSS, essa parte ainda faria sentido com esse nome?". Se sim, provavelmente existe um elemento semântico para ela.')}

<h2>Por que vale a pena</h2>
<ul>
  <li>Leitores de tela deixam a pessoa pular direto para o <code>main</code> ou para a navegação.</li>
  <li>O Google entende melhor o que é conteúdo principal e o que é menu ou rodapé.</li>
  <li>O código fica mais fácil de ler: <code>&lt;/nav&gt;</code> diz muito mais que o quinto <code>&lt;/div&gt;</code> seguido.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Quantos <main> uma página deve ter?',
                  opcoes: ['Um', 'Um por seção', 'Quantos quiser'],
                  certa: 0,
                  explicacao: 'O <main> marca o conteúdo principal, e cada página tem um só (visível).'
                },
                {
                  pergunta: 'Qual elemento combina com um post de blog, que faz sentido sozinho?',
                  opcoes: ['<section>', '<article>', '<div>'],
                  certa: 1,
                  explicacao: '<article> é para conteúdo independente, que poderia ser publicado sozinho.'
                },
                {
                  pergunta: 'Quando faz sentido usar <div>?',
                  opcoes: [
                    'Sempre, é o mais comum',
                    'Quando nenhum elemento semântico se encaixa',
                    'Nunca, está ultrapassada'
                  ],
                  certa: 1,
                  explicacao:
                    'A <div> não está proibida: ela é a escolha certa para agrupar coisas só por causa do layout.'
                }
              ]
            },
            {
              id: 'tabelas',
              titulo: 'Tabelas',
              resumo: 'table, thead, tbody, tr, th e td para dados em linhas e colunas.',
              minutos: 7,
              corpo: `
<p>Tabelas servem para <strong>dados tabulares</strong>: informações que fazem sentido em linhas e colunas, como horários, preços ou notas. Elas não devem ser usadas para montar o layout da página, como se fazia nos anos 2000.</p>

<h2>A estrutura</h2>
${codigo(`<table>
  <caption>Notas do bimestre</caption>
  <thead>
    <tr>
      <th scope="col">Aluno</th>
      <th scope="col">Nota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Ana</th>
      <td>9,5</td>
    </tr>
    <tr>
      <th scope="row">Bruno</th>
      <td>8,0</td>
    </tr>
  </tbody>
</table>`)}
<ul>
  <li><code>&lt;table&gt;</code> envolve tudo.</li>
  <li><code>&lt;caption&gt;</code> é o título da tabela.</li>
  <li><code>&lt;thead&gt;</code> agrupa a linha de cabeçalho, e <code>&lt;tbody&gt;</code>, as linhas de dados.</li>
  <li><code>&lt;tr&gt;</code> é uma linha (<em>table row</em>).</li>
  <li><code>&lt;th&gt;</code> é uma célula de cabeçalho, e <code>&lt;td&gt;</code>, uma célula de dado.</li>
</ul>

<h2>O atributo scope</h2>
<p><code>scope="col"</code> diz que o cabeçalho vale para a coluna, e <code>scope="row"</code>, para a linha. Com isso, o leitor de tela consegue anunciar "Ana, Nota: 9,5" em vez de ler números soltos.</p>

<h2>Juntando células</h2>
<p><code>colspan</code> faz uma célula ocupar várias colunas, e <code>rowspan</code>, várias linhas.</p>
${codigo(`<table>
  <tr>
    <th colspan="2">Horário de funcionamento</th>
  </tr>
  <tr>
    <td>Segunda a sexta</td>
    <td>9h às 18h</td>
  </tr>
  <tr>
    <td>Sábado</td>
    <td>9h às 13h</td>
  </tr>
</table>`)}
${dica('Sem CSS, a tabela aparece sem bordas. É normal: a aparência fica para o CSS.')}
`,
              quiz: [
                {
                  pergunta: 'Qual é a diferença entre <th> e <td>?',
                  opcoes: [
                    '<th> é uma célula de cabeçalho; <td>, de dado',
                    '<th> é uma linha; <td>, uma coluna',
                    'Nenhuma, só muda o negrito'
                  ],
                  certa: 0,
                  explicacao: '<th> identifica o que a linha ou coluna significa; <td> guarda o valor.'
                },
                {
                  pergunta: 'Tabela é uma boa forma de montar o layout da página em colunas?',
                  opcoes: ['Sim, é o jeito mais fácil', 'Não, tabela é para dados; layout é com CSS', 'Só no celular'],
                  certa: 1,
                  explicacao:
                    'Tabelas de layout confundem leitores de tela e são difíceis de adaptar ao celular. Para layout existem flexbox e grid, no CSS.'
                },
                {
                  pergunta: 'Para que serve scope="col" num <th>?',
                  opcoes: [
                    'Deixar a coluna mais larga',
                    'Dizer que aquele cabeçalho vale para a coluna',
                    'Juntar duas colunas'
                  ],
                  certa: 1,
                  explicacao:
                    'scope liga o cabeçalho às suas células, e assim o leitor de tela anuncia cada valor com o nome certo. Para juntar colunas existe o colspan.'
                }
              ]
            },
            {
              id: 'acessibilidade',
              titulo: 'Acessibilidade no HTML',
              resumo: 'O que todo HTML deveria ter para funcionar com teclado e leitor de tela.',
              minutos: 8,
              corpo: `
<p>Acessibilidade é fazer a página funcionar para todo mundo: quem usa leitor de tela, quem navega só pelo teclado, quem tem baixa visão ou está no celular, debaixo do sol. A maior parte dela começa no HTML, e de graça, só por usar os elementos certos.</p>

<h2>O básico que faz diferença</h2>
<ul>
  <li><strong>Idioma</strong>: <code>&lt;html lang="pt-BR"&gt;</code> faz o leitor de tela usar a pronúncia certa.</li>
  <li><strong>Títulos em ordem</strong>: muita gente navega pulando de título em título.</li>
  <li><strong>alt nas imagens</strong>: descrevendo o que importa na imagem, ou vazio se ela for decorativa.</li>
  <li><strong>Links que se explicam</strong>: "Baixar o cardápio (PDF)" em vez de "clique aqui".</li>
  <li><strong>Estrutura semântica</strong>: <code>header</code>, <code>nav</code>, <code>main</code> e <code>footer</code> viram atalhos de navegação.</li>
</ul>

<h2>Botão ou link?</h2>
<p>Parece detalhe, mas muda tudo para quem usa teclado:</p>
<ul>
  <li><code>&lt;a href&gt;</code> <strong>leva a outro lugar</strong>: outra página ou outra parte da página.</li>
  <li><code>&lt;button&gt;</code> <strong>faz uma ação</strong> na própria página: abrir um menu, enviar um formulário, trocar o tema.</li>
</ul>
${codigo(`<!-- Certo -->
<button type="button">Abrir menu</button>

<!-- Errado: não recebe foco pelo teclado nem é anunciado como botão -->
<div onclick="abrirMenu()">Abrir menu</div>`)}
<p>O <code>&lt;button&gt;</code> já vem com tudo pronto: recebe foco com a tecla Tab, funciona com Enter e espaço e é anunciado como "botão". Uma <code>div</code> clicável não tem nada disso.</p>

<h2>Formulários com label</h2>
<p>Todo campo precisa de um <code>&lt;label&gt;</code> ligado a ele. Isso você vai ver em detalhes no próximo módulo.</p>
${codigo(`<label for="email">E-mail</label>
<input id="email" type="email">`)}
${dica('Um teste simples: tente usar a sua página só com o teclado (Tab, Shift+Tab, Enter). Se você conseguir chegar em tudo e sempre souber onde está o foco, já está no caminho certo.')}
`,
              quiz: [
                {
                  pergunta: 'Um elemento que abre um menu na própria página deve ser...',
                  opcoes: ['Um <a href="#">', 'Um <button>', 'Uma <div> com onclick'],
                  certa: 1,
                  explicacao: 'Ação na própria página é <button>. Link (<a>) é para levar a outro lugar.'
                },
                {
                  pergunta: 'Por que informar lang="pt-BR" na tag <html>?',
                  opcoes: [
                    'Para o Google traduzir a página',
                    'Para o leitor de tela usar a pronúncia certa',
                    'É obrigatório para a página abrir'
                  ],
                  certa: 1,
                  explicacao: 'Sem o idioma, o leitor de tela pode ler o texto em português com pronúncia de inglês.'
                },
                {
                  pergunta: 'Qual texto de link é mais acessível?',
                  opcoes: ['Clique aqui', 'Saiba mais', 'Baixar o cardápio (PDF)'],
                  certa: 2,
                  explicacao:
                    'O link deve fazer sentido sozinho, porque leitores de tela costumam listar os links da página fora de contexto.'
                }
              ]
            },
            {
              id: 'desafio-blog',
              tipo: 'desafio',
              titulo: 'Desafio: estrutura de um blog',
              resumo: 'Organize a página de um post com os elementos semânticos certos.',
              minutos: 15,
              enunciado: `
<p>Monte a estrutura de uma página de blog com um post. Não se preocupe com a aparência: o objetivo é usar os elementos que dizem o que cada parte é.</p>`,
              inicial: `<div>Meu Blog</div>

<div>
  <h1>Título do post</h1>
  <div>Texto do post...</div>
</div>
`,
              testes: [
                ['Ter um <header>', doc => !!doc.querySelector('header')],
                [
                  'Ter um <nav> com pelo menos 2 links',
                  doc => [...doc.querySelectorAll('nav')].some(n => n.querySelectorAll('a[href]').length >= 2)
                ],
                ['Ter exatamente um <main>', doc => doc.querySelectorAll('main').length === 1],
                [
                  'Ter um <article> dentro do <main>, com um título',
                  doc => !!doc.querySelector('main article :is(h1, h2)')
                ],
                ['Ter um <footer>', doc => !!doc.querySelector('footer')],
                [
                  'Não pular níveis de título (h1 → h2 → h3...)',
                  doc => {
                    const niveis = [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(h => +h.tagName[1]);
                    return (
                      niveis.length > 0 && niveis[0] === 1 && niveis.every((n, i) => i === 0 || n <= niveis[i - 1] + 1)
                    );
                  }
                ]
              ],
              solucao: `<header>
  <strong>Meu Blog</strong>
  <nav>
    <a href="#">Início</a>
    <a href="#">Sobre</a>
  </nav>
</header>

<main>
  <article>
    <h1>Título do post</h1>
    <p>Texto do post...</p>
    <h2>Uma seção do post</h2>
    <p>Mais texto.</p>
  </article>
</main>

<footer>
  <p>Feito por mim, 2026.</p>
</footer>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Formulários completos com validação, imagens responsivas, vídeo, áudio e conteúdo de outros sites.',
      modulos: [
        {
          titulo: 'Formulários',
          itens: [
            {
              id: 'formularios',
              titulo: 'Formulários e campos',
              resumo: 'form, input, label e os tipos de campo para cada informação.',
              minutos: 9,
              corpo: `
<p>Formulários são a forma de a pessoa mandar informação para o site: um cadastro, uma busca, uma mensagem de contato.</p>

<h2>O formulário e os campos</h2>
${codigo(`<form action="/enviar" method="post">
  <label for="nome">Nome</label>
  <input id="nome" name="nome" type="text">

  <label for="email">E-mail</label>
  <input id="email" name="email" type="email">

  <button type="submit">Enviar</button>
</form>`)}
<ul>
  <li><code>&lt;form&gt;</code> agrupa os campos. <code>action</code> diz para onde os dados vão, e <code>method</code>, como (<code>post</code> para enviar dados, <code>get</code> para buscas).</li>
  <li><code>&lt;input&gt;</code> é o campo. O <code>name</code> é o nome com que o valor é enviado: sem ele, o campo não vai junto.</li>
  <li><code>&lt;button type="submit"&gt;</code> envia o formulário.</li>
</ul>

<h2>Sempre com label</h2>
<p>O <code>&lt;label&gt;</code> é o nome visível do campo. O <code>for</code> do label precisa ser igual ao <code>id</code> do campo. Com essa ligação, clicar no texto coloca o cursor no campo, e o leitor de tela anuncia o nome certo.</p>
${dica('O placeholder (aquele texto cinza dentro do campo) não substitui o label: ele some quando a pessoa começa a digitar e costuma ter pouco contraste.')}

<h2>Tipos de campo</h2>
<p>O atributo <code>type</code> muda o campo, e no celular muda até o teclado que aparece:</p>
${codigo(`<label for="f-email">E-mail</label>
<input id="f-email" type="email">

<label for="f-tel">Telefone</label>
<input id="f-tel" type="tel">

<label for="f-data">Data</label>
<input id="f-data" type="date">

<label for="f-qtd">Quantidade</label>
<input id="f-qtd" type="number" min="1" max="10">

<label><input type="checkbox" name="novidades"> Quero receber novidades</label>`)}

<h2>Escolhas e textos longos</h2>
${codigo(`<label for="assunto">Assunto</label>
<select id="assunto" name="assunto">
  <option value="orcamento">Orçamento</option>
  <option value="duvida">Dúvida</option>
</select>

<fieldset>
  <legend>Como prefere o contato?</legend>
  <label><input type="radio" name="contato" value="email"> E-mail</label>
  <label><input type="radio" name="contato" value="whatsapp"> WhatsApp</label>
</fieldset>

<label for="mensagem">Mensagem</label>
<textarea id="mensagem" name="mensagem" rows="4"></textarea>`)}
<p>Botões de rádio com o mesmo <code>name</code> formam um grupo: só um pode ficar marcado. O <code>&lt;fieldset&gt;</code> com <code>&lt;legend&gt;</code> dá um título ao grupo.</p>
`,
              quiz: [
                {
                  pergunta: 'O que liga um <label> ao seu campo?',
                  opcoes: [
                    'O for do label igual ao id do campo',
                    'O name do label igual ao name do campo',
                    'Ficar na linha de cima'
                  ],
                  certa: 0,
                  explicacao: 'for e id precisam ser iguais. (Outra forma é colocar o campo dentro do label.)'
                },
                {
                  pergunta: 'Um campo sem o atributo name...',
                  opcoes: ['Dá erro na página', 'Não é enviado junto com o formulário', 'Funciona igual'],
                  certa: 1,
                  explicacao: 'O name é a chave com que o valor é enviado. Sem ele, o valor fica de fora.'
                },
                {
                  pergunta: 'Qual a vantagem de usar type="email" em vez de type="text"?',
                  opcoes: [
                    'Nenhuma',
                    'O celular mostra o teclado com @ e o navegador confere o formato',
                    'O e-mail é enviado criptografado'
                  ],
                  certa: 1,
                  explicacao: 'O tipo certo muda o teclado no celular e ativa a validação do navegador.'
                }
              ]
            },
            {
              id: 'validacao',
              titulo: 'Validação nativa',
              resumo: 'required, minlength, pattern e as mensagens de erro que o navegador já oferece.',
              minutos: 7,
              corpo: `
<p>O navegador já sabe conferir muita coisa antes de enviar o formulário, sem uma linha de JavaScript. Basta usar os atributos certos.</p>

<h2>Os atributos de validação</h2>
<ul>
  <li><code>required</code>: o campo é obrigatório.</li>
  <li><code>minlength</code> e <code>maxlength</code>: tamanho mínimo e máximo do texto.</li>
  <li><code>min</code> e <code>max</code>: valor mínimo e máximo de números e datas.</li>
  <li><code>type="email"</code>, <code>type="url"</code>: conferem o formato.</li>
  <li><code>pattern</code>: uma expressão regular que o valor precisa seguir.</li>
</ul>
${codigo(`<form>
  <label for="v-nome">Nome</label>
  <input id="v-nome" name="nome" required minlength="2">

  <label for="v-email">E-mail</label>
  <input id="v-email" name="email" type="email" required>

  <label for="v-cep">CEP (só números)</label>
  <input id="v-cep" name="cep" inputmode="numeric" pattern="[0-9]{8}" title="8 números, sem traço">

  <button type="submit">Enviar</button>
</form>`)}
<p>Clique em <strong>Experimente</strong> e tente enviar o formulário acima com os campos vazios ou preenchidos errado: o navegador mostra a mensagem e coloca o foco no primeiro campo com problema.</p>
<ul>
  <li><code>inputmode="numeric"</code> mostra o teclado numérico no celular, sem transformar o campo em número (um CEP pode começar com zero).</li>
  <li><code>title</code> complementa a mensagem de erro do <code>pattern</code>, explicando o formato esperado.</li>
</ul>

<h2>Autocompletar</h2>
<p>O atributo <code>autocomplete</code> deixa o navegador preencher os dados que a pessoa já salvou, o que poupa muito tempo no celular:</p>
${codigo(`<input name="nome" autocomplete="name">
<input name="email" type="email" autocomplete="email">
<input name="telefone" type="tel" autocomplete="tel">`)}
${dica('A validação do navegador melhora a experiência, mas não protege nada: qualquer pessoa pode desligá-la. Quem recebe os dados (o servidor) sempre precisa conferir de novo.')}
`,
              quiz: [
                {
                  pergunta: 'Qual atributo torna um campo obrigatório?',
                  opcoes: ['required', 'needed', 'mandatory'],
                  certa: 0,
                  explicacao: 'required impede o envio enquanto o campo estiver vazio.'
                },
                {
                  pergunta: 'Por que usar inputmode="numeric" num CEP, em vez de type="number"?',
                  opcoes: [
                    'Porque type="number" não existe',
                    'Porque o CEP não é uma quantidade: pode começar com zero e não deve ter setinhas',
                    'Tanto faz'
                  ],
                  certa: 1,
                  explicacao: 'type="number" é para quantidades. inputmode só troca o teclado, sem mudar o valor.'
                },
                {
                  pergunta: 'A validação do HTML é suficiente para proteger o servidor?',
                  opcoes: ['Sim', 'Não, o servidor precisa conferir os dados de novo', 'Só com pattern'],
                  certa: 1,
                  explicacao:
                    'Qualquer pessoa pode contornar a validação do navegador. Ela existe para ajudar quem usa, não para proteger.'
                }
              ]
            },
            {
              id: 'desafio-contato',
              tipo: 'desafio',
              titulo: 'Desafio: formulário de contato',
              resumo: 'Um formulário completo, acessível e com validação.',
              minutos: 15,
              enunciado: `
<p>Crie o formulário de contato de um pequeno negócio. Ele precisa ser acessível (todo campo com label) e não pode deixar enviar sem os dados principais.</p>`,
              inicial: `<form>

</form>
`,
              testes: [
                ['Ter um <form>', doc => !!doc.querySelector('form')],
                ['Ter um campo de nome obrigatório', doc => !!doc.querySelector('form input[name="nome"][required]')],
                [
                  'Ter um campo de e-mail (type="email") obrigatório',
                  doc => !!doc.querySelector('form input[type="email"][required]')
                ],
                ['Ter um <textarea> para a mensagem', doc => !!doc.querySelector('form textarea')],
                [
                  'Todo campo ter um <label> ligado a ele',
                  doc => {
                    const campos = [...doc.querySelectorAll('form :is(input, textarea, select)')].filter(
                      c => !['submit', 'button', 'hidden'].includes(c.type)
                    );
                    return (
                      campos.length > 0 &&
                      campos.every(
                        c => c.closest('label') || (c.id && doc.querySelector('label[for="' + CSS.escape(c.id) + '"]'))
                      )
                    );
                  }
                ],
                [
                  'Ter um botão de envio',
                  doc =>
                    !!doc.querySelector(
                      'form button:not([type="button"]):not([type="reset"]), form input[type="submit"]'
                    )
                ]
              ],
              solucao: `<form>
  <label for="nome">Nome</label>
  <input id="nome" name="nome" required autocomplete="name">

  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" required autocomplete="email">

  <label for="mensagem">Mensagem</label>
  <textarea id="mensagem" name="mensagem" rows="4" required></textarea>

  <button type="submit">Enviar</button>
</form>`
            }
          ]
        },
        {
          titulo: 'Imagens e mídia',
          itens: [
            {
              id: 'imagens-responsivas',
              titulo: 'Imagens responsivas',
              resumo: 'figure, srcset, sizes e picture: a imagem certa para cada tela.',
              minutos: 10,
              corpo: `
<p>Uma foto de 2000 pixels fica linda num monitor grande, mas no celular ela pesa muito e ocupa só 400 pixels de largura. O HTML tem ferramentas para o navegador baixar <strong>a imagem do tamanho certo</strong> para cada tela.</p>

<h2>Imagem com legenda: figure</h2>
<p>Quando a imagem tem uma legenda, os dois ficam juntos num <code>&lt;figure&gt;</code>, com a legenda no <code>&lt;figcaption&gt;</code>. O <code>alt</code> continua descrevendo a imagem; a legenda é um texto visível, para todo mundo.</p>
${codigo(`<figure>
  <img src="https://picsum.photos/id/1015/600/360" alt="Rio cercado de montanhas ao amanhecer" width="600" height="360">
  <figcaption>Vale do rio, na primeira hora da manhã.</figcaption>
</figure>`)}

<h2>srcset e sizes: vários tamanhos da mesma imagem</h2>
<p>Com <code>srcset</code>, você oferece a mesma imagem em várias larguras, e o navegador escolhe. O <code>w</code> diz a largura real de cada arquivo. O <code>sizes</code> diz quanto espaço a imagem vai ocupar na tela, para o navegador fazer a conta.</p>
${codigo(`<img
  src="https://picsum.photos/id/1018/800/500"
  srcset="https://picsum.photos/id/1018/400/250 400w,
          https://picsum.photos/id/1018/800/500 800w,
          https://picsum.photos/id/1018/1600/1000 1600w"
  sizes="(max-width: 600px) 100vw, 600px"
  alt="Montanhas com neve sob um céu azul"
  width="800" height="500">`)}
<p>Lendo o <code>sizes</code>: "em telas de até 600px, a imagem ocupa a largura toda (<code>100vw</code>); nas maiores, ocupa 600px". Num celular de 400px com tela de alta densidade (2x), o navegador precisa de uma imagem de 800px, e baixa a de <code>800w</code>.</p>
${dica('O <code>src</code> continua obrigatório: é a imagem usada por navegadores antigos e a base para o <code>alt</code>, o <code>width</code> e o <code>height</code>.')}

<h2>picture: formatos modernos e direção de arte</h2>
<p>O <code>&lt;picture&gt;</code> tem dois usos. O primeiro é oferecer formatos mais leves, como AVIF e WebP, com uma alternativa para quem não suporta: o navegador usa o primeiro <code>&lt;source&gt;</code> que entender.</p>
${codigo(`<picture>
  <source srcset="foto.avif" type="image/avif">
  <source srcset="foto.webp" type="image/webp">
  <img src="foto.jpg" alt="Descrição da foto" width="800" height="500">
</picture>`)}
<p>O segundo é a <strong>direção de arte</strong>: mostrar um corte diferente da imagem dependendo da tela, como uma foto mais fechada no celular.</p>
${codigo(`<picture>
  <source media="(max-width: 600px)" srcset="https://picsum.photos/id/1039/400/400">
  <img src="https://picsum.photos/id/1039/900/400" alt="Cachoeira no meio da floresta" width="900" height="400">
</picture>`)}
<p>Repare que o <code>&lt;img&gt;</code> dentro do <code>&lt;picture&gt;</code> é obrigatório: é ele que aparece na tela e carrega o <code>alt</code>. Os <code>&lt;source&gt;</code> só trocam o arquivo.</p>

<h2>Carregar só quando precisa</h2>
<p><code>loading="lazy"</code> faz o navegador só baixar a imagem quando ela estiver perto de aparecer na tela. Use nas imagens do meio e do fim da página, mas não na imagem principal do topo, que precisa aparecer o quanto antes.</p>
${codigo(`<img src="https://picsum.photos/id/1043/600/400" alt="Trilha entre árvores" width="600" height="400" loading="lazy">`)}
`,
              quiz: [
                {
                  pergunta: 'No srcset "foto-800.jpg 800w", o que significa 800w?',
                  opcoes: [
                    'A imagem será mostrada com 800px',
                    'O arquivo tem 800px de largura',
                    'A imagem só aparece em telas de 800px'
                  ],
                  certa: 1,
                  explicacao: 'O w informa a largura real do arquivo. Quem diz o tamanho na tela é o sizes (e o CSS).'
                },
                {
                  pergunta: 'Dentro de um <picture>, qual elemento é obrigatório?',
                  opcoes: ['<source>', '<img>', '<figcaption>'],
                  certa: 1,
                  explicacao:
                    'O <img> é o que aparece de fato e leva o alt. Os <source> só oferecem arquivos alternativos.'
                },
                {
                  pergunta: 'Em qual imagem NÃO vale usar loading="lazy"?',
                  opcoes: [
                    'Na foto principal do topo da página',
                    'Nas fotos da galeria no fim da página',
                    'Nas imagens dos comentários'
                  ],
                  certa: 0,
                  explicacao:
                    'A imagem do topo precisa carregar logo. Atrasá-la deixa a página mais lenta para aparecer.'
                }
              ]
            },
            {
              id: 'audio-e-video',
              titulo: 'Áudio, vídeo e incorporações',
              resumo: 'video, audio, legendas com track e conteúdos de outros sites com iframe.',
              minutos: 9,
              corpo: `
<h2>Vídeo</h2>
<p>O <code>&lt;video&gt;</code> toca vídeos sem nenhum plugin. O atributo <code>controls</code> mostra os botões de play, volume e tela cheia; sem ele, não há como a pessoa controlar o vídeo.</p>
${codigo(`<video controls width="400" height="225" poster="https://picsum.photos/id/1080/400/225">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
  Seu navegador não consegue tocar este vídeo.
</video>`)}
<ul>
  <li><code>poster</code>: a imagem mostrada antes de o vídeo começar.</li>
  <li>Vários <code>&lt;source&gt;</code>: o navegador usa o primeiro formato que suportar.</li>
  <li>O texto de dentro só aparece em navegadores que não tocam vídeo.</li>
  <li><code>preload="none"</code> evita baixar o vídeo antes de a pessoa dar play, o que economiza dados no celular.</li>
</ul>

<h2>Reprodução automática</h2>
<p>Os navegadores só deixam um vídeo começar sozinho (<code>autoplay</code>) se ele estiver <strong>sem som</strong> (<code>muted</code>). No iPhone, também é preciso <code>playsinline</code>, senão ele abre em tela cheia.</p>
${codigo(`<video autoplay muted loop playsinline width="400" height="225">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
</video>`)}
${dica('Vídeo que se mexe sozinho pode atrapalhar a leitura e incomodar pessoas sensíveis a movimento. Se usar, dê um jeito de pausar.')}

<h2>Legendas com track</h2>
<p>Legendas tornam o vídeo acessível para quem não ouve e para quem está num lugar sem poder ligar o som. Elas ficam num arquivo <code>.vtt</code>, ligado por um <code>&lt;track&gt;</code>:</p>
${codigo(`<video controls width="400" height="225">
  <source src="video.mp4" type="video/mp4">
  <track kind="captions" src="legendas-pt.vtt" srclang="pt-BR" label="Português" default>
</video>`)}

<h2>Áudio</h2>
<p>O <code>&lt;audio&gt;</code> funciona igual ao vídeo, só que sem imagem.</p>
${codigo(`<audio controls>
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" type="audio/mpeg">
</audio>`)}

<h2>Conteúdo de outros sites: iframe</h2>
<p>Vídeos do YouTube, mapas do Google Maps e posts de redes sociais entram na página por um <code>&lt;iframe&gt;</code>, que é uma janela para outra página. Dois cuidados: o <code>title</code>, que diz ao leitor de tela o que tem ali dentro, e o <code>loading="lazy"</code>, porque iframes costumam ser pesados.</p>
${codigo(`<iframe
  src="https://www.openstreetmap.org/export/embed.html?bbox=-46.66%2C-23.57%2C-46.62%2C-23.54&amp;layer=mapnik"
  title="Mapa da região da Avenida Paulista, em São Paulo"
  width="400" height="260" loading="lazy">
</iframe>`)}
`,
              quiz: [
                {
                  pergunta: 'Para um vídeo começar sozinho, o que os navegadores exigem?',
                  opcoes: ['Que ele seja curto', 'Que ele esteja sem som (muted)', 'Que ele tenha legenda'],
                  certa: 1,
                  explicacao: 'autoplay só funciona com muted. Vídeo com som começando sozinho é bloqueado.'
                },
                {
                  pergunta: 'Qual elemento liga um arquivo de legendas ao vídeo?',
                  opcoes: ['<track>', '<caption>', '<source>'],
                  certa: 0,
                  explicacao:
                    '<track kind="captions"> aponta para o arquivo .vtt. (<caption> é o título de uma tabela.)'
                },
                {
                  pergunta: 'Por que todo <iframe> precisa de title?',
                  opcoes: [
                    'Para aparecer como dica ao passar o mouse',
                    'Para o leitor de tela dizer o que tem dentro dele',
                    'Para o conteúdo carregar mais rápido'
                  ],
                  certa: 1,
                  explicacao:
                    'O iframe é uma página dentro da página. Sem title, quem usa leitor de tela não sabe do que se trata.'
                }
              ]
            },
            {
              id: 'desafio-galeria',
              tipo: 'desafio',
              titulo: 'Desafio: galeria de um projeto',
              resumo: 'Monte a galeria de fotos e o vídeo de apresentação de um projeto.',
              minutos: 15,
              enunciado: `
<p>Monte a página de galeria de um projeto (pode ser uma viagem, um evento ou um produto). Use fotos com legenda, pelo menos uma imagem responsiva e um vídeo. Para as fotos, use endereços como <code>https://picsum.photos/id/1015/600/400</code>, trocando o número para mudar a foto.</p>`,
              inicial: `<h1>Galeria</h1>
`,
              testes: [
                [
                  'Ter pelo menos 3 <figure>, cada uma com <img> e <figcaption>',
                  doc =>
                    [...doc.querySelectorAll('figure')].filter(
                      f => f.querySelector('img') && f.querySelector('figcaption')
                    ).length >= 3
                ],
                [
                  'Toda imagem ter alt preenchido',
                  doc => {
                    const imgs = [...doc.querySelectorAll('img')];
                    return imgs.length > 0 && imgs.every(i => (i.getAttribute('alt') || '').trim());
                  }
                ],
                [
                  'Toda imagem ter width e height',
                  doc => {
                    const imgs = [...doc.querySelectorAll('img')];
                    return imgs.length > 0 && imgs.every(i => i.hasAttribute('width') && i.hasAttribute('height'));
                  }
                ],
                [
                  'Ter uma imagem responsiva (srcset com sizes, ou um <picture>)',
                  doc => !!doc.querySelector('img[srcset][sizes], picture source')
                ],
                ['Usar loading="lazy" em pelo menos uma imagem', doc => !!doc.querySelector('img[loading="lazy"]')],
                ['Ter um <video> com controls', doc => !!doc.querySelector('video[controls]')]
              ],
              solucao: `<h1>Viagem às montanhas</h1>

<figure>
  <img src="https://picsum.photos/id/1018/800/500"
    srcset="https://picsum.photos/id/1018/400/250 400w, https://picsum.photos/id/1018/800/500 800w"
    sizes="(max-width: 600px) 100vw, 600px"
    alt="Montanhas com neve sob um céu azul" width="800" height="500">
  <figcaption>A vista do primeiro dia.</figcaption>
</figure>

<figure>
  <img src="https://picsum.photos/id/1015/600/400" alt="Rio entre montanhas" width="600" height="400" loading="lazy">
  <figcaption>O rio perto do acampamento.</figcaption>
</figure>

<figure>
  <img src="https://picsum.photos/id/1043/600/400" alt="Trilha entre árvores" width="600" height="400" loading="lazy">
  <figcaption>A trilha de volta.</figcaption>
</figure>

<h2>Vídeo</h2>
<video controls width="400" height="225" preload="none">
  <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
</video>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'O que separa um site de estudo de um site profissional: SEO, ARIA e desempenho.',
      modulos: [
        {
          titulo: 'HTML para produção',
          itens: [
            {
              id: 'metadados-e-seo',
              titulo: 'Metadados e SEO',
              resumo: 'title, description, canonical e Open Graph: como a página aparece no Google e nas redes.',
              minutos: 10,
              corpo: `
<p>Tudo o que fica no <code>&lt;head&gt;</code> é invisível na página, mas decide como ela aparece no resultado do Google, na aba do navegador e quando alguém compartilha o link no WhatsApp ou no LinkedIn.</p>

<h2>Título e descrição</h2>
${codigo(`<title>Bolo de cenoura fofinho | Receitas da Vó</title>
<meta name="description" content="Receita de bolo de cenoura com cobertura de chocolate, pronta em 50 minutos, com o passo a passo e dicas para não solar.">`)}
<ul>
  <li>O <code>&lt;title&gt;</code> é o link azul no Google e o nome na aba. Cada página precisa de um título <strong>único</strong>, com o assunto principal no começo.</li>
  <li>A <code>description</code> costuma ser o texto cinza embaixo do link no Google. Ela não sobe a página no ranking, mas convence (ou não) a pessoa a clicar. Algo entre 120 e 160 caracteres costuma caber inteiro.</li>
</ul>

<h2>O endereço oficial: canonical</h2>
<p>A mesma página pode abrir por vários endereços (com e sem <code>www</code>, com <code>?utm=</code> no fim...). O <code>canonical</code> diz ao Google qual é o endereço oficial, para ele não dividir a relevância entre cópias.</p>
${codigo(`<link rel="canonical" href="https://receitasdavo.com.br/bolo-de-cenoura">`)}

<h2>Compartilhamento: Open Graph</h2>
<p>Quando um link é colado numa rede social, ela procura as tags <strong>Open Graph</strong> (<code>og:</code>) para montar o cartão com título, descrição e imagem.</p>
${codigo(`<meta property="og:type" content="article">
<meta property="og:title" content="Bolo de cenoura fofinho">
<meta property="og:description" content="Pronto em 50 minutos, com cobertura de chocolate.">
<meta property="og:image" content="https://receitasdavo.com.br/img/bolo-1200x630.jpg">
<meta property="og:url" content="https://receitasdavo.com.br/bolo-de-cenoura">
<meta name="twitter:card" content="summary_large_image">`)}
${dica('A imagem do Open Graph precisa de endereço completo (com https://) e funciona melhor em 1200 × 630 pixels.')}

<h2>Outros detalhes do head</h2>
${codigo(`<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#0b7a6f">

<!-- Em páginas que não devem aparecer no Google (login, área do cliente) -->
<meta name="robots" content="noindex">`)}

<h2>Dados estruturados</h2>
<p>Para o Google mostrar resultados mais ricos (estrelas de avaliação, tempo de preparo, preço), existe o JSON-LD: um bloco de dados num formato padrão, o schema.org.</p>
${codigo(`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Bolo de cenoura fofinho",
  "totalTime": "PT50M",
  "recipeYield": "12 fatias"
}
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve a meta description?',
                  opcoes: [
                    'Subir a página no ranking do Google',
                    'Ser o texto que aparece embaixo do link no resultado',
                    'Ser o título da aba'
                  ],
                  certa: 1,
                  explicacao:
                    'A description não pesa no ranking, mas costuma ser o resumo mostrado no resultado e ajuda a pessoa a decidir se clica.'
                },
                {
                  pergunta: 'Qual tag diz qual é o endereço oficial de uma página?',
                  opcoes: ['<link rel="canonical">', '<meta name="url">', '<base href>'],
                  certa: 0,
                  explicacao: 'O canonical evita que endereços diferentes da mesma página sejam vistos como cópias.'
                },
                {
                  pergunta: 'De onde vem a imagem do cartão quando o link é compartilhado no WhatsApp?',
                  opcoes: ['Da primeira <img> da página', 'Da meta og:image', 'Do favicon'],
                  certa: 1,
                  explicacao:
                    'As redes leem as tags Open Graph. Sem og:image, o cartão pode sair sem imagem ou com uma escolhida ao acaso.'
                }
              ]
            },
            {
              id: 'aria',
              titulo: 'ARIA e acessibilidade avançada',
              resumo: 'Quando usar aria-label, aria-expanded e aria-live, e por que o HTML nativo vem primeiro.',
              minutos: 11,
              corpo: `
<p>ARIA é um conjunto de atributos (<code>role</code> e os que começam com <code>aria-</code>) que dão aos leitores de tela informações que o HTML sozinho não dá. Eles <strong>não mudam nada na tela nem no comportamento</strong>: só no que é anunciado.</p>

<h2>A primeira regra do ARIA</h2>
<p>Se existe um elemento HTML que já faz o que você precisa, use o elemento. Um <code>&lt;button&gt;</code> já é anunciado como botão, recebe foco e funciona com o teclado. Uma <code>&lt;div role="button"&gt;</code> só ganha o nome: o foco e o teclado você teria que programar na mão.</p>
${dica('ARIA errado é pior que nenhum ARIA: ele faz o leitor de tela anunciar uma coisa que a página não cumpre.')}

<h2>Dar nome a quem não tem texto</h2>
<p>Um botão só com ícone não tem texto para o leitor de tela ler. O <code>aria-label</code> dá esse nome. E ícones decorativos ganham <code>aria-hidden="true"</code>, para não serem lidos.</p>
${codigo(`<button type="button" aria-label="Fechar">
  <span aria-hidden="true">✕</span>
</button>

<nav aria-label="Navegação principal">...</nav>
<nav aria-label="Rodapé">...</nav>`)}
<p>Quando a página tem dois <code>&lt;nav&gt;</code>, o <code>aria-label</code> diferencia um do outro na lista de regiões do leitor de tela.</p>

<h2>Estado: aberto ou fechado</h2>
<p>Um botão que mostra e esconde um conteúdo (menu, sanfona, filtros) precisa dizer se está aberto. O <code>aria-expanded</code> informa o estado, e o <code>aria-controls</code> aponta para o que ele controla.</p>
${codigo(`<button type="button" aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>
  <li><a href="#">Início</a></li>
  <li><a href="#">Contato</a></li>
</ul>`)}
<p>O JavaScript que abre o menu precisa também trocar o <code>aria-expanded</code> para <code>"true"</code>, e de volta ao fechar.</p>

<h2>Avisos que aparecem sozinhos: aria-live</h2>
<p>Mensagens como "Produto adicionado ao carrinho" ou "Mensagem enviada" aparecem sem a pessoa mover o foco. Uma região com <code>aria-live</code> faz o leitor de tela ler o que entrar nela.</p>
${codigo(`<p role="status" aria-live="polite"></p>`)}
<p><code>polite</code> espera a pessoa terminar o que está ouvindo; <code>assertive</code> interrompe, e deve ficar só para erros urgentes.</p>

<h2>Pular para o conteúdo</h2>
<p>Quem navega pelo teclado precisa passar por todos os links do menu, em toda página, até chegar ao conteúdo. Um link de pular, logo no começo, resolve:</p>
${codigo(`<a href="#conteudo">Pular para o conteúdo</a>
<header>...</header>
<main id="conteudo">...</main>`)}
<p>Normalmente ele fica escondido com CSS e só aparece quando recebe o foco.</p>

<h2>Janelas: o elemento dialog</h2>
<p>O <code>&lt;dialog&gt;</code> já faz quase tudo que uma janela precisa: aberto com <code>showModal()</code>, ele prende o foco dentro dele, fecha com Esc e escurece o fundo. Antes dele, tudo isso exigia muito ARIA e JavaScript.</p>
${codigo(`<dialog id="aviso">
  <h2>Tudo certo!</h2>
  <p>Seu cadastro foi concluído.</p>
  <form method="dialog"><button>Fechar</button></form>
</dialog>`)}
`,
              quiz: [
                {
                  pergunta: 'Qual é a primeira regra do ARIA?',
                  opcoes: [
                    'Colocar role em todo elemento',
                    'Usar o elemento HTML nativo sempre que ele existir',
                    'Usar aria-label em todos os links'
                  ],
                  certa: 1,
                  explicacao:
                    'Elementos nativos já vêm com foco, teclado e anúncio corretos. ARIA é para o que o HTML não cobre.'
                },
                {
                  pergunta: 'Um botão que abre um menu deve informar se está aberto com...',
                  opcoes: ['aria-expanded', 'aria-hidden', 'aria-live'],
                  certa: 0,
                  explicacao: 'aria-expanded="true" ou "false" diz o estado. aria-controls aponta para o menu.'
                },
                {
                  pergunta: 'Como fazer o leitor de tela ler "Mensagem enviada!" assim que a frase aparecer?',
                  opcoes: [
                    'Colocar a frase num <h1>',
                    'Colocar a frase numa região com aria-live',
                    'Usar aria-label no botão de enviar'
                  ],
                  certa: 1,
                  explicacao: 'Regiões aria-live (ou role="status") são lidas quando o conteúdo delas muda.'
                }
              ]
            },
            {
              id: 'desempenho',
              titulo: 'Desempenho no HTML',
              resumo: 'Scripts com defer, preload, imagens que não fazem a página pular e o que medir.',
              minutos: 10,
              corpo: `
<p>Uma página lenta perde visitas: muita gente desiste se ela demora mais de alguns segundos para aparecer, principalmente no celular. Boa parte da velocidade se decide no HTML, na ordem e no jeito de carregar cada coisa.</p>

<h2>Scripts: defer, async e module</h2>
<p>Um <code>&lt;script src&gt;</code> comum <strong>para tudo</strong>: o navegador interrompe a leitura da página, baixa o arquivo, executa e só então continua. Os atributos mudam isso:</p>
${codigo(`<!-- Baixa junto com a página e executa no fim, na ordem: o mais usado -->
<script src="app.js" defer></script>

<!-- Baixa junto e executa assim que chegar, fora de ordem: bom para contadores e anúncios -->
<script src="contador.js" async></script>

<!-- Módulos já se comportam como defer -->
<script type="module" src="main.js"></script>`)}
${dica('Com <code>defer</code>, o script pode ficar no <code>&lt;head&gt;</code> sem atrasar nada, e ainda roda só quando o HTML inteiro já foi lido.')}

<h2>CSS no head</h2>
<p>O CSS também bloqueia: o navegador não desenha a página antes de ter os estilos, para não mostrar a página "pelada" e depois mudar tudo. Por isso ele fica no <code>&lt;head&gt;</code>, e quanto menor e mais perto (no mesmo servidor), melhor.</p>

<h2>Pedir antes: preload e preconnect</h2>
${codigo(`<!-- Começa a baixar já, um arquivo que só seria descoberto depois (como uma fonte usada no CSS) -->
<link rel="preload" href="fontes/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- Adianta a conexão com outro servidor que a página vai usar -->
<link rel="preconnect" href="https://cdn.exemplo.com">`)}

<h2>Imagens que não fazem a página pular</h2>
<p>Se a imagem não informa o tamanho, o navegador não sabe quanto espaço reservar: o texto aparece, a imagem chega e empurra tudo para baixo. Esse pulo tem nome, <em>layout shift</em>, e irrita quem estava lendo. A solução é simples: <code>width</code> e <code>height</code> em toda imagem.</p>
${codigo(`<!-- A imagem principal: carrega com prioridade -->
<img src="capa.jpg" alt="..." width="1200" height="600" fetchpriority="high">

<!-- As outras: só quando chegarem perto da tela -->
<img src="foto.jpg" alt="..." width="600" height="400" loading="lazy">`)}

<h2>Medir antes de otimizar</h2>
<p>O Chrome traz o <strong>Lighthouse</strong> (F12 → aba Lighthouse), que dá uma nota de 0 a 100 e aponta o que está pesando. As métricas principais são:</p>
<ul>
  <li><strong>LCP</strong>: quanto tempo o maior elemento do topo leva para aparecer.</li>
  <li><strong>CLS</strong>: quanto a página pula enquanto carrega.</li>
  <li><strong>INP</strong>: quanto a página demora para responder a um clique.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'O que o atributo defer faz num script?',
                  opcoes: [
                    'Executa o script só depois que o HTML inteiro foi lido, sem travar a página',
                    'Impede o script de rodar',
                    'Executa o script antes de tudo'
                  ],
                  certa: 0,
                  explicacao: 'O script baixa em paralelo e só roda no fim, na ordem em que aparece.'
                },
                {
                  pergunta: 'Por que informar width e height nas imagens?',
                  opcoes: [
                    'Para a imagem ficar mais nítida',
                    'Para o navegador reservar o espaço e a página não pular',
                    'Para a imagem baixar mais rápido'
                  ],
                  certa: 1,
                  explicacao:
                    'Com as dimensões, o espaço fica reservado antes de a imagem chegar, e o texto não é empurrado.'
                },
                {
                  pergunta: 'Qual imagem deve ter fetchpriority="high"?',
                  opcoes: ['Todas', 'A imagem principal, no topo da página', 'As do rodapé'],
                  certa: 1,
                  explicacao: 'Prioridade alta é para o que precisa aparecer primeiro. Se tudo for prioridade, nada é.'
                }
              ]
            },
            {
              id: 'desafio-producao',
              tipo: 'desafio',
              titulo: 'Desafio: página pronta para publicar',
              resumo: 'Uma página completa, com head caprichado, acessível e rápida.',
              minutos: 20,
              enunciado: `
<p>Agora é a página inteira, do <code>&lt;!doctype&gt;</code> ao <code>&lt;/html&gt;</code>: uma página de apresentação de um produto ou serviço pronta para ir ao ar, aparecer bem no Google e nas redes, funcionar no teclado e carregar rápido. O resultado mostra só a parte visível; a lista confere também o que está no <code>&lt;head&gt;</code>.</p>`,
              inicial: `<!doctype html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <h1>Meu produto</h1>
  </body>
</html>
`,
              testes: [
                [
                  '<html> com o idioma (lang)',
                  doc => (doc.documentElement.getAttribute('lang') || '').trim().length > 0
                ],
                ['<title> preenchido', doc => doc.title.trim().length > 0],
                ['Meta description', doc => !!doc.querySelector('meta[name="description"][content]')],
                ['Meta viewport', doc => !!doc.querySelector('meta[name="viewport"]')],
                [
                  'Open Graph: og:title e og:image',
                  doc =>
                    !!doc.querySelector('meta[property="og:title"]') && !!doc.querySelector('meta[property="og:image"]')
                ],
                [
                  'Link "pular para o conteúdo" apontando para o <main>',
                  doc => {
                    const main = doc.querySelector('main[id]');
                    return (
                      !!main &&
                      [...doc.querySelectorAll('a[href^="#"]')].some(a => a.getAttribute('href') === '#' + main.id)
                    );
                  }
                ],
                [
                  'Botão com aria-expanded e aria-controls apontando para um elemento que existe',
                  doc =>
                    [...doc.querySelectorAll('button[aria-expanded][aria-controls]')].some(b =>
                      doc.getElementById(b.getAttribute('aria-controls'))
                    )
                ],
                [
                  'Toda imagem com alt, width e height',
                  doc => {
                    const imgs = [...doc.querySelectorAll('img')];
                    return (
                      imgs.length > 0 &&
                      imgs.every(i => i.hasAttribute('alt') && i.hasAttribute('width') && i.hasAttribute('height'))
                    );
                  }
                ],
                [
                  'Scripts externos com defer ou type="module"',
                  doc => {
                    const scripts = [...doc.querySelectorAll('script[src]')];
                    return scripts.length > 0 && scripts.every(s => s.defer || s.async || s.type === 'module');
                  }
                ]
              ],
              solucao: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Caderno Pontilhado A5 | Papelaria Ponto</title>
    <meta name="description" content="Caderno A5 de 160 páginas pontilhadas, papel 120 g e capa dura. Ideal para bullet journal e anotações.">
    <link rel="canonical" href="https://papelariaponto.com.br/caderno-pontilhado">
    <meta property="og:title" content="Caderno Pontilhado A5">
    <meta property="og:image" content="https://papelariaponto.com.br/img/caderno-1200x630.jpg">
    <script src="app.js" defer></script>
  </head>
  <body>
    <a href="#conteudo">Pular para o conteúdo</a>
    <header>
      <strong>Papelaria Ponto</strong>
      <button type="button" aria-expanded="false" aria-controls="menu">Menu</button>
      <nav id="menu" aria-label="Navegação principal" hidden>
        <a href="#">Produtos</a>
        <a href="#">Contato</a>
      </nav>
    </header>
    <main id="conteudo">
      <h1>Caderno Pontilhado A5</h1>
      <img src="https://picsum.photos/id/24/600/400" alt="Caderno aberto com anotações pontilhadas" width="600" height="400" fetchpriority="high">
      <p>160 páginas pontilhadas, papel 120 g e capa dura.</p>
    </main>
  </body>
</html>`
            }
          ]
        }
      ]
    }
  ]
};
