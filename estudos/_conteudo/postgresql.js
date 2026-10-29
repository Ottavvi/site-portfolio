// Trilha de PostgreSQL. Sem editor: os comandos são para rodar no psql ou no pgAdmin, com o PostgreSQL instalado
// ou num contêiner Docker. Complementa as trilhas de SQLite e SQL para análise com o que é próprio de um banco de
// servidor. Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { trecho, dica, resposta } = require('./ajuda');

module.exports = {
  id: 'postgresql',
  area: 'Back-end e dados',
  titulo: 'PostgreSQL',
  sigla: 'PG',
  resumo: 'O banco de dados de servidor mais querido: modelagem, índices, transações, JSON e permissões.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Instalar, psql, tabelas com bons tipos e restrições.',
      modulos: [
        {
          titulo: 'Primeiros passos',
          itens: [
            {
              id: 'instalar-e-psql',
              titulo: 'Instalar e usar o psql',
              resumo: 'Docker ou instalador, conectar, bancos, esquemas e os comandos de barra.',
              minutos: 9,
              corpo: `
<p>O <strong>PostgreSQL</strong> (ou Postgres) é um banco de dados relacional gratuito, robusto e cheio de recursos. Diferente do SQLite, que é um arquivo usado por um programa só, o Postgres é um <strong>servidor</strong>: muitos usuários e aplicações acessam ao mesmo tempo, com permissões, conexões pela rede e backups. Supabase, Neon e a maioria das hospedagens oferecem Postgres pronto.</p>

<h2>Subir um servidor</h2>
${trecho(`# Com Docker (o jeito mais limpo de estudar)
docker run --name pg -e POSTGRES_PASSWORD=segredo -p 5432:5432 -d postgres:17
docker exec -it pg psql -U postgres`)}
<p>Sem Docker, use o instalador de postgresql.org (no Windows, ele traz o <strong>pgAdmin</strong>, uma interface gráfica).</p>

<h2>O psql</h2>
${trecho(`CREATE DATABASE pousada;
\\c pousada            -- conecta no banco
\\l                    -- lista os bancos
\\dt                   -- lista as tabelas
\\d reservas           -- estrutura de uma tabela
\\x                    -- alterna a exibição vertical (bom para linhas largas)
\\timing               -- mostra quanto cada consulta levou
\\q                    -- sai`)}
<p>Comandos que começam com <code>\\</code> são do psql; o resto é SQL e termina com <code>;</code>. Esquecer o ponto e vírgula deixa o psql esperando a continuação (o prompt muda de <code>=#</code> para <code>-#</code>).</p>

<h2>Bancos e esquemas</h2>
<p>Um servidor tem vários <strong>bancos</strong>; cada banco tem <strong>esquemas</strong> (pastas de tabelas). O padrão é <code>public</code>. Dá para separar, por exemplo, <code>app.reservas</code> e <code>relatorios.ocupacao_mensal</code>.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual a principal diferença entre SQLite e PostgreSQL?',
                  opcoes: [
                    'Só o nome',
                    'O Postgres é um servidor acessado por muitos usuários e aplicações ao mesmo tempo',
                    'O SQLite não usa SQL'
                  ],
                  certa: 1,
                  explicacao: 'O SQLite é um arquivo embutido no programa.'
                },
                {
                  pergunta: 'O que faz \\d reservas no psql?',
                  opcoes: ['Apaga a tabela', 'Mostra a estrutura da tabela', 'Baixa os dados'],
                  certa: 1,
                  explicacao: 'Colunas, tipos, índices e restrições.'
                },
                {
                  pergunta: 'O psql ficou esperando depois do comando. O que faltou provavelmente?',
                  opcoes: ['O ponto e vírgula', 'Reiniciar o servidor', 'Aspas'],
                  certa: 0,
                  explicacao: 'O SQL só é enviado quando termina com ;.'
                }
              ]
            },
            {
              id: 'tabelas-e-tipos',
              titulo: 'Tabelas, tipos e restrições',
              resumo: 'identity, text, numeric, timestamptz, chaves, CHECK, UNIQUE e daterange.',
              minutos: 13,
              corpo: `
${trecho(`CREATE TABLE quartos (
    id          integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        text NOT NULL UNIQUE,
    diaria      numeric(10, 2) NOT NULL CHECK (diaria > 0),
    capacidade  smallint NOT NULL DEFAULT 2 CHECK (capacidade BETWEEN 1 AND 10)
);

CREATE TABLE hospedes (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        text NOT NULL,
    email       text NOT NULL UNIQUE,
    criado_em   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE reservas (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quarto_id   integer NOT NULL REFERENCES quartos(id),
    hospede_id  bigint NOT NULL REFERENCES hospedes(id) ON DELETE CASCADE,
    entrada     date NOT NULL,
    saida       date NOT NULL,
    status      text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada')),
    CHECK (saida > entrada)
);`)}

<h2>Escolher bem os tipos</h2>
<ul>
  <li><code>GENERATED ALWAYS AS IDENTITY</code>: o jeito atual de criar ids automáticos (no lugar do antigo <code>serial</code>).</li>
  <li><code>text</code> para textos. No Postgres, não há ganho em <code>varchar(255)</code>; se quiser limite, use um <code>CHECK (length(nome) &lt;= 100)</code>.</li>
  <li><code>numeric(10,2)</code> para dinheiro: exato. Nunca <code>float</code> ou <code>real</code>.</li>
  <li><code>timestamptz</code> (com fuso) para momentos. O Postgres guarda em UTC e converte para o fuso da sessão.</li>
  <li><code>date</code> para datas sem hora, <code>boolean</code>, <code>uuid</code>, <code>jsonb</code> e arrays (<code>text[]</code>) também existem.</li>
</ul>
${dica('Coloque as regras no banco (NOT NULL, CHECK, UNIQUE, REFERENCES), não só na aplicação. O banco é a última linha de defesa: ele recusa dado inválido venha de onde vier, inclusive de um script feito às pressas.')}
${trecho(`INSERT INTO quartos (nome, diaria, capacidade) VALUES
    ('Standard', 180, 2), ('Família', 290, 4), ('Suíte Mar', 320, 2)
RETURNING id, nome;           -- devolve o que foi inserido, com os ids gerados`)}
`,
              quiz: [
                {
                  pergunta: 'Qual tipo usar para valores em dinheiro no Postgres?',
                  opcoes: ['float', 'numeric', 'text'],
                  certa: 1,
                  explicacao: 'numeric é exato; float tem erros de arredondamento.'
                },
                {
                  pergunta: 'O que faz ON DELETE CASCADE em hospede_id?',
                  opcoes: [
                    'Impede apagar o hóspede',
                    'Apaga as reservas quando o hóspede é apagado',
                    'Copia as reservas'
                  ],
                  certa: 1,
                  explicacao: 'Sem ele, apagar um hóspede com reservas daria erro.'
                },
                {
                  pergunta: 'Para que serve o RETURNING?',
                  opcoes: [
                    'Desfazer o insert',
                    'Devolver as linhas inseridas, com valores gerados como o id',
                    'Repetir o comando'
                  ],
                  certa: 1,
                  explicacao: 'Evita uma segunda consulta para descobrir o id.'
                }
              ]
            },
            {
              id: 'pratica-modelar-pousada',
              titulo: 'Prática: modelar e popular o banco',
              resumo: 'Criar as tabelas, inserir dados e testar as restrições.',
              minutos: 20,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie as tabelas <code>quartos</code>, <code>hospedes</code> e <code>reservas</code> da aula anterior.</li>
  <li>Insira 3 quartos, 4 hóspedes e 6 reservas (use <code>RETURNING</code> para ver os ids).</li>
  <li>Tente inserir: uma reserva com saída antes da entrada, um quarto com diária negativa, um hóspede com e-mail repetido. Leia as mensagens de erro.</li>
  <li>Liste as reservas com o nome do hóspede, do quarto e o valor total (diária × noites).</li>
</ol>
${resposta(`
${trecho(`INSERT INTO hospedes (nome, email) VALUES
    ('Ana', 'ana@exemplo.com'), ('Bruno', 'bruno@exemplo.com'),
    ('Carla', 'carla@exemplo.com'), ('Davi', 'davi@exemplo.com');

INSERT INTO reservas (quarto_id, hospede_id, entrada, saida, status) VALUES
    (1, 1, '2026-12-20', '2026-12-24', 'confirmada'),
    (2, 2, '2026-12-22', '2026-12-27', 'confirmada'),
    (3, 3, '2026-12-28', '2027-01-02', 'pendente'),
    (1, 4, '2027-01-05', '2027-01-07', 'confirmada'),
    (2, 1, '2027-01-10', '2027-01-12', 'cancelada'),
    (3, 2, '2027-01-15', '2027-01-20', 'confirmada');

-- Devem falhar:
INSERT INTO reservas (quarto_id, hospede_id, entrada, saida) VALUES (1, 1, '2026-12-10', '2026-12-05');
-- ERROR: new row for relation "reservas" violates check constraint "reservas_check"
INSERT INTO quartos (nome, diaria) VALUES ('Barato', -10);
INSERT INTO hospedes (nome, email) VALUES ('Outra Ana', 'ana@exemplo.com');

SELECT h.nome AS hospede, q.nome AS quarto, r.entrada, r.saida,
       r.saida - r.entrada AS noites,
       q.diaria * (r.saida - r.entrada) AS total
FROM reservas r
JOIN hospedes h ON h.id = r.hospede_id
JOIN quartos q ON q.id = r.quarto_id
WHERE r.status <> 'cancelada'
ORDER BY r.entrada;`)}
<p>Subtrair duas datas (<code>date - date</code>) dá o número de dias como inteiro. Dê nomes às restrições (<code>CONSTRAINT saida_depois_da_entrada CHECK (...)</code>) para mensagens de erro mais claras.</p>`)}
`,
              quiz: [
                {
                  pergunta: "O que date '2026-12-24' - date '2026-12-20' devolve?",
                  opcoes: ['4', 'Um intervalo de texto', 'Erro'],
                  certa: 0,
                  explicacao: 'A diferença entre duas datas é um inteiro de dias.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Índices, EXPLAIN, transações e consultas avançadas.',
      modulos: [
        {
          titulo: 'Desempenho e consistência',
          itens: [
            {
              id: 'indices-e-explain',
              titulo: 'Índices e EXPLAIN',
              resumo: 'Quando criar índice, B-tree, índice composto, parcial e ler o plano.',
              minutos: 14,
              corpo: `
<p>Sem índice, para achar as reservas de um hóspede o banco lê a tabela inteira (<strong>Seq Scan</strong>). Com um índice, ele vai direto às linhas, como o índice remissivo de um livro.</p>
${trecho(`EXPLAIN ANALYZE
SELECT * FROM reservas WHERE hospede_id = 42;
-- Seq Scan on reservas  (actual time=0.01..35.2 rows=8 loops=1)
--   Filter: (hospede_id = 42)
--   Rows Removed by Filter: 499992

CREATE INDEX reservas_hospede_idx ON reservas (hospede_id);

EXPLAIN ANALYZE
SELECT * FROM reservas WHERE hospede_id = 42;
-- Index Scan using reservas_hospede_idx on reservas  (actual time=0.02..0.05 rows=8 loops=1)`)}
<p><code>EXPLAIN</code> mostra o plano que o banco escolheu; com <code>ANALYZE</code>, ele executa de verdade e mostra os tempos reais.</p>

<h2>Que índices criar</h2>
<ul>
  <li>Chaves primárias e <code>UNIQUE</code> já têm índice. <strong>Chaves estrangeiras não</strong>: crie para as colunas usadas em JOIN (<code>reservas.hospede_id</code>, <code>reservas.quarto_id</code>).</li>
  <li>Colunas muito usadas em <code>WHERE</code> e <code>ORDER BY</code>.</li>
  <li><strong>Composto</strong>: <code>(quarto_id, entrada)</code> serve para filtrar por quarto e por quarto + data, mas não só por data. A ordem das colunas importa.</li>
  <li><strong>Parcial</strong>: <code>CREATE INDEX ... WHERE status = 'pendente'</code> indexa só o que interessa.</li>
  <li><strong>De expressão</strong>: <code>CREATE INDEX ON hospedes (lower(email))</code> para buscas que usam <code>lower(email) = ...</code>.</li>
</ul>
${dica('Índice não é de graça: ocupa espaço e deixa INSERT e UPDATE mais lentos. Crie a partir de consultas reais lentas (veja a extensão <code>pg_stat_statements</code>), não "por garantia" em toda coluna.')}
`,
              quiz: [
                {
                  pergunta: 'O Postgres cria índice automaticamente para chaves estrangeiras?',
                  opcoes: ['Sim', 'Não', 'Só se a tabela for grande'],
                  certa: 1,
                  explicacao: 'Só para PRIMARY KEY e UNIQUE.'
                },
                {
                  pergunta: 'Um índice em (quarto_id, entrada) ajuda num WHERE só com entrada?',
                  opcoes: ['Sim, sempre', 'Em geral não: a primeira coluna do índice é quarto_id', 'Só no domingo'],
                  certa: 1,
                  explicacao: 'Índices compostos servem a partir da primeira coluna.'
                },
                {
                  pergunta: 'Qual a diferença entre EXPLAIN e EXPLAIN ANALYZE?',
                  opcoes: ['Nenhuma', 'ANALYZE executa a consulta e mostra os tempos reais', 'ANALYZE cria índices'],
                  certa: 1,
                  explicacao:
                    'Cuidado: com ANALYZE, um DELETE apaga de verdade (use dentro de uma transação com ROLLBACK).'
                }
              ]
            },
            {
              id: 'transacoes-e-concorrencia',
              titulo: 'Transações e concorrência',
              resumo: 'BEGIN, COMMIT, ROLLBACK, isolamento, SELECT FOR UPDATE e restrição de exclusão.',
              minutos: 14,
              corpo: `
${trecho(`BEGIN;
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;      -- ou ROLLBACK; para desfazer tudo`)}
<p>Uma <strong>transação</strong> é tudo ou nada (atomicidade). Se der erro no meio, nada é gravado. Fora de um <code>BEGIN</code>, cada comando é uma transação sozinho.</p>

<h2>Dois usuários ao mesmo tempo</h2>
<p>O problema clássico: duas pessoas reservam o mesmo quarto na mesma data. As duas consultam ("está livre?"), as duas veem que sim e as duas inserem. Soluções:</p>
${trecho(`-- 1) Travar a linha do quarto enquanto decide
BEGIN;
SELECT * FROM quartos WHERE id = 3 FOR UPDATE;   -- a segunda transação espera aqui
SELECT count(*) FROM reservas
 WHERE quarto_id = 3 AND status <> 'cancelada'
   AND entrada < '2026-12-26' AND saida > '2026-12-23';
-- se for 0:
INSERT INTO reservas (...) VALUES (...);
COMMIT;

-- 2) Melhor ainda: o banco proíbe a sobreposição sozinho
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE reservas ADD CONSTRAINT sem_sobreposicao
    EXCLUDE USING gist (quarto_id WITH =, daterange(entrada, saida) WITH &&)
    WHERE (status <> 'cancelada');`)}
<p>A <strong>restrição de exclusão</strong> diz: não podem existir duas linhas com o mesmo quarto e períodos que se sobreponham (<code>&amp;&amp;</code>). Não importa quantas aplicações gravem ao mesmo tempo: a segunda recebe erro. O <code>daterange(entrada, saida)</code> inclui a entrada e exclui a saída, então quem sai no dia 24 não conflita com quem entra no dia 24.</p>

<h2>Níveis de isolamento</h2>
<p>O padrão do Postgres é <code>READ COMMITTED</code>: cada comando vê o que já foi confirmado no momento em que começa. Para regras que dependem de ler e depois escrever, <code>BEGIN ISOLATION LEVEL SERIALIZABLE</code> faz o banco abortar uma das transações em caso de conflito; a aplicação precisa então tentar de novo.</p>
`,
              quiz: [
                {
                  pergunta: 'O que acontece se um comando falhar no meio de uma transação?',
                  opcoes: ['O que veio antes fica gravado', 'Nada é gravado, a transação é desfeita', 'O banco trava'],
                  certa: 1,
                  explicacao: 'Atomicidade: tudo ou nada.'
                },
                {
                  pergunta: 'O que SELECT ... FOR UPDATE faz?',
                  opcoes: [
                    'Atualiza a linha',
                    'Trava a linha até o fim da transação; outros que queiram travá-la esperam',
                    'Nada além de um SELECT'
                  ],
                  certa: 1,
                  explicacao: 'Serializa quem disputa o mesmo recurso.'
                },
                {
                  pergunta: 'Qual a vantagem da restrição EXCLUDE para reservas?',
                  opcoes: [
                    'Deixa as consultas mais rápidas',
                    'O próprio banco impede períodos sobrepostos, mesmo com acessos simultâneos',
                    'Apaga reservas antigas'
                  ],
                  certa: 1,
                  explicacao: 'A regra vale independentemente da aplicação.'
                }
              ]
            },
            {
              id: 'pratica-relatorios',
              titulo: 'Prática: relatórios com CTE e janelas',
              resumo: 'Ocupação por mês, ranking de hóspedes e generate_series.',
              minutos: 30,
              corpo: `
<p>Use as tabelas da prática anterior.</p>
<h2>Tarefas</h2>
<ol>
  <li>Faturamento por mês de entrada (reservas não canceladas), com o acumulado do ano.</li>
  <li>Ranking dos hóspedes por valor gasto, com a posição (<code>RANK</code>).</li>
  <li>Para cada dia de dezembro de 2026, quantos quartos estão ocupados (use <code>generate_series</code>).</li>
  <li>Os quartos que não têm nenhuma reserva em janeiro de 2027.</li>
</ol>
${resposta(`
${trecho(`-- 1
WITH validas AS (
    SELECT r.*, q.diaria * (r.saida - r.entrada) AS valor
    FROM reservas r JOIN quartos q ON q.id = r.quarto_id
    WHERE r.status <> 'cancelada'
)
SELECT date_trunc('month', entrada)::date AS mes,
       sum(valor) AS faturamento,
       sum(sum(valor)) OVER (PARTITION BY date_trunc('year', entrada) ORDER BY date_trunc('month', entrada)) AS acumulado
FROM validas
GROUP BY date_trunc('year', entrada), date_trunc('month', entrada)
ORDER BY mes;

-- 2
SELECT h.nome,
       sum(q.diaria * (r.saida - r.entrada)) AS gasto,
       rank() OVER (ORDER BY sum(q.diaria * (r.saida - r.entrada)) DESC) AS posicao
FROM reservas r
JOIN hospedes h ON h.id = r.hospede_id
JOIN quartos q ON q.id = r.quarto_id
WHERE r.status <> 'cancelada'
GROUP BY h.nome;

-- 3
SELECT d::date AS dia, count(r.id) AS ocupados
FROM generate_series('2026-12-01'::date, '2026-12-31', interval '1 day') AS d
LEFT JOIN reservas r
       ON r.status <> 'cancelada' AND d >= r.entrada AND d < r.saida
GROUP BY d
ORDER BY d;

-- 4
SELECT q.nome
FROM quartos q
WHERE NOT EXISTS (
    SELECT 1 FROM reservas r
    WHERE r.quarto_id = q.id AND r.status <> 'cancelada'
      AND r.entrada < '2027-02-01' AND r.saida > '2027-01-01'
);`)}
<p>No item 1, <code>sum(sum(valor)) OVER (...)</code> é uma função de janela sobre o resultado já agrupado. No item 3, o <code>LEFT JOIN</code> mantém os dias sem nenhuma reserva (com 0), e a condição <code>d &lt; r.saida</code> não conta o dia da saída como ocupado.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que LEFT JOIN em vez de JOIN no relatório de ocupação diária?',
                  opcoes: [
                    'É mais rápido',
                    'Para os dias sem reserva aparecerem com 0',
                    'O JOIN não funciona com datas'
                  ],
                  certa: 1,
                  explicacao: 'Com JOIN, os dias vazios sumiriam do resultado.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'JSONB, busca textual, funções, permissões e operação.',
      modulos: [
        {
          titulo: 'Recursos do Postgres',
          itens: [
            {
              id: 'jsonb-e-busca',
              titulo: 'JSONB e busca textual',
              resumo: 'Guardar documentos, consultar campos, índice GIN e full-text em português.',
              minutos: 14,
              corpo: `
<h2>JSONB</h2>
<p>O tipo <code>jsonb</code> guarda documentos JSON, consultáveis e indexáveis. Útil para dados de formato variável: preferências, respostas de APIs, atributos que mudam por produto.</p>
${trecho(`ALTER TABLE hospedes ADD COLUMN preferencias jsonb NOT NULL DEFAULT '{}';

UPDATE hospedes SET preferencias = '{"cama": "casal", "andar": "alto", "alergias": ["lactose"]}'
WHERE email = 'ana@exemplo.com';

SELECT nome, preferencias->>'cama' AS cama          -- ->> devolve texto; -> devolve jsonb
FROM hospedes
WHERE preferencias @> '{"andar": "alto"}';            -- @> "contém"

SELECT nome FROM hospedes WHERE preferencias->'alergias' ? 'lactose';

UPDATE hospedes SET preferencias = preferencias || '{"vegano": true}' WHERE id = 1;   -- mescla

CREATE INDEX hospedes_pref_idx ON hospedes USING gin (preferencias);   -- acelera @> e ?`)}
${dica('JSONB é ótimo para o que varia; o que é fixo e consultado sempre (nome, e-mail, datas, valores) continua melhor em colunas normais, com tipos e restrições.')}

<h2>Busca textual</h2>
<p><code>LIKE '%praia%'</code> não usa índice comum e não entende plural nem acentos. A busca textual do Postgres entende o idioma:</p>
${trecho(`CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE quartos ADD COLUMN descricao text;
ALTER TABLE quartos ADD COLUMN busca tsvector
    GENERATED ALWAYS AS (to_tsvector('portuguese', nome || ' ' || coalesce(descricao, ''))) STORED;
CREATE INDEX quartos_busca_idx ON quartos USING gin (busca);

SELECT nome, ts_rank(busca, consulta) AS relevancia
FROM quartos, websearch_to_tsquery('portuguese', 'vista mar varanda') AS consulta
WHERE busca @@ consulta
ORDER BY relevancia DESC;`)}
<p>O dicionário <code>portuguese</code> reduz as palavras ao radical: "varandas" encontra "varanda". <code>websearch_to_tsquery</code> aceita a sintaxe que as pessoas usam em buscadores (aspas, <code>-palavra</code>, <code>or</code>).</p>
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre -> e ->> no JSONB?',
                  opcoes: ['Nenhuma', '-> devolve jsonb; ->> devolve texto', '->> é mais lento'],
                  certa: 1,
                  explicacao: 'Use ->> para comparar com texto ou exibir.'
                },
                {
                  pergunta: 'Que tipo de índice acelera consultas @> em jsonb e busca textual?',
                  opcoes: ['B-tree', 'GIN', 'Hash'],
                  certa: 1,
                  explicacao: 'GIN indexa os elementos de dentro do documento ou do tsvector.'
                },
                {
                  pergunta: 'Por que a busca textual acha "varanda" ao procurar "varandas"?',
                  opcoes: ['Por sorte', 'O dicionário do idioma reduz as palavras ao radical', 'Porque usa LIKE'],
                  certa: 1,
                  explicacao: 'É o stemming.'
                }
              ]
            },
            {
              id: 'funcoes-permissoes-operacao',
              titulo: 'Funções, permissões e operação',
              resumo: 'PL/pgSQL, gatilhos, views, papéis, RLS, backup e conexões.',
              minutos: 15,
              corpo: `
<h2>Funções e gatilhos</h2>
${trecho(`ALTER TABLE reservas ADD COLUMN atualizado_em timestamptz NOT NULL DEFAULT now();

CREATE FUNCTION marcar_atualizacao() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.atualizado_em := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER reservas_atualizacao
BEFORE UPDATE ON reservas
FOR EACH ROW EXECUTE FUNCTION marcar_atualizacao();`)}
<p>O corpo da função vai entre <code>$$</code>. Gatilhos são ótimos para auditoria e campos automáticos; regras de negócio complexas costumam ficar mais fáceis de manter na aplicação.</p>

<h2>Views</h2>
${trecho(`CREATE VIEW reservas_detalhadas AS
SELECT r.id, h.nome AS hospede, q.nome AS quarto, r.entrada, r.saida, r.status,
       q.diaria * (r.saida - r.entrada) AS total
FROM reservas r JOIN hospedes h ON h.id = r.hospede_id JOIN quartos q ON q.id = r.quarto_id;

CREATE MATERIALIZED VIEW ocupacao_mensal AS SELECT ...;   -- guarda o resultado
REFRESH MATERIALIZED VIEW ocupacao_mensal;                 -- recalcula (ex.: toda noite)`)}

<h2>Permissões</h2>
${trecho(`CREATE ROLE app LOGIN PASSWORD 'troque-isto';
GRANT CONNECT ON DATABASE pousada TO app;
GRANT SELECT, INSERT, UPDATE ON reservas, hospedes TO app;
GRANT SELECT ON quartos TO app;

CREATE ROLE leitura_bi LOGIN PASSWORD '...';
GRANT SELECT ON reservas_detalhadas TO leitura_bi;    -- o BI só vê a view

-- Row Level Security: cada hóspede só enxerga as próprias reservas
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
CREATE POLICY so_as_minhas ON reservas
    USING (hospede_id = current_setting('app.hospede_id')::bigint);`)}
${dica('A aplicação nunca deve conectar como <code>postgres</code> (o superusuário). Um papel com só as permissões necessárias limita o estrago de um bug ou de uma injeção de SQL.')}

<h2>Operação</h2>
${trecho(`pg_dump -Fc -d pousada -f pousada.dump      # backup em formato compacto
pg_restore -d pousada_teste pousada.dump    # restaurar (teste os backups!)

-- Conexões: cada uma custa memória no servidor.
-- Aplicações com muitos acessos usam um pool (PgBouncer, ou o pool da biblioteca da linguagem).
SELECT pid, usename, state, query_start, query FROM pg_stat_activity WHERE datname = 'pousada';`)}
<p>O <strong>VACUUM</strong> automático (autovacuum) recupera o espaço de linhas apagadas e atualizadas; deixe-o ligado.</p>
`,
              quiz: [
                {
                  pergunta: 'Qual a diferença entre VIEW e MATERIALIZED VIEW?',
                  opcoes: [
                    'Nenhuma',
                    'A view roda a consulta a cada uso; a materializada guarda o resultado até o REFRESH',
                    'A materializada é só para JSON'
                  ],
                  certa: 1,
                  explicacao: 'Materializada é rápida de ler, mas pode estar desatualizada.'
                },
                {
                  pergunta: 'Por que a aplicação não deve usar o usuário postgres?',
                  opcoes: [
                    'É mais lento',
                    'Superusuário pode tudo; um bug ou ataque teria acesso total',
                    'O postgres não aceita conexões externas'
                  ],
                  certa: 1,
                  explicacao: 'Princípio do menor privilégio.'
                },
                {
                  pergunta: 'O que o Row Level Security faz?',
                  opcoes: [
                    'Criptografa as linhas',
                    'Filtra quais linhas cada usuário pode ver ou alterar',
                    'Faz backup das linhas'
                  ],
                  certa: 1,
                  explicacao: 'É a base da segurança em serviços como o Supabase.'
                }
              ]
            },
            {
              id: 'pratica-auditoria',
              titulo: 'Prática: auditoria e acesso restrito',
              resumo: 'Gatilho que registra mudanças, papel só de leitura e backup testado.',
              minutos: 35,
              corpo: `
<h2>Tarefas</h2>
<ol>
  <li>Crie a tabela <code>auditoria</code> (id, tabela, operacao, quando, usuario, antes jsonb, depois jsonb).</li>
  <li>Escreva uma função de gatilho genérica que registre INSERT, UPDATE e DELETE de qualquer tabela, guardando a linha antes e depois em JSONB.</li>
  <li>Ligue o gatilho em <code>reservas</code>. Altere o status de uma reserva e veja o registro.</li>
  <li>Crie o papel <code>relatorios</code> que só consegue ler a view <code>reservas_detalhadas</code>. Confira que ele não lê <code>hospedes</code>.</li>
  <li>Faça um <code>pg_dump</code>, restaure num banco novo e confira a contagem de reservas.</li>
</ol>
${resposta(`
${trecho(`CREATE TABLE auditoria (
    id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tabela    text NOT NULL,
    operacao  text NOT NULL,
    quando    timestamptz NOT NULL DEFAULT now(),
    usuario   text NOT NULL DEFAULT current_user,
    antes     jsonb,
    depois    jsonb
);

CREATE FUNCTION auditar() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO auditoria (tabela, operacao, antes, depois)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER reservas_auditoria
AFTER INSERT OR UPDATE OR DELETE ON reservas
FOR EACH ROW EXECUTE FUNCTION auditar();

UPDATE reservas SET status = 'cancelada' WHERE id = 3;
SELECT operacao, antes->>'status' AS de, depois->>'status' AS para, usuario, quando FROM auditoria;

CREATE ROLE relatorios LOGIN PASSWORD 'troque-isto';
GRANT CONNECT ON DATABASE pousada TO relatorios;
GRANT USAGE ON SCHEMA public TO relatorios;
GRANT SELECT ON reservas_detalhadas TO relatorios;

SET ROLE relatorios;
SELECT count(*) FROM reservas_detalhadas;   -- funciona
SELECT * FROM hospedes;                      -- ERROR: permission denied for table hospedes
RESET ROLE;`)}
${trecho(`pg_dump -Fc -d pousada -f pousada.dump
createdb pousada_restaurado
pg_restore -d pousada_restaurado pousada.dump
psql -d pousada_restaurado -c "SELECT count(*) FROM reservas"`)}
<p><code>TG_OP</code> e <code>TG_TABLE_NAME</code> são variáveis que o Postgres preenche dentro de funções de gatilho, por isso a mesma função serve para qualquer tabela. A view funciona para o papel <code>relatorios</code> porque ela roda com as permissões de quem a criou. Backup que nunca foi restaurado não é backup: é esperança.</p>`)}
`,
              quiz: [
                {
                  pergunta: 'Por que o papel relatorios consegue ler a view, mas não a tabela hospedes?',
                  opcoes: [
                    'Erro do Postgres',
                    'A view roda com as permissões do dono dela; o papel só recebeu acesso à view',
                    'Views não têm permissões'
                  ],
                  certa: 1,
                  explicacao: 'Views são uma forma clássica de expor só parte dos dados.'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
