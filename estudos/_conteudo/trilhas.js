// Trilhas da área de estudos, agrupadas por área e na ordem em que aparecem.
// As que ainda não têm aulas ficam com emBreve: true. A sigla é o que aparece no quadradinho do cartão.
module.exports = [
  // ---------- Desenvolvimento web ----------
  require('./html'),
  require('./css'),
  {
    id: 'javascript',
    area: 'Desenvolvimento web',
    titulo: 'JavaScript',
    sigla: 'JS',
    resumo: 'Variáveis, funções, eventos e o DOM: fazer a página reagir ao que a pessoa faz.',
    emBreve: true
  },
  {
    id: 'modulos-es',
    area: 'Desenvolvimento web',
    titulo: 'Módulos ES',
    sigla: 'ES',
    resumo: 'import e export para dividir o código em arquivos, sem ferramenta de build.',
    emBreve: true
  },
  {
    id: 'localstorage',
    area: 'Desenvolvimento web',
    titulo: 'LocalStorage',
    sigla: 'LS',
    resumo: 'Guardar dados no navegador: preferências, rascunhos e listas que sobrevivem ao fechar a aba.',
    emBreve: true
  },
  {
    id: 'web-audio',
    area: 'Desenvolvimento web',
    titulo: 'Web Audio',
    sigla: 'WA',
    resumo: 'Gerar e tocar sons pelo navegador: alarmes, efeitos e sintetizadores.',
    emBreve: true
  },
  {
    id: 'notificacoes',
    area: 'Desenvolvimento web',
    titulo: 'Notificações',
    sigla: 'NT',
    resumo: 'Pedir permissão e avisar a pessoa fora da página, do jeito certo.',
    emBreve: true
  },
  {
    id: 'pwa-offline',
    area: 'Desenvolvimento web',
    titulo: 'PWA offline',
    sigla: 'PWA',
    resumo: 'Service worker, cache e manifesto: um site que instala como app e funciona sem internet.',
    emBreve: true
  },
  {
    id: 'i18n',
    area: 'Desenvolvimento web',
    titulo: 'i18n',
    sigla: 'i18n',
    resumo: 'Sites em vários idiomas: textos, datas, moedas e o que muda além da tradução.',
    emBreve: true
  },
  {
    id: 'react',
    area: 'Desenvolvimento web',
    titulo: 'React',
    sigla: 'Re',
    resumo: 'Componentes, estado, efeitos e rotas para interfaces que crescem sem virar bagunça.',
    emBreve: true
  },

  // ---------- Back-end e dados ----------
  {
    id: 'nodejs',
    area: 'Back-end e dados',
    titulo: 'Node.js',
    sigla: 'Nd',
    resumo: 'JavaScript fora do navegador: scripts, arquivos e APIs com Express.',
    emBreve: true
  },
  {
    id: 'sqlite',
    area: 'Back-end e dados',
    titulo: 'SQLite',
    sigla: 'SQL',
    resumo: 'Banco de dados num arquivo: tabelas, consultas, relacionamentos e índices.',
    emBreve: true
  },
  {
    id: 'python',
    area: 'Back-end e dados',
    titulo: 'Python',
    sigla: 'Py',
    resumo: 'A linguagem mais usada para automatizar tarefas e trabalhar com dados.',
    emBreve: true
  },

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
