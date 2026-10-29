// Trilha de Go. Sem editor: o código roda no Go Playground (go.dev/play) ou no computador com o Go instalado
// (go run .). As práticas trazem a resposta escondida para conferir.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'go',
  area: 'Back-end e dados',
  titulo: 'Go',
  sigla: 'Go',
  resumo: 'Simples e rápida: ferramentas de linha de comando, APIs e concorrência com goroutines.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'go run, variáveis, controle, funções e erros.',
      modulos: [
        {
          titulo: 'Primeiros programas',
          itens: [
            {
              id: 'primeiro-programa',
              titulo: 'O primeiro programa',
              resumo: 'Instalar, módulos, package main, fmt e variáveis.',
              minutos: 9,
              corpo: `
<p><strong>Go</strong> (ou Golang) foi criada no Google para ser simples de ler e rápida de compilar e rodar. Docker, Kubernetes e muitas ferramentas de infraestrutura são escritos em Go, e ela é muito usada em APIs que precisam aguentar muito acesso. Para testar sem instalar, use o <strong>Go Playground</strong> (go.dev/play); para instalar, go.dev/dl.</p>
${trecho(`mkdir ola && cd ola
go mod init ola       # cria o go.mod (o módulo)
go run .              # compila e roda
go build              # gera um executável único, sem dependências`)}
${trecho(`// main.go
package main

import "fmt"

func main() {
    nome := "Ana"                // declara e atribui, deduzindo o tipo
    var idade int = 32           // forma longa
    const pi = 3.14159

    fmt.Println("Olá,", nome)
    fmt.Printf("%s tem %d anos\\n", nome, idade)
    total := fmt.Sprintf("R$ %.2f", 19.9*3)
    fmt.Println(total, pi)
}`)}
<ul>
  <li>Todo programa executável tem <code>package main</code> e uma <code>func main()</code>.</li>
  <li><code>:=</code> declara uma variável nova (só dentro de funções). Variáveis sem valor começam com o <strong>valor zero</strong>: <code>0</code>, <code>""</code>, <code>false</code>, <code>nil</code>.</li>
  <li>Variável declarada e não usada é <strong>erro de compilação</strong>, assim como import não usado. Parece chato, mas mantém o código limpo.</li>
  <li><code>gofmt</code> formata o código num estilo único (o editor faz ao salvar): ninguém discute onde vai a chave.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'O que := faz?',
                  opcoes: [
                    'Compara valores',
                    'Declara uma variável nova e atribui, deduzindo o tipo',
                    'Cria uma constante'
                  ],
                  certa: 1,
                  explicacao: 'Para reatribuir uma variável que já existe, use só =.'
                },
                {
                  pergunta: 'O que acontece com uma variável declarada e nunca usada?',
                  opcoes: ['Nada', 'Erro de compilação', 'Aviso amarelo'],
                  certa: 1,
                  explicacao: 'Go não compila com variáveis ou imports sobrando.'
                },
                {
                  pergunta: 'Qual o valor de var n int antes de qualquer atribuição?',
                  opcoes: ['nil', '0', 'Indefinido'],
                  certa: 1,
                  explicacao: 'Todo tipo tem um valor zero.'
                }
              ]
            },
            {
              id: 'controle-funcoes-erros',
              titulo: 'Controle, funções e erros',
              resumo: 'if, for, switch, múltiplos retornos e o padrão if err != nil.',
              minutos: 12,
              corpo: `
<h2>Um só laço: for</h2>
${trecho(`for i := 1; i <= 5; i++ {
    fmt.Println(i)
}

n := 0
for n < 3 {        // o "while" do Go
    n++
}

frutas := []string{"maçã", "banana"}
for i, f := range frutas {
    fmt.Println(i, f)
}`)}

<h2>if e switch</h2>
${trecho(`if idade >= 18 {
    fmt.Println("adulto")
} else {
    fmt.Println("menor")
}

switch dia {
case "sab", "dom":
    fmt.Println("fim de semana")
default:
    fmt.Println("dia útil")
}   // sem break: cada case termina sozinho`)}

<h2>Funções com vários retornos</h2>
${trecho(`func dividir(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("divisão por zero")
    }
    return a / b, nil
}

resultado, err := dividir(10, 0)
if err != nil {
    fmt.Println("Erro:", err)
    return
}
fmt.Println(resultado)`)}
<p>Go não tem exceções para erros comuns: a função devolve o erro como último valor, e quem chama confere com <code>if err != nil</code>. É repetitivo, mas deixa claro em cada linha onde algo pode falhar.</p>
${trecho(`idade, err := strconv.Atoi("32")      // texto para int
if err != nil { /* não era número */ }

if err != nil {
    return fmt.Errorf("lendo configuração: %w", err)   // acrescenta contexto ao erro
}`)}
${dica('Nunca ignore um erro com <code>_</code> (<code>valor, _ := ...</code>) a não ser que você tenha certeza de que ele não pode acontecer. Erros ignorados viram bugs silenciosos.')}
`,
              quiz: [
                {
                  pergunta: 'Como se escreve um "while" em Go?',
                  opcoes: ['while cond { }', 'for cond { }', 'loop cond { }'],
                  certa: 1,
                  explicacao: 'for é o único laço do Go.'
                },
                {
                  pergunta: 'Como as funções em Go costumam avisar que algo deu errado?',
                  opcoes: ['Lançando exceção', 'Devolvendo um error como último valor', 'Imprimindo na tela'],
                  certa: 1,
                  explicacao: 'Quem chama confere com if err != nil.'
                },
                {
                  pergunta: 'Para que serve o %w no fmt.Errorf?',
                  opcoes: [
                    'Formatar em largura',
                    'Embrulhar o erro original, acrescentando contexto',
                    'Ignorar o erro'
                  ],
                  certa: 1,
                  explicacao: 'errors.Is e errors.As ainda encontram o erro original.'
                }
              ]
            },
            {
              id: 'pratica-conversor',
              titulo: 'Prática: conversor na linha de comando',
              resumo: 'Ler argumentos, validar e converter temperaturas e moedas.',
              minutos: 20,
              corpo: `
<h2>Tarefas</h2>
<p>Crie um programa <code>conv</code> que funcione assim:</p>
${trecho(`go run . c2f 30        # 30.0 °C = 86.0 °F
go run . f2c 86        # 86.0 °F = 30.0 °C
go run . brl2usd 100   # usa a cotação da variável de ambiente COTACAO (padrão 5.0)
go run . xyz 1         # erro: conversão desconhecida (código de saída 1)`)}
<ol>
  <li>Leia os argumentos de <code>os.Args</code>; com menos de dois, mostre como usar.</li>
  <li>Converta o número com <code>strconv.ParseFloat</code> e trate o erro.</li>
  <li>Use um <code>switch</code> para escolher a conversão.</li>
  <li>Erros vão para <code>os.Stderr</code> e terminam com <code>os.Exit(1)</code>.</li>
</ol>
${resposta(`
${trecho(`package main

import (
    "fmt"
    "os"
    "strconv"
)

func falhar(msg string) {
    fmt.Fprintln(os.Stderr, msg)
    os.Exit(1)
}

func main() {
    if len(os.Args) < 3 {
        falhar("uso: conv <c2f|f2c|brl2usd> <valor>")
    }
    valor, err := strconv.ParseFloat(os.Args[2], 64)
    if err != nil {
        falhar("valor inválido: " + os.Args[2])
    }

    switch os.Args[1] {
    case "c2f":
        fmt.Printf("%.1f °C = %.1f °F\\n", valor, valor*9/5+32)
    case "f2c":
        fmt.Printf("%.1f °F = %.1f °C\\n", valor, (valor-32)*5/9)
    case "brl2usd":
        cotacao := 5.0
        if c, err := strconv.ParseFloat(os.Getenv("COTACAO"), 64); err == nil && c > 0 {
            cotacao = c
        }
        fmt.Printf("R$ %.2f = US$ %.2f (cotação %.2f)\\n", valor, valor/cotacao, cotacao)
    default:
        falhar("conversão desconhecida: " + os.Args[1])
    }
}`)}
<p><code>os.Args[0]</code> é o nome do programa; os argumentos começam no índice 1. A variável <code>c</code> declarada no <code>if</code> só existe dentro dele, um padrão comum em Go.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que há em os.Args[0]?',
                  opcoes: ['O primeiro argumento', 'O nome (caminho) do próprio programa', 'Vazio'],
                  certa: 1,
                  explicacao: 'Os argumentos do usuário começam em os.Args[1].'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Slices, maps, structs, métodos, interfaces e JSON.',
      modulos: [
        {
          titulo: 'Dados e tipos',
          itens: [
            {
              id: 'slices-maps-structs',
              titulo: 'Slices, maps e structs',
              resumo: 'Coleções, tipos próprios, métodos e ponteiros.',
              minutos: 13,
              corpo: `
<h2>Slices e maps</h2>
${trecho(`precos := []float64{18.5, 27.9}
precos = append(precos, 3.2)         // append devolve o slice novo
fmt.Println(len(precos), precos[1:]) // 3 [27.9 3.2]

estoque := map[string]int{"café": 12}
estoque["arroz"] = 5
qtd, existe := estoque["feijão"]    // 0 false
delete(estoque, "café")`)}

<h2>Structs e métodos</h2>
${trecho(`type Produto struct {
    Nome    string
    Preco   float64
    Estoque int
}

func (p Produto) Total() float64 {          // método com receptor por valor (lê)
    return p.Preco * float64(p.Estoque)
}

func (p *Produto) Repor(qtd int) {           // receptor ponteiro (altera o original)
    p.Estoque += qtd
}

cafe := Produto{Nome: "Café", Preco: 18.5}
cafe.Repor(10)
fmt.Println(cafe.Total())   // 185`)}
<p>Go não tem classes: tem <strong>structs</strong> com <strong>métodos</strong>. Com receptor ponteiro (<code>*Produto</code>), o método altera o original; sem ponteiro, recebe uma cópia. Campos com letra <strong>maiúscula</strong> são públicos (visíveis fora do pacote); minúscula, privados.</p>

<h2>Interfaces implícitas</h2>
${trecho(`type Frete interface {
    Calcular(pesoKg float64) float64
}

type Sedex struct{}
func (Sedex) Calcular(p float64) float64 { return 25 + p*4 }

type Retirada struct{}
func (Retirada) Calcular(float64) float64 { return 0 }

for _, f := range []Frete{Sedex{}, Retirada{}} {
    fmt.Println(f.Calcular(2))
}`)}
<p>Não há <code>implements</code>: um tipo satisfaz uma interface só por ter os métodos. Interfaces pequenas (um ou dois métodos) são o estilo do Go: <code>io.Reader</code>, <code>fmt.Stringer</code>, <code>error</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'Quando usar um receptor ponteiro (*Produto)?',
                  opcoes: ['Sempre', 'Quando o método precisa alterar o original', 'Nunca'],
                  certa: 1,
                  explicacao: 'Com receptor por valor, o método mexe numa cópia.'
                },
                {
                  pergunta: 'Como um tipo implementa uma interface em Go?',
                  opcoes: ['Com implements', 'Tendo os métodos dela, implicitamente', 'Herdando de uma classe'],
                  certa: 1,
                  explicacao: 'Interfaces em Go são satisfeitas implicitamente.'
                },
                {
                  pergunta: 'Um campo chamado nome (minúsculo) numa struct é...',
                  opcoes: ['Público', 'Privado ao pacote', 'Constante'],
                  certa: 1,
                  explicacao: 'A primeira letra define a visibilidade.'
                }
              ]
            },
            {
              id: 'json-e-arquivos',
              titulo: 'JSON, arquivos e testes',
              resumo: 'encoding/json, tags, ler e gravar arquivos e go test.',
              minutos: 13,
              corpo: `
${trecho(`type Reserva struct {
    Hospede string    \`json:"hospede"\`
    Noites  int       \`json:"noites"\`
    Entrada time.Time \`json:"entrada"\`
    Obs     string    \`json:"obs,omitempty"\`   // some do JSON quando vazio
}

// Struct para JSON
r := Reserva{Hospede: "Ana", Noites: 3, Entrada: time.Now()}
dados, err := json.MarshalIndent(r, "", "  ")
if err != nil { log.Fatal(err) }
os.WriteFile("reserva.json", dados, 0644)

// JSON para struct
var lida Reserva
conteudo, err := os.ReadFile("reserva.json")
if err != nil { log.Fatal(err) }
if err := json.Unmarshal(conteudo, &lida); err != nil { log.Fatal(err) }`)}
<p>As <strong>tags</strong> entre crases dizem o nome do campo no JSON. Só campos públicos (maiúsculos) entram no JSON. O <code>&amp;lida</code> passa o endereço, para o <code>Unmarshal</code> preencher a variável.</p>

<h2>Testes</h2>
${trecho(`// frete_test.go (mesmo pacote, nome terminado em _test.go)
func TestSedex(t *testing.T) {
    casos := []struct {
        peso, esperado float64
    }{
        {0, 25},
        {2, 33},
    }
    for _, c := range casos {
        if got := (Sedex{}).Calcular(c.peso); got != c.esperado {
            t.Errorf("Calcular(%v) = %v, esperado %v", c.peso, got, c.esperado)
        }
    }
}`)}
${trecho(`go test ./...        # roda os testes de todos os pacotes
go test -cover ./... # e mostra a cobertura`)}
<p>Esse formato (uma tabela de casos e um laço) é o padrão em Go: acrescentar um caso é acrescentar uma linha.</p>
`,
              quiz: [
                {
                  pergunta: 'Para que serve a tag json:"hospede"?',
                  opcoes: ['Validar o campo', 'Definir o nome do campo no JSON', 'Criptografar'],
                  certa: 1,
                  explicacao: 'Sem tag, o JSON usa o nome do campo em Go.'
                },
                {
                  pergunta: 'Por que json.Unmarshal(conteudo, &lida) usa &?',
                  opcoes: ['Por estilo', 'Para passar o endereço e a função preencher a variável', 'Para copiar'],
                  certa: 1,
                  explicacao: 'Sem o ponteiro, ela receberia uma cópia.'
                },
                {
                  pergunta: 'Como o Go encontra os testes?',
                  opcoes: [
                    'Arquivos _test.go com funções TestXxx(t *testing.T)',
                    'Uma pasta tests/',
                    'Anotações @Test'
                  ],
                  certa: 0,
                  explicacao: 'go test procura esse padrão.'
                }
              ]
            },
            {
              id: 'pratica-tarefas-cli',
              titulo: 'Prática: lista de tarefas no terminal',
              resumo: 'Subcomandos, structs e persistência num arquivo JSON.',
              minutos: 30,
              corpo: `
${trecho(`go run . add "Comprar café"
go run . add "Pagar conta de luz"
go run . list         # [ ] 1 Comprar café / [ ] 2 Pagar conta de luz
go run . done 1
go run . list         # [x] 1 Comprar café ...`)}
<h2>Tarefas</h2>
<ol>
  <li>Struct <code>Tarefa</code> com ID, Titulo, Feita e CriadaEm.</li>
  <li>Funções <code>carregar()</code> e <code>salvar()</code> que leem e gravam <code>tarefas.json</code> (arquivo inexistente = lista vazia).</li>
  <li>Subcomandos <code>add</code>, <code>list</code> e <code>done</code>, com erros claros.</li>
  <li>O ID de uma tarefa nova é o maior ID existente mais 1.</li>
</ol>
${resposta(`
${trecho(`package main

import (
    "encoding/json"
    "errors"
    "fmt"
    "io/fs"
    "os"
    "strconv"
    "time"
)

type Tarefa struct {
    ID       int       \`json:"id"\`
    Titulo   string    \`json:"titulo"\`
    Feita    bool      \`json:"feita"\`
    CriadaEm time.Time \`json:"criada_em"\`
}

const arquivo = "tarefas.json"

func carregar() ([]Tarefa, error) {
    dados, err := os.ReadFile(arquivo)
    if errors.Is(err, fs.ErrNotExist) {
        return nil, nil
    }
    if err != nil {
        return nil, err
    }
    var tarefas []Tarefa
    return tarefas, json.Unmarshal(dados, &tarefas)
}

func salvar(tarefas []Tarefa) error {
    dados, err := json.MarshalIndent(tarefas, "", "  ")
    if err != nil {
        return err
    }
    return os.WriteFile(arquivo, dados, 0644)
}

func executar(args []string) error {
    if len(args) == 0 {
        return errors.New("uso: tarefas add|list|done")
    }
    tarefas, err := carregar()
    if err != nil {
        return fmt.Errorf("lendo %s: %w", arquivo, err)
    }
    switch args[0] {
    case "add":
        if len(args) < 2 {
            return errors.New("informe o título")
        }
        maior := 0
        for _, t := range tarefas {
            maior = max(maior, t.ID)
        }
        tarefas = append(tarefas, Tarefa{ID: maior + 1, Titulo: args[1], CriadaEm: time.Now()})
        return salvar(tarefas)
    case "list":
        for _, t := range tarefas {
            marca := " "
            if t.Feita {
                marca = "x"
            }
            fmt.Printf("[%s] %d %s\\n", marca, t.ID, t.Titulo)
        }
        return nil
    case "done":
        if len(args) < 2 {
            return errors.New("informe o id")
        }
        id, err := strconv.Atoi(args[1])
        if err != nil {
            return fmt.Errorf("id inválido: %s", args[1])
        }
        for i := range tarefas {
            if tarefas[i].ID == id {
                tarefas[i].Feita = true
                return salvar(tarefas)
            }
        }
        return fmt.Errorf("tarefa %d não encontrada", id)
    }
    return fmt.Errorf("comando desconhecido: %s", args[0])
}

func main() {
    if err := executar(os.Args[1:]); err != nil {
        fmt.Fprintln(os.Stderr, "erro:", err)
        os.Exit(1)
    }
}`)}
<p>No <code>done</code>, o laço usa o índice (<code>tarefas[i].Feita = true</code>): com <code>for _, t := range</code>, o <code>t</code> é uma cópia e a mudança se perderia. Separar <code>executar</code> do <code>main</code> deixa a lógica testável, devolvendo erros em vez de sair do programa no meio.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que alterar tarefas[i].Feita e não t.Feita no range?',
                  opcoes: ['Por estilo', 'No range, t é uma cópia do elemento', 't é somente leitura por regra'],
                  certa: 1,
                  explicacao: 'Alterar a cópia não muda o slice.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Goroutines, channels, servidores HTTP e context.',
      modulos: [
        {
          titulo: 'Concorrência e web',
          itens: [
            {
              id: 'goroutines-channels',
              titulo: 'Goroutines e channels',
              resumo: 'go, WaitGroup, channels, select e Mutex.',
              minutos: 14,
              corpo: `
<p>Concorrência é o ponto forte do Go. Uma <strong>goroutine</strong> é uma função rodando ao mesmo tempo que as outras, e custa tão pouco que dá para ter milhares.</p>
${trecho(`func checar(url string, wg *sync.WaitGroup) {
    defer wg.Done()                           // avisa que terminou, aconteça o que acontecer
    resp, err := http.Get(url)
    if err != nil {
        fmt.Println(url, "FORA:", err)
        return
    }
    resp.Body.Close()
    fmt.Println(url, resp.StatusCode)
}

func main() {
    sites := []string{"https://go.dev", "https://github.com", "https://exemplo.invalido"}
    var wg sync.WaitGroup
    for _, s := range sites {
        wg.Add(1)
        go checar(s, &wg)                    // "go" na frente: roda em paralelo
    }
    wg.Wait()                                 // espera todas
}`)}
<p><code>defer</code> agenda uma chamada para o fim da função: ótimo para fechar arquivos e liberar recursos.</p>

<h2>Channels</h2>
<p>"Não se comunique compartilhando memória; compartilhe memória se comunicando." Um <strong>channel</strong> é um cano por onde as goroutines trocam valores:</p>
${trecho(`resultados := make(chan string)

for _, s := range sites {
    go func(url string) {
        resultados <- url + " ok"            // envia
    }(s)
}

for range sites {
    fmt.Println(<-resultados)               // recebe (espera até chegar)
}

select {                                     // espera o que vier primeiro
case r := <-resultados:
    fmt.Println(r)
case <-time.After(2 * time.Second):
    fmt.Println("demorou demais")
}`)}

<h2>Mutex</h2>
${trecho(`var (
    mu    sync.Mutex
    total int
)
mu.Lock()
total++          // só uma goroutine por vez aqui dentro
mu.Unlock()`)}
${dica('Rode os testes com <code>go test -race</code>: o detector de corridas acusa quando duas goroutines mexem na mesma variável sem proteção.')}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o sync.WaitGroup?',
                  opcoes: ['Limitar a velocidade', 'Esperar um grupo de goroutines terminar', 'Trocar mensagens'],
                  certa: 1,
                  explicacao: 'Add antes, Done em cada uma, Wait no fim.'
                },
                {
                  pergunta: 'O que faz <-canal?',
                  opcoes: ['Envia um valor', 'Recebe um valor, esperando se ainda não chegou', 'Fecha o canal'],
                  certa: 1,
                  explicacao: 'canal <- v envia; <-canal recebe.'
                },
                {
                  pergunta: 'O que o select com time.After permite?',
                  opcoes: ['Ordenar resultados', 'Desistir de esperar depois de um tempo', 'Criar goroutines'],
                  certa: 1,
                  explicacao: 'O caso que ficar pronto primeiro ganha.'
                }
              ]
            },
            {
              id: 'servidor-http',
              titulo: 'Servidor HTTP e context',
              resumo: 'net/http, rotas com método, JSON, middleware e cancelamento.',
              minutos: 14,
              corpo: `
<p>A biblioteca padrão do Go já tem um servidor HTTP pronto para produção. Desde o Go 1.22, as rotas aceitam método e parâmetros:</p>
${trecho(`func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /produtos", listar)
    mux.HandleFunc("GET /produtos/{id}", buscar)
    mux.HandleFunc("POST /produtos", criar)

    log.Println("Ouvindo em :8080")
    log.Fatal(http.ListenAndServe(":8080", registrar(mux)))
}

func buscar(w http.ResponseWriter, r *http.Request) {
    id, err := strconv.Atoi(r.PathValue("id"))
    if err != nil {
        http.Error(w, "id inválido", http.StatusBadRequest)
        return
    }
    p, ok := produtos[id]
    if !ok {
        http.NotFound(w, r)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(p)
}

func criar(w http.ResponseWriter, r *http.Request) {
    var p Produto
    if err := json.NewDecoder(r.Body).Decode(&p); err != nil || p.Nome == "" {
        http.Error(w, "JSON inválido", http.StatusBadRequest)
        return
    }
    // ... guardar
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(p)
}`)}
<p>Cada requisição roda na sua própria goroutine: se dois handlers mexem no mesmo <code>map</code>, proteja com um <code>sync.Mutex</code>.</p>

<h2>Middleware</h2>
${trecho(`func registrar(proximo http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        inicio := time.Now()
        proximo.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(inicio))
    })
}`)}

<h2>context: cancelar e limitar tempo</h2>
${trecho(`ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
defer cancel()
req, _ := http.NewRequestWithContext(ctx, "GET", "https://api.lenta.com", nil)
resp, err := http.DefaultClient.Do(req)   // desiste em 3 s, ou se o cliente desconectar`)}
<p>O <code>context</code> leva prazos e cancelamentos por toda a cadeia de chamadas. Funções que fazem rede ou banco recebem um <code>ctx</code> como primeiro parâmetro, por convenção.</p>
`,
              quiz: [
                {
                  pergunta: 'Como ler o {id} da rota "GET /produtos/{id}"?',
                  opcoes: ['r.URL.Query().Get("id")', 'r.PathValue("id")', 'r.Form["id"]'],
                  certa: 1,
                  explicacao: 'PathValue existe desde o Go 1.22.'
                },
                {
                  pergunta: 'Por que proteger um map compartilhado entre handlers?',
                  opcoes: [
                    'Cada requisição roda numa goroutine; acesso simultâneo corrompe o map',
                    'Por estilo',
                    'O map é só leitura'
                  ],
                  certa: 0,
                  explicacao: 'Escrita concorrente num map faz o programa parar com erro.'
                },
                {
                  pergunta: 'Para que serve context.WithTimeout?',
                  opcoes: ['Medir o tempo', 'Cancelar operações que passem de um prazo', 'Atrasar a resposta'],
                  certa: 1,
                  explicacao: 'Quem respeita o ctx para quando ele é cancelado.'
                }
              ]
            },
            {
              id: 'pratica-verificador-links',
              titulo: 'Prática: verificador de links concorrente',
              resumo: 'Checar muitas URLs em paralelo, com limite de workers e timeout.',
              minutos: 35,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Leia URLs de um arquivo (uma por linha) passado como argumento.</li>
  <li>Cheque todas com no máximo 5 ao mesmo tempo (um <strong>pool de workers</strong>).</li>
  <li>Cada requisição tem timeout de 5 segundos (use <code>http.Client{Timeout: ...}</code>).</li>
  <li>Mostre cada resultado (status e tempo) e, no fim, quantas falharam.</li>
  <li>Saia com código 1 se alguma falhou.</li>
</ol>
${resposta(`
${trecho(`package main

import (
    "bufio"
    "fmt"
    "net/http"
    "os"
    "strings"
    "sync"
    "time"
)

type Resultado struct {
    URL    string
    Status int
    Tempo  time.Duration
    Err    error
}

func main() {
    if len(os.Args) < 2 {
        fmt.Fprintln(os.Stderr, "uso: links arquivo.txt")
        os.Exit(2)
    }
    arq, err := os.Open(os.Args[1])
    if err != nil {
        fmt.Fprintln(os.Stderr, err)
        os.Exit(2)
    }
    defer arq.Close()

    var urls []string
    leitor := bufio.NewScanner(arq)
    for leitor.Scan() {
        if l := strings.TrimSpace(leitor.Text()); l != "" {
            urls = append(urls, l)
        }
    }

    cliente := &http.Client{Timeout: 5 * time.Second}
    trabalhos := make(chan string)
    resultados := make(chan Resultado)

    var wg sync.WaitGroup
    for range 5 {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for u := range trabalhos {
                inicio := time.Now()
                resp, err := cliente.Get(u)
                r := Resultado{URL: u, Tempo: time.Since(inicio), Err: err}
                if err == nil {
                    r.Status = resp.StatusCode
                    resp.Body.Close()
                }
                resultados <- r
            }
        }()
    }

    go func() {
        for _, u := range urls {
            trabalhos <- u
        }
        close(trabalhos)      // os workers saem do range
        wg.Wait()
        close(resultados)     // o laço abaixo termina
    }()

    falhas := 0
    for r := range resultados {
        if r.Err != nil || r.Status >= 400 {
            falhas++
            fmt.Printf("FALHA %-40s %v %v\\n", r.URL, r.Status, r.Err)
        } else {
            fmt.Printf("ok    %-40s %d %v\\n", r.URL, r.Status, r.Tempo.Round(time.Millisecond))
        }
    }
    fmt.Printf("%d de %d falharam\\n", falhas, len(urls))
    if falhas > 0 {
        os.Exit(1)
    }
}`)}
<p>O pool tem 5 goroutines lendo do mesmo channel <code>trabalhos</code>: cada URL vai para quem estiver livre. Fechar <code>trabalhos</code> encerra os workers; esperar o <code>WaitGroup</code> e fechar <code>resultados</code> encerra o laço principal. Esse encadeamento de fechamentos é o jeito idiomático de terminar um pipeline em Go.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que acontece com for u := range trabalhos quando o channel é fechado?',
                  opcoes: ['Dá erro', 'O laço termina depois de consumir o que restava', 'Fica esperando para sempre'],
                  certa: 1,
                  explicacao: 'Fechar o channel é o sinal de "não vem mais nada".'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
