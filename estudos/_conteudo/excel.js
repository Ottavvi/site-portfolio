// Trilha de Excel. Não há editor: as fórmulas são para fazer no Excel (ou no Google Planilhas). As funções estão com
// os nomes em português, com o nome em inglês entre parênteses na primeira vez, e o separador de argumentos é o
// ponto e vírgula, como no Excel em português. As aulas "Prática" têm um exercício com a resposta escondida.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta, tabela } = require('./ajuda');

module.exports = {
  id: 'excel',
  area: 'Dados e BI',
  titulo: 'Excel',
  sigla: 'XL',
  resumo: 'Fórmulas, tabelas e painéis: a planilha bem feita que responde perguntas sozinha.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Fórmulas, referências e tabelas.',
      modulos: [
        {
          titulo: 'Planilhas que funcionam',
          itens: [
            {
              id: 'formulas-e-referencias',
              titulo: 'Fórmulas e referências',
              resumo: 'O sinal de igual, operadores, SOMA, MÉDIA e o famoso cifrão.',
              minutos: 10,
              corpo: `
<p>Uma planilha bem feita não tem números "digitados por cima": os totais são <strong>fórmulas</strong>, que se recalculam sozinhas quando um dado muda. Toda fórmula começa com <code>=</code>.</p>

<h2>Operadores e funções básicas</h2>
<ul>
  <li><code>=B2*C2</code> multiplica; <code>+</code>, <code>-</code>, <code>/</code> e <code>^</code> (potência) também valem. <code>&amp;</code> junta textos: <code>=A2&amp;" "&amp;B2</code>.</li>
  <li><code>=SOMA(D2:D20)</code> (<em>SUM</em>) soma um intervalo. <code>D2:D20</code> quer dizer "de D2 até D20".</li>
  <li><code>=MÉDIA(D2:D20)</code>, <code>=MÁXIMO(...)</code>, <code>=MÍNIMO(...)</code>.</li>
  <li><code>=CONT.VALORES(A2:A20)</code> conta células preenchidas; <code>=CONT.NÚM(...)</code>, só as com números.</li>
</ul>
${dica('No Excel em português, os argumentos são separados por <strong>ponto e vírgula</strong>: <code>=ARRED(B2;2)</code>. Em tutoriais em inglês, aparece vírgula: <code>=ROUND(B2,2)</code>.')}

<h2>Referências relativas e absolutas</h2>
<p>Ao arrastar uma fórmula para baixo, as referências andam junto: <code>=B2*C2</code> vira <code>=B3*C3</code>. Isso é a <strong>referência relativa</strong>, e é quase sempre o que você quer.</p>
<p>Às vezes uma célula precisa ficar fixa, como a taxa de imposto em <code>F1</code>. O <strong>cifrão</strong> trava: <code>$F$1</code> não muda ao arrastar. A tecla <kbd>F4</kbd> alterna entre <code>F1</code>, <code>$F$1</code>, <code>F$1</code> (trava só a linha) e <code>$F1</code> (trava só a coluna).</p>
${trecho(`   A           B        C      D
1  Produto     Preço    Qtd    Total com taxa        F1: 0,1 (taxa de 10%)
2  Café        62,90    2      =B2*C2*(1+$F$1)
3  Caneca      34,50    1      =B3*C3*(1+$F$1)     ← arrastou: B e C andaram, $F$1 ficou`)}

<h2>Erros comuns</h2>
<ul>
  <li><code>#DIV/0!</code>: divisão por zero (ou por célula vazia).</li>
  <li><code>#VALOR!</code>: conta com texto, como "R$ 10" digitado como texto.</li>
  <li><code>#REF!</code>: a fórmula apontava para uma célula que foi apagada.</li>
  <li><code>#NOME?</code>: nome de função escrito errado (ou em inglês num Excel em português).</li>
  <li><code>####</code>: não é erro, a coluna só está estreita demais.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'O que acontece com =A1*$B$1 ao ser copiada uma linha abaixo?',
                  opcoes: ['=A2*$B$2', '=A2*$B$1', '=A1*$B$1'],
                  certa: 1,
                  explicacao: 'A1 é relativa e anda; $B$1 é absoluta e fica.'
                },
                {
                  pergunta: 'Qual separador de argumentos o Excel em português usa?',
                  opcoes: ['Vírgula', 'Ponto e vírgula', 'Dois pontos'],
                  certa: 1,
                  explicacao:
                    'Porque a vírgula é o separador decimal no Brasil. Dois pontos indicam intervalo (A1:A10).'
                },
                {
                  pergunta: 'O que o erro #NOME? costuma indicar?',
                  opcoes: ['Divisão por zero', 'Nome de função escrito errado', 'Coluna estreita'],
                  certa: 1,
                  explicacao: 'Por exemplo, =SUM(A1:A3) num Excel em português, que espera =SOMA(A1:A3).'
                }
              ]
            },
            {
              id: 'tabelas-e-formatos',
              titulo: 'Tabelas, formatos e validação',
              resumo: 'Formatar como Tabela, referências estruturadas, formatação condicional e listas.',
              minutos: 11,
              corpo: `
<h2>Formatar como Tabela</h2>
<p>Selecione os dados (com cabeçalho) e use <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> (ou Página Inicial, Formatar como Tabela). Uma <strong>Tabela</strong> do Excel é muito mais que listras coloridas:</p>
<ul>
  <li>Cresce sozinha: uma linha nova embaixo já entra na tabela, nas fórmulas e nos gráficos.</li>
  <li>Fórmulas numa coluna se repetem para todas as linhas automaticamente.</li>
  <li>Filtros e classificação no cabeçalho, e uma linha de totais opcional.</li>
  <li>Ganha um nome (renomeie em Design da Tabela: <code>tbVendas</code>), usado em fórmulas e no Power BI.</li>
</ul>

<h2>Referências estruturadas</h2>
<p>Dentro e fora da tabela, as fórmulas podem usar os nomes das colunas em vez de endereços. Ficam legíveis e não quebram quando a tabela cresce:</p>
${trecho(`=[@Preço]*[@Qtd]                 ← dentro da tabela: "o Preço desta linha vezes a Qtd desta linha"
=SOMA(tbVendas[Total])            ← fora: a coluna Total inteira, do tamanho que ela tiver
=MÉDIA(tbVendas[Preço])`)}

<h2>Formatos de número</h2>
<p>O formato muda só a <strong>aparência</strong>; o valor guardado continua o mesmo. Use Moeda ou Contábil para dinheiro, Porcentagem para taxas (0,1 aparece como 10%) e Data para datas. Nunca digite "R$" ou "%" junto com o número: ele vira texto e as contas param de funcionar.</p>

<h2>Formatação condicional</h2>
<p>Pinta as células conforme o valor: em Página Inicial, Formatação Condicional. As mais úteis: <em>Realçar regras</em> (maior que, menor que, duplicados), <em>Barras de dados</em> (um mini gráfico dentro da célula) e <em>Escalas de cor</em>. Para regras mais livres, "Usar uma fórmula": <code>=$E2&lt;HOJE()</code> pinta a linha inteira das contas vencidas.</p>

<h2>Validação de dados</h2>
<p>Em Dados, Validação de Dados, dá para limitar o que pode ser digitado: só números entre 0 e 100, só datas, ou uma <strong>lista suspensa</strong> de categorias. Isso evita "Mercado", "mercado" e "Mercado " virando três categorias diferentes no relatório.</p>
${dica('Uma regra de ouro para planilhas que vão virar relatório: <strong>uma informação por coluna, um registro por linha, nenhuma célula mesclada e nenhuma linha em branco no meio</strong>. É o formato que tabelas dinâmicas e o Power BI entendem.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a vantagem de =SOMA(tbVendas[Total]) sobre =SOMA(F2:F200)?',
                  opcoes: [
                    'É mais rápida',
                    'Acompanha a tabela quando ela cresce e diz o que está sendo somado',
                    'Nenhuma'
                  ],
                  certa: 1,
                  explicacao: 'O intervalo fixo deixa de fora as linhas novas; a referência estruturada não.'
                },
                {
                  pergunta: 'Por que não digitar "R$ 50" numa célula?',
                  opcoes: ['Fica feio', 'Vira texto e as contas param de funcionar', 'O Excel apaga'],
                  certa: 1,
                  explicacao: 'Digite 50 e aplique o formato Moeda: o valor continua número.'
                },
                {
                  pergunta: 'Para que serve uma lista suspensa na validação de dados?',
                  opcoes: [
                    'Deixar a planilha colorida',
                    'Garantir que só valores padronizados sejam digitados',
                    'Esconder colunas'
                  ],
                  certa: 1,
                  explicacao: 'Categorias escritas de jeitos diferentes viram grupos diferentes nos relatórios.'
                }
              ]
            },
            {
              id: 'pratica-orcamento',
              titulo: 'Prática: orçamento do mês',
              resumo: 'Monte uma tabela de gastos com totais e alertas.',
              minutos: 20,
              corpo: `
<p>Abra uma planilha nova e cole estes dados a partir da célula A1 (selecione a tabela abaixo, copie e cole no Excel):</p>
${tabela(
  ['Data', 'Descrição', 'Categoria', 'Valor', 'Orçamento'],
  [
    ['01/10/2026', 'Aluguel', 'Moradia', '1500', '1500'],
    ['03/10/2026', 'Supermercado', 'Mercado', '420,50', '600'],
    ['05/10/2026', 'Uber', 'Transporte', '38,90', '200'],
    ['08/10/2026', 'Farmácia', 'Saúde', '89,00', '150'],
    ['12/10/2026', 'Restaurante', 'Lazer', '156,00', '120'],
    ['15/10/2026', 'Conta de luz', 'Moradia', '210,30', '250'],
    ['20/10/2026', 'Feira', 'Mercado', '96,40', '600']
  ]
)}

<h2>Tarefas</h2>
<ol>
  <li>Transforme os dados numa Tabela chamada <code>tbGastos</code> e formate Valor e Orçamento como Moeda.</li>
  <li>Numa célula fora da tabela, calcule o <strong>total gasto</strong> com referência estruturada.</li>
  <li>Calcule o <strong>maior gasto</strong> e a <strong>média</strong> dos gastos.</li>
  <li>Acrescente na tabela a coluna <strong>% do orçamento</strong> (valor dividido pelo orçamento), em porcentagem.</li>
  <li>Use formatação condicional para pintar de vermelho as linhas em que o valor passou do orçamento.</li>
  <li>Acrescente uma linha nova (25/10/2026, Cinema, Lazer, 60, 120) e confira se os totais se atualizaram sozinhos.</li>
</ol>

${resposta(`
<ol>
  <li>Clique numa célula dos dados, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>, marque "Minha tabela tem cabeçalhos". Em Design da Tabela, Nome da Tabela: <code>tbGastos</code>.</li>
  <li><code>=SOMA(tbGastos[Valor])</code> → R$ 2.511,10</li>
  <li><code>=MÁXIMO(tbGastos[Valor])</code> → R$ 1.500,00 e <code>=MÉDIA(tbGastos[Valor])</code> → R$ 358,73</li>
  <li>Na célula F1, escreva <code>% do orçamento</code>; em F2, <code>=[@Valor]/[@Orçamento]</code>. A tabela repete a fórmula em todas as linhas. Formate como Porcentagem.</li>
  <li>Selecione as linhas de dados da tabela, Formatação Condicional, Nova Regra, "Usar uma fórmula": <code>=$D2&gt;$E2</code>, com preenchimento vermelho. O <code>$</code> antes das letras faz toda a linha seguir as colunas D e E. Só o Restaurante (156 &gt; 120) fica vermelho.</li>
  <li>Digitando na linha logo abaixo da tabela, ela cresce sozinha: o total passa a R$ 2.571,10 sem mexer na fórmula.</li>
</ol>`)}
`,
              quiz: [
                {
                  pergunta: 'Na regra =$D2>$E2 aplicada às linhas, por que o $ antes de D e E?',
                  opcoes: [
                    'Para travar a linha 2',
                    'Para que todas as colunas da linha comparem sempre D com E',
                    'Não faz diferença'
                  ],
                  certa: 1,
                  explicacao:
                    'A coluna fica travada e a linha anda: cada linha compara o próprio valor com o próprio orçamento.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Decisões, somas condicionais e buscas entre tabelas.',
      modulos: [
        {
          titulo: 'Decisões e buscas',
          itens: [
            {
              id: 'condicionais',
              titulo: 'SE, SES e somas condicionais',
              resumo: 'Decidir com fórmulas e somar só o que interessa.',
              minutos: 12,
              corpo: `
<h2>SE</h2>
<p><code>=SE(teste; valor_se_verdadeiro; valor_se_falso)</code> (<em>IF</em>):</p>
${trecho(`=SE([@Valor]>[@Orçamento]; "Estourou"; "Ok")
=SE(E([@Nota]>=7; [@Faltas]<=10); "Aprovado"; "Reprovado")        ← E: as duas condições
=SE(OU([@Estado]="SP"; [@Estado]="RJ"); "Sudeste A"; "Outros")    ← OU: qualquer uma`)}
<p>Texto vai entre aspas duplas. Comparações: <code>=</code>, <code>&lt;&gt;</code> (diferente), <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>.</p>

<h2>SES: várias faixas sem SE dentro de SE</h2>
${trecho(`=SE(B2>=9;"A";SE(B2>=7;"B";SE(B2>=5;"C";"D")))     ← difícil de ler
=SES(B2>=9;"A"; B2>=7;"B"; B2>=5;"C"; VERDADEIRO;"D") ← SES (IFS): pares de teste e resultado`)}
<p>O <code>VERDADEIRO</code> no fim funciona como "senão".</p>

<h2>SEERRO</h2>
<p><code>=SEERRO(fórmula; valor_se_der_erro)</code> (<em>IFERROR</em>) troca um erro por algo apresentável: <code>=SEERRO([@Lucro]/[@Receita]; 0)</code>. Use com cuidado: ele esconde <strong>qualquer</strong> erro, inclusive os que você precisaria ver.</p>

<h2>Somar, contar e fazer média com condições</h2>
<p>As funções com <strong>SES</strong> no fim aceitam vários critérios, sempre em pares (intervalo do critério; critério):</p>
${trecho(`=SOMASES(tbGastos[Valor]; tbGastos[Categoria]; "Mercado")
=SOMASES(tbGastos[Valor]; tbGastos[Categoria]; "Mercado"; tbGastos[Data]; ">="&DATA(2026;10;1))
=CONT.SES(tbGastos[Categoria]; "Lazer")
=MÉDIASES(tbVendas[Valor]; tbVendas[Vendedor]; H2)                ← o critério pode vir de uma célula
=SOMASES(tbVendas[Valor]; tbVendas[Produto]; "*café*")            ← * vale qualquer texto`)}
<p>Repare no <code>"&gt;="&amp;DATA(2026;10;1)</code>: critérios com comparação são texto, então o operador vai entre aspas e é juntado ao valor com <code>&amp;</code>.</p>
${dica('Monte um pequeno resumo ao lado dos dados: uma coluna com as categorias e, ao lado, <code>=SOMASES(tbGastos[Valor]; tbGastos[Categoria]; H2)</code> arrastada para baixo. É o começo de qualquer painel.')}
`,
              quiz: [
                {
                  pergunta: 'Qual fórmula soma os valores da categoria "Saúde"?',
                  opcoes: [
                    '=SOMA(tbGastos[Valor]; "Saúde")',
                    '=SOMASES(tbGastos[Valor]; tbGastos[Categoria]; "Saúde")',
                    '=SE(tbGastos[Categoria]="Saúde"; SOMA())'
                  ],
                  certa: 1,
                  explicacao: 'Primeiro o que somar, depois os pares de critério.'
                },
                {
                  pergunta: 'Como escrever o critério "maior que 100" no SOMASES?',
                  opcoes: ['>100', '">100"', '"maior 100"'],
                  certa: 1,
                  explicacao: 'O critério é texto, entre aspas. Com uma célula: ">"&B1.'
                },
                {
                  pergunta: 'Qual o risco do SEERRO?',
                  opcoes: ['Deixar lento', 'Esconder erros que você precisaria ver', 'Nenhum'],
                  certa: 1,
                  explicacao: 'Um #REF! por coluna apagada vira 0 sem ninguém perceber.'
                }
              ]
            },
            {
              id: 'buscas',
              titulo: 'Buscas: PROCX, PROCV e ÍNDICE/CORRESP',
              resumo: 'Trazer informações de outra tabela pelo código.',
              minutos: 12,
              corpo: `
<p>Buscar é trazer um dado de outra tabela usando uma chave em comum: o preço pelo código do produto, o nome do vendedor pelo id.</p>

<h2>PROCX</h2>
<p>A <code>PROCX</code> (<em>XLOOKUP</em>), do Excel 2021 e do Microsoft 365, é a busca moderna:</p>
${trecho(`=PROCX(valor_procurado; onde_procurar; o_que_devolver; [se_não_achar])

=PROCX([@Código]; tbProdutos[Código]; tbProdutos[Preço])
=PROCX([@Código]; tbProdutos[Código]; tbProdutos[Preço]; "Não cadastrado")
=PROCX(H2; tbClientes[E-mail]; tbClientes[Nome])            ← pode procurar em qualquer coluna`)}
<p>Por padrão ela procura a correspondência <strong>exata</strong>, devolve o que você pedir (à esquerda ou à direita) e tem um argumento para quando não acha.</p>

<h2>PROCV</h2>
<p>A <code>PROCV</code> (<em>VLOOKUP</em>) é a mais antiga e ainda aparece em toda planilha de empresa. Ela tem três armadilhas:</p>
${trecho(`=PROCV([@Código]; tbProdutos; 3; FALSO)`)}
<ul>
  <li>Só procura na <strong>primeira coluna</strong> e só devolve à direita dela.</li>
  <li>O <code>3</code> é o número da coluna: inserir uma coluna no meio da tabela faz a fórmula trazer o dado errado, sem aviso.</li>
  <li>Sem o <code>FALSO</code> no fim, ela faz busca aproximada e pode devolver um valor errado em silêncio. Sempre use <code>FALSO</code> (ou 0).</li>
</ul>

<h2>ÍNDICE + CORRESP</h2>
<p>Antes da PROCX, a combinação flexível era esta, e ela funciona em qualquer versão do Excel:</p>
${trecho(`=ÍNDICE(tbProdutos[Preço]; CORRESP([@Código]; tbProdutos[Código]; 0))`)}
<p><code>CORRESP</code> (<em>MATCH</em>) descobre em que <strong>posição</strong> o código está; <code>ÍNDICE</code> (<em>INDEX</em>) pega o item daquela posição na coluna de preços.</p>

<h2>Busca por faixa</h2>
<p>Às vezes a busca aproximada é o que você quer: tabela de comissões, faixas de frete, alíquotas. Com a PROCX, o modo <code>-1</code> pega a faixa exata ou a imediatamente menor:</p>
${trecho(`Faixas: 0 → 2%   |   10.000 → 3%   |   50.000 → 5%
=PROCX([@Vendas]; tbFaixas[A partir de]; tbFaixas[Comissão]; ; -1)     ← 23.000 cai na faixa de 3%`)}
${dica('Quando a busca devolve #N/D, quase sempre o valor existe mas está diferente: espaço sobrando ("CAF01 "), número guardado como texto ou maiúsculas. ARRUMAR() tira espaços das pontas e VALOR() converte texto em número.')}
`,
              quiz: [
                {
                  pergunta: 'Por que o último argumento da PROCV deve ser FALSO?',
                  opcoes: [
                    'Para deixar mais rápido',
                    'Para fazer busca exata; sem ele, ela pode trazer um valor errado em silêncio',
                    'É opcional e não muda nada'
                  ],
                  certa: 1,
                  explicacao: 'O padrão da PROCV é a busca aproximada, que só serve para tabelas de faixas ordenadas.'
                },
                {
                  pergunta: 'Qual vantagem da PROCX sobre a PROCV?',
                  opcoes: [
                    'Funciona em qualquer Excel antigo',
                    'Procura em qualquer coluna, devolve de qualquer lado e não depende do número da coluna',
                    'Não precisa de tabela'
                  ],
                  certa: 1,
                  explicacao: 'E ainda tem o argumento "se não achar".'
                },
                {
                  pergunta: 'A busca devolve #N/D, mas o código parece estar lá. Causa provável?',
                  opcoes: ['Excel com defeito', 'Espaços sobrando ou número guardado como texto', 'Falta de memória'],
                  certa: 1,
                  explicacao: 'Para o Excel, "CAF01" e "CAF01 " são valores diferentes.'
                }
              ]
            },
            {
              id: 'pratica-vendas',
              titulo: 'Prática: relatório de vendas',
              resumo: 'Cruze duas tabelas e resuma as vendas por vendedor.',
              minutos: 25,
              corpo: `
<p>Cole as duas tabelas em abas diferentes e transforme cada uma numa Tabela: <code>tbProdutos</code> e <code>tbVendas</code>.</p>
<h2>tbProdutos</h2>
${tabela(
  ['Código', 'Produto', 'Categoria', 'Preço'],
  [
    ['CAF01', 'Café em grãos 1kg', 'Mercearia', '62,90'],
    ['CAN02', 'Caneca de cerâmica', 'Casa', '34,50'],
    ['MOE03', 'Moedor manual', 'Utensílios', '149,00'],
    ['FIL04', 'Filtro de papel', 'Mercearia', '9,90']
  ]
)}
<h2>tbVendas</h2>
${tabela(
  ['Data', 'Vendedor', 'Código', 'Qtd'],
  [
    ['02/10/2026', 'Ana', 'CAF01', '3'],
    ['02/10/2026', 'Bruno', 'MOE03', '1'],
    ['05/10/2026', 'Ana', 'FIL04', '10'],
    ['09/10/2026', 'Carla', 'CAN02', '4'],
    ['11/10/2026', 'Bruno', 'CAF01', '2'],
    ['15/10/2026', 'Ana', 'MOE03', '2'],
    ['18/10/2026', 'Carla', 'CAF01', '1']
  ]
)}
<h2>Tarefas</h2>
<ol>
  <li>Em <code>tbVendas</code>, crie as colunas <strong>Produto</strong> e <strong>Preço</strong>, buscando em <code>tbProdutos</code> pelo código.</li>
  <li>Crie a coluna <strong>Total</strong> (preço vezes quantidade).</li>
  <li>Crie a coluna <strong>Faixa</strong>: "Grande" para vendas a partir de R$ 200, "Média" a partir de R$ 60 e "Pequena" nas outras.</li>
  <li>Num resumo ao lado, mostre o total vendido por vendedor (Ana, Bruno e Carla).</li>
  <li>Conte quantas vendas foram da categoria Mercearia. (Dica: a categoria não está em tbVendas.)</li>
</ol>
${resposta(`
<ol>
  <li><code>=PROCX([@Código]; tbProdutos[Código]; tbProdutos[Produto])</code> e <code>=PROCX([@Código]; tbProdutos[Código]; tbProdutos[Preço])</code>. Sem PROCX: <code>=PROCV([@Código]; tbProdutos; 4; FALSO)</code> para o preço.</li>
  <li><code>=[@Preço]*[@Qtd]</code>. Totais: 188,70 · 149,00 · 99,00 · 138,00 · 125,80 · 298,00 · 62,90.</li>
  <li><code>=SES([@Total]&gt;=200; "Grande"; [@Total]&gt;=60; "Média"; VERDADEIRO; "Pequena")</code>. Só a venda de 298,00 é Grande; as outras são Média.</li>
  <li>Com os nomes em H2:H4: <code>=SOMASES(tbVendas[Total]; tbVendas[Vendedor]; H2)</code>. Ana: R$ 585,70 · Bruno: R$ 274,80 · Carla: R$ 200,90.</li>
  <li>Crie em tbVendas a coluna Categoria com <code>=PROCX([@Código]; tbProdutos[Código]; tbProdutos[Categoria])</code> e então <code>=CONT.SES(tbVendas[Categoria]; "Mercearia")</code> → 4.</li>
</ol>`)}
`,
              quiz: [
                {
                  pergunta: 'A categoria só existe em tbProdutos. Como contar vendas por categoria?',
                  opcoes: [
                    'Não dá',
                    'Trazer a categoria para tbVendas com uma busca e depois contar',
                    'Copiar e colar à mão'
                  ],
                  certa: 1,
                  explicacao:
                    'Buscar e depois resumir é o padrão. No Power BI, um relacionamento faz isso sem coluna extra.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Tabelas dinâmicas, gráficos, matrizes dinâmicas e LET.',
      modulos: [
        {
          titulo: 'Análise',
          itens: [
            {
              id: 'tabelas-dinamicas',
              titulo: 'Tabelas dinâmicas e gráficos',
              resumo: 'Resumir milhares de linhas em segundos e escolher o gráfico certo.',
              minutos: 12,
              corpo: `
<p>A <strong>tabela dinâmica</strong> resume uma tabela grande arrastando campos, sem escrever fórmula: total por mês, por categoria, por vendedor e categoria ao mesmo tempo. Clique na sua Tabela e use Inserir, Tabela Dinâmica.</p>

<h2>As quatro áreas</h2>
<ul>
  <li><strong>Linhas</strong>: o que vira linha (Vendedor).</li>
  <li><strong>Colunas</strong>: o que vira coluna (Categoria).</li>
  <li><strong>Valores</strong>: o que é calculado (Soma de Total). Clique no campo para trocar para Média, Contagem, Máximo, ou "Mostrar valores como % do total".</li>
  <li><strong>Filtros</strong>: filtra o relatório todo.</li>
</ul>
<p>Datas podem ser agrupadas por mês, trimestre e ano (botão direito numa data, Agrupar). <strong>Segmentações de dados</strong> (Inserir, Segmentação) viram botões de filtro clicáveis, e uma mesma segmentação pode controlar várias tabelas dinâmicas.</p>
${dica('Tabelas dinâmicas não se atualizam sozinhas: depois de mudar os dados, use Dados, Atualizar Tudo (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F5</kbd>). Se a origem for uma Tabela do Excel, as linhas novas entram na atualização.')}

<h2>Qual gráfico usar</h2>
<ul>
  <li><strong>Comparar categorias</strong>: barras. Horizontais quando os nomes são longos. Ordene do maior para o menor.</li>
  <li><strong>Evolução no tempo</strong>: linhas (ou colunas, com poucos períodos).</li>
  <li><strong>Parte de um todo</strong>: barras empilhadas 100% ou rosca com no máximo 4 ou 5 fatias. Pizza com 12 fatias ninguém consegue ler.</li>
  <li><strong>Relação entre dois números</strong>: dispersão (preço × quantidade vendida).</li>
  <li><strong>Um número importante</strong>: não precisa de gráfico. Um número grande com a comparação ("R$ 48 mil, +12% sobre setembro") comunica melhor.</li>
</ul>

<h2>Gráfico limpo</h2>
<ul>
  <li>Título que diz a conclusão ("Ana vendeu o dobro de Carla"), não só o assunto ("Vendas por vendedor").</li>
  <li>Tire o que não ajuda: linhas de grade fortes, bordas, 3D, legendas que repetem o eixo.</li>
  <li>Uma cor para tudo e uma cor de destaque para o que importa.</li>
  <li>Eixo de barras começa no zero; senão, a diferença parece maior do que é.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Qual gráfico mostra melhor a evolução do faturamento em 12 meses?',
                  opcoes: ['Pizza', 'Linhas', 'Dispersão'],
                  certa: 1,
                  explicacao: 'Tempo no eixo horizontal, linha mostrando a tendência.'
                },
                {
                  pergunta: 'Você mudou os dados. O que fazer para a tabela dinâmica refletir?',
                  opcoes: ['Nada, ela atualiza sozinha', 'Atualizar (Dados, Atualizar Tudo)', 'Criar outra'],
                  certa: 1,
                  explicacao: 'A dinâmica guarda um cache dos dados até ser atualizada.'
                },
                {
                  pergunta: 'Por que o eixo de um gráfico de barras deve começar em zero?',
                  opcoes: [
                    'É regra do Excel',
                    'Senão o tamanho das barras exagera as diferenças',
                    'Para caber a legenda'
                  ],
                  certa: 1,
                  explicacao: 'Barras comparam comprimentos; cortar o eixo distorce a comparação.'
                }
              ]
            },
            {
              id: 'matrizes-dinamicas',
              titulo: 'Matrizes dinâmicas, LET e LAMBDA',
              resumo: 'FILTRO, CLASSIFICAR, ÚNICO, LET e funções próprias.',
              minutos: 13,
              corpo: `
<p>No Microsoft 365 e no Excel 2021, uma fórmula pode devolver <strong>vários valores</strong>, que se espalham pelas células vizinhas. Isso se chama <strong>matriz dinâmica</strong> (o "transbordamento", ou <em>spill</em>). A fórmula fica numa célula só, e o resultado cresce ou encolhe conforme os dados.</p>

<h2>As funções que mudam tudo</h2>
${trecho(`=ÚNICO(tbVendas[Vendedor])                                  ← lista sem repetição (UNIQUE)
=CLASSIFICAR(ÚNICO(tbVendas[Vendedor]))                     ← em ordem (SORT)
=FILTRO(tbVendas; tbVendas[Vendedor]="Ana")                 ← só as linhas da Ana (FILTER)
=FILTRO(tbVendas; (tbVendas[Total]>100)*(tbVendas[Vendedor]="Ana"); "Nenhuma")
=CLASSIFICARPOR(tbVendas[Vendedor]; tbVendas[Total]; -1)    ← vendedores pelo total, do maior
=SEQUÊNCIA(12)                                              ← 1 a 12 (SEQUENCE)`)}
<p>No FILTRO, condições multiplicadas (<code>*</code>) funcionam como E; somadas (<code>+</code>), como OU. O último argumento é o que mostrar quando nada passa no filtro.</p>
<p>Para usar um resultado que transbordou em outra fórmula, escreva a célula de origem com <code>#</code>: se <code>=ÚNICO(...)</code> está em H2, <code>=SOMASES(tbVendas[Total]; tbVendas[Vendedor]; H2#)</code> calcula o total de cada nome, e se um vendedor novo aparecer, ele entra sozinho.</p>
${dica('O erro <code>#DESPEJAR!</code> (<em>#SPILL!</em>) quer dizer que há algo escrito nas células onde o resultado precisa transbordar. Limpe o caminho.')}

<h2>LET: nomes dentro da fórmula</h2>
<p>Fórmulas longas repetem o mesmo pedaço várias vezes. O <code>LET</code> dá nome a valores intermediários, como variáveis:</p>
${trecho(`=LET(
  total; SOMA(tbVendas[Total]);
  meta; 1500;
  falta; meta - total;
  SE(falta <= 0; "Meta batida!"; "Faltam " & TEXTO(falta; "R$ #.##0,00"))
)`)}

<h2>LAMBDA: suas próprias funções</h2>
<p>Com <code>LAMBDA</code>, uma fórmula vira uma função com nome, usada como qualquer outra. Crie em Fórmulas, Gerenciador de Nomes, Novo:</p>
${trecho(`Nome: COMISSAO
Refere-se a: =LAMBDA(valor; SES(valor>=50000; valor*5%; valor>=10000; valor*3%; VERDADEIRO; valor*2%))

Na planilha:  =COMISSAO([@Vendas])`)}
<p>Assim a regra da comissão fica num lugar só: se mudar, você muda uma vez.</p>
`,
              quiz: [
                {
                  pergunta: 'O que =ÚNICO(tbVendas[Vendedor]) devolve?',
                  opcoes: ['O primeiro vendedor', 'A lista de vendedores sem repetição', 'Quantos vendedores há'],
                  certa: 1,
                  explicacao: 'A lista transborda para as células de baixo.'
                },
                {
                  pergunta: 'No FILTRO, como juntar duas condições com E?',
                  opcoes: ['Com ; entre elas', 'Multiplicando: (cond1)*(cond2)', 'Com a função E()'],
                  certa: 1,
                  explicacao: 'Verdadeiro vale 1 e falso 0: o produto só é 1 quando as duas são verdadeiras.'
                },
                {
                  pergunta: 'O que o erro #DESPEJAR! indica?',
                  opcoes: [
                    'Fórmula errada',
                    'Há algo nas células onde o resultado precisa transbordar',
                    'Divisão por zero'
                  ],
                  certa: 1,
                  explicacao: 'Esvazie as células do caminho e o resultado aparece.'
                }
              ]
            },
            {
              id: 'pratica-painel',
              titulo: 'Prática: painel de vendas',
              resumo: 'Monte um painel que se atualiza sozinho com os dados da prática anterior.',
              minutos: 30,
              corpo: `
<p>Use a planilha da prática de vendas (com Produto, Preço, Total e Categoria já em <code>tbVendas</code>). Crie uma aba <strong>Painel</strong>.</p>
<h2>Tarefas</h2>
<ol>
  <li>No topo, três números grandes: <strong>faturamento total</strong>, <strong>número de vendas</strong> e <strong>ticket médio</strong> (faturamento dividido pelo número de vendas).</li>
  <li>Uma lista dos vendedores, <strong>ordenada pelo faturamento</strong>, que se atualize sozinha se entrar um vendedor novo, com o total de cada um ao lado.</li>
  <li>Uma tabela dinâmica com o total por categoria e um gráfico de barras a partir dela.</li>
  <li>Uma segmentação de dados por vendedor ligada à tabela dinâmica.</li>
  <li>Uma célula de <strong>meta</strong> (R$ 1.200) e uma mensagem com LET dizendo se a meta foi batida ou quanto falta.</li>
</ol>
${resposta(`
<ol>
  <li><code>=SOMA(tbVendas[Total])</code> → R$ 1.061,40 · <code>=LINS(tbVendas)</code> ou <code>=CONT.VALORES(tbVendas[Código])</code> → 7 · ticket: <code>=B2/B3</code> → R$ 151,63. Fonte grande, formato Moeda.</li>
  <li>Em A6: <code>=CLASSIFICARPOR(ÚNICO(tbVendas[Vendedor]); SOMASES(tbVendas[Total]; tbVendas[Vendedor]; ÚNICO(tbVendas[Vendedor])); -1)</code> e em B6: <code>=SOMASES(tbVendas[Total]; tbVendas[Vendedor]; A6#)</code>. Resultado: Ana 585,70 · Bruno 274,80 · Carla 200,90.</li>
  <li>Inserir, Tabela Dinâmica (origem: tbVendas), Categoria em Linhas e Total em Valores. Com ela selecionada, Inserir, Gráfico de Barras. Mercearia: R$ 476,40 · Utensílios: R$ 447,00 · Casa: R$ 138,00.</li>
  <li>Com a dinâmica selecionada, Analisar Tabela Dinâmica, Inserir Segmentação de Dados, Vendedor.</li>
  <li><code>=LET(total; SOMA(tbVendas[Total]); meta; B10; SE(total&gt;=meta; "Meta batida!"; "Faltam " &amp; TEXTO(meta-total; "R$ #.##0,00")))</code> → "Faltam R$ 138,60".</li>
</ol>`)}
${dica('Para um painel mais profissional, com várias tabelas relacionadas e atualização automática a partir de arquivos, o próximo passo natural são as trilhas de Power Query e Power BI.')}
`,
              quiz: [
                {
                  pergunta: 'Por que usar ÚNICO e A6# em vez de digitar os nomes dos vendedores?',
                  opcoes: [
                    'Fica mais bonito',
                    'Um vendedor novo nos dados aparece no painel sem mexer em nada',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'O painel acompanha os dados em vez de depender de manutenção manual.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
