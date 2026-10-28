// Fachadas e plantas em SVG, geradas a partir dos dados de cada imóvel (nada de fotos de banco de imagens).

const PAREDES = ['#d9cbb5', '#c9d3c4', '#e3d2c4', '#cdd5da', '#e6dcc0'];
const TINTA = '#1e3a4c';
const TIJOLO = '#b5533c';

export function fachada(im, rotulo = true) {
  const parede = PAREDES[im.cor];
  const aria = rotulo
    ? `role="img" aria-label="Ilustração da fachada: ${im.tipo.toLowerCase()} no ${im.bairro}"`
    : 'aria-hidden="true"';
  const ceu = `<rect width="400" height="260" fill="#e7ecea"/><circle cx="${330 - im.cor * 30}" cy="58" r="22" fill="#e8c468"/>`;
  const chao = `<rect y="232" width="400" height="28" fill="#a9b9a0"/>`;
  let corpo = '';
  if (im.tipo === 'Apartamento' || im.tipo === 'Studio') {
    const andares = Math.min(8, Math.max(4, Math.round((im.andar || 6) / 2) + 2));
    const h = 22;
    const topo = 232 - andares * h - 12;
    corpo += `<rect x="120" y="${topo}" width="160" height="${232 - topo}" fill="${parede}"/>`;
    corpo += `<rect x="114" y="${topo - 6}" width="172" height="8" fill="${TINTA}"/>`;
    for (let a = 0; a < andares; a++) {
      const y = topo + 8 + a * h;
      for (let j = 0; j < 4; j++) {
        const aceso = (a * 7 + j * 3 + im.cor) % 5 === 0;
        corpo += `<rect x="${132 + j * 36}" y="${y}" width="24" height="14" fill="${aceso ? '#f2d98a' : TINTA}" opacity="${aceso ? 1 : 0.82}"/>`;
      }
      corpo += `<rect x="128" y="${y + 15}" width="144" height="2" fill="${TINTA}" opacity=".25"/>`;
    }
    corpo += `<rect x="186" y="204" width="28" height="28" fill="${TIJOLO}"/>`;
    // prédio vizinho
    corpo += `<rect x="30" y="150" width="70" height="82" fill="#cfd6d2"/><rect x="300" y="128" width="76" height="104" fill="#d6dbd8"/>`;
  } else {
    const sobrado = im.tipo === 'Sobrado';
    const base = sobrado ? 120 : 160;
    corpo += `<rect x="90" y="${base}" width="220" height="${232 - base}" fill="${parede}"/>`;
    corpo += `<path d="M76 ${base + 2} L200 ${base - 64} L324 ${base + 2}Z" fill="${TIJOLO}"/>`;
    corpo += `<rect x="186" y="186" width="30" height="46" fill="${TINTA}"/><circle cx="210" cy="210" r="2" fill="#e8c468"/>`;
    corpo += `<rect x="112" y="184" width="50" height="30" fill="${TINTA}" opacity=".85"/><rect x="238" y="184" width="50" height="30" fill="${TINTA}" opacity=".85"/>`;
    corpo += `<path d="M137 184v30M112 199h50M263 184v30M238 199h50" stroke="${parede}" stroke-width="2"/>`;
    if (sobrado)
      corpo += `<rect x="112" y="134" width="50" height="28" fill="${TINTA}" opacity=".85"/><rect x="238" y="134" width="50" height="28" fill="#f2d98a"/><rect x="226" y="160" width="74" height="4" fill="${TINTA}"/>`;
    corpo += `<rect x="120" y="${base - 46}" width="16" height="30" fill="${TINTA}"/>`;
    // cerca e árvore
    corpo += `<path d="M20 232V212M36 232V212M52 232V212M68 232V212M14 218H74" stroke="#fbfaf7" stroke-width="3"/>`;
    corpo += `<rect x="350" y="190" width="6" height="42" fill="#6c5a45"/><circle cx="353" cy="178" r="26" fill="#7f9a72"/>`;
  }
  return `<svg viewBox="0 0 400 260" ${aria} class="fachada" preserveAspectRatio="xMidYMid slice">${ceu}${chao}${corpo}</svg>`;
}

// Planta baixa esquemática: sala e cozinha embaixo, quartos em cima.
export function planta(im) {
  const W = 360;
  const H = 240;
  const q = im.quartos;
  const linha = `stroke="${TINTA}" stroke-width="3" fill="none"`;
  const fino = `stroke="${TINTA}" stroke-width="1.5" fill="none"`;
  const txt = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="11" fill="${TINTA}">${t}</text>`;
  let s = `<rect x="10" y="10" width="${W - 20}" height="${H - 20}" ${linha}/>`;
  if (im.tipo === 'Studio') {
    s +=
      `<path d="M230 10V110H350" ${fino}/>` +
      txt(290, 64, 'Banho') +
      txt(120, 130, 'Estar e quarto') +
      txt(290, 180, 'Cozinha');
    s += `<path d="M230 150H350" ${fino}/>`;
  } else {
    const alturaQ = 104;
    const larg = (W - 20 - 70) / q;
    for (let i = 0; i < q; i++) {
      const x = 10 + i * larg;
      if (i > 0) s += `<path d="M${x} 10V${10 + alturaQ}" ${fino}/>`;
      s += txt(x + larg / 2, 56, i === 0 && im.suites ? 'Suíte' : `Quarto ${i + 1}`);
      s += `<path d="M${x + larg / 2 - 12} ${10 + alturaQ} a 14 14 0 0 1 14 -14" ${fino}/>`; // porta
    }
    s += `<path d="M10 ${10 + alturaQ}H${W - 10}M${W - 80} 10V${10 + alturaQ}" ${fino}/>` + txt(W - 45, 64, 'Banho');
    s += `<path d="M${W - 120} ${10 + alturaQ}V${H - 10}" ${fino}/>` + txt(W - 65, 180, 'Cozinha');
    s += txt((W - 120) / 2 + 5, 180, im.tipo === 'Apartamento' ? 'Sala e varanda' : 'Sala');
  }
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Planta esquemática com ${q} ${q === 1 ? 'quarto' : 'quartos'}" class="planta">
    <rect width="${W}" height="${H}" fill="#f7f8f6"/>${s}
    <text x="${W - 14}" y="${H - 16}" text-anchor="end" font-size="10" fill="${TINTA}" opacity=".6">${im.area} m² · sem escala</text></svg>`;
}
