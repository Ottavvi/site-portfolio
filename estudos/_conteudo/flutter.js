// Trilha de Dart e Flutter. Sem editor: o código roda no DartPad (dartpad.dev, que também roda Flutter) ou no
// computador com o SDK do Flutter. As práticas trazem a resposta escondida para conferir.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'flutter',
  area: 'Apps e mobile',
  titulo: 'Dart e Flutter',
  sigla: 'Fl',
  resumo: 'Um código só para apps Android, iOS, web e desktop: widgets, estado, navegação e APIs.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'A linguagem Dart: tipos, nulos, funções, coleções e classes.',
      modulos: [
        {
          titulo: 'Dart',
          itens: [
            {
              id: 'dart-basico',
              titulo: 'Dart: variáveis, nulos e funções',
              resumo: 'var, final, const, tipos, null safety, interpolação e funções.',
              minutos: 10,
              corpo: `
<p>O <strong>Flutter</strong>, do Google, faz apps para Android, iOS, web e desktop com um único código. Ele usa a linguagem <strong>Dart</strong>, que vamos ver primeiro. Para testar sem instalar nada, use o <strong>DartPad</strong> (dartpad.dev).</p>
${trecho(`void main() {
  var nome = 'Ana';            // tipo deduzido (String)
  final hoje = DateTime.now(); // atribuído uma vez, em tempo de execução
  const taxa = 0.05;           // constante conhecida na compilação
  int visitas = 1;
  double preco = 19.9;
  bool pago = false;

  visitas++;
  print('Olá, $nome! Visita $visitas');
  print('Total: R\\$ \${(preco * 3).toStringAsFixed(2)}');
}`)}
<p>Interpolação: <code>$variavel</code> ou <code>\${expressão}</code>. Para escrever o cifrão de verdade, use <code>\\$</code>.</p>

<h2>Null safety</h2>
${trecho(`String apelido = 'Aninha';
// apelido = null;               // erro: String não aceita null

String? telefone;                // ? : pode ser null (começa null)
print(telefone?.length);         // null, sem quebrar
print(telefone ?? 'sem telefone');
telefone ??= '0000-0000';        // atribui só se for null`)}

<h2>Funções</h2>
${trecho(`double comDesconto(double valor, {double percentual = 10}) =>
    valor * (1 - percentual / 100);

comDesconto(200);                   // 180.0
comDesconto(200, percentual: 25);   // parâmetro nomeado

String saudacao(String nome, [String? titulo]) =>   // [] : posicional opcional
    titulo == null ? 'Olá, $nome' : 'Olá, $titulo $nome';`)}
<p>No Flutter, quase todo widget usa <strong>parâmetros nomeados</strong> (entre chaves), o que deixa o código legível: <code>Text('Oi', style: ..., textAlign: ...)</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre final e const?',
                  opcoes: [
                    'Nenhuma',
                    'final é definido uma vez ao rodar; const precisa ser conhecido na compilação',
                    'const pode mudar'
                  ],
                  certa: 1,
                  explicacao: 'DateTime.now() pode ser final, mas não const.'
                },
                {
                  pergunta: "O que faz telefone ?? 'sem telefone'?",
                  opcoes: ['Compara os dois', 'Usa o texto da direita se telefone for null', 'Junta os textos'],
                  certa: 1,
                  explicacao: '?? é o operador de valor padrão para null.'
                },
                {
                  pergunta: 'Como se passa um parâmetro nomeado em Dart?',
                  opcoes: ['f(percentual = 25)', 'f(percentual: 25)', 'f(--percentual 25)'],
                  certa: 1,
                  explicacao: 'Nome, dois-pontos e valor.'
                }
              ]
            },
            {
              id: 'colecoes-e-classes',
              titulo: 'Coleções, classes e async',
              resumo: 'List, Map, métodos funcionais, classes, construtores e Future.',
              minutos: 13,
              corpo: `
<h2>Coleções</h2>
${trecho(`final notas = [7.5, 9.0, 6.0];
notas.add(8.0);
final aprovadas = notas.where((n) => n >= 7).toList();
final dobro = notas.map((n) => n * 2).toList();
final media = notas.reduce((a, b) => a + b) / notas.length;

final precos = {'Café': 18.5, 'Arroz': 27.9};   // Map
precos['Feijão'] = 9.8;
precos.forEach((produto, preco) => print('$produto: $preco'));

final itens = ['Café', if (temLeite) 'Leite', for (final p in extras) p.toUpperCase()];`)}
<p>O <code>if</code> e o <code>for</code> dentro de listas são muito usados no Flutter para montar listas de widgets.</p>

<h2>Classes</h2>
${trecho(`class Produto {
  final String nome;
  final double preco;
  final int estoque;

  const Produto({required this.nome, required this.preco, this.estoque = 0});

  double get total => preco * estoque;          // getter

  Produto copyWith({double? preco, int? estoque}) => Produto(
        nome: nome,
        preco: preco ?? this.preco,
        estoque: estoque ?? this.estoque,
      );

  factory Produto.fromJson(Map<String, dynamic> j) =>
      Produto(nome: j['nome'], preco: (j['preco'] as num).toDouble());

  @override
  String toString() => 'Produto($nome, $preco)';
}

final cafe = Produto(nome: 'Café', preco: 18.5);
final promo = cafe.copyWith(preco: 15);`)}
<p><code>this.nome</code> no construtor preenche o campo direto. <code>required</code> torna o parâmetro nomeado obrigatório. Objetos imutáveis com <code>copyWith</code> são o padrão no Flutter.</p>

<h2>Future, async e await</h2>
${trecho(`Future<String> buscarNome() async {
  await Future.delayed(const Duration(seconds: 1));
  return 'Ana';
}

Future<void> main() async {
  print('buscando...');
  final nome = await buscarNome();
  print(nome);
  try {
    await Future.error('sem conexão');
  } catch (e) {
    print('falhou: $e');
  }
}`)}
`,
              quiz: [
                {
                  pergunta: 'O que notas.where((n) => n >= 7) faz?',
                  opcoes: ['Ordena', 'Filtra os elementos que passam na condição', 'Soma'],
                  certa: 1,
                  explicacao: 'Devolve um Iterable; .toList() vira lista.'
                },
                {
                  pergunta: 'O que required faz num parâmetro nomeado?',
                  opcoes: ['Torna obrigatório informar', 'Dá um valor padrão', 'Torna privado'],
                  certa: 0,
                  explicacao: 'Sem ele, o parâmetro nomeado precisa de padrão ou ser anulável.'
                },
                {
                  pergunta: 'O que uma função async devolve?',
                  opcoes: ['O valor direto', 'Um Future com o valor', 'Nada'],
                  certa: 1,
                  explicacao: 'Quem chama usa await para pegar o valor.'
                }
              ]
            },
            {
              id: 'pratica-carrinho-dart',
              titulo: 'Prática: carrinho de compras em Dart',
              resumo: 'Classes, coleções e regras de desconto, sem interface gráfica.',
              minutos: 20,
              corpo: `
<h2>Tarefas</h2>
<p>No DartPad:</p>
<ol>
  <li>Crie <code>class Item</code> com produto, preço unitário e quantidade, e um getter <code>subtotal</code>.</li>
  <li>Crie <code>class Carrinho</code> com uma lista de itens e métodos <code>adicionar(produto, preco)</code> (se já existir, aumenta a quantidade) e <code>remover(produto)</code>.</li>
  <li>Getter <code>total</code>: acima de R$ 200, 10% de desconto.</li>
  <li>Método <code>resumo()</code> que devolve um texto com uma linha por item e o total.</li>
</ol>
${resposta(`
${trecho(`class Item {
  final String produto;
  final double preco;
  int quantidade;
  Item(this.produto, this.preco, [this.quantidade = 1]);
  double get subtotal => preco * quantidade;
}

class Carrinho {
  final _itens = <Item>[];

  void adicionar(String produto, double preco) {
    final existente = _itens.where((i) => i.produto == produto).firstOrNull;
    if (existente != null) {
      existente.quantidade++;
    } else {
      _itens.add(Item(produto, preco));
    }
  }

  void remover(String produto) => _itens.removeWhere((i) => i.produto == produto);

  double get bruto => _itens.fold(0, (soma, i) => soma + i.subtotal);
  double get total => bruto > 200 ? bruto * 0.9 : bruto;

  String resumo() => [
        for (final i in _itens) '\${i.quantidade}x \${i.produto}: R\\$ \${i.subtotal.toStringAsFixed(2)}',
        'Total: R\\$ \${total.toStringAsFixed(2)}\${bruto > 200 ? ' (10% off)' : ''}',
      ].join('\\n');
}

void main() {
  final c = Carrinho()
    ..adicionar('Café', 18.5)
    ..adicionar('Café', 18.5)
    ..adicionar('Azeite', 45)
    ..adicionar('Vinho', 129.9);
  print(c.resumo());
}`)}
<p>O <code>_</code> no começo do nome (<code>_itens</code>) torna o campo privado ao arquivo. O <code>..</code> (cascata) chama vários métodos no mesmo objeto. <code>fold</code> acumula um valor percorrendo a lista.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que o _ no começo de _itens significa em Dart?',
                  opcoes: ['Variável temporária', 'Privado à biblioteca (arquivo)', 'Constante'],
                  certa: 1,
                  explicacao: 'Dart não tem a palavra private: usa o sublinhado.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Widgets, layout, estado e navegação.',
      modulos: [
        {
          titulo: 'Flutter',
          itens: [
            {
              id: 'widgets-e-layout',
              titulo: 'Widgets e layout',
              resumo: 'Instalar, flutter create, StatelessWidget, Column, Row, Container e listas.',
              minutos: 14,
              corpo: `
<p>Instale o SDK do Flutter (docs.flutter.dev/get-started) e rode <code>flutter doctor</code>: ele lista o que falta (Android Studio, emulador, Xcode no Mac). Dá para começar rodando no navegador ou no Windows, sem emulador.</p>
${trecho(`flutter create pousada_app
cd pousada_app
flutter run -d chrome     # ou -d windows, ou um emulador/celular conectado`)}

<h2>Tudo é widget</h2>
${trecho(`import 'package:flutter/material.dart';

void main() => runApp(const MeuApp());

class MeuApp extends StatelessWidget {
  const MeuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Pousada',
      theme: ThemeData(colorSchemeSeed: Colors.teal, useMaterial3: true),
      home: Scaffold(
        appBar: AppBar(title: const Text('Quartos')),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: const [
            CartaoQuarto(nome: 'Standard', diaria: 180),
            CartaoQuarto(nome: 'Suíte Mar', diaria: 320),
          ],
        ),
      ),
    );
  }
}

class CartaoQuarto extends StatelessWidget {
  final String nome;
  final double diaria;
  const CartaoQuarto({super.key, required this.nome, required this.diaria});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            const Icon(Icons.bed, size: 32),
            const SizedBox(width: 12),
            Expanded(child: Text(nome, style: Theme.of(context).textTheme.titleMedium)),
            Text('R\\$ \${diaria.toStringAsFixed(0)}'),
          ],
        ),
      ),
    );
  }
}`)}
<ul>
  <li>A tela é uma <strong>árvore de widgets</strong>: cada widget configura um pedaço e tem filhos (<code>child</code> ou <code>children</code>).</li>
  <li><code>Column</code> empilha, <code>Row</code> põe lado a lado, <code>Expanded</code> ocupa o espaço que sobra, <code>SizedBox</code> dá espaço, <code>Padding</code> afasta das bordas.</li>
  <li><code>const</code> nos widgets que não mudam evita reconstruí-los: o Flutter fica mais rápido.</li>
  <li>Salve o arquivo com o app rodando: o <strong>hot reload</strong> mostra a mudança em menos de um segundo, sem perder o estado.</li>
</ul>
${dica('Faixa amarela e preta na tela é <em>overflow</em>: o conteúdo não coube. Normalmente se resolve com <code>Expanded</code> num <code>Row</code>, ou trocando um <code>Column</code> por <code>ListView</code> para rolar.')}
`,
              quiz: [
                {
                  pergunta: 'Qual widget põe filhos lado a lado?',
                  opcoes: ['Column', 'Row', 'Stack'],
                  certa: 1,
                  explicacao: 'Column empilha; Stack sobrepõe.'
                },
                {
                  pergunta: 'Para que serve Expanded dentro de um Row?',
                  opcoes: ['Aumentar a fonte', 'Fazer o filho ocupar o espaço que sobra', 'Rolar a tela'],
                  certa: 1,
                  explicacao: 'É a solução mais comum para overflow horizontal.'
                },
                {
                  pergunta: 'O que o hot reload faz?',
                  opcoes: ['Reinstala o app', 'Aplica a mudança no código sem reiniciar o app', 'Apaga os dados'],
                  certa: 1,
                  explicacao: 'O estado atual é mantido.'
                }
              ]
            },
            {
              id: 'estado-e-navegacao',
              titulo: 'Estado, formulários e navegação',
              resumo: 'StatefulWidget, setState, TextField, Navigator e passar dados entre telas.',
              minutos: 14,
              corpo: `
<h2>StatefulWidget</h2>
${trecho(`class Contador extends StatefulWidget {
  const Contador({super.key});
  @override
  State<Contador> createState() => _ContadorState();
}

class _ContadorState extends State<Contador> {
  int hospedes = 1;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(
          onPressed: hospedes > 1 ? () => setState(() => hospedes--) : null,   // null desabilita
          icon: const Icon(Icons.remove),
        ),
        Text('$hospedes hóspede(s)'),
        IconButton(onPressed: () => setState(() => hospedes++), icon: const Icon(Icons.add)),
      ],
    );
  }
}`)}
<p><code>setState</code> avisa o Flutter que o estado mudou e o <code>build</code> roda de novo. Mudar a variável sem <code>setState</code> não atualiza a tela.</p>

<h2>Formulários</h2>
${trecho(`final _form = GlobalKey<FormState>();
final _nome = TextEditingController();

Form(
  key: _form,
  child: Column(children: [
    TextFormField(
      controller: _nome,
      decoration: const InputDecoration(labelText: 'Nome'),
      validator: (v) => (v == null || v.trim().isEmpty) ? 'Informe o nome' : null,
    ),
    FilledButton(
      onPressed: () {
        if (_form.currentState!.validate()) print(_nome.text);
      },
      child: const Text('Reservar'),
    ),
  ]),
)`)}
<p>Controllers precisam ser liberados: sobrescreva <code>dispose()</code> no <code>State</code> e chame <code>_nome.dispose()</code>.</p>

<h2>Navegação</h2>
${trecho(`// Abrir uma tela passando dados e esperar a resposta
final confirmou = await Navigator.of(context).push<bool>(
  MaterialPageRoute(builder: (_) => DetalheQuarto(quarto: quarto)),
);

// Na outra tela, voltar devolvendo um valor
Navigator.of(context).pop(true);`)}
<p>Para apps maiores, com links e rotas nomeadas (e para a web), o pacote <strong>go_router</strong> é o recomendado.</p>
`,
              quiz: [
                {
                  pergunta: 'O que acontece se você mudar uma variável do State sem setState?',
                  opcoes: ['A tela atualiza', 'A tela não é reconstruída', 'O app fecha'],
                  certa: 1,
                  explicacao: 'setState é o aviso para reconstruir.'
                },
                {
                  pergunta: 'Como desabilitar um botão?',
                  opcoes: ['enabled: false', 'onPressed: null', 'visible: false'],
                  certa: 1,
                  explicacao: 'Sem função de clique, o botão fica desabilitado.'
                },
                {
                  pergunta: 'Como uma tela devolve um valor para a anterior?',
                  opcoes: ['Navigator.pop(valor)', 'return valor', 'Uma variável global'],
                  certa: 0,
                  explicacao: 'Quem fez push recebe o valor no await.'
                }
              ]
            },
            {
              id: 'pratica-app-reserva',
              titulo: 'Prática: tela de reserva',
              resumo: 'Lista de quartos, tela de detalhe com formulário e confirmação.',
              minutos: 35,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Tela inicial com a lista de quartos (nome, diária, capacidade) num <code>ListView.builder</code>.</li>
  <li>Tocar num quarto abre a tela de detalhe.</li>
  <li>No detalhe: nome do hóspede (obrigatório), número de noites e de hóspedes com botões de + e − (limitados à capacidade), e o total calculado ao vivo.</li>
  <li>"Confirmar" valida, volta para a lista e mostra um <code>SnackBar</code> com o resumo.</li>
</ol>
${resposta(`
${trecho(`class Quarto {
  final String nome;
  final double diaria;
  final int capacidade;
  const Quarto(this.nome, this.diaria, this.capacidade);
}

const quartos = [Quarto('Standard', 180, 2), Quarto('Família', 290, 4), Quarto('Suíte Mar', 320, 2)];

class ListaQuartos extends StatelessWidget {
  const ListaQuartos({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Quartos')),
      body: ListView.builder(
        itemCount: quartos.length,
        itemBuilder: (context, i) {
          final q = quartos[i];
          return ListTile(
            title: Text(q.nome),
            subtitle: Text('Até \${q.capacidade} pessoas'),
            trailing: Text('R\\$ \${q.diaria.toStringAsFixed(0)}'),
            onTap: () async {
              final resumo = await Navigator.of(context).push<String>(
                MaterialPageRoute(builder: (_) => Reserva(quarto: q)),
              );
              if (resumo != null && context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(resumo)));
              }
            },
          );
        },
      ),
    );
  }
}

class Reserva extends StatefulWidget {
  final Quarto quarto;
  const Reserva({super.key, required this.quarto});
  @override
  State<Reserva> createState() => _ReservaState();
}

class _ReservaState extends State<Reserva> {
  final _form = GlobalKey<FormState>();
  final _nome = TextEditingController();
  int noites = 1, hospedes = 1;

  @override
  void dispose() {
    _nome.dispose();
    super.dispose();
  }

  Widget _seletor(String rotulo, int valor, int max, ValueChanged<int> mudar) => Row(children: [
        Expanded(child: Text(rotulo)),
        IconButton(onPressed: valor > 1 ? () => mudar(valor - 1) : null, icon: const Icon(Icons.remove)),
        Text('$valor'),
        IconButton(onPressed: valor < max ? () => mudar(valor + 1) : null, icon: const Icon(Icons.add)),
      ]);

  @override
  Widget build(BuildContext context) {
    final q = widget.quarto;
    final total = q.diaria * noites;
    return Scaffold(
      appBar: AppBar(title: Text(q.nome)),
      body: Form(
        key: _form,
        child: ListView(padding: const EdgeInsets.all(16), children: [
          TextFormField(
            controller: _nome,
            decoration: const InputDecoration(labelText: 'Nome do hóspede'),
            validator: (v) => v!.trim().isEmpty ? 'Informe o nome' : null,
          ),
          _seletor('Noites', noites, 30, (v) => setState(() => noites = v)),
          _seletor('Hóspedes', hospedes, q.capacidade, (v) => setState(() => hospedes = v)),
          const SizedBox(height: 16),
          Text('Total: R\\$ \${total.toStringAsFixed(2)}', style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 16),
          FilledButton(
            onPressed: () {
              if (!_form.currentState!.validate()) return;
              Navigator.of(context).pop('\${_nome.text}: \${q.nome}, $noites noite(s), R\\$ \${total.toStringAsFixed(2)}');
            },
            child: const Text('Confirmar'),
          ),
        ]),
      ),
    );
  }
}`)}
<p>No <code>State</code>, os dados do widget ficam em <code>widget.quarto</code>. O <code>context.mounted</code> confere se a tela ainda existe depois do <code>await</code>, antes de usar o <code>context</code>. <code>ListView.builder</code> cria só os itens visíveis.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que conferir context.mounted depois de um await?',
                  opcoes: ['Por estilo', 'A tela pode ter sido fechada enquanto esperava', 'Para recarregar o app'],
                  certa: 1,
                  explicacao: 'Usar o context de uma tela que já saiu causa erro.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'APIs, gerência de estado, dados locais, testes e publicação.',
      modulos: [
        {
          titulo: 'App de verdade',
          itens: [
            {
              id: 'http-e-estado',
              titulo: 'APIs e gerência de estado',
              resumo: 'Pacote http, FutureBuilder, JSON e estado compartilhado com Riverpod.',
              minutos: 15,
              corpo: `
${trecho(`flutter pub add http
flutter pub add flutter_riverpod
flutter pub add shared_preferences`)}

<h2>Buscar dados</h2>
${trecho(`import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<Produto>> buscarProdutos() async {
  final resp = await http.get(Uri.parse('https://minha-api.com/produtos'));
  if (resp.statusCode != 200) throw Exception('Erro \${resp.statusCode}');
  final lista = jsonDecode(resp.body) as List;
  return lista.map((j) => Produto.fromJson(j)).toList();
}`)}
${trecho(`FutureBuilder<List<Produto>>(
  future: _futuro,                       // crie no initState, não dentro do build
  builder: (context, snap) {
    if (snap.connectionState != ConnectionState.done) return const CircularProgressIndicator();
    if (snap.hasError) return Text('Falhou: \${snap.error}');
    final produtos = snap.data!;
    return ListView(children: [for (final p in produtos) ListTile(title: Text(p.nome))]);
  },
)`)}
${dica('Se o <code>Future</code> for criado dentro do <code>build</code>, cada reconstrução dispara uma nova requisição. Guarde-o numa variável do <code>State</code>.')}

<h2>Estado compartilhado com Riverpod</h2>
<p>Quando várias telas precisam do mesmo dado (o carrinho, o usuário logado), passar por parâmetro fica inviável. O <strong>Riverpod</strong> é uma das soluções mais usadas:</p>
${trecho(`final produtosProvider = FutureProvider((ref) => buscarProdutos());

class CarrinhoNotifier extends Notifier<List<Produto>> {
  @override
  List<Produto> build() => [];
  void adicionar(Produto p) => state = [...state, p];   // sempre um estado novo
}
final carrinhoProvider = NotifierProvider<CarrinhoNotifier, List<Produto>>(CarrinhoNotifier.new);

class TelaLoja extends ConsumerWidget {
  const TelaLoja({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final itens = ref.watch(carrinhoProvider).length;
    return ref.watch(produtosProvider).when(
          loading: () => const CircularProgressIndicator(),
          error: (e, _) => Text('Erro: $e'),
          data: (produtos) => ListView(children: [
            Text('$itens no carrinho'),
            for (final p in produtos)
              ListTile(
                title: Text(p.nome),
                onTap: () => ref.read(carrinhoProvider.notifier).adicionar(p),
              ),
          ]),
        );
  }
}
// main: runApp(const ProviderScope(child: MeuApp()));`)}
<p><code>ref.watch</code> reconstrói o widget quando o valor muda; <code>ref.read</code> só lê (para usar em cliques). Outras opções populares são o <strong>Provider</strong> e o <strong>Bloc</strong>.</p>
`,
              quiz: [
                {
                  pergunta: 'Por que não criar o Future dentro do build num FutureBuilder?',
                  opcoes: [
                    'Dá erro de compilação',
                    'Cada reconstrução faria uma nova requisição',
                    'O Future não funciona no build'
                  ],
                  certa: 1,
                  explicacao: 'Crie no initState ou use um provider.'
                },
                {
                  pergunta: 'Qual a diferença entre ref.watch e ref.read?',
                  opcoes: ['Nenhuma', 'watch reconstrói quando o valor muda; read só lê uma vez', 'read é mais lento'],
                  certa: 1,
                  explicacao: 'Use watch no build e read em eventos.'
                },
                {
                  pergunta: 'Por que state = [...state, p] em vez de state.add(p)?',
                  opcoes: [
                    'É mais curto',
                    'O Riverpod detecta mudança quando o estado é um objeto novo',
                    'add não existe'
                  ],
                  certa: 1,
                  explicacao: 'Alterar a lista existente não avisa ninguém.'
                }
              ]
            },
            {
              id: 'testes-e-publicacao',
              titulo: 'Dados locais, testes e publicação',
              resumo: 'shared_preferences, testes de widget, ícone, build e lojas.',
              minutos: 13,
              corpo: `
<h2>Guardar dados no aparelho</h2>
${trecho(`final prefs = await SharedPreferences.getInstance();
await prefs.setString('ultimo_hospede', 'Ana');
final nome = prefs.getString('ultimo_hospede') ?? '';`)}
<p><code>shared_preferences</code> serve para preferências e pouca coisa. Para listas e dados estruturados, use um banco local como <strong>sqflite</strong> ou <strong>drift</strong>; para dados na nuvem, o <strong>Firebase</strong> (que tem integração oficial com o Flutter).</p>

<h2>Testes</h2>
${trecho(`// test/contador_test.dart
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('desconto acima de 200', () {
    final c = Carrinho()..adicionar('Vinho', 250);
    expect(c.total, 225);
  });

  testWidgets('botão + aumenta hóspedes', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: Scaffold(body: Contador())));
    expect(find.text('1 hóspede(s)'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();                     // reconstrói depois do setState
    expect(find.text('2 hóspede(s)'), findsOneWidget);
  });
}`)}
${trecho(`flutter test
flutter analyze    # avisos e erros de estilo`)}

<h2>Publicar</h2>
${trecho(`flutter pub add --dev flutter_launcher_icons   # gera os ícones de todas as plataformas
flutter build appbundle    # Android (.aab) para a Google Play
flutter build ipa          # iOS (precisa de um Mac e conta de desenvolvedor Apple)
flutter build web          # site estático, dá para hospedar no GitHub Pages`)}
<ul>
  <li><strong>Google Play</strong>: conta de desenvolvedor (taxa única), o app assinado com uma chave sua (guarde-a com cuidado: sem ela, você não publica atualizações), ficha da loja e política de privacidade.</li>
  <li><strong>App Store</strong>: Apple Developer Program (anual), Xcode e revisão da Apple.</li>
  <li>Antes de publicar: troque o <code>applicationId</code> (Android) e o Bundle ID (iOS) de <code>com.example</code> para um seu, e teste em modo release (<code>flutter run --release</code>).</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Num teste de widget, para que serve tester.pump()?',
                  opcoes: [
                    'Encher o app de dados',
                    'Reconstruir a tela depois de uma mudança de estado',
                    'Fechar o app'
                  ],
                  certa: 1,
                  explicacao: 'Sem pump, a tela ainda mostra o estado antigo.'
                },
                {
                  pergunta: 'Qual formato o Google Play pede?',
                  opcoes: ['.apk', '.aab (App Bundle)', '.exe'],
                  certa: 1,
                  explicacao: 'O Play gera os APKs otimizados para cada aparelho a partir do bundle.'
                },
                {
                  pergunta: 'O que acontece se você perder a chave de assinatura do app Android?',
                  opcoes: [
                    'Nada',
                    'Fica difícil ou impossível publicar atualizações do mesmo app',
                    'O app some da loja'
                  ],
                  certa: 1,
                  explicacao: 'Com o Play App Signing, há recuperação, mas dá trabalho. Guarde bem.'
                }
              ]
            },
            {
              id: 'pratica-app-cotacoes',
              titulo: 'Prática: app de cotações',
              resumo: 'Buscar uma API pública, atualizar puxando a tela e lembrar a moeda favorita.',
              minutos: 40,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Busque as cotações em <code>https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL</code>.</li>
  <li>Mostre cada moeda com nome, valor de compra e variação do dia (verde se subiu, vermelho se caiu).</li>
  <li>Puxar a lista para baixo atualiza (<code>RefreshIndicator</code>).</li>
  <li>Tocar numa moeda a marca como favorita (estrela), e ela aparece primeiro. A favorita é lembrada ao reabrir o app.</li>
  <li>Sem internet, mostre uma mensagem com botão "Tentar de novo".</li>
</ol>
${resposta(`
${trecho(`import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class Cotacao {
  final String codigo, nome;
  final double compra, variacao;
  Cotacao(this.codigo, this.nome, this.compra, this.variacao);

  factory Cotacao.fromJson(Map<String, dynamic> j) => Cotacao(
        j['code'], j['name'], double.parse(j['bid']), double.parse(j['pctChange']));
}

Future<List<Cotacao>> buscar() async {
  final resp = await http.get(Uri.parse('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL'));
  if (resp.statusCode != 200) throw Exception('HTTP \${resp.statusCode}');
  final mapa = jsonDecode(resp.body) as Map<String, dynamic>;
  return mapa.values.map((j) => Cotacao.fromJson(j)).toList();
}

class TelaCotacoes extends StatefulWidget {
  const TelaCotacoes({super.key});
  @override
  State<TelaCotacoes> createState() => _TelaCotacoesState();
}

class _TelaCotacoesState extends State<TelaCotacoes> {
  late Future<List<Cotacao>> _futuro = buscar();
  String? _favorita;

  @override
  void initState() {
    super.initState();
    SharedPreferences.getInstance().then((p) => setState(() => _favorita = p.getString('favorita')));
  }

  Future<void> _atualizar() async {
    final novo = buscar();
    setState(() => _futuro = novo);
    await novo.catchError((_) => <Cotacao>[]);
  }

  Future<void> _favoritar(String codigo) async {
    setState(() => _favorita = codigo);
    (await SharedPreferences.getInstance()).setString('favorita', codigo);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cotações')),
      body: FutureBuilder<List<Cotacao>>(
        future: _futuro,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snap.hasError) {
            return Center(
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                const Text('Sem conexão com a internet.'),
                TextButton(onPressed: _atualizar, child: const Text('Tentar de novo')),
              ]),
            );
          }
          final lista = [...snap.data!.where((c) => c.codigo == _favorita), ...snap.data!.where((c) => c.codigo != _favorita)];
          return RefreshIndicator(
            onRefresh: _atualizar,
            child: ListView(children: [
              for (final c in lista)
                ListTile(
                  leading: Icon(c.codigo == _favorita ? Icons.star : Icons.star_border),
                  title: Text(c.nome),
                  subtitle: Text('R\\$ \${c.compra.toStringAsFixed(2)}'),
                  trailing: Text(
                    '\${c.variacao >= 0 ? '+' : ''}\${c.variacao.toStringAsFixed(2)}%',
                    style: TextStyle(color: c.variacao >= 0 ? Colors.green : Colors.red),
                  ),
                  onTap: () => _favoritar(c.codigo),
                ),
            ]),
          );
        },
      ),
    );
  }
}`)}
<p>O <code>late</code> com inicializador cria o <code>Future</code> uma vez só, na primeira leitura. O <code>onRefresh</code> precisa de um <code>Future</code> que termine para esconder o indicador; o <code>catchError</code> evita que um erro de rede vire exceção não tratada ali (a mensagem já aparece pelo <code>FutureBuilder</code>). A lista junta a favorita primeiro e depois as outras, na ordem em que vieram da API.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que o RefreshIndicator espera em onRefresh?',
                  opcoes: [
                    'Um número',
                    'Uma função que devolve um Future, para saber quando parar a animação',
                    'Um widget'
                  ],
                  certa: 1,
                  explicacao: 'O indicador some quando o Future termina.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
