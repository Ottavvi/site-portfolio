// SAC e Price. Valores estimados: não incluem seguros (MIP/DFI), taxa de administração nem TR.

export function taxaMensal(anual) {
  return Math.pow(1 + anual / 100, 1 / 12) - 1;
}

export function sac(valor, meses, anual) {
  const i = taxaMensal(anual);
  const amort = valor / meses;
  const parcelas = [];
  let saldo = valor;
  let juros = 0;
  for (let m = 0; m < meses; m++) {
    const j = saldo * i;
    parcelas.push(amort + j);
    juros += j;
    saldo -= amort;
  }
  return { parcelas, juros, primeira: parcelas[0], ultima: parcelas[meses - 1] };
}

export function price(valor, meses, anual) {
  const i = taxaMensal(anual);
  const p = i === 0 ? valor / meses : (valor * i) / (1 - Math.pow(1 + i, -meses));
  return { parcelas: Array(meses).fill(p), juros: p * meses - valor, primeira: p, ultima: p };
}

// Gráfico: parcela ao longo dos anos (média anual) das duas tabelas.
export function grafico(a, b, meses) {
  const W = 560;
  const H = 220;
  const pad = { l: 64, r: 16, t: 16, b: 30 };
  const anos = Math.ceil(meses / 12);
  const media = lista =>
    Array.from({ length: anos }, (_, k) => {
      const fatia = lista.slice(k * 12, k * 12 + 12);
      return fatia.reduce((s, v) => s + v, 0) / fatia.length;
    });
  const sa = media(a.parcelas);
  const pr = media(b.parcelas);
  const max = Math.max(...sa, ...pr) * 1.08;
  const x = k => pad.l + (k / Math.max(1, anos - 1)) * (W - pad.l - pad.r);
  const y = v => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const caminho = lista => lista.map((v, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)} ${y(v).toFixed(1)}`).join('');
  const marcas = [0, 0.25, 0.5, 0.75, 1].map(f => max * f);
  const fmt = v => `R$ ${(Math.round(v / 100) / 10).toLocaleString('pt-BR')} mil`;
  let s = marcas
    .map(
      v =>
        `<path d="M${pad.l} ${y(v)}H${W - pad.r}" stroke="currentColor" opacity=".12"/><text x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end">${v ? fmt(v) : '0'}</text>`
    )
    .join('');
  const passoAno = anos > 20 ? 10 : 5;
  for (let k = 0; k < anos; k += passoAno)
    s += `<text x="${x(k)}" y="${H - 8}" text-anchor="middle">ano ${k + 1}</text>`;
  s += `<path d="${caminho(pr)}" stroke="#e8c468" stroke-width="3" fill="none"/>`;
  s += `<path d="${caminho(sa)}" stroke="#a9b9a0" stroke-width="3" fill="none"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="grafico" role="img" aria-label="Parcela média por ano: SAC começa em ${fmt(sa[0])} e cai; Price fica em ${fmt(pr[0])}">${s}</svg>`;
}
