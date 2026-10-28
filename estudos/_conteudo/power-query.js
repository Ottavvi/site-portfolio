// Trilha de Power Query. Sem editor: os passos são para fazer no Excel (Dados, Obter Dados) ou no Power BI
// (Transformar dados). O código M aparece em trechos; os nomes das funções do M são sempre em inglês.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta, tabela } = require('./ajuda');

module.exports = {
  id: 'power-query',
  area: 'Dados e BI',
  titulo: 'Power Query',
  sigla: 'PQ',
  resumo: 'Limpar e juntar dados bagunçados uma vez, e repetir com um clique no mês seguinte.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Importar e limpar dados com etapas que se repetem sozinhas.',
      modulos: [
        {
          titulo: 'Importar e limpar',
          itens: [
            {
              id: 'o-que-e-power-query',
              titulo: 'O que é o Power Query',
              resumo: 'Etapas aplicadas, tipos de dados e carregar o resultado.',
              minutos: 9,
              corpo: `
<p>Todo mês chega o mesmo relatório bagunçado: colunas a mais, datas como texto, espaços sobrando, o total misturado com os dados. Arrumar à mão leva uma hora, e no mês seguinte começa tudo de novo. O <strong>Power Query</strong> grava cada passo da limpeza e repete tudo sozinho quando o arquivo novo chega. Ele está no Excel (guia Dados, grupo Obter e Transformar) e no Power BI (Transformar dados), com a mesma interface.</p>

<h2>O fluxo</h2>
<ol>
  <li><strong>Obter dados</strong>: de um arquivo Excel ou CSV, de uma pasta, de um banco, de uma página da web ou de uma API.</li>
  <li><strong>Transformar</strong> no editor: cada clique (remover coluna, mudar tipo, filtrar) vira uma <strong>etapa aplicada</strong>, listada à direita.</li>
  <li><strong>Fechar e Carregar</strong>: o resultado vai para uma Tabela do Excel ou para o modelo do Power BI.</li>
  <li>No mês seguinte, troque o arquivo e clique em <strong>Atualizar</strong>. Todas as etapas rodam de novo.</li>
</ol>
${dica('O arquivo original nunca é alterado. O Power Query lê, transforma na memória e carrega o resultado. Se errar uma etapa, apague-a da lista ou clique numa etapa anterior para ver os dados naquele ponto.')}

<h2>Tipos de dados</h2>
<p>O ícone no cabeçalho de cada coluna mostra o tipo: <strong>ABC</strong> (texto), <strong>123</strong> (número inteiro), <strong>1.2</strong> (decimal), um calendário (data). Acertar os tipos é a etapa mais importante: um valor que ficou como texto não soma, e uma data como texto não ordena direito.</p>
<p>Datas e números brasileiros (28/10/2026, 1.234,56) exigem atenção: use o botão direito no cabeçalho, <strong>Alterar Tipo, Usando Localidade</strong>, e escolha Português (Brasil). Sem isso, num computador configurado em inglês, 05/10 vira 10 de maio.</p>

<h2>A barra de fórmulas</h2>
<p>Cada etapa é uma linha da linguagem <strong>M</strong>, que aparece na barra de fórmulas (ative em Exibir, Barra de Fórmulas). Você não precisa escrever M para usar o Power Query, mas ler ajuda a entender o que cada clique fez:</p>
${trecho(`= Table.TransformColumnTypes(#"Cabeçalhos Promovidos", {{"Valor", type number}, {"Data", type date}}, "pt-BR")`)}
`,
              quiz: [
                {
                  pergunta: 'O que acontece com o arquivo original quando você limpa os dados no Power Query?',
                  opcoes: [
                    'É sobrescrito',
                    'Nada: o Power Query só lê e carrega o resultado em outro lugar',
                    'É apagado'
                  ],
                  certa: 1,
                  explicacao: 'A origem fica intacta, e a limpeza pode ser refeita a qualquer momento.'
                },
                {
                  pergunta: 'Como repetir a limpeza no relatório do mês seguinte?',
                  opcoes: [
                    'Refazer todas as etapas',
                    'Trocar o arquivo e clicar em Atualizar',
                    'Copiar e colar as fórmulas'
                  ],
                  certa: 1,
                  explicacao: 'As etapas aplicadas ficam gravadas e rodam de novo.'
                },
                {
                  pergunta: 'Por que usar "Alterar Tipo, Usando Localidade" com datas brasileiras?',
                  opcoes: [
                    'É mais rápido',
                    'Para 05/10 ser lido como 5 de outubro, mesmo num computador em inglês',
                    'Para traduzir os meses'
                  ],
                  certa: 1,
                  explicacao: 'Sem a localidade, o formato do sistema decide, e dia e mês podem trocar de lugar.'
                }
              ]
            },
            {
              id: 'limpeza-basica',
              titulo: 'As limpezas do dia a dia',
              resumo: 'Cabeçalhos, colunas, espaços, dividir, substituir, preencher e duplicados.',
              minutos: 12,
              corpo: `
<p>Quase todo relatório precisa de algumas destas operações. Todas estão nas guias Página Inicial e Transformar, ou no botão direito do cabeçalho:</p>
<ul>
  <li><strong>Usar a primeira linha como cabeçalho</strong> e <strong>Remover linhas superiores</strong> (aquele título do relatório nas primeiras linhas).</li>
  <li><strong>Remover outras colunas</strong>: selecione as que interessam e remova o resto. É mais seguro que remover as que não interessam: se o sistema acrescentar uma coluna nova no mês que vem, ela não entra sem querer.</li>
  <li><strong>Formatar, Aparar</strong> (tira espaços das pontas) e <strong>Limpar</strong> (tira caracteres invisíveis).</li>
  <li><strong>Dividir coluna</strong> por delimitador ("Curitiba - PR" em cidade e estado) ou por número de caracteres.</li>
  <li><strong>Substituir valores</strong>: "N/D" por nada, "Sao Paulo" por "São Paulo".</li>
  <li><strong>Preencher para baixo</strong>: relatórios que mostram a categoria só na primeira linha de cada grupo.</li>
  <li><strong>Filtrar</strong> pelo cabeçalho: tirar linhas de total, linhas vazias, registros cancelados.</li>
  <li><strong>Remover duplicatas</strong> considerando as colunas selecionadas.</li>
</ul>

<h2>Colunas novas</h2>
<p>Na guia Adicionar Coluna:</p>
<ul>
  <li><strong>Coluna Condicional</strong>: um SE com interface ("se Valor &lt; 0, então Saída, senão Entrada").</li>
  <li><strong>Coluna a partir de exemplos</strong>: você digita o resultado esperado em duas linhas e o Power Query descobre a regra.</li>
  <li><strong>Data</strong>: extrair ano, mês, nome do mês, início da semana de uma coluna de data.</li>
  <li><strong>Coluna Personalizada</strong>: uma fórmula em M, como <code>[Preço] * [Quantidade]</code>.</li>
</ul>
${trecho(`// O que a coluna condicional vira em M
= Table.AddColumn(#"Tipo Alterado", "Tipo", each if [Valor] < 0 then "Saída" else "Entrada", type text)`)}
${dica('Dê nomes claros às etapas (botão direito, Renomear): "Remove linhas de total" é muito mais fácil de entender daqui a seis meses do que "Linhas Filtradas2".')}
`,
              quiz: [
                {
                  pergunta: 'Por que preferir "Remover outras colunas" a remover as que não interessam?',
                  opcoes: [
                    'É mais rápido',
                    'Se o sistema acrescentar uma coluna nova, ela não entra no resultado sem querer',
                    'Não há diferença'
                  ],
                  certa: 1,
                  explicacao: 'A etapa diz quais colunas ficam, e o resultado não muda se a origem ganhar colunas.'
                },
                {
                  pergunta: 'Um relatório mostra a categoria só na primeira linha de cada grupo. Qual operação?',
                  opcoes: ['Dividir coluna', 'Preencher para baixo', 'Remover duplicatas'],
                  certa: 1,
                  explicacao: 'Ela copia o valor de cima para as células vazias abaixo.'
                },
                {
                  pergunta: 'O que "Aparar" faz?',
                  opcoes: ['Corta o texto pela metade', 'Tira os espaços das pontas', 'Converte em número'],
                  certa: 1,
                  explicacao: 'Espaços sobrando fazem "Café " e "Café" serem valores diferentes.'
                }
              ]
            },
            {
              id: 'pratica-extrato',
              titulo: 'Prática: limpar um extrato bancário',
              resumo: 'Transforme um extrato bagunçado numa tabela pronta para análise.',
              minutos: 20,
              corpo: `
<p>Salve este conteúdo num arquivo <code>extrato.csv</code> (no Bloco de Notas, com codificação UTF-8). É assim que muitos bancos exportam: com título, separador <code>;</code> e números brasileiros.</p>
${trecho(`EXTRATO DE CONTA CORRENTE
Período: 01/10/2026 a 31/10/2026
Data;Histórico;Valor
01/10/2026;  PIX RECEBIDO - CLIENTE ACME  ;3.500,00
03/10/2026;SUPERMERCADO BOM PRECO;-182,40
05/10/2026;PIX ENVIADO - ALUGUEL;-1.500,00
05/10/2026;PIX ENVIADO - ALUGUEL;-1.500,00
07/10/2026;FARMACIA VIDA;-45,90
12/10/2026;TARIFA PACOTE;-29,90
SALDO;;241,80`)}
<h2>Tarefas</h2>
<p>No Excel: Dados, Obter Dados, De Arquivo, De Texto/CSV, e depois Transformar Dados.</p>
<ol>
  <li>Remova as duas linhas de título e use a primeira linha como cabeçalho.</li>
  <li>Tire a linha de SALDO.</li>
  <li>Apare o Histórico e remova a linha duplicada do aluguel.</li>
  <li>Converta Data para data e Valor para número decimal, usando a localidade Português (Brasil).</li>
  <li>Crie a coluna <strong>Tipo</strong> (Entrada ou Saída) e a coluna <strong>Mês</strong> (o nome do mês da data).</li>
  <li>Carregue numa Tabela e confira: o total das saídas deve ser <strong>-1.758,20</strong>.</li>
</ol>
${resposta(`
<ol>
  <li>Página Inicial, Remover Linhas, Remover Linhas Superiores, 2. Depois Usar a Primeira Linha como Cabeçalho.</li>
  <li>Filtro no cabeçalho de Data: desmarque SALDO. (Melhor ainda: filtre depois de converter para data e remova os erros, assim qualquer linha que não for data sai.)</li>
  <li>Selecione Histórico, Transformar, Formatar, Aparar. Selecione as três colunas e Remover Linhas, Remover Duplicatas.</li>
  <li>Botão direito em Data, Alterar Tipo, Usando Localidade: Data, Português (Brasil). Em Valor: Número Decimal, Português (Brasil). Assim "3.500,00" vira 3500.</li>
  <li>Adicionar Coluna, Coluna Condicional: se Valor for menor que 0, Saída, senão Entrada. Para o mês, selecione Data, Adicionar Coluna, Data, Mês, Nome do Mês.</li>
  <li>Saídas: -182,40 - 1.500,00 - 45,90 - 29,90 = <strong>-1.758,20</strong>. Se der -3.258,20, a duplicata do aluguel ainda está lá.</li>
</ol>
${trecho(`let
    Fonte = Csv.Document(File.Contents("C:\\Dados\\extrato.csv"), [Delimiter=";", Encoding=65001]),
    SemTitulo = Table.Skip(Fonte, 2),
    Cabecalhos = Table.PromoteHeaders(SemTitulo, [PromoteAllScalars=true]),
    SemSaldo = Table.SelectRows(Cabecalhos, each [Data] <> "SALDO"),
    Aparado = Table.TransformColumns(SemSaldo, {{"Histórico", Text.Trim, type text}}),
    SemDuplicatas = Table.Distinct(Aparado),
    Tipos = Table.TransformColumnTypes(SemDuplicatas, {{"Data", type date}, {"Valor", type number}}, "pt-BR"),
    ComTipo = Table.AddColumn(Tipos, "Tipo", each if [Valor] < 0 then "Saída" else "Entrada", type text),
    ComMes = Table.AddColumn(ComTipo, "Mês", each Date.MonthName([Data], "pt-BR"), type text)
in
    ComMes`)}`)}
`,
              quiz: [
                {
                  pergunta: 'O total das saídas deu -3.258,20 em vez de -1.758,20. O que faltou?',
                  opcoes: ['Converter o tipo', 'Remover a linha duplicada do aluguel', 'Aparar o texto'],
                  certa: 1,
                  explicacao: 'O aluguel de 1.500 aparece duas vezes no arquivo.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Juntar arquivos e tabelas, agrupar e mudar o formato dos dados.',
      modulos: [
        {
          titulo: 'Combinar e reorganizar',
          itens: [
            {
              id: 'combinar-consultas',
              titulo: 'Acrescentar, mesclar e importar uma pasta',
              resumo: 'Empilhar tabelas, juntar como um PROCX e ler vários arquivos de uma vez.',
              minutos: 12,
              corpo: `
<h2>Acrescentar: empilhar</h2>
<p><strong>Acrescentar Consultas</strong> (Página Inicial, Combinar) coloca as linhas de uma tabela embaixo da outra: vendas da loja 1 + vendas da loja 2. As colunas são casadas pelo <strong>nome</strong>, então padronize os cabeçalhos antes.</p>

<h2>Importar uma pasta inteira</h2>
<p>Um arquivo por mês numa pasta? Use Obter Dados, De Arquivo, <strong>De Pasta</strong>, e Combinar. O Power Query aplica as mesmas etapas a cada arquivo e empilha tudo. No mês seguinte, basta jogar o arquivo novo na pasta e atualizar. A coluna <code>Source.Name</code> diz de qual arquivo veio cada linha.</p>
${dica('Na pasta, deixe só os arquivos de dados. Um arquivo temporário do Excel aberto (~$vendas.xlsx) ou uma planilha com outro formato quebra a combinação. Filtre a coluna Extension e Name antes de combinar.')}

<h2>Mesclar: juntar pelo código</h2>
<p><strong>Mesclar Consultas</strong> junta duas tabelas por uma coluna em comum, como um PROCX, mas para a tabela inteira. Escolha a coluna-chave nas duas tabelas e o <strong>tipo de junção</strong>:</p>
<ul>
  <li><strong>Externa esquerda</strong> (a mais comum): todas as linhas da primeira, com os dados da segunda quando houver par.</li>
  <li><strong>Interna</strong>: só as linhas que têm par nas duas.</li>
  <li><strong>Anti esquerda</strong>: só as linhas da primeira <em>sem</em> par. Ótima para achar problemas: vendas com código de produto que não existe no cadastro.</li>
  <li>Externa completa, direita e anti direita completam a família.</li>
</ul>
<p>Depois de mesclar, aparece uma coluna com tabelas dentro: clique no ícone de expandir e escolha as colunas que quer trazer (desmarque "Usar o nome da coluna original como prefixo").</p>
${trecho(`= Table.NestedJoin(Vendas, {"Código"}, Produtos, {"Código"}, "Produtos", JoinKind.LeftOuter)
= Table.ExpandTableColumn(#"Consultas Mescladas", "Produtos", {"Produto", "Categoria", "Preço"})`)}
${dica('Se a mesclagem traz menos pares do que deveria, compare as chaves: tipos diferentes (número de um lado, texto do outro), espaços e maiúsculas fazem "CAF01" e "caf01 " não casarem.')}
`,
              quiz: [
                {
                  pergunta: 'Você tem a mesma planilha de vendas de 12 meses em 12 arquivos. Como juntar?',
                  opcoes: ['Mesclar', 'Obter dados De Pasta e combinar', 'Copiar e colar'],
                  certa: 1,
                  explicacao: 'A importação de pasta empilha todos e inclui os arquivos novos a cada atualização.'
                },
                {
                  pergunta: 'Qual junção mostra as vendas com código de produto inexistente no cadastro?',
                  opcoes: ['Interna', 'Anti esquerda', 'Externa completa'],
                  certa: 1,
                  explicacao: 'Anti esquerda: linhas da primeira tabela sem par na segunda.'
                },
                {
                  pergunta: 'Acrescentar consultas casa as colunas por quê?',
                  opcoes: ['Pela posição', 'Pelo nome do cabeçalho', 'Pelo tipo'],
                  certa: 1,
                  explicacao: '"Valor" e "valor " viram duas colunas diferentes. Padronize antes.'
                }
              ]
            },
            {
              id: 'agrupar-e-despivotar',
              titulo: 'Agrupar e despivotar',
              resumo: 'Resumir com Agrupar Por e transformar colunas de meses em linhas.',
              minutos: 12,
              corpo: `
<h2>Agrupar Por</h2>
<p>Resume a tabela, como uma tabela dinâmica que vira tabela de dados: total por categoria, quantidade de pedidos por cliente, primeira e última compra. Em Página Inicial, <strong>Agrupar Por</strong>, modo Avançado para várias colunas e várias agregações.</p>
${trecho(`= Table.Group(Vendas, {"Cliente"}, {
    {"Pedidos", each Table.RowCount(_), Int64.Type},
    {"Total", each List.Sum([Valor]), type number},
    {"Última compra", each List.Max([Data]), type date}
})`)}

<h2>Despivotar: o formato que as ferramentas entendem</h2>
<p>Planilhas feitas para leitura costumam ter um mês por coluna. Para analisar (somar por período, fazer gráfico de evolução, ligar com um calendário), o formato certo é <strong>longo</strong>: uma coluna para o mês e outra para o valor.</p>
${tabela(
  ['Produto', 'jan', 'fev', 'mar'],
  [
    ['Café', '120', '135', '150'],
    ['Chá', '40', '38', '52']
  ]
)}
<p>Selecione a coluna Produto e use Transformar, <strong>Despivotar Outras Colunas</strong>:</p>
${tabela(
  ['Produto', 'Atributo', 'Valor'],
  [
    ['Café', 'jan', '120'],
    ['Café', 'fev', '135'],
    ['Café', 'mar', '150'],
    ['Chá', 'jan', '40'],
    ['Chá', 'fev', '38'],
    ['Chá', 'mar', '52']
  ]
)}
<p>"Despivotar <em>outras</em> colunas" é melhor que selecionar os meses: quando abril aparecer, ele entra sozinho. Renomeie Atributo para Mês e o resultado está pronto para qualquer análise.</p>
<p><strong>Pivotar</strong> faz o caminho inverso, útil no fim, para montar uma tabela de apresentação.</p>
${dica('Regra prática: se você está prestes a escrever a mesma fórmula para jan, fev, mar... os dados estão no formato largo. Despivote primeiro.')}
`,
              quiz: [
                {
                  pergunta: 'Uma planilha tem uma coluna para cada mês. Qual operação deixa ela pronta para análise?',
                  opcoes: ['Pivotar', 'Despivotar outras colunas', 'Transpor'],
                  certa: 1,
                  explicacao: 'Cada combinação produto + mês vira uma linha, com o valor numa coluna só.'
                },
                {
                  pergunta: 'Por que "Despivotar outras colunas" em vez de selecionar os meses?',
                  opcoes: ['É mais rápido', 'Meses novos entram sozinhos na próxima atualização', 'Não há diferença'],
                  certa: 1,
                  explicacao: 'A etapa guarda as colunas que ficam fixas, não a lista de meses.'
                },
                {
                  pergunta: 'O que Table.RowCount(_) calcula dentro do Agrupar Por?',
                  opcoes: ['A soma', 'Quantas linhas há em cada grupo', 'O número da linha'],
                  certa: 1,
                  explicacao: 'O _ é a tabelinha de cada grupo.'
                }
              ]
            },
            {
              id: 'pratica-consolidar',
              titulo: 'Prática: consolidar lojas',
              resumo: 'Empilhe, despivote, mescle e agrupe numa consulta só.',
              minutos: 25,
              corpo: `
<p>Crie as três tabelas abaixo numa planilha do Excel (cada uma como Tabela, com os nomes indicados) e use Dados, De Tabela/Intervalo para levar cada uma ao Power Query.</p>
<h2>tbLojaCentro</h2>
${tabela(
  ['Código', 'jan', 'fev', 'mar'],
  [
    ['CAF01', '30', '28', '35'],
    ['CAN02', '12', '15', '9']
  ]
)}
<h2>tbLojaNorte</h2>
${tabela(
  ['Código', 'jan', 'fev', 'mar'],
  [
    ['CAF01', '18', '22', '20'],
    ['MOE03', '2', '1', '4']
  ]
)}
<h2>tbProdutos</h2>
${tabela(
  ['Código', 'Produto', 'Preço'],
  [
    ['CAF01', 'Café em grãos', '62,90'],
    ['CAN02', 'Caneca', '34,50'],
    ['MOE03', 'Moedor', '149,00']
  ]
)}
<h2>Tarefas</h2>
<ol>
  <li>Nas duas lojas, acrescente uma coluna <strong>Loja</strong> com o nome da loja (Centro e Norte).</li>
  <li>Acrescente uma consulta na outra, formando uma tabela única.</li>
  <li>Despivote os meses: colunas Mês e Quantidade.</li>
  <li>Mescle com tbProdutos para trazer o Preço, e crie a coluna Faturamento.</li>
  <li>Agrupe por Loja somando o Faturamento. Confira: o Centro faturou <strong>R$ 7.091,70</strong>.</li>
</ol>
${resposta(`
<ol>
  <li>Em cada consulta: Adicionar Coluna, Coluna Personalizada, nome Loja, fórmula <code>"Centro"</code> (e <code>"Norte"</code> na outra).</li>
  <li>Página Inicial, Acrescentar Consultas como Nova, escolha as duas lojas.</li>
  <li>Selecione Código e Loja, Transformar, Despivotar Outras Colunas. Renomeie Atributo para Mês e Valor para Quantidade.</li>
  <li>Mesclar Consultas com tbProdutos pela coluna Código (externa esquerda), expanda só o Preço. Coluna Personalizada: <code>[Quantidade] * [Preço]</code>, tipo número decimal.</li>
  <li>Agrupar Por Loja, nova coluna Faturamento, operação Soma de Faturamento. Centro: café (30 + 28 + 35 = 93) × 62,90 = 5.849,70 e caneca (12 + 15 + 9 = 36) × 34,50 = 1.242,00, total de <strong>R$ 7.091,70</strong>. Norte: café 60 × 62,90 = 3.774,00 e moedor 7 × 149,00 = 1.043,00, total de <strong>R$ 4.817,00</strong>.</li>
</ol>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que criar a coluna Loja antes de acrescentar?',
                  opcoes: [
                    'É obrigatório',
                    'Depois de empilhar, não dá mais para saber de que loja veio cada linha',
                    'Para ordenar'
                  ],
                  certa: 1,
                  explicacao: 'Marque a origem enquanto as tabelas ainda estão separadas.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'A linguagem M, parâmetros, funções próprias e desempenho.',
      modulos: [
        {
          titulo: 'Linguagem M',
          itens: [
            {
              id: 'linguagem-m',
              titulo: 'A linguagem M',
              resumo: 'let e in, etapas, each, listas, registros e o Editor Avançado.',
              minutos: 13,
              corpo: `
<p>Por trás de cada consulta há um programa em <strong>M</strong>, visível em Página Inicial, <strong>Editor Avançado</strong>. Ler e ajustar M resolve o que os botões não resolvem.</p>
${trecho(`let
    Fonte = Excel.CurrentWorkbook(){[Name="tbVendas"]}[Content],
    Tipos = Table.TransformColumnTypes(Fonte, {{"Data", type date}, {"Valor", type number}}),
    SoOutubro = Table.SelectRows(Tipos, each Date.Month([Data]) = 10),
    ComImposto = Table.AddColumn(SoOutubro, "Com imposto", each [Valor] * 1.1, type number)
in
    ComImposto`)}
<ul>
  <li><code>let</code> lista as etapas; cada uma tem um nome e usa a anterior. <code>in</code> diz qual é o resultado.</li>
  <li>Nomes com espaço ou acento ficam entre <code>#"..."</code>: <code>#"Tipo Alterado"</code>.</li>
  <li><code>each</code> cria uma função para cada linha; dentro dela, <code>[Valor]</code> é a coluna Valor daquela linha. <code>each [Valor] &gt; 0</code> é um atalho para <code>(linha) =&gt; linha[Valor] &gt; 0</code>.</li>
  <li>M diferencia <strong>maiúsculas e minúsculas</strong>: <code>table.selectrows</code> não existe.</li>
</ul>

<h2>Os tipos de valor</h2>
<ul>
  <li><strong>Lista</strong>: <code>{1, 2, 3}</code>, <code>{"a".."e"}</code>. Uma coluna é uma lista: <code>Fonte[Valor]</code>.</li>
  <li><strong>Registro</strong>: <code>[Nome = "Ana", Idade = 28]</code>. Uma linha é um registro: <code>Fonte{0}</code> é a primeira.</li>
  <li><strong>Tabela</strong>: a estrela do Power Query.</li>
  <li><code>null</code>: valor vazio. Comparar com <code>null</code> dá <code>null</code>, então use <code>[Valor] = null</code> ou <code>?? 0</code> para trocar por um padrão.</li>
</ul>

<h2>Funções úteis que não têm botão</h2>
${trecho(`Text.Proper("ana SOUZA")                         // "Ana Souza"
Text.Select("(41) 99999-0000", {"0".."9"})          // "41999990000": só os dígitos
List.Sum(Fonte[Valor])                              // soma de uma coluna
Date.EndOfMonth(#date(2026, 2, 10))                 // 28/02/2026
try Number.From([Texto]) otherwise null             // converte, e vira null se não der`)}
${dica('Funções do M estão documentadas em learn.microsoft.com. A organização em "pastas" ajuda a adivinhar: Text.*, Number.*, Date.*, List.*, Table.*, Record.*.')}
`,
              quiz: [
                {
                  pergunta: 'O que a parte in de uma consulta M define?',
                  opcoes: ['A primeira etapa', 'Qual etapa é o resultado da consulta', 'A fonte de dados'],
                  certa: 1,
                  explicacao: 'Normalmente é a última etapa, mas pode ser qualquer uma.'
                },
                {
                  pergunta: 'O que each [Valor] > 0 significa?',
                  opcoes: [
                    'Uma coluna nova',
                    'Uma função que, para cada linha, confere se o Valor dela é maior que zero',
                    'Um erro de sintaxe'
                  ],
                  certa: 1,
                  explicacao: 'each é o atalho para criar uma função por linha.'
                },
                {
                  pergunta: 'Table.selectRows funciona?',
                  opcoes: [
                    'Sim',
                    'Não: M diferencia maiúsculas e minúsculas, o nome é Table.SelectRows',
                    'Só no Power BI'
                  ],
                  certa: 1,
                  explicacao: 'Escreva os nomes exatamente como na documentação.'
                }
              ]
            },
            {
              id: 'parametros-e-desempenho',
              titulo: 'Parâmetros, funções e desempenho',
              resumo: 'Caminhos configuráveis, funções próprias, dobragem de consulta e erros.',
              minutos: 12,
              corpo: `
<h2>Parâmetros</h2>
<p>Um caminho como <code>C:\\Users\\ana\\Desktop\\vendas.xlsx</code> escrito na consulta quebra no computador de outra pessoa. Crie um <strong>parâmetro</strong> (Página Inicial, Gerenciar Parâmetros) com o caminho e use-o na fonte. Para mudar, edita-se um lugar só. Os painéis de exemplo deste portfólio fazem exatamente isso com o parâmetro <code>CaminhoPlanilha</code>.</p>
${trecho(`Fonte = Excel.Workbook(File.Contents(CaminhoPlanilha), null, true)`)}

<h2>Funções próprias</h2>
<p>Uma consulta pode virar uma função que outras chamam. É o que o "Combinar arquivos" de uma pasta faz por baixo dos panos:</p>
${trecho(`// Consulta chamada LimparTelefone
(texto as nullable text) as nullable text =>
    let
        Digitos = Text.Select(texto ?? "", {"0".."9"}),
        Formatado = if Text.Length(Digitos) = 11
            then "(" & Text.Start(Digitos, 2) & ") " & Text.Middle(Digitos, 2, 5) & "-" & Text.End(Digitos, 4)
            else null
    in
        Formatado

// Em outra consulta:
= Table.TransformColumns(Clientes, {{"Telefone", LimparTelefone, type text}})`)}

<h2>Desempenho</h2>
<ul>
  <li><strong>Dobragem de consulta</strong> (<em>query folding</em>): com bancos de dados, o Power Query traduz as etapas em SQL e o banco faz o trabalho. Clique com o botão direito numa etapa: se "Exibir Consulta Nativa" estiver disponível, ela está dobrando. Filtre e remova colunas <strong>cedo</strong>, enquanto ainda dobra.</li>
  <li>Em arquivos, também vale filtrar e remover colunas no começo: menos dados passando por todas as outras etapas.</li>
  <li><strong>Referência</strong> (botão direito, Referência) cria uma consulta nova a partir do resultado de outra; <strong>Duplicar</strong> copia todas as etapas. Prefira referência quando várias consultas partem da mesma limpeza: a limpeza fica num lugar só.</li>
  <li>Consultas auxiliares que não precisam aparecer: botão direito, desmarque <strong>Habilitar Carregamento</strong>.</li>
</ul>

<h2>Erros</h2>
<p>Células com <strong>Error</strong> aparecem quando uma conversão falha. Antes de "Remover Erros", entenda a causa: clique na célula e leia a mensagem. Remover erros às cegas é jogar dados fora em silêncio. Uma etapa de verificação (uma consulta que lista as linhas com erro e é revisada a cada atualização) evita surpresas.</p>
${dica('Para conferir o resultado, compare um total do Power Query com o total do sistema de origem. Uma diferença de centavos costuma ser arredondamento; de milhares, uma linha perdida no caminho.')}
`,
              quiz: [
                {
                  pergunta: 'Por que usar um parâmetro para o caminho do arquivo?',
                  opcoes: [
                    'Fica mais rápido',
                    'O caminho muda num lugar só, e a consulta funciona em outro computador',
                    'É obrigatório no Power BI'
                  ],
                  certa: 1,
                  explicacao: 'Caminhos fixos com o nome do seu usuário quebram em qualquer outra máquina.'
                },
                {
                  pergunta: 'O que é dobragem de consulta?',
                  opcoes: [
                    'Duplicar a consulta',
                    'O Power Query traduzir as etapas para a linguagem da fonte (SQL) e o banco fazer o trabalho',
                    'Agrupar linhas'
                  ],
                  certa: 1,
                  explicacao: 'Por isso filtros e remoção de colunas devem vir cedo.'
                },
                {
                  pergunta: 'Várias consultas partem da mesma limpeza. O que usar?',
                  opcoes: ['Duplicar', 'Referência', 'Copiar e colar o M'],
                  certa: 1,
                  explicacao: 'Com referência, a limpeza fica num lugar só.'
                }
              ]
            },
            {
              id: 'pratica-funcao',
              titulo: 'Prática: uma função de limpeza',
              resumo: 'Escreva em M uma função que padroniza nomes de cidades.',
              minutos: 20,
              corpo: `
<p>Um cadastro de clientes chegou assim. Crie uma Tabela <code>tbClientes</code> com estes dados e leve ao Power Query:</p>
${tabela(
  ['Cliente', 'Cidade'],
  [
    ['Ana', '  curitiba - pr'],
    ['Bruno', 'SAO PAULO/SP'],
    ['Carla', 'Curitiba-PR '],
    ['Diego', 'recife - PE'],
    ['Elisa', 'São Paulo - sp']
  ]
)}
<h2>Tarefas</h2>
<ol>
  <li>Crie uma consulta em branco chamada <code>PadronizarCidade</code> com uma função que recebe o texto e devolve um <strong>registro</strong> com <code>Cidade</code> (em "Título Próprio", sem espaços sobrando) e <code>UF</code> (duas letras maiúsculas). Considere que a UF são sempre os dois últimos caracteres.</li>
  <li>Corrija "Sao Paulo" para "São Paulo" dentro da função.</li>
  <li>Use a função em <code>tbClientes</code> para criar as colunas Cidade e UF.</li>
  <li>Agrupe por Cidade e UF contando os clientes: devem sair 3 grupos (Curitiba 2, São Paulo 2, Recife 1).</li>
</ol>
${resposta(`
${trecho(`// Consulta PadronizarCidade (Página Inicial, Nova Fonte, Consulta Nula, e cole no Editor Avançado)
(texto as text) as record =>
    let
        Limpo = Text.Trim(texto),
        UF = Text.Upper(Text.End(Limpo, 2)),
        Resto = Text.Start(Limpo, Text.Length(Limpo) - 2),
        SemSeparador = Text.Trim(Text.TrimEnd(Text.Trim(Resto), {"-", "/"})),
        Nome = Text.Proper(SemSeparador),
        Corrigido = if Nome = "Sao Paulo" then "São Paulo" else Nome
    in
        [Cidade = Corrigido, UF = UF]

// Em tbClientes:
ComRegistro = Table.AddColumn(Fonte, "Local", each PadronizarCidade([Cidade])),
SemOriginal = Table.RemoveColumns(ComRegistro, {"Cidade"}),
Expandido = Table.ExpandRecordColumn(SemOriginal, "Local", {"Cidade", "UF"}),
Grupos = Table.Group(Expandido, {"Cidade", "UF"}, {{"Clientes", each Table.RowCount(_), Int64.Type}})`)}
<p>O truque é tirar a UF primeiro (os dois últimos caracteres) e depois limpar o que sobrou: espaços, hífen ou barra no fim, e maiúsculas. Uma função que devolve um registro permite criar duas colunas de uma vez com <code>Table.ExpandRecordColumn</code>.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que a função devolve um registro [Cidade = ..., UF = ...]?',
                  opcoes: [
                    'É obrigatório em M',
                    'Para criar duas colunas de uma vez, expandindo o registro',
                    'Para ficar mais rápido'
                  ],
                  certa: 1,
                  explicacao: 'Um valor por coluna exigiria chamar a função duas vezes.'
                }
              ]
            }
          ]
        },
        {
          titulo: 'APIs e calendário',
          itens: [
            {
              id: 'web-e-apis',
              titulo: 'Dados da web e de APIs',
              resumo: 'Web.Contents, Json.Document, paginação e cuidados com chaves e atualização.',
              minutos: 12,
              corpo: `
<p>Além de arquivos, o Power Query lê <strong>páginas da web</strong> (tabelas HTML) e <strong>APIs</strong> que devolvem JSON. Em Obter Dados, <strong>Da Web</strong>, cole o endereço.</p>

<h2>Uma API em JSON</h2>
${trecho(`let
    Resposta = Json.Document(Web.Contents("https://viacep.com.br/ws/80010000/json/")),
    Tabela = Table.FromRecords({Resposta}),
    Colunas = Table.SelectColumns(Tabela, {"cep", "logradouro", "localidade", "uf"})
in
    Colunas`)}
<ul>
  <li><code>Web.Contents</code> baixa a resposta; <code>Json.Document</code> transforma o JSON em registros e listas do M.</li>
  <li>Um objeto JSON vira um <strong>registro</strong>; uma lista de objetos vira uma lista de registros, que <code>Table.FromRecords</code> transforma em tabela.</li>
  <li>Campos aninhados aparecem como colunas de registro ou de lista: expanda com o botão do cabeçalho.</li>
</ul>

<h2>Parâmetros, cabeçalhos e chaves</h2>
<p>Separe o endereço fixo das partes que mudam, usando <code>RelativePath</code> e <code>Query</code>. Além de mais legível, isso permite que o Serviço do Power BI atualize a consulta (endereços montados com texto, às vezes, não são aceitos na atualização agendada):</p>
${trecho(`Web.Contents("https://api.exemplo.com", [
    RelativePath = "v1/vendas",
    Query = [mes = "2026-10", pagina = "1"],
    Headers = [Accept = "application/json"],
    ApiKeyName = "api_key"           // a chave fica nas credenciais da fonte, não no código
])`)}
${dica('Nunca escreva uma chave de API no código M: quem abre o arquivo vê tudo. Use as credenciais da fonte de dados (o Power Query pergunta na primeira vez) ou um parâmetro que não vai junto quando o arquivo é compartilhado.')}

<h2>Paginação</h2>
<p>APIs costumam devolver os dados em páginas (100 itens por vez). <code>List.Generate</code> busca página por página até vir uma vazia:</p>
${trecho(`let
    Pagina = (n as number) => Json.Document(Web.Contents("https://api.exemplo.com",
        [RelativePath = "v1/vendas", Query = [pagina = Text.From(n)]])),
    Paginas = List.Generate(
        () => [n = 1, dados = Pagina(1)],
        each List.Count([dados]) > 0,
        each [n = [n] + 1, dados = Pagina([n] + 1)],
        each [dados]
    ),
    Tudo = Table.FromRecords(List.Combine(Paginas))
in
    Tudo`)}

<h2>Tabelas de páginas</h2>
<p>Para uma tabela HTML (cotações, rankings, a lista de feriados de um site oficial), Obter Dados, Da Web, mostra as tabelas encontradas na página. É frágil: se o site mudar o layout, a consulta quebra. Prefira uma API ou um arquivo para download quando houver.</p>
`,
              quiz: [
                {
                  pergunta: 'O que Json.Document faz?',
                  opcoes: [
                    'Baixa o arquivo',
                    'Transforma o texto JSON em registros e listas do M',
                    'Cria uma tabela HTML'
                  ],
                  certa: 1,
                  explicacao: 'Quem baixa é o Web.Contents.'
                },
                {
                  pergunta: 'Onde deve ficar a chave de uma API?',
                  opcoes: [
                    'No código M, para não esquecer',
                    'Nas credenciais da fonte de dados',
                    'No nome da consulta'
                  ],
                  certa: 1,
                  explicacao: 'Assim ela não vai junto quando o arquivo é compartilhado.'
                },
                {
                  pergunta: 'Para que serve List.Generate na paginação?',
                  opcoes: [
                    'Ordenar as páginas',
                    'Repetir a busca página a página enquanto vierem dados',
                    'Gerar dados aleatórios'
                  ],
                  certa: 1,
                  explicacao: 'Ele funciona como um laço: estado inicial, condição, próximo passo e o que guardar.'
                }
              ]
            },
            {
              id: 'calendario-em-m',
              titulo: 'Um calendário feito em M',
              resumo: 'List.Dates, colunas de data em português e marcação de dias úteis e feriados.',
              minutos: 12,
              corpo: `
<p>Toda análise no tempo precisa de uma tabela calendário (a trilha de Power BI explica por quê). Ela pode ser feita em DAX, mas fazer em M tem vantagens: dá para juntar com uma tabela de feriados, reaproveitar no Excel e controlar tudo num lugar.</p>
${trecho(`let
    Inicio = #date(2026, 1, 1),
    Fim = #date(2026, 12, 31),
    Dias = List.Dates(Inicio, Duration.Days(Fim - Inicio) + 1, #duration(1, 0, 0, 0)),
    Tabela = Table.FromList(Dias, Splitter.SplitByNothing(), {"Data"}, null, ExtraValues.Error),
    Tipo = Table.TransformColumnTypes(Tabela, {{"Data", type date}}),
    Ano = Table.AddColumn(Tipo, "Ano", each Date.Year([Data]), Int64.Type),
    Mes = Table.AddColumn(Ano, "Mês", each Date.Month([Data]), Int64.Type),
    NomeMes = Table.AddColumn(Mes, "Nome do mês", each Text.Proper(Date.MonthName([Data], "pt-BR")), type text),
    AnoMes = Table.AddColumn(NomeMes, "Ano-Mês", each Date.ToText([Data], "yyyy-MM"), type text),
    DiaSemana = Table.AddColumn(AnoMes, "Dia da semana", each Date.DayOfWeek([Data], Day.Monday) + 1, Int64.Type),
    FimDeSemana = Table.AddColumn(DiaSemana, "Fim de semana", each [Dia da semana] >= 6, type logical)
in
    FimDeSemana`)}
<ul>
  <li><code>List.Dates</code> gera a lista de datas: início, quantidade e o passo (um dia).</li>
  <li><code>Date.DayOfWeek([Data], Day.Monday)</code> devolve 0 para segunda; somando 1, segunda é 1 e domingo é 7, como no Brasil.</li>
  <li>O <code>"pt-BR"</code> no <code>Date.MonthName</code> garante os nomes em português em qualquer computador.</li>
</ul>

<h2>Feriados e dias úteis</h2>
<p>Com uma consulta <code>Feriados</code> (de uma planilha ou de uma API), uma mesclagem marca os feriados, e o dia útil vira uma coluna:</p>
${trecho(`ComFeriado = Table.AddColumn(FimDeSemana, "Feriado", each List.Contains(Feriados[Data], [Data]), type logical),
DiaUtil = Table.AddColumn(ComFeriado, "Dia útil", each not [Fim de semana] and not [Feriado], type logical)`)}
<p>No Power BI, uma medida simples conta os dias úteis de qualquer período filtrado: <code>Dias úteis = CALCULATE(COUNTROWS(dCalendario), dCalendario[Dia útil] = TRUE())</code>.</p>
${dica('Gere o calendário a partir das datas dos seus dados (List.Min e List.Max da coluna de data da fato, indo do início do primeiro ano ao fim do último). Assim ele nunca fica curto quando entram dados novos.')}
`,
              quiz: [
                {
                  pergunta: 'O que List.Dates(#date(2026,1,1), 365, #duration(1,0,0,0)) gera?',
                  opcoes: ['Uma data', 'As 365 datas de 2026, uma por dia', 'Um erro'],
                  certa: 1,
                  explicacao: 'Início, quantidade e o passo entre as datas.'
                },
                {
                  pergunta: 'Por que passar "pt-BR" em Date.MonthName?',
                  opcoes: [
                    'Para formatar como número',
                    'Para os nomes saírem em português em qualquer computador',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'Sem a cultura, vale a do sistema de quem atualiza.'
                },
                {
                  pergunta: 'Como gerar o calendário de modo que ele acompanhe os dados?',
                  opcoes: [
                    'Digitando o ano todo ano',
                    'A partir da menor e da maior data da tabela de fatos',
                    'Com 100 anos fixos'
                  ],
                  certa: 1,
                  explicacao: 'O intervalo se ajusta sozinho a cada atualização.'
                }
              ]
            },
            {
              id: 'pratica-calendario',
              titulo: 'Prática: calendário com dias úteis',
              resumo: 'Gere o calendário de 2026, marque feriados e conte os dias úteis por mês.',
              minutos: 25,
              corpo: `
<p>Crie no Excel uma Tabela <code>tbFeriados</code> com os feriados nacionais do segundo semestre de 2026 e leve ao Power Query como a consulta <code>Feriados</code>:</p>
${tabela(
  ['Data', 'Feriado'],
  [
    ['07/09/2026', 'Independência'],
    ['12/10/2026', 'Nossa Senhora Aparecida'],
    ['02/11/2026', 'Finados'],
    ['15/11/2026', 'Proclamação da República'],
    ['20/11/2026', 'Dia Nacional de Zumbi e da Consciência Negra'],
    ['25/12/2026', 'Natal']
  ]
)}
<h2>Tarefas</h2>
<ol>
  <li>Gere a consulta <code>Calendario</code> de 2026 com Data, Ano, Mês, Nome do mês, Dia da semana (1 = segunda), Fim de semana, Feriado e Dia útil.</li>
  <li>Agrupe por Mês contando os dias úteis.</li>
  <li>Confira: quantos dias úteis tem <strong>outubro</strong>? E <strong>novembro</strong>?</li>
  <li>Por que o feriado de 15/11 não muda a contagem de novembro?</li>
</ol>
${resposta(`
<ol>
  <li>Use o código da aula até <code>DiaUtil</code>, com a consulta Feriados com a coluna Data como tipo data.</li>
  <li>Agrupar Por Mês, operação Contar Linhas depois de filtrar Dia útil = TRUE (ou Soma de uma coluna 1/0). Em M: <code>Table.Group(Table.SelectRows(DiaUtil, each [Dia útil]), {"Mês"}, {{"Dias úteis", each Table.RowCount(_), Int64.Type}})</code>.</li>
  <li><strong>Outubro: 21</strong>. O mês começa numa quinta-feira e tem 22 dias de segunda a sexta; o dia 12 (uma segunda) é feriado. <strong>Novembro: 19</strong>. Começa num domingo e tem 21 dias de segunda a sexta; saem 02/11 (segunda) e 20/11 (sexta).</li>
  <li>Porque 15/11/2026 cai num <strong>domingo</strong>: já não era dia útil. A coluna Dia útil exige que não seja fim de semana <em>e</em> não seja feriado, então nada muda.</li>
</ol>`)}
`,
              quiz: [
                {
                  pergunta: 'O que a coluna Dia útil precisa conferir?',
                  opcoes: ['Só se não é feriado', 'Que não é fim de semana e não é feriado', 'Só se não é domingo'],
                  certa: 1,
                  explicacao: 'As duas condições juntas, com and.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
