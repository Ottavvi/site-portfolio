// Funções usadas pelas três ferramentas: formato do tempo, anel de progresso, armazenamento e alarme.

const pad = n => String(n).padStart(2, '0');

// Data de hoje "AAAA-MM-DD" no fuso do aparelho (o mesmo formato dos prazos do Gerenciador de tarefas)
export function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// 83456 ms -> { principal: '01:23', centesimos: '45' } (com horas: '1:02:03')
export function formatar(ms) {
  const total = Math.max(0, Math.floor(ms / 10));
  const centesimos = total % 100;
  const segundos = Math.floor(total / 100) % 60;
  const minutos = Math.floor(total / 6000) % 60;
  const horas = Math.floor(total / 360000);
  const principal = horas ? `${horas}:${pad(minutos)}:${pad(segundos)}` : `${pad(minutos)}:${pad(segundos)}`;
  return { principal, centesimos: pad(centesimos) };
}

export const formatarTexto = ms => {
  const { principal, centesimos } = formatar(ms);
  return `${principal},${centesimos}`;
};

// Contagem regressiva arredonda para cima: com 0,4 s faltando ainda mostra 00:01
export const formatarRestante = ms => formatar(Math.ceil(Math.max(0, ms) / 1000) * 1000).principal;

const COMPRIMENTO_ANEL = 2 * Math.PI * 90;
export function desenharAnel(circulo, fracao) {
  circulo.style.strokeDasharray = COMPRIMENTO_ANEL;
  circulo.style.strokeDashoffset = COMPRIMENTO_ANEL * (1 - Math.min(1, Math.max(0, fracao)));
}

/* ---------- Armazenamento (pode falhar em aba anônima) ---------- */

export function ler(chave, padrao) {
  try {
    return JSON.parse(localStorage.getItem(chave)) ?? padrao;
  } catch {
    return padrao;
  }
}

export function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Sem armazenamento: funciona, só não lembra depois de fechar
  }
}

/* ---------- Alarme: som, vibração e notificação ---------- */

let audio = null;

// O navegador só libera som depois de um clique; chamar no primeiro "Iniciar" deixa o alarme pronto
export function prepararSom() {
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
  } catch {
    audio = null;
  }
  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
}

// Três bipes curtos (ou dois, mais graves, para avisos menores)
export function tocarAlarme(suave = false) {
  if (audio) {
    const bipes = suave ? 2 : 3;
    for (let i = 0; i < bipes; i++) {
      const oscilador = audio.createOscillator();
      const volume = audio.createGain();
      const inicio = audio.currentTime + i * 0.28;
      oscilador.frequency.value = suave ? 660 : 880;
      volume.gain.setValueAtTime(0.0001, inicio);
      volume.gain.exponentialRampToValueAtTime(0.3, inicio + 0.02);
      volume.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.22);
      oscilador.connect(volume).connect(audio.destination);
      oscilador.start(inicio);
      oscilador.stop(inicio + 0.24);
    }
  }
  navigator.vibrate?.(suave ? [150, 100, 150] : [300, 120, 300, 120, 300]);
}

export function notificar(titulo, corpo) {
  // Com a página aberta e visível, o próprio app já avisa na tela
  if (!('Notification' in window) || Notification.permission !== 'granted' || !document.hidden) return;
  try {
    new Notification(titulo, { body: corpo, icon: '../../favicon.svg', tag: 'central-de-tempo' });
  } catch {
    // Alguns celulares só notificam por service worker: o som e a vibração continuam
  }
}
