// Liga tudo: navegação entre telas, o painel do agente e o tema.
import { responder, EXEMPLOS } from './agente-local.js';
import { markdownSimples, perguntarAoClaude } from './agente-claude.js';
import { aoMudar, estado, mudou } from './estado.js';
import { ferramenta } from './ferramentas.js';
import * as telas from './telas.js';
import { html } from './util.js';

const TELAS = {
  visao: telas.visao,
  transacoes: telas.transacoes,
  orcamentos: telas.orcamentos,
  previsao: telas.previsao,
  metas: telas.metas,
  importar: telas.importarTela,
  ajustes: telas.ajustes
};
const NOMES = {
  visao: 'Visão geral',
  transacoes: 'Transações',
  orcamentos: 'Orçamentos',
  previsao: 'Previsão',
  metas: 'Metas',
  importar: 'Importar extrato',
  ajustes: 'Ajustes'
};
const principal = document.getElementById('conteudo');
let telaAtual = null;

function telaDoEndereco() {
  const nome = location.hash.slice(1);
  return TELAS[nome] ? nome : 'visao';
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
  document.title = `${NOMES[nome]} | Agente Financeiro`;
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
      <p>Oi${estado.nome ? `, ${html(estado.nome)}` : ''}! Eu leio o seu extrato e respondo com os números: quanto gastou, para onde foi o dinheiro, se dá para fazer uma compra e como o saldo deve ficar nas próximas semanas.</p>
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
      const status = textoStatus => {
        pensando.classList.add('pensando');
        pensando.textContent = textoStatus;
        conversa.scrollTop = conversa.scrollHeight;
      };
      const r = await perguntarAoClaude(estado, texto, {
        aoPensar: () => status('Pensando…'),
        aoUsarFerramenta: nome => status(`Consultando: ${nome.replace(/_/g, ' ')}…`),
        // O texto aparece enquanto o modelo escreve
        aoEscrever: parcial => {
          pensando.classList.remove('pensando');
          pensando.innerHTML = markdownSimples(parcial);
          conversa.scrollTop = conversa.scrollHeight;
        }
      });
      // Um botão desfaz todas as mudanças da resposta, da última para a primeira
      const desfazer = r.desfazer.length
        ? ` <button type="button" class="btn-texto" data-desfazer='${html(JSON.stringify([...r.desfazer].reverse()))}'>Desfazer</button>`
        : '';
      const consultas = r.usadas.length
        ? `<p class="recibo-nota">Consultei: ${r.usadas.map(n => html(n.replace(/_/g, ' '))).join(', ')}.</p>`
        : '';
      resposta = { autor: 'agente', texto: r.texto, html: r.html + consultas + desfazer };
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
    // O agente local guarda um desfazer só; o modo Claude, uma lista (já na ordem de desfazer)
    const lista = [JSON.parse(desfazer.dataset.desfazer)].flat();
    for (const { ferramenta: nome, entrada } of lista) ferramenta(nome)?.executar(estado, entrada);
    const mensagem = desfazer.closest('.msg');
    desfazer.replaceWith(
      Object.assign(document.createElement('span'), {
        className: 'recibo-nota',
        textContent: 'Desfeito.'
      })
    );
    // Guarda o "Desfeito." na mensagem certa, mesmo que não seja a última
    const indice = [...conversa.children].indexOf(mensagem);
    if (estado.conversa[indice]) estado.conversa[indice].html = mensagem.innerHTML;
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
    localStorage.setItem('agente-financeiro-tema', novo);
  } catch {}
});

atualizarModo();
desenharConversa();
desenhar({ mudouDeTela: true });
