// Trilha da Linguagem M. Sem editor: o código é para colar no Editor Avançado do Power Query (Excel: Dados, Obter
// Dados, Consulta em Branco; Power BI: Transformar dados, Nova Fonte, Consulta Nula). Aprofunda a parte de M da
// trilha de Power Query: a linguagem em si, sem depender dos botões. Os nomes das funções do M são sempre em inglês.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'linguagem-m',
  area: 'Dados e BI',
  titulo: 'Linguagem M',
  sigla: 'M',
  resumo:
    'A linguagem por trás do Power Query: valores, listas, registros, funções e consultas que se escrevem sozinhas.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Valores, tipos, let e os três tipos estruturados.',
      modulos: [
        {
          titulo: 'Os fundamentos',
          itens: [
            {
              id: 'valores-e-let',
              titulo: 'Valores, tipos e let',
              resumo: 'Como uma consulta M é avaliada, os tipos primitivos, operadores e if.',
              minutos: 10,
              corpo: `
<p>Toda consulta do Power Query é um programa em <strong>M</strong> (oficialmente, Power Query Formula Language). Os botões só escrevem M por você. Saber a linguagem permite fazer o que nenhum botão faz e entender, e consertar, o que os botões escreveram.</p>

<h2>Uma consulta é uma expressão</h2>
<p>Crie uma <strong>consulta em branco</strong> e abra o <strong>Editor Avançado</strong>:</p>
${trecho(`let
    Diaria = 320,
    Noites = 3,
    Subtotal = Diaria * Noites,
    Desconto = if Noites >= 7 then 0.1 else 0,
    Total = Subtotal * (1 - Desconto)
in
    Total`)}
<ul>
  <li><code>let</code> define nomes (as <strong>etapas</strong>), separados por vírgula; <code>in</code> diz qual valor a consulta devolve.</li>
  <li>Não é uma sequência de comandos: é um conjunto de definições. O M calcula só o que o <code>in</code> precisa, na ordem das dependências (é <strong>preguiçoso</strong>).</li>
  <li>Nomes com espaço ou acento usam <code>#"..."</code>: <code>#"Linhas Filtradas"</code>.</li>
  <li>Maiúsculas importam: <code>Total</code> e <code>total</code> são nomes diferentes, e <code>text.upper</code> não existe (é <code>Text.Upper</code>).</li>
</ul>

<h2>Tipos primitivos</h2>
${trecho(`let
    Numero = 19.9,
    Texto = "Pousada",
    Logico = true,
    Nulo = null,
    Data = #date(2026, 12, 24),
    DataHora = #datetime(2026, 12, 24, 14, 0, 0),
    Duracao = #duration(3, 0, 0, 0),           // 3 dias
    Saida = Data + Duracao,                    // 27/12/2026
    Junto = Texto & " " & Text.From(Numero),   // & junta textos (e listas, e registros)
    Comparacao = "a" = "A"                     // false: = compara, não atribui
in
    Saida`)}
<p>O M não converte tipos sozinho: <code>"Total: " &amp; 10</code> dá erro. Use <code>Text.From</code>, <code>Number.From</code>, <code>Date.From</code>.</p>
${dica('Para testar uma expressão rápido, troque o que vem depois do <code>in</code> pela etapa que quer ver. Cada etapa também aparece no painel "Etapas Aplicadas": clique nela para ver seu valor.')}
`,
              quiz: [
                {
                  pergunta: 'O que o in define numa expressão let?',
                  opcoes: ['A primeira etapa', 'O valor que a consulta devolve', 'Um comentário'],
                  certa: 1,
                  explicacao: 'Normalmente é a última etapa, mas pode ser qualquer uma.'
                },
                {
                  pergunta: 'Qual o resultado de "Total: " & 10 em M?',
                  opcoes: ['"Total: 10"', 'Erro: o M não converte número em texto sozinho', '10'],
                  certa: 1,
                  explicacao: 'Use "Total: " & Text.From(10).'
                },
                {
                  pergunta: 'Como se escreve uma etapa chamada Linhas Filtradas?',
                  opcoes: ['Linhas Filtradas', '#"Linhas Filtradas"', '[Linhas Filtradas]'],
                  certa: 1,
                  explicacao: 'Nomes com espaço ou caracteres especiais usam #"...".'
                }
              ]
            },
            {
              id: 'listas-registros-tabelas',
              titulo: 'Listas, registros e tabelas',
              resumo: '{ }, [ ], acessar itens e campos, e como uma tabela é feita dos dois.',
              minutos: 13,
              corpo: `
<h2>Listas: { }</h2>
${trecho(`let
    Precos = {180, 290, 320},
    Item = Precos{0},                 // 180 (começa em 0)
    Seguro = Precos{5}?,              // null em vez de erro, com ?
    Intervalo = {1..10},
    Letras = {"a".."e"},
    Soma = List.Sum(Precos),
    Tamanho = List.Count(Precos)
in
    Soma`)}

<h2>Registros: [ ]</h2>
<p>Um <strong>registro</strong> é um conjunto de campos com nome, como uma linha de tabela:</p>
${trecho(`let
    Quarto = [Nome = "Suíte Mar", Diaria = 320, Capacidade = 2],
    Nome = Quarto[Nome],                       // "Suíte Mar"
    Talvez = Quarto[Vista]?,                   // null, sem erro
    ComVista = Quarto & [Vista = "Mar"],       // acrescenta um campo
    Campos = Record.FieldNames(Quarto)         // {"Nome", "Diaria", "Capacidade"}
in
    ComVista`)}

<h2>Tabelas</h2>
<p>Uma tabela é uma lista de registros com as mesmas colunas. Dá para converter de um para o outro, e acessar linhas e colunas com a mesma sintaxe:</p>
${trecho(`let
    Quartos = Table.FromRecords({
        [Nome = "Standard", Diaria = 180],
        [Nome = "Família", Diaria = 290],
        [Nome = "Suíte Mar", Diaria = 320]
    }),
    Linha = Quartos{1},                        // registro: [Nome = "Família", Diaria = 290]
    Coluna = Quartos[Diaria],                  // lista: {180, 290, 320}
    Celula = Quartos{1}[Diaria],               // 290
    Busca = Quartos{[Nome = "Suíte Mar"]}[Diaria],   // 320: a linha cujo Nome é "Suíte Mar"
    Registros = Table.ToRecords(Quartos)
in
    Celula`)}
<p>Essa é a chave para ler o M dos botões: <code>Fonte{[Item="Vendas",Kind="Sheet"]}[Data]</code> é "na tabela Fonte, a linha cujo Item é Vendas e Kind é Sheet; dela, a coluna Data".</p>
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre {1, 2} e [a = 1, b = 2]?',
                  opcoes: ['Nenhuma', 'O primeiro é uma lista; o segundo, um registro', 'O primeiro é uma tabela'],
                  certa: 1,
                  explicacao: 'Chaves: lista. Colchetes: registro.'
                },
                {
                  pergunta: 'O que Quartos[Diaria] devolve?',
                  opcoes: ['A primeira diária', 'Uma lista com todas as diárias', 'Um registro'],
                  certa: 1,
                  explicacao: 'Tabela[Coluna] é uma lista.'
                },
                {
                  pergunta: 'Para que serve o ? em Lista{5}?',
                  opcoes: [
                    'Devolver null em vez de erro quando o item não existe',
                    'Ordenar a lista',
                    'Perguntar ao usuário'
                  ],
                  certa: 0,
                  explicacao: 'Também funciona em campos: Registro[Campo]?.'
                }
              ]
            },
            {
              id: 'pratica-tabela-na-mao',
              titulo: 'Prática: uma tabela escrita à mão',
              resumo: 'Montar uma tabela em M, com tipos, sem nenhum arquivo de origem.',
              minutos: 20,
              corpo: `
<h2>Tarefas</h2>
<p>Numa consulta em branco, sem usar botões:</p>
<ol>
  <li>Crie uma tabela de feriados nacionais de 2026 com as colunas Data e Nome, a partir de uma lista de registros.</li>
  <li>Defina os tipos das colunas (data e texto).</li>
  <li>Acrescente a coluna DiaDaSemana com o nome do dia em português.</li>
  <li>Devolva também, numa etapa separada, a lista só das datas que caem de segunda a sexta.</li>
</ol>
${resposta(`
${trecho(`let
    Feriados = Table.FromRecords({
        [Data = #date(2026, 1, 1), Nome = "Confraternização Universal"],
        [Data = #date(2026, 4, 3), Nome = "Sexta-feira Santa"],
        [Data = #date(2026, 4, 21), Nome = "Tiradentes"],
        [Data = #date(2026, 5, 1), Nome = "Dia do Trabalho"],
        [Data = #date(2026, 9, 7), Nome = "Independência"],
        [Data = #date(2026, 10, 12), Nome = "Nossa Senhora Aparecida"],
        [Data = #date(2026, 11, 2), Nome = "Finados"],
        [Data = #date(2026, 11, 15), Nome = "Proclamação da República"],
        [Data = #date(2026, 11, 20), Nome = "Consciência Negra"],
        [Data = #date(2026, 12, 25), Nome = "Natal"]
    }),
    Tipada = Table.TransformColumnTypes(Feriados, {{"Data", type date}, {"Nome", type text}}),
    ComDia = Table.AddColumn(Tipada, "DiaDaSemana", each Date.DayOfWeekName([Data], "pt-BR"), type text),
    DiasUteis = List.Select(ComDia[Data], each Date.DayOfWeek(_, Day.Monday) < 5)
in
    ComDia`)}
<p><code>Date.DayOfWeek(_, Day.Monday)</code> conta a partir de segunda (0) até domingo (6), então <code>&lt; 5</code> é de segunda a sexta. Troque o <code>in</code> por <code>DiasUteis</code> para ver a lista. O quarto argumento do <code>Table.AddColumn</code> já define o tipo da coluna nova, sem precisar de outra etapa.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que o último argumento de Table.AddColumn(..., type text) faz?',
                  opcoes: ['Converte a tabela inteira', 'Define o tipo da coluna nova', 'Nada'],
                  certa: 1,
                  explicacao: 'Sem ele, a coluna fica com tipo "any" (ABC123).'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Funções, each, transformar listas e tabelas sem botões.',
      modulos: [
        {
          titulo: 'Funções e transformações',
          itens: [
            {
              id: 'funcoes-e-each',
              titulo: 'Funções, each e _',
              resumo: '(x) =>, parâmetros opcionais, each como atalho e funções como valores.',
              minutos: 13,
              corpo: `
<h2>Funções</h2>
${trecho(`let
    ComDesconto = (valor as number, optional percentual as nullable number) as number =>
        let
            p = if percentual = null then 10 else percentual
        in
            valor * (1 - p / 100),
    A = ComDesconto(200),        // 180
    B = ComDesconto(200, 25)     // 150
in
    B`)}
<p>Uma função é um valor como outro qualquer: pode ser guardada numa etapa, passada como argumento ou devolvida por outra função. Os tipos (<code>as number</code>) são opcionais, mas ajudam a pegar erros e documentam a função.</p>

<h2>each é uma função</h2>
${trecho(`each [Diaria] * 1.1
// é exatamente o mesmo que:
(_) => _[Diaria] * 1.1`)}
<p><code>each</code> cria uma função de um parâmetro chamado <code>_</code>. Dentro dela, <code>[Diaria]</code> é atalho para <code>_[Diaria]</code>. Por isso funciona em <code>Table.AddColumn</code> (o <code>_</code> é a linha) e em <code>List.Transform</code> (o <code>_</code> é o item).</p>
${trecho(`List.Transform({1, 2, 3}, each _ * 10)               // {10, 20, 30}
Table.SelectRows(Quartos, each [Diaria] > 200)      // linhas com diária > 200
List.Transform({"ana", "bruno"}, Text.Proper)        // passa a função direto, sem each`)}

<h2>Quando each não basta</h2>
<p>Funções dentro de funções com <code>each</code> brigam pelo <code>_</code>. Dê nomes:</p>
${trecho(`// Para cada pedido, somar os itens cuja categoria está na lista do pedido
Table.AddColumn(Pedidos, "Total", (pedido) =>
    List.Sum(
        Table.SelectRows(Itens, (item) => List.Contains(pedido[Categorias], item[Categoria]))[Valor]
    )
)`)}
`,
              quiz: [
                {
                  pergunta: 'O que each [Valor] * 2 significa?',
                  opcoes: ['Multiplicar a coluna inteira de uma vez', 'Uma função (_) => _[Valor] * 2', 'Um laço for'],
                  certa: 1,
                  explicacao: 'each é açúcar sintático para uma função de um parâmetro.'
                },
                {
                  pergunta: 'Por que List.Transform(lista, Text.Proper) funciona sem each?',
                  opcoes: ['Por sorte', 'Text.Proper já é uma função de um argumento', 'Não funciona'],
                  certa: 1,
                  explicacao: 'Funções são valores e podem ser passadas direto.'
                },
                {
                  pergunta: 'Quando trocar each por (nome) => ...?',
                  opcoes: ['Nunca', 'Quando há funções dentro de funções e o _ ficaria ambíguo', 'Sempre'],
                  certa: 1,
                  explicacao: 'Nomes deixam claro quem é quem.'
                }
              ]
            },
            {
              id: 'transformar-sem-botoes',
              titulo: 'Transformar listas e tabelas',
              resumo: 'List.Accumulate, List.Generate, Table.TransformColumns, Table.Group e renomear em massa.',
              minutos: 15,
              corpo: `
<h2>Mexer em todas as colunas de uma vez</h2>
${trecho(`// Limpar espaços de todas as colunas de texto, sem listar uma a uma
let
    Fonte = Excel.CurrentWorkbook(){[Name = "Vendas"]}[Content],
    ColunasTexto = Table.ColumnsOfType(Fonte, {type nullable text}),
    Limpa = Table.TransformColumns(Fonte, List.Transform(ColunasTexto, each {_, Text.Trim, type text})),

    // Renomear todas: minúsculas e sem espaços
    Renomeada = Table.TransformColumnNames(Limpa, each Text.Lower(Text.Replace(_, " ", "_")))
in
    Renomeada`)}
<p>Este é o grande ganho de escrever M: uma consulta que não quebra quando aparece uma coluna nova, porque não tem os nomes das colunas fixos no código.</p>

<h2>Agrupar com o que quiser</h2>
${trecho(`Table.Group(Vendas, {"Vendedor"}, {
    {"Total", each List.Sum([Valor]), type number},
    {"Pedidos", each Table.RowCount(_), Int64.Type},
    {"Maior", each List.Max([Valor]), type number},
    {"Produtos", each Text.Combine(List.Distinct([Produto]), ", "), type text},
    {"Ultima", each Table.Max(_, "Data")[Data], type date}
})`)}
<p>Dentro de cada agregação, <code>_</code> é a <strong>subtabela</strong> do grupo. Qualquer função que receba uma tabela serve.</p>

<h2>Acumular e gerar</h2>
${trecho(`// List.Accumulate: percorre a lista levando um valor junto (como um "reduce")
List.Accumulate({100, -30, 50}, 1000, (saldo, mov) => saldo + mov)      // 1120

// Trocar vários textos de uma vez com uma tabela de/para
List.Accumulate(
    Table.ToRows(DePara),            // {{"S.P.", "São Paulo"}, {"Rj", "Rio de Janeiro"}}
    [Cidade],
    (texto, par) => Text.Replace(texto, par{0}, par{1})
)

// List.Generate: um laço com estado inicial, condição, próximo passo e saída
List.Generate(
    () => [mes = 1, valor = 1000],
    each [mes] <= 12,
    each [mes = [mes] + 1, valor = [valor] * 1.01],
    each [valor]
)   // 12 valores rendendo 1% ao mês`)}
`,
              quiz: [
                {
                  pergunta: 'Qual a vantagem de usar Table.ColumnsOfType em vez de listar as colunas?',
                  opcoes: ['Nenhuma', 'A consulta continua funcionando quando colunas novas aparecem', 'É obrigatório'],
                  certa: 1,
                  explicacao: 'Código que não depende de nomes fixos é mais robusto.'
                },
                {
                  pergunta: 'Dentro de uma agregação do Table.Group, o que é _?',
                  opcoes: ['A tabela inteira', 'A subtabela das linhas daquele grupo', 'A primeira linha'],
                  certa: 1,
                  explicacao: 'Por isso [Valor] ali é a lista dos valores do grupo.'
                },
                {
                  pergunta: 'Quanto dá List.Accumulate({1, 2, 3}, 10, (s, x) => s + x)?',
                  opcoes: ['6', '16', '10'],
                  certa: 1,
                  explicacao: 'Começa em 10 e soma cada item.'
                }
              ]
            },
            {
              id: 'pratica-de-para',
              titulo: 'Prática: padronizar com uma tabela de/para',
              resumo: 'Uma função que limpa qualquer coluna usando uma tabela de correções.',
              minutos: 30,
              corpo: `
<p>Crie no Excel duas tabelas (Inserir, Tabela) e dê os nomes <strong>Clientes</strong> e <strong>DePara</strong>:</p>
${trecho(`Clientes                         DePara
Nome           Cidade            Errado        Certo
ana  silva     sao paulo         sao paulo     São Paulo
BRUNO COSTA    S. Paulo          s. paulo      São Paulo
carla dias     rio de janeiro    sp            São Paulo
Davi Lima      SP                rio de janeiro  Rio de Janeiro
               bh                bh            Belo Horizonte`)}
<h2>Tarefas</h2>
<ol>
  <li>Escreva a função <code>fxPadronizar(texto as nullable text, tabela as table) as nullable text</code> que: tira espaços duplicados, compara sem diferenciar maiúsculas e devolve o "Certo" se achar; se não, devolve o texto em <code>Text.Proper</code>.</li>
  <li>Aplique a função na coluna Cidade.</li>
  <li>Aplique <code>Text.Proper</code> com espaços limpos na coluna Nome.</li>
  <li>Remova as linhas sem nome.</li>
</ol>
${resposta(`
<p>Consulta <code>fxPadronizar</code>:</p>
${trecho(`(texto as nullable text, tabela as table) as nullable text =>
let
    Limpo = if texto = null then null
            else Text.Combine(List.Select(Text.Split(Text.Trim(texto), " "), each _ <> ""), " "),
    Chave = if Limpo = null then null else Text.Lower(Limpo),
    Achado = if Chave = null then null
             else Table.SelectRows(tabela, each Text.Lower(Text.Trim([Errado])) = Chave),
    Resultado =
        if Limpo = null then null
        else if Table.RowCount(Achado) > 0 then Achado{0}[Certo]
        else Text.Proper(Limpo)
in
    Resultado`)}
<p>Consulta <code>ClientesLimpos</code>:</p>
${trecho(`let
    DePara = Table.Buffer(Excel.CurrentWorkbook(){[Name = "DePara"]}[Content]),
    Fonte = Excel.CurrentWorkbook(){[Name = "Clientes"]}[Content],
    SemVazios = Table.SelectRows(Fonte, each [Nome] <> null and Text.Trim([Nome]) <> ""),
    Nomes = Table.TransformColumns(SemVazios, {{"Nome", each Text.Proper(fxPadronizar(_, #table({"Errado", "Certo"}, {}))), type text}}),
    Cidades = Table.TransformColumns(Nomes, {{"Cidade", each fxPadronizar(_, DePara), type text}})
in
    Cidades`)}
<p><code>Table.Buffer</code> guarda a tabela de/para na memória: sem ele, ela poderia ser relida a cada linha. Para os nomes, passar uma tabela vazia (<code>#table</code>) reaproveita a limpeza de espaços da mesma função. Dividir pelo espaço e descartar os pedaços vazios é o jeito de remover espaços duplicados no meio do texto, que o <code>Text.Trim</code> não remove.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que usar Table.Buffer na tabela DePara?',
                  opcoes: [
                    'Para ordenar',
                    'Para ela ficar na memória e não ser relida a cada linha',
                    'Para converter tipos'
                  ],
                  certa: 1,
                  explicacao: 'Útil em tabelas pequenas consultadas muitas vezes.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Erros, tipos, metadados, dobragem e consultas que se adaptam.',
      modulos: [
        {
          titulo: 'M profissional',
          itens: [
            {
              id: 'erros-e-tipos',
              titulo: 'Erros, tipos e documentação',
              resumo: 'try otherwise, try catch, error, tipos de tabela e funções documentadas.',
              minutos: 14,
              corpo: `
<h2>Tratar erros</h2>
${trecho(`try Number.From("12,5") otherwise null      // valor ou null se der erro

try Date.FromText("31/02/2026")
// devolve um registro: [HasError = true, Error = [Reason = ..., Message = ..., Detail = ...]]

try Date.FromText([Texto], [Culture = "pt-BR"]) catch (e) => "Inválido: " & e[Message]   // Power Query recente

// Separar as linhas com erro numa tabela de conferência
let
    ComTentativa = Table.AddColumn(Fonte, "Teste", each try Number.From([Valor], "pt-BR")),
    ComErro = Table.SelectRows(ComTentativa, each [Teste][HasError]),
    Validas = Table.AddColumn(
        Table.SelectRows(ComTentativa, each not [Teste][HasError]),
        "ValorNum", each [Teste][Value], type number)
in
    Validas`)}
${trecho(`// Lançar o seu próprio erro, com mensagem clara
if not Table.HasColumns(Fonte, {"Data", "Valor"})
then error Error.Record("Planilha fora do padrão", "Faltam as colunas Data ou Valor", Table.ColumnNames(Fonte))
else Fonte`)}

<h2>Tipos de tabela</h2>
${trecho(`TipoVendas = type table [Data = date, Vendedor = text, Valor = number, Qtd = Int64.Type],
Tipada = Value.ReplaceType(Fonte, TipoVendas)   // troca o tipo sem converter (os valores precisam bater)
// ou, convertendo de verdade:
Convertida = Table.TransformColumnTypes(Fonte, {{"Data", type date}, {"Valor", type number}}, "pt-BR")`)}
<p>O último argumento (<code>"pt-BR"</code>) é a <strong>cultura</strong>: diz que "12,5" é doze e meio e "03/04/2026" é 3 de abril. Sem ele, vale a configuração do computador, e a consulta pode se comportar diferente na máquina de outra pessoa ou no serviço do Power BI.</p>

<h2>Documentar funções</h2>
${trecho(`let
    Funcao = (valor as number, percentual as number) as number => valor * (1 + percentual / 100),
    Tipo = type function (
        valor as (type number meta [Documentation.FieldCaption = "Valor"]),
        percentual as (type number meta [Documentation.FieldCaption = "Reajuste (%)"])
    ) as number meta [
        Documentation.Name = "fxReajuste",
        Documentation.LongDescription = "Aplica um reajuste percentual a um valor.",
        Documentation.Examples = {[Description = "10% sobre 200", Code = "fxReajuste(200, 10)", Result = "220"]}
    ]
in
    Value.ReplaceType(Funcao, Tipo)`)}
<p>O <code>meta</code> anexa <strong>metadados</strong> a um valor. Com esse tipo, a função ganha descrição, rótulos e exemplos na tela de "Invocar Função", como as funções nativas.</p>
`,
              quiz: [
                {
                  pergunta: 'O que try ... otherwise null faz?',
                  opcoes: ['Ignora a etapa', 'Devolve o valor, ou null se a expressão der erro', 'Para a consulta'],
                  certa: 1,
                  explicacao: 'Sem otherwise, try devolve um registro com HasError.'
                },
                {
                  pergunta: 'Por que passar a cultura "pt-BR" ao converter tipos?',
                  opcoes: [
                    'Para traduzir os nomes',
                    'Para números e datas serem lidos no formato brasileiro em qualquer computador',
                    'Para acelerar'
                  ],
                  certa: 1,
                  explicacao: 'Sem cultura, vale a do sistema onde a consulta roda.'
                },
                {
                  pergunta: 'Para que serve error Error.Record(...)?',
                  opcoes: ['Esconder erros', 'Lançar um erro próprio com mensagem clara', 'Registrar num log'],
                  certa: 1,
                  explicacao: 'Melhor um erro claro cedo do que dados errados depois.'
                }
              ]
            },
            {
              id: 'dobragem-e-desempenho',
              titulo: 'Dobragem, desempenho e consultas dinâmicas',
              resumo: 'Query folding na prática, Value.NativeQuery, Table.Buffer e Expression.Evaluate.',
              minutos: 14,
              corpo: `
<h2>Dobragem de consulta</h2>
<p>Com fontes como SQL Server, PostgreSQL ou OData, o Power Query tenta traduzir as etapas para a linguagem da fonte (<strong>query folding</strong>): o filtro vira um <code>WHERE</code> e só as linhas necessárias viajam pela rede. Clique com o botão direito numa etapa e veja se <strong>Exibir Consulta Nativa</strong> está disponível: se estiver, a dobragem chegou até ali.</p>
<ul>
  <li>Coloque primeiro as etapas que dobram: filtrar linhas, escolher colunas, agrupar, mesclar com tabelas da mesma fonte.</li>
  <li>Etapas como adicionar índice, colunas com funções de texto complexas, <code>Table.Buffer</code> e mesclar com uma tabela do Excel quebram a dobragem. Tudo o que vem depois roda na sua máquina.</li>
  <li>Filtro de data por parâmetro (<code>each [Data] &gt;= DataInicial</code>) dobra; é o que a <strong>atualização incremental</strong> do Power BI usa.</li>
</ul>
${trecho(`// Mandar um SQL próprio, e ainda permitir que as etapas seguintes dobrem sobre ele
Value.NativeQuery(
    Sql.Database("servidor", "pousada"),
    "SELECT quarto_id, entrada, saida FROM reservas WHERE status = @status",
    [status = "confirmada"],
    [EnableFolding = true]
)`)}
<p>Use parâmetros (<code>@status</code>) em vez de montar o SQL juntando textos: é mais seguro e o banco reaproveita o plano.</p>

<h2>Desempenho sem banco</h2>
<ul>
  <li><code>Table.Buffer</code> e <code>List.Buffer</code> guardam na memória uma tabela ou lista usada muitas vezes (dentro de um <code>List.Contains</code> numa coluna, por exemplo). Não use em tudo: ele lê a fonte inteira.</li>
  <li>Em vez de <code>Table.SelectRows</code> com <code>List.Contains</code> numa lista grande, prefira mesclar (<code>Table.NestedJoin</code> ou <code>Table.Join</code>).</li>
  <li>Ao ler uma pasta, filtre os arquivos (extensão, nome) antes de combinar.</li>
  <li>Desmarque "Habilitar carregamento" das consultas intermediárias.</li>
</ul>

<h2>Consultas que mudam sozinhas</h2>
${trecho(`// Pivotar sem saber quais meses existem, e ordenar as colunas por data
let
    Meses = List.Sort(List.Distinct(Vendas[Mes])),
    Pivotada = Table.Pivot(Vendas, List.Transform(Meses, Text.From), "Mes", "Valor", List.Sum)
in
    Pivotada

// Expandir todas as colunas de uma coluna de tabelas, sejam quais forem
Expandida = Table.ExpandTableColumn(Fonte, "Data", Table.ColumnNames(Fonte{0}[Data]))`)}
<p><code>Expression.Evaluate</code> roda um texto como código M. É poderoso (fórmulas guardadas numa planilha, por exemplo), mas difícil de depurar: use só quando não houver alternativa.</p>
`,
              quiz: [
                {
                  pergunta: 'Como saber se uma etapa ainda está dobrando para a fonte?',
                  opcoes: [
                    'Pelo nome da etapa',
                    '"Exibir Consulta Nativa" disponível no menu da etapa',
                    'Pela cor do ícone'
                  ],
                  certa: 1,
                  explicacao: 'Se a opção ficar cinza, a dobragem parou antes.'
                },
                {
                  pergunta: 'Onde colocar etapas que quebram a dobragem?',
                  opcoes: ['No começo', 'O mais tarde possível, depois das que dobram', 'Não importa'],
                  certa: 1,
                  explicacao: 'Assim os filtros ainda rodam na fonte.'
                },
                {
                  pergunta: 'Por que usar Table.ColumnNames(Fonte{0}[Data]) ao expandir?',
                  opcoes: ['Para a consulta não depender de nomes fixos de colunas', 'Para ordenar', 'É mais rápido'],
                  certa: 0,
                  explicacao: 'Colunas novas nos arquivos entram sozinhas.'
                }
              ]
            },
            {
              id: 'pratica-importador-robusto',
              titulo: 'Prática: importador de pasta à prova de bagunça',
              resumo: 'Ler vários arquivos com colunas diferentes, validar e separar os erros.',
              minutos: 40,
              corpo: `
<p>Situação real: todo mês chega uma planilha de cada loja numa pasta, e cada uma vem de um jeito (colunas em ordem diferente, uma loja chama "Valor" de "Total", às vezes vem uma coluna a mais).</p>
<h2>Tarefas</h2>
<ol>
  <li>Crie um parâmetro <code>PastaLojas</code> com o caminho da pasta.</li>
  <li>Leia só os <code>.xlsx</code> que não começam com <code>~$</code> (arquivos temporários do Excel abertos).</li>
  <li>De cada arquivo, pegue a primeira planilha, promova os cabeçalhos e padronize os nomes das colunas com uma tabela de sinônimos (Total → Valor, Dt → Data...).</li>
  <li>Combine tudo com a coluna Loja (nome do arquivo sem extensão), mantendo só Loja, Data, Produto e Valor, mesmo que algum arquivo não tenha alguma delas.</li>
  <li>Converta os tipos com cultura pt-BR. Linhas que não convertem vão para uma consulta separada <code>ErrosImportacao</code>, com o arquivo e o motivo.</li>
</ol>
${resposta(`
<p>Consulta <code>Bruto</code> (desmarque o carregamento):</p>
${trecho(`let
    Sinonimos = [Total = "Valor", #"Valor Total" = "Valor", Dt = "Data", #"Data Venda" = "Data", Item = "Produto"],
    Padronizar = (nome as text) as text =>
        let n = Text.Trim(nome) in Record.FieldOrDefault(Sinonimos, n, n),

    Arquivos = Folder.Files(PastaLojas),
    Filtrados = Table.SelectRows(Arquivos, each
        Text.Lower([Extension]) = ".xlsx" and not Text.StartsWith([Name], "~$")),

    LerArquivo = (conteudo as binary) as table =>
        let
            Planilha = Excel.Workbook(conteudo, null, true){0}[Data],
            Cabecalhos = Table.PromoteHeaders(Planilha, [PromoteAllScalars = true]),
            Renomeada = Table.TransformColumnNames(Cabecalhos, Padronizar)
        in
            Table.SelectColumns(Renomeada, {"Data", "Produto", "Valor"}, MissingField.UseNull),

    ComDados = Table.AddColumn(Filtrados, "Dados", each LerArquivo([Content])),
    ComLoja = Table.AddColumn(ComDados, "Loja", each Text.BeforeDelimiter([Name], ".", {0, RelativePosition.FromEnd}), type text),
    Enxuta = Table.SelectColumns(ComLoja, {"Loja", "Dados"}),
    Expandida = Table.ExpandTableColumn(Enxuta, "Dados", {"Data", "Produto", "Valor"}),
    Tentativas = Table.AddColumn(Expandida, "Convertida", each try [
        Data = Date.From([Data], "pt-BR"),
        Valor = Number.From([Valor], "pt-BR")
    ])
in
    Tentativas`)}
<p>Consulta <code>Vendas</code>:</p>
${trecho(`let
    Ok = Table.SelectRows(Bruto, each not [Convertida][HasError]),
    Valores = Table.AddColumn(Ok, "Registro", each [Convertida][Value]),
    Final = Table.FromRecords(
        Table.TransformRows(Valores, each [Loja = [Loja], Data = [Registro][Data], Produto = [Produto], Valor = [Registro][Valor]]),
        type table [Loja = text, Data = date, Produto = text, Valor = number]
    )
in
    Final`)}
<p>Consulta <code>ErrosImportacao</code>:</p>
${trecho(`let
    ComErro = Table.SelectRows(Bruto, each [Convertida][HasError]),
    Motivos = Table.AddColumn(ComErro, "Motivo", each [Convertida][Error][Message], type text)
in
    Table.SelectColumns(Motivos, {"Loja", "Data", "Produto", "Valor", "Motivo"})`)}
<p>O <code>MissingField.UseNull</code> faz o <code>Table.SelectColumns</code> criar com nulos as colunas que faltarem, em vez de dar erro. <code>Record.FieldOrDefault</code> devolve o próprio nome quando ele não está nos sinônimos. O <code>try</code> sobre um registro inteiro falha se qualquer campo falhar, e a mensagem diz qual. O <code>Text.BeforeDelimiter</code> com <code>RelativePosition.FromEnd</code> tira só a última extensão, mesmo que o nome tenha outros pontos.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que MissingField.UseNull faz no Table.SelectColumns?',
                  opcoes: [
                    'Apaga colunas vazias',
                    'Cria com nulos as colunas que não existem, em vez de dar erro',
                    'Troca nulos por zero'
                  ],
                  certa: 1,
                  explicacao: 'Também existe MissingField.Ignore, que simplesmente pula.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
