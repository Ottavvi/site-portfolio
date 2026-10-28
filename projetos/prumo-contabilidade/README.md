# Prumo Contabilidade

Site de portfólio para um escritório de contabilidade fictício. A abertura é uma ferramenta de verdade: o
**comparador de regimes**.

## O que tem

- **Comparador**: atividade, faturamento e folha do mês. Mostra lado a lado MEI, Simples Nacional e Lucro Presumido
  com o valor do mês, do ano, a porcentagem do faturamento e o detalhe de cada imposto. O menor fica marcado.
  - Simples pelas tabelas dos Anexos I a V (LC 123/2006), com Fator R para serviços intelectuais.
  - MEI 2026: limite de R$ 81 mil e DAS de R$ 81,05 + R$ 1 (ICMS) ou R$ 5 (ISS).
  - Presumido de serviços: presunção de 32%, ISS de 3% e INSS patronal de 20%. Para comércio e indústria o site
    não estima (depende do ICMS de cada produto) e diz isso.
  - Dica do Fator R: quanto de pró-labore falta para chegar a 28% e quanto o DAS cai, já descontado o INSS de 11%
    do sócio.
- **Agenda fiscal** com os próximos vencimentos (Simples ou MEI), ajustados para fim de semana.
- Serviços, abertura de empresa em 5 etapas, honorários e contato pelo WhatsApp.
- Link para o **Agente Contábil** (`../../agente-contabil/`), que funciona quando os dois projetos estão na pasta
  Projetos, como estão agora.

As tabelas ficam em `js/impostos.js` (a mesma do Agente Contábil) e a comparação em `js/comparador.js`, com as
simplificações descritas no começo do arquivo e no site, em "Como a conta é feita".

## Como abrir

```
npx serve .
```

Fontes: Libre Baskerville e Outfit (licença OFL).
