// Trilha de LocalStorage. O editor dá aos exemplos um localStorage separado do resto do site (as chaves ganham o
// prefixo estudos-sandbox: por baixo dos panos), então um clear() num exemplo não apaga o progresso dos estudos.
// Como o resultado roda de novo a cada tecla, o que foi salvo continua lá na próxima execução: dá para ver a
// persistência acontecendo. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'localstorage',
  area: 'Desenvolvimento web',
  titulo: 'LocalStorage',
  sigla: 'LS',
  resumo: 'Guardar dados no navegador: preferências, rascunhos e listas que sobrevivem ao fechar a aba.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Salvar, ler e apagar dados no navegador.',
      modulos: [
        {
          titulo: 'Guardar no navegador',
          itens: [
            {
              id: 'guardar-e-ler',
              titulo: 'Guardar e ler',
              resumo: 'setItem, getItem, removeItem e o que o localStorage é.',
              minutos: 8,
              corpo: `
<p>O <code>localStorage</code> é um pequeno armário de chaves e valores que cada site tem no navegador. O que você guarda lá continua salvo depois de recarregar a página, fechar a aba ou desligar o computador. É perfeito para preferências (tema, idioma), rascunhos e listas simples.</p>

<h2>Os quatro métodos</h2>
${codigo(`<p id="saida"></p>

<script>
  localStorage.setItem('nome', 'Ana');          // guarda
  const nome = localStorage.getItem('nome');      // lê
  localStorage.removeItem('apelido');             // apaga uma chave
  console.log(localStorage.getItem('apelido'));   // null: a chave não existe

  document.querySelector('#saida').textContent = 'Olá, ' + nome;
</script>`)}
<p>Para apagar tudo do site, existe <code>localStorage.clear()</code>. Use com cuidado: apaga também o que outras partes do site guardaram.</p>

<h2>Ele lembra de verdade</h2>
<p>O editor roda o código de novo a cada mudança. Este contador de visitas aumenta toda vez: edite qualquer coisa (um espaço basta) e veja.</p>
${codigo(`<p id="saida"></p>

<script>
  const visitas = Number(localStorage.getItem('visitas') || 0) + 1;
  localStorage.setItem('visitas', visitas);
  document.querySelector('#saida').textContent = \`Você já rodou este código \${visitas} vez(es).\`;
</script>`)}

<h2>Só guarda texto</h2>
<p>Tudo o que entra vira texto. O número 5 volta como <code>'5'</code>, e por isso o exemplo acima usa <code>Number()</code>. Objetos viram o inútil <code>'[object Object]'</code>; a próxima aula mostra como resolver.</p>
${dica('Para ver o que está salvo, abra as ferramentas de desenvolvedor (<kbd>F12</kbd>), aba <strong>Application</strong> (ou <strong>Armazenamento</strong>), item <strong>Local Storage</strong>. Dá para editar e apagar chaves por lá.')}

<h2>De quem é cada armário</h2>
<p>Cada <strong>origem</strong> (protocolo + domínio + porta) tem o seu localStorage. O <code>https://meusite.com</code> não lê o que o <code>https://outrosite.com</code> guardou. Os dados ficam só naquele navegador, naquele aparelho: não vão para o servidor, nem para o celular da pessoa.</p>
`,
              quiz: [
                {
                  pergunta: 'O que getItem devolve para uma chave que não existe?',
                  opcoes: ['undefined', 'null', "''"],
                  certa: 1,
                  explicacao: 'Chave inexistente devolve null. Por isso é comum usar um valor padrão: getItem(x) || 0.'
                },
                {
                  pergunta: 'Você guarda setItem("total", 10). O que getItem("total") devolve?',
                  opcoes: ['10 (número)', "'10' (texto)", 'null'],
                  certa: 1,
                  explicacao: 'O localStorage só guarda texto. Converta de volta com Number().'
                },
                {
                  pergunta: 'Os dados do localStorage aparecem em outro computador da mesma pessoa?',
                  opcoes: ['Sim, sincronizam sozinhos', 'Não: ficam só naquele navegador', 'Só se ela fizer login'],
                  certa: 1,
                  explicacao:
                    'Para sincronizar entre aparelhos, é preciso salvar num servidor (numa conta, por exemplo).'
                }
              ]
            },
            {
              id: 'objetos-com-json',
              titulo: 'Guardar objetos e listas com JSON',
              resumo: 'JSON.stringify, JSON.parse e valores padrão seguros.',
              minutos: 9,
              corpo: `
<p>Para guardar um objeto ou uma lista, transforme em texto com <code>JSON.stringify</code> e, na leitura, de volta com <code>JSON.parse</code>:</p>
${codigo(`<script>
  const preferencias = { tema: 'escuro', fonte: 18, avisos: true };
  localStorage.setItem('preferencias', JSON.stringify(preferencias));

  const lidas = JSON.parse(localStorage.getItem('preferencias'));
  console.log(lidas.tema, lidas.fonte + 2, typeof lidas.avisos);
</script>`)}

<h2>Um valor padrão para a primeira visita</h2>
<p>Na primeira visita, a chave não existe e <code>getItem</code> devolve <code>null</code>. Combine com <code>??</code> para ter um padrão:</p>
${codigo(`<ul id="lista"></ul>

<script>
  const tarefas = JSON.parse(localStorage.getItem('tarefas-exemplo') ?? '[]');
  tarefas.push('Tarefa ' + (tarefas.length + 1));
  localStorage.setItem('tarefas-exemplo', JSON.stringify(tarefas));

  for (const t of tarefas) {
    const li = document.createElement('li');
    li.textContent = t;
    document.querySelector('#lista').append(li);
  }
</script>`)}

<h2>Nunca confie no que está salvo</h2>
<p>A pessoa pode editar o localStorage pelas ferramentas de desenvolvedor, uma versão antiga do seu site pode ter salvo outro formato, ou o navegador pode bloquear o acesso (algumas abas anônimas fazem isso). Ler com <code>try/catch</code> evita que um texto inválido quebre a página inteira:</p>
${codigo(`<script>
  function ler(chave, padrao) {
    try {
      const texto = localStorage.getItem(chave);
      return texto === null ? padrao : JSON.parse(texto);
    } catch {
      return padrao;
    }
  }

  localStorage.setItem('quebrado', '{isso não é json');
  console.log(ler('quebrado', { ok: false }));
  console.log(ler('nao-existe', []));
</script>`)}
${dica('<code>Date</code> não sobrevive ao JSON: vira texto. Guarde a data como texto ISO (<code>data.toISOString()</code>) ou como número (<code>Date.now()</code>) e recrie com <code>new Date(valor)</code> na leitura.')}
`,
              quiz: [
                {
                  pergunta: 'O que localStorage.setItem("x", { a: 1 }) guarda?',
                  opcoes: ['O objeto', "'[object Object]'", '\'{"a":1}\''],
                  certa: 1,
                  explicacao: 'Sem JSON.stringify, o objeto é convertido para texto do jeito errado.'
                },
                {
                  pergunta: 'Por que ler com try/catch?',
                  opcoes: [
                    'Deixa mais rápido',
                    'O texto salvo pode ser inválido ou o acesso pode estar bloqueado',
                    'getItem sempre lança erro'
                  ],
                  certa: 1,
                  explicacao:
                    'JSON.parse lança erro com texto inválido. Melhor cair num valor padrão que quebrar a página.'
                },
                {
                  pergunta: 'Qual o resultado de JSON.parse(null ?? "[]")?',
                  opcoes: ['null', '[] (lista vazia)', 'Erro'],
                  certa: 1,
                  explicacao: 'O ?? troca o null pelo texto "[]", que vira uma lista vazia.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Preferências, rascunhos e uma lista que lembra.',
      modulos: [
        {
          titulo: 'Padrões do dia a dia',
          itens: [
            {
              id: 'preferencias-e-rascunhos',
              titulo: 'Preferências e rascunhos',
              resumo: 'Tema salvo, rascunho automático, sessionStorage e o evento storage.',
              minutos: 11,
              corpo: `
<h2>Lembrar uma preferência</h2>
<p>O padrão é sempre o mesmo: ao abrir, ler e aplicar; ao mudar, salvar.</p>
${codigo(`<style>
  body.escuro { background: #111; color: #eee; }
</style>
<label><input type="checkbox" id="escuro"> Tema escuro</label>

<script>
  const caixa = document.querySelector('#escuro');
  const aplicar = ligado => {
    document.body.classList.toggle('escuro', ligado);
    caixa.checked = ligado;
  };

  aplicar(localStorage.getItem('tema') === 'escuro');

  caixa.addEventListener('change', () => {
    localStorage.setItem('tema', caixa.checked ? 'escuro' : 'claro');
    aplicar(caixa.checked);
  });
</script>`)}
${dica('Para o tema não "piscar" ao carregar, sites reais aplicam a preferência num script pequeno dentro do <code>&lt;head&gt;</code>, antes de o corpo ser desenhado. Este site faz exatamente isso.')}

<h2>Rascunho automático</h2>
<p>Quem já perdeu uma mensagem longa ao fechar a aba sem querer sabe o valor disso. Salve a cada digitação e restaure ao abrir:</p>
${codigo(`<label for="msg">Mensagem</label>
<textarea id="msg" rows="4" cols="40"></textarea>
<p><small id="status"></small></p>

<script>
  const campo = document.querySelector('#msg');
  campo.value = localStorage.getItem('rascunho') ?? '';

  campo.addEventListener('input', () => {
    localStorage.setItem('rascunho', campo.value);
    document.querySelector('#status').textContent = 'Rascunho salvo';
  });
</script>`)}
<p>Escreva algo, depois mude o código (adicione um espaço): o texto volta. Num formulário de verdade, apague o rascunho com <code>removeItem</code> quando a mensagem for enviada.</p>

<h2>sessionStorage</h2>
<p>Tem os mesmos métodos, mas os dados duram só enquanto a aba estiver aberta, e cada aba tem o seu. Serve para coisas como o passo atual de um formulário longo.</p>

<h2>Sincronizar abas</h2>
<p>Quando uma aba muda o localStorage, as <strong>outras</strong> abas do mesmo site recebem o evento <code>storage</code>. Dá para manter o carrinho igual em todas:</p>
${trecho(`window.addEventListener('storage', evento => {
  if (evento.key === 'carrinho') {
    desenharCarrinho(JSON.parse(evento.newValue ?? '[]'));
  }
});`)}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre localStorage e sessionStorage?',
                  opcoes: [
                    'Nenhuma',
                    'O sessionStorage some quando a aba fecha e é separado por aba',
                    'O sessionStorage vai para o servidor'
                  ],
                  certa: 1,
                  explicacao: 'Os métodos são os mesmos; muda quanto tempo os dados duram.'
                },
                {
                  pergunta: 'Quem recebe o evento storage?',
                  opcoes: ['A própria aba que mudou', 'As outras abas do mesmo site', 'O servidor'],
                  certa: 1,
                  explicacao: 'A aba que fez a mudança já sabe dela; as outras são avisadas pelo evento.'
                },
                {
                  pergunta: 'Quando apagar o rascunho de um formulário?',
                  opcoes: ['Nunca', 'Depois que a mensagem for enviada com sucesso', 'A cada tecla'],
                  certa: 1,
                  explicacao: 'Senão, o texto antigo volta na próxima vez que a pessoa abrir o formulário.'
                }
              ]
            },
            {
              id: 'desafio-lista-que-lembra',
              tipo: 'desafio',
              titulo: 'Desafio: lista de compras que lembra',
              resumo: 'Salve a lista no localStorage e mostre de novo ao abrir.',
              minutos: 20,
              enunciado: `
<p>A lista de compras funciona, mas esquece tudo ao recarregar. Faça ela lembrar:</p>
<ul>
  <li>ao adicionar um item, salve a lista inteira na chave <code>compras</code>, como um array JSON de textos;</li>
  <li>ao abrir a página, mostre os itens salvos em <code>compras</code> (se não houver nada, a lista começa vazia);</li>
  <li>o botão <code>#limpar</code> esvazia a lista na tela e apaga a chave.</li>
</ul>
<p>Um dos testes abre uma cópia da página com itens já salvos, para conferir que eles aparecem.</p>`,
              inicial: `<form id="form">
  <label for="item">Item</label>
  <input id="item" required>
  <button>Adicionar</button>
</form>
<ul id="lista"></ul>
<button id="limpar" type="button">Limpar lista</button>

<script>
  const lista = document.querySelector('#lista');
  const campo = document.querySelector('#item');
  let itens = [];

  function desenhar() {
    lista.replaceChildren(...itens.map(texto => {
      const li = document.createElement('li');
      li.textContent = texto;
      return li;
    }));
  }

  document.querySelector('#form').addEventListener('submit', evento => {
    evento.preventDefault();
    itens.push(campo.value.trim());
    campo.value = '';
    desenhar();
  });

  document.querySelector('#limpar').addEventListener('click', () => {
    itens = [];
    desenhar();
  });

  desenhar();
</script>
`,
              testes: [
                [
                  'Adicionar um item salva a lista em compras como JSON',
                  async doc => {
                    const w = doc.defaultView;
                    const antes = doc.querySelectorAll('#lista li').length;
                    doc.querySelector('#item').value = 'Café';
                    doc.querySelector('#form').requestSubmit();
                    const salvo = JSON.parse(w.localStorage.getItem('compras') || 'null');
                    return Array.isArray(salvo) && salvo.length === antes + 1 && salvo.at(-1) === 'Café';
                  }
                ],
                [
                  'Ao abrir, a página mostra os itens salvos',
                  async doc => {
                    const w = doc.defaultView;
                    const anterior = w.localStorage.getItem('compras');
                    w.localStorage.setItem('compras', JSON.stringify(['Pão', 'Leite']));
                    const copia = document.createElement('iframe');
                    copia.sandbox = 'allow-scripts allow-same-origin allow-forms';
                    copia.hidden = true;
                    copia.srcdoc = w.frameElement.srcdoc;
                    const carregou = new Promise(r => (copia.onload = r));
                    document.body.append(copia);
                    await carregou;
                    const textos = [...copia.contentDocument.querySelectorAll('#lista li')].map(li => li.textContent);
                    copia.remove();
                    if (anterior === null) w.localStorage.removeItem('compras');
                    else w.localStorage.setItem('compras', anterior);
                    return textos.join() === 'Pão,Leite';
                  }
                ],
                [
                  'Limpar esvazia a tela e apaga a chave compras',
                  async doc => {
                    const w = doc.defaultView;
                    doc.querySelector('#item').value = 'Chá';
                    doc.querySelector('#form').requestSubmit();
                    const salvou = (w.localStorage.getItem('compras') || '').includes('Chá');
                    doc.querySelector('#limpar').click();
                    return (
                      salvou &&
                      doc.querySelectorAll('#lista li').length === 0 &&
                      w.localStorage.getItem('compras') === null
                    );
                  }
                ]
              ],
              solucao: `<form id="form">
  <label for="item">Item</label>
  <input id="item" required>
  <button>Adicionar</button>
</form>
<ul id="lista"></ul>
<button id="limpar" type="button">Limpar lista</button>

<script>
  const CHAVE = 'compras';
  const lista = document.querySelector('#lista');
  const campo = document.querySelector('#item');

  function carregar() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
    } catch {
      return [];
    }
  }

  let itens = carregar();

  function desenhar() {
    lista.replaceChildren(...itens.map(texto => {
      const li = document.createElement('li');
      li.textContent = texto;
      return li;
    }));
  }

  document.querySelector('#form').addEventListener('submit', evento => {
    evento.preventDefault();
    itens.push(campo.value.trim());
    localStorage.setItem(CHAVE, JSON.stringify(itens));
    campo.value = '';
    desenhar();
  });

  document.querySelector('#limpar').addEventListener('click', () => {
    itens = [];
    localStorage.removeItem(CHAVE);
    desenhar();
  });

  desenhar();
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Limites, segurança, validade e quando usar outra coisa.',
      modulos: [
        {
          titulo: 'Limites e cuidados',
          itens: [
            {
              id: 'limites-e-cuidados',
              titulo: 'Limites, segurança e alternativas',
              resumo: 'Quanto cabe, o que nunca guardar, versões de dados e IndexedDB.',
              minutos: 12,
              corpo: `
<h2>Limites</h2>
<ul>
  <li><strong>Espaço</strong>: em geral, cerca de 5 MB por site. Passar disso lança <code>QuotaExceededError</code> no <code>setItem</code>.</li>
  <li><strong>Síncrono</strong>: cada leitura e escrita trava a página até terminar. Para poucos dados, é imperceptível; para muitos, a página engasga.</li>
  <li><strong>Pode não existir</strong>: em alguns modos privados ou com cookies bloqueados, acessar o localStorage lança erro. Envolva em <code>try/catch</code>.</li>
</ul>

<h2>O que nunca guardar</h2>
<p>Qualquer script que rode na página consegue ler o localStorage inteiro. Se o site tiver uma falha de XSS (um script malicioso injetado), tudo o que estiver lá pode ser roubado. Por isso:</p>
<ul>
  <li>Não guarde senhas, números de cartão ou documentos.</li>
  <li>Tokens de sessão ficam mais protegidos em cookies <code>HttpOnly</code>, que o JavaScript não consegue ler.</li>
  <li>Lembre que em computadores compartilhados o próximo usuário vê o que ficou salvo.</li>
</ul>

<h2>Versão dos dados</h2>
<p>Seu app muda e o formato salvo muda junto. Guardar uma versão permite converter dados antigos em vez de quebrar:</p>
${codigo(`<script>
  // Simula um dado salvo por uma versão antiga do site: só uma lista de textos
  localStorage.setItem('app-dados', JSON.stringify(['Comprar pão']));

  function carregar() {
    const bruto = JSON.parse(localStorage.getItem('app-dados') ?? 'null');
    if (bruto === null) return { versao: 2, tarefas: [] };
    if (Array.isArray(bruto)) {
      // versão 1 → 2: cada tarefa vira um objeto
      return { versao: 2, tarefas: bruto.map(titulo => ({ titulo, feita: false })) };
    }
    return bruto;
  }

  const dados = carregar();
  localStorage.setItem('app-dados', JSON.stringify(dados));
  console.log(dados);
</script>`)}

<h2>Quando usar outra coisa</h2>
<ul>
  <li><strong>IndexedDB</strong>: banco de dados do navegador, assíncrono, com espaço muito maior. Bom para apps offline com muitos registros ou arquivos. A API é verbosa; bibliotecas pequenas como <code>idb-keyval</code> deixam com cara de localStorage.</li>
  <li><strong>Cache Storage</strong>: para guardar respostas de rede (arquivos do site), usado pelos service workers. Aparece na trilha de PWA.</li>
  <li><strong>Um servidor</strong>: quando os dados precisam acompanhar a pessoa em outros aparelhos ou não podem se perder.</li>
</ul>
${dica('Uma ideia que aparece no próximo desafio: o localStorage não tem validade. Se o dado deve expirar (um cache de cotação, por exemplo), guarde junto o momento em que expira e confira na leitura.')}
`,
              quiz: [
                {
                  pergunta: 'Onde guardar um token de sessão de forma mais segura?',
                  opcoes: ['localStorage', 'Num cookie HttpOnly', 'sessionStorage'],
                  certa: 1,
                  explicacao: 'O JavaScript não lê cookies HttpOnly, então um script injetado não consegue roubá-los.'
                },
                {
                  pergunta: 'O que acontece ao passar do limite de espaço?',
                  opcoes: ['O navegador apaga dados antigos', 'setItem lança QuotaExceededError', 'Nada'],
                  certa: 1,
                  explicacao: 'O erro precisa ser tratado: a gravação não acontece.'
                },
                {
                  pergunta: 'Para um app offline com milhares de registros, o mais adequado é:',
                  opcoes: ['localStorage', 'IndexedDB', 'Cookies'],
                  certa: 1,
                  explicacao: 'IndexedDB é assíncrono, guarda objetos e tem muito mais espaço.'
                }
              ]
            },
            {
              id: 'desafio-cache-com-validade',
              tipo: 'desafio',
              titulo: 'Desafio: cache com validade',
              resumo: 'Guarde dados que expiram sozinhos.',
              minutos: 20,
              enunciado: `
<p>Escreva duas funções para guardar dados com prazo de validade (como a cotação do dólar, que fica velha depois de alguns minutos):</p>
<ul>
  <li><code>salvarComValidade(chave, valor, minutos)</code>: guarda o valor (qualquer coisa que vire JSON) e o momento em que ele expira.</li>
  <li><code>lerComValidade(chave)</code>: devolve o valor se ainda estiver válido. Se expirou, <strong>apaga a chave</strong> e devolve <code>null</code>. Se não existe ou o texto salvo for inválido, devolve <code>null</code>.</li>
</ul>
<p>Use <code>Date.now()</code> para saber a hora: os testes "adiantam o relógio" trocando essa função.</p>`,
              inicial: `<script>
  function salvarComValidade(chave, valor, minutos) {
  }

  function lerComValidade(chave) {
  }

  salvarComValidade('cotacao', { dolar: 5.42 }, 10);
  console.log(lerComValidade('cotacao'));
</script>
`,
              testes: [
                [
                  'Um valor recém-salvo é lido de volta (objetos inclusive)',
                  doc => {
                    const w = doc.defaultView;
                    w.eval('salvarComValidade')('teste-a', { dolar: 5.42, lista: [1, 2] }, 10);
                    const lido = w.eval('lerComValidade')('teste-a');
                    return !!lido && lido.dolar === 5.42 && lido.lista[1] === 2;
                  }
                ],
                [
                  'Depois do prazo, devolve null e apaga a chave',
                  doc => {
                    const w = doc.defaultView;
                    const agoraReal = w.Date.now;
                    const inicio = agoraReal.call(w.Date);
                    try {
                      w.eval('salvarComValidade')('teste-b', 'valor', 5);
                      w.Date.now = () => inicio + 4 * 60000;
                      const ainda = w.eval('lerComValidade')('teste-b');
                      w.Date.now = () => inicio + 6 * 60000;
                      const depois = w.eval('lerComValidade')('teste-b');
                      return ainda === 'valor' && depois === null && w.localStorage.getItem('teste-b') === null;
                    } finally {
                      w.Date.now = agoraReal;
                    }
                  }
                ],
                [
                  'Chave inexistente ou texto inválido devolvem null',
                  doc => {
                    const w = doc.defaultView;
                    w.localStorage.setItem('teste-c', '{quebrado');
                    const ler = w.eval('lerComValidade');
                    return ler('nao-existe-mesmo') === null && ler('teste-c') === null;
                  }
                ]
              ],
              solucao: `<script>
  function salvarComValidade(chave, valor, minutos) {
    const expira = Date.now() + minutos * 60 * 1000;
    localStorage.setItem(chave, JSON.stringify({ valor, expira }));
  }

  function lerComValidade(chave) {
    try {
      const salvo = JSON.parse(localStorage.getItem(chave));
      if (!salvo) return null;
      if (Date.now() > salvo.expira) {
        localStorage.removeItem(chave);
        return null;
      }
      return salvo.valor;
    } catch {
      return null;
    }
  }

  salvarComValidade('cotacao', { dolar: 5.42 }, 10);
  console.log(lerComValidade('cotacao'));
</script>`
            }
          ]
        },
        {
          titulo: 'Mais espaço e backup',
          itens: [
            {
              id: 'indexeddb',
              titulo: 'IndexedDB',
              resumo: 'O banco de dados do navegador: assíncrono, com objetos e muito espaço.',
              minutos: 13,
              corpo: `
<p>Quando o localStorage aperta (muitos registros, arquivos, buscas por campo), o próximo passo é o <strong>IndexedDB</strong>: um banco de dados dentro do navegador. Ele guarda objetos de verdade (não só texto), arquivos (<code>Blob</code>), tem índices para buscar e é <strong>assíncrono</strong>, então não trava a página.</p>

<h2>As peças</h2>
<ul>
  <li><strong>Banco</strong>: aberto com <code>indexedDB.open(nome, versao)</code>.</li>
  <li><strong>Object store</strong>: o equivalente a uma tabela. É criado no evento <code>upgradeneeded</code>, que roda quando a versão do banco muda.</li>
  <li><strong>Transação</strong>: toda leitura e escrita acontece dentro de uma, que é <code>readonly</code> ou <code>readwrite</code>.</li>
  <li><strong>Índice</strong>: permite buscar por outro campo além da chave.</li>
</ul>
<p>A API original usa eventos (<code>onsuccess</code>, <code>onerror</code>) e é verbosa. Um pequeno embrulho em Promises deixa tudo com cara de <code>await</code>:</p>
${codigo(`<ul id="lista"></ul>
<script>
  const pedido = req => new Promise((ok, erro) => {
    req.onsuccess = () => ok(req.result);
    req.onerror = () => erro(req.error);
  });

  function abrir() {
    const req = indexedDB.open('exemplo-anotacoes', 1);
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore('notas', { keyPath: 'id', autoIncrement: true });
      store.createIndex('porTag', 'tag');
    };
    return pedido(req);
  }

  (async () => {
    const db = await abrir();

    const escrever = db.transaction('notas', 'readwrite').objectStore('notas');
    await pedido(escrever.add({ texto: 'Comprar café', tag: 'casa', criada: new Date() }));
    await pedido(escrever.add({ texto: 'Revisar o PR', tag: 'trabalho', criada: new Date() }));

    const ler = db.transaction('notas').objectStore('notas');
    const todas = await pedido(ler.getAll());
    const deCasa = await pedido(ler.index('porTag').getAll('casa'));
    console.log(todas.length, 'nota(s) no total;', deCasa.length, 'de casa');
    console.log('A data voltou como Date?', todas[0].criada instanceof Date);

    document.querySelector('#lista').innerHTML = todas.map(n => '<li>' + n.texto + ' (' + n.tag + ')</li>').join('');
    db.close();
  })().catch(e => console.error(e.message));
</script>`)}
<p>Repare que a data volta como <code>Date</code>: o IndexedDB guarda objetos sem passar por JSON. Cada vez que o código roda, duas notas novas são acrescentadas, porque o banco persiste.</p>
${dica('Para uso simples, a biblioteca <strong>idb-keyval</strong> (menos de 1 KB) dá ao IndexedDB a cara do localStorage: <code>await set("chave", valor)</code> e <code>await get("chave")</code>. A biblioteca <strong>idb</strong>, do mesmo autor, embrulha a API completa em Promises.')}

<h2>Mudanças de versão</h2>
<p>Para criar um store ou um índice novo, aumente a versão no <code>open</code>. O <code>upgradeneeded</code> recebe <code>event.oldVersion</code>, e você aplica só os passos que faltam (de 1 para 2, de 2 para 3...), como migrações de banco de dados.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual a principal diferença do IndexedDB para o localStorage?',
                  opcoes: [
                    'Ele é síncrono',
                    'Ele é assíncrono, guarda objetos e arquivos e tem muito mais espaço',
                    'Ele sincroniza entre aparelhos'
                  ],
                  certa: 1,
                  explicacao: 'E tem índices para buscar por campos.'
                },
                {
                  pergunta: 'Onde se criam os object stores?',
                  opcoes: [
                    'Em qualquer transação',
                    'No evento upgradeneeded, ao mudar a versão do banco',
                    'No servidor'
                  ],
                  certa: 1,
                  explicacao: 'A estrutura do banco só muda durante o upgrade de versão.'
                },
                {
                  pergunta: 'Uma data guardada no IndexedDB volta como:',
                  opcoes: ['Texto', 'Date', 'Número'],
                  certa: 1,
                  explicacao: 'Ele usa clonagem estruturada, não JSON.'
                }
              ]
            },
            {
              id: 'exportar-e-importar',
              titulo: 'Backup, cota e persistência',
              resumo: 'Baixar e restaurar os dados num arquivo, e pedir para o navegador não apagar.',
              minutos: 11,
              corpo: `
<p>Dados que vivem só no navegador podem sumir: a pessoa limpa os dados do site, troca de computador, ou o navegador apaga para liberar espaço. Um app que guarda coisas importantes no navegador deve oferecer <strong>backup</strong>.</p>

<h2>Baixar um arquivo</h2>
${codigo(`<button id="baixar">Baixar backup</button>
<script>
  localStorage.setItem('app:tarefas', JSON.stringify(['Estudar', 'Treinar']));
  localStorage.setItem('app:tema', 'escuro');

  document.querySelector('#baixar').addEventListener('click', () => {
    const dados = {};
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      if (chave.startsWith('app:')) dados[chave] = localStorage.getItem(chave);
    }
    const arquivo = new Blob([JSON.stringify({ versao: 1, dados }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(arquivo);
    link.download = 'backup-' + new Date().toISOString().slice(0, 10) + '.json';
    link.click();
    URL.revokeObjectURL(link.href);
  });
</script>`)}

<h2>Restaurar</h2>
<p>Um <code>&lt;input type="file"&gt;</code> entrega o arquivo escolhido, e <code>await arquivo.text()</code> lê o conteúdo. <strong>Valide antes de gravar</strong>: o arquivo pode ser de outro app, de outra versão, ou ter sido editado à mão.</p>
${trecho(`entrada.addEventListener('change', async () => {
  const arquivo = entrada.files[0];
  if (!arquivo) return;
  try {
    const backup = JSON.parse(await arquivo.text());
    if (backup.versao !== 1 || typeof backup.dados !== 'object') throw new Error('Formato desconhecido');
    for (const [chave, valor] of Object.entries(backup.dados)) {
      if (chave.startsWith('app:')) localStorage.setItem(chave, valor);
    }
    location.reload();
  } catch (erro) {
    alert('Este arquivo não é um backup válido: ' + erro.message);
  }
});`)}

<h2>Quanto espaço há, e pedir para não apagar</h2>
${codigo(`<p id="saida">Calculando…</p>
<script>
  (async () => {
    if (!navigator.storage?.estimate) {
      document.querySelector('#saida').textContent = 'Este navegador não informa a cota.';
      return;
    }
    const { usage, quota } = await navigator.storage.estimate();
    const mb = n => (n / 1024 / 1024).toFixed(1) + ' MB';
    const persistente = await navigator.storage.persisted();
    document.querySelector('#saida').textContent =
      \`Usado: \${mb(usage)} de \${mb(quota)}. Armazenamento persistente: \${persistente ? 'sim' : 'não'}.\`;
  })();
</script>`)}
<p>Por padrão, o armazenamento é "melhor esforço": se o disco encher, o navegador pode apagar dados dos sites menos usados. <code>navigator.storage.persist()</code> pede para ele não fazer isso. Alguns navegadores concedem sozinhos para sites instalados ou muito usados; outros perguntam à pessoa.</p>
${dica('O app de finanças e o de ordens de serviço deste portfólio guardam tudo no navegador e têm botões de exportar e restaurar backup, exatamente por esse motivo.')}
`,
              quiz: [
                {
                  pergunta: 'Por que oferecer backup num app que guarda dados no navegador?',
                  opcoes: [
                    'Para ocupar menos espaço',
                    'Os dados podem sumir ao limpar o navegador ou trocar de computador',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'O backup em arquivo é a garantia da pessoa.'
                },
                {
                  pergunta: 'O que fazer antes de gravar os dados de um arquivo de backup?',
                  opcoes: ['Nada', 'Validar o formato e as chaves', 'Apagar tudo'],
                  certa: 1,
                  explicacao: 'O arquivo pode ser de outro app, de outra versão ou ter sido editado.'
                },
                {
                  pergunta: 'Para que serve navigator.storage.persist()?',
                  opcoes: [
                    'Sincronizar com a nuvem',
                    'Pedir que o navegador não apague os dados do site para liberar espaço',
                    'Aumentar a velocidade'
                  ],
                  certa: 1,
                  explicacao: 'Sem ele, o armazenamento é de melhor esforço.'
                }
              ]
            },
            {
              id: 'desafio-backup',
              tipo: 'desafio',
              titulo: 'Desafio: exportar e importar backup',
              resumo: 'Funções de backup com prefixo, versão e validação.',
              minutos: 22,
              enunciado: `
<p>Escreva as duas funções do backup de um app cujas chaves começam com <code>app:</code>:</p>
<ul>
  <li><code>exportarBackup()</code>: devolve um <strong>texto JSON</strong> com <code>versao: 1</code> e <code>dados</code>, um objeto com todas as chaves que começam com <code>app:</code> e seus valores (como estão no localStorage). Chaves de fora do app não entram.</li>
  <li><code>importarBackup(texto)</code>: lê o JSON e grava as chaves de <code>dados</code> que começam com <code>app:</code>, ignorando as outras. Devolve quantas gravou. Se o texto não for JSON, a <code>versao</code> não for 1 ou <code>dados</code> não for um objeto, lança um <code>Error</code> <strong>sem gravar nada</strong>.</li>
</ul>`,
              inicial: `<script>
  function exportarBackup() {
  }

  function importarBackup(texto) {
  }

  localStorage.setItem('app:tema', 'escuro');
  console.log(exportarBackup());
</script>
`,
              testes: [
                [
                  'exportarBackup devolve versao 1 e só as chaves app:',
                  doc => {
                    const ls = doc.defaultView.localStorage;
                    ls.setItem('app:teste-a', '1');
                    ls.setItem('outra-coisa', 'x');
                    const backup = JSON.parse(doc.defaultView.eval('exportarBackup')());
                    ls.removeItem('outra-coisa');
                    return (
                      backup.versao === 1 &&
                      backup.dados['app:teste-a'] === '1' &&
                      !('outra-coisa' in backup.dados) &&
                      Object.keys(backup.dados).every(k => k.startsWith('app:'))
                    );
                  }
                ],
                [
                  'importarBackup grava as chaves app:, ignora as outras e devolve a quantidade',
                  doc => {
                    const ls = doc.defaultView.localStorage;
                    const n = doc.defaultView.eval('importarBackup')(
                      JSON.stringify({ versao: 1, dados: { 'app:x': 'um', 'app:y': 'dois', invasora: 'nao' } })
                    );
                    const ok =
                      n === 2 &&
                      ls.getItem('app:x') === 'um' &&
                      ls.getItem('app:y') === 'dois' &&
                      ls.getItem('invasora') === null;
                    ls.removeItem('app:x');
                    ls.removeItem('app:y');
                    return ok;
                  }
                ],
                [
                  'Arquivo inválido lança erro e não grava nada',
                  doc => {
                    const w = doc.defaultView;
                    const importar = w.eval('importarBackup');
                    const lanca = texto => {
                      try {
                        importar(texto);
                        return false;
                      } catch {
                        return true;
                      }
                    };
                    return (
                      lanca('{quebrado') &&
                      lanca(JSON.stringify({ versao: 2, dados: { 'app:z': '1' } })) &&
                      lanca(JSON.stringify({ versao: 1, dados: 'texto' })) &&
                      w.localStorage.getItem('app:z') === null
                    );
                  }
                ]
              ],
              solucao: `<script>
  const PREFIXO = 'app:';

  function exportarBackup() {
    const dados = {};
    for (let i = 0; i < localStorage.length; i++) {
      const chave = localStorage.key(i);
      if (chave.startsWith(PREFIXO)) dados[chave] = localStorage.getItem(chave);
    }
    return JSON.stringify({ versao: 1, dados });
  }

  function importarBackup(texto) {
    const backup = JSON.parse(texto);                 // texto inválido já lança erro aqui
    if (backup?.versao !== 1) throw new Error('Versão de backup desconhecida');
    if (typeof backup.dados !== 'object' || backup.dados === null) throw new Error('Backup sem dados');

    const validas = Object.entries(backup.dados).filter(([chave]) => chave.startsWith(PREFIXO));
    for (const [chave, valor] of validas) localStorage.setItem(chave, valor);
    return validas.length;
  }

  localStorage.setItem('app:tema', 'escuro');
  console.log(exportarBackup());
</script>`
            }
          ]
        }
      ]
    }
  ]
};
