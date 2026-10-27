// Área de estudos: progresso (no navegador e, para quem entrou, na conta), quiz, editor ao vivo e desafios

const CHAVE_PROGRESSO = 'estudos-progresso';
const lerLocal = chave => {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
};
const gravarLocal = (chave, valor) => {
  try {
    localStorage.setItem(chave, valor);
  } catch {}
};

// ---------- Progresso ----------
const feitos = new Set(JSON.parse(lerLocal(CHAVE_PROGRESSO) || '[]'));
let nuvem = null; // preenchido quando a pessoa está logada: salva cada mudança na conta

function marcar(id, feito) {
  if (feitos.has(id) === feito) return;
  feito ? feitos.add(id) : feitos.delete(id);
  gravarLocal(CHAVE_PROGRESSO, JSON.stringify([...feitos]));
  nuvem?.(id, feito).catch(() => {});
  atualizarTela();
}

function atualizarTela() {
  document
    .querySelectorAll('[data-item]')
    .forEach(item => item.classList.toggle('feito', feitos.has(item.dataset.item)));
  document.querySelectorAll('[data-progresso]').forEach(barra => {
    const ids = barra.dataset.progresso.split(' ');
    const total = ids.filter(id => feitos.has(id)).length;
    barra.querySelector('.estudos-progresso-barra span').style.width = `${(total / ids.length) * 100}%`;
    barra.querySelector('.estudos-progresso-texto').textContent =
      total === ids.length ? `Trilha concluída: ${total} de ${ids.length} ✓` : `${total} de ${ids.length} concluídos`;
  });
  document.querySelectorAll('[data-concluir]').forEach(botao => {
    const feito = feitos.has(botao.dataset.concluir);
    botao.classList.toggle('feito', feito);
    botao.setAttribute('aria-pressed', String(feito));
    botao.textContent = feito ? '✓ Concluído (clique para desmarcar)' : botao.dataset.textoOriginal;
  });
  // "Continuar": leva para o primeiro item ainda não concluído da trilha
  const continuar = document.querySelector('[data-continuar]');
  const pendente = document.querySelector('.trilha-item:not(.feito) a');
  if (continuar && feitos.size) {
    continuar.textContent = pendente ? 'Continuar de onde parei ↘' : 'Rever a trilha ↘';
    if (pendente) continuar.href = pendente.getAttribute('href');
  }
}

document.querySelectorAll('[data-concluir]').forEach(botao => {
  botao.dataset.textoOriginal = botao.textContent.trim();
  botao.addEventListener('click', () => marcar(botao.dataset.concluir, !feitos.has(botao.dataset.concluir)));
});
atualizarTela();

// ---------- Conta: junta o progresso deste navegador com o da conta ----------
const aviso = document.getElementById('estudosConta');
function mostrarConta(usuario) {
  if (!aviso) return;
  if (usuario) {
    aviso.textContent = `Seu progresso está salvo na sua conta (${usuario.email}).`;
    return;
  }
  const raiz = new URL('../', document.querySelector('link[href*="css/style.css"]').href);
  const volta = encodeURIComponent(location.href.replace(raiz.href, '').split('#')[0]);
  aviso.innerHTML = `Seu progresso fica salvo neste navegador.
    <a href="${raiz.href}login.html?volta=${volta}">Entre</a> ou
    <a href="${raiz.href}cadastro.html">crie uma conta</a> para guardar em qualquer aparelho.`;
}
mostrarConta(null);

// O Firebase só é baixado se este navegador já entrou alguma vez (mesma regra do js/auth/session.js)
if (lerLocal('sessao') === '1') conectarConta();

