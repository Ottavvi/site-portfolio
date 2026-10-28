// Trilha de Estatística para análise de dados, em Python (Pyodide), só com a biblioteca padrão (statistics, random,
// math): nada para baixar. Os testes rodam Python com doc.defaultView.__py.runPython('...') e esperam True; sempre
// que dá, o valor esperado é calculado ali mesmo com o módulo statistics, em vez de escrito à mão.
// Atenção: o conteúdo fica em template strings: nada de ${ e barras invertidas dobradas.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, dica } = require('./ajuda');

module.exports = {
  id: 'estatistica',
  area: 'Dados e BI',
  titulo: 'Estatística para análise',
  sigla: 'σ',
  linguagem: 'python',
  resumo: 'Médias, dispersão, correlação, testes A/B e as armadilhas que enganam até analista experiente.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Resumir dados: centro e dispersão.',
      modulos: [
        {
          titulo: 'Resumir números',
          itens: [
            {
              id: 'media-mediana-moda',
              titulo: 'Média, mediana e moda',
              resumo: 'Qual "valor típico" usar, e por que a média engana com valores extremos.',
              minutos: 10,
              corpo: `
<p>Antes de qualquer gráfico ou painel, a primeira pergunta sobre um conjunto de números é: qual é o valor típico? Há três respostas, e escolher a errada distorce a conclusão.</p>
<ul>
  <li><strong>Média</strong>: a soma dividida pela quantidade. Usa todos os valores, por isso é sensível a extremos.</li>
  <li><strong>Mediana</strong>: o valor do meio, com os números em ordem. Metade fica abaixo, metade acima. Extremos quase não a afetam.</li>
  <li><strong>Moda</strong>: o valor mais frequente. Útil para categorias (o tamanho de camiseta mais vendido) e para números que se repetem.</li>
</ul>
${codigo(`from statistics import mean, median, mode, multimode

# Valor dos pedidos de uma semana na loja (R$)
pedidos = [45, 52, 38, 61, 49, 55, 47, 50, 44, 58]
print("Média:  ", round(mean(pedidos), 2))
print("Mediana:", median(pedidos))

# Chega um pedido de uma empresa: R$ 2.400
pedidos.append(2400)
print("Com o pedido grande:")
print("Média:  ", round(mean(pedidos), 2))   # disparou
print("Mediana:", median(pedidos))           # quase não mexeu

tamanhos = ["M", "G", "M", "P", "M", "G"]
print("Moda:", mode(tamanhos), "| todas as modas:", multimode([1, 1, 2, 2, 3]))`)}

<h2>Qual usar</h2>
<ul>
  <li>Dados simétricos, sem extremos (altura, nota de prova): média e mediana ficam próximas, e a média funciona.</li>
  <li>Dados <strong>assimétricos</strong> (salários, preço de imóveis, valor de pedidos, tempo de resposta): use a <strong>mediana</strong>. "Salário médio" quase sempre é bem maior que o salário da pessoa típica.</li>
  <li>Quando a diferença entre média e mediana é grande, isso já é uma informação: há valores extremos puxando a média.</li>
</ul>

<h2>Média ponderada</h2>
<p>Quando os valores têm pesos diferentes, a média simples erra. O preço médio pago por quarto não é a média dos preços da tabela, e sim o total recebido dividido pelo total de diárias:</p>
${codigo(`from statistics import fmean

precos = [100, 180, 210, 280]     # individual, casal, triplo, quádruplo
diarias = [5, 40, 12, 3]          # quantas diárias de cada um no mês

print("Média simples dos preços:", fmean(precos))
print("Preço médio de verdade:  ", round(fmean(precos, weights=diarias), 2))`)}
${dica('Em relatórios, mostre a mediana junto com a média sempre que os dados puderem ter extremos. E diga quantos valores entraram na conta: "média de 4,8 estrelas" com 3 avaliações vale muito menos que com 300.')}
`,
              quiz: [
                {
                  pergunta: 'Qual medida é menos afetada por um valor extremo?',
                  opcoes: ['Média', 'Mediana', 'Soma'],
                  certa: 1,
                  explicacao: 'A mediana só depende da posição do meio.'
                },
                {
                  pergunta: 'Para descrever o salário típico de uma empresa, o melhor é:',
                  opcoes: ['A média', 'A mediana', 'O maior salário'],
                  certa: 1,
                  explicacao: 'Salários são assimétricos: poucos muito altos puxam a média para cima.'
                },
                {
                  pergunta: 'Preços diferentes vendidos em quantidades diferentes: como achar o preço médio pago?',
                  opcoes: ['Média simples dos preços', 'Média ponderada pelas quantidades', 'Mediana dos preços'],
                  certa: 1,
                  explicacao: 'Cada preço pesa conforme quantas vezes foi pago.'
                }
              ]
            },
            {
              id: 'dispersao',
              titulo: 'Dispersão: o quanto os dados variam',
              resumo: 'Amplitude, desvio padrão, quartis e como achar valores fora da curva.',
              minutos: 12,
              corpo: `
<p>Duas lojas com o mesmo faturamento médio por dia podem ser muito diferentes: uma vende quase o mesmo todo dia, a outra alterna dias fortes e fracos. O centro não conta isso; a <strong>dispersão</strong>, sim.</p>
${codigo(`from statistics import mean, stdev, quantiles

loja_a = [980, 1010, 1000, 995, 1020, 1005, 990]
loja_b = [400, 1800, 700, 1500, 300, 1900, 400]

for nome, vendas in [("A", loja_a), ("B", loja_b)]:
    print(nome, "| média", round(mean(vendas)), "| amplitude", max(vendas) - min(vendas),
          "| desvio padrão", round(stdev(vendas)))`)}
<ul>
  <li><strong>Amplitude</strong>: o maior menos o menor. Simples, mas depende só de dois valores.</li>
  <li><strong>Desvio padrão</strong>: o quanto os valores costumam se afastar da média, na mesma unidade dos dados. Com dados em forma de sino, uns 68% ficam a até 1 desvio da média e uns 95% a até 2.</li>
  <li><code>stdev</code> é o desvio de uma <strong>amostra</strong> (o caso comum: você tem uma parte dos dados); <code>pstdev</code>, o da <strong>população</strong> inteira.</li>
</ul>

<h2>Quartis</h2>
<p>Os <strong>quartis</strong> dividem os dados ordenados em quatro partes iguais. Q1 deixa 25% abaixo, Q2 é a mediana, Q3 deixa 75% abaixo. A distância Q3 − Q1 é o <strong>intervalo interquartil</strong> (IQR): onde estão os 50% do meio. É a base do gráfico de caixa (boxplot).</p>
${codigo(`from statistics import quantiles

tempos = [1.2, 0.8, 1.1, 0.9, 1.0, 1.3, 0.7, 1.1, 9.5, 1.0, 0.9, 1.2]  # segundos para carregar a página
q1, q2, q3 = quantiles(tempos, n=4)
iqr = q3 - q1
limite_inferior = q1 - 1.5 * iqr
limite_superior = q3 + 1.5 * iqr
print("Q1", q1, "| mediana", q2, "| Q3", q3, "| IQR", round(iqr, 3))
print("Fora da curva:", [t for t in tempos if t < limite_inferior or t > limite_superior])`)}
<p>A regra de <strong>1,5 × IQR</strong> marca como "fora da curva" o que fica muito abaixo de Q1 ou muito acima de Q3. Não quer dizer que o valor esteja errado: pode ser um erro de digitação, uma fraude ou a informação mais importante do relatório. Investigue antes de descartar.</p>
${dica('Para tempos de resposta de sites e APIs, usa-se muito o <strong>percentil 95</strong> (p95): o tempo abaixo do qual ficam 95% dos acessos. A média esconde os 5% que esperaram muito, e são eles que reclamam. <code>quantiles(tempos, n=100)[94]</code> calcula.')}
`,
              quiz: [
                {
                  pergunta: 'Duas lojas com a mesma média diária. O que o desvio padrão mostra?',
                  opcoes: ['Qual vende mais', 'Qual tem vendas mais estáveis de um dia para o outro', 'O lucro'],
                  certa: 1,
                  explicacao: 'Desvio pequeno: valores perto da média; grande: muita variação.'
                },
                {
                  pergunta: 'O que é o intervalo interquartil (IQR)?',
                  opcoes: ['Máximo menos mínimo', 'Q3 menos Q1: a faixa dos 50% do meio', 'A média dos quartis'],
                  certa: 1,
                  explicacao: 'Como ignora as pontas, extremos não o distorcem.'
                },
                {
                  pergunta: 'Um valor ficou fora da curva pela regra de 1,5 × IQR. O que fazer?',
                  opcoes: [
                    'Apagar sempre',
                    'Investigar: pode ser erro, fraude ou algo importante',
                    'Trocar pela média'
                  ],
                  certa: 1,
                  explicacao: 'Fora da curva não é sinônimo de errado.'
                }
              ]
            },
            {
              id: 'desafio-resumo',
              tipo: 'desafio',
              titulo: 'Desafio: o resumo de um conjunto de números',
              resumo: 'Uma função de resumo estatístico e um detector de valores fora da curva.',
              minutos: 18,
              enunciado: `
<p>Escreva duas funções usando o módulo <code>statistics</code>:</p>
<ul>
  <li><code>resumo(valores)</code>: devolve um dicionário com <code>n</code> (quantidade), <code>media</code>, <code>mediana</code>, <code>desvio</code> (desvio padrão de amostra), <code>minimo</code> e <code>maximo</code>. Arredonde média, mediana e desvio com 2 casas. Com menos de 2 valores, o desvio é <code>0</code>.</li>
  <li><code>fora_da_curva(valores)</code>: devolve a lista dos valores abaixo de Q1 − 1,5 × IQR ou acima de Q3 + 1,5 × IQR, na ordem em que aparecem. Use <code>quantiles(valores, n=4)</code> para os quartis. Com menos de 4 valores, devolva <code>[]</code>.</li>
</ul>`,
              inicial: `from statistics import mean, median, stdev, quantiles


def resumo(valores):
    pass


def fora_da_curva(valores):
    pass


tempos = [1.2, 0.8, 1.1, 0.9, 1.0, 1.3, 0.7, 1.1, 9.5, 1.0, 0.9, 1.2]
print(resumo(tempos))
print(fora_da_curva(tempos))
`,
              testes: [
                [
                  'resumo devolve n, média, mediana, mínimo e máximo',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'r = resumo([45, 52, 38, 61, 49, 55, 47, 50, 44, 58])\nr["n"] == 10 and r["media"] == 49.9 and r["mediana"] == 49.5 and r["minimo"] == 38 and r["maximo"] == 61'
                    ) === true
                ],
                [
                  'resumo calcula o desvio padrão de amostra com 2 casas',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'from statistics import stdev as _sd\nv = [3, 7, 7, 19]\nresumo(v)["desvio"] == round(_sd(v), 2) and resumo([5])["desvio"] == 0'
                    ) === true
                ],
                [
                  'fora_da_curva acha os valores extremos, na ordem',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'fora_da_curva([1.2, 0.8, 1.1, 0.9, 1.0, 1.3, 0.7, 1.1, 9.5, 1.0, 0.9, 1.2]) == [9.5] and fora_da_curva([-50, 10, 11, 12, 13, 12, 11, 200]) == [-50, 200]'
                    ) === true
                ],
                [
                  'fora_da_curva devolve [] quando não há extremos ou há poucos valores',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'fora_da_curva([10, 11, 12, 13, 14]) == [] and fora_da_curva([1, 100]) == []'
                    ) === true
                ]
              ],
              solucao: `from statistics import mean, median, stdev, quantiles


def resumo(valores):
    return {
        "n": len(valores),
        "media": round(mean(valores), 2),
        "mediana": round(median(valores), 2),
        "desvio": round(stdev(valores), 2) if len(valores) >= 2 else 0,
        "minimo": min(valores),
        "maximo": max(valores),
    }


def fora_da_curva(valores):
    if len(valores) < 4:
        return []
    q1, _, q3 = quantiles(valores, n=4)
    iqr = q3 - q1
    baixo, alto = q1 - 1.5 * iqr, q3 + 1.5 * iqr
    return [v for v in valores if v < baixo or v > alto]


tempos = [1.2, 0.8, 1.1, 0.9, 1.0, 1.3, 0.7, 1.1, 9.5, 1.0, 0.9, 1.2]
print(resumo(tempos))
print(fora_da_curva(tempos))`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Distribuições, amostras, correlação e regressão.',
      modulos: [
        {
          titulo: 'Relações entre números',
          itens: [
            {
              id: 'distribuicoes-e-amostras',
              titulo: 'Distribuições, escore z e amostras',
              resumo: 'A curva normal, quão incomum é um valor e por que amostras maiores erram menos.',
              minutos: 13,
              corpo: `
<h2>A curva normal</h2>
<p>Muitas medidas (altura, erro de medição, a média de muitas compras) se distribuem em forma de <strong>sino</strong>: a maioria perto da média, cada vez menos valores à medida que se afasta. É a <strong>distribuição normal</strong>, descrita só pela média e pelo desvio padrão. O Python a traz pronta:</p>
${codigo(`from statistics import NormalDist

# Tempo de entrega: média de 3 dias, desvio de 0,8 dia
entrega = NormalDist(mu=3, sigma=0.8)
print("Chance de chegar em até 4 dias:", round(entrega.cdf(4) * 100, 1), "%")
print("Chance de passar de 5 dias:    ", round((1 - entrega.cdf(5)) * 100, 2), "%")
print("Prazo que cobre 95% das entregas:", round(entrega.inv_cdf(0.95), 1), "dias")`)}

<h2>Escore z: quão incomum é este valor?</h2>
<p>O <strong>escore z</strong> diz a quantos desvios padrão um valor está da média: <code>z = (valor − média) / desvio</code>. Ele põe medidas diferentes na mesma régua. Um z de 2 ou mais (ou −2 ou menos) é incomum; acima de 3, raríssimo.</p>
${codigo(`from statistics import mean, stdev

vendas_dia = [980, 1010, 1000, 995, 1020, 1005, 990, 1450]
m, s = mean(vendas_dia[:-1]), stdev(vendas_dia[:-1])   # o padrão dos dias normais
z = (vendas_dia[-1] - m) / s
print("Média", round(m), "| desvio", round(s, 1), "| z do último dia:", round(z, 1))`)}

<h2>Amostra e população</h2>
<p>Quase nunca dá para medir todo mundo. Pesquisa-se uma <strong>amostra</strong> e estima-se o todo. Duas regras:</p>
<ul>
  <li>A amostra precisa ser <strong>representativa</strong>: perguntar a satisfação só a quem respondeu o e-mail de avaliação ouve os mais engajados (e os mais irritados).</li>
  <li>Quanto <strong>maior</strong> a amostra, menor o erro, mas o ganho diminui: o erro cai com a raiz quadrada do tamanho. Para cortar o erro pela metade, é preciso uma amostra quatro vezes maior.</li>
</ul>
${codigo(`import random
from statistics import mean, stdev

random.seed(42)
# Uma "população" de 100 mil valores de pedidos; a média real é conhecida
populacao = [random.lognormvariate(4, 0.5) for _ in range(100_000)]
print("Média real:", round(mean(populacao), 2))

for n in [10, 100, 1000, 10000]:
    medias = [mean(random.sample(populacao, n)) for _ in range(200)]
    print(f"Amostras de {n:>5}: as médias variam com desvio de {stdev(medias):.2f}")`)}
${dica('Isso tem nome: <strong>lei dos grandes números</strong>. É por ela que uma pesquisa eleitoral com 2 mil pessoas bem escolhidas acerta o resultado de um país inteiro, e que 5 avaliações de um produto dizem muito pouco.')}
`,
              quiz: [
                {
                  pergunta: 'Um valor tem escore z igual a 3. O que isso diz?',
                  opcoes: [
                    'Que é o terceiro maior',
                    'Que está 3 desvios padrão acima da média: muito incomum',
                    'Que vale 3 vezes a média'
                  ],
                  certa: 1,
                  explicacao: 'Numa distribuição normal, menos de 0,2% dos valores ficam além de 3 desvios.'
                },
                {
                  pergunta: 'Para cortar o erro de uma estimativa pela metade, a amostra precisa ficar:',
                  opcoes: ['2 vezes maior', '4 vezes maior', '10 vezes maior'],
                  certa: 1,
                  explicacao: 'O erro cai com a raiz quadrada do tamanho da amostra.'
                },
                {
                  pergunta: 'Qual é o principal risco de pesquisar só quem respondeu um e-mail?',
                  opcoes: [
                    'A amostra ser pequena',
                    'A amostra não representar todos os clientes',
                    'O e-mail ir para o spam'
                  ],
                  certa: 1,
                  explicacao: 'Quem responde costuma ser diferente de quem não responde.'
                }
              ]
            },
            {
              id: 'correlacao-e-regressao',
              titulo: 'Correlação e regressão',
              resumo: 'Medir se duas coisas andam juntas, prever com uma reta e não confundir com causa.',
              minutos: 13,
              corpo: `
<h2>Correlação</h2>
<p>O <strong>coeficiente de correlação</strong> (de Pearson) mede o quanto duas variáveis andam juntas numa linha reta. Vai de −1 a 1:</p>
<ul>
  <li>Perto de <strong>1</strong>: quando uma sobe, a outra sobe.</li>
  <li>Perto de <strong>−1</strong>: quando uma sobe, a outra desce.</li>
  <li>Perto de <strong>0</strong>: não há relação em linha reta (mas pode haver outra, em curva).</li>
</ul>
${codigo(`from statistics import correlation

temperatura = [22, 25, 27, 30, 32, 34, 29, 24]          # máxima do dia (°C)
picoles     = [40, 55, 62, 80, 91, 99, 75, 50]          # vendidos no dia
guarda_chuva = [12, 9, 8, 5, 3, 2, 6, 10]

print("Temperatura x picolés:      ", round(correlation(temperatura, picoles), 3))
print("Temperatura x guarda-chuvas:", round(correlation(temperatura, guarda_chuva), 3))`)}

<h2>Regressão linear: prever com uma reta</h2>
<p>Se a relação é forte, dá para traçar a reta que melhor passa pelos pontos e usá-la para prever: <code>picolés ≈ inclinação × temperatura + intercepto</code>.</p>
${codigo(`from statistics import linear_regression, correlation

temperatura = [22, 25, 27, 30, 32, 34, 29, 24]
picoles     = [40, 55, 62, 80, 91, 99, 75, 50]

inclinacao, intercepto = linear_regression(temperatura, picoles)
print(f"A cada grau a mais, uns {inclinacao:.1f} picolés a mais")
for t in [26, 31, 36]:
    print(t, "°C ->", round(inclinacao * t + intercepto), "picolés")
print("R² =", round(correlation(temperatura, picoles) ** 2, 3))`)}
<p>O <strong>R²</strong> (a correlação ao quadrado) diz quanto da variação de uma é explicado pela outra. Cuidado ao prever <strong>fora</strong> da faixa dos dados: a reta não sabe que acima de 40 °C as pessoas ficam em casa.</p>

<h2>Correlação não é causa</h2>
<p>Vendas de sorvete e afogamentos sobem juntos. Um não causa o outro: os dois são causados pelo calor (uma <strong>variável escondida</strong>). Antes de concluir "X causa Y", pergunte: pode ser o contrário? Há uma terceira coisa por trás das duas? É coincidência de poucos dados? A forma confiável de provar causa é o <strong>experimento</strong>, como o teste A/B do nível avançado.</p>
${dica('Sempre olhe o gráfico de dispersão antes de confiar num número de correlação. Conjuntos de dados completamente diferentes (uma curva, uma reta com um ponto fora, dois grupos) podem ter exatamente a mesma correlação. O exemplo clássico é o "quarteto de Anscombe".')}
`,
              quiz: [
                {
                  pergunta: 'Uma correlação de −0,9 significa:',
                  opcoes: [
                    'Nenhuma relação',
                    'Uma relação forte: quando uma sobe, a outra desce',
                    'Um erro de cálculo'
                  ],
                  certa: 1,
                  explicacao: 'O sinal diz a direção; o tamanho, a força.'
                },
                {
                  pergunta: 'Sorvete e afogamentos têm correlação alta. Sorvete causa afogamento?',
                  opcoes: ['Sim', 'Não: o calor causa os dois', 'Só no verão'],
                  certa: 1,
                  explicacao: 'É o caso clássico de variável escondida.'
                },
                {
                  pergunta: 'Por que é arriscado usar a reta para prever bem fora da faixa dos dados?',
                  opcoes: [
                    'A reta só vale onde há dados; fora dali a relação pode mudar',
                    'O Python não deixa',
                    'Não é arriscado'
                  ],
                  certa: 0,
                  explicacao: 'Nada garante que a relação continue em linha reta.'
                }
              ]
            },
            {
              id: 'desafio-relacoes',
              tipo: 'desafio',
              titulo: 'Desafio: dias incomuns e previsão',
              resumo: 'Escore z, correlação e uma previsão com regressão linear.',
              minutos: 22,
              enunciado: `
<p>A pousada registrou, para cada semana, o investimento em anúncios e o número de reservas. Escreva:</p>
<ul>
  <li><code>escores_z(valores)</code>: a lista do escore z de cada valor (em relação à média e ao desvio padrão de amostra da própria lista), com 2 casas.</li>
  <li><code>incomuns(valores, limite=2)</code>: os <strong>índices</strong> dos valores com escore z, em módulo, maior ou igual ao limite.</li>
  <li><code>prever(x, y, novo_x)</code>: usando a regressão linear de <code>y</code> em função de <code>x</code>, devolve um dicionário com <code>previsao</code> (o y previsto para <code>novo_x</code>, arredondado para inteiro) e <code>r2</code> (a correlação ao quadrado, com 3 casas).</li>
</ul>`,
              inicial: `from statistics import mean, stdev, correlation, linear_regression

anuncios = [200, 350, 150, 400, 300, 500, 250, 450]   # R$ investidos na semana
reservas = [12, 18, 10, 22, 16, 27, 14, 24]            # reservas na semana


def escores_z(valores):
    pass


def incomuns(valores, limite=2):
    pass


def prever(x, y, novo_x):
    pass


print(prever(anuncios, reservas, 600))
`,
              testes: [
                [
                  'escores_z calcula (valor − média) / desvio, com 2 casas',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'from statistics import mean as _m, stdev as _s\nv = [10, 12, 9, 11, 30]\nescores_z(v) == [round((x - _m(v)) / _s(v), 2) for x in v]'
                    ) === true
                ],
                [
                  'incomuns devolve os índices dos valores extremos',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'incomuns([10, 10, 11, 9, 10, 11, 9, 10, 40]) == [8] and incomuns([1, 2, 3, 4]) == [] and incomuns([10, 12, 9, 11, 30], limite=1.5) == [4]'
                    ) === true
                ],
                [
                  'prever usa a regressão linear e arredonda',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'from statistics import linear_regression as _lr\na, b = _lr(anuncios, reservas)\nprever(anuncios, reservas, 600)["previsao"] == round(a * 600 + b) and prever([1, 2, 3], [2, 4, 6], 10)["previsao"] == 20'
                    ) === true
                ],
                [
                  'prever devolve o R² com 3 casas',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'from statistics import correlation as _c\nprever(anuncios, reservas, 600)["r2"] == round(_c(anuncios, reservas) ** 2, 3) and prever([1, 2, 3], [2, 4, 6], 10)["r2"] == 1.0'
                    ) === true
                ]
              ],
              solucao: `from statistics import mean, stdev, correlation, linear_regression

anuncios = [200, 350, 150, 400, 300, 500, 250, 450]   # R$ investidos na semana
reservas = [12, 18, 10, 22, 16, 27, 14, 24]            # reservas na semana


def escores_z(valores):
    m, s = mean(valores), stdev(valores)
    return [round((v - m) / s, 2) for v in valores]


def incomuns(valores, limite=2):
    return [i for i, z in enumerate(escores_z(valores)) if abs(z) >= limite]


def prever(x, y, novo_x):
    inclinacao, intercepto = linear_regression(x, y)
    return {
        "previsao": round(inclinacao * novo_x + intercepto),
        "r2": round(correlation(x, y) ** 2, 3),
    }


print(prever(anuncios, reservas, 600))`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Margem de erro, testes A/B e as armadilhas da análise.',
      modulos: [
        {
          titulo: 'Decidir com dados',
          itens: [
            {
              id: 'intervalos-e-testes-ab',
              titulo: 'Margem de erro e testes A/B',
              resumo: 'Intervalo de confiança, valor-p e quando uma diferença é real.',
              minutos: 14,
              corpo: `
<h2>Margem de erro</h2>
<p>De 400 visitantes, 32 reservaram: taxa de 8%. Mas, com outros 400, poderia dar 6% ou 10%. O <strong>intervalo de confiança</strong> diz a faixa provável da taxa verdadeira. Para uma proporção <code>p</code> com <code>n</code> observações, o <strong>erro padrão</strong> é <code>√(p × (1 − p) / n)</code>, e o intervalo de 95% vai de <code>p − 1,96 × erro</code> a <code>p + 1,96 × erro</code>:</p>
${codigo(`from math import sqrt
from statistics import NormalDist

def intervalo(sucessos, n, confianca=0.95):
    p = sucessos / n
    z = NormalDist().inv_cdf(0.5 + confianca / 2)   # 1,96 para 95%
    erro = sqrt(p * (1 - p) / n)
    return p, p - z * erro, p + z * erro

for sucessos, n in [(32, 400), (320, 4000)]:
    p, baixo, alto = intervalo(sucessos, n)
    print(f"{sucessos}/{n}: {p:.1%} (entre {baixo:.1%} e {alto:.1%})")`)}
<p>A mesma taxa de 8%, com 10 vezes mais dados, tem um intervalo bem mais estreito.</p>

<h2>Teste A/B</h2>
<p>Para saber se o botão novo de "Reservar" funciona melhor, metade dos visitantes (escolhidos <strong>ao acaso</strong>) vê o antigo (A) e metade vê o novo (B). Como a única diferença entre os grupos é o botão, uma diferença nas taxas pode ser atribuída a ele. A pergunta é: a diferença é grande demais para ser só sorte?</p>
${codigo(`from math import sqrt
from statistics import NormalDist

def teste_ab(conv_a, n_a, conv_b, n_b):
    pa, pb = conv_a / n_a, conv_b / n_b
    p = (conv_a + conv_b) / (n_a + n_b)              # a taxa juntando os dois grupos
    erro = sqrt(p * (1 - p) * (1 / n_a + 1 / n_b))
    z = (pb - pa) / erro
    valor_p = 2 * (1 - NormalDist().cdf(abs(z)))       # bicaudal
    return pa, pb, z, valor_p

pa, pb, z, valor_p = teste_ab(80, 2000, 112, 2000)
print(f"A: {pa:.1%} | B: {pb:.1%} | z = {z:.2f} | valor-p = {valor_p:.4f}")
print("Diferença significativa a 5%?", valor_p < 0.05)`)}
<p>O <strong>valor-p</strong> é a chance de ver uma diferença tão grande quanto a observada <em>se os dois botões fossem iguais</em>. Abaixo de 0,05 (5%), costuma-se dizer que a diferença é <strong>estatisticamente significativa</strong>.</p>

<h2>As regras do jogo</h2>
<ul>
  <li><strong>Decida o tamanho antes</strong> e não pare o teste "quando der significativo": espiar todo dia e parar no primeiro p &lt; 0,05 encontra diferenças que não existem.</li>
  <li><strong>Significativo não é importante</strong>: com milhões de visitas, uma diferença de 0,01% passa no teste e não vale o trabalho. Olhe o tamanho do efeito e o intervalo.</li>
  <li>Rode semanas inteiras: o comportamento de segunda é diferente do de sábado.</li>
</ul>
${dica('Ferramentas de teste A/B fazem essas contas, mas saber o que está por trás ajuda a desconfiar de um "B ganhou com 97% de confiança" depois de dois dias e 60 visitas.')}
`,
              quiz: [
                {
                  pergunta: 'O que acontece com o intervalo de confiança quando a amostra cresce?',
                  opcoes: ['Fica mais largo', 'Fica mais estreito', 'Não muda'],
                  certa: 1,
                  explicacao: 'O erro padrão diminui com a raiz de n.'
                },
                {
                  pergunta: 'Um valor-p de 0,01 num teste A/B significa:',
                  opcoes: [
                    'Que B é 1% melhor',
                    'Que, se A e B fossem iguais, uma diferença assim apareceria só 1% das vezes',
                    'Que há 99% de chance de B ser melhor'
                  ],
                  certa: 1,
                  explicacao: 'O valor-p fala dos dados supondo que não há diferença, não da chance de B ser melhor.'
                },
                {
                  pergunta: 'Por que não parar o teste assim que der significativo?',
                  opcoes: [
                    'Porque gasta menos',
                    'Porque espiar e parar no primeiro p < 0,05 aumenta muito os falsos positivos',
                    'Porque o valor-p sempre cai'
                  ],
                  certa: 1,
                  explicacao: 'O tamanho do teste deve ser decidido antes de começar.'
                }
              ]
            },
            {
              id: 'armadilhas',
              titulo: 'As armadilhas da análise',
              resumo: 'Paradoxo de Simpson, média de médias, viés de sobrevivência e gráficos enganosos.',
              minutos: 12,
              corpo: `
<h2>Paradoxo de Simpson</h2>
<p>Uma tendência que aparece em cada grupo pode se inverter quando os grupos são somados. Duas atendentes da pousada, olhando a taxa de reservas fechadas por mensagem:</p>
${codigo(`# (fechadas, mensagens) por tipo de pedido
ana   = {"simples": (180, 200), "grupos": (10, 50)}
bruno = {"simples": (45, 50),   "grupos": (60, 200)}

for nome, d in [("Ana", ana), ("Bruno", bruno)]:
    por_tipo = {k: f"{f / m:.0%}" for k, (f, m) in d.items()}
    total = sum(f for f, _ in d.values()) / sum(m for _, m in d.values())
    print(nome, por_tipo, "| total:", f"{total:.0%}")`)}
<p>Bruno é melhor nos dois tipos de pedido, mas pior no total, porque recebeu muito mais pedidos de grupo, que são mais difíceis. Antes de comparar totais, confira se os grupos comparados têm a mesma composição.</p>

<h2>Média de médias</h2>
<p>A média das taxas de cada mês não é a taxa do ano, se os meses tiveram volumes diferentes. Some os numeradores e os denominadores, e só então divida (a média ponderada do nível iniciante).</p>

<h2>Viés de sobrevivência</h2>
<p>Olhar só para quem "sobreviveu" engana. "Os clientes que ficam mais de um ano gastam muito": talvez só os que gastam muito fiquem. "Os negócios de sucesso começaram assim": e os mil que começaram igual e fecharam? Pergunte sempre quem ficou fora dos dados.</p>

<h2>Comparações demais</h2>
<p>Com 20 métricas e o limite de 5%, espera-se que uma dê "significativa" só por acaso. Procurar até achar algo (<em>p-hacking</em>) sempre acha. Defina antes o que vai medir.</p>

<h2>Gráficos que mentem</h2>
<ul>
  <li><strong>Eixo que não começa no zero</strong> em gráficos de barra: uma diferença de 2% parece o dobro.</li>
  <li><strong>Períodos escolhidos a dedo</strong>: começar o gráfico no pior mês faz qualquer coisa parecer crescimento.</li>
  <li><strong>Números absolutos onde deveriam ser taxas</strong>: "a cidade X tem mais acidentes" (e mais carros).</li>
</ul>
${dica('Ao ler um número, pergunte: comparado com o quê? Com quantos dados? Quem ficou de fora? Quantas outras coisas foram testadas antes desta? Essas quatro perguntas desarmam a maioria das conclusões apressadas.')}
`,
              quiz: [
                {
                  pergunta: 'No exemplo, por que Bruno tem a pior taxa total sendo melhor nos dois tipos?',
                  opcoes: [
                    'Erro de conta',
                    'Ele recebeu muito mais pedidos de grupo, que têm taxa baixa para todos',
                    'Porque a Ana trabalhou mais'
                  ],
                  certa: 1,
                  explicacao: 'É o paradoxo de Simpson: a composição dos grupos muda o total.'
                },
                {
                  pergunta: 'Como calcular a taxa do ano a partir dos meses?',
                  opcoes: [
                    'Média das taxas mensais',
                    'Somar os sucessos e as tentativas do ano e dividir',
                    'Pegar a taxa de dezembro'
                  ],
                  certa: 1,
                  explicacao: 'A média simples das taxas ignora que os meses tiveram volumes diferentes.'
                },
                {
                  pergunta: 'Testar 20 métricas com limite de 5% e achar uma "significativa" prova algo?',
                  opcoes: ['Sim', 'Não: espera-se uma por acaso', 'Só se for a primeira'],
                  certa: 1,
                  explicacao: '20 × 5% = 1 falso positivo esperado.'
                }
              ]
            },
            {
              id: 'desafio-teste-ab',
              tipo: 'desafio',
              titulo: 'Desafio: o teste A/B da página de reservas',
              resumo: 'Intervalo de confiança, teste de duas proporções e a taxa certa de vários meses.',
              minutos: 25,
              enunciado: `
<p>Use <code>NormalDist</code> e <code>sqrt</code>. Escreva:</p>
<ul>
  <li><code>intervalo(sucessos, n, confianca=0.95)</code>: devolve a tupla <code>(p, baixo, alto)</code> da proporção e do intervalo de confiança (com o z de <code>NormalDist().inv_cdf(0.5 + confianca / 2)</code>), cada um arredondado com 4 casas. O <code>baixo</code> nunca é menor que 0 e o <code>alto</code> nunca é maior que 1.</li>
  <li><code>teste_ab(conv_a, n_a, conv_b, n_b, alfa=0.05)</code>: devolve um dicionário com <code>taxa_a</code> e <code>taxa_b</code> (4 casas), <code>z</code> (2 casas), <code>valor_p</code> (bicaudal, 4 casas, calculado com o z <strong>sem</strong> arredondar) e <code>significativo</code> (<code>True</code> se o valor-p for menor que <code>alfa</code>). Use o erro padrão com a taxa combinada dos dois grupos, como na aula.</li>
  <li><code>taxa_total(meses)</code>: recebe uma lista de tuplas <code>(sucessos, tentativas)</code> e devolve a taxa do período inteiro (não a média das taxas), com 4 casas.</li>
</ul>`,
              inicial: `from math import sqrt
from statistics import NormalDist


def intervalo(sucessos, n, confianca=0.95):
    pass


def teste_ab(conv_a, n_a, conv_b, n_b, alfa=0.05):
    pass


def taxa_total(meses):
    pass


print(intervalo(32, 400))
print(teste_ab(80, 2000, 112, 2000))
print(taxa_total([(10, 100), (90, 300)]))
`,
              testes: [
                [
                  'intervalo calcula p e a faixa de 95%',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'p, b, a = intervalo(32, 400)\np == 0.08 and b == round(0.08 - 1.959963984540054 * sqrt(0.08 * 0.92 / 400), 4) and a == round(0.08 + 1.959963984540054 * sqrt(0.08 * 0.92 / 400), 4)'
                    ) === true
                ],
                [
                  'intervalo respeita os limites 0 e 1 e aceita outra confiança',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'b1 = intervalo(1, 20)[1]\na2 = intervalo(19, 20)[2]\nl90 = intervalo(32, 400, 0.90)\nl95 = intervalo(32, 400)\nb1 == 0 and a2 == 1 and l90[2] - l90[1] < l95[2] - l95[1]'
                    ) === true
                ],
                [
                  'teste_ab calcula taxas, z e valor-p',
                  async doc =>
                    doc.defaultView.__py.runPython(`r = teste_ab(80, 2000, 112, 2000)
_p = 192 / 4000
_e = sqrt(_p * (1 - _p) * (1 / 2000 + 1 / 2000))
_z = (112 / 2000 - 80 / 2000) / _e
r["taxa_a"] == 0.04 and r["taxa_b"] == 0.056 and r["z"] == round(_z, 2) and r["valor_p"] == round(2 * (1 - NormalDist().cdf(abs(_z))), 4)`) ===
                    true
                ],
                [
                  'teste_ab decide a significância pelo alfa',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'teste_ab(80, 2000, 112, 2000)["significativo"] is True and teste_ab(80, 2000, 90, 2000)["significativo"] is False and teste_ab(80, 2000, 112, 2000, alfa=0.01)["significativo"] is False'
                    ) === true
                ],
                [
                  'taxa_total soma antes de dividir',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'taxa_total([(10, 100), (90, 300)]) == 0.25 and taxa_total([(1, 3)]) == 0.3333'
                    ) === true
                ]
              ],
              solucao: `from math import sqrt
from statistics import NormalDist


def intervalo(sucessos, n, confianca=0.95):
    p = sucessos / n
    z = NormalDist().inv_cdf(0.5 + confianca / 2)
    erro = sqrt(p * (1 - p) / n)
    return round(p, 4), round(max(0, p - z * erro), 4), round(min(1, p + z * erro), 4)


def teste_ab(conv_a, n_a, conv_b, n_b, alfa=0.05):
    pa, pb = conv_a / n_a, conv_b / n_b
    p = (conv_a + conv_b) / (n_a + n_b)
    erro = sqrt(p * (1 - p) * (1 / n_a + 1 / n_b))
    z = (pb - pa) / erro
    valor_p = 2 * (1 - NormalDist().cdf(abs(z)))
    return {
        "taxa_a": round(pa, 4),
        "taxa_b": round(pb, 4),
        "z": round(z, 2),
        "valor_p": round(valor_p, 4),
        "significativo": valor_p < alfa,
    }


def taxa_total(meses):
    sucessos = sum(s for s, _ in meses)
    tentativas = sum(t for _, t in meses)
    return round(sucessos / tentativas, 4)


print(intervalo(32, 400))
print(teste_ab(80, 2000, 112, 2000))
print(taxa_total([(10, 100), (90, 300)]))`
            }
          ]
        }
      ]
    }
  ]
};
