// Painel do aluno (estudos/), revisão das perguntas erradas (estudos/revisao.html) e certificado
// (estudos/certificado.html). Carregado pelo js/estudos.js só nas páginas que têm um deles; recebe dele o progresso.
// Os dados das aulas vêm de estudos/indice.json e estudos/perguntas.json, gerados pelo ferramentas/gerar-estudos.js.

const RAIZ = new URL('../', document.querySelector('link[href*="css/style.css"]').href);
const ESTUDOS = new URL('estudos/', RAIZ);
const carregarJson = nome => fetch(new URL(nome, ESTUDOS)).then(resposta => resposta.json());

// Depois de cada acerto na revisão a pergunta volta mais tarde: 3, 7 e 14 dias. No quarto acerto seguido, sai da lista
const INTERVALOS = [1, 3, 7, 14];
const ACERTOS_PARA_SAIR = 4;

const dataCurta = iso => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
const dataLonga = iso =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

// Monta um elemento a partir de um HTML curto (os textos variáveis entram depois, com textContent)
function elemento(html) {
  const modelo = document.createElement('template');
  modelo.innerHTML = html.trim();
  return modelo.content.firstElementChild;
}

export async function iniciar(estudos) {
  const indice = await carregarJson('indice.json').catch(() => null);
  if (!indice) return;
  const painel = document.querySelector('[data-painel]');
  const revisao = document.querySelector('[data-revisao]');
  const certificado = document.querySelector('[data-certificado-pagina]');
  if (painel) {
    const desenhar = () => desenharPainel(painel, indice, estudos);
    desenhar();
    // Ao entrar na conta, o progresso dela chega depois: desenha de novo
    document.addEventListener('estudos:atualizou', desenhar);
  }
  if (revisao) iniciarRevisao(revisao, indice, estudos);
  if (certificado) iniciarCertificado(certificado, indice, estudos);
}

// ---------- Contas comuns ----------
const perguntasDoDia = ({ extra, hoje }) =>
  Object.entries(extra.revisao)
    .filter(([, registro]) => !registro.d && registro.p <= hoje())
    .sort(([, a], [, b]) => a.p.localeCompare(b.p));

// Dias seguidos estudando, terminando hoje ou ontem (estudar hoje ainda não é obrigatório para manter a sequência)
function sequencia({ extra, hoje, diaDepois }) {
  let dias = 0;
  let deslocamento = extra.dias[hoje()] ? 0 : -1;
  while (extra.dias[diaDepois(deslocamento)]) {
    dias++;
    deslocamento--;
  }
  return dias;
}

// Próximo item a fazer: na trilha da última aula aberta; se ela acabou, na primeira trilha começada e não terminada;
// se nenhuma foi começada, a primeira aula da primeira trilha
function proximoItem(indice, { feitos, ultimaAula }) {
  const trilhaDe = id => indice.trilhas.find(trilha => trilha.id === id?.split('/')[0]);
  const pendente = trilha => trilha?.itens.find(item => !feitos.has(item.id));
  const candidatas = [
    trilhaDe(ultimaAula()),
    ...indice.trilhas.filter(trilha => trilha.itens.some(item => feitos.has(item.id))),
    ...indice.trilhas
  ];
  for (const trilha of candidatas) {
    const item = pendente(trilha);
    if (item) return { trilha, item };
  }
  return null;
}

