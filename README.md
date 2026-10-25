# Portfólio — ottavvi.dev

Site pessoal de Otávio, publicado em https://ottavvi.github.io/site-portfolio/

HTML, CSS e JavaScript puros, sem etapa de build. Login, área de membros e formulário de contato usam o Firebase.

## Estrutura

```
index.html, sobre.html          páginas principais
login.html, cadastro.html,      páginas de conta
recuperar.html, acao.html,
area.html, admin.html
css/style.css                   estilos de todas as páginas
js/main.js                      menu, animações e campo de senha (todas as páginas)
js/firebase.js                  configuração do Firebase e UID do admin
js/contact.js                   formulário de contato (index.html)
js/auth/session.js              link "Entrar/Minha área" e botão "Sair" (todas as páginas)
js/auth/shared.js               funções comuns das páginas de conta
js/auth/<página>.js             código de cada página de conta (login.js, area.js...)
firestore.rules                 regras de segurança do Firestore
imagens/                        imagens do portfólio
projetos/                       projetos de exemplo (barbearia, tarefas, cronômetro)
```

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
