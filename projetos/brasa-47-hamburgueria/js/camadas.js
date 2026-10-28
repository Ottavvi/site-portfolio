// Desenha um hambúrguer em SVG a partir de uma lista de camadas (de baixo para cima).
// O mesmo desenho serve para o "monte o seu" e para as miniaturas do cardápio.

const L = 320; // largura do desenho

function onda(y, amp, passo, x0 = 14, x1 = L - 14) {
  let d = `M${x0} ${y}`;
  for (let x = x0; x < x1; x += passo) d += ` q${passo / 2} ${amp} ${passo} 0`;
  return d;
}

const PAES = {
  brioche: { base: '#d98a3a', topo: '#e39a43', brilho: '#f0b866' },
  australiano: { base: '#6b3a23', topo: '#7a432a', brilho: '#9a5d3d' },
  semgluten: { base: '#c99a5a', topo: '#d6a965', brilho: '#e8c88f' }
};

export const CAMADAS = {
  'pao-base': {
    h: 34,
    svg: (y, o) => {
      const c = PAES[o.pao || 'brioche'];
      return `<path d="M22 ${y} H298 V${y + 14} Q298 ${y + 34} 270 ${y + 34} H50 Q22 ${y + 34} 22 ${y + 14}Z" fill="${c.base}"/>
      <path d="M22 ${y} H298 V${y + 6} H22Z" fill="${c.brilho}" opacity=".5"/>`;
    }
  },
  carne: {
    h: 30,
    svg: y => `<rect x="12" y="${y + 1}" width="296" height="28" rx="14" fill="#5a2e1c"/>
      <path d="M40 ${y + 9} h50 M120 ${y + 9} h60 M210 ${y + 9} h70 M60 ${y + 20} h70 M160 ${y + 20} h50 M240 ${y + 20} h40" stroke="#7d4529" stroke-width="3" stroke-linecap="round"/>`
  },
  'carne-180': {
    h: 40,
    svg: y => `<rect x="10" y="${y + 1}" width="300" height="38" rx="18" fill="#4f2717"/>
      <path d="M40 ${y + 12} h60 M130 ${y + 12} h70 M230 ${y + 12} h50 M60 ${y + 26} h80 M170 ${y + 26} h90" stroke="#764127" stroke-width="3.5" stroke-linecap="round"/>`
  },
  veggie: {
    h: 30,
    svg: y => `<rect x="12" y="${y + 1}" width="296" height="28" rx="14" fill="#8a6a2f"/>
      <g fill="#a98a48">${[40, 90, 150, 200, 260, 70, 180, 240].map((x, i) => `<circle cx="${x}" cy="${y + (i < 5 ? 10 : 20)}" r="4"/>`).join('')}</g>`
  },
  cheddar: {
    h: 10,
    svg: y =>
      `<path d="M8 ${y} H312 V${y + 6} L290 ${y + 6} L282 ${y + 20} L272 ${y + 6} L190 ${y + 6} L180 ${y + 24} L170 ${y + 6} L80 ${y + 6} L70 ${y + 18} L60 ${y + 6} L8 ${y + 6}Z" fill="#f2a516"/>`
  },
  prato: {
    h: 10,
    svg: y =>
      `<path d="M8 ${y} H312 V${y + 6} L250 ${y + 6} L242 ${y + 16} L234 ${y + 6} L110 ${y + 6} L100 ${y + 18} L90 ${y + 6} L8 ${y + 6}Z" fill="#f6d36b"/>`
  },
  bacon: {
    h: 12,
    svg: y => `<path d="${onda(y + 6, 8, 24, 6, 314)}" stroke="#a8402a" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="${onda(y + 6, 8, 24, 6, 314)}" stroke="#e3a48d" stroke-width="2.5" fill="none"/>`
  },
  alface: {
    h: 14,
    svg: y => `<path d="${onda(y + 8, 12, 20, 4, 316)} V${y + 4} H4Z" fill="#6e9a2f"/>
      <path d="${onda(y + 4, 8, 20, 8, 312)}" stroke="#8fbe4a" stroke-width="3" fill="none"/>`
  },
  tomate: {
    h: 12,
    svg: y => `<rect x="18" y="${y}" width="138" height="12" rx="6" fill="#d2412c"/><rect x="164" y="${y}" width="138" height="12" rx="6" fill="#d2412c"/>
      <path d="M40 ${y + 6}h90M186 ${y + 6}h90" stroke="#f08a6a" stroke-width="2" stroke-dasharray="4 8"/>`
  },
  cebola: {
    h: 10,
    svg: y =>
      [50, 120, 190, 260]
        .map(x => `<ellipse cx="${x}" cy="${y + 5}" rx="34" ry="5" fill="none" stroke="#a65d93" stroke-width="3.5"/>`)
        .join('')
  },
  caramelizada: {
    h: 10,
    svg: y =>
      `<path d="${onda(y + 5, 6, 14, 16, 304)}" stroke="#9a5a1e" stroke-width="7" fill="none" stroke-linecap="round"/>`
  },
  picles: {
    h: 8,
    svg: y =>
      [44, 100, 160, 220, 276]
        .map(
          x => `<ellipse cx="${x}" cy="${y + 4}" rx="22" ry="4.5" fill="#7c9a3a" stroke="#5e7a2e" stroke-width="1.5"/>`
        )
        .join('')
  },
  ovo: {
    h: 16,
    svg: y => `<path d="M30 ${y + 8} Q40 ${y - 4} 110 ${y + 2} Q170 ${y - 6} 230 ${y + 2} Q300 ${y - 2} 292 ${y + 12} Q200 ${y + 20} 160 ${y + 16} Q60 ${y + 22} 30 ${y + 8}Z" fill="#fbf4e4"/>
      <ellipse cx="160" cy="${y + 7}" rx="30" ry="9" fill="#f2b11d"/>`
  },
  crispy: {
    h: 10,
    svg: y =>
      `<g stroke="#c97b26" stroke-width="3" stroke-linecap="round" fill="none">${[30, 64, 98, 132, 166, 200, 234, 268].map((x, i) => `<path d="M${x} ${y + 8} q8 -${6 + (i % 3) * 2} 18 -2"/>`).join('')}</g>`
  },
  'molho-casa': {
    h: 6,
    svg: y =>
      `<path d="${onda(y + 3, 6, 26, 12, 308)}" stroke="#f3dca0" stroke-width="6" fill="none" stroke-linecap="round"/>`
  },
  barbecue: {
    h: 6,
    svg: y =>
      `<path d="${onda(y + 3, 6, 26, 12, 308)}" stroke="#6a2414" stroke-width="6" fill="none" stroke-linecap="round"/>`
  },
  alho: {
    h: 6,
    svg: y =>
      `<path d="${onda(y + 3, 6, 26, 12, 308)}" stroke="#fbf7ea" stroke-width="6" fill="none" stroke-linecap="round"/>`
  },
  'pao-topo': {
    h: 74,
    svg: (y, o) => {
      const c = PAES[o.pao || 'brioche'];
      const gergelim =
        o.pao === 'australiano'
          ? ''
          : [
              [90, 24],
              [130, 14],
              [175, 12],
              [220, 22],
              [110, 40],
              [160, 32],
              [205, 42],
              [250, 38],
              [70, 46],
              [145, 52],
              [190, 56]
            ]
              .map(
                ([x, dy], i) =>
                  `<ellipse cx="${x}" cy="${y + dy}" rx="5" ry="2.6" fill="#fbecc6" transform="rotate(${(i % 3) * 25 - 25} ${x} ${y + dy})"/>`
              )
              .join('');
      return `<path d="M18 ${y + 66} Q14 ${y + 8} 160 ${y + 2} Q306 ${y + 8} 302 ${y + 66} Q302 ${y + 74} 290 ${y + 74} H30 Q18 ${y + 74} 18 ${y + 66}Z" fill="${c.topo}"/>
      <path d="M60 ${y + 26} Q100 ${y + 8} 160 ${y + 8}" stroke="${c.brilho}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".7"/>${gergelim}`;
    }
  }
};

// camadas: de baixo para cima, sem os pães (que entram sozinhos)
export function desenhar(camadas, opcoes = {}, titulo = '') {
  const todas = ['pao-base', ...camadas, 'pao-topo'];
  const altura = todas.reduce((s, c) => s + CAMADAS[c].h, 0) + 24;
  // pinta de baixo para cima: o queijo escorre por cima da carne que está embaixo dele
  let y = altura - 4;
  let corpo = '';
  for (const c of todas) {
    y -= CAMADAS[c].h;
    corpo += CAMADAS[c].svg(y, opcoes);
  }
  const rotulo = titulo ? `role="img" aria-label="${titulo}"` : 'aria-hidden="true"';
  return `<svg viewBox="0 0 ${L} ${altura}" ${rotulo} class="burger"><ellipse cx="160" cy="${altura - 4}" rx="150" ry="6" fill="#2b1d16" opacity=".12"/>${corpo}</svg>`;
}
