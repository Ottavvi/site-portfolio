// Cronômetro com voltas. O tempo é calculado pela diferença entre "agora" e o momento em que começou,
// então ele continua certo se o navegador atrasar a tela e até se a aba for fechada e aberta de novo.
import { desenharAnel, formatar, formatarTexto, gravar, ler } from './apoio.js';

const $ = id => document.getElementById(id);
const CHAVE = 'tempo-cronometro';

let estado = ler(CHAVE, { rodando: false, inicioEm: 0, acumulado: 0, voltas: [] });
let quadro = null;

const decorrido = () => estado.acumulado + (estado.rodando ? Date.now() - estado.inicioEm : 0);
const salvar = () => gravar(CHAVE, estado);
export const cronometroRodando = () => estado.rodando;
export const tempoCronometro = () => formatar(decorrido()).principal;

function atualizar() {
  const ms = decorrido();
  const { principal, centesimos } = formatar(ms);
  $('crTempo').innerHTML = `${principal}<small>,${centesimos}</small>`;
  const inicioVolta = estado.voltas.length ? estado.voltas.at(-1).total : 0;
  $('crVolta').textContent = `Volta ${estado.voltas.length + 1} · ${formatarTexto(ms - inicioVolta)}`;
  desenharAnel($('crAnel'), (ms % 60000) / 60000); // uma volta completa por minuto
  if (estado.rodando) quadro = requestAnimationFrame(atualizar);
}

function botoes() {
  $('crIniciar').textContent = estado.rodando ? 'Pausar' : decorrido() ? 'Continuar' : 'Iniciar';
  $('crIniciar').classList.toggle('rodando', estado.rodando);
  $('crVoltaZerar').textContent = estado.rodando || !decorrido() ? 'Volta' : 'Zerar';
  $('crVoltaZerar').disabled = !decorrido() && !estado.rodando;
}

export function alternarCronometro() {
  if (estado.rodando) {
    estado.acumulado = decorrido();
    estado.rodando = false;
    cancelAnimationFrame(quadro);
  } else {
    estado.inicioEm = Date.now();
    estado.rodando = true;
    quadro = requestAnimationFrame(atualizar);
  }
  salvar();
  botoes();
  atualizar();
}

export function marcarVolta() {
  if (!estado.rodando) return;
  const total = decorrido();
  const anterior = estado.voltas.length ? estado.voltas.at(-1).total : 0;
  estado.voltas.push({ total, tempo: total - anterior });
  salvar();
  desenharVoltas();
}

export function zerarCronometro() {
  if (estado.rodando) return;
  cancelAnimationFrame(quadro);
  estado = { rodando: false, inicioEm: 0, acumulado: 0, voltas: [] };
  salvar();
  botoes();
  desenharVoltas();
  atualizar();
}

// Voltas da mais recente para a mais antiga, destacando a melhor e a pior
function desenharVoltas() {
  const { voltas } = estado;
  const tempos = voltas.map(v => v.tempo);
  const melhor = Math.min(...tempos);
  const pior = Math.max(...tempos);
  $('crVoltas').replaceChildren(
    ...voltas
      .map((volta, i) => {
        const linha = document.createElement('tr');
        if (voltas.length > 1 && volta.tempo === melhor) linha.className = 'melhor';
        if (voltas.length > 1 && volta.tempo === pior) linha.className = 'pior';
        [`#${i + 1}`, formatarTexto(volta.tempo), formatarTexto(volta.total)].forEach(valor => {
          const celula = document.createElement('td');
          celula.textContent = valor;
          linha.append(celula);
        });
        return linha;
      })
      .reverse()
  );
  $('crSemVoltas').hidden = voltas.length > 0;
}

export function iniciarCronometro() {
  $('crIniciar').addEventListener('click', alternarCronometro);
  $('crVoltaZerar').addEventListener('click', () => (estado.rodando ? marcarVolta() : zerarCronometro()));
  botoes();
  desenharVoltas();
  atualizar();
}
