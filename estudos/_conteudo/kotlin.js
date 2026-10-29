// Trilha de Kotlin. Sem editor: o código do iniciante e do intermediário roda no Kotlin Playground
// (play.kotlinlang.org) ou no IntelliJ; o avançado usa o Android Studio. As práticas trazem a resposta escondida.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'kotlin',
  area: 'Apps e mobile',
  titulo: 'Kotlin e Android',
  sigla: 'Kt',
  resumo: 'A linguagem oficial do Android: segura contra nulos, concisa, com coroutines e telas em Jetpack Compose.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Variáveis, nulos, decisões, funções e coleções.',
      modulos: [
        {
          titulo: 'O básico',
          itens: [
            {
              id: 'primeiros-passos',
              titulo: 'val, var, tipos e nulos',
              resumo: 'O primeiro programa, inferência de tipos, templates e segurança contra null.',
              minutos: 10,
              corpo: `
<p><strong>Kotlin</strong> é a linguagem recomendada pelo Google para apps Android. Roda na JVM (convive com código Java), tem uma sintaxe enxuta e impede, já na compilação, o erro mais comum do Java: o <code>NullPointerException</code>. Para começar sem instalar nada, use o <strong>Kotlin Playground</strong> em play.kotlinlang.org.</p>
${trecho(`fun main() {
    val nome = "Ana"        // val: não pode ser reatribuído (prefira sempre)
    var visitas = 1          // var: pode mudar
    visitas += 1
    val preco: Double = 19.9 // tipo explícito (opcional quando dá para deduzir)

    println("Olá, $nome! Visita número $visitas")
    println("Total: \${preco * 3}")   // expressões vão entre chaves
}`)}
<p>Sem ponto e vírgula, sem <code>new</code>. Os <strong>string templates</strong> (<code>$nome</code>, <code>\${expressão}</code>) montam textos.</p>

<h2>Nulos sob controle</h2>
${trecho(`var apelido: String = "Aninha"
// apelido = null              // erro de compilação: String não aceita null

var telefone: String? = null    // o ? permite null
println(telefone?.length)       // ?. : se for null, o resultado é null (sem quebrar)
println(telefone?.length ?: 0)  // ?: (Elvis): valor padrão quando for null

if (telefone != null) {
    println(telefone.length)    // aqui dentro o compilador sabe que não é null
}`)}
${dica('Existe o <code>!!</code>, que diz "confie em mim, não é null" e quebra se for. Evite: cada <code>!!</code> é um <code>NullPointerException</code> esperando para acontecer.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre val e var?',
                  opcoes: ['Nenhuma', 'val não pode ser reatribuído; var pode', 'var é só para números'],
                  certa: 1,
                  explicacao: 'Prefira val: menos coisas mudando, menos bugs.'
                },
                {
                  pergunta: 'O que String? significa?',
                  opcoes: ['Uma String opcional, que aceita null', 'Uma String vazia', 'Uma pergunta'],
                  certa: 0,
                  explicacao: 'Sem o ?, o tipo não aceita null.'
                },
                {
                  pergunta: 'Quanto vale nome?.length ?: 0 quando nome é null?',
                  opcoes: ['null', '0', 'Erro'],
                  certa: 1,
                  explicacao: 'O Elvis (?:) entra quando a esquerda é null.'
                }
              ]
            },
            {
              id: 'funcoes-e-colecoes',
              titulo: 'when, funções e coleções',
              resumo: 'if e when como expressão, funções, listas, mapas e operações funcionais.',
              minutos: 12,
              corpo: `
<h2>Decisões que devolvem valor</h2>
${trecho(`val idade = 20
val faixa = if (idade >= 18) "adulto" else "menor"

val nota = 8.5
val conceito = when {
    nota >= 9 -> "A"
    nota >= 7 -> "B"
    nota >= 5 -> "C"
    else -> "D"
}

val dia = "sab"
val tipo = when (dia) {
    "sab", "dom" -> "fim de semana"
    else -> "dia útil"
}`)}

<h2>Funções</h2>
${trecho(`fun comDesconto(valor: Double, percentual: Double = 10.0): Double =
    valor * (1 - percentual / 100)

comDesconto(200.0)                      // 180.0
comDesconto(200.0, percentual = 25.0)   // argumento nomeado

fun String.iniciais(): String =          // função de extensão: "acrescenta" um método à String
    split(" ").filter { it.isNotBlank() }.joinToString("") { it.first().uppercase() }

"ana maria silva".iniciais()            // "AMS"`)}

<h2>Coleções</h2>
${trecho(`val numeros = listOf(5, 3, 8, 1)           // imutável
val tarefas = mutableListOf("Lavar louça")  // mutável
tarefas.add("Estudar Kotlin")

val precos = mapOf("Café" to 18.5, "Arroz" to 27.9)
println(precos["Café"])

numeros.filter { it > 2 }        // [5, 3, 8]
numeros.map { it * 10 }          // [50, 30, 80, 10]
numeros.sorted()                 // [1, 3, 5, 8]
numeros.sum(); numeros.average()
numeros.any { it > 7 }           // true
for ((produto, preco) in precos) println("$produto: R$ $preco")`)}
<p>Numa lambda com um parâmetro só, ele se chama <code>it</code>. Quando a lambda é o último argumento, ela vai fora dos parênteses.</p>
`,
              quiz: [
                {
                  pergunta: 'O que é "it" dentro de numeros.filter { it > 2 }?',
                  opcoes: ['Uma palavra reservada sem uso', 'O parâmetro único da lambda (cada número)', 'O índice'],
                  certa: 1,
                  explicacao: 'Com um parâmetro só, não precisa dar nome.'
                },
                {
                  pergunta: 'O que é uma função de extensão?',
                  opcoes: [
                    'Uma função muito longa',
                    'Uma função que pode ser chamada como método de um tipo existente',
                    'Um plugin'
                  ],
                  certa: 1,
                  explicacao: 'fun String.iniciais() permite "texto".iniciais().'
                },
                {
                  pergunta: 'listOf cria uma lista...',
                  opcoes: ['Mutável', 'Imutável', 'Vazia'],
                  certa: 1,
                  explicacao: 'Para alterar, use mutableListOf.'
                }
              ]
            },
            {
              id: 'pratica-boletim',
              titulo: 'Prática: boletim da turma',
              resumo: 'Médias, situação de cada aluno e estatísticas com coleções.',
              minutos: 20,
              corpo: `
${trecho(`val notas = mapOf(
    "Ana" to listOf(8.0, 9.5, 7.0),
    "Bruno" to listOf(5.0, 4.5, 6.0),
    "Carla" to listOf(10.0, 9.0, 9.5),
    "Davi" to listOf(3.0, 6.0, 4.0)
)`)}
<h2>Tarefas</h2>
<ol>
  <li>Escreva <code>situacao(media)</code>: 7 ou mais "Aprovado", de 5 a 7 "Recuperação", abaixo de 5 "Reprovado".</li>
  <li>Imprima cada aluno com a média (uma casa decimal) e a situação.</li>
  <li>Mostre o nome do aluno com a maior média.</li>
  <li>Mostre quantos alunos há em cada situação.</li>
  <li>Imprima as iniciais de cada aluno junto do nome usando uma função de extensão.</li>
</ol>
${resposta(`
${trecho(`fun situacao(media: Double) = when {
    media >= 7 -> "Aprovado"
    media >= 5 -> "Recuperação"
    else -> "Reprovado"
}

fun String.inicial() = first().uppercaseChar()

fun main() {
    val medias = notas.mapValues { (_, n) -> n.average() }

    for ((aluno, media) in medias) {
        println("\${aluno.inicial()} $aluno: \${"%.1f".format(media)} - \${situacao(media)}")
    }

    val melhor = medias.maxBy { it.value }
    println("Maior média: \${melhor.key}")

    val porSituacao = medias.values.groupingBy { situacao(it) }.eachCount()
    println(porSituacao)   // {Aprovado=2, Recuperação=1, Reprovado=1}
}`)}
<p><code>mapValues</code> transforma só os valores do mapa. Na lambda, <code>(_, n)</code> desestrutura o par chave-valor e ignora a chave. <code>groupingBy { }.eachCount()</code> conta por grupo.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que mapValues faz?',
                  opcoes: [
                    'Troca chaves por valores',
                    'Cria um mapa novo com os valores transformados',
                    'Ordena o mapa'
                  ],
                  certa: 1,
                  explicacao: 'As chaves continuam as mesmas.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Classes, data classes, sealed classes e coroutines.',
      modulos: [
        {
          titulo: 'Modelar e esperar',
          itens: [
            {
              id: 'classes',
              titulo: 'Classes, data e sealed classes',
              resumo: 'Construtores primários, data class, object, enum e estados com sealed.',
              minutos: 13,
              corpo: `
${trecho(`class Conta(val titular: String, saldoInicial: Double = 0.0) {
    var saldo = saldoInicial
        private set                        // de fora, só leitura

    fun depositar(valor: Double) {
        require(valor > 0) { "Valor deve ser positivo" }
        saldo += valor
    }
}

val c = Conta("Ana")
c.depositar(100.0)`)}
<p>O construtor vem junto do nome da classe. <code>val</code> ou <code>var</code> nos parâmetros já cria as propriedades. <code>require</code> lança <code>IllegalArgumentException</code> se a condição falhar.</p>

<h2>data class</h2>
${trecho(`data class Produto(val nome: String, val preco: Double, val estoque: Int = 0)

val cafe = Produto("Café", 18.5)
val promo = cafe.copy(preco = 15.0)
println(cafe)                           // Produto(nome=Café, preco=18.5, estoque=0)
val (nome, preco) = cafe                // desestruturação`)}

<h2>Estados com sealed class</h2>
<p>Muito usado em apps: a tela está carregando, deu certo ou deu erro, e nunca outra coisa.</p>
${trecho(`sealed interface Estado {
    data object Carregando : Estado
    data class Sucesso(val produtos: List<Produto>) : Estado
    data class Erro(val mensagem: String) : Estado
}

fun mostrar(estado: Estado) = when (estado) {
    Estado.Carregando -> "Carregando..."
    is Estado.Sucesso -> "\${estado.produtos.size} produtos"
    is Estado.Erro -> "Ops: \${estado.mensagem}"
    // sem else: o compilador sabe que esses são todos os casos
}`)}
<p>Se alguém criar um quarto estado, todo <code>when</code> que não o trate vira erro de compilação. <code>object</code> cria um objeto único (singleton); <code>enum class</code> serve para listas fixas simples (<code>enum class Nivel { BAIXO, MEDIO, ALTO }</code>).</p>
`,
              quiz: [
                {
                  pergunta: 'O que uma data class ganha automaticamente?',
                  opcoes: ['Acesso ao banco', 'equals, hashCode, toString e copy', 'Uma tela'],
                  certa: 1,
                  explicacao: 'Tudo derivado das propriedades do construtor.'
                },
                {
                  pergunta: 'Por que o when sobre uma sealed interface não precisa de else?',
                  opcoes: [
                    'O compilador conhece todos os subtipos possíveis',
                    'É um erro do Kotlin',
                    'Porque else é proibido'
                  ],
                  certa: 0,
                  explicacao: 'E avisa quando surge um caso novo não tratado.'
                },
                {
                  pergunta: 'O que faz require(valor > 0)?',
                  opcoes: [
                    'Pede o valor ao usuário',
                    'Lança exceção se a condição for falsa',
                    'Converte para positivo'
                  ],
                  certa: 1,
                  explicacao: 'Checa pré-condições de forma curta.'
                }
              ]
            },
            {
              id: 'coroutines',
              titulo: 'Coroutines e Flow',
              resumo: 'suspend, launch, async, delay e fluxos de dados.',
              minutos: 14,
              corpo: `
<p>Apps não podem travar esperando a internet. As <strong>coroutines</strong> permitem escrever código assíncrono que parece sequencial. Adicione ao projeto <code>org.jetbrains.kotlinx:kotlinx-coroutines-core</code> (no Playground já vem).</p>
${trecho(`import kotlinx.coroutines.*

suspend fun buscarUsuario(): String {
    delay(1000)              // espera sem bloquear a thread
    return "Ana"
}

suspend fun buscarPedidos(): Int {
    delay(1500)
    return 7
}

fun main() = runBlocking {
    val inicio = System.currentTimeMillis()
    val usuario = async { buscarUsuario() }   // começa já
    val pedidos = async { buscarPedidos() }   // em paralelo
    println("\${usuario.await()} tem \${pedidos.await()} pedidos")
    println("Levou \${System.currentTimeMillis() - inicio} ms")   // ~1500, não 2500
}`)}
<ul>
  <li><code>suspend</code> marca uma função que pode pausar. Ela só pode ser chamada de outra <code>suspend</code> ou de dentro de uma coroutine.</li>
  <li><code>launch</code> inicia uma coroutine que não devolve valor; <code>async</code> devolve um <code>Deferred</code>, lido com <code>await()</code>.</li>
  <li><code>runBlocking</code> é para o <code>main</code> e para testes. No Android, use os escopos prontos (<code>viewModelScope</code>, <code>lifecycleScope</code>), que cancelam tudo quando a tela fecha.</li>
</ul>

<h2>Flow: valores ao longo do tempo</h2>
${trecho(`import kotlinx.coroutines.flow.*

fun cronometro(): Flow<Int> = flow {
    for (s in 3 downTo 1) {
        emit(s)
        delay(1000)
    }
}

fun main() = runBlocking {
    cronometro()
        .map { "Faltam $it s" }
        .collect { println(it) }
}`)}
${dica('Trocar de thread é com <code>withContext(Dispatchers.IO) { ... }</code> para disco e rede. A thread principal do Android (a da tela) nunca deve esperar nada lento.')}
`,
              quiz: [
                {
                  pergunta: 'Onde uma função suspend pode ser chamada?',
                  opcoes: ['Em qualquer lugar', 'Dentro de outra suspend ou de uma coroutine', 'Só no main'],
                  certa: 1,
                  explicacao: 'É preciso um contexto que saiba pausar e retomar.'
                },
                {
                  pergunta: 'Duas chamadas com async de 1s e 1,5s, depois await nas duas, levam cerca de...',
                  opcoes: ['2,5 s', '1,5 s', '1 s'],
                  certa: 1,
                  explicacao: 'Rodam em paralelo; o total é o da mais lenta.'
                },
                {
                  pergunta: 'Qual a diferença entre um Flow e uma função suspend?',
                  opcoes: [
                    'Nenhuma',
                    'suspend devolve um valor; Flow emite vários ao longo do tempo',
                    'Flow é síncrono'
                  ],
                  certa: 1,
                  explicacao: 'collect recebe cada valor emitido.'
                }
              ]
            },
            {
              id: 'pratica-pedidos',
              titulo: 'Prática: acompanhar um pedido',
              resumo: 'Sealed classes e Flow simulando o status de uma entrega.',
              minutos: 25,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie uma <code>sealed interface StatusPedido</code> com: Recebido, Preparando, SaiuParaEntrega(entregador), Entregue(horario) e Cancelado(motivo).</li>
  <li>Escreva <code>fun acompanhar(id: Int): Flow&lt;StatusPedido&gt;</code> que emite os status em sequência, com 1 segundo entre eles. Se o id for par, o pedido é cancelado depois de "Preparando".</li>
  <li>Escreva <code>fun mensagem(s: StatusPedido): String</code> com <code>when</code>, sem <code>else</code>.</li>
  <li>No <code>main</code>, acompanhe os pedidos 1 e 2 <strong>ao mesmo tempo</strong>, prefixando cada linha com o número do pedido.</li>
</ol>
${resposta(`
${trecho(`import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import java.time.LocalTime

sealed interface StatusPedido {
    data object Recebido : StatusPedido
    data object Preparando : StatusPedido
    data class SaiuParaEntrega(val entregador: String) : StatusPedido
    data class Entregue(val horario: LocalTime) : StatusPedido
    data class Cancelado(val motivo: String) : StatusPedido
}

fun acompanhar(id: Int): Flow<StatusPedido> = flow {
    emit(StatusPedido.Recebido); delay(1000)
    emit(StatusPedido.Preparando); delay(1000)
    if (id % 2 == 0) {
        emit(StatusPedido.Cancelado("Ingrediente em falta"))
        return@flow
    }
    emit(StatusPedido.SaiuParaEntrega("Marcos")); delay(1000)
    emit(StatusPedido.Entregue(LocalTime.now().withNano(0)))
}

fun mensagem(s: StatusPedido) = when (s) {
    StatusPedido.Recebido -> "Pedido recebido"
    StatusPedido.Preparando -> "Em preparo"
    is StatusPedido.SaiuParaEntrega -> "\${s.entregador} está a caminho"
    is StatusPedido.Entregue -> "Entregue às \${s.horario}"
    is StatusPedido.Cancelado -> "Cancelado: \${s.motivo}"
}

fun main() = runBlocking {
    listOf(1, 2).forEach { id ->
        launch {
            acompanhar(id).collect { println("#$id \${mensagem(it)}") }
        }
    }
}`)}
<p>Cada <code>launch</code> roda uma coroutine; o <code>runBlocking</code> só termina quando as duas acabam. O <code>return@flow</code> encerra o fluxo mais cedo (um <code>return</code> sozinho tentaria sair da função inteira).</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve return@flow?',
                  opcoes: [
                    'Reiniciar o fluxo',
                    'Sair do bloco flow { } e encerrar a emissão',
                    'Devolver um valor ao main'
                  ],
                  certa: 1,
                  explicacao: 'É um return com rótulo, para sair só da lambda.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Apps Android com Jetpack Compose, ViewModel, rede e banco local.',
      modulos: [
        {
          titulo: 'Android',
          itens: [
            {
              id: 'jetpack-compose',
              titulo: 'Telas com Jetpack Compose',
              resumo: 'Android Studio, funções @Composable, estado, listas e Material 3.',
              minutos: 14,
              corpo: `
<p>Instale o <strong>Android Studio</strong> (developer.android.com/studio) e crie um projeto <strong>Empty Activity</strong>. Ele já vem com o <strong>Jetpack Compose</strong>, o jeito atual de fazer telas no Android: a interface é escrita em Kotlin, como funções.</p>
${trecho(`@Composable
fun Contador() {
    var cliques by remember { mutableIntStateOf(0) }
    Column(
        modifier = Modifier.padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("Você clicou $cliques vezes", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(16.dp))
        Button(onClick = { cliques++ }) { Text("Clique aqui") }
    }
}

@Preview(showBackground = true)
@Composable
fun ContadorPreview() { Contador() }`)}
<ul>
  <li>Uma função <code>@Composable</code> descreve a tela para um estado. Quando o estado muda, o Compose redesenha só o que depende dele (a <strong>recomposição</strong>).</li>
  <li><code>remember</code> guarda o valor entre recomposições; <code>mutableIntStateOf</code> avisa o Compose quando muda.</li>
  <li><code>Column</code>, <code>Row</code> e <code>Box</code> organizam; <code>Modifier</code> ajusta tamanho, espaço, clique e fundo.</li>
  <li><code>@Preview</code> mostra a tela no Android Studio sem rodar o app.</li>
</ul>

<h2>Listas</h2>
${trecho(`@Composable
fun ListaProdutos(produtos: List<Produto>, aoClicar: (Produto) -> Unit) {
    LazyColumn {
        items(produtos, key = { it.nome }) { p ->
            ListItem(
                headlineContent = { Text(p.nome) },
                supportingContent = { Text("R$ %.2f".format(p.preco)) },
                modifier = Modifier.clickable { aoClicar(p) }
            )
            HorizontalDivider()
        }
    }
}`)}
<p><code>LazyColumn</code> só desenha os itens visíveis: aguenta listas enormes. O componente recebe os dados e uma função para os eventos, em vez de buscar ou alterar dados sozinho: isso o torna fácil de reaproveitar e de pré-visualizar.</p>
`,
              quiz: [
                {
                  pergunta: 'O que acontece quando um estado lido por um @Composable muda?',
                  opcoes: ['Nada', 'O Compose redesenha as partes que dependem dele', 'O app reinicia'],
                  certa: 1,
                  explicacao: 'É a recomposição.'
                },
                {
                  pergunta: 'Por que usar remember?',
                  opcoes: ['Para salvar no disco', 'Para o valor sobreviver às recomposições', 'Para lembrar a senha'],
                  certa: 1,
                  explicacao: 'Sem remember, o valor voltaria ao inicial a cada redesenho.'
                },
                {
                  pergunta: 'Qual a vantagem de LazyColumn sobre Column numa lista grande?',
                  opcoes: ['Fica mais bonita', 'Só cria os itens visíveis na tela', 'Ordena sozinha'],
                  certa: 1,
                  explicacao: 'Column criaria todos de uma vez.'
                }
              ]
            },
            {
              id: 'viewmodel-rede-room',
              titulo: 'ViewModel, rede e banco local',
              resumo: 'Arquitetura recomendada, StateFlow, Retrofit e Room.',
              minutos: 15,
              corpo: `
<p>A arquitetura recomendada pelo Google separa a tela (<strong>UI</strong>), quem guarda o estado da tela (<strong>ViewModel</strong>) e quem busca os dados (<strong>repositório</strong>, que fala com a rede e o banco).</p>
${trecho(`class ProdutosViewModel(private val repo: ProdutoRepository) : ViewModel() {
    private val _estado = MutableStateFlow<Estado>(Estado.Carregando)
    val estado: StateFlow<Estado> = _estado

    init { carregar() }

    fun carregar() = viewModelScope.launch {
        _estado.value = Estado.Carregando
        _estado.value = try {
            Estado.Sucesso(repo.listar())
        } catch (e: IOException) {
            Estado.Erro("Sem conexão")
        }
    }
}

@Composable
fun TelaProdutos(vm: ProdutosViewModel = viewModel()) {
    val estado by vm.estado.collectAsStateWithLifecycle()
    when (val e = estado) {
        Estado.Carregando -> CircularProgressIndicator()
        is Estado.Sucesso -> ListaProdutos(e.produtos) { }
        is Estado.Erro -> Text(e.mensagem)
    }
}`)}
<p>O ViewModel sobrevive a rotações de tela; as coroutines do <code>viewModelScope</code> são canceladas quando a tela fecha de vez.</p>

<h2>Rede com Retrofit</h2>
${trecho(`interface LojaApi {
    @GET("produtos") suspend fun listar(): List<Produto>
}

val api = Retrofit.Builder()
    .baseUrl("https://minha-api.com/")
    .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
    .build()
    .create(LojaApi::class.java)`)}
<p>Lembre de pedir a permissão no <code>AndroidManifest.xml</code>: <code>&lt;uses-permission android:name="android.permission.INTERNET" /&gt;</code>.</p>

<h2>Banco local com Room</h2>
${trecho(`@Entity data class Tarefa(@PrimaryKey(autoGenerate = true) val id: Int = 0, val titulo: String, val feita: Boolean = false)

@Dao interface TarefaDao {
    @Query("SELECT * FROM Tarefa ORDER BY feita, titulo") fun todas(): Flow<List<Tarefa>>
    @Insert suspend fun inserir(t: Tarefa)
    @Update suspend fun atualizar(t: Tarefa)
}`)}
<p>Um DAO que devolve <code>Flow</code> emite a lista de novo a cada mudança na tabela: a tela se atualiza sozinha.</p>
`,
              quiz: [
                {
                  pergunta: 'Por que guardar o estado no ViewModel e não no @Composable?',
                  opcoes: [
                    'Por estética',
                    'O ViewModel sobrevive à rotação da tela e separa a lógica da interface',
                    'O Compose não aceita estado'
                  ],
                  certa: 1,
                  explicacao: 'A tela só desenha o estado que recebe.'
                },
                {
                  pergunta: 'O que falta no app se toda chamada de rede falha mesmo com internet?',
                  opcoes: ['A permissão INTERNET no manifesto', 'Um Flow', 'O Room'],
                  certa: 0,
                  explicacao: 'Sem ela, o Android bloqueia o acesso.'
                },
                {
                  pergunta: 'Qual a vantagem de um DAO do Room que devolve Flow?',
                  opcoes: ['É mais rápido', 'A lista é emitida de novo a cada mudança na tabela', 'Funciona sem banco'],
                  certa: 1,
                  explicacao: 'A interface acompanha o banco automaticamente.'
                }
              ]
            },
            {
              id: 'pratica-app-tarefas',
              titulo: 'Prática: app de tarefas',
              resumo: 'Compose, ViewModel e Room num app completo.',
              minutos: 45,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie um projeto Empty Activity e adicione o Room (com o KSP) e o <code>lifecycle-viewmodel-compose</code>.</li>
  <li>Entidade <code>Tarefa</code> e DAO da aula anterior, mais um <code>@Delete</code>.</li>
  <li><code>TarefasViewModel</code> que expõe a lista como <code>StateFlow</code> e tem <code>adicionar</code>, <code>alternar</code> e <code>remover</code>.</li>
  <li>Tela com um campo de texto e botão "Adicionar" (desabilitado com texto vazio) e a lista com uma caixa de seleção em cada tarefa.</li>
  <li>As tarefas feitas aparecem riscadas e no fim da lista. Fechar e abrir o app mantém tudo.</li>
</ol>
${resposta(`
${trecho(`class TarefasViewModel(private val dao: TarefaDao) : ViewModel() {
    val tarefas: StateFlow<List<Tarefa>> = dao.todas()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun adicionar(titulo: String) = viewModelScope.launch { dao.inserir(Tarefa(titulo = titulo.trim())) }
    fun alternar(t: Tarefa) = viewModelScope.launch { dao.atualizar(t.copy(feita = !t.feita)) }
    fun remover(t: Tarefa) = viewModelScope.launch { dao.remover(t) }
}

@Composable
fun TelaTarefas(vm: TarefasViewModel) {
    val tarefas by vm.tarefas.collectAsStateWithLifecycle()
    var texto by rememberSaveable { mutableStateOf("") }

    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(texto, { texto = it }, Modifier.weight(1f), label = { Text("Nova tarefa") })
            Spacer(Modifier.width(8.dp))
            Button(onClick = { vm.adicionar(texto); texto = "" }, enabled = texto.isNotBlank()) { Text("Adicionar") }
        }
        LazyColumn {
            items(tarefas, key = { it.id }) { t ->
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(checked = t.feita, onCheckedChange = { vm.alternar(t) })
                    Text(
                        t.titulo,
                        Modifier.weight(1f),
                        textDecoration = if (t.feita) TextDecoration.LineThrough else null
                    )
                    IconButton(onClick = { vm.remover(t) }) { Icon(Icons.Default.Delete, "Remover") }
                }
            }
        }
    }
}`)}
<p>O <code>stateIn</code> transforma o <code>Flow</code> do Room num <code>StateFlow</code> com valor inicial; o <code>WhileSubscribed(5000)</code> mantém a consulta viva por 5 s durante uma rotação, sem refazê-la. <code>rememberSaveable</code> preserva o texto digitado ao girar a tela. A ordem (feitas no fim) já vem do <code>ORDER BY feita</code> do DAO. Para criar o ViewModel com o DAO, use uma <code>ViewModelProvider.Factory</code> ou uma biblioteca de injeção como o Hilt.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre remember e rememberSaveable?',
                  opcoes: [
                    'Nenhuma',
                    'rememberSaveable também sobrevive à rotação e à recriação da Activity',
                    'remember salva no banco'
                  ],
                  certa: 1,
                  explicacao: 'O Saveable guarda o valor no estado salvo da Activity.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
