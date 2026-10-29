// Trilha de R. Sem editor: o código é para rodar no RStudio ou no Positron, com o R instalado. Os pacotes do
// tidyverse são instalados na primeira aula. As práticas trazem a resposta escondida para conferir.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'r',
  area: 'Dados e BI',
  titulo: 'R para dados',
  sigla: 'R',
  resumo: 'A linguagem da estatística: tidyverse, gráficos com ggplot2, modelos e relatórios com Quarto.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'RStudio, vetores, data frames e os primeiros resumos.',
      modulos: [
        {
          titulo: 'Primeiros passos',
          itens: [
            {
              id: 'primeiros-passos',
              titulo: 'R, RStudio e vetores',
              resumo: 'Instalar, o console, atribuição, vetores e funções.',
              minutos: 10,
              corpo: `
<p><strong>R</strong> é uma linguagem feita para análise de dados e estatística. É muito usada em pesquisa, saúde, finanças e por analistas que precisam de gráficos e modelos de qualidade. Instale o <strong>R</strong> (cran.r-project.org) e depois o <strong>RStudio</strong> (posit.co), o ambiente onde você escreve e roda o código.</p>

<h2>O console</h2>
<p>No RStudio, escreva num script (Arquivo, Novo, R Script) e rode a linha com <kbd>Ctrl</kbd>+<kbd>Enter</kbd>.</p>
${trecho(`2 + 3 * 4
idade <- 32                # atribuição (o = também funciona, mas <- é o costume)
nome <- "Ana"
paste("Olá,", nome)        # junta textos com espaço
round(10 / 3, 2)           # 3.33`)}

<h2>Vetores: tudo é coleção</h2>
<p>Em R, até um número sozinho é um <strong>vetor</strong> de tamanho 1. As operações valem para todos os elementos de uma vez, sem laço:</p>
${trecho(`vendas <- c(120, 340, 90, 410, 275)       # c() combina valores
vendas * 1.1                               # reajuste em todos
sum(vendas); mean(vendas); max(vendas)
length(vendas)
vendas[2]                                  # o segundo (R começa em 1!)
vendas[vendas > 200]                       # só os maiores que 200
meses <- c("jan", "fev", "mar", "abr", "mai")
meses[which.max(vendas)]                   # o mês da maior venda`)}
${dica('Em R, os índices começam em <strong>1</strong>, não em 0 como em Python e JavaScript.')}

<h2>Ajuda e pacotes</h2>
${trecho(`?mean                         # ajuda de uma função
install.packages("tidyverse") # uma vez por computador
library(tidyverse)            # em cada sessão/script`)}
<p>O <strong>tidyverse</strong> é um conjunto de pacotes (dplyr, ggplot2, readr, tidyr...) que deixa a análise de dados mais legível. Esta trilha usa ele do começo ao fim.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual o índice do primeiro elemento de um vetor em R?',
                  opcoes: ['0', '1', '-1'],
                  certa: 1,
                  explicacao: 'R começa a contar do 1.'
                },
                {
                  pergunta: 'O que vendas * 1.1 faz com um vetor de 5 valores?',
                  opcoes: ['Dá erro', 'Multiplica cada um dos 5 valores', 'Multiplica só o primeiro'],
                  certa: 1,
                  explicacao: 'As operações em R são vetorizadas.'
                },
                {
                  pergunta: 'Qual a diferença entre install.packages e library?',
                  opcoes: [
                    'Nenhuma',
                    'install baixa uma vez; library carrega em cada sessão',
                    'library baixa da internet'
                  ],
                  certa: 1,
                  explicacao: 'Instala uma vez, carrega sempre que for usar.'
                }
              ]
            },
            {
              id: 'data-frames',
              titulo: 'Data frames e o dplyr',
              resumo: 'Ler CSV, filter, select, mutate, arrange, summarise e o pipe.',
              minutos: 13,
              corpo: `
<p>Um <strong>data frame</strong> (ou <strong>tibble</strong>, no tidyverse) é uma tabela: cada coluna é um vetor do mesmo tamanho.</p>
${trecho(`library(tidyverse)

vendas <- read_csv2("vendas.csv")   # csv2: separador ; e decimal com vírgula (padrão brasileiro)
glimpse(vendas)                      # colunas, tipos e primeiros valores
summary(vendas)`)}

<h2>Os verbos do dplyr</h2>
${trecho(`vendas |>
  filter(valor > 100, vendedor != "Teste") |>     # linhas
  select(data, vendedor, produto, valor) |>       # colunas
  mutate(com_imposto = valor * 1.12,              # colunas novas
         mes = format(data, "%Y-%m")) |>
  arrange(desc(valor))                            # ordenar`)}
<p>O <code>|&gt;</code> é o <strong>pipe</strong>: passa o resultado da esquerda como primeiro argumento da função da direita. Leia como "e então". (Em código antigo, você vai ver <code>%&gt;%</code>, que faz o mesmo.)</p>

<h2>Agrupar e resumir</h2>
${trecho(`vendas |>
  group_by(vendedor) |>
  summarise(
    vendas = n(),
    total = sum(valor),
    ticket_medio = mean(valor),
    .groups = "drop"
  ) |>
  arrange(desc(total))

vendas |> count(produto, sort = TRUE)   # atalho para contar`)}
${dica('Valores ausentes aparecem como <code>NA</code>. Qualquer conta com NA dá NA: use <code>sum(valor, na.rm = TRUE)</code> para ignorá-los, e <code>is.na(valor)</code> para encontrá-los.')}
`,
              quiz: [
                {
                  pergunta: 'Qual verbo do dplyr escolhe linhas?',
                  opcoes: ['select', 'filter', 'mutate'],
                  certa: 1,
                  explicacao: 'filter escolhe linhas; select, colunas.'
                },
                {
                  pergunta: 'O que o pipe |> faz?',
                  opcoes: [
                    'Divide valores',
                    'Passa o resultado da esquerda para a função da direita',
                    'Cria um gráfico'
                  ],
                  certa: 1,
                  explicacao: 'x |> f(y) é o mesmo que f(x, y).'
                },
                {
                  pergunta: 'Quanto dá sum(c(10, NA, 5))?',
                  opcoes: ['15', 'NA', '0'],
                  certa: 1,
                  explicacao: 'Com na.rm = TRUE, daria 15.'
                }
              ]
            },
            {
              id: 'pratica-vendas',
              titulo: 'Prática: resumo de vendas',
              resumo: 'Responder perguntas de negócio com o dplyr.',
              minutos: 20,
              corpo: `
<p>Crie os dados direto no R:</p>
${trecho(`library(tidyverse)
vendas <- tribble(
  ~data,        ~vendedor, ~produto,   ~qtd, ~preco,
  "2026-10-01", "Ana",     "Café",      3,   18.5,
  "2026-10-01", "Bruno",   "Arroz",     2,   27.9,
  "2026-10-02", "Ana",     "Arroz",     1,   27.9,
  "2026-10-03", "Carla",   "Feijão",    4,   9.8,
  "2026-10-03", "Ana",     "Café",      2,   18.5,
  "2026-10-04", "Bruno",   "Café",      5,   18.5,
  "2026-10-04", "Carla",   "Arroz",     NA,  27.9
) |> mutate(data = as.Date(data))`)}
<h2>Tarefas</h2>
<ol>
  <li>Crie a coluna <code>valor = qtd * preco</code>.</li>
  <li>Quantas linhas têm quantidade ausente? Remova essas linhas.</li>
  <li>Faturamento total por vendedor, do maior para o menor.</li>
  <li>Produto com mais unidades vendidas.</li>
  <li>Faturamento por dia, com o acumulado (<code>cumsum</code>).</li>
</ol>
${resposta(`
${trecho(`vendas <- vendas |> mutate(valor = qtd * preco)

sum(is.na(vendas$qtd))                 # 1
limpas <- vendas |> filter(!is.na(qtd))

limpas |>
  group_by(vendedor) |>
  summarise(faturamento = sum(valor)) |>
  arrange(desc(faturamento))

limpas |>
  group_by(produto) |>
  summarise(unidades = sum(qtd)) |>
  slice_max(unidades, n = 1)

limpas |>
  group_by(data) |>
  summarise(dia = sum(valor)) |>
  mutate(acumulado = cumsum(dia))`)}
<p><code>vendas$qtd</code> pega uma coluna como vetor. Somar um vetor de <code>TRUE</code>/<code>FALSE</code> conta os <code>TRUE</code>. <code>slice_max</code> fica com as linhas de maior valor; em empate, devolve todas.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que sum(is.na(x)) devolve?',
                  opcoes: ['A soma dos valores', 'Quantos valores ausentes há em x', 'Erro'],
                  certa: 1,
                  explicacao: 'TRUE vale 1 e FALSE vale 0 na soma.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Gráficos com ggplot2, arrumar dados e juntar tabelas.',
      modulos: [
        {
          titulo: 'Visualizar e arrumar',
          itens: [
            {
              id: 'ggplot2',
              titulo: 'Gráficos com ggplot2',
              resumo: 'A gramática dos gráficos: dados, estética, geometria, facetas e temas.',
              minutos: 14,
              corpo: `
<p>O <strong>ggplot2</strong> monta gráficos em camadas: <strong>dados</strong>, <strong>estética</strong> (que coluna vai em x, y, cor) e <strong>geometria</strong> (ponto, barra, linha).</p>
${trecho(`ggplot(limpas, aes(x = vendedor, y = valor)) +
  geom_col()                      # barras somando os valores

ggplot(limpas, aes(x = data, y = valor, color = vendedor)) +
  geom_point(size = 3) +
  geom_line()

ggplot(mpg, aes(x = displ, y = hwy)) +   # mpg vem com o ggplot2
  geom_point(alpha = 0.5) +
  geom_smooth(method = "lm")              # linha de tendência`)}

<h2>Deixar pronto para apresentar</h2>
${trecho(`limpas |>
  group_by(vendedor) |>
  summarise(total = sum(valor)) |>
  ggplot(aes(x = reorder(vendedor, total), y = total)) +
  geom_col(fill = "#2f6f5e") +
  geom_text(aes(label = scales::label_dollar(prefix = "R$ ", big.mark = ".", decimal.mark = ",")(total)),
            hjust = -0.1) +
  coord_flip() +
  scale_y_continuous(expand = expansion(mult = c(0, 0.2))) +
  labs(title = "Faturamento por vendedor", subtitle = "Outubro de 2026", x = NULL, y = NULL) +
  theme_minimal(base_size = 13)

ggsave("faturamento.png", width = 8, height = 5, dpi = 150)`)}
<ul>
  <li><code>reorder</code> ordena as barras pelo valor, em vez da ordem alfabética.</li>
  <li><code>coord_flip</code> deita as barras: nomes longos ficam legíveis.</li>
  <li><code>facet_wrap(~ produto)</code> faz um gráfico pequeno para cada produto.</li>
  <li><code>theme_minimal()</code> tira o fundo cinza; <code>labs</code> põe títulos.</li>
</ul>
${dica('Cor fixa (<code>fill = "#2f6f5e"</code>) vai fora do <code>aes()</code>. Dentro do <code>aes()</code>, ela vira uma variável, e o ggplot cria uma legenda com o texto "#2f6f5e".')}
`,
              quiz: [
                {
                  pergunta: 'O que vai dentro do aes()?',
                  opcoes: ['Cores fixas', 'O mapeamento de colunas para eixos, cor, tamanho', 'O título'],
                  certa: 1,
                  explicacao: 'aes liga dados a propriedades visuais.'
                },
                {
                  pergunta: 'Como ordenar barras pelo valor?',
                  opcoes: ['sort()', 'reorder(categoria, valor) no eixo', 'arrange() resolve sozinho'],
                  certa: 1,
                  explicacao: 'O ggplot usa a ordem dos níveis do fator, que reorder ajusta.'
                },
                {
                  pergunta: 'Para que serve facet_wrap?',
                  opcoes: ['Salvar o gráfico', 'Um gráfico pequeno para cada categoria', 'Girar o gráfico'],
                  certa: 1,
                  explicacao: 'São os "small multiples".'
                }
              ]
            },
            {
              id: 'tidyr-e-joins',
              titulo: 'Arrumar dados e juntar tabelas',
              resumo: 'pivot_longer, pivot_wider, separate, joins, datas e textos.',
              minutos: 13,
              corpo: `
<h2>Dados arrumados</h2>
<p>Dados <strong>tidy</strong>: cada coluna é uma variável e cada linha uma observação. Planilhas costumam vir "largas", com um mês em cada coluna:</p>
${trecho(`largo <- tribble(
  ~loja,    ~jan, ~fev, ~mar,
  "Centro", 100,  120,  90,
  "Praia",  80,   150,  210
)

longo <- largo |> pivot_longer(jan:mar, names_to = "mes", values_to = "vendas")
# loja   mes vendas
# Centro jan    100 ...

longo |> pivot_wider(names_from = loja, values_from = vendas)   # o caminho de volta`)}

<h2>Juntar tabelas</h2>
${trecho(`produtos <- tibble(produto = c("Café", "Arroz", "Feijão"), categoria = c("Bebida", "Grão", "Grão"))

limpas |> left_join(produtos, by = "produto")     # todas as vendas, com a categoria quando houver
limpas |> inner_join(produtos, by = "produto")    # só as que têm produto cadastrado
limpas |> anti_join(produtos, by = "produto")     # vendas de produtos fora do cadastro`)}

<h2>Datas e textos</h2>
${trecho(`library(lubridate)
dmy("27/10/2026")              # lê no formato brasileiro
month(hoje, label = TRUE)      # nome do mês
floor_date(data, "month")      # primeiro dia do mês, ótimo para agrupar
interval(entrada, saida) / days(1)   # diferença em dias

library(stringr)
str_to_upper(nome); str_trim(texto)
str_detect(produto, "café|cafe")
str_replace_all(telefone, "\\\\D", "")   # só os dígitos`)}
`,
              quiz: [
                {
                  pergunta: 'Uma tabela com um mês em cada coluna vira "tidy" com...',
                  opcoes: ['pivot_wider', 'pivot_longer', 'left_join'],
                  certa: 1,
                  explicacao: 'As colunas de mês viram uma coluna "mes" e outra de valores.'
                },
                {
                  pergunta: 'Qual join mantém todas as linhas da tabela da esquerda?',
                  opcoes: ['inner_join', 'left_join', 'anti_join'],
                  certa: 1,
                  explicacao: 'Sem correspondência, as colunas novas ficam NA.'
                },
                {
                  pergunta: 'Para que serve anti_join?',
                  opcoes: [
                    'Achar as linhas da esquerda sem correspondência na direita',
                    'Apagar a tabela',
                    'Juntar ao contrário'
                  ],
                  certa: 0,
                  explicacao: 'Ótimo para descobrir cadastros faltando.'
                }
              ]
            },
            {
              id: 'pratica-gastos-pessoais',
              titulo: 'Prática: painel de gastos pessoais',
              resumo: 'Arrumar um extrato largo, juntar categorias e fazer dois gráficos.',
              minutos: 30,
              corpo: `
${trecho(`gastos <- tribble(
  ~descricao,     ~\`2026-08\`, ~\`2026-09\`, ~\`2026-10\`,
  "Mercado",      820,        760,        910,
  "Aluguel",      1500,       1500,       1500,
  "Uber",         140,        220,        95,
  "Streaming",    55,         55,         85,
  "Restaurante",  310,        180,        420
)
categorias <- tribble(
  ~descricao,    ~categoria,
  "Mercado",     "Essencial",
  "Aluguel",     "Essencial",
  "Uber",        "Transporte",
  "Streaming",   "Lazer",
  "Restaurante", "Lazer"
)`)}
<h2>Tarefas</h2>
<ol>
  <li>Transforme em formato longo (descrição, mês, valor) e converta o mês em data.</li>
  <li>Junte a categoria de cada gasto.</li>
  <li>Total por mês e categoria.</li>
  <li>Gráfico de barras empilhadas: mês no eixo x, valor no y, cor por categoria.</li>
  <li>Qual descrição mais variou entre o primeiro e o último mês (em %)?</li>
</ol>
${resposta(`
${trecho(`library(tidyverse)
library(lubridate)

longo <- gastos |>
  pivot_longer(-descricao, names_to = "mes", values_to = "valor") |>
  mutate(mes = ym(mes)) |>
  left_join(categorias, by = "descricao")

resumo <- longo |>
  group_by(mes, categoria) |>
  summarise(total = sum(valor), .groups = "drop")

ggplot(resumo, aes(x = mes, y = total, fill = categoria)) +
  geom_col() +
  scale_x_date(date_labels = "%b/%y") +
  labs(title = "Gastos por categoria", x = NULL, y = "R$") +
  theme_minimal()

longo |>
  group_by(descricao) |>
  summarise(variacao = (last(valor, order_by = mes) / first(valor, order_by = mes) - 1) * 100) |>
  arrange(desc(abs(variacao)))`)}
<p><code>-descricao</code> no <code>pivot_longer</code> quer dizer "todas as colunas menos descrição". <code>ym</code> lê "2026-08" como o primeiro dia de agosto. A maior variação é a do Streaming (+54,5%), seguida do Restaurante (+35,5%).</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que significa pivot_longer(-descricao, ...)?',
                  opcoes: [
                    'Apagar a coluna descricao',
                    'Pivotar todas as colunas, menos descricao',
                    'Ordenar ao contrário'
                  ],
                  certa: 1,
                  explicacao: 'O sinal de menos exclui a coluna da seleção.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Funções, modelos estatísticos e relatórios reprodutíveis.',
      modulos: [
        {
          titulo: 'Modelos e relatórios',
          itens: [
            {
              id: 'funcoes-e-iteracao',
              titulo: 'Funções e iteração com purrr',
              resumo: 'Escrever funções, map, ler vários arquivos e across.',
              minutos: 13,
              corpo: `
${trecho(`reais <- function(x, centavos = TRUE) {
  scales::label_dollar(prefix = "R$ ", big.mark = ".", decimal.mark = ",",
                       accuracy = if (centavos) 0.01 else 1)(x)
}
reais(1234.5)           # "R$ 1.234,50"
reais(1234.5, FALSE)    # "R$ 1.235"`)}
<p>A última expressão da função é o valor devolvido; não precisa de <code>return</code>.</p>

<h2>purrr: aplicar uma função a cada item</h2>
${trecho(`library(purrr)
map(1:3, \\(x) x^2)          # lista: 1, 4, 9
map_dbl(1:3, \\(x) x^2)      # vetor numérico
map_chr(c("a", "b"), str_to_upper)

# Ler todos os CSV de uma pasta e empilhar, com o nome do arquivo numa coluna
arquivos <- list.files("lojas", pattern = "\\\\.csv$", full.names = TRUE)
todas <- arquivos |>
  set_names(basename) |>
  map(read_csv2) |>
  list_rbind(names_to = "arquivo")`)}
<p><code>\\(x) x^2</code> é o atalho para <code>function(x) x^2</code>.</p>

<h2>across: a mesma conta em várias colunas</h2>
${trecho(`dados |> summarise(across(where(is.numeric), list(media = mean, max = max)))
dados |> mutate(across(c(preco, custo), \\(x) round(x, 2)))`)}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre map e map_dbl?',
                  opcoes: ['Nenhuma', 'map devolve lista; map_dbl, vetor de números', 'map_dbl é mais lento'],
                  certa: 1,
                  explicacao: 'As variantes _dbl, _chr, _lgl garantem o tipo do resultado.'
                },
                {
                  pergunta: 'O que \\(x) x + 1 significa?',
                  opcoes: ['Uma função anônima que soma 1', 'Uma divisão', 'Um comentário'],
                  certa: 0,
                  explicacao: 'É o atalho para function(x) x + 1, desde o R 4.1.'
                },
                {
                  pergunta: 'Para que serve across?',
                  opcoes: ['Juntar tabelas', 'Aplicar a mesma função a várias colunas', 'Cruzar dois gráficos'],
                  certa: 1,
                  explicacao: 'Evita repetir a mesma conta coluna por coluna.'
                }
              ]
            },
            {
              id: 'modelos-e-quarto',
              titulo: 'Testes, regressão e Quarto',
              resumo: 't.test, lm, interpretar coeficientes e gerar relatórios em HTML e PDF.',
              minutos: 14,
              corpo: `
<h2>Teste de hipótese</h2>
${trecho(`# A página nova converte mais? (valor: 1 = comprou, 0 = não)
t.test(valor ~ versao, data = teste_ab)
prop.test(x = c(48, 71), n = c(1000, 1000))   # comparar duas proporções`)}
<p>Olhe o <strong>p-valor</strong> e o <strong>intervalo de confiança</strong>. p &lt; 0,05 diz que a diferença dificilmente é só acaso; o intervalo diz o tamanho provável dela, que é o que importa para decidir.</p>

<h2>Regressão linear</h2>
${trecho(`modelo <- lm(vendas ~ investimento_anuncio + feriado, data = semanas)
summary(modelo)

library(broom)
tidy(modelo, conf.int = TRUE)    # coeficientes numa tabela
glance(modelo)                   # R², AIC...
predict(modelo, newdata = tibble(investimento_anuncio = 2000, feriado = FALSE))`)}
<p>Um coeficiente de <code>3.2</code> para <code>investimento_anuncio</code> quer dizer: mantendo o resto igual, cada real a mais em anúncio está associado a R$ 3,20 a mais em vendas. <strong>Associado</strong>, não causado: correlação em dados observados não prova causa.</p>

<h2>Relatórios com Quarto</h2>
<p>Um arquivo <code>.qmd</code> mistura texto e código. Ao renderizar, o código roda e os resultados (tabelas, gráficos) entram no documento. Mudou o dado, renderiza de novo.</p>
${trecho(`---
title: "Vendas de outubro"
format: html
---

O faturamento do mês foi de \`r reais(sum(vendas$valor))\`.

\`\`\`{r}
#| echo: false
ggplot(vendas, aes(vendedor, valor)) + geom_col()
\`\`\``)}
<p>No RStudio, o botão <strong>Render</strong> gera o HTML. Troque <code>format: html</code> por <code>pdf</code> ou <code>docx</code> para outros formatos.</p>
${dica('Use <strong>projetos</strong> do RStudio (Arquivo, Novo Projeto) e caminhos relativos. Nada de <code>setwd("C:/Users/...")</code>: o script quebra no computador de qualquer outra pessoa.')}
`,
              quiz: [
                {
                  pergunta: 'Um p-valor de 0,01 num teste A/B indica...',
                  opcoes: ['Que a diferença é grande', 'Que dificilmente a diferença é só acaso', 'Que o teste falhou'],
                  certa: 1,
                  explicacao: 'O tamanho da diferença se lê no intervalo de confiança.'
                },
                {
                  pergunta: 'Um coeficiente positivo numa regressão prova que X causa Y?',
                  opcoes: ['Sim', 'Não, indica associação', 'Só se o R² for alto'],
                  certa: 1,
                  explicacao: 'Causa exige experimento ou um desenho de estudo específico.'
                },
                {
                  pergunta: 'Qual a vantagem de um relatório em Quarto?',
                  opcoes: [
                    'É mais bonito que Word',
                    'Os números e gráficos são recalculados ao renderizar',
                    'Não precisa de R'
                  ],
                  certa: 1,
                  explicacao: 'Relatório reprodutível: sem copiar e colar números.'
                }
              ]
            },
            {
              id: 'pratica-teste-ab',
              titulo: 'Prática: relatório de um teste A/B',
              resumo: 'Simular dados, testar, visualizar e montar o relatório em Quarto.',
              minutos: 35,
              corpo: `
${trecho(`set.seed(42)
teste <- tibble(
  versao = rep(c("A", "B"), each = 2000),
  comprou = c(rbinom(2000, 1, 0.050), rbinom(2000, 1, 0.062)),
  valor = if_else(comprou == 1, round(rnorm(4000, 180, 40), 2), 0)
)`)}
<h2>Tarefas</h2>
<ol>
  <li>Taxa de conversão e ticket médio (só de quem comprou) por versão.</li>
  <li>Teste se a diferença de conversão é significativa com <code>prop.test</code>.</li>
  <li>Gráfico de barras da conversão por versão, com a taxa escrita em cima.</li>
  <li>Monte um <code>.qmd</code> com o resultado e uma frase de recomendação que use os números calculados.</li>
</ol>
${resposta(`
${trecho(`resumo <- teste |>
  group_by(versao) |>
  summarise(
    visitantes = n(),
    compras = sum(comprou),
    conversao = mean(comprou),
    ticket = mean(valor[comprou == 1])
  )

resultado <- prop.test(resumo$compras, resumo$visitantes)
resultado$p.value
resultado$conf.int        # intervalo para a diferença A - B

ggplot(resumo, aes(versao, conversao)) +
  geom_col(fill = c("grey60", "#2f6f5e"), width = 0.6) +
  geom_text(aes(label = scales::percent(conversao, accuracy = 0.1, decimal.mark = ",")), vjust = -0.5) +
  scale_y_continuous(labels = scales::label_percent(), expand = expansion(mult = c(0, 0.15))) +
  labs(title = "Conversão por versão", x = NULL, y = NULL) +
  theme_minimal()`)}
<p>No .qmd, escreva a recomendação com código embutido, por exemplo: a versão B converteu <code>\`r scales::percent(resumo$conversao[2], 0.1)\`</code> contra <code>\`r scales::percent(resumo$conversao[1], 0.1)\`</code> (p = <code>\`r round(resultado$p.value, 3)\`</code>). Se o p-valor ficar acima de 0,05 com os seus dados, a conclusão honesta é "ainda não dá para afirmar": aumente a amostra antes de decidir.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve set.seed(42) numa simulação?',
                  opcoes: [
                    'Deixar os números mais aleatórios',
                    'Fazer os números "aleatórios" saírem iguais toda vez',
                    'Acelerar o R'
                  ],
                  certa: 1,
                  explicacao: 'Reprodutibilidade: quem rodar de novo vê o mesmo resultado.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