// ---------- Painel do aluno (página inicial dos estudos) ----------
function desenharPainel(painel, indice, estudos) {
  const { feitos, extra, hoje, diaDepois } = estudos;
  const todos = indice.trilhas.flatMap(trilha => trilha.itens);
  const feitosValidos = todos.filter(item => feitos.has(item.id));
  const revisarHoje = perguntasDoDia(estudos).length;
  const naRevisao = Object.values(extra.revisao).filter(registro => !registro.d).length;
  // Só aparece para quem já começou alguma coisa
  painel.hidden = !feitosValidos.length && !naRevisao;
  if (painel.hidden) return;

  const conteudo = painel.querySelector('[data-painel-conteudo]');
  conteudo.replaceChildren();

  // Continuar de onde parou
  const proximo = proximoItem(indice, estudos);
  const continuar = elemento(`<div class="painel-cartao painel-continuar">
      <span class="painel-rotulo"></span>
      <strong class="painel-titulo"></strong>
      <small class="painel-detalhe"></small>
      <a class="btn btn-primary" href=""></a>
    </div>`);
  if (proximo) {
    const { trilha, item } = proximo;
    const comecou = trilha.itens.some(i => feitos.has(i.id));
    continuar.querySelector('.painel-rotulo').textContent = comecou ? 'Continuar' : 'Próxima trilha';
    continuar.querySelector('.painel-titulo').textContent = item.titulo;
    continuar.querySelector('.painel-detalhe').textContent =
      `Trilha de ${trilha.titulo} · ${item.nivel} · ${item.tipo === 'desafio' ? 'Desafio' : 'Aula'} · ${item.minutos} min`;
    const link = continuar.querySelector('a');
    link.href = `${item.id}.html`;
    link.textContent = item.tipo === 'desafio' ? 'Ir para o desafio ↘' : 'Ir para a aula ↘';
  } else {
    continuar.querySelector('.painel-rotulo').textContent = 'Tudo pronto';
    continuar.querySelector('.painel-titulo').textContent = 'Você concluiu todas as trilhas disponíveis.';
    continuar.querySelector('.painel-detalhe').textContent =
      'As próximas trilhas aparecem aqui quando ficarem prontas.';
    continuar.querySelector('a').remove();
  }
  conteudo.append(continuar);

  // Números: aulas, desafios, sequência de dias e revisão
  const dias = sequencia(estudos);
  const numeros = elemento(`<ul class="painel-numeros"></ul>`);
  const numero = (valor, texto, href) => {
    const item = elemento(`<li class="painel-cartao painel-numero">${href ? '<a></a>' : '<div></div>'}</li>`);
    const caixa = item.firstElementChild;
    if (href) caixa.href = href;
    caixa.append(elemento('<strong></strong>'), elemento('<span></span>'));
    caixa.querySelector('strong').textContent = valor;
    caixa.querySelector('span').textContent = texto;
    numeros.append(item);
    return caixa;
  };
  numero(feitosValidos.filter(item => item.tipo === 'aula').length, 'aulas concluídas');
  numero(feitosValidos.filter(item => item.tipo === 'desafio').length, 'desafios resolvidos');
  const caixaDias = numero(dias, dias === 1 ? 'dia seguido estudando' : 'dias seguidos estudando');
  // Últimos 14 dias: um quadradinho por dia, aceso nos dias de estudo
  const semanas = elemento('<span class="painel-dias" aria-hidden="true"></span>');
  for (let d = -13; d <= 0; d++) {
    const dia = elemento('<i></i>');
    if (extra.dias[diaDepois(d)]) dia.className = 'aceso';
    semanas.append(dia);
  }
  caixaDias.append(semanas);
  const caixaRevisao = numero(
    revisarHoje,
    revisarHoje === 1 ? 'pergunta para revisar hoje' : 'perguntas para revisar hoje',
    'revisao.html'
  );
  if (revisarHoje) caixaRevisao.classList.add('painel-destaque');
  conteudo.append(numeros);

  // Trilhas começadas: barra, link e certificado
  const comecadas = indice.trilhas.filter(trilha => trilha.itens.some(item => feitos.has(item.id)));
  if (comecadas.length) {
    const lista = elemento('<ul class="painel-trilhas"></ul>');
    for (const trilha of comecadas) {
      const total = trilha.itens.length;
      const feitas = trilha.itens.filter(item => feitos.has(item.id)).length;
      const linha = elemento(`<li class="painel-cartao painel-trilha">
          <span class="trilha-sigla" aria-hidden="true"></span>
          <div class="painel-trilha-texto">
            <a class="painel-trilha-nome" href=""></a>
            <div class="estudos-progresso">
              <div class="estudos-progresso-barra"><span></span></div>
              <span class="estudos-progresso-texto"></span>
            </div>
          </div>
        </li>`);
      linha.querySelector('.trilha-sigla').textContent = trilha.sigla;
      linha.querySelector('.trilha-sigla').classList.toggle('trilha-sigla--longa', trilha.sigla.length > 3);
      const nome = linha.querySelector('.painel-trilha-nome');
      nome.href = `${trilha.id}/`;
      nome.textContent = `Trilha de ${trilha.titulo}`;
      linha.querySelector('.estudos-progresso-barra span').style.width = `${(feitas / total) * 100}%`;
      linha.querySelector('.estudos-progresso-texto').textContent =
        feitas === total ? `Concluída ✓` : `${feitas} de ${total}`;
      if (extra.conclusao[trilha.id]) {
        const link = elemento('<a class="btn btn-ghost painel-certificado">Certificado</a>');
        link.href = `certificado.html?trilha=${trilha.id}`;
        linha.append(link);
      }
      lista.append(linha);
    }
    conteudo.append(lista);
  }
}