async function conectarConta() {
  const raiz = new URL('../', document.querySelector('link[href*="css/style.css"]').href);
  const [{ auth, db }, { onAuthStateChanged }, firestore] = await Promise.all([
    import(`${raiz.href}js/firebase.js`),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const { doc, getDoc, setDoc, updateDoc, deleteField, FieldPath } = firestore;
  // No Firestore, a barra do id ("html/tabelas") vira dois-pontos ("html:tabelas"), para ser um nome de campo simples
  const campo = id => id.replace('/', ':');
  const id = campoSalvo => campoSalvo.replace(':', '/');

  onAuthStateChanged(auth, async usuario => {
    if (!usuario) {
      nuvem = null;
      mostrarConta(null);
      return;
    }
    const ref = doc(db, 'usuarios', usuario.uid);
    try {
      const remoto = (await getDoc(ref)).data()?.estudos || {};
      const soNoNavegador = [...feitos].filter(item => !remoto[campo(item)]);
      Object.keys(remoto).forEach(item => feitos.add(id(item)));
      gravarLocal(CHAVE_PROGRESSO, JSON.stringify([...feitos]));
      if (soNoNavegador.length) {
        await setDoc(
          ref,
          { estudos: Object.fromEntries(soNoNavegador.map(item => [campo(item), true])) },
          { merge: true }
        );
      }
      nuvem = (item, feito) =>
        feito
          ? setDoc(ref, { estudos: { [campo(item)]: true } }, { merge: true })
          : updateDoc(ref, new FieldPath('estudos', campo(item)), deleteField());
      mostrarConta(usuario);
      atualizarTela();
    } catch {
      // Sem conexão ou sem permissão: continua só com o progresso do navegador
    }
  });
}

// ---------- Quiz ----------
document.querySelectorAll('.quiz').forEach(quiz => {
  const perguntas = [...quiz.querySelectorAll('.quiz-pergunta')];
  const placar = quiz.querySelector('.quiz-placar');
  const concluir = document.querySelector('[data-concluir]');
  perguntas.forEach(pergunta => {
    const retorno = pergunta.querySelector('.quiz-retorno');
    pergunta.addEventListener('change', event => {
      const escolha = event.target;
      const certo = escolha.value === pergunta.dataset.certa;
      escolha.closest('.quiz-opcao').classList.add(certo ? 'certa' : 'errada');
      retorno.hidden = false;
      retorno.className = `quiz-retorno ${certo ? 'certa' : 'errada'}`;
      retorno.textContent = certo ? `Isso! ${pergunta.dataset.explicacao}` : 'Ainda não. Tente outra alternativa.';
      if (certo) {
        pergunta.classList.add('respondida');
        pergunta.querySelectorAll('input').forEach(input => (input.disabled = true));
      }
      const acertos = perguntas.filter(p => p.classList.contains('respondida')).length;
      if (acertos === perguntas.length) {
        placar.textContent = `Você acertou as ${acertos} perguntas. Aula concluída! ✓`;
        if (concluir) marcar(concluir.dataset.concluir, true);
      } else {
        placar.textContent = `${acertos} de ${perguntas.length} certas.`;
      }
    });
  });
});

// ---------- Editor ao vivo ----------
// Estilo básico do resultado, para o HTML sem CSS ficar legível
const ESTILO_RESULTADO = `<style>
  body { font-family: system-ui, sans-serif; line-height: 1.5; margin: 16px; color: #1f2933; }
  img { max-width: 100%; height: auto; }
  table, th, td { border: 1px solid #c5ced6; border-collapse: collapse; padding: 4px 8px; }
  label { display: block; margin-top: 10px; }
  fieldset label, label:has(input[type=checkbox]), label:has(input[type=radio]) { display: inline-block; margin-right: 12px; }
</style>`;

function criarEditor(caixa, { codigoInicial, aoAtualizar, chaveSalva }) {
  const salvo = chaveSalva ? lerLocal(chaveSalva) : null;
  caixa.classList.add('editor');
  caixa.innerHTML = `
    <div class="editor-painel">
      <div class="editor-barra">
        <span>HTML</span>
        <button type="button" class="editor-recomecar">Recomeçar</button>
      </div>
      <textarea spellcheck="false" autocapitalize="off" aria-label="Código HTML (Tab insere espaços; Esc e depois Tab sai do editor)"></textarea>
    </div>
    <div class="editor-painel">
      <div class="editor-barra"><span>Resultado</span></div>
      <iframe sandbox="allow-same-origin allow-forms" title="Resultado do código"></iframe>
    </div>`;
  const campo = caixa.querySelector('textarea');
  const resultado = caixa.querySelector('iframe');
  campo.value = salvo ?? codigoInicial;

  let espera;
  let tabSai = false;
  const desenhar = () => {
    resultado.srcdoc = ESTILO_RESULTADO + campo.value;
  };
  resultado.addEventListener('load', () => {
    const doc = resultado.contentDocument;
    // Formulários no resultado: valida como de verdade, mas não envia para lugar nenhum
    doc.addEventListener('submit', event => {
      event.preventDefault();
      const aviso = doc.createElement('p');
      aviso.textContent = '✓ Formulário válido. (O envio é só uma simulação.)';
      aviso.style.cssText = 'color:#0b7a6f;font-weight:600';
      event.target.after(aviso);
    });
    aoAtualizar?.(doc);
  });
  campo.addEventListener('input', () => {
    clearTimeout(espera);
    espera = setTimeout(() => {
      desenhar();
      if (chaveSalva) gravarLocal(chaveSalva, campo.value);
    }, 300);
  });
  // Tab insere dois espaços; Esc libera o próximo Tab para sair do editor (acessibilidade pelo teclado)
  campo.addEventListener('keydown', event => {
    if (event.key === 'Escape') tabSai = true;
    if (event.key === 'Tab' && !tabSai && !event.shiftKey) {
      event.preventDefault();
      campo.setRangeText('  ', campo.selectionStart, campo.selectionEnd, 'end');
      campo.dispatchEvent(new Event('input'));
    }
    if (event.key !== 'Escape' && event.key !== 'Tab') tabSai = false;
  });
  caixa.querySelector('.editor-recomecar').addEventListener('click', () => {
    campo.value = codigoInicial;
    if (chaveSalva) gravarLocal(chaveSalva, campo.value);
    desenhar();
    campo.focus();
  });
  desenhar();
}

// Botão "Experimente" em cada exemplo de código das aulas
document.querySelectorAll('pre[data-experimente]').forEach(bloco => {
  const codigoDoExemplo = bloco.textContent;
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'aula-experimente';
  botao.textContent = 'Experimente ✎';
  botao.addEventListener('click', () => {
    const caixa = document.createElement('div');
    bloco.replaceWith(caixa);
    criarEditor(caixa, { codigoInicial: codigoDoExemplo });
    caixa.querySelector('textarea').focus();
  });
  bloco.append(botao);
});

// ---------- Desafio: confere o código a cada mudança ----------
const caixaDesafio = document.querySelector('[data-desafio]');
if (caixaDesafio && window.TESTES_DO_DESAFIO) {
  const id = caixaDesafio.dataset.desafio;
  const itens = [...document.querySelectorAll('#desafioTestes [data-teste]')];
  criarEditor(caixaDesafio, {
    codigoInicial: caixaDesafio.querySelector('textarea').value,
    chaveSalva: `estudos-codigo:${id}`,
    aoAtualizar: doc => {
      const resultados = window.TESTES_DO_DESAFIO.map(teste => {
        try {
          return Boolean(teste(doc));
        } catch {
          return false;
        }
      });
      resultados.forEach((passou, i) => itens[i].classList.toggle('passou', passou));
      if (resultados.every(Boolean)) marcar(id, true);
    }
  });
}
