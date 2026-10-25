// Service worker: guarda os arquivos do app para ele abrir sem internet.
// Estratégia: responde na hora com o que está guardado e busca a versão nova em segundo plano.
// Ao mudar a lista de arquivos, troque a VERSAO para descartar o cache antigo.
const VERSAO = 'tarefas-v1';
const ARQUIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/main.js',
  'js/estado.js',
  'js/datas.js',
  'js/aviso.js',
  'js/entrada.js',
  'js/render.js',
  'js/detalhes.js',
  'js/arrastar.js',
  'js/atalhos.js',
  'js/tema.js',
  'js/arquivo.js',
  'js/estatisticas.js',
  'js/lembretes.js',
  'icones/icone.svg',
  'icones/icone-192.png',
  'icones/icone-512.png'
];

self.addEventListener('install', evento => {
  evento.waitUntil(caches.open(VERSAO).then(cache => cache.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches
      .keys()
      .then(nomes => Promise.all(nomes.filter(nome => nome !== VERSAO).map(nome => caches.delete(nome))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', evento => {
  const { request } = evento;
  if (request.method !== 'GET' || new URL(request.url).origin !== location.origin) return;
  evento.respondWith(
    caches.open(VERSAO).then(async cache => {
      const guardada = await cache.match(request, { ignoreSearch: true });
      const daRede = fetch(request)
        .then(resposta => {
          if (resposta.ok) cache.put(request, resposta.clone());
          return resposta;
        })
        .catch(() => guardada);
      return guardada || daRede;
    })
  );
});

// Clicar no lembrete abre (ou traz para frente) o app
self.addEventListener('notificationclick', evento => {
  evento.notification.close();
  evento.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(janelas => {
      const aberta = janelas.find(j => j.url.includes(self.registration.scope));
      return aberta ? aberta.focus() : self.clients.openWindow('./');
    })
  );
});
