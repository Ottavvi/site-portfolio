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
  {
    id: 'powershell',
    area: 'Qualidade e entrega',
    titulo: 'PowerShell',
    sigla: 'PS',
    resumo: 'Automatizar o Windows: arquivos, programas e tarefas repetitivas.',
    emBreve: true
  },
  {
    id: 'lgpd',
    area: 'Qualidade e entrega',
    titulo: 'LGPD',
    sigla: 'LG',
    resumo: 'Proteção de dados na prática: o que um site ou sistema precisa fazer para cumprir a lei.',
    emBreve: true
  },

  // ---------- Dados e BI ----------
  require('./excel'),
  require('./power-query'),
  require('./power-bi'),
  {
    id: 'dax',
    area: 'Dados e BI',
    titulo: 'DAX',
    sigla: 'DAX',
    resumo: 'Medidas e cálculos no Power BI: contexto de filtro, CALCULATE e inteligência de tempo.',
    emBreve: true
  }
];
