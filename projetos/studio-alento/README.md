# Studio Alento

Site de portfólio para um studio fictício de pilates, yoga e funcional leve.

## O que tem

- **Abertura com respiração guiada**: um círculo que cresce e encolhe num ciclo de 10 segundos ("inspira" e
  "solta"). É a única animação automática do site e para quando o sistema pede menos movimento.
- **Grade da semana**: 31 aulas em tabela (dia × horário) no computador e em lista por dia no celular, com cor
  por modalidade, filtro e vagas por turma. Turmas lotadas ficam desativadas.
- **Aula experimental**: clique numa aula com vaga, preencha nome e WhatsApp e ela fica marcada na grade (salva no
  navegador). Uma experimental por pessoa: reservar outra troca a anterior. Dá para cancelar pela mesma aula.
- **Planos**: aparelhos ou aulas livres, 1×, 2× ou 3× por semana, com desconto trimestral e semestral e o preço
  por aula calculado.
- Modalidades, equipe e contato.

## Como abrir

```
npx serve .
```

## Onde mexer

- `js/dados.js`: modalidades, grade (dia, hora, modalidade, professora, nível), planos e equipe.
- `css/estilo.css`: paleta lavanda, berinjela e damasco.
- Fontes: Italiana e Outfit (licença OFL).
