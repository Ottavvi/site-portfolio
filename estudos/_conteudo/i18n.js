// Trilha de i18n (internacionalização). Tudo roda no editor comum: as APIs Intl vêm com o navegador.
// Os testes comparam com o que o próprio Intl produz, para não depender de detalhes como o espaço especial que o
// formato de moeda usa. Atenção: crases e ${ dos exemplos precisam de barra invertida.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'i18n',
  area: 'Desenvolvimento web',
  titulo: 'i18n',
  sigla: 'i18n',
  resumo: 'Sites em vários idiomas: textos, datas, moedas e o que muda além da tradução.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'O que muda num site com mais de um idioma e como organizar os textos.',
      modulos: [
        {
          titulo: 'Vários idiomas',
          itens: [
            {
              id: 'o-que-muda',
              titulo: 'O que muda além da tradução',
              resumo: 'lang, URLs por idioma, hreflang e a escolha do idioma.',
              minutos: 9,
              corpo: `
<p><strong>i18n</strong> é a abreviação de <em>internationalization</em> (um i, 18 letras, um n): preparar o site para funcionar em vários idiomas e regiões. Traduzir os textos é só uma parte. Também mudam:</p>
<ul>
  <li><strong>Formatos</strong>: 1.234,56 no Brasil e 1,234.56 nos Estados Unidos; 28/10/2026 contra 10/28/2026.</li>
  <li><strong>Tamanho dos textos</strong>: alemão e português costumam ser 20% a 35% mais longos que inglês. Um botão que cabe "Save" talvez não caiba "Salvar alterações".</li>
  <li><strong>Plurais</strong>: português tem duas formas (1 item, 2 itens); russo e árabe têm mais.</li>
  <li><strong>Direção</strong>: árabe e hebraico são escritos da direita para a esquerda.</li>
</ul>

<h2>O atributo lang</h2>
<p><code>&lt;html lang="pt-BR"&gt;</code> diz o idioma da página. Leitores de tela usam isso para escolher a pronúncia, o navegador para hifenizar e oferecer tradução, e buscadores para mostrar a página para o público certo. Um trecho em outro idioma ganha o seu próprio <code>lang</code>:</p>
${codigo(`<p>Meu livro favorito é <cite lang="en">The Pragmatic Programmer</cite>.</p>
<p lang="es">Hola, ¿cómo estás?</p>`)}

<h2>Uma URL para cada idioma</h2>
<p>Trocar o idioma só com JavaScript, na mesma URL, esconde as outras versões dos buscadores e impede de compartilhar o link certo. O padrão é uma URL por idioma (<code>/en/sobre</code> ou <code>en.site.com</code>) ligadas entre si com <code>hreflang</code>:</p>
${trecho(`<link rel="alternate" hreflang="pt-BR" href="https://site.com/sobre">
<link rel="alternate" hreflang="en" href="https://site.com/en/about">
<link rel="alternate" hreflang="x-default" href="https://site.com/sobre">`)}
<p>Este portfólio faz exatamente isso: cada página em português tem a irmã em <code>/en/</code>.</p>

<h2>Qual idioma mostrar</h2>
<p>O navegador informa a preferência da pessoa em <code>navigator.languages</code>. Use isso como sugestão, nunca como prisão: sempre deixe um seletor de idioma visível, porque a pessoa pode estar no computador de outra.</p>
${codigo(`<p id="saida"></p>
<script>
  const disponiveis = ['pt', 'en', 'es'];
  const preferido = navigator.languages
    .map(l => l.slice(0, 2))
    .find(l => disponiveis.includes(l)) ?? 'pt';
  document.querySelector('#saida').textContent =
    \`Seu navegador prefere: \${navigator.languages.join(', ')}. Mostraríamos: \${preferido}\`;
</script>`)}
${dica('No seletor de idioma, escreva cada idioma no próprio idioma ("English", "Español"), e não com bandeiras: bandeira é país, não idioma. Português do Brasil e de Portugal, por exemplo, usariam bandeiras diferentes.')}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o atributo lang no <html>?',
                  opcoes: [
                    'Traduzir a página automaticamente',
                    'Dizer o idioma para leitores de tela, navegadores e buscadores',
                    'Mudar a fonte'
                  ],
                  certa: 1,
                  explicacao: 'O leitor de tela, por exemplo, escolhe a pronúncia por ele.'
                },
                {
                  pergunta: 'Por que ter uma URL por idioma?',
                  opcoes: [
                    'É obrigatório no HTML',
                    'Buscadores encontram cada versão e o link compartilhado abre no idioma certo',
                    'Fica mais rápido'
                  ],
                  certa: 1,
                  explicacao: 'Com o idioma só no JavaScript, as outras versões ficam invisíveis.'
                },
                {
                  pergunta: 'Por que evitar bandeiras no seletor de idioma?',
                  opcoes: ['São pesadas', 'Bandeira representa país, não idioma', 'Não funcionam no celular'],
                  certa: 1,
                  explicacao: 'Espanhol é falado em mais de 20 países; qual bandeira usar?'
                }
              ]
            },
            {
              id: 'dicionarios-de-texto',
              titulo: 'Dicionários de texto',
              resumo: 'Tirar os textos do código, chaves, variáveis e idioma de reserva.',
              minutos: 11,
              corpo: `
<p>O primeiro passo é <strong>tirar os textos do código</strong>. Cada texto ganha uma chave, e cada idioma tem um dicionário com as mesmas chaves:</p>
${codigo(`<h1 data-i18n="titulo"></h1>
<p data-i18n="boasVindas"></p>
<button data-i18n="botao"></button>
<p>
  <button data-idioma="pt">Português</button>
  <button data-idioma="en">English</button>
</p>

<script>
  const textos = {
    pt: { titulo: 'Loja de café', boasVindas: 'Bem-vindo! Escolha o seu café.', botao: 'Comprar' },
    en: { titulo: 'Coffee shop', boasVindas: 'Welcome! Pick your coffee.', botao: 'Buy' }
  };

  function aplicar(idioma) {
    document.documentElement.lang = idioma;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = textos[idioma][el.dataset.i18n];
    });
  }

  document.querySelectorAll('[data-idioma]').forEach(b =>
    b.addEventListener('click', () => aplicar(b.dataset.idioma))
  );
  aplicar('pt');
