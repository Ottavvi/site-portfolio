// Temporizador: contagem regressiva com atalhos (1, 5, 10, 15, 30 min) ou tempo livre, +1 min e alarme.
// Guarda a hora em que vai terminar: continua certo com a aba em segundo plano ou depois de recarregar.
import { desenharAnel, formatarRestante, gravar, ler, notificar, prepararSom, tocarAlarme } from './apoio.js';

const $ = id => document.getElementById(id);
const CHAVE = 'tempo-temporizador';

let estado = ler(CHAVE, { duracao: 5 * 60000, fimEm: null, restante: 5 * 60000, terminouEm: null });
let relogio = null;

const restante = () => (estado.fimEm ? estado.fimEm - Date.now() : estado.restante);
const salvar = () => gravar(CHAVE, estado);
export const temporizadorRodando = () => Boolean(estado.fimEm);
export const tempoTemporizador = () => formatarRestante(restante());

function atualizar() {
  const ms = restante();
  if (estado.fimEm && ms <= 0) return terminar();
  $('tmTempo').textContent = formatarRestante(ms);
  desenharAnel($('tmAnel'), estado.duracao ? ms / estado.duracao : 0);
  const terminou = Boolean(estado.terminouEm);
  $('tmPainel').classList.toggle('terminou', terminou);
  $('tmStatus').textContent = terminou
    ? `Tempo esgotado às ${new Date(estado.terminouEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    : estado.fimEm
      ? `Termina às ${new Date(estado.fimEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      : `Total: ${formatarRestante(estado.duracao)}`;
  $('tmIniciar').textContent = estado.fimEm
    ? 'Pausar'
    : terminou
      ? 'Repetir'
      : ms < estado.duracao
        ? 'Continuar'
        : 'Iniciar';
  $('tmIniciar').classList.toggle('rodando', Boolean(estado.fimEm));
  $('tmMais').disabled = terminou;
  document.querySelectorAll('[data-minutos]').forEach(b => {
    b.setAttribute('aria-pressed', !estado.fimEm && estado.duracao === Number(b.dataset.minutos) * 60000);
  });
}

function rodar() {
  clearInterval(relogio);
  relogio = setInterval(atualizar, 200);
}

function terminar() {
  clearInterval(relogio);
  estado = { ...estado, fimEm: null, restante: 0, terminouEm: estado.fimEm };
  salvar();
  atualizar();
  tocarAlarme();
  setTimeout(() => tocarAlarme(), 1500);
  notificar('Tempo esgotado ⏰', `O temporizador de ${formatarRestante(estado.duracao)} terminou.`);
}

export function alternarTemporizador() {
  prepararSom();
  if (estado.fimEm) {
    estado.restante = restante();
    estado.fimEm = null;
    clearInterval(relogio);
  } else {
    if (estado.terminouEm || estado.restante <= 0) estado.restante = estado.duracao;
    estado.terminouEm = null;
    estado.fimEm = Date.now() + estado.restante;
    rodar();
  }
  salvar();
  atualizar();
}

export function zerarTemporizador() {
  clearInterval(relogio);
  estado = { ...estado, fimEm: null, restante: estado.duracao, terminouEm: null };
  salvar();
  atualizar();
}

function definir(ms) {
  if (!(ms > 0)) return;
  clearInterval(relogio);
  estado = { duracao: ms, fimEm: null, restante: ms, terminouEm: null };
  salvar();
  atualizar();
}

function maisUmMinuto() {
  estado.duracao += 60000;
  if (estado.fimEm) estado.fimEm += 60000;
  else estado.restante += 60000;
  salvar();
  atualizar();
}

export function iniciarTemporizador() {
  $('tmIniciar').addEventListener('click', alternarTemporizador);
  $('tmZerar').addEventListener('click', zerarTemporizador);
  $('tmMais').addEventListener('click', maisUmMinuto);
  document
    .querySelectorAll('[data-minutos]')
    .forEach(b => b.addEventListener('click', () => definir(Number(b.dataset.minutos) * 60000)));
  $('tmLivre').addEventListener('submit', e => {
    e.preventDefault();
    const minutos = Number($('tmMinutos').value) || 0;
    const segundos = Number($('tmSegundos').value) || 0;
    definir((minutos * 60 + segundos) * 1000);
  });

  // Terminou enquanto a página estava fechada: mostra o aviso, sem tocar o alarme atrasado
  if (estado.fimEm && restante() <= 0) {
    estado = { ...estado, terminouEm: estado.fimEm, fimEm: null, restante: 0 };
    salvar();
  }
  if (estado.fimEm) rodar();
  atualizar();
}
