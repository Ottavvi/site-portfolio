// Trilha de SEO e performance. Continua as aulas de metadados e desempenho da trilha de HTML. O editor é o de HTML;
// os testes leem o <head> e os atributos do documento do resultado (e o JSON-LD, com JSON.parse).
// Atenção: crases e ${ dos exemplos precisam de barra invertida. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'seo-performance',
  area: 'Desenvolvimento web',
  titulo: 'SEO e performance',
  sigla: 'SEO',
  resumo: 'Ser encontrado no Google e abrir rápido no celular: metadados, dados estruturados e Core Web Vitals.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Como os buscadores funcionam e os metadados que importam.',
      modulos: [
        {
          titulo: 'Ser encontrado',
          itens: [
            {
              id: 'como-o-google-funciona',
              titulo: 'Como o Google encontra uma página',
              resumo: 'Rastrear, indexar e classificar; sitemap, robots.txt e Search Console.',
              minutos: 10,
              corpo: `
<p><strong>SEO</strong> (otimização para buscadores) é deixar o site fácil de encontrar, de entender e de recomendar. Não existe truque: os buscadores querem mostrar a melhor resposta para quem pesquisou, e o trabalho é deixar claro que a sua página é essa resposta.</p>

<h2>As três etapas</h2>
<ol>
  <li><strong>Rastrear</strong>: robôs (como o Googlebot) visitam as páginas e seguem os links. Página sem nenhum link apontando para ela dificilmente é encontrada.</li>
  <li><strong>Indexar</strong>: o buscador lê o conteúdo, entende do que se trata e guarda no índice. Conteúdo que só aparece depois de cliques ou de muito JavaScript pode ficar de fora.</li>
  <li><strong>Classificar</strong>: quando alguém pesquisa, o buscador ordena as páginas do índice pela relevância e pela qualidade: o texto responde à pergunta? A página abre rápido, funciona no celular, é segura? Outros sites confiáveis apontam para ela?</li>
</ol>

<h2>Ajudar o robô</h2>
<ul>
  <li><strong>sitemap.xml</strong>: a lista das páginas do site, com a data da última mudança. Este portfólio tem um na raiz.</li>
  <li><strong>robots.txt</strong>: diz aos robôs o que não rastrear (páginas de administração, resultados de busca interna). Não é proteção: quem quiser acessa igual.</li>
  <li><strong>noindex</strong>: <code>&lt;meta name="robots" content="noindex"&gt;</code> pede para a página não aparecer nos resultados. As páginas de revisão e de certificado desta área de estudos usam.</li>
  <li><strong>URLs legíveis</strong>: <code>/estudos/git/desfazer.html</code> diz mais que <code>/pagina?id=8172</code>.</li>
  <li><strong>Links internos</strong> com texto descritivo, que ajudam pessoas e robôs.</li>
</ul>
${trecho(`# robots.txt
User-agent: *
Disallow: /admin.html
Sitemap: https://ottavvi.github.io/site-portfolio/sitemap.xml`)}

<h2>Google Search Console</h2>
<p>A ferramenta gratuita do Google para quem tem um site: mostra quais páginas foram indexadas, por quais pesquisas o site aparece, quantos cliques recebe e os erros encontrados. O primeiro passo depois de publicar um site é cadastrá-lo lá e enviar o sitemap.</p>
${dica('Para um negócio local, como uma pousada, o Perfil da Empresa no Google (o antigo Google Meu Negócio) costuma trazer mais visitas que o site: é ele que aparece no mapa e no quadro lateral da pesquisa. O site e o perfil devem ter o mesmo nome, endereço e telefone.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a ordem das etapas de um buscador?',
                  opcoes: [
                    'Classificar, rastrear, indexar',
                    'Rastrear, indexar, classificar',
                    'Indexar, rastrear, classificar'
                  ],
                  certa: 1,
                  explicacao: 'Primeiro encontra, depois entende e guarda, e só então ordena nas pesquisas.'
                },
                {
                  pergunta: 'O robots.txt protege páginas privadas?',
                  opcoes: ['Sim', 'Não: é só um pedido aos robôs; qualquer pessoa acessa', 'Só no Google'],
                  certa: 1,
                  explicacao: 'Página privada precisa de login, não de robots.txt.'
                },
                {
                  pergunta: 'Como pedir que uma página não apareça nos resultados?',
                  opcoes: ['<meta name="robots" content="noindex">', 'Deixar o título vazio', 'Apagar o sitemap'],
                  certa: 0,
                  explicacao: 'O noindex é respeitado pelos buscadores sérios.'
                }
              ]
            },
            {
              id: 'metadados',
              titulo: 'Título, descrição, canônica e Open Graph',
              resumo: 'O que aparece no Google e no WhatsApp quando alguém compartilha.',
              minutos: 11,
              corpo: `
<h2>Título e descrição</h2>
<p>O <code>&lt;title&gt;</code> é o link azul no resultado da busca, e a <code>meta description</code> costuma ser o texto embaixo dele. Os dois decidem se a pessoa clica.</p>
${trecho(`<title>Pousada Maré Mansa | Pé na areia em Porto de Galinhas</title>
<meta name="description" content="Quartos com ar-condicionado de frente para o mar, cozinha compartilhada e estacionamento grátis. Reserve pelo WhatsApp.">`)}
<ul>
  <li>Título único por página, de 30 a 60 caracteres, com o assunto principal no começo.</li>
  <li>Descrição de 70 a 160 caracteres, escrita para pessoas: o que a página oferece e por que clicar.</li>
  <li>Um <code>&lt;h1&gt;</code> por página, coerente com o título.</li>
</ul>

<h2>URL canônica</h2>
<p>A mesma página costuma abrir por vários endereços (com e sem <code>www</code>, com <code>?utm_source=...</code>, com <code>index.html</code> no fim). A canônica diz ao buscador qual é o endereço oficial, para não dividir a relevância entre cópias:</p>
${trecho(`<link rel="canonical" href="https://pousadamaremansa.com.br/quartos/">`)}

<h2>Open Graph: o cartão do compartilhamento</h2>
<p>Quando alguém cola o link no WhatsApp, Instagram, LinkedIn ou Facebook, o cartão com imagem, título e descrição vem das tags <strong>Open Graph</strong>:</p>
${trecho(`<meta property="og:type" content="website">
<meta property="og:title" content="Pousada Maré Mansa">
<meta property="og:description" content="Pé na areia em Porto de Galinhas.">
<meta property="og:image" content="https://pousadamaremansa.com.br/img/capa-1200x630.jpg">
<meta property="og:url" content="https://pousadamaremansa.com.br/">
<meta name="twitter:card" content="summary_large_image">`)}
<ul>
  <li>A imagem precisa de endereço <strong>absoluto</strong> (com <code>https://</code>) e fica melhor em 1200 × 630 pixels.</li>
  <li>O WhatsApp guarda o cartão em cache: se mudar a imagem, ela pode demorar a atualizar.</li>
</ul>
${dica('Para conferir como o link vai aparecer, use o depurador de compartilhamento do Facebook (developers.facebook.com/tools/debug) ou o Post Inspector do LinkedIn. Eles também forçam a atualização do cache.')}
`,
              quiz: [
                {
                  pergunta: 'De onde o Google costuma tirar o texto do link azul?',
                  opcoes: ['Do <h1>', 'Do <title>', 'Da URL'],
                  certa: 1,
                  explicacao: 'Por isso o título deve ser único e descrever bem a página.'
                },
                {
                  pergunta: 'Para que serve a URL canônica?',
                  opcoes: [
                    'Redirecionar visitantes',
                    'Dizer qual é o endereço oficial quando a página abre por vários',
                    'Esconder a página'
                  ],
                  certa: 1,
                  explicacao: 'Assim a relevância não se divide entre cópias com ?utm e afins.'
                },
                {
                  pergunta: 'Por que a og:image precisa de endereço absoluto?',
                  opcoes: [
                    'Porque quem lê é outro site (o WhatsApp), que não sabe de onde "img/capa.jpg" é relativo',
                    'Para carregar mais rápido',
                    'Não precisa'
                  ],
                  certa: 0,
                  explicacao: 'Sem https://domínio, o robô do WhatsApp não acha a imagem.'
                }
              ]
            },
            {
              id: 'desafio-cabecalho-completo',
              tipo: 'desafio',
              titulo: 'Desafio: a página pronta para o Google',
              resumo: 'Título, descrição, canônica, Open Graph e um h1.',
              minutos: 16,
              enunciado: `
<p>Complete o <code>&lt;head&gt;</code> da página de quartos da pousada (o site fica em <code>https://pousadamaremansa.com.br</code> e a página em <code>/quartos/</code>):</p>
<ul>
  <li><code>&lt;title&gt;</code> com 30 a 60 caracteres, contendo a palavra "quartos".</li>
  <li><code>meta description</code> com 70 a 160 caracteres.</li>
  <li><code>link rel="canonical"</code> com o endereço absoluto da página.</li>
  <li><code>og:title</code>, <code>og:description</code>, <code>og:type</code> e <code>og:image</code> (endereço absoluto, com https).</li>
  <li><code>html lang="pt-BR"</code> e exatamente um <code>h1</code> na página (hoje há dois).</li>
</ul>`,
              inicial: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Quartos</title>
  </head>
  <body>
    <h1>Pousada Maré Mansa</h1>
    <h1>Nossos quartos</h1>
    <p>Quatro tipos de quarto, todos com ar-condicionado e a poucos passos do mar.</p>
  </body>
</html>
`,
              testes: [
                [
                  'Título de 30 a 60 caracteres, com "quartos"',
                  doc => {
                    const t = doc.title.trim();
                    return t.length >= 30 && t.length <= 60 && /quartos/i.test(t);
                  }
                ],
                [
                  'Descrição de 70 a 160 caracteres',
                  doc => {
                    const d = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
                    return d.length >= 70 && d.length <= 160;
                  }
                ],
                [
                  'Canônica absoluta para https://pousadamaremansa.com.br/quartos/',
                  doc =>
                    doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ===
                    'https://pousadamaremansa.com.br/quartos/'
                ],
                [
                  'Open Graph com título, descrição, tipo e imagem absoluta',
                  doc => {
                    const og = nome =>
                      doc.querySelector(`meta[property="og:${nome}"]`)?.getAttribute('content')?.trim() || '';
                    return (
                      !!og('title') && !!og('description') && !!og('type') && /^https:\/\/\S+\.\S+/.test(og('image'))
                    );
                  }
                ],
                [
                  'lang="pt-BR" e um só h1',
                  doc => /^pt-BR$/i.test(doc.documentElement.lang) && doc.querySelectorAll('h1').length === 1
                ]
              ],
              solucao: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Quartos da Pousada Maré Mansa | Pé na areia</title>
    <meta name="description" content="Quartos de casal, triplo e quádruplo com ar-condicionado, a poucos passos do mar. Veja fotos e preços e reserve pelo WhatsApp.">
    <link rel="canonical" href="https://pousadamaremansa.com.br/quartos/">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Quartos da Pousada Maré Mansa">
    <meta property="og:description" content="Quartos com ar-condicionado a poucos passos do mar.">
    <meta property="og:image" content="https://pousadamaremansa.com.br/img/quartos-1200x630.jpg">
    <meta property="og:url" content="https://pousadamaremansa.com.br/quartos/">
  </head>
  <body>
    <p>Pousada Maré Mansa</p>
    <h1>Nossos quartos</h1>
    <p>Quatro tipos de quarto, todos com ar-condicionado e a poucos passos do mar.</p>
  </body>
</html>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Dados estruturados e as métricas de velocidade que o Google mede.',
      modulos: [
        {
          titulo: 'Entender e medir',
          itens: [
            {
              id: 'dados-estruturados',
              titulo: 'Dados estruturados com schema.org',
              resumo: 'JSON-LD para negócio local, perguntas frequentes e trilha de navegação.',
              minutos: 12,
              corpo: `
<p>O texto da página diz "Diária a partir de R$ 180, check-in às 14h". Uma pessoa entende; um robô precisa adivinhar. Os <strong>dados estruturados</strong> dizem a mesma coisa num formato que máquinas leem sem adivinhar, usando o vocabulário do <strong>schema.org</strong>. Em troca, o Google pode mostrar o resultado com estrelas, preços, perguntas expansíveis ou o quadro do negócio.</p>

<h2>JSON-LD</h2>
<p>O formato recomendado é um <code>&lt;script type="application/ld+json"&gt;</code> com um objeto JSON, em qualquer lugar da página. Ele não aparece para o visitante:</p>
${codigo(`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Pousada Maré Mansa",
  "url": "https://pousadamaremansa.com.br/",
  "telephone": "+55-81-99999-0000",
  "priceRange": "R$ 100 a R$ 280",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua da Praia, 123",
    "addressLocality": "Ipojuca",
    "addressRegion": "PE",
    "postalCode": "55590-000",
    "addressCountry": "BR"
  },
  "checkinTime": "14:00",
  "checkoutTime": "13:00",
  "petsAllowed": true
}
</script>
<script>
  // Confere se o JSON é válido e mostra o tipo
  const dados = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
  console.log(dados['@type'], '·', dados.address.addressLocality);
</script>`)}
<p><code>@type</code> diz o que é a coisa (<code>LodgingBusiness</code> é uma hospedagem; há <code>Restaurant</code>, <code>Dentist</code>, <code>Product</code>, <code>Course</code>, <code>Article</code>...). Cada tipo tem propriedades próprias, listadas no schema.org.</p>

<h2>Perguntas frequentes</h2>
${trecho(`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Aceita animais de estimação?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sim, pets são bem-vindos." }
    }
  ]
}`)}

<h2>As regras</h2>
<ul>
  <li>Os dados precisam corresponder ao que está <strong>visível</strong> na página. Marcar uma nota 5 estrelas que não aparece em lugar nenhum é motivo de punição.</li>
  <li>Teste no <strong>Teste de pesquisa aprimorada</strong> do Google (search.google.com/test/rich-results): ele mostra os erros e quais destaques a página pode ganhar.</li>
  <li>Dados estruturados não garantem os destaques: o Google decide quando mostrar.</li>
</ul>
${dica('O site da Pousada Lagoa Azul, no portfólio, tem um bloco JSON-LD do tipo LodgingBusiness gerado a partir dos mesmos dados do painel de edição. Assim, o que o robô lê nunca fica diferente do que o hóspede vê.')}
`,
              quiz: [
                {
                  pergunta: 'Qual o formato recomendado de dados estruturados?',
                  opcoes: ['Comentários HTML', 'JSON-LD num <script type="application/ld+json">', 'Um arquivo .txt'],
                  certa: 1,
                  explicacao: 'É o formato que o Google recomenda e o mais fácil de manter.'
                },
                {
                  pergunta: 'Para que serve o @type?',
                  opcoes: [
                    'Definir a cor',
                    'Dizer o que a coisa descrita é (hospedagem, produto, artigo...)',
                    'Escolher a língua'
                  ],
                  certa: 1,
                  explicacao: 'O tipo define quais propriedades fazem sentido.'
                },
                {
                  pergunta: 'Posso marcar avaliações que não aparecem na página?',
                  opcoes: ['Sim', 'Não: os dados precisam corresponder ao conteúdo visível', 'Só se forem verdadeiras'],
                  certa: 1,
                  explicacao: 'Marcação enganosa pode tirar os destaques do site inteiro.'
                }
              ]
            },
            {
              id: 'core-web-vitals',
              titulo: 'Core Web Vitals e Lighthouse',
              resumo: 'LCP, INP e CLS: o que medem, os limites e como melhorar cada um.',
              minutos: 13,
              corpo: `
<p>O Google mede a experiência real de quem visita com três números, os <strong>Core Web Vitals</strong>. Eles entram na classificação e, mais importante, se relacionam direto com quanta gente desiste da página.</p>

<h2>LCP: a parte principal apareceu?</h2>
<p><strong>Largest Contentful Paint</strong>: quanto tempo até o maior elemento visível (geralmente a foto de capa ou o título) aparecer. Bom: até <strong>2,5 s</strong>.</p>
<ul>
  <li>Imagem de capa leve (WebP ou AVIF, no tamanho certo) e com <code>fetchpriority="high"</code>.</li>
  <li>Nunca <code>loading="lazy"</code> na imagem principal: ela esperaria o resto.</li>
  <li>CSS e fontes que bloqueiam a página: só o essencial, e as fontes com <code>preload</code>.</li>
</ul>

<h2>INP: responde rápido ao toque?</h2>
<p><strong>Interaction to Next Paint</strong>: o tempo entre um clique (ou toque, ou tecla) e a tela mudar. Bom: até <strong>200 ms</strong>.</p>
<ul>
  <li>JavaScript pesado rodando no carregamento trava os cliques: carregue com <code>defer</code> e divida o que só é usado depois (<code>import()</code> dinâmico).</li>
  <li>Em tarefas longas, devolva o controle ao navegador entre as partes (<code>await new Promise(r =&gt; setTimeout(r))</code>).</li>
</ul>

<h2>CLS: a página pulou?</h2>
<p><strong>Cumulative Layout Shift</strong>: o quanto o conteúdo se mexe sozinho enquanto carrega (aquele botão que muda de lugar na hora do clique). Bom: até <strong>0,1</strong>.</p>
<ul>
  <li>Toda imagem e vídeo com <code>width</code> e <code>height</code> (ou <code>aspect-ratio</code> no CSS): o navegador reserva o espaço antes de baixar.</li>
  <li>Reserve espaço para anúncios, avisos de cookies e conteúdo que chega depois.</li>
  <li>Fontes com <code>font-display: swap</code> e tamanhos parecidos com a fonte reserva.</li>
</ul>
${codigo(`<style>
  body { font-family: system-ui; }
  .caixa { background: #eef2f5; padding: 8px; }
</style>
<p>Sem width/height, o texto abaixo "pula" quando a imagem chega:</p>
<img src="https://picsum.photos/seed/praia/600/300" alt="Praia" style="max-width:100%;height:auto">
<p class="caixa">Este parágrafo desceu quando a imagem carregou.</p>
<p>Com width e height, o espaço já está reservado:</p>
<img src="https://picsum.photos/seed/mar/600/300" alt="Mar" width="600" height="300" style="max-width:100%;height:auto">
<p class="caixa">Este não se mexeu.</p>`)}

<h2>Laboratório x campo</h2>
<ul>
  <li><strong>Laboratório</strong>: o Lighthouse (F12 → Lighthouse) simula um celular médio numa rede lenta. Ótimo para achar problemas e comparar antes e depois.</li>
  <li><strong>Campo</strong>: dados reais de visitantes do Chrome (relatório CrUX), mostrados no PageSpeed Insights e no Search Console. É o que o Google usa na classificação. Só aparece para sites com visitas suficientes.</li>
</ul>
${dica('Este portfólio roda o Lighthouse a cada push no GitHub Actions, com notas mínimas (ferramentas/lighthouserc.json). Se uma mudança deixar o site lento, o commit ganha um X vermelho. A história de como ele ficou três vezes mais rápido está no <a href="../diario/portfolio-mais-rapido.html">diário de estudos</a>.')}
`,
              quiz: [
                {
                  pergunta: 'O que o LCP mede?',
                  opcoes: [
                    'O tempo até o maior elemento visível aparecer',
                    'Quanto a página pula',
                    'O tempo de resposta a cliques'
                  ],
                  certa: 0,
                  explicacao: 'Bom é até 2,5 segundos.'
                },
                {
                  pergunta: 'Qual atributo evita o CLS de imagens?',
                  opcoes: ['loading="lazy"', 'width e height', 'alt'],
                  certa: 1,
                  explicacao: 'Com as dimensões, o navegador reserva o espaço antes de a imagem chegar.'
                },
                {
                  pergunta: 'Qual a diferença entre dados de laboratório e de campo?',
                  opcoes: [
                    'Nenhuma',
                    'Laboratório é uma simulação (Lighthouse); campo são visitantes reais (CrUX)',
                    'Campo é só para computadores'
                  ],
                  certa: 1,
                  explicacao: 'O Google usa os dados de campo na classificação.'
                }
              ]
            },
            {
              id: 'desafio-dados-estruturados',
              tipo: 'desafio',
              titulo: 'Desafio: dados estruturados da pousada',
              resumo: 'Escreva o JSON-LD do negócio e das perguntas frequentes.',
              minutos: 20,
              enunciado: `
<p>Adicione à página dois blocos <code>&lt;script type="application/ld+json"&gt;</code> com JSON válido, usando os dados que já estão visíveis nela:</p>
<ol>
  <li>Um <code>LodgingBusiness</code> com <code>@context</code> <code>https://schema.org</code>, <code>name</code>, <code>telephone</code>, <code>priceRange</code>, <code>checkinTime</code> e <code>address</code> do tipo <code>PostalAddress</code> com <code>streetAddress</code>, <code>addressLocality</code>, <code>addressRegion</code> e <code>addressCountry</code>.</li>
  <li>Um <code>FAQPage</code> com as <strong>duas</strong> perguntas da página em <code>mainEntity</code>, cada uma do tipo <code>Question</code> com <code>name</code> e um <code>acceptedAnswer</code> do tipo <code>Answer</code> com <code>text</code>. Os textos precisam ser os mesmos da página.</li>
</ol>`,
              inicial: `<h1>Pousada Maré Mansa</h1>
<p>Rua da Praia, 123 · Ipojuca, PE · Telefone: +55 81 99999-0000</p>
<p>Diárias de R$ 100 a R$ 280. Check-in a partir das 14:00.</p>

<h2>Perguntas frequentes</h2>
<h3>Aceita animais de estimação?</h3>
<p>Sim, pets são bem-vindos.</p>
<h3>Tem estacionamento?</h3>
<p>Sim, grátis e em frente à praia.</p>

<!-- Os dados estruturados vão aqui -->
`,
              testes: [
                [
                  'Dois blocos de JSON-LD, ambos com JSON válido',
                  doc => {
                    const blocos = [...doc.querySelectorAll('script[type="application/ld+json"]')];
                    if (blocos.length !== 2) return false;
                    try {
                      blocos.forEach(b => JSON.parse(b.textContent));
                      return true;
                    } catch {
                      return false;
                    }
                  }
                ],
                [
                  'LodgingBusiness com nome, telefone, preços e check-in',
                  doc => {
                    const dados = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(b => {
                      try {
                        return JSON.parse(b.textContent);
                      } catch {
                        return {};
                      }
                    });
                    const n = dados.find(d => d['@type'] === 'LodgingBusiness');
                    return (
                      !!n &&
                      /^https:\/\/schema\.org\/?$/.test(n['@context']) &&
                      n.name === 'Pousada Maré Mansa' &&
                      /99999-?0000/.test(n.telephone || '') &&
                      !!n.priceRange &&
                      /^14:00/.test(n.checkinTime || '')
                    );
                  }
                ],
                [
                  'O endereço é um PostalAddress completo',
                  doc => {
                    const dados = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(b => {
                      try {
                        return JSON.parse(b.textContent);
                      } catch {
                        return {};
                      }
                    });
                    const a = dados.find(d => d['@type'] === 'LodgingBusiness')?.address || {};
                    return (
                      a['@type'] === 'PostalAddress' &&
                      /Rua da Praia,? 123/.test(a.streetAddress || '') &&
                      a.addressLocality === 'Ipojuca' &&
                      a.addressRegion === 'PE' &&
                      /^(BR|Brasil|Brazil)$/i.test(a.addressCountry || '')
                    );
                  }
                ],
                [
                  'FAQPage com as duas perguntas e respostas iguais às da página',
                  doc => {
                    const dados = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(b => {
                      try {
                        return JSON.parse(b.textContent);
                      } catch {
                        return {};
                      }
                    });
                    const faq = dados.find(d => d['@type'] === 'FAQPage');
                    const itens = faq?.mainEntity || [];
                    const visivel = [...doc.querySelectorAll('h3')].map(h => [
                      h.textContent.trim(),
                      h.nextElementSibling.textContent.trim()
                    ]);
                    return (
                      itens.length === 2 &&
                      visivel.every(([pergunta, respostaVisivel]) =>
                        itens.some(
                          q =>
                            q['@type'] === 'Question' &&
                            q.name === pergunta &&
                            q.acceptedAnswer?.['@type'] === 'Answer' &&
                            q.acceptedAnswer.text === respostaVisivel
                        )
                      )
                    );
                  }
                ]
              ],
              solucao: `<h1>Pousada Maré Mansa</h1>
<p>Rua da Praia, 123 · Ipojuca, PE · Telefone: +55 81 99999-0000</p>
<p>Diárias de R$ 100 a R$ 280. Check-in a partir das 14:00.</p>

<h2>Perguntas frequentes</h2>
<h3>Aceita animais de estimação?</h3>
<p>Sim, pets são bem-vindos.</p>
<h3>Tem estacionamento?</h3>
<p>Sim, grátis e em frente à praia.</p>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Pousada Maré Mansa",
  "telephone": "+55-81-99999-0000",
  "priceRange": "R$ 100 a R$ 280",
  "checkinTime": "14:00",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua da Praia, 123",
    "addressLocality": "Ipojuca",
    "addressRegion": "PE",
    "addressCountry": "BR"
  }
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Aceita animais de estimação?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sim, pets são bem-vindos." }
    },
    {
      "@type": "Question",
      "name": "Tem estacionamento?",
      "acceptedAnswer": { "@type": "Answer", "text": "Sim, grátis e em frente à praia." }
    }
  ]
}
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Carregar só o necessário, na ordem certa, e manter o site rápido.',
      modulos: [
        {
          titulo: 'Velocidade de verdade',
          itens: [
            {
              id: 'imagens-fontes-e-scripts',
              titulo: 'Imagens, fontes e scripts',
              resumo: 'Formatos modernos, srcset, lazy loading, prioridade, preload e defer.',
              minutos: 14,
              corpo: `
<p>Na maioria dos sites, as imagens são a maior parte do peso, e os scripts são o que mais trava. Arrumar esses dois resolve quase tudo.</p>

<h2>Imagens</h2>
<ul>
  <li><strong>Formato</strong>: WebP é uns 30% menor que JPEG na mesma qualidade; AVIF, ainda menor. Ferramentas como o Squoosh (squoosh.app) ou o pacote <code>sharp</code> no Node convertem.</li>
  <li><strong>Tamanho certo</strong>: uma foto de 4000 px num espaço de 400 px desperdiça 90% dos bytes. Com <code>srcset</code> e <code>sizes</code>, o navegador escolhe a versão certa para cada tela.</li>
  <li><strong>Carregamento preguiçoso</strong>: <code>loading="lazy"</code> só baixa a imagem quando ela está chegando na tela. Use em tudo que fica abaixo da primeira tela.</li>
  <li><strong>Prioridade</strong>: na imagem principal (a do LCP), <code>fetchpriority="high"</code> e nada de lazy.</li>
</ul>
${trecho(`<img src="capa-800.webp"
     srcset="capa-480.webp 480w, capa-800.webp 800w, capa-1600.webp 1600w"
     sizes="(max-width: 600px) 100vw, 800px"
     width="800" height="450" alt="Vista da varanda para o mar"
     fetchpriority="high">

<img src="quarto.webp" width="400" height="300" alt="Quarto de casal" loading="lazy" decoding="async">`)}

<h2>Fontes</h2>
<ul>
  <li>Hospede as fontes no próprio site, em <code>woff2</code>, e só com os caracteres usados (o subconjunto "latin" já cobre o português).</li>
  <li><code>&lt;link rel="preload" as="font" type="font/woff2" crossorigin&gt;</code> para a fonte do texto principal: ela começa a baixar antes do CSS ser lido. O <code>crossorigin</code> é obrigatório para fontes, mesmo no mesmo domínio.</li>
  <li><code>font-display: swap</code> no <code>@font-face</code>: o texto aparece na fonte do sistema e troca quando a fonte chega, em vez de ficar invisível.</li>
</ul>

<h2>Scripts</h2>
<ul>
  <li><code>&lt;script src=&quot;...&quot; defer&gt;</code>: baixa em paralelo e roda depois que o HTML foi lido, na ordem. É o padrão certo para quase tudo.</li>
  <li><code>async</code>: roda assim que chegar, fora de ordem. Bom para scripts independentes, como os de estatística de visitas.</li>
  <li>Sem nenhum dos dois, no <code>&lt;head&gt;</code>, o script <strong>bloqueia</strong> a página até baixar e rodar.</li>
  <li>Código que só é usado depois de uma ação (um editor, um gráfico) pode ser carregado na hora com <code>import()</code>. A área de estudos faz isso com o painel de progresso.</li>
  <li><code>&lt;link rel="preconnect" href="https://cdn.exemplo.com"&gt;</code> adianta a conexão com um domínio externo que você com certeza vai usar.</li>
</ul>
${dica('Scripts de terceiros (chat, pixel de anúncio, mapas, vídeos incorporados) costumam ser o maior peso de um site. Para mapas e vídeos, mostre uma imagem com um botão "carregar mapa" e só baixe o componente de verdade no clique.')}
`,
              quiz: [
                {
                  pergunta: 'Qual atributo usar na imagem principal do topo da página?',
                  opcoes: ['loading="lazy"', 'fetchpriority="high"', 'decoding="sync"'],
                  certa: 1,
                  explicacao: 'Ela é o LCP: tem de chegar primeiro. Lazy a atrasaria.'
                },
                {
                  pergunta: 'O que defer faz num <script>?',
                  opcoes: [
                    'Não carrega o script',
                    'Baixa em paralelo e roda depois que o HTML foi lido, na ordem',
                    'Roda assim que chegar, fora de ordem'
                  ],
                  certa: 1,
                  explicacao: 'O async é que roda fora de ordem.'
                },
                {
                  pergunta: 'Por que o preload de fonte precisa de crossorigin?',
                  opcoes: [
                    'Porque fontes são sempre buscadas em modo CORS; sem ele, o navegador baixa duas vezes',
                    'Para a fonte funcionar em outros sites',
                    'Não precisa'
                  ],
                  certa: 0,
                  explicacao: 'O pré-carregamento sem crossorigin não é reaproveitado.'
                }
              ]
            },
            {
              id: 'medir-e-manter',
              titulo: 'Medir e manter rápido',
              resumo: 'Orçamento de performance, Lighthouse CI, PageSpeed e o que olhar na aba Rede.',
              minutos: 10,
              corpo: `
<p>Deixar um site rápido uma vez é fácil; difícil é ele continuar rápido depois de seis meses de novidades. Para isso, mede-se sempre, e de forma automática.</p>

<h2>A aba Rede</h2>
<p>No F12 → Rede (Network), recarregue a página com o cache desligado e com a limitação "4G lenta". Olhe:</p>
<ul>
  <li>O total transferido e o tempo até a página ficar pronta.</li>
  <li>Os maiores arquivos (ordene pela coluna Tamanho): quase sempre são imagens ou um script grande.</li>
  <li>A <strong>cascata</strong>: arquivos que só começam a baixar depois de outro terminar indicam uma cadeia que pode virar paralela (com preload ou importando antes).</li>
</ul>

<h2>Orçamento de performance</h2>
<p>Um <strong>orçamento</strong> é um limite combinado: "a página inicial tem no máximo 500 KB e nota 90 no Lighthouse". Uma mudança que estoura o orçamento precisa compensar em outro lugar ou ser repensada.</p>
${trecho(`// ferramentas/lighthouserc.json (o deste portfólio é parecido)
{
  "ci": {
    "collect": { "staticDistDir": ".", "url": ["/index.html", "/estudos/index.html"] },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    }
  }
}`)}
<p>No GitHub Actions, a action <code>treosh/lighthouse-ci-action</code> roda esse arquivo a cada push e marca o commit com um X quando alguma nota cai abaixo do mínimo.</p>

<h2>Outras ferramentas</h2>
<ul>
  <li><strong>PageSpeed Insights</strong> (pagespeed.web.dev): Lighthouse + os dados reais de campo, para qualquer endereço público.</li>
  <li><strong>Search Console → Core Web Vitals</strong>: quais páginas do seu site estão lentas para os visitantes de verdade.</li>
  <li><strong>web-vitals</strong>: uma biblioteca pequena para medir LCP, INP e CLS dos seus visitantes e mandar para o seu próprio painel.</li>
</ul>
${dica('Teste num celular de verdade, de preferência um modelo simples. O computador de quem desenvolve é muito mais rápido que o aparelho da maioria das pessoas que vai abrir o site.')}
`,
              quiz: [
                {
                  pergunta: 'O que é um orçamento de performance?',
                  opcoes: [
                    'Quanto custa a hospedagem',
                    'Um limite combinado de peso ou de nota que as mudanças não podem estourar',
                    'Um tipo de cache'
                  ],
                  certa: 1,
                  explicacao: 'Com ele automatizado no CI, o site não fica lento aos poucos sem ninguém perceber.'
                },
                {
                  pergunta: 'Onde ver dados de velocidade de visitantes reais?',
                  opcoes: ['Só no Lighthouse', 'No PageSpeed Insights e no Search Console', 'No sitemap'],
                  certa: 1,
                  explicacao: 'Os dois mostram os dados de campo do Chrome (CrUX).'
                },
                {
                  pergunta: 'Na aba Rede, uma cascata de arquivos em sequência indica:',
                  opcoes: ['Que está tudo certo', 'Uma cadeia que poderia baixar em paralelo', 'Que falta HTTPS'],
                  certa: 1,
                  explicacao: 'Cada arquivo esperando o anterior soma os tempos.'
                }
              ]
            },
            {
              id: 'desafio-pagina-rapida',
              tipo: 'desafio',
              titulo: 'Desafio: deixe a página rápida',
              resumo: 'Prioridade, lazy loading, dimensões, preload de fonte e defer.',
              minutos: 20,
              enunciado: `
<p>Sem mudar o conteúdo, ajuste a página para carregar mais rápido e sem pulos:</p>
<ul>
  <li>A imagem da capa (<code>capa.webp</code>) é a principal: dê prioridade alta e garanta que <strong>não</strong> seja preguiçosa.</li>
  <li>As fotos da galeria (<code>galeria-*.webp</code>) ficam abaixo da primeira tela: carregamento preguiçoso.</li>
  <li><strong>Todas</strong> as imagens precisam de <code>width</code> e <code>height</code> (a capa é 1200 × 675; as da galeria, 400 × 300).</li>
  <li>Pré-carregue a fonte <code>fontes/inter.woff2</code> do jeito certo para fontes.</li>
  <li>Os dois scripts do <code>&lt;head&gt;</code> não podem bloquear a página e precisam rodar em ordem (<code>galeria.js</code> usa o que <code>base.js</code> define).</li>
</ul>`,
              inicial: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Pousada Maré Mansa</title>
    <script src="base.js"></script>
    <script src="galeria.js"></script>
  </head>
  <body>
    <img src="capa.webp" alt="Vista da varanda para o mar" loading="lazy">
    <h1>Pousada Maré Mansa</h1>
    <h2>Galeria</h2>
    <img src="galeria-1.webp" alt="Quarto de casal">
    <img src="galeria-2.webp" alt="Cozinha compartilhada">
    <img src="galeria-3.webp" alt="Praia em frente à pousada">
  </body>
</html>
`,
              testes: [
                [
                  'A capa tem fetchpriority="high" e não é lazy',
                  doc => {
                    const capa = doc.querySelector('img[src="capa.webp"]');
                    return (
                      !!capa && capa.getAttribute('fetchpriority') === 'high' && capa.getAttribute('loading') !== 'lazy'
                    );
                  }
                ],
                [
                  'As fotos da galeria têm loading="lazy"',
                  doc => {
                    const fotos = [...doc.querySelectorAll('img[src^="galeria-"]')];
                    return fotos.length === 3 && fotos.every(f => f.getAttribute('loading') === 'lazy');
                  }
                ],
                [
                  'Todas as imagens têm width e height certos',
                  doc => {
                    const capa = doc.querySelector('img[src="capa.webp"]');
                    const fotos = [...doc.querySelectorAll('img[src^="galeria-"]')];
                    return (
                      capa?.getAttribute('width') === '1200' &&
                      capa?.getAttribute('height') === '675' &&
                      fotos.length === 3 &&
                      fotos.every(f => f.getAttribute('width') === '400' && f.getAttribute('height') === '300')
                    );
                  }
                ],
                [
                  'Preload da fonte com as=font, type e crossorigin',
                  doc => {
                    const l = doc.querySelector('link[rel="preload"][href="fontes/inter.woff2"]');
                    return (
                      !!l &&
                      l.getAttribute('as') === 'font' &&
                      l.getAttribute('type') === 'font/woff2' &&
                      l.hasAttribute('crossorigin')
                    );
                  }
                ],
                [
                  'Os scripts usam defer (não async) e mantêm a ordem',
                  doc => {
                    const s = [...doc.querySelectorAll('script[src]')].filter(x =>
                      /base\.js|galeria\.js/.test(x.getAttribute('src'))
                    );
                    return (
                      s.length === 2 && s[0].getAttribute('src') === 'base.js' && s.every(x => x.defer && !x.async)
                    );
                  }
                ]
              ],
              solucao: `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <title>Pousada Maré Mansa</title>
    <link rel="preload" href="fontes/inter.woff2" as="font" type="font/woff2" crossorigin>
    <script src="base.js" defer></script>
    <script src="galeria.js" defer></script>
  </head>
  <body>
    <img src="capa.webp" alt="Vista da varanda para o mar" width="1200" height="675" fetchpriority="high">
    <h1>Pousada Maré Mansa</h1>
    <h2>Galeria</h2>
    <img src="galeria-1.webp" alt="Quarto de casal" width="400" height="300" loading="lazy">
    <img src="galeria-2.webp" alt="Cozinha compartilhada" width="400" height="300" loading="lazy">
    <img src="galeria-3.webp" alt="Praia em frente à pousada" width="400" height="300" loading="lazy">
  </body>
</html>`
            }
          ]
        }
      ]
    }
  ]
};
