// Desenha a tela a partir do estado: menu lateral, título, filtros e as tarefas da visão escolhida.
import { buscarCategoria, buscarLista, estado, normalizar } from './estado.js';
import { GRUPOS, grupoDoPrazo, hojeISO, rotuloPrazo } from './datas.js';
import { focosPorTarefa } from './focos.js';

const $ = id => document.getElementById(id);
export const ui = { busca: '' }; // o texto da busca não fica salvo
// Em telas de toque não há teclado físico: as dicas de atalho somem
const temTeclado = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (!temTeclado) document.getElementById('busca').placeholder = 'Buscar…';

const PRIORIDADE_CURTA = ['', 'Baixa', 'Média', 'Alta'];
const NOMES_REPETIR = { diaria: 'Todo dia', 'dias-uteis': 'Dias úteis', semanal: 'Toda semana', mensal: 'Todo mês' };

/* ---------- Quais tarefas aparecem ---------- */

const pendente = t => !t.feita;
const ateHoje = t => t.prazo && t.prazo <= hojeISO();

// Tarefas da visão atual, antes de filtro, categoria e busca
function daVisao() {
  const { visao } = estado.prefs;
  if (visao.tipo === 'lista') return estado.tarefas.filter(t => t.listaId === visao.id);
  if (visao.tipo === 'hoje')
    return estado.tarefas.filter(t => (pendente(t) && ateHoje(t)) || t.concluidaEm === hojeISO());
  return estado.tarefas.filter(t => t.prazo || pendente(t)); // próximos dias: tudo que tem prazo ou está pendente
}

function filtradas() {
  const { filtro, categoria } = estado.prefs;
  const termos = normalizar(ui.busca).split(/\s+/).filter(Boolean);
  return daVisao().filter(t => {
    if (filtro === 'pendentes' && t.feita) return false;
    if (filtro === 'concluidas' && !t.feita) return false;
    if (categoria && t.categoriaId !== categoria) return false;
    if (!termos.length) return true;
    const texto = normalizar([t.texto, t.notas, ...t.subtarefas.map(s => s.texto)].join(' '));
    return termos.every(termo => texto.includes(termo));
  });
}

const COMPARAR = {
  manual: (a, b) => a.ordem - b.ordem,
  prazo: (a, b) =>
    (a.prazo || '9999').localeCompare(b.prazo || '9999') ||
    (a.hora || '99').localeCompare(b.hora || '99') ||
    b.prioridade - a.prioridade,
  prioridade: (a, b) => b.prioridade - a.prioridade || (a.prazo || '9999').localeCompare(b.prazo || '9999'),
  criacao: (a, b) => b.criadaEm.localeCompare(a.criadaEm),
  alfabetica: (a, b) => a.texto.localeCompare(b.texto, 'pt-BR')
};

// Seções da lista: [{ titulo, tarefas }]. Concluídas sempre no fim.
function secoes() {
  const tarefas = filtradas().sort(COMPARAR[estado.prefs.ordenar] || COMPARAR.manual);
  const pendentes = tarefas.filter(pendente);
  const feitas = tarefas.filter(t => t.feita).sort((a, b) => (b.concluidaEm || '').localeCompare(a.concluidaEm || ''));
  const resultado = [];

  if (estado.prefs.visao.tipo === 'lista') {
    resultado.push({ titulo: null, tarefas: pendentes });
  } else {
    // Hoje e Próximos dias: agrupadas pelo prazo (atrasadas, hoje, amanhã...)
    for (const [chave, titulo] of GRUPOS) {
      const doGrupo = pendentes.filter(t => grupoDoPrazo(t.prazo) === chave);
      if (doGrupo.length) resultado.push({ titulo, tarefas: doGrupo, classe: chave });
    }
  }
  if (feitas.length)
    resultado.push({ titulo: estado.prefs.filtro === 'concluidas' ? null : 'Concluídas', tarefas: feitas });
  return resultado.filter(s => s.tarefas.length);
}

