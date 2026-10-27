// Paleta de comandos: Ctrl+K (ou ⌘K, ou "/") abre uma busca para ir a qualquer página ou projeto e fazer ações rápidas

const EN = document.documentElement.lang === 'en';
const MAC = /Mac|iPhone|iPad/.test(navigator.platform);
// Raiz do site, descoberta pelo endereço do style.css (funciona em qualquer pasta, inclusive na 404)
const RAIZ = new URL('../', document.querySelector('link[href*="css/style.css"]').href);
const url = caminho => new URL(caminho, RAIZ).href;
const inicio = EN ? 'en/index.html' : 'index.html';

const TEXTOS = EN
  ? {
      placeholder: 'Search pages, projects and actions...',
      vazio: 'Nothing found.',
      abrir: 'Open command palette',
      grupos: { paginas: 'Pages', projetos: 'Projects', acoes: 'Actions' },
      dica: 'to navigate',
      copiado: 'Email copied!'
    }
  : {
      placeholder: 'Buscar páginas, projetos e ações...',
      vazio: 'Nada encontrado.',
      abrir: 'Abrir paleta de comandos',
      grupos: { paginas: 'Páginas', projetos: 'Projetos', acoes: 'Ações' },
      dica: 'para navegar',
      copiado: 'E-mail copiado!'
    };

// [grupo, título, destino (endereço ou função), palavras extras para a busca]
const comandos = [
  ['paginas', EN ? 'Home' : 'Início', url(inicio), 'home inicio'],
  ['paginas', EN ? 'Projects' : 'Projetos', url(`${inicio}#projetos`), 'portfolio trabalhos work'],
  ['paginas', EN ? 'Skills' : 'Habilidades', url(`${inicio}#habilidades`), 'stack tecnologias'],
  ['paginas', EN ? 'About me' : 'Sobre mim', url(EN ? 'en/about.html' : 'sobre.html'), 'trajetoria journey'],
  ['paginas', EN ? 'Contact' : 'Contato', url(`${inicio}#contato`), 'email mensagem message'],
  [
    'projetos',
    EN ? 'Rota Municipal: case study' : 'Rota Municipal: estudo de caso',
    url(EN ? 'en/rota-municipal.html' : 'rota-municipal.html'),
    'react node prefeitura frota'
  ],
  [
    'projetos',
    EN ? 'Rota Municipal: presentation' : 'Rota Municipal: apresentação',
    url('projetos/rota-municipal/'),
    'sistema'
  ],
  [
    'projetos',
    EN ? 'Pousada Lagoa Azul: case study' : 'Pousada Lagoa Azul: estudo de caso',
    url(EN ? 'en/pousada.html' : 'pousada.html'),
    'reserva pix site'
  ],
  [
    'projetos',
    EN ? 'Pousada Lagoa Azul: website' : 'Pousada Lagoa Azul: site',
    'https://ottavvi.github.io/pousada-site/',
    'guesthouse'
  ],
  [
    'projetos',
    EN ? 'Personal finance' : 'Organização financeira',
    url('projetos/financas/'),
    'excel power bi planilha'
  ],
  [
    'projetos',
    EN ? 'Business finance dashboards: case study' : 'Painel financeiro para empresas: estudo de caso',
    url(EN ? 'en/paineis.html' : 'paineis.html'),
    'power bi dax bi dados'
  ],
  [
    'projetos',
    EN ? 'Business finance dashboards' : 'Painel financeiro para empresas',
    url('projetos/painel-empresas/'),
    'power bi dax'
  ],
  ['projetos', EN ? 'Barbershop landing page' : 'Landing page para barbearia', url('projetos/barbearia/'), 'barber'],
  ['projetos', EN ? 'Task manager' : 'Gerenciador de tarefas', url('projetos/tarefas/'), 'tarefas todo pwa'],
  ['projetos', EN ? 'Time hub' : 'Central de tempo', url('projetos/cronometro/'), 'cronometro pomodoro timer'],
  [
    'acoes',
    EN ? 'Switch light/dark theme' : 'Alternar tema claro/escuro',
    () => document.getElementById('themeBtn')?.click(),
    'theme dark light escuro claro'
  ],
  ['acoes', EN ? 'Copy my email' : 'Copiar meu e-mail', copiarEmail, 'email contato contact'],
  ['acoes', EN ? 'Open my GitHub' : 'Abrir meu GitHub', 'https://github.com/Ottavvi', 'codigo code repositorio'],
  [
    'acoes',
    EN ? 'Ver em português' : 'View in English',
    document.querySelector('.lang-link')?.href || url(EN ? 'index.html' : 'en/index.html'),
    'idioma language pt en'
  ]
].map(([grupo, titulo, destino, extras]) => ({ grupo, titulo, destino, busca: normalizar(`${titulo} ${extras}`) }));

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

