// Trilha de Acessibilidade. Continua as aulas de acessibilidade e ARIA da trilha de HTML, indo mais fundo: como as
// pessoas usam a web, teclado e foco, contraste, formulários e componentes interativos (abas, modal).
// O editor é o de HTML; os testes leem o documento do resultado e simulam teclas e envios.
// Atenção: crases e ${ dos exemplos precisam de barra invertida. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'acessibilidade',
  area: 'Desenvolvimento web',
  titulo: 'Acessibilidade',
  sigla: 'A11y',
  resumo: 'Sites que todo mundo consegue usar: leitores de tela, teclado, contraste, formulários e componentes.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Quem usa a web de outro jeito e os erros mais comuns.',
      modulos: [
        {
          titulo: 'Fundamentos',
          itens: [
            {
              id: 'por-que-acessibilidade',
              titulo: 'Quem usa e como usa',
              resumo: 'Deficiências, tecnologias assistivas, WCAG e a LBI.',
              minutos: 9,
              corpo: `
<p>Acessibilidade é fazer o site funcionar para todas as pessoas, inclusive as que enxergam pouco ou nada, não ouvem, não usam mouse, têm tremores, dislexia ou estão com o braço engessado. No Brasil, são mais de 18 milhões de pessoas com deficiência, e a <strong>Lei Brasileira de Inclusão</strong> (13.146/2015) exige sites acessíveis de empresas e órgãos públicos.</p>

<h2>Como essas pessoas navegam</h2>
<ul>
  <li><strong>Leitor de tela</strong> (NVDA no Windows, VoiceOver no Mac e iPhone, TalkBack no Android): lê a página em voz alta. A pessoa pula de título em título, de link em link, de campo em campo.</li>
  <li><strong>Só teclado</strong>: <kbd>Tab</kbd> para avançar, <kbd>Shift</kbd>+<kbd>Tab</kbd> para voltar, <kbd>Enter</kbd> e <kbd>Espaço</kbd> para acionar, setas dentro de componentes.</li>
  <li><strong>Ampliação</strong>: zoom de 200% ou mais, que deixa só um pedaço da tela visível.</li>
  <li><strong>Legendas e transcrições</strong> para quem não ouve o vídeo.</li>
  <li><strong>Controle por voz</strong>: a pessoa diz "clicar em Enviar", e por isso o texto visível do botão importa.</li>
</ul>

<h2>WCAG em quatro palavras</h2>
<p>A referência mundial é a <strong>WCAG</strong> (Diretrizes de Acessibilidade para Conteúdo Web). Ela se organiza em quatro princípios:</p>
<ul>
  <li><strong>Perceptível</strong>: dá para perceber o conteúdo (texto alternativo, legendas, contraste).</li>
  <li><strong>Operável</strong>: dá para usar (teclado, tempo suficiente, nada piscando demais).</li>
  <li><strong>Compreensível</strong>: dá para entender (idioma declarado, erros explicados, comportamento previsível).</li>
  <li><strong>Robusto</strong>: funciona com as tecnologias assistivas (HTML correto).</li>
</ul>
<p>Cada critério tem um nível: A, AA ou AAA. O nível <strong>AA</strong> é o que as leis e as empresas costumam exigir.</p>
${dica('Faça o teste mais barato que existe: largue o mouse e tente usar o seu site só com o teclado. Dá para chegar em tudo? Dá para ver onde está o foco? Em cinco minutos aparecem os problemas mais graves.')}
`,
              quiz: [
                {
                  pergunta: 'Qual nível da WCAG costuma ser exigido?',
                  opcoes: ['A', 'AA', 'AAA'],
                  certa: 1,
                  explicacao: 'O AA é a referência de leis e contratos.'
                },
                {
                  pergunta: 'Como uma pessoa que usa leitor de tela costuma navegar?',
                  opcoes: [
                    'Ouvindo a página inteira do começo ao fim, sempre',
                    'Pulando por títulos, links e campos',
                    'Com o mouse'
                  ],
                  certa: 1,
                  explicacao: 'Por isso títulos bem organizados e links com texto claro fazem tanta diferença.'
                },
                {
                  pergunta: 'Qual princípio da WCAG trata de usar o site pelo teclado?',
                  opcoes: ['Perceptível', 'Operável', 'Robusto'],
                  certa: 1,
                  explicacao: 'Operável: todas as funções precisam ser acionáveis por qualquer meio.'
                }
              ]
            },
            {
              id: 'erros-mais-comuns',
              titulo: 'Os erros mais comuns',
              resumo: 'Texto alternativo, idioma, títulos, links, botões falsos e campos sem rótulo.',
              minutos: 12,
              corpo: `
<p>Uma pesquisa anual com o primeiro milhão de sites da web (WebAIM Million) encontra, ano após ano, os mesmos seis problemas em quase todas as páginas. Corrigir só eles já muda muito.</p>

<h2>1. Imagem sem texto alternativo</h2>
<p>O <code>alt</code> é o que o leitor de tela fala no lugar da imagem. Descreva o que importa no contexto. Imagem só decorativa leva <code>alt=""</code> (vazio): o leitor pula.</p>
${trecho(`<img src="quarto.jpg" alt="Quarto de casal com varanda e vista para o mar">
<img src="onda-decorativa.svg" alt="">`)}

<h2>2. Página sem idioma</h2>
<p>Sem <code>&lt;html lang="pt-BR"&gt;</code>, o leitor de tela pode ler o português com sotaque e regras do inglês.</p>

<h2>3. Títulos fora de ordem</h2>
<p>Os títulos (<code>h1</code> a <code>h6</code>) são o sumário da página para quem usa leitor de tela. Um <code>h1</code> por página, e sem pular níveis (<code>h2</code> direto para <code>h4</code>). Escolha o nível pela estrutura, não pelo tamanho da letra: o tamanho é com o CSS.</p>

<h2>4. Links que não dizem nada</h2>
<p>Numa lista de links lida fora de contexto, dez "clique aqui" são inúteis. O texto do link deve dizer para onde ele leva:</p>
${trecho(`<!-- Ruim -->
Para ver os preços, <a href="precos.html">clique aqui</a>.
<!-- Bom -->
Veja a <a href="precos.html">tabela de preços dos quartos</a>.`)}

<h2>5. div que finge ser botão</h2>
<p>Uma <code>&lt;div onclick&gt;</code> não recebe foco pelo <kbd>Tab</kbd>, não responde ao <kbd>Enter</kbd> e o leitor de tela não anuncia como botão. O <code>&lt;button&gt;</code> faz tudo isso de graça.</p>
${codigo(`<div onclick="alert('div')" style="background:#ddd;padding:8px;display:inline-block">Sou uma div (tente chegar com Tab)</div>
<button onclick="alert('botão')">Sou um botão de verdade</button>`)}

<h2>6. Campo sem rótulo</h2>
<p>O <code>placeholder</code> some quando a pessoa digita e muitos leitores de tela não leem. Todo campo precisa de um <code>&lt;label&gt;</code> ligado a ele (pelo <code>for</code> igual ao <code>id</code>, ou com o campo dentro do label). Bônus: clicar no rótulo foca o campo, o que ajuda quem tem dificuldade de mira.</p>
${codigo(`<label for="email">E-mail</label>
<input id="email" type="email" autocomplete="email">`)}
${dica('O contraste baixo entre texto e fundo é o erro número 1 da lista da WebAIM. Ele tem uma aula própria no nível intermediário.')}
`,
              quiz: [
                {
                  pergunta: 'Qual alt usar numa imagem só decorativa?',
                  opcoes: ['alt="imagem"', 'alt="" (vazio)', 'Nenhum atributo alt'],
                  certa: 1,
                  explicacao: 'Vazio diz ao leitor de tela que pode pular. Sem alt, alguns leem o nome do arquivo.'
                },
                {
                  pergunta: 'Por que evitar <div onclick> no lugar de <button>?',
                  opcoes: [
                    'A div é mais lenta',
                    'A div não recebe foco pelo teclado nem é anunciada como botão',
                    'Não há diferença'
                  ],
                  certa: 1,
                  explicacao: 'O button já vem com foco, Enter, Espaço e o papel de botão.'
                },
                {
                  pergunta: 'Um placeholder substitui o label?',
                  opcoes: ['Sim', 'Não: ele some ao digitar e nem sempre é lido', 'Só em campos de e-mail'],
                  certa: 1,
                  explicacao: 'Use label sempre; o placeholder pode dar um exemplo do formato.'
                }
              ]
            },
            {
              id: 'desafio-consertar-pagina',
              tipo: 'desafio',
              titulo: 'Desafio: conserte a página',
              resumo: 'Corrija os seis erros mais comuns numa página de pousada.',
              minutos: 18,
              enunciado: `
<p>A página abaixo tem vários dos erros mais comuns. Conserte sem mudar o conteúdo:</p>
<ul>
  <li>Declare o idioma da página como português do Brasil.</li>
  <li>A foto do quarto precisa de um texto alternativo que a descreva; o ícone de onda é decorativo.</li>
  <li>Só pode haver um <code>h1</code>, e os títulos não podem pular níveis.</li>
  <li>O link "clique aqui" precisa dizer para onde leva (o texto precisa conter "preços").</li>
  <li>O "botão" Reservar precisa ser um botão de verdade.</li>
  <li>O campo de e-mail precisa de um rótulo ligado a ele.</li>
</ul>`,
              inicial: `<!doctype html>
<html>
  <body>
    <h1>Pousada Maré Mansa</h1>
    <img src="onda.svg">
    <h1>Nossos quartos</h1>
    <img src="quarto.jpg">
    <h4>Quarto casal</h4>
    <p>Para ver os valores, <a href="precos.html">clique aqui</a>.</p>
    <div class="botao" onclick="reservar()">Reservar</div>
    <input type="email" placeholder="Seu e-mail">
    <script>
      function reservar() { console.log('Reservando...'); }
    </script>
  </body>
</html>
`,
              testes: [
                ['A página declara o idioma pt-BR', doc => /^pt(-br)?$/i.test(doc.documentElement.lang)],
                [
                  'A foto do quarto tem alt descritivo e o ícone decorativo tem alt vazio',
                  doc => {
                    const quarto = doc.querySelector('img[src="quarto.jpg"]');
                    const onda = doc.querySelector('img[src="onda.svg"]');
                    return (
                      !!quarto &&
                      (quarto.getAttribute('alt') || '').trim().length >= 5 &&
                      !!onda &&
                      onda.getAttribute('alt') === ''
                    );
                  }
                ],
                [
                  'Um só h1 e nenhum título pulando nível',
                  doc => {
                    const niveis = [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(h => Number(h.tagName[1]));
                    const h1s = niveis.filter(n => n === 1).length;
                    return h1s === 1 && niveis[0] === 1 && niveis.every((n, i) => i === 0 || n <= niveis[i - 1] + 1);
                  }
                ],
                [
                  'O link diz para onde leva (contém "preços")',
                  doc => {
                    const link = doc.querySelector('a[href="precos.html"]');
                    return !!link && /preços/i.test(link.textContent) && !/clique aqui/i.test(link.textContent);
                  }
                ],
                [
                  'Reservar é um <button> que chama reservar()',
                  doc => {
                    const botao = [...doc.querySelectorAll('button')].find(b => /reservar/i.test(b.textContent));
                    if (!botao) return false;
                    const w = doc.defaultView;
                    const antes = w.__saida.length;
                    botao.click();
                    return w.__saida.length > antes && !doc.querySelector('div[onclick]');
                  }
                ],
                [
                  'O campo de e-mail tem um label ligado a ele',
                  doc => {
                    const campo = doc.querySelector('input[type="email"]');
                    return (
                      !!campo && campo.labels && campo.labels.length > 0 && campo.labels[0].textContent.trim() !== ''
                    );
                  }
                ]
              ],
              solucao: `<!doctype html>
<html lang="pt-BR">
  <body>
    <h1>Pousada Maré Mansa</h1>
    <img src="onda.svg" alt="">
    <h2>Nossos quartos</h2>
    <img src="quarto.jpg" alt="Quarto de casal com cama de madeira e janela para o mar">
    <h3>Quarto casal</h3>
    <p>Veja a <a href="precos.html">tabela de preços dos quartos</a>.</p>
    <button type="button" onclick="reservar()">Reservar</button>
    <label for="email">Seu e-mail</label>
    <input id="email" type="email" autocomplete="email">
    <script>
      function reservar() { console.log('Reservando...'); }
    </script>
  </body>
</html>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Teclado, foco, contraste e formulários que explicam os erros.',
      modulos: [
        {
          titulo: 'Teclado, cor e formulários',
          itens: [
            {
              id: 'teclado-e-foco',
              titulo: 'Teclado e foco',
              resumo: 'Ordem do Tab, foco visível, tabindex e link para pular o menu.',
              minutos: 12,
              corpo: `
<h2>A ordem do Tab é a ordem do HTML</h2>
<p>O <kbd>Tab</kbd> segue a ordem dos elementos no código, não a posição na tela. Se o CSS muda a ordem visual (com <code>order</code>, <code>flex-direction: row-reverse</code> ou posicionamento), o foco "pula" de um lado para o outro e confunde. Organize o HTML na ordem de leitura.</p>

<h2>Foco visível</h2>
<p>Quem usa teclado precisa ver onde está. Nunca tire o contorno sem colocar outro no lugar. O <code>:focus-visible</code> mostra o anel só quando a pessoa está no teclado (o clique do mouse não mostra):</p>
${codigo(`<style>
  button { padding: 8px 14px; border: 0; border-radius: 6px; background: #0b7a6f; color: white; }
  button:focus-visible { outline: 3px solid #f59e0b; outline-offset: 3px; }
  .ruim:focus { outline: none; } /* nunca faça isso sem outra marca de foco */
</style>
<button>Com foco visível</button>
<button class="ruim">Sem foco visível</button>
<button>Outro botão</button>`)}

<h2>tabindex</h2>
<ul>
  <li><code>tabindex="0"</code>: põe na ordem do Tab algo que normalmente não estaria (use pouco: prefira um elemento nativo, como o button).</li>
  <li><code>tabindex="-1"</code>: tira da ordem do Tab, mas ainda deixa focar pelo JavaScript com <code>.focus()</code>. Útil para levar o foco a um título ou a uma mensagem.</li>
  <li><code>tabindex</code> positivo (1, 2, 3): <strong>não use</strong>. Ele passa na frente de tudo e bagunça a ordem da página inteira.</li>
</ul>

<h2>Pular o menu</h2>
<p>Quem navega por teclado teria de passar pelos 15 links do menu em cada página. Um link escondido, que aparece ao receber foco, leva direto ao conteúdo:</p>
${codigo(`<style>
  .pular { position: absolute; left: -9999px; }
  .pular:focus { left: 8px; top: 8px; background: #111; color: #fff; padding: 8px; }
</style>
<a class="pular" href="#conteudo">Pular para o conteúdo</a>
<nav><a href="#">Início</a> · <a href="#">Quartos</a> · <a href="#">Contato</a></nav>
<main id="conteudo" tabindex="-1"><h1>Conteúdo principal</h1></main>`)}
<p>Clique no resultado e aperte <kbd>Tab</kbd>: o link aparece.</p>

<h2>Não prenda o foco</h2>
<p>Componentes como mapas e editores às vezes "engolem" o Tab e a pessoa não consegue sair. Toda vez que o foco entra em algo, precisa haver um jeito de teclado de sair (Tab ou Esc). A exceção proposital é o modal aberto, assunto do nível avançado.</p>
`,
              quiz: [
                {
                  pergunta: 'O que define a ordem do Tab?',
                  opcoes: ['A posição na tela', 'A ordem dos elementos no HTML', 'O tamanho dos elementos'],
                  certa: 1,
                  explicacao: 'Por isso mudar a ordem só no CSS confunde quem usa teclado.'
                },
                {
                  pergunta: 'Para que serve tabindex="-1"?',
                  opcoes: [
                    'Deixar o elemento focável pelo JavaScript, sem entrar na ordem do Tab',
                    'Pôr o elemento em primeiro na ordem',
                    'Esconder o elemento'
                  ],
                  certa: 0,
                  explicacao: 'Útil para mover o foco para um título ou uma mensagem de erro.'
                },
                {
                  pergunta: 'Por que evitar tabindex="3"?',
                  opcoes: [
                    'Não funciona em celulares',
                    'Valores positivos passam na frente de tudo e bagunçam a ordem',
                    'Só aceita 0 e 1'
                  ],
                  certa: 1,
                  explicacao: 'Fica impossível de manter conforme a página cresce.'
                }
              ]
            },
            {
              id: 'contraste-e-formularios',
              titulo: 'Contraste, cor e formulários',
              resumo: 'Calcular contraste, não depender só da cor e mensagens de erro acessíveis.',
              minutos: 13,
              corpo: `
<h2>Contraste</h2>
<p>A WCAG (nível AA) pede contraste de pelo menos <strong>4,5:1</strong> entre texto e fundo, ou <strong>3:1</strong> para textos grandes (24px, ou 18,66px em negrito) e para bordas de campos e ícones. A conta usa a luminância de cada cor:</p>
${codigo(`<script>
  function luminancia(hex) {
    const [r, g, b] = hex.match(/\\w\\w/g).map(c => {
      const v = parseInt(c, 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contraste(a, b) {
    const [clara, escura] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
    return (clara + 0.05) / (escura + 0.05);
  }
  for (const [texto, fundo] of [['#777777', '#ffffff'], ['#595959', '#ffffff'], ['#ffffff', '#0b7a6f']]) {
    const c = contraste(texto, fundo);
    console.log(texto, 'sobre', fundo, '=', c.toFixed(2) + ':1', c >= 4.5 ? '✓ AA' : '✗ abaixo de 4,5');
  }
</script>`)}
<p>O cinza claro <code>#777</code>, tão comum em textos secundários, não passa. Na prática, use as ferramentas do navegador: no F12, ao inspecionar um texto, o seletor de cor mostra o contraste e sugere uma cor que passa.</p>

<h2>Não dependa só da cor</h2>
<p>Cerca de 8% dos homens têm alguma forma de daltonismo. "Os campos em vermelho estão errados" não serve para eles. Junte a cor com outra pista: um ícone, um texto, um sublinhado nos links dentro de parágrafos.</p>

<h2>Formulários que explicam os erros</h2>
<p>Quando um campo está errado, a pessoa precisa saber <strong>qual</strong>, <strong>por quê</strong> e <strong>como corrigir</strong>, e o leitor de tela precisa dizer isso ao chegar no campo:</p>
${codigo(`<form novalidate>
  <label for="cpf">CPF</label>
  <input id="cpf" aria-describedby="cpf-ajuda cpf-erro" aria-invalid="true" value="123">
  <p id="cpf-ajuda">Só os 11 números, sem pontos.</p>
  <p id="cpf-erro" style="color:#b42318">✗ O CPF precisa ter 11 números. Você digitou 3.</p>
</form>`)}
<ul>
  <li><code>aria-invalid="true"</code> faz o leitor anunciar "inválido".</li>
  <li><code>aria-describedby</code> liga o campo aos textos de ajuda e de erro, que são lidos depois do rótulo.</li>
  <li>Ao enviar com erro, leve o foco para o <strong>primeiro campo errado</strong> (<code>campo.focus()</code>).</li>
  <li>Para avisos que aparecem sem a pessoa mudar de lugar (um "salvo!" no canto), use uma região <code>aria-live="polite"</code>: o leitor fala quando o texto muda.</li>
</ul>
${dica('Agrupe opções relacionadas (como os botões de rádio de "forma de pagamento") com <code>&lt;fieldset&gt;</code> e <code>&lt;legend&gt;</code>. O leitor de tela diz a pergunta antes de cada opção.')}
`,
              quiz: [
                {
                  pergunta: 'Qual contraste mínimo a WCAG AA pede para texto normal?',
                  opcoes: ['3:1', '4,5:1', '7:1'],
                  certa: 1,
                  explicacao: '3:1 vale para textos grandes e elementos gráficos; 7:1 é o nível AAA.'
                },
                {
                  pergunta: 'O que aria-describedby faz num campo?',
                  opcoes: [
                    'Muda a cor do campo',
                    'Liga o campo a textos de ajuda ou erro, lidos pelo leitor de tela',
                    'Valida o campo'
                  ],
                  certa: 1,
                  explicacao: 'O leitor lê o rótulo e depois as descrições ligadas.'
                },
                {
                  pergunta: 'O formulário foi enviado com erros. Para onde levar o foco?',
                  opcoes: ['Para o topo da página', 'Para o primeiro campo com erro', 'Para o botão de enviar'],
                  certa: 1,
                  explicacao: 'A pessoa chega direto ao problema e ouve a mensagem.'
                }
              ]
            },
            {
              id: 'desafio-formulario-acessivel',
              tipo: 'desafio',
              titulo: 'Desafio: formulário que explica os erros',
              resumo: 'Marque o campo inválido, ligue a mensagem e leve o foco até ele.',
              minutos: 22,
              enunciado: `
<p>Complete o JavaScript do formulário de reserva. Ao enviar:</p>
<ul>
  <li>O <strong>nome</strong> é obrigatório e o <strong>número de hóspedes</strong> precisa estar entre 1 e 4.</li>
  <li>Cada campo com erro recebe <code>aria-invalid="true"</code>, e o parágrafo de erro dele (que já existe, vazio) recebe uma mensagem. O campo precisa estar ligado ao seu parágrafo de erro por <code>aria-describedby</code>.</li>
  <li>O foco vai para o <strong>primeiro</strong> campo com erro.</li>
  <li>Campo corrigido perde o <code>aria-invalid</code> (ou fica <code>"false"</code>) e a mensagem dele some.</li>
  <li>Se não houver erros, a região <code>#aviso</code> (que tem <code>aria-live</code>) mostra um texto com a palavra "recebida".</li>
</ul>`,
              inicial: `<form id="reserva" novalidate>
  <label for="nome">Nome</label>
  <input id="nome">
  <p id="nome-erro"></p>

  <label for="hospedes">Hóspedes</label>
  <input id="hospedes" type="number">
  <p id="hospedes-erro"></p>

  <button>Reservar</button>
</form>
<p id="aviso" aria-live="polite"></p>

<script>
  const form = document.getElementById('reserva');
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    // confira os campos aqui
  });
</script>
`,
              testes: [
                [
                  'Cada campo está ligado ao seu erro por aria-describedby',
                  doc => {
                    const ligado = (id, erro) =>
                      (doc.getElementById(id)?.getAttribute('aria-describedby') || '').split(/\s+/).includes(erro);
                    return ligado('nome', 'nome-erro') && ligado('hospedes', 'hospedes-erro');
                  }
                ],
                [
                  'Enviar vazio marca os dois campos como inválidos, com mensagens',
                  doc => {
                    doc.getElementById('nome').value = '';
                    doc.getElementById('hospedes').value = '';
                    doc.getElementById('reserva').requestSubmit();
                    return (
                      doc.getElementById('nome').getAttribute('aria-invalid') === 'true' &&
                      doc.getElementById('hospedes').getAttribute('aria-invalid') === 'true' &&
                      doc.getElementById('nome-erro').textContent.trim().length > 0 &&
                      doc.getElementById('hospedes-erro').textContent.trim().length > 0
                    );
                  }
                ],
                [
                  'O foco vai para o primeiro campo com erro',
                  doc => {
                    doc.getElementById('nome').value = 'Ana';
                    doc.getElementById('hospedes').value = '9';
                    doc.getElementById('reserva').requestSubmit();
                    const foco1 = doc.activeElement?.id;
                    doc.getElementById('nome').value = '';
                    doc.getElementById('reserva').requestSubmit();
                    return foco1 === 'hospedes' && doc.activeElement?.id === 'nome';
                  }
                ],
                [
                  'Campo corrigido perde o aria-invalid e a mensagem',
                  doc => {
                    doc.getElementById('nome').value = '';
                    doc.getElementById('hospedes').value = '2';
                    doc.getElementById('reserva').requestSubmit();
                    const h = doc.getElementById('hospedes');
                    return (
                      h.getAttribute('aria-invalid') !== 'true' &&
                      doc.getElementById('hospedes-erro').textContent.trim() === '' &&
                      doc.getElementById('nome').getAttribute('aria-invalid') === 'true'
                    );
                  }
                ],
                [
                  'Sem erros, o aviso diz que a reserva foi recebida',
                  doc => {
                    doc.getElementById('nome').value = 'Ana';
                    doc.getElementById('hospedes').value = '2';
                    doc.getElementById('reserva').requestSubmit();
                    return (
                      /recebida/i.test(doc.getElementById('aviso').textContent) &&
                      doc.getElementById('nome').getAttribute('aria-invalid') !== 'true'
                    );
                  }
                ]
              ],
              solucao: `<form id="reserva" novalidate>
  <label for="nome">Nome</label>
  <input id="nome" aria-describedby="nome-erro">
  <p id="nome-erro"></p>

  <label for="hospedes">Hóspedes</label>
  <input id="hospedes" type="number" aria-describedby="hospedes-erro">
  <p id="hospedes-erro"></p>

  <button>Reservar</button>
</form>
<p id="aviso" aria-live="polite"></p>

<script>
  const form = document.getElementById('reserva');

  function marcar(campo, mensagem) {
    const erro = document.getElementById(campo.id + '-erro');
    if (mensagem) {
      campo.setAttribute('aria-invalid', 'true');
      erro.textContent = mensagem;
    } else {
      campo.removeAttribute('aria-invalid');
      erro.textContent = '';
    }
    return !mensagem;
  }

  form.addEventListener('submit', evento => {
    evento.preventDefault();
    const nome = document.getElementById('nome');
    const hospedes = document.getElementById('hospedes');
    const n = Number(hospedes.value);
    const nomeOk = marcar(nome, nome.value.trim() ? '' : 'Escreva o seu nome.');
    const hospedesOk = marcar(
      hospedes,
      hospedes.value !== '' && n >= 1 && n <= 4 ? '' : 'Escolha de 1 a 4 hóspedes.'
    );
    const aviso = document.getElementById('aviso');
    if (!nomeOk) nome.focus();
    else if (!hospedesOk) hospedes.focus();
    aviso.textContent = nomeOk && hospedesOk ? 'Reserva recebida! Vamos confirmar por e-mail.' : '';
  });
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Componentes interativos acessíveis e como testar.',
      modulos: [
        {
          titulo: 'Componentes e testes',
          itens: [
            {
              id: 'componentes-acessiveis',
              titulo: 'Componentes: modal, menu e abas',
              resumo: 'Os padrões do APG: papéis, estados e teclas esperadas.',
              minutos: 14,
              corpo: `
<p>Quando um componente não existe no HTML (abas, menu suspenso, carrossel), você monta com <code>div</code> e JavaScript, e precisa contar ao leitor de tela o que ele é e em que estado está. O guia <strong>ARIA Authoring Practices</strong> (APG, do W3C) descreve, para cada componente, os papéis, os atributos e as teclas que as pessoas esperam.</p>
${dica('A primeira regra do ARIA: se existe um elemento nativo que faz o que você precisa, use o nativo. <code>&lt;button&gt;</code>, <code>&lt;details&gt;</code>, <code>&lt;dialog&gt;</code> e <code>&lt;select&gt;</code> já vêm acessíveis. ARIA errado é pior que nenhum ARIA.')}

<h2>Modal</h2>
<p>O <code>&lt;dialog&gt;</code> aberto com <code>showModal()</code> já faz quase tudo: deixa o resto da página inerte, prende o foco dentro e fecha com <kbd>Esc</kbd>. Falta você:</p>
<ul>
  <li>Dar um nome ao diálogo: <code>aria-labelledby</code> apontando para o título.</li>
  <li>Ao fechar, <strong>devolver o foco</strong> ao botão que abriu. Senão, a pessoa "cai" no começo da página.</li>
</ul>
${codigo(`<button id="abrir">Ver política de cancelamento</button>
<dialog id="modal" aria-labelledby="titulo-modal">
  <h2 id="titulo-modal">Política de cancelamento</h2>
  <p>Cancelamento grátis até 7 dias antes da chegada.</p>
  <button id="fechar">Fechar</button>
</dialog>
<script>
  const abrir = document.getElementById('abrir');
  const modal = document.getElementById('modal');
  abrir.addEventListener('click', () => modal.showModal());
  document.getElementById('fechar').addEventListener('click', () => modal.close());
  modal.addEventListener('close', () => abrir.focus());
</script>`)}

<h2>Botão que abre e fecha</h2>
<p>Num menu ou num "ver mais", o botão diz o estado com <code>aria-expanded</code> e aponta o que controla com <code>aria-controls</code>:</p>
${codigo(`<button aria-expanded="false" aria-controls="menu" id="botaoMenu">Menu</button>
<ul id="menu" hidden><li><a href="#">Quartos</a></li><li><a href="#">Contato</a></li></ul>
<script>
  const botao = document.getElementById('botaoMenu');
  botao.addEventListener('click', () => {
    const aberto = botao.getAttribute('aria-expanded') === 'true';
    botao.setAttribute('aria-expanded', String(!aberto));
    document.getElementById('menu').hidden = aberto;
  });
</script>`)}

<h2>Abas</h2>
<p>O padrão de abas do APG:</p>
<ul>
  <li>Um contêiner <code>role="tablist"</code>; cada aba é um <code>button</code> com <code>role="tab"</code>, <code>aria-selected</code> e <code>aria-controls</code> apontando para o seu painel (<code>role="tabpanel"</code>).</li>
  <li>Só a aba ativa fica na ordem do Tab (<code>tabindex="0"</code>); as outras têm <code>tabindex="-1"</code>. Isso se chama <strong>tabindex itinerante</strong>.</li>
  <li>As <strong>setas</strong> ← e → mudam de aba (e dão a volta no fim); <kbd>Home</kbd> e <kbd>End</kbd> vão para a primeira e a última.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Qual é a primeira regra do ARIA?',
                  opcoes: [
                    'Usar ARIA em todo elemento',
                    'Se existe um elemento nativo que resolve, use o nativo',
                    'Sempre usar role="button"'
                  ],
                  certa: 1,
                  explicacao: 'Os elementos nativos já trazem o comportamento de teclado e o papel certo.'
                },
                {
                  pergunta: 'Ao fechar um modal, para onde deve ir o foco?',
                  opcoes: ['Para o topo da página', 'Para o botão que abriu o modal', 'Para lugar nenhum'],
                  certa: 1,
                  explicacao: 'A pessoa continua de onde estava.'
                },
                {
                  pergunta: 'No padrão de abas, como se muda de aba pelo teclado?',
                  opcoes: ['Com Tab', 'Com as setas', 'Só com o mouse'],
                  certa: 1,
                  explicacao: 'O Tab entra no grupo de abas e sai para o painel; as setas mudam de aba.'
                }
              ]
            },
            {
              id: 'testar-acessibilidade',
              titulo: 'Como testar acessibilidade',
              resumo: 'Ferramentas automáticas, teste com teclado e com leitor de tela.',
              minutos: 11,
              corpo: `
<p>Nenhuma ferramenta pega tudo. As automáticas encontram por volta de um terço dos problemas; o resto precisa de gente testando. Um bom roteiro combina as três camadas.</p>

<h2>1. Automático</h2>
<ul>
  <li><strong>Lighthouse</strong> (F12 → Lighthouse → Acessibilidade): rápido, dá uma nota e lista os problemas.</li>
  <li><strong>axe DevTools</strong> (extensão gratuita): mais completo, com explicação e como corrigir cada item.</li>
  <li>Nos testes automáticos do projeto, o <code>@axe-core/playwright</code> roda o axe em cada página e quebra o build se aparecer um problema novo.</li>
</ul>
${trecho(`import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a página inicial não tem problemas de acessibilidade', async ({ page }) => {
  await page.goto('/');
  const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(resultado.violations).toEqual([]);
});`)}

<h2>2. Teclado</h2>
<p>Desligue o mouse e confira: dá para chegar em tudo com <kbd>Tab</kbd>? O foco está sempre visível? A ordem faz sentido? Dá para abrir e fechar menus e modais? Nada prende o foco?</p>

<h2>3. Leitor de tela</h2>
<p>O NVDA é gratuito no Windows; o VoiceOver vem no Mac (<kbd>Cmd</kbd>+<kbd>F5</kbd>) e no iPhone. Os atalhos do NVDA mais úteis para testar:</p>
<ul>
  <li><kbd>H</kbd>: próximo título. <kbd>Insert</kbd>+<kbd>F7</kbd>: lista de títulos, links e marcos.</li>
  <li><kbd>D</kbd>: próximo marco (<code>header</code>, <code>nav</code>, <code>main</code>...). <kbd>F</kbd>: próximo campo de formulário.</li>
  <li><kbd>Ctrl</kbd>: para de falar.</li>
</ul>
<p>Pergunte-se: cada botão diz o que faz? As imagens fazem sentido? Os erros do formulário são anunciados?</p>

<h2>4. Outros ajustes</h2>
<ul>
  <li>Zoom de 200%: nada pode sumir ou ficar cortado.</li>
  <li><code>prefers-reduced-motion</code>: quem pediu menos movimento no sistema não deve ver animações grandes.</li>
  <li>Modo de alto contraste do Windows: os botões continuam visíveis?</li>
</ul>
${dica('O F12 do Chrome tem a aba <strong>Accessibility</strong> no painel de Elements: ela mostra o nome, o papel e o estado que o leitor de tela vai anunciar para o elemento selecionado.')}
`,
              quiz: [
                {
                  pergunta: 'Ferramentas automáticas encontram todos os problemas?',
                  opcoes: ['Sim', 'Não, uma parte; o resto precisa de teste com gente', 'Só o Lighthouse encontra'],
                  certa: 1,
                  explicacao: 'Elas não sabem, por exemplo, se um alt descreve bem a imagem.'
                },
                {
                  pergunta: 'No NVDA, qual tecla pula para o próximo título?',
                  opcoes: ['T', 'H', 'Tab'],
                  certa: 1,
                  explicacao: 'H de heading. É o jeito mais comum de "folhear" uma página.'
                },
                {
                  pergunta: 'Como rodar o axe a cada mudança no projeto?',
                  opcoes: [
                    'Abrindo a extensão todo dia',
                    'Com @axe-core/playwright nos testes automáticos',
                    'Não é possível'
                  ],
                  certa: 1,
                  explicacao: 'Assim um problema novo quebra o build antes de ir para o ar.'
                }
              ]
            },
            {
              id: 'desafio-abas',
              tipo: 'desafio',
              titulo: 'Desafio: abas acessíveis',
              resumo: 'Papéis, estados, tabindex itinerante e setas do teclado.',
              minutos: 28,
              enunciado: `
<p>As abas abaixo só funcionam com o mouse e não dizem nada ao leitor de tela. Implemente o padrão de abas do APG:</p>
<ul>
  <li>O contêiner tem <code>role="tablist"</code>; cada botão, <code>role="tab"</code> e <code>aria-controls</code> com o id do seu painel; cada painel, <code>role="tabpanel"</code>.</li>
  <li>A aba ativa tem <code>aria-selected="true"</code> e <code>tabindex="0"</code>; as outras, <code>aria-selected="false"</code> e <code>tabindex="-1"</code>. Só o painel da aba ativa fica visível (os outros com <code>hidden</code>).</li>
  <li>Com o foco numa aba, <kbd>→</kbd> ativa e foca a próxima e <kbd>←</kbd> a anterior, dando a volta nas pontas. <kbd>Home</kbd> vai para a primeira e <kbd>End</kbd> para a última.</li>
  <li>O clique continua funcionando.</li>
</ul>`,
              inicial: `<div class="abas">
  <button data-painel="p-quartos">Quartos</button>
  <button data-painel="p-lazer">Lazer</button>
  <button data-painel="p-local">Localização</button>
</div>
<div id="p-quartos">Quatro tipos de quarto, todos com ar-condicionado.</div>
<div id="p-lazer" hidden>Cozinha compartilhada e estacionamento grátis.</div>
<div id="p-local" hidden>De frente para o mar, a 5 minutos do centro.</div>

<script>
  const abas = [...document.querySelectorAll('.abas button')];

  function ativar(aba) {
    for (const outra of abas) {
      document.getElementById(outra.dataset.painel).hidden = outra !== aba;
    }
  }

  abas.forEach(aba => aba.addEventListener('click', () => ativar(aba)));
</script>
`,
              testes: [
                [
                  'tablist, tab, tabpanel e aria-controls',
                  doc => {
                    const lista = doc.querySelector('[role="tablist"]');
                    const abas = [...doc.querySelectorAll('[role="tab"]')];
                    return (
                      !!lista &&
                      abas.length === 3 &&
                      abas.every(a => lista.contains(a)) &&
                      abas.every(
                        a => doc.getElementById(a.getAttribute('aria-controls'))?.getAttribute('role') === 'tabpanel'
                      )
                    );
                  }
                ],
                [
                  'No começo, a 1ª aba está selecionada e é a única com tabindex="0"',
                  doc => {
                    const abas = [...doc.querySelectorAll('[role="tab"]')];
                    return (
                      abas.length === 3 &&
                      abas.map(a => a.getAttribute('aria-selected')).join() === 'true,false,false' &&
                      abas.map(a => a.getAttribute('tabindex')).join() === '0,-1,-1'
                    );
                  }
                ],
                [
                  'Clicar numa aba seleciona, mostra o painel dela e esconde os outros',
                  doc => {
                    const abas = [...doc.querySelectorAll('[role="tab"]')];
                    abas[1].click();
                    const ok =
                      abas.map(a => a.getAttribute('aria-selected')).join() === 'false,true,false' &&
                      abas.map(a => a.getAttribute('tabindex')).join() === '-1,0,-1' &&
                      abas.map(a => doc.getElementById(a.getAttribute('aria-controls')).hidden).join() ===
                        'true,false,true';
                    abas[0].click();
                    return ok;
                  }
                ],
                [
                  '→ e ← mudam de aba, movem o foco e dão a volta nas pontas',
                  doc => {
                    const w = doc.defaultView;
                    const abas = [...doc.querySelectorAll('[role="tab"]')];
                    const tecla = (alvo, key) =>
                      alvo.dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles: true }));
                    abas[0].click();
                    abas[0].focus();
                    tecla(abas[0], 'ArrowRight');
                    const a = doc.activeElement === abas[1] && abas[1].getAttribute('aria-selected') === 'true';
                    tecla(abas[1], 'ArrowLeft');
                    tecla(abas[0], 'ArrowLeft');
                    const b = doc.activeElement === abas[2] && abas[2].getAttribute('aria-selected') === 'true';
                    tecla(abas[2], 'ArrowRight');
                    const c = doc.activeElement === abas[0] && abas[0].getAttribute('aria-selected') === 'true';
                    return a && b && c;
                  }
                ],
                [
                  'Home e End vão para a primeira e a última aba',
                  doc => {
                    const w = doc.defaultView;
                    const abas = [...doc.querySelectorAll('[role="tab"]')];
                    const tecla = (alvo, key) =>
                      alvo.dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles: true }));
                    abas[0].click();
                    abas[0].focus();
                    tecla(abas[0], 'End');
                    const a =
                      doc.activeElement === abas[2] &&
                      !doc.getElementById(abas[2].getAttribute('aria-controls')).hidden;
                    tecla(abas[2], 'Home');
                    const b = doc.activeElement === abas[0] && abas[0].getAttribute('aria-selected') === 'true';
                    return a && b;
                  }
                ]
              ],
              solucao: `<div class="abas" role="tablist" aria-label="Sobre a pousada">
  <button role="tab" aria-controls="p-quartos">Quartos</button>
  <button role="tab" aria-controls="p-lazer">Lazer</button>
  <button role="tab" aria-controls="p-local">Localização</button>
</div>
<div id="p-quartos" role="tabpanel">Quatro tipos de quarto, todos com ar-condicionado.</div>
<div id="p-lazer" role="tabpanel" hidden>Cozinha compartilhada e estacionamento grátis.</div>
<div id="p-local" role="tabpanel" hidden>De frente para o mar, a 5 minutos do centro.</div>

<script>
  const abas = [...document.querySelectorAll('[role="tab"]')];

  function ativar(aba, focar) {
    for (const outra of abas) {
      const ativa = outra === aba;
      outra.setAttribute('aria-selected', String(ativa));
      outra.tabIndex = ativa ? 0 : -1;
      document.getElementById(outra.getAttribute('aria-controls')).hidden = !ativa;
    }
    if (focar) aba.focus();
  }

  abas.forEach((aba, i) => {
    aba.addEventListener('click', () => ativar(aba));
    aba.addEventListener('keydown', evento => {
      const destino = {
        ArrowRight: (i + 1) % abas.length,
        ArrowLeft: (i - 1 + abas.length) % abas.length,
        Home: 0,
        End: abas.length - 1
      }[evento.key];
      if (destino === undefined) return;
      evento.preventDefault();
      ativar(abas[destino], true);
    });
  });

  ativar(abas[0]);
</script>`
            }
          ]
        }
      ]
    }
  ]
};