// Concluídas da visão atual (respeitando a categoria escolhida), para o botão "Limpar concluídas"
export const concluidasDaVisao = () =>
  daVisao()
    .filter(t => t.feita && (!estado.prefs.categoria || t.categoriaId === estado.prefs.categoria))
    .map(t => t.id);

// Arrastar só faz sentido numa lista, em "Minha ordem" e sem busca
export const podeArrastar = () =>
  estado.prefs.visao.tipo === 'lista' && estado.prefs.ordenar === 'manual' && !ui.busca.trim();

export const idsVisiveis = () => [...document.querySelectorAll('#conteudo .tarefa')].map(li => li.dataset.id);

/* ---------- Desenho ---------- */

export function renderizar() {
  const { visao } = estado.prefs;
  const ehEstatisticas = visao.tipo === 'estatisticas';
  $('areaTarefas').hidden = ehEstatisticas;
  $('areaEstatisticas').hidden = !ehEstatisticas;

  desenharMenu();
  desenharTitulo();
  if (ehEstatisticas) return;

  document
    .querySelectorAll('[data-filtro]')
    .forEach(b => b.setAttribute('aria-pressed', b.dataset.filtro === estado.prefs.filtro));
  $('ordenar').value = estado.prefs.ordenar;
  desenharChips();
  desenharTarefas();
}

function desenharTitulo() {
  const { visao } = estado.prefs;
  const lista = visao.tipo === 'lista' ? buscarLista(visao.id) : null;
  const titulos = { hoje: 'Hoje', proximos: 'Próximos dias', estatisticas: 'Estatísticas' };
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const subtitulos = {
    hoje: hoje.charAt(0).toUpperCase() + hoje.slice(1),
    proximos: 'Tudo que tem prazo, de todas as listas',
    estatisticas: 'Seu ritmo nos últimos dias'
  };
  $('tituloVisao').textContent = lista ? lista.nome : titulos[visao.tipo];
  $('subtituloVisao').textContent = lista ? 'Lista' : subtitulos[visao.tipo];
  $('acoesLista').hidden = !lista;
  $('excluirLista').hidden = estado.listas.length <= 1; // sempre sobra pelo menos uma lista
  $('entradaNova').placeholder =
    (visao.tipo === 'hoje' ? 'Adicionar tarefa para hoje…' : 'Adicionar tarefa…') + (temTeclado ? '  (atalho: N)' : '');
  document.title = `${$('tituloVisao').textContent} · Minhas Tarefas`;
}

function desenharMenu() {
  const { visao } = estado.prefs;
  const pendentes = estado.tarefas.filter(pendente);
  $('hojeTexto').textContent = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

  document.querySelectorAll('[data-visao]').forEach(b => {
    b.setAttribute('aria-current', b.dataset.visao === visao.tipo ? 'page' : 'false');
  });
  const contar = (chave, n, alerta = false) => {
    const el = document.querySelector(`[data-cont="${chave}"]`);
    el.textContent = n || '';
    el.classList.toggle('alerta', alerta);
  };
  const atrasadas = pendentes.filter(t => t.prazo && t.prazo < hojeISO()).length;
  contar('hoje', pendentes.filter(ateHoje).length, atrasadas > 0);
  contar('proximos', pendentes.filter(t => t.prazo).length);

  $('listas').replaceChildren(
    ...estado.listas.map(lista => {
      const li = document.createElement('li');
      const botao = elemento('button', 'nav-item', null, { type: 'button' });
      botao.setAttribute('aria-current', visao.tipo === 'lista' && visao.id === lista.id ? 'page' : 'false');
      botao.dataset.lista = lista.id;
      botao.append(
        bolinha(lista.cor),
        elemento('span', 'nav-nome', lista.nome),
        elemento('span', 'nav-cont', String(pendentes.filter(t => t.listaId === lista.id).length || ''))
      );
      li.append(botao);
      return li;
    })
  );

  $('categorias').replaceChildren(
    ...estado.categorias.map(categoria => {
      const li = document.createElement('li');
      li.className = 'categoria-item';
      const filtrar = elemento('button', 'nav-item', null, { type: 'button' });
      filtrar.dataset.filtrarCategoria = categoria.id;
      filtrar.setAttribute('aria-pressed', estado.prefs.categoria === categoria.id);
      filtrar.append(
        bolinha(categoria.cor),
        elemento('span', 'nav-nome', categoria.nome),
        elemento('span', 'nav-cont', String(pendentes.filter(t => t.categoriaId === categoria.id).length || ''))
      );
      const excluir = elemento('button', 'icone-btn excluir-cat', '×', {
        type: 'button',
        'aria-label': `Excluir a categoria ${categoria.nome}`,
        title: 'Excluir categoria'
      });
      excluir.dataset.excluirCategoria = categoria.id;
      li.append(filtrar, excluir);
      return li;
    })
  );
  if (!estado.categorias.length)
    $('categorias').append(elemento('li', 'muted pequeno', 'Crie com + ou digitando #nome'));
}

