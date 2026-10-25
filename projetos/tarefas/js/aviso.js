// Aviso no rodapé da tela ("Tarefa excluída · Desfazer"), que some sozinho depois de alguns segundos.

const caixa = document.getElementById('aviso');
const texto = document.getElementById('avisoTexto');
const botao = document.getElementById('avisoDesfazer');
let temporizador = null;
let acaoDesfazer = null;

export function avisar(mensagem, desfazer = null) {
  clearTimeout(temporizador);
  texto.textContent = mensagem;
  acaoDesfazer = desfazer;
  botao.hidden = !desfazer;
  caixa.hidden = false;
  temporizador = setTimeout(fechar, desfazer ? 7000 : 3500);
}

function fechar() {
  caixa.hidden = true;
  acaoDesfazer = null;
}

botao.addEventListener('click', () => {
  const desfazer = acaoDesfazer;
  fechar();
  if (desfazer) desfazer();
});

// Ctrl+Z desfaz a última ação enquanto o aviso estiver na tela
export function desfazerUltima() {
  if (!acaoDesfazer) return false;
  botao.click();
  return true;
}