</script>`)}

<h2>Variáveis no meio do texto</h2>
<p>Nunca monte frases juntando pedaços: a ordem das palavras muda entre idiomas. Coloque marcadores no texto e troque na hora de usar:</p>
${codigo(`<script>
  const textos = {
    pt: { pedido: 'Olá, {nome}! Seu pedido nº {numero} saiu para entrega.' },
    en: { pedido: 'Hi {nome}! Your order #{numero} is on its way.' }
  };

  function t(idioma, chave, vars = {}) {
    const modelo = textos[idioma]?.[chave] ?? textos.pt[chave] ?? chave;
    return modelo.replace(/\\{(\\w+)\\}/g, (_, nome) => vars[nome] ?? \`{\${nome}}\`);
  }

  console.log(t('pt', 'pedido', { nome: 'Ana', numero: 42 }));
  console.log(t('en', 'pedido', { nome: 'Ana', numero: 42 }));
</script>`)}

<h2>Idioma de reserva</h2>
<p>Sempre vai faltar alguma tradução. A função acima cai para o português (o idioma "base") e, em último caso, mostra a própria chave, o que torna o esquecimento fácil de achar na tela. Em projetos grandes, um script que compara as chaves dos dicionários aponta o que falta antes de publicar.</p>
${dica('Bibliotecas como <strong>i18next</strong> (JavaScript) e <strong>react-intl</strong> (React) fazem tudo isso e mais. Entender a versão caseira ajuda a usar qualquer uma delas.')}
`,
              quiz: [
                {
                  pergunta: "Por que não montar 'Olá, ' + nome + '!' em código?",
                  opcoes: [
                    'É mais lento',
                    'A ordem das palavras muda entre idiomas; o texto inteiro precisa ser traduzível',
                    'Não funciona com acentos'
                  ],
                  certa: 1,
                  explicacao: 'Com um marcador {nome}, o tradutor pode colocá-lo onde a língua pede.'
                },
                {
                  pergunta: 'O que a função deve fazer quando falta uma tradução?',
                  opcoes: ['Dar erro', 'Usar o idioma de reserva (e, em último caso, a chave)', 'Deixar vazio'],
                  certa: 1,
                  explicacao: 'Vazio esconde o problema; a chave na tela facilita achar o que falta.'
                },
                {
                  pergunta: 'O que document.documentElement.lang = "en" muda?',
                  opcoes: ['Traduz a página', 'O atributo lang do <html>', 'A URL'],
                  certa: 1,
                  explicacao: 'Ao trocar o idioma, atualize o lang também, para leitores de tela e o navegador.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Números, moedas, datas e tempo relativo com a API Intl.',
      modulos: [
        {
          titulo: 'Formatos com Intl',
          itens: [
            {
              id: 'intl-numeros-e-datas',
              titulo: 'Números, moedas e datas',
              resumo: 'Intl.NumberFormat, DateTimeFormat e RelativeTimeFormat.',
              minutos: 12,
              corpo: `
<p>O JavaScript já vem com a API <strong>Intl</strong>, que conhece os formatos de centenas de idiomas e regiões. Nada de escrever <code>.replace('.', ',')</code> à mão.</p>

<h2>Números e moedas</h2>
${codigo(`<script>
  const valor = 1234567.891;
  console.log(new Intl.NumberFormat('pt-BR').format(valor));
  console.log(new Intl.NumberFormat('en-US').format(valor));
  console.log(new Intl.NumberFormat('de-DE').format(valor));

  const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const dolar = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  console.log(real.format(49.9), dolar.format(49.9));

  console.log(new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 }).format(0.1234));
  console.log(new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(2500000));
</script>`)}
<p>Repare que o idioma (<code>pt-BR</code>) e a moeda (<code>BRL</code>) são coisas separadas: alguém nos EUA pode ver um preço em reais com o formato americano. Crie o formatador uma vez e reaproveite: criar é a parte cara.</p>
${dica('O formato de moeda usa um espaço especial que não quebra linha entre "R$" e o número. Comparar com <code>"R$ 49,90"</code> digitado à mão dá diferente. Nos testes, compare com o que o próprio <code>Intl</code> produz.')}

