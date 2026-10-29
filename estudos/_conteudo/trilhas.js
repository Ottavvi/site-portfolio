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
  require('./postgresql'),
  require('./python'),
  require('./php'),
  require('./csharp'),
  require('./java'),
  require('./go'),
  require('./rust'),

  // ---------- Apps e mobile ----------
  require('./kotlin'),
  require('./flutter'),

  // ---------- Qualidade e entrega ----------
  require('./git'),
  require('./playwright'),
  require('./github-actions'),
  require('./bash'),
  require('./powershell'),
  require('./lgpd'),
  require('./seguranca-web'),
  require('./docker'),

  // ---------- Dados e BI ----------
  require('./excel'),
  require('./vba'),
  require('./power-query'),
  require('./linguagem-m'),
  require('./power-bi'),
  require('./dax'),
  require('./sql-analise'),
  require('./pandas'),
  require('./r'),
  require('./estatistica')
];