// ---------- Revisão (estudos/revisao.html) ----------
async function iniciarRevisao(caixa, indice, estudos) {
  const perguntas = await carregarJson('perguntas.json').catch(() => null);
  if (!perguntas) {
    caixa.innerHTML =
      '<p class="revisao-vazia">Não foi possível carregar as perguntas. Confira a conexão e recarregue.</p>';
    return;
  }
  const itens = new Map(indice.trilhas.flatMap(trilha => trilha.itens.map(item => [item.id, { item, trilha }])));
  // Acha a pergunta de uma chave "html:tabelas:2". Se a aula mudou e ela não existe mais, sai da lista
  const buscar = chave => {
    const [trilha, aula, numero] = chave.split(':');
    const id = `${trilha}/${aula}`;
    const pergunta = perguntas[id]?.[Number(numero)];
    return pergunta && itens.has(id) ? { id, pergunta, ...itens.get(id) } : null;
  };
  const fila = perguntasDoDia(estudos).filter(([chave]) => {
    if (buscar(chave)) return true;
    estudos.salvarExtra({ revisao: { [chave]: { ...estudos.extra.revisao[chave], d: true, t: Date.now() } } });
    return false;
  });

  if (!fila.length) {
    caixa.replaceChildren(mensagemSemRevisao(estudos));
    return;
  }

  const placar = elemento('<p class="revisao-placar"></p>');
  const lista = elemento('<ol class="revisao-lista"></ol>');
  let respondidas = 0;
  const atualizarPlacar = () => {
    placar.textContent =
      respondidas === fila.length
        ? `Revisão de hoje concluída: ${plural(fila.length, 'pergunta', 'perguntas')}. ✓`
        : `${respondidas} de ${plural(fila.length, 'pergunta revisada', 'perguntas revisadas')} hoje.`;
  };

  fila.forEach(([chave, registro], posicao) => {
    const { id, pergunta, item, trilha } = buscar(chave);
    const cartao = elemento(`<li class="quiz revisao-pergunta">
        <a class="revisao-origem" href=""></a>
        <fieldset>
          <legend></legend>
        </fieldset>
        <p class="quiz-retorno" hidden></p>
      </li>`);
    const origem = cartao.querySelector('.revisao-origem');
    origem.href = `${id}.html`;
    origem.textContent = `Trilha de ${trilha.titulo} · ${item.titulo}`;
    cartao.querySelector('legend').textContent = pergunta.pergunta;
    const grupo = cartao.querySelector('fieldset');
    pergunta.opcoes.forEach((opcao, o) => {
      const rotulo = elemento(`<label class="quiz-opcao"><input type="radio" /> <span></span></label>`);
      const entrada = rotulo.querySelector('input');
      entrada.name = `revisao-${posicao}`;
      entrada.value = String(o);
      rotulo.querySelector('span').textContent = opcao;
      grupo.append(rotulo);
    });

    const retorno = cartao.querySelector('.quiz-retorno');
    let primeira = true;
    grupo.addEventListener('change', event => {
      const escolha = event.target;
      const certo = Number(escolha.value) === pergunta.certa;
      escolha.closest('.quiz-opcao').classList.add(certo ? 'certa' : 'errada');
      retorno.hidden = false;
      retorno.className = `quiz-retorno ${certo ? 'certa' : 'errada'}`;
      // Só a primeira tentativa conta para o agendamento
      if (primeira) {
        primeira = false;
        estudos.registrarDia();
        const acertos = certo ? registro.c + 1 : 0;
        const novo = certo
          ? acertos >= ACERTOS_PARA_SAIR
            ? { c: acertos, p: registro.p, d: true }
            : { c: acertos, p: estudos.diaDepois(INTERVALOS[acertos]) }
          : { c: 0, p: estudos.diaDepois(1) };
        estudos.salvarExtra({ revisao: { [chave]: { ...novo, t: Date.now() } } });
        cartao.dataset.proxima = novo.d
          ? 'Acertou de novo: esta pergunta saiu da lista. ✓'
          : certo
            ? `Ela volta em ${plural(INTERVALOS[acertos], 'dia', 'dias')}.`
            : 'Ela volta amanhã.';
      }
      if (certo) {
        retorno.textContent = `Isso! ${pergunta.explicacao} ${cartao.dataset.proxima}`;
        grupo.querySelectorAll('input').forEach(entrada => (entrada.disabled = true));
        cartao.classList.add('respondida');
        respondidas++;
        atualizarPlacar();
      } else {
        retorno.textContent = 'Ainda não. Tente outra alternativa.';
      }
    });
    lista.append(cartao);
  });

  atualizarPlacar();
  caixa.replaceChildren(placar, lista);
}

