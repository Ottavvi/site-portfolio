// Trilha de Segurança web. O editor é o de HTML (com console). Os testes chamam as funções da pessoa com textos
// maliciosos de verdade (tags com onerror, javascript:, aspas de SQL) e conferem que nada passa.
// Atenção: crases e ${ dos exemplos precisam de barra invertida. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'seguranca-web',
  area: 'Qualidade e entrega',
  titulo: 'Segurança web',
  sigla: 'Seg',
  resumo: 'Os ataques mais comuns e como se proteger: XSS, injeção de SQL, senhas, sessões e cabeçalhos.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Como pensar em segurança e o ataque mais comum do front-end: o XSS.',
      modulos: [
        {
          titulo: 'O básico',
          itens: [
            {
              id: 'pensar-como-atacante',
              titulo: 'Pensar como quem ataca',
              resumo: 'Nunca confiar na entrada, o OWASP Top 10 e defesa em camadas.',
              minutos: 9,
              corpo: `
<p>Quase todo ataque a um site começa do mesmo jeito: alguém manda algo que o programa não esperava. Um nome com tags HTML, um campo de busca com aspas de SQL, um id de pedido que não é seu, mil tentativas de senha por minuto. Segurança, no dia a dia, é tratar <strong>toda entrada como suspeita</strong>.</p>

<h2>A regra número 1: o navegador é do usuário</h2>
<p>Tudo o que roda no navegador pode ser visto e mudado por quem está usando. Um campo <code>disabled</code>, uma validação em JavaScript, um preço num campo escondido: tudo isso se contorna em segundos pelo F12 ou chamando a API direto. A validação no front-end serve para a <strong>experiência</strong> (avisar rápido); a que vale para <strong>segurança</strong> é a do servidor.</p>

<h2>OWASP Top 10</h2>
<p>A OWASP, uma fundação aberta, mantém a lista dos riscos mais comuns em aplicações web. Os que mais aparecem na prática:</p>
<ul>
  <li><strong>Controle de acesso quebrado</strong>: trocar <code>/pedidos/41</code> por <code>/pedidos/42</code> na URL e ver o pedido de outra pessoa. O servidor precisa conferir, a cada pedido, se aquele usuário pode ver aquele dado.</li>
  <li><strong>Injeção</strong>: entrada que vira código (SQL, comandos, HTML). Inclui o XSS.</li>
  <li><strong>Falhas de autenticação</strong>: senhas fracas aceitas, sem limite de tentativas, sessão que não expira.</li>
  <li><strong>Configuração insegura</strong>: mensagens de erro com detalhes internos, painel de administração aberto, senha padrão.</li>
  <li><strong>Componentes vulneráveis</strong>: dependências desatualizadas com falhas conhecidas.</li>
</ul>

<h2>Defesa em camadas</h2>
<p>Nenhuma proteção é perfeita, então se empilham várias: validar a entrada, escapar a saída, dar a cada parte do sistema só a permissão de que precisa (<strong>menor privilégio</strong>), registrar o que acontece e manter tudo atualizado. Se uma camada falhar, a próxima segura.</p>
${dica('Este site usa o Firebase, e a chave de configuração dele aparece no código, de propósito. Quem protege os dados são as <strong>regras de segurança</strong> no servidor (o arquivo firestore.rules), que só deixam cada pessoa ler e gravar o próprio documento. É a regra número 1 em ação.')}
`,
              quiz: [
                {
                  pergunta: 'A validação de um formulário em JavaScript protege o servidor?',
                  opcoes: [
                    'Sim, totalmente',
                    'Não: ela pode ser contornada; o servidor precisa validar de novo',
                    'Só se o campo for obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'A validação no front melhora a experiência; a segurança está no servidor.'
                },
                {
                  pergunta: 'Trocar o id na URL e ver o pedido de outra pessoa é um exemplo de:',
                  opcoes: ['XSS', 'Controle de acesso quebrado', 'Injeção de SQL'],
                  certa: 1,
                  explicacao: 'É o risco número 1 do OWASP Top 10.'
                },
                {
                  pergunta: 'O que é o princípio do menor privilégio?',
                  opcoes: [
                    'Dar a cada parte do sistema só as permissões de que ela precisa',
                    'Usar senhas pequenas',
                    'Ter poucos usuários'
                  ],
                  certa: 0,
                  explicacao: 'Se uma parte for invadida, o estrago fica limitado.'
                }
              ]
            },
            {
              id: 'xss',
              titulo: 'XSS: quando texto vira código',
              resumo: 'innerHTML, textContent, escapar a saída e links com javascript:.',
              minutos: 12,
              corpo: `
<p>No <strong>XSS</strong> (cross-site scripting), o atacante consegue rodar JavaScript no seu site, no navegador de outras pessoas. Com isso, ele lê o que a pessoa vê, faz pedidos em nome dela e rouba tokens guardados no <code>localStorage</code>.</p>

<h2>Como acontece</h2>
<p>O caminho clássico: um texto que veio do usuário (um comentário, um nome, um parâmetro da URL) é colocado na página com <code>innerHTML</code>. Se o texto tiver HTML, ele vira HTML:</p>
${codigo(`<div id="comentarios"></div>
<script>
  const comentario = 'Ótima pousada! <img src="x" onerror="console.log(\\'XSS: eu rodei\\')">';

  // Perigoso: o texto vira HTML, e o onerror roda
  document.getElementById('comentarios').innerHTML = '<p>' + comentario + '</p>';
</script>`)}
<p>Repare no console: o código "do comentário" rodou. Num site real, em vez do <code>console.log</code>, estaria um <code>fetch</code> mandando os dados da pessoa para outro lugar.</p>

<h2>A correção: texto é texto</h2>
${codigo(`<div id="comentarios"></div>
<script>
  const comentario = 'Ótima pousada! <img src="x" onerror="console.log(\\'XSS: eu rodei\\')">';

  const p = document.createElement('p');
  p.textContent = comentario;   // as tags aparecem como texto, nada roda
  document.getElementById('comentarios').append(p);
</script>`)}
<ul>
  <li>Use <code>textContent</code> (ou <code>innerText</code>) para colocar texto. É a regra que resolve a maioria dos casos.</li>
  <li>Se precisar montar HTML com texto do usuário dentro, <strong>escape</strong> os caracteres especiais: <code>&amp;</code> vira <code>&amp;amp;</code>, <code>&lt;</code> vira <code>&amp;lt;</code>, <code>&gt;</code> vira <code>&amp;gt;</code>, <code>"</code> vira <code>&amp;quot;</code> e <code>'</code> vira <code>&amp;#39;</code>.</li>
  <li>Se o usuário <em>precisa</em> mandar HTML (um editor de texto rico), use uma biblioteca de limpeza testada, como o <strong>DOMPurify</strong>. Nunca uma regex feita em casa.</li>
  <li>React, Vue e companhia escapam sozinhos o que vai entre chaves. O perigo volta com <code>dangerouslySetInnerHTML</code> e <code>v-html</code>.</li>
</ul>

<h2>Links também</h2>
<p>Um link com endereço vindo do usuário pode ser <code>javascript:alert(1)</code>: o código roda no clique. Antes de usar um endereço externo num <code>href</code>, confira se o protocolo é <code>http:</code> ou <code>https:</code>:</p>
${codigo(`<script>
  function linkSeguro(endereco) {
    try {
      const url = new URL(endereco);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }
  for (const e of ['https://instagram.com/pousada', 'javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,oi']) {
    console.log(e, linkSeguro(e));
  }
</script>`)}
${dica('O XSS também aparece com <code>eval</code>, <code>new Function</code>, <code>setTimeout</code> com texto, <code>document.write</code> e atributos como <code>onclick</code> montados com texto. Procure esses nomes no seu código de vez em quando.')}
`,
              quiz: [
                {
                  pergunta: 'Qual é o jeito seguro de mostrar um comentário do usuário?',
                  opcoes: ['innerHTML', 'textContent', 'document.write'],
                  certa: 1,
                  explicacao: 'textContent nunca interpreta HTML.'
                },
                {
                  pergunta: 'Por que um link com href vindo do usuário pode ser perigoso?',
                  opcoes: [
                    'Porque pode ser javascript:..., que roda código no clique',
                    'Porque links são lentos',
                    'Não é perigoso'
                  ],
                  certa: 0,
                  explicacao: 'Confira se o protocolo é http: ou https: antes de usar.'
                },
                {
                  pergunta: 'O usuário precisa enviar HTML formatado. O que usar?',
                  opcoes: [
                    'Uma regex que tira <script>',
                    'Uma biblioteca de limpeza testada, como o DOMPurify',
                    'innerHTML direto'
                  ],
                  certa: 1,
                  explicacao:
                    'Existem dezenas de jeitos de rodar script sem a tag <script>; regex caseira sempre deixa passar algum.'
                }
              ]
            },
            {
              id: 'desafio-comentarios',
              tipo: 'desafio',
              titulo: 'Desafio: mural de comentários seguro',
              resumo: 'Escape o HTML, mostre os comentários sem XSS e só aceite links seguros.',
              minutos: 18,
              enunciado: `
<p>O mural mostra comentários de hóspedes, cada um com nome, texto e um site opcional. Hoje ele tem XSS. Escreva:</p>
<ul>
  <li><code>escaparHtml(texto)</code>: troca <code>&amp; &lt; &gt; " '</code> por <code>&amp;amp; &amp;lt; &amp;gt; &amp;quot; &amp;#39;</code>.</li>
  <li><code>linkSeguro(endereco)</code>: <code>true</code> só para endereços válidos com protocolo <code>http:</code> ou <code>https:</code>.</li>
  <li><code>mostrar(comentarios)</code>: desenha cada comentário dentro de <code>#mural</code> sem permitir que HTML dos dados vire HTML de verdade. Quando o site for seguro, o nome vira um link para ele; senão, o nome aparece como texto simples.</li>
</ul>`,
              inicial: `<div id="mural"></div>
<script>
  function escaparHtml(texto) {
  }

  function linkSeguro(endereco) {
  }

  function mostrar(comentarios) {
    const mural = document.getElementById('mural');
    mural.innerHTML = comentarios
      .map(c => '<p><a href="' + c.site + '">' + c.nome + '</a>: ' + c.texto + '</p>')
      .join('');
  }

  mostrar([
    { nome: 'Ana', texto: 'Adorei a vista!', site: 'https://ana.blog' },
    { nome: 'Rui', texto: '<img src="x" onerror="console.log(\\'hackeado\\')">', site: 'javascript:alert(1)' }
  ]);
</script>
`,
              testes: [
                [
                  'escaparHtml troca os cinco caracteres especiais',
                  doc => {
                    const f = doc.defaultView.eval('escaparHtml');
                    return (
                      f(`<a data-x="1" title='y'>&</a>`) ===
                      '&lt;a data-x=&quot;1&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;'
                    );
                  }
                ],
                [
                  'linkSeguro só aceita http e https',
                  doc => {
                    const f = doc.defaultView.eval('linkSeguro');
                    return (
                      f('https://ana.blog') === true &&
                      f('http://site.com/a?b=1') === true &&
                      [
                        'javascript:alert(1)',
                        'JavaScript:alert(1)',
                        ' javascript:alert(1)',
                        'data:text/html,x',
                        'não é url',
                        ''
                      ].every(e => f(e) === false)
                    );
                  }
                ],
                [
                  'mostrar não cria elementos a partir do texto dos comentários',
                  doc => {
                    const w = doc.defaultView;
                    w.eval('mostrar')([
                      {
                        nome: '<b>Rui</b>',
                        texto: '<img src=x onerror="window.__xss = 1"><script>window.__xss = 2<\/script>',
                        site: ''
                      }
                    ]);
                    const mural = doc.getElementById('mural');
                    return (
                      !mural.querySelector('img, script, b') &&
                      mural.textContent.includes('<img') &&
                      mural.textContent.includes('<b>Rui</b>')
                    );
                  }
                ],
                [
                  'O nome vira link só quando o site é seguro',
                  doc => {
                    const w = doc.defaultView;
                    w.eval('mostrar')([
                      { nome: 'Ana', texto: 'oi', site: 'https://ana.blog' },
                      { nome: 'Rui', texto: 'oi', site: 'javascript:alert(1)' },
                      { nome: 'Bia', texto: 'oi', site: '' }
                    ]);
                    const links = [...doc.querySelectorAll('#mural a')];
                    return (
                      links.length === 1 &&
                      links[0].getAttribute('href') === 'https://ana.blog' &&
                      links[0].textContent === 'Ana' &&
                      doc.getElementById('mural').textContent.includes('Rui') &&
                      doc.getElementById('mural').textContent.includes('Bia')
                    );
                  }
                ]
              ],
              solucao: `<div id="mural"></div>
<script>
  function escaparHtml(texto) {
    const trocas = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(texto).replace(/[&<>"']/g, c => trocas[c]);
  }

  function linkSeguro(endereco) {
    try {
      return ['http:', 'https:'].includes(new URL(endereco).protocol);
    } catch {
      return false;
    }
  }

  function mostrar(comentarios) {
    const mural = document.getElementById('mural');
    mural.replaceChildren();
    for (const c of comentarios) {
      const p = document.createElement('p');
      let autor;
      if (linkSeguro(c.site)) {
        autor = document.createElement('a');
        autor.href = c.site;
        autor.rel = 'nofollow noopener';
      } else {
        autor = document.createElement('strong');
      }
      autor.textContent = c.nome;
      p.append(autor, ': ' + c.texto);
      mural.append(p);
    }
  }

  mostrar([
    { nome: 'Ana', texto: 'Adorei a vista!', site: 'https://ana.blog' },
    { nome: 'Rui', texto: '<img src="x" onerror="console.log(\\'hackeado\\')">', site: 'javascript:alert(1)' }
  ]);
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Injeção de SQL, senhas, sessões e cookies.',
      modulos: [
        {
          titulo: 'Servidor e contas',
          itens: [
            {
              id: 'injecao-de-sql',
              titulo: 'Injeção de SQL e consultas parametrizadas',
              resumo: 'Por que nunca montar SQL somando textos, e o que fazer no lugar.',
              minutos: 12,
              corpo: `
<p>Na <strong>injeção de SQL</strong>, o texto digitado pelo usuário vira parte do comando SQL. Imagine o login montado assim no servidor:</p>
${trecho(`const sql = "SELECT * FROM usuarios WHERE email = '" + email + "' AND senha_hash = '" + hash + "'";`)}
<p>Se alguém digitar no e-mail <code>' OR 1=1 --</code>, o comando vira:</p>
${trecho(`SELECT * FROM usuarios WHERE email = '' OR 1=1 --' AND senha_hash = '...'`)}
<p>O <code>OR 1=1</code> é sempre verdadeiro e o <code>--</code> transforma o resto em comentário. A pessoa entra sem senha, como o primeiro usuário da tabela (muitas vezes, o administrador). Com variações, dá para ler outras tabelas ou apagar dados.</p>

<h2>Experimente o ataque</h2>
<p>O SQLite abaixo é o da trilha de SQL. A "busca de clientes" foi montada somando o texto digitado:</p>
${codigo(
  `-- O que o sistema pretendia: buscar um nome digitado
-- SELECT nome, cidade FROM clientes WHERE nome = '<o que a pessoa digitou>';

-- O que acontece quando a pessoa digita:  x' OR '1'='1
SELECT nome, cidade FROM clientes WHERE nome = 'x' OR '1'='1';`,
  'sql'
)}

<h2>A correção: parâmetros</h2>
<p>Em vez de montar o texto, mande o SQL com marcadores (<code>?</code> ou <code>$1</code>) e os valores separados. O banco trata os valores sempre como <strong>dados</strong>, nunca como comando, não importa o que tenham dentro:</p>
${trecho(`// Node com better-sqlite3
const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

// Node com pg (PostgreSQL)
const r = await pool.query('SELECT * FROM pedidos WHERE cliente_id = $1 AND status = $2', [id, 'pago']);

// Python com sqlite3
cursor.execute("SELECT * FROM clientes WHERE estado = ?", (estado,))`)}
<p>Parâmetros servem para <strong>valores</strong>. Nomes de colunas e tabelas (num <code>ORDER BY</code> escolhido pela pessoa, por exemplo) não podem ser parâmetro: para eles, use uma <strong>lista do que é permitido</strong> e recuse o resto.</p>
${trecho(`const COLUNAS = ['nome', 'preco', 'estoque'];
const ordem = COLUNAS.includes(pedido.ordem) ? pedido.ordem : 'nome';
db.prepare(\`SELECT * FROM produtos ORDER BY \${ordem}\`).all();`)}
${dica('A mesma ideia vale para outras injeções: ao rodar comandos do sistema, passe os argumentos numa lista (<code>execFile("convert", [arquivo, saida])</code>), nunca montando o texto do comando.')}
`,
              quiz: [
                {
                  pergunta: "O que o -- faz no ataque ' OR 1=1 --?",
                  opcoes: ['Subtrai um número', 'Transforma o resto do comando em comentário', 'Apaga a tabela'],
                  certa: 1,
                  explicacao: 'Assim a checagem da senha, que vinha depois, é ignorada.'
                },
                {
                  pergunta: 'Como evitar injeção de SQL?',
                  opcoes: [
                    'Tirar as aspas do texto digitado',
                    'Usar consultas parametrizadas: SQL com ? e os valores separados',
                    'Esconder os erros do banco'
                  ],
                  certa: 1,
                  explicacao: 'Com parâmetros, o valor nunca é lido como comando.'
                },
                {
                  pergunta: 'O usuário escolhe a coluna do ORDER BY. Como proteger?',
                  opcoes: [
                    'Passar a coluna como parâmetro ?',
                    'Conferir se ela está numa lista de colunas permitidas',
                    'Não precisa'
                  ],
                  certa: 1,
                  explicacao: 'Parâmetros só funcionam para valores, não para nomes de colunas.'
                }
              ]
            },
            {
              id: 'senhas-e-sessoes',
              titulo: 'Senhas, sessões e cookies',
              resumo: 'Hash com sal, limite de tentativas, mensagens genéricas e cookies seguros.',
              minutos: 13,
              corpo: `
<h2>Nunca guarde a senha</h2>
<p>O banco guarda um <strong>hash</strong> da senha: o resultado de uma função de mão única, que transforma "minhasenha" num texto que não dá para desfazer. No login, calcula-se o hash do que foi digitado e compara-se com o guardado. Se o banco vazar, as senhas não vazam junto.</p>
<ul>
  <li>Use funções feitas <strong>para senhas</strong>, que são lentas de propósito: <strong>Argon2</strong>, <strong>bcrypt</strong> ou <strong>scrypt</strong>. SHA-256 sozinho é rápido demais: uma placa de vídeo testa bilhões de senhas por segundo.</li>
  <li>Elas já embutem um <strong>sal</strong>: um valor aleatório diferente para cada usuário, que faz duas pessoas com a mesma senha terem hashes diferentes.</li>
</ul>
${trecho(`import bcrypt from 'bcrypt';

const hash = await bcrypt.hash(senha, 12);        // no cadastro (12 = custo)
const confere = await bcrypt.compare(tentativa, hash); // no login`)}

<h2>O login</h2>
<ul>
  <li><strong>Mensagem genérica</strong>: "e-mail ou senha incorretos", sempre. "E-mail não cadastrado" ensina ao atacante quais e-mails existem.</li>
  <li><strong>Limite de tentativas</strong> por conta e por IP (por exemplo, 5 por minuto), com espera crescente.</li>
  <li><strong>Senhas</strong>: exija tamanho (12 ou mais) em vez de regras de símbolos, e recuse as que já vazaram (o serviço Have I Been Pwned tem uma API para isso).</li>
  <li><strong>Dois fatores</strong> (aplicativo autenticador ou chave de segurança) para contas importantes. SMS é melhor que nada, mas é o fator mais fraco.</li>
  <li>Recuperação de senha com link de <strong>uso único</strong> e prazo curto.</li>
</ul>

<h2>Sessões e cookies</h2>
<p>Depois do login, o servidor precisa reconhecer a pessoa a cada pedido. O jeito mais seguro no navegador é um cookie de sessão com os atributos certos:</p>
${trecho(`Set-Cookie: sessao=8f3a...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`)}
<ul>
  <li><code>HttpOnly</code>: o JavaScript não lê o cookie, então um XSS não consegue roubá-lo.</li>
  <li><code>Secure</code>: só viaja por HTTPS.</li>
  <li><code>SameSite=Lax</code>: o cookie não vai em pedidos disparados por outros sites, o que bloqueia a maior parte do <strong>CSRF</strong> (um site malicioso fazendo você, logado, enviar um formulário para o seu banco).</li>
</ul>
${dica('Guardar o token de acesso no <code>localStorage</code> é comum, mas qualquer XSS lê o <code>localStorage</code>. Se usar, seja ainda mais rigoroso com o XSS e use tokens de vida curta.')}
`,
              quiz: [
                {
                  pergunta: 'Qual função usar para guardar senhas?',
                  opcoes: ['SHA-256', 'Argon2 ou bcrypt', 'Base64'],
                  certa: 1,
                  explicacao: 'São lentas de propósito e já usam sal. Base64 nem é hash: desfaz-se em um segundo.'
                },
                {
                  pergunta: 'Por que responder "e-mail ou senha incorretos", sem dizer qual?',
                  opcoes: [
                    'Para não revelar quais e-mails estão cadastrados',
                    'Para economizar texto',
                    'É exigência do navegador'
                  ],
                  certa: 0,
                  explicacao: 'Saber quais contas existem é o primeiro passo de um ataque.'
                },
                {
                  pergunta: 'O que o atributo HttpOnly faz num cookie?',
                  opcoes: [
                    'Faz o cookie só funcionar em HTTP',
                    'Impede o JavaScript de ler o cookie',
                    'Faz o cookie expirar ao fechar o navegador'
                  ],
                  certa: 1,
                  explicacao: 'Assim, mesmo com um XSS, o cookie de sessão não é roubado.'
                }
              ]
            },
            {
              id: 'desafio-consulta-segura',
              tipo: 'desafio',
              titulo: 'Desafio: a busca de produtos segura',
              resumo: 'Monte SQL com parâmetros e uma lista de colunas permitidas.',
              minutos: 22,
              enunciado: `
<p>O back-end da loja monta a busca de produtos somando textos, o que permite injeção de SQL. Reescreva <code>montarBusca(filtros)</code> para devolver <code>{ sql, parametros }</code>, que o servidor passa ao banco separados:</p>
<ul>
  <li>A base é <code>SELECT nome, preco FROM produtos</code>.</li>
  <li>Se houver <code>filtros.busca</code>, acrescente a condição <code>nome LIKE ?</code> com o parâmetro <code>'%' + busca + '%'</code>.</li>
  <li>Se houver <code>filtros.precoMaximo</code>, acrescente <code>preco &lt;= ?</code> com o número como parâmetro. As condições se juntam com <code>WHERE</code> e <code>AND</code>.</li>
  <li><code>filtros.ordem</code> só pode ser <code>nome</code>, <code>preco</code> ou <code>estoque</code>; qualquer outro valor (ou nenhum) vira <code>nome</code>. Termine com <code>ORDER BY</code> e a coluna.</li>
  <li><strong>Nenhum</strong> valor digitado pode aparecer dentro do <code>sql</code>.</li>
</ul>`,
              inicial: `<script>
  function montarBusca(filtros) {
    let sql = 'SELECT nome, preco FROM produtos';
    if (filtros.busca) sql += " WHERE nome LIKE '%" + filtros.busca + "%'";
    sql += ' ORDER BY ' + (filtros.ordem || 'nome');
    return { sql, parametros: [] };
  }

  console.log(montarBusca({ busca: "x' OR '1'='1", ordem: 'preco; DROP TABLE produtos' }));
</script>
`,
              testes: [
                [
                  'Sem filtros: só a base, ordenada por nome',
                  doc => {
                    const r = doc.defaultView.eval('montarBusca')({});
                    return (
                      r.sql.replace(/\s+/g, ' ').trim() === 'SELECT nome, preco FROM produtos ORDER BY nome' &&
                      Array.isArray(r.parametros) &&
                      r.parametros.length === 0
                    );
                  }
                ],
                [
                  'A busca vira nome LIKE ? com o parâmetro %busca%',
                  doc => {
                    const r = doc.defaultView.eval('montarBusca')({ busca: 'café' });
                    return (
                      /WHERE nome LIKE \?/i.test(r.sql) && r.parametros.length === 1 && r.parametros[0] === '%café%'
                    );
                  }
                ],
                [
                  'Busca e preço máximo juntos, com AND e dois parâmetros na ordem',
                  doc => {
                    const r = doc.defaultView.eval('montarBusca')({ busca: 'caneca', precoMaximo: 50, ordem: 'preco' });
                    return (
                      /WHERE nome LIKE \? AND preco <= \? ORDER BY preco$/i.test(r.sql.replace(/\s+/g, ' ').trim()) &&
                      JSON.stringify(r.parametros) === '["%caneca%",50]'
                    );
                  }
                ],
                [
                  'Texto malicioso nunca entra no SQL',
                  doc => {
                    const r = doc.defaultView.eval('montarBusca')({ busca: "x' OR '1'='1", precoMaximo: '1 OR 1=1' });
                    return !r.sql.includes("'") && !r.sql.includes('1=1') && r.parametros.includes("%x' OR '1'='1%");
                  }
                ],
                [
                  'Ordem fora da lista vira nome',
                  doc => {
                    const f = doc.defaultView.eval('montarBusca');
                    return (
                      /ORDER BY nome$/.test(f({ ordem: 'preco; DROP TABLE produtos' }).sql.trim()) &&
                      /ORDER BY estoque$/.test(f({ ordem: 'estoque' }).sql.trim())
                    );
                  }
                ]
              ],
              solucao: `<script>
  const COLUNAS_DE_ORDEM = ['nome', 'preco', 'estoque'];

  function montarBusca(filtros) {
    const condicoes = [];
    const parametros = [];
    if (filtros.busca) {
      condicoes.push('nome LIKE ?');
      parametros.push('%' + filtros.busca + '%');
    }
    if (filtros.precoMaximo !== undefined) {
      condicoes.push('preco <= ?');
      parametros.push(filtros.precoMaximo);
    }
    const ordem = COLUNAS_DE_ORDEM.includes(filtros.ordem) ? filtros.ordem : 'nome';
    let sql = 'SELECT nome, preco FROM produtos';
    if (condicoes.length) sql += ' WHERE ' + condicoes.join(' AND ');
    sql += ' ORDER BY ' + ordem;
    return { sql, parametros };
  }

  console.log(montarBusca({ busca: "x' OR '1'='1", ordem: 'preco; DROP TABLE produtos' }));
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Cabeçalhos de segurança, segredos e dependências.',
      modulos: [
        {
          titulo: 'Proteção em camadas',
          itens: [
            {
              id: 'cabecalhos-de-seguranca',
              titulo: 'Cabeçalhos de segurança e CSP',
              resumo: 'HTTPS, HSTS, Content-Security-Policy, SRI e redirecionamentos abertos.',
              minutos: 14,
              corpo: `
<p>Alguns cabeçalhos HTTP mandam o navegador ativar proteções. São poucas linhas na configuração do servidor (ou da hospedagem) e fecham classes inteiras de ataque.</p>

<h2>HTTPS e HSTS</h2>
<p>HTTPS é obrigatório: sem ele, qualquer um na mesma rede Wi-Fi lê e altera o que trafega. O <strong>HSTS</strong> manda o navegador nunca mais tentar HTTP naquele domínio:</p>
${trecho(`Strict-Transport-Security: max-age=31536000; includeSubDomains`)}

<h2>Content-Security-Policy (CSP)</h2>
<p>A CSP diz de onde a página pode carregar scripts, estilos, imagens e para onde pode fazer pedidos. Se um XSS conseguir injetar um <code>&lt;script&gt;</code>, o navegador recusa rodar, porque ele não está na lista. É a segunda camada contra o XSS.</p>
${trecho(`Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  img-src 'self' data: https:;
  connect-src 'self' https://api.exemplo.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self'`)}
<ul>
  <li><code>default-src 'self'</code>: por padrão, só do próprio domínio.</li>
  <li>Evite <code>'unsafe-inline'</code> em <code>script-src</code>: ele libera justamente o tipo de script que um XSS injeta. Mova o JavaScript dos atributos <code>onclick</code> e das tags <code>&lt;script&gt;</code> para arquivos.</li>
  <li><code>frame-ancestors 'none'</code>: ninguém pode pôr seu site num iframe (protege contra o <em>clickjacking</em>, em que seu botão aparece escondido sob outra página).</li>
  <li>Comece com <code>Content-Security-Policy-Report-Only</code>: o navegador só avisa no console o que <em>bloquearia</em>, sem quebrar nada. Ajuste e depois ative.</li>
</ul>

<h2>Outros cabeçalhos curtos</h2>
${trecho(`X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()`)}

<h2>Scripts de CDN: SRI</h2>
<p>Se o CDN for invadido, o script que você carrega de lá muda. O atributo <code>integrity</code> guarda o hash do arquivo, e o navegador recusa qualquer versão diferente:</p>
${trecho(`<script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"
  integrity="sha384-..." crossorigin="anonymous"></script>`)}

<h2>Redirecionamento aberto</h2>
<p>Páginas de login costumam ter <code>?volta=/minha-conta</code> para voltar depois de entrar (este site tem). Se o servidor redirecionar para qualquer endereço, um golpista manda o link <code>seu-site.com/login?volta=https://site-falso.com</code>: a pessoa vê o seu domínio, entra, e cai numa cópia falsa. A regra: só aceite caminhos <strong>internos</strong>, que começam com <code>/</code> (e não com <code>//</code>, que o navegador lê como outro domínio).</p>
${dica('O site securityheaders.com analisa os cabeçalhos de qualquer endereço e dá uma nota. Em hospedagens estáticas como o GitHub Pages, não dá para configurar cabeçalhos; aí a CSP pode ir numa <code>&lt;meta http-equiv="Content-Security-Policy"&gt;</code>, com algumas limitações (o frame-ancestors, por exemplo, não funciona nela).')}
`,
              quiz: [
                {
                  pergunta: 'Como a CSP ajuda contra o XSS?',
                  opcoes: [
                    'Escapando o HTML',
                    'Dizendo ao navegador de onde scripts podem vir, e ele recusa os outros',
                    'Criptografando a página'
                  ],
                  certa: 1,
                  explicacao: "Um script injetado não está na lista permitida (desde que não haja 'unsafe-inline')."
                },
                {
                  pergunta: 'O que o atributo integrity num <script> garante?',
                  opcoes: [
                    'Que o arquivo baixado é exatamente o esperado',
                    'Que o script roda mais rápido',
                    'Que o CDN está no ar'
                  ],
                  certa: 0,
                  explicacao: 'Se o hash não bater, o navegador não roda o arquivo.'
                },
                {
                  pergunta: 'Qual valor de ?volta= é seguro aceitar?',
                  opcoes: ['https://outro-site.com', '//outro-site.com', '/minha-conta'],
                  certa: 2,
                  explicacao: '// é lido como "outro domínio, mesmo protocolo".'
                }
              ]
            },
            {
              id: 'segredos-e-dependencias',
              titulo: 'Segredos, dependências e registros',
              resumo: '.env, chaves vazadas no Git, npm audit, Dependabot e logs sem dados pessoais.',
              minutos: 11,
              corpo: `
<h2>Segredos</h2>
<p>Senhas de banco, chaves de API e tokens nunca vão para o código. Eles ficam em <strong>variáveis de ambiente</strong>: no computador, num arquivo <code>.env</code> listado no <code>.gitignore</code>; em produção, nas configurações da hospedagem; no GitHub Actions, em <em>Settings → Secrets</em>.</p>
${trecho(`# .env (nunca vai para o Git)
DATABASE_URL=postgres://app:senha-forte@localhost/loja
API_KEY=sk-...

// No código (Node 20+: node --env-file=.env servidor.js)
const chave = process.env.API_KEY;`)}
<p>Vazou uma chave num commit? Apagar o arquivo não basta: ela continua no histórico, e robôs varrem o GitHub atrás disso em minutos. <strong>Revogue a chave e gere outra</strong> imediatamente. O GitHub tem o <em>secret scanning</em>, que avisa quando reconhece uma chave num push.</p>

<h2>Dependências</h2>
<p>Um projeto com React tem centenas de pacotes. Qualquer um deles pode ter uma falha descoberta amanhã.</p>
${trecho(`npm audit            # lista falhas conhecidas nas dependências
npm audit fix        # atualiza o que dá sem quebrar
npm outdated         # o que está desatualizado`)}
<ul>
  <li>Ligue o <strong>Dependabot</strong> no GitHub: ele abre pull requests sozinho atualizando pacotes com falhas.</li>
  <li>Antes de instalar um pacote, olhe quem mantém, quantos downloads tem e quando foi atualizado. Nomes parecidos com os de pacotes famosos (<code>reactt</code>) são um golpe comum.</li>
  <li>Grave o <code>package-lock.json</code> no repositório e use <code>npm ci</code> no servidor e no CI: instala exatamente as versões conferidas.</li>
</ul>

<h2>Registros (logs)</h2>
<p>Registre o que importa para investigar um incidente: logins (com sucesso e falha), mudanças de permissão, erros do servidor. Mas <strong>não</strong> registre senhas, tokens, números de cartão e dados pessoais além do necessário: logs vazam também, e a LGPD vale para eles.</p>
${trecho(`// Ruim
console.log('Login', { email, senha });
// Bom
console.log('Login falhou', { usuarioId, ip, quando: new Date().toISOString() });`)}

<h2>Erros que não contam segredos</h2>
<p>Para o usuário, uma mensagem genérica ("Algo deu errado. Tente de novo."). O detalhe técnico (a pilha do erro, a consulta SQL, o caminho dos arquivos) vai só para o log. Uma página de erro que mostra a consulta ao banco é um mapa para o atacante.</p>
${dica('A trilha de <a href="../lgpd/">LGPD</a> aprofunda o lado legal: o que fazer num incidente com dados pessoais e o prazo para avisar a ANPD.')}
`,
              quiz: [
                {
                  pergunta: 'Uma chave de API foi para o GitHub num commit. O que fazer primeiro?',
                  opcoes: [
                    'Apagar o arquivo e fazer outro commit',
                    'Revogar a chave e gerar uma nova',
                    'Deixar o repositório privado'
                  ],
                  certa: 1,
                  explicacao: 'A chave continua no histórico e pode já ter sido copiada.'
                },
                {
                  pergunta: 'Para que serve o npm audit?',
                  opcoes: [
                    'Deixar o projeto mais rápido',
                    'Listar falhas de segurança conhecidas nas dependências',
                    'Formatar o código'
                  ],
                  certa: 1,
                  explicacao: 'O Dependabot faz o mesmo de forma contínua no GitHub.'
                },
                {
                  pergunta: 'O que NÃO deve ir para os logs?',
                  opcoes: ['O id do usuário', 'A senha digitada', 'O horário do erro'],
                  certa: 1,
                  explicacao: 'Senhas, tokens e dados de cartão nunca entram em logs.'
                }
              ]
            },
            {
              id: 'desafio-configuracao-segura',
              tipo: 'desafio',
              titulo: 'Desafio: configuração segura do servidor',
              resumo: 'Monte os cabeçalhos de segurança e proteja o redirecionamento do login.',
              minutos: 22,
              enunciado: `
<p>Escreva duas funções que o servidor da pousada vai usar:</p>
<ul>
  <li><code>cabecalhosDeSeguranca()</code>: devolve um objeto com estes cabeçalhos:
    <ul>
      <li><code>Strict-Transport-Security</code> com <code>max-age</code> de pelo menos 31536000 e <code>includeSubDomains</code>;</li>
      <li><code>Content-Security-Policy</code> com <code>default-src 'self'</code>, <code>frame-ancestors 'none'</code>, <code>object-src 'none'</code> e um <code>script-src</code> que permita <code>'self'</code> e <code>https://cdn.jsdelivr.net</code>, <strong>sem</strong> <code>'unsafe-inline'</code> nem <code>'unsafe-eval'</code>;</li>
      <li><code>X-Content-Type-Options: nosniff</code> e <code>Referrer-Policy: strict-origin-when-cross-origin</code>.</li>
    </ul>
  </li>
  <li><code>destinoSeguro(volta)</code>: recebe o valor de <code>?volta=</code> do login e devolve para onde redirecionar. Só aceite caminhos internos: começam com <code>/</code>, mas não com <code>//</code> nem <code>/\\</code>. Qualquer outra coisa (inclusive vazio) vira <code>'/'</code>.</li>
</ul>`,
              inicial: `<script>
  function cabecalhosDeSeguranca() {
    return {
      'Content-Security-Policy': "script-src * 'unsafe-inline'"
    };
  }

  function destinoSeguro(volta) {
    return volta;
  }

  console.log(cabecalhosDeSeguranca());
  console.log(destinoSeguro('https://site-falso.com'));
</script>
`,
              testes: [
                [
                  'HSTS de pelo menos um ano, com includeSubDomains',
                  doc => {
                    const h = doc.defaultView.eval('cabecalhosDeSeguranca')()['Strict-Transport-Security'] || '';
                    const idade = Number((h.match(/max-age=(\d+)/) || [])[1]);
                    return idade >= 31536000 && /includeSubDomains/i.test(h);
                  }
                ],
                [
                  "CSP com default-src 'self', frame-ancestors e object-src 'none'",
                  doc => {
                    const csp = doc.defaultView.eval('cabecalhosDeSeguranca')()['Content-Security-Policy'] || '';
                    const diretiva = nome =>
                      csp
                        .split(';')
                        .map(d => d.trim())
                        .find(d => d.startsWith(nome + ' ')) || '';
                    return (
                      diretiva('default-src') === "default-src 'self'" &&
                      diretiva('frame-ancestors') === "frame-ancestors 'none'" &&
                      diretiva('object-src') === "object-src 'none'"
                    );
                  }
                ],
                [
                  "script-src com 'self' e o jsDelivr, sem unsafe",
                  doc => {
                    const csp = doc.defaultView.eval('cabecalhosDeSeguranca')()['Content-Security-Policy'] || '';
                    const s =
                      csp
                        .split(';')
                        .map(d => d.trim())
                        .find(d => d.startsWith('script-src ')) || '';
                    const fontes = s.split(/\s+/).slice(1);
                    return (
                      fontes.includes("'self'") &&
                      fontes.includes('https://cdn.jsdelivr.net') &&
                      !fontes.includes('*') &&
                      !/unsafe/.test(s)
                    );
                  }
                ],
                [
                  'nosniff e Referrer-Policy',
                  doc => {
                    const h = doc.defaultView.eval('cabecalhosDeSeguranca')();
                    return (
                      h['X-Content-Type-Options'] === 'nosniff' &&
                      h['Referrer-Policy'] === 'strict-origin-when-cross-origin'
                    );
                  }
                ],
                [
                  'destinoSeguro aceita só caminhos internos',
                  doc => {
                    const f = doc.defaultView.eval('destinoSeguro');
                    return (
                      f('/minha-conta') === '/minha-conta' &&
                      f('/estudos/git/?a=1') === '/estudos/git/?a=1' &&
                      [
                        'https://site-falso.com',
                        '//site-falso.com',
                        '/\\site-falso.com',
                        'javascript:alert(1)',
                        '',
                        null,
                        undefined
                      ].every(v => f(v) === '/')
                    );
                  }
                ]
              ],
              solucao: `<script>
  function cabecalhosDeSeguranca() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' https://cdn.jsdelivr.net",
      "img-src 'self' data: https:",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
    return {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': csp,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
  }

  function destinoSeguro(volta) {
    if (typeof volta !== 'string') return '/';
    const interno = volta.startsWith('/') && !volta.startsWith('//') && !volta.startsWith('/\\\\');
    return interno ? volta : '/';
  }

  console.log(cabecalhosDeSeguranca());
  console.log(destinoSeguro('https://site-falso.com'));
</script>`
            }
          ]
        }
      ]
    }
  ]
};