function desenharChips() {
  const base = daVisao().filter(pendente);
  const chips = [{ id: null, nome: 'Todas', cor: null }, ...estado.categorias].map(c => {
    const n = c.id ? base.filter(t => t.categoriaId === c.id).length : base.length;
    const chip = elemento('button', 'chip', null, { type: 'button' });
    chip.dataset.filtrarCategoria = c.id ?? '';
    chip.setAttribute('aria-pressed', (estado.prefs.categoria ?? null) === c.id);
    if (c.cor) chip.append(bolinha(c.cor));
    chip.append(`${c.nome} `, elemento('span', 'chip-n', String(n)));
    return chip;
  });
  $('chipsCategorias').replaceChildren(...chips);
  $('chipsCategorias').hidden = !estado.categorias.length;
}

let focos = new Map(); // sessões do Pomodoro por tarefa, lidas uma vez por desenho

function desenharTarefas() {
  const lista = secoes();
  const arrastavel = podeArrastar();
  focos = focosPorTarefa();
  $('conteudo').replaceChildren(
    ...lista.map(secao => {
      const bloco = elemento('section', `grupo ${secao.classe || ''}`);
      if (secao.titulo) bloco.append(elemento('h2', 'grupo-titulo', `${secao.titulo} · ${secao.tarefas.length}`));
      const ul = elemento('ul', 'lista-tarefas');
      if (arrastavel && !secao.tarefas[0]?.feita) ul.dataset.arrastavel = 'sim';
      ul.append(...secao.tarefas.map(t => desenharTarefa(t, arrastavel && !t.feita)));
      bloco.append(ul);
      return bloco;
    })
  );

  // Resumo e progresso da visão (sem filtro de pendente/concluída, para a barra fazer sentido)
  const todas = daVisao().filter(t => !estado.prefs.categoria || t.categoriaId === estado.prefs.categoria);
  const feitas = todas.filter(t => t.feita).length;
  const pendentesN = todas.length - feitas;
  $('barraProgresso').style.width = todas.length ? `${(feitas / todas.length) * 100}%` : '0';
  $('contador').textContent =
    `${pendentesN} pendente${pendentesN === 1 ? '' : 's'} · ${feitas} concluída${feitas === 1 ? '' : 's'}`;
  $('limparConcluidas').disabled = feitas === 0;
  $('dicaArrastar').textContent = arrastavel ? 'Arraste pela alça ⋮⋮ para mudar a ordem' : '';

  const vazio = $('vazio');
  vazio.hidden = lista.length > 0;
  if (!lista.length) vazio.textContent = mensagemVazia();
}

