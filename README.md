# Portfólio — ottavvi.dev

Site pessoal de Otávio, publicado em https://ottavvi.github.io/site-portfolio/

HTML, CSS e JavaScript puros, sem etapa de build. Login, área de membros e formulário de contato usam o Firebase.

## Estrutura

```
index.html, sobre.html          páginas principais
rota-municipal.html             estudo de caso do Rota Municipal
pousada.html                    estudo de caso da Pousada Lagoa Azul (prints em imagens/pousada/)
paineis.html                    estudo de caso do Painel financeiro para empresas (Power BI)
en/                             versão em inglês (index, about e os estudos de caso)
login.html, cadastro.html,      páginas de conta
recuperar.html, acao.html,
area.html, admin.html
css/style.css                   estilos de todas as páginas
js/main.js                      menu, animações e campo de senha (todas as páginas)
js/firebase.js                  configuração do Firebase e UID do admin
js/contact.js                   formulário de contato (index.html)
js/paleta.js                    paleta de comandos (Ctrl+K, ⌘K ou "/"); a lista de páginas e projetos fica no
                                próprio arquivo: ao criar um projeto novo, adicione-o lá também
js/auth/session.js              link "Entrar/Minha área" e botão "Sair" (todas as páginas); só baixa o
                                Firebase nas páginas de conta ou se o navegador já entrou (marca "sessao")
js/auth/shared.js               funções comuns das páginas de conta
js/auth/<página>.js             código de cada página de conta (login.js, area.js...)
firestore.rules                 regras de segurança do Firestore
imagens/                        imagens do portfólio
fontes/                         Inter e Space Grotesk hospedadas no site (licenças em fontes/LICENCAS.md)
404.html, sitemap.xml           página de erro (caminhos absolutos /site-portfolio/) e mapa do site
projetos/                       projetos de exemplo (barbearia, gerenciador de tarefas, central de tempo)
projetos/rota-municipal/        apresentação do Rota Municipal (cópia da pasta vitrine/ daquele repositório)
```

## Atualizar a apresentação do Rota Municipal

O código do sistema é privado; aqui fica só a página de apresentação. Quando ela mudar, copie de novo
`rota-municipal/vitrine/index.html` e `vitrine/imagens/` para `projetos/rota-municipal/`, mantendo a
barra "Voltar ao portfólio" e o ícone que foram adicionados no topo da cópia.

## Gerenciador de tarefas (projetos/tarefas)

JavaScript puro em módulos (`js/`), um arquivo por responsabilidade: `estado.js` (dados e desfazer),
`render.js` (tela), `detalhes.js` (painel da tarefa), `entrada.js` (atalhos ao digitar) e os demais recursos.
Funciona offline pelo `sw.js`: **ao mudar qualquer arquivo do app, troque a `VERSAO` no `sw.js`**, senão quem
já abriu o app pode continuar vendo a versão antiga guardada no navegador.

## Versão em inglês (en/)

As páginas em `en/` são cópias traduzidas de `index.html`, `sobre.html` e `rota-municipal.html`. Ao mudar o
texto de uma delas, mude também a outra. As duas se ligam pelo botão PT/EN do menu e pelas marcações
`hreflang`, e os scripts (`contact.js`, `session.js`) escolhem os textos pelo idioma da página.

## Central de tempo (projetos/cronometro)

Cronômetro, temporizador e Pomodoro em módulos (`js/`). O Pomodoro lê as tarefas pendentes do gerenciador
(`tarefas-v2` no armazenamento do navegador) e grava as sessões de foco em `tempo-v1`, que o gerenciador lê para
mostrar o selo 🍅 em cada tarefa.

## Rodar localmente

Os módulos JavaScript não funcionam abrindo o arquivo direto (`file://`). Use um servidor local, por exemplo:

```
npx serve .
```

## Área de estudos (estudos/)

As páginas de `estudos/` são **geradas**: não edite os `.html` de lá à mão. O conteúdo fica em
`estudos/_conteudo/` (a pasta com `_` não é publicada pelo GitHub Pages):

- `trilhas.js`: a lista de trilhas (as que ainda não têm aulas ficam com `emBreve: true`)
- `html.js`: a trilha de HTML em três níveis (`niveis`: Iniciante, Intermediário e Avançado), cada um com módulos,
  aulas (texto + quiz) e desafios (enunciado, código inicial, testes e solução). Os módulos são numerados em
  sequência pela trilha toda
- `css.js`: a trilha de CSS, no mesmo formato. Os testes dos desafios leem `getComputedStyle` do resultado e, quando
  precisam saber como algo foi escrito (rem, `@media`, `var()`), o texto dos `<style>` (o estilo base do editor tem
  `data-base` e fica fora)
- `javascript.js`: a trilha de JavaScript. Os testes pegam as funções da pessoa com `doc.defaultView.eval('nome')`
  (enxerga até `const` e `class`) e simulam cliques e envios. O editor roda scripts e mostra um console embaixo do
  resultado (`window.__saida` guarda as linhas). Um código que travou a aba não roda sozinho ao reabrir a página
- `diario.js`: as anotações do diário de estudos
- `ajuda.js`: `codigo()` para exemplos com botão "Experimente", `trecho()` para código que não roda sozinho (só CSS) e `dica()` para as caixas de dica

Depois de editar, rode `node ferramentas/gerar-estudos.js` e faça o commit das páginas geradas (o GitHub Actions
avisa se esquecer). Os testes de cada desafio são funções que recebem o documento do resultado e devolvem
verdadeiro ou falso.

O progresso fica no navegador (`estudos-progresso`) e, para quem está logado, também no campo `estudos` do
documento `usuarios/{uid}` no Firestore (as regras atuais já permitem que cada pessoa grave só o próprio).
Depois de entrar pelo link de uma aula, o login volta para ela (`login.html?volta=estudos/...`).

O gerador também cria:

- `estudos/indice.json`: trilhas e aulas em ordem. É usado pelo painel, pelo certificado e pela busca do Ctrl+K
  (`js/paleta.js`, que só mostra as aulas quando há algo digitado)
- `estudos/perguntas.json`: as perguntas dos quizzes, para a página de revisão
- `estudos/revisao.html` e `estudos/certificado.html?trilha=<id>`: páginas pessoais, com `noindex`

O `js/estudos-paineis.js` monta o painel da página inicial dos estudos (continuar de onde parou, números, dias
seguidos e trilhas começadas), a revisão e o certificado. Ele só é baixado nas páginas que têm um deles. Os dados que
ele usa ficam em `estudos-extra` no navegador e no campo `estudosExtra` do mesmo documento da conta:

- `dias`: os dias em que a pessoa estudou (concluiu algo ou respondeu um quiz)
- `revisao`: as perguntas erradas na primeira tentativa (`html:tabelas:2` é a pergunta 2 da aula `html/tabelas`).
  Elas voltam no dia seguinte e, a cada acerto, depois de 3, 7 e 14 dias. No quarto acerto seguido, saem da lista
- `conclusao`: a data em que cada trilha chegou a 100%, que vai no certificado

## Verificação automática

A cada envio para a main, o GitHub Actions (`.github/workflows/verificar.yml`) confere os links internos
(`node ferramentas/verificar-links.js`, que também dá para rodar no computador), a formatação do Prettier e as
notas do Lighthouse nas páginas principais (limites em `ferramentas/lighthouserc.json`). Ele não publica nada:
só avisa, com um X vermelho no commit, se algo quebrou.

## Formatação

O código segue o [Prettier](https://prettier.io) (configuração em `.prettierrc.json`) e o `.editorconfig`. Para formatar tudo:

```
npx prettier --write .
```
