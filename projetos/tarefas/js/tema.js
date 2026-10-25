// Tema claro, escuro ou automático (segue o sistema). A troca é imediata e fica salva.
import { estado, mudarPrefs } from './estado.js';

const ORDEM = ['auto', 'claro', 'escuro'];
const ROTULOS = { auto: '◐ Tema: automático', claro: '☀ Tema: claro', escuro: '☾ Tema: escuro' };
const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');

export function aplicarTema() {
  const tema = estado.prefs.tema;
  if (tema === 'auto') delete document.documentElement.dataset.tema;
  else document.documentElement.dataset.tema = tema;
  document.getElementById('botaoTema').textContent = ROTULOS[tema];
  const escuro = tema === 'escuro' || (tema === 'auto' && sistemaEscuro.matches);
  document.querySelector('meta[name="theme-color"]').content = escuro ? '#15131d' : '#f6f4fb';
}

export function trocarTema() {
  mudarPrefs({ tema: ORDEM[(ORDEM.indexOf(estado.prefs.tema) + 1) % ORDEM.length] });
}

sistemaEscuro.addEventListener('change', aplicarTema);
