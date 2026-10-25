// Sessões de foco feitas no Pomodoro da Central de tempo (../cronometro/), que grava em "tempo-v1".
// Só leitura: aqui elas viram o selo 🍅 da tarefa e o resumo no painel de detalhes.

export function focosPorTarefa() {
  const contagem = new Map();
  try {
    for (const sessao of JSON.parse(localStorage.getItem('tempo-v1'))?.sessoes ?? []) {
      if (!sessao.tarefaId) continue;
      const atual = contagem.get(sessao.tarefaId) ?? { focos: 0, minutos: 0 };
      contagem.set(sessao.tarefaId, { focos: atual.focos + 1, minutos: atual.minutos + (sessao.minutos || 0) });
    }
  } catch {
    // Sem armazenamento ou dado inválido: nenhuma sessão
  }
  return contagem;
}

// Link que abre o Pomodoro já focando nesta tarefa
export const linkFocar = id => `../cronometro/?tarefa=${encodeURIComponent(id)}#pomodoro`;
