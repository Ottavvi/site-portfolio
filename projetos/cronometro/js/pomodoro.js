// Pomodoro: blocos de foco com pausas curtas e, a cada tantos ciclos, uma pausa longa.
// Pode focar numa tarefa do Gerenciador de tarefas (mesmo site, mesmo armazenamento do navegador);
// cada foco concluído fica registrado em "tempo-v1" e aparece na tarefa como 🍅.
import { desenharAnel, formatarRestante, gravar, hojeISO, ler, notificar, prepararSom, tocarAlarme } from './apoio.js';

const $ = id => document.getElementById(id);
const CHAVE = 'tempo-pomodoro';
const CHAVE_SESSOES = 'tempo-v1'; // lida também pelo Gerenciador de tarefas
const CHAVE_TAREFAS = 'tarefas-v2'; // dados do Gerenciador de tarefas (só leitura)

const FASES = { foco: 'Foco', curta: 'Pausa curta', longa: 'Pausa longa' };
const PADRAO = { foco: 25, curta: 5, longa: 15, ciclos: 4, automatico: false };

let config = { ...PADRAO, ...ler(`${CHAVE}-config`, {}) };
let estado = ler(CHAVE, { fase: 'foco', focos: 0, fimEm: null, restante: null, tarefa: null });
let relogio = null;

const duracaoDa = fase => config[fase] * 60000;
const restante = () => (estado.fimEm ? estado.fimEm - Date.now() : (estado.restante ?? duracaoDa(estado.fase)));
const salvar = () => gravar(CHAVE, estado);
export const pomodoroRodando = () => Boolean(estado.fimEm);
export const tempoPomodoro = () => `${formatarRestante(restante())} · ${FASES[estado.fase]}`;

/* ---------- Tarefas do gerenciador ---------- */

function tarefasPendentes() {
  const dados = ler(CHAVE_TAREFAS, null);
  if (!dados?.tarefas) return null;
  const hoje = hojeISO();
  // Primeiro as atrasadas e as de hoje, depois por prioridade
  return dados.tarefas
    .filter(t => !t.feita)
    .sort(
      (a, b) =>
        Number(b.prazo && b.prazo <= hoje) - Number(a.prazo && a.prazo <= hoje) ||
        b.prioridade - a.prioridade ||
        (a.prazo || '9999').localeCompare(b.prazo || '9999')
    );
}

function desenharTarefas() {
  const seletor = $('pmTarefa');
  const tarefas = tarefasPendentes();
  const opcoes = [new Option('Sem tarefa específica', '')];
  if (tarefas?.length) {
    const grupo = document.createElement('optgroup');
    grupo.label = 'Minhas tarefas pendentes';
    tarefas.forEach(t => grupo.append(new Option(t.texto, t.id)));
    opcoes.push(grupo);
  }
  opcoes.push(new Option('Outra coisa (escrever)…', '__outra'));
  seletor.replaceChildren(...opcoes);
  $('pmSemTarefas').hidden = Boolean(tarefas?.length);

  // A tarefa escolhida pode ter sido concluída no gerenciador: continua aparecendo pelo nome
  const atual = estado.tarefa;
  if (atual?.id && !tarefas?.some(t => t.id === atual.id)) seletor.add(new Option(atual.texto, atual.id), 1);
  seletor.value = atual ? (atual.id ?? '__outra') : '';
  $('pmOutra').hidden = seletor.value !== '__outra';
  if (atual && !atual.id) $('pmOutra').value = atual.texto;
}

function escolherTarefa() {
  const valor = $('pmTarefa').value;
  $('pmOutra').hidden = valor !== '__outra';
  if (valor === '__outra') {
    $('pmOutra').focus();
    estado.tarefa = $('pmOutra').value.trim() ? { id: null, texto: $('pmOutra').value.trim() } : null;
  } else if (valor) {
    estado.tarefa = { id: valor, texto: $('pmTarefa').selectedOptions[0].textContent };
  } else {
    estado.tarefa = null;
  }
  salvar();
  desenharResumo();
}

/* ---------- Sessões e resumo do dia ---------- */

const sessoes = () => ler(CHAVE_SESSOES, { sessoes: [] }).sessoes;

function registrarSessao() {
  const dados = ler(CHAVE_SESSOES, { sessoes: [] });
  dados.sessoes.push({
    tarefaId: estado.tarefa?.id ?? null,
    texto: estado.tarefa?.texto ?? 'Sem tarefa específica',
    fim: new Date().toISOString(),
    minutos: config.foco
  });
  dados.sessoes = dados.sessoes.slice(-500); // guarda só as últimas 500
  gravar(CHAVE_SESSOES, dados);
}

function desenharResumo() {
  const hoje = new Date().toDateString();
  const deHoje = sessoes().filter(s => new Date(s.fim).toDateString() === hoje);
  const minutos = deHoje.reduce((soma, s) => soma + s.minutos, 0);
  $('pmHoje').textContent = deHoje.length
    ? `Hoje: ${deHoje.length} foco${deHoje.length > 1 ? 's' : ''} · ${minutos >= 60 ? `${Math.floor(minutos / 60)} h ${minutos % 60} min` : `${minutos} min`}`
    : 'Nenhum foco concluído hoje ainda.';

  const porTarefa = {};
  deHoje.forEach(s => {
    porTarefa[s.texto] = (porTarefa[s.texto] || 0) + 1;
  });
  $('pmPorTarefa').replaceChildren(
    ...Object.entries(porTarefa)
      .sort((a, b) => b[1] - a[1])
      .map(([texto, n]) => {
        const li = document.createElement('li');
        const nome = document.createElement('span');
        nome.textContent = texto;
        li.append(nome, ` ${'🍅'.repeat(Math.min(n, 8))}${n > 8 ? ` ×${n}` : ''}`);
        return li;
      })
  );

  // Bolinhas do ciclo: quantos focos faltam para a pausa longa
  const feitos = estado.focos % config.ciclos;
  $('pmCiclo').replaceChildren(
    ...Array.from({ length: config.ciclos }, (_, i) => {
      const bolinha = document.createElement('span');
      bolinha.className = `ciclo-bolinha${i < feitos ? ' feito' : ''}`;
      return bolinha;
    })
  );
  $('pmCiclo').setAttribute('aria-label', `${feitos} de ${config.ciclos} focos até a pausa longa`);
}

