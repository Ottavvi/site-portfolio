// Trilha de DAX. Sem editor: as medidas são para criar no Power BI Desktop. As práticas usam o modelo da trilha de
// Power BI (fVendas, dProduto, dCalendario), com as 8 vendas de exemplo de julho a outubro de 2026, para que as
// respostas tragam números conferíveis. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta, tabela } = require('./ajuda');

const MODELO = `<p>As práticas desta trilha usam o modelo montado na trilha de Power BI: <code>fVendas</code> (Data, Vendedor, Código, Valor, Custo), <code>dProduto</code> (Código, Produto, Categoria) e <code>dCalendario</code>, relacionadas no formato estrela. As vendas são estas:</p>
${tabela(
  ['Data', 'Vendedor', 'Categoria', 'Valor'],
  [
    ['05/07/2026', 'Ana', 'Mercearia', '188,70'],
    ['18/07/2026', 'Bruno', 'Utensílios', '149,00'],
    ['02/08/2026', 'Ana', 'Mercearia', '99,00'],
    ['20/08/2026', 'Carla', 'Casa', '138,00'],
    ['03/09/2026', 'Bruno', 'Mercearia', '125,80'],
    ['15/09/2026', 'Ana', 'Utensílios', '298,00'],
    ['10/10/2026', 'Carla', 'Mercearia', '62,90'],
    ['22/10/2026', 'Ana', 'Casa', '69,00']
  ]
)}`;

