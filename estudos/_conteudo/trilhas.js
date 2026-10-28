// Trilhas da área de estudos, agrupadas por área e na ordem em que aparecem.
// As que ainda não têm aulas ficam com emBreve: true. A sigla é o que aparece no quadradinho do cartão.
module.exports = [
  // ---------- Desenvolvimento web ----------
  require('./html'),
  require('./css'),
  require('./javascript'),
  require('./typescript'),
  require('./modulos-es'),
  require('./localstorage'),
  require('./web-audio'),
  require('./notificacoes'),
  require('./pwa-offline'),
  require('./i18n'),
  require('./acessibilidade'),
  require('./regex'),
  require('./seo-performance'),
  require('./react'),

  // ---------- Back-end e dados ----------
  require('./nodejs'),
  require('./apis-http'),
  require('./ia-agentes'),
  require('./sqlite'),
  require('./python'),

  // ---------- Qualidade e entrega ----------
  require('./git'),
  require('./playwright'),
  require('./github-actions'),
  require('./powershell'),
  require('./lgpd'),
  require('./seguranca-web'),
  require('./docker'),

  // ---------- Dados e BI ----------
  require('./excel'),
  require('./power-query'),
  require('./power-bi'),
  require('./dax'),
  require('./sql-analise'),
  require('./pandas'),
  require('./estatistica')
];
