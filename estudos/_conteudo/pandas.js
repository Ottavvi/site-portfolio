// Trilha de Python para dados (pandas). O editor é o de Python (Pyodide), que baixa o pandas na primeira vez que o
// código tem "import pandas" (alguns segundos). Os dados de exemplo ficam no próprio código, em textos CSV.
// Os testes rodam Python com doc.defaultView.__py.runPython('...') e conferem que o resultado é True.
// Atenção: o conteúdo fica em template strings: nada de ${ (cuidado com f"R${...}") e barras invertidas dobradas.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

// Os dados de vendas usados nas aulas (uma loja de café, como nas trilhas de SQL)
const VENDAS = `import io
import pandas as pd

pd.set_option("display.width", 120)

VENDAS = """data;cliente;produto;categoria;quantidade;preco
2026-07-02;Ana;Café em grãos 1kg;Mercearia;2;62.90
2026-07-02;Ana;Filtro de papel;Mercearia;3;9.90
2026-07-15;Bruno;Moedor manual;Utensílios;1;149.00
2026-07-15;Bruno;Caneca de cerâmica;Casa;2;34.50
2026-08-03;Ana;Café em grãos 1kg;Mercearia;1;62.90
2026-08-03;Ana;Chá verde 100g;Mercearia;2;22.00
2026-09-05;Diego;Prensa francesa;Utensílios;1;119.90
2026-09-18;Elisa;Balança de precisão;Utensílios;1;75.50
2026-10-01;Bruno;Caneca de cerâmica;Casa;4;34.50
2026-10-12;Ana;Moedor manual;Utensílios;1;149.00
2026-10-20;Fábio;Chá verde 100g;Mercearia;1;22.00
2026-10-25;Diego;Garrafa térmica;Casa;2;89.00"""

vendas = pd.read_csv(io.StringIO(VENDAS), sep=";", parse_dates=["data"])
`;