module.exports = {
  id: 'dax',
  area: 'Dados e BI',
  titulo: 'DAX',
  sigla: 'DAX',
  resumo: 'A linguagem das medidas do Power BI: contexto de filtro, CALCULATE e inteligência de tempo.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Medidas, colunas calculadas e o contexto de filtro.',
      modulos: [
        {
          titulo: 'Primeiras medidas',
          itens: [
            {
              id: 'medidas-e-colunas',
              titulo: 'Medidas e colunas calculadas',
              resumo: 'A diferença que mais confunde no começo, e as funções básicas.',
              minutos: 11,
              corpo: `
<p><strong>DAX</strong> (Data Analysis Expressions) é a linguagem de fórmulas do Power BI, do Power Pivot no Excel e do Analysis Services. As funções lembram as do Excel, mas a lógica é outra: em vez de células, o DAX trabalha com <strong>tabelas e colunas</strong>, e o resultado depende dos filtros de cada ponto do relatório.</p>

<h2>Coluna calculada</h2>
<p>É calculada <strong>uma vez por linha</strong>, quando os dados são atualizados, e fica guardada no modelo, como uma coluna qualquer:</p>
${trecho(`Lucro = fVendas[Valor] - fVendas[Custo]
Faixa = IF(fVendas[Valor] >= 200, "Grande", "Normal")`)}
<p>Use quando precisar do valor <strong>por linha</strong> para filtrar, agrupar ou relacionar: faixas, classificações, chaves.</p>

<h2>Medida</h2>
<p>É calculada <strong>na hora</strong>, para cada célula de cada visual, respeitando os filtros daquele ponto. Não ocupa espaço no modelo:</p>
${trecho(`Faturamento = SUM(fVendas[Valor])
Vendas = COUNTROWS(fVendas)
Ticket médio = DIVIDE([Faturamento], [Vendas])
Margem % = DIVIDE([Faturamento] - SUM(fVendas[Custo]), [Faturamento])`)}
<p>Use para tudo o que é um <strong>número de resultado</strong>: totais, médias, percentuais, comparações. Regra prática: na dúvida, é medida.</p>
${dica('Para ler fácil: referencie colunas sempre com a tabela (<code>fVendas[Valor]</code>) e medidas sempre sem (<code>[Faturamento]</code>). Assim, só de olhar, você sabe o que é cada coisa.')}

<h2>Funções básicas</h2>
<ul>
  <li><code>SUM</code>, <code>AVERAGE</code>, <code>MIN</code>, <code>MAX</code> de uma coluna.</li>
  <li><code>COUNTROWS(tabela)</code> conta linhas; <code>DISTINCTCOUNT(coluna)</code> conta valores diferentes (clientes únicos).</li>
  <li><code>DIVIDE(a, b, [alternativo])</code> divide sem erro quando <code>b</code> é zero ou vazio.</li>
  <li><code>IF</code>, <code>SWITCH</code>, <code>AND</code> (ou <code>&amp;&amp;</code>), <code>OR</code> (ou <code>||</code>), <code>BLANK()</code>.</li>
  <li><code>FORMAT(valor, "0.0%")</code> transforma em texto formatado (só para títulos e rótulos: o resultado deixa de ser número).</li>
</ul>
${dica('O Power BI usa vírgula para separar argumentos e ponto nos decimais, mesmo em português: <code>DIVIDE([A], 2.5)</code>. Em Opções, Configurações regionais, dá para trocar para ponto e vírgula, mas os exemplos da internet quase todos usam vírgula.')}
`,
              quiz: [
                {
                  pergunta: 'Faturamento total, que muda conforme os filtros do relatório, deve ser:',
                  opcoes: ['Coluna calculada', 'Medida', 'Tanto faz'],
                  certa: 1,
                  explicacao: 'Medidas são calculadas na hora, para cada combinação de filtros.'
                },
                {
                  pergunta: 'Uma classificação "Grande/Normal" para usar como filtro em cada venda deve ser:',
                  opcoes: ['Coluna calculada', 'Medida', 'Uma tabela nova'],
                  certa: 0,
                  explicacao: 'Para filtrar e agrupar, o valor precisa existir em cada linha.'
                },
                {
                  pergunta: 'O que COUNTROWS(fVendas) conta?',
                  opcoes: ['Colunas', 'Linhas da tabela, respeitando os filtros', 'Valores diferentes'],
                  certa: 1,
                  explicacao: 'Para valores diferentes, use DISTINCTCOUNT.'
                }
              ]
            },
            {
              id: 'contexto-de-filtro',
              titulo: 'O contexto de filtro',
              resumo: 'Por que a mesma medida dá um número diferente em cada célula.',
              minutos: 11,
              corpo: `
<p>A ideia central do DAX: <strong>uma medida não sabe "onde está"</strong>. Quem diz é o <strong>contexto de filtro</strong>, o conjunto de filtros ativos naquela célula: as linhas e colunas da matriz, as segmentações, os filtros da página, o clique em outro visual.</p>
<p>Imagine a medida <code>Faturamento = SUM(fVendas[Valor])</code> numa matriz com Categoria nas linhas e Mês nas colunas. Na célula "Mercearia × Agosto", o Power BI:</p>
<ol>
  <li>filtra <code>dProduto</code> para Categoria = Mercearia e <code>dCalendario</code> para Mês = agosto;</li>
  <li>os relacionamentos levam esses filtros até <code>fVendas</code>, que fica só com as vendas de mercearia em agosto;</li>
  <li>a medida soma o Valor dessas linhas.</li>
</ol>
<p>A linha de <strong>total</strong> não é a soma das células acima: é a mesma medida calculada com menos filtros. Para somas tanto faz, mas para médias, contagens distintas e percentuais o total é diferente da soma das linhas, e está certo assim.</p>
${tabela(
  ['Categoria', 'Faturamento', 'Vendas', 'Ticket médio'],
  [
    ['Casa', '207,00', '2', '103,50'],
    ['Mercearia', '476,40', '4', '119,10'],
    ['Utensílios', '447,00', '2', '223,50'],
    ['<strong>Total</strong>', '<strong>1.130,40</strong>', '<strong>8</strong>', '<strong>141,30</strong>']
  ]
)}
<p>Repare: o ticket médio total (141,30) não é a soma nem a média dos tickets de cada categoria. É o faturamento total dividido pelo total de vendas.</p>

<h2>Por que o modelo estrela importa</h2>
<p>Os filtros andam pelos relacionamentos, do lado "1" para o lado "muitos". Por isso, os campos que vão nos eixos e segmentações devem vir das <strong>dimensões</strong>: Categoria de <code>dProduto</code>, Mês de <code>dCalendario</code>. Um filtro aplicado numa coluna da fato não chega às outras tabelas.</p>
${dica('Quando uma medida dá o mesmo número em todas as linhas de um visual, o filtro daquele eixo não está chegando na tabela da medida: confira se há relacionamento e se a direção está certa.')}
`,
              quiz: [
                {
                  pergunta: 'O que decide o valor de uma medida numa célula da matriz?',
                  opcoes: ['A fórmula sozinha', 'O contexto de filtro daquela célula', 'A ordem das linhas'],
                  certa: 1,
                  explicacao: 'A mesma fórmula, com filtros diferentes, dá resultados diferentes.'
                },
                {
                  pergunta: 'O total de uma coluna de Ticket médio é:',
                  opcoes: [
                    'A soma dos tickets das linhas',
                    'A média dos tickets das linhas',
                    'A medida calculada sem o filtro da linha: faturamento total ÷ vendas totais'
                  ],
                  certa: 2,
                  explicacao: 'O total é sempre a medida recalculada com menos filtros.'
                },
                {
                  pergunta: 'Uma medida mostra o mesmo número em todas as categorias. Causa provável?',
                  opcoes: [
                    'Erro do Power BI',
                    'O filtro da categoria não chega na tabela da medida (falta relacionamento)',
                    'Falta formatar'
                  ],
                  certa: 1,
                  explicacao: 'Sem um caminho de relacionamento, o filtro não alcança a tabela somada.'
                }
              ]
            },
            {
              id: 'pratica-medidas',
              titulo: 'Prática: as medidas básicas',
              resumo: 'Crie as medidas de um painel de vendas e confira os números.',
              minutos: 20,
              corpo: `
${MODELO}
<h2>Tarefas</h2>
<ol>
  <li>Crie as medidas <strong>Faturamento</strong>, <strong>Vendas</strong> (quantidade), <strong>Ticket médio</strong> e <strong>Maior venda</strong>.</li>
  <li>Crie a medida <strong>Vendedores ativos</strong>: quantos vendedores diferentes venderam.</li>
  <li>Crie a coluna calculada <strong>Faixa</strong> em fVendas: "Grande" a partir de R$ 200, "Média" a partir de R$ 100 e "Pequena" abaixo disso. Use SWITCH.</li>
  <li>Monte uma matriz com Vendedor nas linhas e as medidas nas colunas. Quanto dá o Ticket médio da Ana? E o total de Vendedores ativos, se é 3 e em cada linha é 1?</li>
</ol>
${resposta(`
${trecho(`Faturamento = SUM(fVendas[Valor])                       // 1.130,40
Vendas = COUNTROWS(fVendas)                             // 8
Ticket médio = DIVIDE([Faturamento], [Vendas])          // 141,30
Maior venda = MAX(fVendas[Valor])                       // 298,00
Vendedores ativos = DISTINCTCOUNT(fVendas[Vendedor])    // 3

Faixa =
SWITCH(
    TRUE(),
    fVendas[Valor] >= 200, "Grande",
    fVendas[Valor] >= 100, "Média",
    "Pequena"
)`)}
<p>O <code>SWITCH(TRUE(), ...)</code> testa as condições em ordem e devolve a primeira verdadeira, como o SES do Excel. Resultado: 1 Grande (298,00), 4 Médias (188,70 · 149,00 · 138,00 · 125,80) e 3 Pequenas.</p>
<p>Ana: 4 vendas, R$ 654,70, ticket de <strong>R$ 163,68</strong>. Vendedores ativos dá 1 em cada linha (cada linha filtra um vendedor) e 3 no total: é o contexto de filtro em ação.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que SWITCH(TRUE(), ...) e não SWITCH(fVendas[Valor], ...)?',
                  opcoes: [
                    'É mais rápido',
                    'Com TRUE(), cada condição é testada em ordem, permitindo faixas com >=',
                    'Não há diferença'
                  ],
                  certa: 1,
                  explicacao:
                    'SWITCH com um valor compara igualdade; com TRUE(), procura a primeira condição verdadeira.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'CALCULATE e a inteligência de tempo.',
      modulos: [
        {
          titulo: 'CALCULATE e tempo',
          itens: [
            {
              id: 'calculate',
              titulo: 'CALCULATE',
              resumo: 'Mudar o contexto de filtro: a função mais importante do DAX.',
              minutos: 14,
              corpo: `
<p><code>CALCULATE(expressão, filtro1, filtro2, ...)</code> calcula a expressão num contexto de filtro <strong>modificado</strong>: ela acrescenta, troca ou remove filtros antes de calcular. Quase toda medida interessante passa por ela.</p>

<h2>Acrescentar ou trocar um filtro</h2>
${trecho(`Faturamento Mercearia = CALCULATE([Faturamento], dProduto[Categoria] = "Mercearia")
Faturamento Ana em Mercearia = CALCULATE([Faturamento], dProduto[Categoria] = "Mercearia", fVendas[Vendedor] = "Ana")
Vendas grandes = CALCULATE([Vendas], fVendas[Valor] >= 200)`)}
<p>Um filtro em CALCULATE sobre uma coluna <strong>substitui</strong> o filtro que já existia naquela coluna. Numa matriz por categoria, "Faturamento Mercearia" mostra 476,40 em todas as linhas, inclusive em Casa: o filtro de Casa foi trocado pelo de Mercearia. Para <em>acrescentar</em> em vez de trocar, envolva o filtro em <code>KEEPFILTERS</code>: aí, na linha Casa, o resultado fica vazio.</p>

<h2>Remover filtros: percentual do total</h2>
<p><code>REMOVEFILTERS</code> (ou o antigo <code>ALL</code>) tira os filtros de uma tabela ou coluna. É assim que se calcula "quanto esta linha representa do total":</p>
${trecho(`Faturamento todas as categorias = CALCULATE([Faturamento], REMOVEFILTERS(dProduto))
% do total = DIVIDE([Faturamento], [Faturamento todas as categorias])

// Remove todos os filtros de dProduto, menos o de Categoria
Faturamento da categoria = CALCULATE([Faturamento], ALLEXCEPT(dProduto, dProduto[Categoria]))`)}
<p>Na linha Mercearia, o numerador é 476,40 e o denominador ignora a categoria: 1.130,40. Resultado: 42,1%. Repare que o filtro de data (se houver uma segmentação) continua valendo nos dois: o percentual é "da categoria no período escolhido".</p>

<h2>Filtros com tabela</h2>
<p>Quando a condição envolve uma medida, o filtro precisa ser uma tabela, criada com <code>FILTER</code>:</p>
${trecho(`Faturamento dos produtos campeões =
CALCULATE(
    [Faturamento],
    FILTER(VALUES(dProduto[Produto]), [Faturamento] > 200)
)`)}
${dica('Prefira filtros simples em colunas (<code>dProduto[Categoria] = "Mercearia"</code>) a <code>FILTER(dProduto, ...)</code> sobre a tabela inteira: são mais rápidos e fazem exatamente o que parecem.')}
`,
              quiz: [
                {
                  pergunta: 'O que CALCULATE faz?',
                  opcoes: [
                    'Soma uma coluna',
                    'Calcula uma expressão com o contexto de filtro modificado',
                    'Cria uma coluna'
                  ],
                  certa: 1,
                  explicacao: 'Ela acrescenta, troca ou remove filtros e então avalia a expressão.'
                },
                {
                  pergunta:
                    'Numa matriz por categoria, o que CALCULATE([Faturamento], dProduto[Categoria] = "Mercearia") mostra na linha Casa?',
                  opcoes: ['Vazio', 'O faturamento de Mercearia (o filtro foi trocado)', 'O faturamento de Casa'],
                  certa: 1,
                  explicacao: 'O filtro da coluna Categoria é substituído. Com KEEPFILTERS, daria vazio.'
                },
                {
                  pergunta: 'Qual o denominador de um "% do total" por categoria?',
                  opcoes: [
                    '[Faturamento]',
                    'CALCULATE([Faturamento], REMOVEFILTERS(dProduto))',
                    'SUM(dProduto[Categoria])'
                  ],
                  certa: 1,
                  explicacao: 'O mesmo faturamento, mas sem o filtro de produto da linha.'
                }
              ]
            },
            {
              id: 'inteligencia-de-tempo',
              titulo: 'Inteligência de tempo',
              resumo: 'Acumulado no ano, mês anterior, mesmo período do ano passado e variação.',
              minutos: 13,
              corpo: `
<p>As perguntas mais comuns de qualquer relatório são sobre tempo: quanto no acumulado do ano? E no mês passado? Cresceu em relação ao ano anterior? O DAX tem funções prontas para isso, as de <strong>inteligência de tempo</strong>. Elas exigem uma <strong>tabela calendário</strong> marcada como tabela de datas, com todos os dias, relacionada com a fato (veja a trilha de Power BI).</p>

<h2>As medidas de sempre</h2>
${trecho(`Faturamento acumulado no ano = TOTALYTD([Faturamento], dCalendario[Date])

Faturamento mês anterior =
CALCULATE([Faturamento], DATEADD(dCalendario[Date], -1, MONTH))

Faturamento ano anterior =
CALCULATE([Faturamento], SAMEPERIODLASTYEAR(dCalendario[Date]))

Variação mensal % =
DIVIDE([Faturamento] - [Faturamento mês anterior], [Faturamento mês anterior])

Crescimento anual % =
DIVIDE([Faturamento] - [Faturamento ano anterior], [Faturamento ano anterior])`)}
<p>Todas funcionam do mesmo jeito: pegam as datas que estão no filtro atual (agosto de 2026, por exemplo) e as deslocam (julho de 2026, agosto de 2025) antes de calcular. Por isso dependem do contexto: num visual por mês, o "mês anterior" de cada linha é o anterior àquele mês.</p>
<ul>
  <li><code>TOTALYTD</code>, <code>TOTALQTD</code>, <code>TOTALMTD</code>: acumulado no ano, trimestre e mês. Para ano fiscal, TOTALYTD aceita o último dia do ano: <code>TOTALYTD([Faturamento], dCalendario[Date], "30/6")</code>.</li>
  <li><code>DATEADD(datas, -1, MONTH)</code>: desloca por dias, meses, trimestres ou anos.</li>
  <li><code>DATESINPERIOD(dCalendario[Date], MAX(dCalendario[Date]), -12, MONTH)</code>: os últimos 12 meses, para médias móveis.</li>
</ul>
${dica('Num gráfico por mês, o mês atual ainda incompleto distorce a comparação ("caímos 70%!"). Compare períodos completos, ou meça o mesmo número de dias do mês anterior.')}

<h2>Médias móveis</h2>
${trecho(`// Soma dos últimos 3 meses (contando a partir do último dia do contexto) dividida por 3
Média móvel 3 meses =
DIVIDE(
    CALCULATE([Faturamento], DATESINPERIOD(dCalendario[Date], MAX(dCalendario[Date]), -3, MONTH)),
    3
)`)}
`,
              quiz: [
                {
                  pergunta: 'O que as funções de inteligência de tempo exigem?',
                  opcoes: [
                    'Nada',
                    'Uma tabela calendário completa, marcada como tabela de datas e relacionada',
                    'Que a data esteja em texto'
                  ],
                  certa: 1,
                  explicacao: 'Sem todos os dias contínuos, os deslocamentos dão resultados errados.'
                },
                {
                  pergunta: 'Qual função calcula o acumulado no ano?',
                  opcoes: ['SAMEPERIODLASTYEAR', 'TOTALYTD', 'DATEADD'],
                  certa: 1,
                  explicacao: 'YTD: year to date, do início do ano até a data do contexto.'
                },
                {
                  pergunta: 'Num visual por mês, o que DATEADD(dCalendario[Date], -1, MONTH) faz na linha de setembro?',
                  opcoes: ['Pega setembro', 'Pega as datas de agosto', 'Pega o ano inteiro'],
                  certa: 1,
                  explicacao: 'Ela desloca as datas do contexto atual em um mês para trás.'
                }
              ]
            },
            {
              id: 'pratica-calculate',
              titulo: 'Prática: participação e evolução',
              resumo: 'Percentual do total, mês anterior e acumulado no ano.',
              minutos: 25,
              corpo: `
${MODELO}
<h2>Tarefas</h2>
<ol>
  <li>Crie <strong>% do total</strong> e monte uma tabela por Categoria. Quanto cada categoria representa?</li>
  <li>Crie <strong>Faturamento Mercearia</strong> e coloque na mesma tabela. Por que aparece 476,40 em todas as linhas? Ajuste para aparecer só na linha de Mercearia.</li>
  <li>Num visual por mês (Ano-Mês do calendário), crie <strong>Faturamento mês anterior</strong> e <strong>Variação mensal %</strong>. Qual a variação de agosto?</li>
  <li>Crie <strong>Acumulado no ano</strong>. Quanto mostra em setembro?</li>
</ol>
${resposta(`
${trecho(`% do total = DIVIDE([Faturamento], CALCULATE([Faturamento], REMOVEFILTERS(dProduto)))
    // Mercearia 42,1% · Utensílios 39,5% · Casa 18,3%

Faturamento Mercearia = CALCULATE([Faturamento], KEEPFILTERS(dProduto[Categoria] = "Mercearia"))

Faturamento mês anterior = CALCULATE([Faturamento], DATEADD(dCalendario[Date], -1, MONTH))
Variação mensal % = DIVIDE([Faturamento] - [Faturamento mês anterior], [Faturamento mês anterior])

Acumulado no ano = TOTALYTD([Faturamento], dCalendario[Date])`)}
<ul>
  <li>Sem o <code>KEEPFILTERS</code>, o filtro de Categoria do CALCULATE <strong>substitui</strong> o da linha, por isso 476,40 aparecia em todas. Com ele, os filtros se combinam e só a linha Mercearia tem valor.</li>
  <li>Agosto: 237,00 contra 337,70 em julho, variação de <strong>-29,8%</strong>. Julho não tem mês anterior com vendas, então a variação fica vazia (o DIVIDE devolve vazio em vez de erro).</li>
  <li>Acumulado em setembro: 337,70 + 237,00 + 423,80 = <strong>R$ 998,50</strong>. Em outubro: R$ 1.130,40.</li>
</ul>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que a variação de julho fica vazia?',
                  opcoes: [
                    'Erro na medida',
                    'Não há faturamento em junho: o DIVIDE por vazio devolve vazio',
                    'Julho não está no calendário'
                  ],
                  certa: 1,
                  explicacao: 'É o comportamento desejado: sem base de comparação, sem variação.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Iteradores, variáveis, ranking e o contexto de linha.',
      modulos: [
        {
          titulo: 'Iteradores e contextos',
          itens: [
            {
              id: 'iteradores-e-variaveis',
              titulo: 'Iteradores, variáveis e ranking',
              resumo: 'SUMX, AVERAGEX, VAR/RETURN e RANKX.',
              minutos: 13,
              corpo: `
<h2>Iteradores: as funções com X</h2>
<p><code>SUM(coluna)</code> soma uma coluna que já existe. Quando o valor a somar precisa ser calculado linha a linha, use o <strong>iterador</strong> <code>SUMX(tabela, expressão)</code>: ele percorre cada linha da tabela, calcula a expressão e soma os resultados. Sem criar coluna nenhuma:</p>
${trecho(`Faturamento calculado = SUMX(fItens, fItens[Quantidade] * fItens[Preço unitário])
Faturamento com preço de tabela = SUMX(fItens, fItens[Quantidade] * RELATED(dProduto[Preço]))`)}
<p><code>RELATED</code> busca o valor na tabela do lado "1" do relacionamento, para a linha atual: é o PROCX do DAX. A família inclui <code>AVERAGEX</code>, <code>MINX</code>, <code>MAXX</code>, <code>COUNTX</code> e <code>CONCATENATEX</code>.</p>

<h2>Iterar sobre uma dimensão</h2>
<p>Iterar sobre os valores de uma dimensão responde perguntas "por grupo":</p>
${trecho(`Média mensal = AVERAGEX(VALUES(dCalendario[Ano-Mês]), [Faturamento])
Melhor mês = MAXX(VALUES(dCalendario[Ano-Mês]), [Faturamento])
Produtos vendidos = CONCATENATEX(VALUES(dProduto[Produto]), dProduto[Produto], ", ")`)}
<p>Meses sem venda dão <code>[Faturamento]</code> vazio, e o AVERAGEX ignora os vazios: a média é dos meses que tiveram vendas.</p>

<h2>Variáveis</h2>
<p><code>VAR</code> guarda um valor e <code>RETURN</code> diz o resultado. A medida fica legível, cada parte é calculada uma vez só, e dá para depurar devolvendo uma variável no lugar do resultado:</p>
${trecho(`Crescimento anual % =
VAR Atual = [Faturamento]
VAR Anterior = CALCULATE([Faturamento], SAMEPERIODLASTYEAR(dCalendario[Date]))
RETURN
    IF(NOT ISBLANK(Anterior), DIVIDE(Atual - Anterior, Anterior))`)}
${dica('Uma variável é calculada no contexto onde foi declarada e não muda depois. Um CALCULATE em volta de uma variável não altera o valor dela, o que surpreende muita gente.')}

<h2>Ranking</h2>
${trecho(`Posição do vendedor =
RANKX(ALL(fVendas[Vendedor]), [Faturamento], , DESC, DENSE)`)}
<p>O <code>ALL</code> é essencial: sem ele, a lista de vendedores para comparar seria só o da linha atual, e todos ficariam em 1º. <code>DENSE</code> não pula posições em empates (1, 2, 2, 3).</p>
`,
              quiz: [
                {
                  pergunta: 'Quando usar SUMX em vez de SUM?',
                  opcoes: [
                    'Sempre',
                    'Quando o valor a somar precisa ser calculado em cada linha (quantidade × preço)',
                    'Para somar textos'
                  ],
                  certa: 1,
                  explicacao: 'SUMX itera a tabela, calcula a expressão e soma, sem coluna nova.'
                },
                {
                  pergunta: 'Por que RANKX(ALL(fVendas[Vendedor]), ...) e não RANKX(VALUES(...))?',
                  opcoes: [
                    'É mais rápido',
                    'Sem ALL, cada linha compara o vendedor só com ele mesmo e todos ficam em 1º',
                    'Não há diferença'
                  ],
                  certa: 1,
                  explicacao: 'ALL tira o filtro da linha para que todos os vendedores entrem na comparação.'
                },
                {
                  pergunta: 'O que RELATED faz?',
                  opcoes: [
                    'Cria um relacionamento',
                    'Busca um valor na tabela do lado "1" para a linha atual',
                    'Remove filtros'
                  ],
                  certa: 1,
                  explicacao: 'Só funciona onde há uma linha atual (colunas calculadas e iteradores).'
                }
              ]
            },
            {
              id: 'contexto-de-linha',
              titulo: 'Contexto de linha e transição de contexto',
              resumo: 'Os dois contextos do DAX, a transição e relacionamentos inativos.',
              minutos: 14,
              corpo: `
<p>O DAX tem dois contextos, e entender a diferença resolve a maior parte das dúvidas avançadas:</p>
<ul>
  <li><strong>Contexto de filtro</strong>: os filtros ativos (vistos no nível iniciante). Ele <em>filtra</em> tabelas.</li>
  <li><strong>Contexto de linha</strong>: "estou nesta linha agora". Existe nas colunas calculadas e dentro dos iteradores (SUMX, FILTER...). Ele permite ler <code>fVendas[Valor]</code> da linha atual, mas <strong>não filtra nada</strong>.</li>
</ul>

<h2>A armadilha</h2>
<p>Numa coluna calculada em <code>dProduto</code>, o que você espera desta fórmula?</p>
${trecho(`Vendas do produto (errado) = SUM(fVendas[Valor])`)}
<p>Ela mostra o <strong>total geral</strong> em todas as linhas: o contexto de linha (o produto atual) não vira filtro sozinho. Para filtrar, é preciso a <strong>transição de contexto</strong>, que o CALCULATE faz: ele transforma a linha atual em filtro.</p>
${trecho(`Vendas do produto = CALCULATE(SUM(fVendas[Valor]))   // agora filtra pelo produto da linha
Vendas do produto = [Faturamento]                       // igual: toda medida tem um CALCULATE invisível`)}
<p>Esse CALCULATE invisível em toda medida explica por que <code>AVERAGEX(VALUES(dCalendario[Ano-Mês]), [Faturamento])</code> funciona: para cada mês da iteração, a medida vira filtro daquele mês.</p>
${dica('Transição de contexto numa tabela grande (iterar milhões de linhas da fato chamando uma medida) é cara: cada linha vira um filtro. Itere sobre dimensões ou valores distintos, não sobre a fato inteira, quando der.')}

<h2>Relacionamentos inativos</h2>
<p>Uma venda tem data do pedido e data de entrega, as duas ligadas ao calendário. Só um relacionamento pode estar ativo; o outro fica pontilhado. <code>USERELATIONSHIP</code> ativa o outro dentro de uma medida:</p>
${trecho(`Faturamento por entrega =
CALCULATE([Faturamento], USERELATIONSHIP(fVendas[Data de entrega], dCalendario[Date]))`)}

<h2>Onde aprender mais</h2>
<p>O site <strong>dax.guide</strong> documenta cada função com exemplos, e o livro e os artigos de Marco Russo e Alberto Ferrari (sqlbi.com) são a referência sobre contextos. O <strong>DAX Studio</strong> deixa rodar consultas e ver o plano de execução.</p>
`,
              quiz: [
                {
                  pergunta: 'Numa coluna calculada de dProduto, SUM(fVendas[Valor]) mostra:',
                  opcoes: ['As vendas de cada produto', 'O total geral em todas as linhas', 'Um erro'],
                  certa: 1,
                  explicacao: 'O contexto de linha não filtra. É preciso CALCULATE para a transição de contexto.'
                },
                {
                  pergunta: 'O que a transição de contexto faz?',
                  opcoes: [
                    'Muda de página',
                    'Transforma a linha atual de um contexto de linha em filtro',
                    'Remove todos os filtros'
                  ],
                  certa: 1,
                  explicacao: 'É feita pelo CALCULATE, inclusive o invisível que toda medida tem.'
                },
                {
                  pergunta: 'Para calcular pelo segundo relacionamento (inativo) com o calendário, usa-se:',
                  opcoes: ['RELATED', 'USERELATIONSHIP dentro de CALCULATE', 'Criar outra tabela de fatos'],
                  certa: 1,
                  explicacao: 'Ele ativa o relacionamento só durante aquele cálculo.'
                }
              ]
            },
            {
              id: 'pratica-avancada',
              titulo: 'Prática: ranking e médias',
              resumo: 'RANKX, AVERAGEX, VAR e uma medida de destaque para o relatório.',
              minutos: 25,
              corpo: `
${MODELO}
<h2>Tarefas</h2>
<ol>
  <li>Crie <strong>Posição do vendedor</strong> com RANKX e monte uma tabela por vendedor.</li>
  <li>Crie <strong>Média mensal</strong>: a média de faturamento dos meses que tiveram venda.</li>
  <li>Crie <strong>Melhor mês</strong>, que devolve o <em>nome</em> do mês com maior faturamento (use VAR, TOPN ou MAXX).</li>
  <li>Crie uma medida de texto para o título do relatório: "Ana lidera com R$ 654,70 (57,9% do total)", que se adapte aos filtros.</li>
</ol>
${resposta(`
${trecho(`Posição do vendedor = RANKX(ALL(fVendas[Vendedor]), [Faturamento], , DESC, DENSE)
    // Ana 1 · Bruno 2 · Carla 3

Média mensal = AVERAGEX(VALUES(dCalendario[Ano-Mês]), [Faturamento])
    // 1.130,40 ÷ 4 meses = 282,60

Melhor mês =
VAR Ranking = TOPN(1, VALUES(dCalendario[Ano-Mês]), [Faturamento], DESC)
RETURN MAXX(Ranking, dCalendario[Ano-Mês])
    // 2026-09 (423,80)

Título do relatório =
VAR Lider = TOPN(1, VALUES(fVendas[Vendedor]), [Faturamento], DESC)
VAR Nome = MAXX(Lider, fVendas[Vendedor])
VAR ValorLider = CALCULATE([Faturamento], fVendas[Vendedor] = Nome)
VAR Participacao = DIVIDE(ValorLider, [Faturamento])
RETURN
    Nome & " lidera com " & FORMAT(ValorLider, "R$ #,##0.00") & " (" & FORMAT(Participacao, "0.0%") & " do total)"`)}
<p>Use a medida de título num cartão ou no título dinâmico de um visual (botão fx ao lado de Texto do título). Com uma segmentação em "Utensílios", ela passa a dizer "Ana lidera com R$ 298,00 (66,7% do total)".</p>
<p>O <code>FORMAT</code> segue as configurações regionais do relatório: em português, aparece "R$ 654,70" e "57,9%".</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que a média mensal é 282,60 e não 1.130,40 ÷ 24 meses do calendário?',
                  opcoes: [
                    'Erro de cálculo',
                    'O AVERAGEX ignora os meses em que [Faturamento] é vazio',
                    'O calendário tem só 4 meses'
                  ],
                  certa: 1,
                  explicacao: 'Meses sem venda dão vazio, que fica fora da média.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
