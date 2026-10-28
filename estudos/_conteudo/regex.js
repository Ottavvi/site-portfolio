// Trilha de Expressões regulares, em JavaScript (o editor é o de HTML, com console). Os testes chamam as funções da
// pessoa com doc.defaultView.eval('nome') e conferem os resultados com vários textos.
// Atenção: o conteúdo fica dentro de template strings, então cada barra invertida das regex precisa ser dobrada
// (\\d vira \d na página), e crases e ${ precisam de barra invertida. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica, tabela } = require('./ajuda');

module.exports = {
  id: 'regex',
  area: 'Desenvolvimento web',
  titulo: 'Expressões regulares',
  sigla: '.*',
  resumo: 'Achar, validar e transformar textos com padrões: CEP, datas, logs, máscaras e limpeza de dados.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Caracteres, classes, quantificadores e âncoras.',
      modulos: [
        {
          titulo: 'Os blocos de um padrão',
          itens: [
            {
              id: 'o-que-e-regex',
              titulo: 'O que é uma expressão regular',
              resumo: 'test, match, classes de caracteres e flags.',
              minutos: 10,
              corpo: `
<p>Uma <strong>expressão regular</strong> (regex) é um padrão que descreve um formato de texto: "cinco números, um hífen e mais três números" é um CEP. Com ela, dá para conferir se um texto segue o formato, achar todos os pedaços que seguem e trocá-los por outra coisa. Ela existe em quase toda linguagem e ferramenta: JavaScript, Python, SQL, PowerShell, Power Query, a busca do VS Code.</p>

<h2>Em JavaScript</h2>
<p>Uma regex fica entre barras: <code>/padrão/flags</code>. Os métodos mais usados:</p>
${codigo(`<script>
  const texto = 'Pedido 1234 enviado para o CEP 01310-100';

  console.log(/CEP/.test(texto));            // true: o padrão aparece?
  console.log(texto.match(/\\d+/));            // o primeiro trecho de dígitos
  console.log(texto.match(/\\d+/g));           // com g: todos os trechos
  console.log(texto.replace(/\\d/g, '#'));     // troca cada dígito por #
</script>`)}

<h2>Caracteres e classes</h2>
${tabela(
  ['Padrão', 'Casa com'],
  [
    ['<code>abc</code>', 'o texto "abc", literalmente'],
    ['<code>.</code>', 'qualquer caractere (menos quebra de linha)'],
    ['<code>\\d</code>', 'um dígito (0 a 9)'],
    ['<code>\\w</code>', 'letra sem acento, dígito ou _'],
    ['<code>\\s</code>', 'espaço, tab ou quebra de linha'],
    ['<code>\\D \\W \\S</code>', 'o contrário de cada um'],
    ['<code>[aeiou]</code>', 'um dos caracteres da lista'],
    ['<code>[a-z0-9]</code>', 'um caractere nos intervalos'],
    ['<code>[^0-9]</code>', 'qualquer um que NÃO esteja na lista'],
    ['<code>\\.</code>', 'um ponto de verdade (a barra tira o poder especial)']
  ]
)}
<p>Os caracteres especiais <code>. * + ? ^ $ ( ) [ ] { } | \\ /</code> precisam de barra invertida antes para valerem como eles mesmos.</p>

<h2>Flags</h2>
<ul>
  <li><code>g</code>: todas as ocorrências, não só a primeira.</li>
  <li><code>i</code>: ignora maiúsculas e minúsculas.</li>
  <li><code>m</code>: <code>^</code> e <code>$</code> valem para cada linha.</li>
  <li><code>u</code>: modo Unicode (acentos e emojis direito; mais no nível avançado).</li>
</ul>
${dica('Use um testador visual, como o regex101.com (escolha "ECMAScript/JavaScript"). Ele colore o que casou e explica cada pedaço do padrão em inglês.')}
`,
              quiz: [
                {
                  pergunta: 'O que \\d casa?',
                  opcoes: ['Uma letra', 'Um dígito de 0 a 9', 'Um ponto'],
                  certa: 1,
                  explicacao: 'd de digit. \\D é o contrário: qualquer coisa que não seja dígito.'
                },
                {
                  pergunta: 'Como casar um ponto de verdade, e não "qualquer caractere"?',
                  opcoes: ['.', '\\.', '\\d'],
                  certa: 1,
                  explicacao:
                    'A barra invertida tira o poder especial do ponto. Dentro de colchetes, como em [.], ele também já é literal.'
                },
                {
                  pergunta: 'Para que serve a flag g em texto.replace(/a/g, "b")?',
                  opcoes: ['Ignorar maiúsculas', 'Trocar todas as ocorrências, não só a primeira', 'Nada'],
                  certa: 1,
                  explicacao: 'Sem o g, o replace troca só a primeira.'
                }
              ]
            },
            {
              id: 'quantificadores-e-ancoras',
              titulo: 'Quantificadores, âncoras e alternativas',
              resumo: 'Quantas vezes, onde começa e termina, e "isso ou aquilo".',
              minutos: 11,
              corpo: `
<h2>Quantificadores</h2>
<p>Dizem quantas vezes o item anterior se repete:</p>
${tabela(
  ['Padrão', 'Quantas vezes'],
  [
    ['<code>a?</code>', 'zero ou uma (opcional)'],
    ['<code>a*</code>', 'zero ou mais'],
    ['<code>a+</code>', 'uma ou mais'],
    ['<code>a{3}</code>', 'exatamente 3'],
    ['<code>a{2,4}</code>', 'de 2 a 4'],
    ['<code>a{2,}</code>', '2 ou mais']
  ]
)}
${codigo(`<script>
  const cep = /\\d{5}-?\\d{3}/;      // 5 dígitos, hífen opcional, 3 dígitos
  console.log(cep.test('01310-100'), cep.test('01310100'), cep.test('0131-100'));
</script>`)}

<h2>Âncoras: validar o texto inteiro</h2>
<p>Sem âncoras, a regex procura o padrão <strong>em qualquer lugar</strong>. Para validar um campo, isso é um problema: <code>/\\d{5}-\\d{3}/</code> aceita "abc01310-100xyz". As âncoras prendem o padrão ao começo (<code>^</code>) e ao fim (<code>$</code>) do texto:</p>
${codigo(`<script>
  const solto = /\\d{5}-\\d{3}/;
  const preso = /^\\d{5}-\\d{3}$/;
  console.log(solto.test('abc01310-100xyz'));  // true: achou no meio
  console.log(preso.test('abc01310-100xyz'));  // false
  console.log(preso.test('01310-100'));        // true
</script>`)}
<p>Outra âncora útil é <code>\\b</code>, a <strong>borda de palavra</strong>: <code>/\\bcafé\\b/</code> casa "café", mas não "cafeteira".</p>

<h2>Alternativas</h2>
<p>A barra vertical é "ou". Os parênteses delimitam até onde vai a alternativa:</p>
${codigo(`<script>
  const quarto = /^(casal|triplo|quádruplo)$/i;
  console.log(quarto.test('Casal'), quarto.test('suíte'));

  // Telefone: (DDD) opcional, 4 ou 5 dígitos, hífen opcional, 4 dígitos
  const telefone = /^(\\(\\d{2}\\)\\s?)?\\d{4,5}-?\\d{4}$/;
  for (const t of ['(81) 99999-0000', '3333-4444', '999990000', '(81)99999-000']) {
    console.log(t, telefone.test(t));
  }
</script>`)}
${dica('Uma regex de validação diz se o <em>formato</em> está certo, não se o dado existe: 00000-000 passa no padrão de CEP. Para CPF, além do formato, há os dígitos verificadores, que precisam de uma conta.')}
`,
              quiz: [
                {
                  pergunta: 'O que \\d{2,4} casa?',
                  opcoes: ['Exatamente 2 ou 4 dígitos', 'De 2 a 4 dígitos', 'O número 24'],
                  certa: 1,
                  explicacao: 'Chaves com dois números indicam um intervalo de repetições.'
                },
                {
                  pergunta: 'Por que usar ^ e $ numa validação?',
                  opcoes: [
                    'Para a regex ficar mais rápida',
                    'Para exigir que o texto INTEIRO siga o padrão',
                    'Para ignorar maiúsculas'
                  ],
                  certa: 1,
                  explicacao: 'Sem âncoras, basta o padrão aparecer em algum pedaço.'
                },
                {
                  pergunta: 'O que /^(sim|não)$/ aceita?',
                  opcoes: ['"sim" ou "não", exatamente', 'Qualquer texto com sim', '"simnão"'],
                  certa: 0,
                  explicacao: 'A alternativa fica entre os parênteses, presa pelas âncoras.'
                }
              ]
            },
            {
              id: 'desafio-validadores',
              tipo: 'desafio',
              titulo: 'Desafio: validadores de formulário',
              resumo: 'CEP, placa de carro e horário com regex e âncoras.',
              minutos: 16,
              enunciado: `
<p>Escreva três funções que devolvem <code>true</code> ou <code>false</code>, cada uma com uma expressão regular:</p>
<ul>
  <li><code>cepValido(texto)</code>: 5 dígitos, hífen opcional e 3 dígitos. Nada antes nem depois.</li>
  <li><code>placaValida(texto)</code>: placa no padrão Mercosul, como <code>ABC1D23</code> (3 letras, 1 dígito, 1 letra, 2 dígitos) <strong>ou</strong> no padrão antigo, como <code>ABC-1234</code> (3 letras, hífen, 4 dígitos). Aceite letras minúsculas também.</li>
  <li><code>horarioValido(texto)</code>: horário de <code>00:00</code> a <code>23:59</code>, sempre com dois dígitos de cada lado. <code>24:00</code> e <code>12:60</code> são inválidos.</li>
</ul>`,
              inicial: `<script>
  function cepValido(texto) {
  }

  function placaValida(texto) {
  }

  function horarioValido(texto) {
  }

  console.log(cepValido('01310-100'), placaValida('ABC1D23'), horarioValido('14:30'));
</script>
`,
              testes: [
                [
                  'cepValido aceita 01310-100 e 01310100',
                  doc => {
                    const f = doc.defaultView.eval('cepValido');
                    return f('01310-100') === true && f('01310100') === true;
                  }
                ],
                [
                  'cepValido recusa formatos errados e lixo em volta',
                  doc => {
                    const f = doc.defaultView.eval('cepValido');
                    return ['0131-100', '01310-10', 'x01310-100', '01310-100 ', '01310--100', 'abcde-fgh'].every(
                      t => f(t) === false
                    );
                  }
                ],
                [
                  'placaValida aceita o padrão Mercosul e o antigo',
                  doc => {
                    const f = doc.defaultView.eval('placaValida');
                    return ['ABC1D23', 'abc1d23', 'ABC-1234', 'xyz-0000'].every(t => f(t) === true);
                  }
                ],
                [
                  'placaValida recusa placas fora do padrão',
                  doc => {
                    const f = doc.defaultView.eval('placaValida');
                    return ['AB1D23', 'ABC1234', 'ABC-1D23', 'ABCD123', 'ABC1D234', '1BC1D23'].every(
                      t => f(t) === false
                    );
                  }
                ],
                [
                  'horarioValido aceita de 00:00 a 23:59 e recusa o resto',
                  doc => {
                    const f = doc.defaultView.eval('horarioValido');
                    return (
                      ['00:00', '09:05', '14:30', '19:59', '23:59'].every(t => f(t) === true) &&
                      ['24:00', '12:60', '9:30', '25:10', '12:5', '1230', '12:30h'].every(t => f(t) === false)
                    );
                  }
                ]
              ],
              solucao: `<script>
  function cepValido(texto) {
    return /^\\d{5}-?\\d{3}$/.test(texto);
  }

  function placaValida(texto) {
    return /^[a-z]{3}(\\d[a-z]\\d{2}|-\\d{4})$/i.test(texto);
  }

  function horarioValido(texto) {
    return /^([01]\\d|2[0-3]):[0-5]\\d$/.test(texto);
  }

  console.log(cepValido('01310-100'), placaValida('ABC1D23'), horarioValido('14:30'));
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Capturar pedaços, trocar com grupos e olhar em volta.',
      modulos: [
        {
          titulo: 'Capturar e transformar',
          itens: [
            {
              id: 'grupos-e-replace',
              titulo: 'Grupos, captura e replace',
              resumo: 'Pegar pedaços do texto, grupos com nome, matchAll e replace com função.',
              minutos: 13,
              corpo: `
<h2>Capturar</h2>
<p>Além de agrupar, os parênteses <strong>guardam</strong> o que casou. No resultado do <code>match</code>, o índice 0 é o trecho inteiro e os seguintes são os grupos:</p>
${codigo(`<script>
  const data = '28/10/2026'.match(/^(\\d{2})\\/(\\d{2})\\/(\\d{4})$/);
  console.log(data[0], '| dia', data[1], '| mês', data[2], '| ano', data[3]);

  // Grupos com nome: mais fácil de ler e de manter
  const m = '28/10/2026'.match(/^(?<dia>\\d{2})\\/(?<mes>\\d{2})\\/(?<ano>\\d{4})$/);
  console.log(m.groups.ano, m.groups.mes, m.groups.dia);
</script>`)}
<p>Quando o parêntese é só para agrupar, sem guardar, use <code>(?:...)</code>.</p>

<h2>Todas as ocorrências com os grupos</h2>
<p><code>matchAll</code> (com a flag <code>g</code>) devolve cada ocorrência com seus grupos:</p>
${codigo(`<script>
  const extrato = 'PIX R$ 120,50 · TED R$ 1.300,00 · PIX R$ 15,90';
  for (const m of extrato.matchAll(/(?<tipo>PIX|TED) R\\$ (?<valor>[\\d.]+,\\d{2})/g)) {
    const valor = Number(m.groups.valor.replace(/\\./g, '').replace(',', '.'));
    console.log(m.groups.tipo, valor);
  }
</script>`)}

<h2>Trocar usando os grupos</h2>
<p>No texto de troca do <code>replace</code>, <code>$1</code>, <code>$2</code>... (ou <code>$&lt;nome&gt;</code>) inserem o que cada grupo capturou. Converter a data brasileira para o formato ISO vira uma linha:</p>
${codigo(`<script>
  const br = 'Chegada 28/10/2026, saída 02/11/2026';
  console.log(br.replace(/(\\d{2})\\/(\\d{2})\\/(\\d{4})/g, '$3-$2-$1'));
</script>`)}
<p>E, quando a troca precisa de lógica, passe uma <strong>função</strong>: ela recebe o trecho e os grupos e devolve o texto novo.</p>
${codigo(`<script>
  // Esconder os dígitos do meio de um CPF
  const texto = 'CPF 123.456.789-09 cadastrado';
  console.log(texto.replace(/(\\d{3})\\.\\d{3}\\.\\d{3}-(\\d{2})/, (todo, inicio, fim) => inicio + '.***.***-' + fim));

  // Primeira letra de cada palavra em maiúscula
  console.log('pousada lagoa azul'.replace(/\\b\\w/g, letra => letra.toUpperCase()));
</script>`)}
${dica('<code>split</code> também aceita regex: <code>"a, b;c  d".split(/[,;\\s]+/)</code> separa por vírgula, ponto e vírgula ou espaços, em qualquer quantidade.')}
`,
              quiz: [
                {
                  pergunta: "Em '28/10'.match(/(\\d+)\\/(\\d+)/), o que está no índice 2?",
                  opcoes: ["'28/10'", "'28'", "'10'"],
                  certa: 2,
                  explicacao: 'O 0 é o trecho inteiro, o 1 é o primeiro grupo e o 2 é o segundo.'
                },
                {
                  pergunta: 'No replace, o que $1 significa?',
                  opcoes: ['Um real', 'O que o primeiro grupo capturou', 'A primeira ocorrência'],
                  certa: 1,
                  explicacao: 'Com grupos nomeados, use $<nome>.'
                },
                {
                  pergunta: 'Para que serve (?:...)?',
                  opcoes: ['Agrupar sem guardar a captura', 'Tornar o grupo opcional', 'Ignorar maiúsculas'],
                  certa: 0,
                  explicacao: 'É útil para aplicar um quantificador ou uma alternativa a vários caracteres.'
                }
              ]
            },
            {
              id: 'guloso-e-lookarounds',
              titulo: 'Guloso, preguiçoso e lookarounds',
              resumo: 'Por que .* pega demais e como conferir sem consumir.',
              minutos: 12,
              corpo: `
<h2>Guloso x preguiçoso</h2>
<p>Os quantificadores são <strong>gulosos</strong>: pegam o máximo possível. Isso surpreende:</p>
${codigo(`<script>
  const html = '<b>café</b> e <b>chá</b>';
  console.log(html.match(/<b>.*<\\/b>/)[0]);   // pega do primeiro <b> até o ÚLTIMO </b>
  console.log(html.match(/<b>.*?<\\/b>/)[0]);  // com ?, para no primeiro </b>
  console.log(html.match(/<b>.*?<\\/b>/g));    // e com g, cada um separado
</script>`)}
<p>Colocar <code>?</code> depois de <code>*</code>, <code>+</code> ou <code>{}</code> torna o quantificador <strong>preguiçoso</strong>: o mínimo possível. Muitas vezes, uma classe negada é ainda melhor e mais rápida: <code>&lt;b&gt;[^&lt;]*&lt;\\/b&gt;</code> ("tudo que não for &lt;").</p>

<h2>Lookarounds: conferir sem pegar</h2>
<p>Às vezes você quer casar algo só se vier antes ou depois de outra coisa, sem incluir essa outra coisa no resultado:</p>
${tabela(
  ['Padrão', 'Significa'],
  [
    ['<code>X(?=Y)</code>', 'X, se seguido de Y'],
    ['<code>X(?!Y)</code>', 'X, se NÃO seguido de Y'],
    ['<code>(?&lt;=Y)X</code>', 'X, se precedido de Y'],
    ['<code>(?&lt;!Y)X</code>', 'X, se NÃO precedido de Y']
  ]
)}
${codigo(`<script>
  const texto = 'Café R$ 62,90 · 2 unidades · Frete R$ 10,00';
  console.log(texto.match(/(?<=R\\$ )[\\d,]+/g));   // só os valores depois de "R$ "

  // Separador de milhar: põe um ponto antes de cada grupo de 3 dígitos até o fim
  console.log('1234567'.replace(/\\B(?=(\\d{3})+$)/g, '.'));
</script>`)}

<h2>Senha forte com lookaheads</h2>
<p>Lookaheads no começo do padrão funcionam como uma lista de exigências, cada uma conferida a partir do início:</p>
${codigo(`<script>
  // pelo menos 8 caracteres, uma minúscula, uma maiúscula e um dígito
  const forte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/;
  for (const s of ['abc', 'abcdefgh', 'Abcdefg1', 'ABCDEFG1']) console.log(s, forte.test(s));
</script>`)}
${dica('Numa tela de cadastro, mostre cada exigência separada ("✓ 8 caracteres", "✗ um número"), cada uma com a sua regex simples. Ajuda muito mais do que um único "senha inválida".')}
`,
              quiz: [
                {
                  pergunta: 'Em "<b>a</b><b>c</b>", o que /<b>.*<\\/b>/ pega?',
                  opcoes: ['<b>a</b>', 'O texto inteiro, até o último </b>', 'Nada'],
                  certa: 1,
                  explicacao: 'O .* é guloso. Com .*? pegaria só o primeiro.'
                },
                {
                  pergunta: 'O que (?<=R\\$ )\\d+ devolve em "R$ 50"?',
                  opcoes: ['R$ 50', '50', 'R$'],
                  certa: 1,
                  explicacao: 'O lookbehind confere o "R$ " antes, mas não o inclui no resultado.'
                },
                {
                  pergunta: 'Para que servem os (?=...) no começo da regex de senha?',
                  opcoes: [
                    'Para exigir várias condições ao mesmo tempo, sem importar a ordem',
                    'Para deixar a senha opcional',
                    'Para trocar letras'
                  ],
                  certa: 0,
                  explicacao: 'Cada lookahead confere uma exigência a partir do início do texto.'
                }
              ]
            },
            {
              id: 'desafio-limpar-textos',
              tipo: 'desafio',
              titulo: 'Desafio: limpar e transformar textos',
              resumo: 'Datas para ISO, hashtags e mascaramento de telefone.',
              minutos: 22,
              enunciado: `
<p>Escreva três funções usando <code>replace</code>, <code>match</code> ou <code>matchAll</code>:</p>
<ul>
  <li><code>datasParaIso(texto)</code>: troca toda data <code>dd/mm/aaaa</code> do texto por <code>aaaa-mm-dd</code>, deixando o resto igual.</li>
  <li><code>hashtags(texto)</code>: devolve um array com as hashtags do texto, <strong>sem o #</strong> e em minúsculas, sem repetir, na ordem em que aparecem. Uma hashtag é um # seguido de letras (com ou sem acento), dígitos ou _. Se não houver, devolve <code>[]</code>.</li>
  <li><code>mascararTelefone(texto)</code>: em cada telefone no formato <code>(dd) nnnnn-nnnn</code> ou <code>(dd) nnnn-nnnn</code>, troca os dígitos do meio por asteriscos, mantendo o DDD e os 4 últimos: <code>(81) 99876-5432</code> vira <code>(81) *****-5432</code>.</li>
</ul>`,
              inicial: `<script>
  function datasParaIso(texto) {
  }

  function hashtags(texto) {
  }

  function mascararTelefone(texto) {
  }

  console.log(datasParaIso('Chegada 28/10/2026'));
  console.log(hashtags('Férias na #Praia com #pôrdosol e #praia de novo'));
  console.log(mascararTelefone('Ligue (81) 99876-5432'));
</script>
`,
              testes: [
                [
                  'datasParaIso converte todas as datas e mantém o resto',
                  doc => {
                    const f = doc.defaultView.eval('datasParaIso');
                    return (
                      f('De 28/10/2026 a 02/11/2026.') === 'De 2026-10-28 a 2026-11-02.' &&
                      f('sem datas aqui') === 'sem datas aqui'
                    );
                  }
                ],
                [
                  'hashtags devolve as tags sem #, em minúsculas e sem repetir',
                  doc => {
                    const f = doc.defaultView.eval('hashtags');
                    const r = f('Férias na #Praia com #pôrdosol e #praia de novo #dia_2!');
                    return JSON.stringify(r) === '["praia","pôrdosol","dia_2"]';
                  }
                ],
                [
                  'hashtags devolve [] quando não há nenhuma',
                  doc => {
                    const r = doc.defaultView.eval('hashtags')('nenhuma tag # aqui');
                    return Array.isArray(r) && r.length === 0;
                  }
                ],
                [
                  'mascararTelefone esconde o meio de cada telefone',
                  doc => {
                    const f = doc.defaultView.eval('mascararTelefone');
                    return (
                      f('Ligue (81) 99876-5432 ou (11) 3333-4444.') === 'Ligue (81) *****-5432 ou (11) ****-4444.' &&
                      f('sem telefone') === 'sem telefone'
                    );
                  }
                ]
              ],
              solucao: `<script>
  function datasParaIso(texto) {
    return texto.replace(/(\\d{2})\\/(\\d{2})\\/(\\d{4})/g, '$3-$2-$1');
  }

  function hashtags(texto) {
    const tags = [...texto.matchAll(/#([\\p{L}\\d_]+)/gu)].map(m => m[1].toLowerCase());
    return [...new Set(tags)];
  }

  function mascararTelefone(texto) {
    return texto.replace(/\\((\\d{2})\\) (\\d{4,5})-(\\d{4})/g, (todo, ddd, meio, fim) => \`(\${ddd}) \${'*'.repeat(meio.length)}-\${fim}\`);
  }

  console.log(datasParaIso('Chegada 28/10/2026'));
  console.log(hashtags('Férias na #Praia com #pôrdosol e #praia de novo'));
  console.log(mascararTelefone('Ligue (81) 99876-5432'));
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Unicode, desempenho, regex fora do JavaScript e quando não usar.',
      modulos: [
        {
          titulo: 'Regex de verdade',
          itens: [
            {
              id: 'unicode-e-desempenho',
              titulo: 'Unicode, desempenho e limites',
              resumo: 'Acentos com \\p{L}, retrocesso catastrófico e o que regex não resolve.',
              minutos: 12,
              corpo: `
<h2>Acentos</h2>
<p><code>\\w</code> e <code>[a-z]</code> não incluem letras acentuadas: em português, isso quebra nomes como "João" e "Conceição". Com a flag <code>u</code>, as <strong>propriedades Unicode</strong> resolvem:</p>
${codigo(`<script>
  console.log('João Conceição'.match(/\\w+/g));          // separa no ã e no ç
  console.log('João Conceição'.match(/\\p{L}+/gu));      // \\p{L}: qualquer letra, de qualquer língua
  console.log('Olá 👋 mundo'.match(/\\p{Emoji_Presentation}/gu));
</script>`)}
<p>Para comparar sem acento, normalize antes: <code>texto.normalize('NFD').replace(/\\p{M}/gu, '')</code> separa as letras dos acentos (marcas, <code>\\p{M}</code>) e remove as marcas. "Conceição" vira "Conceicao".</p>

<h2>Retrocesso catastrófico</h2>
<p>Quando uma tentativa falha, o motor de regex volta e tenta outras combinações. Com quantificadores aninhados, como <code>(a+)+</code>, o número de combinações explode e uma regex pode travar a página por minutos com um texto de 30 caracteres. Isso já derrubou sites grandes (é uma forma de ataque, o ReDoS).</p>
${trecho(`/^(a+)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!')   // NÃO rode: trava a aba`)}
<p>Para evitar:</p>
<ul>
  <li>Não aninhe quantificadores sobre a mesma coisa (<code>(\\d+)*</code>, <code>(.*)*</code>).</li>
  <li>Prefira classes específicas a <code>.*</code>: <code>[^"]*</code> em vez de <code>.*?</code> para "tudo até a aspa".</li>
  <li>Limite o tamanho da entrada antes de aplicar a regex em textos que vêm de fora.</li>
</ul>

<h2>Quando não usar regex</h2>
<ul>
  <li><strong>HTML e XML</strong>: use o <code>DOMParser</code> ou <code>querySelector</code>. Tags aninhadas não cabem numa regex.</li>
  <li><strong>JSON</strong>: <code>JSON.parse</code>.</li>
  <li><strong>URLs</strong>: o objeto <code>URL</code>.</li>
  <li><strong>E-mail</strong>: o padrão oficial é enorme. Para formulários, <code>&lt;input type="email"&gt;</code> ou um padrão simples (<code>/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/</code>) e, de verdade, um e-mail de confirmação.</li>
  <li><strong>Datas</strong>: a regex confere o formato, mas 31/02 passa. Confirme com <code>Date</code> ou <code>Intl</code>.</li>
</ul>
${dica('Uma regex longa fica legível quando você a monta por partes: <code>const ddd = String.raw`\\(\\d{2}\\)`</code> e depois <code>new RegExp(ddd + ...)</code>. Com <code>String.raw</code>, as barras não precisam ser dobradas.')}
`,
              quiz: [
                {
                  pergunta: 'Qual padrão casa "João" inteiro?',
                  opcoes: ['/\\w+/', '/\\p{L}+/u', '/[a-z]+/i'],
                  certa: 1,
                  explicacao: '\\w e [a-z] não incluem letras com acento.'
                },
                {
                  pergunta: 'O que causa o retrocesso catastrófico?',
                  opcoes: [
                    'A flag g',
                    'Quantificadores aninhados, como (a+)+, que geram combinações demais',
                    'Usar âncoras'
                  ],
                  certa: 1,
                  explicacao: 'Cada falha faz o motor tentar outra divisão do texto, e as divisões explodem.'
                },
                {
                  pergunta: 'Qual é o melhor jeito de ler os links de um trecho de HTML?',
                  opcoes: ['Uma regex com <a href', 'DOMParser e querySelectorAll("a")', 'split("<")'],
                  certa: 1,
                  explicacao: 'HTML tem aninhamento, aspas, comentários: um parser de verdade resolve tudo isso.'
                }
              ]
            },
            {
              id: 'regex-fora-do-javascript',
              titulo: 'Regex fora do JavaScript',
              resumo: 'VS Code, Python, PowerShell, SQL e Power Query.',
              minutos: 10,
              corpo: `
<p>O que você aprendeu vale em quase todo lugar, com pequenas diferenças de sintaxe.</p>

<h2>VS Code: buscar e trocar no projeto inteiro</h2>
<p>Na busca (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>F</kbd>), ligue o botão <code>.*</code>. Na troca, os grupos são <code>$1</code>, <code>$2</code>. Exemplo: trocar todos os <code>console.log(...)</code> por nada antes de publicar, ou converter <code>var nome = require('x')</code> em <code>import nome from 'x'</code>:</p>
${trecho(`Buscar:  var (\\w+) = require\\('([^']+)'\\);
Trocar:  import $1 from '$2';`)}

<h2>Python</h2>
${trecho(`import re

texto = "Pedidos: #12 (R$ 50,00), #15 (R$ 120,90)"
print(re.findall(r"#(\\d+)", texto))                 # ['12', '15']
print(re.sub(r"(\\d{2})/(\\d{2})/(\\d{4})", r"\\3-\\2-\\1", "28/10/2026"))
m = re.search(r"(?P<valor>[\\d.]+,\\d{2})", texto)
print(m.group("valor"))`)}
<p>O <code>r"..."</code> (texto cru) evita dobrar as barras. Os grupos nomeados usam <code>?P&lt;nome&gt;</code> e, na troca, <code>\\1</code>.</p>

<h2>PowerShell</h2>
${trecho(`'Pedido 1234' -match '\\d+'      # True; o trecho fica em $Matches[0]
'28/10/2026' -replace '(\\d{2})/(\\d{2})/(\\d{4})', '$3-$2-$1'
Select-String -Path *.log -Pattern 'ERRO|FALHA'   # o "grep" do Windows`)}
<p>Os operadores do PowerShell ignoram maiúsculas por padrão; para diferenciar, use <code>-cmatch</code> e <code>-creplace</code>.</p>

<h2>SQL e Power Query</h2>
<ul>
  <li>No SQL, o <code>LIKE</code> só tem <code>%</code> e <code>_</code>. Bancos como PostgreSQL têm regex de verdade (<code>~</code>, <code>regexp_replace</code>); no SQLite, o <code>REGEXP</code> depende de uma extensão.</li>
  <li>No Power Query, não há regex nativa: as funções <code>Text.Select</code>, <code>Text.Remove</code> e <code>Splitter.SplitTextByCharacterTransition</code> resolvem os casos comuns (manter só dígitos, separar letras de números).</li>
</ul>
${dica('Em Python e no VS Code, a sintaxe de lookbehind e de grupos nomeados é quase igual à do JavaScript. A maior diferença costuma ser como escrever as barras e como referenciar os grupos na troca.')}
`,
              quiz: [
                {
                  pergunta: 'Em Python, por que escrever r"\\d+"?',
                  opcoes: [
                    'Para a regex ignorar maiúsculas',
                    'Texto cru: as barras não precisam ser dobradas',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'Sem o r, seria preciso escrever "\\\\d+".'
                },
                {
                  pergunta: 'No VS Code, como usar o primeiro grupo no campo de troca?',
                  opcoes: ['\\1', '$1', '{1}'],
                  certa: 1,
                  explicacao: 'Como no replace do JavaScript.'
                },
                {
                  pergunta: 'O operador -match do PowerShell diferencia maiúsculas?',
                  opcoes: ['Sim', 'Não; para diferenciar existe o -cmatch', 'Depende do Windows'],
                  certa: 1,
                  explicacao: 'O c de -cmatch vem de case-sensitive.'
                }
              ]
            },
            {
              id: 'desafio-ler-log',
              tipo: 'desafio',
              titulo: 'Desafio: ler o log do servidor',
              resumo: 'Transforme linhas de log em objetos e resuma os erros.',
              minutos: 25,
              enunciado: `
<p>Cada linha do log do servidor tem este formato:</p>
<pre class="aula-codigo"><code>2026-10-28 14:03:21 [ERRO] GET /api/reservas 500 312ms</code></pre>
<p>(data, hora, nível entre colchetes, método, caminho, status e duração em milissegundos). Escreva:</p>
<ul>
  <li><code>lerLinha(linha)</code>: devolve um objeto <code>{ data, hora, nivel, metodo, caminho, status, ms }</code>, com <code>status</code> e <code>ms</code> como <strong>números</strong>. Se a linha não seguir o formato, devolve <code>null</code>. Os níveis possíveis são INFO, AVISO e ERRO; os métodos, GET, POST, PUT, PATCH e DELETE.</li>
  <li><code>resumo(texto)</code>: recebe o log inteiro (várias linhas) e devolve <code>{ linhas, erros, lentas }</code>: quantas linhas válidas há, quantas são de nível ERRO e quantas demoraram 1000 ms ou mais. Linhas fora do formato são ignoradas.</li>
</ul>`,
              inicial: `<script>
  function lerLinha(linha) {
  }

  function resumo(texto) {
  }

  const log = \`2026-10-28 14:03:21 [INFO] GET /api/quartos 200 45ms
2026-10-28 14:03:22 [ERRO] POST /api/reservas 500 1312ms
linha quebrada
2026-10-28 14:04:01 [AVISO] GET /api/fotos 304 1003ms\`;

  console.log(lerLinha(log.split('\\n')[0]));
  console.log(resumo(log));
</script>
`,
              testes: [
                [
                  'lerLinha separa todas as partes',
                  doc => {
                    const r = doc.defaultView.eval('lerLinha')(
                      '2026-10-28 14:03:21 [ERRO] GET /api/reservas 500 312ms'
                    );
                    return (
                      !!r &&
                      r.data === '2026-10-28' &&
                      r.hora === '14:03:21' &&
                      r.nivel === 'ERRO' &&
                      r.metodo === 'GET' &&
                      r.caminho === '/api/reservas' &&
                      r.status === 500 &&
                      r.ms === 312
                    );
                  }
                ],
                [
                  'lerLinha aceita caminhos com parâmetros e outros métodos',
                  doc => {
                    const r = doc.defaultView.eval('lerLinha')(
                      '2026-01-02 08:00:00 [INFO] DELETE /api/reservas/7?motivo=x 204 9ms'
                    );
                    return (
                      !!r &&
                      r.metodo === 'DELETE' &&
                      r.caminho === '/api/reservas/7?motivo=x' &&
                      r.status === 204 &&
                      r.ms === 9
                    );
                  }
                ],
                [
                  'lerLinha devolve null para linhas fora do formato',
                  doc => {
                    const f = doc.defaultView.eval('lerLinha');
                    return [
                      'linha quebrada',
                      '',
                      '2026-10-28 14:03:21 [DEBUG] GET /x 200 1ms',
                      '2026-10-28 14:03:21 [INFO] FETCH /x 200 1ms',
                      '2026-10-28 14:03:21 [INFO] GET /x 200',
                      'xx 2026-10-28 14:03:21 [INFO] GET /x 200 1ms'
                    ].every(l => f(l) === null);
                  }
                ],
                [
                  'resumo conta linhas válidas, erros e lentas',
                  doc => {
                    const r = doc.defaultView.eval('resumo')(
                      [
                        '2026-10-28 14:03:21 [INFO] GET /api/quartos 200 45ms',
                        '2026-10-28 14:03:22 [ERRO] POST /api/reservas 500 1312ms',
                        'linha quebrada',
                        '2026-10-28 14:04:01 [AVISO] GET /api/fotos 304 1000ms',
                        '2026-10-28 14:05:00 [ERRO] GET /api/precos 502 80ms'
                      ].join('\n')
                    );
                    return !!r && r.linhas === 4 && r.erros === 2 && r.lentas === 2;
                  }
                ]
              ],
              solucao: `<script>
  const FORMATO =
    /^(?<data>\\d{4}-\\d{2}-\\d{2}) (?<hora>\\d{2}:\\d{2}:\\d{2}) \\[(?<nivel>INFO|AVISO|ERRO)\\] (?<metodo>GET|POST|PUT|PATCH|DELETE) (?<caminho>\\S+) (?<status>\\d{3}) (?<ms>\\d+)ms$/;

  function lerLinha(linha) {
    const m = linha.match(FORMATO);
    if (!m) return null;
    return { ...m.groups, status: Number(m.groups.status), ms: Number(m.groups.ms) };
  }

  function resumo(texto) {
    const linhas = texto.split('\\n').map(lerLinha).filter(Boolean);
    return {
      linhas: linhas.length,
      erros: linhas.filter(l => l.nivel === 'ERRO').length,
      lentas: linhas.filter(l => l.ms >= 1000).length
    };
  }

  const log = \`2026-10-28 14:03:21 [INFO] GET /api/quartos 200 45ms
2026-10-28 14:03:22 [ERRO] POST /api/reservas 500 1312ms
linha quebrada
2026-10-28 14:04:01 [AVISO] GET /api/fotos 304 1003ms\`;

  console.log(lerLinha(log.split('\\n')[0]));
  console.log(resumo(log));
</script>`
            }
          ]
        }
      ]
    }
  ]
};
