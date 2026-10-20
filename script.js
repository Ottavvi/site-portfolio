// ==========================================
// 1. MODO NOTURNO COM MEMÓRIA (LOCALSTORAGE)
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
// 3. BARRA DE PROGRESSO DE LEITURA (CORRIGIDO)
// ==========================================
const barraProgresso = document.getElementById("barra-progresso");

function atualizarProgresso() {
  if (!barraProgresso) return;

  const documento = document.documentElement;
  const distancia =
    documento.scrollHeight - window.innerHeight;

  const porcentagem = distancia > 0
    ? (window.scrollY / distancia) * 100
    : 0;

  barraProgresso.style.width =
    `${Math.min(100, Math.max(0, porcentagem))}%`;
}

window.addEventListener("scroll", atualizarProgresso, {
  passive: true
});

window.addEventListener("resize", atualizarProgresso);

atualizarProgresso();

// ==========================================
// 4. EFEITO GLOW DINÂMICO NOS CARDS (CORRIGIDO)
// ==========================================
const cards = document.querySelectorAll(".card-projeto");
cards.forEach(card => {
    card.addEventListener("mousemove", function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
    });
});

// ==========================================
// 5. CONTADOR DE CARACTERES EM TEMPO REAL
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
// 6. FORMULÁRIO DE CONTATO REAL (WEB3FORMS VIA FETCH)
// ==========================================

const formulario = document.getElementById("formulario-contato");

if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const botao = formulario.querySelector(
      'button[type="submit"]'
    );

    if (!formulario.reportValidity()) return;

    const textoOriginal = botao?.textContent;

    if (botao) {
      botao.disabled = true;
      botao.textContent = "Enviando...";
    }

    try {
      const resposta = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: new FormData(formulario),
          headers: {
            Accept: "application/json"
          }
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok || resultado.success !== true) {
        throw new Error(
          resultado.message || "Não foi possível enviar a mensagem."
        );
      }

      mostrarNotificacao("Mensagem enviada com sucesso!");

      formulario.reset();

      const contador = document.getElementById(
        "contador-caracteres"
      );

      if (contador) {
        contador.textContent = "0 / 300 caracteres";
        contador.classList.remove("limite-atingido");
      }
    } catch (erro) {
      console.error("Erro ao enviar formulário:", erro);

      mostrarNotificacao(
        "Não foi possível confirmar o envio. Tente novamente."
      );
    } finally {
      if (botao) {
        botao.disabled = false;
        botao.textContent = textoOriginal || "Enviar Mensagem";
      }
    }
  });
}


// ==========================================
// 7. LÓGICA DO CONTADOR DE CLIQUES
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
// 8. BOTÃO VOLTAR AO TOPO
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
// 9. MENU RESPONSIVO (HAMBÚRGUER)
// ==========================================
const botaoMenu = document.getElementById("botao-menu-celular");
const linksMenu = document.querySelector(".links-menu");
const todosOsLinks = document.querySelectorAll(".links-menu a");

if (botaoMenu && linksMenu) {
  botaoMenu.addEventListener("click", () => {
    const aberto = linksMenu.classList.toggle("aberto");

    botaoMenu.classList.toggle("aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
    botaoMenu.setAttribute(
      "aria-label",
      aberto ? "Fechar menu" : "Abrir menu"
    );
  });

  linksMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      linksMenu.classList.remove("aberto");
      botaoMenu.classList.remove("aberto");
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
    });
  });
}

// ==========================================
// 10. DESTAQUE DINÂMICO NO MENU AO ROLAR A TELA
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
        alert(mensagem);
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
