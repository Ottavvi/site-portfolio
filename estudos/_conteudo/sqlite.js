// Trilha de SQLite: o editor roda SQL de verdade (sql.js, o SQLite compilado para o navegador) num banco de exemplo
// de uma loja (clientes, produtos, pedidos e itens), definido em js/estudos-ambientes.js. Cada vez que o código muda,
// o banco volta ao estado original.
// Os testes comparam o resultado da pessoa (window.__resultados, um por consulta) com o de uma consulta-gabarito rodada
// num banco limpo (window.__consultar). Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'sqlite',
  area: 'Back-end e dados',
  titulo: 'SQLite',
  sigla: 'SQL',
  linguagem: 'sql',
  resumo: 'SQL de verdade, rodando no navegador: consultas, filtros, junções, agrupamentos e modelagem.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Ler dados: SELECT, filtros e ordenação.',
      modulos: [
        {
          titulo: 'Consultas',
          itens: [
            {
              id: 'o-que-e-sql',
              titulo: 'Bancos, tabelas e SELECT',
              resumo: 'O que é um banco relacional e como pedir dados a ele.',
              minutos: 9,
              corpo: `
<p>Um <strong>banco de dados relacional</strong> guarda informações em <strong>tabelas</strong>, parecidas com planilhas: cada <strong>coluna</strong> tem um nome e um tipo, e cada <strong>linha</strong> é um registro. <strong>SQL</strong> é a linguagem para conversar com ele: perguntar, inserir, alterar e apagar dados.</p>
<p>O <strong>SQLite</strong> é um banco que cabe num único arquivo, sem servidor. Ele está no seu celular, no navegador e em milhões de apps. Nesta trilha, ele roda dentro da página: cada exemplo tem o botão <strong>Experimente</strong> e o resultado aparece como tabela.</p>

<h2>O banco de exemplo</h2>
<p>Todas as aulas usam o banco de uma pequena loja de café:</p>
<ul>
  <li><code>clientes</code>: id, nome, cidade, estado, desde (data do cadastro)</li>
  <li><code>produtos</code>: id, nome, categoria, preco, estoque</li>
  <li><code>pedidos</code>: id, cliente_id, data, status</li>
  <li><code>itens</code>: pedido_id, produto_id, quantidade, preco (o preço pago naquele pedido)</li>
</ul>

<h2>SELECT: pedir dados</h2>
<p>A forma mais simples é <code>SELECT colunas FROM tabela</code>. O asterisco pede todas as colunas:</p>
${codigo(`SELECT * FROM produtos;`)}
<p>Pedir só as colunas que interessam deixa o resultado mais claro e a consulta mais rápida:</p>
${codigo(`SELECT nome, preco FROM produtos;`)}

<h2>Calcular e renomear</h2>
<p>Dá para fazer contas nas colunas e dar um nome ao resultado com <code>AS</code>:</p>
${codigo(`SELECT nome, preco, estoque, preco * estoque AS valor_em_estoque
FROM produtos;`)}
${dica('SQL não diferencia maiúsculas nas palavras-chave: <code>select</code> e <code>SELECT</code> funcionam igual. Escrever as palavras-chave em maiúsculas é só um costume para facilitar a leitura. O ponto e vírgula separa um comando do outro.')}

<h2>Valores sem repetição</h2>
<p><code>DISTINCT</code> tira as linhas repetidas do resultado:</p>
${codigo(`SELECT DISTINCT estado FROM clientes;`)}
`,
              quiz: [
                {
                  pergunta: 'Numa tabela, o que é cada linha?',
                  opcoes: ['Um tipo de dado', 'Um registro', 'Um banco inteiro'],
                  certa: 1,
                  explicacao:
                    'Cada linha é um registro (um cliente, um produto). As colunas são os campos de cada registro.'
                },
                {
                  pergunta: 'O que SELECT nome FROM clientes devolve?',
                  opcoes: ['Só a coluna nome de todos os clientes', 'Todas as colunas', 'O primeiro cliente'],
                  certa: 0,
                  explicacao: 'SELECT escolhe as colunas. Sem filtro, vêm todas as linhas da tabela.'
                },
                {
                  pergunta: 'Para que serve DISTINCT?',
                  opcoes: ['Ordenar', 'Tirar linhas repetidas do resultado', 'Apagar dados repetidos da tabela'],
                  certa: 1,
                  explicacao: 'Ele age só no resultado da consulta. A tabela continua igual.'
                }
              ]
            },
            {
              id: 'filtrar-e-ordenar',
              titulo: 'Filtrar e ordenar',
              resumo: 'WHERE, AND, OR, LIKE, IN, ORDER BY e LIMIT.',
              minutos: 11,
              corpo: `
<p>Quase nunca queremos a tabela inteira. <code>WHERE</code> deixa só as linhas que atendem a uma condição:</p>
${codigo(`SELECT nome, preco FROM produtos
WHERE preco < 50;`)}

<h2>Comparações</h2>
<p>Os operadores são <code>=</code>, <code>&lt;&gt;</code> (diferente), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code> e <code>&gt;=</code>. Texto vai entre <strong>aspas simples</strong>:</p>
${codigo(`SELECT nome, cidade FROM clientes
WHERE estado = 'PR';`)}

<h2>Juntando condições</h2>
<p><code>AND</code> exige as duas, <code>OR</code> aceita qualquer uma. Use parênteses quando misturar os dois:</p>
${codigo(`SELECT nome, categoria, preco FROM produtos
WHERE categoria = 'Utensílios' AND (preco < 100 OR estoque > 5);`)}

<h2>Atalhos úteis</h2>
<ul>
  <li><code>IN ('SP', 'PR')</code>: o valor está numa lista.</li>
  <li><code>BETWEEN 20 AND 70</code>: entre dois valores, incluindo os dois.</li>
  <li><code>LIKE 'Ca%'</code>: texto que começa com "Ca". O <code>%</code> vale qualquer sequência; o <code>_</code>, um caractere.</li>
  <li><code>IS NULL</code>: a coluna está vazia. <code>= NULL</code> nunca funciona.</li>
</ul>
${codigo(`SELECT nome FROM produtos WHERE nome LIKE '%café%';
SELECT nome, estado FROM clientes WHERE estado IN ('SP', 'PE');`)}
${dica('No SQLite, <code>LIKE</code> ignora maiúsculas e minúsculas, mas só nas letras sem acento.')}

<h2>Ordenar e limitar</h2>
<p><code>ORDER BY</code> ordena (<code>ASC</code> crescente, o padrão, ou <code>DESC</code> decrescente). <code>LIMIT</code> corta o resultado. Juntos, respondem perguntas como "os 3 mais caros":</p>
${codigo(`SELECT nome, preco FROM produtos
ORDER BY preco DESC
LIMIT 3;`)}
<p>A ordem das partes é sempre a mesma: <code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>, <code>ORDER BY</code>, <code>LIMIT</code>.</p>
${dica('Sem <code>ORDER BY</code>, o banco não promete ordem nenhuma. Se a ordem importa, peça.')}
`,
              quiz: [
                {
                  pergunta: "Como achar produtos cujo nome termina em 'manual'?",
                  opcoes: ["LIKE 'manual%'", "LIKE '%manual'", "= '%manual'"],
                  certa: 1,
                  explicacao:
                    'O % vem antes: qualquer coisa e depois "manual". Com =, o % é tratado como um caractere comum.'
                },
                {
                  pergunta: 'Como saber quais clientes não têm cidade preenchida?',
                  opcoes: ['WHERE cidade = NULL', "WHERE cidade = ''", 'WHERE cidade IS NULL'],
                  certa: 2,
                  explicacao: 'NULL não é igual a nada, nem a outro NULL. Por isso existe IS NULL.'
                },
                {
                  pergunta: 'Qual é a ordem certa das partes?',
                  opcoes: [
                    'SELECT, WHERE, FROM, LIMIT',
                    'SELECT, FROM, WHERE, ORDER BY, LIMIT',
                    'FROM, SELECT, ORDER BY, WHERE'
                  ],
                  certa: 1,
                  explicacao: 'O banco recusa a consulta se as partes estiverem fora de ordem.'
                }
              ]
            },
            {
              id: 'desafio-consultas',
              tipo: 'desafio',
              titulo: 'Desafio: perguntas sobre a loja',
              resumo: 'Responda três perguntas com SELECT, WHERE, ORDER BY e LIMIT.',
              minutos: 15,
              enunciado: `
<p>A dona da loja tem três perguntas. Escreva uma consulta para cada uma, <strong>nesta ordem</strong>, separadas por ponto e vírgula. Os testes comparam cada resultado com o esperado, então as colunas e a ordem das linhas importam.</p>
<ol>
  <li>Quais produtos estão <strong>sem estoque</strong>? Mostre <code>nome</code>, ordenado por nome.</li>
  <li>Quais clientes são do <strong>PR ou de SP</strong>? Mostre <code>nome</code> e <code>estado</code>, ordenados por nome.</li>
  <li>Quais são os <strong>2 produtos mais baratos</strong> da categoria Mercearia? Mostre <code>nome</code> e <code>preco</code>, do mais barato para o mais caro.</li>
</ol>`,
              inicial: `-- 1. Produtos sem estoque
SELECT * FROM produtos;

-- 2. Clientes do PR ou de SP

-- 3. Os 2 produtos mais baratos da Mercearia
`,
              testes: [
                [
                  '1ª consulta: nomes dos produtos sem estoque, por nome',
                  async doc => {
                    const w = doc.defaultView;
                    const r = w.__resultados[0];
                    const g = w.__consultar('SELECT nome FROM produtos WHERE estoque = 0 ORDER BY nome');
                    return !!r && JSON.stringify(r.values) === JSON.stringify(g.values);
                  }
                ],
                [
                  '2ª consulta: nome e estado dos clientes do PR e de SP, por nome',
                  async doc => {
                    const w = doc.defaultView;
                    const r = w.__resultados[1];
                    const g = w.__consultar(
                      "SELECT nome, estado FROM clientes WHERE estado IN ('PR','SP') ORDER BY nome"
                    );
                    return !!r && JSON.stringify(r.values) === JSON.stringify(g.values);
                  }
                ],
                [
                  '3ª consulta: nome e preço dos 2 itens mais baratos da Mercearia',
                  async doc => {
                    const w = doc.defaultView;
                    const r = w.__resultados[2];
                    const g = w.__consultar(
                      "SELECT nome, preco FROM produtos WHERE categoria = 'Mercearia' ORDER BY preco LIMIT 2"
                    );
                    return !!r && JSON.stringify(r.values) === JSON.stringify(g.values);
                  }
                ]
              ],
              solucao: `-- 1. Produtos sem estoque
SELECT nome FROM produtos WHERE estoque = 0 ORDER BY nome;

-- 2. Clientes do PR ou de SP
SELECT nome, estado FROM clientes
WHERE estado IN ('PR', 'SP')
ORDER BY nome;

-- 3. Os 2 produtos mais baratos da Mercearia
SELECT nome, preco FROM produtos
WHERE categoria = 'Mercearia'
ORDER BY preco
LIMIT 2;`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Resumir com funções de agregação e cruzar tabelas com JOIN.',
      modulos: [
        {
          titulo: 'Juntar e resumir',
          itens: [
            {
              id: 'agrupar',
              titulo: 'Contar, somar e agrupar',
              resumo: 'COUNT, SUM, AVG, GROUP BY e HAVING.',
              minutos: 12,
              corpo: `
<p>As <strong>funções de agregação</strong> transformam várias linhas num número só:</p>
<ul>
  <li><code>COUNT(*)</code>: quantas linhas.</li>
  <li><code>SUM(coluna)</code> e <code>AVG(coluna)</code>: soma e média.</li>
  <li><code>MIN(coluna)</code> e <code>MAX(coluna)</code>: menor e maior.</li>
</ul>
${codigo(`SELECT COUNT(*) AS produtos,
       ROUND(AVG(preco), 2) AS preco_medio,
       MAX(preco) AS mais_caro
FROM produtos;`)}

<h2>GROUP BY: uma linha por grupo</h2>
<p>Com <code>GROUP BY</code>, a agregação é feita <strong>para cada grupo</strong>. "Quantos produtos e qual o preço médio de cada categoria?":</p>
${codigo(`SELECT categoria, COUNT(*) AS quantidade, ROUND(AVG(preco), 2) AS preco_medio
FROM produtos
GROUP BY categoria
ORDER BY quantidade DESC;`)}
<p>A regra: toda coluna no <code>SELECT</code> ou está no <code>GROUP BY</code>, ou está dentro de uma função de agregação. (O SQLite até aceita fugir disso, mas devolve um valor qualquer do grupo. Outros bancos dão erro.)</p>

<h2>HAVING: filtrar grupos</h2>
<p><code>WHERE</code> filtra as <strong>linhas antes</strong> de agrupar. <code>HAVING</code> filtra os <strong>grupos depois</strong>, e por isso pode usar as agregações:</p>
${codigo(`-- Estados com mais de um cliente
SELECT estado, COUNT(*) AS clientes
FROM clientes
GROUP BY estado
HAVING COUNT(*) > 1;`)}

<h2>Agrupar por parte de uma data</h2>
<p>Datas no SQLite costumam ser texto no formato <code>AAAA-MM-DD</code>. A função <code>strftime</code> extrai pedaços, como o mês:</p>
${codigo(`SELECT strftime('%Y-%m', data) AS mes, COUNT(*) AS pedidos
FROM pedidos
WHERE status <> 'cancelado'
GROUP BY mes
ORDER BY mes;`)}
${dica('Guardar datas como <code>AAAA-MM-DD</code> é o que faz a ordenação e as comparações funcionarem: nesse formato, a ordem alfabética é a mesma da ordem no tempo.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre WHERE e HAVING?',
                  opcoes: [
                    'Nenhuma',
                    'WHERE filtra linhas antes de agrupar; HAVING filtra os grupos depois',
                    'HAVING só funciona com texto'
                  ],
                  certa: 1,
                  explicacao: 'Por isso COUNT(*) > 1 só pode ir no HAVING: antes de agrupar, ainda não existe contagem.'
                },
                {
                  pergunta: 'O que COUNT(*) conta?',
                  opcoes: ['Colunas', 'Linhas', 'Valores diferentes'],
                  certa: 1,
                  explicacao:
                    'Linhas (de cada grupo, se houver GROUP BY). Para contar valores diferentes, use COUNT(DISTINCT coluna).'
                },
                {
                  pergunta: 'Com GROUP BY categoria, o que pode ir no SELECT?',
                  opcoes: ['Qualquer coluna', 'categoria e funções de agregação', 'Só COUNT(*)'],
                  certa: 1,
                  explicacao:
                    'As outras colunas têm vários valores por grupo: precisam de uma agregação que escolha ou resuma.'
                }
              ]
            },
            {
              id: 'joins',
              titulo: 'Juntar tabelas com JOIN',
              resumo: 'INNER JOIN, LEFT JOIN, apelidos e chaves estrangeiras.',
              minutos: 13,
              corpo: `
<p>Os dados ficam em tabelas separadas para não repetir informação: o pedido guarda só o <code>cliente_id</code>, não o nome e a cidade do cliente. Essa coluna que aponta para o <code>id</code> de outra tabela se chama <strong>chave estrangeira</strong>. Para ver tudo junto, usamos <code>JOIN</code>.</p>

<h2>INNER JOIN</h2>
${codigo(`SELECT pedidos.id, pedidos.data, clientes.nome
FROM pedidos
JOIN clientes ON clientes.id = pedidos.cliente_id
ORDER BY pedidos.data;`)}
<p>O <code>ON</code> diz como as linhas se ligam. <code>JOIN</code> sozinho é o mesmo que <code>INNER JOIN</code>: só aparecem as combinações que existem dos dois lados.</p>

<h2>Apelidos</h2>
<p>Dar um apelido curto a cada tabela deixa a consulta legível, principalmente quando são várias:</p>
${codigo(`SELECT p.id AS pedido, c.nome AS cliente, pr.nome AS produto, i.quantidade, i.preco
FROM itens i
JOIN pedidos p   ON p.id = i.pedido_id
JOIN clientes c  ON c.id = p.cliente_id
JOIN produtos pr ON pr.id = i.produto_id
ORDER BY p.id;`)}

<h2>LEFT JOIN: incluir quem não tem par</h2>
<p>Quais clientes nunca compraram? Com <code>INNER JOIN</code>, eles somem do resultado. O <code>LEFT JOIN</code> mantém todas as linhas da tabela da esquerda e preenche com <code>NULL</code> quando não há par:</p>
${codigo(`SELECT c.nome, p.id AS pedido
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;`)}

<h2>JOIN com GROUP BY</h2>
<p>Juntar e depois agrupar responde as perguntas mais comuns de relatório, como o total gasto por cliente:</p>
${codigo(`SELECT c.nome, ROUND(SUM(i.quantidade * i.preco), 2) AS total
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
JOIN itens i   ON i.pedido_id = p.id
WHERE p.status <> 'cancelado'
GROUP BY c.id, c.nome
ORDER BY total DESC;`)}
${dica('Esquecer o <code>ON</code> (ou errar a coluna) combina cada linha de uma tabela com todas da outra. Se o resultado ficou enorme de repente, confira os <code>ON</code>.')}
`,
              quiz: [
                {
                  pergunta: 'O que é uma chave estrangeira?',
                  opcoes: [
                    'Uma coluna que aponta para o id de outra tabela',
                    'Uma senha do banco',
                    'Uma coluna que não pode repetir'
                  ],
                  certa: 0,
                  explicacao: 'pedidos.cliente_id aponta para clientes.id: é assim que o pedido sabe de quem é.'
                },
                {
                  pergunta: 'Qual JOIN mostra também os clientes sem nenhum pedido?',
                  opcoes: ['INNER JOIN', 'clientes LEFT JOIN pedidos', 'pedidos LEFT JOIN clientes'],
                  certa: 1,
                  explicacao: 'O LEFT JOIN mantém todas as linhas da tabela da esquerda, aqui a de clientes.'
                },
                {
                  pergunta: 'Num LEFT JOIN, o que aparece nas colunas da direita quando não há par?',
                  opcoes: ['Zero', 'Texto vazio', 'NULL'],
                  certa: 2,
                  explicacao: 'Por isso WHERE p.id IS NULL encontra quem não tem par.'
                }
              ]
            },
            {
              id: 'desafio-relatorio',
              tipo: 'desafio',
              titulo: 'Desafio: relatório de vendas',
              resumo: 'Use JOIN e GROUP BY para montar o relatório da loja.',
              minutos: 20,
              enunciado: `
<p>Monte o relatório de vendas com duas consultas, nesta ordem. Pedidos <strong>cancelados não contam</strong>. O valor de um item é <code>quantidade * preco</code> (o preço da tabela <code>itens</code>, que é o que o cliente pagou).</p>
<ol>
  <li><strong>Faturamento por categoria</strong>: colunas <code>categoria</code> e <code>total</code> (arredondado com 2 casas), da categoria que mais vendeu para a que menos vendeu.</li>
  <li><strong>Clientes com mais de um pedido</strong>: colunas <code>nome</code> e <code>pedidos</code> (a quantidade), ordenado por nome.</li>
</ol>`,
              inicial: `-- 1. Faturamento por categoria (sem pedidos cancelados)


-- 2. Clientes com mais de um pedido (sem pedidos cancelados)
`,
              testes: [
                [
                  '1ª consulta: categoria e total, do maior para o menor',
                  async doc => {
                    const w = doc.defaultView;
                    const r = w.__resultados[0];
                    const g = w.__consultar(`SELECT pr.categoria, ROUND(SUM(i.quantidade * i.preco), 2) AS total
                      FROM itens i JOIN pedidos p ON p.id = i.pedido_id JOIN produtos pr ON pr.id = i.produto_id
                      WHERE p.status <> 'cancelado' GROUP BY pr.categoria ORDER BY total DESC`);
                    return !!r && JSON.stringify(r.values) === JSON.stringify(g.values);
                  }
                ],
                [
                  '1ª consulta: as colunas se chamam categoria e total',
                  async doc => {
                    const r = doc.defaultView.__resultados[0];
                    return !!r && r.columns.join() === 'categoria,total';
                  }
                ],
                [
                  '2ª consulta: nome e quantidade de pedidos de quem tem mais de um',
                  async doc => {
                    const w = doc.defaultView;
                    const r = w.__resultados[1];
                    const g = w.__consultar(`SELECT c.nome, COUNT(*) AS pedidos FROM clientes c
                      JOIN pedidos p ON p.cliente_id = c.id WHERE p.status <> 'cancelado'
                      GROUP BY c.id HAVING COUNT(*) > 1 ORDER BY c.nome`);
                    return !!r && JSON.stringify(r.values) === JSON.stringify(g.values);
                  }
                ]
              ],
              solucao: `-- 1. Faturamento por categoria (sem pedidos cancelados)
SELECT pr.categoria, ROUND(SUM(i.quantidade * i.preco), 2) AS total
FROM itens i
JOIN pedidos p   ON p.id = i.pedido_id
JOIN produtos pr ON pr.id = i.produto_id
WHERE p.status <> 'cancelado'
GROUP BY pr.categoria
ORDER BY total DESC;

-- 2. Clientes com mais de um pedido (sem pedidos cancelados)
SELECT c.nome, COUNT(*) AS pedidos
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
WHERE p.status <> 'cancelado'
GROUP BY c.id, c.nome
HAVING COUNT(*) > 1
ORDER BY c.nome;`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Criar e alterar tabelas, subconsultas, CTEs e funções de janela.',
      modulos: [
        {
          titulo: 'Modelar e alterar',
          itens: [
            {
              id: 'criar-e-alterar',
              titulo: 'Criar tabelas e alterar dados',
              resumo: 'CREATE TABLE, restrições, INSERT, UPDATE, DELETE e transações.',
              minutos: 13,
              corpo: `
<h2>CREATE TABLE</h2>
<p>Criar uma tabela é dizer o nome e o tipo de cada coluna, e as <strong>restrições</strong> que protegem os dados:</p>
${codigo(`CREATE TABLE fornecedores (
  id       INTEGER PRIMARY KEY,
  nome     TEXT NOT NULL,
  email    TEXT UNIQUE,
  avaliacao INTEGER CHECK (avaliacao BETWEEN 1 AND 5),
  ativo    INTEGER NOT NULL DEFAULT 1
);

INSERT INTO fornecedores (nome, email, avaliacao) VALUES
  ('Torrefação Serra', 'contato@serra.com', 5),
  ('Cerâmicas Sul', 'vendas@ceramicassul.com', 4);

SELECT * FROM fornecedores;`)}
<ul>
  <li><code>PRIMARY KEY</code>: identifica a linha. Um <code>INTEGER PRIMARY KEY</code> é preenchido sozinho com o próximo número.</li>
  <li><code>NOT NULL</code>: a coluna é obrigatória. <code>UNIQUE</code>: não pode repetir.</li>
  <li><code>CHECK</code>: uma regra que todo valor precisa cumprir. <code>DEFAULT</code>: o valor quando nada é informado.</li>
</ul>
<p>Os tipos do SQLite são poucos: <code>INTEGER</code>, <code>REAL</code>, <code>TEXT</code> e <code>BLOB</code>. Datas costumam ir como <code>TEXT</code> (<code>'2026-10-28'</code>) e verdadeiro/falso como 0 e 1.</p>

<h2>UPDATE e DELETE</h2>
${codigo(`UPDATE produtos SET preco = preco * 1.10 WHERE categoria = 'Mercearia';
DELETE FROM produtos WHERE estoque = 0;
SELECT nome, preco, estoque FROM produtos;`)}
${dica('Um <code>UPDATE</code> ou <code>DELETE</code> <strong>sem WHERE</strong> muda a tabela inteira. Antes de rodar, troque por um <code>SELECT</code> com o mesmo <code>WHERE</code> e veja quais linhas seriam afetadas.')}

<h2>Restrições em ação</h2>
<p>Tente quebrar as regras: o banco recusa, e o erro diz qual restrição barrou.</p>
${codigo(`CREATE TABLE fornecedores (id INTEGER PRIMARY KEY, nome TEXT NOT NULL,
  avaliacao INTEGER CHECK (avaliacao BETWEEN 1 AND 5));
INSERT INTO fornecedores (nome, avaliacao) VALUES ('Sem nota boa', 9);`)}

<h2>Transações</h2>
<p>Algumas mudanças só fazem sentido juntas: tirar do estoque <em>e</em> registrar o item do pedido. Uma <strong>transação</strong> garante que ou tudo acontece, ou nada:</p>
${trecho(`BEGIN;
UPDATE produtos SET estoque = estoque - 2 WHERE id = 1;
INSERT INTO itens (pedido_id, produto_id, quantidade, preco) VALUES (9, 1, 2, 62.9);
COMMIT;   -- ou ROLLBACK; para desfazer tudo desde o BEGIN`)}
`,
              quiz: [
                {
                  pergunta: 'O que faz UPDATE produtos SET preco = 0; (sem WHERE)?',
                  opcoes: ['Dá erro', 'Zera o preço de todos os produtos', 'Zera só o primeiro'],
                  certa: 1,
                  explicacao: 'Sem WHERE, a mudança vale para todas as linhas. Teste o filtro com um SELECT antes.'
                },
                {
                  pergunta: 'Qual restrição impede dois fornecedores com o mesmo e-mail?',
                  opcoes: ['NOT NULL', 'UNIQUE', 'DEFAULT'],
                  certa: 1,
                  explicacao: 'UNIQUE recusa valores repetidos na coluna.'
                },
                {
                  pergunta: 'Para que serve uma transação?',
                  opcoes: [
                    'Deixar a consulta mais rápida',
                    'Garantir que um grupo de mudanças aconteça inteiro ou não aconteça',
                    'Criar tabelas'
                  ],
                  certa: 1,
                  explicacao: 'Se algo falhar no meio, o ROLLBACK volta tudo ao estado anterior ao BEGIN.'
                }
              ]
            },
            {
              id: 'subconsultas-e-janelas',
              titulo: 'Subconsultas, CTEs e janelas',
              resumo: 'Consultas dentro de consultas, WITH, CASE e funções de janela.',
              minutos: 14,
              corpo: `
<h2>Subconsultas</h2>
<p>Uma consulta pode usar o resultado de outra. "Quais produtos custam mais que a média?":</p>
${codigo(`SELECT nome, preco FROM produtos
WHERE preco > (SELECT AVG(preco) FROM produtos)
ORDER BY preco DESC;`)}
<p>Com <code>IN</code>, a subconsulta devolve uma lista. "Quais produtos nunca foram vendidos?":</p>
${codigo(`SELECT nome FROM produtos
WHERE id NOT IN (SELECT produto_id FROM itens);`)}

<h2>CTE: dar nome a um passo</h2>
<p>Quando a consulta fica longa, <code>WITH</code> cria uma tabela temporária com nome, que existe só durante a consulta. Fica parecido com dividir um problema em variáveis:</p>
${codigo(`WITH total_por_pedido AS (
  SELECT pedido_id, SUM(quantidade * preco) AS total
  FROM itens
  GROUP BY pedido_id
)
SELECT ROUND(AVG(total), 2) AS ticket_medio, ROUND(MAX(total), 2) AS maior_pedido
FROM total_por_pedido;`)}

<h2>CASE: decisões dentro da consulta</h2>
${codigo(`SELECT nome, estoque,
  CASE
    WHEN estoque = 0 THEN 'esgotado'
    WHEN estoque < 10 THEN 'acabando'
    ELSE 'ok'
  END AS situacao
FROM produtos
ORDER BY estoque;`)}

<h2>Funções de janela</h2>
<p>Uma agregação com <code>GROUP BY</code> junta as linhas. Uma <strong>função de janela</strong> calcula sobre um grupo <em>sem juntar</em>: cada linha continua lá, com o cálculo ao lado. É assim que se faz ranking e total acumulado:</p>
${codigo(`SELECT categoria, nome, preco,
  RANK() OVER (PARTITION BY categoria ORDER BY preco DESC) AS posicao_na_categoria,
  ROUND(AVG(preco) OVER (PARTITION BY categoria), 2) AS media_da_categoria
FROM produtos
ORDER BY categoria, posicao_na_categoria;`)}
<p><code>PARTITION BY</code> separa os grupos e o <code>ORDER BY</code> de dentro do <code>OVER</code> define a ordem da conta. Para um total acumulado, some com <code>SUM(...) OVER (ORDER BY data)</code>.</p>
${dica('Para descobrir por que uma consulta está lenta, ponha <code>EXPLAIN QUERY PLAN</code> antes dela. Se aparecer <code>SCAN</code> numa tabela grande filtrada por uma coluna, um índice (<code>CREATE INDEX</code>) naquela coluna costuma resolver.')}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o WITH (CTE)?',
                  opcoes: [
                    'Criar uma tabela permanente',
                    'Dar nome a um passo intermediário da consulta',
                    'Apagar linhas'
                  ],
                  certa: 1,
                  explicacao: 'A CTE existe só durante aquela consulta e deixa consultas longas mais fáceis de ler.'
                },
                {
                  pergunta: 'Qual a diferença entre GROUP BY e uma função de janela?',
                  opcoes: [
                    'Nenhuma',
                    'A janela calcula sobre o grupo sem juntar as linhas',
                    'A janela só funciona com texto'
                  ],
                  certa: 1,
                  explicacao: 'Com OVER, cada linha continua no resultado e ganha o valor calculado sobre o seu grupo.'
                },
                {
                  pergunta: 'O que NOT IN (SELECT produto_id FROM itens) encontra?',
                  opcoes: ['Produtos vendidos', 'Produtos que nunca apareceram num pedido', 'Pedidos sem itens'],
                  certa: 1,
                  explicacao: 'A subconsulta lista os produtos vendidos; NOT IN fica com os que não estão nessa lista.'
                }
              ]
            },
            {
              id: 'desafio-avaliacoes',
              tipo: 'desafio',
              titulo: 'Desafio: avaliações de produtos',
              resumo: 'Crie uma tabela com restrições, insira dados e faça um ranking.',
              minutos: 25,
              enunciado: `
<p>A loja vai aceitar avaliações. Escreva, nesta ordem:</p>
<ol>
  <li>Um <code>CREATE TABLE avaliacoes</code> com: <code>id</code> (chave primária), <code>produto_id</code> (inteiro, obrigatório, chave estrangeira para <code>produtos</code>), <code>nota</code> (inteiro, obrigatório, <strong>só de 1 a 5</strong>) e <code>comentario</code> (texto, opcional).</li>
  <li>Os <code>INSERT</code> destas avaliações: produto 1 com notas 5 e 4; produto 3 com nota 5; produto 2 com notas 3, 2 e 4.</li>
  <li>Uma consulta com <code>nome</code> do produto, <code>media</code> das notas (2 casas) e <code>avaliacoes</code> (quantidade), da maior média para a menor. Só produtos com avaliação.</li>
</ol>
<p>Um teste tenta inserir uma nota 7: a tabela precisa recusar.</p>`,
              inicial: `CREATE TABLE avaliacoes (
  id INTEGER PRIMARY KEY
  -- complete as colunas
);

-- INSERT das avaliações


-- Ranking por média
`,
              testes: [
                [
                  'A tabela avaliacoes existe com produto_id, nota e comentario',
                  async doc => {
                    const r = doc.defaultView.__db.exec('PRAGMA table_info(avaliacoes)')[0];
                    const colunas = r ? r.values.map(v => v[1]) : [];
                    return ['id', 'produto_id', 'nota', 'comentario'].every(c => colunas.includes(c));
                  }
                ],
                [
                  'nota e produto_id são obrigatórios (NOT NULL)',
                  async doc => {
                    const r = doc.defaultView.__db.exec('PRAGMA table_info(avaliacoes)')[0];
                    const col = nome => r.values.find(v => v[1] === nome);
                    return col('nota')[3] === 1 && col('produto_id')[3] === 1;
                  }
                ],
                [
                  'Uma nota fora de 1 a 5 é recusada',
                  async doc => {
                    const db = doc.defaultView.__db;
                    try {
                      db.run('SAVEPOINT teste');
                      db.run('INSERT INTO avaliacoes (produto_id, nota) VALUES (1, 7)');
                      db.run('ROLLBACK TO teste');
                      db.run('RELEASE teste');
                      return false;
                    } catch {
                      db.run('ROLLBACK TO teste');
                      db.run('RELEASE teste');
                      return true;
                    }
                  }
                ],
                [
                  'As 6 avaliações foram inseridas',
                  async doc => {
                    const r = doc.defaultView.__db.exec(
                      'SELECT produto_id, nota FROM avaliacoes ORDER BY produto_id, nota'
                    )[0];
                    return !!r && JSON.stringify(r.values) === '[[1,4],[1,5],[2,2],[2,3],[2,4],[3,5]]';
                  }
                ],
                [
                  'O ranking mostra nome, media e avaliacoes, da maior média para a menor',
                  async doc => {
                    const r = doc.defaultView.__resultados.at(-1);
                    return (
                      !!r &&
                      r.columns.join() === 'nome,media,avaliacoes' &&
                      JSON.stringify(r.values) ===
                        '[["Moedor manual",5,1],["Café em grãos 1kg",4.5,2],["Caneca de cerâmica",3,3]]'
                    );
                  }
                ]
              ],
              solucao: `CREATE TABLE avaliacoes (
  id INTEGER PRIMARY KEY,
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  nota INTEGER NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT
);

INSERT INTO avaliacoes (produto_id, nota) VALUES
  (1, 5), (1, 4), (3, 5), (2, 3), (2, 2), (2, 4);

SELECT p.nome, ROUND(AVG(a.nota), 2) AS media, COUNT(*) AS avaliacoes
FROM avaliacoes a
JOIN produtos p ON p.id = a.produto_id
GROUP BY p.id, p.nome
ORDER BY media DESC;`
            }
          ]
        },
        {
          titulo: 'Datas, textos e desempenho',
          itens: [
            {
              id: 'datas-e-textos',
              titulo: 'Funções de data e de texto',
              resumo: 'date, julianday, strftime, substr, || e COALESCE.',
              minutos: 12,
              corpo: `
<h2>Datas</h2>
<p>O SQLite não tem um tipo de data: guarda texto no formato <code>AAAA-MM-DD</code> (ou <code>AAAA-MM-DD HH:MM:SS</code>) e tem funções que entendem esse formato:</p>
${codigo(`SELECT
  date('2026-10-31')                     AS data,
  date('2026-10-31', '+30 days')         AS daqui_30_dias,
  date('2026-10-31', 'start of month')   AS inicio_do_mes,
  date('2026-10-31', '-1 month', 'start of month') AS mes_passado,
  strftime('%d/%m/%Y', '2026-10-31')     AS formato_brasileiro,
  strftime('%w', '2026-10-31')           AS dia_da_semana,   -- 0 = domingo
  julianday('2026-12-25') - julianday('2026-10-31') AS dias_ate_o_natal;`)}
<ul>
  <li><code>date(valor, modificadores...)</code> soma e subtrai dias, meses e anos, e vai para o início do mês ou do ano.</li>
  <li><code>julianday</code> transforma a data num número de dias. Subtrair dois deles dá a diferença em dias.</li>
  <li><code>strftime</code> formata e extrai partes (<code>%Y</code>, <code>%m</code>, <code>%d</code>, <code>%w</code>, <code>%H</code>...).</li>
  <li><code>date('now')</code> é a data de hoje em UTC. Em exercícios, use uma data fixa: o resultado não muda conforme o dia.</li>
</ul>
${codigo(`-- Há quantos dias foi cada pedido (em relação a 31/10/2026)?
SELECT id, data, CAST(julianday('2026-10-31') - julianday(data) AS INTEGER) AS dias_atras
FROM pedidos
ORDER BY data DESC;`)}

<h2>Textos</h2>
${codigo(`SELECT
  nome,
  upper(nome)                                AS maiusculas,
  substr(nome, 1, instr(nome, ' ') - 1)      AS primeiro_nome,
  nome || ' (' || estado || ')'               AS com_estado,
  length(nome)                                AS letras,
  replace(cidade, 'São', 'S.')                AS cidade_curta
FROM clientes;`)}
<p><code>||</code> junta textos. <code>instr</code> acha a posição de um pedaço e <code>substr</code> recorta, uma combinação útil para separar partes de um texto.</p>

<h2>Lidar com NULL</h2>
<ul>
  <li><code>COALESCE(a, b, c)</code> devolve o primeiro que não for NULL: <code>COALESCE(apelido, nome)</code>.</li>
  <li><code>NULLIF(a, b)</code> devolve NULL se forem iguais. Evita divisão por zero: <code>vendas / NULLIF(visitas, 0)</code>.</li>
  <li>Qualquer conta com NULL dá NULL: <code>10 + NULL</code> é NULL. E <code>COUNT(coluna)</code> ignora os NULL, enquanto <code>COUNT(*)</code> conta todas as linhas.</li>
</ul>
${dica("<code>printf</code> (ou <code>format</code>, nas versões novas) formata números: <code>printf('R$ %.2f', preco)</code> mostra duas casas. A vírgula brasileira fica para a aplicação, que formata com Intl na hora de mostrar.")}
`,
              quiz: [
                {
                  pergunta: 'Como calcular quantos dias se passaram entre duas datas no SQLite?',
                  opcoes: ['data2 - data1', 'julianday(data2) - julianday(data1)', 'DATEDIFF(data1, data2)'],
                  certa: 1,
                  explicacao: 'As datas são texto; julianday as transforma em números de dias.'
                },
                {
                  pergunta: "O que date('2026-10-31', 'start of month') devolve?",
                  opcoes: ["'2026-10-01'", "'2026-10-31'", "'2026-11-01'"],
                  certa: 0,
                  explicacao: 'O modificador leva ao primeiro dia do mês.'
                },
                {
                  pergunta: 'O que COALESCE(telefone, celular, "sem contato") devolve?',
                  opcoes: ['Os três juntos', 'O primeiro que não for NULL', 'NULL se algum for NULL'],
                  certa: 1,
                  explicacao: 'Ótimo para valores de reserva.'
                }
              ]
            },
            {
              id: 'indices-e-views',
              titulo: 'Índices, views e EXPLAIN',
              resumo: 'Consultas rápidas em tabelas grandes e consultas guardadas com nome.',
              minutos: 12,
              corpo: `
<h2>Índices</h2>
<p>Sem índice, para achar os pedidos do cliente 4 o banco lê a tabela inteira (um <strong>scan</strong>). Com milhões de linhas, isso demora. Um <strong>índice</strong> é como o índice remissivo de um livro: uma lista ordenada que leva direto às linhas certas.</p>
${codigo(`EXPLAIN QUERY PLAN SELECT * FROM pedidos WHERE cliente_id = 4;

CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);

EXPLAIN QUERY PLAN SELECT * FROM pedidos WHERE cliente_id = 4;`)}
<p>Compare as duas linhas do plano: antes, <code>SCAN pedidos</code>; depois, <code>SEARCH pedidos USING INDEX idx_pedidos_cliente</code>.</p>
<ul>
  <li>Crie índices nas colunas usadas em <code>WHERE</code>, em <code>JOIN</code> (as chaves estrangeiras!) e em <code>ORDER BY</code> de consultas frequentes.</li>
  <li>Índices têm custo: ocupam espaço e deixam <code>INSERT</code> e <code>UPDATE</code> um pouco mais lentos. Não crie um para cada coluna.</li>
  <li><code>CREATE UNIQUE INDEX</code> também garante que não haja repetição (e-mail único, por exemplo).</li>
  <li>Índice composto <code>(cliente_id, data)</code> atende filtros por cliente e por cliente + data, nessa ordem.</li>
</ul>

<h2>Views</h2>
<p>Uma <strong>view</strong> é uma consulta guardada com nome, usada como se fosse uma tabela. Ótima para não repetir JOINs complicados e para dar a quem faz relatórios uma visão pronta:</p>
${codigo(`CREATE VIEW vw_vendas AS
SELECT p.id AS pedido, p.data, c.nome AS cliente, pr.nome AS produto, pr.categoria,
       i.quantidade, i.quantidade * i.preco AS valor
FROM itens i
JOIN pedidos p   ON p.id = i.pedido_id
JOIN clientes c  ON c.id = p.cliente_id
JOIN produtos pr ON pr.id = i.produto_id
WHERE p.status <> 'cancelado';

SELECT categoria, ROUND(SUM(valor), 2) AS total FROM vw_vendas GROUP BY categoria;
SELECT cliente, COUNT(DISTINCT pedido) AS pedidos FROM vw_vendas GROUP BY cliente ORDER BY pedidos DESC;`)}
<p>A view não guarda dados: a consulta roda de novo a cada uso, sempre com os dados atuais.</p>
${dica('Ferramentas de BI, como o Power BI, conseguem ler views direto do banco. Uma view bem feita é um ótimo "contrato" entre quem cuida do banco e quem faz os relatórios.')}
`,
              quiz: [
                {
                  pergunta: 'O que SCAN no EXPLAIN QUERY PLAN indica?',
                  opcoes: ['Que o índice foi usado', 'Que a tabela inteira é lida', 'Um erro'],
                  certa: 1,
                  explicacao: 'Com o índice certo, aparece SEARCH ... USING INDEX.'
                },
                {
                  pergunta: 'Qual o custo de criar índices?',
                  opcoes: [
                    'Nenhum',
                    'Espaço em disco e escritas um pouco mais lentas',
                    'As consultas ficam mais lentas'
                  ],
                  certa: 1,
                  explicacao: 'Cada INSERT e UPDATE também atualiza os índices.'
                },
                {
                  pergunta: 'Uma view guarda uma cópia dos dados?',
                  opcoes: ['Sim', 'Não: a consulta roda de novo a cada uso', 'Só no SQLite'],
                  certa: 1,
                  explicacao: 'Por isso ela sempre mostra os dados atuais.'
                }
              ]
            },
            {
              id: 'desafio-clientes-inativos',
              tipo: 'desafio',
              titulo: 'Desafio: clientes inativos',
              resumo: 'Datas, subconsultas e uma view para a campanha de reativação.',
              minutos: 25,
              enunciado: `
<p>A loja vai fazer uma campanha para quem anda sumido. Considere que <strong>hoje é 2026-10-31</strong> e que pedidos cancelados não contam. Escreva, nesta ordem:</p>
<ol>
  <li>Uma consulta com <code>nome</code> e <code>dias</code> (dias inteiros desde o último pedido) de cada cliente que já comprou, do mais sumido para o mais recente (empates por nome).</li>
  <li>Uma consulta com o <code>nome</code> dos clientes que <strong>nunca</strong> compraram, por nome.</li>
  <li>Um <code>CREATE VIEW vw_total_pedido</code> com <code>pedido_id</code> e <code>total</code> (soma de quantidade × preço, 2 casas) de cada pedido.</li>
  <li>Uma consulta à view com <code>pedido_id</code> e <code>total</code> dos pedidos acima de 200, do maior para o menor.</li>
</ol>`,
              inicial: `-- 1. Dias desde o último pedido (hoje é 2026-10-31)


-- 2. Clientes que nunca compraram


-- 3. A view vw_total_pedido


-- 4. Pedidos acima de 200, pela view
`,
              testes: [
                [
                  '1ª consulta: nome e dias desde o último pedido, do mais sumido',
                  async doc => {
                    const w = doc.defaultView;
                    const r = w.__resultados[0];
                    const g =
                      w.__consultar(`SELECT c.nome, CAST(julianday('2026-10-31') - julianday(MAX(p.data)) AS INTEGER) AS dias
                      FROM clientes c JOIN pedidos p ON p.cliente_id = c.id WHERE p.status <> 'cancelado'
                      GROUP BY c.id ORDER BY dias DESC, c.nome`);
                    return (
                      !!r && r.columns.join() === 'nome,dias' && JSON.stringify(r.values) === JSON.stringify(g.values)
                    );
                  }
                ],
                [
                  '2ª consulta: quem nunca comprou (cancelado não conta)',
                  async doc => {
                    const w = doc.defaultView;
                    const r = w.__resultados[1];
                    const g = w.__consultar(
                      "SELECT nome FROM clientes WHERE id NOT IN (SELECT cliente_id FROM pedidos WHERE status <> 'cancelado') ORDER BY nome"
                    );
                    return !!r && JSON.stringify(r.values) === JSON.stringify(g.values);
                  }
                ],
                [
                  'A view vw_total_pedido existe, com pedido_id e total',
                  async doc => {
                    const db = doc.defaultView.__db;
                    const r = db.exec(
                      "SELECT name FROM sqlite_master WHERE type = 'view' AND name = 'vw_total_pedido'"
                    )[0];
                    if (!r) return false;
                    const t = db.exec('SELECT pedido_id, total FROM vw_total_pedido WHERE pedido_id = 8')[0];
                    return !!t && t.values[0][1] === 337.7;
                  }
                ],
                [
                  '4ª consulta: pedidos acima de 200 pela view, do maior para o menor',
                  async doc => {
                    const w = doc.defaultView;
                    const r = w.__resultados[2];
                    const g = w.__consultar(`SELECT pedido_id, ROUND(SUM(quantidade * preco), 2) AS total FROM itens
                      GROUP BY pedido_id HAVING total > 200 ORDER BY total DESC`);
                    return !!r && JSON.stringify(r.values) === JSON.stringify(g.values);
                  }
                ]
              ],
              solucao: `-- 1. Dias desde o último pedido (hoje é 2026-10-31)
SELECT c.nome,
       CAST(julianday('2026-10-31') - julianday(MAX(p.data)) AS INTEGER) AS dias
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
WHERE p.status <> 'cancelado'
GROUP BY c.id, c.nome
ORDER BY dias DESC, c.nome;

-- 2. Clientes que nunca compraram
SELECT nome FROM clientes
WHERE id NOT IN (SELECT cliente_id FROM pedidos WHERE status <> 'cancelado')
ORDER BY nome;

-- 3. A view vw_total_pedido
CREATE VIEW vw_total_pedido AS
SELECT pedido_id, ROUND(SUM(quantidade * preco), 2) AS total
FROM itens
GROUP BY pedido_id;

-- 4. Pedidos acima de 200, pela view
SELECT pedido_id, total FROM vw_total_pedido
WHERE total > 200
ORDER BY total DESC;`
            }
          ]
        }
      ]
    }
  ]
};
