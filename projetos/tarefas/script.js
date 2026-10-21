const STORAGE_KEY = 'minhas-tarefas';

const form = document.getElementById('newTaskForm');
const input = document.getElementById('newTaskInput');
const list = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const counter = document.getElementById('counter');
const progressBar = document.getElementById('progressBar');
const clearDone = document.getElementById('clearDone');
const filterButtons = document.querySelectorAll('.filter');

let tasks = loadTasks();
let currentFilter = 'todas';

const todayText = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
document.getElementById('today').textContent = todayText.charAt(0).toUpperCase() + todayText.slice(1);

// Salvamento no navegador (localStorage): as tarefas continuam lá ao fechar a página
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Navegador sem permissão de salvar (ex.: aba anônima): a lista funciona, só não fica salva
  }
}

function render() {
  const visible = tasks.filter(task =>
    currentFilter === 'todas' ||
    (currentFilter === 'pendentes' && !task.done) ||
    (currentFilter === 'concluidas' && task.done));

  list.replaceChildren(...visible.map(createTaskElement));

  const doneCount = tasks.filter(task => task.done).length;
  const pending = tasks.length - doneCount;
  counter.textContent = pending === 1 ? '1 tarefa pendente' : `${pending} tarefas pendentes`;
  progressBar.style.width = tasks.length ? `${(doneCount / tasks.length) * 100}%` : '0';
  clearDone.disabled = doneCount === 0;

  const emptyTexts = {
    todas: 'Nenhuma tarefa ainda. Que tal adicionar a primeira?',
    pendentes: 'Nada pendente. Bom trabalho! 🎉',
    concluidas: 'Nenhuma tarefa concluída ainda.'
  };
  emptyMessage.textContent = emptyTexts[currentFilter];
  emptyMessage.hidden = visible.length > 0;
}

function createTaskElement(task) {
  const item = document.createElement('li');
  item.className = task.done ? 'task done' : 'task';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', `Concluir: ${task.text}`);
  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    saveTasks();
    render();
  });

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;
  text.addEventListener('dblclick', () => startEditing(item, text, task));

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'icon-btn';
  editBtn.textContent = '✎';
  editBtn.setAttribute('aria-label', `Editar: ${task.text}`);
  editBtn.addEventListener('click', () => startEditing(item, text, task));

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'icon-btn delete';
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', `Excluir: ${task.text}`);
  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(other => other.id !== task.id);
    saveTasks();
    render();
  });

  item.append(checkbox, text, editBtn, deleteBtn);
  return item;
}

// Edição: Enter ou clicar fora salva, Esc cancela
function startEditing(item, text, task) {
  const editor = document.createElement('input');
  editor.className = 'task-edit';
  editor.value = task.text;
  editor.maxLength = 120;
  editor.setAttribute('aria-label', 'Editar tarefa');
  text.replaceWith(editor);
  editor.focus();
  editor.select();

  let finished = false;
  function finish(save) {
    if (finished) return;
    finished = true;
    const newText = editor.value.trim();
    if (save && newText) {
      task.text = newText;
      saveTasks();
    }
    render();
  }
  editor.addEventListener('keydown', event => {
    if (event.key === 'Enter') finish(true);
    if (event.key === 'Escape') finish(false);
  });
  editor.addEventListener('blur', () => finish(true));
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: Date.now(), text, done: false });
  saveTasks();
  input.value = '';
  if (currentFilter === 'concluidas') setFilter('todas');
  else render();
});

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  render();
}
filterButtons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));

clearDone.addEventListener('click', () => {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  render();
});

render();
