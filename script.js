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

// Trava de segurança: só roda o código se o campo realmente existir na página
if (campoMensagem && indicadorContador) {
    campoMensagem.addEventListener("input", function() {
        const totalLetras = campoMensagem.value.length;
        indicadorContador.innerText = `${totalLetras} / 300 caracteres`;
        
        if (totalLetras >= 300) {
            indicadorContador.classList.add("limite-atingido");
        } else {
            indicadorContador.classList.remove("limite-atingido");
        }
    });
}


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

// ==========================================
// FUNÇÃO AUXILIAR: GERADOR DE NOTIFICAÇÕES TOAST (SUBSTITUTO DO ALERT)
// ==========================================
function mostrarNotificacao(mensagem) {
    const container = document.getElementById("container-toast");
    
    // Cria uma div nova do zero no HTML
    const novoToast = document.createElement("div");
    novoToast.classList.add("toast");
    novoToast.innerHTML = `✨ <span>${mensagem}</span>`;
    
    // Coloca a nova notificação dentro do container invisível
    container.appendChild(novoToast);
    
    // PASSO A: Após 4 segundos, adiciona o efeito de sumir suavemente
    setTimeout(() => {
        novoToast.classList.add("escondendo");
        
        // PASSO B: Após a animação de sumir terminar (0.4s), deleta o elemento do HTML para não pesar
        setTimeout(() => {
            novoToast.remove();
        }, 400);
    }, 4000);
}


// ==========================================
// 1. LÓGICA DO MODO NOTURNO COM MEMÓRIA (LOCALSTORAGE)
// ==========================================
const botaoTema = document.getElementById("botao-tema");
const temaSalvo = localStorage.getItem("modoNoturnoAtivado");

if (temaSalvo === "sim") {
    document.body.classList.add("modo-noturno");
}

botaoTema.addEventListener("click", function() {
    document.body.classList.toggle("modo-noturno");
    
    if (document.body.classList.contains("modo-noturno")) {
        localStorage.setItem("modoNoturnoAtivado", "sim");
        mostrarNotificacao("Modo Escuro ativado!");
    } else {
        localStorage.setItem("modoNoturnoAtivado", "nao");
        mostrarNotificacao("Modo Claro ativado!");
    }
});


// ==========================================
// 2. MENSAGEM ESPECIAL (USANDO O NOVO TOAST)
// ==========================================
const botaoBoasVindas = document.getElementById("botao-boas-vindas");
botaoBoasVindas.addEventListener("click", function() {
    // Trocamos o alert() antigo pelo nosso sistema premium!
    mostrarNotificacao("Olá, Otávio! Continue codificando e evoluindo! 🚀");
});


// ==========================================
// 3. CONTADOR DE CARACTERES EM TEMPO REAL
// ==========================================
const campoMensagem = document.getElementById("campo-mensagem");
const indicadorContador = document.getElementById("contador-caracteres");

campoMensagem.addEventListener("input", function() {
    const totalLetras = campoMensagem.value.length;
    indicadorContador.innerText = `${totalLetras} / 300 caracteres`;
    
    if (totalLetras >= 300) {
        indicadorContador.classList.add("limite-atingido");
    } else {
        indicadorContador.classList.remove("limite-atingido");
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
            mostrarNotificacao("Mensagem enviada com sucesso para o Otávio! 📬");
            formulario.reset();
            indicadorContador.innerText = "0 / 300 caracteres";
            indicadorContador.classList.remove("limite-atingido");
        } else {
            mostrarNotificacao("O servidor recusou o envio. Verifique a Key.");
        }
    })
    .catch(error => {
        console.error("Erro no fetch:", error);
        mostrarNotificacao("Redirecionando para o envio alternativo...");
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
    mostrarNotificacao("Contador zerado!");
});


// ==========================================
// 6. BARRA DE PROGRESSO DE LEITURA E BOTÃO TOPO
// ==========================================
const botaoTopo = document.getElementById("botao-topo");
const barraProgresso = document.getElementById("barra-progresso");

window.addEventListener("scroll", function() {
    // Controle do Botão Voltar ao Topo
    if (window.scrollY > 300) {
        botaoTopo.classList.add("visivel");
    } else {
        botaoTopo.classList.remove("visivel");
    }

    // Cálculo matemático do progresso de leitura
    const pixelRolado = window.scrollY;
    const alturaTotalJanela = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    // Transforma a divisão em uma porcentagem de 0 a 100
    const porcentagemLida = (pixelRolado / alturaTotalJanela) * 100;
    
    // Atualiza a largura da bordinha no menu do topo
    barraProgresso.style.width = `${porcentagemLida}%`;
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
const sensorDeSecoes = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            const idSecao = entrada.target.getAttribute("id");
            todosOsLinks.forEach(link => {
                if (link.getAttribute("href") === `#${idSecao}`) {
                    link.classList.add("link-ativo");
                } else {
                    link.classList.remove("link-ativo");
                }
            });
        }
    });
}, {
    rootMargin: "-30% 0px -60% 0px"
});

document.querySelectorAll("#inicio, #projetos, #contato").forEach(secao => {
    sensorDeSecoes.observe(secao);
});


// ==========================================
// 9. CAPTURADOR DE COORDENADAS PARA O EFEITO LUMINOSO (GLOW NOS CARDS)
// ==========================================
document.querySelectorAll(".card-projeto").forEach(card => {
    // O evento 'mousemove' roda toda vez que o cursor se mexe 1 milímetro dentro do card
    card.addEventListener("mousemove", function(e) {
        // Descobre a posição exata das bordas do card na tela
        const dimensoes = card.getBoundingClientRect();
        
        // Calcula a posição do mouse relativa ao canto superior esquerdo do card
        const x = e.clientX - dimensoes.left;
        const y = e.clientY - dimensoes.top;
        
        // Injeta as coordenadas como variáveis personalizadas diretamente no CSS do card
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
    });
});
