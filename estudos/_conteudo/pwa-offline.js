// Trilha de PWA. Service workers não podem ser registrados dentro do editor (um iframe sem endereço próprio), então
// o código deles aparece em trechos. Os desafios conferem o manifesto (um JSON dentro da página) e as estratégias de
// cache, escritas como funções que recebem um cache e uma rede falsos. A Cache API funciona no editor e tem exemplo.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'pwa-offline',
  area: 'Desenvolvimento web',
  titulo: 'PWA offline',
  sigla: 'PWA',
  resumo: 'Service worker, cache e manifesto: um site que instala como app e funciona sem internet.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'O que é um PWA e o manifesto que deixa o site instalável.',
      modulos: [
        {
          titulo: 'Site que vira app',
          itens: [
            {
              id: 'o-que-e-pwa',
              titulo: 'O que é um PWA',
              resumo: 'As três peças: HTTPS, manifesto e service worker.',
              minutos: 8,
              corpo: `
<p>Um <strong>PWA</strong> (Progressive Web App) é um site que se comporta como aplicativo: pode ser <strong>instalado</strong> (ganha ícone na tela inicial e abre em janela própria), <strong>funciona sem internet</strong> e pode receber notificações. Não precisa de loja nem de um código separado para Android e iOS: é o mesmo site, com três peças a mais.</p>

<h2>As três peças</h2>
<ol>
  <li><strong>HTTPS</strong>: service workers só funcionam em páginas seguras (e em <code>localhost</code>, para desenvolver). O GitHub Pages e a Netlify já dão HTTPS.</li>
  <li><strong>Manifesto</strong>: um arquivo JSON com nome, ícones e cores do app. É o que o navegador usa para montar o atalho e a tela de abertura.</li>
  <li><strong>Service worker</strong>: um script que fica entre a página e a rede. Ele intercepta cada pedido e decide se responde com o que está guardado no cache ou se busca na internet. É ele que faz o site abrir offline.</li>
</ol>

<h2>Progressivo</h2>
<p>O "progressive" do nome é importante: o site continua funcionando em navegadores que não têm alguma dessas peças. Quem tem, ganha os extras. Por isso o registro do service worker sempre vem dentro de um <code>if</code>:</p>
${trecho(`if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}`)}

<h2>Quando vale a pena</h2>
<ul>
  <li>Apps usados com frequência e em lugares com sinal ruim: lista de tarefas, cardápio de restaurante, app de motorista em zona rural.</li>
  <li>Ferramentas que a pessoa quer ter "à mão" sem instalar nada da loja.</li>
  <li>Sites que precisam abrir rápido mesmo em conexões lentas: o cache deixa a segunda visita quase instantânea.</li>
</ul>
${dica('No Chrome, a aba <strong>Application</strong> das ferramentas de desenvolvedor mostra o manifesto, o service worker e o que está no cache. E o Lighthouse tem uma verificação de PWA que aponta o que falta.')}
`,
              quiz: [
                {
                  pergunta: 'Qual peça faz o site abrir sem internet?',
                  opcoes: ['O manifesto', 'O service worker', 'O HTTPS'],
                  certa: 1,
                  explicacao: 'Ele intercepta os pedidos e pode responder com o que guardou no cache.'
                },
                {
                  pergunta: 'Service workers funcionam numa página http:// publicada?',
                  opcoes: ['Sim', 'Não: só em HTTPS (ou localhost)', 'Só no Firefox'],
                  certa: 1,
                  explicacao: 'Como ele intercepta tudo, o navegador exige uma conexão segura.'
                },
                {
                  pergunta: 'O que significa o "progressivo" de PWA?',
                  opcoes: [
                    'Que carrega aos poucos',
                    'Que o site funciona em todo navegador e ganha extras onde há suporte',
                    'Que precisa ser atualizado sempre'
                  ],
                  certa: 1,
                  explicacao: 'Nada quebra onde não há suporte; os recursos de app são um bônus.'
                }
              ]
            },
            {
              id: 'manifesto',
              titulo: 'O manifesto',
              resumo: 'Nome, ícones, cores, start_url e display.',
              minutos: 10,
              corpo: `
<p>O manifesto é um arquivo JSON (em geral <code>manifest.webmanifest</code>) ligado no <code>&lt;head&gt;</code> de todas as páginas:</p>
${trecho(`<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0b7a6f">
<link rel="apple-touch-icon" href="/icones/icone-180.png">`)}

<h2>Um manifesto completo</h2>
${trecho(`{
  "name": "Tarefas do Dia",
  "short_name": "Tarefas",
  "description": "Listas, prazos e lembretes, mesmo sem internet.",
  "start_url": "/?origem=app",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0b7a6f",
  "lang": "pt-BR",
  "icons": [
    { "src": "/icones/icone-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icones/icone-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icones/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}`)}
<ul>
  <li><code>name</code> aparece na instalação e na tela de abertura; <code>short_name</code>, embaixo do ícone (até uns 12 caracteres, senão é cortado).</li>
  <li><code>start_url</code>: a página que abre ao tocar no ícone. Um parâmetro como <code>?origem=app</code> ajuda a medir quem usa o app instalado.</li>
  <li><code>display</code>: <code>standalone</code> abre sem a barra do navegador, como um app. <code>browser</code> abre como site comum.</li>
  <li><code>theme_color</code> pinta a barra do sistema; <code>background_color</code> é o fundo da tela de abertura.</li>
  <li><code>icons</code>: pelo menos 192×192 e 512×512 em PNG. O ícone <strong>maskable</strong> tem margem de segurança, para o Android recortar em círculo ou gota sem cortar o desenho.</li>
</ul>
${dica('No ícone maskable, o desenho importante deve caber num círculo de 80% do tamanho, no centro. O site maskable.app mostra como ele fica em cada formato.')}

<h2>O botão de instalar</h2>
<p>Navegadores com Chromium disparam o evento <code>beforeinstallprompt</code> quando o site pode ser instalado. Guardar esse evento permite mostrar um botão "Instalar app" seu, na hora certa:</p>
${trecho(`let pedidoDeInstalacao;
window.addEventListener('beforeinstallprompt', evento => {
  evento.preventDefault();         // não mostra a sugestão automática
  pedidoDeInstalacao = evento;
  botaoInstalar.hidden = false;
});

botaoInstalar.addEventListener('click', async () => {
  pedidoDeInstalacao.prompt();
  const { outcome } = await pedidoDeInstalacao.userChoice;   // 'accepted' ou 'dismissed'
  botaoInstalar.hidden = true;
});`)}
<p>No iPhone não existe esse evento: a instalação é pelo botão Compartilhar, opção "Adicionar à Tela de Início". Vale explicar isso para quem usa iOS.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual valor de display faz o app abrir sem a barra do navegador?',
                  opcoes: ['browser', 'standalone', 'minimal'],
                  certa: 1,
                  explicacao: 'standalone abre em janela própria, como um app instalado.'
                },
                {
                  pergunta: 'Para que serve um ícone maskable?',
                  opcoes: [
                    'Esconder o ícone',
                    'Ter margem para o sistema recortar em formas diferentes sem cortar o desenho',
                    'Ser usado no modo escuro'
                  ],
                  certa: 1,
                  explicacao: 'O Android recorta os ícones; o maskable foi feito para isso.'
                },
                {
                  pergunta: 'Onde aparece o short_name?',
                  opcoes: ['Na aba do navegador', 'Embaixo do ícone na tela inicial', 'No Google'],
                  certa: 1,
                  explicacao: 'O espaço é pequeno, por isso ele deve ser curto.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'O ciclo de vida do service worker e o primeiro cache.',
      modulos: [
        {
          titulo: 'Service worker',
          itens: [
            {
              id: 'service-worker',
              titulo: 'O service worker',
              resumo: 'Registro, install, activate, fetch e atualizações.',
              minutos: 14,
              corpo: `
<p>O service worker é um arquivo JavaScript separado, que roda fora da página: não tem acesso ao DOM, conversa com as páginas por mensagens e pode ser desligado pelo navegador quando não está fazendo nada. O que ele tem de especial são os <strong>eventos</strong>.</p>

<h2>Registrar</h2>
${trecho(`// app.js (na página)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}`)}
<p>O <strong>escopo</strong> é a pasta onde o arquivo está: <code>/sw.js</code> controla o site inteiro; <code>/app/sw.js</code> só as páginas dentro de <code>/app/</code>. Por isso ele costuma ficar na raiz.</p>

<h2>O ciclo de vida</h2>
<ol>
  <li><strong>install</strong>: roda uma vez por versão. É a hora de baixar e guardar no cache os arquivos essenciais (o "app shell").</li>
  <li><strong>activate</strong>: a versão nova assume. É a hora de apagar caches de versões antigas.</li>
  <li><strong>fetch</strong>: dispara a cada pedido das páginas controladas (HTML, CSS, imagens, chamadas de API). Aqui você decide de onde vem a resposta.</li>
</ol>
${trecho(`// sw.js
const VERSAO = 'v3';
const ESSENCIAIS = ['/', '/index.html', '/css/style.css', '/js/app.js', '/offline.html'];

self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(VERSAO).then(cache => cache.addAll(ESSENCIAIS))
  );
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(nomes =>
      Promise.all(nomes.filter(nome => nome !== VERSAO).map(nome => caches.delete(nome)))
    )
  );
});

self.addEventListener('fetch', evento => {
  if (evento.request.method !== 'GET') return;     // só GET vai para o cache
  evento.respondWith(
    caches.match(evento.request).then(guardado => guardado ?? fetch(evento.request))
  );
});`)}
<p><code>waitUntil</code> segura a etapa até a Promise terminar: se o <code>addAll</code> falhar (um arquivo com 404, por exemplo), a instalação falha e a versão antiga continua.</p>

<h2>Atualizações</h2>
<p>O navegador confere o <code>sw.js</code> a cada navegação. Se <strong>qualquer byte</strong> mudou, uma versão nova é instalada, mas fica <strong>esperando</strong>: só assume quando todas as abas com a versão antiga forem fechadas. Isso evita que a página e o service worker fiquem com versões que não combinam.</p>
${trecho(`// Para assumir na hora (cuidado: a página aberta continua com o JS antigo)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', evento => evento.waitUntil(self.clients.claim()));`)}
${dica('O erro mais comum: mudar o CSS e esquecer de mudar a versão no <code>sw.js</code>. O arquivo do service worker continua igual, nenhuma versão nova é instalada, e todo mundo continua vendo o CSS velho do cache. Trocar <code>VERSAO</code> a cada publicação resolve.')}
`,
              quiz: [
                {
                  pergunta: 'Em que evento se guardam os arquivos essenciais no cache?',
                  opcoes: ['fetch', 'install', 'activate'],
                  certa: 1,
                  explicacao: 'install roda uma vez por versão, antes de ela assumir.'
                },
                {
                  pergunta: 'Uma versão nova do service worker foi instalada. Quando ela assume?',
                  opcoes: [
                    'Na hora',
                    'Quando todas as abas da versão antiga forem fechadas (ou com skipWaiting)',
                    'Depois de 24 horas'
                  ],
                  certa: 1,
                  explicacao: 'Ela fica em espera para não misturar versões numa página aberta.'
                },
                {
                  pergunta: 'O que /js/sw.js consegue controlar?',
                  opcoes: ['O site inteiro', 'Só as páginas dentro de /js/', 'Nada'],
                  certa: 1,
                  explicacao: 'O escopo padrão é a pasta do arquivo. Por isso ele fica na raiz.'
                }
              ]
            },
            {
              id: 'desafio-manifesto',
              tipo: 'desafio',
              titulo: 'Desafio: manifesto do app',
              resumo: 'Escreva o manifesto completo de um app de receitas.',
              minutos: 15,
              enunciado: `
<p>O app <strong>Receitas da Vó</strong> vai virar PWA. Complete o manifesto dentro da tag <code>&lt;script id="manifesto"&gt;</code> (é JSON: aspas duplas e sem vírgula sobrando). A prévia ao lado mostra como ele vai aparecer.</p>
<ul>
  <li><code>name</code> "Receitas da Vó" e um <code>short_name</code> com no máximo 12 caracteres.</li>
  <li><code>start_url</code> "/" e <code>display</code> "standalone".</li>
  <li><code>theme_color</code> e <code>background_color</code> como cores hexadecimais.</li>
  <li>Ícones PNG de <strong>192x192</strong> e <strong>512x512</strong>, e um deles com <code>"purpose": "maskable"</code>.</li>
</ul>`,
              inicial: `<script type="application/manifest+json" id="manifesto">
{
  "name": "Receitas da Vó",
  "icons": []
}
</script>

<div id="previa"></div>

<script>
  // Prévia: lê o manifesto acima e mostra como o app aparece
  const previa = document.querySelector('#previa');
  try {
    const m = JSON.parse(document.querySelector('#manifesto').textContent);
    previa.innerHTML = \`
      <div style="display:flex;gap:12px;align-items:center;padding:14px;border-radius:14px;
                  background:\${m.background_color || '#eee'};border:6px solid \${m.theme_color || '#ccc'}">
        <div style="width:48px;height:48px;border-radius:12px;background:\${m.theme_color || '#999'}"></div>
        <div><strong>\${m.short_name || '(sem short_name)'}</strong><br><small>\${m.display || 'browser'}</small></div>
      </div>
      <p>\${(m.icons || []).length} ícone(s)</p>\`;
  } catch (erro) {
    previa.textContent = 'O JSON tem um erro: ' + erro.message;
  }
</script>
`,
              testes: [
                [
                  'O manifesto é um JSON válido',
                  doc => {
                    JSON.parse(doc.querySelector('#manifesto').textContent);
                    return true;
                  }
                ],
                [
                  'name certo e short_name com até 12 caracteres',
                  doc => {
                    const m = JSON.parse(doc.querySelector('#manifesto').textContent);
                    return (
                      m.name === 'Receitas da Vó' &&
                      typeof m.short_name === 'string' &&
                      m.short_name.length > 0 &&
                      m.short_name.length <= 12
                    );
                  }
                ],
                [
                  'start_url "/" e display "standalone"',
                  doc => {
                    const m = JSON.parse(doc.querySelector('#manifesto').textContent);
                    return m.start_url === '/' && m.display === 'standalone';
                  }
                ],
                [
                  'theme_color e background_color em hexadecimal',
                  doc => {
                    const m = JSON.parse(doc.querySelector('#manifesto').textContent);
                    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
                    return hex.test(m.theme_color) && hex.test(m.background_color);
                  }
                ],
                [
                  'Ícones PNG de 192x192 e 512x512, um deles maskable',
                  doc => {
                    const m = JSON.parse(doc.querySelector('#manifesto').textContent);
                    const icones = Array.isArray(m.icons) ? m.icons : [];
                    const tem = tamanho =>
                      icones.some(i => i.sizes === tamanho && i.type === 'image/png' && typeof i.src === 'string');
                    return tem('192x192') && tem('512x512') && icones.some(i => String(i.purpose).includes('maskable'));
                  }
                ]
              ],
              solucao: `<script type="application/manifest+json" id="manifesto">
{
  "name": "Receitas da Vó",
  "short_name": "Receitas",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#b45309",
  "background_color": "#fff7ed",
  "icons": [
    { "src": "/icones/icone-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icones/icone-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icones/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
</script>

<div id="previa"></div>

<script>
  const previa = document.querySelector('#previa');
  try {
    const m = JSON.parse(document.querySelector('#manifesto').textContent);
    previa.innerHTML = \`
      <div style="display:flex;gap:12px;align-items:center;padding:14px;border-radius:14px;
                  background:\${m.background_color || '#eee'};border:6px solid \${m.theme_color || '#ccc'}">
        <div style="width:48px;height:48px;border-radius:12px;background:\${m.theme_color || '#999'}"></div>
        <div><strong>\${m.short_name || '(sem short_name)'}</strong><br><small>\${m.display || 'browser'}</small></div>
      </div>
      <p>\${(m.icons || []).length} ícone(s)</p>\`;
  } catch (erro) {
    previa.textContent = 'O JSON tem um erro: ' + erro.message;
  }
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Estratégias de cache e a página offline.',
      modulos: [
        {
          titulo: 'Estratégias offline',
          itens: [
            {
              id: 'estrategias-de-cache',
              titulo: 'Estratégias de cache',
              resumo: 'Cache primeiro, rede primeiro, stale-while-revalidate e página offline.',
              minutos: 14,
              corpo: `
<p>Não existe uma estratégia certa para tudo: cada tipo de arquivo pede uma. As mais usadas têm nome:</p>
<ul>
  <li><strong>Cache primeiro</strong> (<em>cache first</em>): responde do cache; só vai à rede se não tiver. Para o que quase nunca muda: fontes, ícones, CSS e JS com versão no nome.</li>
  <li><strong>Rede primeiro</strong> (<em>network first</em>): tenta a rede; se falhar, usa o cache. Para o que precisa estar atualizado, como as páginas HTML e dados de uma API.</li>
  <li><strong>Stale-while-revalidate</strong>: responde do cache na hora (rápido) e, em paralelo, busca a versão nova para a próxima vez. Para avatares, listas que podem estar um pouco velhas.</li>
</ul>

<h2>A Cache API</h2>
<p>A mesma API que o service worker usa também existe na página, e dá para experimentar aqui. Um cache guarda pares de pedido e resposta:</p>
${codigo(`<script>
  (async () => {
    try {
      const cache = await caches.open('exemplo-v1');
      await cache.put('/api/cotacao', new Response(JSON.stringify({ dolar: 5.42 }), {
        headers: { 'Content-Type': 'application/json' }
      }));

      const guardada = await cache.match('/api/cotacao');
      console.log('achou?', !!guardada, await guardada.json());
      console.log('e esta?', await cache.match('/nao-existe'));

      await caches.delete('exemplo-v1');
    } catch (erro) {
      // Alguns navegadores não liberam o cache dentro de um editor como este (um iframe)
      console.warn('A Cache API não está disponível aqui. Teste numa página sua em localhost. (' + erro.name + ')');
    }
  })();
</script>`)}

<h2>As estratégias no service worker</h2>
${trecho(`async function cachePrimeiro(pedido) {
  const guardado = await caches.match(pedido);
  if (guardado) return guardado;
  const resposta = await fetch(pedido);
  const cache = await caches.open(VERSAO);
  cache.put(pedido, resposta.clone());      // uma Response só pode ser lida uma vez
  return resposta;
}

async function redePrimeiro(pedido) {
  try {
    const resposta = await fetch(pedido);
    const cache = await caches.open(VERSAO);
    cache.put(pedido, resposta.clone());
    return resposta;
  } catch {
    return (await caches.match(pedido)) ?? caches.match('/offline.html');
  }
}

self.addEventListener('fetch', evento => {
  const { request } = evento;
  if (request.mode === 'navigate') evento.respondWith(redePrimeiro(request));
  else if (request.destination === 'font' || request.destination === 'image') evento.respondWith(cachePrimeiro(request));
});`)}
<p>O <code>.clone()</code> é necessário porque o corpo de uma resposta é um fluxo que só pode ser lido uma vez: uma cópia vai para o cache e a outra para a página.</p>

<h2>A página offline</h2>
<p>Guarde uma <code>offline.html</code> simples no <code>install</code> e use como último recurso nas navegações. Ela é muito melhor que o dinossauro do navegador: diga o que aconteceu e o que ainda funciona ("Você está sem internet. As tarefas salvas continuam aqui.").</p>
${dica('Não guarde respostas com erro. Antes do <code>cache.put</code>, confira <code>resposta.ok</code>: senão um 500 do servidor fica preso no cache e é servido para sempre.')}
<p>Em projetos maiores, a biblioteca <strong>Workbox</strong> (do Google) já traz essas estratégias prontas e gera a lista de arquivos do <code>install</code> no build.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual estratégia combina com as páginas HTML de um site de notícias?',
                  opcoes: ['Cache primeiro', 'Rede primeiro, com o cache como reserva', 'Nunca usar cache'],
                  certa: 1,
                  explicacao:
                    'O conteúdo precisa estar atualizado, mas offline é melhor mostrar a última versão do que nada.'
                },
                {
                  pergunta: 'Por que usar resposta.clone() antes do cache.put?',
                  opcoes: [
                    'Para deixar mais rápido',
                    'O corpo de uma resposta só pode ser lido uma vez',
                    'O cache exige cópias'
                  ],
                  certa: 1,
                  explicacao: 'Uma cópia vai para o cache e a original segue para a página.'
                },
                {
                  pergunta: 'O que o stale-while-revalidate faz?',
                  opcoes: [
                    'Espera a rede e depois o cache',
                    'Responde do cache na hora e atualiza o cache em paralelo para a próxima vez',
                    'Apaga o cache velho'
                  ],
                  certa: 1,
                  explicacao: 'Rápido agora, atualizado na próxima visita.'
                }
              ]
            },
            {
              id: 'desafio-estrategias',
              tipo: 'desafio',
              titulo: 'Desafio: estratégias de cache',
              resumo: 'Implemente cache primeiro e rede primeiro com página offline.',
              minutos: 25,
              enunciado: `
<p>Para dar para testar fora de um service worker, as funções recebem o cache e a rede como parâmetros. <code>cache</code> tem <code>match(url)</code> (devolve uma Promise com a resposta ou <code>undefined</code>) e <code>put(url, resposta)</code>. <code>rede(url)</code> devolve uma Promise que <strong>rejeita</strong> quando não há internet.</p>
<ul>
  <li><code>cachePrimeiro(url, cache, rede)</code>: devolve o que está no cache. Se não houver, busca na rede, guarda no cache (só se <code>resposta.ok</code>) e devolve.</li>
  <li><code>redePrimeiro(url, cache, rede)</code>: busca na rede, guarda no cache (só se <code>ok</code>) e devolve. Se a rede falhar, devolve o que estiver no cache para essa url; se não houver, devolve o que estiver em <code>'/offline.html'</code>.</li>
</ul>
<p>As respostas falsas dos testes são objetos simples com <code>ok</code> e <code>texto</code>, então não precisa de <code>clone()</code> aqui.</p>`,
              inicial: `<script>
  async function cachePrimeiro(url, cache, rede) {
  }

  async function redePrimeiro(url, cache, rede) {
  }
</script>
`,
              testes: [
                [
                  'cachePrimeiro usa o cache sem ir à rede quando já tem',
                  async doc => {
                    let foiARede = false;
                    const cache = {
                      match: async u => (u === '/a.css' ? { ok: true, texto: 'do cache' } : undefined),
                      put: async () => {}
                    };
                    const r = await doc.defaultView.eval('cachePrimeiro')('/a.css', cache, async () => {
                      foiARede = true;
                      return { ok: true, texto: 'da rede' };
                    });
                    return r && r.texto === 'do cache' && !foiARede;
                  }
                ],
                [
                  'cachePrimeiro busca na rede e guarda quando não tem (só respostas ok)',
                  async doc => {
                    const guardados = {};
                    const cache = { match: async u => guardados[u], put: async (u, r) => (guardados[u] = r) };
                    const f = doc.defaultView.eval('cachePrimeiro');
                    const r = await f('/b.js', cache, async () => ({ ok: true, texto: 'novo' }));
                    await f('/erro', cache, async () => ({ ok: false, texto: 'erro 500' }));
                    return r.texto === 'novo' && guardados['/b.js']?.texto === 'novo' && !('/erro' in guardados);
                  }
                ],
                [
                  'redePrimeiro prefere a rede e atualiza o cache',
                  async doc => {
                    const guardados = { '/': { ok: true, texto: 'velho' } };
                    const cache = { match: async u => guardados[u], put: async (u, r) => (guardados[u] = r) };
                    const r = await doc.defaultView.eval('redePrimeiro')('/', cache, async () => ({
                      ok: true,
                      texto: 'novo'
                    }));
                    return r.texto === 'novo' && guardados['/'].texto === 'novo';
                  }
                ],
                [
                  'Sem rede, redePrimeiro usa o cache e depois a página offline',
                  async doc => {
                    const guardados = {
                      '/sobre': { ok: true, texto: 'sobre salvo' },
                      '/offline.html': { ok: true, texto: 'offline' }
                    };
                    const cache = { match: async u => guardados[u], put: async (u, r) => (guardados[u] = r) };
                    const semRede = async () => {
                      throw new TypeError('Failed to fetch');
                    };
                    const f = doc.defaultView.eval('redePrimeiro');
                    const a = await f('/sobre', cache, semRede);
                    const b = await f('/contato', cache, semRede);
                    return a.texto === 'sobre salvo' && b.texto === 'offline';
                  }
                ]
              ],
              solucao: `<script>
  async function cachePrimeiro(url, cache, rede) {
    const guardado = await cache.match(url);
    if (guardado) return guardado;
    const resposta = await rede(url);
    if (resposta.ok) await cache.put(url, resposta);
    return resposta;
  }

  async function redePrimeiro(url, cache, rede) {
    try {
      const resposta = await rede(url);
      if (resposta.ok) await cache.put(url, resposta);
      return resposta;
    } catch {
      return (await cache.match(url)) ?? (await cache.match('/offline.html'));
    }
  }
</script>`
            }
          ]
        }
      ]
    }
  ]
};
