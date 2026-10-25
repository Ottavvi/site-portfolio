// Liga a tela às ações: menu, nova tarefa, filtros, lista de tarefas, ferramentas e o modo offline.
import {
  adicionarTarefa,
  alternarFeita,
  assinar,
  buscarLista,
  criarCategoria,
  criarLista,
  estado,
  estadoDeExemplo,
  completar,
  excluirCategoria,
  excluirLista,
  excluirTarefa,
  limparConcluidas,
  mudarPrefs,
  renomearLista,
  substituir
} from './estado.js';
import { avisar } from './aviso.js';
import { lerEntrada } from './entrada.js';
import { concluidasDaVisao, renderizar, ui, elemento } from './render.js';
import { abrirDetalhes, atualizarDetalhes, iniciarDetalhes } from './detalhes.js';
import { iniciarArrastar } from './arrastar.js';
import { focarTarefa, idFocado, iniciarAtalhos } from './atalhos.js';
import { aplicarTema, trocarTema } from './tema.js';
import { exportar, importar } from './arquivo.js';
import { desenharEstatisticas } from './estatisticas.js';
import { iniciarLembretes } from './lembretes.js';
import { formatarCurta, hojeISO } from './datas.js';

const $ = id => document.getElementById(id);

/* ---------- Redesenho ---------- */

// Depois de redesenhar, o foco volta para a mesma tarefa (quem usa teclado não perde o lugar)
function atualizar() {
  const foco = idFocado();
  aplicarTema();
  renderizar();
  if (estado.prefs.visao.tipo === 'estatisticas') desenharEstatisticas();
  atualizarDetalhes();
  if (foco) focarTarefa(foco);
}
assinar(atualizar);

/* ---------- Menu lateral ---------- */

const irPara = visao => {
  mudarPrefs({ visao });
  fecharMenu();
};
document
  .querySelectorAll('[data-visao]')
  .forEach(b => b.addEventListener('click', () => irPara({ tipo: b.dataset.visao })));
$('listas').addEventListener('click', e => {
  const botao = e.target.closest('[data-lista]');
  if (botao) irPara({ tipo: 'lista', id: botao.dataset.lista });
});

// Categoria: clicar filtra (de novo, tira o filtro); o × exclui
const filtrarCategoria = e => {
  const excluir = e.target.closest('[data-excluir-categoria]');
  if (excluir) return excluirCategoria(excluir.dataset.excluirCategoria);
  const botao = e.target.closest('[data-filtrar-categoria]');
  if (!botao) return;
  const id = botao.dataset.filtrarCategoria || null;
  const mudanca = { categoria: estado.prefs.categoria === id ? null : id };
  if (estado.prefs.visao.tipo === 'estatisticas') mudanca.visao = { tipo: 'proximos' };
  mudarPrefs(mudanca);
  fecharMenu();
};
$('categorias').addEventListener('click', filtrarCategoria);
$('chipsCategorias').addEventListener('click', filtrarCategoria);

// Celular: o menu vira uma gaveta
const abrirMenu = () => {
  $('lateral').classList.add('aberto');
  $('fundoMenu').hidden = false;
};
const fecharMenu = () => {
  $('lateral').classList.remove('aberto');
  $('fundoMenu').hidden = true;
};
$('abrirMenu').addEventListener('click', abrirMenu);
$('fecharMenu').addEventListener('click', fecharMenu);
$('fundoMenu').addEventListener('click', fecharMenu);

/* ---------- Janela de nome (lista e categoria) ---------- */

function pedirNome(titulo, valor, aoSalvar) {
  const dialogo = $('dialogoNome');
  $('dialogoNomeTitulo').textContent = titulo;
  $('dialogoNomeEntrada').value = valor;
  dialogo.returnValue = '';
  dialogo.showModal();
  $('dialogoNomeEntrada').select();
  dialogo.addEventListener(
    'close',
    () => {
      const nome = $('dialogoNomeEntrada').value.trim();
      if (dialogo.returnValue === 'ok' && nome) aoSalvar(nome);
    },
    { once: true }
  );
}
$('dialogoNomeCancelar').addEventListener('click', () => $('dialogoNome').close());

const novaCategoria = depois => pedirNome('Nova categoria', '', nome => depois?.(criarCategoria(nome)));
$('novaLista').addEventListener('click', () => pedirNome('Nova lista', '', criarLista));
$('novaCategoria').addEventListener('click', () => novaCategoria());
$('renomearLista').addEventListener('click', () => {
  const lista = buscarLista(estado.prefs.visao.id);
  pedirNome('Renomear lista', lista.nome, nome => renomearLista(lista.id, nome));
});
$('excluirLista').addEventListener('click', () => excluirLista(estado.prefs.visao.id));

/* ---------- Nova tarefa ---------- */

const NOMES_PRIORIDADE = ['', 'Prioridade baixa', 'Prioridade média', 'Prioridade alta'];
const NOMES_REPETIR = { diaria: 'Todo dia', 'dias-uteis': 'Dias úteis', semanal: 'Toda semana', mensal: 'Todo mês' };

