// Trilha de Git e GitHub. Sem editor: os comandos são para rodar no terminal do computador (Git Bash, PowerShell ou o
// terminal do VS Code). As práticas usam um repositório de teste criado pela própria aula.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'git',
  area: 'Qualidade e entrega',
  titulo: 'Git e GitHub',
  sigla: 'Git',
  resumo: 'Guardar o histórico do código, trabalhar em ramos, desfazer erros e colaborar pelo GitHub.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Repositório, commits e o histórico.',
      modulos: [
        {
          titulo: 'Primeiros commits',
          itens: [
            {
              id: 'o-que-e-git',
              titulo: 'O que é Git e o primeiro repositório',
              resumo: 'Controle de versão, instalação, configuração e git init.',
              minutos: 9,
              corpo: `
<p>Sem controle de versão, o histórico de um projeto vira uma pasta com <code>site-final.zip</code>, <code>site-final-2.zip</code> e <code>site-agora-vai.zip</code>. O <strong>Git</strong> resolve isso: ele guarda <strong>fotografias</strong> do projeto (os <strong>commits</strong>), cada uma com autor, data e uma mensagem dizendo o que mudou. Dá para voltar a qualquer uma, comparar duas e trabalhar em várias ideias ao mesmo tempo sem uma estragar a outra.</p>
<p>O <strong>GitHub</strong> é outra coisa: um site que hospeda repositórios Git na internet, para guardar uma cópia segura, colaborar e publicar (este portfólio está lá). O Git funciona sozinho, sem GitHub.</p>

<h2>Instalar e configurar</h2>
<p>No Windows, instale pelo <strong>git-scm.com</strong> (ele traz o Git Bash). No Mac, <code>git</code> no terminal oferece a instalação. Depois, diga quem você é: o nome e o e-mail vão em cada commit.</p>
${trecho(`git --version
git config --global user.name "Seu Nome"
git config --global user.email "voce@exemplo.com"
git config --global init.defaultBranch main`)}

<h2>O primeiro repositório</h2>
${trecho(`mkdir meu-projeto
cd meu-projeto
git init          # cria a pasta oculta .git: é ali que o histórico mora
echo "# Meu projeto" > README.md
git status        # o Git vê um arquivo novo, ainda não acompanhado`)}
<p>Apagar a pasta <code>.git</code> apaga todo o histórico, mas deixa os arquivos. Por isso, não mexa nela à mão.</p>

<h2>As três áreas</h2>
<ul>
  <li><strong>Pasta de trabalho</strong>: os arquivos como estão agora no disco.</li>
  <li><strong>Área de preparação</strong> (<em>staging</em>): o que vai entrar no próximo commit. Você escolhe com <code>git add</code>.</li>
  <li><strong>Repositório</strong>: os commits já gravados.</li>
</ul>
${trecho(`git add README.md               # prepara o arquivo
git commit -m "Cria o README"   # grava a fotografia
git log --oneline               # mostra o histórico, um commit por linha`)}
${dica('A área de preparação existe para você separar as mudanças em commits com sentido. Mexeu no menu e corrigiu um erro de digitação no rodapé? Dois <code>git add</code> e dois commits deixam o histórico muito mais fácil de ler.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre Git e GitHub?',
                  opcoes: [
                    'São a mesma coisa',
                    'Git é o controle de versão; GitHub é um site que hospeda repositórios Git',
                    'GitHub roda no computador e Git na internet'
                  ],
                  certa: 1,
                  explicacao:
                    'O Git funciona sozinho no seu computador. O GitHub (como GitLab e Bitbucket) guarda cópias online.'
                },
                {
                  pergunta: 'O que o git add faz?',
                  opcoes: [
                    'Grava um commit',
                    'Coloca a mudança na área de preparação, para o próximo commit',
                    'Envia para o GitHub'
                  ],
                  certa: 1,
                  explicacao: 'O commit grava só o que foi preparado com git add.'
                },
                {
                  pergunta: 'Onde o Git guarda o histórico?',
                  opcoes: ['Na pasta oculta .git', 'No README', 'Só no GitHub'],
                  certa: 0,
                  explicacao: 'A pasta .git, criada pelo git init, guarda todos os commits.'
                }
              ]
            },
            {
              id: 'commits-e-historico',
              titulo: 'Commits, diff e .gitignore',
              resumo: 'Ver o que mudou, escrever boas mensagens e ignorar arquivos.',
              minutos: 11,
              corpo: `
<h2>O ciclo do dia a dia</h2>
${trecho(`git status              # o que mudou?
git diff                # as linhas mudadas que ainda não foram preparadas
git add index.html      # prepara um arquivo (ou: git add . para tudo)
git diff --staged       # o que vai entrar no commit
git commit -m "Adiciona o formulário de contato"`)}
<p>Leia o <code>git status</code> com calma: ele separa os arquivos em <em>preparados</em>, <em>modificados</em> e <em>não acompanhados</em>, e ainda sugere os comandos para mudar cada um de lugar.</p>

<h2>Mensagens que ajudam</h2>
<p>Daqui a seis meses, o histórico é a melhor documentação do projeto. Uma boa mensagem diz <strong>o que</strong> mudou, no imperativo, em uma linha curta:</p>
<ul>
  <li>Bom: <code>Corrige o cálculo do frete para o Norte</code>.</li>
  <li>Ruim: <code>ajustes</code>, <code>wip</code>, <code>agora vai</code>.</li>
</ul>
<p>Se precisar explicar o <strong>porquê</strong>, rode só <code>git commit</code>: abre um editor, e o texto depois de uma linha em branco vira a descrição.</p>

<h2>Navegar no histórico</h2>
${trecho(`git log --oneline --graph     # histórico resumido, com os ramos desenhados
git log -p README.md          # cada mudança feita num arquivo
git show a1b2c3d              # o que um commit mudou (use o código que aparece no log)
git blame index.html          # quem mudou cada linha, e em qual commit`)}

<h2>.gitignore</h2>
<p>Alguns arquivos não devem ir para o histórico: dependências baixadas, arquivos gerados, senhas. Liste-os num arquivo <code>.gitignore</code> na raiz:</p>
${trecho(`# .gitignore
node_modules/
dist/
.env
*.log
.DS_Store`)}
${dica('O <code>.gitignore</code> só vale para arquivos ainda não acompanhados. Se o <code>.env</code> já entrou num commit, tire-o com <code>git rm --cached .env</code>. E, se ele tinha uma senha, troque a senha: ela continua nos commits antigos.')}
`,
              quiz: [
                {
                  pergunta: 'Como ver o que vai entrar no próximo commit?',
                  opcoes: ['git diff', 'git diff --staged', 'git log'],
                  certa: 1,
                  explicacao: 'git diff mostra o que ainda não foi preparado; --staged mostra o que já foi.'
                },
                {
                  pergunta: 'Qual é a melhor mensagem de commit?',
                  opcoes: ['ajustes', 'Corrige o link quebrado do rodapé', 'commit 3'],
                  certa: 1,
                  explicacao: 'Diz o que mudou, no imperativo e de forma específica.'
                },
                {
                  pergunta: 'O .env com uma senha já foi para um commit. Pôr no .gitignore resolve?',
                  opcoes: [
                    'Sim, ele some do histórico',
                    'Não: é preciso tirar com git rm --cached e trocar a senha',
                    'Sim, se fizer push'
                  ],
                  certa: 1,
                  explicacao:
                    'O .gitignore não age em arquivos já acompanhados, e os commits antigos continuam com a senha.'
                }
              ]
            },
            {
              id: 'pratica-primeiro-repositorio',
              titulo: 'Prática: o primeiro repositório',
              resumo: 'Crie um repositório de teste, faça commits separados e leia o histórico.',
              minutos: 15,
              corpo: `
<p>Faça no terminal, numa pasta de teste (nada do seu trabalho é mexido). Cada passo tem a resposta escondida para conferir.</p>
<ol>
  <li>Crie a pasta <code>teste-git</code>, entre nela e inicie um repositório.</li>
  <li>Crie <code>index.html</code> e <code>estilo.css</code> com qualquer conteúdo. Faça <strong>um commit para cada arquivo</strong>.</li>
  <li>Crie <code>senhas.txt</code> e faça o Git ignorá-lo. Confirme que ele não aparece no <code>git status</code>.</li>
  <li>Mude uma linha do <code>index.html</code>, veja a diferença e grave o commit.</li>
  <li>Mostre o histórico em uma linha por commit. Quantos commits existem?</li>
</ol>
${resposta(`${trecho(`# 1
mkdir teste-git
cd teste-git
git init

# 2
echo "<h1>Olá</h1>" > index.html
echo "h1 { color: teal; }" > estilo.css
git add index.html
git commit -m "Cria a página inicial"
git add estilo.css
git commit -m "Adiciona o estilo do título"

# 3
echo "123456" > senhas.txt
echo "senhas.txt" > .gitignore
git status            # aparece só o .gitignore
git add .gitignore
git commit -m "Ignora o arquivo de senhas"

# 4
echo "<p>Bem-vindo</p>" >> index.html
git diff
git add index.html
git commit -m "Adiciona a mensagem de boas-vindas"

# 5
git log --oneline     # 4 commits`)}
<p>O próprio <code>.gitignore</code> entra no repositório: assim quem baixar o projeto também ignora os mesmos arquivos.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O .gitignore deve entrar num commit?',
                  opcoes: ['Não, ele é pessoal', 'Sim, para todos ignorarem os mesmos arquivos', 'Só no GitHub'],
                  certa: 1,
                  explicacao:
                    'Ele faz parte do projeto. Para ignorar algo só na sua máquina, existe o .git/info/exclude.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Ramos, junções, conflitos e o GitHub.',
      modulos: [
        {
          titulo: 'Ramos e GitHub',
          itens: [
            {
              id: 'branches-e-merge',
              titulo: 'Branches, merge e conflitos',
              resumo: 'Trabalhar numa ideia sem mexer na main e juntar depois.',
              minutos: 13,
              corpo: `
<p>Um <strong>branch</strong> (ramo) é uma linha de commits separada. A <code>main</code> fica sempre funcionando, e cada novidade nasce num ramo próprio. Se a ideia não der certo, é só apagar o ramo.</p>
${trecho(`git switch -c menu-novo      # cria o ramo e já entra nele
# ... edita, git add, git commit ...
git switch main              # volta para a main (os arquivos voltam junto)
git branch                   # lista os ramos; o * marca o atual`)}

<h2>Juntar com merge</h2>
${trecho(`git switch main
git merge menu-novo          # traz os commits do ramo para a main
git branch -d menu-novo      # apaga o ramo, que não é mais necessário`)}
<p>Se a <code>main</code> não andou desde que o ramo nasceu, o Git só avança o ponteiro (<em>fast-forward</em>). Se os dois andaram, ele cria um <strong>commit de merge</strong> com dois pais.</p>

<h2>Conflitos</h2>
<p>Quando os dois ramos mudaram <strong>a mesma linha</strong>, o Git não adivinha qual vale e marca o arquivo:</p>
${trecho(`<<<<<<< HEAD
<h1>Pousada Lagoa Azul</h1>
=======
<h1>Bem-vindo à Lagoa Azul</h1>
>>>>>>> titulo-novo`)}
<p>Para resolver: edite o arquivo deixando a versão certa (pode ser uma mistura), apague as marcas <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> e <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, e então:</p>
${trecho(`git add index.html
git commit                   # conclui o merge
# ou, para desistir: git merge --abort`)}
${dica('O VS Code mostra os conflitos com botões "Aceitar atual", "Aceitar a que chega" e "Aceitar ambas". Conflito não é erro: é o Git pedindo para você decidir.')}

<h2>Guardar algo pela metade</h2>
<p>Precisa trocar de ramo, mas o trabalho não está pronto para um commit? O <code>git stash</code> guarda as mudanças numa gaveta, e <code>git stash pop</code> as devolve.</p>
`,
              quiz: [
                {
                  pergunta: 'Para que serve um branch?',
                  opcoes: [
                    'Fazer backup no GitHub',
                    'Desenvolver uma mudança separada, sem mexer na main',
                    'Apagar commits'
                  ],
                  certa: 1,
                  explicacao: 'Cada ramo tem a própria linha de commits; a main continua estável.'
                },
                {
                  pergunta: 'Quando acontece um conflito?',
                  opcoes: [
                    'Sempre que se faz merge',
                    'Quando os dois ramos mudaram as mesmas linhas',
                    'Quando o ramo tem mais de 10 commits'
                  ],
                  certa: 1,
                  explicacao: 'Mudanças em lugares diferentes são juntadas sozinhas.'
                },
                {
                  pergunta: 'Depois de editar o arquivo com conflito, o que falta?',
                  opcoes: ['git push', 'git add e git commit', 'git init'],
                  certa: 1,
                  explicacao: 'O git add avisa que o conflito foi resolvido e o commit conclui o merge.'
                }
              ]
            },
            {
              id: 'github-e-pull-requests',
              titulo: 'GitHub, push, pull e pull requests',
              resumo: 'Repositório remoto, clone, sincronizar e revisar mudanças.',
              minutos: 12,
              corpo: `
<h2>Remoto</h2>
<p>Um <strong>remoto</strong> é uma cópia do repositório em outro lugar, normalmente no GitHub. Por convenção, o principal se chama <code>origin</code>.</p>
${trecho(`# Projeto que já existe no computador: crie um repositório vazio no GitHub e ligue os dois
git remote add origin https://github.com/seu-usuario/meu-projeto.git
git push -u origin main      # envia; o -u lembra a ligação para os próximos push

# Projeto que já está no GitHub: baixe tudo, com o histórico
git clone https://github.com/seu-usuario/meu-projeto.git`)}

<h2>Sincronizar</h2>
${trecho(`git push        # envia os seus commits
git pull        # traz os commits novos do remoto (fetch + merge)
git fetch       # só baixa, sem juntar: dá para olhar antes com git log origin/main`)}
<p>Se alguém enviou commits antes de você, o <code>push</code> é recusado: faça <code>git pull</code>, resolva conflitos se houver, e envie de novo.</p>
${dica('No login, o GitHub não aceita mais a senha da conta pelo terminal. O jeito mais simples é o Git Credential Manager (vem com o Git para Windows), que abre o navegador na primeira vez. Outra opção é o GitHub CLI: <code>gh auth login</code>.')}

<h2>Pull request</h2>
<p>Em equipe, ninguém envia direto para a <code>main</code>. O fluxo é:</p>
<ol>
  <li>Criar um ramo, fazer os commits e enviar: <code>git push -u origin meu-ramo</code>.</li>
  <li>No GitHub, abrir um <strong>pull request</strong> (PR): um pedido para juntar o ramo na main, com descrição do que mudou e por quê.</li>
  <li>Os colegas revisam e comentam linha por linha; o GitHub Actions roda os testes.</li>
  <li>Com tudo aprovado, clica-se em <em>Merge</em>, e o ramo pode ser apagado.</li>
</ol>
${trecho(`gh pr create --title "Adiciona página de contato" --body "Formulário com validação."
gh pr list
gh pr checkout 12     # baixa o PR de alguém para testar no seu computador`)}

<h2>GitHub Pages</h2>
<p>Para sites estáticos (HTML, CSS e JS), o GitHub publica de graça: em <em>Settings → Pages</em>, escolha o ramo <code>main</code>. O site fica em <code>seu-usuario.github.io/nome-do-repositorio</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'O que é origin?',
                  opcoes: ['O primeiro commit', 'O nome padrão do repositório remoto', 'O ramo principal'],
                  certa: 1,
                  explicacao: 'É só um apelido para o endereço do repositório no GitHub.'
                },
                {
                  pergunta: 'O push foi recusado porque o remoto tem commits novos. O que fazer?',
                  opcoes: [
                    'git push --force',
                    'git pull, resolver conflitos se houver, e push de novo',
                    'Apagar a pasta'
                  ],
                  certa: 1,
                  explicacao: 'O --force apagaria o trabalho dos outros. Primeiro traga o que é novo.'
                },
                {
                  pergunta: 'Para que serve um pull request?',
                  opcoes: [
                    'Baixar o repositório',
                    'Propor que um ramo seja juntado, com revisão e testes antes',
                    'Desfazer um commit'
                  ],
                  certa: 1,
                  explicacao: 'É o lugar da conversa sobre a mudança antes de ela entrar na main.'
                }
              ]
            },
            {
              id: 'pratica-ramo-e-conflito',
              titulo: 'Prática: ramo, conflito e merge',
              resumo: 'Provoque um conflito de propósito e resolva.',
              minutos: 18,
              corpo: `
<p>Use o repositório <code>teste-git</code> da prática anterior (ou crie um novo com um <code>index.html</code> e um commit).</p>
<ol>
  <li>Crie o ramo <code>titulo-novo</code> e, nele, troque a primeira linha do <code>index.html</code> por <code>&lt;h1&gt;Bem-vindo&lt;/h1&gt;</code>. Faça o commit.</li>
  <li>Volte para a <code>main</code> e troque a <strong>mesma linha</strong> por <code>&lt;h1&gt;Olá, visitante&lt;/h1&gt;</code>. Faça o commit.</li>
  <li>Junte o ramo <code>titulo-novo</code> na <code>main</code>. O que o Git diz?</li>
  <li>Resolva deixando <code>&lt;h1&gt;Bem-vindo, visitante&lt;/h1&gt;</code> e conclua o merge.</li>
  <li>Mostre o histórico com os ramos desenhados e apague o ramo.</li>
</ol>
${resposta(`${trecho(`# 1
git switch -c titulo-novo
# edite a 1ª linha: <h1>Bem-vindo</h1>
git commit -am "Muda o título para Bem-vindo"

# 2
git switch main
# edite a 1ª linha: <h1>Olá, visitante</h1>
git commit -am "Muda o título para Olá, visitante"

# 3
git merge titulo-novo
# CONFLICT (content): Merge conflict in index.html

# 4
# edite o index.html: apague as marcas e deixe <h1>Bem-vindo, visitante</h1>
git add index.html
git commit -m "Junta os dois títulos"

# 5
git log --oneline --graph
git branch -d titulo-novo`)}
<p>O <code>-a</code> do <code>git commit -am</code> prepara sozinho os arquivos <strong>já acompanhados</strong> que mudaram. Arquivos novos ainda precisam de <code>git add</code>.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que git commit -am faz?',
                  opcoes: [
                    'Prepara os arquivos já acompanhados que mudaram e grava o commit',
                    'Prepara todos os arquivos, até os novos',
                    'Altera o último commit'
                  ],
                  certa: 0,
                  explicacao: 'Arquivos que o Git ainda não acompanha ficam de fora.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Desfazer com segurança, rebase e um histórico limpo.',
      modulos: [
        {
          titulo: 'Desfazer e reescrever',
          itens: [
            {
              id: 'desfazer',
              titulo: 'Desfazer: restore, revert, reset e reflog',
              resumo: 'Qual comando usar em cada tipo de arrependimento.',
              minutos: 14,
              corpo: `
<p>Quase tudo no Git tem volta. O segredo é escolher o comando certo para o tipo de arrependimento:</p>
${trecho(`# Desfazer mudanças num arquivo que ainda não foram preparadas
git restore index.html

# Tirar da área de preparação (a mudança continua no arquivo)
git restore --staged index.html

# Corrigir a mensagem ou incluir um arquivo esquecido no ÚLTIMO commit (antes do push)
git add esquecido.css
git commit --amend -m "Mensagem certa"

# Desfazer um commit que JÁ foi enviado: cria um commit novo que faz o contrário
git revert a1b2c3d

# Voltar o ramo para um commit anterior (só em commits que ainda não foram enviados)
git reset --soft HEAD~1    # desfaz o commit, mantém as mudanças preparadas
git reset HEAD~1           # desfaz o commit, mantém as mudanças nos arquivos
git reset --hard HEAD~1    # desfaz o commit E apaga as mudanças`)}
<p><code>HEAD</code> é o commit em que você está; <code>HEAD~1</code> é o anterior a ele.</p>

<h2>A regra de ouro</h2>
<p><strong>Não reescreva o que já foi enviado.</strong> <code>reset</code>, <code>--amend</code> e <code>rebase</code> criam commits novos no lugar dos antigos. Se alguém já baixou os antigos, os históricos divergem e vira confusão. Para o que já está no GitHub, use <code>revert</code>.</p>

<h2>O reflog salva vidas</h2>
<p>Fez um <code>reset --hard</code> errado? O Git guarda por uns 90 dias tudo por onde o <code>HEAD</code> passou:</p>
${trecho(`git reflog
# a1b2c3d HEAD@{0}: reset: moving to HEAD~1
# 9f8e7d6 HEAD@{1}: commit: Adiciona a galeria   <- o commit "perdido"
git reset --hard 9f8e7d6`)}
${dica('O que nunca entrou num commit (nem no stash) o Git não tem como recuperar. Na dúvida antes de um comando perigoso, faça um commit ou um <code>git stash</code>: depois dá para desfazer.')}
`,
              quiz: [
                {
                  pergunta: 'Um commit com erro já está no GitHub e a equipe já baixou. Como desfazer?',
                  opcoes: ['git reset --hard e push --force', 'git revert', 'git commit --amend'],
                  certa: 1,
                  explicacao: 'O revert cria um commit novo, sem reescrever o histórico dos outros.'
                },
                {
                  pergunta: 'Qual reset apaga também as mudanças dos arquivos?',
                  opcoes: ['--soft', 'o padrão (--mixed)', '--hard'],
                  certa: 2,
                  explicacao: 'O --soft e o padrão mantêm as mudanças; o --hard descarta.'
                },
                {
                  pergunta: 'Onde achar um commit "perdido" depois de um reset?',
                  opcoes: ['git reflog', 'git status', 'Não tem como'],
                  certa: 0,
                  explicacao: 'O reflog registra cada posição do HEAD.'
                }
              ]
            },
            {
              id: 'rebase-e-historico-limpo',
              titulo: 'Rebase, tags e um fluxo de trabalho',
              resumo: 'Rebase, juntar commits, cherry-pick, tags de versão e boas práticas.',
              minutos: 13,
              corpo: `
<h2>Rebase</h2>
<p>O <code>merge</code> junta dois ramos com um commit de merge. O <code>rebase</code> faz diferente: <strong>reaplica</strong> os commits do seu ramo em cima da ponta da <code>main</code>, como se você tivesse começado agora. O histórico fica em linha reta.</p>
${trecho(`git switch meu-ramo
git rebase main          # reaplica os commits de meu-ramo depois do último da main
# se houver conflito: resolva, git add, e git rebase --continue (ou --abort)`)}
<p>Muita gente configura o pull para usar rebase e evitar commits de merge à toa: <code>git config --global pull.rebase true</code>.</p>

<h2>Arrumar os próprios commits antes do PR</h2>
<p>Commits como "teste", "ajuste" e "agora vai" podem virar um só antes de abrir o pull request. O rebase interativo abre a lista dos últimos commits para você escolher o que fazer com cada um (<code>pick</code> manter, <code>squash</code> juntar ao anterior, <code>reword</code> mudar a mensagem, <code>drop</code> apagar):</p>
${trecho(`git rebase -i HEAD~3`)}
<p>No GitHub, o botão <em>Squash and merge</em> faz o mesmo na hora de juntar o PR.</p>

<h2>Trazer um commit só</h2>
${trecho(`git cherry-pick a1b2c3d   # copia aquele commit para o ramo atual (útil para levar uma correção urgente)`)}

<h2>Tags de versão</h2>
${trecho(`git tag -a v1.2.0 -m "Versão com a galeria"
git push origin v1.2.0
git tag                   # lista as versões`)}
<p>A convenção mais usada é a <strong>versão semântica</strong>: <code>MAIOR.MENOR.CORREÇÃO</code>. Corrigiu um erro, sobe a correção (1.2.1); adicionou algo compatível, a menor (1.3.0); quebrou algo de quem usa, a maior (2.0.0).</p>

<h2>Um fluxo que funciona</h2>
<ul>
  <li>A <code>main</code> está sempre funcionando e pode ir para o ar a qualquer momento.</li>
  <li>Cada mudança nasce num ramo curto, com nome que diz o que é (<code>corrige-frete</code>).</li>
  <li>Commits pequenos, com mensagens claras.</li>
  <li>Pull request com testes automáticos antes de juntar.</li>
</ul>
${dica('Depois de um rebase num ramo que você já tinha enviado, o push normal é recusado. Use <code>git push --force-with-lease</code>: ele só força se ninguém mais tiver enviado nada nesse meio tempo. E nunca force na main.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre merge e rebase?',
                  opcoes: [
                    'Nenhuma',
                    'O rebase reaplica os commits em cima da main, deixando o histórico em linha reta',
                    'O rebase apaga a main'
                  ],
                  certa: 1,
                  explicacao:
                    'O merge preserva os dois caminhos com um commit de merge; o rebase reescreve os commits do ramo.'
                },
                {
                  pergunta: 'Para que serve squash no rebase interativo?',
                  opcoes: ['Apagar o commit', 'Juntar o commit ao anterior', 'Mudar o autor'],
                  certa: 1,
                  explicacao: 'Vários commits pequenos viram um, com uma mensagem só.'
                },
                {
                  pergunta: 'Na versão semântica, de 1.4.2 com uma nova função compatível, vai para:',
                  opcoes: ['1.4.3', '1.5.0', '2.0.0'],
                  certa: 1,
                  explicacao: 'Novidade compatível sobe a versão menor e zera a correção.'
                }
              ]
            },
            {
              id: 'pratica-resgate',
              titulo: 'Prática: resgatar um histórico bagunçado',
              resumo: 'Corrija um commit, junte três em um e recupere um commit "perdido".',
              minutos: 20,
              corpo: `
<p>Num repositório de teste, crie esta bagunça e depois conserte:</p>
${trecho(`git switch -c galeria
echo "galeria" > galeria.html && git add . && git commit -m "teste"
echo "fotos" >> galeria.html && git commit -am "ajuste"
echo "legendas" >> galeria.html && git commit -am "agora vai"`)}
<ol>
  <li>Transforme os três commits em <strong>um só</strong>, com a mensagem <code>Adiciona a galeria de fotos</code>.</li>
  <li>Você esqueceu o arquivo <code>galeria.css</code>. Crie-o e inclua-o <strong>no mesmo commit</strong>, sem criar outro.</li>
  <li>Rode <code>git reset --hard HEAD~1</code> (sim, de propósito). A galeria sumiu. Recupere-a.</li>
  <li>Junte o ramo na <code>main</code> e marque a versão <code>v1.0.0</code>.</li>
</ol>
${resposta(`${trecho(`# 1. Abre o editor com os 3 commits: troque "pick" por "squash" (ou "s") no 2º e no 3º,
#    salve e, na tela seguinte, deixe só a mensagem "Adiciona a galeria de fotos"
git rebase -i HEAD~3
#    Alternativa sem editor: volta 3 commits mantendo as mudanças preparadas e grava um só
git reset --soft HEAD~3
git commit -m "Adiciona a galeria de fotos"

# 2
echo ".galeria { display: grid; }" > galeria.css
git add galeria.css
git commit --amend --no-edit

# 3
git reset --hard HEAD~1
git reflog                 # ache a linha do commit "Adiciona a galeria de fotos"
git reset --hard HEAD@{1}  # (ou o código do commit que aparece no reflog)

# 4
git switch main
git merge galeria
git tag -a v1.0.0 -m "Primeira versão com galeria"`)}
<p>Tudo isso só é seguro porque o ramo ainda não tinha sido enviado. Se já estivesse no GitHub, os passos 1 e 2 exigiriam <code>push --force-with-lease</code>, e o certo seria combinar com a equipe antes.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Qual comando inclui um arquivo esquecido no último commit, sem mudar a mensagem?',
                  opcoes: ['git commit --amend --no-edit', 'git revert HEAD', 'git merge --continue'],
                  certa: 0,
                  explicacao: 'O --amend substitui o último commit; --no-edit mantém a mensagem.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
