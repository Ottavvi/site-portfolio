# Agente Financeiro

Um agente que lê o extrato do banco, organiza os gastos por categoria, prevê o saldo das próximas semanas e
responde perguntas sobre o dinheiro em português: "quanto gastei com mercado em setembro?", "posso gastar R$ 600
em roupa?", "vai sobrar dinheiro no fim do mês?".

HTML, CSS e JavaScript puros, sem etapa de build e sem servidor: tudo roda e fica salvo no navegador.

## Como abrir

Os módulos JavaScript não funcionam abrindo o `index.html` direto (`file://`). Use um servidor local:

```
npx serve .
```

ou a extensão Live Server do VS Code. Na primeira vez, o app abre com 13 meses de dados de exemplo (uma designer
com emprego de meio período que também atende clientes como MEI).

## O que ele faz

- **Visão geral**: o resultado do mês em uma frase, para onde o dinheiro foi (com o orçamento de cada categoria),
  alertas do agente, 12 meses de entradas e saídas e a previsão de saldo.
- **Transações**: busca e filtros. Ao mudar a categoria de uma linha, o agente aprende a regra para o mesmo
  estabelecimento e reclassifica as outras.
- **Orçamentos**: limite por categoria, com projeção até o fim do mês (que não "projeta" de novo contas já pagas,
  como o aluguel).
- **Previsão**: saldo dia a dia nos próximos 90 dias, nos cenários "esperado" e "sem entradas extras". Mostra
  o ponto mais baixo e as contas que se repetem todo mês (e avisa quando aparece uma nova).
- **Metas**: quanto separar por mês para cada meta e se isso cabe na sobra média dos últimos 6 meses.
- **Importar**: CSV de qualquer banco (acha sozinho as colunas de data, descrição e valor, ou débito e crédito)
  e OFX. Faturas de cartão em CSV são detectadas para inverter o sinal. Lançamentos repetidos não duplicam.
- **Exportar**: Excel (.xlsx com tabelas prontas para o Power BI), CSV e backup em JSON.

## O agente

Dois modos, com as mesmas ferramentas (`js/ferramentas.js`): resumo do mês, buscar transações, evolução mensal,
contas recorrentes, previsão de saldo, orçamentos, metas, "posso gastar", alertas e, para mudanças, definir
orçamento e criar meta (com botão de desfazer).

- **Local** (padrão): `js/agente-local.js` reconhece a intenção da pergunta, o período ("mês passado", "em
  agosto", "últimos 3 meses"), a categoria (inclusive sinônimos como "uber" e "luz") e valores ("2 mil"), chama as
  ferramentas e monta a resposta. Funciona sem internet e sem chave.
- **Claude** (opcional, em Ajustes): com uma chave da API da Anthropic, a pergunta vai para o Claude junto com a
  lista de ferramentas. O modelo escolhe o que consultar, o app executa aqui no navegador e devolve só o resultado
  daquela consulta (`js/agente-claude.js`). O extrato inteiro nunca sai do computador.

Os números aparecem como "recibos" (notinhas de caixa) no chat.

## Power BI

A pasta `powerbi/` tem um projeto do Power BI (formato PBIP, em texto) com 4 páginas: visão geral, categorias
e orçamento, transações, previsão e metas.

1. No app, vá em **Ajustes > Exportar para Excel** (ou use `dados/agente-financeiro-exemplo.xlsx`).
2. Abra `powerbi/AgenteFinanceiro.pbip` no Power BI Desktop.
3. Se a planilha estiver em outro lugar: **Transformar dados > Editar parâmetros > CaminhoPlanilha**, cole o caminho
   do arquivo e clique em **Aplicar alterações**.

Para gerar o projeto de novo (por exemplo, com outro caminho padrão):

```
node powerbi/ferramentas/gerar-powerbi.js "C:\caminho\da\planilha.xlsx"
python powerbi/ferramentas/validar_pbir.py powerbi/ferramentas/schemas-json powerbi/AgenteFinanceiro.Report
```

O validador confere todos os JSON do relatório contra os esquemas do Power BI Desktop. A biblioteca
`powerbi/ferramentas/pbip.js` é a mesma estrutura do gerador do painel-empresas, transformada em funções.

## Estrutura

```
index.html               casca do app (trilho, conteúdo, painel do agente)
css/app.css              estilos (tema claro e escuro)
js/app.js                navegação, chat e tema
js/telas.js              as telas
js/estado.js             dados salvos no navegador (localStorage), importação e backup
js/categorias.js         categorias (com as cores das cédulas do real) e regras de classificação
js/analise.js            todas as contas: resumo, recorrentes, previsão, orçamentos, metas e alertas
js/ferramentas.js        o que o agente pode consultar e mudar
js/agente-local.js       o agente que entende perguntas sem internet
js/agente-claude.js      o modo Claude (API da Anthropic com uso de ferramentas)
js/importar.js           leitura de CSV e OFX
js/exportar.js           CSV e .xlsx (montado sem biblioteca)
js/graficos.js           gráficos em SVG
js/demo.js               dados de exemplo
dados/                   planilha de exemplo e extratos de exemplo (CSV de banco e OFX) para testar a importação
powerbi/                 projeto do Power BI e o gerador
fontes/                  Bricolage Grotesque e Instrument Sans (licença OFL)
```

## Privacidade

Os dados ficam no `localStorage` deste navegador. Para levar para outro computador, use o backup em Ajustes.
A chave da API (se usada) também fica só no navegador e não entra no backup.
