// Trilha de Playwright. No editor, a primeira parte é a página a ser testada e o arquivo "// --- nome.spec.js ---"
// tem os testes. Um mini Playwright (js/estudos-ambientes.js) imita a API real (getByRole, fill, click, expect...) e
// roda os testes na própria página; o resultado sai no console. window.__testes guarda o que passou e o que falhou.
// O último desafio também roda os testes da pessoa numa cópia da página com um bug, e espera que algum falhe.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'playwright',
  area: 'Qualidade e entrega',
  titulo: 'Playwright',
  sigla: 'PW',
  linguagem: 'playwright',
  resumo: 'Testes que abrem o navegador e usam o site como uma pessoa: clicar, digitar e conferir.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'O que é um teste de ponta a ponta e como achar elementos.',
      modulos: [
        {
          titulo: 'Primeiro teste',
          itens: [
            {
              id: 'o-que-e-playwright',
              titulo: 'Testes de ponta a ponta',
              resumo: 'Por que testar no navegador, como instalar e a estrutura de um teste.',
              minutos: 9,
              corpo: `
<p>Testar na mão (abrir o site, preencher o formulário, ver se deu certo) funciona uma vez. Na décima mudança, ninguém mais refaz todos os caminhos, e um bug escapa. Um <strong>teste de ponta a ponta</strong> (<em>end-to-end</em>, ou e2e) faz isso automaticamente: abre um navegador de verdade, usa o site como uma pessoa e confere o resultado. O <strong>Playwright</strong>, da Microsoft, é uma das ferramentas mais usadas para isso, com Chrome, Firefox e Safari.</p>

<h2>Num projeto de verdade</h2>
${trecho(`npm init playwright@latest     # instala e cria a pasta tests/ e o playwright.config.js
npx playwright test            # roda todos os testes
npx playwright test --ui       # modo visual: vê cada passo e o navegador ao lado
npx playwright codegen localhost:3000   # grava seus cliques e gera o código do teste`)}

<h2>A estrutura de um teste</h2>
${trecho(`// tests/inicio.spec.js
import { test, expect } from '@playwright/test';

test('a página inicial mostra o título', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('heading', { name: 'Loja de Café' })).toBeVisible();
});`)}
<ul>
  <li><code>test(nome, função)</code> define um teste. O nome diz o que é esperado, em linguagem de gente.</li>
  <li>A função recebe <code>page</code>, uma aba do navegador já aberta.</li>
  <li>Quase tudo é assíncrono: <code>await</code> em cada ação e verificação.</li>
  <li><code>expect(...)</code> confere. Se a condição não for verdade, o teste falha e diz o porquê.</li>
</ul>

<h2>Nesta trilha</h2>
<p>O editor tem duas partes: em cima, a <strong>página</strong> que vai ser testada; depois da linha <code>// --- nome.spec.js ---</code>, o <strong>arquivo de teste</strong>. Um Playwright em miniatura roda os testes na própria página e mostra o resultado no console. Ele tem as partes mais usadas da API real, então o que você escrever aqui funciona lá (o <code>page.goto</code> não faz nada aqui, porque a página já está aberta).</p>
${codigo(`<h1>Loja de Café</h1>
<button onclick="this.textContent = 'Obrigado!'">Assinar</button>

// --- inicio.spec.js ---
import { test, expect } from '@playwright/test';

test('mostra o título', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Loja de Café' })).toBeVisible();
});

test('agradece ao assinar', async ({ page }) => {
  await page.getByRole('button', { name: 'Assinar' }).click();
  await expect(page.getByRole('button')).toHaveText('Obrigado!');
});`)}
${dica('Quebre um teste de propósito (troque "Obrigado!" por outro texto) para ver como é uma falha. Ler bem a mensagem de erro é metade do trabalho com testes.')}
`,
              quiz: [
                {
                  pergunta: 'O que um teste de ponta a ponta faz?',
                  opcoes: [
                    'Testa uma função isolada',
                    'Usa o site num navegador de verdade, como uma pessoa, e confere o resultado',
                    'Mede a velocidade do servidor'
                  ],
                  certa: 1,
                  explicacao: 'Ele passa por todas as camadas: HTML, CSS, JavaScript e servidor.'
                },
                {
                  pergunta: 'Qual comando abre o modo visual do Playwright?',
                  opcoes: ['npx playwright test --ui', 'npx playwright show', 'npm run ui'],
                  certa: 0,
                  explicacao: 'O --ui mostra cada passo, o navegador e permite rodar de novo um teste só.'
                },
                {
                  pergunta: 'Por que quase toda linha de um teste tem await?',
                  opcoes: [
                    'É só estilo',
                    'Ações e verificações levam tempo e são assíncronas',
                    'Para deixar mais lento'
                  ],
                  certa: 1,
                  explicacao: 'Clicar, esperar a página reagir e conferir são operações que terminam depois.'
                }
              ]
            },
            {
              id: 'localizadores',
              titulo: 'Localizadores',
              resumo: 'getByRole, getByLabel, getByText e por que não usar seletores CSS.',
              minutos: 11,
              corpo: `
<p>Antes de clicar ou conferir, o teste precisa achar o elemento. O Playwright recomenda achar <strong>do jeito que uma pessoa acha</strong>: pelo papel e pelo nome que aparece na tela.</p>
<ul>
  <li><code>getByRole('button', { name: 'Enviar' })</code>: o mais recomendado. Papéis comuns: <code>button</code>, <code>link</code>, <code>heading</code>, <code>textbox</code>, <code>checkbox</code>, <code>listitem</code>, <code>img</code>.</li>
  <li><code>getByLabel('E-mail')</code>: campos de formulário pelo texto do <code>&lt;label&gt;</code>.</li>
  <li><code>getByText('Pedido enviado')</code>: elementos sem papel, pelo texto.</li>
  <li><code>getByPlaceholder</code>, <code>getByAltText</code> e <code>getByTestId('carrinho')</code> (pelo atributo <code>data-testid</code>), quando nada acima serve.</li>
</ul>
${codigo(`<h1>Contato</h1>
<form>
  <label for="email">E-mail</label>
  <input id="email" type="email">
  <label><input type="checkbox"> Quero receber novidades</label>
  <button type="button" onclick="document.querySelector('#ok').hidden = false">Enviar</button>
</form>
<p id="ok" hidden>Mensagem enviada!</p>

// --- contato.spec.js ---
import { test, expect } from '@playwright/test';

test('envia o contato', async ({ page }) => {
  await page.getByLabel('E-mail').fill('ana@exemplo.com');
  await page.getByRole('checkbox', { name: 'novidades' }).check();
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.getByText('Mensagem enviada!')).toBeVisible();
  await expect(page.getByLabel('E-mail')).toHaveValue('ana@exemplo.com');
});`)}

<h2>Por que não usar #id e .classe</h2>
<p>Um teste com <code>page.locator('.btn-primary')</code> quebra quando alguém troca uma classe por motivo de estilo, sem nada ter quebrado de verdade. E não percebe quando o botão perde o texto ou o rótulo some, que é o que importa para quem usa. Localizar por papel e nome deixa o teste resistente a mudanças de visual e, de quebra, confere a acessibilidade: se o teste não acha o botão pelo nome, um leitor de tela também não acha.</p>

<h2>Um elemento só</h2>
<p>Os localizadores são <strong>estritos</strong>: se uma ação achar dois elementos, o teste falha em vez de clicar no errado. Para escolher, seja mais específico ou filtre:</p>
${trecho(`page.getByRole('listitem').filter({ hasText: 'Café' })      // o item da lista que tem "Café"
page.getByRole('listitem').filter({ hasText: 'Café' }).getByRole('button', { name: 'Remover' })
page.getByRole('button', { name: 'Comprar' }).first()         // último recurso
page.getByRole('heading', { name: 'Total', exact: true })     // nome exato, não "Subtotal"`)}
${dica('Por padrão, o name compara um pedaço do texto, sem diferenciar maiúsculas: name: "enviar" acha o botão "Enviar mensagem". Use exact: true quando precisar do texto inteiro.')}
`,
              quiz: [
                {
                  pergunta: 'Qual localizador o Playwright recomenda primeiro?',
                  opcoes: ["page.locator('#id')", 'getByRole com o nome', 'XPath'],
                  certa: 1,
                  explicacao: 'Papel e nome são o que a pessoa vê; seletores CSS mudam por motivos de estilo.'
                },
                {
                  pergunta: 'O que acontece ao clicar com um localizador que acha 3 botões?',
                  opcoes: [
                    'Clica no primeiro',
                    'O teste falha, pedindo um localizador mais específico',
                    'Clica nos três'
                  ],
                  certa: 1,
                  explicacao: 'É a regra estrita: melhor falhar que clicar no botão errado.'
                },
                {
                  pergunta: 'Como achar um campo pelo texto do <label>?',
                  opcoes: ['getByText', 'getByLabel', 'getByPlaceholder'],
                  certa: 1,
                  explicacao: 'getByLabel liga o rótulo ao campo, como um leitor de tela faz.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Ações, verificações que esperam e o primeiro conjunto de testes.',
      modulos: [
        {
          titulo: 'Ações e verificações',
          itens: [
            {
              id: 'acoes-e-expect',
              titulo: 'Ações e verificações',
              resumo: 'fill, click, check, selectOption, press e as asserções que esperam.',
              minutos: 12,
              corpo: `
<h2>Ações</h2>
<ul>
  <li><code>click()</code>, <code>fill('texto')</code> (apaga e digita), <code>press('Enter')</code></li>
  <li><code>check()</code> e <code>uncheck()</code> para caixas de seleção</li>
  <li><code>selectOption('valor')</code> para <code>&lt;select&gt;</code></li>
</ul>
<p>Antes de cada ação, o Playwright <strong>espera sozinho</strong> o elemento existir, estar visível e habilitado. Não precisa de "esperar 2 segundos".</p>

<h2>Verificações que esperam</h2>
<p>As asserções sobre a página (<code>toBeVisible</code>, <code>toHaveText</code>, <code>toHaveCount</code>...) também tentam de novo até um tempo limite. Se a página leva meio segundo para mostrar o resultado, o teste espera:</p>
${codigo(`<label for="cep">CEP</label>
<input id="cep">
<button type="button" id="buscar">Buscar</button>
<p id="resultado" role="status"></p>

<script>
  document.querySelector('#buscar').addEventListener('click', () => {
    const cep = document.querySelector('#cep').value;
    document.querySelector('#resultado').textContent = 'Buscando…';
    setTimeout(() => {
      document.querySelector('#resultado').textContent =
        cep === '80010-000' ? 'Curitiba - PR' : 'CEP não encontrado';
    }, 400);
  });
</script>

// --- cep.spec.js ---
import { test, expect } from '@playwright/test';

test('acha a cidade do CEP', async ({ page }) => {
  await page.getByLabel('CEP').fill('80010-000');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('status')).toHaveText('Curitiba - PR');
});

test('avisa quando o CEP não existe', async ({ page }) => {
  await page.getByLabel('CEP').fill('00000-000');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('status')).toHaveText('CEP não encontrado');
  await expect(page.getByText('Curitiba')).not.toBeVisible();
});`)}
<p>As verificações mais usadas: <code>toBeVisible</code>, <code>toHaveText</code> (texto inteiro) e <code>toContainText</code> (um pedaço), <code>toHaveValue</code>, <code>toHaveCount</code>, <code>toBeChecked</code>, <code>toBeDisabled</code>, <code>toHaveURL</code> e <code>toHaveTitle</code>. Qualquer uma pode ser negada com <code>.not</code>.</p>
${dica('Evite <code>await page.waitForTimeout(2000)</code>. Ele deixa o teste lento quando a página é rápida e falha quando ela é lenta. Verifique o resultado esperado e deixe o Playwright esperar por ele.')}

<h2>Um bom teste</h2>
<ul>
  <li>Testa <strong>um comportamento</strong>, com um nome que diz qual ("avisa quando o CEP não existe").</li>
  <li>Segue o roteiro <em>preparar, agir, conferir</em>.</li>
  <li>Confere o que a pessoa vê (texto, mensagem, contador), não detalhes internos.</li>
  <li>Testa também o caminho do erro: é lá que os bugs moram.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Por que não usar waitForTimeout(2000)?',
                  opcoes: [
                    'Não existe',
                    'Deixa o teste lento quando a página é rápida e instável quando ela é lenta',
                    'É mais rápido'
                  ],
                  certa: 1,
                  explicacao: 'As asserções já esperam o resultado aparecer.'
                },
                {
                  pergunta: 'Qual a diferença entre toHaveText e toContainText?',
                  opcoes: [
                    'Nenhuma',
                    'toHaveText exige o texto inteiro; toContainText, um pedaço',
                    'toContainText é para listas'
                  ],
                  certa: 1,
                  explicacao: 'Use toContainText quando o resto do texto pode variar.'
                },
                {
                  pergunta: 'Como conferir que algo NÃO aparece?',
                  opcoes: ['expect(x).hidden()', 'expect(x).not.toBeVisible()', 'expect(!x).toBeVisible()'],
                  certa: 1,
                  explicacao: 'O .not inverte qualquer asserção.'
                }
              ]
            },
            {
              id: 'desafio-login',
              tipo: 'desafio',
              titulo: 'Desafio: testar um login',
              resumo: 'Escreva os testes da tela de login.',
              minutos: 20,
              enunciado: `
<p>A tela de login (na parte de cima) já funciona. Agora é a sua vez de escrever os testes, em <code>login.spec.js</code>. Escreva <strong>três testes</strong>, todos passando:</p>
<ol>
  <li>Entrar sem preencher nada mostra "Preencha e-mail e senha".</li>
  <li>Senha errada mostra "E-mail ou senha incorretos".</li>
  <li>E-mail <code>ana@cafe.com</code> com a senha <code>cafe123</code> mostra "Bem-vinda, Ana!".</li>
</ol>
<p>Use <code>getByLabel</code> para os campos e <code>getByRole</code> para o botão.</p>`,
              inicial: `<h1>Entrar</h1>
<form id="login">
  <label for="email">E-mail</label>
  <input id="email" type="email">
  <label for="senha">Senha</label>
  <input id="senha" type="password">
  <button>Entrar</button>
</form>
<p role="alert" id="mensagem"></p>

<script>
  document.querySelector('#login').addEventListener('submit', evento => {
    evento.preventDefault();
    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#senha').value;
    const mensagem = document.querySelector('#mensagem');
    if (!email || !senha) mensagem.textContent = 'Preencha e-mail e senha';
    else if (email === 'ana@cafe.com' && senha === 'cafe123') mensagem.textContent = 'Bem-vinda, Ana!';
    else mensagem.textContent = 'E-mail ou senha incorretos';
  });
</script>

// --- login.spec.js ---
import { test, expect } from '@playwright/test';

test('pede para preencher os campos', async ({ page }) => {
  // escreva aqui
});
`,
              testes: [
                [
                  'Há pelo menos três testes e todos passam',
                  doc => {
                    const t = doc.defaultView.__testes || [];
                    return t.length >= 3 && t.every(x => x.passou);
                  }
                ],
                [
                  'Os testes usam getByLabel e getByRole',
                  doc => {
                    const spec =
                      doc.defaultView.frameElement
                        .closest('.editor')
                        .querySelector('textarea')
                        .value.split(/\/\/ --- \S+\.spec\.js ---/)[1] || '';
                    return /getByLabel\(/.test(spec) && /getByRole\(\s*['"]button['"]/.test(spec);
                  }
                ],
                [
                  'Os três textos esperados são conferidos com expect',
                  doc => {
                    const spec =
                      doc.defaultView.frameElement
                        .closest('.editor')
                        .querySelector('textarea')
                        .value.split(/\/\/ --- \S+\.spec\.js ---/)[1] || '';
                    return (
                      (spec.match(/expect\(/g) || []).length >= 3 &&
                      ['Preencha e-mail e senha', 'E-mail ou senha incorretos', 'Bem-vinda, Ana'].every(t =>
                        spec.includes(t)
                      )
                    );
                  }
                ]
              ],
              solucao: `<h1>Entrar</h1>
<form id="login">
  <label for="email">E-mail</label>
  <input id="email" type="email">
  <label for="senha">Senha</label>
  <input id="senha" type="password">
  <button>Entrar</button>
</form>
<p role="alert" id="mensagem"></p>

<script>
  document.querySelector('#login').addEventListener('submit', evento => {
    evento.preventDefault();
    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#senha').value;
    const mensagem = document.querySelector('#mensagem');
    if (!email || !senha) mensagem.textContent = 'Preencha e-mail e senha';
    else if (email === 'ana@cafe.com' && senha === 'cafe123') mensagem.textContent = 'Bem-vinda, Ana!';
    else mensagem.textContent = 'E-mail ou senha incorretos';
  });
</script>

// --- login.spec.js ---
import { test, expect } from '@playwright/test';

test('pede para preencher os campos', async ({ page }) => {
  await page.getByLabel('E-mail').fill('');
  await page.getByLabel('Senha').fill('');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('alert')).toHaveText('Preencha e-mail e senha');
});

test('recusa a senha errada', async ({ page }) => {
  await page.getByLabel('E-mail').fill('ana@cafe.com');
  await page.getByLabel('Senha').fill('errada');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('alert')).toHaveText('E-mail ou senha incorretos');
});

test('entra com e-mail e senha certos', async ({ page }) => {
  await page.getByLabel('E-mail').fill('ana@cafe.com');
  await page.getByLabel('Senha').fill('cafe123');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('alert')).toHaveText('Bem-vinda, Ana!');
});`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Testes independentes, rede simulada, CI e testes que pegam bugs de verdade.',
      modulos: [
        {
          titulo: 'Testes confiáveis',
          itens: [
            {
              id: 'boas-praticas',
              titulo: 'Testes confiáveis',
              resumo: 'Isolamento, beforeEach, simular a rede, CI e o trace viewer.',
              minutos: 13,
              corpo: `
<h2>Cada teste por si</h2>
<p>No Playwright de verdade, cada teste recebe uma aba nova, com cookies e localStorage zerados. Um teste nunca deve depender de outro ter rodado antes: assim eles podem rodar em paralelo, em qualquer ordem, e uma falha não derruba as outras. O que se repete no começo de todos vai num <code>beforeEach</code>:</p>
${trecho(`test.beforeEach(async ({ page }) => {
  await page.goto('/loja');
  await page.getByRole('button', { name: 'Aceitar cookies' }).click();
});`)}
${dica('No editor desta trilha, os testes rodam um depois do outro <strong>na mesma página</strong>. Por isso, nos exemplos, o <code>beforeEach</code> põe a página no estado inicial (clicando em "Limpar", por exemplo).')}

<h2>Login uma vez só</h2>
<p>Fazer login pela tela em cada teste é lento. O Playwright permite logar uma vez num passo de preparação, salvar o estado (cookies e localStorage) num arquivo e reaproveitar em todos os testes com <code>storageState</code> no <code>playwright.config.js</code>.</p>

<h2>Simular a rede</h2>
<p>Testes que dependem de uma API real ficam lentos e falham quando ela está fora do ar. <code>page.route</code> intercepta pedidos e responde o que você quiser, inclusive erros:</p>
${trecho(`test('mostra aviso quando a API falha', async ({ page }) => {
  await page.route('**/api/produtos', rota => rota.fulfill({ status: 500 }));
  await page.goto('/loja');
  await expect(page.getByRole('alert')).toHaveText('Não foi possível carregar os produtos');
});

test('lista os produtos da API', async ({ page }) => {
  await page.route('**/api/produtos', rota =>
    rota.fulfill({ json: [{ id: 1, nome: 'Café', preco: 62.9 }] })
  );
  await page.goto('/loja');
  await expect(page.getByRole('listitem')).toHaveCount(1);
});`)}

<h2>No CI</h2>
<p>O <code>npm init playwright</code> já oferece criar um workflow do GitHub Actions que roda os testes a cada push. O <code>webServer</code> do config sobe o site antes dos testes:</p>
${trecho(`// playwright.config.js
export default defineConfig({
  use: { baseURL: 'http://localhost:4173', trace: 'on-first-retry' },
  retries: process.env.CI ? 2 : 0,
  webServer: { command: 'npm run preview', port: 4173 }
});`)}
<p>Com <code>trace</code> ligado, uma falha no CI gera um arquivo que o <strong>trace viewer</strong> (<code>npx playwright show-trace</code>) abre com cada passo, o DOM, o console e a rede naquele momento: dá para depurar uma falha que só acontece lá.</p>

<h2>Testes que pegam bugs</h2>
<p>Um teste que nunca falha não protege nada. Um jeito simples de saber se os seus testes valem: <strong>quebre o código de propósito</strong> (troque um <code>+</code> por <code>-</code>, apague uma linha) e veja se algum teste falha. Se nenhum falhar, falta um teste. O próximo desafio faz exatamente isso com os seus testes.</p>
`,
              quiz: [
                {
                  pergunta: 'Por que um teste não deve depender de outro?',
                  opcoes: [
                    'Por estilo',
                    'Para rodarem em paralelo, em qualquer ordem, e uma falha não derrubar as outras',
                    'É uma regra do JavaScript'
                  ],
                  certa: 1,
                  explicacao: 'Cada teste prepara o próprio estado, normalmente num beforeEach.'
                },
                {
                  pergunta: 'Para que serve page.route?',
                  opcoes: [
                    'Navegar entre páginas',
                    'Interceptar pedidos de rede e responder o que o teste quiser',
                    'Criar rotas no servidor'
                  ],
                  certa: 1,
                  explicacao: 'Assim dá para testar o erro da API sem derrubar a API.'
                },
                {
                  pergunta: 'Como saber se os seus testes realmente protegem o código?',
                  opcoes: [
                    'Contando quantos são',
                    'Quebrando o código de propósito e vendo se algum falha',
                    'Se todos passam'
                  ],
                  certa: 1,
                  explicacao: 'Testes que continuam passando com o código quebrado não estão conferindo aquilo.'
                }
              ]
            },
            {
              id: 'desafio-carrinho',
              tipo: 'desafio',
              titulo: 'Desafio: testes que pegam o bug',
              resumo: 'Teste um carrinho de compras e prove que os testes pegam erros.',
              minutos: 25,
              enunciado: `
<p>Escreva os testes do carrinho em <code>carrinho.spec.js</code>:</p>
<ul>
  <li>Pelo menos <strong>dois testes</strong>, todos passando, com um <code>test.beforeEach</code> que clica em <strong>Esvaziar</strong> (para cada teste começar do zero).</li>
  <li>Um teste confere o <strong>total</strong> depois de adicionar produtos (o total está no elemento com <code>data-testid="total"</code>).</li>
  <li>Um teste confere o <strong>contador de itens</strong> do botão do carrinho.</li>
</ul>
<p>O último teste deste desafio roda os seus testes numa cópia da página <strong>com um bug</strong> (o total soma errado). Pelo menos um dos seus testes precisa falhar lá.</p>`,
              inicial: `<h1>Loja</h1>
<ul>
  <li>Café — R$ 30 <button data-preco="30">Adicionar Café</button></li>
  <li>Caneca — R$ 25 <button data-preco="25">Adicionar Caneca</button></li>
</ul>
<button id="abrir">Carrinho (0)</button>
<p>Total: <strong data-testid="total">R$ 0</strong></p>
<button id="esvaziar">Esvaziar</button>

<script>
  let itens = [];
  function desenhar() {
    const total = itens.reduce((soma, preco) => soma + preco, 0);
    document.querySelector('[data-testid="total"]').textContent = 'R$ ' + total;
    document.querySelector('#abrir').textContent = 'Carrinho (' + itens.length + ')';
  }
  document.querySelectorAll('[data-preco]').forEach(botao =>
    botao.addEventListener('click', () => { itens.push(Number(botao.dataset.preco)); desenhar(); })
  );
  document.querySelector('#esvaziar').addEventListener('click', () => { itens = []; desenhar(); });
</script>

// --- carrinho.spec.js ---
import { test, expect } from '@playwright/test';
`,
              testes: [
                [
                  'Pelo menos dois testes, todos passando',
                  doc => {
                    const t = doc.defaultView.__testes || [];
                    return t.length >= 2 && t.every(x => x.passou);
                  }
                ],
                [
                  'Usa test.beforeEach para esvaziar o carrinho',
                  doc => {
                    const spec =
                      doc.defaultView.frameElement
                        .closest('.editor')
                        .querySelector('textarea')
                        .value.split(/\/\/ --- \S+\.spec\.js ---/)[1] || '';
                    return /test\.beforeEach\(/.test(spec) && /Esvaziar/.test(spec);
                  }
                ],
                [
                  'Confere o total e o contador do carrinho',
                  doc => {
                    const spec =
                      doc.defaultView.frameElement
                        .closest('.editor')
                        .querySelector('textarea')
                        .value.split(/\/\/ --- \S+\.spec\.js ---/)[1] || '';
                    return /getByTestId\(\s*['"]total['"]\s*\)/.test(spec) && /Carrinho \(\d+\)/.test(spec);
                  }
                ],
                [
                  'Os testes pegam o bug: na cópia com o total errado, algum falha',
                  async doc => {
                    const original = doc.defaultView.frameElement.srcdoc;
                    const comBug = original.replace('soma + preco', 'soma + preco + (soma > 0 ? 1 : 0)');
                    if (comBug === original) return false;
                    const copia = document.createElement('iframe');
                    copia.sandbox = 'allow-scripts allow-same-origin';
                    copia.hidden = true;
                    copia.srcdoc = comBug;
                    const carregou = new Promise(r => (copia.onload = r));
                    document.body.append(copia);
                    await carregou;
                    await copia.contentWindow.__pronto;
                    const resultado = copia.contentWindow.__testes || [];
                    copia.remove();
                    return resultado.length > 0 && resultado.some(t => !t.passou);
                  }
                ]
              ],
              solucao: `<h1>Loja</h1>
<ul>
  <li>Café — R$ 30 <button data-preco="30">Adicionar Café</button></li>
  <li>Caneca — R$ 25 <button data-preco="25">Adicionar Caneca</button></li>
</ul>
<button id="abrir">Carrinho (0)</button>
<p>Total: <strong data-testid="total">R$ 0</strong></p>
<button id="esvaziar">Esvaziar</button>

<script>
  let itens = [];
  function desenhar() {
    const total = itens.reduce((soma, preco) => soma + preco, 0);
    document.querySelector('[data-testid="total"]').textContent = 'R$ ' + total;
    document.querySelector('#abrir').textContent = 'Carrinho (' + itens.length + ')';
  }
  document.querySelectorAll('[data-preco]').forEach(botao =>
    botao.addEventListener('click', () => { itens.push(Number(botao.dataset.preco)); desenhar(); })
  );
  document.querySelector('#esvaziar').addEventListener('click', () => { itens = []; desenhar(); });
</script>

// --- carrinho.spec.js ---
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.getByRole('button', { name: 'Esvaziar' }).click();
});

test('soma o total dos produtos', async ({ page }) => {
  await page.getByRole('button', { name: 'Adicionar Café' }).click();
  await page.getByRole('button', { name: 'Adicionar Caneca' }).click();
  await page.getByRole('button', { name: 'Adicionar Café' }).click();
  await expect(page.getByTestId('total')).toHaveText('R$ 85');
});

test('conta os itens no botão do carrinho', async ({ page }) => {
  await page.getByRole('button', { name: 'Adicionar Caneca' }).click();
  await page.getByRole('button', { name: 'Adicionar Caneca' }).click();
  await expect(page.getByRole('button', { name: /^Carrinho/ })).toHaveText('Carrinho (2)');
});`
            }
          ]
        },
        {
          titulo: 'Organizar os testes',
          itens: [
            {
              id: 'page-objects',
              titulo: 'Page Objects',
              resumo: 'Uma classe por tela, para os testes lerem como uma história.',
              minutos: 12,
              corpo: `
<p>Com dezenas de testes, o mesmo <code>page.getByLabel('E-mail').fill(...)</code> aparece em todo lugar. Se o rótulo mudar para "Seu e-mail", são dezenas de arquivos para corrigir. O padrão <strong>Page Object</strong> resolve: uma classe para cada tela, com métodos que descrevem o que a pessoa faz. Os testes chamam os métodos; os localizadores ficam num lugar só.</p>
${codigo(`<h1>Entrar</h1>
<form id="login">
  <label for="email">E-mail</label> <input id="email">
  <label for="senha">Senha</label> <input id="senha" type="password">
  <button>Entrar</button>
</form>
<p role="alert" id="msg"></p>
<script>
  document.querySelector('#login').addEventListener('submit', e => {
    e.preventDefault();
    const ok = document.querySelector('#email').value === 'ana@cafe.com' && document.querySelector('#senha').value === 'cafe123';
    document.querySelector('#msg').textContent = ok ? 'Bem-vinda, Ana!' : 'E-mail ou senha incorretos';
  });
</script>

// --- login.spec.js ---
import { test, expect } from '@playwright/test';

class PaginaLogin {
  constructor(page) {
    this.page = page;
    this.email = page.getByLabel('E-mail');
    this.senha = page.getByLabel('Senha');
    this.botao = page.getByRole('button', { name: 'Entrar' });
    this.mensagem = page.getByRole('alert');
  }

  async entrar(email, senha) {
    await this.email.fill(email);
    await this.senha.fill(senha);
    await this.botao.click();
  }
}

test('entra com a senha certa', async ({ page }) => {
  const login = new PaginaLogin(page);
  await login.entrar('ana@cafe.com', 'cafe123');
  await expect(login.mensagem).toHaveText('Bem-vinda, Ana!');
});

test('recusa a senha errada', async ({ page }) => {
  const login = new PaginaLogin(page);
  await login.entrar('ana@cafe.com', '123');
  await expect(login.mensagem).toHaveText('E-mail ou senha incorretos');
});`)}
<ul>
  <li>Os métodos descrevem <strong>ações da pessoa</strong> (<code>entrar</code>, <code>adicionarAoCarrinho</code>), não detalhes da tela (<code>clicarNoBotaoAzul</code>).</li>
  <li>As <strong>verificações</strong> ficam nos testes, não dentro da classe: cada teste decide o que conferir.</li>
  <li>Num projeto, cada classe fica no seu arquivo (<code>tests/paginas/login.js</code>) e é importada pelos testes.</li>
</ul>

<h2>Fixtures</h2>
<p>O Playwright permite criar <strong>fixtures</strong> próprias: em vez de cada teste escrever <code>new PaginaLogin(page)</code>, ele recebe a página pronta, como recebe o <code>page</code>:</p>
${trecho(`// tests/fixtures.js
import { test as base } from '@playwright/test';
import { PaginaLogin } from './paginas/login.js';

export const test = base.extend({
  login: async ({ page }, use) => {
    await page.goto('/entrar');
    await use(new PaginaLogin(page));
  }
});

// num teste:
test('entra', async ({ login }) => {
  await login.entrar('ana@cafe.com', 'cafe123');
});`)}
${dica('Comece sem Page Objects. Quando o mesmo trecho aparecer em três testes, extraia para uma classe. Abstrair cedo demais deixa os testes difíceis de ler.')}
`,
              quiz: [
                {
                  pergunta: 'Que problema o Page Object resolve?',
                  opcoes: [
                    'Testes lentos',
                    'Localizadores repetidos em muitos testes: uma mudança na tela vira uma correção num lugar só',
                    'Falta de navegador'
                  ],
                  certa: 1,
                  explicacao: 'Os testes chamam métodos; os detalhes da tela ficam na classe.'
                },
                {
                  pergunta: 'Onde ficam os expect, num projeto com Page Objects?',
                  opcoes: ['Dentro das classes', 'Nos testes', 'Num arquivo separado de asserções'],
                  certa: 1,
                  explicacao: 'Cada teste decide o que conferir; a classe só sabe usar a tela.'
                },
                {
                  pergunta: 'Qual nome de método combina melhor com um Page Object?',
                  opcoes: ['clicarNoBotaoVerde()', 'finalizarCompra()', 'getElementById()'],
                  certa: 1,
                  explicacao: 'O método descreve a ação da pessoa, não o detalhe visual.'
                }
              ]
            },
            {
              id: 'listas-tabelas-e-visual',
              titulo: 'Listas, tabelas e testes visuais',
              resumo: 'Achar a linha certa, contar itens, comparar prints e conferir acessibilidade.',
              minutos: 12,
              corpo: `
<h2>A linha certa de uma tabela</h2>
<p>Em listas e tabelas, o padrão é: achar a linha pelo texto e, dentro dela, o botão ou a célula. <code>filter({ hasText })</code> faz o primeiro passo:</p>
${codigo(`<table>
  <thead><tr><th>Pedido</th><th>Cliente</th><th>Status</th><th></th></tr></thead>
  <tbody>
    <tr><td>#101</td><td>Ana</td><td>Pago</td><td><button>Enviar</button></td></tr>
    <tr><td>#102</td><td>Bruno</td><td>Pago</td><td><button>Enviar</button></td></tr>
    <tr><td>#103</td><td>Carla</td><td>Enviado</td><td></td></tr>
  </tbody>
</table>
<script>
  document.querySelectorAll('tbody button').forEach(b => b.addEventListener('click', () => {
    b.closest('tr').children[2].textContent = 'Enviado';
    b.remove();
  }));
</script>

// --- pedidos.spec.js ---
import { test, expect } from '@playwright/test';

test('envia o pedido do Bruno', async ({ page }) => {
  const linhas = page.getByRole('row');
  await expect(linhas).toHaveCount(4);                      // cabeçalho + 3

  const bruno = linhas.filter({ hasText: 'Bruno' });
  await bruno.getByRole('button', { name: 'Enviar' }).click();
  await expect(bruno).toContainText('Enviado');

  await expect(page.getByRole('button', { name: 'Enviar' })).toHaveCount(1);   // só o da Ana
});`)}

<h2>Testes visuais</h2>
<p>Alguns bugs são só visuais: um botão que sumiu atrás de outro, um CSS que quebrou. O Playwright compara um print da página com um print de referência:</p>
${trecho(`test('a página inicial não mudou', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('inicio.png', { maxDiffPixelRatio: 0.01 });
});
// primeira execução: grava a referência. Depois: falha se mudar mais que 1%.
// mudou de propósito? npx playwright test --update-snapshots`)}
<p>Prints variam entre sistemas (fontes, antialiasing). Gere as referências no mesmo ambiente do CI (em geral, Linux no GitHub Actions) e esconda o que muda sozinho, como datas e anúncios, com a opção <code>mask</code>.</p>

<h2>Acessibilidade automática</h2>
${trecho(`import AxeBuilder from '@axe-core/playwright';

test('a página não tem problemas de acessibilidade detectáveis', async ({ page }) => {
  await page.goto('/contato');
  const resultado = await new AxeBuilder({ page }).analyze();
  expect(resultado.violations).toEqual([]);
});`)}
${dica('Ferramentas automáticas acham por volta de um terço dos problemas de acessibilidade (contraste, rótulos faltando, imagens sem alt). O resto exige testar com teclado e leitor de tela.')}
`,
              quiz: [
                {
                  pergunta: 'Como clicar no botão Enviar da linha do Bruno?',
                  opcoes: [
                    "page.getByRole('button').nth(1).click()",
                    "page.getByRole('row').filter({ hasText: 'Bruno' }).getByRole('button', { name: 'Enviar' }).click()",
                    "page.locator('tr:nth-child(2) button').click()"
                  ],
                  certa: 1,
                  explicacao: 'Achar a linha pelo conteúdo resiste a mudanças de ordem.'
                },
                {
                  pergunta: 'O que toHaveScreenshot faz na primeira execução?',
                  opcoes: ['Falha', 'Grava o print de referência', 'Nada'],
                  certa: 1,
                  explicacao: 'Nas seguintes, compara com essa referência.'
                },
                {
                  pergunta:
                    'Uma verificação automática de acessibilidade (axe) sem violações garante uma página acessível?',
                  opcoes: ['Sim', 'Não: ela acha só parte dos problemas', 'Só em português'],
                  certa: 1,
                  explicacao: 'Teste também com teclado e leitor de tela.'
                }
              ]
            },
            {
              id: 'desafio-page-object',
              tipo: 'desafio',
              titulo: 'Desafio: Page Object de tarefas',
              resumo: 'Uma classe para a tela de tarefas e testes que pegam o bug.',
              minutos: 25,
              enunciado: `
<p>Escreva os testes da lista de tarefas usando um Page Object:</p>
<ul>
  <li>Uma classe <code>PaginaTarefas</code> com o construtor recebendo <code>page</code> e os métodos <code>adicionar(texto)</code> e <code>concluir(texto)</code>.</li>
  <li>Pelo menos <strong>dois testes</strong>, todos passando, que criam a página com <code>new PaginaTarefas(page)</code>.</li>
  <li>Um teste confere que uma tarefa concluída fica com a classe <code>feita</code> (use <code>toHaveClass</code>).</li>
</ul>
<p>O último teste deste desafio roda os seus testes numa cópia da página em que <strong>concluir não funciona</strong>. Algum dos seus testes precisa falhar lá.</p>`,
              inicial: `<form id="nova">
  <label for="tarefa">Nova tarefa</label>
  <input id="tarefa">
  <button>Adicionar</button>
</form>
<ul id="lista"></ul>

<script>
  document.querySelector('#nova').addEventListener('submit', e => {
    e.preventDefault();
    const campo = document.querySelector('#tarefa');
    const li = document.createElement('li');
    li.innerHTML = '<span></span> <button type="button">Concluir</button>';
    li.querySelector('span').textContent = campo.value;
    li.querySelector('button').addEventListener('click', () => li.classList.toggle('feita'));
    document.querySelector('#lista').append(li);
    campo.value = '';
  });
</script>

// --- tarefas.spec.js ---
import { test, expect } from '@playwright/test';
`,
              testes: [
                [
                  'Há uma classe PaginaTarefas com adicionar e concluir, usada nos testes',
                  doc => {
                    const spec =
                      doc.defaultView.frameElement
                        .closest('.editor')
                        .querySelector('textarea')
                        .value.split(/\/\/ --- \S+\.spec\.js ---/)[1] || '';
                    return (
                      /class\s+PaginaTarefas/.test(spec) &&
                      /async\s+adicionar\s*\(/.test(spec) &&
                      /async\s+concluir\s*\(/.test(spec) &&
                      /new\s+PaginaTarefas\(\s*page\s*\)/.test(spec)
                    );
                  }
                ],
                [
                  'Pelo menos dois testes, todos passando',
                  doc => {
                    const t = doc.defaultView.__testes || [];
                    return t.length >= 2 && t.every(x => x.passou);
                  }
                ],
                [
                  'Um teste confere a classe feita com toHaveClass',
                  doc => {
                    const spec =
                      doc.defaultView.frameElement
                        .closest('.editor')
                        .querySelector('textarea')
                        .value.split(/\/\/ --- \S+\.spec\.js ---/)[1] || '';
                    return /toHaveClass\(\s*\/?['"]?feita/.test(spec);
                  }
                ],
                [
                  'Os testes pegam o bug: com concluir quebrado, algum falha',
                  async doc => {
                    const original = doc.defaultView.frameElement.srcdoc;
                    const comBug = original.replace("li.classList.toggle('feita')", 'null');
                    if (comBug === original) return false;
                    const copia = document.createElement('iframe');
                    copia.sandbox = 'allow-scripts allow-same-origin allow-forms';
                    copia.hidden = true;
                    copia.srcdoc = comBug;
                    const carregou = new Promise(r => (copia.onload = r));
                    document.body.append(copia);
                    await carregou;
                    await copia.contentWindow.__pronto;
                    const resultado = copia.contentWindow.__testes || [];
                    copia.remove();
                    return resultado.length > 0 && resultado.some(t => !t.passou);
                  }
                ]
              ],
              solucao: `<form id="nova">
  <label for="tarefa">Nova tarefa</label>
  <input id="tarefa">
  <button>Adicionar</button>
</form>
<ul id="lista"></ul>

<script>
  document.querySelector('#nova').addEventListener('submit', e => {
    e.preventDefault();
    const campo = document.querySelector('#tarefa');
    const li = document.createElement('li');
    li.innerHTML = '<span></span> <button type="button">Concluir</button>';
    li.querySelector('span').textContent = campo.value;
    li.querySelector('button').addEventListener('click', () => li.classList.toggle('feita'));
    document.querySelector('#lista').append(li);
    campo.value = '';
  });
</script>

// --- tarefas.spec.js ---
import { test, expect } from '@playwright/test';

class PaginaTarefas {
  constructor(page) {
    this.page = page;
    this.campo = page.getByLabel('Nova tarefa');
    this.botaoAdicionar = page.getByRole('button', { name: 'Adicionar' });
    this.itens = page.getByRole('listitem');
  }

  item(texto) {
    return this.itens.filter({ hasText: texto });
  }

  async adicionar(texto) {
    await this.campo.fill(texto);
    await this.botaoAdicionar.click();
  }

  async concluir(texto) {
    await this.item(texto).getByRole('button', { name: 'Concluir' }).click();
  }
}

test('adiciona tarefas', async ({ page }) => {
  const tarefas = new PaginaTarefas(page);
  await tarefas.adicionar('Estudar Playwright');
  await expect(tarefas.item('Estudar Playwright')).toBeVisible();
});

test('conclui uma tarefa', async ({ page }) => {
  const tarefas = new PaginaTarefas(page);
  await tarefas.adicionar('Revisar o PR');
  await tarefas.concluir('Revisar o PR');
  await expect(tarefas.item('Revisar o PR')).toHaveClass(/feita/);
});`
            }
          ]
        }
      ]
    }
  ]
};
