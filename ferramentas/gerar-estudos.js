// Gera as páginas da área de estudos (estudos/) a partir do conteúdo em estudos/_conteudo/.
// Uso: node ferramentas/gerar-estudos.js   (depois de editar uma aula, uma trilha ou o diário)
// O GitHub Actions roda o mesmo comando e avisa se as páginas geradas não foram atualizadas.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { escapar } = require('../estudos/_conteudo/ajuda');
const trilhas = require('../estudos/_conteudo/trilhas');
const diario = require('../estudos/_conteudo/diario');

const RAIZ = path.join(__dirname, '..');
const SAIDA = path.join(RAIZ, 'estudos');
const BASE = 'https://ottavvi.github.io/site-portfolio/';
const CSS_VERSAO = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').match(/css\/style\.css\?v=(\d+)/)[1];

const gerados = [];
function gravar(relativo, html) {
  const destino = path.join(SAIDA, relativo);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
  gerados.push(destino);
}

const dataPorExtenso = iso =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

// ---------- Moldura comum: cabeçalho, rodapé e scripts ----------
function pagina({ caminho, titulo, descricao, corpo, scripts = '' }) {
  const prefixo = '../'.repeat(caminho.split('/').length);
  const url = `${BASE}estudos/${caminho.replace(/index\.html$/, '')}`;
  const volta = encodeURIComponent(`estudos/${caminho}`);
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapar(titulo)}</title>
    <meta name="description" content="${escapar(descricao)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="ottavvi.dev" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${escapar(titulo)}" />
    <meta property="og:description" content="${escapar(descricao)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${BASE}imagens/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#08141a" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" href="${prefixo}favicon.svg" type="image/svg+xml" />
    <link rel="preload" href="${prefixo}fontes/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="${prefixo}fontes/space-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="stylesheet" href="${prefixo}css/style.css?v=${CSS_VERSAO}" />
    <!-- Aplica o tema salvo (ou o do sistema) antes de desenhar a página, para não piscar -->
    <script>
      try {
        const tema =
          localStorage.getItem('tema') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.dataset.theme = tema;
      } catch {}
    </script>
  </head>
  <body>
    <div id="app">
      <header>
        <div class="wrap nav">
          <!-- prettier-ignore -->
          <a class="logo" href="${prefixo}index.html#inicio" aria-label="Otávio, início">ottavvi<span>.</span>dev</a>
          <button class="theme-btn" id="themeBtn" type="button" aria-label="Mudar tema">
            <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
            <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          </button>
          <button class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="navLinks">Menu ☰</button>
          <nav class="links" id="navLinks" aria-label="Navegação principal">
            <a href="${prefixo}index.html#projetos">Projetos</a>
            <a href="${prefixo}index.html#habilidades">Habilidades</a>
            <a href="${prefixo}estudos/" aria-current="page">Estudos</a>
            <a href="${prefixo}sobre.html">Sobre mim</a>
            <a href="${prefixo}index.html#contato">Contato</a>
            <a href="${prefixo}en/index.html" lang="en" hreflang="en" class="lang-link">EN</a>
            <a
              href="${prefixo}login.html?volta=${volta}"
              id="authLink"
              data-url-entrar="${prefixo}login.html?volta=${volta}"
              data-url-area="${prefixo}area.html"
            >
              Entrar
            </a>
          </nav>
        </div>
      </header>
      <main>
${corpo}
      </main>
      <footer>
        <div class="wrap foot">
          <span>
            ©
            <span id="year"></span>
            Otávio. Feito com HTML, CSS e JavaScript.
          </span>
          <div class="small-links">
            <a href="https://github.com/Ottavvi" target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href="#inicio">Voltar ao topo ↑</a>
          </div>
        </div>
      </footer>
    </div>
${scripts}    <script src="${prefixo}js/main.js" defer></script>
    <script src="${prefixo}js/paleta.js" defer></script>
    <script type="module" src="${prefixo}js/auth/session.js"></script>
    <script type="module" src="${prefixo}js/estudos.js"></script>
  </body>
