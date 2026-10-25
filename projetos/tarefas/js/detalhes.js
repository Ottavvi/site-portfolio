// Painel de detalhes da tarefa: título, prazo, prioridade, repetição, lista, categoria, subtarefas e notas.
// Cada campo salva sozinho ao mudar (não tem botão "Salvar").
import { alterar, alternarFeita, buscarTarefa, estado, excluirTarefa, novoId } from './estado.js';
import { elemento } from './render.js';
import { hojeISO } from './datas.js';

const $ = id => document.getElementById(id);
const dialogo = $('detalhes');
let atual = null; // id da tarefa aberta
let pedirCategoria = null; // função do main.js que abre a janela "Nova categoria"

export function iniciarDetalhes({ novaCategoria }) {
  pedirCategoria = novaCategoria;

  const campo = (id, evento, aplicar) =>
    $(id).addEventListener(evento, () => {
      if (atual)
        alterar(e =>
          aplicar(
            e.tarefas.find(t => t.id === atual),
            $(id)
          )
        );
    });

  campo('detTexto', 'input', (t, el) => {
    if (el.value.trim()) t.texto = el.value.replace(/\n/g, ' ').trim();
  });
  $('detTexto').addEventListener('input', ajustarAltura);
  $('detTexto').addEventListener('keydown', e => {
    if (e.key === 'Enter') e.preventDefault(); // título numa linha só
  });
  campo('detNotas', 'input', (t, el) => {
    t.notas = el.value;
  });
  campo('detPrazo', 'change', (t, el) => {
    t.prazo = el.value || null;
    t.lembrado = false;
    if (!t.prazo) $('detHora').value = '';
    if (!t.prazo) t.hora = null;
  });
  campo('detHora', 'change', (t, el) => {
    t.hora = el.value || null;
    t.lembrado = false;
    // Hora sem data vale para hoje
    if (t.hora && !t.prazo) {
      t.prazo = $('detPrazo').value = hojeISO();
    }
  });
  campo('detPrioridade', 'change', (t, el) => {
    t.prioridade = Number(el.value);
  });
  campo('detRepetir', 'change', (t, el) => {
    t.repetir = el.value || null;
  });
  campo('detLista', 'change', (t, el) => {
    t.listaId = el.value;
  });

  $('detCategoria').addEventListener('change', () => {
    const valor = $('detCategoria').value;
    if (valor === '__nova') {
      $('detCategoria').value = buscarTarefa(atual).categoriaId ?? '';
      pedirCategoria(categoria => {
        alterar(e => {
          e.tarefas.find(t => t.id === atual).categoriaId = categoria.id;
        });
        preencher();
      });
      return;
    }
    alterar(e => {
      e.tarefas.find(t => t.id === atual).categoriaId = valor || null;
    });
  });

  $('detFeita').addEventListener('change', () => {
    alternarFeita(atual);
    preencher();
  });

  $('detExcluir').addEventListener('click', () => {
    const id = atual;
    dialogo.close();
    excluirTarefa(id);
  });

  // Subtarefas: Enter adiciona; marcar, editar e excluir salvam na hora
  $('detNovaSub').addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const texto = $('detNovaSub').value.trim();
    if (!texto) return;
    alterar(est => est.tarefas.find(t => t.id === atual).subtarefas.push({ id: novoId(), texto, feita: false }));
    $('detNovaSub').value = '';
    desenharSubtarefas();
  });

  dialogo.addEventListener('close', () => {
    const id = atual;
    atual = null;
    // Devolve o foco para a tarefa na lista, para continuar pelo teclado
    document.querySelector(`.tarefa[data-id="${id}"] .tarefa-corpo`)?.focus();
  });
  // Clicar fora do painel fecha
  dialogo.addEventListener('click', e => {
    if (e.target === dialogo) dialogo.close();
  });
}

export function abrirDetalhes(id) {
  atual = id;
  preencher();
  dialogo.showModal();
  if (!buscarTarefa(id).texto) $('detTexto').focus();
}

// Atualiza o painel se a tarefa aberta mudou por outro caminho (ex.: desfazer)
export function atualizarDetalhes() {
  if (!atual) return;
  if (!buscarTarefa(atual)) return dialogo.close();
  $('detSubContador').textContent = contadorSub(buscarTarefa(atual));
}

function preencher() {
  const t = buscarTarefa(atual);
  if (!t) return;
  $('detFeita').checked = t.feita;
  $('detTexto').value = t.texto;
  $('detNotas').value = t.notas;
  $('detPrazo').value = t.prazo ?? '';
  $('detHora').value = t.hora ?? '';
  $('detPrioridade').value = String(t.prioridade);
  $('detRepetir').value = t.repetir ?? '';

  $('detLista').replaceChildren(...estado.listas.map(l => new Option(l.nome, l.id, false, l.id === t.listaId)));
  $('detCategoria').replaceChildren(
    new Option('Sem categoria', ''),
    ...estado.categorias.map(c => new Option(c.nome, c.id)),
    new Option('+ Nova categoria…', '__nova')
  );
  $('detCategoria').value = t.categoriaId ?? '';

  const data = iso => new Date(iso).toLocaleDateString('pt-BR');
  $('detInfo').textContent =
    `Criada em ${data(t.criadaEm)}` +
    (t.concluidaEm ? ` · concluída em ${t.concluidaEm.split('-').reverse().join('/')}` : '');
  dialogo.classList.toggle('feita', t.feita);
  desenharSubtarefas();
  requestAnimationFrame(ajustarAltura);
}

const contadorSub = t =>
  t.subtarefas.length ? `${t.subtarefas.filter(s => s.feita).length}/${t.subtarefas.length}` : '';

function desenharSubtarefas() {
  const t = buscarTarefa(atual);
  $('detSubContador').textContent = contadorSub(t);
  $('detSubtarefas').replaceChildren(
    ...t.subtarefas.map(sub => {
      const li = elemento('li', `subtarefa${sub.feita ? ' feita' : ''}`);
      const check = elemento('label', 'check pequeno');
      const caixa = elemento('input', null, null, { type: 'checkbox', 'aria-label': `Concluir: ${sub.texto}` });
      caixa.checked = sub.feita;
      caixa.addEventListener('change', () => {
        alterar(e => {
          e.tarefas.find(x => x.id === atual).subtarefas.find(s => s.id === sub.id).feita = caixa.checked;
        });
        li.classList.toggle('feita', caixa.checked);
        $('detSubContador').textContent = contadorSub(buscarTarefa(atual));
      });
      check.append(caixa);

      const texto = elemento('input', 'sub-texto', null, { type: 'text', maxlength: '120', 'aria-label': 'Subtarefa' });
      texto.value = sub.texto;
      texto.addEventListener('change', () => {
        if (!texto.value.trim()) return;
        alterar(e => {
          e.tarefas.find(x => x.id === atual).subtarefas.find(s => s.id === sub.id).texto = texto.value.trim();
        });
      });

      const excluir = elemento('button', 'icone-btn', '✕', {
        type: 'button',
        'aria-label': `Excluir subtarefa: ${sub.texto}`
      });
      excluir.addEventListener('click', () => {
        alterar(e => {
          const tarefa = e.tarefas.find(x => x.id === atual);
          tarefa.subtarefas = tarefa.subtarefas.filter(s => s.id !== sub.id);
        });
        desenharSubtarefas();
      });

      li.append(check, texto, excluir);
      return li;
    })
  );
}

function ajustarAltura() {
  const campo = $('detTexto');
  campo.style.height = 'auto';
  campo.style.height = `${campo.scrollHeight}px`;
}
