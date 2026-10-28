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
const removerLocal = chave => {
  try {
    localStorage.removeItem(chave);
  } catch {}
};

// ---------- Progresso ----------
const feitos = new Set(JSON.parse(lerLocal(CHAVE_PROGRESSO) || '[]'));
let nuvem = null; // preenchido quando a pessoa está logada: salva cada mudança na conta
let usuarioAtual = null; // conta logada (o certificado usa o nome dela)

function marcar(id, feito) {
  if (feitos.has(id) === feito) return;
  feito ? feitos.add(id) : feitos.delete(id);
  gravarLocal(CHAVE_PROGRESSO, JSON.stringify([...feitos]));
  nuvem?.(id, feito).catch(() => {});
  if (feito) registrarDia();
  atualizarTela();
}

// ---------- Dados extras: dias de estudo, perguntas para revisar e trilhas concluídas ----------
// Ficam em "estudos-extra" no navegador e no campo estudosExtra da conta, no formato:
//   dias:      { '2026-10-28': true }                    dias em que a pessoa estudou (para a sequência)
//   revisao:   { 'html:tabelas:2': { c, p, t, d } }       pergunta 2 da aula html/tabelas: c = acertos seguidos
//                                                         na revisão, p = data da próxima, t = quando mudou, d = saiu
//   conclusao: { html: '2026-10-28' }                    data em que cada trilha chegou a 100% (vai no certificado)
const CHAVE_EXTRA = 'estudos-extra';
const hoje = () => new Date().toLocaleDateString('sv-SE'); // AAAA-MM-DD no fuso de quem estuda
const diaDepois = dias => {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toLocaleDateString('sv-SE');
};
const extra = { dias: {}, revisao: {}, conclusao: {} };
try {
  const salvo = JSON.parse(lerLocal(CHAVE_EXTRA) || '{}');
  for (const grupo of Object.keys(extra)) Object.assign(extra[grupo], salvo[grupo]);
} catch {}
let nuvemExtra = null; // como o "nuvem", mas para os dados extras

// Recebe só o que mudou, por exemplo { dias: { '2026-10-28': true } }
function salvarExtra(mudancas) {
  for (const [grupo, valores] of Object.entries(mudancas)) Object.assign(extra[grupo], valores);
  gravarLocal(CHAVE_EXTRA, JSON.stringify(extra));
  nuvemExtra?.(mudancas).catch(() => {});
}
function registrarDia() {
  if (!extra.dias[hoje()]) salvarExtra({ dias: { [hoje()]: true } });
}
// Chave de uma pergunta: id da aula com dois-pontos no lugar da barra (vira nome de campo no Firestore) + número
const chavePergunta = (aula, indice) => `${aula.replace('/', ':')}:${indice}`;

function atualizarTela() {
  document
    .querySelectorAll('[data-item]')
    .forEach(item => item.classList.toggle('feito', feitos.has(item.dataset.item)));
  // Trilha que chegou a 100% guarda a data (uma vez só) e libera o link do certificado
  document.querySelectorAll('[data-trilha][data-progresso]').forEach(barra => {
    const trilha = barra.dataset.trilha;
    const completa = barra.dataset.progresso.split(' ').every(id => feitos.has(id));
    if (completa && !extra.conclusao[trilha]) salvarExtra({ conclusao: { [trilha]: hoje() } });
  });
  document.querySelectorAll('[data-certificado]').forEach(link => {
    link.hidden = !extra.conclusao[link.dataset.certificado];
  });
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
      nuvemExtra = null;
      usuarioAtual = null;
      mostrarConta(null);
      return;
    }
    usuarioAtual = usuario;
    const ref = doc(db, 'usuarios', usuario.uid);
    try {
      const dados = (await getDoc(ref)).data() || {};
      const remoto = dados.estudos || {};
      await juntarExtra(dados.estudosExtra || {}, mudancas => setDoc(ref, { estudosExtra: mudancas }, { merge: true }));
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
      document.dispatchEvent(new Event('estudos:atualizou'));
    } catch {
      // Sem conexão ou sem permissão: continua só com o progresso do navegador
    }
  });
}