/* ---------- Relógio ---------- */

function atualizar() {
  const ms = restante();
  if (estado.fimEm && ms <= 0) return terminarFase();
  $('pmTempo').textContent = formatarRestante(ms);
  $('pmFase').textContent = FASES[estado.fase];
  $('pmPainel').dataset.fase = estado.fase;
  desenharAnel($('pmAnel'), ms / duracaoDa(estado.fase));
  const pausado = !estado.fimEm && ms < duracaoDa(estado.fase);
  $('pmIniciar').textContent = estado.fimEm
    ? 'Pausar'
    : pausado
      ? 'Continuar'
      : estado.fase === 'foco'
        ? 'Focar'
        : 'Pausar agora';
  $('pmIniciar').classList.toggle('rodando', Boolean(estado.fimEm));
  document.querySelectorAll('[data-fase]').forEach(b => b.setAttribute('aria-pressed', b.dataset.fase === estado.fase));
}

function rodar() {
  clearInterval(relogio);
  relogio = setInterval(atualizar, 250);
}

function irPara(fase, comecar) {
  clearInterval(relogio);
  estado.fase = fase;
  estado.restante = duracaoDa(fase);
  estado.fimEm = comecar ? Date.now() + estado.restante : null;
  if (comecar) rodar();
  salvar();
  atualizar();
  desenharResumo();
}

const proximaPausa = () => (estado.focos % config.ciclos === 0 ? 'longa' : 'curta');

function terminarFase() {
  if (estado.fase === 'foco') {
    estado.focos++;
    registrarSessao();
    const pausa = proximaPausa();
    tocarAlarme();
    notificar(
      'Foco concluído 🍅',
      `${estado.tarefa ? `"${estado.tarefa.texto}" · ` : ''}Hora da ${FASES[pausa].toLowerCase()}.`
    );
    irPara(pausa, config.automatico);
  } else {
    tocarAlarme(true);
    notificar('Pausa encerrada', 'Hora de voltar ao foco.');
    irPara('foco', config.automatico);
  }
}

export function alternarPomodoro() {
  prepararSom();
  if (estado.fimEm) {
    estado.restante = restante();
    estado.fimEm = null;
    clearInterval(relogio);
  } else {
    estado.fimEm = Date.now() + restante();
    rodar();
  }
  salvar();
  atualizar();
}

export function zerarPomodoro() {
  estado.focos = 0;
  irPara('foco', false);
}

// Pular: vai para a próxima fase sem contar o foco
function pular() {
  irPara(estado.fase === 'foco' ? proximaPausa() : 'foco', Boolean(estado.fimEm));
}

/* ---------- Início ---------- */

export function iniciarPomodoro() {
  // Vindo do gerenciador: ?tarefa=ID já escolhe a tarefa
  const pedida = new URLSearchParams(location.search).get('tarefa');
  const tarefa = pedida && tarefasPendentes()?.find(t => t.id === pedida);
  if (tarefa) {
    estado.tarefa = { id: tarefa.id, texto: tarefa.texto };
    salvar();
  }

  $('pmIniciar').addEventListener('click', alternarPomodoro);
  $('pmPular').addEventListener('click', pular);
  $('pmZerar').addEventListener('click', zerarPomodoro);
  document
    .querySelectorAll('[data-fase]')
    .forEach(b => b.addEventListener('click', () => irPara(b.dataset.fase, false)));
  $('pmTarefa').addEventListener('change', escolherTarefa);
  $('pmOutra').addEventListener('input', escolherTarefa);

  // Configurações (minutos de cada fase, ciclos até a pausa longa e início automático)
  for (const campo of ['foco', 'curta', 'longa', 'ciclos']) {
    const entrada = $(`pmConfig-${campo}`);
    entrada.value = config[campo];
    entrada.addEventListener('change', () => {
      const valor = Math.round(Number(entrada.value));
      if (valor >= Number(entrada.min) && valor <= Number(entrada.max)) config[campo] = valor;
      entrada.value = config[campo];
      gravar(`${CHAVE}-config`, config);
      if (!estado.fimEm && (campo === estado.fase || campo === 'ciclos')) irPara(estado.fase, false);
      desenharResumo();
    });
  }
  $('pmConfig-automatico').checked = config.automatico;
  $('pmConfig-automatico').addEventListener('change', () => {
    config.automatico = $('pmConfig-automatico').checked;
    gravar(`${CHAVE}-config`, config);
  });

  // A lista de tarefas pode mudar em outra aba (no próprio gerenciador)
  window.addEventListener('storage', e => {
    if (e.key === CHAVE_TAREFAS) desenharTarefas();
  });

  // Terminou enquanto a página estava fechada: conta o foco e deixa a pausa pronta, sem alarme atrasado
  if (estado.fimEm && restante() <= 0) {
    if (estado.fase === 'foco') {
      estado.focos++;
      registrarSessao();
      irPara(proximaPausa(), false);
    } else {
      irPara('foco', false);
    }
  }
  if (estado.fimEm) rodar();
  desenharTarefas();
  desenharResumo();
  atualizar();
  return Boolean(tarefa);
}
