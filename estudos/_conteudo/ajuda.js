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

// Resposta escondida de um exercício das aulas práticas (trilhas sem editor, como Excel e DAX)
const resposta = html =>
  `<details class="desafio-solucao"><summary>Ver a resposta</summary><div class="aula-resposta">${html}</div></details>`;

// Tabela simples com os dados de exemplo de uma prática (dá para copiar e colar no Excel)
const tabela = (cabecalho, linhas) =>
  `<div class="aula-tabela"><table><thead><tr>${cabecalho.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${linhas
    .map(l => `<tr>${l.map(v => `<td>${v}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;

module.exports = { escapar, codigo, trecho, dica, resposta, tabela };
