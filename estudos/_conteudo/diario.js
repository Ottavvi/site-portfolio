// Diário de estudos: anotações do que estou aprendendo, da mais nova para a mais antiga.
// Cada entrada vira uma página em estudos/diario/. Datas no formato AAAA-MM-DD.
const { codigo } = require('./ajuda');

module.exports = [
  {
    id: 'portfolio-mais-rapido',
    data: '2026-10-27',
    titulo: 'Como deixei o portfólio três vezes mais rápido no celular',
    resumo:
      'Fontes no próprio site e o Firebase carregado só quando precisa: de 4,6 s para 1,4 s até aparecer o primeiro texto.',
    tags: ['Desempenho', 'Lighthouse', 'Firebase'],
    corpo: `
<p>Rodei o Lighthouse (a auditoria que vem no Chrome) no meu portfólio simulando um celular e levei um susto: <strong>nota 63 em desempenho</strong>, com 4,6 segundos até aparecer o primeiro texto na tela. Acessibilidade, boas práticas e SEO estavam em 100, então o problema era só velocidade.</p>

<h2>O que estava pesando</h2>
<ul>
  <li><strong>As fontes do Google Fonts</strong> bloqueavam a página: o navegador esperava baixar o CSS das fontes, de outro servidor, antes de mostrar qualquer coisa.</li>
  <li><strong>O Firebase</strong> (mais de 100 KB) era baixado em todas as páginas, só para trocar o link "Entrar" por "Minha área" no menu. A maioria das visitas nem tem conta.</li>
</ul>

<h2>O que eu mudei</h2>
<p>Baixei as duas fontes (só os caracteres latinos) e passei a servir do próprio site, com pré-carregamento. As duas usam a licença SIL Open Font License, que permite isso.</p>
${codigo(`<link rel="preload" href="fontes/inter-latin.woff2" as="font" type="font/woff2" crossorigin>`)}
<p>No caso do Firebase, a página agora só baixa o código se fizer diferença: nas páginas de conta ou se aquele navegador já entrou alguma vez. Para saber disso sem o Firebase, guardo uma marca no <code>localStorage</code> quando a pessoa faz login, e o import passa a ser dinâmico:</p>
${codigo(`if (localStorage.getItem('sessao') === '1') {
  const { auth } = await import('../firebase.js');
  // ...
}`)}

<h2>O resultado</h2>
<p>A nota foi de <strong>63 para 96</strong> e o primeiro texto passou a aparecer em 1,4 s. De bônus, as fontes deixaram de passar pelo Google, então o IP de quem visita não vai mais para lá.</p>

<h2>O que aprendi</h2>
<p>O que mais pesava não era o meu código, e sim coisas de fora carregadas sem necessidade. Antes de otimizar qualquer coisa, vale medir e olhar o que realmente está bloqueando a página.</p>
`
  }
];