// Mostra, enquanto digita, o que os atalhos reconheceram
$('entradaNova').addEventListener('input', () => {
  const lido = lerEntrada($('entradaNova').value);
  const selos = [];
  if (lido.prazo) selos.push(`📅 ${formatarCurta(lido.prazo)}${lido.hora ? ` às ${lido.hora}` : ''}`);
  if (lido.prioridade) selos.push(NOMES_PRIORIDADE[lido.prioridade]);
  if (lido.categoria) selos.push(`# ${lido.categoria}`);
  if (lido.repetir) selos.push(`↻ ${NOMES_REPETIR[lido.repetir]}`);
  $('previa').replaceChildren(...selos.map(s => elemento('span', 'selo', s)));
});

$('formNova').addEventListener('submit', e => {
  e.preventDefault();
  const lido = lerEntrada($('entradaNova').value);
  if (!lido.texto) {
    if ($('entradaNova').value.trim()) avisar('Escreva também o nome da tarefa');
    return;
  }
  const { visao, categoria, filtro } = estado.prefs;
  const listaId = visao.tipo === 'lista' ? visao.id : estado.listas[0].id;
  const tarefa = adicionarTarefa({
    texto: lido.texto,
    listaId,
    prazo: lido.prazo ?? (visao.tipo === 'hoje' ? hojeISO() : null),
    hora: lido.hora,
    prioridade: lido.prioridade,
    repetir: lido.repetir,
    categoriaId: lido.categoria ? criarCategoria(lido.categoria).id : categoria
  });
  if (filtro === 'concluidas') mudarPrefs({ filtro: 'pendentes' });
  $('entradaNova').value = '';
  $('previa').replaceChildren();
  // A tarefa pode não aparecer na visão atual (ex.: em Hoje com prazo para sexta): avisa onde foi parar
  if (!document.querySelector(`.tarefa[data-id="${tarefa.id}"]`)) {
    avisar(`Adicionada em "${buscarLista(listaId).nome}"${tarefa.prazo ? ` para ${formatarCurta(tarefa.prazo)}` : ''}`);
  }
});

/* ---------- Barra: busca, filtros e ordem ---------- */

$('busca').addEventListener('input', () => {
  ui.busca = $('busca').value;
  renderizar();
});
document
  .querySelectorAll('[data-filtro]')
  .forEach(b => b.addEventListener('click', () => mudarPrefs({ filtro: b.dataset.filtro })));
$('ordenar').addEventListener('change', () => mudarPrefs({ ordenar: $('ordenar').value }));
$('limparConcluidas').addEventListener('click', () => limparConcluidas(concluidasDaVisao()));

/* ---------- Lista de tarefas ---------- */

const conteudo = $('conteudo');
conteudo.addEventListener('change', e => {
  const id = e.target.dataset.alternar;
  if (id) alternarFeita(id);
});
conteudo.addEventListener('click', e => {
  const abrir = e.target.closest('[data-abrir]');
  if (abrir) return abrirDetalhes(abrir.dataset.abrir);
  const excluir = e.target.closest('[data-excluir]');
  if (excluir) excluirTarefa(excluir.dataset.excluir);
});
iniciarArrastar(conteudo);

/* ---------- Ferramentas ---------- */

$('botaoTema').addEventListener('click', trocarTema);
$('botaoExportar').addEventListener('click', exportar);
$('botaoImportar').addEventListener('click', () => $('arquivoImportar').click());
$('arquivoImportar').addEventListener('change', () => {
  const arquivo = $('arquivoImportar').files[0];
  if (arquivo) importar(arquivo);
  $('arquivoImportar').value = '';
});
$('botaoAtalhos').addEventListener('click', () => $('dialogoAtalhos').showModal());

const trocarTudo = (novo, mensagem) => {
  const antes = JSON.parse(JSON.stringify(estado));
  novo.prefs.tema = estado.prefs.tema; // o tema escolhido continua
  substituir(novo);
  avisar(mensagem, () => substituir(antes));
  fecharMenu();
};
$('botaoExemplos').addEventListener('click', () => trocarTudo(estadoDeExemplo(), 'Exemplos restaurados'));
$('botaoZerar').addEventListener('click', () =>
  trocarTudo(
    completar({ versao: 2, prefs: { visao: { tipo: 'lista', id: 'principal' }, filtro: 'pendentes' } }),
    'Tudo apagado'
  )
);

/* ---------- App instalável e offline ---------- */

let pedidoInstalar = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  pedidoInstalar = e;
  $('botaoInstalar').hidden = false;
});
$('botaoInstalar').addEventListener('click', async () => {
  if (!pedidoInstalar) return;
  pedidoInstalar.prompt();
  await pedidoInstalar.userChoice;
  pedidoInstalar = null;
  $('botaoInstalar').hidden = true;
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {
    // Sem service worker (ex.: aberto como arquivo): o app funciona, só não fica offline
  });
}

/* ---------- Início ---------- */

iniciarDetalhes({ novaCategoria });
iniciarAtalhos();
iniciarLembretes();
atualizar();

// À meia-noite o dia muda: redesenha para "Hoje" e os prazos (atrasada, amanhã...) continuarem certos
let dia = new Date().getDate();
setInterval(() => {
  if (new Date().getDate() !== dia) {
    dia = new Date().getDate();
    atualizar();
  }
}, 60000);
