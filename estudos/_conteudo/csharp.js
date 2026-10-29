// Trilha de C#. Sem editor: os programas são para rodar no computador com o SDK do .NET (dotnet run) ou no
// VS Code com a extensão C# Dev Kit. As práticas trazem a resposta escondida para conferir.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'csharp',
  area: 'Back-end e dados',
  titulo: 'C# e .NET',
  sigla: 'C#',
  resumo: 'A linguagem dos sistemas de empresa: tipos, classes, LINQ, APIs com ASP.NET e banco com Entity Framework.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Instalar o .NET, variáveis, tipos, decisões e repetições.',
      modulos: [
        {
          titulo: 'Primeiros programas',
          itens: [
            {
              id: 'primeiro-programa',
              titulo: 'O primeiro programa',
              resumo: 'SDK do .NET, dotnet new, Console e a estrutura de um projeto.',
              minutos: 9,
              corpo: `
<p><strong>C#</strong> (lê-se "C sharp") é a linguagem principal da plataforma <strong>.NET</strong>, da Microsoft. É muito usada em sistemas de gestão, bancos, APIs, aplicativos para Windows e até jogos (a Unity usa C#). É <strong>tipada</strong>: cada variável tem um tipo conhecido antes de rodar, e o compilador avisa os erros antes de o programa chegar ao usuário.</p>

<h2>Instalar e criar um projeto</h2>
<p>Baixe o <strong>SDK do .NET</strong> (versão LTS) em dot.net e confira no terminal:</p>
${trecho(`dotnet --version
dotnet new console -o Ola     # cria a pasta Ola com um projeto de console
cd Ola
dotnet run                    # compila e roda`)}
<p>O projeto tem um <code>Ola.csproj</code> (configuração) e um <code>Program.cs</code>. Desde o .NET 6, o arquivo pode ter só as instruções, sem a classe em volta (são as <strong>instruções de nível superior</strong>):</p>
${trecho(`// Program.cs
Console.WriteLine("Olá, mundo!");

Console.Write("Seu nome: ");
string? nome = Console.ReadLine();
Console.WriteLine($"Prazer, {nome}!");`)}
<p>O <code>$</code> antes das aspas faz a <strong>interpolação</strong>: o que está entre chaves é trocado pelo valor. Toda instrução termina com <code>;</code>.</p>
${dica('No VS Code, instale a extensão <strong>C# Dev Kit</strong>: ela completa o código, mostra os erros enquanto você digita e roda o projeto com F5.')}

<h2>Compilado, não interpretado</h2>
<p>O <code>dotnet run</code> primeiro <strong>compila</strong> o código para uma linguagem intermediária e só depois executa. Se houver um erro de tipo (somar texto com número de um jeito que não faz sentido, chamar um método que não existe), o programa nem chega a rodar: o erro aparece com o arquivo e a linha.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual comando cria um projeto de console novo?',
                  opcoes: ['dotnet new console -o Nome', 'dotnet run console', 'csharp init'],
                  certa: 0,
                  explicacao: 'dotnet new cria a partir de um modelo; dotnet run compila e executa.'
                },
                {
                  pergunta: 'O que faz o $ em $"Olá, {nome}"?',
                  opcoes: [
                    'Marca a variável como dinheiro',
                    'Interpola: troca {nome} pelo valor',
                    'Deixa o texto em maiúsculas'
                  ],
                  certa: 1,
                  explicacao: 'É a interpolação de strings.'
                },
                {
                  pergunta: 'Quando um erro de tipo aparece em C#?',
                  opcoes: ['Só quando o usuário clica', 'Na compilação, antes de rodar', 'Nunca, C# aceita tudo'],
                  certa: 1,
                  explicacao: 'O compilador confere os tipos antes de gerar o programa.'
                }
              ]
            },
            {
              id: 'tipos-e-controle',
              titulo: 'Tipos, if, switch e laços',
              resumo: 'int, decimal, string, bool, var, conversões e repetições.',
              minutos: 12,
              corpo: `
<h2>Os tipos do dia a dia</h2>
${trecho(`int quantidade = 3;            // inteiro
decimal preco = 19.90m;         // dinheiro: use decimal (o m no fim é obrigatório)
double distancia = 12.5;        // números científicos, medidas
bool pago = false;
string cliente = "Ana";
DateTime hoje = DateTime.Today;

var total = quantidade * preco; // var: o compilador deduz o tipo (aqui, decimal)`)}
<p>Para dinheiro, use sempre <code>decimal</code>: ele guarda os centavos exatos. O <code>double</code> é rápido, mas <code>0.1 + 0.2</code> dá <code>0.30000000000000004</code>.</p>

<h2>Converter texto em número</h2>
${trecho(`Console.Write("Idade: ");
if (int.TryParse(Console.ReadLine(), out int idade))
    Console.WriteLine($"Ano que vem você terá {idade + 1}");
else
    Console.WriteLine("Isso não é um número.");`)}
<p><code>int.Parse</code> quebra o programa se o texto não for número; <code>TryParse</code> devolve <code>true</code> ou <code>false</code> e coloca o resultado no <code>out</code>.</p>

<h2>Decisões</h2>
${trecho(`if (total > 100) Console.WriteLine("Frete grátis");
else if (total > 50) Console.WriteLine("Frete com desconto");
else Console.WriteLine("Frete normal");

// Expressão switch: devolve um valor
string faixa = idade switch
{
    < 12 => "criança",
    < 18 => "adolescente",
    >= 60 => "idoso",
    _ => "adulto"
};`)}

<h2>Repetições</h2>
${trecho(`for (int i = 1; i <= 10; i++)
    Console.WriteLine($"7 x {i} = {7 * i}");

string[] frutas = { "maçã", "banana", "uva" };
foreach (string fruta in frutas)
    Console.WriteLine(fruta.ToUpper());

int tentativas = 0;
while (tentativas < 3) tentativas++;`)}
`,
              quiz: [
                {
                  pergunta: 'Qual tipo usar para valores em reais?',
                  opcoes: ['double', 'decimal', 'int'],
                  certa: 1,
                  explicacao: 'decimal guarda frações decimais exatas, sem os erros de arredondamento do double.'
                },
                {
                  pergunta: 'Qual a vantagem do int.TryParse sobre o int.Parse?',
                  opcoes: ['É mais rápido', 'Não quebra o programa quando o texto não é número', 'Aceita letras'],
                  certa: 1,
                  explicacao: 'Ele devolve false em vez de lançar uma exceção.'
                },
                {
                  pergunta: 'O que significa o _ numa expressão switch?',
                  opcoes: ['Qualquer outro caso', 'Erro', 'Valor vazio'],
                  certa: 0,
                  explicacao: 'É o descarte: pega tudo o que não casou antes.'
                }
              ]
            },
            {
              id: 'pratica-caixa',
              titulo: 'Prática: caixa de uma lojinha',
              resumo: 'Um programa de console que soma itens e calcula troco.',
              minutos: 20,
              corpo: `
<p>Crie um projeto com <code>dotnet new console -o Caixa</code> e escreva o programa no <code>Program.cs</code>.</p>
<h2>Tarefas</h2>
<ol>
  <li>Peça o preço de cada item, um por linha, até o usuário digitar uma linha vazia.</li>
  <li>Ignore (com aviso) o que não for número.</li>
  <li>Mostre a quantidade de itens e o total em reais (formato <code>R$ 12,50</code>).</li>
  <li>Se o total passar de R$ 100, aplique 10% de desconto.</li>
  <li>Peça o valor pago e mostre o troco, ou quanto falta.</li>
</ol>
${resposta(`
${trecho(`using System.Globalization;

var br = new CultureInfo("pt-BR");
decimal total = 0;
int itens = 0;

while (true)
{
    Console.Write("Preço (Enter para fechar): ");
    string? linha = Console.ReadLine();
    if (string.IsNullOrWhiteSpace(linha)) break;

    if (decimal.TryParse(linha, NumberStyles.Number, br, out decimal preco))
    {
        total += preco;
        itens++;
    }
    else
    {
        Console.WriteLine("Valor inválido, ignorado.");
    }
}

if (total > 100) total *= 0.9m;
Console.WriteLine($"{itens} itens, total {total.ToString("C", br)}");

Console.Write("Valor pago: ");
decimal.TryParse(Console.ReadLine(), NumberStyles.Number, br, out decimal pago);
decimal troco = pago - total;
Console.WriteLine(troco >= 0
    ? $"Troco: {troco.ToString("C", br)}"
    : $"Faltam {(-troco).ToString("C", br)}");`)}
<p>A <code>CultureInfo("pt-BR")</code> faz o programa aceitar vírgula como separador decimal e formatar com <code>"C"</code> (moeda) no padrão brasileiro, independente do idioma do Windows.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o CultureInfo("pt-BR") na prática?',
                  opcoes: [
                    'Traduzir as mensagens',
                    'Ler e formatar números no padrão brasileiro (vírgula, R$)',
                    'Deixar o programa mais rápido'
                  ],
                  certa: 1,
                  explicacao: 'A cultura define separadores, moeda e formato de datas.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Classes, coleções, LINQ e tratamento de erros.',
      modulos: [
        {
          titulo: 'Orientação a objetos e coleções',
          itens: [
            {
              id: 'classes-e-records',
              titulo: 'Classes, propriedades e records',
              resumo: 'Modelar dados com classes, construtores, métodos, interfaces e records.',
              minutos: 13,
              corpo: `
<p>Em C#, quase tudo vive dentro de uma <strong>classe</strong>: um molde que junta dados (propriedades) e comportamento (métodos).</p>
${trecho(`public class Conta
{
    public string Titular { get; }
    public decimal Saldo { get; private set; }   // só a própria classe altera

    public Conta(string titular) => Titular = titular;

    public void Depositar(decimal valor)
    {
        if (valor <= 0) throw new ArgumentException("Valor precisa ser positivo");
        Saldo += valor;
    }

    public bool Sacar(decimal valor)
    {
        if (valor > Saldo) return false;
        Saldo -= valor;
        return true;
    }
}

var conta = new Conta("Ana");
conta.Depositar(200);
conta.Sacar(50);
Console.WriteLine(conta.Saldo); // 150`)}
<p>O <code>private set</code> é o <strong>encapsulamento</strong>: de fora, dá para ler o saldo, mas não trocar por qualquer valor. Só os métodos, que conferem as regras, mexem nele.</p>

<h2>Records: dados imutáveis</h2>
${trecho(`public record Produto(string Nome, decimal Preco, string Categoria);

var p = new Produto("Café", 18.5m, "Mercearia");
var promo = p with { Preco = 15m };   // cópia com um campo diferente
Console.WriteLine(p == new Produto("Café", 18.5m, "Mercearia")); // True: compara pelo conteúdo`)}
<p>Um <code>record</code> cria numa linha um tipo com construtor, propriedades só de leitura, comparação por valor e um <code>ToString</code> legível. Ótimo para dados que vêm de um banco ou de uma API.</p>

<h2>Interfaces</h2>
${trecho(`public interface IFrete { decimal Calcular(decimal peso); }

public class Correios : IFrete { public decimal Calcular(decimal peso) => 15 + peso * 2; }
public class Retirada : IFrete { public decimal Calcular(decimal peso) => 0; }

IFrete frete = new Correios();
Console.WriteLine(frete.Calcular(3)); // 21`)}
<p>Uma <strong>interface</strong> é um contrato: quem a implementa promete ter aqueles métodos. O código que usa <code>IFrete</code> não precisa saber qual frete é: dá para trocar sem mexer nele.</p>
`,
              quiz: [
                {
                  pergunta: 'O que garante o private set na propriedade Saldo?',
                  opcoes: [
                    'Que ninguém lê o saldo',
                    'Que só a própria classe altera o saldo',
                    'Que o saldo nunca é negativo'
                  ],
                  certa: 1,
                  explicacao: 'Leitura pública, escrita só por dentro: é o encapsulamento.'
                },
                {
                  pergunta: 'Dois records com os mesmos valores, comparados com ==, dão...',
                  opcoes: ['True', 'False', 'Erro de compilação'],
                  certa: 0,
                  explicacao: 'Records comparam pelo conteúdo, não pela posição na memória.'
                },
                {
                  pergunta: 'Para que serve uma interface?',
                  opcoes: [
                    'Desenhar a tela',
                    'Definir um contrato que várias classes podem cumprir',
                    'Guardar dados no banco'
                  ],
                  certa: 1,
                  explicacao: 'Quem usa a interface não depende de uma implementação específica.'
                }
              ]
            },
            {
              id: 'colecoes-e-linq',
              titulo: 'Listas, dicionários e LINQ',
              resumo: 'List, Dictionary e consultas com Where, Select, GroupBy e OrderBy.',
              minutos: 13,
              corpo: `
${trecho(`var produtos = new List<Produto>
{
    new("Café", 18.5m, "Mercearia"),
    new("Arroz", 27.9m, "Mercearia"),
    new("Detergente", 3.2m, "Limpeza"),
    new("Sabão em pó", 22m, "Limpeza")
};

var estoque = new Dictionary<string, int> { ["Café"] = 12, ["Arroz"] = 0 };
estoque["Detergente"] = 40;
if (estoque.TryGetValue("Arroz", out int qtd) && qtd == 0) Console.WriteLine("Arroz em falta");`)}
<p><code>List&lt;T&gt;</code> é uma lista que cresce; <code>Dictionary&lt;Chave, Valor&gt;</code> acha um valor pela chave na hora, sem percorrer tudo.</p>

<h2>LINQ</h2>
<p><strong>LINQ</strong> são consultas sobre coleções, parecidas com SQL, escritas em C#:</p>
${trecho(`var caros = produtos
    .Where(p => p.Preco > 20)
    .OrderByDescending(p => p.Preco)
    .Select(p => p.Nome)
    .ToList();                       // ["Arroz", "Sabão em pó"]

var porCategoria = produtos
    .GroupBy(p => p.Categoria)
    .Select(g => new { Categoria = g.Key, Itens = g.Count(), Total = g.Sum(p => p.Preco) });

foreach (var linha in porCategoria)
    Console.WriteLine($"{linha.Categoria}: {linha.Itens} itens, R$ {linha.Total}");

decimal media = produtos.Average(p => p.Preco);
bool temBarato = produtos.Any(p => p.Preco < 5);
Produto? cafe = produtos.FirstOrDefault(p => p.Nome == "Café");`)}
<p>O <code>p =&gt; p.Preco &gt; 20</code> é uma <strong>lambda</strong>: uma função curta, "dado p, devolva p.Preco &gt; 20". O LINQ é preguiçoso: a consulta só roda quando você percorre o resultado ou chama <code>ToList</code>, <code>Count</code>, <code>Sum</code>...</p>

<h2>Exceções</h2>
${trecho(`try
{
    var texto = File.ReadAllText("dados.csv");
}
catch (FileNotFoundException)
{
    Console.WriteLine("Arquivo não encontrado.");
}
finally
{
    Console.WriteLine("Sempre roda.");
}`)}
${dica('Capture só as exceções que você sabe tratar. Um <code>catch (Exception)</code> genérico que só ignora o erro esconde bugs.')}
`,
              quiz: [
                {
                  pergunta: 'Quando uma consulta LINQ roda de fato?',
                  opcoes: [
                    'Na linha do Where',
                    'Quando o resultado é percorrido ou materializado (ToList, Count...)',
                    'Na compilação'
                  ],
                  certa: 1,
                  explicacao: 'É a execução adiada (deferred execution).'
                },
                {
                  pergunta: 'Qual coleção acha um valor pela chave sem percorrer tudo?',
                  opcoes: ['List', 'Array', 'Dictionary'],
                  certa: 2,
                  explicacao: 'O Dictionary usa uma tabela de hash.'
                },
                {
                  pergunta: 'O que faz FirstOrDefault quando nada combina?',
                  opcoes: [
                    'Lança exceção',
                    'Devolve o valor padrão (null para objetos)',
                    'Devolve o primeiro da lista'
                  ],
                  certa: 1,
                  explicacao: 'O First sem Default é que lança exceção.'
                }
              ]
            },
            {
              id: 'pratica-relatorio-vendas',
              titulo: 'Prática: relatório de vendas de um CSV',
              resumo: 'Ler um arquivo, transformar em records e resumir com LINQ.',
              minutos: 25,
              corpo: `
<p>Salve na pasta do projeto um <code>vendas.csv</code>:</p>
${trecho(`data;vendedor;produto;valor
2026-10-01;Ana;Café;18,50
2026-10-01;Bruno;Arroz;27,90
2026-10-02;Ana;Arroz;27,90
2026-10-03;Carla;Detergente;3,20
2026-10-03;Ana;Café;18,50
2026-10-04;Bruno;Sabão em pó;22,00`)}
<h2>Tarefas</h2>
<ol>
  <li>Crie um <code>record Venda(DateOnly Data, string Vendedor, string Produto, decimal Valor)</code>.</li>
  <li>Leia o arquivo, pule o cabeçalho e transforme cada linha numa <code>Venda</code>.</li>
  <li>Mostre o total vendido por vendedor, do maior para o menor.</li>
  <li>Mostre o produto mais vendido em quantidade.</li>
  <li>Mostre o dia com maior faturamento.</li>
</ol>
${resposta(`
${trecho(`using System.Globalization;

var br = new CultureInfo("pt-BR");
var vendas = File.ReadAllLines("vendas.csv")
    .Skip(1)
    .Select(l => l.Split(';'))
    .Select(c => new Venda(DateOnly.Parse(c[0], CultureInfo.InvariantCulture), c[1], c[2], decimal.Parse(c[3], br)))
    .ToList();

foreach (var g in vendas.GroupBy(v => v.Vendedor).OrderByDescending(g => g.Sum(v => v.Valor)))
    Console.WriteLine($"{g.Key}: {g.Sum(v => v.Valor).ToString("C", br)}");

var maisVendido = vendas.GroupBy(v => v.Produto).MaxBy(g => g.Count())!;
Console.WriteLine($"Mais vendido: {maisVendido.Key} ({maisVendido.Count()}x)");

var melhorDia = vendas.GroupBy(v => v.Data).MaxBy(g => g.Sum(v => v.Valor))!;
Console.WriteLine($"Melhor dia: {melhorDia.Key:dd/MM} ({melhorDia.Sum(v => v.Valor).ToString("C", br)})");

record Venda(DateOnly Data, string Vendedor, string Produto, decimal Valor);`)}
<p>Com instruções de nível superior, as declarações de tipos (o <code>record</code>) ficam no fim do arquivo. <code>MaxBy</code> devolve o elemento com o maior valor, não o valor em si. O <code>!</code> diz ao compilador que o resultado não será nulo.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que MaxBy(g => g.Count()) devolve?',
                  opcoes: ['O maior número de vendas', 'O grupo com mais vendas', 'Uma lista ordenada'],
                  certa: 1,
                  explicacao: 'MaxBy devolve o elemento; Max devolveria o número.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'async/await, APIs com ASP.NET Core, Entity Framework e testes.',
      modulos: [
        {
          titulo: 'Web e banco',
          itens: [
            {
              id: 'async-e-api',
              titulo: 'async/await e uma API mínima',
              resumo: 'Tarefas assíncronas, HttpClient e endpoints com ASP.NET Core.',
              minutos: 14,
              corpo: `
<h2>async e await</h2>
<p>Operações lentas (internet, disco, banco) devolvem uma <code>Task</code>. Com <code>await</code>, o programa espera o resultado sem travar a thread:</p>
${trecho(`using System.Net.Http.Json;

var http = new HttpClient();
var cep = await http.GetFromJsonAsync<Cep>("https://viacep.com.br/ws/01001000/json/");
Console.WriteLine($"{cep!.Logradouro}, {cep.Localidade}");

record Cep(string Logradouro, string Localidade, string Uf);`)}
<p>Um método que usa <code>await</code> é marcado com <code>async</code> e devolve <code>Task</code> (ou <code>Task&lt;T&gt;</code>). Para rodar várias ao mesmo tempo: <code>await Task.WhenAll(tarefa1, tarefa2)</code>.</p>
${dica('Crie um <code>HttpClient</code> e reaproveite. Criar um novo a cada requisição esgota as conexões do sistema em programas que rodam muito tempo.')}

<h2>Uma API em poucas linhas</h2>
${trecho(`dotnet new web -o LojaApi
cd LojaApi
dotnet run`)}
${trecho(`// Program.cs
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var produtos = new List<Produto> { new(1, "Café", 18.5m) };

app.MapGet("/produtos", () => produtos);
app.MapGet("/produtos/{id:int}", (int id) =>
    produtos.FirstOrDefault(p => p.Id == id) is { } p ? Results.Ok(p) : Results.NotFound());
app.MapPost("/produtos", (Produto novo) =>
{
    produtos.Add(novo);
    return Results.Created($"/produtos/{novo.Id}", novo);
});

app.Run();

record Produto(int Id, string Nome, decimal Preco);`)}
<p>São as <strong>Minimal APIs</strong> do ASP.NET Core: cada <code>Map...</code> liga um método HTTP e um caminho a uma função. O JSON é lido e escrito sozinho a partir dos records.</p>
`,
              quiz: [
                {
                  pergunta: 'O que o await faz?',
                  opcoes: [
                    'Trava o programa até terminar',
                    'Espera a Task terminar sem bloquear a thread',
                    'Roda o código em outro computador'
                  ],
                  certa: 1,
                  explicacao: 'A thread fica livre para outras coisas enquanto a operação está pendente.'
                },
                {
                  pergunta: 'Qual o tipo de retorno de um método async que devolve um int?',
                  opcoes: ['int', 'Task<int>', 'async int'],
                  certa: 1,
                  explicacao: 'Quem chama faz await para obter o int.'
                },
                {
                  pergunta: 'O que faz app.MapGet("/produtos", ...)?',
                  opcoes: ['Cria uma tabela', 'Responde requisições GET em /produtos', 'Baixa produtos da internet'],
                  certa: 1,
                  explicacao: 'Liga a rota e o método HTTP à função.'
                }
              ]
            },
            {
              id: 'ef-core-e-testes',
              titulo: 'Entity Framework Core e testes',
              resumo: 'Banco de dados com classes, migrations, injeção de dependência e xUnit.',
              minutos: 14,
              corpo: `
<p>O <strong>Entity Framework Core</strong> é o ORM do .NET: você escreve classes e consultas LINQ, e ele gera o SQL.</p>
${trecho(`dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet tool install --global dotnet-ef`)}
${trecho(`using Microsoft.EntityFrameworkCore;

public class Produto
{
    public int Id { get; set; }
    public string Nome { get; set; } = "";
    public decimal Preco { get; set; }
}

public class LojaDb(DbContextOptions<LojaDb> options) : DbContext(options)
{
    public DbSet<Produto> Produtos => Set<Produto>();
}

// Program.cs
builder.Services.AddDbContext<LojaDb>(o => o.UseSqlite("Data Source=loja.db"));

app.MapGet("/produtos", async (LojaDb db) =>
    await db.Produtos.Where(p => p.Preco < 50).OrderBy(p => p.Nome).ToListAsync());

app.MapPost("/produtos", async (Produto p, LojaDb db) =>
{
    db.Produtos.Add(p);
    await db.SaveChangesAsync();
    return Results.Created($"/produtos/{p.Id}", p);
});`)}
${trecho(`dotnet ef migrations add Inicial   # gera o script de criação das tabelas
dotnet ef database update          # aplica no banco`)}
<p>O <code>LojaDb</code> não é criado com <code>new</code>: ele é registrado em <code>builder.Services</code> e o ASP.NET o <strong>injeta</strong> como parâmetro onde for pedido. É a <strong>injeção de dependência</strong>, que também facilita trocar o banco nos testes.</p>

<h2>Testes com xUnit</h2>
${trecho(`dotnet new xunit -o Loja.Testes
dotnet add Loja.Testes reference Loja
dotnet test`)}
${trecho(`public class ContaTestes
{
    [Fact]
    public void Sacar_mais_que_o_saldo_falha()
    {
        var conta = new Conta("Ana");
        conta.Depositar(100);

        Assert.False(conta.Sacar(150));
        Assert.Equal(100, conta.Saldo);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-10)]
    public void Deposito_invalido_lanca_erro(decimal valor) =>
        Assert.Throws<ArgumentException>(() => new Conta("Ana").Depositar(valor));
}`)}
`,
              quiz: [
                {
                  pergunta: 'O que o Entity Framework faz com uma consulta LINQ em db.Produtos?',
                  opcoes: [
                    'Baixa a tabela inteira e filtra em memória',
                    'Traduz para SQL e roda no banco',
                    'Nada, LINQ não funciona com banco'
                  ],
                  certa: 1,
                  explicacao: 'O Where e o OrderBy viram WHERE e ORDER BY.'
                },
                {
                  pergunta: 'Para que servem as migrations?',
                  opcoes: [
                    'Mover o banco de servidor',
                    'Versionar as mudanças na estrutura das tabelas',
                    'Fazer backup'
                  ],
                  certa: 1,
                  explicacao: 'Cada migration é um passo da evolução do esquema.'
                },
                {
                  pergunta: 'Qual a diferença entre [Fact] e [Theory] no xUnit?',
                  opcoes: ['Nenhuma', '[Theory] roda o mesmo teste com vários dados', '[Fact] é só para números'],
                  certa: 1,
                  explicacao: 'Cada [InlineData] é uma execução do teste.'
                }
              ]
            },
            {
              id: 'pratica-api-tarefas',
              titulo: 'Prática: API de tarefas com banco',
              resumo: 'CRUD completo com Minimal API, EF Core e SQLite.',
              minutos: 35,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie um projeto <code>dotnet new web -o Tarefas</code> com EF Core e SQLite.</li>
  <li>Modele <code>Tarefa</code> com <code>Id</code>, <code>Titulo</code>, <code>Feita</code> (bool) e <code>CriadaEm</code>.</li>
  <li>Crie as rotas: listar (com filtro opcional <code>?feitas=true</code>), buscar por id, criar, marcar como feita e apagar.</li>
  <li>Recuse títulos vazios com <code>400 Bad Request</code>.</li>
  <li>Teste com o arquivo <code>.http</code> do VS Code ou com <code>curl</code>.</li>
</ol>
${resposta(`
${trecho(`using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TarefasDb>(o => o.UseSqlite("Data Source=tarefas.db"));
var app = builder.Build();

using (var escopo = app.Services.CreateScope())
    escopo.ServiceProvider.GetRequiredService<TarefasDb>().Database.EnsureCreated();

var rotas = app.MapGroup("/tarefas");

rotas.MapGet("/", async (bool? feitas, TarefasDb db) =>
{
    var consulta = db.Tarefas.AsQueryable();
    if (feitas is not null) consulta = consulta.Where(t => t.Feita == feitas);
    return await consulta.OrderBy(t => t.CriadaEm).ToListAsync();
});

rotas.MapGet("/{id:int}", async (int id, TarefasDb db) =>
    await db.Tarefas.FindAsync(id) is { } t ? Results.Ok(t) : Results.NotFound());

rotas.MapPost("/", async (Tarefa t, TarefasDb db) =>
{
    if (string.IsNullOrWhiteSpace(t.Titulo)) return Results.BadRequest("Título obrigatório");
    t.CriadaEm = DateTime.UtcNow;
    db.Tarefas.Add(t);
    await db.SaveChangesAsync();
    return Results.Created($"/tarefas/{t.Id}", t);
});

rotas.MapPut("/{id:int}/feita", async (int id, TarefasDb db) =>
{
    var t = await db.Tarefas.FindAsync(id);
    if (t is null) return Results.NotFound();
    t.Feita = true;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

rotas.MapDelete("/{id:int}", async (int id, TarefasDb db) =>
    await db.Tarefas.Where(t => t.Id == id).ExecuteDeleteAsync() > 0 ? Results.NoContent() : Results.NotFound());

app.Run();

public class Tarefa
{
    public int Id { get; set; }
    public string Titulo { get; set; } = "";
    public bool Feita { get; set; }
    public DateTime CriadaEm { get; set; }
}

public class TarefasDb(DbContextOptions<TarefasDb> o) : DbContext(o)
{
    public DbSet<Tarefa> Tarefas => Set<Tarefa>();
}`)}
<p><code>EnsureCreated</code> cria o banco sem migrations, bom para protótipos; em produção, prefira migrations. <code>MapGroup</code> evita repetir o prefixo. <code>ExecuteDeleteAsync</code> apaga direto no banco, sem carregar a tarefa antes.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Que status HTTP devolver ao criar um recurso com sucesso?',
                  opcoes: ['200 OK', '201 Created', '204 No Content'],
                  certa: 1,
                  explicacao: 'Results.Created devolve 201 com o endereço do recurso novo.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