function mensagemSemRevisao({ extra }) {
  const pendentes = Object.values(extra.revisao).filter(registro => !registro.d);
  const dominadas = Object.values(extra.revisao).filter(registro => registro.d).length;
  const caixa = elemento(`<div class="painel-cartao revisao-vazia-cartao">
      <strong></strong>
      <p></p>
      <a class="btn btn-ghost" href="./">Voltar para as trilhas</a>
    </div>`);
  if (!pendentes.length) {
    caixa.querySelector('strong').textContent = dominadas
      ? `Nenhuma pergunta na fila. ${plural(dominadas, 'pergunta já saiu', 'perguntas já saíram')} da lista. ✓`
      : 'Nenhuma pergunta para revisar.';
    caixa.querySelector('p').textContent =
      'Quando você errar uma pergunta de quiz na primeira tentativa, ela aparece aqui no dia seguinte.';
  } else {
    const proxima = pendentes.map(registro => registro.p).sort()[0];
    caixa.querySelector('strong').textContent = 'Nada para revisar hoje.';
    caixa.querySelector('p').textContent =
      `A próxima revisão é em ${dataCurta(proxima)}. ${plural(pendentes.length, 'pergunta está', 'perguntas estão')} na fila.`;
  }
  return caixa;
}

// ---------- Certificado (estudos/certificado.html?trilha=html) ----------
function iniciarCertificado(pagina, indice, estudos) {
  const caixa = pagina.querySelector('[data-certificado-conteudo]');
  const id = new URLSearchParams(location.search).get('trilha');
  const trilha = indice.trilhas.find(t => t.id === id);
  if (!trilha) {
    caixa.replaceChildren(
      elemento(`<div class="painel-cartao revisao-vazia-cartao">
        <strong>Trilha não encontrada.</strong>
        <p>Abra o certificado pelo painel ou pela página da trilha que você concluiu.</p>
        <a class="btn btn-ghost" href="./">Ver as trilhas</a>
      </div>`)
    );
    return;
  }

  const { feitos, extra } = estudos;
  const feitas = trilha.itens.filter(item => feitos.has(item.id)).length;
  if (!extra.conclusao[trilha.id] && feitas === trilha.itens.length) {
    estudos.salvarExtra({ conclusao: { [trilha.id]: estudos.hoje() } });
  }
  if (!extra.conclusao[trilha.id]) {
    const aviso = elemento(`<div class="painel-cartao revisao-vazia-cartao">
        <strong></strong>
        <p></p>
        <a class="btn btn-primary" href="">Continuar a trilha ↘</a>
      </div>`);
    aviso.querySelector('strong').textContent =
      `O certificado aparece quando a trilha de ${trilha.titulo} estiver completa.`;
    aviso.querySelector('p').textContent =
      `Você concluiu ${feitas} de ${trilha.itens.length} aulas e desafios. Se fez tudo em outro aparelho, entre na sua conta para trazer o progresso.`;
    aviso.querySelector('a').href = `${trilha.id}/`;
    caixa.replaceChildren(aviso);
    // Se o progresso da conta chegar depois e completar a trilha, monta o certificado
    document.addEventListener('estudos:atualizou', () => iniciarCertificado(pagina, indice, estudos), { once: true });
    return;
  }

  const aulas = trilha.itens.filter(item => item.tipo === 'aula').length;
  const desafios = trilha.itens.length - aulas;
  const horas = Math.max(1, Math.round(trilha.itens.reduce((soma, item) => soma + item.minutos, 0) / 60));
  const conteudo = elemento(`<div class="certificado-area">
      <form class="certificado-controles" novalidate>
        <label>
          Nome no certificado
          <input type="text" name="nome" maxlength="80" autocomplete="name" placeholder="Seu nome completo" />
        </label>
        <button class="btn btn-primary" type="submit">Imprimir ou salvar em PDF</button>
        <p class="certificado-nota">
          Na janela de impressão, escolha “Salvar como PDF” para guardar o arquivo. O certificado é montado com o
          progresso salvo no seu navegador ou na sua conta.
        </p>
      </form>
      <article class="certificado" aria-label="Certificado de conclusão">
        <div class="certificado-moldura">
          <p class="certificado-marca">ottavvi<span>.</span>dev · Estudos</p>
          <p class="certificado-rotulo">Certificado de conclusão</p>
          <p class="certificado-texto">Este certificado é concedido a</p>
          <p class="certificado-nome"></p>
          <p class="certificado-texto certificado-descricao"></p>
          <div class="certificado-rodape">
            <div><span>Concluída em</span><strong class="certificado-data"></strong></div>
            <div class="certificado-selo" aria-hidden="true"></div>
            <div><span>Emitido por</span><strong>Otávio · ottavvi.dev</strong></div>
          </div>
        </div>
      </article>
    </div>`);
  conteudo.querySelector('.certificado-selo').textContent = trilha.sigla;
  conteudo.querySelector('.certificado-descricao').textContent =
    `por concluir a Trilha de ${trilha.titulo}, do nível iniciante ao avançado: ` +
    `${plural(aulas, 'aula', 'aulas')} com quiz, ${plural(desafios, 'desafio', 'desafios')} de código ` +
    `e cerca de ${plural(horas, 'hora', 'horas')} de estudo.`;
  conteudo.querySelector('.certificado-data').textContent = dataLonga(extra.conclusao[trilha.id]);

  const campo = conteudo.querySelector('input');
  const nome = conteudo.querySelector('.certificado-nome');
  const escrever = () => {
    nome.textContent = campo.value.trim() || 'Seu nome';
    nome.classList.toggle('vazio', !campo.value.trim());
  };
  campo.value = estudos.nome.ler() || estudos.usuario()?.displayName || '';
  escrever();
  campo.addEventListener('input', () => {
    estudos.nome.gravar(campo.value.trim());
    escrever();
  });
  // A conta pode chegar depois: usa o nome dela se o campo ainda estiver vazio
  document.addEventListener('estudos:atualizou', () => {
    if (!campo.value && estudos.usuario()?.displayName) {
      campo.value = estudos.usuario().displayName;
      escrever();
    }
  });
  conteudo.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    if (!campo.value.trim()) {
      campo.focus();
      campo.setCustomValidity('Escreva o nome que vai no certificado.');
      campo.reportValidity();
      campo.addEventListener('input', () => campo.setCustomValidity(''), { once: true });
      return;
    }
    window.print();
  });

  document.title = `Certificado: Trilha de ${trilha.titulo} | Estudos | Otávio`;
  // Folha deitada, sem margem do navegador: só nesta página
  document.head.append(elemento('<style>@page { size: A4 landscape; margin: 0; }</style>'));
  caixa.replaceChildren(conteudo);
}
