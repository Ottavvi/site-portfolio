// ==========================================
// 1. LÓGICA DO MODO NOTURNO COM MEMÓRIA (LOCALSTORAGE)
// ==========================================
const botaoTema = document.getElementById("botao-tema");

// PASSO A: Sempre que a página carregar, verifica se o usuário já tinha escolhido o tema escuro antes
const temaSalvo = localStorage.getItem("modoNoturnoAtivado");

// Se a resposta na memória for "sim", ativa o modo noturno imediatamente
if (temaSalvo === "sim") {
    document.body.classList.add("modo-noturno");
}

// PASSO B: Escuta o clique do botão para alternar e salvar a nova escolha
botaoTema.addEventListener("click", function() {
    document.body.classList.toggle("modo-noturno");
    
    // Se após o clique o body ficou com a classe modo-noturno, salva "sim" na memória do PC do usuário
    if (document.body.classList.contains("modo-noturno")) {
        localStorage.setItem("modoNoturnoAtivado", "sim");
    } else {
        // Se ficou claro, salva "nao"
        localStorage.setItem("modoNoturnoAtivado", "nao");
    }
});


// ==========================================
// 2. MENSAGEM ESPECIAL DE BOAS-VINDAS
// ==========================================
const botaoBoasVindas = document.getElementById("botao-boas-vindas");
botaoBoasVindas.addEventListener("click", function() {
    alert("Olá, Otávio! Parabéns por estar evoluindo o seu código hoje! 🚀");
});


// ==========================================
// 3. CONTADOR DE CARACTERES EM TEMPO REAL
// ==========================================
const campoMensagem = document.getElementById("campo-mensagem");
const indicadorContador = document.getElementById("contador-caracteres");

// O evento 'input' escuta cada letra digitada, apagada ou colada no campo
campoMensagem.addEventListener("input", function() {
    // Descobre quantas letras foram digitadas atualmente
    const totalLetras = campoMensagem.value.length;
    
    // Atualiza o texto na tela de forma dinâmica
    indicadorContador.innerText = `${totalLetras} / 300 caracteres`;
    
    // Se chegar perto ou atingir o limite de 300...
    if (totalLetras >= 300) {
        indicadorContador.classList.add("limite-atingido"); // Adiciona a classe CSS que deixa vermelho
    } else {
        indicadorContador.classList.remove("limite-atingido"); // Remove o vermelho se ele apagar letras
    }
});


// ==========================================
// 4. FORMULÁRIO DE CONTATO REAL (BLINDADO)
// ==========================================
const formulario = document.getElementById("formulario-contato");
formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(formulario);
    const botaoEnvio = formulario.querySelector("button[type='submit']");
    botaoEnvio.innerText = "Enviando...";
    botaoEnvio.disabled = true;

    fetch("https://web3forms.com", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Sua mensagem foi enviada com sucesso direto para o e-mail do Otávio! 🚀");
            formulario.reset();
            indicadorContador.innerText = "0 / 300 caracteres"; // Reseta o contador visual também
            indicadorContador.classList.remove("limite-atingido");
        } else {
            alert("O servidor recusou o envio. Verifique sua Access Key.");
        }
    })
    .catch(error => {
        console.error("Erro no fetch:", error);
        alert("Enviando pelo método alternativo...");
        formulario.submit();
    })
    .finally(() => {
        botaoEnvio.innerText = "Enviar Mensagem";
        botaoEnvio.disabled = false;
    });
});


// ==========================================
// 5. LÓGICA DO CONTADOR DE CLIQUES ALEATÓRIO
// ==========================================
let quantidadeCliques = 0;
const botaoContador = document.getElementById("botao-contador");
const textoNumero = document.getElementById("numero-cliques");
const botaoZerar = document.getElementById("botao-zerar");

function gerarCorAleatoria() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

botaoContador.addEventListener("click", function() {
    quantidadeCliques = quantidadeCliques + 1;
    textoNumero.innerText = quantidadeCliques;
    if (quantidadeCliques >= 10) {
        textoNumero.style.color = gerarCorAleatoria();
    }
});

botaoZerar.addEventListener("click", function() {
    quantidadeCliques = 0;
    textoNumero.innerText = quantidadeCliques;
    textoNumero.style.color = "";
});


// ==========================================
// 6. BOTÃO VOLTAR AO TOPO
// ==========================================
const botaoTopo = document.getElementById("botao-topo");
window.addEventListener("scroll", function() {
    if (window.scrollY > 300) {
        botaoTopo.classList.add("visivel");
    } else {
        botaoTopo.classList.remove("visivel");
    }
});

botaoTopo.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// ==========================================
// 7. MENU RESPONSIVO (HAMBÚRGUER)
// ==========================================
const botaoMenu = document.getElementById("botao-menu-celular");
const linksMenu = document.querySelector(".links-menu");
const todosOsLinks = document.querySelectorAll(".links-menu a");

botaoMenu.addEventListener("click", function() {
    botaoMenu.classList.toggle("aberto");
    linksMenu.classList.toggle("aberto");
});

todosOsLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        botaoMenu.classList.remove("aberto");
        linksMenu.classList.remove("aberto");
    });
});


// ==========================================
// 8. DESTAQUE DINÂMICO NO MENU AO ROLAR A TELA
// ==========================================

// Criamos um 'Sensor de Tela' (IntersectionObserver)
// Ele fica olhando se a seção correspondente está ocupando espaço visível na visão do usuário
const sensorDeSecoes = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        // Se a seção entrou de forma visível na tela...
        if (entrada.isIntersecting) {
            // Descobre o ID da seção atual (ex: 'projetos' ou 'contato')
            const idSecao = entrada.target.getAttribute("id");
            
            // Procura no menu qual é o link <a> que aponta para o ID dessa seção
            todosOsLinks.forEach(link => {
                if (link.getAttribute("href") === `#${idSecao}`) {
                    link.classList.add("link-ativo"); // Adiciona o destaque azul aceso
                } else {
                    link.classList.remove("link-ativo"); // Apaga o destaque dos outros links
                }
            });
        }
    });
}, {
    rootMargin: "-30% 0px -60% 0px" // Configura o sensor para disparar exatamente quando o bloco estiver no meio da tela
});

// Dizemos ao sensor para espionar os nossos blocos principais que possuem IDs configurados
document.querySelectorAll("#inicio, #projetos, #contato").forEach(secao => {
    sensorDeSecoes.observe(secao);
});
