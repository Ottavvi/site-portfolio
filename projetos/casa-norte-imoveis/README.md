# Casa Norte Imóveis

Site de portfólio para uma imobiliária fictícia de Curitiba. A ideia central: cada anúncio mostra o **custo do
mês** (aluguel ou parcela estimada + condomínio + IPTU), e a busca filtra por ele.

## O que tem

- **Busca**: comprar ou alugar, bairro, tipo, quartos e teto de custo mensal; ordenação por custo, preço do m²,
  área e anúncios recentes.
- **28 imóveis** gerados de forma estável (sempre os mesmos), com preço calculado pelo m² de cada bairro.
- **Fachadas e plantas em SVG** desenhadas a partir dos dados: prédio com o número de andares, casa ou sobrado,
  e uma planta esquemática com o número de quartos. Nenhuma foto de banco de imagens.
- **Detalhe do imóvel**: ficha, custos do mês, botão de salvar e pedido de visita (dia e período) pelo WhatsApp.
- **Salvos**: favoritos guardados no navegador, com uma visão só deles.
- **Simulador de financiamento**: SAC contra Price lado a lado, juros totais, renda mínima (30%) e gráfico da
  parcela ano a ano. Do anúncio, "Simular com outros valores" leva o preço do imóvel para o simulador.
- **Anunciar**: faixa de preço pelo m² do bairro e contato com mensagem pronta.

## Como abrir

```
npx serve .
```

## Onde mexer

- `js/imoveis.js`: bairros (com o preço do m²), ruas e o gerador da carteira.
- `js/desenhos.js`: fachadas e plantas.
- `js/financiamento.js`: SAC, Price e o gráfico.
- Fontes: Gloock e Instrument Sans (licença OFL).
