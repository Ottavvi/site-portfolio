// Trilha de SQL para análise de dados. Continua a de SQLite (que ensina SELECT, JOIN, GROUP BY e o básico de janelas)
// com o banco da mesma loja de café, definido em js/estudos-ambientes.js. O foco aqui são perguntas de negócio:
// percentuais, comparação entre períodos, ranking, coortes e qualidade dos dados.
// Os testes comparam o resultado da pessoa (window.__resultados) com uma consulta-gabarito (window.__consultar).
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, dica } = require('./ajuda');

// Compara a consulta n da pessoa com o gabarito: mesmas colunas (se pedidas) e mesmas linhas, na mesma ordem
const mesmoResultado = (n, gabarito, colunas) =>
  new Function(
    'doc',
    `const w = doc.defaultView;
    const r = w.__resultados[${n}];
    const g = w.__consultar(${JSON.stringify(gabarito)});
    return !!r && ${colunas ? `r.columns.join() === ${JSON.stringify(colunas)} &&` : ''} JSON.stringify(r.values) === JSON.stringify(g.values);`
  );

module.exports = {
  id: 'sql-analise',
  area: 'Dados e BI',
  titulo: 'SQL para análise',
  sigla: 'SQL+',
  linguagem: 'sql',
  resumo: 'Responder perguntas de negócio com SQL: percentuais, evolução mês a mês, rankings, coortes e dados sujos.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Transformar perguntas em consultas: faixas, contagens condicionais e percentuais.',
      modulos: [
        {
          titulo: 'Perguntas de negócio',
          itens: [
            {
              id: 'da-pergunta-a-consulta',
              titulo: 'Da pergunta à consulta',
              resumo: 'Granularidade, faixas com CASE e contagens condicionais.',
              minutos: 11,
              corpo: `
<p>Esta trilha continua a de <a href="../sqlite/">SQLite</a>, com o mesmo banco da loja de café (<code>clientes</code>, <code>produtos</code>, <code>pedidos</code> e <code>itens</code>). Lá você aprendeu os comandos; aqui, a pensar como analista: pegar uma pergunta vaga ("como estão as vendas?") e transformá-la numa consulta que responde exatamente o que foi perguntado.</p>

<h2>Primeiro: uma linha é o quê?</h2>
<p>Antes de escrever, decida a <strong>granularidade</strong> do resultado: uma linha por cliente? por mês? por produto e mês? Isso define o <code>GROUP BY</code>. E confira a granularidade das tabelas: em <code>itens</code>, uma linha é um produto dentro de um pedido. Contar linhas de <code>itens</code> não é contar pedidos.</p>
${codigo(`-- Linhas de itens x pedidos de verdade
SELECT COUNT(*) AS linhas_de_itens,
       COUNT(DISTINCT pedido_id) AS pedidos
FROM itens;`)}

<h2>Faixas com CASE</h2>
<p>Quem lê o relatório quer grupos com nome, não 30 preços diferentes. O <code>CASE</code> cria a faixa e o <code>GROUP BY</code> agrupa por ela:</p>
${codigo(`SELECT
  CASE
    WHEN preco < 30  THEN '1. até R$ 30'
    WHEN preco < 100 THEN '2. de R$ 30 a R$ 100'
    ELSE '3. acima de R$ 100'
  END AS faixa,
  COUNT(*) AS produtos
FROM produtos
GROUP BY faixa
ORDER BY faixa;`)}
${dica('O número no começo do nome da faixa ("1.", "2.") é um truque simples para o ORDER BY seguir a ordem lógica, e não a alfabética.')}

<h2>Contar com condição</h2>
<p>Muitas perguntas pedem várias contagens lado a lado: "quantos pedidos no total e quantos cancelados?". Uma soma de <code>CASE</code> conta só as linhas que cumprem a condição. O SQLite também aceita o atalho <code>FILTER</code>:</p>
${codigo(`SELECT
  COUNT(*) AS pedidos,
  SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) AS cancelados,
  COUNT(*) FILTER (WHERE status IN ('pago', 'enviado')) AS em_andamento
FROM pedidos;`)}

<h2>Linhas que viram colunas</h2>
<p>A mesma ideia monta uma tabela cruzada (o "pivô" das planilhas): uma linha por estado e uma coluna por situação.</p>
${codigo(`SELECT c.estado,
  SUM(p.status = 'entregue')  AS entregues,
  SUM(p.status <> 'entregue') AS outros
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
GROUP BY c.estado
ORDER BY c.estado;`)}
<p>No SQLite, uma comparação vale 1 (verdadeiro) ou 0 (falso), então <code>SUM(status = 'entregue')</code> já conta. Em outros bancos, use o <code>CASE</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'Em itens, uma linha é um produto de um pedido. COUNT(*) de itens dá:',
                  opcoes: ['O número de pedidos', 'O número de linhas de produtos nos pedidos', 'O número de clientes'],
                  certa: 1,
                  explicacao: 'Para contar pedidos, use COUNT(DISTINCT pedido_id).'
                },
                {
                  pergunta: "O que SUM(CASE WHEN status = 'cancelado' THEN 1 ELSE 0 END) devolve?",
                  opcoes: ['A soma dos valores cancelados', 'Quantos pedidos estão cancelados', 'Um erro'],
                  certa: 1,
                  explicacao: 'Cada linha vale 1 ou 0, e a soma conta as que cumprem a condição.'
                },
                {
                  pergunta: 'Para que serve definir a granularidade antes de escrever?',
                  opcoes: [
                    'Para saber o que é uma linha do resultado e acertar o GROUP BY',
                    'Para deixar a consulta mais rápida',
                    'Para criar índices'
                  ],
                  certa: 0,
                  explicacao: 'Uma linha por mês, por cliente ou por produto: cada escolha é um GROUP BY diferente.'
                }
              ]
            },
            {
              id: 'percentuais-e-combinacoes',
              titulo: 'Percentuais, UNION e EXISTS',
              resumo: 'Participação no total, juntar resultados e perguntar "existe algum?".',
              minutos: 12,
              corpo: `
<h2>Percentual do total</h2>
<p>"Quanto cada categoria representa do faturamento?" pede o total de cada grupo dividido pelo total geral. Uma função de janela sem <code>PARTITION BY</code> soma tudo, sem juntar as linhas:</p>
${codigo(`SELECT pr.categoria,
  ROUND(SUM(i.quantidade * i.preco), 2) AS total,
  ROUND(100.0 * SUM(i.quantidade * i.preco) / SUM(SUM(i.quantidade * i.preco)) OVER (), 1) AS pct
FROM itens i
JOIN produtos pr ON pr.id = i.produto_id
GROUP BY pr.categoria
ORDER BY total DESC;`)}
<p><code>SUM(SUM(...)) OVER ()</code> parece estranho, mas lê-se assim: a soma de dentro é a do grupo (por causa do <code>GROUP BY</code>); a de fora soma esses totais de todos os grupos.</p>
${dica('Divisão de inteiros no SQLite descarta os decimais: <code>1 / 3</code> dá 0. Multiplique por <code>100.0</code> (com ponto) antes de dividir, e o resultado vira decimal.')}

<h2>UNION: empilhar resultados</h2>
<p><code>UNION ALL</code> põe um resultado embaixo do outro (as colunas precisam bater). <code>UNION</code> faz o mesmo e tira as linhas repetidas. Útil para montar uma tabela de resumo com linhas de naturezas diferentes:</p>
${codigo(`SELECT 'Clientes' AS indicador, COUNT(*) AS valor FROM clientes
UNION ALL
SELECT 'Produtos', COUNT(*) FROM produtos
UNION ALL
SELECT 'Pedidos entregues', COUNT(*) FROM pedidos WHERE status = 'entregue';`)}

<h2>EXISTS: existe pelo menos um?</h2>
<p>"Quais clientes já compraram algum Utensílio?" não quer saber quantos, só se existe. <code>EXISTS</code> para de procurar no primeiro que achar, e não duplica clientes como um <code>JOIN</code> faria:</p>
${codigo(`SELECT c.nome
FROM clientes c
WHERE EXISTS (
  SELECT 1
  FROM pedidos p
  JOIN itens i     ON i.pedido_id = p.id
  JOIN produtos pr ON pr.id = i.produto_id
  WHERE p.cliente_id = c.id AND pr.categoria = 'Utensílios'
)
ORDER BY c.nome;`)}
<p><code>NOT EXISTS</code> faz o contrário e, diferente de <code>NOT IN</code>, não se confunde quando a subconsulta tem <code>NULL</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'Quanto dá 100 * 1 / 3 no SQLite?',
                  opcoes: ['33.33', '33', '0'],
                  certa: 1,
                  explicacao: 'Tudo inteiro, então a divisão é inteira. Com 100.0, daria 33.33...'
                },
                {
                  pergunta: 'Qual a diferença entre UNION e UNION ALL?',
                  opcoes: ['Nenhuma', 'UNION tira as linhas repetidas; UNION ALL mantém todas', 'UNION ALL ordena'],
                  certa: 1,
                  explicacao: 'UNION ALL é mais rápido quando você sabe que não há repetição.'
                },
                {
                  pergunta: 'Por que usar EXISTS em vez de JOIN para "clientes que compraram X"?',
                  opcoes: [
                    'O JOIN repetiria o cliente para cada compra; EXISTS só pergunta se há alguma',
                    'EXISTS é obrigatório com subconsultas',
                    'JOIN não funciona com 3 tabelas'
                  ],
                  certa: 0,
                  explicacao: 'Com JOIN, seria preciso um DISTINCT para não repetir.'
                }
              ]
            },
            {
              id: 'desafio-raio-x',
              tipo: 'desafio',
              titulo: 'Desafio: raio-x da loja',
              resumo: 'Faixas, contagens condicionais e percentuais em três consultas.',
              minutos: 18,
              enunciado: `
<p>Escreva três consultas, <strong>nesta ordem</strong>. Os testes comparam colunas e linhas com o resultado esperado.</p>
<ol>
  <li><strong>Situação dos pedidos</strong>: colunas <code>status</code>, <code>pedidos</code> (quantidade) e <code>pct</code> (percentual do total de pedidos, 1 casa decimal), do status com mais pedidos para o com menos; empates pelo nome do status.</li>
  <li><strong>Estoque por faixa</strong>: colunas <code>faixa</code> e <code>produtos</code>. As faixas são <code>'esgotado'</code> (estoque 0), <code>'baixo'</code> (1 a 9) e <code>'ok'</code> (10 ou mais), em ordem alfabética.</li>
  <li><strong>Clientes por estado</strong>: colunas <code>estado</code>, <code>clientes</code> (quantos) e <code>compraram</code> (quantos têm pelo menos um pedido <strong>não cancelado</strong>), por estado.</li>
</ol>`,
              inicial: `-- 1. Situação dos pedidos
SELECT status, COUNT(*) AS pedidos
FROM pedidos
GROUP BY status;

-- 2. Estoque por faixa


-- 3. Clientes por estado
`,
              testes: [
                [
                  '1ª consulta: status, pedidos e pct (1 casa), do maior para o menor',
                  mesmoResultado(
                    0,
                    'SELECT status, COUNT(*) AS pedidos, ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM pedidos), 1) AS pct FROM pedidos GROUP BY status ORDER BY pedidos DESC, status',
                    'status,pedidos,pct'
                  )
                ],
                [
                  '2ª consulta: faixa e produtos (esgotado, baixo e ok)',
                  mesmoResultado(
                    1,
                    "SELECT CASE WHEN estoque = 0 THEN 'esgotado' WHEN estoque < 10 THEN 'baixo' ELSE 'ok' END AS faixa, COUNT(*) AS produtos FROM produtos GROUP BY faixa ORDER BY faixa",
                    'faixa,produtos'
                  )
                ],
                [
                  '3ª consulta: estado, clientes e quantos compraram (sem cancelados)',
                  mesmoResultado(
                    2,
                    "SELECT c.estado, COUNT(*) AS clientes, SUM(EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id AND p.status <> 'cancelado')) AS compraram FROM clientes c GROUP BY c.estado ORDER BY c.estado",
                    'estado,clientes,compraram'
                  )
                ]
              ],
              solucao: `-- 1. Situação dos pedidos
SELECT status,
  COUNT(*) AS pedidos,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM pedidos
GROUP BY status
ORDER BY pedidos DESC, status;

-- 2. Estoque por faixa
SELECT
  CASE
    WHEN estoque = 0 THEN 'esgotado'
    WHEN estoque < 10 THEN 'baixo'
    ELSE 'ok'
  END AS faixa,
  COUNT(*) AS produtos
FROM produtos
GROUP BY faixa
ORDER BY faixa;

-- 3. Clientes por estado
SELECT c.estado,
  COUNT(*) AS clientes,
  SUM(EXISTS (
    SELECT 1 FROM pedidos p
    WHERE p.cliente_id = c.id AND p.status <> 'cancelado'
  )) AS compraram
FROM clientes c
GROUP BY c.estado
ORDER BY c.estado;`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Comparar períodos e ranquear com funções de janela.',
      modulos: [
        {
          titulo: 'Tempo e ranking',
          itens: [
            {
              id: 'evolucao-no-tempo',
              titulo: 'Evolução mês a mês',
              resumo: 'LAG, variação percentual, acumulado e média móvel.',
              minutos: 13,
              corpo: `
<p>"As vendas estão subindo?" é a pergunta mais comum de qualquer negócio. A resposta precisa de uma linha por período e de comparar cada linha com a anterior.</p>

<h2>Primeiro, a série</h2>
<p>Uma CTE com o faturamento de cada mês deixa os próximos passos simples:</p>
${codigo(`WITH mensal AS (
  SELECT strftime('%Y-%m', p.data) AS mes,
         ROUND(SUM(i.quantidade * i.preco), 2) AS faturamento
  FROM pedidos p
  JOIN itens i ON i.pedido_id = p.id
  WHERE p.status <> 'cancelado'
  GROUP BY mes
)
SELECT * FROM mensal ORDER BY mes;`)}

<h2>LAG e LEAD: a linha de antes e a de depois</h2>
<p><code>LAG(coluna)</code> traz o valor da linha anterior, na ordem do <code>OVER</code>. Com ele, a variação é uma conta simples:</p>
${codigo(`WITH mensal AS (
  SELECT strftime('%Y-%m', p.data) AS mes, SUM(i.quantidade * i.preco) AS faturamento
  FROM pedidos p JOIN itens i ON i.pedido_id = p.id
  WHERE p.status <> 'cancelado'
  GROUP BY mes
)
SELECT mes,
  ROUND(faturamento, 2) AS faturamento,
  ROUND(LAG(faturamento) OVER (ORDER BY mes), 2) AS mes_anterior,
  ROUND(100.0 * (faturamento - LAG(faturamento) OVER (ORDER BY mes))
        / LAG(faturamento) OVER (ORDER BY mes), 1) AS variacao_pct
FROM mensal
ORDER BY mes;`)}
<p>O primeiro mês não tem anterior: o <code>LAG</code> devolve <code>NULL</code>, e a conta também. É o certo: não há como comparar.</p>

<h2>Acumulado e média móvel</h2>
<p>Com o <code>ORDER BY</code> dentro do <code>OVER</code>, o <code>SUM</code> vira um total acumulado. E uma <strong>moldura</strong> (<code>ROWS BETWEEN</code>) limita a conta às linhas vizinhas, o que dá a média móvel, boa para enxergar a tendência sem os picos:</p>
${codigo(`WITH mensal AS (
  SELECT strftime('%Y-%m', p.data) AS mes, SUM(i.quantidade * i.preco) AS faturamento
  FROM pedidos p JOIN itens i ON i.pedido_id = p.id
  WHERE p.status <> 'cancelado'
  GROUP BY mes
)
SELECT mes,
  ROUND(faturamento, 2) AS faturamento,
  ROUND(SUM(faturamento) OVER (ORDER BY mes), 2) AS acumulado,
  ROUND(AVG(faturamento) OVER (ORDER BY mes ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS media_3_meses
FROM mensal
ORDER BY mes;`)}
${dica('Meses sem nenhuma venda simplesmente não aparecem no GROUP BY, e aí o LAG compara com dois meses atrás sem avisar. Em dados reais, gere a lista completa de meses (com uma CTE recursiva ou uma tabela de calendário) e faça LEFT JOIN com as vendas.')}
`,
              quiz: [
                {
                  pergunta: 'O que LAG(faturamento) OVER (ORDER BY mes) devolve?',
                  opcoes: ['O faturamento do mês seguinte', 'O faturamento do mês anterior', 'O maior faturamento'],
                  certa: 1,
                  explicacao: 'LAG olha para trás; LEAD olha para a frente.'
                },
                {
                  pergunta: 'O que muda quando o SUM ganha ORDER BY dentro do OVER?',
                  opcoes: ['Nada', 'Vira um total acumulado até a linha atual', 'Soma só a linha atual'],
                  certa: 1,
                  explicacao: 'Com ORDER BY, a moldura padrão vai do começo até a linha atual.'
                },
                {
                  pergunta: 'Por que a variação do primeiro mês é NULL?',
                  opcoes: ['É um erro da consulta', 'Não existe mês anterior para comparar', 'Porque faltou o ROUND'],
                  certa: 1,
                  explicacao: 'LAG devolve NULL, e qualquer conta com NULL dá NULL.'
                }
              ]
            },
            {
              id: 'ranking-e-top-n',
              titulo: 'Ranking, top N e o último de cada um',
              resumo: 'ROW_NUMBER, RANK, DENSE_RANK, NTILE e remover duplicados.',
              minutos: 12,
              corpo: `
<h2>Três jeitos de numerar</h2>
<p>Todos numeram as linhas na ordem do <code>OVER</code>. A diferença está nos empates:</p>
<ul>
  <li><code>ROW_NUMBER()</code>: 1, 2, 3, 4. Nunca repete (desempata de forma arbitrária).</li>
  <li><code>RANK()</code>: 1, 2, 2, 4. Empatados dividem a posição e a seguinte é pulada.</li>
  <li><code>DENSE_RANK()</code>: 1, 2, 2, 3. Empatados dividem e nada é pulado.</li>
</ul>

<h2>Top N por grupo</h2>
<p>"O produto mais vendido de cada categoria" é um clássico: numere dentro de cada categoria e fique com o 1º. Como uma janela não pode ir no <code>WHERE</code> da mesma consulta, o filtro fica numa consulta de fora:</p>
${codigo(`WITH vendas AS (
  SELECT pr.categoria, pr.nome, SUM(i.quantidade) AS unidades,
         ROW_NUMBER() OVER (PARTITION BY pr.categoria ORDER BY SUM(i.quantidade) DESC, pr.nome) AS posicao
  FROM itens i
  JOIN produtos pr ON pr.id = i.produto_id
  GROUP BY pr.id
)
SELECT categoria, nome, unidades
FROM vendas
WHERE posicao = 1
ORDER BY categoria;`)}

<h2>O último registro de cada um</h2>
<p>A mesma técnica responde "qual foi o último pedido de cada cliente?" e serve para <strong>remover duplicados</strong>: numere as cópias e fique só com a número 1.</p>
${codigo(`WITH ordenados AS (
  SELECT p.*, ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY data DESC) AS n
  FROM pedidos p
)
SELECT cliente_id, id AS ultimo_pedido, data, status
FROM ordenados
WHERE n = 1
ORDER BY cliente_id;`)}

<h2>Dividir em grupos iguais</h2>
<p><code>NTILE(4)</code> separa as linhas em 4 grupos do mesmo tamanho (quartis), útil para classificar clientes em "os 25% que mais compram", "os seguintes" e assim por diante.</p>
${codigo(`SELECT nome, preco, NTILE(4) OVER (ORDER BY preco DESC) AS quartil
FROM produtos;`)}
${dica('Sempre desempate o ORDER BY de um ROW_NUMBER com uma coluna única (o id ou o nome). Sem isso, a mesma consulta pode escolher linhas diferentes a cada execução quando há empate.')}
`,
              quiz: [
                {
                  pergunta: 'Com as notas 10, 9, 9, 8, qual sequência o DENSE_RANK dá?',
                  opcoes: ['1, 2, 3, 4', '1, 2, 2, 4', '1, 2, 2, 3'],
                  certa: 2,
                  explicacao: 'O RANK daria 1, 2, 2, 4; o ROW_NUMBER, 1, 2, 3, 4.'
                },
                {
                  pergunta: 'Por que o filtro posicao = 1 fica numa consulta de fora?',
                  opcoes: [
                    'Porque funções de janela são calculadas depois do WHERE',
                    'Por estilo',
                    'Porque o SQLite não tem WHERE'
                  ],
                  certa: 0,
                  explicacao: 'O WHERE roda antes das janelas; a CTE calcula primeiro e a consulta de fora filtra.'
                },
                {
                  pergunta: 'Como remover registros duplicados mantendo o mais recente?',
                  opcoes: [
                    'DISTINCT',
                    'ROW_NUMBER particionado pela chave, ordenado pela data DESC, e ficar com o 1',
                    'GROUP BY todas as colunas'
                  ],
                  certa: 1,
                  explicacao: 'DISTINCT só tira linhas idênticas em todas as colunas.'
                }
              ]
            },
            {
              id: 'desafio-evolucao-e-ranking',
              tipo: 'desafio',
              titulo: 'Desafio: relatório mensal',
              resumo: 'Evolução com LAG e os campeões de cada mês com ROW_NUMBER.',
              minutos: 22,
              enunciado: `
<p>Pedidos <strong>cancelados não contam</strong>. Escreva duas consultas, nesta ordem:</p>
<ol>
  <li><strong>Pedidos por mês</strong>: colunas <code>mes</code> (<code>AAAA-MM</code>), <code>pedidos</code> (quantos pedidos no mês), <code>anterior</code> (os pedidos do mês anterior) e <code>diferenca</code> (pedidos menos anterior), em ordem de mês.</li>
  <li><strong>O melhor cliente de cada mês</strong>: colunas <code>mes</code>, <code>nome</code> e <code>total</code> (soma de quantidade × preço daquele cliente no mês, 2 casas). Uma linha por mês, com o cliente que mais gastou nele; em caso de empate, o de menor nome. Ordem de mês.</li>
</ol>`,
              inicial: `-- 1. Pedidos por mês, com o mês anterior


-- 2. O melhor cliente de cada mês
`,
              testes: [
                [
                  '1ª consulta: mes, pedidos, anterior e diferenca',
                  mesmoResultado(
                    0,
                    "WITH m AS (SELECT strftime('%Y-%m', data) AS mes, COUNT(*) AS pedidos FROM pedidos WHERE status <> 'cancelado' GROUP BY mes) SELECT mes, pedidos, LAG(pedidos) OVER (ORDER BY mes) AS anterior, pedidos - LAG(pedidos) OVER (ORDER BY mes) AS diferenca FROM m ORDER BY mes",
                    'mes,pedidos,anterior,diferenca'
                  )
                ],
                [
                  '2ª consulta: mes, nome e total do cliente que mais gastou em cada mês',
                  mesmoResultado(
                    1,
                    "WITH t AS (SELECT strftime('%Y-%m', p.data) AS mes, c.nome, ROUND(SUM(i.quantidade * i.preco), 2) AS total FROM pedidos p JOIN clientes c ON c.id = p.cliente_id JOIN itens i ON i.pedido_id = p.id WHERE p.status <> 'cancelado' GROUP BY mes, c.id), r AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY mes ORDER BY total DESC, nome) AS n FROM t) SELECT mes, nome, total FROM r WHERE n = 1 ORDER BY mes",
                    'mes,nome,total'
                  )
                ]
              ],
              solucao: `-- 1. Pedidos por mês, com o mês anterior
WITH mensal AS (
  SELECT strftime('%Y-%m', data) AS mes, COUNT(*) AS pedidos
  FROM pedidos
  WHERE status <> 'cancelado'
  GROUP BY mes
)
SELECT mes, pedidos,
  LAG(pedidos) OVER (ORDER BY mes) AS anterior,
  pedidos - LAG(pedidos) OVER (ORDER BY mes) AS diferenca
FROM mensal
ORDER BY mes;

-- 2. O melhor cliente de cada mês
WITH gastos AS (
  SELECT strftime('%Y-%m', p.data) AS mes, c.nome,
         ROUND(SUM(i.quantidade * i.preco), 2) AS total
  FROM pedidos p
  JOIN clientes c ON c.id = p.cliente_id
  JOIN itens i    ON i.pedido_id = p.id
  WHERE p.status <> 'cancelado'
  GROUP BY mes, c.id
),
ranking AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY mes ORDER BY total DESC, nome) AS n
  FROM gastos
)
SELECT mes, nome, total
FROM ranking
WHERE n = 1
ORDER BY mes;`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Coortes, segmentação de clientes e checagem da qualidade dos dados.',
      modulos: [
        {
          titulo: 'Análises de cliente',
          itens: [
            {
              id: 'coortes-e-rfm',
              titulo: 'Coortes e segmentação RFM',
              resumo: 'Agrupar clientes pelo mês de entrada e classificar pelo comportamento.',
              minutos: 14,
              corpo: `
<h2>Coortes</h2>
<p>Uma <strong>coorte</strong> é um grupo de clientes que começou no mesmo período. Comparar coortes responde "os clientes que chegaram em agosto voltam mais do que os de julho?", o que um total geral esconde.</p>
${codigo(`WITH validos AS (
  SELECT * FROM pedidos WHERE status <> 'cancelado'
),
primeira AS (
  SELECT cliente_id, strftime('%Y-%m', MIN(data)) AS coorte
  FROM validos
  GROUP BY cliente_id
)
SELECT pr.coorte,
  COUNT(DISTINCT pr.cliente_id) AS clientes,
  COUNT(v.id) AS pedidos,
  ROUND(1.0 * COUNT(v.id) / COUNT(DISTINCT pr.cliente_id), 2) AS pedidos_por_cliente
FROM primeira pr
JOIN validos v ON v.cliente_id = pr.cliente_id
GROUP BY pr.coorte
ORDER BY pr.coorte;`)}
<p>A mesma estrutura, com uma coluna para "meses desde a primeira compra", vira a tabela de <strong>retenção</strong> que aparece em todo painel de assinatura.</p>

<h2>RFM</h2>
<p>RFM classifica clientes por três números: <strong>Recência</strong> (há quantos dias foi a última compra), <strong>Frequência</strong> (quantos pedidos) e <strong>Monetário</strong> (quanto gastou). Com eles, dá para separar quem está ativo, quem gasta muito e quem está sumindo.</p>
${codigo(`WITH base AS (
  SELECT c.nome,
    CAST(julianday('2026-10-31') - julianday(MAX(p.data)) AS INTEGER) AS recencia,
    COUNT(DISTINCT p.id) AS frequencia,
    ROUND(SUM(i.quantidade * i.preco), 2) AS monetario
  FROM clientes c
  JOIN pedidos p ON p.cliente_id = c.id AND p.status <> 'cancelado'
  JOIN itens i   ON i.pedido_id = p.id
  GROUP BY c.id
)
SELECT *,
  CASE
    WHEN recencia <= 30 AND frequencia >= 2 THEN 'fiel'
    WHEN recencia <= 30 THEN 'recente'
    WHEN monetario >= 200 THEN 'valioso, sumindo'
    ELSE 'a reativar'
  END AS segmento
FROM base
ORDER BY monetario DESC;`)}
${dica("Repare no <code>p.status &lt;&gt; 'cancelado'</code> dentro do ON. Ele filtra os pedidos antes de juntar. Num LEFT JOIN, essa diferença importa: no ON, o cliente sem pedido válido continua na lista (com NULL); no WHERE, ele some.")}
`,
              quiz: [
                {
                  pergunta: 'O que define a coorte de um cliente aqui?',
                  opcoes: ['O estado', 'O mês da primeira compra', 'O total gasto'],
                  certa: 1,
                  explicacao: 'Clientes que começaram no mesmo mês formam uma coorte.'
                },
                {
                  pergunta: 'O que significa o R do RFM?',
                  opcoes: ['Receita', 'Recência: há quanto tempo foi a última compra', 'Retorno'],
                  certa: 1,
                  explicacao: 'Recência, Frequência e Monetário.'
                },
                {
                  pergunta: 'Num LEFT JOIN, pôr a condição no ON em vez do WHERE:',
                  opcoes: [
                    'Dá sempre o mesmo resultado',
                    'Mantém as linhas da esquerda sem par, em vez de tirá-las',
                    'Dá erro'
                  ],
                  certa: 1,
                  explicacao: 'O WHERE roda depois da junção e descarta as linhas com NULL.'
                }
              ]
            },
            {
              id: 'qualidade-dos-dados',
              titulo: 'Qualidade dos dados',
              resumo: 'Achar órfãos, duplicados, valores impossíveis e conferir totais.',
              minutos: 12,
              corpo: `
<p>Uma análise é tão boa quanto os dados. Antes de mostrar um número, vale rodar algumas checagens. Todas seguem a mesma ideia: uma consulta que <strong>deveria voltar vazia</strong>. Se voltar algo, há um problema.</p>

<h2>Órfãos</h2>
<p>Linhas que apontam para algo que não existe (um item de um pedido apagado, um pedido de um cliente que não está na tabela):</p>
${codigo(`SELECT i.*
FROM itens i
LEFT JOIN pedidos p ON p.id = i.pedido_id
WHERE p.id IS NULL;`)}

<h2>Duplicados</h2>
${codigo(`-- O mesmo produto duas vezes no mesmo pedido?
SELECT pedido_id, produto_id, COUNT(*) AS vezes
FROM itens
GROUP BY pedido_id, produto_id
HAVING COUNT(*) > 1;`)}

<h2>Valores impossíveis e vazios</h2>
${codigo(`SELECT 'quantidade <= 0' AS problema, COUNT(*) AS linhas FROM itens WHERE quantidade <= 0
UNION ALL
SELECT 'preço negativo', COUNT(*) FROM produtos WHERE preco < 0
UNION ALL
SELECT 'cliente sem estado', COUNT(*) FROM clientes WHERE estado IS NULL OR TRIM(estado) = ''
UNION ALL
SELECT 'pedido no futuro', COUNT(*) FROM pedidos WHERE data > '2026-10-31';`)}

<h2>Conferir os totais</h2>
<p>A soma das partes tem que bater com o todo. Se o faturamento por categoria não somar o faturamento geral, algum JOIN está perdendo ou duplicando linhas:</p>
${codigo(`SELECT
  (SELECT ROUND(SUM(quantidade * preco), 2) FROM itens) AS total_geral,
  (SELECT ROUND(SUM(t), 2) FROM (
     SELECT SUM(i.quantidade * i.preco) AS t
     FROM itens i JOIN produtos pr ON pr.id = i.produto_id
     GROUP BY pr.categoria)) AS soma_das_categorias;`)}
${dica('Guarde essas checagens num arquivo e rode sempre que os dados forem atualizados. É o equivalente dos testes automáticos para quem trabalha com dados, e ferramentas como o dbt são construídas exatamente em cima dessa ideia.')}
`,
              quiz: [
                {
                  pergunta: 'Uma consulta de checagem de qualidade deveria devolver:',
                  opcoes: ['Muitas linhas', 'Nenhuma linha (ou zero)', 'Sempre uma linha'],
                  certa: 1,
                  explicacao: 'Cada linha devolvida é um problema encontrado.'
                },
                {
                  pergunta: 'Como achar itens cujo pedido não existe?',
                  opcoes: ['INNER JOIN pedidos', 'LEFT JOIN pedidos e WHERE p.id IS NULL', 'DISTINCT pedido_id'],
                  certa: 1,
                  explicacao: 'O LEFT JOIN mantém o item e deixa NULL quando não acha o pedido.'
                },
                {
                  pergunta: 'A soma por categoria deu mais que o total geral. Qual a suspeita?',
                  opcoes: ['Arredondamento', 'Um JOIN duplicando linhas', 'Falta de índice'],
                  certa: 1,
                  explicacao: 'Juntar com uma tabela que tem várias linhas por chave multiplica os valores.'
                }
              ]
            },
            {
              id: 'desafio-segmentacao',
              tipo: 'desafio',
              titulo: 'Desafio: segmentar os clientes',
              resumo: 'Monte a base RFM, classifique e confira a qualidade.',
              minutos: 25,
              enunciado: `
<p>Considere <strong>hoje = 2026-10-31</strong> e só pedidos <strong>não cancelados</strong>. Escreva duas consultas, nesta ordem:</p>
<ol>
  <li><strong>Segmentos</strong>: para <strong>todos</strong> os clientes (inclusive quem nunca comprou), as colunas <code>nome</code>, <code>pedidos</code> (0 para quem não comprou), <code>gasto</code> (soma de quantidade × preço, 2 casas, 0 para quem não comprou) e <code>segmento</code>:
    <ul>
      <li><code>'novo'</code> se não tem pedidos;</li>
      <li><code>'vip'</code> se gastou 300 ou mais;</li>
      <li><code>'ativo'</code> se o último pedido foi há 30 dias ou menos;</li>
      <li><code>'inativo'</code> nos outros casos.</li>
    </ul>
    As regras valem nessa ordem (a primeira que bater). Ordene por <code>gasto</code> do maior para o menor e, nos empates, por nome.</li>
  <li><strong>Resumo</strong>: colunas <code>segmento</code> e <code>clientes</code>, com quantos clientes há em cada segmento, em ordem alfabética de segmento.</li>
</ol>`,
              inicial: `-- 1. Segmento de cada cliente


-- 2. Quantos clientes por segmento
`,
              testes: [
                [
                  '1ª consulta: nome, pedidos, gasto e segmento de todos os clientes',
                  mesmoResultado(
                    0,
                    "WITH v AS (SELECT p.id, p.cliente_id, p.data, SUM(i.quantidade * i.preco) AS valor FROM pedidos p JOIN itens i ON i.pedido_id = p.id WHERE p.status <> 'cancelado' GROUP BY p.id), b AS (SELECT c.nome, COUNT(v.id) AS pedidos, ROUND(COALESCE(SUM(v.valor), 0), 2) AS gasto, julianday('2026-10-31') - julianday(MAX(v.data)) AS dias FROM clientes c LEFT JOIN v ON v.cliente_id = c.id GROUP BY c.id) SELECT nome, pedidos, gasto, CASE WHEN pedidos = 0 THEN 'novo' WHEN gasto >= 300 THEN 'vip' WHEN dias <= 30 THEN 'ativo' ELSE 'inativo' END AS segmento FROM b ORDER BY gasto DESC, nome",
                    'nome,pedidos,gasto,segmento'
                  )
                ],
                [
                  '2ª consulta: segmento e quantidade de clientes',
                  mesmoResultado(
                    1,
                    "WITH v AS (SELECT p.id, p.cliente_id, p.data, SUM(i.quantidade * i.preco) AS valor FROM pedidos p JOIN itens i ON i.pedido_id = p.id WHERE p.status <> 'cancelado' GROUP BY p.id), b AS (SELECT c.nome, COUNT(v.id) AS pedidos, ROUND(COALESCE(SUM(v.valor), 0), 2) AS gasto, julianday('2026-10-31') - julianday(MAX(v.data)) AS dias FROM clientes c LEFT JOIN v ON v.cliente_id = c.id GROUP BY c.id), s AS (SELECT CASE WHEN pedidos = 0 THEN 'novo' WHEN gasto >= 300 THEN 'vip' WHEN dias <= 30 THEN 'ativo' ELSE 'inativo' END AS segmento FROM b) SELECT segmento, COUNT(*) AS clientes FROM s GROUP BY segmento ORDER BY segmento",
                    'segmento,clientes'
                  )
                ]
              ],
              solucao: `-- 1. Segmento de cada cliente
WITH valor_do_pedido AS (
  SELECT p.id, p.cliente_id, p.data, SUM(i.quantidade * i.preco) AS valor
  FROM pedidos p
  JOIN itens i ON i.pedido_id = p.id
  WHERE p.status <> 'cancelado'
  GROUP BY p.id
),
base AS (
  SELECT c.nome,
    COUNT(v.id) AS pedidos,
    ROUND(COALESCE(SUM(v.valor), 0), 2) AS gasto,
    julianday('2026-10-31') - julianday(MAX(v.data)) AS dias
  FROM clientes c
  LEFT JOIN valor_do_pedido v ON v.cliente_id = c.id
  GROUP BY c.id
)
SELECT nome, pedidos, gasto,
  CASE
    WHEN pedidos = 0 THEN 'novo'
    WHEN gasto >= 300 THEN 'vip'
    WHEN dias <= 30 THEN 'ativo'
    ELSE 'inativo'
  END AS segmento
FROM base
ORDER BY gasto DESC, nome;

-- 2. Quantos clientes por segmento
WITH valor_do_pedido AS (
  SELECT p.id, p.cliente_id, p.data, SUM(i.quantidade * i.preco) AS valor
  FROM pedidos p
  JOIN itens i ON i.pedido_id = p.id
  WHERE p.status <> 'cancelado'
  GROUP BY p.id
),
base AS (
  SELECT COUNT(v.id) AS pedidos,
    ROUND(COALESCE(SUM(v.valor), 0), 2) AS gasto,
    julianday('2026-10-31') - julianday(MAX(v.data)) AS dias
  FROM clientes c
  LEFT JOIN valor_do_pedido v ON v.cliente_id = c.id
  GROUP BY c.id
)
SELECT
  CASE
    WHEN pedidos = 0 THEN 'novo'
    WHEN gasto >= 300 THEN 'vip'
    WHEN dias <= 30 THEN 'ativo'
    ELSE 'inativo'
  END AS segmento,
  COUNT(*) AS clientes
FROM base
GROUP BY segmento
ORDER BY segmento;`
            }
          ]
        }
      ]
    }
  ]
};
