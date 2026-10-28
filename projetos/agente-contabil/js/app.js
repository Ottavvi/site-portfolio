// Liga tudo: navegação entre telas, o painel do agente e o tema (Agente Contábil).
import { responder, EXEMPLOS } from './agente-local.js';
import { perguntarAoClaude } from './agente-claude.js';
import { aoMudar, estado, mudou } from './estado.js';
import { ferramenta } from './ferramentas.js';
import * as telas from './telas.js';
import { html } from './util.js';

const TELAS = {
  painel: telas.painel,
  lancamentos: telas.lancamentos,
  diario: telas.diario,
  razao: telas.razao,
  balancete: telas.balancete,
  dre: telas.dre,
  balanco: telas.balanco,
  impostos: telas.impostos,
  obrigacoes: telas.obrigacoesTela,
  importar: telas.importarTela,
  ajustes: telas.ajustes
};
const NOMES = {
  painel: 'Painel',
  lancamentos: 'Extrato e contas',
  diario: 'Livro diário',
  razao: 'Razão',
  balancete: 'Balancete',
  dre: 'DRE',
  balanco: 'Balanço',
  impostos: 'Impostos',
  obrigacoes: 'Obrigações',
  importar: 'Importar extrato',
  ajustes: 'Empresa e ajustes'
};
const principal = document.getElementById('conteudo');
let telaAtual = null;

function telaDoEndereco() {
  const nome = location.hash.slice(1);
  return TELAS[nome] ? nome : 'painel';
}

function desenhar({ mudouDeTela = false } = {}) {
  const nome = telaDoEndereco();
  // Na tela de importar, um redesenho no meio da leitura do arquivo perderia a prévia
  if (!mudouDeTela && nome === 'importar') return;
  const rolagem = window.scrollY;
  TELAS[nome](principal);
  document.querySelectorAll('[data-tela]').forEach(link => {
    if (link.dataset.tela === nome) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = `${NOMES[nome]} | Agente Contábil`;
  document.getElementById('avisoExemplo').hidden = !estado.exemplo;
  if (mudouDeTela) {
    window.scrollTo(0, 0);
    principal.focus({ preventScroll: true });
  } else window.scrollTo(0, rolagem);
  telaAtual = nome;
}

window.addEventListener('hashchange', () => desenhar({ mudouDeTela: telaDoEndereco() !== telaAtual }));
aoMudar(() => {
  desenhar();
  atualizarModo();
});

// ---------- Agente ----------
const conversa = document.getElementById('conversa');
const form = document.getElementById('formPergunta');
const campo = document.getElementById('pergunta');
const painel = document.getElementById('agente');
const modo = document.getElementById('agenteModo');

function atualizarModo() {
  const claude = estado.ajustes.usarClaude && estado.ajustes.chaveApi;
  modo.textContent = claude
    ? `Respondendo com o Claude (${estado.ajustes.modelo.replace('claude-', '').replace(/-(\d)-(\d)$/, ' $1.$2')})`
    : 'Respondendo com os dados deste navegador';
  modo.classList.toggle('claude', Boolean(claude));
}

function desenharConversa() {
  if (!estado.conversa.length) {
    conversa.innerHTML = `<div class="msg msg-agente">
      <p>Olá! Eu transformo o extrato da empresa em lançamentos contábeis e respondo com os números: lucro, DAS, Fator R, balanço, prazos e como lançar cada operação.</p>
      <div class="sugestoes">${EXEMPLOS.slice(0, 6)
        .map(e => `<button type="button" data-pergunta="${html(e)}">${html(e)}</button>`)
        .join('')}</div>
    </div>`;
    return;
  }
  conversa.innerHTML = estado.conversa
    .map(m =>
      m.autor === 'pessoa'
        ? `<div class="msg msg-pessoa">${html(m.texto)}</div>`
        : `<div class="msg msg-agente">${m.html}</div>`
    )
    .join('');
  conversa.scrollTop = conversa.scrollHeight;
}

let ocupado = false;
async function perguntar(texto) {
  texto = texto.trim();
  if (!texto || ocupado) return;
  abrirAgente();
  estado.conversa.push({ autor: 'pessoa', texto });
  desenharConversa();
  const usarClaude = estado.ajustes.usarClaude && estado.ajustes.chaveApi;
  let resposta;
  if (usarClaude) {
    ocupado = true;
    const pensando = document.createElement('div');
    pensando.className = 'msg msg-agente pensando';
    pensando.textContent = 'Consultando seus dados…';
    conversa.append(pensando);
    conversa.scrollTop = conversa.scrollHeight;
    try {
      const r = await perguntarAoClaude(estado, texto, {
        aoUsarFerramenta: nome => (pensando.textContent = `Consultando: ${nome.replace(/_/g, ' ')}…`)
      });
      resposta = {
        autor: 'agente',
        texto: r.texto,
        html:
          r.html +
          r.desfazer
            .map(
              d =>
                `<button type="button" class="btn-texto" data-desfazer='${html(JSON.stringify(d))}'>Desfazer</button>`
            )
            .join(' ')
      };
    } catch (erro) {
      resposta = {
        autor: 'agente',
        texto: '',
        html: `<div class="msg-erro">${html(erro.message)} Enquanto isso, respondi com o agente local:</div>${responder(estado, texto)}`
      };
    } finally {
      ocupado = false;
    }
  } else {
    resposta = { autor: 'agente', texto: '', html: responder(estado, texto) };
  }
  estado.conversa.push(resposta);
  estado.conversa = estado.conversa.slice(-40);
  mudou();
  desenharConversa();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const texto = campo.value;
  campo.value = '';
  campo.style.height = '';
  perguntar(texto);
});
campo.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});
campo.addEventListener('input', () => {
  campo.style.height = 'auto';
  campo.style.height = `${Math.min(campo.scrollHeight, 140)}px`;
});