<h2>Datas</h2>
${codigo(`<script>
  const data = new Date('2026-10-28T14:30:00');

  console.log(new Intl.DateTimeFormat('pt-BR').format(data));
  console.log(new Intl.DateTimeFormat('en-US').format(data));
  console.log(new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full', timeStyle: 'short' }).format(data));
  console.log(new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).format(data));
  console.log(data.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }));
</script>`)}
<p>As opções descrevem <strong>o que mostrar</strong> (dia, mês por extenso...), e o Intl decide a ordem e a pontuação de cada idioma. <code>toLocaleDateString</code> e <code>toLocaleString</code> são atalhos para o mesmo.</p>

<h2>Fuso horário</h2>
<p>Um <code>Date</code> é um instante no tempo, sem fuso. O fuso entra só na hora de mostrar. A opção <code>timeZone</code> mostra o mesmo instante em outro lugar:</p>
${codigo(`<script>
  const voo = new Date('2026-12-20T15:00:00Z'); // Z = horário universal (UTC)
  for (const fuso of ['America/Sao_Paulo', 'Europe/Lisbon', 'Asia/Tokyo']) {
    console.log(fuso, new Intl.DateTimeFormat('pt-BR', { timeZone: fuso, timeStyle: 'short', dateStyle: 'short' }).format(voo));
  }
</script>`)}

