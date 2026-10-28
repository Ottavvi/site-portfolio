// Trilha de Python: o editor roda Python de verdade no navegador (Pyodide). O print aparece no resultado, que
// funciona como um terminal. Os testes rodam expressões em Python com window.__py.runPython e conferem se deram True.
// Atenção: corpo, inicial e solucao são template strings do JavaScript. Um \n dentro de texto Python precisa ser
// escrito \\n aqui, senão vira uma quebra de linha de verdade no meio da string.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'python',
  area: 'Back-end e dados',
  titulo: 'Python',
  sigla: 'Py',
  linguagem: 'python',
  resumo: 'A linguagem mais usada para automatizar tarefas e analisar dados, rodando aqui no navegador.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Variáveis, decisões, laços e funções.',
      modulos: [
        {
          titulo: 'Primeiros passos',
          itens: [
            {
              id: 'primeiros-passos',
              titulo: 'Primeiros passos em Python',
              resumo: 'print, variáveis, tipos e f-strings.',
              minutos: 9,
              corpo: `
<p>Python é uma linguagem conhecida por ser fácil de ler. Ela é usada para automatizar tarefas chatas, analisar dados, criar sites e treinar modelos de inteligência artificial. Nesta trilha, o Python roda dentro da página (com o <strong>Pyodide</strong>): clique em <strong>Experimente</strong> e o resultado aparece como num terminal. Na primeira vez, ele leva alguns segundos para carregar.</p>
${codigo(`print("Olá, Python!")
print(2 + 3)
print("Isso", "tem", "várias", "partes")`)}

<h2>Variáveis</h2>
<p>Em Python, basta dar um nome e usar <code>=</code>. Não há <code>let</code>, <code>const</code> nem ponto e vírgula. Os nomes costumam ser em <code>snake_case</code> (palavras separadas por <code>_</code>):</p>
${codigo(`nome = "Ana"
idade = 28
altura = 1.65
estuda = True

print(nome, idade, altura, estuda)
print(type(idade), type(altura))`)}
<p>Os tipos básicos são <code>str</code> (texto), <code>int</code> (inteiro), <code>float</code> (decimal), <code>bool</code> (<code>True</code> ou <code>False</code>, com maiúscula) e <code>None</code> (nenhum valor).</p>

<h2>f-strings</h2>
<p>Com um <code>f</code> antes das aspas, o que estiver entre chaves é calculado e colocado no texto. Depois de <code>:</code>, dá para formatar:</p>
${codigo(`produto = "café"
preco = 18.5
quantidade = 3

print(f"{quantidade} pacotes de {produto}: R$ {preco * quantidade:.2f}")`)}

<h2>Conversões</h2>
<p>Texto e número não se misturam sozinhos. <code>int()</code>, <code>float()</code> e <code>str()</code> convertem:</p>
${codigo(`print("2" + "3")
print(int("2") + int("3"))
print("Total: " + str(10))`)}
${dica('Em Python, a indentação (os espaços no começo da linha) faz parte da linguagem. Ela é que diz o que está dentro de um <code>if</code> ou de uma função. Use sempre 4 espaços.')}
`,
              quiz: [
                {
                  pergunta: 'Como se escreve verdadeiro em Python?',
                  opcoes: ['true', 'True', 'TRUE'],
                  certa: 1,
                  explicacao: 'True e False começam com maiúscula. Escrever true dá NameError.'
                },
                {
                  pergunta: 'O que f"{2 * 3}" produz?',
                  opcoes: ['"{2 * 3}"', '"6"', 'Um erro'],
                  certa: 1,
                  explicacao: 'Nas f-strings, o que está entre chaves é calculado.'
                },
                {
                  pergunta: 'Qual o resultado de "2" + "3"?',
                  opcoes: ['5', '"23"', 'Um erro'],
                  certa: 1,
                  explicacao: 'Somar textos junta os dois. Para somar números, converta com int() ou float().'
                }
              ]
            },
            {
              id: 'decisoes-e-lacos',
              titulo: 'Decisões e laços',
              resumo: 'if, elif, else, for, range e while.',
              minutos: 11,
              corpo: `
<h2>if, elif e else</h2>
<p>Os blocos são marcados pelos <strong>dois pontos</strong> e pela <strong>indentação</strong>, sem chaves:</p>
${codigo(`nota = 6.5

if nota >= 7:
    print("Aprovado")
elif nota >= 5:
    print("Recuperação")
else:
    print("Reprovado")`)}
<p>Os operadores lógicos são palavras: <code>and</code>, <code>or</code> e <code>not</code>. Comparações podem ser encadeadas, como na matemática: <code>0 &lt;= nota &lt;= 10</code>.</p>

<h2>for: repetir para cada item</h2>
<p>O <code>for</code> do Python percorre qualquer sequência: uma lista, as letras de um texto, um intervalo de números:</p>
${codigo(`frutas = ["maçã", "banana", "uva"]
for fruta in frutas:
    print(fruta.upper())

for i in range(1, 4):
    print(f"Volta {i}")`)}
<p><code>range(1, 4)</code> gera 1, 2 e 3: o fim não entra. Para ter o índice junto com o item, use <code>enumerate</code>:</p>
${codigo(`for posicao, fruta in enumerate(["maçã", "banana"], start=1):
    print(posicao, fruta)`)}

<h2>while: repetir enquanto</h2>
${codigo(`saldo = 100
meses = 0
while saldo < 150:
    saldo = saldo * 1.1
    meses += 1
print(f"{meses} meses até passar de 150 (saldo: {saldo:.2f})")`)}
<p><code>break</code> sai do laço na hora; <code>continue</code> pula para a próxima volta.</p>
${dica('Se o resultado não aparecer nunca, provavelmente o <code>while</code> não termina. A condição precisa ficar falsa em algum momento.')}
`,
              quiz: [
                {
                  pergunta: 'O que marca o que está dentro de um if em Python?',
                  opcoes: ['Chaves { }', 'A indentação depois dos dois pontos', 'A palavra end'],
                  certa: 1,
                  explicacao:
                    'As linhas recuadas abaixo do if: são o bloco dele. Errar a indentação dá IndentationError.'
                },
                {
                  pergunta: 'Quais números range(2, 5) gera?',
                  opcoes: ['2, 3, 4, 5', '2, 3, 4', '3, 4, 5'],
                  certa: 1,
                  explicacao: 'O início entra e o fim não.'
                },
                {
                  pergunta: 'Como se escreve "e" lógico em Python?',
                  opcoes: ['&&', 'and', '&'],
                  certa: 1,
                  explicacao: 'Python usa palavras: and, or e not.'
                }
              ]
            },
            {
              id: 'funcoes',
              titulo: 'Funções',
              resumo: 'def, parâmetros, valores padrão e return.',
              minutos: 10,
              corpo: `
<p>Uma função dá nome a um pedaço de código para usar várias vezes. Ela é criada com <code>def</code> e devolve um resultado com <code>return</code>:</p>
${codigo(`def area_retangulo(largura, altura):
    return largura * altura

print(area_retangulo(3, 4))
print(area_retangulo(10, 2.5))`)}
<p>Uma função sem <code>return</code> devolve <code>None</code>. Imprimir não é devolver: o <code>print</code> mostra na tela, o <code>return</code> entrega o valor para quem chamou usar.</p>

<h2>Valores padrão e argumentos com nome</h2>
${codigo(`def preco_final(preco, desconto=0, frete=15):
    return preco * (1 - desconto) + frete

print(preco_final(100))
print(preco_final(100, desconto=0.1))
print(preco_final(100, frete=0))`)}
<p>Passar o argumento pelo nome (<code>frete=0</code>) deixa a chamada mais clara e permite pular os que vêm antes.</p>

<h2>Documentar e anotar</h2>
<p>Um texto logo abaixo do <code>def</code> (a <em>docstring</em>) explica o que a função faz. As <strong>anotações de tipo</strong> são opcionais e não mudam nada na execução, mas ajudam quem lê e o editor:</p>
${codigo(`def imc(peso: float, altura: float) -> float:
    """Índice de massa corporal, com uma casa decimal."""
    return round(peso / altura ** 2, 1)

print(imc(70, 1.75))`)}
${dica('<code>**</code> é potência em Python: <code>2 ** 3</code> é 8. E <code>//</code> é a divisão inteira: <code>7 // 2</code> é 3.')}
`,
              quiz: [
                {
                  pergunta: 'O que uma função sem return devolve?',
                  opcoes: ['0', 'None', 'Um erro'],
                  certa: 1,
                  explicacao: 'Sem return, o resultado é None.'
                },
                {
                  pergunta: 'Em def f(a, b=2), como chamar mudando só b?',
                  opcoes: ['f(b=5)', 'f(1, b=5)', 'f(, 5)'],
                  certa: 1,
                  explicacao: 'a não tem valor padrão, então precisa ser passado. b pode ir pelo nome.'
                },
                {
                  pergunta: 'Quanto é 2 ** 4?',
                  opcoes: ['8', '16', '6'],
                  certa: 1,
                  explicacao: '** é potência: 2 elevado a 4.'
                }
              ]
            },
            {
              id: 'desafio-funcoes',
              tipo: 'desafio',
              titulo: 'Desafio: funções da cantina',
              resumo: 'Escreva três funções com decisões, laços e return.',
              minutos: 18,
              enunciado: `
<p>A cantina da escola precisa de três funções. Os testes chamam cada uma com vários valores, então use <code>return</code> (não <code>print</code>).</p>
<ul>
  <li><code>troco(pago, total)</code>: devolve o troco. Se o valor pago não for suficiente, devolve <code>None</code>.</li>
  <li><code>desconto(total, aluno)</code>: alunos (<code>aluno=True</code>) têm 10% de desconto; compras a partir de 50 têm mais 5% (sobre o total original). Devolve o total com o desconto, arredondado com 2 casas.</li>
  <li><code>contar_vogais(texto)</code>: quantas vogais (a, e, i, o, u, maiúsculas ou minúsculas) o texto tem.</li>
</ul>`,
              inicial: `def troco(pago, total):
    pass


def desconto(total, aluno):
    pass


def contar_vogais(texto):
    pass


# Teste aqui:
print(troco(20, 12.5))
`,
              testes: [
                [
                  'troco devolve a diferença, ou None se faltar dinheiro',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'troco(20, 12.5) == 7.5 and troco(10, 10) == 0 and troco(5, 8) is None'
                    ) === true
                ],
                [
                  'desconto aplica 10% para aluno e 5% a partir de 50',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'desconto(40, False) == 40 and desconto(40, True) == 36 and desconto(50, False) == 47.5 and desconto(80, True) == 68'
                    ) === true
                ],
                [
                  'contar_vogais conta vogais maiúsculas e minúsculas',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'contar_vogais("Python") == 1 and contar_vogais("ABACAXI") == 4 and contar_vogais("xyz") == 0'
                    ) === true
                ]
              ],
              solucao: `def troco(pago, total):
    if pago < total:
        return None
    return pago - total


def desconto(total, aluno):
    taxa = 0
    if aluno:
        taxa += 0.10
    if total >= 50:
        taxa += 0.05
    return round(total * (1 - taxa), 2)


def contar_vogais(texto):
    quantidade = 0
    for letra in texto.lower():
        if letra in "aeiou":
            quantidade += 1
    return quantidade


print(troco(20, 12.5))
print(desconto(80, True))
print(contar_vogais("Python"))`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Listas, dicionários, textos, CSV e JSON.',
      modulos: [
        {
          titulo: 'Coleções e dados',
          itens: [
            {
              id: 'listas-e-dicionarios',
              titulo: 'Listas, dicionários e compreensões',
              resumo: 'As estruturas que você vai usar o tempo todo.',
              minutos: 13,
              corpo: `
<h2>Listas</h2>
<p>Uma lista guarda itens em ordem. Os índices começam em 0, e índices negativos contam do fim:</p>
${codigo(`notas = [7.5, 9, 6, 8.5]
notas.append(10)
print(notas[0], notas[-1])
print(len(notas), sum(notas) / len(notas))
print(sorted(notas, reverse=True))
print(notas[1:3])  # fatia: do índice 1 até antes do 3`)}

<h2>Dicionários</h2>
<p>Um dicionário liga <strong>chaves</strong> a <strong>valores</strong>, como um objeto do JavaScript:</p>
${codigo(`produto = {"nome": "Café", "preco": 62.9, "estoque": 40}
produto["estoque"] -= 2
produto["categoria"] = "Mercearia"

print(produto["nome"], produto["estoque"])
print(produto.get("desconto", 0))  # valor padrão se a chave não existir

for chave, valor in produto.items():
    print(f"{chave}: {valor}")`)}
${dica('<code>produto["x"]</code> dá <code>KeyError</code> se a chave não existe. <code>produto.get("x")</code> devolve <code>None</code> (ou o padrão que você passar).')}

<h2>Compreensões</h2>
<p>Uma <strong>compreensão de lista</strong> cria uma lista nova a partir de outra, numa linha. É o jeito "pythônico" de fazer o que o <code>map</code> e o <code>filter</code> fazem em JavaScript:</p>
${codigo(`precos = [10, 25, 40, 8]
com_aumento = [round(p * 1.1, 2) for p in precos]
caros = [p for p in precos if p > 20]
print(com_aumento)
print(caros)

# Também existe para dicionários
estoque = {"café": 40, "chá": 0, "filtro": 120}
disponiveis = {nome: qtd for nome, qtd in estoque.items() if qtd > 0}
print(disponiveis)`)}

<h2>Tuplas e conjuntos</h2>
<p>A <strong>tupla</strong> <code>(1, 2)</code> é uma lista que não muda, boa para pares como coordenadas. O <strong>conjunto</strong> <code>{1, 2}</code> não tem ordem nem repetição, e é ótimo para tirar duplicados: <code>set([1, 1, 2])</code> vira <code>{1, 2}</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'Em lista = [5, 6, 7], quanto vale lista[-1]?',
                  opcoes: ['5', '7', 'Erro'],
                  certa: 1,
                  explicacao: 'Índices negativos contam do fim: -1 é o último.'
                },
                {
                  pergunta: 'O que [x * 2 for x in [1, 2, 3]] produz?',
                  opcoes: ['[1, 2, 3, 1, 2, 3]', '[2, 4, 6]', '12'],
                  certa: 1,
                  explicacao: 'A compreensão aplica x * 2 a cada item e monta uma lista nova.'
                },
                {
                  pergunta: 'Como ler uma chave que pode não existir sem dar erro?',
                  opcoes: ['d["chave"]', 'd.get("chave")', 'd.chave'],
                  certa: 1,
                  explicacao: 'get devolve None (ou um padrão) quando a chave não existe.'
                }
              ]
            },
            {
              id: 'textos-csv-e-json',
              titulo: 'Textos, CSV e JSON',
              resumo: 'Limpar texto e ler os formatos de dados mais comuns.',
              minutos: 13,
              corpo: `
<h2>Métodos de texto</h2>
${codigo(`linha = "  Café em grãos;Mercearia;62,90  "
limpa = linha.strip()
partes = limpa.split(";")
print(partes)

nome, categoria, preco = partes
preco = float(preco.replace(",", "."))
print(nome.upper(), categoria.lower(), preco)
print("café" in nome.lower(), nome.startswith("Café"))`)}
<p>Os mais usados: <code>strip</code> (tira espaços das pontas), <code>split</code> (quebra numa lista), <code>join</code> (junta uma lista), <code>replace</code>, <code>lower</code>/<code>upper</code> e <code>startswith</code>.</p>

<h2>CSV</h2>
<p>Para CSV, use o módulo <code>csv</code> da biblioteca padrão: ele cuida de aspas, vírgulas dentro de campos e outros detalhes. Aqui o texto está numa variável; num programa de verdade, viria de <code>open("arquivo.csv", encoding="utf-8")</code>:</p>
${codigo(`import csv
import io

texto = """data,descricao,valor
2026-10-01,Mercado,-182.40
2026-10-05,Salário,3500.00
2026-10-07,Farmácia,-45.90"""

leitor = csv.DictReader(io.StringIO(texto))
for linha in leitor:
    valor = float(linha["valor"])
    tipo = "entrada" if valor > 0 else "saída"
    print(f'{linha["data"]} {linha["descricao"]:<10} {valor:>9.2f} ({tipo})')`)}
${dica('Arquivos de bancos brasileiros costumam usar <code>;</code> como separador e vírgula nos decimais. Use <code>csv.DictReader(arquivo, delimiter=";")</code> e troque a vírgula por ponto antes do <code>float()</code>.')}

<h2>JSON</h2>
<p>O módulo <code>json</code> converte texto JSON em dicionários e listas (<code>loads</code>) e o contrário (<code>dumps</code>):</p>
${codigo(`import json

resposta = '{"cidade": "Recife", "temperaturas": [29, 31, 30]}'
dados = json.loads(resposta)
print(dados["cidade"], max(dados["temperaturas"]))

relatorio = {"media": sum(dados["temperaturas"]) / 3, "acima_de_30": True}
print(json.dumps(relatorio, ensure_ascii=False, indent=2))`)}
`,
              quiz: [
                {
                  pergunta: 'O que "a;b;c".split(";") devolve?',
                  opcoes: ['"abc"', '["a", "b", "c"]', '("a", "b", "c")'],
                  certa: 1,
                  explicacao: 'split quebra o texto numa lista, usando o separador informado.'
                },
                {
                  pergunta: 'Por que usar o módulo csv em vez de split(",")?',
                  opcoes: [
                    'É mais curto',
                    'Ele trata campos com aspas e vírgulas dentro do texto',
                    'split não funciona com arquivos'
                  ],
                  certa: 1,
                  explicacao: 'Um campo como "Silva, Ana" quebraria no split. O csv entende as aspas.'
                },
                {
                  pergunta: 'Qual função transforma texto JSON em dicionário?',
                  opcoes: ['json.dumps', 'json.loads', 'json.parse'],
                  certa: 1,
                  explicacao: 'loads lê (load string). dumps faz o caminho inverso.'
                }
              ]
            },
            {
              id: 'desafio-extrato',
              tipo: 'desafio',
              titulo: 'Desafio: resumo do extrato',
              resumo: 'Leia um CSV de extrato e resuma os gastos por categoria.',
              minutos: 25,
              enunciado: `
<p>Escreva duas funções que recebem o <strong>texto</strong> de um CSV de extrato (separado por <code>;</code>, com decimais com vírgula, como os bancos brasileiros exportam):</p>
<ul>
  <li><code>ler_extrato(texto)</code>: devolve uma lista de dicionários com <code>data</code> (texto), <code>descricao</code> (texto), <code>categoria</code> (texto) e <code>valor</code> (<code>float</code>).</li>
  <li><code>gastos_por_categoria(texto)</code>: devolve um dicionário com o total gasto em cada categoria, <strong>só das saídas</strong> (valores negativos), como número positivo e arredondado com 2 casas.</li>
</ul>
<p>Os testes usam outros extratos além do exemplo.</p>`,
              inicial: `import csv
import io

EXEMPLO = """data;descricao;categoria;valor
01/10/2026;Supermercado Bom Preço;Mercado;-182,40
05/10/2026;Salário;Renda;3500,00
07/10/2026;Farmácia Vida;Saúde;-45,90
12/10/2026;Feira;Mercado;-37,60"""


def ler_extrato(texto):
    pass


def gastos_por_categoria(texto):
    pass


print(gastos_por_categoria(EXEMPLO))
`,
              testes: [
                [
                  'ler_extrato devolve uma lista de dicionários com valor em float',
                  async doc =>
                    doc.defaultView.__py.runPython(`
_t = "data;descricao;categoria;valor\\n02/11/2026;Padaria;Mercado;-12,50\\n03/11/2026;Pix;Renda;100,00"
_r = ler_extrato(_t)
isinstance(_r, list) and len(_r) == 2 and _r[0]["valor"] == -12.5 and _r[1]["descricao"] == "Pix" and _r[0]["categoria"] == "Mercado"
`) === true
                ],
                [
                  'gastos_por_categoria soma só as saídas, como número positivo',
                  async doc =>
                    doc.defaultView.__py.runPython(`
_t = "data;descricao;categoria;valor\\n01/10/2026;A;Mercado;-182,40\\n05/10/2026;B;Renda;3500,00\\n07/10/2026;C;Saúde;-45,90\\n12/10/2026;D;Mercado;-37,60"
gastos_por_categoria(_t) == {"Mercado": 220.0, "Saúde": 45.9}
`) === true
                ],
                [
                  'Os totais são arredondados com 2 casas',
                  async doc =>
                    doc.defaultView.__py.runPython(`
_t = "data;descricao;categoria;valor\\n01/10/2026;A;Lazer;-0,10\\n02/10/2026;B;Lazer;-0,20"
gastos_por_categoria(_t) == {"Lazer": 0.3}
`) === true
                ]
              ],
              solucao: `import csv
import io

EXEMPLO = """data;descricao;categoria;valor
01/10/2026;Supermercado Bom Preço;Mercado;-182,40
05/10/2026;Salário;Renda;3500,00
07/10/2026;Farmácia Vida;Saúde;-45,90
12/10/2026;Feira;Mercado;-37,60"""


def ler_extrato(texto):
    linhas = []
    for linha in csv.DictReader(io.StringIO(texto), delimiter=";"):
        linha["valor"] = float(linha["valor"].replace(".", "").replace(",", "."))
        linhas.append(linha)
    return linhas


def gastos_por_categoria(texto):
    totais = {}
    for linha in ler_extrato(texto):
        if linha["valor"] < 0:
            categoria = linha["categoria"]
            totais[categoria] = totais.get(categoria, 0) - linha["valor"]
    return {categoria: round(total, 2) for categoria, total in totais.items()}


print(gastos_por_categoria(EXEMPLO))`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Erros, classes e a biblioteca padrão.',
      modulos: [
        {
          titulo: 'Organizar e analisar',
          itens: [
            {
              id: 'erros-e-classes',
              titulo: 'Erros e classes',
              resumo: 'try/except, raise, classes e dataclasses.',
              minutos: 14,
              corpo: `
<h2>Tratar erros</h2>
<p>Quando algo dá errado, o Python <strong>levanta uma exceção</strong>. Com <code>try</code> e <code>except</code>, o programa decide o que fazer em vez de parar:</p>
${codigo(`for texto in ["42", "3,5", "abc"]:
    try:
        numero = float(texto.replace(",", "."))
        print(f"{texto!r} vira {numero}")
    except ValueError:
        print(f"{texto!r} não é um número")`)}
<p>Capture só o tipo de erro que você espera (<code>ValueError</code>, <code>KeyError</code>, <code>FileNotFoundError</code>...). Um <code>except:</code> sem tipo esconde bugs de verdade.</p>

<h2>Levantar seus próprios erros</h2>
${codigo(`def sacar(saldo, valor):
    if valor <= 0:
        raise ValueError("O valor precisa ser positivo")
    if valor > saldo:
        raise ValueError(f"Saldo insuficiente: faltam {valor - saldo:.2f}")
    return saldo - valor

try:
    sacar(100, 150)
except ValueError as erro:
    print("Não deu:", erro)`)}

<h2>Classes</h2>
<p>Uma classe junta dados e as funções que mexem neles (os <strong>métodos</strong>). O <code>__init__</code> monta o objeto, e <code>self</code> é o próprio objeto:</p>
${codigo(`class Conta:
    def __init__(self, titular, saldo=0):
        self.titular = titular
        self.saldo = saldo

    def depositar(self, valor):
        self.saldo += valor

    def __str__(self):
        return f"{self.titular}: R$ {self.saldo:.2f}"

conta = Conta("Ana")
conta.depositar(250)
print(conta)`)}

<h2>dataclass</h2>
<p>Para classes que são principalmente dados, o <code>@dataclass</code> escreve o <code>__init__</code>, a comparação e a exibição para você:</p>
${codigo(`from dataclasses import dataclass

@dataclass
class Produto:
    nome: str
    preco: float
    estoque: int = 0

cafe = Produto("Café", 62.9, 40)
print(cafe)
print(cafe == Produto("Café", 62.9, 40))`)}
`,
              quiz: [
                {
                  pergunta: 'Qual exceção float("abc") levanta?',
                  opcoes: ['TypeError', 'ValueError', 'KeyError'],
                  certa: 1,
                  explicacao: 'O tipo (texto) é aceito, mas o valor não pode virar número: ValueError.'
                },
                {
                  pergunta: 'O que é self num método?',
                  opcoes: ['A classe', 'O próprio objeto em que o método foi chamado', 'Uma palavra reservada sem uso'],
                  certa: 1,
                  explicacao: 'Em conta.depositar(10), self é conta.'
                },
                {
                  pergunta: 'Por que evitar except: sem tipo?',
                  opcoes: [
                    'É mais lento',
                    'Ele captura qualquer erro, inclusive bugs que deveriam aparecer',
                    'Não funciona em Python 3'
                  ],
                  certa: 1,
                  explicacao: 'Um erro de digitação num nome viraria silêncio. Capture o tipo que você espera.'
                }
              ]
            },
            {
              id: 'biblioteca-padrao',
              titulo: 'A biblioteca padrão',
              resumo: 'collections, datetime e statistics: pilhas incluídas.',
              minutos: 12,
              corpo: `
<p>Python vem com uma biblioteca padrão enorme ("pilhas incluídas"). Antes de escrever algo do zero, vale procurar se já existe.</p>

<h2>collections</h2>
${codigo(`from collections import Counter, defaultdict

palavras = "o café e o chá e o pão".split()
contagem = Counter(palavras)
print(contagem.most_common(2))

por_inicial = defaultdict(list)
for p in palavras:
    por_inicial[p[0]].append(p)
print(dict(por_inicial))`)}
<p><code>Counter</code> conta coisas; <code>defaultdict</code> cria o valor padrão sozinho quando a chave ainda não existe, sem precisar de <code>if chave not in d</code>.</p>

<h2>datetime</h2>
${codigo(`from datetime import date, datetime, timedelta

hoje = date(2026, 10, 28)
vencimento = hoje + timedelta(days=30)
print(vencimento.isoformat())
print(vencimento.strftime("%d/%m/%Y"))

lido = datetime.strptime("05/11/2026 14:30", "%d/%m/%Y %H:%M")
print(lido.year, lido.hour, (lido.date() - hoje).days, "dias")`)}
<p><code>strftime</code> formata uma data em texto; <code>strptime</code> faz o contrário, lendo o texto com o formato que você informa.</p>

<h2>statistics</h2>
${codigo(`import statistics as st

vendas = [120, 135, 98, 160, 410, 142, 130]
print("média:", round(st.mean(vendas), 1))
print("mediana:", st.median(vendas))
print("desvio padrão:", round(st.stdev(vendas), 1))`)}
${dica('Repare que a média (170,7) é puxada pelo 410, enquanto a mediana (135) mostra melhor o dia típico. Para dados com valores extremos, a mediana costuma contar uma história mais honesta.')}
<p>Para análises maiores, o mundo Python usa o <strong>pandas</strong> (tabelas) e o <strong>matplotlib</strong> (gráficos). Eles não vêm com a linguagem: instale com <code>pip install pandas matplotlib</code> num ambiente virtual (<code>python -m venv .venv</code>).</p>
`,
              quiz: [
                {
                  pergunta: 'Qual classe conta quantas vezes cada item aparece?',
                  opcoes: ['defaultdict', 'Counter', 'OrderedDict'],
                  certa: 1,
                  explicacao: 'Counter(lista) devolve a contagem, e most_common(n) os n mais frequentes.'
                },
                {
                  pergunta: 'Qual a diferença entre strftime e strptime?',
                  opcoes: [
                    'Nenhuma',
                    'strftime formata uma data em texto; strptime lê um texto como data',
                    'strptime é só para horas'
                  ],
                  certa: 1,
                  explicacao: 'f de format, p de parse (ler).'
                },
                {
                  pergunta: 'Com valores muito fora da curva, qual medida representa melhor o "típico"?',
                  opcoes: ['Média', 'Mediana', 'Máximo'],
                  certa: 1,
                  explicacao: 'A mediana é o valor do meio e não é puxada pelos extremos.'
                }
              ]
            },
            {
              id: 'desafio-estoque',
              tipo: 'desafio',
              titulo: 'Desafio: controle de estoque',
              resumo: 'Escreva uma classe com métodos, validação e exceções.',
              minutos: 25,
              enunciado: `
<p>Escreva a classe <code>Estoque</code>:</p>
<ul>
  <li><code>Estoque()</code> começa vazio.</li>
  <li><code>entrada(produto, quantidade)</code> soma a quantidade ao produto. Quantidade zero ou negativa levanta <code>ValueError</code>.</li>
  <li><code>saida(produto, quantidade)</code> tira do produto. Se não houver o suficiente, levanta <code>ValueError</code> e <strong>não muda nada</strong>.</li>
  <li><code>quantidade(produto)</code> devolve quanto há (0 para produto desconhecido).</li>
  <li><code>em_falta(minimo)</code> devolve a lista, em ordem alfabética, dos produtos com quantidade abaixo do mínimo.</li>
</ul>`,
              inicial: `class Estoque:
    def __init__(self):
        pass

    def entrada(self, produto, quantidade):
        pass

    def saida(self, produto, quantidade):
        pass

    def quantidade(self, produto):
        pass

    def em_falta(self, minimo):
        pass


e = Estoque()
e.entrada("café", 10)
print(e.quantidade("café"))
`,
              testes: [
                [
                  'entrada e quantidade funcionam (0 para produto desconhecido)',
                  async doc =>
                    doc.defaultView.__py.runPython(`
_e = Estoque()
_e.entrada("café", 10)
_e.entrada("café", 5)
_e.quantidade("café") == 15 and _e.quantidade("chá") == 0
`) === true
                ],
                [
                  'entrada com quantidade zero ou negativa levanta ValueError',
                  async doc =>
                    doc.defaultView.__py.runPython(`
def _levanta(f):
    try:
        f()
        return False
    except ValueError:
        return True
_e = Estoque()
_levanta(lambda: _e.entrada("café", 0)) and _levanta(lambda: _e.entrada("café", -3))
`) === true
                ],
                [
                  'saida tira do estoque e levanta ValueError sem mudar nada se faltar',
                  async doc =>
                    doc.defaultView.__py.runPython(`
_e = Estoque()
_e.entrada("filtro", 8)
_e.saida("filtro", 3)
try:
    _e.saida("filtro", 99)
    _ok = False
except ValueError:
    _ok = True
_ok and _e.quantidade("filtro") == 5
`) === true
                ],
                [
                  'em_falta devolve os produtos abaixo do mínimo, em ordem alfabética',
                  async doc =>
                    doc.defaultView.__py.runPython(`
_e = Estoque()
_e.entrada("moedor", 2)
_e.entrada("caneca", 30)
_e.entrada("balança", 1)
_e.em_falta(5) == ["balança", "moedor"]
`) === true
                ]
              ],
              solucao: `class Estoque:
    def __init__(self):
        self.itens = {}

    def entrada(self, produto, quantidade):
        if quantidade <= 0:
            raise ValueError("A quantidade precisa ser positiva")
        self.itens[produto] = self.itens.get(produto, 0) + quantidade

    def saida(self, produto, quantidade):
        if quantidade > self.quantidade(produto):
            raise ValueError(f"Não há {quantidade} de {produto}")
        self.itens[produto] -= quantidade

    def quantidade(self, produto):
        return self.itens.get(produto, 0)

    def em_falta(self, minimo):
        return sorted(p for p, q in self.itens.items() if q < minimo)


e = Estoque()
e.entrada("café", 10)
print(e.quantidade("café"))`
            }
          ]
        },
        {
          titulo: 'Funções poderosas e testes',
          itens: [
            {
              id: 'funcoes-avancadas',
              titulo: 'args, key, lambda e geradores',
              resumo: 'Funções flexíveis, ordenar por qualquer critério e processar sob demanda.',
              minutos: 13,
              corpo: `
<h2>*args e **kwargs</h2>
<p>Um <code>*</code> antes do parâmetro junta os argumentos extras numa tupla; <code>**</code> junta os argumentos com nome num dicionário:</p>
${codigo(`def somar(*numeros):
    return sum(numeros)

def etiqueta(nome, **detalhes):
    extras = ", ".join(f"{k}={v}" for k, v in detalhes.items())
    return f"{nome} ({extras})" if extras else nome

print(somar(1, 2, 3, 4))
print(etiqueta("Café", origem="MG", torra="média"))

valores = [10, 20, 30]
print(somar(*valores))           # * também "espalha" uma lista nos argumentos`)}

<h2>Ordenar e escolher com key</h2>
<p><code>sorted</code>, <code>max</code> e <code>min</code> aceitam <code>key</code>: uma função que diz <strong>o que comparar</strong>. Para funções curtas, <code>lambda</code> cria uma função numa linha:</p>
${codigo(`produtos = [
    {"nome": "Café", "preco": 62.9, "estoque": 40},
    {"nome": "Moedor", "preco": 149.0, "estoque": 8},
    {"nome": "Filtro", "preco": 9.9, "estoque": 120},
]

por_preco = sorted(produtos, key=lambda p: p["preco"], reverse=True)
print([p["nome"] for p in por_preco])

mais_estoque = max(produtos, key=lambda p: p["estoque"])
print(mais_estoque["nome"])

# Vários critérios: uma tupla. Primeiro pelo tamanho do nome, depois pelo nome
print(sorted(["Chá", "Café", "Mel", "Açúcar"], key=lambda n: (len(n), n)))

print(any(p["estoque"] == 0 for p in produtos), all(p["preco"] > 5 for p in produtos))`)}

<h2>zip e enumerate</h2>
${codigo(`meses = ["jan", "fev", "mar"]
vendas = [120, 135, 98]
for mes, valor in zip(meses, vendas):
    print(mes, valor)

print(dict(zip(meses, vendas)))`)}

<h2>Geradores</h2>
<p>Uma função com <code>yield</code> vira um <strong>gerador</strong>: em vez de montar uma lista inteira na memória, ela entrega um valor de cada vez, só quando pedem. Perfeito para arquivos enormes e sequências longas:</p>
${codigo(`def em_lotes(itens, tamanho):
    for i in range(0, len(itens), tamanho):
        yield itens[i:i + tamanho]

for lote in em_lotes(list(range(1, 11)), 4):
    print("enviando", lote)

quadrados = (n * n for n in range(1, 1_000_000))   # parênteses: um gerador, não uma lista
print(next(quadrados), next(quadrados), sum(n for n in range(5)))`)}
${dica('Uma expressão geradora (com parênteses) dentro de sum, any, max etc. não cria lista nenhuma: <code>sum(p["preco"] for p in produtos)</code> soma direto.')}
`,
              quiz: [
                {
                  pergunta: 'Em def f(*args), o que args é dentro da função?',
                  opcoes: ['Uma lista', 'Uma tupla com os argumentos extras', 'Um dicionário'],
                  certa: 1,
                  explicacao: '**kwargs é que vira dicionário.'
                },
                {
                  pergunta: 'Como ordenar produtos pelo preço, do mais caro?',
                  opcoes: [
                    'sorted(produtos, reverse=True)',
                    'sorted(produtos, key=lambda p: p["preco"], reverse=True)',
                    'produtos.sort("preco")'
                  ],
                  certa: 1,
                  explicacao: 'key diz o que comparar; reverse inverte a ordem.'
                },
                {
                  pergunta: 'Qual a vantagem de um gerador sobre uma lista?',
                  opcoes: [
                    'É mais curto',
                    'Produz um valor de cada vez, sem guardar tudo na memória',
                    'Pode ser ordenado'
                  ],
                  certa: 1,
                  explicacao: 'Ótimo para dados grandes ou infinitos.'
                }
              ]
            },
            {
              id: 'testes-e-qualidade',
              titulo: 'Testes e qualidade',
              resumo: 'assert, unittest, pytest, anotações de tipo e ambientes virtuais.',
              minutos: 12,
              corpo: `
<h2>assert</h2>
<p>O jeito mais simples de conferir algo: se a condição for falsa, o programa para com <code>AssertionError</code>.</p>
${codigo(`def desconto(preco, taxa):
    return round(preco * (1 - taxa), 2)

assert desconto(100, 0.1) == 90
assert desconto(59.9, 0) == 59.9
print("tudo certo")`)}

<h2>unittest</h2>
<p>A biblioteca padrão tem um sistema de testes completo. Cada método que começa com <code>test</code> é um teste, e o resultado diz quais passaram e por que os outros falharam:</p>
${codigo(`import unittest
import sys

def classificar(nota):
    if not 0 <= nota <= 10:
        raise ValueError("nota fora de 0 a 10")
    return "Aprovado" if nota >= 7 else "Recuperação" if nota >= 5 else "Reprovado"

class TestaClassificar(unittest.TestCase):
    def test_aprovado(self):
        self.assertEqual(classificar(7), "Aprovado")

    def test_recuperacao(self):
        self.assertEqual(classificar(5.5), "Recuperação")

    def test_nota_invalida(self):
        with self.assertRaises(ValueError):
            classificar(11)

    def test_quebrado_de_proposito(self):
        self.assertEqual(classificar(4), "Recuperação")

unittest.main(argv=["x"], exit=False, testRunner=unittest.TextTestRunner(stream=sys.stdout, verbosity=2))`)}
<p>O último teste falha de propósito: veja como a mensagem mostra o valor esperado e o recebido.</p>

<h2>pytest</h2>
<p>No dia a dia, a maioria dos projetos usa o <strong>pytest</strong> (<code>pip install pytest</code>), que aceita testes com <code>assert</code> simples, em arquivos <code>test_*.py</code>:</p>
${trecho(`# test_notas.py
import pytest
from notas import classificar

@pytest.mark.parametrize("nota, esperado", [(7, "Aprovado"), (5, "Recuperação"), (2, "Reprovado")])
def test_classificar(nota, esperado):
    assert classificar(nota) == esperado

# no terminal:  pytest -v`)}

<h2>Projeto organizado</h2>
<ul>
  <li><strong>Ambiente virtual</strong> por projeto: <code>python -m venv .venv</code> e ative (<code>.venv\\Scripts\\activate</code> no Windows). Os pacotes ficam isolados.</li>
  <li><code>pip freeze &gt; requirements.txt</code> lista as versões, e <code>pip install -r requirements.txt</code> instala igual em outra máquina.</li>
  <li><strong>Anotações de tipo</strong> (<code>def f(x: int) -&gt; str</code>) e o <strong>mypy</strong> acham erros antes de rodar.</li>
  <li>O <strong>ruff</strong> formata e aponta problemas comuns em milissegundos, como o Prettier e o ESLint fazem no JavaScript.</li>
</ul>
${dica('Escreva o teste do bug antes de corrigir: ele falha, você corrige, ele passa, e o bug nunca mais volta sem alguém perceber.')}
`,
              quiz: [
                {
                  pergunta: 'O que acontece quando um assert é falso?',
                  opcoes: ['Nada', 'O programa para com AssertionError', 'Imprime um aviso e continua'],
                  certa: 1,
                  explicacao: 'É a forma mais simples de garantir uma condição.'
                },
                {
                  pergunta: 'No unittest, como conferir que uma função lança ValueError?',
                  opcoes: [
                    'self.assertEqual(f(), ValueError)',
                    'with self.assertRaises(ValueError): f()',
                    'assert ValueError'
                  ],
                  certa: 1,
                  explicacao: 'O bloco with falha o teste se o erro não acontecer.'
                },
                {
                  pergunta: 'Para que serve um ambiente virtual (venv)?',
                  opcoes: ['Rodar Python na nuvem', 'Isolar os pacotes de cada projeto', 'Deixar o Python mais rápido'],
                  certa: 1,
                  explicacao: 'Cada projeto tem as suas versões, sem conflito com os outros.'
                }
              ]
            },
            {
              id: 'desafio-analise-de-vendas',
              tipo: 'desafio',
              titulo: 'Desafio: análise de vendas',
              resumo: 'Ordenar com key, agrupar, calcular médias e processar em lotes.',
              minutos: 25,
              enunciado: `
<p>Escreva quatro funções para analisar uma lista de vendas (dicionários):</p>
<ul>
  <li><code>top(vendas, n=3, chave="valor")</code>: as <code>n</code> vendas com maior <code>chave</code>, da maior para a menor.</li>
  <li><code>agrupar(itens, chave)</code>: um dicionário em que cada valor de <code>chave</code> leva à lista dos itens daquele grupo, na ordem original.</li>
  <li><code>media_por(itens, grupo, campo)</code>: um dicionário com a média de <code>campo</code> em cada grupo, arredondada com 2 casas.</li>
  <li><code>em_lotes(itens, tamanho)</code>: um <strong>gerador</strong> (use <code>yield</code>) que entrega listas de até <code>tamanho</code> itens.</li>
</ul>`,
              inicial: `VENDAS = [
    {"vendedor": "Ana", "valor": 188.7},
    {"vendedor": "Bruno", "valor": 149.0},
    {"vendedor": "Ana", "valor": 99.0},
    {"vendedor": "Carla", "valor": 138.0},
    {"vendedor": "Bruno", "valor": 125.8},
    {"vendedor": "Ana", "valor": 298.0},
]


def top(vendas, n=3, chave="valor"):
    pass


def agrupar(itens, chave):
    pass


def media_por(itens, grupo, campo):
    pass


def em_lotes(itens, tamanho):
    pass


print(top(VENDAS, 2))
`,
              testes: [
                [
                  'top devolve as n maiores, da maior para a menor',
                  async doc =>
                    doc.defaultView.__py.runPython(`
_v = [{"v": 3}, {"v": 9}, {"v": 1}, {"v": 7}]
[x["v"] for x in top(_v, 2, "v")] == [9, 7] and [x["valor"] for x in top(VENDAS)] == [298.0, 188.7, 149.0]
`) === true
                ],
                [
                  'agrupar mantém a ordem original dentro de cada grupo',
                  async doc =>
                    doc.defaultView.__py.runPython(`
_g = agrupar(VENDAS, "vendedor")
list(_g.keys()) == ["Ana", "Bruno", "Carla"] and [x["valor"] for x in _g["Ana"]] == [188.7, 99.0, 298.0]
`) === true
                ],
                [
                  'media_por calcula a média de cada grupo com 2 casas',
                  async doc =>
                    doc.defaultView.__py.runPython(
                      'media_por(VENDAS, "vendedor", "valor") == {"Ana": 195.23, "Bruno": 137.4, "Carla": 138.0}'
                    ) === true
                ],
                [
                  'em_lotes é um gerador que entrega listas do tamanho pedido',
                  async doc =>
                    doc.defaultView.__py.runPython(`
import types
_l = em_lotes(list(range(7)), 3)
isinstance(_l, types.GeneratorType) and list(_l) == [[0, 1, 2], [3, 4, 5], [6]]
`) === true
                ]
              ],
              solucao: `VENDAS = [
    {"vendedor": "Ana", "valor": 188.7},
    {"vendedor": "Bruno", "valor": 149.0},
    {"vendedor": "Ana", "valor": 99.0},
    {"vendedor": "Carla", "valor": 138.0},
    {"vendedor": "Bruno", "valor": 125.8},
    {"vendedor": "Ana", "valor": 298.0},
]


def top(vendas, n=3, chave="valor"):
    return sorted(vendas, key=lambda v: v[chave], reverse=True)[:n]


def agrupar(itens, chave):
    grupos = {}
    for item in itens:
        grupos.setdefault(item[chave], []).append(item)
    return grupos


def media_por(itens, grupo, campo):
    return {
        nome: round(sum(i[campo] for i in lista) / len(lista), 2)
        for nome, lista in agrupar(itens, grupo).items()
    }


def em_lotes(itens, tamanho):
    for inicio in range(0, len(itens), tamanho):
        yield itens[inicio:inicio + tamanho]


print(top(VENDAS, 2))
print(media_por(VENDAS, "vendedor", "valor"))`
            }
          ]
        }
      ]
    }
  ]
};