// Botões de pergunta pronta e de desfazer, em qualquer lugar da página
document.addEventListener('click', e => {
  const pergunta = e.target.closest('[data-pergunta]');
  if (pergunta) {
    perguntar(pergunta.dataset.pergunta);
    return;
  }
  const desfazer = e.target.closest('[data-desfazer]');
  if (desfazer) {
    const { ferramenta: nome, entrada } = JSON.parse(desfazer.dataset.desfazer);
    ferramenta(nome)?.executar(estado, entrada);
    desfazer.replaceWith(
      Object.assign(document.createElement('span'), {
        className: 'recibo-nota',
        textContent: 'Desfeito.'
      })
    );
    const ultima = estado.conversa.at(-1);
    if (ultima) ultima.html = conversa.lastElementChild.innerHTML;
    mudou();
  }
});

// Em telas menores o agente é uma gaveta
const botaoAbrir = document.getElementById('abrirAgente');
function abrirAgente() {
  if (getComputedStyle(botaoAbrir).display === 'none') return;
  painel.classList.add('aberto');
  botaoAbrir.setAttribute('aria-expanded', 'true');
}
function fecharAgente() {
  painel.classList.remove('aberto');
  botaoAbrir.setAttribute('aria-expanded', 'false');
  botaoAbrir.focus();
}
botaoAbrir.addEventListener('click', () => {
  abrirAgente();
  campo.focus();
});
document.getElementById('agenteFechar').addEventListener('click', fecharAgente);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && painel.classList.contains('aberto')) fecharAgente();
});

// Tema: segue o sistema até a pessoa escolher
document.getElementById('btnTema').addEventListener('click', () => {
  const escuroAgora =
    document.documentElement.dataset.tema === 'escuro' ||
    (!document.documentElement.dataset.tema && matchMedia('(prefers-color-scheme: dark)').matches);
  const novo = escuroAgora ? 'claro' : 'escuro';
  document.documentElement.dataset.tema = novo;
  try {
    localStorage.setItem('agente-contabil-tema', novo);
  } catch {}
});

atualizarModo();
desenharConversa();
desenhar({ mudouDeTela: true });