module.exports = {
  id: 'pandas',
  area: 'Dados e BI',
  titulo: 'Python para dados',
  sigla: 'pd',
  linguagem: 'python',
  resumo: 'Ler, limpar, cruzar e resumir dados com pandas, o Excel programável do Python.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'DataFrames: ler, olhar, escolher, filtrar e limpar.',
      modulos: [
        {
          titulo: 'Primeiros DataFrames',
          itens: [
            {
              id: 'dataframes',
              titulo: 'DataFrame: a tabela do Python',
              resumo: 'Ler um CSV, conhecer os dados, escolher colunas, filtrar e ordenar.',
              minutos: 12,
              corpo: `
<p>O <strong>pandas</strong> é a biblioteca de análise de dados do Python. Ele traz o <strong>DataFrame</strong>: uma tabela com linhas e colunas com nome, como uma planilha, só que comandada por código. O que leva meia hora de cliques no Excel vira três linhas que rodam de novo, iguais, no mês seguinte.</p>
<p>Esta trilha continua a de <a href="../python/">Python</a>. Na primeira vez que um exemplo roda, o editor baixa o pandas (alguns segundos); depois fica rápido.</p>

<h2>Ler os dados</h2>
<p>Em casa, seria <code>pd.read_csv("vendas.csv")</code> ou <code>pd.read_excel("vendas.xlsx")</code>. Aqui, os dados estão num texto dentro do próprio código, e o <code>io.StringIO</code> faz o texto se passar por um arquivo:</p>
${codigo(`${VENDAS}
print(vendas.head())     # as 5 primeiras linhas
print(vendas.shape)      # (linhas, colunas)
print(vendas.dtypes)     # o tipo de cada coluna`)}
<p>O <code>sep=";"</code> é porque o CSV usa ponto e vírgula, como os exportados pelo Excel em português. O <code>parse_dates</code> transforma a coluna de texto em datas de verdade.</p>

<h2>Conhecer os dados</h2>
${codigo(`${VENDAS}
print(vendas.describe())                  # contagem, média, mínimo, máximo... das colunas numéricas
print(vendas["categoria"].value_counts()) # quantas linhas de cada categoria
print(vendas["cliente"].unique())         # os valores diferentes`)}

<h2>Escolher, filtrar e ordenar</h2>
${codigo(`${VENDAS}
# Uma coluna (vira uma Series) ou várias (continua DataFrame: note os colchetes duplos)
print(vendas["produto"].head(3))
print(vendas[["data", "produto", "preco"]].head(3))

# Filtrar: a condição gera True/False por linha, e só ficam as True
caros = vendas[vendas["preco"] > 80]
print(caros[["produto", "preco"]])

# Várias condições: & (e), | (ou), cada uma entre parênteses
ana_mercearia = vendas[(vendas["cliente"] == "Ana") & (vendas["categoria"] == "Mercearia")]
print(ana_mercearia)

# Ordenar
print(vendas.sort_values("preco", ascending=False).head(3))`)}

<h2>Colunas novas</h2>
<p>Contas com colunas valem para todas as linhas de uma vez, sem laço:</p>
${codigo(`${VENDAS}
vendas["total"] = vendas["quantidade"] * vendas["preco"]
vendas["mes"] = vendas["data"].dt.strftime("%Y-%m")
print(vendas[["mes", "produto", "total"]])
print("Faturamento:", round(vendas["total"].sum(), 2))`)}
${dica('Em vez de <code>and</code> e <code>or</code>, filtros do pandas usam <code>&amp;</code> e <code>|</code>, e cada condição precisa de parênteses. Esquecer os parênteses é o erro mais comum de quem começa.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre vendas["produto"] e vendas[["produto"]]?',
                  opcoes: [
                    'Nenhuma',
                    'O primeiro devolve uma Series (uma coluna); o segundo, um DataFrame com uma coluna',
                    'O segundo dá erro'
                  ],
                  certa: 1,
                  explicacao: 'Colchetes duplos passam uma lista de colunas, e o resultado continua uma tabela.'
                },
                {
                  pergunta: 'Como filtrar vendas acima de 80 da categoria Casa?',
                  opcoes: [
                    'vendas[vendas["preco"] > 80 and vendas["categoria"] == "Casa"]',
                    'vendas[(vendas["preco"] > 80) & (vendas["categoria"] == "Casa")]',
                    'vendas.filter(preco > 80, categoria = "Casa")'
                  ],
                  certa: 1,
                  explicacao: '& e parênteses em cada condição.'
                },
                {
                  pergunta: 'Para que serve parse_dates=["data"] no read_csv?',
                  opcoes: [
                    'Apagar a coluna data',
                    'Converter a coluna de texto em datas de verdade',
                    'Ordenar por data'
                  ],
                  certa: 1,
                  explicacao: 'Com datas de verdade, funcionam .dt.month, comparações e agrupamentos por período.'
                }
              ]
            },
            {
              id: 'limpar-dados',
              titulo: 'Limpar dados',
              resumo: 'Valores faltando, tipos errados, textos bagunçados e linhas repetidas.',
              minutos: 13,
              corpo: `
<p>Dados reais chegam sujos: decimais com vírgula, nomes com espaço sobrando, a mesma categoria escrita de três jeitos, linhas repetidas e campos em branco. Limpar costuma ser a maior parte do trabalho, e o pandas tem uma ferramenta para cada problema.</p>
${codigo(`import io
import pandas as pd

SUJO = """cliente;categoria;quantidade;preco
Ana; mercearia ;2;62,90
Bruno;Casa;;34,50
Ana; mercearia ;2;62,90
carla;UTENSÍLIOS;1;149,00
Diego;Casa;3;
"""
df = pd.read_csv(io.StringIO(SUJO), sep=";")
print(df)
print(df.dtypes)          # preco veio como texto (object) por causa da vírgula
print(df.isna().sum())    # quantos vazios em cada coluna`)}

<h2>Uma ferramenta para cada problema</h2>
${codigo(`import io
import pandas as pd

SUJO = """cliente;categoria;quantidade;preco
Ana; mercearia ;2;62,90
Bruno;Casa;;34,50
Ana; mercearia ;2;62,90
carla;UTENSÍLIOS;1;149,00
Diego;Casa;3;
"""
df = pd.read_csv(io.StringIO(SUJO), sep=";")

# Texto: tirar espaços e padronizar maiúsculas
df["cliente"] = df["cliente"].str.strip().str.title()
df["categoria"] = df["categoria"].str.strip().str.capitalize()

# Número com vírgula: trocar por ponto e converter
df["preco"] = df["preco"].str.replace(",", ".").astype(float)

# Linhas repetidas
df = df.drop_duplicates()

# Valores faltando: preencher ou descartar, conforme o caso
df["quantidade"] = df["quantidade"].fillna(1).astype(int)   # assumir 1
df = df.dropna(subset=["preco"])                            # sem preço não dá para usar

print(df.reset_index(drop=True))
print(df.dtypes)`)}
<ul>
  <li><code>.str</code> dá acesso aos métodos de texto em cada valor: <code>strip</code>, <code>lower</code>, <code>title</code>, <code>replace</code>, <code>contains</code>, <code>split</code>.</li>
  <li><code>astype</code> converte o tipo. <code>pd.to_numeric(coluna, errors="coerce")</code> converte e transforma o que não é número em vazio, em vez de dar erro.</li>
  <li><code>fillna</code> preenche os vazios; <code>dropna</code> descarta as linhas com vazio (o <code>subset</code> diz em quais colunas olhar).</li>
  <li>Depois de remover linhas, <code>reset_index(drop=True)</code> renumera de 0 em diante.</li>
</ul>
${dica('Quando o CSV vem do Excel em português, <code>pd.read_csv(arquivo, sep=";", decimal=",", encoding="utf-8-sig")</code> já resolve a vírgula decimal e o caractere invisível que o Excel põe no começo do arquivo.')}
`,
              quiz: [
                {
                  pergunta: 'A coluna preco veio como object (texto) por causa da vírgula. Como converter?',
                  opcoes: [
                    'df["preco"].astype(int)',
                    'df["preco"].str.replace(",", ".").astype(float)',
                    'df["preco"].round()'
                  ],
                  certa: 1,
                  explicacao: 'Primeiro troca a vírgula por ponto, depois converte para número decimal.'
                },
                {
                  pergunta: 'O que df.isna().sum() mostra?',
                  opcoes: ['A soma das colunas', 'Quantos valores vazios há em cada coluna', 'As linhas repetidas'],
                  certa: 1,
                  explicacao: 'isna marca os vazios com True, e a soma conta os True de cada coluna.'
                },
                {
                  pergunta: 'O que dropna(subset=["preco"]) faz?',
                  opcoes: [
                    'Apaga a coluna preco',
                    'Descarta as linhas em que o preço está vazio',
                    'Preenche os preços vazios'
                  ],
                  certa: 1,
                  explicacao: 'Só olha a coluna preco para decidir quais linhas sair.'
                }
              ]
            },
            {
              id: 'desafio-limpeza',
              tipo: 'desafio',
              titulo: 'Desafio: limpar a exportação do sistema',
              resumo: 'Uma função que deixa a planilha de vendas pronta para análise.',
              minutos: 18,
              enunciado: `
<p>O sistema da loja exporta as vendas com vários problemas. Escreva <code>limpar(df)</code>, que recebe o DataFrame lido do CSV e devolve um novo, limpo:</p>
<ul>
  <li><code>cliente</code> sem espaços nas pontas e com a primeira letra de cada palavra maiúscula (<code>"ana souza"</code> vira <code>"Ana Souza"</code>).</li>
  <li><code>preco</code> como número decimal (vem com vírgula, como <code>"62,90"</code>).</li>
  <li>Linhas <strong>sem quantidade</strong> são descartadas, e <code>quantidade</code> vira número inteiro.</li>
  <li>Linhas repetidas (iguais em tudo, depois de limpar) aparecem uma vez só.</li>
  <li>Uma coluna nova, <code>total</code>, com quantidade × preço.</li>
  <li>O índice volta a ser 0, 1, 2...</li>
</ul>`,
              inicial: `import io
import pandas as pd

TEXTO = """cliente;produto;quantidade;preco
ana souza;Café 1kg;2;62,90
 Bruno Lima ;Caneca;;34,50
ANA SOUZA;Café 1kg;2;62,90
carla dias;Moedor;1;149,00
"""
bruto = pd.read_csv(io.StringIO(TEXTO), sep=";")


def limpar(df):
    df = df.copy()
    # complete aqui
    return df


print(limpar(bruto))
`,
              testes: [
                [
                  'cliente sem espaços e com iniciais maiúsculas',
                  async doc =>
                    doc.defaultView.__py.runPython('list(limpar(bruto)["cliente"]) == ["Ana Souza", "Carla Dias"]') ===
                    true
                ],
                [
                  'preco é número decimal',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = limpar(bruto)\npd.api.types.is_float_dtype(r["preco"]) and list(r["preco"]) == [62.9, 149.0]'
                    ) === true
                ],
                [
                  'Sem linhas sem quantidade, e quantidade inteira',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = limpar(bruto)\npd.api.types.is_integer_dtype(r["quantidade"]) and list(r["quantidade"]) == [2, 1]'
                    ) === true
                ],
                [
                  'Sem repetidas, com total e índice renumerado',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = limpar(bruto)\nlen(r) == 2 and list(r.index) == [0, 1] and list(r["total"].round(2)) == [125.8, 149.0]'
                    ) === true
                ],
                [
                  'Funciona com outros dados',
                  async doc =>
                    doc.defaultView.__py
                      .runPython(`outro = pd.DataFrame({"cliente": [" rui  ", "Rui", "bia"], "produto": ["Chá", "Chá", "Filtro"], "quantidade": [1.0, 1.0, None], "preco": ["22,00", "22,00", "9,90"]})
r = limpar(outro)
list(r["cliente"]) == ["Rui"] and list(r["total"]) == [22.0] and list(r.index) == [0]`) === true
                ]
              ],
              solucao: `import io
import pandas as pd

TEXTO = """cliente;produto;quantidade;preco
ana souza;Café 1kg;2;62,90
 Bruno Lima ;Caneca;;34,50
ANA SOUZA;Café 1kg;2;62,90
carla dias;Moedor;1;149,00
"""
bruto = pd.read_csv(io.StringIO(TEXTO), sep=";")


def limpar(df):
    df = df.copy()
    df["cliente"] = df["cliente"].str.strip().str.title()
    df["preco"] = df["preco"].str.replace(",", ".").astype(float)
    df = df.dropna(subset=["quantidade"])
    df["quantidade"] = df["quantidade"].astype(int)
    df = df.drop_duplicates()
    df["total"] = df["quantidade"] * df["preco"]
    return df.reset_index(drop=True)


print(limpar(bruto))`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Agrupar, tabelas dinâmicas, juntar tabelas e trabalhar com datas.',
      modulos: [
        {
          titulo: 'Resumir e cruzar',
          itens: [
            {
              id: 'agrupar-e-resumir',
              titulo: 'Agrupar e resumir',
              resumo: 'groupby, agg, tabelas dinâmicas e percentuais.',
              minutos: 13,
              corpo: `
<h2>groupby</h2>
<p>O <code>groupby</code> é o <code>GROUP BY</code> do SQL e a tabela dinâmica do Excel: separa as linhas em grupos, calcula algo em cada um e junta os resultados.</p>
${codigo(`${VENDAS}
vendas["total"] = vendas["quantidade"] * vendas["preco"]

# Uma conta, uma coluna
print(vendas.groupby("categoria")["total"].sum().sort_values(ascending=False))

# Várias contas com nome (agregação nomeada)
resumo = vendas.groupby("cliente").agg(
    pedidos=("data", "nunique"),
    itens=("quantidade", "sum"),
    gasto=("total", "sum"),
).sort_values("gasto", ascending=False)
print(resumo.round(2))`)}
<p>As funções mais usadas no <code>agg</code>: <code>sum</code>, <code>mean</code>, <code>median</code>, <code>min</code>, <code>max</code>, <code>count</code> (não vazios), <code>size</code> (linhas) e <code>nunique</code> (valores diferentes).</p>

<h2>Tabela dinâmica</h2>
<p><code>pivot_table</code> monta a tabela cruzada: um valor na linha, outro na coluna e uma conta no meio.</p>
${codigo(`${VENDAS}
vendas["total"] = vendas["quantidade"] * vendas["preco"]
vendas["mes"] = vendas["data"].dt.strftime("%Y-%m")

tabela = vendas.pivot_table(index="mes", columns="categoria", values="total",
                            aggfunc="sum", fill_value=0, margins=True, margins_name="Total")
print(tabela.round(2))`)}

<h2>Percentual do total</h2>
<p>Dividir uma Series pela soma dela dá a participação de cada parte:</p>
${codigo(`${VENDAS}
vendas["total"] = vendas["quantidade"] * vendas["preco"]
por_categoria = vendas.groupby("categoria")["total"].sum()
pct = (por_categoria / por_categoria.sum() * 100).round(1)
print(pct.sort_values(ascending=False).astype(str) + "%")`)}
${dica('Depois de um groupby, a coluna do grupo vira o <strong>índice</strong>. Para ela voltar a ser uma coluna comum (para salvar num CSV ou fazer um merge), use <code>.reset_index()</code>.')}
`,
              quiz: [
                {
                  pergunta: 'Qual é o equivalente do GROUP BY do SQL no pandas?',
                  opcoes: ['sort_values', 'groupby', 'merge'],
                  certa: 1,
                  explicacao: 'Agrupa, calcula e junta os resultados.'
                },
                {
                  pergunta: 'Qual a diferença entre count e size num grupo?',
                  opcoes: [
                    'Nenhuma',
                    'count conta só os valores não vazios; size conta todas as linhas',
                    'size soma os valores'
                  ],
                  certa: 1,
                  explicacao: 'Com vazios na coluna, os dois dão números diferentes.'
                },
                {
                  pergunta: 'O que margins=True faz numa pivot_table?',
                  opcoes: ['Adiciona a linha e a coluna de totais', 'Arredonda os valores', 'Tira os vazios'],
                  certa: 0,
                  explicacao: 'O margins_name dá o nome dessa linha e coluna.'
                }
              ]
            },
            {
              id: 'juntar-e-datas',
              titulo: 'Juntar tabelas e trabalhar com datas',
              resumo: 'merge, concat, o acessor .dt e resample por período.',
              minutos: 13,
              corpo: `
<h2>merge: o JOIN do pandas</h2>
<p>Quase sempre os dados vêm em mais de uma tabela: as vendas têm o nome do cliente, mas a cidade está no cadastro. O <code>merge</code> junta as duas por uma coluna em comum:</p>
${codigo(`${VENDAS}
clientes = pd.DataFrame({
    "cliente": ["Ana", "Bruno", "Carla", "Diego", "Elisa"],
    "cidade": ["Curitiba", "São Paulo", "Curitiba", "Recife", "São Paulo"],
})

juntas = vendas.merge(clientes, on="cliente", how="left", validate="many_to_one")
print(juntas[["data", "cliente", "cidade", "produto"]])
print("Sem cidade:", juntas["cidade"].isna().sum())   # o Fábio não está no cadastro`)}
<ul>
  <li><code>how="left"</code> mantém todas as vendas, mesmo sem par (como o <code>LEFT JOIN</code>); <code>"inner"</code> só as que têm par.</li>
  <li><code>validate="many_to_one"</code> confere que cada cliente aparece uma vez só no cadastro. Se houver um repetido, dá erro em vez de duplicar as vendas em silêncio.</li>
  <li>Se as colunas tiverem nomes diferentes: <code>left_on="cliente_id", right_on="id"</code>.</li>
  <li><code>pd.concat([jan, fev, mar])</code> empilha tabelas com as mesmas colunas, como o <code>UNION ALL</code>.</li>
</ul>

<h2>Datas</h2>
<p>Uma coluna de datas tem o acessor <code>.dt</code> com as partes da data, e somar períodos é direto:</p>
${codigo(`${VENDAS}
vendas["ano"] = vendas["data"].dt.year
vendas["mes"] = vendas["data"].dt.month
vendas["dia_da_semana"] = vendas["data"].dt.day_name()
vendas["vence_em"] = vendas["data"] + pd.Timedelta(days=30)
hoje = pd.Timestamp("2026-10-31")
vendas["dias_atras"] = (hoje - vendas["data"]).dt.days
print(vendas[["data", "mes", "dia_da_semana", "vence_em", "dias_atras"]])`)}

<h2>Agrupar por período</h2>
<p>Com a data como índice, o <code>resample</code> agrupa por mês, semana ou dia, incluindo os períodos sem nenhuma venda (com zero):</p>
${codigo(`${VENDAS}
vendas["total"] = vendas["quantidade"] * vendas["preco"]
mensal = vendas.set_index("data")["total"].resample("MS").sum()   # MS: começo de cada mês
print(mensal)
print("Variação mês a mês (%):")
print((mensal.pct_change() * 100).round(1))`)}
${dica('Em datas brasileiras como "28/10/2026", use <code>pd.to_datetime(coluna, format="%d/%m/%Y")</code>. Sem o formato, o pandas pode achar que 02/11 é 11 de fevereiro.')}
`,
              quiz: [
                {
                  pergunta: 'Qual merge mantém todas as vendas, mesmo as de clientes fora do cadastro?',
                  opcoes: ['how="inner"', 'how="left" (com vendas à esquerda)', 'how="right"'],
                  certa: 1,
                  explicacao: 'O left mantém todas as linhas da tabela da esquerda.'
                },
                {
                  pergunta: 'Para que serve validate="many_to_one"?',
                  opcoes: [
                    'Deixar o merge mais rápido',
                    'Dar erro se a tabela da direita tiver chaves repetidas, em vez de duplicar linhas',
                    'Remover vazios'
                  ],
                  certa: 1,
                  explicacao: 'Chave repetida no cadastro multiplicaria as vendas sem aviso.'
                },
                {
                  pergunta: 'Qual a vantagem do resample sobre agrupar pelo texto do mês?',
                  opcoes: ['Nenhuma', 'Ele inclui os períodos sem nenhuma venda', 'Ele ordena ao contrário'],
                  certa: 1,
                  explicacao: 'Um mês sem vendas aparece com zero, e o pct_change compara com o mês certo.'
                }
              ]
            },
            {
              id: 'desafio-relatorio-de-vendas',
              tipo: 'desafio',
              titulo: 'Desafio: o relatório de vendas',
              resumo: 'groupby, merge e datas em três funções.',
              minutos: 22,
              enunciado: `
<p>Com os DataFrames <code>vendas</code> e <code>clientes</code> do código, escreva três funções (cada uma recebe os dados como parâmetro e não altera o original):</p>
<ul>
  <li><code>por_categoria(vendas)</code>: uma Series com o faturamento (quantidade × preço) de cada categoria, arredondado com 2 casas, do maior para o menor.</li>
  <li><code>mensal(vendas)</code>: um DataFrame com uma linha por mês, o <strong>índice</strong> no formato <code>"AAAA-MM"</code> em ordem, e as colunas <code>faturamento</code> (2 casas) e <code>itens</code> (soma das quantidades).</li>
  <li><code>por_cidade(vendas, clientes)</code>: uma Series com o faturamento de cada cidade (2 casas), do maior para o menor. Vendas de clientes fora do cadastro entram na cidade <code>"Sem cadastro"</code>.</li>
</ul>`,
              inicial: `${VENDAS}
clientes = pd.DataFrame({
    "cliente": ["Ana", "Bruno", "Carla", "Diego", "Elisa"],
    "cidade": ["Curitiba", "São Paulo", "Curitiba", "Recife", "São Paulo"],
})


def por_categoria(vendas):
    pass


def mensal(vendas):
    pass


def por_cidade(vendas, clientes):
    pass


print(por_categoria(vendas))
`,
              testes: [
                [
                  'por_categoria: faturamento por categoria, do maior para o menor',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = por_categoria(vendas)\nlist(r.index) == ["Utensílios", "Casa", "Mercearia"] and list(r.values) == [493.4, 385.0, 284.4]'
                    ) === true
                ],
                [
                  'mensal: índice AAAA-MM com faturamento e itens',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = mensal(vendas)\nlist(r.index) == ["2026-07", "2026-08", "2026-09", "2026-10"] and list(r["faturamento"]) == [373.5, 106.9, 195.4, 487.0] and list(r["itens"]) == [8, 3, 2, 8]'
                    ) === true
                ],
                [
                  'por_cidade: inclui "Sem cadastro" e ordena do maior para o menor',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = por_cidade(vendas, clientes)\nlist(r.index) == ["São Paulo", "Curitiba", "Recife", "Sem cadastro"] and list(r.values) == [431.5, 411.4, 297.9, 22.0]'
                    ) === true
                ],
                [
                  'As funções não alteram o DataFrame original',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'antes = list(vendas.columns)\npor_categoria(vendas); mensal(vendas); por_cidade(vendas, clientes)\nlist(vendas.columns) == antes'
                    ) === true
                ]
              ],
              solucao: `${VENDAS}
clientes = pd.DataFrame({
    "cliente": ["Ana", "Bruno", "Carla", "Diego", "Elisa"],
    "cidade": ["Curitiba", "São Paulo", "Curitiba", "Recife", "São Paulo"],
})


def com_total(vendas):
    return vendas.assign(total=vendas["quantidade"] * vendas["preco"])


def por_categoria(vendas):
    return com_total(vendas).groupby("categoria")["total"].sum().round(2).sort_values(ascending=False)


def mensal(vendas):
    v = com_total(vendas)
    v["mes"] = v["data"].dt.strftime("%Y-%m")
    r = v.groupby("mes").agg(faturamento=("total", "sum"), itens=("quantidade", "sum")).sort_index()
    r["faturamento"] = r["faturamento"].round(2)
    return r


def por_cidade(vendas, clientes):
    v = com_total(vendas).merge(clientes, on="cliente", how="left", validate="many_to_one")
    v["cidade"] = v["cidade"].fillna("Sem cadastro")
    return v.groupby("cidade")["total"].sum().round(2).sort_values(ascending=False)


print(por_categoria(vendas))
print(mensal(vendas))
print(por_cidade(vendas, clientes))`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Código de análise limpo e rápido, e levar os resultados para o Excel e o Power BI.',
      modulos: [
        {
          titulo: 'Análises de verdade',
          itens: [
            {
              id: 'encadear-e-vetorizar',
              titulo: 'Encadear e vetorizar',
              resumo: 'assign, query, pipe, np.where e por que evitar laços e apply.',
              minutos: 13,
              corpo: `
<h2>Vetorizar em vez de laços</h2>
<p>O pandas é rápido quando faz a conta na coluna inteira de uma vez (por baixo, em C, com o NumPy). Laços em Python, <code>iterrows</code> e <code>apply</code> linha a linha são dezenas a centenas de vezes mais lentos. Com 12 linhas, tanto faz; com 2 milhões, é a diferença entre um segundo e um minuto.</p>
${codigo(`import time
import numpy as np
import pandas as pd

df = pd.DataFrame({"preco": np.random.uniform(5, 200, 200_000), "quantidade": np.random.randint(1, 5, 200_000)})

t = time.perf_counter()
lento = df.apply(lambda linha: linha["preco"] * linha["quantidade"], axis=1)
print("apply:     ", round(time.perf_counter() - t, 3), "s")

t = time.perf_counter()
rapido = df["preco"] * df["quantidade"]
print("vetorizado:", round(time.perf_counter() - t, 4), "s")`)}

<h2>Decisões sem if</h2>
<p><code>np.where(condição, se_sim, se_não)</code> é o <code>SE</code> do Excel para a coluna inteira; <code>np.select</code> resolve vários casos, e <code>pd.cut</code> cria faixas:</p>
${codigo(`${VENDAS}
import numpy as np

vendas["total"] = vendas["quantidade"] * vendas["preco"]
vendas["frete"] = np.where(vendas["total"] >= 100, "grátis", "pago")
vendas["porte"] = np.select(
    [vendas["total"] < 50, vendas["total"] < 150],
    ["pequena", "média"],
    default="grande",
)
vendas["faixa_preco"] = pd.cut(vendas["preco"], bins=[0, 30, 100, 1000], labels=["até 30", "30 a 100", "acima de 100"])
print(vendas[["produto", "total", "frete", "porte", "faixa_preco"]])`)}

<h2>Encadear</h2>
<p>Em vez de criar variáveis intermediárias e mudar o DataFrame aos poucos, dá para escrever a análise como uma sequência de passos, cada um devolvendo um DataFrame novo. Fica fácil de ler de cima para baixo e de comentar um passo:</p>
${codigo(`${VENDAS}
resultado = (
    vendas
    .assign(total=lambda d: d["quantidade"] * d["preco"],
            mes=lambda d: d["data"].dt.strftime("%Y-%m"))
    .query("categoria != 'Casa'")
    .groupby(["mes", "categoria"], as_index=False)["total"].sum()
    .sort_values(["mes", "total"], ascending=[True, False])
    .round({"total": 2})
)
print(resultado)`)}
<ul>
  <li><code>assign</code> cria colunas e devolve um DataFrame novo (o <code>lambda d:</code> recebe o DataFrame daquele ponto da cadeia).</li>
  <li><code>query</code> filtra com uma expressão em texto, às vezes mais legível que os colchetes.</li>
  <li><code>pipe(funcao)</code> encaixa uma função sua no meio da cadeia: <code>.pipe(limpar)</code>.</li>
</ul>
${dica('O aviso <code>SettingWithCopyWarning</code> aparece quando você filtra e depois altera o resultado: o pandas não sabe se você queria mudar o original. Use <code>.copy()</code> depois do filtro, ou <code>assign</code>, e o aviso some.')}
`,
              quiz: [
                {
                  pergunta: 'Por que evitar apply linha a linha em tabelas grandes?',
                  opcoes: [
                    'Dá resultado errado',
                    'É muito mais lento que a conta vetorizada na coluna inteira',
                    'Não funciona com números'
                  ],
                  certa: 1,
                  explicacao: 'A conta vetorizada roda em C; o apply chama uma função Python para cada linha.'
                },
                {
                  pergunta: 'O que np.where(cond, "sim", "não") faz?',
                  opcoes: [
                    'Procura a posição de um valor',
                    'Escolhe "sim" ou "não" para cada linha, conforme a condição',
                    'Apaga linhas'
                  ],
                  certa: 1,
                  explicacao: 'É o SE do Excel aplicado à coluna inteira.'
                },
                {
                  pergunta: 'Qual a vantagem de encadear os passos com assign, query e groupby?',
                  opcoes: [
                    'Fica mais rápido sempre',
                    'A análise se lê de cima para baixo, sem alterar o DataFrame original',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'Cada passo devolve um DataFrame novo.'
                }
              ]
            },
            {
              id: 'do-pandas-para-o-mundo',
              titulo: 'Do pandas para o Excel, o banco e o Power BI',
              resumo: 'Salvar CSV que o Excel abre direito, Excel, Parquet, SQL e gráficos.',
              minutos: 11,
              corpo: `
<p>A análise só vale quando chega em quem decide. Estes comandos rodam no seu computador (com <code>pip install pandas openpyxl pyarrow matplotlib</code> num ambiente virtual):</p>

<h2>CSV que o Excel em português abre direito</h2>
${trecho(`resumo.to_csv("resumo.csv", sep=";", decimal=",", index=False, encoding="utf-8-sig")`)}
<p>Ponto e vírgula como separador, vírgula como decimal e o <code>utf-8-sig</code> para os acentos aparecerem certos ao dar dois cliques no arquivo.</p>

<h2>Excel com várias abas</h2>
${trecho(`with pd.ExcelWriter("relatorio.xlsx") as arquivo:
    vendas.to_excel(arquivo, sheet_name="Vendas", index=False)
    resumo.to_excel(arquivo, sheet_name="Resumo")`)}

<h2>Parquet: para dados grandes</h2>
<p>O formato <strong>Parquet</strong> guarda os tipos das colunas, é comprimido (um CSV de 1 GB vira algumas dezenas de MB) e é lido muito mais rápido. O Power BI e o Power Query leem Parquet direto.</p>
${trecho(`vendas.to_parquet("vendas.parquet")
vendas = pd.read_parquet("vendas.parquet")`)}

<h2>Bancos de dados</h2>
${trecho(`import sqlite3

with sqlite3.connect("loja.db") as conexao:
    vendas.to_sql("vendas", conexao, if_exists="replace", index=False)
    caros = pd.read_sql("SELECT * FROM vendas WHERE preco > ?", conexao, params=(100,))`)}
<p>Repare no <code>?</code> com <code>params</code>: a mesma consulta parametrizada da trilha de <a href="../seguranca-web/">segurança web</a>.</p>

<h2>Gráficos</h2>
${trecho(`import matplotlib.pyplot as plt

mensal["faturamento"].plot(kind="bar", title="Faturamento por mês")
plt.ylabel("R$")
plt.tight_layout()
plt.savefig("faturamento.png", dpi=150)`)}

<h2>Python dentro do Power BI e do Excel</h2>
<ul>
  <li>No Power BI Desktop, <em>Obter dados → Script Python</em> roda um script e importa cada DataFrame como uma tabela.</li>
  <li>No Excel do Microsoft 365, a função <code>=PY()</code> roda pandas direto na célula (o processamento é na nuvem da Microsoft).</li>
  <li>Para relatórios que se atualizam todo dia, o mais simples costuma ser um script que gera o Parquet ou o CSV numa pasta, agendado no Agendador de Tarefas (veja a trilha de <a href="../powershell/">PowerShell</a>), e o Power BI lendo essa pasta.</li>
</ul>
${dica('Jupyter Notebook (ou os notebooks do VS Code) é o jeito mais confortável de explorar dados: o código fica em células, e as tabelas e gráficos aparecem logo abaixo de cada uma.')}
`,
              quiz: [
                {
                  pergunta: 'Qual combinação gera um CSV que o Excel em português abre certinho?',
                  opcoes: [
                    'to_csv("a.csv")',
                    'to_csv("a.csv", sep=";", decimal=",", encoding="utf-8-sig")',
                    'to_excel("a.csv")'
                  ],
                  certa: 1,
                  explicacao: 'Separador, decimal e codificação no padrão do Excel brasileiro.'
                },
                {
                  pergunta: 'Qual a vantagem do Parquet sobre o CSV?',
                  opcoes: [
                    'Abre no Bloco de Notas',
                    'Guarda os tipos, é comprimido e é lido muito mais rápido',
                    'Nenhuma'
                  ],
                  certa: 1,
                  explicacao: 'Por isso é o formato padrão de dados analíticos.'
                },
                {
                  pergunta: 'Como o Power BI pode usar um DataFrame do pandas?',
                  opcoes: [
                    'Não pode',
                    'Por um script Python como fonte de dados, ou lendo o arquivo que o script gerou',
                    'Só copiando e colando'
                  ],
                  certa: 1,
                  explicacao: 'Cada DataFrame do script vira uma tabela no modelo.'
                }
              ]
            },
            {
              id: 'desafio-clientes',
              tipo: 'desafio',
              titulo: 'Desafio: análise de clientes',
              resumo: 'RFM em pandas, segmentos com np.select e os melhores clientes.',
              minutos: 25,
              enunciado: `
<p>Considere <code>HOJE = pd.Timestamp("2026-10-31")</code>. Uma <strong>compra</strong> é uma data de um cliente (várias linhas no mesmo dia são a mesma compra). Escreva:</p>
<ul>
  <li><code>rfm(vendas)</code>: um DataFrame com o cliente no <strong>índice</strong> (em ordem alfabética) e as colunas <code>recencia</code> (dias desde a última compra, inteiro), <code>frequencia</code> (quantas compras) e <code>monetario</code> (soma de quantidade × preço, 2 casas).</li>
  <li><code>segmentar(tabela)</code>: recebe o resultado do <code>rfm</code> e devolve uma cópia com a coluna <code>segmento</code>: <code>"fiel"</code> se frequência 2 ou mais <strong>e</strong> recência até 30 dias; <code>"valioso"</code> se monetário 300 ou mais; <code>"ativo"</code> se recência até 30; <code>"inativo"</code> nos outros casos (as regras valem nessa ordem). Use <code>np.select</code> ou <code>np.where</code>, sem laços.</li>
  <li><code>top(tabela, n)</code>: os <code>n</code> clientes de maior <code>monetario</code>, do maior para o menor.</li>
</ul>`,
              inicial: `${VENDAS}
import numpy as np

HOJE = pd.Timestamp("2026-10-31")


def rfm(vendas):
    pass


def segmentar(tabela):
    pass


def top(tabela, n):
    pass


print(rfm(vendas))
`,
              testes: [
                [
                  'rfm: índice com os clientes em ordem e as três colunas',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = rfm(vendas)\nlist(r.index) == ["Ana", "Bruno", "Diego", "Elisa", "Fábio"] and list(r.columns) == ["recencia", "frequencia", "monetario"]'
                    ) === true
                ],
                [
                  'rfm: valores de recência, frequência e monetário',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = rfm(vendas)\nlist(r["recencia"]) == [19, 30, 6, 43, 11] and list(r["frequencia"]) == [3, 2, 2, 1, 1] and list(r["monetario"]) == [411.4, 356.0, 297.9, 75.5, 22.0]'
                    ) === true
                ],
                [
                  'segmentar: o segmento de cada cliente',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = segmentar(rfm(vendas))\nlist(r["segmento"]) == ["fiel", "fiel", "fiel", "inativo", "ativo"]'
                    ) === true
                ],
                [
                  'segmentar segue a ordem das regras e não altera a tabela original',
                  async doc =>
                    doc.defaultView.__py
                      .runPython(`t = pd.DataFrame({"recencia": [60, 10, 10, 90], "frequencia": [1, 1, 3, 5], "monetario": [500.0, 20.0, 10.0, 50.0]}, index=["a", "b", "c", "d"])
r = segmentar(t)
list(r["segmento"]) == ["valioso", "ativo", "fiel", "inativo"] and "segmento" not in t.columns`) === true
                ],
                [
                  'top: os n de maior monetário',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'list(top(rfm(vendas), 2).index) == ["Ana", "Bruno"] and len(top(rfm(vendas), 3)) == 3'
                    ) === true
                ]
              ],
              solucao: `${VENDAS}
import numpy as np

HOJE = pd.Timestamp("2026-10-31")


def rfm(vendas):
    v = vendas.assign(total=vendas["quantidade"] * vendas["preco"])
    tabela = v.groupby("cliente").agg(
        ultima=("data", "max"),
        frequencia=("data", "nunique"),
        monetario=("total", "sum"),
    )
    tabela["recencia"] = (HOJE - tabela["ultima"]).dt.days
    tabela["monetario"] = tabela["monetario"].round(2)
    return tabela[["recencia", "frequencia", "monetario"]].sort_index()


def segmentar(tabela):
    t = tabela.copy()
    t["segmento"] = np.select(
        [
            (t["frequencia"] >= 2) & (t["recencia"] <= 30),
            t["monetario"] >= 300,
            t["recencia"] <= 30,
        ],
        ["fiel", "valioso", "ativo"],
        default="inativo",
    )
    return t


def top(tabela, n):
    return tabela.nlargest(n, "monetario")


print(segmentar(rfm(vendas)))
print(top(rfm(vendas), 3))`
            }
          ]
        }
      ]
    }
  ]
};
