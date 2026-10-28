// Trilha de React. O editor desta trilha roda um main.jsx: import de 'react' e 'react-dom/client', JSX e
// createRoot(...).render(...), como num projeto com Vite (o Babel converte no navegador). Há um <div id="root"> pronto.
// Para digitar num campo controlado pelo React, os testes usam o setter nativo de value e disparam 'input', como a
// Testing Library faz. Atenção: crases e ${ dos exemplos precisam de barra invertida.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'react',
  area: 'Desenvolvimento web',
  titulo: 'React',
  sigla: 'Re',
  linguagem: 'react',
  resumo: 'Componentes, estado, efeitos e rotas para interfaces que crescem sem virar bagunça.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'Componentes, JSX, props e listas.',
      modulos: [
        {
          titulo: 'Componentes',
          itens: [
            {
              id: 'o-que-e-react',
              titulo: 'Componentes e JSX',
              resumo: 'Por que React, o que é um componente e as regras do JSX.',
              minutos: 10,
              corpo: `
<p>Em JavaScript puro, você muda a tela passo a passo: acha o elemento, troca o texto, cria um <code>&lt;li&gt;</code>, remove outro. Quando a interface cresce, fica difícil lembrar de atualizar todos os lugares. No <strong>React</strong>, você descreve <strong>como a tela deve ficar</strong> para cada situação, e ele descobre o que mudar.</p>

<h2>Componentes</h2>
<p>Um componente é uma <strong>função que devolve o que deve aparecer</strong>. O nome começa com maiúscula, e ele é usado como uma tag:</p>
${codigo(`import { createRoot } from 'react-dom/client';

function Saudacao() {
  return <h1>Olá, React!</h1>;
}

function App() {
  return (
    <main>
      <Saudacao />
      <p>Este parágrafo veio de um componente.</p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);`)}
<p>A última linha é como todo app React começa: pega um elemento da página (aqui, o <code>#root</code> que o editor já tem) e desenha o componente principal dentro dele. Num projeto criado com <strong>Vite</strong> (<code>npm create vite@latest</code>), esse código fica no arquivo <code>main.jsx</code>.</p>

<h2>JSX</h2>
<p>Aquele HTML dentro do JavaScript se chama <strong>JSX</strong>. Ele vira chamadas de função antes de rodar. Parece HTML, mas tem regras próprias:</p>
<ul>
  <li><code>className</code> em vez de <code>class</code> e <code>htmlFor</code> em vez de <code>for</code>.</li>
  <li>Toda tag precisa fechar: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>, <code>&lt;input /&gt;</code>.</li>
  <li>Um componente devolve <strong>um</strong> elemento. Para devolver vários sem criar uma <code>div</code> à toa, use o fragmento <code>&lt;&gt;...&lt;/&gt;</code>.</li>
  <li>Entre <code>{ }</code> vai qualquer expressão JavaScript: variáveis, contas, chamadas de função.</li>
  <li><code>style</code> recebe um objeto: <code>style={{ color: 'teal', fontSize: 20 }}</code>.</li>
</ul>
${codigo(`import { createRoot } from 'react-dom/client';

function Perfil() {
  const nome = 'Ana';
  const anoAtual = 2026;
  return (
    <>
      <h2 className="titulo" style={{ color: 'teal' }}>{nome.toUpperCase()}</h2>
      <p>Programando desde {anoAtual - 3}, há {3} anos.</p>
      <img src="https://picsum.photos/seed/ana/120" alt="Foto de Ana" width="120" />
    </>
  );
}

createRoot(document.getElementById('root')).render(<Perfil />);`)}
${dica('Se aparecer um erro no console, leia a mensagem: o Babel aponta a linha e a coluna do problema no JSX. O mais comum é esquecer de fechar uma tag.')}
`,
              quiz: [
                {
                  pergunta: 'O que é um componente React?',
                  opcoes: [
                    'Um arquivo CSS',
                    'Uma função que devolve o que deve aparecer na tela',
                    'Uma tag HTML nova do navegador'
                  ],
                  certa: 1,
                  explicacao: 'Funções com nome em maiúscula, usadas como tags no JSX.'
                },
                {
                  pergunta: 'Como se escreve o atributo class em JSX?',
                  opcoes: ['class', 'className', 'cssClass'],
                  certa: 1,
                  explicacao: 'class é palavra reservada do JavaScript, então o JSX usa className.'
                },
                {
                  pergunta: 'Para que serve <>...</>?',
                  opcoes: [
                    'Comentário',
                    'Agrupar vários elementos sem criar uma tag a mais na página',
                    'Criar um componente vazio'
                  ],
                  certa: 1,
                  explicacao: 'É o fragmento: ele some na página, só agrupa.'
                }
              ]
            },
            {
              id: 'props-e-listas',
              titulo: 'Props, listas e condições',
              resumo: 'Passar dados para componentes, desenhar listas com key e mostrar conforme a situação.',
              minutos: 12,
              corpo: `
<h2>Props</h2>
<p><strong>Props</strong> são os "atributos" de um componente: o jeito de passar dados de fora para dentro. Elas chegam como um objeto, que costuma ser desestruturado:</p>
${codigo(`import { createRoot } from 'react-dom/client';

function Produto({ nome, preco, emPromocao = false }) {
  return (
    <article style={{ border: '1px solid #ccc', padding: 10, marginBottom: 8, borderRadius: 8 }}>
      <h3>{nome}</h3>
      <p>R$ {preco.toFixed(2).replace('.', ',')}</p>
      {emPromocao && <strong>Promoção!</strong>}
    </article>
  );
}

function App() {
  return (
    <>
      <Produto nome="Café em grãos" preco={62.9} emPromocao />
      <Produto nome="Caneca" preco={34.5} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);`)}
<p>Texto vai entre aspas; números, booleanos, objetos e funções vão entre chaves. Uma prop sem valor (<code>emPromocao</code>) vale <code>true</code>. Props são <strong>só de leitura</strong>: o componente não muda o que recebeu.</p>

<h2>Mostrar ou não</h2>
<ul>
  <li><code>{condicao &amp;&amp; &lt;Algo /&gt;}</code>: mostra só se a condição for verdadeira.</li>
  <li><code>{condicao ? &lt;A /&gt; : &lt;B /&gt;}</code>: escolhe entre dois.</li>
</ul>
${dica('Cuidado com <code>{lista.length &amp;&amp; ...}</code>: com a lista vazia, o React mostra um "0" na tela. Use <code>{lista.length &gt; 0 &amp;&amp; ...}</code>.')}

<h2>Listas com map</h2>
<p>Para desenhar uma lista, transforme o array em elementos com <code>map</code>. Cada item precisa de uma <code>key</code> única e estável (em geral o id), que o React usa para saber qual item é qual quando a lista muda:</p>
${codigo(`import { createRoot } from 'react-dom/client';

const tarefas = [
  { id: 1, titulo: 'Estudar React', feita: true },
  { id: 2, titulo: 'Fazer o desafio', feita: false },
  { id: 3, titulo: 'Publicar no portfólio', feita: false }
];

function Lista({ itens }) {
  if (itens.length === 0) return <p>Nada por aqui.</p>;
  return (
    <ul>
      {itens.map(t => (
        <li key={t.id}>
          {t.feita ? '✔ ' : '○ '}{t.titulo}
        </li>
      ))}
    </ul>
  );
}

createRoot(document.getElementById('root')).render(<Lista itens={tarefas} />);`)}

<h2>children</h2>
<p>O que você coloca entre a abertura e o fechamento de um componente chega na prop especial <code>children</code>. Ótimo para "molduras" como cartões e modais:</p>
${trecho(`function Cartao({ titulo, children }) {
  return (
    <section className="cartao">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

<Cartao titulo="Resumo">
  <p>Qualquer conteúdo aqui dentro.</p>
</Cartao>`)}
`,
              quiz: [
                {
                  pergunta: 'Um componente pode alterar as props que recebeu?',
                  opcoes: ['Sim', 'Não: props são só de leitura', 'Só se forem números'],
                  certa: 1,
                  explicacao: 'Quem muda os dados é quem é dono deles. Para dados que mudam, existe o estado.'
                },
                {
                  pergunta: 'Para que serve a key nos itens de uma lista?',
                  opcoes: [
                    'Estilizar cada item',
                    'Ajudar o React a saber qual item é qual quando a lista muda',
                    'Ordenar a lista'
                  ],
                  certa: 1,
                  explicacao:
                    'Use um id estável. O índice do array dá problema quando itens são removidos ou reordenados.'
                },
                {
                  pergunta: 'O que {itens.length && <Lista />} mostra com a lista vazia?',
                  opcoes: ['Nada', 'O número 0', 'Um erro'],
                  certa: 1,
                  explicacao: '0 é falso, mas o React desenha números. Compare com > 0.'
                }
              ]
            },
            {
              id: 'desafio-cardapio',
              tipo: 'desafio',
              titulo: 'Desafio: cardápio',
              resumo: 'Monte um cardápio com componentes, props e listas.',
              minutos: 20,
              enunciado: `
<p>Monte o cardápio da cafeteria a partir do array <code>itens</code>:</p>
<ul>
  <li>Um componente <code>Item</code> que recebe as props <code>nome</code>, <code>preco</code> e <code>vegano</code> e desenha um <code>&lt;li className="item"&gt;</code> com um <code>&lt;h3&gt;</code> com o nome e um <code>&lt;span className="preco"&gt;</code> com o preço no formato <code>R$ 9,50</code> (vírgula!).</li>
  <li>Os itens veganos mostram também um <code>&lt;span className="selo"&gt;Vegano&lt;/span&gt;</code>. Os outros, não.</li>
  <li>O <code>App</code> desenha um <code>&lt;ul&gt;</code> com um <code>Item</code> para cada elemento do array (com <code>key</code>).</li>
</ul>`,
              inicial: `import { createRoot } from 'react-dom/client';

const itens = [
  { id: 1, nome: 'Espresso', preco: 6, vegano: true },
  { id: 2, nome: 'Cappuccino', preco: 9.5, vegano: false },
  { id: 3, nome: 'Pão de queijo', preco: 7.25, vegano: false },
  { id: 4, nome: 'Bolo de banana', preco: 11, vegano: true }
];

function Item() {
  return <li className="item"></li>;
}

function App() {
  return <ul></ul>;
}

createRoot(document.getElementById('root')).render(<App />);
`,
              testes: [
                [
                  'Aparecem 4 li.item, cada um com um h3 com o nome',
                  doc => {
                    const lis = [...doc.querySelectorAll('ul > li.item')];
                    return (
                      lis.length === 4 &&
                      lis.map(li => li.querySelector('h3')?.textContent).join() ===
                        'Espresso,Cappuccino,Pão de queijo,Bolo de banana'
                    );
                  }
                ],
                [
                  'Os preços aparecem como R$ 6,00, R$ 9,50...',
                  doc => {
                    const precos = [...doc.querySelectorAll('li.item .preco')].map(p =>
                      p.textContent.replace(/\s/g, ' ').trim()
                    );
                    return precos.join('|') === 'R$ 6,00|R$ 9,50|R$ 7,25|R$ 11,00';
                  }
                ],
                [
                  'Só os itens veganos têm o selo',
                  doc => {
                    const selos = [...doc.querySelectorAll('li.item')].map(
                      li => li.querySelector('.selo')?.textContent || ''
                    );
                    return selos.join('|') === 'Vegano|||Vegano';
                  }
                ],
                [
                  'Item é um componente que recebe props (o código usa <Item ... />)',
                  doc =>
                    /<Item[\s\S]*?(nome|\{\.\.\.)/.test(
                      doc.defaultView.frameElement.closest('.editor').querySelector('textarea').value
                    )
                ]
              ],
              solucao: `import { createRoot } from 'react-dom/client';

const itens = [
  { id: 1, nome: 'Espresso', preco: 6, vegano: true },
  { id: 2, nome: 'Cappuccino', preco: 9.5, vegano: false },
  { id: 3, nome: 'Pão de queijo', preco: 7.25, vegano: false },
  { id: 4, nome: 'Bolo de banana', preco: 11, vegano: true }
];

const formatar = valor => 'R$ ' + valor.toFixed(2).replace('.', ',');

function Item({ nome, preco, vegano }) {
  return (
    <li className="item">
      <h3>{nome}</h3>
      <span className="preco">{formatar(preco)}</span>
      {vegano && <span className="selo">Vegano</span>}
    </li>
  );
}

function App() {
  return (
    <ul>
      {itens.map(item => (
        <Item key={item.id} nome={item.nome} preco={item.preco} vegano={item.vegano} />
      ))}
    </ul>
  );
}

createRoot(document.getElementById('root')).render(<App />);`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Estado, eventos e formulários.',
      modulos: [
        {
          titulo: 'Estado e eventos',
          itens: [
            {
              id: 'estado',
              titulo: 'Estado com useState',
              resumo: 'Dados que mudam, eventos e atualizações sem mutar.',
              minutos: 13,
              corpo: `
<p><strong>Estado</strong> é o dado que muda enquanto a pessoa usa a tela: o número do contador, os itens do carrinho, se o menu está aberto. Quando o estado muda, o React chama o componente de novo e atualiza só o que ficou diferente.</p>

<h2>useState</h2>
${codigo(`import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Contador() {
  const [valor, setValor] = useState(0);

  return (
    <div>
      <p>Você clicou {valor} vez(es).</p>
      <button onClick={() => setValor(valor + 1)}>+1</button>
      <button onClick={() => setValor(0)} disabled={valor === 0}>Zerar</button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Contador />);`)}
<p><code>useState(0)</code> devolve um par: o valor atual e a função que troca o valor. Funções que começam com <code>use</code> são <strong>hooks</strong>, e só podem ser chamadas no topo do componente (nunca dentro de <code>if</code> ou laços).</p>
<p>Os eventos são props como <code>onClick</code>, <code>onChange</code> e <code>onSubmit</code>, e recebem uma <strong>função</strong>. Escreva <code>onClick={() =&gt; setValor(0)}</code>, não <code>onClick={setValor(0)}</code>, que executaria na hora de desenhar.</p>

<h2>Não mude o estado direto</h2>
<p>Para o React perceber a mudança, o estado é trocado por um <strong>valor novo</strong>. Com arrays e objetos, isso quer dizer criar cópias:</p>
${codigo(`import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Carrinho() {
  const [itens, setItens] = useState([{ id: 1, nome: 'Café', qtd: 1 }]);

  const adicionar = () =>
    setItens([...itens, { id: Date.now(), nome: 'Item ' + (itens.length + 1), qtd: 1 }]);

  const aumentar = id =>
    setItens(itens.map(i => (i.id === id ? { ...i, qtd: i.qtd + 1 } : i)));

  const remover = id => setItens(itens.filter(i => i.id !== id));

  return (
    <>
      <ul>
        {itens.map(i => (
          <li key={i.id}>
            {i.nome} × {i.qtd}{' '}
            <button onClick={() => aumentar(i.id)}>+</button>{' '}
            <button onClick={() => remover(i.id)}>remover</button>
          </li>
        ))}
      </ul>
      <button onClick={adicionar}>Adicionar item</button>
    </>
  );
}

createRoot(document.getElementById('root')).render(<Carrinho />);`)}
<p><code>itens.push(...)</code> mudaria o array antigo e a tela não atualizaria. Os padrões são: <code>[...lista, novo]</code> para adicionar, <code>map</code> para alterar um, <code>filter</code> para remover e <code>{ ...objeto, campo: valor }</code> para objetos.</p>
${dica('Se o novo valor depende do anterior, use a forma com função: <code>setValor(v =&gt; v + 1)</code>. Ela garante que você soma sobre o valor mais recente, mesmo com várias atualizações seguidas.')}
`,
              quiz: [
                {
                  pergunta: 'O que acontece quando o estado muda?',
                  opcoes: [
                    'Nada até recarregar a página',
                    'O React chama o componente de novo e atualiza a tela',
                    'A página recarrega'
                  ],
                  certa: 1,
                  explicacao: 'A tela é sempre o resultado do estado atual.'
                },
                {
                  pergunta: 'Qual o jeito certo de acrescentar um item a uma lista no estado?',
                  opcoes: ['lista.push(novo)', 'setLista([...lista, novo])', 'lista[lista.length] = novo'],
                  certa: 1,
                  explicacao: 'Criar um array novo é o que faz o React perceber a mudança.'
                },
                {
                  pergunta: 'Qual a diferença entre onClick={limpar} e onClick={limpar()}?',
                  opcoes: [
                    'Nenhuma',
                    'A primeira passa a função; a segunda executa na hora de desenhar',
                    'A segunda é mais rápida'
                  ],
                  certa: 1,
                  explicacao: 'O evento precisa receber uma função para chamar depois, no clique.'
                }
              ]
            },
            {
              id: 'formularios',
              titulo: 'Formulários e estado compartilhado',
              resumo: 'Campos controlados, envio e "levantar o estado".',
              minutos: 12,
              corpo: `
<h2>Campos controlados</h2>
<p>Num campo <strong>controlado</strong>, o valor vem do estado (<code>value</code>) e cada tecla atualiza o estado (<code>onChange</code>). Assim o React sempre sabe o que está escrito, e dá para validar e formatar enquanto a pessoa digita:</p>
${codigo(`import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(null);
  const emailValido = email.includes('@');

  function enviar(evento) {
    evento.preventDefault();
    setEnviado({ nome, email });
    setNome('');
    setEmail('');
  }

  return (
    <form onSubmit={enviar}>
      <label htmlFor="nome">Nome</label>
      <input id="nome" value={nome} onChange={e => setNome(e.target.value)} />
      <label htmlFor="email">E-mail</label>
      <input id="email" value={email} onChange={e => setEmail(e.target.value)} />
      {email && !emailValido && <p style={{ color: 'crimson' }}>Falta o @.</p>}
      <button disabled={!nome || !emailValido}>Cadastrar</button>
      {enviado && <p>Cadastrado: {enviado.nome} ({enviado.email})</p>}
    </form>
  );
}

createRoot(document.getElementById('root')).render(<Cadastro />);`)}

<h2>Levantar o estado</h2>
<p>Quando dois componentes precisam do mesmo dado, ele sobe para o <strong>pai mais próximo</strong> dos dois. O pai guarda o estado e passa para baixo: o valor por props e as mudanças por funções:</p>
${codigo(`import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Busca({ texto, aoMudar }) {
  return <input placeholder="Buscar sabor" value={texto} onChange={e => aoMudar(e.target.value)} />;
}

function Resultados({ sabores, texto }) {
  const achados = sabores.filter(s => s.toLowerCase().includes(texto.toLowerCase()));
  return <p>{achados.length} encontrado(s): {achados.join(', ')}</p>;
}

function App() {
  const [texto, setTexto] = useState('');
  const sabores = ['Café', 'Caramelo', 'Chocolate', 'Baunilha', 'Canela'];
  return (
    <>
      <Busca texto={texto} aoMudar={setTexto} />
      <Resultados sabores={sabores} texto={texto} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);`)}
<p>Repare que a lista filtrada <strong>não</strong> é estado: ela é calculada a partir do texto e dos sabores a cada desenho. Guardar em estado algo que dá para calcular é a origem de muitos bugs (os dois ficam fora de sincronia).</p>
${dica('Para formulários grandes, bibliotecas como React Hook Form evitam escrever um useState por campo. Mas o padrão de campo controlado continua sendo a base.')}
`,
              quiz: [
                {
                  pergunta: 'O que torna um input "controlado"?',
                  opcoes: [
                    'Ter um id',
                    'O value vir do estado e o onChange atualizar o estado',
                    'Estar dentro de um form'
                  ],
                  certa: 1,
                  explicacao: 'O estado é a fonte da verdade do que está escrito.'
                },
                {
                  pergunta: 'Dois componentes irmãos precisam do mesmo dado. Onde ele fica?',
                  opcoes: ['Copiado nos dois', 'No pai mais próximo dos dois', 'Numa variável global'],
                  certa: 1,
                  explicacao: 'É o "levantar o estado": o pai guarda e distribui por props.'
                },
                {
                  pergunta: 'Uma lista filtrada a partir de outro estado deve virar estado também?',
                  opcoes: ['Sim', 'Não: calcule a cada desenho', 'Só se for grande'],
                  certa: 1,
                  explicacao: 'Dados derivados calculados na hora nunca ficam fora de sincronia.'
                }
              ]
            },
            {
              id: 'desafio-tarefas',
              tipo: 'desafio',
              titulo: 'Desafio: lista de tarefas em React',
              resumo: 'Adicionar, marcar e remover tarefas com estado.',
              minutos: 25,
              enunciado: `
<p>Faça a lista de tarefas funcionar:</p>
<ul>
  <li>O formulário tem um <code>&lt;input&gt;</code> controlado. Enviar acrescenta uma tarefa com o texto (sem espaços nas pontas) e limpa o campo. Texto vazio não vira tarefa.</li>
  <li>Cada tarefa é um <code>&lt;li&gt;</code> com o texto num <code>&lt;span&gt;</code>. Clicar no <code>span</code> marca e desmarca: a tarefa feita ganha a classe <code>feita</code> no <code>li</code>.</li>
  <li>Cada <code>li</code> tem um botão <strong>Remover</strong>.</li>
  <li>Um <code>&lt;p id="restantes"&gt;</code> mostra <code>"N pendente(s)"</code>.</li>
</ul>`,
              inicial: `import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [tarefas, setTarefas] = useState([]);

  return (
    <main>
      <form>
        <input aria-label="Nova tarefa" />
        <button>Adicionar</button>
      </form>
      <ul></ul>
      <p id="restantes">0 pendente(s)</p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
`,
              testes: [
                [
                  'Enviar o formulário acrescenta a tarefa e limpa o campo',
                  async doc => {
                    const w = doc.defaultView;
                    const campo = doc.querySelector('form input');
                    const digitar = texto => {
                      Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, 'value').set.call(campo, texto);
                      campo.dispatchEvent(new w.Event('input', { bubbles: true }));
                    };
                    digitar('  Estudar React  ');
                    await w.__esperar();
                    doc.querySelector('form').requestSubmit();
                    await w.__esperar();
                    const li = doc.querySelector('ul li span');
                    return !!li && li.textContent === 'Estudar React' && campo.value === '';
                  }
                ],
                [
                  'Texto vazio não vira tarefa',
                  async doc => {
                    const w = doc.defaultView;
                    const antes = doc.querySelectorAll('ul li').length;
                    const campo = doc.querySelector('form input');
                    Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, 'value').set.call(campo, '   ');
                    campo.dispatchEvent(new w.Event('input', { bubbles: true }));
                    await w.__esperar();
                    doc.querySelector('form').requestSubmit();
                    await w.__esperar();
                    return doc.querySelectorAll('ul li').length === antes;
                  }
                ],
                [
                  'Clicar no texto marca e desmarca a classe feita, e o contador acompanha',
                  async doc => {
                    const w = doc.defaultView;
                    const campo = doc.querySelector('form input');
                    Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, 'value').set.call(campo, 'Treinar');
                    campo.dispatchEvent(new w.Event('input', { bubbles: true }));
                    await w.__esperar();
                    doc.querySelector('form').requestSubmit();
                    await w.__esperar();
                    const total = doc.querySelectorAll('ul li').length;
                    const ultimo = () => [...doc.querySelectorAll('ul li')].at(-1);
                    const pendentes = () => doc.querySelector('#restantes').textContent.trim();
                    const antes = pendentes();
                    ultimo().querySelector('span').click();
                    await w.__esperar();
                    const marcou = ultimo().classList.contains('feita') && pendentes() === total - 1 + ' pendente(s)';
                    ultimo().querySelector('span').click();
                    await w.__esperar();
                    return antes === total + ' pendente(s)' && marcou && !ultimo().classList.contains('feita');
                  }
                ],
                [
                  'Remover tira a tarefa da lista',
                  async doc => {
                    const w = doc.defaultView;
                    const antes = doc.querySelectorAll('ul li').length;
                    const botao = [...doc.querySelectorAll('ul li button')].find(
                      b => b.textContent.trim() === 'Remover'
                    );
                    if (!botao) return false;
                    botao.click();
                    await w.__esperar();
                    return doc.querySelectorAll('ul li').length === antes - 1;
                  }
                ]
              ],
              solucao: `import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState('');

  function adicionar(evento) {
    evento.preventDefault();
    const titulo = texto.trim();
    if (!titulo) return;
    setTarefas([...tarefas, { id: crypto.randomUUID(), titulo, feita: false }]);
    setTexto('');
  }

  const alternar = id => setTarefas(tarefas.map(t => (t.id === id ? { ...t, feita: !t.feita } : t)));
  const remover = id => setTarefas(tarefas.filter(t => t.id !== id));
  const pendentes = tarefas.filter(t => !t.feita).length;

  return (
    <main>
      <form onSubmit={adicionar}>
        <input aria-label="Nova tarefa" value={texto} onChange={e => setTexto(e.target.value)} />
        <button>Adicionar</button>
      </form>
      <ul>
        {tarefas.map(t => (
          <li key={t.id} className={t.feita ? 'feita' : ''}>
            <span onClick={() => alternar(t.id)}>{t.titulo}</span>{' '}
            <button onClick={() => remover(t.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <p id="restantes">{pendentes} pendente(s)</p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Efeitos, hooks próprios, contexto e a organização de um projeto.',
      modulos: [
        {
          titulo: 'Efeitos e organização',
          itens: [
            {
              id: 'efeitos',
              titulo: 'Efeitos com useEffect',
              resumo: 'Sincronizar com o mundo de fora: título, timers e dados de uma API.',
              minutos: 14,
              corpo: `
<p>Um componente deve só calcular o que mostrar. Tudo o que mexe com o mundo de fora (o título da aba, um timer, buscar dados, o localStorage) vai num <strong>efeito</strong>, que roda <strong>depois</strong> de o React atualizar a tela.</p>

<h2>useEffect e as dependências</h2>
${codigo(`import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  const [mensagens, setMensagens] = useState(0);

  useEffect(() => {
    document.title = mensagens ? \`(\${mensagens}) Caixa de entrada\` : 'Caixa de entrada';
    console.log('efeito rodou com', mensagens);
  }, [mensagens]);

  return <button onClick={() => setMensagens(m => m + 1)}>Nova mensagem ({mensagens})</button>;
}

createRoot(document.getElementById('root')).render(<App />);`)}
<p>O array no fim são as <strong>dependências</strong>: o efeito roda depois do primeiro desenho e de novo sempre que algum desses valores mudar. Com <code>[]</code>, roda só uma vez. Sem o array, roda depois de todo desenho (quase nunca é o que você quer).</p>

<h2>Limpeza</h2>
<p>Se o efeito liga algo (um timer, um evento na janela), ele devolve uma função que <strong>desliga</strong>. O React chama essa limpeza antes de rodar o efeito de novo e quando o componente sai da tela:</p>
${codigo(`import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function Relogio() {
  const [agora, setAgora] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{agora.toLocaleTimeString('pt-BR')}</p>;
}

function App() {
  const [visivel, setVisivel] = useState(true);
  return (
    <>
      <button onClick={() => setVisivel(v => !v)}>{visivel ? 'Esconder' : 'Mostrar'} relógio</button>
      {visivel && <Relogio />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);`)}
<p>Sem o <code>clearInterval</code>, cada vez que o relógio aparecesse e sumisse, um timer a mais ficaria rodando para sempre.</p>

<h2>Buscar dados</h2>
${trecho(`function Usuario({ id }) {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const controle = new AbortController();
    setUsuario(null);
    fetch(\`/api/usuarios/\${id}\`, { signal: controle.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
      .then(setUsuario)
      .catch(e => e.name !== 'AbortError' && setErro(e));
    return () => controle.abort();   // id mudou antes de chegar? cancela a busca velha
  }, [id]);

  if (erro) return <p>Não deu para carregar.</p>;
  if (!usuario) return <p>Carregando…</p>;
  return <h2>{usuario.nome}</h2>;
}`)}
${dica('Em desenvolvimento, o <code>&lt;StrictMode&gt;</code> do React roda cada efeito duas vezes (liga, limpa e liga de novo) de propósito, para mostrar efeitos sem limpeza. Se algo acontece em dobro só no modo de desenvolvimento, falta a função de limpeza. Em projetos maiores, bibliotecas como TanStack Query cuidam de buscar dados, cache e recarregamento.')}
`,
              quiz: [
                {
                  pergunta: 'Com useEffect(fn, []), quando fn roda?',
                  opcoes: ['A cada desenho', 'Uma vez, depois do primeiro desenho', 'Nunca'],
                  certa: 1,
                  explicacao: 'Sem dependências que mudem, só roda na montagem.'
                },
                {
                  pergunta: 'Para que serve a função devolvida pelo efeito?',
                  opcoes: ['Mostrar um valor', 'Desfazer o que o efeito ligou (timers, eventos, buscas)', 'Nada'],
                  certa: 1,
                  explicacao: 'É a limpeza, chamada antes do próximo efeito e quando o componente sai da tela.'
                },
                {
                  pergunta: 'Por que o AbortController na busca de dados?',
                  opcoes: [
                    'Deixar a busca mais rápida',
                    'Cancelar a resposta velha se o id mudar antes de ela chegar',
                    'É obrigatório no fetch'
                  ],
                  certa: 1,
                  explicacao: 'Evita que a resposta de um id antigo apareça depois da do novo.'
                }
              ]
            },
            {
              id: 'hooks-e-contexto',
              titulo: 'Hooks próprios, contexto e projeto',
              resumo: 'Reaproveitar lógica, compartilhar dados sem repassar props e organizar com Vite e rotas.',
              minutos: 13,
              corpo: `
<h2>Hooks próprios</h2>
<p>Quando a mesma combinação de estado e efeito aparece em vários componentes, ela vira um <strong>hook próprio</strong>: uma função que começa com <code>use</code> e usa outros hooks. Este guarda o estado no localStorage:</p>
${codigo(`import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function useLocalStorage(chave, inicial) {
  const [valor, setValor] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(chave)) ?? inicial;
    } catch {
      return inicial;
    }
  });
  useEffect(() => {
    localStorage.setItem(chave, JSON.stringify(valor));
  }, [chave, valor]);
  return [valor, setValor];
}

function App() {
  const [nome, setNome] = useLocalStorage('nome-react', '');
  return (
    <>
      <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
      <p>Olá, {nome || 'visitante'}! (mude o código: o nome continua aqui)</p>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);`)}
<p>Repare no <code>useState(() =&gt; ...)</code>: passando uma função, a leitura do localStorage acontece só no primeiro desenho, e não a cada atualização.</p>

<h2>Contexto</h2>
<p>Alguns dados interessam a muitos componentes em níveis diferentes: o tema, a pessoa logada, o idioma. Passar por props em cada nível ("prop drilling") cansa. O <strong>contexto</strong> deixa qualquer componente abaixo do provedor ler o valor direto:</p>
${codigo(`import { createContext, useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';

const TemaContext = createContext('claro');

function Botao({ children }) {
  const tema = useContext(TemaContext);
  const estilo = tema === 'escuro' ? { background: '#222', color: '#eee' } : { background: '#eee', color: '#222' };
  return <button style={{ ...estilo, padding: '6px 12px' }}>{children}</button>;
}

function Barra() {
  return <nav><Botao>Início</Botao> <Botao>Perfil</Botao></nav>;
}

function App() {
  const [tema, setTema] = useState('claro');
  return (
    <TemaContext.Provider value={tema}>
      <Barra />
      <p><label><input type="checkbox" onChange={e => setTema(e.target.checked ? 'escuro' : 'claro')} /> Tema escuro</label></p>
    </TemaContext.Provider>
  );
}

createRoot(document.getElementById('root')).render(<App />);`)}
${dica('Contexto não substitui props: use para dados realmente globais. Para o resto, props deixam claro de onde cada dado vem.')}

<h2>Um projeto de verdade</h2>
<p>Fora deste editor, um app React começa assim:</p>
${trecho(`npm create vite@latest meu-app -- --template react
cd meu-app
npm install
npm run dev          # servidor de desenvolvimento com recarga automática
npm run build        # gera a pasta dist/ para publicar`)}
<p>Cada componente costuma ir no seu arquivo (<code>src/components/Cartao.jsx</code>), exportado e importado com Módulos ES. Para várias páginas com URLs próprias, a biblioteca mais usada é o <strong>React Router</strong>:</p>
${trecho(`import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

<BrowserRouter>
  <nav><Link to="/">Início</Link> <Link to="/pedidos">Pedidos</Link></nav>
  <Routes>
    <Route path="/" element={<Inicio />} />
    <Route path="/pedidos" element={<Pedidos />} />
    <Route path="/pedidos/:id" element={<DetalhePedido />} />
  </Routes>
</BrowserRouter>`)}
`,
              quiz: [
                {
                  pergunta: 'O que caracteriza um hook próprio?',
                  opcoes: [
                    'Ser uma classe',
                    'Uma função que começa com use e usa outros hooks',
                    'Ficar num arquivo chamado hooks.js'
                  ],
                  certa: 1,
                  explicacao: 'O prefixo use avisa o React (e quem lê) que as regras dos hooks valem ali dentro.'
                },
                {
                  pergunta: 'Que problema o contexto resolve?',
                  opcoes: [
                    'Deixar a página mais rápida',
                    'Passar um dado global por muitos níveis sem repassar props em cada um',
                    'Guardar dados no servidor'
                  ],
                  certa: 1,
                  explicacao: 'Qualquer componente dentro do Provider lê o valor com useContext.'
                },
                {
                  pergunta: 'Qual comando gera os arquivos para publicar num projeto Vite?',
                  opcoes: ['npm run dev', 'npm run build', 'npm start'],
                  certa: 1,
                  explicacao: 'O build gera a pasta dist/, com o código otimizado.'
                }
              ]
            },
            {
              id: 'desafio-cronometro',
              tipo: 'desafio',
              titulo: 'Desafio: cronômetro',
              resumo: 'Um cronômetro com useEffect, limpeza e um hook próprio.',
              minutos: 25,
              enunciado: `
<p>Faça um cronômetro que conta em <strong>décimos de segundo</strong>:</p>
<ul>
  <li>Crie o hook <code>useCronometro()</code>, que devolve <code>{ decimos, rodando, iniciar, pausar, zerar }</code>. O timer (um <code>setInterval</code> de 100 ms) fica num <code>useEffect</code> que depende de <code>rodando</code> e <strong>limpa o intervalo</strong>.</li>
  <li>O <code>&lt;output id="tempo"&gt;</code> mostra o tempo no formato <code>0,0</code> (segundos com uma casa decimal, com vírgula): 12 décimos aparecem como <code>1,2</code>.</li>
  <li>Os botões <strong>Iniciar</strong>, <strong>Pausar</strong> e <strong>Zerar</strong> fazem o que dizem.</li>
</ul>`,
              inicial: `import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function useCronometro() {
  // seu hook aqui
}

function App() {
  return (
    <main>
      <output id="tempo">0,0</output>
      <div>
        <button>Iniciar</button>
        <button>Pausar</button>
        <button>Zerar</button>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
`,
              testes: [
                [
                  'Iniciar faz o tempo andar',
                  async doc => {
                    const w = doc.defaultView;
                    const botao = nome => [...doc.querySelectorAll('button')].find(b => b.textContent.trim() === nome);
                    botao('Zerar').click();
                    await w.__esperar();
                    botao('Iniciar').click();
                    await w.__esperar(450);
                    const valor = Number(doc.querySelector('#tempo').textContent.replace(',', '.'));
                    return (
                      valor >= 0.2 && valor <= 0.8 && /^\d+,\d$/.test(doc.querySelector('#tempo').textContent.trim())
                    );
                  }
                ],
                [
                  'Pausar congela o tempo',
                  async doc => {
                    const w = doc.defaultView;
                    const botao = nome => [...doc.querySelectorAll('button')].find(b => b.textContent.trim() === nome);
                    botao('Iniciar').click();
                    await w.__esperar(250);
                    botao('Pausar').click();
                    await w.__esperar();
                    const parado = doc.querySelector('#tempo').textContent;
                    await w.__esperar(350);
                    return parado !== '0,0' && doc.querySelector('#tempo').textContent === parado;
                  }
                ],
                [
                  'Zerar volta para 0,0',
                  async doc => {
                    const w = doc.defaultView;
                    [...doc.querySelectorAll('button')].find(b => b.textContent.trim() === 'Zerar').click();
                    await w.__esperar();
                    return doc.querySelector('#tempo').textContent.trim() === '0,0';
                  }
                ],
                [
                  'O código tem o hook useCronometro com useEffect e clearInterval',
                  doc => {
                    const codigo = doc.defaultView.frameElement.closest('.editor').querySelector('textarea').value;
                    return (
                      /function\s+useCronometro|const\s+useCronometro/.test(codigo) &&
                      /useEffect\(/.test(codigo) &&
                      /clearInterval\(/.test(codigo)
                    );
                  }
                ]
              ],
              solucao: `import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function useCronometro() {
  const [decimos, setDecimos] = useState(0);
  const [rodando, setRodando] = useState(false);

  useEffect(() => {
    if (!rodando) return;
    const id = setInterval(() => setDecimos(d => d + 1), 100);
    return () => clearInterval(id);
  }, [rodando]);

  return {
    decimos,
    rodando,
    iniciar: () => setRodando(true),
    pausar: () => setRodando(false),
    zerar: () => {
      setRodando(false);
      setDecimos(0);
    }
  };
}

function App() {
  const { decimos, rodando, iniciar, pausar, zerar } = useCronometro();
  return (
    <main>
      <output id="tempo">{(decimos / 10).toFixed(1).replace('.', ',')}</output>
      <div>
        <button onClick={iniciar} disabled={rodando}>Iniciar</button>
        <button onClick={pausar} disabled={!rodando}>Pausar</button>
        <button onClick={zerar}>Zerar</button>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);`
            }
          ]
        }
      ]
    }
  ]
};
