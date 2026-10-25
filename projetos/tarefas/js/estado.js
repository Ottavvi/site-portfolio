// Dados do app (listas, categorias, tarefas e preferências), salvos no navegador.
// Toda mudança passa por alterar(): grava, redesenha a tela e, se tiver mensagem, permite desfazer.
import { avisar } from './aviso.js';
import { formatarCurta, hojeISO, proximaData, somarDias } from './datas.js';

const CHAVE = 'tarefas-v2';
const CHAVE_ANTIGA = 'minhas-tarefas'; // versão anterior: [{ id, text, done }]

export const CORES = ['#b18cff', '#5cc8ff', '#a3e635', '#ffb454', '#ff7a9a', '#4fd1c5', '#f6e05e', '#9aa1ad'];

export const novoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export let estado = carregar();
const ouvintes = [];

export const assinar = funcao => ouvintes.push(funcao);
const notificar = () => ouvintes.forEach(funcao => funcao());

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // Aba anônima ou armazenamento cheio: o app funciona, só não guarda as mudanças
  }
}

// Aplica uma mudança. Com mensagem, mostra o aviso com "Desfazer" (volta ao estado de antes).
export function alterar(mudanca, mensagem = null) {
  const antes = JSON.stringify(estado);
  mudanca(estado);
  salvar();
  notificar();
  if (mensagem) avisar(mensagem, () => substituir(JSON.parse(antes)));
}

// Mudança silenciosa (ex.: digitar no painel de detalhes): grava sem redesenhar a lista inteira
export function gravar() {
  salvar();
}

export function substituir(novo) {
  estado = novo;
  salvar();
  notificar();
}

/* ---------- Leitura, migração e dados iniciais ---------- */

function estadoVazio() {
  return {
    versao: 2,
    listas: [{ id: 'principal', nome: 'Minhas tarefas', cor: CORES[0] }],
    categorias: [],
    tarefas: [],
    historico: {}, // { 'AAAA-MM-DD': quantas tarefas foram concluídas nesse dia }
    prefs: { visao: { tipo: 'hoje' }, filtro: 'pendentes', ordenar: 'manual', tema: 'auto', categoria: null }
  };
}

export function tarefaNova(campos) {
  return {
    id: novoId(),
    listaId: 'principal',
    texto: '',
    feita: false,
    criadaEm: new Date().toISOString(),
    concluidaEm: null,
    prazo: null,
    hora: null,
    prioridade: 0, // 0 nenhuma, 1 baixa, 2 média, 3 alta
    categoriaId: null,
    notas: '',
    subtarefas: [],
    repetir: null, // 'diaria' | 'dias-uteis' | 'semanal' | 'mensal'
    lembrado: false,
    ordem: 0,
    ...campos
  };
}

// Exemplos para quem abre o app pela primeira vez: mostram os recursos sem precisar cadastrar nada
export function estadoDeExemplo() {
  const e = estadoVazio();
  const hoje = hojeISO();
  e.listas.push({ id: 'estudos', nome: 'Estudos', cor: CORES[1] }, { id: 'casa', nome: 'Casa', cor: CORES[3] });
  e.categorias = [
    { id: 'faculdade', nome: 'Faculdade', cor: CORES[1] },
    { id: 'trabalho', nome: 'Trabalho', cor: CORES[2] },
    { id: 'pessoal', nome: 'Pessoal', cor: CORES[4] }
  ];
  const exemplos = [
    {
      texto: 'Bem-vindo! Clique numa tarefa para ver notas e subtarefas',
      prioridade: 2,
      prazo: hoje,
      notas: 'Use "Começar do zero" no menu para apagar estes exemplos.',
      subtarefas: [
        { id: novoId(), texto: 'Marcar esta subtarefa', feita: true },
        { id: novoId(), texto: 'Arrastar uma tarefa pela alça ⋮⋮', feita: false },
        { id: novoId(), texto: 'Apertar ? para ver os atalhos', feita: false }
      ]
    },
    {
      texto: 'Entregar o trabalho de estruturas de dados',
      listaId: 'estudos',
      categoriaId: 'faculdade',
      prioridade: 3,
      prazo: somarDias(hoje, 1),
      hora: '23:59'
    },
    {
      texto: 'Revisar a matéria da prova',
      listaId: 'estudos',
      categoriaId: 'faculdade',
      prioridade: 2,
      prazo: somarDias(hoje, 3)
    },
    { texto: 'Responder os e-mails da manhã', categoriaId: 'trabalho', prazo: hoje, repetir: 'dias-uteis' },
    {
      texto: 'Pagar a conta de luz',
      listaId: 'casa',
      categoriaId: 'pessoal',
      prioridade: 3,
      prazo: somarDias(hoje, -1)
    },
    { texto: 'Regar as plantas', listaId: 'casa', prazo: somarDias(hoje, 2), repetir: 'semanal' },
    { texto: 'Ler um capítulo do livro', categoriaId: 'pessoal', prioridade: 1 }
  ];
  e.tarefas = exemplos.map((campos, i) => tarefaNova({ ...campos, ordem: i }));
  // Uma concluída e um histórico curto, para as estatísticas não começarem vazias
  e.tarefas.push(tarefaNova({ texto: 'Instalar o app no celular', feita: true, concluidaEm: hoje, ordem: 99 }));
  e.historico = { [somarDias(hoje, -3)]: 2, [somarDias(hoje, -2)]: 4, [somarDias(hoje, -1)]: 3, [hoje]: 1 };
  return e;
}

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo?.versao === 2) return completar(salvo);
    const antigas = JSON.parse(localStorage.getItem(CHAVE_ANTIGA));
    if (Array.isArray(antigas)) return migrar(antigas);
  } catch {
    // Dado corrompido ou sem armazenamento: começa com os exemplos
  }
  return estadoDeExemplo();
}