function mensagemVazia() {
  if (ui.busca.trim()) return `Nada encontrado para "${ui.busca.trim()}".`;
  if (estado.prefs.filtro === 'concluidas') return 'Nenhuma tarefa concluída por aqui ainda.';
  if (estado.prefs.visao.tipo === 'hoje') return 'Nada para hoje. Aproveite o dia! 🎉';
  if (estado.prefs.visao.tipo === 'proximos') return 'Nenhuma tarefa com prazo. Adicione uma com "amanhã" ou "sexta".';
  return 'Lista vazia. Que tal adicionar a primeira tarefa?';
}

function desenharTarefa(t, arrastavel) {
  const li = elemento('li', `tarefa prio-${t.prioridade}${t.feita ? ' feita' : ''}`);
  li.dataset.id = t.id;
  li.tabIndex = -1;

  if (arrastavel)
    li.append(elemento('span', 'alca', '⋮⋮', { 'aria-hidden': 'true', title: 'Arrastar para mudar a ordem' }));

  const check = elemento('label', 'check');
  const caixa = elemento('input', null, null, { type: 'checkbox', 'aria-label': `Concluir: ${t.texto}` });
  caixa.checked = t.feita;
  caixa.dataset.alternar = t.id;
  check.append(caixa);

  const corpo = elemento('button', 'tarefa-corpo', null, {
    type: 'button',
    'aria-label': `Abrir detalhes: ${t.texto}`
  });
  corpo.dataset.abrir = t.id;
  corpo.append(elemento('span', 'tarefa-texto', t.texto));

  const meta = elemento('span', 'meta');
  if (t.prioridade) meta.append(elemento('span', `selo prioridade p${t.prioridade}`, PRIORIDADE_CURTA[t.prioridade]));
  if (t.prazo) {
    const { texto, classe } = rotuloPrazo(t.prazo, t.hora);
    meta.append(elemento('span', `selo prazo ${t.feita ? '' : classe}`, `📅 ${texto}`));
  }
  if (t.repetir) meta.append(elemento('span', 'selo', `↻ ${NOMES_REPETIR[t.repetir]}`));
  const categoria = buscarCategoria(t.categoriaId);
  if (categoria) {
    const selo = elemento('span', 'selo categoria');
    selo.append(bolinha(categoria.cor), categoria.nome);
    meta.append(selo);
  }
  if (t.subtarefas.length) {
    const feitas = t.subtarefas.filter(s => s.feita).length;
    meta.append(
      elemento('span', `selo${feitas === t.subtarefas.length ? ' completo' : ''}`, `☑ ${feitas}/${t.subtarefas.length}`)
    );
  }
  if (t.notas.trim()) meta.append(elemento('span', 'selo', '📝', { title: 'Tem notas' }));
  const foco = focos.get(t.id);
  if (foco) {
    meta.append(
      elemento('span', 'selo', `🍅 ${foco.focos}`, { title: `${foco.focos} foco(s) no Pomodoro, ${foco.minutos} min` })
    );
  }
  if (estado.prefs.visao.tipo !== 'lista' && estado.listas.length > 1) {
    const lista = buscarLista(t.listaId);
    if (lista) meta.append(elemento('span', 'selo lista', lista.nome));
  }
  if (meta.childElementCount) corpo.append(meta);

  const excluir = elemento('button', 'icone-btn excluir', '✕', { type: 'button', 'aria-label': `Excluir: ${t.texto}` });
  excluir.dataset.excluir = t.id;

  li.append(check, corpo, excluir);
  return li;
}

/* ---------- Pequenos ajudantes ---------- */

export function elemento(tag, classe, texto, atributos = {}) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto != null) el.textContent = texto;
  for (const [nome, valor] of Object.entries(atributos)) el.setAttribute(nome, valor);
  return el;
}

export function bolinha(cor) {
  const el = elemento('span', 'bolinha', null, { 'aria-hidden': 'true' });
  el.style.background = cor;
  return el;
}