async function copiarEmail() {
  try {
    await navigator.clipboard.writeText('otaviosvlom@gmail.com');
    avisar(TEXTOS.copiado);
  } catch {
    location.href = 'mailto:otaviosvlom@gmail.com';
  }
}

// Aviso rápido no rodapé da tela
function avisar(texto) {
  const aviso = document.createElement('div');
  aviso.className = 'cmd-toast';
  aviso.setAttribute('role', 'status');
  aviso.textContent = texto;
  document.body.append(aviso);
  setTimeout(() => aviso.remove(), 2200);
}

// ---------- Janela da paleta ----------
const dialogo = document.createElement('dialog');
dialogo.className = 'cmd';
dialogo.innerHTML = `
  <div class="cmd-busca">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
    <input type="text" role="combobox" aria-expanded="true" aria-controls="cmdLista" aria-autocomplete="list"
      autocomplete="off" spellcheck="false" placeholder="${TEXTOS.placeholder}" aria-label="${TEXTOS.placeholder}" />
    <kbd>Esc</kbd>
  </div>
  <ul class="cmd-lista" id="cmdLista" role="listbox"></ul>
  <p class="cmd-rodape"><kbd>↑</kbd><kbd>↓</kbd> ${TEXTOS.dica} · <kbd>Enter</kbd></p>`;
document.body.append(dialogo);
const campo = dialogo.querySelector('input');
const lista = dialogo.querySelector('.cmd-lista');
let visiveis = [];
let ativo = 0;

function desenhar() {
  const termos = normalizar(campo.value).split(/\s+/).filter(Boolean);
  visiveis = comandos.filter(c => termos.every(t => c.busca.includes(t)));
  ativo = Math.min(ativo, Math.max(visiveis.length - 1, 0));
  lista.innerHTML = '';
  if (!visiveis.length) {
    lista.innerHTML = `<li class="cmd-vazio">${TEXTOS.vazio}</li>`;
    campo.removeAttribute('aria-activedescendant');
    return;
  }
  let grupoAtual = '';
  visiveis.forEach((comando, i) => {
    if (comando.grupo !== grupoAtual) {
      grupoAtual = comando.grupo;
      const titulo = document.createElement('li');
      titulo.className = 'cmd-grupo';
      titulo.setAttribute('role', 'presentation');
      titulo.textContent = TEXTOS.grupos[grupoAtual];
      lista.append(titulo);
    }
    const item = document.createElement('li');
    item.id = `cmd-${i}`;
    item.className = 'cmd-item';
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(i === ativo));
    item.textContent = comando.titulo;
    item.addEventListener('pointermove', () => marcar(i));
    item.addEventListener('click', () => executar(comando));
    lista.append(item);
  });
  campo.setAttribute('aria-activedescendant', `cmd-${ativo}`);
}

function marcar(i) {
  if (i === ativo) return;
  lista.querySelector(`#cmd-${ativo}`)?.setAttribute('aria-selected', 'false');
  ativo = i;
  const item = lista.querySelector(`#cmd-${ativo}`);
  item?.setAttribute('aria-selected', 'true');
  item?.scrollIntoView({ block: 'nearest' });
  campo.setAttribute('aria-activedescendant', `cmd-${ativo}`);
}

function executar(comando) {
  dialogo.close();
  if (typeof comando.destino === 'function') return comando.destino();
  if (comando.destino.startsWith(location.origin)) location.href = comando.destino;
  else window.open(comando.destino, '_blank', 'noopener');
}

function abrir() {
  if (dialogo.open) return;
  campo.value = '';
  ativo = 0;
  desenhar();
  dialogo.showModal();
  campo.focus();
}

campo.addEventListener('input', () => {
  ativo = 0;
  desenhar();
});
campo.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (visiveis.length) marcar((ativo + (event.key === 'ArrowDown' ? 1 : -1) + visiveis.length) % visiveis.length);
  } else if (event.key === 'Enter' && visiveis[ativo]) {
    event.preventDefault();
    executar(visiveis[ativo]);
  }
});
// Clique fora da janela fecha
dialogo.addEventListener('click', event => {
  if (event.target === dialogo) dialogo.close();
});

document.addEventListener('keydown', event => {
  const digitando =
    event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]');
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    dialogo.open ? dialogo.close() : abrir();
  } else if (event.key === '/' && !digitando && !dialogo.open) {
    event.preventDefault();
    abrir();
  }
});

// Botão no cabeçalho (ao lado do tema), para quem não usa o teclado
const botao = document.createElement('button');
botao.type = 'button';
botao.className = 'cmd-btn';
botao.setAttribute('aria-label', TEXTOS.abrir);
botao.title = `${TEXTOS.abrir} (${MAC ? '⌘' : 'Ctrl'}+K)`;
botao.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg><kbd>${MAC ? '⌘' : 'Ctrl'} K</kbd>`;
botao.addEventListener('click', abrir);
document.getElementById('themeBtn')?.before(botao);