</html>
`;
}

// Faixa que diz onde o progresso está sendo salvo (preenchida pelo js/estudos.js)
const avisoConta = `<p class="estudos-conta" id="estudosConta" aria-live="polite">Seu progresso fica salvo neste navegador.</p>`;

const itensDaTrilha = trilha =>
  trilha.modulos.flatMap((modulo, m) => modulo.itens.map(item => ({ ...item, modulo, m })));
const idCompleto = (trilha, item) => `${trilha.id}/${item.id}`;
const icone = item =>
  item.tipo === 'desafio'
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4" /></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h11a3 3 0 0 1 3 3v11H7a3 3 0 0 1-3-3zM8 9h6M8 13h6" /></svg>';

function barra(trilha) {
  const ids = itensDaTrilha(trilha).map(item => idCompleto(trilha, item));
  return `<div class="estudos-progresso" data-progresso="${ids.join(' ')}">
                <div class="estudos-progresso-barra"><span></span></div>
                <span class="estudos-progresso-texto">0 de ${ids.length} concluídos</span>
              </div>`;
}

// ---------- Página inicial dos estudos ----------
function paginaInicial() {
  const cartoes = trilhas
    .map(trilha => {
      if (trilha.emBreve) {
        return `            <article class="trilha-card trilha-card--breve">
              <span class="trilha-sigla" aria-hidden="true">${escapar(trilha.titulo.slice(0, 2))}</span>
              <h3>${escapar(trilha.titulo)}</h3>
              <p>${escapar(trilha.resumo)}</p>
              <span class="trilha-breve">Em breve</span>
            </article>`;
      }
      const itens = itensDaTrilha(trilha);
      const aulas = itens.filter(item => item.tipo !== 'desafio').length;
      return `            <a class="trilha-card" href="${trilha.id}/">
              <span class="trilha-sigla" aria-hidden="true">${escapar(trilha.titulo.slice(0, 2))}</span>
              <h3>${escapar(trilha.titulo)}</h3>
              <p>${escapar(trilha.resumo)}</p>
              <span class="trilha-info">${trilha.modulos.length} módulos · ${aulas} aulas · ${itens.length - aulas} desafios</span>
              ${barra(trilha)}
            </a>`;
    })
    .join('\n');
  const entradas = diario
    .map(
      entrada => `            <li>
              <a class="diario-item" href="diario/${entrada.id}.html">
                <time datetime="${entrada.data}">${dataPorExtenso(entrada.data)}</time>
                <strong>${escapar(entrada.titulo)}</strong>
                <span>${escapar(entrada.resumo)}</span>
              </a>
            </li>`
    )
    .join('\n');
  gravar(
    'index.html',
    pagina({
      caminho: 'index.html',
      titulo: 'Estudos | Otávio',
      descricao:
        'Trilhas para aprender desenvolvimento web do zero, com aulas, quiz e desafios de código no navegador, e um diário do que estou estudando.',
      corpo: `        <section class="hero" id="inicio">
          <div class="wrap">
            <div class="section-kicker">Estudos</div>
            <h1>
              Aprender
              <em>fazendo.</em>
            </h1>
            <p class="lead">
              Trilhas para aprender desenvolvimento web do zero, com aulas curtas, quiz e desafios de código que você
              resolve no próprio navegador. E um diário com o que eu ando estudando.
            </p>
            ${avisoConta}
          </div>
        </section>
        <section id="trilhas">
          <div class="wrap">
            <div class="section-kicker">Trilhas</div>
            <h2>Escolha por onde começar.</h2>
            <div class="trilhas">
${cartoes}
            </div>
          </div>
        </section>
        <section id="diario">
          <div class="wrap">
            <div class="section-kicker">Diário de estudos</div>
            <h2>O que eu ando aprendendo.</h2>
            <p class="section-intro">Anotações curtas sobre problemas reais que resolvi e o que aprendi com eles.</p>
            <ul class="diario-lista">
${entradas}
            </ul>
            <a class="text-link about-more" href="diario/">Ver todas as anotações →</a>
          </div>
        </section>`
    })
  );
}

// ---------- Página de uma trilha (lista de módulos) ----------
function listaDeItens(trilha, prefixoLink, atual) {
  return trilha.modulos
    .map(
      (modulo, m) => `              <li class="trilha-modulo">
                <h3><span>Módulo ${m + 1}</span> ${escapar(modulo.titulo)}</h3>
                <ol>
