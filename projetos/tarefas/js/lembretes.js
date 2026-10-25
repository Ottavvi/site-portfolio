// Lembretes: notificação do navegador na hora marcada de cada tarefa (com a página ou o app aberto).
import { alterar, estado } from './estado.js';
import { avisar } from './aviso.js';

const suportado = 'Notification' in window;
const botao = document.getElementById('botaoLembretes');

export function iniciarLembretes() {
  if (!suportado) {
    botao.hidden = true;
    return;
  }
  atualizarBotao();
  botao.addEventListener('click', async () => {
    if (Notification.permission === 'granted') {
      avisar('Lembretes já estão ativos. Para desligar, use as permissões do site no navegador.');
      return;
    }
    const resposta = await Notification.requestPermission();
    atualizarBotao();
    if (resposta === 'granted') {
      avisar('Lembretes ativados para as tarefas com hora marcada');
      notificar('Lembretes ativados', 'Você vai ser avisado na hora das tarefas com horário.');
    } else {
      avisar('O navegador bloqueou as notificações deste site');
    }
  });
  verificar();
  setInterval(verificar, 30000);
  document.addEventListener('visibilitychange', verificar);
}

function atualizarBotao() {
  const rotulos = {
    granted: '🔔 Lembretes ativados',
    denied: '🔕 Lembretes bloqueados',
    default: '🔔 Ativar lembretes'
  };
  botao.textContent = rotulos[Notification.permission];
}

// Avisa as tarefas pendentes cuja hora já chegou (no máximo 12 horas atrás, para não avisar coisa velha)
function verificar() {
  if (!suportado || Notification.permission !== 'granted') return;
  const agora = Date.now();
  const vencidas = estado.tarefas.filter(t => {
    if (t.feita || t.lembrado || !t.prazo || !t.hora) return false;
    const hora = new Date(`${t.prazo}T${t.hora}`).getTime();
    return hora <= agora && agora - hora < 12 * 3600000;
  });
  if (!vencidas.length) return;
  vencidas.forEach(t => notificar(t.texto, `Agora: ${t.hora}${t.notas ? ` · ${t.notas.slice(0, 80)}` : ''}`, t.id));
  alterar(e => {
    e.tarefas.forEach(t => {
      if (vencidas.some(v => v.id === t.id)) t.lembrado = true;
    });
  });
}

// No celular (Android) só dá para notificar pelo service worker; no computador, os dois funcionam
async function notificar(titulo, corpo, tag) {
  const opcoes = { body: corpo, icon: 'icones/icone-192.png', badge: 'icones/icone-192.png', tag };
  try {
    const registro = await navigator.serviceWorker?.getRegistration();
    if (registro) return registro.showNotification(titulo, opcoes);
  } catch {
    // Sem service worker: usa a notificação comum
  }
  new Notification(titulo, opcoes);
}
