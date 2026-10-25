// Exportar todas as tarefas num arquivo .json e importar de volta (backup ou troca de aparelho).
import { avisar } from './aviso.js';
import { alterar, completar, estado } from './estado.js';
import { hojeISO } from './datas.js';

export function exportar() {
  const arquivo = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(arquivo);
  link.download = `tarefas-${hojeISO()}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  avisar(`Arquivo baixado com ${estado.tarefas.length} tarefa(s)`);
}

export async function importar(arquivo) {
  let dados;
  try {
    dados = JSON.parse(await arquivo.text());
  } catch {
    return avisar('Esse arquivo não é um backup de tarefas válido');
  }
  // Aceita o backup deste app e também a lista simples da versão antiga ([{ text, done }])
  if (Array.isArray(dados)) {
    dados = {
      versao: 2,
      tarefas: dados.map(t => ({ texto: String(t.text ?? t.texto ?? ''), feita: Boolean(t.done ?? t.feita) }))
    };
  }
  if (dados?.versao !== 2 || !Array.isArray(dados.tarefas))
    return avisar('Esse arquivo não é um backup de tarefas válido');

  const novo = completar(dados);
  // As tarefas precisam apontar para uma lista que exista
  const listas = new Set(novo.listas.map(l => l.id));
  novo.tarefas.forEach(t => {
    if (!listas.has(t.listaId)) t.listaId = novo.listas[0].id;
  });
  alterar(e => {
    Object.keys(e).forEach(chave => delete e[chave]);
    Object.assign(e, novo);
  }, `${novo.tarefas.length} tarefa(s) importada(s)`);
}
