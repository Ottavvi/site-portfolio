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
        }
      ]
    }
  ]
};
