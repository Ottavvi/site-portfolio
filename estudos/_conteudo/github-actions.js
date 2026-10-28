// Trilha de GitHub Actions. O editor lê o YAML (com o js-yaml) e mostra o workflow como o GitHub entenderia:
// gatilhos, jobs e passos. Os testes conferem a estrutura lida, em window.__yaml (ou o erro, em window.__erro).
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'github-actions',
  area: 'Qualidade e entrega',
  titulo: 'GitHub Actions',
  sigla: 'GA',
  linguagem: 'yaml',
  resumo: 'Automatizar testes e publicação a cada push: o código vai para o ar sem passo manual.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'YAML, o que é CI e o primeiro workflow.',
      modulos: [
        {
          titulo: 'Primeiro workflow',
          itens: [
            {
              id: 'o-que-e-ci',
              titulo: 'CI, workflows e YAML',
              resumo: 'O que é integração contínua e como se escreve YAML.',
              minutos: 10,
              corpo: `
<p><strong>Integração contínua</strong> (CI) é rodar automaticamente as verificações do projeto (testes, formatação, build) a cada mudança enviada. <strong>Entrega contínua</strong> (CD) vai um passo além e publica sozinho quando tudo passa. No GitHub, isso é feito pelo <strong>GitHub Actions</strong>, de graça para repositórios públicos.</p>
<p>Este site, por exemplo, tem um workflow que a cada push confere todos os links internos, a formatação e as notas do Lighthouse. Se algo quebra, o GitHub avisa por e-mail e marca o commit com um ✗ vermelho.</p>

<h2>Onde fica</h2>
<p>Workflows são arquivos <code>.yml</code> na pasta <code>.github/workflows/</code> do repositório. Cada um diz <strong>quando</strong> rodar (<code>on</code>) e <strong>o que</strong> rodar (<code>jobs</code>, cada um com seus <code>steps</code>), numa máquina virtual que o GitHub liga só para isso (o <em>runner</em>).</p>

<h2>YAML em 2 minutos</h2>
<p>YAML é um formato de configuração feito para ser lido por gente. O editor desta trilha mostra como o GitHub entende o que você escreveu:</p>
${codigo(`# Comentários começam com #
name: Exemplo de YAML

on: push

jobs:
  ola:
    runs-on: ubuntu-latest
    steps:
      - name: Dizer olá
        run: echo "Olá, Actions!"
      - name: Várias linhas
        run: |
          echo "primeira linha"
          echo "segunda linha"`)}
<ul>
  <li><strong>Chave: valor</strong>, com um espaço depois dos dois pontos.</li>
  <li>A <strong>indentação</strong> (sempre com espaços, nunca tab) diz o que está dentro de quê.</li>
  <li>Itens de lista começam com <code>- </code>. Em <code>steps</code>, cada passo é um item.</li>
  <li><code>|</code> começa um texto de várias linhas, que mantém as quebras.</li>
  <li>Texto não precisa de aspas, a não ser que tenha caracteres especiais como <code>:</code> seguido de espaço ou comece com <code>*</code> ou <code>{</code>.</li>
</ul>
${dica('Errar a indentação é o erro número 1 em YAML. O editor desta trilha mostra o erro e a linha; no GitHub, a aba Actions mostra "Invalid workflow file".')}
`,
              quiz: [
                {
                  pergunta: 'Onde ficam os workflows do GitHub Actions?',
                  opcoes: ['Na raiz do repositório', 'Em .github/workflows/', 'Nas configurações do GitHub'],
                  certa: 1,
                  explicacao: 'Arquivos .yml nessa pasta, versionados junto com o código.'
                },
                {
                  pergunta: 'Em YAML, o que define o que está dentro de quê?',
                  opcoes: ['Chaves { }', 'A indentação com espaços', 'Ponto e vírgula'],
                  certa: 1,
                  explicacao: 'E tab não é aceito: só espaços.'
                },
                {
                  pergunta: 'O que é integração contínua?',
                  opcoes: [
                    'Programar sem parar',
                    'Rodar as verificações do projeto automaticamente a cada mudança',
                    'Juntar dois repositórios'
                  ],
                  certa: 1,
                  explicacao: 'Testes, formatação e build rodando a cada push, sem depender de alguém lembrar.'
                }
              ]
            },
            {
              id: 'primeiro-workflow',
              titulo: 'Testes a cada push',
              resumo: 'checkout, setup-node, npm ci e npm test.',
              minutos: 10,
              corpo: `
<p>O workflow mais comum de todos: a cada push e pull request, instalar as dependências e rodar os testes.</p>
${codigo(`name: Testes

on:
  push:
    branches: [main]
  pull_request:

jobs:
  testes:
    runs-on: ubuntu-latest
    steps:
      - name: Baixar o código
        uses: actions/checkout@v4

      - name: Instalar o Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependências
        run: npm ci

      - name: Rodar os testes
        run: npm test`)}
<ul>
  <li>A máquina começa <strong>vazia</strong>. O primeiro passo quase sempre é o <code>actions/checkout</code>, que baixa o repositório.</li>
  <li><code>uses</code> roda uma <strong>action</strong> pronta, escrita por outra pessoa (aqui, as oficiais do GitHub). O <code>@v4</code> é a versão. <code>with</code> passa as opções dela.</li>
  <li><code>run</code> roda comandos no terminal da máquina, como você faria no seu computador.</li>
  <li><code>cache: npm</code> guarda os pacotes baixados entre uma execução e outra: as próximas ficam mais rápidas.</li>
  <li>Se um passo falha (o comando termina com erro), os seguintes não rodam e o workflow fica vermelho.</li>
</ul>

<h2>Acompanhar</h2>
<p>Na aba <strong>Actions</strong> do repositório aparece cada execução, com o log de cada passo. Num pull request, o resultado aparece no fim da página, e dá para exigir que ele passe antes de juntar (em Settings, Branches, regras de proteção).</p>
${dica('Um selo no README mostra o estado para quem visita: <code>![Testes](https://github.com/USUARIO/REPO/actions/workflows/testes.yml/badge.svg)</code>.')}
`,
              quiz: [
                {
                  pergunta: 'Por que o primeiro passo costuma ser actions/checkout?',
                  opcoes: [
                    'Para fazer login',
                    'A máquina começa vazia: ele baixa o código do repositório',
                    'Para criar a branch'
                  ],
                  certa: 1,
                  explicacao: 'Sem ele, não há código nenhum para testar.'
                },
                {
                  pergunta: 'Qual a diferença entre uses e run?',
                  opcoes: [
                    'Nenhuma',
                    'uses roda uma action pronta; run roda comandos no terminal',
                    'run é só para Windows'
                  ],
                  certa: 1,
                  explicacao: 'Actions prontas cuidam de tarefas comuns; run é para os seus comandos.'
                },
                {
                  pergunta: 'O que acontece quando um passo falha?',
                  opcoes: [
                    'Os outros continuam',
                    'Os seguintes não rodam e o workflow fica vermelho',
                    'Ele tenta 3 vezes'
                  ],
                  certa: 1,
                  explicacao: 'O job para no primeiro erro, a não ser que o passo diga o contrário.'
                }
              ]
            },
            {
              id: 'desafio-primeiro-workflow',
              tipo: 'desafio',
              titulo: 'Desafio: workflow de verificação',
              resumo: 'Escreva um workflow que formata e testa a cada push e pull request.',
              minutos: 15,
              enunciado: `
<p>Escreva o workflow <strong>Verificar</strong> de um projeto Node:</p>
<ul>
  <li>Roda em <code>push</code> na branch <code>main</code> e em todo <code>pull_request</code>.</li>
  <li>Um job chamado <code>verificar</code>, em <code>ubuntu-latest</code>.</li>
  <li>Passos: <code>actions/checkout@v4</code>; <code>actions/setup-node@v4</code> com <code>node-version</code> 22; <code>npm ci</code>; <code>npx prettier --check .</code>; e por último <code>npm test</code>.</li>
</ul>`,
              inicial: `name: Verificar

on: push

jobs:
  verificar:
    steps:
      - run: npm test
`,
              testes: [
                [
                  'O YAML é válido e se chama Verificar',
                  doc => !doc.defaultView.__erro && doc.defaultView.__yaml?.name === 'Verificar'
                ],
                [
                  'Roda em push na main e em pull_request',
                  doc => {
                    const on = doc.defaultView.__yaml.on;
                    const ramos = on?.push?.branches;
                    return (
                      !!on &&
                      typeof on === 'object' &&
                      'pull_request' in on &&
                      Array.isArray(ramos) &&
                      ramos.includes('main')
                    );
                  }
                ],
                [
                  'O job verificar roda em ubuntu-latest',
                  doc => doc.defaultView.__yaml.jobs?.verificar?.['runs-on'] === 'ubuntu-latest'
                ],
                [
                  'checkout e setup-node (versão 22) vêm primeiro',
                  doc => {
                    const passos = doc.defaultView.__yaml.jobs.verificar.steps || [];
                    const node = passos[1] || {};
                    return (
                      passos[0]?.uses === 'actions/checkout@v4' &&
                      node.uses === 'actions/setup-node@v4' &&
                      String(node.with?.['node-version']) === '22'
                    );
                  }
                ],
                [
                  'Depois: npm ci, prettier --check e npm test, nessa ordem',
                  doc => {
                    const comandos = (doc.defaultView.__yaml.jobs.verificar.steps || [])
                      .filter(p => p.run)
                      .map(p => String(p.run).trim());
                    const i = c => comandos.findIndex(x => x.includes(c));
                    return (
                      i('npm ci') > -1 && i('prettier --check') > i('npm ci') && i('npm test') > i('prettier --check')
                    );
                  }
                ]
              ],
              solucao: `name: Verificar

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Instalar dependências
        run: npm ci

      - name: Conferir a formatação
        run: npx prettier --check .

      - name: Rodar os testes
        run: npm test`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Gatilhos, condições, dependências entre jobs, segredos e deploy.',
      modulos: [
        {
          titulo: 'Gatilhos e deploy',
          itens: [
            {
              id: 'gatilhos-e-condicoes',
              titulo: 'Gatilhos, condições e jobs encadeados',
              resumo: 'paths, schedule, workflow_dispatch, if, needs e variáveis.',
              minutos: 12,
              corpo: `
<h2>Quando rodar</h2>
${codigo(`name: Gatilhos

on:
  push:
    branches: [main]
    paths: ['src/**', 'package.json']   # só quando estes arquivos mudarem
  pull_request:
  schedule:
    - cron: '0 9 * * 1'                 # toda segunda, 9h UTC (6h em Brasília)
  workflow_dispatch:                     # botão "Run workflow" na aba Actions

jobs:
  nada:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Disparado por \${{ github.event_name }}"`)}
<ul>
  <li><code>paths</code> evita rodar testes quando só o README mudou.</li>
  <li><code>schedule</code> usa a sintaxe <strong>cron</strong>: minuto, hora, dia do mês, mês, dia da semana. Sempre em UTC.</li>
  <li><code>workflow_dispatch</code> permite rodar na mão, pelo botão.</li>
</ul>

<h2>Expressões e contexto</h2>
<p>Dentro de <code>\${{ }}</code> vão expressões com informações da execução: <code>github.ref</code> (a branch), <code>github.sha</code> (o commit), <code>github.actor</code> (quem disparou), <code>secrets.NOME</code>, <code>env.NOME</code>. Elas servem para montar comandos e, principalmente, para condições com <code>if</code>.</p>

<h2>Jobs encadeados</h2>
<p>Jobs diferentes rodam <strong>em paralelo</strong>, cada um na sua máquina. <code>needs</code> cria uma ordem: o deploy só começa se os testes passarem.</p>
${codigo(`name: Testar e publicar

on:
  push:
    branches: [main]
  pull_request:

env:
  NODE_VERSION: 22

jobs:
  testes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
      - run: npm ci
      - run: npm test

  publicar:
    needs: testes
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - run: echo "publicando \${{ github.sha }}"`)}
<p>O <code>if</code> no job <code>publicar</code> faz o deploy acontecer só em push na <code>main</code>: num pull request, os testes rodam e a publicação é pulada.</p>
${dica('Para evitar duas execuções da mesma branch brigando (dois pushes seguidos), use <code>concurrency: { group: deploy-${{ github.ref }}, cancel-in-progress: true }</code>: a execução nova cancela a antiga.')}
`,
              quiz: [
                {
                  pergunta: 'O que workflow_dispatch faz?',
                  opcoes: ['Roda a cada hora', 'Permite rodar o workflow na mão, por um botão', 'Cancela o workflow'],
                  certa: 1,
                  explicacao: 'Aparece um botão "Run workflow" na aba Actions.'
                },
                {
                  pergunta: 'Dois jobs sem needs rodam como?',
                  opcoes: ['Um depois do outro', 'Em paralelo', 'Só o primeiro'],
                  certa: 1,
                  explicacao: 'needs é o que cria uma ordem entre eles.'
                },
                {
                  pergunta: 'Em que fuso o cron do schedule é interpretado?',
                  opcoes: ['Horário de Brasília', 'UTC', 'O fuso de quem criou o repositório'],
                  certa: 1,
                  explicacao: 'Sempre UTC: 9h UTC são 6h em Brasília.'
                }
              ]
            },
            {
              id: 'segredos-e-deploy',
              titulo: 'Segredos, permissões e deploy',
              resumo: 'secrets, GITHUB_TOKEN, permissions e publicar no GitHub Pages.',
              minutos: 12,
              corpo: `
<h2>Segredos</h2>
<p>Chaves de API, tokens de deploy e senhas nunca vão no arquivo do workflow. Elas ficam em <strong>Settings → Secrets and variables → Actions</strong> e entram no workflow por <code>\${{ secrets.NOME }}</code>. O GitHub esconde o valor nos logs (aparece <code>***</code>):</p>
${trecho(`      - name: Avisar no Slack
        run: curl -X POST -d '{"text":"Publicado!"}' "$WEBHOOK"
        env:
          WEBHOOK: \${{ secrets.SLACK_WEBHOOK }}`)}
<p>Passe segredos por <code>env</code> em vez de escrever <code>\${{ secrets.X }}</code> direto no meio do comando: é mais seguro contra injeção de comandos.</p>

<h2>GITHUB_TOKEN e permissões</h2>
<p>Toda execução recebe um token automático, o <code>GITHUB_TOKEN</code>, que vale só para aquele repositório e expira no fim. O bloco <code>permissions</code> diz o que ele pode fazer. Comece pelo mínimo e libere só o necessário:</p>
${trecho(`permissions:
  contents: read     # ler o código
  pages: write       # publicar no GitHub Pages
  id-token: write    # provar a identidade do workflow para o Pages`)}

<h2>Publicar no GitHub Pages</h2>
<p>Para um site com build (Vite, React), o workflow gera os arquivos e entrega ao Pages. Em Settings → Pages, escolha "GitHub Actions" como origem:</p>
${codigo(`name: Publicar site

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.publicar.outputs.page_url }}
    steps:
      - id: publicar
        uses: actions/deploy-pages@v4`)}
<ul>
  <li><code>upload-pages-artifact</code> empacota a pasta do build (<code>dist</code>) como um <strong>artefato</strong>, que passa de um job para o outro.</li>
  <li><code>deploy-pages</code> publica o artefato. O <code>id</code> do passo permite ler as saídas dele, como o endereço final.</li>
  <li><code>environment</code> registra o deploy, mostra o link no GitHub e permite exigir aprovação manual antes de publicar.</li>
</ul>
${dica('Um site sem build (só HTML, CSS e JS, como este portfólio) nem precisa de workflow: o GitHub Pages publica direto de uma branch.')}
`,
              quiz: [
                {
                  pergunta: 'Onde guardar o token de deploy de um serviço externo?',
                  opcoes: ['No arquivo do workflow', 'Nos Secrets do repositório', 'No README'],
                  certa: 1,
                  explicacao: 'O workflow lê com secrets.NOME, e o valor nunca aparece nos logs.'
                },
                {
                  pergunta: 'Para que serve o bloco permissions?',
                  opcoes: [
                    'Dizer quem pode ver o repositório',
                    'Limitar o que o GITHUB_TOKEN da execução pode fazer',
                    'Dar acesso a outros repositórios'
                  ],
                  certa: 1,
                  explicacao: 'Menos permissão é menos estrago se algo der errado.'
                },
                {
                  pergunta: 'Como os arquivos do build chegam ao job de deploy?',
                  opcoes: [
                    'Ficam na mesma máquina',
                    'Como um artefato enviado por upload-pages-artifact',
                    'Por e-mail'
                  ],
                  certa: 1,
                  explicacao: 'Cada job roda numa máquina nova; artefatos levam arquivos entre eles.'
                }
              ]
            },
            {
              id: 'desafio-publicar',
              tipo: 'desafio',
              titulo: 'Desafio: testar e publicar',
              resumo: 'Um workflow com testes, build e deploy no GitHub Pages.',
              minutos: 22,
              enunciado: `
<p>Escreva o workflow <strong>Publicar</strong> de um app React com Vite:</p>
<ul>
  <li>Roda em <code>push</code> na <code>main</code> e pelo botão (<code>workflow_dispatch</code>).</li>
  <li><code>permissions</code> no topo: <code>contents: read</code>, <code>pages: write</code> e <code>id-token: write</code>.</li>
  <li>Job <code>build</code>: checkout, setup-node (22), <code>npm ci</code>, <code>npm test</code>, <code>npm run build</code> e <code>actions/upload-pages-artifact@v3</code> com <code>path: dist</code>.</li>
  <li>Job <code>deploy</code>: só depois do <code>build</code> (<code>needs</code>), com <code>environment</code> chamado <code>github-pages</code>, e um passo com <code>actions/deploy-pages@v4</code>.</li>
</ul>`,
              inicial: `name: Publicar

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "publicar"
`,
              testes: [
                [
                  'Roda em push na main e por workflow_dispatch',
                  doc => {
                    const on = doc.defaultView.__yaml?.on || {};
                    return (on.push?.branches || []).includes('main') && 'workflow_dispatch' in on;
                  }
                ],
                [
                  'permissions: contents read, pages write, id-token write',
                  doc => {
                    const p = doc.defaultView.__yaml.permissions || {};
                    return p.contents === 'read' && p.pages === 'write' && p['id-token'] === 'write';
                  }
                ],
                [
                  'build testa antes de gerar e envia a pasta dist',
                  doc => {
                    const passos = doc.defaultView.__yaml.jobs?.build?.steps || [];
                    const i = texto => passos.findIndex(p => String(p.run || p.uses || '').includes(texto));
                    const upload = passos[i('actions/upload-pages-artifact@v3')];
                    return (
                      i('actions/checkout') === 0 &&
                      i('actions/setup-node') > -1 &&
                      i('npm ci') > -1 &&
                      i('npm test') > i('npm ci') &&
                      i('npm run build') > i('npm test') &&
                      upload?.with?.path === 'dist'
                    );
                  }
                ],
                [
                  'deploy depende do build, usa o environment github-pages e deploy-pages',
                  doc => {
                    const d = doc.defaultView.__yaml.jobs?.deploy || {};
                    const env = typeof d.environment === 'string' ? d.environment : d.environment?.name;
                    return (
                      [].concat(d.needs || []).includes('build') &&
                      env === 'github-pages' &&
                      (d.steps || []).some(p => p.uses === 'actions/deploy-pages@v4')
                    );
                  }
                ]
              ],
              solucao: `name: Publicar

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.publicar.outputs.page_url }}
    steps:
      - id: publicar
        uses: actions/deploy-pages@v4`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Matrizes, cache, reaproveitamento e segurança da cadeia de dependências.',
      modulos: [
        {
          titulo: 'Workflows profissionais',
          itens: [
            {
              id: 'matriz-e-reuso',
              titulo: 'Matriz, cache e reaproveitamento',
              resumo: 'Testar em várias versões, guardar cache, artefatos e workflows reutilizáveis.',
              minutos: 13,
              corpo: `
<h2>Matriz</h2>
<p>Uma <strong>matriz</strong> roda o mesmo job em várias combinações, em paralelo. Ideal para bibliotecas que precisam funcionar em várias versões do Node e sistemas:</p>
${codigo(`name: Matriz

on: [push, pull_request]

jobs:
  testes:
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: \${{ matrix.os }}
    name: Node \${{ matrix.node }} em \${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm test`)}
<p>São 2 × 2 = 4 jobs. Com <code>fail-fast: false</code>, uma falha não cancela os outros, e você vê de uma vez quais combinações quebraram.</p>

<h2>Cache e artefatos</h2>
<ul>
  <li><strong>Cache</strong> é para acelerar: pacotes baixados, builds intermediários. O <code>cache: npm</code> do setup-node cobre o caso comum; <code>actions/cache</code> serve para o resto.</li>
  <li><strong>Artefatos</strong> são resultados para guardar ou passar adiante: relatórios de teste, o build, prints de falhas. <code>actions/upload-artifact</code> e <code>download-artifact</code>.</li>
</ul>
${trecho(`      - name: Guardar o relatório do Playwright
        if: failure()                      # só quando algo falhou
        uses: actions/upload-artifact@v4
        with:
          name: relatorio-playwright
          path: playwright-report/
          retention-days: 7`)}

<h2>Não se repetir</h2>
<ul>
  <li><strong>Workflow reutilizável</strong>: um workflow com <code>on: workflow_call</code> pode ser chamado por outros, até de outros repositórios, com <code>uses: dono/repo/.github/workflows/testes.yml@main</code>.</li>
  <li><strong>Action composta</strong>: uma sequência de passos empacotada num <code>action.yml</code>, usada como qualquer action.</li>
</ul>

<h2>Segurança da cadeia</h2>
<p>Uma action de terceiros roda com acesso ao seu código e aos segredos daquele job. Se o dono dela for invadido e mudar o que a tag <code>@v4</code> aponta, o seu workflow passa a rodar o código novo. Para actions de fora das organizações oficiais, fixe pelo <strong>SHA do commit</strong>:</p>
${trecho(`      - uses: algum-dono/alguma-action@8f4b7f84864484a7bf31766abe9204da3cbe65b3   # v2.1.0`)}
<p>O <strong>Dependabot</strong> (um arquivo <code>.github/dependabot.yml</code>) abre pull requests sozinho quando sai versão nova das actions e dos pacotes do npm, mantendo tudo atualizado sem esforço.</p>
${dica('Workflows disparados por <code>pull_request</code> de forks não recebem os segredos, de propósito. Cuidado com <code>pull_request_target</code>: ele recebe, e rodar o código do fork nele é uma brecha conhecida.')}
`,
              quiz: [
                {
                  pergunta: 'Uma matriz com node: [18, 20, 22] e os: [ubuntu, windows] cria quantos jobs?',
                  opcoes: ['5', '6', '3'],
                  certa: 1,
                  explicacao: 'Todas as combinações: 3 × 2 = 6.'
                },
                {
                  pergunta: 'Qual a diferença entre cache e artefato?',
                  opcoes: [
                    'Nenhuma',
                    'Cache acelera execuções futuras; artefato guarda resultados ou passa arquivos entre jobs',
                    'Artefato é só para imagens'
                  ],
                  certa: 1,
                  explicacao: 'Cache é otimização; artefato é um resultado que você quer ver ou usar.'
                },
                {
                  pergunta: 'Por que fixar actions de terceiros pelo SHA?',
                  opcoes: [
                    'Fica mais rápido',
                    'Uma tag pode ser movida para outro código; o SHA não muda',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'Protege contra uma action comprometida depois que você a adotou.'
                }
              ]
            },
            {
              id: 'desafio-matriz',
              tipo: 'desafio',
              titulo: 'Desafio: biblioteca em várias versões',
              resumo: 'Matriz, concorrência, agendamento e relatório de falhas.',
              minutos: 22,
              enunciado: `
<p>Escreva o workflow <strong>Compatibilidade</strong> de uma biblioteca:</p>
<ul>
  <li>Roda em <code>pull_request</code> e toda <strong>segunda-feira às 6h UTC</strong> (<code>schedule</code> com cron).</li>
  <li><code>concurrency</code> com um <code>group</code> e <code>cancel-in-progress: true</code>.</li>
  <li>Job <code>testes</code> com matriz: <code>node</code> 20 e 22; <code>os</code> ubuntu-latest e windows-latest; <code>fail-fast: false</code>. O <code>runs-on</code> vem da matriz.</li>
  <li>Passos: checkout, setup-node com a versão da matriz e <code>cache: npm</code>, <code>npm ci</code>, <code>npm test</code> e, <strong>só se algo falhar</strong>, <code>actions/upload-artifact@v4</code>.</li>
</ul>`,
              inicial: `name: Compatibilidade

on:
  pull_request:

jobs:
  testes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
`,
              testes: [
                [
                  'Roda em pull_request e às segundas, 6h UTC',
                  doc => {
                    const on = doc.defaultView.__yaml?.on || {};
                    const cron = (on.schedule || [])[0]?.cron || '';
                    const [min, hora, , , semana] = cron.trim().split(/\s+/);
                    return (
                      'pull_request' in on &&
                      Number(min) === 0 &&
                      Number(hora) === 6 &&
                      ['1', 'MON', 'mon'].includes(semana)
                    );
                  }
                ],
                [
                  'concurrency com group e cancel-in-progress',
                  doc => {
                    const c = doc.defaultView.__yaml.concurrency;
                    return !!c && !!c.group && c['cancel-in-progress'] === true;
                  }
                ],
                [
                  'Matriz com node 20 e 22, ubuntu e windows, sem fail-fast',
                  doc => {
                    const j = doc.defaultView.__yaml.jobs?.testes || {};
                    const m = j.strategy?.matrix || {};
                    const nodes = (m.node || []).map(String).sort().join();
                    const sistemas = (m.os || []).slice().sort().join();
                    return (
                      nodes === '20,22' &&
                      sistemas === 'ubuntu-latest,windows-latest' &&
                      j.strategy['fail-fast'] === false &&
                      /matrix\.os/.test(j['runs-on'])
                    );
                  }
                ],
                [
                  'setup-node usa a versão da matriz e cache npm',
                  doc => {
                    const passos = doc.defaultView.__yaml.jobs.testes.steps || [];
                    const node = passos.find(p => String(p.uses).startsWith('actions/setup-node')) || {};
                    return /matrix\.node/.test(String(node.with?.['node-version'])) && node.with?.cache === 'npm';
                  }
                ],
                [
                  'npm ci, npm test e upload-artifact só em falha',
                  doc => {
                    const passos = doc.defaultView.__yaml.jobs.testes.steps || [];
                    const i = t => passos.findIndex(p => String(p.run || p.uses || '').includes(t));
                    const up = passos[i('actions/upload-artifact@v4')];
                    return i('npm ci') > -1 && i('npm test') > i('npm ci') && !!up && /failure\(\)/.test(String(up.if));
                  }
                ]
              ],
              solucao: `name: Compatibilidade

on:
  pull_request:
  schedule:
    - cron: '0 6 * * 1'

concurrency:
  group: compatibilidade-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  testes:
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: \${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
          cache: npm
      - run: npm ci
      - run: npm test
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: logs-\${{ matrix.os }}-\${{ matrix.node }}
          path: logs/`
            }
          ]
        }
      ]
    }
  ]
};
