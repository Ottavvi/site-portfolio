// Atalhos usados ao escrever as aulas: blocos de código (com botão "Experimente") e caixas de dica
const escapar = texto =>
  String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bloco de código HTML. O gerador transforma em <pre> com um botão que abre o código num editor ao vivo.
const codigo = texto => `<pre class="aula-codigo" data-experimente><code>${escapar(texto)}</code></pre>`;

const dica = html => `<aside class="aula-dica"><strong>Dica</strong><p>${html}</p></aside>`;

module.exports = { escapar, codigo, dica };
