// Atalhos usados ao escrever as aulas: blocos de código (com botão "Experimente") e caixas de dica
const escapar = texto =>
  String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bloco de código HTML. O gerador transforma em <pre> com um botão que abre o código num editor ao vivo.
// linguagem (opcional) troca o ambiente só deste bloco; sem ela, vale o da trilha (sql, python, react...)
const codigo = (texto, linguagem) =>
  `<pre class="aula-codigo" data-experimente${linguagem ? ` data-linguagem="${linguagem}"` : ''}><code>${escapar(texto)}</code></pre>`;

// Trecho que não roda sozinho (só CSS, por exemplo): mesmo visual, sem o botão "Experimente".
const trecho = texto => `<pre class="aula-codigo"><code>${escapar(texto)}</code></pre>`;

const dica = html => `<aside class="aula-dica"><strong>Dica</strong><p>${html}</p></aside>`;

module.exports = { escapar, codigo, trecho, dica };
