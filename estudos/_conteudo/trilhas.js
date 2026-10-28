// Trilhas da área de estudos, agrupadas por área e na ordem em que aparecem.
// As que ainda não têm aulas ficam com emBreve: true. A sigla é o que aparece no quadradinho do cartão.
module.exports = [
  // ---------- Desenvolvimento web ----------
  require('./html'),
  require('./css'),
  require('./javascript'),
  require('./modulos-es'),
  require('./localstorage'),
  require('./web-audio'),
  require('./notificacoes'),
  require('./pwa-offline'),
  require('./i18n'),
  require('./react'),

  // ---------- Back-end e dados ----------
  require('./nodejs'),
  require('./sqlite'),
  require('./python'),

  // ---------- Qualidade e entrega ----------
  require('./playwright'),
  require('./github-actions'),
  require('./powershell'),
  require('./lgpd'),

  // ---------- Dados e BI ----------
  require('./excel'),
  require('./power-query'),
  require('./power-bi'),
  require('./dax')
];
