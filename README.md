# Portfólio — ottavvi.dev

Site pessoal de Otávio, publicado em https://ottavvi.github.io/site-portfolio/

HTML, CSS e JavaScript puros, sem etapa de build. Login, área de membros e formulário de contato usam o Firebase.

## Estrutura

```
index.html, sobre.html          páginas principais
rota-municipal.html             estudo de caso do Rota Municipal
pousada.html                    estudo de caso da Pousada Lagoa Azul (prints em imagens/pousada/)
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

## Formatação

O código segue o [Prettier](https://prettier.io) (configuração em `.prettierrc.json`) e o `.editorconfig`. Para formatar tudo:

```
npx prettier --write .
```