${modulo.itens
  .map(
    item => `                  <li class="trilha-item${item.tipo === 'desafio' ? ' trilha-item--desafio' : ''}" data-item="${idCompleto(trilha, item)}">
                    <a href="${prefixoLink}${item.id}.html"${item.id === atual ? ' aria-current="page"' : ''}>
                      <span class="trilha-item-icone">${icone(item)}</span>
                      <span class="trilha-item-texto">
                        <strong>${escapar(item.titulo)}</strong>
                        <small>${escapar(item.resumo)}</small>
                      </span>
                      <span class="trilha-item-tempo">${item.minutos} min</span>
                    </a>
                  </li>`
  )
  .join('\n')}
                </ol>
              </li>`
    )
    .join('\n');
}

function paginaDaTrilha(trilha) {
  const itens = itensDaTrilha(trilha);
  gravar(
    `${trilha.id}/index.html`,
    pagina({
      caminho: `${trilha.id}/index.html`,
      titulo: `Trilha de ${trilha.titulo} | Estudos | Otávio`,
      descricao: trilha.resumo,
      corpo: `        <section class="hero estudos-hero" id="inicio">
          <div class="wrap">
            <a class="text-link" href="../">← Todos os estudos</a>
            <div class="section-kicker case-kicker">Trilha</div>
            <h1>${escapar(trilha.titulo)}<em>.</em></h1>
            <p class="lead">${escapar(trilha.resumo)}</p>
            ${barra(trilha)}
            <div class="actions">
              <a class="btn btn-primary" href="${itens[0].id}.html" data-continuar>Começar a trilha ↘</a>
            </div>
            ${avisoConta}
          </div>
        </section>
        <section id="modulos">
          <div class="wrap">
            <ol class="trilha-modulos">
${listaDeItens(trilha, '', null)}
            </ol>
          </div>
        </section>`
    })
  );
}

// ---------- Aula ou desafio ----------
function quiz(item) {
  if (!item.quiz) return '';
  const perguntas = item.quiz
    .map(
      (
        q,
        i
      ) => `                <li class="quiz-pergunta" data-certa="${q.certa}" data-explicacao="${escapar(q.explicacao)}">
                  <fieldset>
                    <legend>${escapar(q.pergunta)}</legend>
${q.opcoes
  .map(
    (opcao, o) =>
      `                    <label class="quiz-opcao"><input type="radio" name="q${i}" value="${o}" /> ${escapar(opcao)}</label>`
  )
  .join('\n')}
                  </fieldset>
                  <p class="quiz-retorno" hidden></p>
                </li>`
    )
    .join('\n');
  return `            <section class="quiz" aria-labelledby="quizTitulo">
              <h2 id="quizTitulo">Teste o que aprendeu</h2>
              <ol class="quiz-lista">
${perguntas}
              </ol>
              <p class="quiz-placar" aria-live="polite"></p>
            </section>`;
}

function desafio(trilha, item) {
  const testes = item.testes
    .map(([descricao], i) => `                <li data-teste="${i}">${escapar(descricao)}</li>`)
    .join('\n');
  return `            <div class="aula-texto">${item.enunciado}</div>
            <div class="desafio-testes">
              <h2>O que o código precisa ter</h2>
              <ul id="desafioTestes">
${testes}
              </ul>
            </div>
            <div class="editor" data-desafio="${idCompleto(trilha, item)}">
              <textarea aria-label="Seu código HTML" spellcheck="false">${escapar(item.inicial)}</textarea>
            </div>
            <details class="desafio-solucao">
              <summary>Ver uma solução possível</summary>
              <pre class="aula-codigo"><code>${escapar(item.solucao)}</code></pre>
            </details>`;
}

function paginaDoItem(trilha, item, anterior, proximo) {
  const ehDesafio = item.tipo === 'desafio';
  const navegacao = `            <nav class="aula-navegacao" aria-label="Aulas">
              ${anterior ? `<a href="${anterior.id}.html"><small>← Anterior</small>${escapar(anterior.titulo)}</a>` : '<span></span>'}
              ${proximo ? `<a class="aula-proxima" href="${proximo.id}.html"><small>Próxima →</small>${escapar(proximo.titulo)}</a>` : `<a class="aula-proxima" href="./"><small>Fim da trilha →</small>Voltar para a trilha</a>`}
            </nav>`;
  // Os testes do desafio vão para a página como funções (o js/estudos.js roda cada uma no resultado do editor)
  const scripts = ehDesafio
    ? `    <script>
      window.TESTES_DO_DESAFIO = [
${item.testes.map(([, teste]) => `        ${teste.toString()}`).join(',\n')}
      ];
    </script>