<h2>Tempo relativo</h2>
${codigo(`<script>
  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
  console.log(rtf.format(-1, 'day'), '|', rtf.format(2, 'week'), '|', rtf.format(-3, 'hour'));
  console.log(new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-1, 'day'));
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'Como mostrar 1234.5 no formato brasileiro?',
                  opcoes: [
                    "valor.toString().replace('.', ',')",
                    "new Intl.NumberFormat('pt-BR').format(valor)",
                    "valor.toFixed('pt-BR')"
                  ],
                  certa: 1,
                  explicacao: 'O Intl cuida do separador de milhar e do decimal: 1.234,5.'
                },
                {
                  pergunta: 'O que a opção timeZone muda?',
                  opcoes: ['O instante guardado', 'Só como o instante é mostrado', 'O idioma'],
                  certa: 1,
                  explicacao: 'O Date é o mesmo; muda a hora "de parede" exibida.'
                },
                {
                  pergunta: "O que rtf.format(-1, 'day') mostra com numeric: 'auto' em pt-BR?",
                  opcoes: ['há 1 dia', 'ontem', '-1 dia'],
                  certa: 1,
                  explicacao: "Com 'auto', ele usa palavras como ontem, amanhã e semana passada."
                }
              ]
            },
            {
              id: 'desafio-formatos',
              tipo: 'desafio',
              titulo: 'Desafio: vitrine internacional',
              resumo: 'Formate preços, datas e prazos em qualquer idioma.',
              minutos: 18,
              enunciado: `
<p>A loja vai vender para fora. Escreva três funções com <code>Intl</code> (os testes usam vários idiomas):</p>
<ul>
  <li><code>formatarPreco(valor, idioma, moeda)</code>: o valor no formato de moeda daquele idioma.</li>
  <li><code>formatarData(textoISO, idioma)</code>: recebe <code>'2026-12-24'</code> e devolve a data com <code>dateStyle: 'long'</code>, no fuso <code>'UTC'</code> (para o dia não mudar conforme o fuso de quem abre).</li>
  <li><code>prazo(dias, idioma)</code>: tempo relativo em dias com <code>numeric: 'auto'</code> (0 vira "hoje", 1 vira "amanhã").</li>
</ul>`,
              inicial: `<ul id="vitrine"></ul>

<script>
  function formatarPreco(valor, idioma, moeda) {
  }

  function formatarData(textoISO, idioma) {
  }

  function prazo(dias, idioma) {
  }

  for (const idioma of ['pt-BR', 'en-US', 'de-DE']) {
    const li = document.createElement('li');
    li.textContent = [formatarPreco(1299.9, idioma, 'BRL'), formatarData('2026-12-24', idioma), prazo(3, idioma)].join(' · ');
    document.querySelector('#vitrine').append(li);
  }
</script>
`,
              testes: [
                [
                  'formatarPreco usa o formato de moeda do idioma',
                  doc => {
                    const w = doc.defaultView;
                    const f = w.eval('formatarPreco');
                    const esperado = (v, i, m) =>
                      new w.Intl.NumberFormat(i, { style: 'currency', currency: m }).format(v);
                    return (
                      f(1299.9, 'pt-BR', 'BRL') === esperado(1299.9, 'pt-BR', 'BRL') &&
                      f(15, 'en-US', 'USD') === esperado(15, 'en-US', 'USD') &&
                      f(2.5, 'de-DE', 'EUR') === esperado(2.5, 'de-DE', 'EUR')
                    );
                  }
                ],
                [
                  'formatarData usa dateStyle long no fuso UTC',
                  doc => {
                    const w = doc.defaultView;
                    const f = w.eval('formatarData');
                    const esperado = (t, i) =>
                      new w.Intl.DateTimeFormat(i, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(t));
                    return (
                      f('2026-12-24', 'pt-BR') === esperado('2026-12-24', 'pt-BR') &&
                      f('2027-01-01', 'en-US') === esperado('2027-01-01', 'en-US')
                    );
                  }
                ],
                [
                  'prazo diz hoje, amanhã e em N dias',
                  doc => {
                    const f = doc.defaultView.eval('prazo');
                    return (
                      f(0, 'pt-BR') === 'hoje' &&
                      f(1, 'pt-BR') === 'amanhã' &&
                      f(5, 'pt-BR') === 'em 5 dias' &&
                      f(1, 'en') === 'tomorrow'
                    );
                  }
                ]
              ],
              solucao: `<ul id="vitrine"></ul>

<script>
  function formatarPreco(valor, idioma, moeda) {
    return new Intl.NumberFormat(idioma, { style: 'currency', currency: moeda }).format(valor);
  }

  function formatarData(textoISO, idioma) {
    return new Intl.DateTimeFormat(idioma, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(textoISO));
  }

  function prazo(dias, idioma) {
    return new Intl.RelativeTimeFormat(idioma, { numeric: 'auto' }).format(dias, 'day');
  }

  for (const idioma of ['pt-BR', 'en-US', 'de-DE']) {
    const li = document.createElement('li');
    li.textContent = [formatarPreco(1299.9, idioma, 'BRL'), formatarData('2026-12-24', idioma), prazo(3, idioma)].join(' · ');
    document.querySelector('#vitrine').append(li);
  }
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Plurais, listas, ordenação com acentos e escrita da direita para a esquerda.',
      modulos: [
        {
          titulo: 'Regras de cada língua',
          itens: [
            {
              id: 'plurais-ordem-e-direcao',
              titulo: 'Plurais, ordem e direção',
              resumo: 'PluralRules, ListFormat, Collator e dir="rtl".',
              minutos: 13,
              corpo: `
<h2>Plurais</h2>
<p><code>quantidade === 1 ? 'item' : 'itens'</code> funciona em português e inglês, mas não em muitas línguas. O <code>Intl.PluralRules</code> diz qual <strong>categoria</strong> de plural um número usa naquele idioma (<code>zero</code>, <code>one</code>, <code>two</code>, <code>few</code>, <code>many</code> ou <code>other</code>), e o dicionário tem um texto por categoria:</p>
${codigo(`<script>
  const formas = {
    pt: { one: '{n} item no carrinho', other: '{n} itens no carrinho' },
    en: { one: '{n} item in your cart', other: '{n} items in your cart' }
  };

  function itens(n, idioma) {
    const categoria = new Intl.PluralRules(idioma).select(n);
    return (formas[idioma][categoria] ?? formas[idioma].other).replace('{n}', n);
  }

  for (const n of [0, 1, 2, 5]) console.log(itens(n, 'pt'), '|', itens(n, 'en'));

  // Algumas línguas têm mais categorias:
  const pl = new Intl.PluralRules('pl');
  console.log('polonês:', [1, 2, 5, 22].map(n => n + '→' + pl.select(n)).join(' '));
</script>`)}
<p>Repare no zero: em inglês ele é "other" ("0 items"), mas no português do Brasil (e no francês) cai em "one" e vira "0 item". No português de Portugal, volta a ser "other". É exatamente o tipo de regra que ninguém lembra de cabeça.</p>

<h2>Listas</h2>
${codigo(`<script>
  const sabores = ['café', 'chocolate', 'baunilha'];
  console.log(new Intl.ListFormat('pt-BR', { type: 'conjunction' }).format(sabores));
  console.log(new Intl.ListFormat('en', { type: 'conjunction' }).format(sabores));
  console.log(new Intl.ListFormat('pt-BR', { type: 'disjunction' }).format(sabores));
</script>`)}

<h2>Ordenar com acentos</h2>
<p>O <code>sort()</code> padrão compara códigos de caractere: maiúsculas vêm antes das minúsculas, e "Ávila" vai parar depois de "Zé". O <code>Intl.Collator</code> ordena como um dicionário daquela língua:</p>
${codigo(`<script>
  const nomes = ['Zé', 'ana', 'Ávila', 'Bruno', 'Álvaro', 'arthur'];
  console.log([...nomes].sort().join(', '));
  console.log([...nomes].sort(new Intl.Collator('pt-BR').compare).join(', '));

  // Busca que ignora acento e maiúsculas
  const igual = new Intl.Collator('pt-BR', { sensitivity: 'base' }).compare;
  console.log(igual('avila', 'Ávila') === 0);
</script>`)}

<h2>Direita para a esquerda</h2>
<p>Em árabe, hebraico e persa, <code>&lt;html dir="rtl"&gt;</code> inverte a direção do texto e do layout. Para o CSS acompanhar, use <strong>propriedades lógicas</strong>: <code>margin-inline-start</code> em vez de <code>margin-left</code>, <code>padding-inline</code>, <code>inset-inline-end</code>, <code>text-align: start</code>. Elas se adaptam sozinhas à direção:</p>
${codigo(`<style>
  .cartao { border-inline-start: 4px solid teal; padding-inline-start: 12px; margin-block: 8px; }
</style>
<div class="cartao" dir="ltr" lang="en">Order shipped</div>
<div class="cartao" dir="rtl" lang="ar">تم شحن الطلب</div>`)}
${dica('Teste o layout com textos longos e com <code>dir="rtl"</code> mesmo que ainda não tenha tradução para árabe: os problemas aparecem na hora.')}
`,
              quiz: [
                {
                  pergunta: 'O que Intl.PluralRules("pt-BR").select(1) devolve?',
                  opcoes: ["'singular'", "'one'", '1'],
                  certa: 1,
                  explicacao: 'Ele devolve a categoria, e o dicionário tem um texto para cada uma.'
                },
                {
                  pergunta: 'Por que usar Intl.Collator para ordenar nomes?',
                  opcoes: [
                    'É mais rápido',
                    'O sort() padrão erra com acentos e maiúsculas',
                    'sort() não funciona com texto'
                  ],
                  certa: 1,
                  explicacao: 'O Collator ordena como um dicionário daquela língua.'
                },
                {
                  pergunta: 'Qual propriedade se adapta sozinha a dir="rtl"?',
                  opcoes: ['margin-left', 'margin-inline-start', 'left'],
                  certa: 1,
                  explicacao: 'As propriedades lógicas seguem a direção do texto.'
                }
              ]
            },
            {
              id: 'desafio-traducao',
              tipo: 'desafio',
              titulo: 'Desafio: sistema de tradução',
              resumo: 'Uma função t() com variáveis, plurais e idioma de reserva.',
              minutos: 25,
              enunciado: `
<p>Escreva o pequeno sistema de tradução do site:</p>
<ul>
  <li><code>t(idioma, chave, vars)</code>: devolve o texto da chave no idioma, trocando cada <code>{nome}</code> por <code>vars.nome</code>.</li>
  <li>Se o valor da chave for um <strong>objeto de plurais</strong> (como <code>carrinho</code>), escolha a forma com <code>Intl.PluralRules</code> usando <code>vars.n</code> (e use <code>other</code> se a categoria não existir).</li>
  <li>Se a chave não existir no idioma, use o <strong>português</strong>; se não existir em lugar nenhum, devolva a própria chave.</li>
  <li><code>aplicar(idioma)</code>: preenche cada elemento com <code>data-i18n</code> e muda o <code>lang</code> do <code>&lt;html&gt;</code>.</li>
</ul>`,
              inicial: `<h1 data-i18n="titulo"></h1>
<p data-i18n="rodape"></p>

<script>
  const textos = {
    pt: {
      titulo: 'Minha loja',
      saudacao: 'Olá, {nome}!',
      carrinho: { one: '{n} item no carrinho', other: '{n} itens no carrinho' },
      rodape: 'Feito com café'
    },
    en: {
      titulo: 'My shop',
      saudacao: 'Hi, {nome}!',
      carrinho: { one: '{n} item in your cart', other: '{n} items in your cart' }
    }
  };

  function t(idioma, chave, vars = {}) {
  }

  function aplicar(idioma) {
  }

  aplicar('en');
</script>
`,
              testes: [
                [
                  'Troca variáveis: t("pt", "saudacao", { nome: "Ana" })',
                  doc => {
                    const t = doc.defaultView.eval('t');
                    return (
                      t('pt', 'saudacao', { nome: 'Ana' }) === 'Olá, Ana!' &&
                      t('en', 'saudacao', { nome: 'Rui' }) === 'Hi, Rui!'
                    );
                  }
                ],
                [
                  'Escolhe a forma do plural pelo número',
                  doc => {
                    const t = doc.defaultView.eval('t');
                    return (
                      t('pt', 'carrinho', { n: 1 }) === '1 item no carrinho' &&
                      t('pt', 'carrinho', { n: 3 }) === '3 itens no carrinho' &&
                      t('en', 'carrinho', { n: 0 }) === '0 items in your cart'
                    );
                  }
                ],
                [
                  'Cai para o português e depois para a chave',
                  doc => {
                    const t = doc.defaultView.eval('t');
                    return (
                      t('en', 'rodape') === 'Feito com café' &&
                      t('en', 'nao.existe') === 'nao.existe' &&
                      t('fr', 'titulo') === 'Minha loja'
                    );
                  }
                ],
                [
                  'aplicar preenche os [data-i18n] e muda o lang',
                  doc => {
                    doc.defaultView.eval('aplicar')('pt');
                    const ok1 =
                      doc.querySelector('h1').textContent === 'Minha loja' && doc.documentElement.lang === 'pt';
                    doc.defaultView.eval('aplicar')('en');
                    return (
                      ok1 &&
                      doc.querySelector('h1').textContent === 'My shop' &&
                      doc.documentElement.lang === 'en' &&
                      doc.querySelector('[data-i18n="rodape"]').textContent === 'Feito com café'
                    );
                  }
                ]
              ],
              solucao: `<h1 data-i18n="titulo"></h1>
<p data-i18n="rodape"></p>

<script>
  const textos = {
    pt: {
      titulo: 'Minha loja',
      saudacao: 'Olá, {nome}!',
      carrinho: { one: '{n} item no carrinho', other: '{n} itens no carrinho' },
      rodape: 'Feito com café'
    },
    en: {
      titulo: 'My shop',
      saudacao: 'Hi, {nome}!',
      carrinho: { one: '{n} item in your cart', other: '{n} items in your cart' }
    }
  };

  function t(idioma, chave, vars = {}) {
    let valor = textos[idioma]?.[chave] ?? textos.pt[chave];
    if (valor === undefined) return chave;

    if (typeof valor === 'object') {
      const categoria = new Intl.PluralRules(idioma).select(vars.n);
      valor = valor[categoria] ?? valor.other;
    }

    return valor.replace(/\\{(\\w+)\\}/g, (marcador, nome) => (nome in vars ? vars[nome] : marcador));
  }

  function aplicar(idioma) {
    document.documentElement.lang = idioma;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(idioma, el.dataset.i18n);
    });
  }

  aplicar('en');
</script>`
            }
          ]
        },
        {
          titulo: 'Tradução no dia a dia',
          itens: [
            {
              id: 'mensagens-icu',
              titulo: 'Mensagens no formato ICU',
              resumo: 'plural e select dentro do próprio texto, e contexto para quem traduz.',
              minutos: 11,
              corpo: `
<p>Na trilha básica, os plurais ficavam num objeto separado (<code>{ one: ..., other: ... }</code>). As bibliotecas profissionais (FormatJS, i18next com o plugin ICU, e a maioria das ferramentas de tradução) usam o <strong>formato de mensagem ICU</strong>, que coloca as variações dentro do próprio texto:</p>
${trecho(`{n, plural, =0 {Carrinho vazio} one {# item no carrinho} other {# itens no carrinho}}

{genero, select, feminino {Ela comentou} masculino {Ele comentou} other {Comentaram}} na sua foto.

Olá, {nome}! Você tem {n, plural, one {# mensagem nova} other {# mensagens novas}}.`)}
<ul>
  <li><code>plural</code> escolhe pela categoria do número no idioma (<code>one</code>, <code>other</code>...), e <code>=0</code> pega um valor exato. O <code>#</code> é trocado pelo número.</li>
  <li><code>select</code> escolhe por um texto, como o gênero, e <code>other</code> é o caso padrão (obrigatório).</li>
  <li>A frase inteira fica com o tradutor, que pode mudar a ordem e as variações conforme o idioma pede.</li>
</ul>

<h2>Um select em miniatura</h2>
<p>Bibliotecas fazem a análise completa, mas o princípio cabe em poucas linhas:</p>
${codigo(`<script>
  // Entende só: {variavel, select, opcao {texto} ... other {texto}}
  function formatarSelect(mensagem, vars) {
    return mensagem.replace(/\\{(\\w+), select, ((?:\\w+ \\{[^}]*\\} ?)+)\\}/g, (_, nome, opcoes) => {
      const mapa = Object.fromEntries([...opcoes.matchAll(/(\\w+) \\{([^}]*)\\}/g)].map(m => [m[1], m[2]]));
      return mapa[vars[nome]] ?? mapa.other;
    });
  }

  const msg = '{genero, select, feminino {Ela comentou} masculino {Ele comentou} other {Comentaram}} na sua foto.';
  console.log(formatarSelect(msg, { genero: 'feminino' }));
  console.log(formatarSelect(msg, { genero: 'masculino' }));
  console.log(formatarSelect(msg, {}));
</script>`)}

<h2>Contexto para quem traduz</h2>
<p>"Abrir" é um verbo num botão ("Abrir arquivo") e pode ser um estado numa etiqueta ("Aberto"). Sem contexto, o tradutor erra. Boas práticas:</p>
<ul>
  <li>Chaves que dizem onde o texto aparece: <code>carrinho.botaoFinalizar</code>, não <code>texto37</code>.</li>
  <li>Uma descrição junto de cada texto ambíguo ("botão; até 20 caracteres").</li>
  <li>Prints das telas para o tradutor, quando possível.</li>
  <li>Nunca reaproveitar a mesma chave em dois lugares só porque, em português, o texto é igual.</li>
</ul>
${dica('Ferramentas como Crowdin, Lokalise e Weblate guardam os textos, mostram o contexto para os tradutores e geram os arquivos de cada idioma, integrando com o Git.')}
`,
              quiz: [
                {
                  pergunta: 'Em {n, plural, one {# item} other {# itens}}, o que o # vira?',
                  opcoes: ['Um símbolo de cerquilha', 'O número n', 'O nome da variável'],
                  certa: 1,
                  explicacao: 'O # é trocado pelo número formatado.'
                },
                {
                  pergunta: 'No select do ICU, qual opção é obrigatória?',
                  opcoes: ['feminino', 'other', '=0'],
                  certa: 1,
                  explicacao: 'other é o caso padrão quando nenhum outro bate.'
                },
                {
                  pergunta: 'Por que não reaproveitar uma chave só porque o texto em português é igual?',
                  opcoes: [
                    'Ocupa mais espaço',
                    'Em outro idioma, os dois lugares podem precisar de traduções diferentes',
                    'Não tem problema nenhum'
                  ],
                  certa: 1,
                  explicacao: '"Abrir" (botão) e "Aberto" (estado) podem ser palavras diferentes em outra língua.'
                }
              ]
            },
            {
              id: 'conferir-traducoes',
              titulo: 'Conferir traduções e testar o layout',
              resumo: 'Chaves faltando, variáveis trocadas e pseudo-localização.',
              minutos: 11,
              corpo: `
<p>Com vários idiomas, os erros mais comuns são previsíveis e dá para pegar com código antes de publicar:</p>
<ul>
  <li><strong>Chave faltando</strong> num idioma: o texto cai no idioma de reserva ou aparece a chave na tela.</li>
  <li><strong>Chave sobrando</strong>: um texto que não existe mais no idioma base.</li>
  <li><strong>Variável diferente</strong>: o tradutor escreveu <code>{nme}</code> em vez de <code>{nome}</code>, ou esqueceu uma variável.</li>
  <li><strong>Texto que não cabe</strong>: a tradução é mais longa e quebra o botão.</li>
</ul>
<p>Um script que compara os dicionários pode rodar no GitHub Actions a cada push e barrar o que estiver incompleto. É o próximo desafio.</p>

<h2>Pseudo-localização</h2>
<p>Antes de ter qualquer tradução, dá para testar se o site aguenta: troque cada texto por uma versão "falsa", mais longa e cheia de acentos, mas ainda legível. Textos que continuam em português na tela são os que alguém esqueceu de tirar do código, e botões que quebram mostram onde o layout é frágil:</p>
${codigo(`<style>
  .barra { display: flex; gap: 8px; max-width: 360px; }
  button { white-space: nowrap; padding: 8px 12px; }
</style>
<div class="barra" id="barra">
  <button data-i18n="salvar">Salvar</button>
  <button data-i18n="cancelar">Cancelar</button>
  <button data-i18n="excluir">Excluir conta</button>
</div>
<p><label><input type="checkbox" id="pseudo"> Pseudo-localização</label></p>

<script>
  const acentos = { a: 'á', e: 'ë', i: 'ï', o: 'ö', u: 'ü', c: 'ç', n: 'ñ', A: 'Å', E: 'É', S: 'Š', C: 'Ç' };
  const pseudo = texto => '[' + [...texto].map(l => acentos[l] ?? l).join('') + ' ' + '·'.repeat(Math.ceil(texto.length * 0.4)) + ']';

  const originais = [...document.querySelectorAll('[data-i18n]')].map(b => b.textContent);
  document.querySelector('#pseudo').addEventListener('change', e => {
    document.querySelectorAll('[data-i18n]').forEach((b, i) => {
      b.textContent = e.target.checked ? pseudo(originais[i]) : originais[i];
    });
  });
</script>`)}
<p>Os colchetes mostram se o texto foi cortado no começo ou no fim, e os pontos simulam o crescimento de 30% a 40% comum em traduções. Com a caixa marcada, os botões passam da largura da barra: é o sinal para permitir quebra de linha ou repensar o layout.</p>
${dica('No Chrome, as ferramentas de desenvolvedor permitem simular outro idioma (Sensores, Localização, e o idioma em Configurações de idioma). Combine com <code>dir="rtl"</code> para testar árabe e hebraico.')}
`,
              quiz: [
                {
                  pergunta: 'Para que serve a pseudo-localização?',
                  opcoes: [
                    'Traduzir automaticamente',
                    'Achar textos esquecidos no código e layouts que quebram com textos longos, antes das traduções',
                    'Esconder textos'
                  ],
                  certa: 1,
                  explicacao: 'Ela simula uma tradução longa e acentuada, ainda legível.'
                },
                {
                  pergunta: 'O tradutor escreveu {nme} em vez de {nome}. O que acontece?',
                  opcoes: ['Nada', 'A variável não é trocada e aparece {nme} na tela', 'O navegador corrige'],
                  certa: 1,
                  explicacao: 'Por isso vale conferir as variáveis de cada tradução com um script.'
                },
                {
                  pergunta: 'Onde rodar a conferência dos dicionários para ela nunca ser esquecida?',
                  opcoes: ['Só no computador de quem traduz', 'No CI (GitHub Actions), a cada push', 'Em produção'],
                  certa: 1,
                  explicacao: 'Assim uma tradução incompleta não chega ao ar sem aviso.'
                }
              ]
            },
            {
              id: 'desafio-conferir-dicionarios',
              tipo: 'desafio',
              titulo: 'Desafio: conferir os dicionários',
              resumo: 'Compare dois dicionários e aponte o que falta, sobra ou está diferente.',
              minutos: 22,
              enunciado: `
<p>Escreva <code>compararDicionarios(base, traducao)</code>. Os dicionários podem ter objetos aninhados, e as chaves são comparadas no formato "achatado", com ponto: <code>{ carrinho: { titulo: '...' } }</code> tem a chave <code>carrinho.titulo</code>. Devolva um objeto com três listas, cada uma em <strong>ordem alfabética</strong>:</p>
<ul>
  <li><code>faltando</code>: chaves que estão na base e não na tradução.</li>
  <li><code>sobrando</code>: chaves que estão na tradução e não na base.</li>
  <li><code>variaveisDiferentes</code>: chaves que existem nos dois, mas com variáveis <code>{assim}</code> diferentes (compare o conjunto de nomes, sem importar a ordem).</li>
</ul>`,
              inicial: `<pre id="saida"></pre>
<script>
  function compararDicionarios(base, traducao) {
    return { faltando: [], sobrando: [], variaveisDiferentes: [] };
  }

  const pt = { titulo: 'Loja', carrinho: { vazio: 'Carrinho vazio', total: 'Total: {valor}' }, saudacao: 'Olá, {nome}!' };
  const en = { titulo: 'Shop', carrinho: { total: 'Total: {value}' }, saudacao: 'Hi, {nome}!', antigo: 'Old' };
  document.querySelector('#saida').textContent = JSON.stringify(compararDicionarios(pt, en), null, 2);
</script>
`,
              testes: [
                [
                  'Acha as chaves faltando, inclusive aninhadas',
                  doc => {
                    const r = doc.defaultView.eval('compararDicionarios')(
                      { a: '1', b: { c: '2', d: '3' }, e: '4' },
                      { a: '1', b: { c: '2' } }
                    );
                    return JSON.stringify(r.faltando) === JSON.stringify(['b.d', 'e']);
                  }
                ],
                [
                  'Acha as chaves sobrando, em ordem alfabética',
                  doc => {
                    const r = doc.defaultView.eval('compararDicionarios')(
                      { a: '1' },
                      { a: '1', z: '2', m: { n: '3' } }
                    );
                    return JSON.stringify(r.sobrando) === JSON.stringify(['m.n', 'z']) && r.faltando.length === 0;
                  }
                ],
                [
                  'Acha variáveis diferentes, sem importar a ordem',
                  doc => {
                    const r = doc.defaultView.eval('compararDicionarios')(
                      {
                        total: 'Total: {valor}',
                        ola: 'Olá, {nome}! Hoje é {dia}.',
                        ok: 'Sem variável',
                        x: { y: 'De {a} a {b}' }
                      },
                      { total: 'Total: {value}', ola: 'Hoje é {dia}, {nome}!', ok: 'No variable', x: { y: 'From {a}' } }
                    );
                    return JSON.stringify(r.variaveisDiferentes) === JSON.stringify(['total', 'x.y']);
                  }
                ]
              ],
              solucao: `<pre id="saida"></pre>
<script>
  // { a: { b: 'x' } } vira { 'a.b': 'x' }
  function achatar(objeto, prefixo = '') {
    return Object.entries(objeto).reduce((plano, [chave, valor]) => {
      const nome = prefixo ? prefixo + '.' + chave : chave;
      if (valor && typeof valor === 'object') Object.assign(plano, achatar(valor, nome));
      else plano[nome] = valor;
      return plano;
    }, {});
  }

  const variaveis = texto => [...new Set([...String(texto).matchAll(/\\{(\\w+)\\}/g)].map(m => m[1]))].sort().join();

  function compararDicionarios(base, traducao) {
    const b = achatar(base);
    const t = achatar(traducao);
    return {
      faltando: Object.keys(b).filter(k => !(k in t)).sort(),
      sobrando: Object.keys(t).filter(k => !(k in b)).sort(),
      variaveisDiferentes: Object.keys(b).filter(k => k in t && variaveis(b[k]) !== variaveis(t[k])).sort()
    };
  }

  const pt = { titulo: 'Loja', carrinho: { vazio: 'Carrinho vazio', total: 'Total: {valor}' }, saudacao: 'Olá, {nome}!' };
  const en = { titulo: 'Shop', carrinho: { total: 'Total: {value}' }, saudacao: 'Hi, {nome}!', antigo: 'Old' };
  document.querySelector('#saida').textContent = JSON.stringify(compararDicionarios(pt, en), null, 2);
</script>`
            }
          ]
        }
      ]
    }
  ]
};
