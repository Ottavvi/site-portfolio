// Trilha de Docker. Sem editor: os comandos são para rodar no computador, com o Docker Desktop (Windows e Mac) ou o
// Docker Engine (Linux). As práticas têm a resposta escondida para conferir.
// Atenção: crases e ${ dos exemplos precisam de barra invertida. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'docker',
  area: 'Qualidade e entrega',
  titulo: 'Docker',
  sigla: 'Dk',
  resumo: 'Empacotar uma aplicação com tudo de que ela precisa, para rodar igual em qualquer máquina.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Imagens, contêineres e os comandos do dia a dia.',
      modulos: [
        {
          titulo: 'Primeiros contêineres',
          itens: [
            {
              id: 'o-que-e-docker',
              titulo: 'O que é um contêiner',
              resumo: 'Imagem, contêiner, registro e a diferença para uma máquina virtual.',
              minutos: 9,
              corpo: `
<p>"Na minha máquina funciona" é o problema que o Docker resolve. Uma aplicação depende de uma versão do Node ou do Python, de bibliotecas do sistema, de um banco de dados configurado de um jeito. O Docker empacota tudo isso junto, e o pacote roda igual no seu notebook, no do colega e no servidor.</p>

<h2>As três palavras</h2>
<ul>
  <li><strong>Imagem</strong>: o pacote pronto, só de leitura: um sistema mínimo, a linguagem, as dependências e o seu código. É como a receita congelada.</li>
  <li><strong>Contêiner</strong>: uma imagem rodando. Dá para ter vários contêineres da mesma imagem ao mesmo tempo, cada um isolado.</li>
  <li><strong>Registro</strong>: onde as imagens ficam guardadas para baixar. O mais conhecido é o <strong>Docker Hub</strong>; o GitHub tem o próprio (GHCR).</li>
</ul>

<h2>Contêiner não é máquina virtual</h2>
<p>Uma máquina virtual simula um computador inteiro, com sistema operacional próprio: pesa gigabytes e leva minutos para ligar. Um contêiner compartilha o núcleo (kernel) do sistema e isola só o necessário: pesa megabytes e liga em segundos. No Windows e no Mac, o Docker Desktop roda os contêineres dentro de uma pequena máquina Linux (no Windows, pelo WSL 2).</p>

<h2>Instalar</h2>
<p>Instale o <strong>Docker Desktop</strong> (docker.com). No Windows, ele pede para ativar o WSL 2 na primeira vez. Depois, no terminal:</p>
${trecho(`docker --version
docker run hello-world   # baixa uma imagem de teste e roda um contêiner que imprime uma mensagem`)}
${dica('Você não precisa instalar Postgres, Redis ou uma versão específica do Node no computador para testar um projeto: com Docker, cada um vira um contêiner que liga e desliga com um comando, sem bagunçar o sistema.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre imagem e contêiner?',
                  opcoes: [
                    'São a mesma coisa',
                    'A imagem é o pacote pronto; o contêiner é uma imagem rodando',
                    'O contêiner é o pacote; a imagem é o processo'
                  ],
                  certa: 1,
                  explicacao: 'Da mesma imagem, dá para criar vários contêineres.'
                },
                {
                  pergunta: 'Por que um contêiner liga mais rápido que uma máquina virtual?',
                  opcoes: [
                    'Porque compartilha o kernel do sistema e não simula um computador inteiro',
                    'Porque não tem sistema de arquivos',
                    'Porque roda na nuvem'
                  ],
                  certa: 0,
                  explicacao: 'Por isso pesa megabytes e liga em segundos.'
                },
                {
                  pergunta: 'O que é o Docker Hub?',
                  opcoes: ['Um editor de código', 'Um registro público de imagens', 'Um tipo de contêiner'],
                  certa: 1,
                  explicacao: 'É de onde vêm as imagens oficiais, como node, python e postgres.'
                }
              ]
            },
            {
              id: 'comandos-basicos',
              titulo: 'Os comandos do dia a dia',
              resumo: 'run, ps, logs, exec, portas, variáveis de ambiente e volumes.',
              minutos: 13,
              corpo: `
<h2>Rodar e acompanhar</h2>
${trecho(`docker run -d --name web -p 8080:80 nginx:1.27   # baixa (se preciso) e roda em segundo plano
docker ps                 # contêineres rodando (-a mostra também os parados)
docker logs -f web        # a saída do contêiner, acompanhando (Ctrl+C sai)
docker exec -it web sh    # abre um terminal dentro do contêiner (exit para sair)
docker stop web           # para
docker start web          # liga de novo
docker rm -f web          # apaga (o -f para antes, se estiver rodando)
docker images             # imagens baixadas`)}
<ul>
  <li><code>-d</code>: roda em segundo plano (<em>detached</em>).</li>
  <li><code>--name</code>: um nome para usar nos outros comandos (senão, o Docker inventa um).</li>
  <li><code>nginx:1.27</code>: a imagem e a <strong>tag</strong> (versão). Sem tag, vale <code>latest</code>, que muda sem aviso: em projetos, fixe a versão.</li>
</ul>

<h2>Portas</h2>
<p>O contêiner tem a sua própria rede. <code>-p 8080:80</code> liga a porta 8080 do seu computador à porta 80 do contêiner. Com o comando acima, <code>http://localhost:8080</code> abre a página do nginx.</p>

<h2>Variáveis de ambiente</h2>
<p>A configuração vai por variáveis, nunca dentro da imagem:</p>
${trecho(`docker run -d --name banco -p 5432:5432 \\
  -e POSTGRES_PASSWORD=senha-local -e POSTGRES_DB=loja \\
  postgres:17`)}

<h2>Volumes: dados que sobrevivem</h2>
<p>Tudo que o contêiner grava some quando ele é apagado. Para guardar dados (o banco) ou usar arquivos do seu computador (o site em desenvolvimento), use volumes:</p>
${trecho(`# Volume nomeado, gerenciado pelo Docker: os dados do banco sobrevivem a um docker rm
docker run -d --name banco -e POSTGRES_PASSWORD=senha-local \\
  -v dados-banco:/var/lib/postgresql/data postgres:17

# Pasta do seu computador montada no contêiner (bind mount): muda aqui, muda lá
docker run -d --name site -p 8080:80 -v "$PWD/site:/usr/share/nginx/html:ro" nginx:1.27`)}
<p>O <code>:ro</code> monta só para leitura. No PowerShell, use <code>\${PWD}</code> no lugar de <code>$PWD</code>.</p>
${dica('Para limpar a bagunça de vez em quando: <code>docker system prune</code> apaga contêineres parados, redes sem uso e imagens sem nome. Com <code>--volumes</code>, apaga também volumes sem uso, inclusive dados de bancos: cuidado.')}
`,
              quiz: [
                {
                  pergunta: 'O que -p 3000:80 faz?',
                  opcoes: [
                    'Liga a porta 3000 do computador à porta 80 do contêiner',
                    'Liga a porta 80 do computador à 3000 do contêiner',
                    'Limita o contêiner a 3000 MB'
                  ],
                  certa: 0,
                  explicacao: 'O formato é porta_do_computador:porta_do_contêiner.'
                },
                {
                  pergunta: 'Os dados do Postgres somem ao apagar o contêiner. Como evitar?',
                  opcoes: ['Usar -d', 'Usar um volume em /var/lib/postgresql/data', 'Usar a tag latest'],
                  certa: 1,
                  explicacao: 'O volume guarda os dados fora do contêiner.'
                },
                {
                  pergunta: 'Por que fixar a tag (postgres:17) em vez de usar latest?',
                  opcoes: [
                    'É mais rápido',
                    'latest muda sem aviso e pode trazer uma versão incompatível',
                    'latest não existe'
                  ],
                  certa: 1,
                  explicacao: 'Com a versão fixa, todo mundo roda exatamente a mesma coisa.'
                }
              ]
            },
            {
              id: 'pratica-primeiros-conteineres',
              titulo: 'Prática: um site e um banco em contêineres',
              resumo: 'Sirva uma pasta com o nginx e suba um Postgres com dados que sobrevivem.',
              minutos: 18,
              corpo: `
<p>Com o Docker Desktop aberto, faça no terminal:</p>
<ol>
  <li>Crie uma pasta <code>teste-docker/site</code> com um <code>index.html</code> qualquer. Sirva essa pasta com o nginx 1.27 em <code>http://localhost:8080</code>, só para leitura. Mude o HTML e recarregue a página: muda na hora?</li>
  <li>Veja os logs do nginx depois de abrir a página algumas vezes.</li>
  <li>Suba um Postgres 17 chamado <code>banco</code>, com senha <code>senha-local</code>, banco <code>loja</code>, porta 5432 e os dados num volume <code>dados-loja</code>.</li>
  <li>Entre no banco com o <code>psql</code> de dentro do contêiner, crie uma tabela <code>clientes (nome text)</code> e insira um nome.</li>
  <li>Apague o contêiner do banco, crie de novo com o mesmo volume e confirme que o cliente continua lá.</li>
</ol>
${resposta(`${trecho(`# 1 (no Git Bash ou Linux/Mac; no PowerShell, troque $PWD por \${PWD})
mkdir -p teste-docker/site && cd teste-docker
echo "<h1>Olá do Docker</h1>" > site/index.html
docker run -d --name site -p 8080:80 -v "$PWD/site:/usr/share/nginx/html:ro" nginx:1.27
# Sim: o bind mount mostra o arquivo do seu computador, então muda na hora.

# 2
docker logs site

# 3
docker run -d --name banco -p 5432:5432 \\
  -e POSTGRES_PASSWORD=senha-local -e POSTGRES_DB=loja \\
  -v dados-loja:/var/lib/postgresql/data postgres:17

# 4
docker exec -it banco psql -U postgres -d loja
#   CREATE TABLE clientes (nome text);
#   INSERT INTO clientes VALUES ('Ana');
#   \\q

# 5
docker rm -f banco
docker run -d --name banco -p 5432:5432 \\
  -e POSTGRES_PASSWORD=senha-local -e POSTGRES_DB=loja \\
  -v dados-loja:/var/lib/postgresql/data postgres:17
docker exec -it banco psql -U postgres -d loja -c "SELECT * FROM clientes;"   # Ana continua lá`)}
<p>As variáveis <code>POSTGRES_PASSWORD</code> e <code>POSTGRES_DB</code> só valem na <strong>primeira</strong> vez que o volume é criado. Com o volume já existente, o Postgres usa o que está nele.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que o cliente continuou lá depois do docker rm?',
                  opcoes: ['O Docker não apagou o contêiner', 'Os dados estavam no volume, fora do contêiner', 'Sorte'],
                  certa: 1,
                  explicacao: 'O contêiner novo montou o mesmo volume.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Criar as suas imagens e subir vários serviços juntos.',
      modulos: [
        {
          titulo: 'Dockerfile e Compose',
          itens: [
            {
              id: 'dockerfile',
              titulo: 'Dockerfile: a sua imagem',
              resumo: 'FROM, WORKDIR, COPY, RUN, CMD, camadas, cache e .dockerignore.',
              minutos: 13,
              corpo: `
<p>Um <strong>Dockerfile</strong> é a receita da imagem: um passo por linha, de cima para baixo. Para uma API em Node:</p>
${trecho(`# Dockerfile
FROM node:22-slim

WORKDIR /app

# Primeiro só os arquivos de dependências, para aproveitar o cache
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Depois o resto do código
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "servidor.js"]`)}
<ul>
  <li><code>FROM</code>: a imagem de base. As versões <code>-slim</code> e <code>-alpine</code> são menores.</li>
  <li><code>WORKDIR</code>: a pasta onde os próximos comandos rodam.</li>
  <li><code>COPY</code>: copia arquivos do seu projeto para a imagem. <code>RUN</code>: roda um comando durante a construção.</li>
  <li><code>CMD</code>: o comando que roda quando o contêiner liga. <code>EXPOSE</code> só documenta a porta; quem publica é o <code>-p</code>.</li>
</ul>
${trecho(`docker build -t minha-api:1.0 .
docker run -d -p 3000:3000 --name api minha-api:1.0`)}

<h2>Camadas e cache</h2>
<p>Cada instrução vira uma <strong>camada</strong>, e o Docker reaproveita as camadas que não mudaram. Por isso a ordem importa: copiar o <code>package.json</code> e instalar as dependências <em>antes</em> de copiar o código faz o <code>npm ci</code> (lento) só rodar de novo quando as dependências mudam. Se o <code>COPY . .</code> viesse primeiro, qualquer mudança num arquivo refaria a instalação inteira.</p>

<h2>.dockerignore</h2>
<p>Como o <code>.gitignore</code>, diz o que não entra na imagem. Sem ele, o <code>COPY . .</code> leva o <code>node_modules</code> do seu computador, o <code>.git</code> e, pior, o <code>.env</code> com senhas:</p>
${trecho(`# .dockerignore
node_modules
.git
.env
dist
*.log`)}
${dica('Prefira a forma em lista no CMD (<code>["node", "servidor.js"]</code>). Na forma de texto (<code>CMD node servidor.js</code>), o comando roda dentro de um shell, e o Node não recebe o aviso de desligar quando o contêiner é parado: ele demora 10 segundos e é morto à força.')}
`,
              quiz: [
                {
                  pergunta: 'Por que copiar o package.json e rodar npm ci antes do COPY . .?',
                  opcoes: [
                    'É obrigatório',
                    'Para o cache reaproveitar a instalação quando só o código mudou',
                    'Para a imagem ficar menor'
                  ],
                  certa: 1,
                  explicacao: 'Camadas que não mudaram não são refeitas.'
                },
                {
                  pergunta: 'O que o EXPOSE 3000 faz?',
                  opcoes: [
                    'Publica a porta no computador',
                    'Só documenta a porta que a aplicação usa; quem publica é o -p',
                    'Abre o firewall'
                  ],
                  certa: 1,
                  explicacao: 'Sem -p, ninguém de fora acessa.'
                },
                {
                  pergunta: 'Por que o .env deve estar no .dockerignore?',
                  opcoes: [
                    'Para não levar senhas para dentro da imagem',
                    'Porque o Docker não lê .env',
                    'Para o build ser mais rápido'
                  ],
                  certa: 0,
                  explicacao: 'Quem tiver a imagem conseguiria ler o arquivo.'
                }
              ]
            },
            {
              id: 'docker-compose',
              titulo: 'Docker Compose: vários serviços juntos',
              resumo: 'A API, o banco e a rede entre eles num arquivo só.',
              minutos: 13,
              corpo: `
<p>Uma aplicação de verdade tem várias partes: a API, o banco, talvez um cache. Em vez de vários <code>docker run</code> compridos, o <strong>Compose</strong> descreve tudo num arquivo <code>compose.yaml</code>, e um comando sobe o conjunto:</p>
${trecho(`# compose.yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:\${DB_SENHA}@banco:5432/loja
    depends_on:
      banco:
        condition: service_healthy
    restart: unless-stopped

  banco:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: \${DB_SENHA}
      POSTGRES_DB: loja
    volumes:
      - dados-banco:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10

volumes:
  dados-banco:`)}
<ul>
  <li>Cada serviço é um contêiner. O Compose cria uma rede para eles, e um encontra o outro <strong>pelo nome do serviço</strong>: a API acessa o banco no endereço <code>banco</code>, não em <code>localhost</code>.</li>
  <li><code>\${DB_SENHA}</code> vem de um arquivo <code>.env</code> na mesma pasta (que fica fora do Git).</li>
  <li><code>depends_on</code> com <code>service_healthy</code> espera o banco estar <em>pronto</em> (o <code>healthcheck</code> passar), não só ligado.</li>
  <li><code>restart: unless-stopped</code> religa o serviço se ele cair.</li>
</ul>
${trecho(`docker compose up -d --build   # constrói e sobe tudo em segundo plano
docker compose ps              # o estado de cada serviço
docker compose logs -f api     # os logs de um serviço
docker compose exec banco psql -U postgres -d loja
docker compose down            # para e apaga os contêineres (o volume fica)
docker compose down -v         # ...e apaga também os volumes (os dados!)`)}
${dica('Dentro de um contêiner, <code>localhost</code> é o próprio contêiner. Esse é o erro mais comum de quem começa com Compose: a API tentando falar com o banco em <code>localhost:5432</code>. Use o nome do serviço.')}
`,
              quiz: [
                {
                  pergunta: 'No Compose, como a API acessa o serviço banco?',
                  opcoes: ['Por localhost:5432', 'Pelo nome do serviço: banco:5432', 'Pelo IP do computador'],
                  certa: 1,
                  explicacao: 'Dentro do contêiner, localhost é ele mesmo.'
                },
                {
                  pergunta: 'O que depends_on com condition: service_healthy garante?',
                  opcoes: [
                    'Que o banco nunca cai',
                    'Que a API só sobe depois que o healthcheck do banco passar',
                    'Que os dois usam a mesma imagem'
                  ],
                  certa: 1,
                  explicacao: 'Sem a condição, a API pode ligar antes de o banco aceitar conexões.'
                },
                {
                  pergunta: 'Qual comando apaga também os dados do banco?',
                  opcoes: ['docker compose down', 'docker compose down -v', 'docker compose stop'],
                  certa: 1,
                  explicacao: 'O -v apaga os volumes. Use com cuidado.'
                }
              ]
            },
            {
              id: 'pratica-api-com-banco',
              titulo: 'Prática: a API e o banco com Compose',
              resumo: 'Escreva o Dockerfile e o compose.yaml de uma API em Node com Postgres.',
              minutos: 25,
              corpo: `
<p>Crie uma pasta com este <code>servidor.js</code> e um <code>package.json</code> com a dependência <code>pg</code> (<code>npm init -y</code> e <code>npm install pg</code>):</p>
${trecho(`// servidor.js
const http = require('http');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

http.createServer(async (req, res) => {
  const { rows } = await pool.query('SELECT now() AS agora');
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ ok: true, banco: rows[0].agora }));
}).listen(3000, () => console.log('API na porta 3000'));`)}
<ol>
  <li>Escreva o <code>Dockerfile</code> (Node 22 slim, dependências antes do código, sem as de desenvolvimento) e o <code>.dockerignore</code>.</li>
  <li>Escreva o <code>compose.yaml</code> com os serviços <code>api</code> e <code>banco</code> (Postgres 17 com volume e healthcheck). A senha vem de um <code>.env</code>.</li>
  <li>Suba tudo e abra <code>http://localhost:3000</code>: deve aparecer a hora vinda do banco.</li>
  <li>Mude uma linha do <code>servidor.js</code> e reconstrua só a API.</li>
</ol>
${resposta(`${trecho(`# Dockerfile
FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "servidor.js"]

# .dockerignore
node_modules
.git
.env

# .env  (fora do Git)
DB_SENHA=senha-local

# compose.yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://postgres:\${DB_SENHA}@banco:5432/loja
    depends_on:
      banco:
        condition: service_healthy
  banco:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: \${DB_SENHA}
      POSTGRES_DB: loja
    volumes: ["dados:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10
volumes:
  dados:`)}
${trecho(`# 3
docker compose up -d --build
curl http://localhost:3000

# 4
docker compose up -d --build api`)}
<p>No passo 4, o build é rápido porque a camada do <code>npm ci</code> veio do cache: só a cópia do código mudou.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que o endereço do banco na DATABASE_URL é banco e não localhost?',
                  opcoes: [
                    'Porque é o nome do serviço no Compose, que a rede interna resolve',
                    'Porque localhost não existe no Linux',
                    'Por segurança'
                  ],
                  certa: 0,
                  explicacao: 'Na rede do Compose, cada serviço é encontrado pelo nome.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Imagens pequenas e seguras, e o caminho até a produção.',
      modulos: [
        {
          titulo: 'Para produção',
          itens: [
            {
              id: 'imagens-menores-e-seguras',
              titulo: 'Imagens menores e mais seguras',
              resumo: 'Build em estágios, usuário sem privilégios, versões fixas e varredura.',
              minutos: 13,
              corpo: `
<h2>Build em estágios</h2>
<p>Para gerar um site com Vite ou compilar TypeScript, você precisa do Node e de todas as dependências de desenvolvimento. Para <em>servir</em> o resultado, não. O <strong>multi-stage build</strong> usa uma imagem para construir e copia só o resultado para uma imagem final enxuta:</p>
${trecho(`# Estágio 1: constrói
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: só serve os arquivos gerados
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80`)}
<p>A imagem final tem uns 50 MB, em vez de quase 1 GB com o Node e o <code>node_modules</code>. Menos coisa dentro também significa menos falhas de segurança possíveis.</p>

<h2>Não rode como root</h2>
<p>Por padrão, o processo do contêiner roda como <code>root</code>. Se alguém explorar uma falha na sua aplicação, ganha poderes de administrador dentro do contêiner. As imagens oficiais do Node já têm um usuário comum, o <code>node</code>:</p>
${trecho(`FROM node:22-slim
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node . .
USER node
CMD ["node", "servidor.js"]`)}

<h2>Outras boas práticas</h2>
<ul>
  <li><strong>Versões fixas</strong> na base (<code>node:22.11-slim</code>) e atualização planejada, não por acaso.</li>
  <li><strong>Nada de segredos na imagem</strong>: nem em <code>COPY</code>, nem em <code>ENV</code>, nem em <code>ARG</code>. Qualquer um com a imagem lê com <code>docker history</code>. Segredos entram em tempo de execução, por variáveis de ambiente ou pelo gerenciador de segredos da hospedagem.</li>
  <li><strong>Varredura</strong>: <code>docker scout cves minha-api:1.0</code> lista as vulnerabilidades conhecidas dos pacotes da imagem.</li>
  <li><strong>Um processo por contêiner</strong>: a API num, o banco noutro. Fica mais fácil escalar, atualizar e ver os logs.</li>
</ul>
${dica('<code>docker image ls</code> mostra o tamanho de cada imagem, e <code>docker history minha-api:1.0</code> mostra o peso de cada camada: o jeito mais rápido de descobrir o que está inchando a imagem.')}
`,
              quiz: [
                {
                  pergunta: 'Qual a vantagem do build em estágios?',
                  opcoes: [
                    'O build fica mais lento',
                    'A imagem final leva só o resultado, sem as ferramentas de construção',
                    'Permite usar dois sistemas operacionais'
                  ],
                  certa: 1,
                  explicacao: 'Menor, mais rápida de baixar e com menos coisa vulnerável.'
                },
                {
                  pergunta: 'Para que serve USER node no Dockerfile?',
                  opcoes: [
                    'Instalar o Node',
                    'Rodar a aplicação com um usuário sem privilégios de administrador',
                    'Criar um volume'
                  ],
                  certa: 1,
                  explicacao: 'Se a aplicação for invadida, o estrago fica limitado.'
                },
                {
                  pergunta: 'Uma senha em ENV no Dockerfile fica protegida?',
                  opcoes: ['Sim', 'Não: quem tiver a imagem consegue ler', 'Só em imagens privadas'],
                  certa: 1,
                  explicacao: 'Segredos entram quando o contêiner roda, nunca no build.'
                }
              ]
            },
            {
              id: 'do-computador-para-a-nuvem',
              titulo: 'Do computador para a nuvem',
              resumo: 'Registro, build no GitHub Actions e onde rodar os contêineres.',
              minutos: 12,
              corpo: `
<h2>Publicar a imagem</h2>
<p>Para outro computador rodar a sua imagem, ela vai para um registro. O do GitHub (<code>ghcr.io</code>) fica junto do código:</p>
${trecho(`docker tag minha-api:1.0 ghcr.io/seu-usuario/minha-api:1.0
docker login ghcr.io       # usuário do GitHub e um token com permissão de pacotes
docker push ghcr.io/seu-usuario/minha-api:1.0`)}

<h2>Build automático</h2>
<p>Melhor ainda: o GitHub Actions constrói e publica a cada push na main, sem passo manual (veja a trilha de <a href="../github-actions/">GitHub Actions</a>):</p>
${trecho(`# .github/workflows/imagem.yml
name: Imagem
on:
  push:
    branches: [main]
permissions:
  contents: read
  packages: write
jobs:
  publicar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}`)}
<p>Marcar a imagem com o código do commit (<code>github.sha</code>) deixa claro qual versão está rodando e facilita voltar para a anterior.</p>

<h2>Onde rodar</h2>
<ul>
  <li><strong>Plataformas que rodam contêineres</strong> (Google Cloud Run, Render, Fly.io, Railway, Azure Container Apps): você aponta a imagem e elas cuidam de HTTPS, escala e reinício. Algumas desligam o contêiner sem uso e cobram só pelo tempo ligado.</li>
  <li><strong>Um servidor próprio</strong> (uma VPS) com Docker e o mesmo <code>compose.yaml</code>: mais controle e custo fixo, mas atualizações, backups e segurança ficam com você.</li>
  <li><strong>Kubernetes</strong>: para muitos serviços e equipes grandes. Para um projeto pequeno, costuma ser complexidade demais.</li>
</ul>

<h2>Em produção</h2>
<ul>
  <li>Logs vão para a saída padrão (<code>console.log</code>); a plataforma recolhe.</li>
  <li>Uma rota de saúde (<code>/saude</code>) para a plataforma saber se o contêiner está bem e reiniciá-lo se não estiver.</li>
  <li>Banco de dados gerenciado (o da própria nuvem), com backup automático, costuma ser melhor que um contêiner de banco cuidado à mão.</li>
</ul>
${dica('Sites estáticos (como este portfólio) não precisam de Docker: o GitHub Pages, a Netlify ou a Vercel publicam a pasta direto. Docker brilha quando há um servidor rodando: uma API, um back-end com banco, um serviço com dependências do sistema.')}
`,
              quiz: [
                {
                  pergunta: 'Por que marcar a imagem com o código do commit?',
                  opcoes: [
                    'É obrigatório no GHCR',
                    'Saber exatamente qual versão está rodando e poder voltar para a anterior',
                    'Para a imagem ficar menor'
                  ],
                  certa: 1,
                  explicacao: 'latest não diz nada sobre a versão; o sha diz.'
                },
                {
                  pergunta: 'Um site só com HTML, CSS e JS precisa de Docker?',
                  opcoes: ['Sim, sempre', 'Não: uma hospedagem estática publica a pasta direto', 'Só se tiver imagens'],
                  certa: 1,
                  explicacao: 'Docker vale quando há um servidor rodando.'
                },
                {
                  pergunta: 'Para onde vão os logs de um contêiner em produção?',
                  opcoes: [
                    'Para um arquivo dentro do contêiner',
                    'Para a saída padrão, que a plataforma recolhe',
                    'Para o e-mail do administrador'
                  ],
                  certa: 1,
                  explicacao: 'Arquivos dentro do contêiner somem quando ele é recriado.'
                }
              ]
            },
            {
              id: 'pratica-imagem-de-producao',
              titulo: 'Prática: a imagem de produção',
              resumo: 'Multi-stage, usuário sem privilégios e publicação automática no GHCR.',
              minutos: 25,
              corpo: `
<p>Use um projeto React ou Vite qualquer (<code>npm create vite@latest meu-site</code> serve).</p>
<ol>
  <li>Escreva um <code>Dockerfile</code> em dois estágios: o primeiro roda <code>npm ci</code> e <code>npm run build</code>; o segundo, a partir de <code>nginx:1.27-alpine</code>, só serve a pasta <code>dist</code>.</li>
  <li>Construa, rode na porta 8080 e compare o tamanho da imagem com a <code>node:22-slim</code>.</li>
  <li>Rode a varredura de vulnerabilidades na imagem.</li>
  <li>Escreva o workflow que publica a imagem no GHCR a cada push na <code>main</code>, marcada com o sha do commit.</li>
</ol>
${resposta(`${trecho(`# 1. Dockerfile
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# 2
docker build -t meu-site:1.0 .
docker run -d -p 8080:80 --name meu-site meu-site:1.0
docker image ls     # meu-site fica na casa dos 50 MB; node:22-slim passa de 200 MB

# 3
docker scout cves meu-site:1.0`)}
<p>O passo 4 é o workflow da aula anterior, com <code>permissions: packages: write</code>, o <code>docker/login-action</code> e o <code>docker/build-push-action</code> com <code>tags: ghcr.io/\${{ github.repository }}:\${{ github.sha }}</code>.</p>
<p>A imagem do nginx já roda os processos que atendem pedidos com um usuário sem privilégios. Para ir além, existe a variante <code>nginxinc/nginx-unprivileged</code>, que nem o processo principal roda como root (ela usa a porta 8080 em vez da 80).</p>`)}
`,
              quiz: [
                {
                  pergunta: 'O que COPY --from=build faz?',
                  opcoes: [
                    'Baixa uma imagem chamada build',
                    'Copia arquivos do estágio build para o estágio atual',
                    'Copia do computador'
                  ],
                  certa: 1,
                  explicacao: 'É assim que só o resultado do build chega à imagem final.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