// Tarefas da versão anterior ({ id, text, done }) entram na lista principal, na mesma ordem
function migrar(antigas) {
  const e = estadoVazio();
  e.prefs.visao = { tipo: 'lista', id: 'principal' };
  e.tarefas = antigas
    .filter(t => t && typeof t.text === 'string')
    .map((t, i) =>
      tarefaNova({ texto: t.text, feita: Boolean(t.done), concluidaEm: t.done ? hojeISO() : null, ordem: i })
    );
  return e;
}

// Garante os campos novos em dados salvos ou importados de versões parecidas
export function completar(dados) {
  const base = estadoVazio();
  const e = { ...base, ...dados, prefs: { ...base.prefs, ...dados.prefs } };
  if (!e.listas?.length) e.listas = base.listas;
  e.tarefas = (e.tarefas || []).map(t => tarefaNova(t));
  return e;
}

/* ---------- Ações ---------- */

export const buscarTarefa = id => estado.tarefas.find(t => t.id === id);
export const buscarLista = id => estado.listas.find(l => l.id === id);
export const buscarCategoria = id => estado.categorias.find(c => c.id === id);

export function adicionarTarefa(campos) {
  const menor = Math.min(0, ...estado.tarefas.map(t => t.ordem));
  const tarefa = tarefaNova({ ...campos, ordem: menor - 1 }); // nova tarefa entra no topo
  alterar(e => e.tarefas.push(tarefa));
  return tarefa;
}

export function alternarFeita(id) {
  const tarefa = buscarTarefa(id);
  const hoje = hojeISO();
  let mensagem = tarefa.feita ? null : 'Tarefa concluída';
  alterar(e => {
    const t = e.tarefas.find(x => x.id === id);
    if (t.feita) {
      if (e.historico[t.concluidaEm] > 0) e.historico[t.concluidaEm]--;
      t.feita = false;
      t.concluidaEm = null;
      return;
    }
    t.feita = true;
    t.concluidaEm = hoje;
    e.historico[hoje] = (e.historico[hoje] || 0) + 1;
    // Tarefa repetida: a próxima ocorrência já aparece, com as subtarefas desmarcadas
    if (t.repetir) {
      const prazo = proximaData(t.prazo, t.repetir);
      e.tarefas.push(
        tarefaNova({
          ...t,
          id: novoId(),
          feita: false,
          concluidaEm: null,
          lembrado: false,
          criadaEm: new Date().toISOString(),
          prazo,
          subtarefas: t.subtarefas.map(s => ({ ...s, id: novoId(), feita: false })),
          ordem: t.ordem - 0.5
        })
      );
      mensagem = `Concluída · próxima em ${formatarCurta(prazo)}`;
    }
  }, mensagem);
}

export function excluirTarefa(id) {
  alterar(e => {
    e.tarefas = e.tarefas.filter(t => t.id !== id);
  }, 'Tarefa excluída');
}

export function limparConcluidas(ids) {
  if (!ids.length) return;
  alterar(
    e => {
      e.tarefas = e.tarefas.filter(t => !ids.includes(t.id));
    },
    ids.length === 1 ? '1 tarefa concluída removida' : `${ids.length} tarefas concluídas removidas`
  );
}

// Nova ordem das tarefas visíveis: reaproveita os valores de "ordem" delas, para não mexer nas escondidas
export function reordenar(idsEmOrdem) {
  alterar(e => {
    const tarefas = idsEmOrdem.map(id => e.tarefas.find(t => t.id === id));
    const ordens = tarefas.map(t => t.ordem).sort((a, b) => a - b);
    tarefas.forEach((t, i) => {
      t.ordem = ordens[i];
    });
  });
}

export function criarLista(nome) {
  const lista = { id: novoId(), nome, cor: CORES[estado.listas.length % CORES.length] };
  alterar(e => {
    e.listas.push(lista);
    e.prefs.visao = { tipo: 'lista', id: lista.id };
  });
}

export function renomearLista(id, nome) {
  alterar(e => {
    e.listas.find(l => l.id === id).nome = nome;
  });
}

export function excluirLista(id) {
  const lista = buscarLista(id);
  alterar(e => {
    e.listas = e.listas.filter(l => l.id !== id);
    e.tarefas = e.tarefas.filter(t => t.listaId !== id);
    e.prefs.visao = { tipo: 'hoje' };
  }, `Lista "${lista.nome}" excluída`);
}

export function criarCategoria(nome) {
  const existente = estado.categorias.find(c => normalizar(c.nome) === normalizar(nome));
  if (existente) return existente;
  const categoria = { id: novoId(), nome, cor: CORES[(estado.categorias.length + 1) % CORES.length] };
  alterar(e => e.categorias.push(categoria));
  return categoria;
}

export function excluirCategoria(id) {
  const categoria = buscarCategoria(id);
  alterar(e => {
    e.categorias = e.categorias.filter(c => c.id !== id);
    e.tarefas.forEach(t => {
      if (t.categoriaId === id) t.categoriaId = null;
    });
    if (e.prefs.categoria === id) e.prefs.categoria = null;
  }, `Categoria "${categoria.nome}" excluída`);
}

export function mudarPrefs(campos) {
  alterar(e => Object.assign(e.prefs, campos));
}

// "Faculdade", "faculdade" e "fáculdade" são a mesma coisa nas buscas e categorias
export const normalizar = texto =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
