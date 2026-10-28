// Trilha de Notificações. Dentro do editor (um iframe), muitos navegadores bloqueiam o pedido de permissão, então os
// exemplos que dependem dela são trechos para testar numa página de verdade. Os desafios trocam Notification e o
// document.visibilityState por versões falsas para conferir a lógica. Depois de editar, rode
// `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'notificacoes',
  area: 'Desenvolvimento web',
  titulo: 'Notificações',
  sigla: 'NT',
  resumo: 'Pedir permissão e avisar a pessoa fora da página, do jeito certo.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Como as notificações funcionam e como pedir permissão.',
      modulos: [
        {
          titulo: 'Permissão',
          itens: [
            {
              id: 'como-funcionam',
              titulo: 'Como as notificações funcionam',
              resumo: 'A API Notification, os três estados da permissão e o primeiro aviso.',
              minutos: 9,
              corpo: `
<p>Notificações são os avisos que aparecem fora da página, no canto da tela ou na central do sistema, mesmo com a aba em segundo plano. Um app de tarefas avisa de um lembrete, um chat avisa de uma mensagem nova. Como elas interrompem a pessoa, o navegador só deixa um site mostrá-las depois de uma <strong>permissão explícita</strong>.</p>

<h2>Os três estados</h2>
<p><code>Notification.permission</code> diz em que pé está:</p>
<ul>
  <li><code>'default'</code>: ainda não perguntou. Dá para pedir.</li>
  <li><code>'granted'</code>: a pessoa aceitou.</li>
  <li><code>'denied'</code>: a pessoa recusou. O site <strong>não pode perguntar de novo</strong>; só a própria pessoa muda isso nas configurações do navegador.</li>
</ul>
${codigo(`<p id="estado"></p>
<script>
  const texto = 'Notification' in window
    ? 'Permissão atual: ' + Notification.permission
    : 'Este navegador não tem a API de notificações.';
  document.querySelector('#estado').textContent = texto;
</script>`)}

<h2>Pedir e mostrar</h2>
<p><code>Notification.requestPermission()</code> abre a pergunta do navegador e devolve uma Promise com a resposta. Com a permissão, <code>new Notification(título, opções)</code> mostra o aviso:</p>
${trecho(`botao.addEventListener('click', async () => {
  const permissao = await Notification.requestPermission();
  if (permissao !== 'granted') return;

  const aviso = new Notification('Pedido enviado', {
    body: 'Seu café sai para entrega até as 15h.',
    icon: '/imagens/icone-192.png',
    tag: 'pedido-123'   // um aviso novo com a mesma tag substitui o anterior
  });

  aviso.addEventListener('click', () => {
    window.focus();      // traz a aba para frente
    aviso.close();
  });
});`)}
${dica('O editor desta trilha roda dentro de um iframe, e muitos navegadores não deixam um iframe pedir essa permissão. Para ver uma notificação de verdade, teste o trecho numa página sua aberta em <code>http://localhost</code> ou em <code>https</code>: notificações só funcionam em páginas seguras.')}

<h2>Opções úteis</h2>
<ul>
  <li><code>body</code>: o texto. Curto e específico ("Ana respondeu: Pode ser às 15h?").</li>
  <li><code>icon</code>: a imagem ao lado, em geral o ícone do site.</li>
  <li><code>tag</code>: agrupa avisos. Dez mensagens no mesmo chat viram uma notificação atualizada, não dez.</li>
  <li><code>requireInteraction</code>: o aviso fica até a pessoa agir. Use só para o que é urgente de verdade.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'A permissão está "denied". O que o site pode fazer?',
                  opcoes: [
                    'Pedir de novo no próximo clique',
                    'Nada: só a pessoa muda isso nas configurações do navegador',
                    'Mostrar a notificação assim mesmo'
                  ],
                  certa: 1,
                  explicacao: 'Uma recusa é definitiva para o site. Por isso a hora de pedir importa tanto.'
                },
                {
                  pergunta: 'Para que serve a opção tag?',
                  opcoes: [
                    'Mudar a cor do aviso',
                    'Fazer um aviso novo substituir o anterior com a mesma tag',
                    'Marcar o aviso como lido'
                  ],
                  certa: 1,
                  explicacao: 'Evita empilhar dez avisos do mesmo assunto.'
                },
                {
                  pergunta: 'Notificações funcionam numa página http:// comum (não localhost)?',
                  opcoes: ['Sim', 'Não: precisam de contexto seguro (https ou localhost)', 'Só no celular'],
                  certa: 1,
                  explicacao: 'A API é restrita a páginas seguras.'
                }
              ]
            },
            {
              id: 'pedir-na-hora-certa',
              titulo: 'Pedir na hora certa',
              resumo: 'Por que nunca pedir ao abrir a página, e o que fazer em vez disso.',
              minutos: 8,
              corpo: `
<p>Todo mundo já entrou num site e foi recebido com "Este site quer enviar notificações". A maioria clica em <strong>Bloquear</strong> por reflexo, e aí o site perdeu a chance para sempre. Navegadores como o Chrome e o Firefox até escondem pedidos feitos sem nenhum clique da pessoa.</p>

<h2>A regra</h2>
<p><strong>Peça só quando a pessoa entender o benefício</strong>, e sempre a partir de um clique dela. O momento certo é logo depois de uma ação que tem relação com o aviso:</p>
<ul>
  <li>Ela criou um lembrete para amanhã: "Quer ser avisada na hora?"</li>
  <li>Ela fez um pedido: "Avisar quando sair para entrega?"</li>
  <li>Ela abriu as configurações e procurou "notificações".</li>
</ul>

<h2>Um convite na página antes do pedido</h2>
<p>Mostre primeiro um convite seu, dentro da página, explicando o que será avisado. Só se a pessoa clicar em "Ativar" você chama o pedido do navegador. Se ela disser "Agora não", você não gastou a única chance:</p>
${codigo(`<style>
  .convite { border: 1px solid #c5ced6; border-radius: 10px; padding: 12px 14px; max-width: 360px; }
  .convite p { margin: 0 0 10px; }
</style>
<button id="lembrete">Criar lembrete para amanhã às 9h</button>
<div class="convite" id="convite" hidden>
  <p><strong>Quer um aviso às 9h?</strong> Mandamos uma notificação só na hora do lembrete.</p>
  <button id="ativar">Ativar avisos</button>
  <button id="depois">Agora não</button>
</div>
<p id="status" role="status"></p>

<script>
  const convite = document.querySelector('#convite');
  const status = document.querySelector('#status');

  document.querySelector('#lembrete').addEventListener('click', () => {
    status.textContent = 'Lembrete criado.';
    const podePerguntar = 'Notification' in window && Notification.permission === 'default';
    convite.hidden = !podePerguntar;
  });

  document.querySelector('#ativar').addEventListener('click', async () => {
    convite.hidden = true;
    const resposta = await Notification.requestPermission();
    status.textContent = resposta === 'granted' ? 'Avisos ativados.' : 'Tudo bem, sem avisos.';
  });

  document.querySelector('#depois').addEventListener('click', () => {
    convite.hidden = true;
    status.textContent = 'Você pode ativar os avisos depois, nas configurações.';
  });
</script>`)}

<h2>Quando foi recusado</h2>
<p>Se <code>Notification.permission</code> for <code>'denied'</code>, não esconda o recurso sem explicação: diga, numa frase, como reativar ("Clique no cadeado ao lado do endereço e permita notificações"). E respeite a escolha: não insista a cada visita.</p>
${dica('Ofereça sempre um jeito de desligar os avisos dentro do próprio site. Quem não acha esse botão vai desligar pelo navegador, e aí desliga tudo.')}
`,
              quiz: [
                {
                  pergunta: 'Qual o melhor momento para pedir permissão?',
                  opcoes: [
                    'Assim que a página carrega',
                    'Depois de uma ação da pessoa ligada ao aviso, como criar um lembrete',
                    'Depois de 30 segundos na página'
                  ],
                  certa: 1,
                  explicacao: 'A pessoa entende o benefício e o pedido vem de um clique dela.'
                },
                {
                  pergunta: 'Para que serve o convite dentro da página antes do pedido do navegador?',
                  opcoes: [
                    'Para enfeitar',
                    'Um "agora não" no convite não gasta a única chance de pedir',
                    'É obrigatório pela API'
                  ],
                  certa: 1,
                  explicacao: 'O pedido do navegador só é chamado se a pessoa mostrou interesse.'
                },
                {
                  pergunta: 'O que fazer se a permissão estiver negada?',
                  opcoes: [
                    'Pedir de novo a cada visita',
                    'Explicar em uma frase como reativar, sem insistir',
                    'Tentar new Notification mesmo assim'
                  ],
                  certa: 1,
                  explicacao: 'O site não pode pedir de novo; só pode informar o caminho.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Avisar dentro da página quando ela está aberta, e fora quando não está.',
      modulos: [
        {
          titulo: 'Dentro e fora da página',
          itens: [
            {
              id: 'avisos-na-pagina',
              titulo: 'Avisos dentro da página',
              resumo: 'Toasts acessíveis, visibilidade da aba e contador no título.',
              minutos: 11,
              corpo: `
<p>Se a pessoa está olhando para a página, uma notificação do sistema é exagero: um aviso dentro da própria página (um <strong>toast</strong>) basta. A notificação faz sentido quando a aba está escondida.</p>

<h2>A aba está visível?</h2>
<p><code>document.visibilityState</code> vale <code>'visible'</code> ou <code>'hidden'</code> (outra aba na frente, janela minimizada). O evento <code>visibilitychange</code> avisa quando isso muda:</p>
${codigo(`<ul id="log"></ul>
<script>
  document.addEventListener('visibilitychange', () => {
    const li = document.createElement('li');
    li.textContent = new Date().toLocaleTimeString('pt-BR') + ': ' + document.visibilityState;
    document.querySelector('#log').append(li);
  });
</script>
<p>Troque de aba e volte para ver o registro.</p>`)}

<h2>Um toast acessível</h2>
<p>Um aviso que só aparece na tela é invisível para quem usa leitor de tela. Uma região com <code>role="status"</code> (ou <code>aria-live="polite"</code>) faz o leitor anunciar o texto novo sem interromper o que a pessoa está fazendo:</p>
${codigo(`<style>
  #avisos { position: fixed; right: 12px; bottom: 12px; display: grid; gap: 8px; }
  .toast { background: #14303a; color: #fff; padding: 10px 14px; border-radius: 10px;
           box-shadow: 0 6px 20px #0003; animation: entra .2s ease-out; }
  @keyframes entra { from { opacity: 0; transform: translateY(8px); } }
</style>
<button id="salvar">Salvar</button>
<div id="avisos" role="status"></div>

<script>
  function toast(texto, ms = 3000) {
    const item = document.createElement('div');
    item.className = 'toast';
    item.textContent = texto;
    document.querySelector('#avisos').append(item);
    setTimeout(() => item.remove(), ms);
  }
  document.querySelector('#salvar').addEventListener('click', () => toast('Alterações salvas.'));
</script>`)}
${dica('Use <code>role="alert"</code> só para erros que exigem atenção imediata: ele interrompe o leitor de tela no meio de uma frase.')}

<h2>Contador no título</h2>
<p>Para quem tem muitas abas abertas, o título é o que aparece. Um número entre parênteses chama atenção sem ser invasivo, e some quando a pessoa volta:</p>
${trecho(`let naoLidas = 0;
const tituloOriginal = document.title;

function novaMensagem() {
  if (document.visibilityState === 'hidden') {
    naoLidas++;
    document.title = \`(\${naoLidas}) \${tituloOriginal}\`;
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    naoLidas = 0;
    document.title = tituloOriginal;
  }
});`)}
`,
              quiz: [
                {
                  pergunta: 'Quando faz mais sentido uma notificação do sistema em vez de um toast?',
                  opcoes: ['Sempre', 'Quando a aba está escondida', 'Quando a aba está visível'],
                  certa: 1,
                  explicacao: 'Com a página na frente da pessoa, o aviso dentro dela basta.'
                },
                {
                  pergunta: 'Para que serve role="status" no contêiner dos avisos?',
                  opcoes: [
                    'Mudar a cor',
                    'Fazer leitores de tela anunciarem o texto novo sem interromper',
                    'Mostrar o aviso fora da página'
                  ],
                  certa: 1,
                  explicacao: 'É uma região "viva": mudanças nela são lidas em voz alta educadamente.'
                },
                {
                  pergunta: 'Qual evento avisa que a aba ficou escondida ou visível?',
                  opcoes: ['focus', 'visibilitychange', 'load'],
                  certa: 1,
                  explicacao: 'Ele dispara a cada mudança de document.visibilityState.'
                }
              ]
            },
            {
              id: 'desafio-avisar',
              tipo: 'desafio',
              titulo: 'Desafio: avisar do jeito certo',
              resumo: 'Escolha entre notificação e toast conforme a permissão e a aba.',
              minutos: 20,
              enunciado: `
<p>Escreva a função <code>avisar(titulo, texto)</code>, que escolhe o melhor jeito de avisar:</p>
<ul>
  <li>Se a API existe, a permissão é <code>'granted'</code> <strong>e</strong> a aba está escondida: cria uma <code>new Notification(titulo, { body: texto })</code>.</li>
  <li>Em qualquer outro caso: acrescenta um toast em <code>#avisos</code>, um <code>&lt;div class="toast"&gt;</code> com o texto <code>"titulo: texto"</code>.</li>
  <li>O contêiner <code>#avisos</code> precisa ser anunciado por leitores de tela (<code>role="status"</code> ou <code>aria-live="polite"</code>).</li>
</ul>
<p>Os testes trocam <code>Notification</code> e o estado da aba por versões falsas.</p>`,
              inicial: `<style>
  #avisos { position: fixed; right: 12px; bottom: 12px; display: grid; gap: 8px; }
  .toast { background: #14303a; color: #fff; padding: 10px 14px; border-radius: 10px; }
</style>
<button id="testar">Avisar</button>
<div id="avisos"></div>

<script>
  function avisar(titulo, texto) {
  }

  document.querySelector('#testar').addEventListener('click', () => {
    avisar('Pedido', 'Seu café saiu para entrega.');
  });
</script>
`,
              testes: [
                [
                  '#avisos tem role="status" ou aria-live="polite"',
                  doc => {
                    const el = doc.querySelector('#avisos');
                    return el.getAttribute('role') === 'status' || el.getAttribute('aria-live') === 'polite';
                  }
                ],
                [
                  'Permissão concedida e aba escondida: cria uma Notification',
                  doc => {
                    const w = doc.defaultView;
                    const criadas = [];
                    const original = w.Notification;
                    w.Notification = class {
                      constructor(t, o) {
                        criadas.push([t, o && o.body]);
                      }
                    };
                    w.Notification.permission = 'granted';
                    Object.defineProperty(doc, 'visibilityState', { value: 'hidden', configurable: true });
                    const toastsAntes = doc.querySelectorAll('#avisos .toast').length;
                    try {
                      w.eval('avisar')('Lembrete', 'Reunião às 15h');
                    } finally {
                      w.Notification = original;
                      delete doc.visibilityState;
                    }
                    return (
                      criadas.length === 1 &&
                      criadas[0][0] === 'Lembrete' &&
                      criadas[0][1] === 'Reunião às 15h' &&
                      doc.querySelectorAll('#avisos .toast').length === toastsAntes
                    );
                  }
                ],
                [
                  'Aba visível: mostra um toast, mesmo com permissão',
                  doc => {
                    const w = doc.defaultView;
                    let criou = false;
                    const original = w.Notification;
                    w.Notification = class {
                      constructor() {
                        criou = true;
                      }
                    };
                    w.Notification.permission = 'granted';
                    Object.defineProperty(doc, 'visibilityState', { value: 'visible', configurable: true });
                    try {
                      w.eval('avisar')('Salvo', 'Tudo certo');
                    } finally {
                      w.Notification = original;
                      delete doc.visibilityState;
                    }
                    const ultimo = [...doc.querySelectorAll('#avisos .toast')].at(-1);
                    return !criou && !!ultimo && ultimo.textContent === 'Salvo: Tudo certo';
                  }
                ],
                [
                  'Sem permissão (ou sem a API): mostra um toast',
                  doc => {
                    const w = doc.defaultView;
                    const original = w.Notification;
                    w.Notification = class {};
                    w.Notification.permission = 'denied';
                    Object.defineProperty(doc, 'visibilityState', { value: 'hidden', configurable: true });
                    let semApi = false;
                    try {
                      w.eval('avisar')('A', 'negado');
                      delete w.Notification;
                      w.eval('avisar')('B', 'sem api');
                      semApi = true;
                    } catch {
                      semApi = false;
                    } finally {
                      w.Notification = original;
                      delete doc.visibilityState;
                    }
                    const textos = [...doc.querySelectorAll('#avisos .toast')].map(t => t.textContent);
                    return semApi && textos.includes('A: negado') && textos.includes('B: sem api');
                  }
                ]
              ],
              solucao: `<style>
  #avisos { position: fixed; right: 12px; bottom: 12px; display: grid; gap: 8px; }
  .toast { background: #14303a; color: #fff; padding: 10px 14px; border-radius: 10px; }
</style>
<button id="testar">Avisar</button>
<div id="avisos" role="status"></div>

<script>
  function avisar(titulo, texto) {
    const podeNotificar =
      'Notification' in window &&
      Notification.permission === 'granted' &&
      document.visibilityState === 'hidden';

    if (podeNotificar) {
      new Notification(titulo, { body: texto });
      return;
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = \`\${titulo}: \${texto}\`;
    document.querySelector('#avisos').append(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  document.querySelector('#testar').addEventListener('click', () => {
    avisar('Pedido', 'Seu café saiu para entrega.');
  });
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Push: avisos que chegam mesmo com o site fechado.',
      modulos: [
        {
          titulo: 'Push e service worker',
          itens: [
            {
              id: 'push',
              titulo: 'Notificações push',
              resumo: 'Service worker, inscrição com chave VAPID e o servidor que envia.',
              minutos: 14,
              corpo: `
<p>Tudo até aqui só funciona com a página aberta. Para avisar quando o site está <strong>fechado</strong> (uma mensagem nova, um pedido que saiu), é preciso <strong>push</strong>: o seu servidor manda uma mensagem para o serviço de push do navegador, que acorda o <strong>service worker</strong> do site, e ele mostra a notificação.</p>

<h2>As peças</h2>
<ol>
  <li><strong>Service worker</strong>: um script que o navegador mantém registrado mesmo com a aba fechada (a trilha de PWA explica em detalhes).</li>
  <li><strong>Inscrição</strong>: com a permissão, a página pede ao <code>PushManager</code> uma inscrição. Ela traz um endereço (<code>endpoint</code>) e chaves, que você salva no seu servidor junto com a conta da pessoa.</li>
  <li><strong>Chaves VAPID</strong>: um par de chaves do seu servidor. A pública vai na inscrição; a privada assina os envios, provando que é você.</li>
  <li><strong>Envio</strong>: o servidor manda a mensagem para o <code>endpoint</code>, em geral com uma biblioteca como <code>web-push</code> (Node.js).</li>
</ol>

<h2>Na página: inscrever</h2>
${trecho(`const registro = await navigator.serviceWorker.register('/sw.js');
const permissao = await Notification.requestPermission();
if (permissao === 'granted') {
  const inscricao = await registro.pushManager.subscribe({
    userVisibleOnly: true,                 // todo push vira um aviso visível
    applicationServerKey: CHAVE_PUBLICA_VAPID
  });
  await fetch('/api/inscricoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inscricao)
  });
}`)}

<h2>No service worker: receber e mostrar</h2>
${trecho(`// sw.js
self.addEventListener('push', evento => {
  const dados = evento.data?.json() ?? { titulo: 'Novidade', texto: '' };
  evento.waitUntil(
    self.registration.showNotification(dados.titulo, {
      body: dados.texto,
      icon: '/icone-192.png',
      data: { url: dados.url ?? '/' },
      actions: [{ action: 'abrir', title: 'Abrir' }]
    })
  );
});

self.addEventListener('notificationclick', evento => {
  evento.notification.close();
  evento.waitUntil(clients.openWindow(evento.notification.data.url));
});`)}
<p><code>waitUntil</code> mantém o service worker acordado até a notificação aparecer. Sem ele, o navegador pode desligá-lo no meio.</p>

<h2>No servidor: enviar</h2>
${trecho(`// Node.js, com o pacote web-push
import webpush from 'web-push';

webpush.setVapidDetails('mailto:contato@meusite.com', CHAVE_PUBLICA, CHAVE_PRIVADA);

await webpush.sendNotification(inscricaoSalva, JSON.stringify({
  titulo: 'Pedido saiu para entrega',
  texto: 'Chega em cerca de 40 minutos.',
  url: '/pedidos/123'
}));`)}
${dica('No iPhone e no iPad, o push na web só funciona depois que a pessoa adiciona o site à tela de início (como um app instalado). Se o seu público usa muito iOS, explique isso no convite.')}

<h2>Boas práticas</h2>
<ul>
  <li>Quando o envio responde 404 ou 410, a inscrição morreu (a pessoa revogou ou trocou de navegador): apague-a do banco.</li>
  <li>Deixe a pessoa escolher <strong>o que</strong> quer receber (pedidos sim, promoções não).</li>
  <li>Promoção demais por push é o caminho mais curto para a permissão ser revogada.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Quem mostra a notificação quando o site está fechado?',
                  opcoes: ['A página', 'O service worker, acordado pelo push', 'O servidor diretamente'],
                  certa: 1,
                  explicacao:
                    'O servidor envia ao serviço de push, que acorda o service worker, que chama showNotification.'
                },
                {
                  pergunta: 'Para que servem as chaves VAPID?',
                  opcoes: [
                    'Criptografar o banco de dados',
                    'Identificar o seu servidor como o remetente autorizado dos pushes',
                    'Fazer login da pessoa'
                  ],
                  certa: 1,
                  explicacao: 'A chave pública vai na inscrição; a privada assina cada envio.'
                },
                {
                  pergunta: 'O envio de um push respondeu 410. O que fazer?',
                  opcoes: ['Tentar de novo a cada minuto', 'Apagar essa inscrição do banco', 'Pedir permissão de novo'],
                  certa: 1,
                  explicacao: 'A inscrição não existe mais; guardá-la só gera envios inúteis.'
                }
              ]
            },
            {
              id: 'desafio-lembretes',
              tipo: 'desafio',
              titulo: 'Desafio: lembretes agendados',
              resumo: 'Agende e cancele lembretes que avisam na hora certa.',
              minutos: 22,
              enunciado: `
<p>Monte o agendador de lembretes de um app de tarefas. A função <code>avisar(texto)</code> já existe (ela mostra um toast).</p>
<ul>
  <li><code>agendarLembrete(texto, segundos)</code>: agenda o aviso, mostra o lembrete em <code>#lembretes</code> (um <code>&lt;li&gt;</code> com o texto) e devolve um <strong>id</strong>.</li>
  <li>Quando chega a hora: chama <code>avisar(texto)</code> e tira o <code>&lt;li&gt;</code> da lista.</li>
  <li><code>cancelarLembrete(id)</code>: o aviso não acontece mais e o <code>&lt;li&gt;</code> sai da lista.</li>
</ul>`,
              inicial: `<ul id="lembretes"></ul>
<div id="avisos" role="status"></div>

<script>
  function avisar(texto) {
    const div = document.createElement('div');
    div.className = 'toast';
    div.textContent = texto;
    document.querySelector('#avisos').append(div);
  }

  function agendarLembrete(texto, segundos) {
  }

  function cancelarLembrete(id) {
  }

  agendarLembrete('Tomar água', 2);
</script>
`,
              testes: [
                [
                  'agendarLembrete mostra o lembrete na lista e devolve um id',
                  doc => {
                    const w = doc.defaultView;
                    const antes = doc.querySelectorAll('#lembretes li').length;
                    const id = w.eval('agendarLembrete')('Teste lista', 30);
                    const depois = [...doc.querySelectorAll('#lembretes li')];
                    w.eval('cancelarLembrete')(id);
                    return (
                      id !== undefined &&
                      depois.length === antes + 1 &&
                      depois.some(li => li.textContent.includes('Teste lista'))
                    );
                  }
                ],
                [
                  'Na hora, chama avisar e tira o lembrete da lista',
                  async doc => {
                    const w = doc.defaultView;
                    w.eval('agendarLembrete')('Hora do café', 0.1);
                    await w.__esperar(350);
                    const avisou = [...doc.querySelectorAll('#avisos .toast')].some(
                      t => t.textContent === 'Hora do café'
                    );
                    const naLista = [...doc.querySelectorAll('#lembretes li')].some(li =>
                      li.textContent.includes('Hora do café')
                    );
                    return avisou && !naLista;
                  }
                ],
                [
                  'cancelarLembrete impede o aviso e tira da lista',
                  async doc => {
                    const w = doc.defaultView;
                    const id = w.eval('agendarLembrete')('Cancelado', 0.1);
                    w.eval('cancelarLembrete')(id);
                    const naLista = [...doc.querySelectorAll('#lembretes li')].some(li =>
                      li.textContent.includes('Cancelado')
                    );
                    await w.__esperar(350);
                    const avisou = [...doc.querySelectorAll('#avisos .toast')].some(t => t.textContent === 'Cancelado');
                    return !naLista && !avisou;
                  }
                ]
              ],
              solucao: `<ul id="lembretes"></ul>
<div id="avisos" role="status"></div>

<script>
  function avisar(texto) {
    const div = document.createElement('div');
    div.className = 'toast';
    div.textContent = texto;
    document.querySelector('#avisos').append(div);
  }

  const agendados = new Map(); // id do timer → <li> na lista

  function agendarLembrete(texto, segundos) {
    const li = document.createElement('li');
    li.textContent = texto;
    document.querySelector('#lembretes').append(li);

    const id = setTimeout(() => {
      avisar(texto);
      li.remove();
      agendados.delete(id);
    }, segundos * 1000);

    agendados.set(id, li);
    return id;
  }

  function cancelarLembrete(id) {
    clearTimeout(id);
    agendados.get(id)?.remove();
    agendados.delete(id);
  }

  agendarLembrete('Tomar água', 2);
</script>`
            }
          ]
        }
      ]
    }
  ]
};
