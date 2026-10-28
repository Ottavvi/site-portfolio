// Trilha de PowerShell. Sem editor: os comandos são para rodar no Windows (PowerShell 5.1, que já vem instalado, ou o
// PowerShell 7). As práticas usam uma pasta de teste criada pela própria aula, para nada importante ser mexido.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'powershell',
  area: 'Qualidade e entrega',
  titulo: 'PowerShell',
  sigla: 'PS',
  resumo: 'Automatizar o Windows: arquivos, relatórios e tarefas repetitivas em scripts.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Comandos, o pipeline de objetos e a ajuda embutida.',
      modulos: [
        {
          titulo: 'Primeiros comandos',
          itens: [
            {
              id: 'primeiros-comandos',
              titulo: 'Cmdlets e ajuda',
              resumo: 'Verbo-Substantivo, navegar por pastas e descobrir comandos sozinho.',
              minutos: 9,
              corpo: `
<p>O <strong>PowerShell</strong> é o terminal e a linguagem de automação do Windows (e também roda no Linux e no Mac). Com ele, o que você faz clicando (renomear 300 fotos, organizar downloads, gerar um relatório toda segunda) vira um script que roda em segundos. Abra pelo menu Iniciar ("PowerShell") ou no terminal do VS Code.</p>

<h2>Verbo-Substantivo</h2>
<p>Os comandos se chamam <strong>cmdlets</strong> e seguem o padrão <code>Verbo-Substantivo</code>, o que ajuda a adivinhar: <code>Get-</code> lê, <code>Set-</code> altera, <code>New-</code> cria, <code>Remove-</code> apaga.</p>
${trecho(`Get-Location                       # onde estou (atalho: pwd)
Set-Location C:\\Users\\ana\\Desktop  # entrar numa pasta (atalho: cd)
Get-ChildItem                      # listar o conteúdo (atalhos: ls, dir)
New-Item -ItemType Directory Testes
New-Item Testes\\nota.txt
Copy-Item Testes\\nota.txt Testes\\copia.txt
Rename-Item Testes\\copia.txt backup.txt
Remove-Item Testes\\backup.txt`)}
<p>Os parâmetros começam com hífen (<code>-ItemType</code>). A tecla <kbd>Tab</kbd> completa nomes de comandos, parâmetros e caminhos: use sempre.</p>

<h2>Descobrir sozinho</h2>
${trecho(`Get-Command *-Item*          # todos os comandos com "Item" no nome
Get-Help Copy-Item -Examples  # exemplos de uso
Get-Help Copy-Item -Online    # a documentação no navegador
Update-Help                   # baixa a ajuda completa (rode uma vez, como administrador)`)}
${dica('O PowerShell não pergunta "tem certeza?" na maioria dos comandos. Antes de um Remove-Item ou Move-Item com curinga (*), rode o mesmo comando com <code>-WhatIf</code>: ele mostra o que <em>faria</em>, sem fazer.')}

<h2>5.1 e 7</h2>
<p>O Windows já vem com o <strong>Windows PowerShell 5.1</strong> (<code>powershell.exe</code>). O <strong>PowerShell 7</strong> (<code>pwsh</code>) é a versão nova, que se instala à parte, roda em qualquer sistema e tem recursos como <code>&amp;&amp;</code>, <code>??</code> e o operador ternário. Os comandos desta trilha funcionam nos dois, e as diferenças importantes aparecem nas dicas.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual o padrão do nome dos cmdlets?',
                  opcoes: ['Substantivo_Verbo', 'Verbo-Substantivo', 'tudo-minusculo'],
                  certa: 1,
                  explicacao: 'Get-ChildItem, Set-Location, Remove-Item: o verbo diz a ação.'
                },
                {
                  pergunta: 'Como ver o que um Remove-Item com * apagaria, sem apagar?',
                  opcoes: ['-Force', '-WhatIf', '-Confirm:$false'],
                  certa: 1,
                  explicacao: '-WhatIf simula e lista o que seria feito.'
                },
                {
                  pergunta: 'Como ver exemplos de uso de um comando?',
                  opcoes: ['Get-Help Comando -Examples', 'Comando --help', 'man Comando -e'],
                  certa: 0,
                  explicacao: 'Get-Help tem também -Detailed, -Full e -Online.'
                }
              ]
            },
            {
              id: 'pipeline-de-objetos',
              titulo: 'O pipeline de objetos',
              resumo: 'Where-Object, Select-Object, Sort-Object e o que passa pelo |.',
              minutos: 11,
              corpo: `
<p>Em outros terminais, o <code>|</code> passa <strong>texto</strong> de um comando para o outro. No PowerShell, passa <strong>objetos</strong>, com propriedades. Um arquivo não é uma linha de texto: é um objeto com <code>Name</code>, <code>Length</code> (tamanho em bytes), <code>LastWriteTime</code>, <code>Extension</code>...</p>
${trecho(`# Ver as propriedades de um objeto
Get-ChildItem | Get-Member -MemberType Property

# Os 5 maiores arquivos da pasta Downloads
Get-ChildItem $HOME\\Downloads -File |
    Sort-Object Length -Descending |
    Select-Object -First 5 Name, @{ Name = 'MB'; Expression = { [math]::Round($_.Length / 1MB, 1) } }`)}
<p>O <code>@{ Name = ...; Expression = { ... } }</code> é uma <strong>propriedade calculada</strong>: uma coluna nova feita na hora. As chaves Name e Expression são sempre em inglês.</p>
<ul>
  <li><code>Where-Object</code> filtra: <code>Where-Object Extension -eq '.pdf'</code> ou <code>Where-Object { $_.Length -gt 10MB }</code>.</li>
  <li><code>Sort-Object</code> ordena; <code>Select-Object</code> escolhe propriedades e quantidade (<code>-First</code>, <code>-Last</code>).</li>
  <li><code>Measure-Object</code> conta e soma: <code>| Measure-Object Length -Sum</code>.</li>
  <li><code>Group-Object</code> agrupa: <code>| Group-Object Extension</code>.</li>
  <li>Dentro de <code>{ }</code>, <code>$_</code> é o objeto atual do pipeline.</li>
</ul>

<h2>Comparações</h2>
<p>Os operadores são palavras: <code>-eq</code> (igual), <code>-ne</code> (diferente), <code>-gt</code>, <code>-lt</code>, <code>-ge</code>, <code>-le</code>, <code>-like</code> (com curinga: <code>-like '*.jpg'</code>) e <code>-match</code> (expressão regular). Comparações de texto <strong>não diferenciam maiúsculas</strong> por padrão; <code>-ceq</code> diferencia.</p>
${trecho(`# Quantos arquivos de cada tipo há em Documentos, do tipo mais comum para o menos
Get-ChildItem $HOME\\Documents -File -Recurse |
    Group-Object Extension |
    Sort-Object Count -Descending |
    Select-Object Count, Name -First 10`)}
${dica('<code>1MB</code>, <code>1GB</code> e <code>1KB</code> são números de verdade no PowerShell: <code>$_.Length -gt 50MB</code> funciona como você espera.')}
`,
              quiz: [
                {
                  pergunta: 'O que passa pelo | no PowerShell?',
                  opcoes: ['Texto', 'Objetos, com propriedades', 'Arquivos'],
                  certa: 1,
                  explicacao: 'Por isso dá para ordenar por Length ou filtrar por Extension sem recortar texto.'
                },
                {
                  pergunta: 'Como se escreve "maior que" no PowerShell?',
                  opcoes: ['>', '-gt', 'gt'],
                  certa: 1,
                  explicacao: '> no PowerShell é redirecionar a saída para um arquivo.'
                },
                {
                  pergunta: 'O que $_ representa dentro de Where-Object { ... }?',
                  opcoes: ['O primeiro objeto', 'O objeto atual do pipeline', 'Uma variável vazia'],
                  certa: 1,
                  explicacao: 'Também pode ser escrito $PSItem.'
                }
              ]
            },
            {
              id: 'pratica-relatorio-de-pasta',
              titulo: 'Prática: raio-x de uma pasta',
              resumo: 'Descubra o que ocupa espaço na sua pasta de Downloads.',
              minutos: 15,
              corpo: `
<p>Só leitura: nada nesta prática apaga ou move arquivos.</p>
<h2>Tarefas</h2>
<ol>
  <li>Quantos arquivos há na sua pasta Downloads (sem contar subpastas)?</li>
  <li>Quanto eles ocupam ao todo, em MB?</li>
  <li>Liste os 10 maiores, com nome e tamanho em MB.</li>
  <li>Mostre quantos arquivos há de cada extensão, da mais comum para a menos comum.</li>
  <li>Liste os arquivos que não são modificados há mais de 180 dias.</li>
</ol>
${resposta(`
${trecho(`$pasta = "$HOME\\Downloads"
$arquivos = Get-ChildItem $pasta -File

# 1
$arquivos.Count

# 2
[math]::Round(($arquivos | Measure-Object Length -Sum).Sum / 1MB, 1)

# 3
$arquivos | Sort-Object Length -Descending | Select-Object -First 10 Name,
    @{ Name = 'MB'; Expression = { [math]::Round($_.Length / 1MB, 1) } }

# 4
$arquivos | Group-Object Extension | Sort-Object Count -Descending | Select-Object Count, Name

# 5
$limite = (Get-Date).AddDays(-180)
$arquivos | Where-Object LastWriteTime -lt $limite | Select-Object Name, LastWriteTime`)}
<p>Guardar a lista numa variável (<code>$arquivos</code>) evita ler o disco de novo a cada pergunta. <code>$arquivos.Count</code> funciona porque o resultado é uma lista de objetos.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que guardar o resultado do Get-ChildItem em $arquivos?',
                  opcoes: [
                    'É obrigatório',
                    'Para ler o disco uma vez e reaproveitar nas outras perguntas',
                    'Para apagar depois'
                  ],
                  certa: 1,
                  explicacao: 'Variáveis guardam os objetos, com todas as propriedades.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Scripts, funções, CSV e JSON.',
      modulos: [
        {
          titulo: 'Scripts',
          itens: [
            {
              id: 'scripts-e-funcoes',
              titulo: 'Scripts, parâmetros e erros',
              resumo: 'Arquivos .ps1, política de execução, param, if, foreach e try/catch.',
              minutos: 13,
              corpo: `
<h2>O primeiro script</h2>
<p>Um script é um arquivo <code>.ps1</code> com os comandos. Por segurança, o Windows vem bloqueando scripts. Libere os seus (uma vez só, sem precisar de administrador):</p>
${trecho(`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`)}
<p>Com <code>RemoteSigned</code>, scripts criados no seu computador rodam; os baixados da internet precisam ser assinados (ou desbloqueados com <code>Unblock-File</code>, se você confiar neles).</p>
${trecho(`# relatorio.ps1
param(
    [Parameter(Mandatory)] [string] $Pasta,
    [int] $Dias = 30
)

$limite = (Get-Date).AddDays(-$Dias)
$recentes = Get-ChildItem $Pasta -File | Where-Object LastWriteTime -ge $limite

if ($recentes.Count -eq 0) {
    Write-Host "Nada modificado nos últimos $Dias dias."
} else {
    foreach ($arquivo in $recentes) {
        Write-Host ("{0,-40} {1:dd/MM/yyyy}" -f $arquivo.Name, $arquivo.LastWriteTime)
    }
}`)}
${trecho(`.\\relatorio.ps1 -Pasta $HOME\\Documents -Dias 7`)}
<ul>
  <li><code>param()</code> no topo declara os parâmetros, com tipo e valor padrão. <code>Mandatory</code> pergunta se faltar.</li>
  <li>Variáveis começam com <code>$</code>. Dentro de aspas <strong>duplas</strong>, elas são substituídas: <code>"Olá, $nome"</code>. Em aspas simples, não.</li>
  <li><code>-f</code> formata: <code>"{0:N2}" -f 1234.5</code> dá "1.234,50" num Windows em português.</li>
  <li>Funções: <code>function Converter-Tamanho { param($Bytes) ... }</code>.</li>
</ul>

<h2>Erros</h2>
${trecho(`try {
    $dados = Get-Content 'C:\\nao-existe.txt' -ErrorAction Stop
} catch {
    Write-Warning "Não deu para ler: $($_.Exception.Message)"
}`)}
<p>Muitos erros do PowerShell não interrompem o script ("não terminais"): o <code>catch</code> só pega os que param a execução. <code>-ErrorAction Stop</code> transforma o erro daquele comando num erro que para, e o <code>catch</code> funciona. Para valer no script inteiro: <code>$ErrorActionPreference = 'Stop'</code> no começo.</p>
${dica('No Windows PowerShell 5.1, salve os scripts como <strong>UTF-8 com BOM</strong> (no VS Code: clique em "UTF-8" na barra de baixo, Salvar com codificação). Sem o BOM, o 5.1 lê o arquivo na codificação antiga do Windows e "Relatório" vira "RelatÃ³rio". O PowerShell 7 não tem esse problema.')}
`,
              quiz: [
                {
                  pergunta: 'Como liberar seus próprios scripts sem administrador?',
                  opcoes: [
                    'Set-ExecutionPolicy Unrestricted',
                    'Set-ExecutionPolicy -Scope CurrentUser RemoteSigned',
                    'Renomear para .bat'
                  ],
                  certa: 1,
                  explicacao: 'Vale só para o seu usuário e ainda protege contra scripts baixados.'
                },
                {
                  pergunta: 'Por que o catch não pegou o erro do Get-Content?',
                  opcoes: [
                    'O try estava errado',
                    'O erro era não terminal; faltou -ErrorAction Stop',
                    'catch não existe no PowerShell'
                  ],
                  certa: 1,
                  explicacao: 'Só erros que param a execução chegam ao catch.'
                },
                {
                  pergunta: 'No PowerShell 5.1, "Relatório" virou "RelatÃ³rio". O que fazer?',
                  opcoes: ['Tirar os acentos', 'Salvar o script como UTF-8 com BOM', 'Usar aspas simples'],
                  certa: 1,
                  explicacao: 'O 5.1 precisa do BOM para saber que o arquivo é UTF-8.'
                }
              ]
            },
            {
              id: 'csv-json-e-web',
              titulo: 'CSV, JSON e APIs',
              resumo: 'Import-Csv, Export-Csv, ConvertTo-Json e Invoke-RestMethod.',
              minutos: 12,
              corpo: `
<h2>CSV</h2>
<p><code>Import-Csv</code> transforma cada linha num objeto, com uma propriedade por coluna. Tudo o que você viu de pipeline funciona em cima:</p>
${trecho(`# CSV brasileiro: separador ; e acentos
$vendas = Import-Csv .\\vendas.csv -Delimiter ';' -Encoding UTF8

$vendas | Where-Object Vendedor -eq 'Ana' | Select-Object Data, Produto, Valor

# Somar: os valores chegam como texto, e "62,90" precisa virar número
$total = ($vendas | ForEach-Object { [decimal]($_.Valor -replace '\\.', '' -replace ',', '.') } |
    Measure-Object -Sum).Sum

# Gravar um resultado
$vendas | Group-Object Vendedor | Select-Object Name, Count |
    Export-Csv .\\por-vendedor.csv -Delimiter ';' -NoTypeInformation -Encoding UTF8`)}
${dica('Use <code>-Delimiter ";"</code> e <code>-Encoding UTF8</code> para o arquivo abrir certo no Excel em português. No 5.1, o <code>-NoTypeInformation</code> evita uma linha estranha "#TYPE" no começo (no 7 ela já não aparece).')}

<h2>JSON</h2>
${trecho(`$config = Get-Content .\\config.json -Raw -Encoding UTF8 | ConvertFrom-Json
$config.pasta
$config.extensoes += '.webp'
$config | ConvertTo-Json -Depth 5 | Set-Content .\\config.json -Encoding UTF8`)}
<p>O <code>-Depth</code> importa: por padrão o <code>ConvertTo-Json</code> só desce 2 níveis e o resto vira texto.</p>

<h2>APIs</h2>
<p><code>Invoke-RestMethod</code> chama uma API e já converte o JSON da resposta em objetos:</p>
${trecho(`$cep = Invoke-RestMethod 'https://viacep.com.br/ws/01001000/json/'
"$($cep.logradouro), $($cep.localidade) - $($cep.uf)"

$cotacao = Invoke-RestMethod 'https://economia.awesomeapi.com.br/json/last/USD-BRL'
"Dólar: R$ $($cotacao.USDBRL.bid)"`)}
<p><code>$( )</code> dentro de aspas duplas calcula uma expressão: necessário para acessar propriedades (<code>"$cep.uf"</code> sozinho não funciona).</p>
`,
              quiz: [
                {
                  pergunta: 'O que Import-Csv devolve?',
                  opcoes: [
                    'Uma linha de texto',
                    'Um objeto por linha, com uma propriedade por coluna',
                    'Uma tabela do Excel'
                  ],
                  certa: 1,
                  explicacao: 'E os valores chegam como texto: converta antes de somar.'
                },
                {
                  pergunta: 'Por que ConvertTo-Json -Depth 5?',
                  opcoes: [
                    'Para formatar bonito',
                    'Por padrão ele só converte 2 níveis, e o resto vira texto',
                    'Para comprimir'
                  ],
                  certa: 1,
                  explicacao: 'Objetos aninhados mais fundo precisam de um -Depth maior.'
                },
                {
                  pergunta: 'Como mostrar $cep.uf dentro de um texto com aspas duplas?',
                  opcoes: ['"$cep.uf"', '"$($cep.uf)"', "'$cep.uf'"],
                  certa: 1,
                  explicacao: 'Sem o $( ), só $cep é substituído e ".uf" fica como texto.'
                }
              ]
            },
            {
              id: 'pratica-organizar-downloads',
              titulo: 'Prática: organizar arquivos por tipo',
              resumo: 'Um script que move arquivos para pastas por extensão, com simulação.',
              minutos: 25,
              corpo: `
<p>Para não arriscar seus arquivos de verdade, crie uma pasta de teste com arquivos falsos:</p>
${trecho(`$teste = "$HOME\\Desktop\\TesteOrganizar"
New-Item -ItemType Directory $teste -Force | Out-Null
'nota.txt', 'foto1.jpg', 'foto2.PNG', 'boleto.pdf', 'planilha.xlsx', 'video.mp4', 'sem-extensao' |
    ForEach-Object { New-Item -Path $teste -Name $_ -ItemType File -Force | Out-Null }`)}
<h2>Tarefas</h2>
<p>Escreva o script <code>organizar.ps1</code>:</p>
<ol>
  <li>Recebe <code>-Pasta</code> (obrigatório) e um parâmetro <code>-Simular</code> (switch).</li>
  <li>Usa um mapa de categorias: Imagens (.jpg, .jpeg, .png, .webp), Documentos (.pdf, .txt, .docx), Planilhas (.xlsx, .csv) e Vídeos (.mp4).</li>
  <li>Move cada arquivo para a subpasta da categoria (criando se não existir). Arquivos de outros tipos ficam onde estão.</li>
  <li>Com <code>-Simular</code>, só mostra o que faria.</li>
  <li>No fim, mostra quantos arquivos foram para cada pasta.</li>
</ol>
${resposta(`
${trecho(`# organizar.ps1  (salve como UTF-8 com BOM se usar o PowerShell 5.1)
param(
    [Parameter(Mandatory)] [string] $Pasta,
    [switch] $Simular
)

$categorias = @{
    Imagens    = '.jpg', '.jpeg', '.png', '.webp'
    Documentos = '.pdf', '.txt', '.docx'
    Planilhas  = '.xlsx', '.csv'
    Videos     = '.mp4'
}

$movidos = @{}
foreach ($arquivo in Get-ChildItem $Pasta -File) {
    $categoria = $categorias.Keys | Where-Object { $categorias[$_] -contains $arquivo.Extension.ToLower() }
    if (-not $categoria) { continue }

    $destino = Join-Path $Pasta $categoria
    if ($Simular) {
        Write-Host "Moveria $($arquivo.Name) para $categoria"
    } else {
        New-Item -ItemType Directory $destino -Force | Out-Null
        Move-Item $arquivo.FullName $destino
    }
    $movidos[$categoria] = 1 + $movidos[$categoria]
}

$movidos.GetEnumerator() | Sort-Object Name | ForEach-Object { "{0}: {1}" -f $_.Name, $_.Value }`)}
${trecho(`.\\organizar.ps1 -Pasta $HOME\\Desktop\\TesteOrganizar -Simular
.\\organizar.ps1 -Pasta $HOME\\Desktop\\TesteOrganizar`)}
<p>Resultado: Documentos 2, Imagens 2, Planilhas 1, Videos 1, e <code>sem-extensao</code> fica na raiz. O <code>.ToLower()</code> faz o "foto2.PNG" entrar em Imagens (o <code>-contains</code> não diferencia maiúsculas, mas é bom deixar explícito). <code>[switch]</code> vira verdadeiro só por estar presente na chamada.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o parâmetro -Simular nesse script?',
                  opcoes: [
                    'Deixar mais rápido',
                    'Ver o que seria feito antes de mexer nos arquivos de verdade',
                    'Apagar os originais'
                  ],
                  certa: 1,
                  explicacao: 'É o mesmo espírito do -WhatIf dos cmdlets.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Agendar tarefas, módulos e automação de verdade.',
      modulos: [
        {
          titulo: 'Automação',
          itens: [
            {
              id: 'agendar-e-modulos',
              titulo: 'Agendar, módulos e boas práticas',
              resumo: 'Agendador de Tarefas, módulos da PowerShell Gallery e scripts confiáveis.',
              minutos: 13,
              corpo: `
<h2>Rodar sozinho</h2>
<p>O <strong>Agendador de Tarefas</strong> do Windows roda um script num horário ou num evento (ao ligar o computador, ao fazer login). Pelo próprio PowerShell:</p>
${trecho(`$acao = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\\Scripts\\organizar.ps1" -Pasta "C:\\Users\\ana\\Downloads"'
$quando = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9am
Register-ScheduledTask -TaskName 'Organizar Downloads' -Action $acao -Trigger $quando

Get-ScheduledTask -TaskName 'Organizar Downloads'
Start-ScheduledTask -TaskName 'Organizar Downloads'      # rodar agora, para testar
Unregister-ScheduledTask -TaskName 'Organizar Downloads' -Confirm:$false`)}
${dica('Um script agendado roda sem ninguém olhando: grave o que aconteceu num arquivo de log (<code>Start-Transcript</code> no começo e <code>Stop-Transcript</code> no fim), senão um erro passa despercebido por meses.')}

<h2>Módulos</h2>
<p>Módulos acrescentam comandos. A <strong>PowerShell Gallery</strong> tem milhares:</p>
${trecho(`Find-Module ImportExcel
Install-Module ImportExcel -Scope CurrentUser    # lê e escreve .xlsx sem ter o Excel instalado
Export-Excel -Path .\\relatorio.xlsx -InputObject $vendas -AutoSize -TableName tbVendas`)}
<p>Seus próprios scripts também podem virar módulo: um arquivo <code>.psm1</code> com funções, numa pasta com o mesmo nome dentro de <code>Documents\\PowerShell\\Modules</code> (ou <code>WindowsPowerShell\\Modules</code> no 5.1).</p>

<h2>Controlar programas</h2>
<p>Para automatizar o próprio Excel, o Word ou o Outlook instalados, o PowerShell usa <strong>COM</strong>:</p>
${trecho(`$excel = New-Object -ComObject Excel.Application
$livro = $excel.Workbooks.Open("$HOME\\Desktop\\vendas.xlsx")
$livro.RefreshAll()               # atualiza consultas e tabelas dinâmicas
$livro.Save(); $livro.Close(); $excel.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null`)}
<p>Num Excel em português, as propriedades da API são em inglês, mas algumas coisas seguem o idioma: formatos de número com <code>NumberFormatLocal</code> esperam o padrão brasileiro (<code>#.##0,00</code>), e fórmulas em <code>FormulaLocal</code> usam os nomes em português.</p>

<h2>Script confiável</h2>
<ul>
  <li><code>$ErrorActionPreference = 'Stop'</code> no começo, para erros não passarem batidos.</li>
  <li><code>-WhatIf</code> e um modo de simulação em tudo o que apaga ou move.</li>
  <li>Caminhos com <code>Join-Path</code> e <code>$HOME</code>, nunca com o nome do seu usuário escrito no código.</li>
  <li>Comentário de ajuda no topo (<code>&lt;# .SYNOPSIS ... #&gt;</code>): aí o <code>Get-Help</code> funciona no seu script.</li>
  <li>Guarde os scripts num repositório Git. O módulo <strong>PSScriptAnalyzer</strong> aponta problemas comuns, como um linter.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Qual cmdlet registra uma tarefa no Agendador do Windows?',
                  opcoes: ['New-Task', 'Register-ScheduledTask', 'Start-Job'],
                  certa: 1,
                  explicacao: 'Junto com New-ScheduledTaskAction e New-ScheduledTaskTrigger.'
                },
                {
                  pergunta: 'Por que gravar um log num script agendado?',
                  opcoes: [
                    'É obrigatório',
                    'Ninguém está olhando quando ele roda: o log mostra o que aconteceu',
                    'Fica mais rápido'
                  ],
                  certa: 1,
                  explicacao: 'Start-Transcript grava tudo o que o script mostraria na tela.'
                },
                {
                  pergunta: 'Qual módulo lê e escreve .xlsx sem o Excel instalado?',
                  opcoes: ['ImportExcel', 'PSExcel.dll', 'Nenhum'],
                  certa: 0,
                  explicacao: 'Instale com Install-Module ImportExcel -Scope CurrentUser.'
                }
              ]
            },
            {
              id: 'pratica-relatorio-semanal',
              titulo: 'Prática: relatório semanal automático',
              resumo: 'Um script agendado que gera um CSV de resumo e grava log.',
              minutos: 30,
              corpo: `
<p>Junte tudo: um script que toda segunda gera um resumo da pasta Documentos.</p>
<h2>Tarefas</h2>
<ol>
  <li>Escreva <code>resumo-semanal.ps1</code>, que lista os arquivos de <code>Documents</code> (com subpastas) modificados nos últimos 7 dias.</li>
  <li>Gere um CSV em <code>Documents\\Relatorios</code> com nome que inclua a data (<code>resumo-2026-10-28.csv</code>), com Nome, Pasta, Tamanho em KB e Data de modificação, separado por <code>;</code> e em UTF-8.</li>
  <li>Grave um log com <code>Start-Transcript</code> e trate erros com <code>try/catch</code>.</li>
  <li>Agende para toda segunda às 9h e rode uma vez na mão para testar.</li>
</ol>
${resposta(`
${trecho(`# resumo-semanal.ps1
$ErrorActionPreference = 'Stop'
$docs = [Environment]::GetFolderPath('MyDocuments')
$saida = Join-Path $docs 'Relatorios'
New-Item -ItemType Directory $saida -Force | Out-Null
Start-Transcript -Path (Join-Path $saida 'log.txt') -Append

try {
    $limite = (Get-Date).AddDays(-7)
    $arquivos = Get-ChildItem $docs -File -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.LastWriteTime -ge $limite -and $_.DirectoryName -ne $saida }

    $arquivo = Join-Path $saida ("resumo-{0:yyyy-MM-dd}.csv" -f (Get-Date))
    $arquivos |
        Select-Object @{ Name = 'Nome'; Expression = { $_.Name } },
                      @{ Name = 'Pasta'; Expression = { $_.DirectoryName } },
                      @{ Name = 'KB'; Expression = { [math]::Round($_.Length / 1KB, 1) } },
                      @{ Name = 'Modificado'; Expression = { $_.LastWriteTime.ToString('dd/MM/yyyy HH:mm') } } |
        Export-Csv $arquivo -Delimiter ';' -NoTypeInformation -Encoding UTF8

    Write-Output "$($arquivos.Count) arquivo(s) no resumo: $arquivo"
} catch {
    Write-Error "Falhou: $($_.Exception.Message)"
} finally {
    Stop-Transcript
}`)}
${trecho(`$acao = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -ExecutionPolicy Bypass -File \`"$HOME\\Scripts\\resumo-semanal.ps1\`""
$quando = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9am
Register-ScheduledTask -TaskName 'Resumo semanal' -Action $acao -Trigger $quando
Start-ScheduledTask -TaskName 'Resumo semanal'`)}
<p><code>[Environment]::GetFolderPath('MyDocuments')</code> acha a pasta Documentos mesmo quando ela está no OneDrive. O <code>-ErrorAction SilentlyContinue</code> no Get-ChildItem ignora pastas sem permissão, e o filtro tira os próprios relatórios da lista. A crase (<code>\`"</code>) escapa as aspas dentro de aspas duplas.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o bloco finally?',
                  opcoes: [
                    'Só roda se der erro',
                    'Roda sempre, dando erro ou não: lugar certo para o Stop-Transcript',
                    'Encerra o PowerShell'
                  ],
                  certa: 1,
                  explicacao: 'Garante que o log seja fechado em qualquer caso.'
                }
              ]
            }
          ]
        },
        {
          titulo: 'Sistema, rede e paralelo',
          itens: [
            {
              id: 'sistema-e-rede',
              titulo: 'Processos, serviços, disco e rede',
              resumo: 'Investigar o que está acontecendo no computador e na rede.',
              minutos: 12,
              corpo: `
<h2>Processos</h2>
${trecho(`# Os 5 processos que mais usam memória, em MB
Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name, Id,
    @{ Name = 'MB'; Expression = { [math]::Round($_.WorkingSet64 / 1MB) } }

Get-Process chrome | Measure-Object WorkingSet64 -Sum      # quanto todas as abas somam
Stop-Process -Name notepad -WhatIf                         # simula antes de fechar de verdade`)}

<h2>Serviços</h2>
${trecho(`Get-Service | Where-Object Status -eq 'Running' | Sort-Object DisplayName
Get-Service -Name Spooler | Select-Object Name, Status, StartType
Restart-Service -Name Spooler        # a fila de impressão travou? (precisa de administrador)`)}

<h2>Disco e informações do sistema</h2>
<p>O <strong>CIM</strong> (<code>Get-CimInstance</code>) dá acesso a centenas de informações do Windows:</p>
${trecho(`Get-CimInstance Win32_LogicalDisk -Filter "DriveType = 3" | Select-Object DeviceID,
    @{ Name = 'Livre GB'; Expression = { [math]::Round($_.FreeSpace / 1GB, 1) } },
    @{ Name = 'Livre %'; Expression = { [math]::Round($_.FreeSpace / $_.Size * 100) } }

Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, LastBootUpTime
Get-ComputerInfo -Property CsName, OsName, CsTotalPhysicalMemory`)}

<h2>Eventos do Windows</h2>
${trecho(`# Erros do sistema nas últimas 24 horas
Get-WinEvent -FilterHashtable @{ LogName = 'System'; Level = 2; StartTime = (Get-Date).AddDays(-1) } |
    Select-Object TimeCreated, ProviderName, Message -First 10`)}

<h2>Rede</h2>
${trecho(`Test-NetConnection google.com -Port 443        # o site responde na porta do HTTPS?
Resolve-DnsName ottavvi.github.io               # para qual IP o nome aponta
Get-NetIPAddress -AddressFamily IPv4 | Select-Object InterfaceAlias, IPAddress
Invoke-WebRequest https://ottavvi.github.io/site-portfolio/ -Method Head | Select-Object StatusCode`)}
${dica('Antes de chamar o suporte com "a internet não funciona", três comandos dizem muito: <code>Test-NetConnection</code> (chega no site?), <code>Resolve-DnsName</code> (o nome resolve?) e <code>Get-NetIPAddress</code> (o computador tem um IP válido?).')}
`,
              quiz: [
                {
                  pergunta: 'Como ver o espaço livre dos discos?',
                  opcoes: ['Get-Disk -Free', 'Get-CimInstance Win32_LogicalDisk', 'Get-Space'],
                  certa: 1,
                  explicacao: 'FreeSpace e Size vêm em bytes: divida por 1GB.'
                },
                {
                  pergunta: 'Como testar se um site responde na porta 443?',
                  opcoes: ['ping site -p 443', 'Test-NetConnection site -Port 443', 'Get-Port 443'],
                  certa: 1,
                  explicacao: 'O ping não testa portas; Test-NetConnection sim.'
                },
                {
                  pergunta: 'O que -WhatIf faz no Stop-Process?',
                  opcoes: ['Fecha à força', 'Mostra o que seria fechado, sem fechar', 'Pede senha'],
                  certa: 1,
                  explicacao: 'Sempre útil antes de comandos que encerram ou apagam.'
                }
              ]
            },
            {
              id: 'objetos-e-paralelo',
              titulo: 'Objetos próprios, splatting e paralelo',
              resumo: 'PSCustomObject, hashtables, tarefas em segundo plano e ForEach-Object -Parallel.',
              minutos: 12,
              corpo: `
<h2>Seus próprios objetos</h2>
<p>Scripts ficam muito mais úteis quando devolvem <strong>objetos</strong> em vez de texto: aí o resultado pode ser filtrado, ordenado e exportado como qualquer outro.</p>
${trecho(`$relatorio = foreach ($disco in Get-CimInstance Win32_LogicalDisk -Filter "DriveType = 3") {
    [PSCustomObject]@{
        Disco   = $disco.DeviceID
        LivreGB = [math]::Round($disco.FreeSpace / 1GB, 1)
        Alerta  = ($disco.FreeSpace / $disco.Size) -lt 0.15
    }
}
$relatorio | Where-Object Alerta | Export-Csv alertas.csv -NoTypeInformation -Encoding UTF8`)}

<h2>Hashtables e splatting</h2>
<p>Comandos com muitos parâmetros ficam ilegíveis numa linha. O <strong>splatting</strong> passa os parâmetros a partir de uma hashtable, com <code>@</code> no lugar do <code>$</code>:</p>
${trecho(`$email = @{
    To         = 'equipe@empresa.com'
    Subject    = 'Relatório semanal'
    Body       = $texto
    Attachments = 'relatorio.csv'
}
Send-MailMessage @email -SmtpServer 'smtp.empresa.com'   # (comando legado, só como exemplo de splatting)

$config = @{ Pasta = "$HOME\\Downloads"; Dias = 30 }
$config.Pasta
$config['Dias'] += 7`)}

<h2>Em segundo plano</h2>
${trecho(`$tarefa = Start-Job { Get-ChildItem C:\\ -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum }
# ... o terminal continua livre ...
Receive-Job $tarefa -Wait -AutoRemoveJob`)}

<h2>Em paralelo (PowerShell 7)</h2>
<p>Para muitas operações lentas e independentes (conferir 50 sites, processar 200 arquivos), <code>ForEach-Object -Parallel</code> roda várias ao mesmo tempo:</p>
${trecho(`$sites = 'https://github.com', 'https://ottavvi.github.io', 'https://www.gov.br'
$sites | ForEach-Object -Parallel {
    $inicio = Get-Date
    try {
        $r = Invoke-WebRequest $_ -Method Head -TimeoutSec 10
        [PSCustomObject]@{ Site = $_; Status = $r.StatusCode; Ms = ((Get-Date) - $inicio).TotalMilliseconds }
    } catch {
        [PSCustomObject]@{ Site = $_; Status = 'ERRO'; Ms = $null }
    }
} -ThrottleLimit 5`)}
<p>Dentro do bloco paralelo, variáveis de fora só entram com <code>$using:</code> (<code>$using:limite</code>), porque cada execução roda isolada.</p>
${dica('Para administrar outros computadores da rede, o PowerShell tem o <strong>remoting</strong>: <code>Invoke-Command -ComputerName PC01, PC02 -ScriptBlock { Get-Service Spooler }</code> roda o bloco nos dois ao mesmo tempo (exige o WinRM habilitado e permissão de administrador lá).')}
`,
              quiz: [
                {
                  pergunta: 'Por que devolver [PSCustomObject] em vez de texto num script?',
                  opcoes: [
                    'É mais bonito',
                    'O resultado pode ser filtrado, ordenado e exportado como qualquer objeto',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'Texto precisaria ser recortado; objetos têm propriedades.'
                },
                {
                  pergunta: 'O que é splatting?',
                  opcoes: [
                    'Dividir um arquivo',
                    'Passar os parâmetros de um comando a partir de uma hashtable, com @',
                    'Rodar em paralelo'
                  ],
                  certa: 1,
                  explicacao: 'Comando @parametros em vez de uma linha enorme.'
                },
                {
                  pergunta: 'Como usar uma variável de fora dentro de ForEach-Object -Parallel?',
                  opcoes: ['Normalmente', 'Com $using:nome', 'Não dá'],
                  certa: 1,
                  explicacao: 'Cada execução paralela roda isolada.'
                }
              ]
            },
            {
              id: 'pratica-monitor',
              titulo: 'Prática: monitor do computador',
              resumo: 'Um script que confere disco, memória e sites e grava um relatório.',
              minutos: 30,
              corpo: `
<h2>Tarefas</h2>
<p>Escreva <code>monitor.ps1</code>, que:</p>
<ol>
  <li>Lista cada disco fixo com o espaço livre em GB e em %, marcando <code>Alerta</code> quando estiver abaixo de 15%.</li>
  <li>Lista os 5 processos que mais usam memória.</li>
  <li>Confere se uma lista de sites responde (status HTTP ou "ERRO").</li>
  <li>Junta tudo num arquivo de texto com data e hora no nome, em <code>Documents\\Monitor</code>.</li>
  <li>Se algum disco estiver em alerta ou algum site com erro, mostra um aviso com <code>Write-Warning</code> e termina com código de saída 1 (<code>exit 1</code>), para o Agendador de Tarefas registrar a falha.</li>
</ol>
${resposta(`
${trecho(`# monitor.ps1 (UTF-8 com BOM no PowerShell 5.1)
$ErrorActionPreference = 'Stop'
$sites = 'https://github.com', 'https://ottavvi.github.io/site-portfolio/'

$discos = foreach ($d in Get-CimInstance Win32_LogicalDisk -Filter "DriveType = 3") {
    $pct = [math]::Round($d.FreeSpace / $d.Size * 100)
    [PSCustomObject]@{ Disco = $d.DeviceID; LivreGB = [math]::Round($d.FreeSpace / 1GB, 1); LivrePct = $pct; Alerta = $pct -lt 15 }
}

$processos = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 5 Name,
    @{ Name = 'MB'; Expression = { [math]::Round($_.WorkingSet64 / 1MB) } }

$verificados = foreach ($site in $sites) {
    try {
        $status = (Invoke-WebRequest $site -Method Head -TimeoutSec 10 -UseBasicParsing).StatusCode
    } catch {
        $status = 'ERRO'
    }
    [PSCustomObject]@{ Site = $site; Status = $status }
}

$pasta = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Monitor'
New-Item -ItemType Directory $pasta -Force | Out-Null
$arquivo = Join-Path $pasta ("monitor-{0:yyyy-MM-dd_HHmm}.txt" -f (Get-Date))

@(
    "Monitor de $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
    ''
    'DISCOS'; $discos | Format-Table -AutoSize | Out-String
    'PROCESSOS'; $processos | Format-Table -AutoSize | Out-String
    'SITES'; $verificados | Format-Table -AutoSize | Out-String
) | Set-Content $arquivo -Encoding UTF8

$problemas = @($discos | Where-Object Alerta) + @($verificados | Where-Object Status -eq 'ERRO')
if ($problemas.Count -gt 0) {
    Write-Warning "$($problemas.Count) problema(s). Veja $arquivo"
    exit 1
}
Write-Output "Tudo certo. Relatório em $arquivo"`)}
<p><code>Format-Table | Out-String</code> transforma as tabelas em texto para o arquivo. Os <code>@()</code> garantem que <code>$problemas</code> seja sempre uma lista, mesmo com zero ou um item. O <code>-UseBasicParsing</code> evita depender do Internet Explorer no PowerShell 5.1.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que terminar com exit 1 quando há problema?',
                  opcoes: [
                    'Para fechar a janela',
                    'O código de saída diferente de 0 sinaliza falha para quem rodou (o Agendador, um CI)',
                    'É obrigatório no PowerShell'
                  ],
                  certa: 1,
                  explicacao: '0 é sucesso; qualquer outro número, falha.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
