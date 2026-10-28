// Trilha de CSS: níveis (iniciante, intermediário e avançado), cada um com módulos, aulas (com quiz) e desafios.
// Os testes dos desafios leem os estilos calculados do resultado (getComputedStyle) e, quando precisam saber como algo
// foi escrito (rem, @media, var()), o texto dos <style> da pessoa. O estilo base do editor tem data-base e é ignorado.
// Depois de editar, rode `node ferramentas/gerar-estudos.js` para gerar as páginas em estudos/css/.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'css',
  area: 'Desenvolvimento web',
  titulo: 'CSS',
  sigla: 'CSS',
  resumo: 'Cores, tipografia, caixas, flexbox, grid e páginas que se adaptam ao celular.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Como o CSS funciona: regras, seletores, cores, unidades, texto, o modelo de caixa e a cascata.',
      modulos: [
        {
          titulo: 'Primeiros passos',
          itens: [
            {
              id: 'o-que-e-css',
              titulo: 'O que é CSS',
              resumo: 'Regras, propriedades e as três formas de ligar o CSS ao HTML.',
              minutos: 8,
              corpo: `
<p>CSS (<em>Cascading Style Sheets</em>) é a linguagem que define a <strong>aparência</strong> da página: cores, fontes, espaços, tamanhos e a posição de cada coisa. O HTML diz o que cada parte é, e o CSS diz como ela deve parecer.</p>

<h2>A anatomia de uma regra</h2>
<p>Todo CSS é feito de <strong>regras</strong>. Cada regra tem um <strong>seletor</strong> (em quem aplicar) e um bloco de <strong>declarações</strong> entre chaves. Cada declaração é um par <code>propriedade: valor;</code>.</p>
${trecho(`h1 {
  color: navy;
  font-size: 32px;
}`)}
<p>Lendo em voz alta: "todo <code>h1</code> fica com a cor azul-marinho e letra de 32 pixels". O ponto e vírgula separa uma declaração da outra; esquecer um é o erro mais comum de quem começa, e faz o navegador ignorar a linha seguinte.</p>

<h2>Onde escrever o CSS</h2>
<p>Há três jeitos de ligar o CSS a uma página:</p>
<ul>
  <li><strong>Arquivo separado</strong>, com <code>&lt;link rel=&quot;stylesheet&quot; href=&quot;estilo.css&quot;&gt;</code> no <code>&lt;head&gt;</code>. É o jeito certo para sites de verdade: um arquivo serve todas as páginas e o navegador guarda em cache.</li>
  <li><strong>Tag <code>&lt;style&gt;</code></strong> dentro da página. Prático para exemplos e páginas únicas. É o que vamos usar nos exercícios.</li>
  <li><strong>Atributo <code>style</code></strong> direto no elemento. Funciona, mas espalha o visual pelo HTML e fica difícil de manter. Evite.</li>
</ul>
${codigo(`<style>
  body { background: #f4f1ea; }
  h1 { color: #1d4e89; }
  p { color: #444; }
</style>

<h1>Meu primeiro CSS</h1>
<p>Este parágrafo ficou cinza, e o título, azul.</p>`)}
${dica('Clique em <strong>Experimente</strong> e mude os valores: troque <code>#1d4e89</code> por <code>crimson</code> e veja o título mudar na hora.')}

<h2>Comentários</h2>
<p>Comentários em CSS ficam entre <code>/*</code> e <code>*/</code>. O navegador ignora tudo o que estiver ali dentro, então eles servem para explicar o porquê de uma regra ou desligar uma linha temporariamente.</p>
${trecho(`/* Cor da marca, usada nos títulos */
h1 { color: #1d4e89; }`)}
`,
              quiz: [
                {
                  pergunta: 'Em "p { color: gray; }", o que é color?',
                  opcoes: ['O seletor', 'A propriedade', 'O valor'],
                  certa: 1,
                  explicacao: 'p é o seletor, color é a propriedade e gray é o valor.'
                },
                {
                  pergunta: 'Qual é a melhor forma de ligar o CSS num site com várias páginas?',
                  opcoes: [
                    'Um arquivo .css separado, com <link>',
                    'Uma tag <style> em cada página',
                    'O atributo style em cada elemento'
                  ],
                  certa: 0,
                  explicacao:
                    'Um arquivo só serve todas as páginas, fica em cache no navegador e concentra o visual num lugar.'
                },
                {
                  pergunta: 'O que acontece se faltar o ponto e vírgula entre duas declarações?',
                  opcoes: [
                    'Nada, ele é opcional',
                    'O navegador junta as duas e ignora a declaração quebrada',
                    'A página inteira para de carregar'
                  ],
                  certa: 1,
                  explicacao:
                    'Sem o ;, o valor da primeira "engole" a segunda, e o navegador descarta o que não entende. O resto da página segue normal.'
                }
              ]
            },
            {
              id: 'seletores',
              titulo: 'Seletores',
              resumo: 'Escolher em quem aplicar o estilo: tag, classe, id, descendentes e grupos.',
              minutos: 9,
              corpo: `
<p>O seletor é a parte da regra que diz <strong>quais elementos</strong> recebem o estilo. Saber escolher o seletor certo é metade do CSS.</p>

<h2>Os seletores básicos</h2>
<ul>
  <li><strong>Tag</strong>: <code>p</code> pega todos os parágrafos.</li>
  <li><strong>Classe</strong>: <code>.destaque</code> pega todo elemento com <code>class="destaque"</code>. Um elemento pode ter várias classes, separadas por espaço.</li>
  <li><strong>Id</strong>: <code>#topo</code> pega o elemento com <code>id="topo"</code>, que deve ser único na página.</li>
  <li><strong>Universal</strong>: <code>*</code> pega todos os elementos.</li>
</ul>
${codigo(`<style>
  p { color: #555; }
  .destaque { background: #fff3b0; }
  .aviso { font-weight: bold; }
  #rodape { color: #999; }
</style>

<p>Um parágrafo comum.</p>
<p class="destaque">Este tem fundo amarelo.</p>
<p class="destaque aviso">Este tem fundo amarelo e negrito.</p>
<p id="rodape">Este é o rodapé.</p>`)}
${dica('Prefira classes para estilizar. Elas podem ser reaproveitadas e têm uma força (especificidade) equilibrada. Deixe o id para links internos e JavaScript.')}

<h2>Combinando seletores</h2>
<ul>
  <li><strong>Descendente</strong> (com espaço): <code>nav a</code> pega links que estão <em>em qualquer lugar</em> dentro de um <code>nav</code>.</li>
  <li><strong>Filho direto</strong>: <code>ul &gt; li</code> pega só os <code>li</code> que estão logo abaixo da <code>ul</code>.</li>
  <li><strong>Tag com classe</strong> (sem espaço): <code>p.destaque</code> pega parágrafos que têm a classe <code>destaque</code>.</li>
  <li><strong>Grupo</strong> (com vírgula): <code>h1, h2, h3</code> aplica a mesma regra aos três.</li>
</ul>
${codigo(`<style>
  h1, h2 { font-family: Georgia, serif; }
  nav a { color: white; text-decoration: none; }
  nav { background: #1d4e89; padding: 8px; }
</style>

<nav><a href="#">Início</a> · <a href="#">Contato</a></nav>
<h1>Título</h1>
<h2>Subtítulo</h2>
<p>Este <a href="#">link</a> fora do nav continua azul e sublinhado.</p>`)}

<h2>Pseudo-classes</h2>
<p>Pseudo-classes, escritas com dois-pontos, selecionam elementos num <strong>estado</strong>: <code>a:hover</code> (mouse em cima), <code>input:focus</code> (campo ativo), <code>li:first-child</code> (o primeiro item). Veremos mais delas no nível avançado.</p>
${trecho(`a:hover { color: crimson; }
li:first-child { font-weight: bold; }`)}
`,
              quiz: [
                {
                  pergunta: 'Qual seletor pega todos os elementos com class="card"?',
                  opcoes: ['card', '#card', '.card'],
                  certa: 2,
                  explicacao: 'O ponto indica classe. O # indica id, e o nome sozinho seria uma tag <card>.'
                },
                {
                  pergunta: 'Qual a diferença entre "nav a" e "nav, a"?',
                  opcoes: [
                    'Nenhuma',
                    '"nav a" pega links dentro do nav; "nav, a" pega o nav e todos os links',
                    '"nav a" pega o nav e todos os links; "nav, a" pega links dentro do nav'
                  ],
                  certa: 1,
                  explicacao: 'O espaço significa "dentro de". A vírgula significa "e também".'
                },
                {
                  pergunta: 'Por que preferir classe a id para estilizar?',
                  opcoes: [
                    'Classes carregam mais rápido',
                    'Classes podem ser reaproveitadas e não têm força exagerada',
                    'Id não funciona em CSS'
                  ],
                  certa: 1,
                  explicacao:
                    'Id funciona, mas é único e muito forte na cascata, o que dificulta sobrescrever depois. Classes são reutilizáveis.'
                }
              ]
            },
            {
              id: 'cores-e-unidades',
              titulo: 'Cores e unidades',
              resumo: 'Nomes, hexadecimal, rgb e hsl; px, rem, em e porcentagem.',
              minutos: 9,
              corpo: `
<h2>Cores</h2>
<p>As propriedades mais usadas para cor são <code>color</code> (cor do texto) e <code>background-color</code> (cor do fundo; o atalho <code>background</code> também serve). Existem várias formas de escrever a mesma cor:</p>
<ul>
  <li><strong>Nome</strong>: <code>tomato</code>, <code>navy</code>, <code>white</code>. Há cerca de 140 nomes prontos.</li>
  <li><strong>Hexadecimal</strong>: <code>#ff6347</code>. Dois dígitos para vermelho, verde e azul, de 00 a ff. É o formato que você vai encontrar em quase todo design.</li>
  <li><strong>rgb()</strong>: <code>rgb(255 99 71)</code>. As mesmas três quantidades, de 0 a 255.</li>
  <li><strong>hsl()</strong>: <code>hsl(9 100% 64%)</code>. Matiz (0 a 360 no círculo das cores), saturação e luminosidade. Fácil de ajustar à mão: para uma versão mais escura, baixe só a luminosidade.</li>
</ul>
<p>Para transparência, acrescente uma barra e a opacidade: <code>rgb(0 0 0 / 50%)</code> é preto pela metade.</p>
${codigo(`<style>
  .a { background: tomato; }
  .b { background: #1d4e89; color: white; }
  .c { background: hsl(150 60% 40%); color: white; }
  .d { background: hsl(150 60% 25%); color: white; }
  .e { background: rgb(0 0 0 / 15%); }
  p { padding: 8px; }
</style>

<p class="a">Nome: tomato</p>
<p class="b">Hexadecimal: #1d4e89</p>
<p class="c">hsl(150 60% 40%)</p>
<p class="d">O mesmo verde, só com luminosidade 25%</p>
<p class="e">Preto com 15% de opacidade</p>`)}
${dica('Texto precisa de contraste com o fundo para ser lido por todo mundo. Cinza claro sobre branco fica bonito no monitor de quem desenhou e ilegível no celular ao sol.')}

<h2>Unidades de medida</h2>
<ul>
  <li><strong>px</strong>: pixels. Bom para bordas e detalhes finos.</li>
  <li><strong>rem</strong>: múltiplos do tamanho de letra da raiz da página (normalmente 16px). <code>1.5rem</code> = 24px. Respeita quem aumentou a fonte nas configurações do navegador, por isso é a melhor escolha para textos e espaçamentos.</li>
  <li><strong>em</strong>: múltiplos do tamanho de letra do <em>próprio elemento</em>. Útil para espaços que acompanham o texto, como o recuo de um botão.</li>
  <li><strong>%</strong>: porcentagem do elemento pai. <code>width: 50%</code> ocupa metade da largura de quem o contém.</li>
</ul>
${codigo(`<style>
  h1 { font-size: 2rem; }
  p { font-size: 1rem; }
  .pequeno { font-size: 0.875rem; color: #666; }
  .metade { width: 50%; background: #e0ecf8; }
</style>

<h1>2rem = 32px</h1>
<p>1rem = 16px, o tamanho padrão.</p>
<p class="pequeno">0.875rem = 14px</p>
<p class="metade">Eu ocupo metade da largura.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Qual propriedade muda a cor do texto?',
                  opcoes: ['background-color', 'color', 'font-color'],
                  certa: 1,
                  explicacao: 'É color. font-color não existe, e background-color muda o fundo.'
                },
                {
                  pergunta: 'Por que usar rem em vez de px para o tamanho dos textos?',
                  opcoes: [
                    'rem é mais preciso',
                    'rem acompanha o tamanho de fonte que a pessoa escolheu no navegador',
                    'px não funciona no celular'
                  ],
                  certa: 1,
                  explicacao:
                    'Quem aumenta a fonte padrão por dificuldade de visão vê os textos em rem crescerem junto. Em px, ficam travados.'
                },
                {
                  pergunta: 'Em hsl(210 70% 50%), o que mudar para deixar a cor mais escura sem mudar o tom?',
                  opcoes: ['O 210', 'O 70%', 'O 50%'],
                  certa: 2,
                  explicacao:
                    'O último número é a luminosidade. Baixando de 50% para 30%, a cor escurece e continua azul.'
                }
              ]
            },
            {
              id: 'desafio-cartao-de-visita',
              tipo: 'desafio',
              titulo: 'Desafio: cartão de visita',
              resumo: 'Dê cor e personalidade a um cartão usando seletores, cores e rem.',
              minutos: 15,
              enunciado: `
<p>O HTML do cartão já está pronto, mas sem nenhum estilo. Escreva o CSS dentro da tag <code>&lt;style&gt;</code> e acompanhe o resultado ao lado. Cada item da lista fica verde quando estiver certo.</p>`,
              inicial: `<style>
  /* Escreva seu CSS aqui */

</style>

<div class="cartao">
  <h1>Ana Souza</h1>
  <p class="cargo">Desenvolvedora web</p>
  <p>Faço sites <span class="destaque">rápidos e acessíveis</span> para pequenos negócios.</p>
  <p id="contato">ana@exemplo.com</p>
</div>
`,
              testes: [
                [
                  'Dar uma cor de fundo à página (body)',
                  doc => {
                    const fundo = doc.defaultView.getComputedStyle(doc.body).backgroundColor;
                    return fundo !== 'rgba(0, 0, 0, 0)' && fundo !== 'transparent';
                  }
                ],
                [
                  'Deixar o título <h1> com uma cor diferente do texto',
                  doc => {
                    const ver = doc.defaultView.getComputedStyle;
                    return ver(doc.querySelector('h1')).color !== ver(doc.querySelector('#contato')).color;
                  }
                ],
                [
                  'Destacar o .destaque com cor de texto ou de fundo',
                  doc => {
                    const ver = doc.defaultView.getComputedStyle;
                    const destaque = ver(doc.querySelector('.destaque'));
                    const texto = ver(doc.querySelector('.destaque').parentElement);
                    return destaque.color !== texto.color || destaque.backgroundColor !== 'rgba(0, 0, 0, 0)';
                  }
                ],
                [
                  'Usar rem em pelo menos um font-size',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return /font-size\s*:\s*[\d.]+rem/.test(css);
                  }
                ],
                [
                  'Agrupar dois seletores numa regra só, com vírgula',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return /[\w.#)\]-]\s*,\s*[\w.#:[-][^{}]*\{/.test(css);
                  }
                ],
                [
                  'Estilizar o #contato com uma cor diferente do texto do cartão',
                  doc => {
                    const ver = doc.defaultView.getComputedStyle;
                    return ver(doc.querySelector('#contato')).color !== ver(doc.querySelector('.cartao')).color;
                  }
                ]
              ],
              solucao: `<style>
  body { background: #f4f1ea; color: #333; }
  h1, .cargo { color: #1d4e89; }
  h1 { font-size: 2rem; }
  .cargo { font-size: 1.125rem; }
  .destaque { background: #fff3b0; }
  #contato { color: #777; }
</style>

<div class="cartao">
  <h1>Ana Souza</h1>
  <p class="cargo">Desenvolvedora web</p>
  <p>Faço sites <span class="destaque">rápidos e acessíveis</span> para pequenos negócios.</p>
  <p id="contato">ana@exemplo.com</p>
</div>`
            }
          ]
        },
        {
          titulo: 'Texto e caixas',
          itens: [
            {
              id: 'tipografia',
              titulo: 'Tipografia',
              resumo: 'Fontes, tamanhos, peso, altura de linha e alinhamento.',
              minutos: 9,
              corpo: `
<p>A maior parte de um site é texto. Cuidar da tipografia é o que mais muda a cara de uma página com o menor esforço.</p>

<h2>A família da fonte</h2>
<p><code>font-family</code> recebe uma lista de fontes, da preferida para a reserva. O navegador usa a primeira que encontrar. A lista sempre termina numa família genérica: <code>serif</code> (com serifa), <code>sans-serif</code> (sem serifa) ou <code>monospace</code> (largura fixa, para código).</p>
${trecho(`body { font-family: system-ui, "Segoe UI", Roboto, sans-serif; }
h1 { font-family: Georgia, "Times New Roman", serif; }
code { font-family: ui-monospace, Consolas, monospace; }`)}
<p>Nomes com espaço vão entre aspas. <code>system-ui</code> usa a fonte do sistema da pessoa, que carrega na hora porque já está instalada. Para fontes de fora, como as do Google Fonts, é preciso carregar o arquivo antes.</p>

<h2>Tamanho, peso e estilo</h2>
<ul>
  <li><code>font-size</code>: o tamanho, de preferência em rem.</li>
  <li><code>font-weight</code>: a espessura, de 100 a 900. <code>400</code> é o normal e <code>700</code>, o negrito.</li>
  <li><code>font-style: italic</code>: itálico.</li>
  <li><code>text-transform: uppercase</code>: tudo em maiúsculas, sem mudar o texto no HTML.</li>
  <li><code>letter-spacing</code>: espaço entre as letras. Textos em maiúsculas ficam melhores com um pouco a mais.</li>
</ul>

<h2>Altura de linha e largura</h2>
<p><code>line-height</code> é o espaço entre as linhas. Para textos corridos, algo entre <code>1.5</code> e <code>1.7</code> (sem unidade, multiplica o tamanho da letra) deixa a leitura confortável. Títulos grandes ficam melhores com menos, perto de <code>1.2</code>.</p>
<p>Linhas longas demais cansam: o olho se perde ao voltar para o começo da próxima. Limite a largura do texto a uns 60 a 75 caracteres com <code>max-width: 65ch</code> (<code>ch</code> é a largura do caractere "0").</p>
${codigo(`<style>
  body { font-family: system-ui, sans-serif; }
  h1 { font-family: Georgia, serif; font-size: 2.25rem; line-height: 1.2; }
  .chapeu { text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.8rem; font-weight: 700; color: #b5482b; }
  .texto { line-height: 1.7; max-width: 65ch; }
  .centro { text-align: center; font-style: italic; }
</style>

<p class="chapeu">Tipografia</p>
<h1>Um bom texto começa pelo espaço entre as linhas</h1>
<p class="texto">Repare como este parágrafo é confortável de ler: as linhas têm espaço para respirar e não passam de uma largura razoável, então o olho encontra fácil o começo da linha seguinte, mesmo numa tela grande.</p>
<p class="centro">Texto centralizado funciona para frases curtas, não para parágrafos.</p>`)}
${dica('Duas famílias de fonte por site costumam bastar: uma para títulos e outra para o texto. Mais do que isso tende a parecer bagunçado.')}
`,
              quiz: [
                {
                  pergunta: 'Por que a lista do font-family termina em algo como sans-serif?',
                  opcoes: [
                    'É obrigatório pela especificação',
                    'É a reserva caso nenhuma das fontes da lista exista',
                    'Deixa a fonte mais leve'
                  ],
                  certa: 1,
                  explicacao:
                    'Se nenhuma fonte da lista estiver disponível, o navegador usa a genérica, que sempre existe.'
                },
                {
                  pergunta: 'Qual line-height é mais confortável para um parágrafo longo?',
                  opcoes: ['1', '1.6', '3'],
                  certa: 1,
                  explicacao: 'Entre 1.5 e 1.7 é o ponto doce para texto corrido. 1 aperta as linhas, 3 separa demais.'
                },
                {
                  pergunta: 'Para que serve max-width: 65ch num parágrafo?',
                  opcoes: [
                    'Limitar o texto a 65 caracteres no total',
                    'Limitar o comprimento de cada linha para facilitar a leitura',
                    'Aumentar a letra'
                  ],
                  certa: 1,
                  explicacao: 'ch é a largura de um caractere. 65ch deixa cada linha com uns 65 caracteres.'
                }
              ]
            },
            {
              id: 'modelo-de-caixa',
              titulo: 'Modelo de caixa',
              resumo: 'Conteúdo, padding, borda e margem, e o box-sizing que evita surpresas.',
              minutos: 10,
              corpo: `
<p>Para o CSS, todo elemento é uma <strong>caixa retangular</strong>. Entender as camadas dessa caixa resolve a maior parte dos "por que isso está desalinhado?".</p>

<h2>As quatro camadas</h2>
<ol>
  <li><strong>Conteúdo</strong>: o texto ou a imagem, com <code>width</code> e <code>height</code>.</li>
  <li><strong>Padding</strong>: o espaço interno, entre o conteúdo e a borda. Fica com a cor de fundo do elemento.</li>
  <li><strong>Borda</strong> (<code>border</code>): a linha em volta.</li>
  <li><strong>Margem</strong> (<code>margin</code>): o espaço externo, que afasta a caixa das vizinhas. É sempre transparente.</li>
</ol>
${codigo(`<style>
  .caixa {
    background: #e0ecf8;
    padding: 20px;
    border: 4px solid #1d4e89;
    margin: 24px;
    border-radius: 12px;
  }
</style>

<div class="caixa">Fundo azul-claro = conteúdo + padding. A borda escura vem depois, e a margem de 24px é o espaço vazio em volta.</div>
<div class="caixa">Outra caixa, afastada da primeira pela margem.</div>`)}
${dica('Clique com o botão direito no resultado e escolha <strong>Inspecionar</strong>. O painel de estilos do navegador desenha o modelo de caixa de cada elemento, com as medidas.')}

<h2>Atalhos de lado</h2>
<p><code>padding</code>, <code>margin</code> e <code>border</code> aceitam valores por lado. A ordem é a dos ponteiros do relógio, começando em cima:</p>
${trecho(`padding: 10px;                /* os quatro lados */
padding: 10px 20px;           /* cima e baixo | esquerda e direita */
padding: 10px 20px 30px 40px; /* cima | direita | baixo | esquerda */
padding-top: 10px;            /* um lado só */
margin: 0 auto;               /* centraliza na horizontal uma caixa com largura definida */`)}
<p>A borda segue o padrão <code>espessura estilo cor</code>, como <code>1px solid #ccc</code>. Sem o estilo (<code>solid</code>, <code>dashed</code>, <code>dotted</code>), ela não aparece. <code>border-radius</code> arredonda os cantos.</p>

<h2>box-sizing: o ajuste que todo site faz</h2>
<p>Por padrão, <code>width</code> mede só o conteúdo: uma caixa com <code>width: 300px</code>, padding de 20px e borda de 2px ocupa na verdade 344px. Isso confunde. Com <code>box-sizing: border-box</code>, a largura passa a incluir padding e borda, e 300px é 300px.</p>
${trecho(`*, *::before, *::after {
  box-sizing: border-box;
}`)}
<p>Essa regra aparece no topo de praticamente todo CSS moderno.</p>

<h2>Block e inline</h2>
<p>Elementos como <code>div</code>, <code>p</code> e <code>h1</code> são <strong>block</strong>: ocupam a linha inteira e aceitam largura, altura e margens. Já <code>span</code>, <code>a</code> e <code>strong</code> são <strong>inline</strong>: ficam no meio do texto e ignoram largura, altura e margens de cima e de baixo. Na próxima etapa você vai aprender a trocar isso com <code>display</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual camada fica entre o conteúdo e a borda?',
                  opcoes: ['margin', 'padding', 'outline'],
                  certa: 1,
                  explicacao: 'O padding é o espaço interno. A margem fica do lado de fora da borda.'
                },
                {
                  pergunta:
                    'Com box-sizing: border-box, uma caixa com width: 200px e padding: 20px ocupa quanto de largura?',
                  opcoes: ['200px', '220px', '240px'],
                  certa: 0,
                  explicacao: 'Com border-box, padding e borda ficam dentro dos 200px. Sem ele, seriam 240px.'
                },
                {
                  pergunta: 'O que faz margin: 0 auto numa caixa com max-width?',
                  opcoes: ['Tira todas as margens', 'Centraliza a caixa na horizontal', 'Centraliza o texto'],
                  certa: 1,
                  explicacao:
                    'auto divide o espaço que sobra igualmente entre esquerda e direita. Para centralizar o texto, use text-align.'
                }
              ]
            },
            {
              id: 'cascata-e-especificidade',
              titulo: 'Cascata e especificidade',
              resumo: 'Quando duas regras brigam, quem vence e por quê.',
              minutos: 10,
              corpo: `
<p>É comum duas regras tentarem mudar a mesma propriedade do mesmo elemento. O "C" de CSS, a <strong>cascata</strong>, é o conjunto de critérios que decide quem vence.</p>

<h2>1. Especificidade: o seletor mais específico vence</h2>
<p>Cada seletor tem um peso. Pense numa pontuação com três casas:</p>
<ul>
  <li><strong>id</strong> (<code>#menu</code>) vale 1-0-0;</li>
  <li><strong>classe, pseudo-classe e atributo</strong> (<code>.ativo</code>, <code>:hover</code>, <code>[type]</code>) valem 0-1-0;</li>
  <li><strong>tag</strong> (<code>p</code>, <code>li</code>) vale 0-0-1.</li>
</ul>
<p>As casas se somam e são comparadas da esquerda para a direita. <code>nav .link</code> (0-1-1) vence <code>a</code> (0-0-1), e um único id vence qualquer quantidade de classes.</p>
${codigo(`<style>
  #aviso { color: purple; }   /* 1-0-0: vence */
  .texto { color: green; }    /* 0-1-0 */
  p { color: red; }           /* 0-0-1 */
</style>

<p id="aviso" class="texto">De que cor eu fico?</p>
<p class="texto">E eu?</p>
<p>E eu?</p>`)}

<h2>2. Ordem: com o mesmo peso, a última vence</h2>
<p>Se dois seletores têm a mesma especificidade, vale o que aparece por último no código. Por isso a ordem das regras e dos arquivos CSS importa.</p>
${codigo(`<style>
  .botao { background: gray; }
  .botao { background: teal; } /* mesma força, vem depois: vence */
  .botao { color: white; padding: 8px 16px; border: 0; }
</style>

<button class="botao">Botão</button>`)}

<h2>3. Herança</h2>
<p>Algumas propriedades, principalmente as de texto (<code>color</code>, <code>font-family</code>, <code>line-height</code>), passam de pai para filho. Por isso definir a fonte no <code>body</code> muda a página inteira. Propriedades de caixa, como <code>padding</code>, <code>border</code> e <code>background</code>, não são herdadas. Qualquer regra que mire o elemento diretamente vence o valor herdado.</p>

<h2>E o !important?</h2>
<p>Colocar <code>!important</code> depois de um valor passa por cima da especificidade. Parece uma solução, mas cria uma guerra: para vencer um <code>!important</code>, só outro <code>!important</code>. Se você precisa dele, quase sempre o problema é um seletor forte demais em outro lugar. Use em último caso.</p>
${dica('Para manter o CSS fácil de mudar, mantenha a especificidade baixa e parecida: uma classe por seletor resolve quase tudo.')}
`,
              quiz: [
                {
                  pergunta: 'Quem vence: ".menu a" ou "#topo"?',
                  opcoes: [
                    '.menu a, porque tem dois seletores',
                    '#topo, porque um id pesa mais que classes',
                    'O que vier por último'
                  ],
                  certa: 1,
                  explicacao: '.menu a vale 0-1-1 e #topo vale 1-0-0. A casa do id é comparada primeiro.'
                },
                {
                  pergunta: 'Duas regras .card mudam o background. Qual vence?',
                  opcoes: ['A primeira', 'A última', 'Nenhuma, dá erro'],
                  certa: 1,
                  explicacao: 'Com a mesma especificidade, o critério de desempate é a ordem: a última vence.'
                },
                {
                  pergunta: 'Qual destas propriedades é herdada pelos filhos?',
                  opcoes: ['padding', 'border', 'color'],
                  certa: 2,
                  explicacao: 'Propriedades de texto, como color e font-family, são herdadas. As de caixa, não.'
                }
              ]
            },
            {
              id: 'desafio-cartao-perfil',
              tipo: 'desafio',
              titulo: 'Desafio: cartão de perfil',
              resumo: 'Use tipografia e o modelo de caixa para transformar um bloco de texto num cartão.',
              minutos: 15,
              enunciado: `
<p>Transforme o bloco abaixo num cartão de perfil bem acabado: com espaço interno, borda, cantos arredondados, largura limitada e centralizado. Cuide também da tipografia.</p>`,
              inicial: `<style>
  /* Escreva seu CSS aqui */

</style>

<div class="perfil">
  <h1>Bruno Lima</h1>
  <p class="cargo">Designer de interfaces</p>
  <p>Desenho telas simples para problemas complicados. Antes de abrir o editor, sempre pergunto quem vai usar.</p>
</div>
`,
              testes: [
                [
                  'Usar box-sizing: border-box no .perfil',
                  doc => doc.defaultView.getComputedStyle(doc.querySelector('.perfil')).boxSizing === 'border-box'
                ],
                [
                  'Dar pelo menos 16px de padding em todos os lados do .perfil',
                  doc => {
                    const s = doc.defaultView.getComputedStyle(doc.querySelector('.perfil'));
                    return ['Top', 'Right', 'Bottom', 'Left'].every(lado => parseFloat(s['padding' + lado]) >= 16);
                  }
                ],
                [
                  'Colocar uma borda visível no .perfil',
                  doc => {
                    const s = doc.defaultView.getComputedStyle(doc.querySelector('.perfil'));
                    return parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none';
                  }
                ],
                [
                  'Arredondar os cantos do .perfil',
                  doc =>
                    parseFloat(doc.defaultView.getComputedStyle(doc.querySelector('.perfil')).borderTopLeftRadius) > 0
                ],
                [
                  'Limitar a largura (max-width) e centralizar com margin auto',
                  doc => {
                    const s = doc.defaultView.getComputedStyle(doc.querySelector('.perfil'));
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(el => el.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return s.maxWidth !== 'none' && /margin(-inline|-left)?\s*:[^;}]*auto/.test(css);
                  }
                ],
                [
                  'Usar no título uma fonte diferente da do texto',
                  doc => {
                    const ver = doc.defaultView.getComputedStyle;
                    return (
                      ver(doc.querySelector('h1')).fontFamily !==
                      ver(doc.querySelector('.perfil p:last-child')).fontFamily
                    );
                  }
                ],
                [
                  'Deixar o .cargo em maiúsculas, com letter-spacing',
                  doc => {
                    const s = doc.defaultView.getComputedStyle(doc.querySelector('.cargo'));
                    return (
                      s.textTransform === 'uppercase' && s.letterSpacing !== 'normal' && parseFloat(s.letterSpacing) > 0
                    );
                  }
                ]
              ],
              solucao: `<style>
  .perfil {
    box-sizing: border-box;
    max-width: 24rem;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 1px solid #d5dde5;
    border-radius: 16px;
    background: white;
    line-height: 1.6;
  }
  h1 { font-family: Georgia, serif; margin: 0 0 4px; }
  .cargo {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.8rem;
    color: #1d4e89;
    margin: 0 0 12px;
  }
</style>

<div class="perfil">
  <h1>Bruno Lima</h1>
  <p class="cargo">Designer de interfaces</p>
  <p>Desenho telas simples para problemas complicados. Antes de abrir o editor, sempre pergunto quem vai usar.</p>
</div>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Montar layouts de verdade com display, position, flexbox e grid, e adaptá-los a qualquer tela.',
      modulos: [
        {
          titulo: 'Layout',
          itens: [
            {
              id: 'display-e-position',
              titulo: 'Display e position',
              resumo: 'Block, inline, none e os quatro tipos de posicionamento.',
              minutos: 10,
              corpo: `
<h2>display</h2>
<p>A propriedade <code>display</code> decide como uma caixa se comporta no fluxo da página:</p>
<ul>
  <li><code>block</code>: ocupa a linha inteira e empilha com as outras.</li>
  <li><code>inline</code>: fica no meio do texto; ignora largura, altura e margens verticais.</li>
  <li><code>inline-block</code>: fica na linha como o inline, mas aceita largura, altura e margens, como o block. Bom para botões e etiquetas.</li>
  <li><code>none</code>: some da página (e dos leitores de tela).</li>
  <li><code>flex</code> e <code>grid</code>: transformam a caixa num contêiner de layout. São os assuntos das próximas aulas.</li>
</ul>
${codigo(`<style>
  .etiqueta {
    display: inline-block;
    padding: 4px 12px;
    margin: 4px;
    border-radius: 999px;
    background: #e0ecf8;
    color: #1d4e89;
  }
  .escondido { display: none; }
</style>

<p>Tecnologias:
  <span class="etiqueta">HTML</span>
  <span class="etiqueta">CSS</span>
  <span class="etiqueta">JavaScript</span>
  <span class="etiqueta escondido">Eu não apareço</span>
</p>`)}

<h2>position</h2>
<p>Por padrão, as caixas seguem o fluxo normal (<code>position: static</code>). As outras opções tiram ou deslocam a caixa desse fluxo, e usam <code>top</code>, <code>right</code>, <code>bottom</code> e <code>left</code> para dizer onde ela fica:</p>
<ul>
  <li><code>relative</code>: desloca a caixa em relação a onde ela estaria, sem afetar as vizinhas. Também serve de referência para filhos com <code>absolute</code>.</li>
  <li><code>absolute</code>: tira a caixa do fluxo e a posiciona em relação ao ancestral mais próximo que tenha <code>position</code> diferente de static.</li>
  <li><code>fixed</code>: fica presa à tela, mesmo rolando a página. Usado em botões flutuantes.</li>
  <li><code>sticky</code>: segue o fluxo normal até chegar a um ponto da tela, e aí gruda. Perfeito para cabeçalhos de tabela e menus.</li>
</ul>
${codigo(`<style>
  .foto {
    position: relative;
    width: 220px;
    height: 140px;
    background: linear-gradient(135deg, #7fb3d5, #1d4e89);
    border-radius: 12px;
  }
  .selo {
    position: absolute;
    top: 8px;
    right: 8px;
    background: crimson;
    color: white;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 6px;
  }
</style>

<div class="foto">
  <span class="selo">Novo</span>
</div>`)}
<p>O selo fica no canto da foto porque a foto tem <code>position: relative</code>. Apague essa linha e veja o selo fugir para o canto da página.</p>

<h2>z-index</h2>
<p>Quando caixas posicionadas se sobrepõem, <code>z-index</code> diz quem fica na frente: o número maior ganha. Só funciona em elementos com <code>position</code> diferente de static (ou filhos de flex e grid).</p>
${dica('Use position para detalhes: selos, menus suspensos, cabeçalhos grudados. Para montar a estrutura da página (colunas, cartões lado a lado), use flexbox e grid.')}
`,
              quiz: [
                {
                  pergunta:
                    'Qual display deixa um elemento na linha do texto, mas aceitando largura e padding vertical?',
                  opcoes: ['inline', 'inline-block', 'none'],
                  certa: 1,
                  explicacao: 'inline-block mistura os dois: fica na linha como o inline e aceita medidas como o block.'
                },
                {
                  pergunta: 'Um elemento com position: absolute se posiciona em relação a quê?',
                  opcoes: [
                    'Sempre à tela',
                    'Ao ancestral mais próximo com position diferente de static',
                    'Ao elemento anterior'
                  ],
                  certa: 1,
                  explicacao:
                    'Se nenhum ancestral estiver posicionado, ele usa a página. Por isso o pai costuma receber relative.'
                },
                {
                  pergunta: 'Qual position faz um menu acompanhar a rolagem só depois de chegar ao topo da tela?',
                  opcoes: ['fixed', 'sticky', 'relative'],
                  certa: 1,
                  explicacao: 'sticky segue o fluxo até o limite definido (top: 0, por exemplo) e então gruda.'
                }
              ]
            },
            {
              id: 'flexbox',
              titulo: 'Flexbox',
              resumo: 'Alinhar e distribuir itens numa linha ou coluna.',
              minutos: 12,
              corpo: `
<p>O flexbox organiza os filhos de uma caixa numa <strong>direção</strong>: em linha ou em coluna. Ele resolve de forma simples coisas que antes eram difíceis, como centralizar algo na vertical ou distribuir itens de um menu.</p>

<h2>O contêiner e os itens</h2>
<p>Basta <code>display: flex</code> no pai: os filhos diretos viram <strong>itens flex</strong> e ficam lado a lado.</p>
${codigo(`<style>
  .linha { display: flex; gap: 12px; }
  .linha div { background: #e0ecf8; padding: 16px; border-radius: 8px; }
</style>

<div class="linha">
  <div>Um</div>
  <div>Dois</div>
  <div>Três</div>
</div>`)}

<h2>Os dois eixos</h2>
<p>O flexbox pensa em dois eixos. O <strong>principal</strong> segue a direção (<code>flex-direction: row</code>, o padrão, é horizontal; <code>column</code> é vertical). O <strong>transversal</strong> é o outro.</p>
<ul>
  <li><code>justify-content</code> distribui os itens no eixo principal: <code>flex-start</code>, <code>center</code>, <code>space-between</code> (pontas encostadas, espaço igual entre eles), <code>space-around</code>.</li>
  <li><code>align-items</code> alinha no eixo transversal: <code>stretch</code> (o padrão, estica), <code>center</code>, <code>flex-start</code>, <code>flex-end</code>.</li>
  <li><code>gap</code> define o espaço entre os itens, sem precisar de margens.</li>
</ul>
${codigo(`<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #1d4e89;
    color: white;
  }
  nav { display: flex; gap: 16px; }
  nav a { color: white; }
  .logo { font-size: 1.5rem; font-weight: 700; }
</style>

<header>
  <span class="logo">Loja</span>
  <nav>
    <a href="#">Produtos</a>
    <a href="#">Sobre</a>
    <a href="#">Contato</a>
  </nav>
</header>`)}

<h2>Centralizar de verdade</h2>
<p>A pergunta mais antiga do CSS, "como centralizo isso na vertical?", tem resposta curta com flexbox:</p>
${codigo(`<style>
  .palco {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background: #f4f1ea;
  }
</style>

<div class="palco"><p>Bem no meio</p></div>`)}

<h2>Crescer, encolher e quebrar a linha</h2>
<ul>
  <li><code>flex: 1</code> num item faz ele ocupar todo o espaço que sobrar. Útil num campo de busca ao lado de um botão.</li>
  <li><code>flex-wrap: wrap</code> no contêiner deixa os itens descerem para a próxima linha quando não couberem.</li>
</ul>
${codigo(`<style>
  .busca { display: flex; gap: 8px; }
  .busca input { flex: 1; padding: 8px; }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
  .tags span { background: #eee; padding: 4px 10px; border-radius: 999px; }
</style>

<form class="busca">
  <input type="search" placeholder="Buscar..." aria-label="Buscar">
  <button>Buscar</button>
</form>
<div class="tags">
  <span>css</span><span>flexbox</span><span>layout</span><span>alinhamento</span><span>responsivo</span><span>gap</span><span>eixos</span>
</div>`)}
`,
              quiz: [
                {
                  pergunta:
                    'Num contêiner com flex-direction: row, qual propriedade centraliza os itens na horizontal?',
                  opcoes: ['align-items: center', 'justify-content: center', 'text-align: center'],
                  certa: 1,
                  explicacao: 'Em row, o eixo principal é o horizontal, e quem cuida dele é o justify-content.'
                },
                {
                  pergunta: 'Qual valor de justify-content encosta o primeiro e o último item nas pontas?',
                  opcoes: ['space-between', 'space-around', 'center'],
                  certa: 0,
                  explicacao:
                    'space-between põe todo o espaço livre entre os itens, nada nas pontas. Ideal para logo de um lado e menu do outro.'
                },
                {
                  pergunta: 'O que flex: 1 faz num item?',
                  opcoes: [
                    'Deixa o item com 1px',
                    'Faz o item ocupar o espaço que sobra no contêiner',
                    'Coloca o item em primeiro lugar'
                  ],
                  certa: 1,
                  explicacao:
                    'flex: 1 faz o item crescer para preencher o espaço livre, dividido com outros itens que também tenham flex.'
                }
              ]
            },
            {
              id: 'grid',
              titulo: 'Grid',
              resumo: 'Linhas e colunas ao mesmo tempo: galerias, painéis e o esqueleto da página.',
              minutos: 12,
              corpo: `
<p>O flexbox pensa numa direção de cada vez. O <strong>grid</strong> pensa em duas: linhas e colunas ao mesmo tempo. Use flexbox para alinhar itens numa fila e grid para montar uma grade.</p>

<h2>Definindo colunas</h2>
<p>Com <code>display: grid</code> no pai, <code>grid-template-columns</code> diz quantas colunas existem e qual a largura de cada uma. A unidade <code>fr</code> (fração) divide o espaço disponível.</p>
${codigo(`<style>
  .grade {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
  }
  .grade div { background: #e0ecf8; padding: 20px; border-radius: 8px; text-align: center; }
</style>

<div class="grade">
  <div>1</div><div>2</div><div>3</div>
  <div>4</div><div>5</div><div>6</div>
</div>`)}
<ul>
  <li><code>1fr 1fr 1fr</code>: três colunas iguais. O mesmo que <code>repeat(3, 1fr)</code>.</li>
  <li><code>250px 1fr</code>: uma barra lateral fixa e o resto para o conteúdo.</li>
  <li><code>2fr 1fr</code>: a primeira coluna tem o dobro da segunda.</li>
</ul>

<h2>A grade que se ajusta sozinha</h2>
<p>Esta é uma das linhas mais úteis do CSS. Ela cria quantas colunas couberem, cada uma com no mínimo 180px, e divide o que sobrar:</p>
${codigo(`<style>
  .galeria {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }
  .galeria div { background: hsl(200 60% 85%); height: 100px; border-radius: 8px; }
</style>

<div class="galeria">
  <div></div><div></div><div></div><div></div><div></div><div></div>
</div>`)}
<p>Sem nenhuma media query, a galeria tem uma coluna no celular e quatro ou cinco numa tela larga.</p>

<h2>Itens que ocupam mais espaço</h2>
<p>Um item pode atravessar várias colunas ou linhas com <code>grid-column</code> e <code>grid-row</code>. <code>span 2</code> significa "ocupe duas".</p>
${codigo(`<style>
  .painel { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .painel div { background: #f4f1ea; padding: 16px; border-radius: 8px; }
  .painel .grande { grid-column: span 2; background: #fde2c8; }
</style>

<div class="painel">
  <div class="grande">Destaque (2 colunas)</div>
  <div>B</div>
  <div>C</div>
  <div>D</div>
  <div>E</div>
</div>`)}

<h2>Áreas com nome</h2>
<p>Para o esqueleto de uma página, dá para desenhar o layout com nomes, como um mapa:</p>
${codigo(`<style>
  .pagina {
    display: grid;
    grid-template-columns: 160px 1fr;
    grid-template-areas:
      "topo   topo"
      "lateral conteudo"
      "rodape rodape";
    gap: 8px;
  }
  .pagina > * { padding: 12px; background: #e0ecf8; border-radius: 6px; }
  header { grid-area: topo; }
  aside  { grid-area: lateral; }
  main   { grid-area: conteudo; }
  footer { grid-area: rodape; }
</style>

<div class="pagina">
  <header>Topo</header>
  <aside>Lateral</aside>
  <main>Conteúdo</main>
  <footer>Rodapé</footer>
</div>`)}
`,
              quiz: [
                {
                  pergunta: 'O que significa grid-template-columns: 2fr 1fr?',
                  opcoes: [
                    'Duas colunas de 2px e 1px',
                    'Duas colunas, a primeira com o dobro da largura da segunda',
                    'Três colunas'
                  ],
                  certa: 1,
                  explicacao: 'fr divide o espaço livre em frações: 2 partes para a primeira, 1 para a segunda.'
                },
                {
                  pergunta: 'O que repeat(auto-fit, minmax(200px, 1fr)) faz?',
                  opcoes: [
                    'Cria sempre 200 colunas',
                    'Cria quantas colunas de pelo menos 200px couberem',
                    'Cria uma coluna de 200px'
                  ],
                  certa: 1,
                  explicacao: 'O número de colunas muda com a largura disponível, sem precisar de media query.'
                },
                {
                  pergunta: 'Quando preferir grid a flexbox?',
                  opcoes: [
                    'Quando o layout tem linhas e colunas ao mesmo tempo',
                    'Sempre, flexbox está ultrapassado',
                    'Só para tabelas'
                  ],
                  certa: 0,
                  explicacao:
                    'Os dois são atuais. Flexbox alinha numa direção (um menu, uma barra); grid monta grades em duas dimensões.'
                }
              ]
            },
            {
              id: 'desafio-layout',
              tipo: 'desafio',
              titulo: 'Desafio: cabeçalho e vitrine',
              resumo: 'Monte o topo de uma loja com flexbox e a vitrine de produtos com grid.',
              minutos: 20,
              enunciado: `
<p>Uma loja precisa de um cabeçalho com o logo de um lado e o menu do outro, e de uma vitrine com os produtos lado a lado. O HTML está pronto: faça o layout com flexbox e grid.</p>`,
              inicial: `<style>
  /* Escreva seu CSS aqui */

</style>

<header>
  <span class="logo">Café da Serra</span>
  <ul class="menu">
    <li><a href="#">Cafés</a></li>
    <li><a href="#">Sobre</a></li>
    <li><a href="#">Contato</a></li>
  </ul>
</header>

<main class="vitrine">
  <article class="produto"><h2>Catuaí</h2><p>Notas de chocolate.</p></article>
  <article class="produto"><h2>Bourbon</h2><p>Doce e encorpado.</p></article>
  <article class="produto"><h2>Mundo Novo</h2><p>Leve e frutado.</p></article>
  <article class="produto"><h2>Arara</h2><p>Acidez cítrica.</p></article>
</main>
`,
              testes: [
                [
                  'Usar display: flex no header',
                  doc => doc.defaultView.getComputedStyle(doc.querySelector('header')).display === 'flex'
                ],
                [
                  'Separar o logo e o menu nas pontas do header (space-between)',
                  doc =>
                    doc.defaultView.getComputedStyle(doc.querySelector('header')).justifyContent === 'space-between'
                ],
                [
                  'Alinhar o logo e o menu na vertical (align-items: center)',
                  doc => doc.defaultView.getComputedStyle(doc.querySelector('header')).alignItems === 'center'
                ],
                [
                  'Colocar os itens do .menu lado a lado, sem marcadores',
                  doc => {
                    const s = doc.defaultView.getComputedStyle(doc.querySelector('.menu'));
                    return s.display === 'flex' && s.listStyleType === 'none';
                  }
                ],
                [
                  'Usar display: grid na .vitrine',
                  doc => doc.defaultView.getComputedStyle(doc.querySelector('.vitrine')).display === 'grid'
                ],
                [
                  'Definir as colunas da .vitrine com grid-template-columns',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return (
                      /grid-template-columns\s*:/.test(css) &&
                      doc.defaultView.getComputedStyle(doc.querySelector('.vitrine')).gridTemplateColumns !== 'none'
                    );
                  }
                ],
                [
                  'Separar os produtos com gap',
                  doc => parseFloat(doc.defaultView.getComputedStyle(doc.querySelector('.vitrine')).columnGap) > 0
                ]
              ],
              solucao: `<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 12px 0;
  }
  .logo { font-weight: 700; font-size: 1.25rem; }
  .menu { display: flex; gap: 16px; list-style: none; margin: 0; padding: 0; }
  .vitrine {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
  .produto { padding: 12px; border: 1px solid #ddd; border-radius: 10px; }
</style>

<header>
  <span class="logo">Café da Serra</span>
  <ul class="menu">
    <li><a href="#">Cafés</a></li>
    <li><a href="#">Sobre</a></li>
    <li><a href="#">Contato</a></li>
  </ul>
</header>

<main class="vitrine">
  <article class="produto"><h2>Catuaí</h2><p>Notas de chocolate.</p></article>
  <article class="produto"><h2>Bourbon</h2><p>Doce e encorpado.</p></article>
  <article class="produto"><h2>Mundo Novo</h2><p>Leve e frutado.</p></article>
  <article class="produto"><h2>Arara</h2><p>Acidez cítrica.</p></article>
</main>`
            }
          ]
        },
        {
          titulo: 'Responsivo',
          itens: [
            {
              id: 'media-queries',
              titulo: 'Media queries',
              resumo: 'Mudar o layout conforme a tela, começando pelo celular.',
              minutos: 10,
              corpo: `
<p>Mais da metade do acesso à internet no Brasil vem do celular. Um site <strong>responsivo</strong> se adapta a qualquer largura de tela, do celular ao monitor grande.</p>

<h2>A media query</h2>
<p>Uma <strong>media query</strong> aplica regras só quando uma condição é verdadeira. A mais comum compara a largura da tela:</p>
${trecho(`/* Só quando a tela tiver 700px de largura ou mais */
@media (min-width: 700px) {
  .colunas { grid-template-columns: 1fr 1fr; }
}`)}

<h2>Começar pelo celular (mobile first)</h2>
<p>A abordagem recomendada é escrever primeiro o CSS para a tela pequena, sem media query, e usar <code>min-width</code> para <em>acrescentar</em> coisas quando sobrar espaço. Fica mais simples, porque o layout de celular costuma ser uma coluna só, que é o comportamento natural do HTML.</p>
${codigo(`<style>
  .colunas { display: grid; gap: 12px; }
  .colunas div { background: #e0ecf8; padding: 16px; border-radius: 8px; }

  @media (min-width: 500px) {
    .colunas { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 800px) {
    .colunas { grid-template-columns: repeat(4, 1fr); }
  }
</style>

<div class="colunas">
  <div>A</div><div>B</div><div>C</div><div>D</div>
</div>
<p>Abra esta página no celular ou estreite a janela para ver as colunas mudarem.</p>`)}
${dica('Escolha os pontos de quebra pelo conteúdo, não por modelos de aparelho. Estreite a janela até o layout ficar ruim: ali é o lugar da media query.')}

<h2>Não esqueça a meta viewport</h2>
<p>Sem <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code> no <code>&lt;head&gt;</code>, o celular finge ter uma tela de computador e as media queries nunca disparam como esperado.</p>

<h2>Outras condições úteis</h2>
<ul>
  <li><code>(prefers-color-scheme: dark)</code>: a pessoa usa o sistema no modo escuro.</li>
  <li><code>(prefers-reduced-motion: reduce)</code>: a pessoa pediu menos animação. Veremos no nível avançado.</li>
  <li><code>(hover: hover)</code>: o aparelho tem um mouse de verdade, então dá para depender de efeitos ao passar o mouse.</li>
  <li><code>print</code>: estilos para quando a página é impressa.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'No mobile first, o CSS sem media query é para qual tela?',
                  opcoes: ['A tela grande', 'A tela pequena', 'Só para impressão'],
                  certa: 1,
                  explicacao:
                    'Escreve-se primeiro para o celular, e as media queries com min-width acrescentam o layout das telas maiores.'
                },
                {
                  pergunta: 'O que @media (min-width: 700px) significa?',
                  opcoes: ['Até 700px de largura', 'A partir de 700px de largura', 'Exatamente 700px'],
                  certa: 1,
                  explicacao: 'min-width: 700px vale para larguras de 700px para cima.'
                },
                {
                  pergunta: 'Como escolher onde colocar um ponto de quebra?',
                  opcoes: [
                    'Pela largura do iPhone mais vendido',
                    'Onde o conteúdo começa a ficar ruim',
                    'Sempre em 768px'
                  ],
                  certa: 1,
                  explicacao: 'Aparelhos mudam todo ano. O conteúdo é que diz quando o layout precisa mudar.'
                }
              ]
            },
            {
              id: 'medidas-fluidas',
              titulo: 'Medidas fluidas',
              resumo: 'max-width, clamp(), vw e imagens que nunca estouram a tela.',
              minutos: 9,
              corpo: `
<p>Media queries mudam o layout em pontos fixos. <strong>Medidas fluidas</strong> fazem as coisas crescerem e encolherem de forma contínua, e muitas vezes dispensam a media query.</p>

<h2>max-width em vez de width</h2>
<p><code>width: 900px</code> estoura a tela de um celular de 360px. <code>max-width: 900px</code> diz "no máximo 900px", e a caixa encolhe quando não houver espaço. Essa troca simples resolve muitos layouts quebrados.</p>
${codigo(`<style>
  .conteudo {
    max-width: 40rem;
    margin: 0 auto;
    padding: 0 16px;
  }
</style>

<div class="conteudo">
  <h1>Uma coluna de leitura</h1>
  <p>Numa tela grande, este texto fica centralizado com no máximo 40rem. Num celular, ocupa a largura toda, com 16px de folga nas laterais.</p>
</div>`)}

<h2>Imagens que não estouram</h2>
${trecho(`img, video {
  max-width: 100%;
  height: auto;
}`)}
<p>Com isso, a imagem nunca passa da largura de quem a contém, e a altura acompanha para manter a proporção.</p>

<h2>Unidades da tela</h2>
<p><code>vw</code> e <code>vh</code> são 1% da largura e da altura da tela. <code>100vh</code> parece "a tela inteira", mas no celular a barra de endereço muda de tamanho; prefira <code>100dvh</code> (altura dinâmica), que acompanha essa barra.</p>

<h2>clamp(): mínimo, ideal e máximo</h2>
<p><code>clamp(mínimo, ideal, máximo)</code> escolhe o valor ideal, mas nunca sai dos limites. É perfeito para títulos que crescem com a tela sem ficar minúsculos no celular nem gigantes no monitor:</p>
${codigo(`<style>
  h1 { font-size: clamp(1.75rem, 1rem + 4vw, 3.5rem); line-height: 1.1; }
  .secao { padding: clamp(16px, 5vw, 64px); background: #f4f1ea; }
</style>

<div class="secao">
  <h1>Título fluido</h1>
  <p>Estreite e alargue a janela: o título e o espaço em volta acompanham, dentro dos limites.</p>
</div>`)}
<p>Também existem <code>min()</code> e <code>max()</code>. <code>width: min(100%, 600px)</code> é outra forma de dizer "toda a largura, mas no máximo 600px".</p>
${dica('Combine as duas ideias: medidas fluidas para tamanhos e espaços, e media queries só quando o layout precisa mudar de forma, como passar de uma coluna para duas.')}
`,
              quiz: [
                {
                  pergunta: 'Por que max-width: 900px é melhor que width: 900px num contêiner?',
                  opcoes: [
                    'Carrega mais rápido',
                    'Deixa a caixa encolher em telas menores que 900px',
                    'Centraliza a caixa'
                  ],
                  certa: 1,
                  explicacao: 'width trava em 900px e estoura o celular. max-width só define o limite de cima.'
                },
                {
                  pergunta: 'Em clamp(1rem, 4vw, 3rem), qual é o tamanho numa tela muito pequena?',
                  opcoes: ['1rem', '4vw', '3rem'],
                  certa: 0,
                  explicacao: 'Quando 4vw fica menor que o mínimo, o clamp usa o mínimo: 1rem.'
                },
                {
                  pergunta: 'Qual regra impede uma imagem de passar da largura da tela?',
                  opcoes: [
                    'img { width: 100vw; }',
                    'img { max-width: 100%; height: auto; }',
                    'img { overflow: hidden; }'
                  ],
                  certa: 1,
                  explicacao: 'max-width: 100% limita a imagem ao contêiner, e height: auto mantém a proporção.'
                }
              ]
            },
            {
              id: 'desafio-responsivo',
              tipo: 'desafio',
              titulo: 'Desafio: página responsiva',
              resumo: 'Deixe uma página de receitas boa de ler no celular e no computador.',
              minutos: 20,
              enunciado: `
<p>Esta página de receitas foi feita só para computador: tem largura fixa e não se adapta. Reescreva o CSS no estilo mobile first, com medidas fluidas e uma media query para as telas maiores.</p>`,
              inicial: `<style>
  .conteudo { width: 960px; margin: 0 auto; }
  h1 { font-size: 48px; }
  .receitas { display: grid; grid-template-columns: 300px 300px 300px; gap: 20px; }
  .receita { padding: 16px; background: #f4f1ea; border-radius: 10px; }
</style>

<div class="conteudo">
  <h1>Receitas da semana</h1>
  <div class="receitas">
    <div class="receita"><h2>Bolo de fubá</h2><p>40 minutos</p></div>
    <div class="receita"><h2>Escondidinho</h2><p>1 hora</p></div>
    <div class="receita"><h2>Salada de grão-de-bico</h2><p>15 minutos</p></div>
  </div>
</div>
`,
              testes: [
                [
                  'Tirar as larguras fixas grandes (width de 400px ou mais)',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return ![...css.matchAll(/(^|[^-\w])width\s*:\s*(\d+)px/g)].some(m => Number(m[2]) >= 400);
                  }
                ],
                [
                  'Limitar o .conteudo com max-width em rem, em ou ch',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return (
                      /max-width\s*:\s*[\d.]+(rem|em|ch)/.test(css) &&
                      doc.defaultView.getComputedStyle(doc.querySelector('.conteudo')).maxWidth !== 'none'
                    );
                  }
                ],
                [
                  'Usar clamp() no tamanho do título',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return /font-size\s*:\s*clamp\(/.test(css);
                  }
                ],
                [
                  'Ter uma media query com min-width (mobile first) com pelo menos uma regra',
                  doc =>
                    [...doc.styleSheets]
                      .filter(s => !s.ownerNode.hasAttribute('data-base'))
                      .flatMap(s => [...s.cssRules])
                      .some(r => r.media && /min-width/.test(r.media.mediaText) && r.cssRules.length > 0)
                ],
                [
                  'Deixar as .receitas em uma coluna só fora da media query',
                  doc => {
                    const regras = [...doc.styleSheets]
                      .filter(s => !s.ownerNode.hasAttribute('data-base'))
                      .flatMap(s => [...s.cssRules])
                      .filter(r => r.selectorText && r.selectorText.includes('.receitas'));
                    return regras.every(r => {
                      const colunas = r.style.gridTemplateColumns;
                      return !colunas || colunas === '1fr' || /auto-(fit|fill)/.test(colunas);
                    });
                  }
                ]
              ],
              solucao: `<style>
  .conteudo { max-width: 60rem; margin: 0 auto; padding: 0 16px; }
  h1 { font-size: clamp(1.75rem, 1rem + 4vw, 3rem); }
  .receitas { display: grid; gap: 16px; }
  .receita { padding: 16px; background: #f4f1ea; border-radius: 10px; }

  @media (min-width: 640px) {
    .receitas { grid-template-columns: repeat(3, 1fr); }
  }
</style>

<div class="conteudo">
  <h1>Receitas da semana</h1>
  <div class="receitas">
    <div class="receita"><h2>Bolo de fubá</h2><p>40 minutos</p></div>
    <div class="receita"><h2>Escondidinho</h2><p>1 hora</p></div>
    <div class="receita"><h2>Salada de grão-de-bico</h2><p>15 minutos</p></div>
  </div>
</div>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'O CSS de hoje: variáveis, temas, animações que respeitam a pessoa e seletores modernos.',
      modulos: [
        {
          titulo: 'CSS moderno',
          itens: [
            {
              id: 'variaveis-e-temas',
              titulo: 'Variáveis e temas',
              resumo: 'Custom properties, var() e o modo escuro com prefers-color-scheme.',
              minutos: 11,
              corpo: `
<p>Num site de verdade, a mesma cor aparece em dezenas de lugares. Se ela mudar, procurar e trocar uma por uma é lento e arriscado. As <strong>variáveis CSS</strong> (oficialmente, <em>custom properties</em>) guardam um valor com nome, para usar em qualquer lugar.</p>

<h2>Declarar e usar</h2>
<p>Variáveis começam com dois hifens e costumam ficar em <code>:root</code> (o elemento <code>&lt;html&gt;</code>), para valerem na página toda. Para usar, chame <code>var()</code>:</p>
${codigo(`<style>
  :root {
    --cor-marca: #1d4e89;
    --cor-fundo: #ffffff;
    --raio: 12px;
  }
  .cartao {
    border: 2px solid var(--cor-marca);
    border-radius: var(--raio);
    background: var(--cor-fundo);
    padding: 16px;
  }
  .cartao h2 { color: var(--cor-marca); margin-top: 0; }
  .botao {
    background: var(--cor-marca);
    color: white;
    border: 0;
    padding: 8px 16px;
    border-radius: var(--raio);
  }
</style>

<div class="cartao">
  <h2>Variáveis</h2>
  <p>Troque o valor de --cor-marca e veja a borda, o título e o botão mudarem juntos.</p>
  <button class="botao">Ação</button>
</div>`)}
<p><code>var()</code> aceita um valor reserva para quando a variável não existir: <code>var(--espaco, 16px)</code>.</p>

<h2>Elas seguem a cascata</h2>
<p>Diferente das variáveis de outras linguagens, as do CSS são herdadas e podem ser redefinidas em qualquer seletor. Um componente pode ter sua própria versão:</p>
${trecho(`.alerta { --cor-marca: #b5482b; } /* dentro de .alerta, tudo que usa a variável fica laranja */`)}

<h2>Modo escuro</h2>
<p>Juntando variáveis com a media query <code>prefers-color-scheme</code>, o tema escuro vira só uma troca de valores:</p>
${codigo(`<style>
  :root {
    --fundo: #ffffff;
    --texto: #1f2933;
    --suave: #eef2f6;
    color-scheme: light dark;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --fundo: #10161c;
      --texto: #e6edf3;
      --suave: #1c2630;
    }
  }
  body { background: var(--fundo); color: var(--texto); }
  .caixa { background: var(--suave); padding: 16px; border-radius: 10px; }
</style>

<div class="caixa">Mude o tema do seu sistema para escuro e esta página acompanha.</div>`)}
<p><code>color-scheme: light dark</code> avisa o navegador que a página suporta os dois temas, e ele ajusta sozinho as barras de rolagem e os campos de formulário.</p>
${dica('Dê nomes pelo papel (<code>--texto</code>, <code>--fundo</code>, <code>--destaque</code>), não pela cor (<code>--azul</code>). No modo escuro, <code>--azul</code> pode precisar virar outro tom, e o nome deixaria de fazer sentido.')}
`,
              quiz: [
                {
                  pergunta: 'Como se usa a variável --cor-marca numa propriedade?',
                  opcoes: ['color: --cor-marca;', 'color: var(--cor-marca);', 'color: $cor-marca;'],
                  certa: 1,
                  explicacao: 'O valor é lido com var(). $ é a sintaxe do Sass, não do CSS.'
                },
                {
                  pergunta: 'Por que declarar as variáveis em :root?',
                  opcoes: [
                    'Porque é obrigatório',
                    'Para que valham na página inteira, por herança',
                    'Para carregar mais rápido'
                  ],
                  certa: 1,
                  explicacao:
                    ':root é o elemento <html>, o ancestral de todos. As variáveis declaradas nele são herdadas por toda a página.'
                },
                {
                  pergunta: 'Qual o jeito mais simples de fazer um tema escuro com variáveis?',
                  opcoes: [
                    'Duplicar todas as regras do CSS',
                    'Redefinir os valores das variáveis dentro de @media (prefers-color-scheme: dark)',
                    'Usar filter: invert(1) na página'
                  ],
                  certa: 1,
                  explicacao: 'As regras continuam as mesmas; só os valores das variáveis mudam.'
                }
              ]
            },
            {
              id: 'transicoes-e-animacoes',
              titulo: 'Transições e animações',
              resumo: 'transition, @keyframes, transform e o respeito a quem pediu menos movimento.',
              minutos: 11,
              corpo: `
<p>Movimento bem usado explica o que está acontecendo: um botão que responde ao toque, um menu que desliza de onde veio. Mal usado, distrai e pode até causar enjoo em algumas pessoas.</p>

<h2>transition: do estado A ao B</h2>
<p>Uma <strong>transição</strong> suaviza a mudança de uma propriedade. Você diz qual propriedade, quanto tempo e a curva de velocidade:</p>
${codigo(`<style>
  .botao {
    background: #1d4e89;
    color: white;
    border: 0;
    padding: 12px 20px;
    border-radius: 10px;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
  .botao:hover { background: #2f6fb8; transform: translateY(-2px); }
  .botao:active { transform: translateY(0); }
</style>

<button class="botao">Passe o mouse</button>`)}

<h2>transform: mexer sem bagunçar o layout</h2>
<p><code>transform</code> move (<code>translate</code>), gira (<code>rotate</code>) e muda o tamanho (<code>scale</code>) de um elemento <em>depois</em> que o layout foi calculado, sem empurrar os vizinhos. Animar <code>transform</code> e <code>opacity</code> é bem mais leve para o navegador do que animar <code>width</code>, <code>top</code> ou <code>margin</code>.</p>

<h2>@keyframes: animações com etapas</h2>
<p>Quando o movimento precisa de várias etapas ou se repetir, use <code>@keyframes</code> para descrevê-lo e <code>animation</code> para aplicá-lo:</p>
${codigo(`<style>
  @keyframes pulsar {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.15); opacity: 0.7; }
  }
  .ponto {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: crimson;
    animation: pulsar 1.2s ease-in-out infinite;
  }
  @keyframes entrar {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: none; }
  }
  .aviso { animation: entrar 0.5s ease both; }
</style>

<p class="aviso">Gravando <span class="ponto" style="display:inline-block"></span></p>`)}

<h2>Menos movimento para quem pediu</h2>
<p>Algumas pessoas sentem tontura ou náusea com animações (é comum em quem tem labirintite ou enxaqueca) e ativam a opção "reduzir movimento" no sistema. Respeite essa escolha:</p>
${trecho(`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`)}
<p>Este é um dos raros casos em que o <code>!important</code> faz sentido: a preferência da pessoa deve vencer qualquer animação do site.</p>
${dica('Transições de interface ficam boas entre 150 e 300 milissegundos. Mais que isso, o site parece lento.')}
`,
              quiz: [
                {
                  pergunta: 'Quais propriedades são mais leves para animar?',
                  opcoes: ['width e height', 'top e left', 'transform e opacity'],
                  certa: 2,
                  explicacao:
                    'transform e opacity não recalculam o layout da página, então o navegador anima sem engasgos.'
                },
                {
                  pergunta: 'Quando usar @keyframes em vez de transition?',
                  opcoes: [
                    'Quando o movimento tem várias etapas ou se repete sozinho',
                    'Sempre que houver hover',
                    'Nunca, transition faz tudo'
                  ],
                  certa: 0,
                  explicacao:
                    'transition vai de um estado a outro quando algo muda. @keyframes descreve uma sequência que roda por conta própria.'
                },
                {
                  pergunta: 'Para que serve @media (prefers-reduced-motion: reduce)?',
                  opcoes: [
                    'Deixar o site mais rápido',
                    'Desligar ou suavizar animações para quem pediu menos movimento',
                    'Detectar celulares'
                  ],
                  certa: 1,
                  explicacao:
                    'Ela reflete uma configuração de acessibilidade do sistema. Movimento pode causar mal-estar real.'
                }
              ]
            },
            {
              id: 'seletores-modernos',
              titulo: 'Seletores modernos',
              resumo: ':focus-visible, :is(), :where(), :has() e CSS aninhado.',
              minutos: 11,
              corpo: `
<p>O CSS ganhou nos últimos anos seletores que antes exigiam JavaScript ou muita repetição. Todos funcionam nos navegadores atuais.</p>

<h2>:focus-visible</h2>
<p>Quem navega pelo teclado depende do contorno de foco para saber onde está. <code>:focus</code> mostra o contorno até num clique de mouse, e muita gente apaga o contorno por isso, o que é um erro grave de acessibilidade. <code>:focus-visible</code> só aparece quando o navegador acha que o foco precisa ser visto, como na navegação com Tab:</p>
${codigo(`<style>
  .botao { padding: 10px 16px; border: 0; border-radius: 8px; background: #1d4e89; color: white; }
  .botao:focus-visible { outline: 3px solid #f5a623; outline-offset: 3px; }
</style>

<button class="botao">Clique em mim</button>
<button class="botao">Depois aperte Tab</button>`)}
${dica('Nunca use <code>outline: none</code> sem colocar outro indicador de foco no lugar.')}

<h2>:is() e :where(): menos repetição</h2>
<p><code>:is()</code> agrupa seletores dentro de um seletor maior. Em vez de escrever três seletores longos:</p>
${trecho(`/* Antes */
article h1, article h2, article h3 { line-height: 1.2; }

/* Com :is() */
article :is(h1, h2, h3) { line-height: 1.2; }`)}
<p><code>:where()</code> faz o mesmo, mas com especificidade zero. É ótimo para estilos padrão que devem ser fáceis de sobrescrever.</p>

<h2>:has(): o seletor de pai</h2>
<p>Por anos, o CSS só conseguia olhar para dentro: estilizar um filho com base no pai. <code>:has()</code> inverte: estiliza um elemento com base no que ele <em>contém</em>.</p>
${codigo(`<style>
  .campo { padding: 12px; border: 2px solid #ccc; border-radius: 10px; margin-bottom: 8px; }
  .campo:has(input:checked) { border-color: #0b7a6f; background: #e6f6f3; }
  .cartao:has(img) { display: grid; grid-template-columns: 80px 1fr; gap: 12px; }
</style>

<label class="campo"><input type="checkbox"> Quero receber novidades</label>
<label class="campo"><input type="checkbox"> Aceito os termos</label>`)}
<p>Sem nenhuma linha de JavaScript, o cartão muda quando a caixa é marcada.</p>

<h2>CSS aninhado</h2>
<p>Agora dá para escrever regras dentro de regras, como nos pré-processadores. O <code>&amp;</code> representa o seletor de fora:</p>
${codigo(`<style>
  .cartao {
    padding: 16px;
    border-radius: 12px;
    background: #f4f1ea;

    h2 { margin-top: 0; color: #1d4e89; }

    &:hover { background: #ece6d9; }

    @media (min-width: 600px) {
      padding: 32px;
    }
  }
</style>

<div class="cartao">
  <h2>Aninhamento</h2>
  <p>Tudo o que é do cartão fica junto, num bloco só.</p>
</div>`)}
${dica('Aninhe pouco: dois ou três níveis no máximo. Aninhamento fundo gera seletores longos e com especificidade alta, justamente o que a aula de cascata ensinou a evitar.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a vantagem de :focus-visible sobre :focus?',
                  opcoes: [
                    'Funciona em mais elementos',
                    'Mostra o indicador de foco para quem usa teclado, sem aparecer em todo clique de mouse',
                    'Deixa o foco invisível'
                  ],
                  certa: 1,
                  explicacao:
                    'O navegador decide quando o foco precisa ser visto. Assim ninguém tem motivo para apagar o contorno.'
                },
                {
                  pergunta: 'O que .cartao:has(img) seleciona?',
                  opcoes: [
                    'Imagens dentro de .cartao',
                    'Os .cartao que contêm uma imagem',
                    'Imagens com a classe cartao'
                  ],
                  certa: 1,
                  explicacao: ':has() seleciona o elemento de fora com base no que existe dentro dele.'
                },
                {
                  pergunta: 'Qual a diferença entre :is() e :where()?',
                  opcoes: [':where() tem especificidade zero', ':is() só aceita tags', 'Nenhuma, são sinônimos'],
                  certa: 0,
                  explicacao: ':is() assume a especificidade do seletor mais forte da lista. :where() não pesa nada.'
                }
              ]
            },
            {
              id: 'desafio-tema',
              tipo: 'desafio',
              titulo: 'Desafio: tema claro e escuro',
              resumo: 'Monte um componente com variáveis, modo escuro, transições e foco acessível.',
              minutos: 25,
              enunciado: `
<p>Este cartão de plano de assinatura usa cores soltas pelo código, não tem modo escuro e o botão não dá nenhum retorno. Reorganize o CSS com variáveis e deixe o componente pronto para produção.</p>`,
              inicial: `<style>
  .plano {
    max-width: 22rem;
    padding: 24px;
    border-radius: 16px;
    background: #ffffff;
    color: #1f2933;
    border: 1px solid #d5dde5;
  }
  .preco { font-size: 2rem; font-weight: 700; color: #1d4e89; }
  .assinar {
    padding: 12px 20px;
    border: 0;
    border-radius: 10px;
    background: #1d4e89;
    color: white;
    font: inherit;
  }
</style>

<div class="plano">
  <h2>Plano anual</h2>
  <p class="preco">R$ 19/mês</p>
  <p>Acesso a todas as trilhas, com certificado.</p>
  <button class="assinar">Assinar</button>
</div>
`,
              testes: [
                [
                  'Declarar variáveis (--algo) em :root',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return /:root\s*\{[^}]*--[\w-]+\s*:/.test(css);
                  }
                ],
                [
                  'Usar var() em pelo menos 4 lugares',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return (css.match(/var\(\s*--/g) || []).length >= 4;
                  }
                ],
                [
                  'Redefinir as variáveis em @media (prefers-color-scheme: dark)',
                  doc =>
                    [...doc.styleSheets]
                      .filter(s => !s.ownerNode.hasAttribute('data-base'))
                      .flatMap(s => [...s.cssRules])
                      .some(
                        r =>
                          r.media &&
                          /prefers-color-scheme:\s*dark/.test(r.media.mediaText) &&
                          /--[\w-]+\s*:/.test(r.cssText)
                      )
                ],
                [
                  'Dar uma transição ao botão .assinar',
                  doc => {
                    const s = doc.defaultView.getComputedStyle(doc.querySelector('.assinar'));
                    return s.transitionDuration.split(',').some(d => parseFloat(d) > 0);
                  }
                ],
                [
                  'Mudar o visual do .assinar no :hover',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return /(\.assinar|&):hover[^{]*\{[^}]*\w/.test(css);
                  }
                ],
                [
                  'Mostrar um contorno de foco no .assinar com :focus-visible',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')]
                      .map(s => s.textContent)
                      .join('\n')
                      .replace(/\/\*[\s\S]*?\*\//g, '');
                    return /:focus-visible[^{]*\{[^}]*outline\s*:/.test(css);
                  }
                ],
                [
                  'Desligar a transição para quem pediu menos movimento',
                  doc =>
                    [...doc.styleSheets]
                      .filter(s => !s.ownerNode.hasAttribute('data-base'))
                      .flatMap(s => [...s.cssRules])
                      .some(r => r.media && /prefers-reduced-motion/.test(r.media.mediaText) && r.cssRules.length > 0)
                ]
              ],
              solucao: `<style>
  :root {
    --fundo: #ffffff;
    --texto: #1f2933;
    --borda: #d5dde5;
    --marca: #1d4e89;
    --marca-forte: #163b68;
    color-scheme: light dark;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --fundo: #161d24;
      --texto: #e6edf3;
      --borda: #2c3a47;
      --marca: #7fb3ff;
      --marca-forte: #a8cbff;
    }
  }
  .plano {
    max-width: 22rem;
    padding: 24px;
    border-radius: 16px;
    background: var(--fundo);
    color: var(--texto);
    border: 1px solid var(--borda);
  }
  .preco { font-size: 2rem; font-weight: 700; color: var(--marca); }
  .assinar {
    padding: 12px 20px;
    border: 0;
    border-radius: 10px;
    background: var(--marca);
    color: var(--fundo);
    font: inherit;
    transition: background-color 0.2s ease, transform 0.2s ease;
  }
  .assinar:hover { background: var(--marca-forte); transform: translateY(-2px); }
  .assinar:focus-visible { outline: 3px solid var(--marca); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .assinar { transition: none; }
  }
</style>

<div class="plano">
  <h2>Plano anual</h2>
  <p class="preco">R$ 19/mês</p>
  <p>Acesso a todas as trilhas, com certificado.</p>
  <button class="assinar">Assinar</button>
</div>`
            }
          ]
        },
        {
          titulo: 'Componentes que se adaptam',
          itens: [
            {
              id: 'container-queries',
              titulo: 'Container queries',
              resumo: 'Componentes que mudam conforme o espaço que têm, não o tamanho da tela.',
              minutos: 11,
              corpo: `
<p>Media queries perguntam o tamanho da <strong>tela</strong>. Mas um mesmo cartão pode estar numa coluna estreita da barra lateral e numa área larga do conteúdo, na mesma tela. As <strong>container queries</strong> perguntam o tamanho do <strong>contêiner</strong> onde o componente está, e ele se adapta sozinho onde quer que seja colocado.</p>

<h2>Como usar</h2>
<ol>
  <li>Marque o elemento pai como contêiner: <code>container-type: inline-size</code> (passa a ser possível consultar a largura dele).</li>
  <li>Escreva as regras com <code>@container</code>, como faria com <code>@media</code>.</li>
</ol>
${codigo(`<style>
  .area { container-type: inline-size; border: 2px dashed #9ab; padding: 8px; margin-bottom: 12px; }
  .cartao { display: flex; flex-direction: column; gap: 10px; background: #f3f6f8; padding: 12px; border-radius: 10px; }
  .cartao .foto { background: #0b7a6f; border-radius: 8px; min-height: 80px; flex: 0 0 120px; }

  @container (min-width: 420px) {
    .cartao { flex-direction: row; align-items: center; }
  }
</style>

<div class="area" style="width: 300px">
  <article class="cartao"><div class="foto"></div><p>Na área estreita, o cartão empilha.</p></article>
</div>
<div class="area" style="width: 560px">
  <article class="cartao"><div class="foto"></div><p>Na área larga, o mesmo cartão fica lado a lado.</p></article>
</div>`)}

<h2>Nomes e unidades</h2>
<p>Com contêineres aninhados, dê um nome (<code>container-name: lateral</code>, ou o atalho <code>container: lateral / inline-size</code>) e consulte por ele: <code>@container lateral (min-width: 300px)</code>. Também existem unidades relativas ao contêiner: <code>cqi</code> é 1% da largura dele. Um título com <code>font-size: clamp(1rem, 5cqi, 2rem)</code> cresce com o cartão, não com a tela.</p>
${dica('Regra prática: media queries para o <strong>layout da página</strong> (quantas colunas, onde fica o menu) e container queries para os <strong>componentes</strong> (cartões, widgets) que aparecem em lugares de larguras diferentes.')}

<h2>O seletor :has()</h2>
<p>Outro recurso que deixa componentes espertos: <code>:has()</code> estiliza um elemento conforme o que há <em>dentro</em> dele. Um cartão com imagem vira grade; um formulário com campo inválido ganha borda:</p>
${codigo(`<style>
  .cartao { padding: 12px; border: 1px solid #ccd; border-radius: 10px; margin: 8px 0; }
  .cartao:has(img) { display: grid; grid-template-columns: 80px 1fr; gap: 12px; }
  form:has(input:invalid) button { opacity: 0.5; }
</style>
<div class="cartao"><img src="https://picsum.photos/seed/cafe/80" alt="" width="80"><p>Com imagem: grade.</p></div>
<div class="cartao"><p>Sem imagem: bloco simples.</p></div>
<form><input type="email" placeholder="E-mail" required> <button>Enviar</button></form>`)}
`,
              quiz: [
                {
                  pergunta: 'O que uma container query consulta?',
                  opcoes: ['O tamanho da tela', 'O tamanho do contêiner onde o elemento está', 'A resolução da imagem'],
                  certa: 1,
                  explicacao: 'Por isso o componente se adapta em qualquer lugar da página.'
                },
                {
                  pergunta: 'O que é preciso antes de usar @container?',
                  opcoes: [
                    'Nada',
                    'Marcar um elemento pai com container-type (inline-size, por exemplo)',
                    'Usar display: grid'
                  ],
                  certa: 1,
                  explicacao: 'Sem um contêiner declarado, a regra não tem o que consultar.'
                },
                {
                  pergunta: 'O que .cartao:has(img) seleciona?',
                  opcoes: ['Imagens dentro de cartões', 'Cartões que têm uma imagem dentro', 'Todo cartão'],
                  certa: 1,
                  explicacao: ':has() estiliza o pai conforme o conteúdo.'
                }
              ]
            },
            {
              id: 'preferencias-do-usuario',
              titulo: 'Respeitar as preferências da pessoa',
              resumo: 'Movimento reduzido, tema escuro, foco visível e alto contraste.',
              minutos: 11,
              corpo: `
<p>O sistema operacional guarda preferências que o CSS consegue ler. Respeitar essas preferências é acessibilidade e também boa educação com quem visita.</p>

<h2>prefers-reduced-motion</h2>
<p>Para pessoas com distúrbios vestibulares, animações grandes (parallax, zoom, elementos deslizando) causam enjoo e tontura de verdade. Quem ativa "reduzir movimento" no sistema deve receber uma página calma:</p>
${trecho(`.cartao { transition: transform 0.4s; }
.cartao:hover { transform: translateY(-6px) scale(1.02); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}`)}
<p>A regra acima é um "freio geral" usado em muitos sites. Reduzir movimento não precisa tirar todo efeito: uma mudança de cor ou de opacidade costuma continuar confortável.</p>

<h2>prefers-color-scheme</h2>
${codigo(`<style>
  :root { --fundo: #ffffff; --texto: #1f2933; color-scheme: light dark; }
  @media (prefers-color-scheme: dark) {
    :root { --fundo: #0f1720; --texto: #e6edf3; }
  }
  body { background: var(--fundo); color: var(--texto); }
</style>
<p>Mude o tema do seu sistema e veja esta página acompanhar.</p>
<input placeholder="Até os campos acompanham">`)}
<p><code>color-scheme: light dark</code> avisa ao navegador que a página suporta os dois temas, e ele ajusta sozinho barras de rolagem e campos de formulário.</p>

<h2>Foco visível</h2>
<p>Quem navega pelo teclado precisa ver onde está. Nunca remova o contorno de foco sem colocar outro no lugar. <code>:focus-visible</code> mostra o anel só quando a navegação é pelo teclado, e não a cada clique do mouse:</p>
${codigo(`<style>
  button { padding: 8px 14px; border: 0; border-radius: 8px; background: #0b7a6f; color: #fff; }
  button:focus { outline: none; }
  button:focus-visible { outline: 3px solid #f5a524; outline-offset: 3px; }
</style>
<button>Primeiro</button> <button>Segundo</button>
<p>Clique e depois use Tab: o anel aparece só com o teclado.</p>`)}

<h2>Contraste e cores forçadas</h2>
<ul>
  <li>Texto comum precisa de contraste de pelo menos <strong>4,5:1</strong> com o fundo (WCAG AA); texto grande, 3:1. As ferramentas de desenvolvedor mostram o contraste ao inspecionar uma cor.</li>
  <li><code>@media (prefers-contrast: more)</code> permite reforçar bordas e cores para quem pediu mais contraste.</li>
  <li>No modo de alto contraste do Windows (<code>forced-colors: active</code>), o sistema troca as cores. Sombras somem: use bordas transparentes onde a borda importa, porque elas ganham cor nesse modo.</li>
</ul>
${dica('Teste rápido de acessibilidade: navegue pela página só com Tab, Enter e Esc. Se alguma coisa não dá para usar ou o foco some, há trabalho a fazer.')}
`,
              quiz: [
                {
                  pergunta: 'Por que respeitar prefers-reduced-motion?',
                  opcoes: [
                    'Para economizar bateria',
                    'Animações grandes causam enjoo e tontura em algumas pessoas',
                    'Porque animações são proibidas'
                  ],
                  certa: 1,
                  explicacao: 'É uma necessidade de acessibilidade, não uma questão de gosto.'
                },
                {
                  pergunta: 'Qual a diferença entre :focus e :focus-visible?',
                  opcoes: [
                    'Nenhuma',
                    ':focus-visible aparece quando o navegador acha que o anel é útil, como na navegação por teclado',
                    ':focus-visible é só para links'
                  ],
                  certa: 1,
                  explicacao: 'Assim o anel não aparece a cada clique, mas nunca falta para quem usa Tab.'
                },
                {
                  pergunta: 'Qual o contraste mínimo para texto comum no nível AA?',
                  opcoes: ['2:1', '4,5:1', '10:1'],
                  certa: 1,
                  explicacao: 'Texto grande (a partir de 24px, ou 18,66px em negrito) pode ter 3:1.'
                }
              ]
            },
            {
              id: 'desafio-cartao-adaptavel',
              tipo: 'desafio',
              titulo: 'Desafio: cartão que se adapta',
              resumo: 'Um cartão com container query, foco visível e movimento reduzido.',
              minutos: 20,
              enunciado: `
<p>Deixe o cartão de produto pronto para qualquer lugar e qualquer pessoa:</p>
<ul>
  <li>Cada <code>.area</code> é um contêiner (<code>container-type: inline-size</code>).</li>
  <li>O <code>.cartao</code> é flex em coluna; quando o contêiner tem <strong>pelo menos 420px</strong>, fica em linha (<code>flex-direction: row</code>).</li>
  <li>O botão tem um contorno visível em <code>:focus-visible</code> (<code>outline</code> com pelo menos 2px).</li>
  <li>O efeito de hover (que move o cartão) é desligado para quem prefere menos movimento: dentro de <code>@media (prefers-reduced-motion: reduce)</code>, o cartão fica sem <code>transition</code> e sem <code>transform</code>.</li>
</ul>`,
              inicial: `<style>
  .cartao { background: #f3f6f8; padding: 12px; border-radius: 10px; gap: 12px; transition: transform 0.3s; }
  .cartao:hover { transform: translateY(-4px); }
  .foto { background: #0b7a6f; border-radius: 8px; min-height: 90px; flex: 0 0 140px; }
  button { padding: 8px 14px; border: 0; border-radius: 8px; background: #0b7a6f; color: #fff; }
  button:focus { outline: none; }
</style>

<div class="area" style="width: 320px">
  <article class="cartao">
    <div class="foto"></div>
    <div>
      <h3>Café em grãos</h3>
      <p>R$ 62,90</p>
      <button>Comprar</button>
    </div>
  </article>
</div>
`,
              testes: [
                [
                  '.area é um contêiner de largura',
                  doc => doc.defaultView.getComputedStyle(doc.querySelector('.area')).containerType === 'inline-size'
                ],
                [
                  'O cartão fica em coluna num contêiner estreito e em linha a partir de 420px',
                  doc => {
                    const area = doc.querySelector('.area');
                    const cartao = doc.querySelector('.cartao');
                    const largura = area.style.width;
                    const estilo = () => doc.defaultView.getComputedStyle(cartao);
                    area.style.width = '320px';
                    const estreito = estilo().display === 'flex' && estilo().flexDirection === 'column';
                    area.style.width = '600px';
                    const largo = estilo().flexDirection === 'row';
                    area.style.width = largura;
                    return estreito && largo;
                  }
                ],
                [
                  'O botão tem outline de pelo menos 2px em :focus-visible',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')].map(s => s.textContent).join('\n');
                    const regra = css.match(/button:focus-visible\s*\{([^}]*)\}/);
                    const largura = regra && regra[1].match(/outline(?:-width)?\s*:[^;]*?(\d+(?:\.\d+)?)px/);
                    return !!largura && Number(largura[1]) >= 2;
                  }
                ],
                [
                  'Com movimento reduzido, o cartão fica sem transition e sem transform',
                  doc => {
                    const css = [...doc.querySelectorAll('style:not([data-base])')].map(s => s.textContent).join('\n');
                    const bloco = css.match(
                      /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{([\s\S]*?\})\s*\}/
                    );
                    return !!bloco && /transition\s*:\s*none/.test(bloco[1]) && /transform\s*:\s*none/.test(bloco[1]);
                  }
                ]
              ],
              solucao: `<style>
  .area { container-type: inline-size; }
  .cartao { display: flex; flex-direction: column; background: #f3f6f8; padding: 12px; border-radius: 10px; gap: 12px; transition: transform 0.3s; }
  .cartao:hover { transform: translateY(-4px); }
  .foto { background: #0b7a6f; border-radius: 8px; min-height: 90px; flex: 0 0 140px; }
  button { padding: 8px 14px; border: 0; border-radius: 8px; background: #0b7a6f; color: #fff; }
  button:focus { outline: none; }
  button:focus-visible { outline: 3px solid #f5a524; outline-offset: 3px; }

  @container (min-width: 420px) {
    .cartao { flex-direction: row; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cartao, .cartao:hover { transition: none; transform: none; }
  }
</style>

<div class="area" style="width: 320px">
  <article class="cartao">
    <div class="foto"></div>
    <div>
      <h3>Café em grãos</h3>
      <p>R$ 62,90</p>
      <button>Comprar</button>
    </div>
  </article>
</div>`
            }
          ]
        }
      ]
    }
  ]
};
