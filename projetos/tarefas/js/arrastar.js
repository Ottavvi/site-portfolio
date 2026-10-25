// Mudar a ordem das tarefas: arrastando pela alça ⋮⋮ (mouse ou dedo) ou com Alt + ↑/↓ no teclado.
import { reordenar } from './estado.js';
import { podeArrastar } from './render.js';

export function iniciarArrastar(conteudo) {
  conteudo.addEventListener('pointerdown', e => {
    const alca = e.target.closest('.alca');
    if (!alca || e.button !== 0) return;
    e.preventDefault();
    const item = alca.closest('.tarefa');
    const lista = item.parentElement;
    const ordemAntes = idsDa(lista).join();
    item.classList.add('arrastando');
    alca.setPointerCapture(e.pointerId);

    const mover = ev => {
      // Coloca o item antes do primeiro vizinho cujo meio ainda está abaixo do ponteiro
      const vizinhos = [...lista.children].filter(li => li !== item);
      const depois = vizinhos.find(li => {
        const caixa = li.getBoundingClientRect();
        return ev.clientY < caixa.top + caixa.height / 2;
      });
      if (depois) {
        if (item.nextElementSibling !== depois) lista.insertBefore(item, depois);
      } else if (lista.lastElementChild !== item) {
        lista.append(item);
      }
    };
    const soltar = () => {
      alca.removeEventListener('pointermove', mover);
      alca.removeEventListener('pointerup', soltar);
      alca.removeEventListener('pointercancel', soltar);
      item.classList.remove('arrastando');
      const ids = idsDa(lista);
      if (ids.join() !== ordemAntes) reordenar(ids);
    };
    alca.addEventListener('pointermove', mover);
    alca.addEventListener('pointerup', soltar);
    alca.addEventListener('pointercancel', soltar);
  });
}

// Alt + ↑/↓: troca a tarefa de lugar com a vizinha. Devolve false quando não dá para mover.
export function moverComTeclado(id, direcao) {
  if (!podeArrastar()) return false;
  const item = document.querySelector(`.tarefa[data-id="${id}"]`);
  const lista = item?.parentElement;
  if (!lista?.dataset.arrastavel) return false;
  const ids = idsDa(lista);
  const i = ids.indexOf(id);
  const j = i + direcao;
  if (j < 0 || j >= ids.length) return false;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  reordenar(ids);
  return true;
}

const idsDa = lista => [...lista.children].map(li => li.dataset.id);
