// Trilha de Power BI. Sem editor: as aulas são para acompanhar no Power BI Desktop (gratuito, para Windows).
// As práticas usam os dados de exemplo das trilhas de Excel e Power Query, ou os painéis de exemplo deste portfólio.
// As fórmulas DAX aparecem só no básico; a trilha de DAX se aprofunda. Depois de editar, rode
// `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta, tabela } = require('./ajuda');

module.exports = {
  id: 'power-bi',
  area: 'Dados e BI',
  titulo: 'Power BI',
  sigla: 'BI',
  resumo: 'Relatórios interativos: modelo de dados, visuais que contam uma história e publicação.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'O que é o Power BI e o primeiro relatório.',
      modulos: [
        {
          titulo: 'Primeiro relatório',
          itens: [
            {
              id: 'o-que-e-power-bi',
              titulo: 'O que é o Power BI',
              resumo: 'Desktop e Serviço, o caminho dos dados e as três telas.',
              minutos: 9,
              corpo: `
<p>O <strong>Power BI</strong> é a ferramenta da Microsoft para transformar dados em relatórios interativos: a pessoa clica numa barra do gráfico e todo o relatório filtra para aquela categoria. Ele junta, num lugar só, o que no Excel fica espalhado: buscar e limpar dados (Power Query), relacionar tabelas (o modelo), calcular indicadores (DAX) e desenhar o painel.</p>

<h2>As duas partes</h2>
<ul>
  <li><strong>Power BI Desktop</strong>: o programa (gratuito, para Windows) onde o relatório é construído. Baixe pela Microsoft Store.</li>
  <li><strong>Serviço do Power BI</strong> (app.powerbi.com): onde o relatório é publicado, atualizado automaticamente e compartilhado. Compartilhar com outras pessoas exige licença Pro (ou capacidade Premium/Fabric) para quem publica e para quem vê.</li>
</ul>

<h2>O caminho dos dados</h2>
<ol>
  <li><strong>Obter dados</strong>: Excel, CSV, pastas, bancos de dados, SharePoint, APIs.</li>
  <li><strong>Transformar</strong> no Power Query (a mesma ferramenta do Excel, com a trilha própria aqui).</li>
  <li><strong>Modelar</strong>: relacionar as tabelas e criar as <strong>medidas</strong> em DAX.</li>
  <li><strong>Visualizar</strong>: arrastar campos para gráficos, cartões e tabelas.</li>
  <li><strong>Publicar</strong> e agendar a atualização.</li>
</ol>

<h2>As três telas do Desktop</h2>
<p>Na barra da esquerda: <strong>Relatório</strong> (o painel), <strong>Tabela</strong> (ver os dados carregados) e <strong>Modelo</strong> (as tabelas e os relacionamentos, como um diagrama). À direita ficam os painéis de <strong>Visualizações</strong>, <strong>Dados</strong> (as tabelas e campos) e <strong>Filtros</strong>.</p>
${dica('Um relatório do Power BI é interativo por padrão: clicar num elemento de um visual filtra (ou destaca) os outros. Planeje o painel pensando nos cliques, não só na aparência.')}

<h2>Quando usar Power BI e quando usar Excel</h2>
<ul>
  <li><strong>Excel</strong>: controle pessoal, cálculos pontuais, quem recebe precisa editar os números.</li>
  <li><strong>Power BI</strong>: várias tabelas relacionadas, muitos dados, o mesmo relatório atualizado todo mês para várias pessoas, filtros interativos e controle de quem vê o quê.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Onde o relatório é construído?',
                  opcoes: ['No Serviço (app.powerbi.com)', 'No Power BI Desktop', 'No Excel'],
                  certa: 1,
                  explicacao: 'O Desktop constrói; o Serviço publica, atualiza e compartilha.'
                },
                {
                  pergunta: 'Qual parte do Power BI limpa e transforma os dados?',
                  opcoes: ['DAX', 'Power Query', 'O painel de Visualizações'],
                  certa: 1,
                  explicacao: 'O Power Query prepara; o DAX calcula sobre o modelo pronto.'
                },
                {
                  pergunta: 'O que acontece ao clicar numa barra de um gráfico do relatório?',
                  opcoes: ['Nada', 'Os outros visuais filtram ou destacam aquela categoria', 'Abre o Excel'],
                  certa: 1,
                  explicacao: 'É a interação entre visuais, que pode ser ajustada em Formatar, Editar interações.'
                }
              ]
            },
            {
              id: 'primeiro-relatorio',
              titulo: 'Visuais, filtros e formatação',
              resumo: 'Cartões, barras, linhas, matriz, segmentações e um layout que se lê.',
              minutos: 12,
              corpo: `
<h2>Os visuais mais usados</h2>
<ul>
  <li><strong>Cartão</strong>: um número em destaque (faturamento do mês). O novo visual de cartão permite vários números lado a lado.</li>
  <li><strong>Barras ou colunas clusterizadas</strong>: comparar categorias.</li>
  <li><strong>Linhas</strong>: evolução no tempo. Arraste a data para o eixo X.</li>
  <li><strong>Matriz</strong>: a tabela dinâmica do Power BI, com subtotais e expansão por níveis.</li>
  <li><strong>Segmentação de dados</strong> (<em>slicer</em>): filtros em forma de botões, lista ou intervalo de datas.</li>
  <li><strong>Mapa</strong>, <strong>rosca</strong>, <strong>dispersão</strong> e <strong>cascata</strong> (de onde vem e para onde vai o resultado, ótima para DRE).</li>
</ul>
<p>Para criar, clique num visual em Visualizações e arraste os campos do painel Dados para os campos do visual (Eixo X, Eixo Y, Legenda...). O Power BI soma números sozinho, mas o certo é usar <strong>medidas</strong> (próximo nível).</p>

<h2>Filtros em três níveis</h2>
<p>No painel Filtros: <strong>neste visual</strong>, <strong>nesta página</strong> e <strong>em todas as páginas</strong>. Filtros fixos (só o ano atual, sem os pedidos cancelados) ficam ali; os que a pessoa vai mexer viram segmentações na página.</p>

<h2>Um layout que se lê</h2>
<ul>
  <li>A leitura vai da esquerda para a direita, de cima para baixo: os números principais (cartões) no topo, os detalhes embaixo.</li>
  <li>Poucos visuais por página (4 a 6). Mais que isso vira poluição; crie outra página.</li>
  <li>Alinhe tudo numa grade (Exibir, Linhas de grade, Ajustar à grade) e use o mesmo espaçamento.</li>
  <li>Títulos que dizem algo. Cores com significado: uma para o destaque, cinza para o resto, vermelho e verde só para ruim e bom.</li>
  <li>Use um <strong>tema</strong> (Exibir, Temas) para padronizar cores e fontes em todas as páginas.</li>
</ul>
${dica('Faça um rascunho do painel no papel antes de abrir o Power BI: quais 3 perguntas ele responde, e qual visual responde cada uma. Isso evita o "painel de tudo", que não responde nada.')}
`,
              quiz: [
                {
                  pergunta: 'Qual visual equivale à tabela dinâmica do Excel?',
                  opcoes: ['Tabela', 'Matriz', 'Cartão'],
                  certa: 1,
                  explicacao: 'A matriz tem linhas, colunas, valores e subtotais por nível.'
                },
                {
                  pergunta: 'Onde fica um filtro fixo que vale para o relatório inteiro?',
                  opcoes: ['Numa segmentação em cada página', 'No painel Filtros, em todas as páginas', 'Na tabela'],
                  certa: 1,
                  explicacao: 'Segmentações são para os filtros que a pessoa vai mexer.'
                },
                {
                  pergunta: 'Quantos visuais por página costumam funcionar bem?',
                  opcoes: ['1', '4 a 6', '15 ou mais'],
                  certa: 1,
                  explicacao: 'Mais que isso, a página perde o foco. Divida em páginas por assunto.'
                }
              ]
            },
            {
              id: 'pratica-primeiro-painel',
              titulo: 'Prática: o primeiro painel',
              resumo: 'Carregue uma tabela de vendas e monte uma página com 4 visuais.',
              minutos: 30,
              corpo: `
<p>Crie no Excel uma Tabela <code>tbVendas</code> com estes dados e salve o arquivo. No Power BI Desktop: Página Inicial, Obter dados, Pasta de Trabalho do Excel, marque tbVendas e clique em Carregar.</p>
${tabela(
  ['Data', 'Vendedor', 'Categoria', 'Produto', 'Valor'],
  [
    ['05/07/2026', 'Ana', 'Mercearia', 'Café em grãos', '188,70'],
    ['18/07/2026', 'Bruno', 'Utensílios', 'Moedor', '149,00'],
    ['02/08/2026', 'Ana', 'Mercearia', 'Filtro', '99,00'],
    ['20/08/2026', 'Carla', 'Casa', 'Caneca', '138,00'],
    ['03/09/2026', 'Bruno', 'Mercearia', 'Café em grãos', '125,80'],
    ['15/09/2026', 'Ana', 'Utensílios', 'Moedor', '298,00'],
    ['10/10/2026', 'Carla', 'Mercearia', 'Café em grãos', '62,90'],
    ['22/10/2026', 'Ana', 'Casa', 'Caneca', '69,00']
  ]
)}
<h2>Tarefas</h2>
<ol>
  <li>Confira na tela Tabela se Data ficou como data e Valor como número decimal. Se não, ajuste em Transformar dados.</li>
  <li>Crie a medida <code>Faturamento = SUM(tbVendas[Valor])</code> (botão direito na tabela, Nova medida) e formate como moeda.</li>
  <li>Monte a página: um cartão com o Faturamento; barras com Faturamento por Vendedor; linhas com Faturamento por mês; e uma segmentação por Categoria.</li>
  <li>Clique na barra da Ana e veja os outros visuais reagirem. Depois escolha "Mercearia" na segmentação.</li>
  <li>Ordene as barras do maior para o menor e dê títulos que digam a conclusão.</li>
</ol>
${resposta(`
<ol>
  <li>Se Data veio como texto, em Transformar dados selecione a coluna e Alterar Tipo, Usando Localidade, Data, Português (Brasil).</li>
  <li>Com a medida selecionada, Ferramentas de medida, Formato: Moeda, R$. O cartão mostra <strong>R$ 1.130,40</strong>.</li>
  <li>Para o gráfico de linhas, arraste Data para o Eixo X: o Power BI cria a hierarquia Ano, Trimestre, Mês, Dia. Clique na seta dupla para descer até o mês. Julho: 337,70 · Agosto: 237,00 · Setembro: 423,80 · Outubro: 131,90.</li>
  <li>Com a Ana selecionada: R$ 654,70. Com Mercearia: R$ 476,40.</li>
  <li>Nas reticências do visual, Classificar eixo, Faturamento, Decrescente. Título, por exemplo: "Ana vendeu mais que Bruno e Carla juntos" (654,70 contra 274,80 + 200,90).</li>
</ol>`)}
`,
              quiz: [
                {
                  pergunta: 'Ao arrastar uma data para o eixo X, o Power BI cria o quê?',
                  opcoes: ['Um erro', 'Uma hierarquia Ano, Trimestre, Mês e Dia', 'Uma medida'],
                  certa: 1,
                  explicacao:
                    'É a hierarquia automática de datas; no nível avançado, uma tabela Calendário dá mais controle.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Modelo estrela, relacionamentos, tabela calendário e medidas.',
      modulos: [
        {
          titulo: 'Modelagem',
          itens: [
            {
              id: 'modelo-estrela',
              titulo: 'Modelo estrela e relacionamentos',
              resumo: 'Fatos e dimensões, cardinalidade e direção do filtro.',
              minutos: 13,
              corpo: `
<p>O segredo de um relatório que funciona (e de fórmulas DAX simples) é o <strong>modelo de dados</strong>. O formato recomendado é o <strong>modelo estrela</strong>:</p>
<ul>
  <li><strong>Tabela fato</strong>: os eventos, com números e muitas linhas. Vendas, lançamentos, atendimentos. Cada linha é uma coisa que aconteceu.</li>
  <li><strong>Tabelas dimensão</strong>: as descrições, que respondem "por quê": Produtos, Clientes, Vendedores, Calendário. Uma linha por item, com uma chave única.</li>
</ul>
<p>A fato fica no centro, ligada a cada dimensão: o desenho parece uma estrela.</p>
${trecho(`              dProduto (Código, Produto, Categoria, Preço)
                    │ 1
                    │
dCalendario ──1───* fVendas (Data, Código, CódigoCliente, Qtd, Valor) *───1── dCliente
 (Data, Mês, Ano)                                                          (Código, Nome, Cidade)`)}

<h2>Relacionamentos</h2>
<p>Na tela Modelo, arraste a chave da dimensão até a coluna correspondente na fato. Confira as propriedades (duplo clique na linha):</p>
<ul>
  <li><strong>Cardinalidade um para muitos (1:*)</strong>: um produto aparece em muitas vendas. É o caso normal entre dimensão e fato.</li>
  <li><strong>Direção do filtro única</strong>: o filtro "desce" da dimensão para a fato (escolher a categoria filtra as vendas). Evite a direção "ambas", que cria ambiguidades e deixa o modelo lento.</li>
  <li>Muitos para muitos entre duas tabelas costuma ser sinal de que falta uma dimensão no meio.</li>
</ul>
${dica('Uma tabela gigante com tudo junto (o "tabelão") parece mais simples, mas repete dados, cresce demais e complica as fórmulas. Separe em fato e dimensões no Power Query, mesmo que a origem venha num arquivo só.')}

<h2>A tabela calendário</h2>
<p>Toda análise no tempo precisa de uma dimensão de datas própria, com <strong>todos os dias</strong> do período, sem buracos. Crie em Modelagem, Nova tabela:</p>
${trecho(`dCalendario =
ADDCOLUMNS(
    CALENDAR(DATE(2025, 1, 1), DATE(2026, 12, 31)),
    "Ano", YEAR([Date]),
    "Mês", MONTH([Date]),
    "Nome do mês", FORMAT([Date], "mmm"),
    "Ano-Mês", FORMAT([Date], "yyyy-mm")
)`)}
<p>Depois: relacione <code>dCalendario[Date]</code> com a data da fato, marque como tabela de datas (Ferramentas de tabela, Marcar como tabela de datas) e desligue a "Data/hora automática" em Opções. Ordene "Nome do mês" pela coluna Mês (Ferramentas de coluna, Classificar por coluna), senão abril vem antes de janeiro.</p>
`,
              quiz: [
                {
                  pergunta: 'Num modelo estrela, o que fica na tabela fato?',
                  opcoes: ['Descrições de produtos', 'Os eventos, com os números (vendas, lançamentos)', 'Só datas'],
                  certa: 1,
                  explicacao: 'As dimensões descrevem; a fato registra o que aconteceu.'
                },
                {
                  pergunta: 'Qual a direção de filtro recomendada entre dimensão e fato?',
                  opcoes: ['Ambas', 'Única, da dimensão para a fato', 'Nenhuma'],
                  certa: 1,
                  explicacao: 'Ambas as direções criam caminhos ambíguos e deixam o modelo lento.'
                },
                {
                  pergunta: 'Por que "Nome do mês" precisa ser classificado pela coluna Mês?',
                  opcoes: [
                    'Para traduzir',
                    'Senão os meses aparecem em ordem alfabética (abr, ago, dez...)',
                    'Não precisa'
                  ],
                  certa: 1,
                  explicacao: 'Classificar por coluna usa o número do mês para ordenar o texto.'
                }
              ]
            },
            {
              id: 'medidas-e-interacoes',
              titulo: 'Medidas, interações e detalhes',
              resumo: 'Medidas explícitas, formatação condicional, dicas de ferramenta e detalhamento.',
              minutos: 12,
              corpo: `
<h2>Medidas explícitas</h2>
<p>Arrastar uma coluna numérica para um visual cria uma soma implícita. Funciona, mas é melhor criar <strong>medidas</strong> com nome: elas são reaproveitadas em todos os visuais, têm formato definido e servem de base para outras medidas.</p>
${trecho(`Faturamento = SUM(fVendas[Valor])
Pedidos = DISTINCTCOUNT(fVendas[Pedido])
Ticket médio = DIVIDE([Faturamento], [Pedidos])
Margem % = DIVIDE([Faturamento] - [Custo], [Faturamento])`)}
<p>Guarde as medidas numa tabela própria (Inserir dados, uma tabela vazia chamada <code>_Medidas</code>) para achar fácil. A trilha de <strong>DAX</strong> ensina a escrever as medidas mais avançadas.</p>

<h2>Recursos que deixam o relatório esperto</h2>
<ul>
  <li><strong>Formatação condicional</strong> em tabelas, matrizes e barras: cor de fundo, ícones e barras de dados conforme o valor (por regra ou por uma medida que devolve a cor).</li>
  <li><strong>Dica de ferramenta</strong> (tooltip): o que aparece ao passar o mouse. Dá para criar uma página inteira de dica, com um minigráfico.</li>
  <li><strong>Detalhamento</strong> (<em>drill down</em>): hierarquias no eixo (Categoria, Produto) permitem descer de nível clicando.</li>
  <li><strong>Drill through</strong>: botão direito num ponto e "Detalhar", abrindo uma página de detalhes já filtrada (a ficha de um cliente).</li>
  <li><strong>Indicadores</strong> (<em>bookmarks</em>) e <strong>botões</strong>: alternar entre visões, como "gráfico" e "tabela", ou criar um menu de navegação.</li>
  <li><strong>Editar interações</strong> (guia Formatar): decidir quais visuais um clique filtra.</li>
</ul>
${dica('Teste o relatório como quem vai usar: clique em tudo, tente combinações de filtros estranhas, veja como fica com um vendedor que não vendeu nada no mês. Os bugs de relatório quase sempre estão nessas situações.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a vantagem de uma medida sobre arrastar a coluna e deixar o Power BI somar?',
                  opcoes: [
                    'Nenhuma',
                    'Tem nome e formato, é reaproveitada em todos os visuais e serve de base para outras',
                    'Deixa o arquivo menor'
                  ],
                  certa: 1,
                  explicacao: 'Ticket médio, margem e comparações com o ano anterior são feitos a partir de medidas.'
                },
                {
                  pergunta: 'O que o drill through faz?',
                  opcoes: [
                    'Exporta para Excel',
                    'Abre uma página de detalhes filtrada pelo item clicado',
                    'Atualiza os dados'
                  ],
                  certa: 1,
                  explicacao: 'Ótimo para fichas: um cliente, um produto, um vendedor.'
                },
                {
                  pergunta: 'Por que DIVIDE em vez de / nas medidas?',
                  opcoes: ['É mais rápido', 'Trata a divisão por zero sem erro', 'É obrigatório'],
                  certa: 1,
                  explicacao: 'DIVIDE devolve vazio (ou um valor alternativo) quando o divisor é zero.'
                }
              ]
            },
            {
              id: 'pratica-modelo',
              titulo: 'Prática: do tabelão ao modelo estrela',
              resumo: 'Separe uma tabela única em fato e dimensões e relacione.',
              minutos: 30,
              corpo: `
<p>Use a tabela da prática anterior, acrescentando uma coluna <strong>Código</strong> (CAF01 para Café em grãos, MOE03 para Moedor, FIL04 para Filtro e CAN02 para Caneca) e uma coluna <strong>Custo</strong> com 60% do valor. Ela é um "tabelão": a categoria e o nome do produto se repetem em todas as vendas.</p>
<h2>Tarefas</h2>
<ol>
  <li>No Power Query, a partir de tbVendas, crie (por <strong>Referência</strong>) a dimensão <code>dProduto</code> com Código, Produto e Categoria, sem duplicatas.</li>
  <li>Na fato, remova Produto e Categoria, deixando Data, Vendedor, Código, Valor e Custo. Renomeie para <code>fVendas</code>.</li>
  <li>Crie a tabela <code>dCalendario</code> em DAX, relacione e marque como tabela de datas.</li>
  <li>Relacione <code>dProduto[Código]</code> 1:* <code>fVendas[Código]</code>.</li>
  <li>Crie as medidas Faturamento, Custo total e Margem % e monte uma matriz com Categoria nas linhas e Nome do mês nas colunas.</li>
</ol>
${resposta(`
<ol>
  <li>Botão direito em tbVendas, Referência. Na nova consulta: selecione Código, Produto e Categoria, Remover Outras Colunas, e então Remover Duplicatas. Renomeie para dProduto: 4 linhas.</li>
  <li>Atenção: uma Referência parte do <em>resultado final</em> da consulta de origem. Se você remover Produto e Categoria da própria tbVendas, a dProduto perde essas colunas e quebra. O caminho seguro: deixe <code>tbVendas</code> como consulta base (botão direito, desmarque Habilitar Carregamento) e crie <strong>duas</strong> referências a partir dela, uma para dProduto e outra para fVendas, onde você remove Produto e Categoria.</li>
  <li>Use a fórmula de dCalendario da aula. Na tela Modelo, ligue dCalendario[Date] a fVendas[Data].</li>
  <li>Arraste dProduto[Código] até fVendas[Código]: o Power BI detecta um para muitos, filtro único.</li>
  <li><code>Faturamento = SUM(fVendas[Valor])</code>, <code>Custo total = SUM(fVendas[Custo])</code>, <code>Margem % = DIVIDE([Faturamento] - [Custo total], [Faturamento])</code> (formato porcentagem: 40% em todas as linhas, porque o custo é 60% do valor). Matriz: Categoria (de dProduto) nas linhas e Nome do mês (de dCalendario) nas colunas, classificado pelo Mês.</li>
</ol>`)}
`,
              quiz: [
                {
                  pergunta: 'De qual tabela deve vir a Categoria na matriz?',
                  opcoes: ['De fVendas', 'De dProduto', 'Tanto faz'],
                  certa: 1,
                  explicacao: 'Campos de descrição vêm das dimensões; a fato só tem as chaves e os números.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Publicar, atualizar, segurança por linha, desempenho e versionamento.',
      modulos: [
        {
          titulo: 'Em produção',
          itens: [
            {
              id: 'publicar-e-compartilhar',
              titulo: 'Publicar, atualizar e compartilhar',
              resumo: 'Workspaces, atualização agendada, gateway, aplicativos e segurança por linha.',
              minutos: 13,
              corpo: `
<h2>Publicar</h2>
<p>No Desktop, Página Inicial, <strong>Publicar</strong>, e escolha um <strong>workspace</strong> (espaço de trabalho). No Serviço, o arquivo vira duas coisas: o <strong>modelo semântico</strong> (os dados e as medidas) e o <strong>relatório</strong> (as páginas). Vários relatórios podem usar o mesmo modelo.</p>

<h2>Atualização automática</h2>
<ul>
  <li>Nas configurações do modelo semântico, informe as credenciais das fontes e agende a <strong>atualização</strong> (até 8 vezes por dia com licença Pro).</li>
  <li>Fontes na nuvem (SharePoint, OneDrive, bancos na nuvem) atualizam direto.</li>
  <li>Fontes no seu computador ou na rede da empresa (um Excel em <code>C:\\</code>, um SQL Server local) precisam de um <strong>gateway</strong>: um programa instalado numa máquina sempre ligada, que faz a ponte. Guardar a planilha no OneDrive ou SharePoint costuma ser o caminho mais simples.</li>
</ul>

<h2>Compartilhar</h2>
<ul>
  <li><strong>Workspace</strong>: para quem constrói (funções Administrador, Membro, Colaborador, Visualizador).</li>
  <li><strong>Aplicativo</strong>: o jeito certo de entregar para quem só consome. Junta os relatórios num pacote com menu, e você atualiza sem mexer no acesso das pessoas.</li>
  <li><strong>Publicar na web</strong> deixa o relatório público para qualquer pessoa com o link, sem login. Nunca use com dados internos ou pessoais.</li>
</ul>

<h2>Segurança em nível de linha (RLS)</h2>
<p>Cada vendedor vê só as próprias vendas, no mesmo relatório. Em Modelagem, <strong>Gerenciar funções</strong>, crie uma função com um filtro DAX:</p>
${trecho(`// Função "Vendedor", aplicada à tabela dVendedor
[E-mail] = USERPRINCIPALNAME()`)}
<p>O filtro desce pelos relacionamentos até a fato. No Serviço, em Segurança do modelo semântico, adicione as pessoas à função. Teste antes com "Exibir como" no Desktop.</p>
${dica('RLS filtra os dados, mas quem tem permissão de Membro ou Administrador no workspace vê tudo. Dê às pessoas o acesso pelo aplicativo, com permissão de leitura.')}
`,
              quiz: [
                {
                  pergunta:
                    'O relatório usa um Excel numa pasta do seu computador. O que é preciso para atualizar no Serviço?',
                  opcoes: ['Nada', 'Um gateway (ou mover o arquivo para OneDrive/SharePoint)', 'Licença Premium'],
                  certa: 1,
                  explicacao: 'O Serviço, na nuvem, não enxerga o seu disco; o gateway faz a ponte.'
                },
                {
                  pergunta: 'Como fazer cada vendedor ver só as próprias vendas?',
                  opcoes: [
                    'Um relatório para cada um',
                    'Segurança em nível de linha (RLS) com USERPRINCIPALNAME()',
                    'Filtros na página'
                  ],
                  certa: 1,
                  explicacao: 'Um relatório só, e o filtro é aplicado conforme quem está logado.'
                },
                {
                  pergunta: 'Quando usar "Publicar na web"?',
                  opcoes: [
                    'Para compartilhar com a diretoria',
                    'Só com dados que podem ser públicos: qualquer um com o link vê, sem login',
                    'Sempre'
                  ],
                  certa: 1,
                  explicacao: 'É um link público. Para uso interno, use aplicativos e permissões.'
                }
              ]
            },
            {
              id: 'desempenho-e-versionamento',
              titulo: 'Desempenho e versionamento',
              resumo: 'Analisador de desempenho, modelo enxuto e o formato PBIP com Git.',
              minutos: 12,
              corpo: `
<h2>Relatório lento?</h2>
<p>Em Exibir, <strong>Analisador de desempenho</strong>, clique em Iniciar gravação e Atualizar visuais. Ele mostra quanto cada visual levou na consulta DAX, no desenho e em "Outros" (esperando os outros visuais). Os culpados de sempre:</p>
<ul>
  <li><strong>Colunas demais</strong>: cada coluna carregada ocupa memória. Remova no Power Query tudo o que não é usado, principalmente textos longos e colunas de ID que não ligam nada.</li>
  <li><strong>Cardinalidade alta</strong>: uma coluna de data e hora com segundos tem milhões de valores diferentes. Separe data e hora, ou arredonde.</li>
  <li><strong>Colunas calculadas</strong> onde caberia uma medida, e medidas com iteradores sobre tabelas enormes.</li>
  <li><strong>Relacionamentos em ambas as direções</strong> e visuais demais numa página (cada um é uma consulta).</li>
</ul>
${dica('O DAX Studio e o Tabular Editor, ferramentas externas gratuitas que aparecem na guia Ferramentas Externas, mostram quanto cada coluna ocupa e o plano de cada consulta. São o próximo passo para quem leva desempenho a sério.')}

<h2>PBIP: o relatório no Git</h2>
<p>O arquivo <code>.pbix</code> é binário: o Git não mostra o que mudou e duas pessoas não conseguem trabalhar juntas. O formato <strong>PBIP</strong> (Arquivo, Salvar como, Projeto do Power BI) salva o relatório como uma pasta de arquivos de texto:</p>
${trecho(`Vendas.pbip
Vendas.SemanticModel/
  definition/              ← tabelas, medidas e relacionamentos em TMDL (texto)
Vendas.Report/
  definition/pages/...     ← cada página e cada visual em JSON
.gitignore                 ← já vem pronto: deixa de fora o cache com os dados`)}
<ul>
  <li>O Git mostra exatamente qual medida ou visual mudou em cada commit.</li>
  <li>Dá para revisar mudanças num pull request, como código.</li>
  <li>Dá até para gerar relatórios por script: os painéis de exemplo deste portfólio foram criados assim, por código.</li>
</ul>

<h2>Ambientes</h2>
<p>Em equipes, o relatório passa por etapas antes de chegar a quem usa: um workspace de desenvolvimento, um de teste e o de produção, com <strong>pipelines de implantação</strong> movendo de um para o outro e parâmetros trocando a fonte de dados em cada etapa.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual ferramenta do Desktop mostra quanto cada visual demora?',
                  opcoes: ['Exibir como', 'Analisador de desempenho', 'Gerenciar funções'],
                  certa: 1,
                  explicacao: 'Ele separa o tempo da consulta DAX, do desenho e da espera.'
                },
                {
                  pergunta: 'Por que uma coluna de data e hora com segundos deixa o modelo pesado?',
                  opcoes: [
                    'Datas são grandes',
                    'Ela tem muitos valores diferentes (alta cardinalidade), que comprimem mal',
                    'Não deixa'
                  ],
                  certa: 1,
                  explicacao: 'O motor comprime melhor colunas com poucos valores distintos.'
                },
                {
                  pergunta: 'Qual a vantagem do formato PBIP?',
                  opcoes: [
                    'Abre mais rápido',
                    'Salva o relatório como arquivos de texto, que o Git consegue comparar e juntar',
                    'Funciona no Mac'
                  ],
                  certa: 1,
                  explicacao: 'O .pbix é binário; o PBIP permite versionar e revisar como código.'
                }
              ]
            },
            {
              id: 'pratica-relatorio-completo',
              titulo: 'Prática: relatório para a diretoria',
              resumo: 'Um relatório de duas páginas, com navegação, detalhes e segurança.',
              minutos: 40,
              corpo: `
<p>Use o modelo estrela da prática anterior (ou baixe um dos <a href="../../projetos/painel-empresas/">painéis financeiros deste portfólio</a> como base). Monte um relatório que você mostraria numa entrevista.</p>
<h2>Tarefas</h2>
<ol>
  <li><strong>Página Resumo</strong>: cartões com Faturamento, Margem % e Ticket médio; linha com o faturamento por mês; barras por categoria; segmentação por período.</li>
  <li><strong>Página Vendedor</strong>, configurada como página de <strong>drill through</strong> pelo campo Vendedor, com os números e uma tabela das vendas dele.</li>
  <li>Um <strong>menu</strong> com botões para ir de uma página à outra.</li>
  <li>Uma função de <strong>RLS</strong> que deixa cada vendedor ver só as próprias vendas, testada com "Exibir como".</li>
  <li>Salve como <strong>PBIP</strong> e faça um commit num repositório Git.</li>
</ol>
${resposta(`
<ol>
  <li>Ticket médio precisa de uma contagem de vendas: <code>Vendas = COUNTROWS(fVendas)</code> e <code>Ticket médio = DIVIDE([Faturamento], [Vendas])</code>. A segmentação de período usa <code>dCalendario[Date]</code>, no estilo "Entre".</li>
  <li>Na página Vendedor, no painel Visualizações, arraste Vendedor para "Detalhamento" (drill through). O Power BI cria o botão Voltar sozinho. Na página Resumo, botão direito numa barra de vendedor, Detalhar.</li>
  <li>Inserir, Botões, Navegador de páginas: cria um menu com todas as páginas, que se atualiza sozinho.</li>
  <li>Crie a dimensão dVendedor (Vendedor, E-mail), relacione 1:* com fVendas, e em Gerenciar funções: tabela dVendedor, filtro <code>[E-mail] = USERPRINCIPALNAME()</code>. Em "Exibir como", marque a função e informe outro usuário: o e-mail da Ana mostra só as vendas da Ana.</li>
  <li>Arquivo, Salvar como, tipo Projeto do Power BI (.pbip). Na pasta: <code>git init</code>, <code>git add .</code>, <code>git commit -m "Relatório de vendas"</code>. O .gitignore criado pelo Power BI já deixa de fora o cache com os dados.</li>
</ol>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve a página de drill through?',
                  opcoes: [
                    'Exportar dados',
                    'Mostrar os detalhes de um item já filtrado, vindo do clique em outra página',
                    'Fazer login'
                  ],
                  certa: 1,
                  explicacao: 'O campo em "Detalhamento" define o que é levado como filtro.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
