# Brasa 47 — hamburgueria

Site de portfólio para uma hamburgueria de smash burger fictícia, com pedido completo pelo WhatsApp.

## O que tem

- **Monte o seu** na abertura: pão, número de carnes, queijo, extras e molho. O hambúrguer é desenhado em SVG
  camada por camada e cresce conforme as escolhas (o queijo escorre por cima de cada carne). O preço muda junto.
- **Cardápio** com as miniaturas dos burgers da casa feitas com o mesmo desenhista, acompanhamentos e bebidas.
  Depois de adicionar, o botão vira um seletor de quantidade.
- **Sacola** lateral: itens com quantidade, entrega ou retirada, bairro com taxa, endereço, pagamento (Pix, cartão
  ou dinheiro com troco) e observação. "Enviar pedido no WhatsApp" abre a conversa com a mensagem pronta.
- **Aberto ou fechado**: o selo no topo lê o horário (terça a domingo, 18h às 23h30) e diz quando abre.
- Sacola e dados de entrega ficam salvos no navegador.

## Como abrir

```
npx serve .
```

## Onde mexer

- `js/cardapio.js`: itens, preços, bairros e taxas, horário e número do WhatsApp.
- `js/camadas.js`: o desenho de cada camada (pão, carne, queijo, bacon...). Para um burger novo, basta listar as
  camadas de baixo para cima no cardápio.
- `css/estilo.css`: paleta mostarda, ketchup, kraft e carvão.
- Fontes: Boldonse e Work Sans (licença OFL), em `fontes/`.
