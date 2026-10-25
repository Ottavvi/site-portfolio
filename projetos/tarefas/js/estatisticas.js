// Visão "Estatísticas": ritmo de tarefas concluídas, sequência de dias e o que está pendente.
import { estado } from './estado.js';
import { hojeISO, paraData, somarDias } from './datas.js';
import { bolinha, elemento } from './render.js';

const concluidasEm = data => estado.historico[data] || 0;

// Dias seguidos com pelo menos uma tarefa concluída (hoje ainda pode entrar, então conta a partir de ontem se hoje está zerado)
function sequencia() {
  let dia = concluidasEm(hojeISO()) ? hojeISO() : somarDias(hojeISO(), -1);
  let n = 0;
  while (concluidasEm(dia)) {
    n++;
    dia = somarDias(dia, -1);
  }
  return n;
}

export function desenharEstatisticas() {
  const area = document.getElementById('areaEstatisticas');
  const hoje = hojeISO();
  const ultimos = Array.from({ length: 14 }, (_, i) => somarDias(hoje, i - 13));
  const pendentes = estado.tarefas.filter(t => !t.feita);
  const atrasadas = pendentes.filter(t => t.prazo && t.prazo < hoje).length;
  const semana = ultimos.slice(-7).reduce((s, d) => s + concluidasEm(d), 0);
  const melhor = Math.max(0, ...Object.values(estado.historico));
  const seq = sequencia();

  const cartoes = elemento('div', 'cartoes');
  for (const [valor, rotulo, classe] of [
    [concluidasEm(hoje), 'concluídas hoje'],
    [semana, 'nos últimos 7 dias'],
    [`${seq} ${seq === 1 ? 'dia' : 'dias'}`, 'de sequência 🔥'],
    [melhor, 'no seu melhor dia'],
    [pendentes.length, 'pendentes'],
    [atrasadas, 'atrasadas', atrasadas ? 'alerta' : '']
  ]) {
    const cartao = elemento('div', `cartao ${classe || ''}`);
    cartao.append(elemento('strong', null, String(valor)), elemento('span', null, rotulo));
    cartoes.append(cartao);
  }

  // Gráfico de barras dos últimos 14 dias
  const maximo = Math.max(1, ...ultimos.map(concluidasEm));
  const grafico = elemento('div', 'grafico', null, { role: 'list', 'aria-label': 'Tarefas concluídas por dia' });
  for (const dia of ultimos) {
    const n = concluidasEm(dia);
    const data = paraData(dia);
    const nomeDia = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const coluna = elemento('div', `coluna${dia === hoje ? ' hoje' : ''}`, null, {
      role: 'listitem',
      'aria-label': `${data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}: ${n} concluída(s)`
    });
    const barra = elemento('span', 'barra-dia');
    barra.style.height = `${(n / maximo) * 100}%`;
    coluna.append(
      elemento('span', 'valor', n ? String(n) : ''),
      barra,
      elemento('span', 'dia', `${nomeDia} ${data.getDate()}`)
    );
    grafico.append(coluna);
  }

  area.replaceChildren(
    cartoes,
    secao('Concluídas por dia', grafico),
    secao(
      'Pendentes por lista',
      barras(estado.listas, l => pendentes.filter(t => t.listaId === l.id).length)
    ),
    estado.categorias.length
      ? secao(
          'Pendentes por categoria',
          barras(estado.categorias, c => pendentes.filter(t => t.categoriaId === c.id).length)
        )
      : '',
    secao(
      'Pendentes por prioridade',
      barras(
        [
          { nome: 'Alta', cor: '#ff7a9a', p: 3 },
          { nome: 'Média', cor: '#ffb454', p: 2 },
          { nome: 'Baixa', cor: '#5cc8ff', p: 1 },
          { nome: 'Sem prioridade', cor: '#9aa1ad', p: 0 }
        ],
        x => pendentes.filter(t => t.prioridade === x.p).length
      )
    )
  );
}

function secao(titulo, conteudo) {
  const el = elemento('section', 'painel-estat');
  el.append(elemento('h2', null, titulo), conteudo);
  return el;
}

function barras(itens, contar) {
  const valores = itens.map(contar);
  const maximo = Math.max(1, ...valores);
  const lista = elemento('ul', 'barras');
  itens.forEach((item, i) => {
    const li = elemento('li');
    const nome = elemento('span', 'barras-nome');
    nome.append(bolinha(item.cor), item.nome);
    const trilho = elemento('span', 'barras-trilho');
    const barra = elemento('span', 'barras-barra');
    barra.style.width = `${(valores[i] / maximo) * 100}%`;
    barra.style.background = item.cor;
    trilho.append(barra);
    li.append(nome, trilho, elemento('span', 'barras-valor', String(valores[i])));
    lista.append(li);
  });
  return lista;
}
