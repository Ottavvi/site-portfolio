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
  {
    id: 'nodejs',
    area: 'Back-end e dados',
    titulo: 'Node.js',
    sigla: 'Nd',
    resumo: 'JavaScript fora do navegador: scripts, arquivos e APIs com Express.',
    emBreve: true
  },
  require('./sqlite'),
  require('./python'),

  // ---------- Qualidade e entrega ----------
  {
    id: 'playwright',
    area: 'Qualidade e entrega',
    titulo: 'Playwright',
    sigla: 'PW',
    resumo: 'Testes que abrem o navegador e usam o site como uma pessoa usaria.',
    emBreve: true
  },
  {
    id: 'github-actions',
    area: 'Qualidade e entrega',
    titulo: 'GitHub Actions',
    sigla: 'GA',
    resumo: 'Robôs que testam e publicam o projeto sozinhos a cada envio para o GitHub.',
    emBreve: true
  },
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
  {
    id: 'excel',
    area: 'Dados e BI',
    titulo: 'Excel',
    sigla: 'XL',
    resumo: 'Fórmulas, tabelas, PROCX, gráficos e planilhas que outras pessoas conseguem usar.',
    emBreve: true
  },
  {
    id: 'power-query',
    area: 'Dados e BI',
    titulo: 'Power Query',
    sigla: 'PQ',
    resumo: 'Importar, limpar e juntar dados de várias fontes sem refazer tudo à mão todo mês.',
    emBreve: true
  },
  {
    id: 'power-bi',
    area: 'Dados e BI',
    titulo: 'Power BI',
    sigla: 'BI',
    resumo: 'Modelos de dados, relacionamentos e painéis que respondem às perguntas do negócio.',
    emBreve: true
  },
  {
    id: 'dax',
    area: 'Dados e BI',
    titulo: 'DAX',
    sigla: 'DAX',
    resumo: 'Medidas e cálculos no Power BI: contexto de filtro, CALCULATE e inteligência de tempo.',
    emBreve: true
  }
];
