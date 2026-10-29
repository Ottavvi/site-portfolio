// Trilha de PHP. Sem editor: os scripts são para rodar no computador com o PHP instalado (php -S para o servidor
// embutido). As práticas trazem a resposta escondida para conferir.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'php',
  area: 'Back-end e dados',
  titulo: 'PHP',
  sigla: 'PHP',
  resumo: 'A linguagem por trás do WordPress e de muito site de pequeno negócio: formulários, banco e Laravel.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Instalar o PHP, variáveis, arrays e páginas dinâmicas.',
      modulos: [
        {
          titulo: 'Primeiros scripts',
          itens: [
            {
              id: 'primeiro-script',
              titulo: 'PHP no servidor',
              resumo: 'Como o PHP gera HTML, o servidor embutido e a sintaxe básica.',
              minutos: 9,
              corpo: `
<p>O <strong>PHP</strong> roda no <strong>servidor</strong>: quando alguém abre a página, o PHP executa, monta o HTML e só o resultado vai para o navegador. Ele move o WordPress (boa parte dos sites do mundo), lojas virtuais e muitos sistemas de pequenas empresas, e quase toda hospedagem barata já vem com ele.</p>

<h2>Instalar e rodar</h2>
<p>No Windows, baixe em windows.php.net (ou use <code>winget install PHP.PHP.8.3</code>); no Mac, <code>brew install php</code>. Depois:</p>
${trecho(`php -v                  # confere a versão
php ola.php             # roda um script no terminal
php -S localhost:8000   # servidor embutido: abra http://localhost:8000`)}

<h2>A sintaxe</h2>
${trecho(`<!-- index.php -->
<?php
$nome = 'Ana';
$hora = (int) date('H');
$saudacao = $hora < 12 ? 'Bom dia' : ($hora < 18 ? 'Boa tarde' : 'Boa noite');
?>
<!doctype html>
<html lang="pt-BR">
  <body>
    <h1><?= $saudacao ?>, <?= htmlspecialchars($nome) ?>!</h1>
    <p>Hoje é <?= date('d/m/Y') ?>.</p>
  </body>
</html>`)}
<ul>
  <li>O código PHP fica entre <code>&lt;?php</code> e <code>?&gt;</code>. Fora disso, é HTML normal.</li>
  <li><code>&lt;?= ... ?&gt;</code> é um atalho para imprimir um valor.</li>
  <li>Variáveis começam com <code>$</code> e não declaram tipo. Instruções terminam com <code>;</code>.</li>
  <li>Texto se junta com ponto: <code>'Olá, ' . $nome</code>. Entre aspas duplas, a variável é trocada pelo valor: <code>"Olá, $nome"</code>.</li>
</ul>
${dica('Sempre que imprimir algo que veio do usuário, passe por <code>htmlspecialchars</code>. Sem isso, alguém pode enviar um <code>&lt;script&gt;</code> que roda no navegador dos outros visitantes (o ataque XSS).')}
`,
              quiz: [
                {
                  pergunta: 'Onde o PHP é executado?',
                  opcoes: [
                    'No navegador do visitante',
                    'No servidor, antes de a página ser enviada',
                    'No banco de dados'
                  ],
                  certa: 1,
                  explicacao: 'O navegador recebe só o HTML que o PHP gerou.'
                },
                {
                  pergunta: 'Qual a diferença entre "Olá, $nome" e \'Olá, $nome\'?',
                  opcoes: [
                    'Nenhuma',
                    'Aspas duplas trocam a variável pelo valor; simples, não',
                    'Aspas simples dão erro'
                  ],
                  certa: 1,
                  explicacao: 'Só as aspas duplas fazem interpolação.'
                },
                {
                  pergunta: 'Para que serve htmlspecialchars?',
                  opcoes: [
                    'Deixar o texto bonito',
                    'Impedir que texto do usuário vire HTML ou script (XSS)',
                    'Traduzir acentos'
                  ],
                  certa: 1,
                  explicacao: 'Ele troca < por &lt; e afins.'
                }
              ]
            },
            {
              id: 'arrays-e-funcoes',
              titulo: 'Arrays, laços e funções',
              resumo: 'Listas, arrays associativos, foreach, funções e tipos.',
              minutos: 12,
              corpo: `
<h2>Arrays</h2>
<p>No PHP, o <strong>array</strong> serve tanto de lista quanto de dicionário (chave e valor):</p>
${trecho(`<?php
$frutas = ['maçã', 'banana', 'uva'];
$frutas[] = 'manga';             // acrescenta no fim
echo count($frutas);              // 4

$quarto = [
    'nome' => 'Suíte Mar',
    'diaria' => 320.0,
    'hospedes' => 2,
];
echo $quarto['nome'];

$quartos = [
    ['nome' => 'Standard', 'diaria' => 180],
    ['nome' => 'Suíte Mar', 'diaria' => 320],
];
foreach ($quartos as $q) {
    echo $q['nome'] . ': R$ ' . number_format($q['diaria'], 2, ',', '.') . PHP_EOL;
}`)}

<h2>Funções úteis de array</h2>
${trecho(`$precos = [180, 320, 250];
$comTaxa = array_map(fn($p) => $p * 1.05, $precos);
$caros = array_filter($precos, fn($p) => $p > 200);
$soma = array_sum($precos);
sort($precos);                        // ordena o próprio array
usort($quartos, fn($a, $b) => $a['diaria'] <=> $b['diaria']);
in_array(320, $precos);               // true`)}
<p><code>fn($p) =&gt; ...</code> é uma <strong>arrow function</strong>. O <code>&lt;=&gt;</code> ("nave espacial") compara dois valores e devolve -1, 0 ou 1, exatamente o que o <code>usort</code> precisa.</p>

<h2>Funções com tipos</h2>
${trecho(`<?php
declare(strict_types=1);

function totalEstadia(float $diaria, int $noites, float $desconto = 0): float
{
    return $diaria * $noites * (1 - $desconto);
}

echo totalEstadia(320, 3);              // 960
echo totalEstadia(320, 7, desconto: 0.1); // argumento nomeado`)}
<p>O PHP moderno (7 e 8) aceita tipos nos parâmetros e no retorno. Com <code>strict_types=1</code> no topo do arquivo, passar um texto onde se espera <code>int</code> dá erro em vez de converter em silêncio.</p>
`,
              quiz: [
                {
                  pergunta: 'Como acrescentar um item no fim de $lista?',
                  opcoes: ['$lista.push(x)', '$lista[] = x', 'add($lista, x)'],
                  certa: 1,
                  explicacao: 'Os colchetes vazios acrescentam no fim (ou use array_push).'
                },
                {
                  pergunta: 'O que o operador <=> devolve?',
                  opcoes: ['true ou false', '-1, 0 ou 1', 'O maior dos dois'],
                  certa: 1,
                  explicacao: 'Menor, igual ou maior: o formato que as funções de ordenação esperam.'
                },
                {
                  pergunta: 'O que muda com declare(strict_types=1)?',
                  opcoes: [
                    'O PHP para de converter tipos automaticamente nas chamadas',
                    'O código fica mais rápido',
                    'Variáveis precisam de $'
                  ],
                  certa: 0,
                  explicacao: 'Tipos errados viram TypeError em vez de conversões silenciosas.'
                }
              ]
            },
            {
              id: 'pratica-tabela-de-precos',
              titulo: 'Prática: tabela de preços de uma pousada',
              resumo: 'Gerar uma página a partir de um array e calcular estadias.',
              minutos: 20,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie <code>index.php</code> com um array de quartos (nome, diária, capacidade).</li>
  <li>Mostre uma tabela HTML com todos os quartos, diária em formato brasileiro (<code>R$ 1.250,00</code>).</li>
  <li>Escreva <code>totalEstadia($diaria, $noites)</code>: a partir de 7 noites, 10% de desconto.</li>
  <li>Acrescente uma coluna com o valor de 3 noites e outra com o de 7.</li>
  <li>Destaque (com uma classe CSS) o quarto mais barato.</li>
</ol>
${resposta(`
${trecho(`<?php
declare(strict_types=1);

$quartos = [
    ['nome' => 'Standard', 'diaria' => 180.0, 'capacidade' => 2],
    ['nome' => 'Família', 'diaria' => 290.0, 'capacidade' => 4],
    ['nome' => 'Suíte Mar', 'diaria' => 320.0, 'capacidade' => 2],
];

function reais(float $v): string
{
    return 'R$ ' . number_format($v, 2, ',', '.');
}

function totalEstadia(float $diaria, int $noites): float
{
    $total = $diaria * $noites;
    return $noites >= 7 ? $total * 0.9 : $total;
}

$menor = min(array_column($quartos, 'diaria'));
?>
<style>.destaque { background: #e7f7ee; }</style>
<table>
  <tr><th>Quarto</th><th>Pessoas</th><th>Diária</th><th>3 noites</th><th>7 noites</th></tr>
  <?php foreach ($quartos as $q): ?>
    <tr class="<?= $q['diaria'] === $menor ? 'destaque' : '' ?>">
      <td><?= htmlspecialchars($q['nome']) ?></td>
      <td><?= $q['capacidade'] ?></td>
      <td><?= reais($q['diaria']) ?></td>
      <td><?= reais(totalEstadia($q['diaria'], 3)) ?></td>
      <td><?= reais(totalEstadia($q['diaria'], 7)) ?></td>
    </tr>
  <?php endforeach; ?>
</table>`)}
<p><code>array_column</code> tira uma coluna de um array de arrays. A sintaxe <code>foreach (...):</code> com <code>endforeach;</code> é a forma alternativa, mais legível no meio do HTML.</p>`)}
`,
              quiz: [
                {
                  pergunta: "O que array_column($quartos, 'diaria') devolve?",
                  opcoes: ['O primeiro quarto', 'Uma lista só com as diárias', 'A soma das diárias'],
                  certa: 1,
                  explicacao: 'Extrai a mesma chave de cada item.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Formulários, sessões, banco de dados com PDO e Composer.',
      modulos: [
        {
          titulo: 'Formulários e banco',
          itens: [
            {
              id: 'formularios-e-sessoes',
              titulo: 'Formulários, validação e sessões',
              resumo: '$_POST, $_GET, validar entrada, redirecionar e lembrar o usuário.',
              minutos: 13,
              corpo: `
${trecho(`<?php
// contato.php
$erros = [];
$nome = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');

    if ($nome === '') $erros[] = 'Informe o nome.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $erros[] = 'E-mail inválido.';

    if (!$erros) {
        // ... salvar ou enviar
        header('Location: obrigado.php');   // Post/Redirect/Get
        exit;
    }
}
?>
<form method="post">
  <?php foreach ($erros as $e): ?><p class="erro"><?= $e ?></p><?php endforeach; ?>
  <input name="nome" value="<?= htmlspecialchars($nome) ?>">
  <input name="email" type="email">
  <button>Enviar</button>
</form>`)}
<ul>
  <li><code>$_GET</code> traz os parâmetros da URL (<code>?pagina=2</code>); <code>$_POST</code>, os campos de um formulário enviado com <code>method="post"</code>.</li>
  <li><code>??</code> devolve o valor da direita se a chave não existir, evitando avisos.</li>
  <li>Depois de processar um POST, <strong>redirecione</strong>. Assim, apertar F5 não reenvia o formulário.</li>
  <li>Nunca confie só na validação do navegador (<code>required</code>, <code>type="email"</code>): quem quiser manda o que quiser direto para o servidor.</li>
</ul>

<h2>Sessões</h2>
${trecho(`<?php
session_start();                          // antes de qualquer HTML
$_SESSION['usuario'] = 'ana@exemplo.com'; // depois do login

// em outra página
session_start();
if (!isset($_SESSION['usuario'])) {
    header('Location: login.php');
    exit;
}`)}
<p>A sessão guarda dados no servidor, ligados a um cookie no navegador. Para senhas, use sempre <code>password_hash($senha, PASSWORD_DEFAULT)</code> ao cadastrar e <code>password_verify</code> ao entrar: nunca guarde a senha em texto.</p>
`,
              quiz: [
                {
                  pergunta: 'Por que redirecionar depois de processar um POST?',
                  opcoes: ['Para o F5 não reenviar o formulário', 'Para ficar mais rápido', 'Porque o PHP exige'],
                  certa: 0,
                  explicacao: 'É o padrão Post/Redirect/Get.'
                },
                {
                  pergunta: 'Como guardar senhas de usuários?',
                  opcoes: ['Em texto puro', 'Com md5', 'Com password_hash e conferir com password_verify'],
                  certa: 2,
                  explicacao: 'password_hash usa um algoritmo lento e com sal, feito para senhas.'
                },
                {
                  pergunta: 'A validação required do HTML basta?',
                  opcoes: ['Sim', 'Não: o servidor precisa validar de novo', 'Só no celular'],
                  certa: 1,
                  explicacao: 'Qualquer um pode enviar uma requisição sem passar pelo formulário.'
                }
              ]
            },
            {
              id: 'pdo-e-composer',
              titulo: 'Banco com PDO e o Composer',
              resumo: 'Conectar, consultas preparadas, transações e pacotes.',
              minutos: 13,
              corpo: `
<p>O <strong>PDO</strong> é o jeito padrão de falar com bancos no PHP (MySQL, PostgreSQL, SQLite...), com a mesma interface para todos.</p>
${trecho(`<?php
$pdo = new PDO('sqlite:' . __DIR__ . '/reservas.db');
// MySQL: new PDO('mysql:host=localhost;dbname=pousada;charset=utf8mb4', 'usuario', 'senha');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

$pdo->exec('CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hospede TEXT NOT NULL,
    entrada TEXT NOT NULL,
    noites INTEGER NOT NULL
)');

// Consulta preparada: os valores vão separados do SQL
$stmt = $pdo->prepare('INSERT INTO reservas (hospede, entrada, noites) VALUES (?, ?, ?)');
$stmt->execute([$_POST['hospede'], $_POST['entrada'], (int) $_POST['noites']]);

$stmt = $pdo->prepare('SELECT * FROM reservas WHERE entrada >= :hoje ORDER BY entrada');
$stmt->execute(['hoje' => date('Y-m-d')]);
foreach ($stmt as $r) echo $r['hospede'], PHP_EOL;`)}
${dica('Nunca monte SQL juntando texto do usuário (<code>"... WHERE nome = \'$nome\'"</code>). É a porta para a <strong>injeção de SQL</strong>. Com <code>prepare</code> e <code>?</code> ou <code>:nome</code>, o banco trata o valor sempre como dado, nunca como comando.')}

<h2>Transações</h2>
${trecho(`$pdo->beginTransaction();
try {
    $pdo->prepare('UPDATE quartos SET livre = 0 WHERE id = ?')->execute([$quarto]);
    $pdo->prepare('INSERT INTO reservas (...) VALUES (...)')->execute([...]);
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();   // desfaz tudo
    throw $e;
}`)}

<h2>Composer</h2>
<p>O <strong>Composer</strong> é o gerenciador de pacotes do PHP (como o npm do Node). Os pacotes vêm do Packagist.</p>
${trecho(`composer init
composer require vlucas/phpdotenv     # lê configurações de um arquivo .env
composer require --dev phpunit/phpunit`)}
${trecho(`<?php
require __DIR__ . '/vendor/autoload.php';   // carrega todos os pacotes e suas classes

$env = Dotenv\\Dotenv::createImmutable(__DIR__);
$env->load();
$senha = $_ENV['DB_SENHA'];`)}
<p>A pasta <code>vendor/</code> não vai para o Git: quem clonar roda <code>composer install</code>, que lê o <code>composer.lock</code> e instala as mesmas versões.</p>
`,
              quiz: [
                {
                  pergunta: 'O que protege contra injeção de SQL?',
                  opcoes: ['Usar aspas duplas', 'Consultas preparadas com ? ou :nome', 'Colocar o SQL em maiúsculas'],
                  certa: 1,
                  explicacao: 'Os valores vão separados do comando.'
                },
                {
                  pergunta: 'O que faz rollBack numa transação?',
                  opcoes: [
                    'Desfaz todas as alterações desde o beginTransaction',
                    'Apaga o banco',
                    'Repete a última consulta'
                  ],
                  certa: 0,
                  explicacao: 'Ou tudo é gravado (commit), ou nada.'
                },
                {
                  pergunta: 'Por que a pasta vendor/ não vai para o Git?',
                  opcoes: ['É secreta', 'O composer install recria a partir do composer.lock', 'O Git não aceita PHP'],
                  certa: 1,
                  explicacao: 'O lock garante as mesmas versões em qualquer máquina.'
                }
              ]
            },
            {
              id: 'pratica-livro-de-reservas',
              titulo: 'Prática: livro de reservas',
              resumo: 'Formulário, validação e listagem com PDO e SQLite.',
              minutos: 30,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Uma página com formulário: hóspede, data de entrada e número de noites.</li>
  <li>Valide no servidor: nome obrigatório, data não pode ser no passado, noites entre 1 e 30.</li>
  <li>Grave no SQLite com consulta preparada e redirecione de volta.</li>
  <li>Abaixo do formulário, liste as próximas reservas com a data de saída calculada.</li>
</ol>
${resposta(`
${trecho(`<?php
declare(strict_types=1);

$pdo = new PDO('sqlite:' . __DIR__ . '/reservas.db', options: [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE IF NOT EXISTS reservas (id INTEGER PRIMARY KEY, hospede TEXT, entrada TEXT, noites INTEGER)');

$erros = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $hospede = trim($_POST['hospede'] ?? '');
    $entrada = DateTimeImmutable::createFromFormat('!Y-m-d', $_POST['entrada'] ?? '');
    $noites = filter_var($_POST['noites'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 30]]);

    if ($hospede === '') $erros[] = 'Informe o hóspede.';
    if (!$entrada || $entrada < new DateTimeImmutable('today')) $erros[] = 'Data inválida.';
    if ($noites === false) $erros[] = 'Noites entre 1 e 30.';

    if (!$erros) {
        $pdo->prepare('INSERT INTO reservas (hospede, entrada, noites) VALUES (?, ?, ?)')
            ->execute([$hospede, $entrada->format('Y-m-d'), $noites]);
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    }
}

$proximas = $pdo->query("SELECT * FROM reservas WHERE entrada >= date('now') ORDER BY entrada")->fetchAll();
?>
<form method="post">
  <?php foreach ($erros as $e): ?><p style="color:red"><?= $e ?></p><?php endforeach; ?>
  <input name="hospede" placeholder="Hóspede">
  <input name="entrada" type="date">
  <input name="noites" type="number" min="1" max="30" value="1">
  <button>Reservar</button>
</form>
<ul>
  <?php foreach ($proximas as $r):
      $saida = (new DateTimeImmutable($r['entrada']))->modify("+{$r['noites']} days"); ?>
    <li><?= htmlspecialchars($r['hospede']) ?>: <?= date('d/m', strtotime($r['entrada'])) ?> a <?= $saida->format('d/m') ?></li>
  <?php endforeach; ?>
</ul>`)}
<p>O <code>!</code> no formato do <code>createFromFormat</code> zera a hora, para comparar só a data com <code>today</code>. <code>FILTER_VALIDATE_INT</code> com <code>min_range</code> e <code>max_range</code> valida e converte numa linha só.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que validar a data no servidor se o campo já é type="date"?',
                  opcoes: ['Não precisa', 'Porque o navegador pode ser contornado', 'Para formatar em pt-BR'],
                  certa: 1,
                  explicacao: 'O servidor é a última palavra sobre o que é válido.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Orientação a objetos moderna, Laravel e WordPress.',
      modulos: [
        {
          titulo: 'Frameworks e ecossistema',
          itens: [
            {
              id: 'oop-moderno',
              titulo: 'Classes, namespaces e PHP 8',
              resumo: 'Promoção de construtor, enums, readonly, match, autoload PSR-4 e PHPUnit.',
              minutos: 13,
              corpo: `
${trecho(`<?php
declare(strict_types=1);

namespace App\\Reservas;

enum Status: string
{
    case Pendente = 'pendente';
    case Confirmada = 'confirmada';
    case Cancelada = 'cancelada';

    public function rotulo(): string
    {
        return match ($this) {
            self::Pendente => 'Aguardando pagamento',
            self::Confirmada => 'Confirmada',
            self::Cancelada => 'Cancelada',
        };
    }
}

final class Reserva
{
    public function __construct(
        public readonly string $hospede,
        public readonly \\DateTimeImmutable $entrada,
        public readonly int $noites,
        private Status $status = Status::Pendente,
    ) {}

    public function confirmar(): void
    {
        if ($this->status === Status::Cancelada) {
            throw new \\DomainException('Reserva cancelada não pode ser confirmada.');
        }
        $this->status = Status::Confirmada;
    }

    public function status(): Status { return $this->status; }
}`)}
<ul>
  <li><strong>Promoção de construtor</strong>: declarar <code>public readonly string $hospede</code> no construtor cria e preenche a propriedade de uma vez.</li>
  <li><code>readonly</code>: só pode ser definida uma vez.</li>
  <li><code>enum</code> limita os valores possíveis. Nada de status <code>'confirmado'</code> escrito errado num canto do código.</li>
  <li><code>match</code> é um <code>switch</code> que devolve valor, compara com <code>===</code> e dá erro se nenhum caso casar.</li>
</ul>

<h2>Autoload PSR-4</h2>
${trecho(`// composer.json
"autoload": { "psr-4": { "App\\\\": "src/" } }

// composer dump-autoload
// Agora App\\Reservas\\Reserva é carregada de src/Reservas/Reserva.php, sem require`)}

<h2>Testes com PHPUnit</h2>
${trecho(`final class ReservaTest extends PHPUnit\\Framework\\TestCase
{
    public function test_nao_confirma_cancelada(): void
    {
        $this->expectException(DomainException::class);
        $r = new Reserva('Ana', new DateTimeImmutable(), 2, Status::Cancelada);
        $r->confirmar();
    }
}
// vendor/bin/phpunit tests`)}
`,
              quiz: [
                {
                  pergunta: 'O que a promoção de construtor faz?',
                  opcoes: [
                    'Declara e preenche a propriedade direto nos parâmetros do construtor',
                    'Torna a classe pública',
                    'Cria uma subclasse'
                  ],
                  certa: 0,
                  explicacao: 'Menos código repetido: sem declarar a propriedade e atribuir à parte.'
                },
                {
                  pergunta: 'Qual a vantagem de um enum para status?',
                  opcoes: ['Ocupa menos memória', 'Só aceita os valores definidos', 'Grava sozinho no banco'],
                  certa: 1,
                  explicacao: 'Erros de digitação viram erros de código, não dados errados.'
                },
                {
                  pergunta: 'O que o autoload PSR-4 resolve?',
                  opcoes: ['Carrega classes pelo namespace, sem require manual', 'Comprime o código', 'Cria o banco'],
                  certa: 0,
                  explicacao: 'O namespace aponta para a pasta, e o nome da classe para o arquivo.'
                }
              ]
            },
            {
              id: 'laravel-e-wordpress',
              titulo: 'Laravel e WordPress',
              resumo: 'Rotas, Eloquent e Blade no Laravel; temas, hooks e plugins no WordPress.',
              minutos: 14,
              corpo: `
<h2>Laravel</h2>
<p>O <strong>Laravel</strong> é o framework PHP mais usado: rotas, banco, filas, e-mail, login e testes prontos.</p>
${trecho(`composer create-project laravel/laravel pousada
cd pousada
php artisan serve
php artisan make:model Reserva -mc     # modelo + migration + controller`)}
${trecho(`// routes/web.php
Route::get('/reservas', [ReservaController::class, 'index']);
Route::post('/reservas', [ReservaController::class, 'store']);

// app/Http/Controllers/ReservaController.php
public function store(Request $request)
{
    $dados = $request->validate([
        'hospede' => 'required|max:100',
        'entrada' => 'required|date|after_or_equal:today',
        'noites' => 'required|integer|between:1,30',
    ]);
    Reserva::create($dados);
    return redirect('/reservas')->with('ok', 'Reserva criada!');
}

public function index()
{
    $reservas = Reserva::where('entrada', '>=', now())->orderBy('entrada')->paginate(20);
    return view('reservas.index', compact('reservas'));
}`)}
${trecho(`{{-- resources/views/reservas/index.blade.php --}}
@foreach ($reservas as $r)
  <p>{{ $r->hospede }} — {{ $r->entrada->format('d/m') }}</p>
@endforeach
{{ $reservas->links() }}`)}
<p>O <strong>Eloquent</strong> (o ORM) liga a classe <code>Reserva</code> à tabela <code>reservas</code>. O <code>validate</code> devolve o usuário ao formulário com as mensagens de erro, sozinho. No Blade, <code>{{ }}</code> já escapa o HTML.</p>

<h2>WordPress</h2>
<p>No WordPress, você estende o sistema com <strong>hooks</strong>: ganchos onde ele chama o seu código.</p>
${trecho(`<?php
/*
 * Plugin Name: Aviso de temporada
 */

// Ação: roda num momento (aqui, ao montar o rodapé)
add_action('wp_footer', function () {
    echo '<p class="aviso">Alta temporada: mínimo de 3 noites.</p>';
});

// Filtro: recebe um valor, altera e devolve
add_filter('the_title', fn($titulo) => is_page('quartos') ? "🏖 $titulo" : $titulo);

// Shortcode: [preco quarto="suite"] dentro de qualquer página
add_shortcode('preco', function ($atts) {
    $precos = ['standard' => 180, 'suite' => 320];
    $q = sanitize_key($atts['quarto'] ?? 'standard');
    return 'R$ ' . number_format($precos[$q] ?? 0, 2, ',', '.');
});`)}
${dica('Nunca edite os arquivos do WordPress nem de um tema comprado: a próxima atualização apaga suas mudanças. Use um plugin próprio ou um <strong>tema filho</strong>.')}
`,
              quiz: [
                {
                  pergunta: 'No Laravel, o que faz $request->validate([...]) quando os dados são inválidos?',
                  opcoes: ['Grava assim mesmo', 'Volta ao formulário com os erros', 'Mostra uma página em branco'],
                  certa: 1,
                  explicacao: 'O redirecionamento e as mensagens são automáticos.'
                },
                {
                  pergunta: 'Qual a diferença entre add_action e add_filter no WordPress?',
                  opcoes: [
                    'Nenhuma',
                    'Ação executa algo num momento; filtro recebe um valor e devolve alterado',
                    'Filtro só serve para buscas'
                  ],
                  certa: 1,
                  explicacao: 'O filtro sempre precisa devolver o valor.'
                },
                {
                  pergunta: 'Onde colocar mudanças num site WordPress?',
                  opcoes: ['Nos arquivos do núcleo', 'Num plugin próprio ou tema filho', 'No banco direto'],
                  certa: 1,
                  explicacao: 'Assim as atualizações não apagam o seu trabalho.'
                }
              ]
            },
            {
              id: 'pratica-api-json',
              titulo: 'Prática: uma API JSON sem framework',
              resumo: 'Roteamento simples, JSON de entrada e saída e códigos HTTP.',
              minutos: 30,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie <code>api.php</code> que responde em JSON, rodando com <code>php -S localhost:8000 api.php</code>.</li>
  <li><code>GET /quartos</code>: lista os quartos do SQLite.</li>
  <li><code>GET /quartos/{id}</code>: um quarto ou <code>404</code>.</li>
  <li><code>POST /quartos</code>: recebe JSON, valida nome e diária e devolve <code>201</code>.</li>
  <li>Qualquer outra rota: <code>404</code> com <code>{"erro": "..."}</code>.</li>
</ol>
${resposta(`
${trecho(`<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$pdo = new PDO('sqlite:' . __DIR__ . '/quartos.db', options: [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE IF NOT EXISTS quartos (id INTEGER PRIMARY KEY, nome TEXT, diaria REAL)');

function responder(int $status, mixed $dados): never
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];
$caminho = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($metodo === 'GET' && $caminho === '/quartos') {
    responder(200, $pdo->query('SELECT * FROM quartos')->fetchAll());
}

if ($metodo === 'GET' && preg_match('#^/quartos/(\\d+)$#', $caminho, $m)) {
    $stmt = $pdo->prepare('SELECT * FROM quartos WHERE id = ?');
    $stmt->execute([$m[1]]);
    $quarto = $stmt->fetch();
    $quarto ? responder(200, $quarto) : responder(404, ['erro' => 'Quarto não encontrado']);
}

if ($metodo === 'POST' && $caminho === '/quartos') {
    $corpo = json_decode(file_get_contents('php://input'), true) ?? [];
    $nome = trim((string) ($corpo['nome'] ?? ''));
    $diaria = $corpo['diaria'] ?? null;
    if ($nome === '' || !is_numeric($diaria) || $diaria <= 0) {
        responder(422, ['erro' => 'nome e diaria (> 0) são obrigatórios']);
    }
    $pdo->prepare('INSERT INTO quartos (nome, diaria) VALUES (?, ?)')->execute([$nome, $diaria]);
    responder(201, ['id' => (int) $pdo->lastInsertId(), 'nome' => $nome, 'diaria' => (float) $diaria]);
}

responder(404, ['erro' => 'Rota não encontrada']);`)}
${trecho(`curl -X POST localhost:8000/quartos -H "Content-Type: application/json" -d "{\\"nome\\":\\"Suíte\\",\\"diaria\\":320}"`)}
<p>O corpo JSON de um POST não aparece em <code>$_POST</code>: ele é lido de <code>php://input</code>. O tipo <code>never</code> diz que <code>responder</code> nunca volta (sempre termina com <code>exit</code>).</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Onde ler o corpo JSON de uma requisição POST em PHP?',
                  opcoes: ['$_POST', "file_get_contents('php://input')", '$_GET'],
                  certa: 1,
                  explicacao: '$_POST só é preenchido para formulários (form-urlencoded ou multipart).'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
