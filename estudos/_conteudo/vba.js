// Trilha de VBA. Sem editor: o código é para colar no Editor do VBA do Excel (Alt+F11) e rodar com F5.
// As planilhas de exemplo vêm em tabelas que dá para copiar e colar no Excel. Os nomes do VBA são sempre em inglês.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta, tabela } = require('./ajuda');

module.exports = {
  id: 'vba',
  area: 'Dados e BI',
  titulo: 'VBA',
  sigla: 'VBA',
  resumo: 'Macros no Excel: automatizar relatórios, formatar planilhas e juntar arquivos com um botão.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'O editor, a primeira macro, células, variáveis e laços.',
      modulos: [
        {
          titulo: 'Primeiras macros',
          itens: [
            {
              id: 'primeira-macro',
              titulo: 'O editor e a primeira macro',
              resumo: 'Guia Desenvolvedor, gravar macro, Alt+F11, módulos e salvar como .xlsm.',
              minutos: 9,
              corpo: `
<p><strong>VBA</strong> (Visual Basic for Applications) é a linguagem de automação do Office. No Excel, ela faz em um clique o que você faria em vinte minutos: formatar um relatório, separar uma planilha em várias, juntar arquivos de uma pasta, mandar e-mails.</p>

<h2>Preparar o Excel</h2>
<ol>
  <li>Mostre a guia <strong>Desenvolvedor</strong>: Arquivo, Opções, Personalizar Faixa de Opções, marque Desenvolvedor.</li>
  <li>Abra o editor com <kbd>Alt</kbd>+<kbd>F11</kbd>.</li>
  <li>No editor: Inserir, Módulo. É ali que o código fica.</li>
  <li>Salve a pasta como <strong>Pasta de Trabalho Habilitada para Macro (.xlsm)</strong>. Um .xlsx descarta as macros ao salvar.</li>
</ol>

<h2>A primeira macro</h2>
${trecho(`Sub Ola()
    MsgBox "Olá! Hoje é " & Format(Date, "dd/mm/yyyy")
    Range("A1").Value = "Relatório gerado em " & Now
End Sub`)}
<p>Clique dentro do <code>Sub</code> e aperte <kbd>F5</kbd>. Uma macro é um <code>Sub</code>: começa com <code>Sub Nome()</code> e termina com <code>End Sub</code>. O <code>&amp;</code> junta textos. Comentários começam com aspas simples (<code>'</code>).</p>

<h2>Gravar para aprender</h2>
<p>Desenvolvedor, <strong>Gravar Macro</strong>, faça algo à mão (negrito, cor, largura de coluna), Parar Gravação. Depois veja o código no editor. O gravador escreve código cheio de <code>Select</code> e repetições, mas é ótimo para descobrir o nome de uma propriedade.</p>
${dica('Macros não têm Ctrl+Z: o que elas fazem não se desfaz. Teste numa cópia da planilha até confiar no código.')}
`,
              quiz: [
                {
                  pergunta: 'Em que formato salvar uma pasta com macros?',
                  opcoes: ['.xlsx', '.xlsm', '.csv'],
                  certa: 1,
                  explicacao: 'O .xlsx não guarda código VBA.'
                },
                {
                  pergunta: 'Qual atalho abre o editor do VBA?',
                  opcoes: ['Ctrl+F11', 'Alt+F11', 'F5'],
                  certa: 1,
                  explicacao: 'F5 roda a macro onde está o cursor.'
                },
                {
                  pergunta: 'Dá para desfazer com Ctrl+Z o que uma macro fez?',
                  opcoes: ['Sim', 'Não', 'Só se for formatação'],
                  certa: 1,
                  explicacao: 'Por isso teste em cópias.'
                }
              ]
            },
            {
              id: 'celulas-variaveis-lacos',
              titulo: 'Células, variáveis e laços',
              resumo: 'Range, Cells, Dim, If, For e achar a última linha.',
              minutos: 12,
              corpo: `
<h2>Falar com as células</h2>
${trecho(`Range("A1").Value = "Produto"
Range("A1:D1").Font.Bold = True
Cells(2, 1).Value = "Café"          ' linha 2, coluna 1 (= A2)
Range("C2").Formula = "=A2*B2"      ' fórmula em inglês, com vírgula
Range("C2").FormulaLocal = "=A2*B2" ' fórmula em português, com ponto e vírgula
Worksheets("Vendas").Range("A1").Value = "Título"
Columns("A:D").AutoFit`)}

<h2>Variáveis</h2>
${trecho(`Option Explicit   ' no topo do módulo: obriga declarar as variáveis

Sub Exemplo()
    Dim nome As String
    Dim quantidade As Long      ' use Long, não Integer (que vai só até 32.767)
    Dim preco As Double
    Dim hoje As Date
    Dim ws As Worksheet

    Set ws = ThisWorkbook.Worksheets("Vendas")   ' objetos usam Set
    nome = ws.Range("A2").Value
End Sub`)}
${dica('Coloque <code>Option Explicit</code> no topo de todo módulo (ou marque em Ferramentas, Opções, "Requerer declaração de variável"). Sem ele, um erro de digitação no nome de uma variável cria uma variável nova vazia, e o bug fica invisível.')}

<h2>A última linha com dados</h2>
${trecho(`Dim ultima As Long
ultima = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row`)}
<p>É como ir na última linha da planilha e apertar <kbd>Ctrl</kbd>+<kbd>↑</kbd>. Assim a macro funciona com 10 ou 10 mil linhas.</p>

<h2>Decisões e laços</h2>
${trecho(`Dim i As Long
For i = 2 To ultima
    If ws.Cells(i, "D").Value > 1000 Then
        ws.Cells(i, "D").Interior.Color = RGB(198, 239, 206)
    ElseIf ws.Cells(i, "D").Value = 0 Then
        ws.Cells(i, "D").Interior.Color = RGB(255, 199, 206)
    End If
Next i

Dim celula As Range
For Each celula In ws.Range("B2:B" & ultima)
    celula.Value = Trim(celula.Value)
Next celula`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve Option Explicit?',
                  opcoes: [
                    'Deixa a macro mais rápida',
                    'Obriga declarar variáveis, pegando erros de digitação',
                    'Mostra mensagens de erro'
                  ],
                  certa: 1,
                  explicacao: 'Sem ele, um nome errado vira uma variável nova vazia.'
                },
                {
                  pergunta: 'Como achar a última linha preenchida da coluna A?',
                  opcoes: ['Range("A1048576").Row', 'Cells(Rows.Count, "A").End(xlUp).Row', 'Range("A:A").Count'],
                  certa: 1,
                  explicacao: 'É o Ctrl+↑ a partir do fim da planilha.'
                },
                {
                  pergunta: 'Quando usar Set?',
                  opcoes: ['Para guardar objetos (planilhas, intervalos)', 'Para qualquer variável', 'Para números'],
                  certa: 0,
                  explicacao: 'Textos e números se atribuem direto; objetos, com Set.'
                }
              ]
            },
            {
              id: 'pratica-formatar-relatorio',
              titulo: 'Prática: formatar um relatório',
              resumo: 'Cabeçalho, moeda, cores condicionais e total com um clique.',
              minutos: 20,
              corpo: `
<p>Cole numa planilha chamada <strong>Vendas</strong>, a partir de A1:</p>
${tabela(
  ['Data', 'Vendedor', 'Produto', 'Valor'],
  [
    ['01/10/2026', 'Ana', 'Café', '850'],
    ['01/10/2026', 'Bruno', 'Arroz', '1200'],
    ['02/10/2026', 'Carla', 'Feijão', '0'],
    ['03/10/2026', 'Ana', 'Açúcar', '430'],
    ['03/10/2026', 'Bruno', 'Café', '1560']
  ]
)}
<h2>Tarefas</h2>
<p>Escreva uma macro <code>FormatarRelatorio</code> que:</p>
<ol>
  <li>Deixe o cabeçalho em negrito, com fundo escuro e letra branca.</li>
  <li>Formate a coluna D como moeda (<code>R$ #.##0,00</code>).</li>
  <li>Pinte de verde os valores acima de 1.000 e de vermelho os zerados.</li>
  <li>Escreva "Total" e a soma na linha logo abaixo dos dados.</li>
  <li>Ajuste a largura das colunas. Funcione com qualquer número de linhas.</li>
  <li>Crie um botão (Desenvolvedor, Inserir, Botão) ligado à macro.</li>
</ol>
${resposta(`
${trecho(`Option Explicit

Sub FormatarRelatorio()
    Dim ws As Worksheet, ultima As Long, i As Long
    Set ws = ThisWorkbook.Worksheets("Vendas")
    ultima = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row

    With ws.Range("A1:D1")
        .Font.Bold = True
        .Font.Color = vbWhite
        .Interior.Color = RGB(31, 56, 100)
    End With

    ws.Range("D2:D" & ultima + 1).NumberFormat = "R$ #,##0.00"

    For i = 2 To ultima
        Select Case ws.Cells(i, "D").Value
            Case Is > 1000: ws.Cells(i, "D").Interior.Color = RGB(198, 239, 206)
            Case 0: ws.Cells(i, "D").Interior.Color = RGB(255, 199, 206)
            Case Else: ws.Cells(i, "D").Interior.ColorIndex = xlNone
        End Select
    Next i

    ws.Cells(ultima + 1, "C").Value = "Total"
    ws.Cells(ultima + 1, "D").Formula = "=SUM(D2:D" & ultima & ")"
    ws.Range("C" & ultima + 1 & ":D" & ultima + 1).Font.Bold = True

    ws.Columns("A:D").AutoFit
End Sub`)}
<p>O <code>With</code> evita repetir o mesmo objeto. No <code>NumberFormat</code> e no <code>Formula</code>, o VBA usa o padrão americano (vírgula de milhar, ponto decimal, SUM); o Excel mostra no formato brasileiro. Rodar a macro duas vezes escreve o total uma linha abaixo: um bom exercício extra é apagar o total antigo antes.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que usar a última linha calculada em vez de "D2:D6"?',
                  opcoes: [
                    'Fica mais bonito',
                    'Para a macro funcionar com qualquer quantidade de dados',
                    'O VBA não aceita endereços fixos'
                  ],
                  certa: 1,
                  explicacao: 'O relatório do mês que vem terá outro tamanho.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Várias planilhas e arquivos, funções próprias e erros.',
      modulos: [
        {
          titulo: 'Planilhas e arquivos',
          itens: [
            {
              id: 'planilhas-e-arquivos',
              titulo: 'Várias planilhas e arquivos',
              resumo: 'Percorrer abas, criar e copiar planilhas, abrir arquivos de uma pasta.',
              minutos: 13,
              corpo: `
<h2>Abas</h2>
${trecho(`Dim ws As Worksheet
For Each ws In ThisWorkbook.Worksheets
    Debug.Print ws.Name, ws.UsedRange.Rows.Count   ' aparece na Janela Imediata (Ctrl+G)
Next ws

Dim nova As Worksheet
Set nova = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
nova.Name = "Resumo"

Application.DisplayAlerts = False   ' não perguntar "tem certeza?"
ThisWorkbook.Worksheets("Rascunho").Delete
Application.DisplayAlerts = True`)}
<p><code>ThisWorkbook</code> é a pasta onde o código está; <code>ActiveWorkbook</code>, a que está na frente. Prefira <code>ThisWorkbook</code> e referências explícitas: código que depende do que está selecionado quebra quando o usuário clica em outro lugar.</p>

<h2>Arquivos de uma pasta</h2>
${trecho(`Dim pasta As String, arquivo As String, wb As Workbook
pasta = ThisWorkbook.Path & "\\Lojas\\"
arquivo = Dir(pasta & "*.xlsx")
Do While arquivo <> ""
    Set wb = Workbooks.Open(pasta & arquivo, ReadOnly:=True)
    Debug.Print arquivo, wb.Worksheets(1).Range("A1").Value
    wb.Close SaveChanges:=False
    arquivo = Dir()            ' próximo arquivo
Loop`)}

<h2>Copiar dados sem copiar e colar</h2>
${trecho(`' Lento (passa pela área de transferência):
' origem.Copy: destino.PasteSpecial xlPasteValues
' Rápido:
destino.Resize(origem.Rows.Count, origem.Columns.Count).Value = origem.Value`)}

<h2>Mais rápido</h2>
${trecho(`Application.ScreenUpdating = False
Application.Calculation = xlCalculationManual
' ... o trabalho pesado
Application.Calculation = xlCalculationAutomatic
Application.ScreenUpdating = True`)}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre ThisWorkbook e ActiveWorkbook?',
                  opcoes: [
                    'Nenhuma',
                    'ThisWorkbook é onde está o código; ActiveWorkbook é a pasta em foco',
                    'ActiveWorkbook é sempre a primeira aberta'
                  ],
                  certa: 1,
                  explicacao: 'Com vários arquivos abertos, isso faz toda a diferença.'
                },
                {
                  pergunta: 'Como pegar o próximo arquivo com Dir?',
                  opcoes: ['Dir(pasta) de novo', 'Dir() sem argumentos', 'Next arquivo'],
                  certa: 1,
                  explicacao: 'Sem argumentos, Dir continua a busca anterior.'
                },
                {
                  pergunta: 'Qual o jeito mais rápido de copiar valores?',
                  opcoes: ['Copy e PasteSpecial', 'destino.Value = origem.Value', 'Célula por célula num laço'],
                  certa: 1,
                  explicacao: 'Atribuir o Value de um intervalo inteiro não usa a área de transferência.'
                }
              ]
            },
            {
              id: 'funcoes-e-erros',
              titulo: 'Funções próprias, arrays e erros',
              resumo: 'Function como fórmula da planilha, arrays em memória e On Error.',
              minutos: 13,
              corpo: `
<h2>Funções que viram fórmulas</h2>
${trecho(`Function DIAS_UTEIS_BR(inicio As Date, fim As Date) As Long
    DIAS_UTEIS_BR = Application.WorksheetFunction.NetworkDays(inicio, fim)
End Function

Function SEM_ACENTO(texto As String) As String
    Dim de As String, para As String, i As Long
    de = "áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ"
    para = "aaaaeeiooouc" & "AAAAEEIOOOUC"
    For i = 1 To Len(de)
        texto = Replace(texto, Mid(de, i, 1), Mid(para, i, 1))
    Next i
    SEM_ACENTO = texto
End Function`)}
<p>Uma <code>Function</code> num módulo aparece no Excel como fórmula: <code>=SEM_ACENTO(A2)</code>. O valor de retorno é atribuído ao próprio nome da função.</p>

<h2>Arrays: ler tudo de uma vez</h2>
<p>Ler e escrever célula por célula é lento. O truque é trazer o intervalo inteiro para a memória, trabalhar no array e devolver de uma vez:</p>
${trecho(`Dim dados As Variant, i As Long
dados = ws.Range("A2:D" & ultima).Value     ' array 2D: dados(linha, coluna), começa em 1
For i = 1 To UBound(dados, 1)
    dados(i, 4) = dados(i, 4) * 1.1          ' reajuste de 10%
Next i
ws.Range("A2:D" & ultima).Value = dados`)}
<p>Em 50 mil linhas, isso leva menos de um segundo; o laço célula a célula pode levar minutos.</p>

<h2>Tratar erros</h2>
${trecho(`Sub AbrirRelatorio()
    On Error GoTo Falhou
    Workbooks.Open ThisWorkbook.Path & "\\relatorio.xlsx"
    Exit Sub
Falhou:
    MsgBox "Não consegui abrir: " & Err.Description, vbExclamation
End Sub

' Para um teste pontual
On Error Resume Next
Set ws = ThisWorkbook.Worksheets("Resumo")
On Error GoTo 0           ' volta ao normal logo depois
If ws Is Nothing Then Set ws = ThisWorkbook.Worksheets.Add`)}
${dica('<code>On Error Resume Next</code> sozinho no topo da macro esconde todos os erros, e ela "funciona" fazendo coisa errada. Use só em volta da linha que pode falhar e desligue com <code>On Error GoTo 0</code>.')}
`,
              quiz: [
                {
                  pergunta: 'Como uma Function devolve o resultado?',
                  opcoes: ['Com return', 'Atribuindo ao nome da função', 'Com MsgBox'],
                  certa: 1,
                  explicacao: 'NomeDaFuncao = valor.'
                },
                {
                  pergunta: 'Por que ler um intervalo para um array?',
                  opcoes: [
                    'É muito mais rápido que acessar célula por célula',
                    'Para apagar os dados',
                    'Arrays ocupam menos disco'
                  ],
                  certa: 0,
                  explicacao: 'Cada acesso a uma célula passa pelo Excel; o array fica na memória.'
                },
                {
                  pergunta: 'Qual o risco de On Error Resume Next no topo da macro?',
                  opcoes: ['Nenhum', 'Esconder todos os erros', 'Travar o Excel'],
                  certa: 1,
                  explicacao: 'A macro segue em frente com dados errados.'
                }
              ]
            },
            {
              id: 'pratica-consolidar-lojas',
              titulo: 'Prática: consolidar arquivos de lojas',
              resumo: 'Juntar numa aba só os dados de todos os arquivos de uma pasta.',
              minutos: 30,
              corpo: `
<p>Crie uma pasta <code>Lojas</code> ao lado do seu .xlsm com três arquivos (<code>Centro.xlsx</code>, <code>Praia.xlsx</code>, <code>Shopping.xlsx</code>), cada um com cabeçalho Data, Produto, Valor e algumas linhas.</p>
<h2>Tarefas</h2>
<ol>
  <li>Crie (ou limpe) a aba <strong>Consolidado</strong> com o cabeçalho Loja, Data, Produto, Valor.</li>
  <li>Para cada arquivo da pasta, copie as linhas de dados (sem o cabeçalho), com o nome da loja (nome do arquivo sem extensão) na primeira coluna.</li>
  <li>Feche cada arquivo sem salvar. Não use Copy/Paste.</li>
  <li>No fim, mostre quantas linhas e quantos arquivos foram juntados.</li>
  <li>Se a pasta não existir, avise e pare.</li>
</ol>
${resposta(`
${trecho(`Option Explicit

Sub ConsolidarLojas()
    Dim pasta As String, arquivo As String
    Dim wb As Workbook, origem As Worksheet, destino As Worksheet
    Dim ultima As Long, linhas As Long, proxima As Long, arquivos As Long

    pasta = ThisWorkbook.Path & "\\Lojas\\"
    If Dir(pasta, vbDirectory) = "" Then
        MsgBox "Pasta não encontrada: " & pasta, vbExclamation
        Exit Sub
    End If

    On Error Resume Next
    Set destino = ThisWorkbook.Worksheets("Consolidado")
    On Error GoTo 0
    If destino Is Nothing Then
        Set destino = ThisWorkbook.Worksheets.Add
        destino.Name = "Consolidado"
    End If
    destino.Cells.Clear
    destino.Range("A1:D1").Value = Array("Loja", "Data", "Produto", "Valor")
    proxima = 2

    Application.ScreenUpdating = False
    arquivo = Dir(pasta & "*.xlsx")
    Do While arquivo <> ""
        Set wb = Workbooks.Open(pasta & arquivo, ReadOnly:=True)
        Set origem = wb.Worksheets(1)
        ultima = origem.Cells(origem.Rows.Count, "A").End(xlUp).Row
        If ultima >= 2 Then
            linhas = ultima - 1
            destino.Cells(proxima, "A").Resize(linhas, 1).Value = Left(arquivo, InStrRev(arquivo, ".") - 1)
            destino.Cells(proxima, "B").Resize(linhas, 3).Value = origem.Range("A2:C" & ultima).Value
            proxima = proxima + linhas
        End If
        wb.Close SaveChanges:=False
        arquivos = arquivos + 1
        arquivo = Dir()
    Loop
    Application.ScreenUpdating = True

    destino.Columns("A:D").AutoFit
    MsgBox proxima - 2 & " linhas de " & arquivos & " arquivos.", vbInformation
End Sub`)}
<p>Atribuir um único valor a um intervalo com <code>Resize</code> preenche todas as células (o nome da loja em todas as linhas). <code>Array(...)</code> escreve o cabeçalho de uma vez.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que faz Cells(proxima, "A").Resize(linhas, 1)?',
                  opcoes: [
                    'Muda a largura da coluna',
                    'Cria um intervalo com "linhas" linhas a partir daquela célula',
                    'Apaga as linhas'
                  ],
                  certa: 1,
                  explicacao: 'Resize define o tamanho do intervalo a partir do canto.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Formulários, eventos, Outlook e boas práticas.',
      modulos: [
        {
          titulo: 'Interação e integração',
          itens: [
            {
              id: 'eventos-e-userform',
              titulo: 'Eventos e formulários',
              resumo: 'Macros que rodam sozinhas e janelas de cadastro com UserForm.',
              minutos: 13,
              corpo: `
<h2>Eventos</h2>
<p>Código no módulo de uma <strong>planilha</strong> (duplo clique nela, no Project Explorer) ou em <strong>EstaPasta_de_trabalho</strong> roda sozinho quando algo acontece:</p>
${trecho(`' No módulo da planilha "Vendas"
Private Sub Worksheet_Change(ByVal Target As Range)
    If Intersect(Target, Me.Range("D:D")) Is Nothing Then Exit Sub
    Application.EnableEvents = False          ' evita que a própria alteração dispare de novo
    Target.Offset(0, 1).Value = Now           ' carimbo de data e hora na coluna E
    Application.EnableEvents = True
End Sub

' Em EstaPasta_de_trabalho
Private Sub Workbook_Open()
    ThisWorkbook.Worksheets("Painel").Activate
End Sub

Private Sub Workbook_BeforeSave(ByVal SaveAsUI As Boolean, Cancel As Boolean)
    If ThisWorkbook.Worksheets("Vendas").Range("A2").Value = "" Then
        MsgBox "A planilha de vendas está vazia."
        Cancel = True
    End If
End Sub`)}
${dica('Se uma macro de evento parar no meio com erro, o <code>EnableEvents</code> pode ficar desligado e nenhum evento funciona mais. Rode <code>Application.EnableEvents = True</code> na Janela Imediata (Ctrl+G) para religar.')}

<h2>UserForm</h2>
<p>No editor: Inserir, <strong>UserForm</strong>. Arraste caixas de texto (<code>txtNome</code>, <code>txtValor</code>), uma caixa de combinação (<code>cboCategoria</code>) e um botão (<code>btnSalvar</code>). Dê duplo clique nos controles para escrever o código:</p>
${trecho(`Private Sub UserForm_Initialize()
    cboCategoria.List = Array("Mercearia", "Limpeza", "Bebidas")
End Sub

Private Sub btnSalvar_Click()
    If Trim(txtNome.Value) = "" Or Not IsNumeric(txtValor.Value) Then
        MsgBox "Preencha nome e valor.", vbExclamation
        Exit Sub
    End If
    Dim ws As Worksheet, linha As Long
    Set ws = ThisWorkbook.Worksheets("Produtos")
    linha = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row + 1
    ws.Cells(linha, "A").Value = Trim(txtNome.Value)
    ws.Cells(linha, "B").Value = CDbl(txtValor.Value)
    ws.Cells(linha, "C").Value = cboCategoria.Value
    txtNome.Value = "": txtValor.Value = ""
    txtNome.SetFocus
End Sub`)}
<p>Para abrir: <code>UserForm1.Show</code> numa macro ligada a um botão.</p>
`,
              quiz: [
                {
                  pergunta: 'Por que desligar EnableEvents dentro do Worksheet_Change?',
                  opcoes: [
                    'Para ficar mais rápido',
                    'Para a alteração feita pela macro não disparar o evento de novo, em loop',
                    'Para salvar o arquivo'
                  ],
                  certa: 1,
                  explicacao: 'Escrever numa célula dentro do Change dispara outro Change.'
                },
                {
                  pergunta: 'Onde fica o código do Workbook_Open?',
                  opcoes: ['Num módulo comum', 'Em EstaPasta_de_trabalho', 'No UserForm'],
                  certa: 1,
                  explicacao: 'Eventos da pasta ficam no módulo da pasta; eventos de planilha, no da planilha.'
                },
                {
                  pergunta: 'Como impedir o salvamento no Workbook_BeforeSave?',
                  opcoes: ['Exit Sub', 'Cancel = True', 'End'],
                  certa: 1,
                  explicacao: 'O parâmetro Cancel cancela o evento.'
                }
              ]
            },
            {
              id: 'outlook-e-boas-praticas',
              titulo: 'Outlook, PDF e boas práticas',
              resumo: 'Exportar PDF, enviar e-mails, dicionários e organizar o código.',
              minutos: 13,
              corpo: `
<h2>Exportar PDF</h2>
${trecho(`ws.ExportAsFixedFormat Type:=xlTypePDF, _
    Filename:=ThisWorkbook.Path & "\\Relatorio_" & Format(Date, "yyyy-mm-dd") & ".pdf", _
    OpenAfterPublish:=False`)}
<p>O <code>_</code> no fim da linha continua a instrução na linha seguinte.</p>

<h2>Enviar e-mail pelo Outlook</h2>
${trecho(`Sub EnviarRelatorio(destinatario As String, anexo As String)
    Dim outlook As Object, email As Object
    Set outlook = CreateObject("Outlook.Application")
    Set email = outlook.CreateItem(0)       ' 0 = e-mail
    With email
        .To = destinatario
        .Subject = "Relatório de " & Format(Date, "mmmm/yyyy")
        .HTMLBody = "<p>Olá,</p><p>Segue o relatório do mês.</p>"
        .Attachments.Add anexo
        .Display      ' troque por .Send depois de testar
    End With
End Sub`)}
<p><code>CreateObject</code> é a <strong>ligação tardia</strong>: funciona em qualquer versão do Office sem marcar referências em Ferramentas, Referências. O preço é perder o autocompletar.</p>

<h2>Dicionário: agrupar e eliminar repetidos</h2>
${trecho(`Dim totais As Object, i As Long, chave As Variant
Set totais = CreateObject("Scripting.Dictionary")
For i = 1 To UBound(dados, 1)
    totais(dados(i, 2)) = totais(dados(i, 2)) + dados(i, 4)   ' soma por vendedor
Next i
For Each chave In totais.Keys
    Debug.Print chave, totais(chave)
Next chave`)}

<h2>Boas práticas</h2>
<ul>
  <li><code>Option Explicit</code> em todo módulo, nomes que dizem o que a variável guarda.</li>
  <li>Nunca <code>Select</code> e <code>Activate</code>: trabalhe direto nos objetos (<code>ws.Range("A1").Value</code>).</li>
  <li>Use <strong>Tabelas</strong> do Excel (<code>ListObjects</code>): <code>ws.ListObjects("tbVendas").DataBodyRange</code> cresce sozinha e não depende de achar a última linha.</li>
  <li>Configurações (caminhos, e-mails) numa aba "Config", não espalhadas pelo código.</li>
  <li>Guarde o código também fora do Excel: exporte os módulos (.bas) para uma pasta no Git.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Por que usar .Display antes de .Send?',
                  opcoes: [
                    '.Send não existe',
                    'Para conferir o e-mail antes de mandar de verdade',
                    'Para anexar arquivos'
                  ],
                  certa: 1,
                  explicacao: 'Teste com .Display; troque por .Send quando estiver certo.'
                },
                {
                  pergunta: 'O que é a ligação tardia (CreateObject)?',
                  opcoes: [
                    'Criar o objeto sem marcar a referência da biblioteca',
                    'Um erro de conexão',
                    'Abrir o Outlook mais tarde'
                  ],
                  certa: 0,
                  explicacao: 'Funciona em mais versões do Office, sem autocompletar.'
                },
                {
                  pergunta: 'Qual a vantagem de usar Tabelas (ListObjects) no VBA?',
                  opcoes: ['Ficam coloridas', 'O intervalo cresce sozinho com os dados', 'São mais rápidas que arrays'],
                  certa: 1,
                  explicacao: 'DataBodyRange sempre cobre todas as linhas da tabela.'
                }
              ]
            },
            {
              id: 'pratica-relatorios-por-vendedor',
              titulo: 'Prática: um PDF por vendedor',
              resumo: 'Filtrar, gerar um PDF para cada vendedor e preparar os e-mails.',
              minutos: 35,
              corpo: `
<p>Use a planilha <strong>Vendas</strong> da prática de formatação (Data, Vendedor, Produto, Valor) e crie uma aba <strong>Vendedores</strong> com nome na coluna A e e-mail na coluna B.</p>
<h2>Tarefas</h2>
<ol>
  <li>Descubra a lista de vendedores sem repetição com um dicionário.</li>
  <li>Para cada um, crie uma aba temporária só com as vendas dele e o total.</li>
  <li>Exporte a aba como <code>Vendas_Nome.pdf</code> numa pasta <code>PDFs</code> (crie se não existir) e apague a aba temporária.</li>
  <li>Abra um e-mail (com <code>.Display</code>) para o endereço da aba Vendedores, com o PDF anexado.</li>
</ol>
${resposta(`
${trecho(`Option Explicit

Sub PdfPorVendedor()
    Dim ws As Worksheet, tmp As Worksheet, dados As Variant
    Dim vendedores As Object, nome As Variant, i As Long, linha As Long
    Dim pasta As String, arquivo As String, email As String

    Set ws = ThisWorkbook.Worksheets("Vendas")
    dados = ws.Range("A2:D" & ws.Cells(ws.Rows.Count, "A").End(xlUp).Row).Value

    Set vendedores = CreateObject("Scripting.Dictionary")
    For i = 1 To UBound(dados, 1)
        If Not vendedores.Exists(dados(i, 2)) Then vendedores.Add dados(i, 2), True
    Next i

    pasta = ThisWorkbook.Path & "\\PDFs\\"
    If Dir(pasta, vbDirectory) = "" Then MkDir pasta

    Application.ScreenUpdating = False
    For Each nome In vendedores.Keys
        Set tmp = ThisWorkbook.Worksheets.Add
        tmp.Range("A1:C1").Value = Array("Data", "Produto", "Valor")
        linha = 2
        For i = 1 To UBound(dados, 1)
            If dados(i, 2) = nome Then
                tmp.Cells(linha, 1).Resize(1, 3).Value = Array(dados(i, 1), dados(i, 3), dados(i, 4))
                linha = linha + 1
            End If
        Next i
        tmp.Cells(linha, 2).Value = "Total"
        tmp.Cells(linha, 3).Formula = "=SUM(C2:C" & linha - 1 & ")"
        tmp.Columns("C").NumberFormat = "R$ #,##0.00"
        tmp.Columns("A:C").AutoFit

        arquivo = pasta & "Vendas_" & nome & ".pdf"
        tmp.ExportAsFixedFormat Type:=xlTypePDF, Filename:=arquivo
        Application.DisplayAlerts = False
        tmp.Delete
        Application.DisplayAlerts = True

        email = BuscarEmail(CStr(nome))
        If email <> "" Then EnviarRelatorio email, arquivo
    Next nome
    Application.ScreenUpdating = True
End Sub

Function BuscarEmail(nome As String) As String
    Dim achou As Range
    Set achou = ThisWorkbook.Worksheets("Vendedores").Columns("A").Find(nome, LookAt:=xlWhole)
    If Not achou Is Nothing Then BuscarEmail = achou.Offset(0, 1).Value
End Function`)}
<p><code>EnviarRelatorio</code> é o da aula anterior. <code>Find</code> com <code>LookAt:=xlWhole</code> exige a célula inteira igual, para "Ana" não casar com "Ana Paula".</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que LookAt:=xlWhole no Find?',
                  opcoes: [
                    'Para buscar em todas as abas',
                    'Para exigir que a célula seja exatamente igual ao texto',
                    'Para ignorar maiúsculas'
                  ],
                  certa: 1,
                  explicacao: 'Sem ele, a busca aceita trechos (xlPart).'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
