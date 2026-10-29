// Trilha de Java. Sem editor: os programas são para rodar no computador com o JDK (java Arquivo.java) ou no
// IntelliJ IDEA / VS Code. As práticas trazem a resposta escondida para conferir.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'java',
  area: 'Back-end e dados',
  titulo: 'Java',
  sigla: 'Jv',
  resumo: 'A linguagem de bancos e grandes empresas: orientação a objetos, coleções, streams e Spring Boot.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'JDK, tipos, decisões, laços e métodos.',
      modulos: [
        {
          titulo: 'Primeiros programas',
          itens: [
            {
              id: 'primeiro-programa',
              titulo: 'O primeiro programa',
              resumo: 'Instalar o JDK, a classe com main, compilar e rodar.',
              minutos: 9,
              corpo: `
<p><strong>Java</strong> é uma das linguagens mais usadas em empresas: bancos, seguradoras, governo, comércio eletrônico e o Android foram construídos sobre ela. O código compila para <strong>bytecode</strong>, que roda na <strong>JVM</strong> (máquina virtual Java) de qualquer sistema: "escreva uma vez, rode em qualquer lugar".</p>

<h2>Instalar</h2>
<p>Instale um <strong>JDK</strong> LTS (21 ou mais novo), por exemplo o Temurin, em adoptium.net. Para escrever, o <strong>IntelliJ IDEA Community</strong> é o editor mais usado; o VS Code com o "Extension Pack for Java" também funciona.</p>
${trecho(`java -version
javac -version`)}

<h2>Olá, mundo</h2>
${trecho(`// Ola.java (o nome do arquivo precisa ser igual ao da classe pública)
public class Ola {
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
        String nome = args.length > 0 ? args[0] : "visitante";
        System.out.printf("Bem-vindo, %s!%n", nome);
    }
}`)}
${trecho(`javac Ola.java      # compila: gera Ola.class
java Ola Ana        # roda
java Ola.java Ana   # desde o Java 11: compila e roda num passo só`)}
<ul>
  <li>Todo código Java vive dentro de uma <strong>classe</strong>.</li>
  <li>O programa começa no método <code>public static void main(String[] args)</code>.</li>
  <li>Instruções terminam com <code>;</code> e blocos ficam entre <code>{ }</code>.</li>
  <li><code>printf</code> formata: <code>%s</code> texto, <code>%d</code> inteiro, <code>%.2f</code> decimal com 2 casas, <code>%n</code> quebra de linha.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Onde um programa Java começa a rodar?',
                  opcoes: ['Na primeira linha do arquivo', 'No método main', 'Na classe Program'],
                  certa: 1,
                  explicacao: 'public static void main(String[] args) é o ponto de entrada.'
                },
                {
                  pergunta: 'O que o javac gera?',
                  opcoes: ['Um .exe', 'Bytecode (.class) que roda na JVM', 'Código JavaScript'],
                  certa: 1,
                  explicacao: 'A JVM executa o bytecode em qualquer sistema.'
                },
                {
                  pergunta: 'Qual regra vale para o nome do arquivo?',
                  opcoes: ['Qualquer nome', 'Igual ao da classe pública que ele contém', 'Sempre Main.java'],
                  certa: 1,
                  explicacao: 'public class Ola precisa estar em Ola.java.'
                }
              ]
            },
            {
              id: 'tipos-e-controle',
              titulo: 'Tipos, decisões e métodos',
              resumo: 'Tipos primitivos, String, var, if, switch, laços, Scanner e métodos.',
              minutos: 13,
              corpo: `
<h2>Tipos</h2>
${trecho(`int quantidade = 3;
long populacao = 215_000_000L;
double preco = 19.90;
boolean pago = false;
char letra = 'A';
String cliente = "Ana";          // String é uma classe, com S maiúsculo
var total = quantidade * preco;  // var deduz o tipo (aqui, double)

var valor = new java.math.BigDecimal("19.90");   // para dinheiro com precisão exata`)}
${dica('Strings se comparam com <code>.equals</code>, não com <code>==</code>: <code>nome.equals("Ana")</code>. O <code>==</code> compara se são o mesmo objeto na memória, e pode dar <code>false</code> para textos iguais.')}

<h2>Ler do teclado</h2>
${trecho(`import java.util.Scanner;

Scanner entrada = new Scanner(System.in);
System.out.print("Idade: ");
int idade = entrada.nextInt();`)}

<h2>Decisões e laços</h2>
${trecho(`if (idade >= 18) {
    System.out.println("Maior de idade");
} else {
    System.out.println("Menor de idade");
}

String dia = "sab";
String tipo = switch (dia) {          // switch como expressão (Java 14+)
    case "sab", "dom" -> "fim de semana";
    default -> "dia útil";
};

for (int i = 1; i <= 10; i++) System.out.println("7 x " + i + " = " + 7 * i);

int[] notas = {7, 9, 6};
for (int nota : notas) System.out.println(nota);`)}

<h2>Métodos</h2>
${trecho(`public class Calculos {
    static double comDesconto(double valor, double percentual) {
        return valor * (1 - percentual / 100);
    }

    public static void main(String[] args) {
        System.out.printf("%.2f%n", comDesconto(200, 15));   // 170,00 ou 170.00, conforme o idioma do sistema
    }
}`)}
<p>O <code>static</code> diz que o método pertence à classe, sem precisar criar um objeto. O tipo antes do nome (<code>double</code>) é o tipo do retorno; <code>void</code> quando não devolve nada.</p>
`,
              quiz: [
                {
                  pergunta: 'Como comparar o conteúdo de duas Strings?',
                  opcoes: ['a == b', 'a.equals(b)', 'a = b'],
                  certa: 1,
                  explicacao: '== compara referências, não o texto.'
                },
                {
                  pergunta: 'Qual tipo usar para valores monetários com precisão exata?',
                  opcoes: ['double', 'float', 'BigDecimal'],
                  certa: 2,
                  explicacao: 'double tem erros de arredondamento em frações decimais.'
                },
                {
                  pergunta: 'O que significa void num método?',
                  opcoes: ['Que ele é vazio', 'Que não devolve valor', 'Que é privado'],
                  certa: 1,
                  explicacao: 'O tipo antes do nome é o do retorno.'
                }
              ]
            },
            {
              id: 'pratica-adivinhacao',
              titulo: 'Prática: jogo de adivinhação',
              resumo: 'Números aleatórios, laço, validação de entrada e contagem de tentativas.',
              minutos: 20,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Sorteie um número de 1 a 100.</li>
  <li>Peça palpites até o usuário acertar, dizendo "maior" ou "menor".</li>
  <li>Se o usuário digitar algo que não é número, avise e peça de novo (sem quebrar o programa).</li>
  <li>Ao acertar, mostre quantas tentativas foram.</li>
  <li>Pergunte se quer jogar de novo e mostre o melhor resultado da sessão.</li>
</ol>
${resposta(`
${trecho(`import java.util.Random;
import java.util.Scanner;

public class Adivinhacao {
    public static void main(String[] args) {
        Scanner entrada = new Scanner(System.in);
        Random sorteio = new Random();
        int recorde = Integer.MAX_VALUE;

        do {
            int segredo = sorteio.nextInt(1, 101);
            int tentativas = 0;
            while (true) {
                System.out.print("Palpite: ");
                String linha = entrada.nextLine().trim();
                int palpite;
                try {
                    palpite = Integer.parseInt(linha);
                } catch (NumberFormatException e) {
                    System.out.println("Digite um número.");
                    continue;
                }
                tentativas++;
                if (palpite < segredo) System.out.println("Maior!");
                else if (palpite > segredo) System.out.println("Menor!");
                else break;
            }
            System.out.printf("Acertou em %d tentativas.%n", tentativas);
            recorde = Math.min(recorde, tentativas);
            System.out.print("Jogar de novo? (s/n) ");
        } while (entrada.nextLine().trim().equalsIgnoreCase("s"));

        System.out.println("Melhor resultado: " + recorde);
    }
}`)}
<p>Ler sempre com <code>nextLine</code> e converter com <code>Integer.parseInt</code> evita o problema clássico de misturar <code>nextInt</code> e <code>nextLine</code> (a quebra de linha que sobra no buffer). <code>nextInt(1, 101)</code> sorteia de 1 até 100: o limite superior não entra.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Qual exceção Integer.parseInt lança com "abc"?',
                  opcoes: ['NullPointerException', 'NumberFormatException', 'IOException'],
                  certa: 1,
                  explicacao: 'Capturá-la permite pedir o número de novo.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Classes, herança, interfaces, coleções e streams.',
      modulos: [
        {
          titulo: 'Objetos e coleções',
          itens: [
            {
              id: 'classes-e-interfaces',
              titulo: 'Classes, herança e interfaces',
              resumo: 'Encapsulamento, construtores, records, herança, interfaces e polimorfismo.',
              minutos: 14,
              corpo: `
${trecho(`public class Conta {
    private final String titular;
    private BigDecimal saldo = BigDecimal.ZERO;

    public Conta(String titular) {
        this.titular = titular;
    }

    public void depositar(BigDecimal valor) {
        if (valor.signum() <= 0) throw new IllegalArgumentException("Valor deve ser positivo");
        saldo = saldo.add(valor);
    }

    public BigDecimal getSaldo() { return saldo; }
    public String getTitular() { return titular; }
}`)}
<p><code>private</code> esconde o campo; o acesso é pelos métodos (<em>getters</em>). <code>final</code> impede reatribuir depois do construtor.</p>

<h2>Records</h2>
${trecho(`public record Produto(String nome, BigDecimal preco, String categoria) {}

var cafe = new Produto("Café", new BigDecimal("18.50"), "Mercearia");
cafe.nome();     // acessores sem "get"
// equals, hashCode e toString prontos`)}

<h2>Herança e interfaces</h2>
${trecho(`public interface Frete {
    BigDecimal calcular(double pesoKg);
}

public class Sedex implements Frete {
    public BigDecimal calcular(double pesoKg) {
        return BigDecimal.valueOf(25 + pesoKg * 4);
    }
}

public class Retirada implements Frete {
    public BigDecimal calcular(double pesoKg) { return BigDecimal.ZERO; }
}

public class ContaPoupanca extends Conta {          // herança
    public ContaPoupanca(String titular) { super(titular); }
    public void renderJuros() { depositar(getSaldo().multiply(new BigDecimal("0.005"))); }
}

List<Frete> opcoes = List.of(new Sedex(), new Retirada());
for (Frete f : opcoes) System.out.println(f.calcular(2));   // polimorfismo`)}
<p><strong>Polimorfismo</strong>: o laço chama <code>calcular</code> sem saber qual frete é; cada classe responde do seu jeito. Uma classe herda (<code>extends</code>) de uma só, mas implementa (<code>implements</code>) quantas interfaces quiser. Na dúvida, prefira interfaces e composição a hierarquias longas de herança.</p>
`,
              quiz: [
                {
                  pergunta: 'Quantas classes uma classe Java pode estender?',
                  opcoes: ['Quantas quiser', 'Uma', 'Nenhuma'],
                  certa: 1,
                  explicacao: 'Herança simples; interfaces podem ser várias.'
                },
                {
                  pergunta: 'Como se lê o campo nome de um record Produto?',
                  opcoes: ['p.getNome()', 'p.nome()', 'p.nome'],
                  certa: 1,
                  explicacao: 'Records geram acessores com o mesmo nome do componente.'
                },
                {
                  pergunta: 'O que é polimorfismo?',
                  opcoes: [
                    'Ter vários construtores',
                    'Tratar objetos diferentes pelo mesmo tipo, cada um respondendo do seu jeito',
                    'Copiar uma classe'
                  ],
                  certa: 1,
                  explicacao: 'O código depende da interface, não da implementação.'
                }
              ]
            },
            {
              id: 'colecoes-e-streams',
              titulo: 'Coleções, streams e Optional',
              resumo: 'List, Map, Set, lambdas, stream, filter, map, collect e groupingBy.',
              minutos: 14,
              corpo: `
${trecho(`List<String> nomes = new ArrayList<>(List.of("Ana", "Bruno"));
nomes.add("Carla");

Map<String, Integer> estoque = new HashMap<>();
estoque.put("Café", 12);
estoque.merge("Café", 5, Integer::sum);       // soma 5 ao que já existe
int arroz = estoque.getOrDefault("Arroz", 0);

Set<String> categorias = new HashSet<>(List.of("Grão", "Bebida", "Grão"));   // sem repetidos`)}
<p><code>List.of</code> cria listas imutáveis: para acrescentar itens, embrulhe num <code>new ArrayList&lt;&gt;(...)</code>.</p>

<h2>Streams</h2>
${trecho(`List<Produto> produtos = List.of(
    new Produto("Café", new BigDecimal("18.50"), "Mercearia"),
    new Produto("Arroz", new BigDecimal("27.90"), "Mercearia"),
    new Produto("Detergente", new BigDecimal("3.20"), "Limpeza"));

List<String> caros = produtos.stream()
    .filter(p -> p.preco().compareTo(new BigDecimal("10")) > 0)
    .sorted(Comparator.comparing(Produto::preco).reversed())
    .map(Produto::nome)
    .toList();

Map<String, Long> porCategoria = produtos.stream()
    .collect(Collectors.groupingBy(Produto::categoria, Collectors.counting()));

BigDecimal total = produtos.stream()
    .map(Produto::preco)
    .reduce(BigDecimal.ZERO, BigDecimal::add);`)}
<p><code>p -&gt; ...</code> é uma <strong>lambda</strong>; <code>Produto::nome</code> é uma <strong>referência de método</strong>, o atalho para <code>p -&gt; p.nome()</code>.</p>

<h2>Optional</h2>
${trecho(`Optional<Produto> achado = produtos.stream().filter(p -> p.nome().equals("Leite")).findFirst();
String texto = achado.map(Produto::nome).orElse("não encontrado");`)}
<p><code>Optional</code> deixa explícito que o resultado pode não existir, em vez de devolver <code>null</code> e arriscar um <code>NullPointerException</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'O que acontece ao chamar add numa lista criada com List.of?',
                  opcoes: ['Funciona', 'UnsupportedOperationException: a lista é imutável', 'Erro de compilação'],
                  certa: 1,
                  explicacao: 'Use new ArrayList<>(List.of(...)) para uma lista mutável.'
                },
                {
                  pergunta: 'O que Produto::nome significa?',
                  opcoes: [
                    'Uma referência ao método nome, igual a p -> p.nome()',
                    'Um campo estático',
                    'Um comentário'
                  ],
                  certa: 0,
                  explicacao: 'É uma referência de método.'
                },
                {
                  pergunta: 'Para que serve Collectors.groupingBy?',
                  opcoes: ['Ordenar', 'Agrupar elementos por uma chave num Map', 'Somar números'],
                  certa: 1,
                  explicacao: 'Com um segundo coletor, conta, soma ou faz média por grupo.'
                }
              ]
            },
            {
              id: 'pratica-biblioteca',
              titulo: 'Prática: sistema de biblioteca',
              resumo: 'Modelar livros e empréstimos e responder perguntas com streams.',
              minutos: 30,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie <code>record Livro(String titulo, String autor, int ano, String genero)</code>.</li>
  <li>Crie a classe <code>Biblioteca</code> com uma lista de livros e um <code>Map</code> de empréstimos (título → nome de quem pegou).</li>
  <li>Métodos: <code>emprestar(titulo, pessoa)</code> (erro se já estiver emprestado ou não existir) e <code>devolver(titulo)</code>.</li>
  <li><code>disponiveis()</code>: livros não emprestados, ordenados por título.</li>
  <li><code>porGenero()</code>: quantidade de livros por gênero.</li>
  <li><code>maisAntigo()</code>: devolve um <code>Optional&lt;Livro&gt;</code>.</li>
</ol>
${resposta(`
${trecho(`import java.util.*;
import java.util.stream.Collectors;

record Livro(String titulo, String autor, int ano, String genero) {}

class Biblioteca {
    private final List<Livro> livros = new ArrayList<>();
    private final Map<String, String> emprestimos = new HashMap<>();

    void adicionar(Livro livro) { livros.add(livro); }

    void emprestar(String titulo, String pessoa) {
        boolean existe = livros.stream().anyMatch(l -> l.titulo().equals(titulo));
        if (!existe) throw new NoSuchElementException("Livro não existe: " + titulo);
        if (emprestimos.containsKey(titulo)) throw new IllegalStateException("Já emprestado para " + emprestimos.get(titulo));
        emprestimos.put(titulo, pessoa);
    }

    void devolver(String titulo) { emprestimos.remove(titulo); }

    List<Livro> disponiveis() {
        return livros.stream()
            .filter(l -> !emprestimos.containsKey(l.titulo()))
            .sorted(Comparator.comparing(Livro::titulo))
            .toList();
    }

    Map<String, Long> porGenero() {
        return livros.stream().collect(Collectors.groupingBy(Livro::genero, TreeMap::new, Collectors.counting()));
    }

    Optional<Livro> maisAntigo() {
        return livros.stream().min(Comparator.comparingInt(Livro::ano));
    }
}

public class Main {
    public static void main(String[] args) {
        var b = new Biblioteca();
        b.adicionar(new Livro("Dom Casmurro", "Machado de Assis", 1899, "Romance"));
        b.adicionar(new Livro("Vidas Secas", "Graciliano Ramos", 1938, "Romance"));
        b.adicionar(new Livro("O Alienista", "Machado de Assis", 1882, "Novela"));
        b.emprestar("Vidas Secas", "Ana");
        System.out.println(b.disponiveis());
        System.out.println(b.porGenero());
        b.maisAntigo().ifPresent(l -> System.out.println("Mais antigo: " + l.titulo()));
    }
}`)}
<p>Passar <code>TreeMap::new</code> ao <code>groupingBy</code> devolve os gêneros em ordem alfabética. Exceções específicas (<code>NoSuchElementException</code>, <code>IllegalStateException</code>) dizem a quem chama exatamente o que deu errado.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que maisAntigo devolve Optional<Livro>?',
                  opcoes: ['Porque a biblioteca pode estar vazia', 'Por desempenho', 'Porque records exigem'],
                  certa: 0,
                  explicacao: 'Optional obriga quem chama a tratar o caso "nenhum".'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Maven, testes, Spring Boot e banco com JPA.',
      modulos: [
        {
          titulo: 'Projetos profissionais',
          itens: [
            {
              id: 'maven-e-testes',
              titulo: 'Maven, exceções e JUnit',
              resumo: 'Estrutura de projeto, dependências, exceções verificadas e testes.',
              minutos: 13,
              corpo: `
<h2>Maven</h2>
<p>Projetos reais usam um gerenciador de build: o <strong>Maven</strong> ou o <strong>Gradle</strong>. Eles baixam bibliotecas, compilam, testam e empacotam.</p>
${trecho(`src/
  main/java/br/com/loja/App.java
  test/java/br/com/loja/AppTest.java
pom.xml`)}
${trecho(`<!-- pom.xml: dependências -->
<dependencies>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.11.0</version>
    <scope>test</scope>
  </dependency>
</dependencies>`)}
${trecho(`mvn test        # roda os testes
mvn package     # gera o .jar em target/
java -jar target/loja-1.0.jar`)}
<p>Os pacotes (<code>br.com.loja</code>) seguem o domínio ao contrário e viram pastas.</p>

<h2>Exceções</h2>
${trecho(`try (var leitor = Files.newBufferedReader(Path.of("dados.csv"))) {   // fecha sozinho no fim
    String linha;
    while ((linha = leitor.readLine()) != null) processar(linha);
} catch (IOException e) {
    System.err.println("Falha ao ler: " + e.getMessage());
}`)}
<p>Exceções <strong>verificadas</strong> (como <code>IOException</code>) precisam ser tratadas ou declaradas com <code>throws</code>; o compilador obriga. As <strong>não verificadas</strong> (<code>RuntimeException</code> e filhas, como <code>IllegalArgumentException</code>) indicam erro de programação ou de regra. O <code>try (...)</code> com recurso fecha o arquivo mesmo se der erro.</p>

<h2>JUnit 5</h2>
${trecho(`class ContaTest {
    @Test
    void depositoSomaAoSaldo() {
        var conta = new Conta("Ana");
        conta.depositar(new BigDecimal("100"));
        assertEquals(new BigDecimal("100"), conta.getSaldo());
    }

    @ParameterizedTest
    @ValueSource(strings = {"0", "-5"})
    void depositoInvalidoLancaErro(String valor) {
        var conta = new Conta("Ana");
        assertThrows(IllegalArgumentException.class, () -> conta.depositar(new BigDecimal(valor)));
    }
}`)}
`,
              quiz: [
                {
                  pergunta: 'O que mvn package gera?',
                  opcoes: ['Um instalador', 'Um .jar com o programa compilado', 'O pom.xml'],
                  certa: 1,
                  explicacao: 'O .jar fica em target/ e roda com java -jar.'
                },
                {
                  pergunta: 'O que o try-with-resources garante?',
                  opcoes: [
                    'Que não haverá erro',
                    'Que o recurso é fechado no fim, com ou sem erro',
                    'Que o arquivo existe'
                  ],
                  certa: 1,
                  explicacao: 'Evita arquivos e conexões abertos esquecidos.'
                },
                {
                  pergunta: 'IOException é uma exceção...',
                  opcoes: [
                    'Verificada: o compilador obriga a tratar ou declarar',
                    'Não verificada',
                    'Que nunca acontece'
                  ],
                  certa: 0,
                  explicacao: 'RuntimeException e filhas é que são não verificadas.'
                }
              ]
            },
            {
              id: 'spring-boot',
              titulo: 'API com Spring Boot e JPA',
              resumo: 'Controllers, injeção de dependência, repositórios e validação.',
              minutos: 15,
              corpo: `
<p>O <strong>Spring Boot</strong> é o framework mais usado para back-end em Java. Gere um projeto em <strong>start.spring.io</strong> com as dependências Spring Web, Spring Data JPA, Validation e H2 (um banco em memória, ótimo para estudar).</p>
${trecho(`@Entity
public class Produto {
    @Id @GeneratedValue
    private Long id;
    @NotBlank private String nome;
    @Positive private BigDecimal preco;
    // getters e setters
}

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    List<Produto> findByPrecoLessThanOrderByNome(BigDecimal limite);   // o Spring cria a consulta pelo nome
}

@RestController
@RequestMapping("/produtos")
public class ProdutoController {
    private final ProdutoRepository repo;

    public ProdutoController(ProdutoRepository repo) {   // injetado pelo Spring
        this.repo = repo;
    }

    @GetMapping
    public List<Produto> listar() { return repo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscar(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Produto criar(@Valid @RequestBody Produto p) { return repo.save(p); }
}`)}
${trecho(`./mvnw spring-boot:run
curl localhost:8080/produtos`)}
<ul>
  <li><code>@Entity</code> liga a classe a uma tabela; o <strong>JPA/Hibernate</strong> gera o SQL.</li>
  <li><code>JpaRepository</code> traz <code>save</code>, <code>findById</code>, <code>findAll</code>, <code>delete</code> prontos. Métodos com nomes como <code>findByPrecoLessThan</code> viram consultas sozinhos.</li>
  <li>O Spring cria os objetos e os entrega pelo construtor: é a <strong>injeção de dependência</strong>. Nada de <code>new ProdutoRepository()</code>.</li>
  <li><code>@Valid</code> confere as anotações (<code>@NotBlank</code>, <code>@Positive</code>) e devolve 400 se falhar.</li>
</ul>
${dica('Em projetos maiores, não exponha a entidade direto na API: use records de entrada e saída (DTOs). Assim, um campo novo no banco não aparece sem querer no JSON.')}
`,
              quiz: [
                {
                  pergunta: 'O que faz um método findByPrecoLessThan num JpaRepository?',
                  opcoes: [
                    'Nada até ser implementado',
                    'O Spring gera a consulta a partir do nome',
                    'Busca na internet'
                  ],
                  certa: 1,
                  explicacao: 'São as query methods do Spring Data.'
                },
                {
                  pergunta: 'Como o controller recebe o repositório?',
                  opcoes: ['Criando com new', 'Pelo construtor, injetado pelo Spring', 'Por uma variável global'],
                  certa: 1,
                  explicacao: 'Injeção de dependência pelo construtor.'
                },
                {
                  pergunta: 'O que @Valid faz no parâmetro?',
                  opcoes: [
                    'Confere as anotações de validação e rejeita com 400 se falhar',
                    'Salva no banco',
                    'Converte para JSON'
                  ],
                  certa: 0,
                  explicacao: 'Faz parte do Bean Validation.'
                }
              ]
            },
            {
              id: 'pratica-api-reservas',
              titulo: 'Prática: API de reservas',
              resumo: 'Spring Boot com regra de negócio, erros tratados e testes.',
              minutos: 40,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Entidade <code>Reserva</code>: hóspede, quarto (número), entrada e saída (<code>LocalDate</code>).</li>
  <li><code>POST /reservas</code>: recuse saída antes da entrada e reservas que se sobreponham a outra do mesmo quarto, com <code>409 Conflict</code>.</li>
  <li><code>GET /reservas?quarto=3</code>: reservas de um quarto, por data.</li>
  <li>Uma classe <code>@RestControllerAdvice</code> que transforma as exceções de regra em JSON <code>{"erro": "..."}</code>.</li>
  <li>Um teste do serviço que confirma que a sobreposição é recusada.</li>
</ol>
${resposta(`
${trecho(`@Entity
public class Reserva {
    @Id @GeneratedValue Long id;
    @NotBlank String hospede;
    @Positive int quarto;
    @NotNull LocalDate entrada;
    @NotNull LocalDate saida;
    // getters e setters
}

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByQuartoOrderByEntrada(int quarto);
    boolean existsByQuartoAndEntradaLessThanAndSaidaGreaterThan(int quarto, LocalDate saida, LocalDate entrada);
}

public class ConflitoException extends RuntimeException {
    public ConflitoException(String msg) { super(msg); }
}

@Service
public class ReservaService {
    private final ReservaRepository repo;
    public ReservaService(ReservaRepository repo) { this.repo = repo; }

    public Reserva criar(Reserva r) {
        if (!r.getSaida().isAfter(r.getEntrada()))
            throw new IllegalArgumentException("A saída deve ser depois da entrada");
        if (repo.existsByQuartoAndEntradaLessThanAndSaidaGreaterThan(r.getQuarto(), r.getSaida(), r.getEntrada()))
            throw new ConflitoException("Quarto já reservado nesse período");
        return repo.save(r);
    }
}

@RestController
@RequestMapping("/reservas")
public class ReservaController {
    private final ReservaService service;
    private final ReservaRepository repo;
    public ReservaController(ReservaService service, ReservaRepository repo) { this.service = service; this.repo = repo; }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Reserva criar(@Valid @RequestBody Reserva r) { return service.criar(r); }

    @GetMapping
    public List<Reserva> doQuarto(@RequestParam int quarto) { return repo.findByQuartoOrderByEntrada(quarto); }
}

@RestControllerAdvice
public class Erros {
    @ExceptionHandler(ConflitoException.class) @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> conflito(ConflitoException e) { return Map.of("erro", e.getMessage()); }

    @ExceptionHandler(IllegalArgumentException.class) @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> invalido(IllegalArgumentException e) { return Map.of("erro", e.getMessage()); }
}

@DataJpaTest
@Import(ReservaService.class)
class ReservaServiceTest {
    @Autowired ReservaService service;

    @Test
    void recusaSobreposicao() {
        service.criar(nova(3, "2026-12-20", "2026-12-24"));
        assertThrows(ConflitoException.class, () -> service.criar(nova(3, "2026-12-23", "2026-12-26")));
    }

    private Reserva nova(int quarto, String entrada, String saida) {
        var r = new Reserva();
        r.setHospede("Ana"); r.setQuarto(quarto);
        r.setEntrada(LocalDate.parse(entrada)); r.setSaida(LocalDate.parse(saida));
        return r;
    }
}`)}
<p>Dois períodos se sobrepõem quando um começa antes de o outro terminar <strong>e</strong> termina depois de o outro começar. Com essa regra, quem sai no dia 24 não conflita com quem entra no dia 24. A regra fica no <code>@Service</code>, não no controller: assim ela vale para qualquer porta de entrada e é fácil de testar.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que colocar a regra de sobreposição no Service e não no Controller?',
                  opcoes: [
                    'O Controller não aceita if',
                    'Para a regra valer em qualquer entrada e ser fácil de testar',
                    'Por desempenho'
                  ],
                  certa: 1,
                  explicacao: 'O controller só traduz HTTP; a regra de negócio fica no serviço.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
