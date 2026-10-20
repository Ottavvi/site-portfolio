// ==========================================
// 1. LÓGICA DO MODO NOTURNO COM MEMÓRIA (LOCALSTORAGE)
// ==========================================
const botaoTema = document.getElementById("botao-tema");
const temaSalvo = localStorage.getItem("modoNoturnoAtivado");

if (temaSalvo === "sim") {
    document.body.classList.add("modo-noturno");
}

if (botaoTema) {
    botaoTema.addEventListener("click", function() {
        document.body.classList.toggle("modo-noturno");
        if (document.body.classList.contains("modo-noturno")) {
            localStorage.setItem("modoNoturnoAtivado", "sim");
        } else {
            localStorage.setItem("modoNoturnoAtivado", "nao");
        }
    });
}

// ==========================================
// 2. MENSAGEM ESPECIAL DE BOAS-VINDAS
// ==========================================
const botaoBoasVindas = document.getElementById("botao-boas-vindas");
if (botaoBoasVindas) {
    botaoBoasVindas.addEventListener("click", function() {
        mostrarNotificacao("Olá, Otávio! Parabéns por estar evoluindo o seu código hoje! 🚀");
    });
}

// ==========================================
// 3. CONTADOR DE CARACTERES EM TEMPO REAL
// ==========================================
const campoMensagem = document.getElementById("campo-mensagem");
const indicadorContador = document.getElementById("contador-caracteres");

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
if (formulario) {
    formulario.addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(formulario);
        const botaoEnvio = formulario.querySelector("button[type='submit']");
        if (botaoEnvio) {
            botaoEnvio.innerText = "Enviando...";
            botaoEnvio.disabled = true;
        }

        fetch("https://web3forms.com", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                mostrarNotificacao("Sua mensagem foi enviada com sucesso! 🚀");
                formulario.reset();
                if (indicadorContador) {
                    indicadorContador.innerText = "0 / 300 caracteres";
                    indicadorContador.classList.remove("limite-atingido");
                }
            } else {
                mostrarNotificacao("O servidor recusou o envio. Verifique sua Access Key.");
            }
        })
        .catch(error => {
            console.error("Erro no fetch:", error);
            mostrarNotificacao("Enviando pelo método alternativo...");
            formulario.submit();
        })
        .finally(() => {
            if (botaoEnvio) {
                botaoEnvio.innerText = "Enviar Mensagem";
                botaoEnvio.disabled = false;
            }
        });
    });
}

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

if (botaoContador && textoNumero) {
    botaoContador.addEventListener("click", function() {
        quantidadeCliques = quantidadeCliques + 1;
        textoNumero.innerText = quantidadeCliques;
        if (quantidadeCliques >= 10) {
            textoNumero.style.color = gerarCorAleatoria();
        }
    });
}

if (botaoZerar && textoNumero) {
    botaoZerar.addEventListener("click", function() {
        quantidadeCliques = 0;
        textoNumero.innerText = quantidadeCliques;
        textoNumero.style.color = "";
    });
}

// ==========================================
// 6. BOTÃO VOLTAR AO TOPO
// ==========================================
const botaoTopo = document.getElementById("botao-topo");
if (botaoTopo) {
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
}

// ==========================================
// 7. MENU RESPONSIVO (HAMBÚRGUER)
// ==========================================
const botaoMenu = document.getElementById("botao-menu-celular");
const linksMenu = document.querySelector(".links-menu");
const todosOsLinks = document.querySelectorAll(".links-menu a");

if (botaoMenu && linksMenu) {
    botaoMenu.addEventListener("click", function() {
        botaoMenu.classList.toggle("aberto");
        linksMenu.classList.toggle("aberto");
    });
}

if (todosOsLinks) {
    todosOsLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            if (botaoMenu) botaoMenu.classList.remove("aberto");
            if (linksMenu) linksMenu.classList.remove("aberto");
        });
    });
}

// ==========================================
// 8. DESTAQUE DINÂMICO NO MENU AO ROLAR A TELA
// ==========================================
if (todosOsLinks && todosOsLinks.length > 0) {
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
}

// ==========================================
// FUNÇÃO AUXILIAR: GERADOR DE NOTIFICAÇÕES TOAST
// ==========================================
function mostrarNotificacao(mensagem) {
    const container = document.getElementById("container-toast");
    if (!container) {
        alert(mensagem); // Fallback caso a div container-toast não exista no HTML
        return;
    }
    
    const novoToast = document.createElement("div");
    novoToast.classList.add("toast");
    novoToast.innerHTML = `✨ <span>${mensagem}</span>`;
    
    container.appendChild(novoToast);
    
    setTimeout(() => {
        novoToast.classList.add("escondendo");
        setTimeout(() => {
            novoToast.remove();
        }, 400);
    }, 4000);
}
