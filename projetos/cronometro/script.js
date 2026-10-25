const display = document.getElementById('display');
const currentLapDisplay = document.getElementById('currentLap');
const startBtn = document.getElementById('startBtn');
const lapResetBtn = document.getElementById('lapResetBtn');
const lapList = document.getElementById('lapList');
const lapsEmpty = document.getElementById('lapsEmpty');
const ringProgress = document.getElementById('ringProgress');
const RING_LENGTH = 2 * Math.PI * 90;

// O tempo é calculado pela diferença entre "agora" e o momento em que começou,
// assim ele continua certo mesmo se o navegador atrasar a atualização da tela
let running = false;
let startedAt = 0;
let elapsedBefore = 0;
let laps = [];
let frame = null;

function elapsed() {
  return running ? elapsedBefore + (performance.now() - startedAt) : elapsedBefore;
}

function format(ms) {
  const totalCentiseconds = Math.floor(ms / 10);
  const centiseconds = totalCentiseconds % 100;
  const seconds = Math.floor(totalCentiseconds / 100) % 60;
  const minutes = Math.floor(totalCentiseconds / 6000);
  const pad = value => String(value).padStart(2, '0');
  return { main: `${pad(minutes)}:${pad(seconds)}`, cents: pad(centiseconds) };
}

function formatText(ms) {
  const { main, cents } = format(ms);
  return `${main},${cents}`;
}

function update() {
  const ms = elapsed();
  const { main, cents } = format(ms);
  display.innerHTML = `${main}<small>,${cents}</small>`;
  const lapStart = laps.length ? laps[laps.length - 1].total : 0;
  currentLapDisplay.textContent = `Volta ${laps.length + 1} · ${formatText(ms - lapStart)}`;
  // O anel dá uma volta completa a cada minuto
  ringProgress.style.strokeDashoffset = RING_LENGTH * (1 - (ms % 60000) / 60000);
  if (running) frame = requestAnimationFrame(update);
}

function startPause() {
  if (running) {
    elapsedBefore = elapsed();
    running = false;
    cancelAnimationFrame(frame);
  } else {
    startedAt = performance.now();
    running = true;
    frame = requestAnimationFrame(update);
  }
  startBtn.textContent = running ? 'Pausar' : 'Continuar';
  startBtn.classList.toggle('running', running);
  lapResetBtn.textContent = running ? 'Volta' : 'Zerar';
  lapResetBtn.disabled = false;
  update();
}

function addLap() {
  const total = elapsed();
  const previous = laps.length ? laps[laps.length - 1].total : 0;
  laps.push({ total, time: total - previous });
  renderLaps();
}

function reset() {
  running = false;
  cancelAnimationFrame(frame);
  elapsedBefore = 0;
  laps = [];
  startBtn.textContent = 'Iniciar';
  startBtn.classList.remove('running');
  lapResetBtn.textContent = 'Volta';
  lapResetBtn.disabled = true;
  renderLaps();
  update();
}

// Mostra as voltas da mais recente para a mais antiga, destacando a melhor e a pior
function renderLaps() {
  const times = laps.map(lap => lap.time);
  const best = Math.min(...times);
  const worst = Math.max(...times);
  lapList.replaceChildren(
    ...laps
      .map((lap, index) => {
        const row = document.createElement('tr');
        if (laps.length > 1 && lap.time === best) row.className = 'best';
        if (laps.length > 1 && lap.time === worst) row.className = 'worst';
        [`#${index + 1}`, formatText(lap.time), formatText(lap.total)].forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        });
        return row;
      })
      .reverse()
  );
  lapsEmpty.hidden = laps.length > 0;
}

startBtn.addEventListener('click', startPause);
lapResetBtn.addEventListener('click', () => (running ? addLap() : reset()));

// Atalhos de teclado
document.addEventListener('keydown', event => {
  if (event.repeat) return;
  const key = event.key.toLowerCase();
  // Com um botão em foco, o próprio navegador já "clica" nele ao apertar Espaço
  if (key === ' ' && event.target.closest('button')) return;
  if (key === ' ') {
    event.preventDefault();
    startPause();
  } else if (key === 'v' && running) {
    addLap();
  } else if (key === 'z' && !running) {
    reset();
  }
});

update();
