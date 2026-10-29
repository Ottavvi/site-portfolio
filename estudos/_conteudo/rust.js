// Trilha de Rust. Sem editor: o código roda no Rust Playground (play.rust-lang.org) ou no computador com o
// rustup (cargo run). As práticas trazem a resposta escondida para conferir.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'rust',
  area: 'Back-end e dados',
  titulo: 'Rust',
  sigla: 'Rs',
  resumo: 'Velocidade de C com segurança de memória: ownership, enums, traits e programas que não quebram.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Cargo, variáveis, controle, funções e o compilador como professor.',
      modulos: [
        {
          titulo: 'Primeiros passos',
          itens: [
            {
              id: 'primeiro-programa',
              titulo: 'Cargo e o primeiro programa',
              resumo: 'rustup, cargo new, variáveis imutáveis, tipos e macros.',
              minutos: 10,
              corpo: `
<p><strong>Rust</strong> gera programas tão rápidos quanto C e C++, mas o compilador impede, antes de rodar, erros de memória que causam travamentos e falhas de segurança nessas linguagens. É usada em navegadores, sistemas operacionais, ferramentas de linha de comando e no back-end de empresas que precisam de desempenho. A curva de aprendizado é mais íngreme: o compilador é exigente, mas as mensagens de erro ensinam muito.</p>

<h2>Instalar</h2>
<p>Instale pelo <strong>rustup</strong> (rustup.rs). Para testar sem instalar, use o Rust Playground. No VS Code, instale a extensão <strong>rust-analyzer</strong>.</p>
${trecho(`cargo new ola      # cria o projeto (Cargo.toml + src/main.rs)
cd ola
cargo run          # compila e roda
cargo build --release   # versão otimizada em target/release/`)}
${trecho(`fn main() {
    let nome = "Ana";               // imutável por padrão
    let mut visitas = 1;            // mut: pode mudar
    visitas += 1;

    let preco: f64 = 19.9;
    let quantidade: u32 = 3;        // inteiro sem sinal de 32 bits
    let total = preco * quantidade as f64;   // conversão explícita com "as"

    println!("Olá, {nome}! Visita {visitas}");
    println!("Total: {:.2}", total);
}`)}
<ul>
  <li>Variáveis são <strong>imutáveis</strong> por padrão. Para alterar, declare com <code>mut</code>.</li>
  <li>Inteiros têm tamanho no nome: <code>i32</code>, <code>i64</code>, <code>u8</code>, <code>u32</code>, <code>usize</code> (índices). Decimais: <code>f64</code>.</li>
  <li>Rust não converte tipos sozinho: somar <code>f64</code> com <code>u32</code> é erro. Converta com <code>as</code>.</li>
  <li>O <code>!</code> em <code>println!</code> indica uma <strong>macro</strong>. <code>{nome}</code> imprime a variável; <code>{:.2}</code>, com 2 casas.</li>
</ul>
${dica('Leia as mensagens de erro do compilador até o fim: quase sempre elas dizem exatamente o que mudar ("help: consider adding mut").')}
`,
              quiz: [
                {
                  pergunta: 'Como declarar uma variável que pode mudar?',
                  opcoes: ['var x = 1', 'let mut x = 1', 'let x = 1'],
                  certa: 1,
                  explicacao: 'Sem mut, a variável é imutável.'
                },
                {
                  pergunta: 'O que acontece ao somar um f64 com um u32 sem conversão?',
                  opcoes: ['O Rust converte sozinho', 'Erro de compilação', 'O resultado é arredondado'],
                  certa: 1,
                  explicacao: 'Conversões são sempre explícitas, com as.'
                },
                {
                  pergunta: 'O que o ! em println! indica?',
                  opcoes: ['Urgência', 'Que é uma macro', 'Que pode falhar'],
                  certa: 1,
                  explicacao: 'Macros geram código na compilação.'
                }
              ]
            },
            {
              id: 'controle-e-funcoes',
              titulo: 'Expressões, controle e funções',
              resumo: 'if como expressão, loop, while, for, match e funções.',
              minutos: 12,
              corpo: `
<h2>Quase tudo é expressão</h2>
${trecho(`let idade = 20;
let faixa = if idade >= 18 { "adulto" } else { "menor" };

fn dobro(x: i32) -> i32 {
    x * 2          // sem ponto e vírgula: é o valor devolvido
}`)}
<p>A última expressão de um bloco, <strong>sem</strong> ponto e vírgula, é o valor dele. Com <code>;</code>, vira uma instrução e o bloco devolve <code>()</code> (nada). Esquecer ou sobrar um <code>;</code> é um erro comum no começo.</p>

<h2>Laços</h2>
${trecho(`for i in 1..=10 {                  // 1 até 10, inclusive (1..10 iria até 9)
    println!("7 x {i} = {}", 7 * i);
}

let frutas = ["maçã", "banana", "uva"];
for (i, f) in frutas.iter().enumerate() {
    println!("{i}: {f}");
}

let mut tentativas = 0;
let resultado = loop {               // loop infinito que devolve valor no break
    tentativas += 1;
    if tentativas == 3 { break tentativas * 10; }
};`)}

<h2>match</h2>
${trecho(`let nota = 8;
let conceito = match nota {
    9..=10 => "A",
    7..=8 => "B",
    5 | 6 => "C",
    _ => "D",
};`)}
<p>O <code>match</code> precisa cobrir <strong>todos</strong> os casos possíveis; o <code>_</code> pega o resto. Se faltar um caso, o código não compila.</p>
`,
              quiz: [
                {
                  pergunta: 'O que uma função devolve quando a última linha é x * 2 sem ponto e vírgula?',
                  opcoes: ['Nada', 'O valor de x * 2', 'Erro'],
                  certa: 1,
                  explicacao: 'A última expressão sem ; é o retorno.'
                },
                {
                  pergunta: 'Quais números 1..5 percorre?',
                  opcoes: ['1 a 5', '1 a 4', '0 a 5'],
                  certa: 1,
                  explicacao: '1..=5 incluiria o 5.'
                },
                {
                  pergunta: 'O que acontece se um match não cobrir todos os casos?',
                  opcoes: ['Ignora os que faltam', 'Não compila', 'Quebra ao rodar'],
                  certa: 1,
                  explicacao: 'O compilador exige que o match seja exaustivo.'
                }
              ]
            },
            {
              id: 'pratica-fizzbuzz-primos',
              titulo: 'Prática: números com regras',
              resumo: 'Funções puras, laços e match em problemas clássicos.',
              minutos: 20,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Escreva <code>fn eh_primo(n: u32) -&gt; bool</code>.</li>
  <li>Imprima os primos até 50.</li>
  <li>Escreva <code>fn fizzbuzz(n: u32) -&gt; String</code>: "FizzBuzz" para múltiplos de 15, "Fizz" para 3, "Buzz" para 5 e o número nos outros casos. Use <code>match</code> com uma tupla.</li>
  <li>Escreva <code>fn collatz(n: u64) -&gt; u32</code>: quantos passos até chegar a 1 (par: divide por 2; ímpar: 3n + 1).</li>
  <li>Descubra qual número abaixo de 10.000 tem a sequência de Collatz mais longa.</li>
</ol>
${resposta(`
${trecho(`fn eh_primo(n: u32) -> bool {
    if n < 2 {
        return false;
    }
    let mut d = 2;
    while d * d <= n {
        if n % d == 0 {
            return false;
        }
        d += 1;
    }
    true
}

fn fizzbuzz(n: u32) -> String {
    match (n % 3, n % 5) {
        (0, 0) => "FizzBuzz".to_string(),
        (0, _) => "Fizz".to_string(),
        (_, 0) => "Buzz".to_string(),
        _ => n.to_string(),
    }
}

fn collatz(mut n: u64) -> u32 {
    let mut passos = 0;
    while n != 1 {
        n = if n % 2 == 0 { n / 2 } else { 3 * n + 1 };
        passos += 1;
    }
    passos
}

fn main() {
    let primos: Vec<u32> = (1..=50).filter(|&n| eh_primo(n)).collect();
    println!("{:?}", primos);

    for n in 1..=15 {
        println!("{}", fizzbuzz(n));
    }

    let maior = (1..10_000).max_by_key(|&n| collatz(n)).unwrap();
    println!("{maior} leva {} passos", collatz(maior));   // 6171 leva 261 passos
}`)}
<p>Só é preciso testar divisores até a raiz de n (<code>d * d &lt;= n</code>). <code>{:?}</code> imprime estruturas no formato de depuração. <code>|&amp;n| ...</code> é uma <strong>closure</strong> (função anônima).</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que testar divisores só até a raiz quadrada?',
                  opcoes: [
                    'Porque é mais bonito',
                    'Se n tem um divisor maior que a raiz, tem também um menor',
                    'Por limitação do Rust'
                  ],
                  certa: 1,
                  explicacao: 'Os divisores vêm em pares.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Ownership, empréstimos, structs, enums, Option e Result.',
      modulos: [
        {
          titulo: 'O jeito Rust',
          itens: [
            {
              id: 'ownership',
              titulo: 'Ownership e empréstimos',
              resumo: 'Dono, mover, clonar, referências & e &mut, String e &str.',
              minutos: 15,
              corpo: `
<p>Rust não tem coletor de lixo nem obriga a liberar memória à mão. Ele usa três regras de <strong>posse</strong> (ownership), conferidas na compilação:</p>
<ol>
  <li>Cada valor tem <strong>um dono</strong> (uma variável).</li>
  <li>Só pode haver um dono por vez.</li>
  <li>Quando o dono sai de escopo, o valor é liberado.</li>
</ol>
${trecho(`let a = String::from("olá");
let b = a;                 // a posse MOVE para b
// println!("{a}");        // erro: a não é mais dona de nada
let c = b.clone();         // cópia de verdade (custa memória)
println!("{b} {c}");

let x = 5;
let y = x;                 // números são Copy: copiam sozinhos
println!("{x} {y}");`)}

<h2>Emprestar em vez de mover</h2>
${trecho(`fn tamanho(s: &String) -> usize {   // & : pega emprestado só para ler
    s.len()
}

fn exclamar(s: &mut String) {        // &mut : empréstimo que pode alterar
    s.push('!');
}

let mut nome = String::from("Ana");
let n = tamanho(&nome);              // nome continua sendo de quem era
exclamar(&mut nome);
println!("{nome} {n}");              // Ana! 3`)}
<p>A regra dos empréstimos: num mesmo momento, ou <strong>vários</strong> <code>&amp;</code> (leitura), ou <strong>um único</strong> <code>&amp;mut</code>. Isso elimina, em tempo de compilação, uma classe inteira de bugs em que um pedaço do código altera dados que outro está lendo.</p>

<h2>String e &amp;str</h2>
<ul>
  <li><code>String</code>: texto com dono, que pode crescer (<code>String::from</code>, <code>.to_string()</code>, <code>format!</code>).</li>
  <li><code>&amp;str</code>: uma "fatia" emprestada de um texto. Literais (<code>"olá"</code>) são <code>&amp;str</code>.</li>
  <li>Em parâmetros que só leem texto, prefira <code>&amp;str</code>: aceita os dois.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Depois de let b = a; com a sendo uma String, o que acontece com a?',
                  opcoes: ['Continua válida', 'Não pode mais ser usada: a posse foi movida', 'Vira uma cópia'],
                  certa: 1,
                  explicacao: 'Para ter as duas, use clone.'
                },
                {
                  pergunta: 'Quantos empréstimos &mut do mesmo valor podem existir ao mesmo tempo?',
                  opcoes: ['Quantos quiser', 'Um', 'Nenhum'],
                  certa: 1,
                  explicacao: 'Ou vários & de leitura, ou um único &mut.'
                },
                {
                  pergunta: 'Qual tipo de parâmetro aceita tanto String quanto literais de texto?',
                  opcoes: ['String', '&str', 'char'],
                  certa: 1,
                  explicacao: 'Uma &String vira &str automaticamente.'
                }
              ]
            },
            {
              id: 'structs-enums-erros',
              titulo: 'Structs, enums, Option e Result',
              resumo: 'Modelar dados, impl, enums com dados, ausência sem null e erros com ?.',
              minutos: 14,
              corpo: `
${trecho(`#[derive(Debug, Clone, PartialEq)]
struct Produto {
    nome: String,
    preco: f64,
    estoque: u32,
}

impl Produto {
    fn novo(nome: &str, preco: f64) -> Self {
        Self { nome: nome.to_string(), preco, estoque: 0 }
    }

    fn total(&self) -> f64 {
        self.preco * self.estoque as f64
    }

    fn repor(&mut self, qtd: u32) {
        self.estoque += qtd;
    }
}`)}
<p><code>#[derive(Debug)]</code> gera a impressão com <code>{:?}</code>. Métodos recebem <code>&amp;self</code> (ler) ou <code>&amp;mut self</code> (alterar).</p>

<h2>Enums com dados</h2>
${trecho(`enum Pagamento {
    Pix { chave: String },
    Cartao { parcelas: u8 },
    Dinheiro,
}

fn taxa(p: &Pagamento, valor: f64) -> f64 {
    match p {
        Pagamento::Pix { .. } => 0.0,
        Pagamento::Cartao { parcelas } if *parcelas > 1 => valor * 0.05,
        Pagamento::Cartao { .. } => valor * 0.02,
        Pagamento::Dinheiro => 0.0,
    }
}`)}

<h2>Sem null: Option</h2>
${trecho(`fn buscar<'a>(lista: &'a [Produto], nome: &str) -> Option<&'a Produto> {
    lista.iter().find(|p| p.nome == nome)
}

match buscar(&produtos, "Café") {
    Some(p) => println!("{}", p.preco),
    None => println!("não achei"),
}
let preco = buscar(&produtos, "Leite").map(|p| p.preco).unwrap_or(0.0);`)}

<h2>Erros: Result e ?</h2>
${trecho(`use std::fs;
use std::num::ParseFloatError;

fn ler_preco(texto: &str) -> Result<f64, ParseFloatError> {
    let valor: f64 = texto.trim().replace(',', ".").parse()?;   // ? devolve o erro para quem chamou
    Ok(valor)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let conteudo = fs::read_to_string("preco.txt")?;
    println!("{}", ler_preco(&conteudo)?);
    Ok(())
}`)}
<p>O <code>?</code> é o coração do tratamento de erros em Rust: se der <code>Ok</code>, pega o valor; se der <code>Err</code>, retorna o erro na hora. <code>.unwrap()</code> quebra o programa em caso de erro: tudo bem em testes e protótipos, evite no resto.</p>
`,
              quiz: [
                {
                  pergunta: 'Como Rust representa "pode não ter valor"?',
                  opcoes: ['null', 'Option: Some(valor) ou None', 'undefined'],
                  certa: 1,
                  explicacao: 'Não existe null em Rust seguro.'
                },
                {
                  pergunta: 'O que o operador ? faz num Result?',
                  opcoes: [
                    'Ignora o erro',
                    'Pega o valor se for Ok; se for Err, retorna o erro da função',
                    'Imprime o erro'
                  ],
                  certa: 1,
                  explicacao: 'Propaga o erro sem if repetido.'
                },
                {
                  pergunta: 'Qual a diferença entre &self e &mut self num método?',
                  opcoes: ['Nenhuma', '&self só lê; &mut self pode alterar a struct', '&mut self é mais rápido'],
                  certa: 1,
                  explicacao: 'As regras de empréstimo valem para self também.'
                }
              ]
            },
            {
              id: 'pratica-estoque',
              titulo: 'Prática: controle de estoque',
              resumo: 'Structs, enums de erro, HashMap e Result.',
              minutos: 30,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie <code>struct Estoque</code> com um <code>HashMap&lt;String, u32&gt;</code>.</li>
  <li>Crie <code>enum ErroEstoque { ProdutoInexistente(String), Insuficiente { pedido: u32, disponivel: u32 } }</code> e implemente <code>Display</code> para ele.</li>
  <li>Métodos: <code>entrada(&amp;mut self, produto, qtd)</code> e <code>saida(&amp;mut self, produto, qtd) -&gt; Result&lt;u32, ErroEstoque&gt;</code> (devolve o que sobrou).</li>
  <li>No <code>main</code>, faça uma saída que dá certo, uma de produto inexistente e uma maior que o disponível, imprimindo as mensagens de erro.</li>
</ol>
${resposta(`
${trecho(`use std::collections::HashMap;
use std::fmt;

#[derive(Debug)]
enum ErroEstoque {
    ProdutoInexistente(String),
    Insuficiente { pedido: u32, disponivel: u32 },
}

impl fmt::Display for ErroEstoque {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ErroEstoque::ProdutoInexistente(p) => write!(f, "produto '{p}' não existe"),
            ErroEstoque::Insuficiente { pedido, disponivel } => {
                write!(f, "pedido de {pedido}, mas só há {disponivel}")
            }
        }
    }
}

impl std::error::Error for ErroEstoque {}

#[derive(Default)]
struct Estoque {
    itens: HashMap<String, u32>,
}

impl Estoque {
    fn entrada(&mut self, produto: &str, qtd: u32) {
        *self.itens.entry(produto.to_string()).or_insert(0) += qtd;
    }

    fn saida(&mut self, produto: &str, qtd: u32) -> Result<u32, ErroEstoque> {
        let atual = self
            .itens
            .get_mut(produto)
            .ok_or_else(|| ErroEstoque::ProdutoInexistente(produto.to_string()))?;
        if qtd > *atual {
            return Err(ErroEstoque::Insuficiente { pedido: qtd, disponivel: *atual });
        }
        *atual -= qtd;
        Ok(*atual)
    }
}

fn main() {
    let mut e = Estoque::default();
    e.entrada("café", 10);

    for (produto, qtd) in [("café", 4), ("leite", 1), ("café", 20)] {
        match e.saida(produto, qtd) {
            Ok(resta) => println!("saída de {qtd} {produto}: restam {resta}"),
            Err(erro) => println!("erro: {erro}"),
        }
    }
}`)}
<p><code>entry(...).or_insert(0)</code> devolve uma referência mutável ao valor, criando-o se não existir; o <code>*</code> acessa o número por trás dela. <code>ok_or_else</code> transforma um <code>Option</code> num <code>Result</code>, para usar o <code>?</code>.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve ok_or_else em get_mut(...).ok_or_else(...)?',
                  opcoes: [
                    'Transformar o Option em Result, com um erro para o caso None',
                    'Ordenar o mapa',
                    'Criar o produto'
                  ],
                  certa: 0,
                  explicacao: 'Com Result, dá para usar o ?.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Traits, genéricos, iteradores, crates, async e testes.',
      modulos: [
        {
          titulo: 'Abstrações e ecossistema',
          itens: [
            {
              id: 'traits-e-iteradores',
              titulo: 'Traits, genéricos e iteradores',
              resumo: 'Comportamento compartilhado, limites de tipo e cadeias de iteradores.',
              minutos: 14,
              corpo: `
<h2>Traits</h2>
<p>Uma <strong>trait</strong> define um comportamento que vários tipos podem ter, como as interfaces de outras linguagens:</p>
${trecho(`trait Frete {
    fn calcular(&self, peso_kg: f64) -> f64;
    fn nome(&self) -> String { "frete".into() }   // implementação padrão
}

struct Sedex;
struct Retirada;

impl Frete for Sedex {
    fn calcular(&self, peso: f64) -> f64 { 25.0 + peso * 4.0 }
    fn nome(&self) -> String { "Sedex".into() }
}

impl Frete for Retirada {
    fn calcular(&self, _: f64) -> f64 { 0.0 }
}`)}

<h2>Genéricos</h2>
${trecho(`// Genérico: o compilador gera uma versão para cada tipo (rápido)
fn mais_barato<F: Frete>(opcoes: &[F], peso: f64) -> f64 {
    opcoes.iter().map(|f| f.calcular(peso)).fold(f64::MAX, f64::min)
}

// Objeto de trait: tipos diferentes na mesma lista
let opcoes: Vec<Box<dyn Frete>> = vec![Box::new(Sedex), Box::new(Retirada)];
for f in &opcoes {
    println!("{}: {:.2}", f.nome(), f.calcular(2.0));
}`)}
<p><code>F: Frete</code> é um <strong>limite</strong>: aceita qualquer tipo que implemente <code>Frete</code>. Com <code>dyn Frete</code>, a decisão de qual método chamar acontece na hora de rodar.</p>

<h2>Iteradores</h2>
${trecho(`let vendas = vec![("Ana", 120.0), ("Bruno", 80.0), ("Ana", 45.5), ("Carla", 300.0)];

let total_ana: f64 = vendas.iter().filter(|(v, _)| *v == "Ana").map(|(_, x)| x).sum();

let mut por_vendedor: HashMap<&str, f64> = HashMap::new();
for (v, x) in &vendas {
    *por_vendedor.entry(*v).or_default() += x;
}

let mut ranking: Vec<_> = por_vendedor.into_iter().collect();
ranking.sort_by(|a, b| b.1.total_cmp(&a.1));`)}
<p>Os iteradores são <strong>preguiçosos</strong> e o compilador os transforma em laços tão rápidos quanto os escritos à mão: são as "abstrações de custo zero" do Rust.</p>
`,
              quiz: [
                {
                  pergunta: 'O que é uma trait?',
                  opcoes: ['Um tipo de variável', 'Um conjunto de métodos que tipos podem implementar', 'Um laço'],
                  certa: 1,
                  explicacao: 'Parecida com interface em outras linguagens.'
                },
                {
                  pergunta: 'Quando usar Vec<Box<dyn Frete>>?',
                  opcoes: [
                    'Para guardar tipos diferentes que implementam Frete na mesma lista',
                    'Sempre',
                    'Para números'
                  ],
                  certa: 0,
                  explicacao: 'Com genéricos, a lista teria um tipo só.'
                },
                {
                  pergunta: 'Iteradores em Rust são mais lentos que laços?',
                  opcoes: ['Sim, bem mais', 'Não: compilam para código equivalente', 'Só em modo release'],
                  certa: 1,
                  explicacao: 'São abstrações de custo zero.'
                }
              ]
            },
            {
              id: 'crates-async-testes',
              titulo: 'Crates, async e testes',
              resumo: 'Cargo.toml, serde, clap, tokio, axum e cargo test.',
              minutos: 14,
              corpo: `
<h2>Crates</h2>
<p>Bibliotecas em Rust se chamam <strong>crates</strong> e vêm do crates.io.</p>
${trecho(`cargo add serde --features derive
cargo add serde_json
cargo add clap --features derive      # argumentos de linha de comando
cargo add tokio --features full       # runtime assíncrono
cargo add axum                        # servidor web`)}

<h2>serde: JSON</h2>
${trecho(`use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Reserva {
    hospede: String,
    noites: u32,
}

let r: Reserva = serde_json::from_str(r#"{"hospede":"Ana","noites":3}"#)?;
let json = serde_json::to_string_pretty(&r)?;`)}
<p><code>r#"..."#</code> é uma <strong>string crua</strong>: aspas dentro dela não precisam de escape.</p>

<h2>Uma API com axum e tokio</h2>
${trecho(`use axum::{routing::get, Json, Router};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Olá!" }))
        .route("/reserva", get(reserva));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn reserva() -> Json<Reserva> {
    Json(Reserva { hospede: "Ana".into(), noites: 3 })
}`)}

<h2>Testes</h2>
${trecho(`#[cfg(test)]
mod testes {
    use super::*;

    #[test]
    fn sedex_cobra_por_peso() {
        assert_eq!(Sedex.calcular(2.0), 33.0);
    }

    #[test]
    #[should_panic]
    fn divisao_por_zero_quebra() {
        let _ = 1 / std::hint::black_box(0);
    }
}`)}
${trecho(`cargo test
cargo clippy     # o "revisor" do Rust: aponta código que pode ser melhor
cargo fmt        # formata`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o serde?',
                  opcoes: ['Testes', 'Converter structs para JSON (e outros formatos) e de volta', 'Servidor web'],
                  certa: 1,
                  explicacao: 'Serialize e Deserialize via derive.'
                },
                {
                  pergunta: 'O que é o tokio?',
                  opcoes: ['Um banco de dados', 'O runtime que executa código async', 'Um formatador'],
                  certa: 1,
                  explicacao: 'Rust define async/await, mas precisa de um runtime para rodar.'
                },
                {
                  pergunta: 'O que o cargo clippy faz?',
                  opcoes: [
                    'Compila mais rápido',
                    'Aponta padrões de código que podem ser melhorados',
                    'Publica o crate'
                  ],
                  certa: 1,
                  explicacao: 'É um linter com centenas de regras.'
                }
              ]
            },
            {
              id: 'pratica-cli-csv',
              titulo: 'Prática: resumir um CSV na linha de comando',
              resumo: 'clap para argumentos, leitura de arquivo, erros com ? e testes.',
              minutos: 35,
              corpo: `
<p>Arquivo <code>vendas.csv</code> de exemplo:</p>
${trecho(`vendedor,valor
Ana,120.50
Bruno,80
Ana,45.5
Carla,300
Bruno,abc`)}
<h2>Tarefas</h2>
<ol>
  <li>Com o <code>clap</code>, aceite <code>resumo vendas.csv --top 2</code> (top é opcional, padrão 3).</li>
  <li>Leia o arquivo, pule o cabeçalho e some os valores por vendedor.</li>
  <li>Linhas inválidas não param o programa: conte e avise no fim, com o número da linha.</li>
  <li>Imprima o ranking dos N maiores.</li>
  <li>Escreva um teste para a função que interpreta uma linha.</li>
</ol>
${resposta(`
${trecho(`use clap::Parser;
use std::collections::HashMap;
use std::fs;

#[derive(Parser)]
struct Args {
    /// Arquivo CSV com vendedor,valor
    arquivo: String,
    /// Quantos mostrar no ranking
    #[arg(long, default_value_t = 3)]
    top: usize,
}

fn interpretar(linha: &str) -> Option<(&str, f64)> {
    let (vendedor, valor) = linha.split_once(',')?;
    let valor = valor.trim().parse().ok()?;
    Some((vendedor.trim(), valor))
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();
    let conteudo = fs::read_to_string(&args.arquivo)?;

    let mut totais: HashMap<&str, f64> = HashMap::new();
    let mut invalidas = Vec::new();
    for (i, linha) in conteudo.lines().enumerate().skip(1) {
        match interpretar(linha) {
            Some((v, x)) => *totais.entry(v).or_default() += x,
            None => invalidas.push(i + 1),
        }
    }

    let mut ranking: Vec<_> = totais.into_iter().collect();
    ranking.sort_by(|a, b| b.1.total_cmp(&a.1));
    for (pos, (v, x)) in ranking.iter().take(args.top).enumerate() {
        println!("{}. {v:<10} {x:>10.2}", pos + 1);
    }
    if !invalidas.is_empty() {
        eprintln!("{} linha(s) ignorada(s): {:?}", invalidas.len(), invalidas);
    }
    Ok(())
}

#[cfg(test)]
mod testes {
    use super::*;

    #[test]
    fn linha_valida() {
        assert_eq!(interpretar("Ana, 12.5"), Some(("Ana", 12.5)));
    }

    #[test]
    fn linha_invalida() {
        assert_eq!(interpretar("Bruno,abc"), None);
        assert_eq!(interpretar("sem virgula"), None);
    }
}`)}
<p>Os comentários com <code>///</code> viram o texto de ajuda do <code>--help</code>, gerado pelo clap. Dentro de uma função que devolve <code>Option</code>, o <code>?</code> também funciona: em <code>None</code>, devolve <code>None</code>. <code>{v:&lt;10}</code> alinha à esquerda em 10 colunas; <code>{x:&gt;10.2}</code>, à direita com 2 casas.</p>`)}
`,
              quiz: [
                {
                  pergunta: "Numa função que devolve Option, o que faz o ? em linha.split_once(',')?",
                  opcoes: ['Quebra o programa', 'Devolve None se não houver vírgula', 'Ignora a linha e continua'],
                  certa: 1,
                  explicacao: 'O ? funciona com Option e Result.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
