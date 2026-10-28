// Trilha de LGPD (Lei 13.709/2018) para quem desenvolve: o que a lei pede e como isso vira decisão de código.
// Sem editor. Não é aconselhamento jurídico: o texto da lei e as resoluções da ANPD mudam e devem ser consultados
// na fonte (planalto.gov.br e gov.br/anpd). Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta, tabela } = require('./ajuda');

const AVISO =
  '<p><small>Esta trilha explica a lei do ponto de vista de quem desenvolve e não substitui orientação jurídica. Confira sempre o texto da lei (planalto.gov.br) e as resoluções da ANPD (gov.br/anpd), que são atualizadas.</small></p>';

module.exports = {
  id: 'lgpd',
  area: 'Qualidade e entrega',
  titulo: 'LGPD',
  sigla: 'LGPD',
  resumo: 'Dados pessoais no código: coletar o mínimo, guardar com segurança e respeitar quem é dono deles.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'O que a lei protege, quem é quem e quando é permitido tratar dados.',
      modulos: [
        {
          titulo: 'Fundamentos',
          itens: [
            {
              id: 'o-que-e-lgpd',
              titulo: 'O que é a LGPD',
              resumo: 'Dado pessoal, dado sensível, titular, controlador, operador e ANPD.',
              minutos: 9,
              corpo: `
<p>A <strong>Lei Geral de Proteção de Dados Pessoais</strong> (Lei 13.709/2018, a LGPD) regula como empresas, governos e pessoas tratam dados de pessoas físicas no Brasil, online e offline. Ela está em vigor desde 2020, e as sanções, desde agosto de 2021. Quem fiscaliza é a <strong>ANPD</strong>, a Autoridade Nacional de Proteção de Dados.</p>
<p>Para quem programa, ela importa porque quase todo sistema guarda dados pessoais: um formulário de contato, um cadastro, um log de acesso, uma planilha de clientes.</p>

<h2>As definições que importam</h2>
<ul>
  <li><strong>Dado pessoal</strong>: qualquer informação sobre uma pessoa identificada <em>ou identificável</em>. Nome, CPF e e-mail, mas também endereço IP, localização, placa do carro, um ID de cookie ligado a alguém.</li>
  <li><strong>Dado pessoal sensível</strong>: origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou organização religiosa, filosófica ou política, dado sobre saúde ou vida sexual, dado genético ou biométrico. Tem regras mais rígidas.</li>
  <li><strong>Tratamento</strong>: qualquer operação com o dado. Coletar, guardar, consultar, compartilhar, apagar... até só armazenar já é tratamento.</li>
  <li><strong>Titular</strong>: a pessoa a quem o dado se refere.</li>
  <li><strong>Controlador</strong>: quem decide o que fazer com os dados (a loja que tem o cadastro dos clientes).</li>
  <li><strong>Operador</strong>: quem trata em nome do controlador (a empresa de hospedagem, o serviço de e-mail marketing, você como desenvolvedor contratado).</li>
  <li><strong>Encarregado</strong> (o DPO): a pessoa que é o canal entre a empresa, os titulares e a ANPD.</li>
</ul>
${dica('Dado <strong>anonimizado</strong> (que não permite mais identificar ninguém, por meios razoáveis) deixa de ser dado pessoal. Dado <strong>pseudonimizado</strong> (o nome trocado por um código, mas com a tabela de correspondência guardada em algum lugar) continua sendo.')}

<h2>Os princípios</h2>
<p>O artigo 6º lista os princípios. Os que mais viram decisão técnica:</p>
<ul>
  <li><strong>Finalidade</strong>: tratar só para propósitos legítimos e informados.</li>
  <li><strong>Necessidade</strong>: coletar o mínimo necessário para aquela finalidade.</li>
  <li><strong>Transparência</strong>: informar de forma clara o que é feito.</li>
  <li><strong>Segurança</strong> e <strong>prevenção</strong>: proteger contra acessos indevidos e vazamentos.</li>
  <li><strong>Responsabilização</strong>: conseguir demonstrar que cumpre a lei (documentação, registros).</li>
</ul>
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'O endereço IP de quem acessa o site é dado pessoal?',
                  opcoes: ['Nunca', 'Pode ser: ele pode ajudar a identificar uma pessoa', 'Só se for estático'],
                  certa: 1,
                  explicacao: 'Dado pessoal inclui informação sobre pessoa identificável, não só identificada.'
                },
                {
                  pergunta: 'Qual destes é dado sensível pela LGPD?',
                  opcoes: ['E-mail', 'Informação de saúde', 'Endereço'],
                  certa: 1,
                  explicacao: 'Saúde, biometria, religião, opinião política, origem racial, entre outros.'
                },
                {
                  pergunta:
                    'A loja decide os dados do cadastro; o serviço de e-mail envia as campanhas dela. A loja é:',
                  opcoes: ['Operadora', 'Controladora', 'Titular'],
                  certa: 1,
                  explicacao: 'Quem decide é o controlador; o serviço de e-mail, que trata em nome dela, é o operador.'
                }
              ]
            },
            {
              id: 'bases-legais',
              titulo: 'Bases legais',
              resumo: 'Consentimento não é a única: as hipóteses que permitem tratar dados.',
              minutos: 11,
              corpo: `
<p>Todo tratamento de dados pessoais precisa de uma <strong>base legal</strong>, uma das hipóteses do artigo 7º. Um erro comum é achar que tudo depende de consentimento. Não depende. As bases são:</p>
<ol>
  <li><strong>Consentimento</strong> do titular.</li>
  <li><strong>Cumprimento de obrigação legal ou regulatória</strong> (guardar notas fiscais, por exemplo).</li>
  <li>Execução de <strong>políticas públicas</strong>, pela administração pública.</li>
  <li>Realização de <strong>estudos por órgão de pesquisa</strong>.</li>
  <li><strong>Execução de contrato</strong> (ou de procedimentos preliminares a ele) do qual o titular faz parte: o endereço para entregar a compra.</li>
  <li><strong>Exercício regular de direitos</strong> em processo judicial, administrativo ou arbitral.</li>
  <li><strong>Proteção da vida</strong> ou da integridade física.</li>
  <li><strong>Tutela da saúde</strong>, por profissionais e serviços de saúde.</li>
  <li><strong>Legítimo interesse</strong> do controlador ou de terceiro, desde que não prevaleçam os direitos do titular.</li>
  <li><strong>Proteção do crédito</strong>.</li>
</ol>
<p>Dados sensíveis têm uma lista própria e mais restrita (artigo 11): legítimo interesse, por exemplo, não vale para eles.</p>

<h2>Consentimento do jeito certo</h2>
<p>Quando a base for o consentimento, ele precisa ser <strong>livre, informado e inequívoco</strong>, para finalidades determinadas. Na prática:</p>
<ul>
  <li>Caixa de seleção <strong>desmarcada</strong> por padrão. Marcada de fábrica não é consentimento.</li>
  <li>Um consentimento <strong>por finalidade</strong>: aceitar receber a newsletter é uma coisa; compartilhar com parceiros é outra.</li>
  <li>Não condicionar o serviço a um consentimento que ele não precisa ("para comprar, aceite receber promoções").</li>
  <li>Revogar tem que ser tão fácil quanto aceitar, e você precisa conseguir <strong>provar</strong> que o consentimento foi dado (quando, para quê, com qual texto).</li>
</ul>
${trecho(`<!-- Errado: marcado por padrão e misturando finalidades -->
<label><input type="checkbox" checked> Aceito os termos, a política de privacidade e receber ofertas de parceiros</label>

<!-- Certo: termos à parte, e cada finalidade opcional com a própria caixa desmarcada -->
<p>Ao criar a conta, você concorda com os <a href="/termos">Termos de uso</a>. Veja como tratamos seus dados na <a href="/privacidade">Política de privacidade</a>.</p>
<label><input type="checkbox" name="newsletter"> Quero receber a newsletter semanal por e-mail</label>`)}
${dica('Antes de pedir consentimento, pergunte se outra base cabe melhor. Para entregar o pedido, a base é a execução do contrato: pedir consentimento para isso confunde, e se a pessoa "revogar", você ainda precisa entregar.')}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Para usar o endereço do cliente na entrega da compra, a base legal mais adequada é:',
                  opcoes: ['Consentimento', 'Execução de contrato', 'Proteção do crédito'],
                  certa: 1,
                  explicacao: 'O dado é necessário para cumprir o contrato de compra e venda.'
                },
                {
                  pergunta: 'Uma caixa "Aceito receber ofertas" marcada por padrão vale como consentimento?',
                  opcoes: [
                    'Sim',
                    'Não: o consentimento precisa ser uma ação livre e inequívoca da pessoa',
                    'Só para maiores de 18'
                  ],
                  certa: 1,
                  explicacao: 'A pessoa precisa marcar; deixar marcado de fábrica não é manifestação dela.'
                },
                {
                  pergunta: 'Legítimo interesse pode ser usado para dados sensíveis?',
                  opcoes: [
                    'Sim',
                    'Não: dados sensíveis têm uma lista própria de bases, sem o legítimo interesse',
                    'Só com DPO'
                  ],
                  certa: 1,
                  explicacao: 'O artigo 11 é mais restrito que o artigo 7º.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Direitos dos titulares e privacidade desde a concepção.',
      modulos: [
        {
          titulo: 'LGPD no código',
          itens: [
            {
              id: 'direitos-dos-titulares',
              titulo: 'Direitos dos titulares',
              resumo: 'Acesso, correção, eliminação, portabilidade, e o que o sistema precisa ter para atender.',
              minutos: 11,
              corpo: `
<p>O artigo 18 dá ao titular o direito de pedir ao controlador, a qualquer momento:</p>
<ul>
  <li><strong>Confirmação</strong> de que há tratamento dos seus dados, e <strong>acesso</strong> a eles.</li>
  <li><strong>Correção</strong> de dados incompletos, inexatos ou desatualizados.</li>
  <li><strong>Anonimização, bloqueio ou eliminação</strong> de dados desnecessários, excessivos ou tratados em desacordo com a lei.</li>
  <li><strong>Portabilidade</strong> dos dados a outro fornecedor.</li>
  <li><strong>Eliminação</strong> dos dados tratados com base no consentimento (com exceções, como obrigações legais de guarda).</li>
  <li><strong>Informação</strong> sobre com quem os dados foram compartilhados e sobre a possibilidade de não consentir e suas consequências.</li>
  <li><strong>Revogação</strong> do consentimento.</li>
</ul>
<p>O artigo 20 acrescenta o direito de pedir <strong>revisão de decisões tomadas só por meios automatizados</strong> que afetem os interesses da pessoa (uma análise de crédito feita por algoritmo, por exemplo). E o acesso deve ser atendido de forma simplificada imediatamente, ou com uma declaração completa em até 15 dias (artigo 19).</p>

<h2>O que isso pede do sistema</h2>
<ul>
  <li><strong>Saber onde estão os dados</strong> de cada pessoa: banco, planilhas, logs, ferramentas de terceiros, backups. Sem um inventário, não dá para atender ninguém.</li>
  <li>Uma tela "Meus dados" ou uma exportação (JSON, CSV) com tudo o que se refere à pessoa.</li>
  <li>Uma exclusão de conta de verdade, que apague ou anonimize em todos os lugares, e não só marque <code>ativo = 0</code>.</li>
  <li>Registro do que foi pedido, quando e como foi atendido.</li>
</ul>
${trecho(`// Exclusão de conta: apaga o que pode, anonimiza o que precisa ficar (notas fiscais, por obrigação legal)
async function excluirConta(usuarioId) {
  await db.transacao(async t => {
    await t.apagar('enderecos', { usuarioId });
    await t.apagar('preferencias', { usuarioId });
    await t.atualizar('pedidos', { usuarioId }, { nome: 'Titular removido', email: null, telefone: null });
    await t.apagar('usuarios', { id: usuarioId });
    await t.inserir('registro_lgpd', { tipo: 'exclusao', usuarioId, quando: new Date() });
  });
  await servicoDeEmail.removerContato(usuarioId);   // e nos operadores também
}`)}
${dica('Pense em quanto tempo cada dado precisa existir e apague automaticamente quando o prazo acabar (logs de acesso, carrinhos abandonados, cadastros nunca confirmados). Dado que não existe não vaza.')}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Marcar ativo = 0 no cadastro atende a um pedido de eliminação?',
                  opcoes: [
                    'Sim',
                    'Não: os dados continuam lá; é preciso apagar ou anonimizar',
                    'Só se o login for bloqueado'
                  ],
                  certa: 1,
                  explicacao: 'Esconder não é eliminar. E os operadores (e-mail, CRM) também precisam ser avisados.'
                },
                {
                  pergunta: 'O que é preciso antes de conseguir atender pedidos de acesso?',
                  opcoes: [
                    'Um advogado',
                    'Saber onde estão os dados de cada pessoa (um inventário)',
                    'Um certificado SSL'
                  ],
                  certa: 1,
                  explicacao: 'Banco, planilhas, logs, ferramentas de terceiros e backups.'
                },
                {
                  pergunta: 'Um sistema nega crédito só por um algoritmo. O que a pessoa pode pedir?',
                  opcoes: ['Nada', 'A revisão da decisão automatizada', 'A portabilidade do algoritmo'],
                  certa: 1,
                  explicacao: 'É o direito do artigo 20.'
                }
              ]
            },
            {
              id: 'privacidade-desde-a-concepcao',
              titulo: 'Privacidade desde a concepção',
              resumo: 'Minimização, cookies, formulários, logs e terceiros: decisões do dia a dia.',
              minutos: 12,
              corpo: `
<p><strong>Privacidade desde a concepção</strong> (<em>privacy by design</em>) é pensar nos dados pessoais quando o sistema está sendo desenhado, e não depois do vazamento. No dia a dia, é uma lista de pequenas decisões:</p>

<h2>Coletar menos</h2>
<ul>
  <li>Para cada campo do formulário, pergunte: para que eu preciso disto? Data de nascimento para mandar parabéns? Talvez só o mês. CPF para newsletter? Não.</li>
  <li>Prefira campos opcionais e explique por que algo é pedido ("Telefone, para o entregador avisar quando chegar").</li>
  <li>Não guarde o que não precisa guardar: o número completo do cartão fica com o processador de pagamento, não no seu banco.</li>
</ul>

<h2>Cookies e rastreamento</h2>
<p>Cookies essenciais (manter o login, o carrinho) não dependem de consentimento. Os de <strong>analytics e publicidade</strong> de terceiros, em geral, sim: carregue esses scripts <strong>só depois</strong> do aceite, e deixe recusar tão fácil quanto aceitar. A ANPD publicou um guia orientativo sobre cookies que vale a leitura. Uma alternativa é usar ferramentas de estatística sem cookies e sem dado pessoal (este site usa uma assim).</p>

<h2>Logs e ferramentas</h2>
<ul>
  <li>Não registre senhas, tokens, números de documento ou o corpo inteiro das requisições nos logs. Mascare: <code>a***@gmail.com</code>.</li>
  <li>Defina por quanto tempo os logs ficam guardados.</li>
  <li>Ambientes de teste com <strong>dados fictícios</strong>, nunca uma cópia do banco de produção.</li>
  <li>Cada ferramenta de terceiro (e-mail, CRM, hospedagem, IA) é um operador: veja onde ela guarda os dados (transferência internacional também tem regras) e o que o contrato diz.</li>
</ul>
${trecho(`function mascararEmail(email) {
  const [usuario, dominio] = email.split('@');
  return usuario[0] + '***@' + dominio;
}

logger.info('Login', { usuario: mascararEmail(email), ip: ipTruncado(req.ip) });   // sem senha, sem token`)}

<h2>Aviso de privacidade</h2>
<p>A política de privacidade explica, em linguagem simples: quais dados, para quê, com qual base legal, com quem são compartilhados, por quanto tempo ficam, como exercer os direitos e quem é o encarregado (com um contato). Ela precisa refletir o que o sistema <strong>realmente</strong> faz: copiar de outro site é pior que não ter.</p>
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Quando carregar o script de analytics de terceiros que usa cookies?',
                  opcoes: ['Sempre, ao abrir a página', 'Depois que a pessoa aceitar esses cookies', 'Nunca'],
                  certa: 1,
                  explicacao: 'Carregar antes do aceite já coleta os dados, e o banner vira enfeite.'
                },
                {
                  pergunta: 'Qual a forma correta de testar com dados?',
                  opcoes: [
                    'Uma cópia do banco de produção',
                    'Dados fictícios gerados para o teste',
                    'Os dados da própria equipe'
                  ],
                  certa: 1,
                  explicacao: 'Ambientes de teste costumam ser menos protegidos que a produção.'
                },
                {
                  pergunta: 'O que não deve ir para um log?',
                  opcoes: ['A data do acesso', 'Senhas, tokens e documentos completos', 'O status da resposta'],
                  certa: 1,
                  explicacao: 'Logs são lidos por muita gente e guardados por muito tempo.'
                }
              ]
            },
            {
              id: 'pratica-auditar-formulario',
              titulo: 'Prática: auditar um cadastro',
              resumo: 'Encontre os problemas de LGPD num formulário e proponha correções.',
              minutos: 20,
              corpo: `
<p>Uma academia pediu para você revisar o formulário de cadastro do site antes de publicar. Este é o HTML:</p>
${trecho(`<form action="/cadastro" method="post">
  <input name="nome" placeholder="Nome completo" required>
  <input name="cpf" placeholder="CPF" required>
  <input name="email" type="email" placeholder="E-mail" required>
  <input name="nascimento" type="date" required>
  <select name="religiao" required>
    <option>Católica</option><option>Evangélica</option><option>Espírita</option><option>Outra</option>
  </select>
  <textarea name="saude" placeholder="Problemas de saúde, cirurgias, medicamentos"></textarea>
  <label><input type="checkbox" checked name="ofertas"> Aceito os termos e receber ofertas da academia e de parceiros</label>
  <button>Cadastrar</button>
</form>
<script src="https://exemplo-analytics.com/pixel.js"></script>
<!-- O back-end grava tudo em texto puro e envia o formulário inteiro por e-mail para a recepção -->`)}
<h2>Tarefas</h2>
<p>Liste pelo menos <strong>seis</strong> problemas e, para cada um, a correção.</p>
${resposta(`
<ol>
  <li><strong>Religião</strong>: dado sensível sem nenhuma relação com a finalidade (matrícula numa academia). Remova o campo.</li>
  <li><strong>Saúde</strong>: também é sensível. Pode ser justificável para a segurança nos treinos, mas então precisa de base legal adequada do artigo 11 (como consentimento específico e destacado), ser opcional ou direcionado ao profissional responsável, com acesso restrito, e não ir por e-mail.</li>
  <li><strong>CPF obrigatório</strong>: só se houver necessidade real (emissão de nota, contrato). Se precisar, explique o motivo ao lado do campo.</li>
  <li><strong>Data de nascimento completa obrigatória</strong>: se é para conferir idade mínima, uma confirmação de maioridade ou só o ano podem bastar (minimização).</li>
  <li><strong>Caixa marcada por padrão e misturando finalidades</strong>: separe os termos (que não são consentimento) da newsletter da academia e do compartilhamento com parceiros, cada um com sua caixa <em>desmarcada</em> e opcional.</li>
  <li><strong>Pixel de analytics carregando direto</strong>: só depois do consentimento de cookies, ou troque por uma ferramenta sem cookies.</li>
  <li><strong>Sem aviso de privacidade</strong>: inclua um link para a política, explicando para que cada dado é usado e como exercer os direitos.</li>
  <li><strong>Texto puro e e-mail com tudo</strong>: dados em trânsito e em repouso precisam de proteção. Grave no banco com acesso restrito (dados de saúde, de preferência cifrados), e avise a recepção com um link para o sistema, sem os dados no corpo do e-mail.</li>
  <li>Bônus: <code>placeholder</code> no lugar de <code>&lt;label&gt;</code> é problema de acessibilidade, que aparece na trilha de HTML.</li>
</ol>`)}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Por que o campo de religião é o problema mais grave do formulário?',
                  opcoes: [
                    'Ocupa espaço',
                    'É dado sensível sem relação nenhuma com a finalidade do cadastro',
                    'Deveria ser texto livre'
                  ],
                  certa: 1,
                  explicacao:
                    'Fere os princípios da finalidade e da necessidade, com um dado que tem proteção especial.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Segurança, incidentes, documentação e o papel do encarregado.',
      modulos: [
        {
          titulo: 'Segurança e governança',
          itens: [
            {
              id: 'seguranca-e-incidentes',
              titulo: 'Segurança e incidentes',
              resumo: 'Medidas técnicas, o que fazer num vazamento e as sanções.',
              minutos: 13,
              corpo: `
<p>O artigo 46 exige <strong>medidas de segurança, técnicas e administrativas</strong>, aptas a proteger os dados de acessos não autorizados e de situações acidentais ou ilícitas. A lei não lista tecnologias; o que se espera é o razoável para o tipo de dado e o tamanho do risco.</p>

<h2>O básico que se espera</h2>
<ul>
  <li><strong>HTTPS</strong> em tudo.</li>
  <li>Senhas com <strong>hash lento e sal</strong> (bcrypt, scrypt, argon2), nunca em texto ou com MD5.</li>
  <li><strong>Controle de acesso</strong>: cada pessoa da equipe vê só o que precisa. Contas individuais, nada de senha compartilhada do banco. <strong>Autenticação em dois fatores</strong> nos painéis administrativos.</li>
  <li>Dados sensíveis <strong>cifrados</strong> no banco e nos backups.</li>
  <li>Dependências atualizadas, consultas parametrizadas (contra injeção de SQL), validação de entradas.</li>
  <li><strong>Registros de acesso</strong> a dados pessoais (quem viu o quê, quando), para investigar incidentes.</li>
  <li>Backups testados, e um plano para quando algo der errado.</li>
</ul>

<h2>Incidente de segurança</h2>
<p>Um vazamento, um acesso indevido, um notebook com dados roubado, um ransomware. Quando o incidente puder acarretar <strong>risco ou dano relevante</strong> aos titulares, o controlador deve comunicar a ANPD e os titulares afetados (artigo 48). O Regulamento de Comunicação de Incidentes da ANPD (Resolução CD/ANPD nº 15/2024) fixa o prazo de <strong>3 dias úteis</strong> a partir do conhecimento do incidente, com informações como a natureza dos dados, os titulares afetados, os riscos e as medidas tomadas.</p>
<ol>
  <li>Conter: trocar senhas e chaves, fechar a brecha, isolar o sistema.</li>
  <li>Entender: o que vazou, de quem, desde quando (os registros de acesso são essenciais aqui).</li>
  <li>Comunicar no prazo, com honestidade e orientações práticas para os titulares.</li>
  <li>Registrar tudo e corrigir a causa.</li>
</ol>

<h2>Sanções</h2>
<p>A ANPD pode aplicar, entre outras: advertência, <strong>multa simples de até 2% do faturamento</strong> no Brasil, limitada a <strong>R$ 50 milhões por infração</strong>, multa diária, publicização da infração, bloqueio ou eliminação dos dados e suspensão do tratamento (artigo 52). Além disso, titulares podem buscar indenização na Justiça, e o dano de reputação de um vazamento costuma pesar mais que a multa.</p>
${dica('Agentes de tratamento de pequeno porte (microempresas, startups, pessoas físicas que tratam dados com fins econômicos) têm regras simplificadas na Resolução CD/ANPD nº 2/2022, como prazos em dobro em alguns casos. Mas segurança e respeito aos direitos continuam valendo.')}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Qual o prazo para comunicar um incidente relevante à ANPD, pelo regulamento de 2024?',
                  opcoes: ['30 dias', '3 dias úteis', '1 ano'],
                  certa: 1,
                  explicacao: 'Conta a partir de quando o controlador toma conhecimento do incidente.'
                },
                {
                  pergunta: 'Qual o limite da multa simples por infração?',
                  opcoes: ['R$ 50 mil', '2% do faturamento no Brasil, até R$ 50 milhões', '10% do faturamento global'],
                  certa: 1,
                  explicacao: 'Além de outras sanções, como bloqueio e eliminação dos dados.'
                },
                {
                  pergunta: 'Qual a forma adequada de guardar senhas de usuários?',
                  opcoes: ['Texto puro', 'MD5', 'Hash lento com sal (bcrypt, scrypt, argon2)'],
                  certa: 2,
                  explicacao: 'MD5 e SHA simples são rápidos demais e quebram facilmente.'
                }
              ]
            },
            {
              id: 'governanca',
              titulo: 'Encarregado, registros e relatório de impacto',
              resumo: 'Inventário de dados, RIPD, encarregado e contratos com operadores.',
              minutos: 11,
              corpo: `
<h2>Registro das operações</h2>
<p>Controlador e operador devem manter <strong>registro das operações de tratamento</strong> (artigo 37). Na prática, é uma planilha (ou sistema) com cada processo que usa dados pessoais:</p>
<ul>
  <li>Processo (cadastro de clientes, folha de pagamento, newsletter).</li>
  <li>Dados tratados e categoria dos titulares.</li>
  <li>Finalidade e base legal.</li>
  <li>Onde ficam, com quem são compartilhados e se vão para fora do país.</li>
  <li>Prazo de guarda e medidas de segurança.</li>
</ul>
<p>Esse inventário é a base de tudo: atender direitos, responder a incidentes, escrever a política de privacidade.</p>

<h2>Relatório de impacto (RIPD)</h2>
<p>O <strong>Relatório de Impacto à Proteção de Dados Pessoais</strong> descreve os tratamentos que podem gerar riscos às liberdades civis e aos direitos fundamentais, com as medidas para reduzir esses riscos. A ANPD pode exigir. Vale fazer para tratamentos de alto risco: dados sensíveis em grande volume, monitoramento, decisões automatizadas, uso de tecnologias novas como reconhecimento facial.</p>

<h2>Encarregado</h2>
<p>O controlador indica um <strong>encarregado</strong> (artigo 41), com identidade e contato divulgados publicamente (em geral, na política de privacidade). Ele recebe reclamações dos titulares e comunicações da ANPD e orienta a equipe. A Resolução CD/ANPD nº 18/2024 detalha a atuação do encarregado; agentes de pequeno porte podem ser dispensados de indicar, desde que mantenham um canal de comunicação com os titulares.</p>

<h2>Contratos com operadores</h2>
<p>Quem contrata um serviço que trata dados (hospedagem, e-mail, CRM, desenvolvimento) deve prever em contrato: as instruções de tratamento, a confidencialidade, as medidas de segurança, a ajuda para atender titulares e incidentes, e o que acontece com os dados no fim do contrato. Se você é o desenvolvedor contratado, você é o operador: siga as instruções do cliente, não use os dados para outros fins e apague o que não precisa mais.</p>
${dica('Para um projeto pessoal ou freelance, um começo honesto: inventário simples numa planilha, política de privacidade escrita para o que o site realmente faz, coleta mínima, HTTPS, senhas com hash, nenhum dado real em teste, e um e-mail de contato para pedidos dos titulares.')}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Para que serve o registro (inventário) das operações de tratamento?',
                  opcoes: [
                    'Para a contabilidade',
                    'Para saber quais dados, para quê, com qual base, onde e por quanto tempo',
                    'Para o SEO'
                  ],
                  certa: 1,
                  explicacao: 'É a base para atender direitos, responder incidentes e documentar a conformidade.'
                },
                {
                  pergunta: 'Quando o RIPD é mais recomendado?',
                  opcoes: [
                    'Para qualquer formulário de contato',
                    'Em tratamentos de alto risco, como dados sensíveis em volume ou reconhecimento facial',
                    'Nunca'
                  ],
                  certa: 1,
                  explicacao: 'Ele documenta os riscos e as medidas para reduzi-los.'
                },
                {
                  pergunta: 'Você desenvolve o sistema de uma clínica e tem acesso ao banco. Seu papel é:',
                  opcoes: ['Controlador', 'Operador', 'Titular'],
                  certa: 1,
                  explicacao: 'Você trata dados em nome da clínica e deve seguir as instruções dela.'
                }
              ]
            },
            {
              id: 'pratica-inventario',
              titulo: 'Prática: inventário e política de um app',
              resumo: 'Monte o inventário de dados e os pontos da política de privacidade de um app de agendamento.',
              minutos: 30,
              corpo: `
<p>Você vai lançar um app de agendamento para uma clínica odontológica, parecido com o site de exemplo <a href="../../projetos/lumiar-odontologia/">Lumiar Odontologia</a> deste portfólio. Ele tem:</p>
<ul>
  <li>Cadastro com nome, e-mail, telefone e data de nascimento.</li>
  <li>Agendamento com dentista, horário e um campo "motivo da consulta".</li>
  <li>Lembrete por WhatsApp na véspera, enviado por um serviço terceirizado.</li>
  <li>Estatísticas de acesso ao site.</li>
  <li>Hospedagem e banco de dados num provedor de nuvem.</li>
</ul>
<h2>Tarefas</h2>
<ol>
  <li>Monte o inventário: para cada processo, os dados, a finalidade, a base legal e os operadores envolvidos.</li>
  <li>Aponte qual dado merece cuidado especial, e por quê.</li>
  <li>Liste os tópicos que a política de privacidade precisa ter.</li>
  <li>Proponha três medidas técnicas concretas.</li>
</ol>
${resposta(`
<ol>
  <li>Um inventário possível:
    <ul>
      <li><strong>Cadastro</strong>: nome, e-mail, telefone, data de nascimento. Finalidade: identificar o paciente e contatá-lo sobre as consultas. Base: execução de contrato (ou procedimentos preliminares). Operador: provedor de nuvem.</li>
      <li><strong>Agendamento</strong>: dentista, horário, motivo. Finalidade: prestar o atendimento. Base: tutela da saúde (o motivo é dado de saúde). Operador: provedor de nuvem.</li>
      <li><strong>Lembrete</strong>: nome, telefone, horário. Finalidade: reduzir faltas. Base: execução de contrato ou legítimo interesse, com opção fácil de não receber. Operadores: serviço de WhatsApp (verifique onde guarda os dados e se há transferência internacional).</li>
      <li><strong>Estatísticas</strong>: dados de navegação. Base: consentimento, se usar cookies de terceiros; ou nenhuma coleta pessoal, com uma ferramenta sem cookies.</li>
    </ul>
  </li>
  <li>O <strong>motivo da consulta</strong> é dado de saúde, portanto <strong>sensível</strong>: acesso restrito aos profissionais, cifrado, <strong>fora</strong> do texto do lembrete de WhatsApp ("Sua consulta é amanhã às 15h", sem o motivo).</li>
  <li>Quem é o controlador e o encarregado (com contato); quais dados e para quê; bases legais; com quem são compartilhados (nuvem, WhatsApp) e se saem do país; por quanto tempo ficam (prontuários têm prazos legais próprios); direitos do titular e como pedir; cookies; data da última atualização.</li>
  <li>Exemplos: HTTPS e cifragem do campo motivo; login com dois fatores para a equipe da clínica e perfis de acesso (recepção vê agenda, dentista vê o motivo); lembretes sem dado de saúde; exclusão automática de cadastros sem consulta há X anos (respeitando os prazos legais); registro de quem acessou cada agendamento; ambiente de testes com dados fictícios.</li>
</ol>`)}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'O que não deve aparecer no lembrete de WhatsApp?',
                  opcoes: ['O horário', 'O motivo da consulta', 'O nome da clínica'],
                  certa: 1,
                  explicacao: 'É dado de saúde, sensível, e o celular pode ser visto por outras pessoas.'
                }
              ]
            }
          ]
        },
        {
          titulo: 'Casos especiais',
          itens: [
            {
              id: 'criancas-e-dados-publicos',
              titulo: 'Crianças, adolescentes e dados públicos',
              resumo: 'O melhor interesse, o consentimento dos pais e o que muda com dados já publicados.',
              minutos: 11,
              corpo: `
<h2>Crianças e adolescentes</h2>
<p>O artigo 14 exige que o tratamento de dados de crianças (até 12 anos incompletos) e adolescentes seja feito no seu <strong>melhor interesse</strong>. Para crianças, a lei fala em consentimento específico e em destaque dado por pelo menos um dos pais ou responsável, e a ANPD já entendeu (Enunciado CD/ANPD nº 1/2023) que outras bases legais também podem ser usadas, desde que o melhor interesse prevaleça.</p>
<p>Na prática, para quem desenvolve:</p>
<ul>
  <li><strong>Coletar o mínimo</strong>: um app escolar não precisa da localização exata da criança o tempo todo.</li>
  <li>Não condicionar jogos e atividades a dados além do necessário (o artigo 14 proíbe isso expressamente).</li>
  <li>Informar de forma simples, adequada à idade, com recursos visuais quando for o caso.</li>
  <li>Cuidado redobrado com perfis, publicidade direcionada e recursos que expõem a criança (chat aberto, perfil público).</li>
  <li>Se o serviço não é para crianças, deixe isso claro e tenha um caminho para lidar com cadastros que chegarem mesmo assim.</li>
</ul>

<h2>Dados "públicos"</h2>
<p>Um erro comum: "está na internet, então posso usar como quiser". Não pode. O artigo 7º permite tratar dados de acesso público e os tornados públicos pelo próprio titular, mas:</p>
<ul>
  <li>respeitando a <strong>finalidade</strong>, a boa-fé e o interesse público que justificaram a publicação;</li>
  <li>os direitos do titular e os princípios da lei continuam valendo;</li>
  <li>usar para outra finalidade exige uma base legal legítima e compatível com a original.</li>
</ul>
<p>Exemplo: o e-mail de um profissional publicado no site da empresa existe para contato profissional. Copiar milhares deles (<em>scraping</em>) para uma lista de marketing não tem nada a ver com essa finalidade.</p>
${dica('Antes de coletar dados de outros sites, pergunte: a pessoa esperaria esse uso quando publicou? Se a resposta for não, provavelmente o uso não é compatível.')}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Qual o princípio central no tratamento de dados de crianças e adolescentes?',
                  opcoes: [
                    'O lucro da empresa',
                    'O melhor interesse da criança ou do adolescente',
                    'A velocidade do serviço'
                  ],
                  certa: 1,
                  explicacao: 'É o que o artigo 14 coloca em primeiro lugar.'
                },
                {
                  pergunta: 'Dados publicados na internet podem ser usados para qualquer finalidade?',
                  opcoes: [
                    'Sim, são públicos',
                    'Não: o uso precisa respeitar a finalidade e a boa-fé da publicação',
                    'Só se forem de empresas'
                  ],
                  certa: 1,
                  explicacao: 'Público não quer dizer livre de regras.'
                },
                {
                  pergunta: 'Um jogo infantil pode exigir dados além do necessário para a criança jogar?',
                  opcoes: [
                    'Sim, com consentimento',
                    'Não: a lei proíbe condicionar a participação a isso',
                    'Só nome e foto'
                  ],
                  certa: 1,
                  explicacao: 'O artigo 14 veda condicionar jogos e aplicações a dados desnecessários.'
                }
              ]
            },
            {
              id: 'ia-e-anonimizacao',
              titulo: 'IA, anonimização e pseudonimização',
              resumo: 'Usar dados pessoais com ferramentas de IA e tirar a identificação de verdade.',
              minutos: 13,
              corpo: `
<h2>Dados pessoais em ferramentas de IA</h2>
<p>Colar uma planilha de clientes num chat de IA, mandar reclamações para um modelo resumir, treinar um modelo com conversas de atendimento: tudo isso é <strong>tratamento</strong> de dados pessoais, e as regras valem.</p>
<ul>
  <li>O fornecedor da IA é, em geral, um <strong>operador</strong>. Veja o contrato: os dados são usados para treinar o modelo? Onde ficam guardados? Há transferência internacional (e com qual garantia)?</li>
  <li><strong>Minimize</strong>: para resumir reclamações, o modelo não precisa do CPF nem do telefone. Tire antes de enviar.</li>
  <li>Decisões tomadas só por meios automatizados que afetem a pessoa (crédito, seleção, preço) podem ter a <strong>revisão</strong> pedida pelo titular (artigo 20), e ele tem direito a informações sobre os critérios.</li>
  <li>Dados sensíveis (saúde, biometria) exigem muito mais cuidado, e às vezes a resposta certa é não usar.</li>
</ul>

<h2>Anonimizar de verdade</h2>
<p>Tirar o nome não basta. Pesquisas clássicas mostraram que a combinação de <strong>CEP, data de nascimento e sexo</strong> identifica a maioria das pessoas de um país. Técnicas comuns:</p>
<ul>
  <li><strong>Supressão</strong>: remover colunas que identificam (nome, CPF, e-mail, telefone).</li>
  <li><strong>Generalização</strong>: trocar o valor exato por uma faixa (idade 34 → 30 a 39; CEP 80010-000 → 80xxx; data → mês e ano).</li>
  <li><strong>k-anonimato</strong>: garantir que cada combinação de atributos que poderiam identificar (idade, região, sexo) apareça em pelo menos <em>k</em> registros. Com k = 3, ninguém é a única pessoa com aquela combinação.</li>
  <li><strong>Agregação</strong>: muitas vezes o que se precisa é só o total por grupo, e não as linhas.</li>
</ul>

<h2>Pseudonimizar</h2>
<p>Trocar o identificador por um código, guardando a tabela de correspondência à parte, com acesso restrito. Continua sendo dado pessoal (dá para voltar), mas reduz o risco no dia a dia. Um hash simples do CPF <strong>não</strong> protege: há poucos CPFs possíveis, e dá para calcular o hash de todos. Use uma chave secreta (HMAC) ou um código aleatório.</p>
${trecho(`// Node.js: pseudônimo estável com chave secreta (a chave fica fora do código, no ambiente)
import { createHmac } from 'node:crypto';
const pseudonimo = cpf => createHmac('sha256', process.env.CHAVE_PSEUDONIMO).update(cpf).digest('hex').slice(0, 16);`)}
${dica('Para análises, comece perguntando "preciso mesmo de dados por pessoa?". Muitas vezes um total por mês e por região responde a pergunta inteira, sem nenhum dado pessoal.')}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Tirar só a coluna de nome torna uma base anônima?',
                  opcoes: [
                    'Sim',
                    'Não necessariamente: combinações como CEP, nascimento e sexo ainda identificam',
                    'Só se tiver mais de mil linhas'
                  ],
                  certa: 1,
                  explicacao: 'É preciso suprimir e generalizar os atributos que, juntos, identificam.'
                },
                {
                  pergunta: 'Por que um hash simples do CPF não é um bom pseudônimo?',
                  opcoes: [
                    'Ele é muito longo',
                    'Há poucos CPFs possíveis: dá para calcular o hash de todos e descobrir quem é quem',
                    'Hash não existe em JavaScript'
                  ],
                  certa: 1,
                  explicacao: 'Use HMAC com chave secreta ou um código aleatório com tabela protegida.'
                },
                {
                  pergunta: 'Ao usar uma ferramenta de IA para resumir reclamações, o que fazer com CPF e telefone?',
                  opcoes: [
                    'Enviar junto, para contexto',
                    'Remover antes de enviar (minimização)',
                    'Criptografar e enviar'
                  ],
                  certa: 1,
                  explicacao: 'O resumo não precisa deles.'
                }
              ]
            },
            {
              id: 'pratica-anonimizar',
              titulo: 'Prática: anonimizar uma base',
              resumo: 'Prepare uma base de atendimentos para ser compartilhada com uma consultoria.',
              minutos: 25,
              corpo: `
<p>Uma clínica quer mandar para uma consultoria uma base de atendimentos, para estudar o tempo de espera. Os dados (fictícios) são:</p>
${tabela(
  ['Nome', 'CPF', 'Nascimento', 'Sexo', 'CEP', 'Especialidade', 'Espera (dias)'],
  [
    ['Ana Souza', '123.456.789-00', '14/03/1991', 'F', '80010-000', 'Ortopedia', '12'],
    ['Bruno Lima', '987.654.321-00', '02/11/1985', 'M', '80020-100', 'Ortopedia', '9'],
    ['Carla Dias', '111.222.333-44', '30/07/1993', 'F', '80030-200', 'Cardiologia', '21'],
    ['Diego Rocha', '555.666.777-88', '19/01/1958', 'M', '83005-000', 'Cardiologia', '30'],
    ['Elisa Melo', '999.888.777-66', '05/05/1990', 'F', '80040-300', 'Ortopedia', '15'],
    ['Fábio Nunes', '444.333.222-11', '22/09/1987', 'M', '80050-400', 'Cardiologia', '18']
  ]
)}
<h2>Tarefas</h2>
<ol>
  <li>Quais colunas devem sair por completo?</li>
  <li>Como generalizar Nascimento e CEP?</li>
  <li>Monte a tabela final e confira o k-anonimato para a combinação (faixa de idade, sexo, região). Algum registro ficou único? O que fazer?</li>
  <li>A consultoria precisa mesmo das linhas? Proponha uma alternativa.</li>
</ol>
${resposta(`
<ol>
  <li><strong>Nome e CPF</strong> saem: não têm utilidade para estudar tempo de espera.</li>
  <li>Nascimento vira <strong>faixa de idade</strong> (em 2026: 30 a 39, 40 a 49...). CEP vira <strong>região</strong>: os 2 primeiros dígitos (80 = Curitiba, 83 = região metropolitana).</li>
  <li>
    ${tabela(
      ['Faixa', 'Sexo', 'Região', 'Especialidade', 'Espera'],
      [
        ['30-39', 'F', '80', 'Ortopedia', '12'],
        ['40-49', 'M', '80', 'Ortopedia', '9'],
        ['30-39', 'F', '80', 'Cardiologia', '21'],
        ['60+', 'M', '83', 'Cardiologia', '30'],
        ['30-39', 'F', '80', 'Ortopedia', '15'],
        ['30-39', 'M', '80', 'Cardiologia', '18']
      ]
    )}
    As mulheres de 30 a 39 da região 80 aparecem 3 vezes (k = 3). Mas o homem de 40 a 49, o de 60+ da região 83 e o homem de 30 a 39 são <strong>únicos</strong>: quem conhece o paciente (um vizinho, um colega) pode reconhecê-lo. Saídas: generalizar mais (faixas maiores, como "até 49" e "50+"; tirar a região ou o sexo, se o estudo não precisar), ou suprimir os registros únicos e informar a consultoria.
  </li>
  <li>Para estudar o tempo de espera, provavelmente basta a <strong>média por especialidade</strong>: Ortopedia (12 + 9 + 15) ÷ 3 = 12 dias; Cardiologia (21 + 30 + 18) ÷ 3 = 23 dias. Um relatório agregado não tem dado pessoal nenhum. Se as linhas forem mesmo necessárias, faça um contrato que proíba tentar reidentificar e restrinja o uso.</li>
</ol>`)}
${AVISO}
`,
              quiz: [
                {
                  pergunta: 'Na tabela generalizada, por que o homem de 60+ da região 83 é um problema?',
                  opcoes: [
                    'Ele tem a maior espera',
                    'É o único com essa combinação: pode ser reconhecido por quem o conhece',
                    'A região está errada'
                  ],
                  certa: 1,
                  explicacao: 'Com k = 1, a generalização não protegeu ninguém.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
