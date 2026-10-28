// Gráficos em SVG, sem biblioteca. Cada função devolve o SVG como texto, pronto para entrar no HTML.
import { dataCurta, dinheiro, dinheiroCurto, html, mesCurto } from './util.js';

const largura = 640;

// Escala "bonita" para o eixo: 0, 1.000, 2.000... até passar do máximo
function passos(maximo, quantos = 4) {
  if (maximo <= 0) return [0];
  const bruto = maximo / quantos;
  const ordem = 10 ** Math.floor(Math.log10(bruto));
  const passo = [1, 2, 2.5, 5, 10].map(m => m * ordem).find(p => p >= bruto);
  return Array.from({ length: Math.ceil(maximo / passo) + 1 }, (_, i) => i * passo);
}

// Barras lado a lado: entradas e saídas de cada mês
export function barrasMensais(serie, { altura = 220 } = {}) {
  const margem = { esquerda: 56, direita: 8, topo: 12, base: 28 };
  const maximo = Math.max(...serie.flatMap(m => [m.entradas, m.saidas]), 1);
  const marcas = passos(maximo);
  const topoEscala = marcas.at(-1);
  const area = largura - margem.esquerda - margem.direita;
  const grupo = area / serie.length;
  const barra = Math.min(16, grupo / 3);
  const y = v => margem.topo + (altura - margem.topo - margem.base) * (1 - v / topoEscala);
  const linhas = marcas
    .map(
      v => `<line x1="${margem.esquerda}" x2="${largura - margem.direita}" y1="${y(v)}" y2="${y(v)}" class="g-grade"/>
      <text x="${margem.esquerda - 8}" y="${y(v) + 4}" class="g-eixo" text-anchor="end">${dinheiroCurto(v).replace('R$', '').trim()}</text>`
    )
    .join('');
  const barras = serie
    .map((m, i) => {
      const x = margem.esquerda + grupo * i + grupo / 2;
      return `<g>
        <title>${html(mesCurto(m.mes))}: entraram ${dinheiro(m.entradas)}, saíram ${dinheiro(m.saidas)}</title>
        <rect x="${x - barra - 1}" y="${y(m.entradas)}" width="${barra}" height="${y(0) - y(m.entradas)}" rx="2" class="g-entrada"/>
        <rect x="${x + 1}" y="${y(m.saidas)}" width="${barra}" height="${y(0) - y(m.saidas)}" rx="2" class="g-saida"/>
        <text x="${x}" y="${altura - 8}" class="g-eixo" text-anchor="middle">${mesCurto(m.mes)}</text>
      </g>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${largura} ${altura}" class="grafico" role="img" aria-label="Entradas e saídas por mês">${linhas}${barras}</svg>`;
}

// Linha do saldo previsto, com a linha do zero e o ponto mais baixo marcado
export function linhaPrevisao(serie, { altura = 220, menor } = {}) {
  const margem = { esquerda: 64, direita: 12, topo: 14, base: 28 };
  const valores = serie.map(p => p.saldo);
  let minimo = Math.min(...valores, 0);
  let maximo = Math.max(...valores, 1);
  const folga = (maximo - minimo) * 0.08;
  minimo -= folga;
  maximo += folga;
  const x = i => margem.esquerda + ((largura - margem.esquerda - margem.direita) * i) / (serie.length - 1);
  const y = v => margem.topo + (altura - margem.topo - margem.base) * (1 - (v - minimo) / (maximo - minimo));
  const caminho = serie.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.saldo).toFixed(1)}`).join('');
  const area = `${caminho}L${x(serie.length - 1)},${y(Math.max(minimo, 0))}L${x(0)},${y(Math.max(minimo, 0))}Z`;
  const marcasData = [0, Math.floor(serie.length / 3), Math.floor((serie.length * 2) / 3), serie.length - 1]
    .map(
      i =>
        `<text x="${x(i)}" y="${altura - 8}" class="g-eixo" text-anchor="${i ? (i === serie.length - 1 ? 'end' : 'middle') : 'start'}">${dataCurta(serie[i].data)}</text>`
    )
    .join('');
  const marcasValor = [maximo - folga, (maximo + minimo) / 2, minimo + folga]
    .map(
      v =>
        `<text x="${margem.esquerda - 8}" y="${y(v) + 4}" class="g-eixo" text-anchor="end">${dinheiroCurto(v).replace('R$', '').trim()}</text>`
    )
    .join('');
  // Linha do zero: tracejada em vermelho só quando a previsão passa dela
  const negativo = valores.some(v => v < 0);
  const zero = `<line x1="${margem.esquerda}" x2="${largura - margem.direita}" y1="${y(0)}" y2="${y(0)}" class="${negativo ? 'g-zero' : 'g-grade'}"/>`;
  const iMenor = menor ? serie.findIndex(p => p.data === menor.data) : -1;
  const ponto =
    iMenor > 0
      ? `<circle cx="${x(iMenor)}" cy="${y(menor.saldo)}" r="5" class="g-ponto"/>
         <text x="${x(iMenor)}" y="${y(menor.saldo) + (menor.saldo < (maximo + minimo) / 2 ? -12 : 20)}" class="g-rotulo" text-anchor="${iMenor > serie.length * 0.8 ? 'end' : 'middle'}">menor saldo: ${dinheiroCurto(menor.saldo)}</text>`
      : '';
  return `<svg viewBox="0 0 ${largura} ${altura}" class="grafico" role="img" aria-label="Saldo previsto para os próximos dias">
    ${marcasValor}${zero}
    <path d="${area}" class="g-area"/>
    <path d="${caminho}" class="g-linha"/>
    ${ponto}${marcasData}
  </svg>`;
}

// Barras horizontais por categoria (onde o dinheiro foi). Cada barra tem a cor da cédula da categoria.
export function barrasCategorias(linhas, { comOrcamento = true } = {}) {
  const maximo = Math.max(...linhas.map(l => Math.max(l.total, comOrcamento ? l.orcamento || 0 : 0)), 1);
  return `<ul class="cat-barras">${linhas
    .map(l => {
      const pct = (l.total / maximo) * 100;
      const limite = comOrcamento && l.orcamento ? (l.orcamento / maximo) * 100 : null;
      return `<li>
        <span class="cat-nome"><i style="background:${l.categoria.cor}"></i>${html(l.categoria.nome)}</span>
        <span class="cat-trilho">
          <span class="cat-barra" style="width:${pct.toFixed(1)}%;background:${l.categoria.cor}"></span>
          ${limite != null ? `<span class="cat-limite" style="left:${limite.toFixed(1)}%" title="Orçamento: ${dinheiro(l.orcamento)}"></span>` : ''}
        </span>
        <span class="cat-valor">${dinheiro(l.total)}</span>
      </li>`;
    })
    .join('')}</ul>`;
}

// Mini gráfico de linha (sem eixos) para cartões e respostas do chat
export function faisca(valores, { largura: l = 120, altura: a = 32 } = {}) {
  if (valores.length < 2) return '';
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const y = v => a - 3 - ((v - min) / (max - min || 1)) * (a - 6);
  const pontos = valores.map((v, i) => `${((i / (valores.length - 1)) * l).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${l} ${a}" width="${l}" height="${a}" class="faisca" aria-hidden="true"><polyline points="${pontos}"/></svg>`;
}