`
    : '';
  gravar(
    `${trilha.id}/${item.id}.html`,
    pagina({
      caminho: `${trilha.id}/${item.id}.html`,
      titulo: `${item.titulo} | ${trilha.titulo} | Estudos`,
      descricao: item.resumo,
      scripts,
      corpo: `        <div class="wrap aula" id="inicio">
          <aside class="aula-lateral">
            <details class="aula-sumario" open>
              <summary>Trilha de ${escapar(trilha.titulo)}</summary>
              ${barra(trilha)}
              <ol class="trilha-modulos trilha-modulos--compacta">
${listaDeItens(trilha, '', item.id)}
              </ol>
            </details>
          </aside>
          <article class="aula-conteudo">
            <a class="text-link" href="./">← Trilha de ${escapar(trilha.titulo)}</a>
            <div class="section-kicker case-kicker">Módulo ${item.m + 1} · ${escapar(item.modulo.titulo)}</div>
            <h1>${escapar(item.titulo)}</h1>
            <p class="aula-meta">${ehDesafio ? 'Desafio' : 'Aula'} · ${item.minutos} min</p>
${ehDesafio ? desafio(trilha, item) : `            <div class="aula-texto">${item.corpo}</div>\n${quiz(item)}`}
            <div class="aula-concluir">
              <button class="btn btn-ghost" type="button" data-concluir="${idCompleto(trilha, item)}">
                ${ehDesafio ? 'Marcar desafio como concluído' : 'Marcar aula como concluída'}
              </button>
              ${avisoConta}
            </div>
${navegacao}
          </article>
        </div>`
    })
  );
}

// ---------- Diário ----------
function paginasDoDiario() {
  const lista = diario
    .map(
      entrada => `            <li>
              <a class="diario-item" href="${entrada.id}.html">
                <time datetime="${entrada.data}">${dataPorExtenso(entrada.data)}</time>
                <strong>${escapar(entrada.titulo)}</strong>
                <span>${escapar(entrada.resumo)}</span>
              </a>
            </li>`
    )
    .join('\n');
  gravar(
    'diario/index.html',
    pagina({
      caminho: 'diario/index.html',
      titulo: 'Diário de estudos | Otávio',
      descricao: 'Anotações curtas sobre problemas reais que resolvi e o que aprendi com eles.',
      corpo: `        <section class="hero estudos-hero" id="inicio">
          <div class="wrap">
            <a class="text-link" href="../">← Todos os estudos</a>
            <div class="section-kicker case-kicker">Diário de estudos</div>
            <h1>O que eu ando <em>aprendendo.</em></h1>
            <p class="lead">Anotações curtas sobre problemas reais que resolvi e o que aprendi com eles.</p>
          </div>
        </section>
        <section id="anotacoes">
          <div class="wrap">
            <ul class="diario-lista">
${lista}
            </ul>
          </div>
        </section>`
    })
  );
  for (const entrada of diario) {
    gravar(
      `diario/${entrada.id}.html`,
      pagina({
        caminho: `diario/${entrada.id}.html`,
        titulo: `${entrada.titulo} | Diário de estudos`,
        descricao: entrada.resumo,
        corpo: `        <article class="wrap diario-entrada" id="inicio">
          <a class="text-link" href="./">← Diário de estudos</a>
          <div class="section-kicker case-kicker">
            <time datetime="${entrada.data}">${dataPorExtenso(entrada.data)}</time>
          </div>
          <h1>${escapar(entrada.titulo)}</h1>
          <p class="lead">${escapar(entrada.resumo)}</p>
          <ul class="skill-chips">
${entrada.tags.map(tag => `            <li>${escapar(tag)}</li>`).join('\n')}
          </ul>
          <div class="aula-texto">${entrada.corpo}</div>
        </article>`
      })
    );
  }
}

// ---------- Monta tudo ----------
// Apaga as páginas geradas antes (menos o conteúdo), para não sobrar página de aula removida
for (const nome of fs.readdirSync(SAIDA)) {
  if (nome !== '_conteudo') fs.rmSync(path.join(SAIDA, nome), { recursive: true, force: true });
}
paginaInicial();
for (const trilha of trilhas.filter(t => !t.emBreve)) {
  paginaDaTrilha(trilha);
  const itens = itensDaTrilha(trilha);
  itens.forEach((item, i) => paginaDoItem(trilha, item, itens[i - 1], itens[i + 1]));
}
paginasDoDiario();

// Formata com o Prettier, como o resto do site
execSync(`npx --yes prettier@3 --write ${gerados.map(g => `"${g}"`).join(' ')}`, { stdio: 'ignore' });
console.log(`✔ ${gerados.length} páginas geradas em estudos/`);
