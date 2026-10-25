// Liga as três ferramentas às abas, aos atalhos de teclado e ao título da aba do navegador.
import {
  alternarCronometro,
  cronometroRodando,
  iniciarCronometro,
  marcarVolta,
  tempoCronometro,
  zerarCronometro
} from './cronometro.js';
import {
  alternarTemporizador,
  iniciarTemporizador,
  temporizadorRodando,
  tempoTemporizador,
  zerarTemporizador
} from './temporizador.js';
import { alternarPomodoro, iniciarPomodoro, pomodoroRodando, tempoPomodoro, zerarPomodoro } from './pomodoro.js';

const ABAS = ['cronometro', 'temporizador', 'pomodoro'];
const abas = ABAS.map(nome => document.getElementById(`aba-${nome}`));
let atual = 'cronometro';

/* ---------- Abas (com setas ← → do teclado, como manda o padrão de acessibilidade) ---------- */

function mostrar(nome, focar = false) {
  atual = nome;
  ABAS.forEach((n, i) => {
    const ativa = n === nome;
    abas[i].setAttribute('aria-selected', ativa);
    abas[i].tabIndex = ativa ? 0 : -1;
    document.getElementById(`painel-${n}`).hidden = !ativa;
  });
  if (focar) abas[ABAS.indexOf(nome)].focus();
  history.replaceState(null, '', `${location.search}#${nome}`);
  atualizarTitulo();
}

abas.forEach((aba, i) => {
  aba.addEventListener('click', () => mostrar(ABAS[i]));
  aba.addEventListener('keydown', e => {
    const passo = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!passo) return;
    e.preventDefault();
    mostrar(ABAS[(i + passo + ABAS.length) % ABAS.length], true);
  });
});

/* ---------- Atalhos ---------- */

const ATALHOS = {
  cronometro: { ' ': alternarCronometro, v: marcarVolta, z: zerarCronometro },
  temporizador: { ' ': alternarTemporizador, z: zerarTemporizador },
  pomodoro: { ' ': alternarPomodoro, z: zerarPomodoro }
};

document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  if (e.target.closest?.('input, select, textarea')) return;
  const tecla = e.key.toLowerCase();
  if (['1', '2', '3'].includes(tecla)) return mostrar(ABAS[Number(tecla) - 1]);
  // Com um botão em foco, o navegador já "clica" nele ao apertar Espaço
  if (tecla === ' ' && e.target.closest?.('button')) return;
  const acao = ATALHOS[atual][tecla];
  if (!acao) return;
  e.preventDefault();
  acao();
});

/* ---------- Título da aba: mostra o que está correndo, mesmo vendo outra ferramenta ---------- */

const TITULO = document.title;
function atualizarTitulo() {
  if (pomodoroRodando()) document.title = `🍅 ${tempoPomodoro()}`;
  else if (temporizadorRodando()) document.title = `⏳ ${tempoTemporizador()}`;
  else if (cronometroRodando()) document.title = `⏱ ${tempoCronometro()}`;
  else document.title = TITULO;
  // Bolinha nas abas com algo rodando
  abas[0].classList.toggle('ativo', cronometroRodando());
  abas[1].classList.toggle('ativo', temporizadorRodando());
  abas[2].classList.toggle('ativo', pomodoroRodando());
}
setInterval(atualizarTitulo, 500);

/* ---------- Início ---------- */

iniciarCronometro();
iniciarTemporizador();
const veioDoGerenciador = iniciarPomodoro();
const pedida = location.hash.slice(1);
mostrar(veioDoGerenciador ? 'pomodoro' : ABAS.includes(pedida) ? pedida : 'cronometro');
