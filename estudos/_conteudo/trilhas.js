// Trilhas da área de estudos, na ordem em que aparecem. As que ainda não têm conteúdo ficam como "em breve".
module.exports = [
  require('./html'),
  {
    id: 'css',
    titulo: 'CSS',
    resumo: 'Cores, tipografia, caixas, flexbox, grid e páginas que se adaptam ao celular.',
    emBreve: true
  },
  {
    id: 'javascript',
    titulo: 'JavaScript',
    resumo: 'Variáveis, funções, eventos e o DOM: fazer a página reagir ao que a pessoa faz.',
    emBreve: true
  }
];
