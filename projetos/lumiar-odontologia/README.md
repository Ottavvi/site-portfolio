# Lumiar Odontologia

Site de portfólio para uma clínica odontológica fictícia, com agendamento online que funciona de verdade no
navegador.

## O que tem

- **Próximos horários livres** na abertura: os 4 primeiros horários de avaliação, clicáveis. O clique já preenche
  o formulário.
- **Agendamento**: tratamento → profissional (ou "primeiro disponível") → dia → horário → dados. Cada dentista
  atende em dias diferentes e cada tratamento tem uma duração, então só aparecem horários com tempo livre seguido.
  Almoço, sábado à tarde e horários com menos de 1h de antecedência ficam de fora.
- **Minhas consultas**: o agendamento fica salvo no navegador (localStorage), com botão para avisar a clínica no
  WhatsApp com a mensagem pronta e cancelamento em dois cliques. O horário cancelado volta para a agenda.
- Tratamentos com preço e duração, equipe, primeira consulta, convênios, dúvidas e mapa desenhado em SVG.

A agenda "ocupada" é simulada com um gerador estável por data, então a mesma data mostra sempre os mesmos horários.

## Como abrir

```
npx serve .
```

ou a extensão Live Server do VS Code (os módulos JavaScript não abrem pelo `file://`).

## Estrutura

```
index.html
css/estilo.css     paleta porcelana, abeto, pistache e ameixa
js/dados.js        tratamentos, equipe e expediente (edite aqui)
js/agenda.js       motor de horários
js/app.js          telas e formulário
fontes/            Young Serif e Instrument Sans (licença OFL)
img/               ícone e mapa
```
