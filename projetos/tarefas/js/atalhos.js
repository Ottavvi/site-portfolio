// Atalhos de teclado (aperte ? no app para ver a lista).
import { alternarFeita, excluirTarefa, mudarPrefs } from './estado.js';
import { desfazerUltima } from './aviso.js';
import { moverComTeclado } from './arrastar.js';
import { trocarTema } from './tema.js';
import { idsVisiveis } from './render.js';

const $ = id => document.getElementById(id);

export const idFocado = () => document.activeElement?.closest?.('.tarefa')?.dataset.id ?? null;

export function focarTarefa(id) {
  document.querySelector(`.tarefa[data-id="${id}"] .tarefa-corpo`)?.focus();
}

// O alvo pode não ser um elemento (ex.: evento disparado no próprio document)
const digitando = alvo => alvo?.closest?.('input, textarea, select, [contenteditable="true"]');

export function iniciarAtalhos() {
  document.addEventListener('keydown', e => {
    if (document.querySelector('dialog[open]')) return; // janelas abertas cuidam das próprias teclas

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !digitando(e.target)) {
      if (desfazerUltima()) e.preventDefault();
      return;
    }
    if (e.ctrlKey || e.metaKey || digitando(e.target)) {
      // Esc dentro da busca ou da nova tarefa: limpa e sai do campo
      if (e.key === 'Escape' && digitando(e.target)) e.target.blur();
      return;
    }

    const id = idFocado();
    const ids = idsVisiveis();
    const andar = passo => {
      if (!ids.length) return;
      const i = id ? ids.indexOf(id) + passo : passo > 0 ? 0 : ids.length - 1;
      focarTarefa(ids[Math.max(0, Math.min(ids.length - 1, i))]);
    };

    const acoes = {
      n: () => $('entradaNova').focus(),
      '/': () => $('busca').focus(),
      '?': () => $('dialogoAtalhos').showModal(),
      t: trocarTema,
      1: () => mudarPrefs({ visao: { tipo: 'hoje' } }),
      2: () => mudarPrefs({ visao: { tipo: 'proximos' } }),
      3: () => mudarPrefs({ visao: { tipo: 'estatisticas' } }),
      ArrowDown: () => (e.altKey && id ? moverComTeclado(id, 1) : andar(1)),
      ArrowUp: () => (e.altKey && id ? moverComTeclado(id, -1) : andar(-1)),
      j: () => andar(1),
      k: () => andar(-1),
      x: () => id && alternarFeita(id),
      ' ': () => id && alternarFeita(id),
      Delete: () => {
        if (!id) return;
        const proximo = ids[ids.indexOf(id) + 1] ?? ids[ids.indexOf(id) - 1];
        excluirTarefa(id);
        if (proximo) focarTarefa(proximo);
      }
    };
    const acao = acoes[e.key] ?? acoes[e.key.toLowerCase()];
    if (!acao) return;
    // Espaço numa tarefa conclui em vez de abrir os detalhes
    if (e.key === ' ' && !id) return;
    e.preventDefault();
    acao();
  });
}