// Junta os dados extras deste navegador com os da conta: dias somados, a data de conclusão mais antiga de cada
// trilha e, em cada pergunta da revisão, o registro que mudou por último. Depois grava o resultado nos dois lugares
async function juntarExtra(remoto, gravarNaConta) {
  Object.assign(extra.dias, remoto.dias);
  for (const [trilha, data] of Object.entries(remoto.conclusao || {})) {
    if (!extra.conclusao[trilha] || data < extra.conclusao[trilha]) extra.conclusao[trilha] = data;
  }
  for (const [chave, registro] of Object.entries(remoto.revisao || {})) {
    if (!extra.revisao[chave] || registro.t > extra.revisao[chave].t) extra.revisao[chave] = registro;
  }
  gravarLocal(CHAVE_EXTRA, JSON.stringify(extra));
  await gravarNaConta(extra);
  nuvemExtra = gravarNaConta;
}

// ---------- Quiz ----------
document.querySelectorAll('.quiz').forEach(quiz => {
  const perguntas = [...quiz.querySelectorAll('.quiz-pergunta')];
  const placar = quiz.querySelector('.quiz-placar');
  const concluir = document.querySelector('[data-concluir]');
  perguntas.forEach((pergunta, indice) => {
    const retorno = pergunta.querySelector('.quiz-retorno');
    let tentou = false;
    pergunta.addEventListener('change', event => {
      const escolha = event.target;
      const certo = escolha.value === pergunta.dataset.certa;
      // Errou na primeira tentativa: a pergunta entra (ou volta do começo) na revisão, para amanhã
      if (!tentou) {
        tentou = true;
        registrarDia();
        if (!certo && concluir) {
          salvarExtra({
            revisao: { [chavePergunta(concluir.dataset.concluir, indice)]: { c: 0, p: diaDepois(1), t: Date.now() } }
          });
        }
      }
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
// Estilo básico do resultado, para o HTML sem CSS ficar legível. Vai depois do código, para um <!doctype> escrito
// pela pessoa continuar sendo a primeira linha (senão o navegador entra em modo de compatibilidade). Fica numa
// @layer para perder para qualquer CSS da pessoa, mesmo vindo depois. data-base deixa os desafios de CSS ignorá-lo.
const ESTILO_RESULTADO = `<style data-base>@layer base {
  body { font-family: system-ui, sans-serif; line-height: 1.5; margin: 16px; color: #1f2933; }
  img { max-width: 100%; height: auto; }
  table, th, td { border: 1px solid #c5ced6; border-collapse: collapse; padding: 4px 8px; }
  label { display: block; margin-top: 10px; }
  fieldset label, label:has(input[type=checkbox]), label:has(input[type=radio]) { display: inline-block; margin-right: 12px; }
}</style>`;

// Vai no começo do resultado (logo depois do <!doctype>, se houver): copia console.log e os erros para o painel
// Console embaixo do resultado e guarda tudo em window.__saida, para os testes dos desafios de JavaScript
const CONSOLE_RESULTADO = `<script data-base>(() => {
  const saida = (window.__saida = []);
  const texto = v => {
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.name + ': ' + v.message;
    if (typeof v !== 'object' || v === null) return String(v);
    try { return JSON.stringify(v); } catch { return String(v); }
  };
  const enviar = (tipo, valores) => {
    const linha = valores.map(texto).join(' ');
    saida.push(linha);
    parent.postMessage({ console: tipo, linha }, '*');
  };
  for (const tipo of ['log', 'info', 'warn', 'error']) {
    const original = console[tipo];
    console[tipo] = (...valores) => { enviar(tipo, valores); original.apply(console, valores); };
  }
  addEventListener('error', e => enviar('error', [e.message]));
  addEventListener('unhandledrejection', e => enviar('error', ['Promise rejeitada: ' + texto(e.reason)]));
})();</script>`;
const comConsole = codigo => {
  const doctype = codigo.match(/^s*<!doctype[^>]*>/i);
  return doctype ? doctype[0] + CONSOLE_RESULTADO + codigo.slice(doctype[0].length) : CONSOLE_RESULTADO + codigo;
};

// Um laço infinito trava a aba. A marca fica gravada enquanto o resultado carrega: se ela ainda estiver lá quando
// a página abrir de novo, o código salvo não roda sozinho
const MARCA_RODANDO = 'estudos-rodando';

function criarEditor(caixa, { codigoInicial, aoAtualizar, chaveSalva }) {
  const salvo = chaveSalva ? lerLocal(chaveSalva) : null;
  caixa.classList.add('editor');
  caixa.innerHTML = `
    <div class="editor-painel">
      <div class="editor-barra">
        <span>Código</span>
        <button type="button" class="editor-recomecar">Recomeçar</button>
      </div>
      <textarea spellcheck="false" autocapitalize="off" aria-label="Código (Tab insere espaços; Esc e depois Tab sai do editor)"></textarea>
    </div>
    <div class="editor-painel">
      <div class="editor-barra"><span>Resultado</span></div>
      <iframe sandbox="allow-scripts allow-same-origin allow-forms allow-modals" title="Resultado do código"></iframe>
      <div class="editor-console" hidden>
        <div class="editor-barra"><span>Console</span></div>
        <div class="editor-console-linhas" role="log"></div>
      </div>
    </div>`;
  const campo = caixa.querySelector('textarea');
  const resultado = caixa.querySelector('iframe');
  const painelConsole = caixa.querySelector('.editor-console');
  const linhasConsole = caixa.querySelector('.editor-console-linhas');
  campo.value = salvo ?? codigoInicial;

  const escreverNoConsole = (tipo, linha) => {
    const item = document.createElement('div');
    item.className = `editor-console-linha editor-console-${tipo}`;
    item.textContent = linha;
    linhasConsole.append(item);
    painelConsole.hidden = false;
    linhasConsole.scrollTop = linhasConsole.scrollHeight;
  };
  window.addEventListener('message', event => {
    if (event.source === resultado.contentWindow && event.data?.console) {
      escreverNoConsole(event.data.console, event.data.linha);
    }
  });

  let espera;
  let tabSai = false;
  const desenhar = () => {
    linhasConsole.replaceChildren();
    painelConsole.hidden = true;
    if (chaveSalva) gravarLocal(MARCA_RODANDO, chaveSalva);
    resultado.srcdoc = comConsole(campo.value) + ESTILO_RESULTADO;
  };
  resultado.addEventListener('load', () => {
    if (chaveSalva && lerLocal(MARCA_RODANDO) === chaveSalva) removerLocal(MARCA_RODANDO);
    const doc = resultado.contentDocument;
    // Formulários no resultado: valida como de verdade, mas não envia para lugar nenhum
    doc.addEventListener('submit', event => {
      // Se o JavaScript da página já cuidou do envio, não se mete
      if (event.defaultPrevented) return;
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
  if (chaveSalva && lerLocal(MARCA_RODANDO) === chaveSalva) {
    removerLocal(MARCA_RODANDO);
    escreverNoConsole(
      'warn',
      'Da última vez, este código travou a página (talvez um laço que nunca termina). Ele não rodou agora: corrija e edite para rodar de novo, ou clique em Recomeçar.'
    );
  } else {
    desenhar();
  }
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

// ---------- Última aula aberta (o painel usa para o "continuar de onde parou") ----------
const aulaAberta = document.querySelector('[data-concluir]')?.dataset.concluir;
if (aulaAberta) gravarLocal('estudos-ultima', aulaAberta);

// ---------- Painel, revisão e certificado: só baixa o código nas páginas que têm um deles ----------
if (document.querySelector('[data-painel], [data-revisao], [data-certificado-pagina]')) {
  import('./estudos-paineis.js').then(({ iniciar }) =>
    iniciar({
      feitos,
      extra,
      salvarExtra,
      registrarDia,
      hoje,
      diaDepois,
      chavePergunta,
      ultimaAula: () => lerLocal('estudos-ultima'),
      usuario: () => usuarioAtual,
      nome: { ler: () => lerLocal('estudos-nome'), gravar: valor => gravarLocal('estudos-nome', valor) }
    })
  );
}
