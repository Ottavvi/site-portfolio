// Trilha de Bash. Sem editor: os comandos são para rodar num terminal Linux ou Mac, no WSL ou no Git Bash do
// Windows. As práticas usam uma pasta de teste criada pela própria aula, para nada importante ser mexido.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'bash',
  area: 'Qualidade e entrega',
  titulo: 'Bash e terminal Linux',
  sigla: 'sh',
  resumo: 'O terminal dos servidores, do Docker e do CI: arquivos, pipes, scripts e automação.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Navegar, mexer em arquivos e combinar comandos com pipes.',
      modulos: [
        {
          titulo: 'Primeiros comandos',
          itens: [
            {
              id: 'primeiros-comandos',
              titulo: 'Navegar e mexer em arquivos',
              resumo: 'pwd, ls, cd, mkdir, cp, mv, rm, caminhos e a ajuda.',
              minutos: 9,
              corpo: `
<p>O <strong>Bash</strong> é o terminal padrão do Linux, que roda a maioria dos servidores, os contêineres Docker e as máquinas do GitHub Actions. No Mac, o terminal (zsh) aceita quase tudo daqui. No Windows, use o <strong>WSL</strong> (<code>wsl --install</code>) ou o <strong>Git Bash</strong>, que vem com o Git.</p>

<h2>Onde estou, o que tem aqui</h2>
${trecho(`pwd                    # pasta atual
ls                     # listar
ls -la                 # lista longa, incluindo ocultos (os que começam com .)
cd projetos            # entrar
cd ..                  # subir um nível
cd ~                   # pasta pessoal (ou só cd)
cd -                   # voltar para a anterior`)}
<p>Caminhos que começam com <code>/</code> são <strong>absolutos</strong> (<code>/home/ana/projetos</code>); os outros são <strong>relativos</strong> à pasta atual. <code>.</code> é a pasta atual, <code>..</code> a de cima e <code>~</code> a sua pasta pessoal.</p>

<h2>Criar, copiar, mover, apagar</h2>
${trecho(`mkdir -p testes/fotos      # -p cria as pastas do caminho que faltarem
touch testes/nota.txt      # arquivo vazio
cp testes/nota.txt testes/copia.txt
mv testes/copia.txt testes/backup.txt   # mover também é renomear
rm testes/backup.txt
rm -r testes/fotos         # apagar pasta com conteúdo
cat testes/nota.txt        # mostrar o conteúdo
less arquivo-grande.log    # ler com rolagem (q para sair)`)}
${dica('O <code>rm</code> não manda para a lixeira: apaga de vez. Antes de um <code>rm</code> com curinga (<code>rm *.log</code>), rode <code>ls *.log</code> para ver o que seria apagado.')}

<h2>Ajuda</h2>
<p><code>man ls</code> abre o manual (q sai, / busca). <code>ls --help</code> mostra o resumo. A tecla <kbd>Tab</kbd> completa nomes; <kbd>↑</kbd> repete comandos; <kbd>Ctrl</kbd>+<kbd>R</kbd> busca no histórico; <kbd>Ctrl</kbd>+<kbd>C</kbd> interrompe.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual comando lista também os arquivos ocultos?',
                  opcoes: ['ls -h', 'ls -a', 'ls --hidden-only'],
                  certa: 1,
                  explicacao: 'O -a mostra os que começam com ponto; -l dá os detalhes.'
                },
                {
                  pergunta: 'Como renomear um arquivo no Bash?',
                  opcoes: ['rename', 'mv antigo novo', 'cp -r'],
                  certa: 1,
                  explicacao: 'Mover para outro nome na mesma pasta é renomear.'
                },
                {
                  pergunta: 'O que rm faz com o arquivo?',
                  opcoes: ['Manda para a lixeira', 'Apaga de vez', 'Esconde'],
                  certa: 1,
                  explicacao: 'Não há lixeira no terminal.'
                }
              ]
            },
            {
              id: 'pipes-e-redirecionamento',
              titulo: 'Pipes, redirecionamento e busca',
              resumo: '|, >, >>, grep, wc, sort, uniq, head, tail e find.',
              minutos: 12,
              corpo: `
<p>A filosofia do Unix: cada comando faz uma coisa bem feita, e o <strong>pipe</strong> (<code>|</code>) liga a saída de um à entrada do outro. Aqui, o que passa é <strong>texto</strong>, linha por linha.</p>
${trecho(`ls | wc -l                          # quantos itens na pasta
cat acesso.log | grep "404" | wc -l  # quantas linhas com 404
history | tail -20                   # os últimos 20 comandos`)}

<h2>Os comandos de texto</h2>
<ul>
  <li><code>grep padrão</code>: só as linhas que contêm o padrão (<code>-i</code> ignora maiúsculas, <code>-v</code> inverte, <code>-r</code> procura em pastas, <code>-n</code> mostra o número da linha).</li>
  <li><code>head -n 5</code> e <code>tail -n 5</code>: as primeiras ou últimas linhas. <code>tail -f</code> acompanha um log ao vivo.</li>
  <li><code>sort</code> ordena (<code>-n</code> numérico, <code>-r</code> invertido); <code>uniq -c</code> conta linhas repetidas seguidas (por isso vem depois do sort).</li>
  <li><code>cut -d, -f2</code>: a segunda coluna de um CSV separado por vírgula.</li>
  <li><code>wc -l</code>: conta linhas.</li>
</ul>
${trecho(`# As 5 páginas mais acessadas de um log (o caminho é o 7º campo)
cut -d' ' -f7 acesso.log | sort | uniq -c | sort -rn | head -5`)}

<h2>Redirecionar</h2>
${trecho(`ls > lista.txt           # grava a saída num arquivo (substitui)
date >> registro.txt     # acrescenta no fim
comando 2> erros.txt     # só os erros
comando > tudo.txt 2>&1  # saída e erros no mesmo arquivo
comando > /dev/null      # descarta a saída`)}

<h2>Achar arquivos</h2>
${trecho(`find . -name "*.jpg"                 # todos os .jpg a partir daqui
find . -type f -size +100M           # arquivos maiores que 100 MB
find . -name "*.tmp" -mtime +30      # .tmp sem mudança há mais de 30 dias
grep -rn "TODO" src/                 # onde aparece TODO no código`)}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre > e >>?',
                  opcoes: ['Nenhuma', '> substitui o arquivo; >> acrescenta no fim', '>> apaga o arquivo'],
                  certa: 1,
                  explicacao: 'Cuidado: > zera o arquivo antes de escrever.'
                },
                {
                  pergunta: 'Por que sort vem antes de uniq -c?',
                  opcoes: [
                    'Por estética',
                    'uniq só junta linhas iguais que estão seguidas',
                    'uniq exige ordem alfabética para não dar erro'
                  ],
                  certa: 1,
                  explicacao: 'Ordenar coloca as iguais lado a lado.'
                },
                {
                  pergunta: 'Como acompanhar um log que está sendo escrito?',
                  opcoes: ['cat -live', 'tail -f arquivo.log', 'head -w'],
                  certa: 1,
                  explicacao: 'Ctrl+C para sair.'
                }
              ]
            },
            {
              id: 'pratica-analisar-log',
              titulo: 'Prática: analisar um log de acesso',
              resumo: 'Responder perguntas sobre um log só com pipes.',
              minutos: 15,
              corpo: `
<p>Crie o arquivo de exemplo colando isto no terminal:</p>
${trecho(`mkdir -p ~/pratica-bash && cd ~/pratica-bash
cat > acesso.log <<'FIM'
10.0.0.1 - - [27/Oct/2026:10:01:00] "GET / HTTP/1.1" 200 5120
10.0.0.2 - - [27/Oct/2026:10:01:05] "GET /quartos HTTP/1.1" 200 8300
10.0.0.1 - - [27/Oct/2026:10:02:10] "GET /reserva HTTP/1.1" 200 4100
10.0.0.3 - - [27/Oct/2026:10:03:00] "GET /antigo HTTP/1.1" 404 210
10.0.0.2 - - [27/Oct/2026:10:04:30] "POST /reserva HTTP/1.1" 500 120
10.0.0.4 - - [27/Oct/2026:10:05:00] "GET /quartos HTTP/1.1" 200 8300
10.0.0.1 - - [27/Oct/2026:10:06:00] "GET /quartos HTTP/1.1" 200 8300
10.0.0.3 - - [27/Oct/2026:10:07:00] "GET /antigo HTTP/1.1" 404 210
FIM`)}
<h2>Tarefas</h2>
<ol>
  <li>Quantas requisições há no total?</li>
  <li>Quantas deram erro 404? E 500?</li>
  <li>Quais IPs diferentes acessaram, e quantas vezes cada um?</li>
  <li>Qual a página mais acessada?</li>
  <li>Grave as linhas de erro (4xx e 5xx) num arquivo <code>erros.log</code>.</li>
</ol>
${resposta(`
${trecho(`# 1
wc -l < acesso.log

# 2
grep -c '" 404 ' acesso.log
grep -c '" 500 ' acesso.log

# 3
cut -d' ' -f1 acesso.log | sort | uniq -c | sort -rn

# 4
cut -d' ' -f6 acesso.log | sort | uniq -c | sort -rn | head -1

# 5
grep -E '" [45][0-9]{2} ' acesso.log > erros.log`)}
<p><code>grep -c</code> conta as linhas sem precisar do <code>wc</code>. Procurar <code>'" 404 '</code> (com aspas e espaços) evita contar um 404 que apareça no meio de um tamanho. <code>-E</code> liga as expressões regulares estendidas, para <code>[45][0-9]{2}</code> pegar qualquer código 4xx ou 5xx.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que grep -c faz?',
                  opcoes: ['Colore o resultado', 'Conta as linhas que casam', 'Copia as linhas'],
                  certa: 1,
                  explicacao: 'É o mesmo que grep | wc -l, numa etapa só.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Scripts, variáveis, condições, laços e permissões.',
      modulos: [
        {
          titulo: 'Scripts',
          itens: [
            {
              id: 'scripts-e-variaveis',
              titulo: 'Scripts, variáveis e condições',
              resumo: 'Shebang, chmod, variáveis, aspas, argumentos, if e test.',
              minutos: 13,
              corpo: `
${trecho(`#!/usr/bin/env bash
# backup.sh: copia uma pasta para backups/ com a data no nome
set -euo pipefail

origem="\${1:?Uso: ./backup.sh PASTA}"
destino="backups/$(basename "$origem")-$(date +%Y-%m-%d).tar.gz"

if [[ ! -d "$origem" ]]; then
  echo "Pasta não encontrada: $origem" >&2
  exit 1
fi

mkdir -p backups
tar -czf "$destino" "$origem"
echo "Backup criado: $destino ($(du -h "$destino" | cut -f1))"`)}
${trecho(`chmod +x backup.sh     # dá permissão de execução
./backup.sh fotos`)}
<ul>
  <li>A primeira linha (<strong>shebang</strong>) diz qual programa roda o script.</li>
  <li><code>set -euo pipefail</code>: para no primeiro erro, trata variável não definida como erro e não ignora falhas no meio de um pipe. Comece todo script assim.</li>
  <li>Variáveis: <code>nome="valor"</code> <strong>sem espaços</strong> em volta do <code>=</code>. Para ler: <code>$nome</code>.</li>
  <li><code>$(comando)</code> põe a saída de um comando no lugar.</li>
  <li><code>$1</code>, <code>$2</code>... são os argumentos; <code>$#</code> é quantos são; <code>$@</code>, todos.</li>
  <li><code>\${1:?mensagem}</code> para com a mensagem se o argumento faltar; <code>\${1:-padrao}</code> usa um valor padrão.</li>
  <li><code>&gt;&amp;2</code> manda a mensagem para a saída de erros.</li>
</ul>
${dica('Coloque sempre as variáveis entre aspas duplas: <code>"$arquivo"</code>. Sem aspas, um nome com espaço ("minhas fotos") vira dois argumentos, e um <code>rm $arquivo</code> pode apagar a coisa errada.')}

<h2>Testes no if</h2>
${trecho(`[[ -f arq ]]      # existe e é arquivo
[[ -d pasta ]]    # existe e é pasta
[[ -z "$x" ]]     # texto vazio
[[ "$a" == "$b" ]]
[[ $n -gt 10 ]]   # números: -eq -ne -lt -le -gt -ge
(( n > 10 ))      # ou aritmética direto
[[ -f a && -f b ]]`)}
`,
              quiz: [
                {
                  pergunta: 'O que está errado em nome = "Ana"?',
                  opcoes: ['Nada', 'Não pode ter espaço em volta do =', 'Faltou o $'],
                  certa: 1,
                  explicacao: 'Com espaços, o Bash tenta rodar um comando chamado "nome".'
                },
                {
                  pergunta: 'O que faz set -e?',
                  opcoes: ['Mostra cada comando', 'Para o script no primeiro comando que falhar', 'Ativa cores'],
                  certa: 1,
                  explicacao: 'Sem ele, o script segue em frente depois de um erro.'
                },
                {
                  pergunta: 'Por que escrever "$arquivo" com aspas?',
                  opcoes: [
                    'Por estilo',
                    'Para nomes com espaço não virarem vários argumentos',
                    'Para o texto sair em negrito'
                  ],
                  certa: 1,
                  explicacao: 'É a fonte de bugs mais comum em scripts.'
                }
              ]
            },
            {
              id: 'lacos-funcoes-permissoes',
              titulo: 'Laços, funções e permissões',
              resumo: 'for, while read, funções, códigos de saída e chmod.',
              minutos: 13,
              corpo: `
<h2>Laços</h2>
${trecho(`for arq in *.jpg; do
  echo "Processando $arq"
done

for i in {1..5}; do echo "Rodada $i"; done

# Ler um arquivo linha por linha
while IFS=, read -r nome email; do
  echo "Enviar para $nome <$email>"
done < contatos.csv`)}
<p>O <code>IFS=,</code> diz que o separador é a vírgula, e o <code>-r</code> não trata barras invertidas como especiais.</p>

<h2>Manipular nomes</h2>
${trecho(`arq="relatorio.final.pdf"
echo "\${arq%.*}"     # relatorio.final  (tira a última extensão)
echo "\${arq##*.}"    # pdf              (só a extensão)
echo "\${arq/final/v2}" # relatorio.v2.pdf
echo "\${#arq}"       # 19               (tamanho)`)}

<h2>Funções e códigos de saída</h2>
${trecho(`registrar() {
  echo "[$(date +%H:%M:%S)] $*" >> script.log
}

site_no_ar() {
  curl -s -o /dev/null -w "%{http_code}" "$1" | grep -q "^200$"
}

if site_no_ar "https://exemplo.com"; then
  registrar "Site OK"
else
  registrar "Site FORA"
fi`)}
<p>Todo comando termina com um <strong>código de saída</strong>: 0 é sucesso; qualquer outro, falha. O <code>if</code> testa esse código. <code>$?</code> guarda o do último comando, e <code>&amp;&amp;</code> e <code>||</code> encadeiam: <code>make &amp;&amp; echo ok || echo falhou</code>.</p>

<h2>Permissões</h2>
${trecho(`ls -l script.sh
# -rwxr-xr-- 1 ana equipe 512 ...
#  dono  grupo  outros

chmod +x script.sh      # todos podem executar
chmod 640 segredo.env   # dono lê e escreve; grupo lê; outros nada
sudo comando            # rodar como administrador (root)`)}
<p>Cada dígito do <code>chmod</code> numérico soma <strong>4</strong> (ler), <strong>2</strong> (escrever) e <strong>1</strong> (executar), para dono, grupo e outros.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual código de saída significa sucesso?',
                  opcoes: ['1', '0', '-1'],
                  certa: 1,
                  explicacao: 'Qualquer valor diferente de 0 é falha.'
                },
                {
                  pergunta: 'O que "\${arq%.*}" devolve para "foto.jpg"?',
                  opcoes: ['jpg', 'foto', 'foto.jpg'],
                  certa: 1,
                  explicacao: '% tira o menor final que casa com .*'
                },
                {
                  pergunta: 'O que significa chmod 640?',
                  opcoes: ['Todos leem e escrevem', 'Dono lê e escreve, grupo lê, outros nada', 'Só o root acessa'],
                  certa: 1,
                  explicacao: '6 = 4+2 (ler+escrever), 4 = ler, 0 = nada.'
                }
              ]
            },
            {
              id: 'pratica-organizar-fotos',
              titulo: 'Prática: organizar fotos por data',
              resumo: 'Um script que move arquivos para pastas ano/mês, com modo de simulação.',
              minutos: 25,
              corpo: `
<p>Prepare arquivos de teste:</p>
${trecho(`mkdir -p ~/pratica-bash/fotos && cd ~/pratica-bash/fotos
touch -d "2025-12-24" natal.jpg
touch -d "2026-01-10" praia.jpg "praia 2.jpg"
touch -d "2026-03-05" aniversario.png
touch leia-me.txt`)}
<h2>Tarefas</h2>
<p>Escreva <code>organizar.sh</code> que:</p>
<ol>
  <li>Recebe a pasta como argumento (padrão: a atual).</li>
  <li>Move cada .jpg e .png para <code>AAAA/MM/</code> conforme a data de modificação.</li>
  <li>Aceita <code>--simular</code> como segundo argumento: mostra o que faria, sem mover.</li>
  <li>Funciona com nomes com espaço e não sobrescreve arquivos que já existam no destino.</li>
  <li>No fim, mostra quantos arquivos foram movidos.</li>
</ol>
${resposta(`
${trecho(`#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob nocaseglob     # curinga sem resultado vira lista vazia; .JPG também casa

pasta="\${1:-.}"
simular=false
[[ "\${2:-}" == "--simular" ]] && simular=true

movidos=0
for arq in "$pasta"/*.jpg "$pasta"/*.png; do
  data=$(date -r "$arq" +%Y/%m)          # no Mac: stat -f %Sm -t %Y/%m "$arq"
  destino="$pasta/$data"
  if $simular; then
    echo "[simulação] $arq -> $destino/"
  else
    mkdir -p "$destino"
    mv -n "$arq" "$destino/"             # -n: não sobrescreve
  fi
  movidos=$((movidos + 1))
done

echo "$movidos arquivo(s) $($simular && echo 'seriam movidos' || echo 'movidos')."`)}
${trecho(`chmod +x organizar.sh
./organizar.sh ~/pratica-bash/fotos --simular
./organizar.sh ~/pratica-bash/fotos
find ~/pratica-bash/fotos`)}
<p>Sem <code>nullglob</code>, se não houver nenhum .png, o laço receberia o texto literal <code>*.png</code>. As aspas em <code>"$arq"</code> fazem o "praia 2.jpg" funcionar.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Para que serve shopt -s nullglob no script?',
                  opcoes: [
                    'Apagar arquivos vazios',
                    'Fazer um curinga sem resultado virar lista vazia, em vez do texto literal',
                    'Ignorar erros'
                  ],
                  certa: 1,
                  explicacao: 'Sem ele, o laço rodaria uma vez com "*.png".'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Servidores: SSH, processos, cron, sed e awk.',
      modulos: [
        {
          titulo: 'Servidores e automação',
          itens: [
            {
              id: 'ssh-processos-cron',
              titulo: 'SSH, processos e cron',
              resumo: 'Acessar servidores, chaves, ps, kill, systemctl, variáveis de ambiente e agendamento.',
              minutos: 14,
              corpo: `
<h2>SSH</h2>
${trecho(`ssh-keygen -t ed25519 -C "ana@notebook"   # cria o par de chaves (uma vez)
ssh-copy-id ana@meu-servidor.com.br        # instala a chave pública no servidor
ssh ana@meu-servidor.com.br                # entra sem senha
scp relatorio.pdf ana@servidor:/tmp/       # copia arquivo
rsync -avz site/ ana@servidor:/var/www/site/   # sincroniza só o que mudou`)}
<p>A <strong>chave privada</strong> (<code>~/.ssh/id_ed25519</code>) nunca sai do seu computador; a <strong>pública</strong> (<code>.pub</code>) pode ir para qualquer servidor e para o GitHub.</p>

<h2>Processos e serviços</h2>
${trecho(`ps aux | grep node        # processos com "node"
top                       # uso de CPU e memória ao vivo (q sai); htop é mais amigável
kill 1234                 # pede para o processo 1234 encerrar
kill -9 1234              # força (último recurso)
df -h                     # espaço em disco
du -sh * | sort -h        # o que ocupa espaço nesta pasta
free -h                   # memória

sudo systemctl status nginx
sudo systemctl restart nginx
journalctl -u nginx -f    # logs do serviço ao vivo

comando-demorado &        # roda em segundo plano
nohup ./servidor.sh > saida.log 2>&1 &   # continua rodando depois de sair do SSH`)}

<h2>Variáveis de ambiente</h2>
${trecho(`export API_URL="https://api.exemplo.com"   # vale para os comandos chamados daqui
echo "$PATH"                               # onde o shell procura os programas
# Para valer sempre: acrescente o export no ~/.bashrc e rode source ~/.bashrc`)}

<h2>cron</h2>
${trecho(`crontab -e     # edita os agendamentos do seu usuário

# minuto hora dia mês dia-da-semana  comando
0 3 * * *     /home/ana/scripts/backup.sh >> /home/ana/backup.log 2>&1
*/15 * * * *  /home/ana/scripts/checar-site.sh
0 8 * * 1     /home/ana/scripts/relatorio-semanal.sh   # segunda às 8h`)}
${dica('O cron roda com um ambiente mínimo: o PATH é curto e não há o seu ~/.bashrc. Use caminhos absolutos no crontab e dentro dos scripts, e sempre redirecione a saída para um log, senão você não fica sabendo dos erros.')}
`,
              quiz: [
                {
                  pergunta: 'Qual chave SSH vai para o servidor?',
                  opcoes: ['A privada', 'A pública (.pub)', 'As duas'],
                  certa: 1,
                  explicacao: 'A privada fica só com você.'
                },
                {
                  pergunta: 'O que significa 0 3 * * * no cron?',
                  opcoes: ['A cada 3 minutos', 'Todo dia às 3h00', 'Dia 3 de cada mês'],
                  certa: 1,
                  explicacao: 'Minuto 0, hora 3, qualquer dia, mês e dia da semana.'
                },
                {
                  pergunta: 'Por que um script funciona no terminal e falha no cron?',
                  opcoes: [
                    'O cron é mais lento',
                    'O cron tem um ambiente mínimo (PATH curto, sem .bashrc)',
                    'O cron não roda Bash'
                  ],
                  certa: 1,
                  explicacao: 'Caminhos absolutos resolvem a maioria dos casos.'
                }
              ]
            },
            {
              id: 'sed-awk-jq',
              titulo: 'sed, awk e jq',
              resumo: 'Editar texto em lote, somar colunas e processar JSON no terminal.',
              minutos: 13,
              corpo: `
<h2>sed: localizar e substituir</h2>
${trecho(`sed 's/http:/https:/g' links.txt          # mostra com a troca
sed -i 's/http:/https:/g' links.txt       # altera o próprio arquivo
sed -i.bak 's/2025/2026/g' *.html         # altera e guarda backup .bak
sed -n '10,20p' arquivo.txt               # só as linhas 10 a 20
sed '/^#/d' config.conf                   # apaga as linhas de comentário`)}
<p>No Mac, o <code>sed -i</code> exige um argumento: <code>sed -i '' 's/a/b/' arq</code>.</p>

<h2>awk: colunas e contas</h2>
${trecho(`# vendas.csv: data,vendedor,valor
awk -F, 'NR > 1 { total += $3 } END { print total }' vendas.csv          # soma
awk -F, 'NR > 1 { soma[$2] += $3 } END { for (v in soma) print v, soma[v] }' vendas.csv
awk -F, '$3 > 1000' vendas.csv                                           # filtra
awk '{ print $1, $7 }' acesso.log                                        # colunas 1 e 7`)}
<p>Dentro do awk, <code>$1</code>, <code>$2</code>... são as colunas da linha (não confundir com os argumentos do Bash: por isso o programa vai entre aspas simples). <code>NR</code> é o número da linha; o bloco <code>END</code> roda no fim.</p>

<h2>jq: JSON</h2>
${trecho(`curl -s https://viacep.com.br/ws/01001000/json/ | jq .
curl -s https://viacep.com.br/ws/01001000/json/ | jq -r '.localidade'

# Num array: filtrar e escolher campos
jq '.[] | select(.preco > 100) | {nome, preco}' produtos.json
jq '[.[].preco] | add' produtos.json           # soma
jq -r '.[] | [.nome, .preco] | @csv' produtos.json > produtos.csv`)}
<p>O <code>-r</code> tira as aspas do texto, para usar o valor numa variável: <code>cidade=$(curl ... | jq -r .localidade)</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'O que faz sed -i?',
                  opcoes: ['Ignora maiúsculas', 'Altera o próprio arquivo', 'Mostra as linhas numeradas'],
                  certa: 1,
                  explicacao: 'Sem -i, o sed só mostra o resultado.'
                },
                {
                  pergunta: 'No awk, quando roda o bloco END?',
                  opcoes: ['Em cada linha', 'Depois da última linha', 'Antes da primeira'],
                  certa: 1,
                  explicacao: 'BEGIN roda antes; END, depois.'
                },
                {
                  pergunta: 'Para que serve o -r do jq?',
                  opcoes: ['Ler recursivamente', 'Devolver texto sem aspas', 'Ordenar'],
                  certa: 1,
                  explicacao: 'Saída "crua", pronta para usar em variáveis.'
                }
              ]
            },
            {
              id: 'pratica-monitor-site',
              titulo: 'Prática: monitor de sites com alerta',
              resumo: 'Checar uma lista de URLs, registrar tempos e alertar falhas pelo cron.',
              minutos: 30,
              corpo: `
<h2>Tarefas</h2>
<p>Escreva <code>monitor.sh</code> que:</p>
<ol>
  <li>Lê uma lista de URLs de <code>sites.txt</code> (uma por linha, ignorando linhas vazias e comentários com #).</li>
  <li>Para cada uma, mede o código HTTP e o tempo de resposta com <code>curl</code>, com limite de 10 segundos.</li>
  <li>Acrescenta uma linha CSV em <code>monitor.csv</code>: data e hora, URL, código, tempo.</li>
  <li>Se algum site não responder 200, sai com código 1 e mostra quais falharam.</li>
  <li>Agende no cron a cada 10 minutos.</li>
</ol>
${resposta(`
${trecho(`#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"          # trabalha na pasta do script (importante no cron)

agora=$(date '+%Y-%m-%d %H:%M:%S')
falhas=()

while read -r url; do
  [[ -z "$url" || "$url" == \\#* ]] && continue
  resultado=$(curl -s -o /dev/null --max-time 10 -w '%{http_code} %{time_total}' "$url" || echo "000 10")
  read -r codigo tempo <<< "$resultado"
  echo "$agora,$url,$codigo,$tempo" >> monitor.csv
  [[ "$codigo" == "200" ]] || falhas+=("$url ($codigo)")
done < sites.txt

if (( \${#falhas[@]} > 0 )); then
  printf 'FALHOU: %s\\n' "\${falhas[@]}" >&2
  exit 1
fi
echo "Todos os sites OK ($agora)"`)}
${trecho(`*/10 * * * * /home/ana/monitor/monitor.sh >> /home/ana/monitor/cron.log 2>&1`)}
<p><code>falhas=()</code> é um <strong>array</strong>: <code>+=</code> acrescenta, <code>\${#falhas[@]}</code> conta, <code>"\${falhas[@]}"</code> expande cada item como um argumento. O <code>|| echo "000 10"</code> evita que o <code>set -e</code> encerre o script quando o curl falha por tempo esgotado. O <code>&lt;&lt;&lt;</code> passa um texto como entrada do <code>read</code>.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que cd "$(dirname "$0")" no começo?',
                  opcoes: [
                    'Para o script achar sites.txt mesmo rodando pelo cron, de outra pasta',
                    'Para voltar à pasta pessoal',
                    'É obrigatório no Bash'
                  ],
                  certa: 0,
                  explicacao: '$0 é o caminho do próprio script.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
