# Agente Contábil

Um agente contábil para pequenas empresas do Simples Nacional (e MEI). Ele lê o extrato bancário da empresa,
classifica cada movimento numa conta do plano de contas, faz os lançamentos de partidas dobradas e monta o livro
diário, o razão, o balancete, a DRE e o balanço. Também apura o Simples mês a mês (com Fator R), mostra os
próximos vencimentos e responde perguntas como "quanto vou pagar de DAS?", "qual o meu Fator R?" ou "como lançar
a compra de um computador?".

HTML, CSS e JavaScript puros, sem etapa de build. Tudo roda e fica salvo no navegador.

## Como abrir

```
npx serve .
```

ou a extensão Live Server do VS Code (os módulos JavaScript não abrem direto pelo `file://`). Na primeira vez, o
app abre com uma empresa de exemplo: uma desenvolvedora de software com 18 meses de extrato, dois funcionários e
um sócio com pró-labore. A receita cresce mais rápido que a folha e, no mês atual, o Fator R cai para 27%: o DAS
passa para o Anexo V. É a situação que o agente aponta no painel.

## Telas

- **Painel**: resultado do último mês fechado, alertas (Fator R, movimentos sem conta, balancete) e vencimentos.
- **Extrato e contas**: cada movimento do banco com a conta escolhida. Ao trocar a conta, o agente aprende a
  regra para o mesmo fornecedor ou cliente.
- **Livro diário**: os lançamentos do mês, com débito e crédito de cada partida e o histórico.
- **Razão**: o histórico de uma conta, com saldo após cada lançamento e o resumo em forma de T (razonete).
- **Balancete**: débitos, créditos e saldo de cada conta até uma data, com a prova de que débitos = créditos.
- **DRE**: mês, ano ou 12 meses, com o detalhe por conta, a análise vertical (% da receita) e o período anterior.
- **Balanço**: ativo, passivo e patrimônio líquido numa data, com a conferência ativo = passivo + PL.
- **Impostos**: prévia do DAS do mês, RBT12, anexo, faixa e alíquota efetiva; régua e gráfico do Fator R; a
  apuração de cada mês; e um simulador. Para MEI: uso do limite anual e projeção.
- **Obrigações**: DAS, FGTS Digital, DCTFWeb e DEFIS (ou DAS-MEI e DASN-SIMEI) dos próximos 12 meses.

## Como a contabilidade é feita

- **Lançamentos do banco** (regime de caixa): entrada = débito no banco e crédito na conta escolhida; saída =
  débito na conta e crédito no banco. O capital inicial entra no primeiro dia (débito banco, crédito capital).
- **DAS por competência**: no último dia de cada mês fechado, débito em Simples Nacional (dedução da receita) e
  crédito em Simples a recolher. O pagamento no dia 20 do mês seguinte baixa a dívida.
- **Depreciação**: computadores e equipamentos vão para o ativo e depreciam 20% ao ano (1/60 por mês).
- **Simples Nacional**: alíquota efetiva = (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12, com as tabelas
  dos Anexos I a V da LC 123/2006. Nos primeiros 12 meses, a receita é proporcionalizada (média × 12).
- **Fator R**: folha dos 12 meses anteriores (salários, pró-labore e encargos; benefícios ficam fora) ÷ receita dos
  12 meses. 28% ou mais: Anexo III; abaixo: Anexo V. O agente calcula quanto de folha falta e a economia no DAS.
- **MEI**: DAS de R$ 81,05 + R$ 1 (ICMS) e/ou R$ 5 (ISS) em 2026 (5% do salário mínimo de R$ 1.621). Limite de
  R$ 81 mil em 2026; a LC 238/2026 sobe para R$ 110 mil em 2027 e R$ 140 mil em 2028.

Os valores e prazos estão em `js/impostos.js` e `js/obrigacoes.js`, com as fontes nos comentários. O app é uma
ferramenta de estudo e acompanhamento: decisões fiscais devem ser confirmadas com o contador responsável.

## O agente

As mesmas ferramentas (`js/ferramentas.js`) servem aos dois modos: DRE, evolução mensal, balancete, balanço, razão,
busca de movimentos, apuração do Simples, Fator R (com simulação de pró-labore), simulação de DAS, situação do MEI,
obrigações, plano de contas, como lançar, movimentos a classificar e reclassificar (com desfazer).

- **Local** (padrão): `js/agente-local.js` entende a pergunta, o período e a conta citada, e responde com tabelas
  no estilo livro e razonetes (contas em T) para explicar débito e crédito.
- **Claude** (opcional, em Empresa e ajustes): com uma chave da API da Anthropic, o Claude escolhe as ferramentas,
  o app executa aqui e devolve só o resultado de cada consulta (`js/agente-claude.js`).

## Power BI

`powerbi/AgenteContabil.pbip` tem 4 páginas: visão geral, DRE, balancete e Simples Nacional (Fator R contra a linha
de 28%, DAS pago contra o DAS no outro anexo). Ele lê a planilha exportada em **Empresa e ajustes > Exportar para
Excel** (abas Diario, Contas e Apuracao). Para a planilha de exemplo, abra direto; para outra, mude o parâmetro
**CaminhoPlanilha** em Transformar dados > Editar parâmetros.

```
node powerbi/ferramentas/gerar-powerbi.js "C:\caminho\da\planilha.xlsx"
python powerbi/ferramentas/validar_pbir.py powerbi/ferramentas/schemas-json powerbi/AgenteContabil.Report
```

## Estrutura

```
index.html, css/app.css   casca e estilos (claro e escuro)
js/app.js, js/telas.js     navegação, chat e telas
js/estado.js               dados salvos no navegador, importação, reclassificação e backup
js/plano.js                plano de contas, regras de classificação e exemplos de lançamento
js/contabil.js             motor contábil: livro diário, razão, balancete, DRE, balanço e apuração do Simples
js/impostos.js             tabelas do Simples, Fator R e MEI
js/obrigacoes.js           calendário de obrigações
js/ferramentas.js          o que o agente consulta e muda
js/agente-local.js         o agente sem internet
js/agente-claude.js        o modo Claude
js/importar.js, exportar.js, graficos.js, util.js, demo.js
dados/                     planilha de exemplo e um extrato de empresa (CSV) para testar a importação
powerbi/                   projeto do Power BI e o gerador
fontes/                    IBM Plex Serif, IBM Plex Mono e Work Sans (licença OFL)
```
