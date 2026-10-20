// ==========================================
// 1. LÓGICA DO MODO NOTURNO REAL
// ==========================================

// Criamos uma caixa chamada 'botaoTema'. 
// O sinal de igual (=) significa "recebe" ou "guarda".
// Procura no HTML pelo botão que tem o ID 'botao-tema' e salva ele nessa variável estável
const botaoTema = document.getElementById("botao-tema");

// Como é uma 'const', eu não posso fazer isso logo abaixo:
// botaoTema = "Agora sou um texto"; -> O navegador daria um erro porque uma const não pode ser reatribuída.

// Mas atenção: você pode mudar as propriedades do elemento que está dentro dela! 
// O elemento em si continua guardado na mesma caixa, nós apenas alteramos um detalhe dele (a classe).
// Escuta quando o usuário clicar no botão do tema
botaoTema.addEventListener("click", function() {
    // O '.toggle()' funciona como um interruptor: se o body não tiver a classe 'modo-noturno', ele coloca.
    // Se o body já tiver a classe 'modo-noturno', ele retira. Isso alterna as cores do CSS automaticamente!
    document.body.classList.toggle("modo-noturno");
});

// ==========================================
// 2. LÓGICA DO BOTÃO DE BOAS-VINDAS
// ==========================================

// Pegamos a nossa variável (a caixa onde guardamos o botão de boas-vindas)
// Procura no HTML pelo botão que tem o ID 'botao-boas-vindas' e guarda na variável
const botaoBoasVindas = document.getElementById("botao-boas-vindas");

// Chamamos o ouvinte. É como dizer: "Botão, fique atento!"
// Primeiro parâmetro: "click" -> o gatilho será o clique do mouse.
// Segundo parâmetro: function() { ... } -> a receita de código que deve ser executada.
// Escuta quando o usuário clicar no botão de boas-vindas
botaoBoasVindas.addEventListener("click", function() {
    // Este bloco de código fica "dormindo". 
    // Ele só vai acordar e rodar quando o gatilho (o clique) for acionado pelo usuário.
    // Abre uma janelinha de alerta flutuante na tela com o texto escolhido
    alert("Olá, Otávio! Parabéns por estar evoluindo o seu código hoje! 🚀");
}); // O parêntese fecha o addEventListener e o ponto e vírgula encerra a instrução.

// ==========================================
// 3. LÓGICA DO FORMULÁRIO DE CONTATO (BLINDADO)
// ==========================================

const formulario = document.getElementById("formulario-contato");

formulario.addEventListener("submit", function(event) {
    // Impede o recarregamento padrão para tentarmos enviar via JavaScript primeiro
    event.preventDefault();
    
    const formData = new FormData(formulario);
    const botaoEnvio = formulario.querySelector("button[type='submit']");
    botaoEnvio.innerText = "Enviando...";
    botaoEnvio.disabled = true;

    // Enviando de forma simples para o Web3Forms
    fetch("https://web3forms.com", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Sua mensagem foi enviada com sucesso direto para o e-mail do Otávio! 🚀");
            formulario.reset();
        } else {
            alert("O servidor recusou o envio. Verifique se sua Access Key está correta.");
        }
    })
    .catch(error => {
        // Mostra o erro exato no painel de desenvolvedor do navegador
        console.error("Erro detalhado do fetch:", error);
        
        // PLANO B: Se o JavaScript der erro de conexão/CORS, enviamos pelo método tradicional do HTML
        alert("Enviando pelo servidor alternativo...");
        formulario.submit(); // Dispara o envio nativo do HTML (a página vai atualizar, mas o e-mail vai chegar!)
    })
    .finally(() => {
        botaoEnvio.innerText = "Enviar Mensagem";
        botaoEnvio.disabled = false;
    });
});

// ==========================================
// 4. LÓGICA DO CONTADOR (MÓDULO UNIFICADO)
// ==========================================

/* 
   NOTA DE APRENDIZADO: O código antigo da Seção 4 foi removido daqui! 
   Agora combinamos a contagem simples com a evolução das cores em um único ouvinte abaixo 
   para evitar que o navegador conte o mesmo clique duas vezes.
*/

// Criamos uma variável usando 'let' (e não 'const') porque esse número VAI mudar e sofrer cálculos.
// Ela começa valendo 0.
let quantidadeCliques = 0;

// Capturamos o botão do contador do HTML e guardamos em uma constante estável
const botaoContador = document.getElementById("botao-contador");

// Capturamos a tag <span> onde o número aparece, para podermos alterar o texto dela depois
const textoNumero = document.getElementById("numero-cliques");

// Captura o botão de zerar do HTML
const botaoZerar = document.getElementById("botao-zerar");

// FUNÇÃO AUXILIAR: Gera uma cor RGB totalmente aleatória
// Uma cor RGB é formada por 3 números de 0 a 255 (Red, Green, Blue)
function gerarCorAleatoria() {
    // O Math.random() gera um número quebrado entre 0 e 1. Multiplicamos por 256 e o Math.floor() arredonda para inteiro.
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    // Retorna o texto formatado como o CSS entende. Exemplo: "rgb(142, 45, 211)"
    return `rgb(${r}, ${g}, ${b})`;
}

// OUVINTE ÚNICO DO BOTÃO CONTADOR: Cuida de somar e aplicar as cores
botaoContador.addEventListener("click", function() {
    // Toda vez que o botão for clicado, somamos +1 ao valor atual da nossa variável
    quantidadeCliques = quantidadeCliques + 1;
    
    // Atualizamos o texto que está dentro do <span> no HTML com o novo valor da variável
    textoNumero.innerText = quantidadeCliques;
    
    // CONDIÇÃO: Se a quantidade de cliques for maior ou igual a 10
    if (quantidadeCliques >= 10) {
        // Altera o estilo da cor do texto diretamente no HTML usando a nossa função de cor aleatória
        textoNumero.style.color = gerarCorAleatoria();
    }
});

// OUVINTE DO BOTÃO ZERAR
botaoZerar.addEventListener("click", function() {
    // 1. Reseta a nossa variável interna de contagem de volta para zero
    quantidadeCliques = 0;
    
    // 2. Atualiza o texto na tela para mostrar o número 0 novamente
    textoNumero.innerText = quantidadeCliques;
    
    // 3. Remove qualquer cor aleatória que tenha sido aplicada, voltando à cor padrão do CSS
    textoNumero.style.color = "";
});

// ==========================================
// 6. LÓGICA DO BOTÃO VOLTAR AO TOPO
// ==========================================

// Captura o botão do topo através do ID
const botaoTopo = document.getElementById("botao-topo");

// Dizemos para a janela inteira do navegador (window) monitorar o ato de rolar a página (scroll)
window.addEventListener("scroll", function() {
    
    // Se a quantidade de pixels rolados para baixo for maior que 300...
    if (window.scrollY > 300) {
        // Adiciona a classe que deixa o botão visível
        botaoTopo.classList.add("visivel");
    } else {
        // Se estiver perto do topo (menor que 300px), remove a classe e esconde o botão
        botaoTopo.classList.remove("visivel");
    }
});

// Adiciona a ação de clique no botão do topo
botaoTopo.addEventListener("click", function() {
    // Faz a janela deslizar de volta para a coordenada X=0, Y=0 (o topo absoluto do site)
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Garante o movimento suave
    });
});
