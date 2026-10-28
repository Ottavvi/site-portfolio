import { carteira, titulo, BAIRROS, TIPOS } from './imoveis.js';
import { fachada, planta } from './desenhos.js';
import { sac, price, grafico } from './financiamento.js';

const $ = (s, el = document) => el.querySelector(s);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const num = s =>
  Number(
    String(s)
      .replace(/[^\d,]/g, '')
      .replace(',', '.')
  ) || 0;
const milhar = v => Math.round(v).toLocaleString('pt-BR');

const IMOVEIS = carteira();
const JUROS_PADRAO = 11.5;

// custo mensal: aluguel + condomínio + IPTU, ou parcela estimada (80% financiado em 30 anos, Price) + condomínio + IPTU
function parcelaEstimada(im) {
  return price(im.preco * 0.8, 360, JUROS_PADRAO).primeira;
}
function custoMes(im) {
  const base = im.negocio === 'alugar' ? im.preco : parcelaEstimada(im);
  return base + im.condominio + im.iptu;
}

// ---------- favoritos ----------
let favs = new Set();
try {
  favs = new Set(JSON.parse(localStorage.getItem('casanorte:favs')) || []);
} catch {
  /* sem armazenamento */
}
function salvarFavs() {
  try {
    localStorage.setItem('casanorte:favs', JSON.stringify([...favs]));
  } catch {
    /* ignora */
  }
  $('#qtd-favs').textContent = favs.size;
}
let soFavs = false;

// ---------- filtros ----------
const busca = $('#busca');
$('#f-bairro').insertAdjacentHTML('beforeend', BAIRROS.map(b => `<option>${b.nome}</option>`).join(''));
$('#f-tipo').insertAdjacentHTML('beforeend', TIPOS.map(t => `<option>${t}</option>`).join(''));
$('#a-bairro').innerHTML = BAIRROS.map(b => `<option>${b.nome}</option>`).join('');

const TETOS = [3000, 5000, 7000, 10000, 15000];
$('#f-teto').innerHTML =
  `<option value="0">Sem limite</option>` + TETOS.map(t => `<option value="${t}">${brl(t)}</option>`).join('');

function filtrar() {
  const f = Object.fromEntries(new FormData(busca));
  const ordem = $('#ordem').value;
  let lista = IMOVEIS.filter(
    im =>
      (soFavs ? favs.has(im.id) : im.negocio === f.negocio) &&
      (!f.bairro || im.bairro === f.bairro) &&
      (!f.tipo || im.tipo === f.tipo) &&
      im.quartos >= Number(f.quartos) &&
      (!Number(f.teto) || custoMes(im) <= Number(f.teto))
  );
  const chave = {
    custo: (a, b) => custoMes(a) - custoMes(b),
    'custo-desc': (a, b) => custoMes(b) - custoMes(a),
    m2: (a, b) => a.preco / a.area - b.preco / b.area,
    area: (a, b) => b.area - a.area,
    novos: (a, b) => a.dias - b.dias
  }[ordem];
  lista.sort(chave);
  return lista;
}

function quando(d) {
  if (d === 0) return 'Novo hoje';
  if (d < 7) return `Há ${d} ${d === 1 ? 'dia' : 'dias'}`;
  return null;
}

function cartao(im) {
  const fav = favs.has(im.id);
  const novo = quando(im.dias);
  const principal = im.negocio === 'alugar' ? `${brl(im.preco)}<small>/mês de aluguel</small>` : brl(im.preco);
  return `<li class="cartao">
    <button class="cartao-abrir" data-abrir="${im.id}" aria-label="Ver ${titulo(im)}">${fachada(im, false)}</button>
    ${novo ? `<span class="selo">${novo}</span>` : ''}
    <button class="fav ${fav ? 'ativo' : ''}" data-fav="${im.id}" aria-pressed="${fav}" aria-label="${fav ? 'Tirar dos salvos' : 'Salvar'}">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.3 4.5 7 4.5c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.7 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>
    </button>
    <div class="cartao-texto">
      <h3><button data-abrir="${im.id}">${titulo(im)}</button></h3>
      <p class="rua">${im.rua} · ${im.area} m² · ${im.vagas ? `${im.vagas} ${im.vagas === 1 ? 'vaga' : 'vagas'}` : 'sem vaga'}</p>
      <p class="preco">${principal}</p>
      <p class="mes"><span>Custo do mês</span> <b>${brl(custoMes(im))}</b></p>
    </div>
  </li>`;
}

function desenharLista() {
  const lista = filtrar();
  const neg = new FormData(busca).get('negocio');
  $('#contagem').innerHTML = soFavs
    ? `<b>${lista.length}</b> ${lista.length === 1 ? 'imóvel salvo' : 'imóveis salvos'} <button class="botao-linha" id="sair-favs">Voltar para a busca</button>`
    : `<b>${lista.length}</b> ${lista.length === 1 ? 'imóvel' : 'imóveis'} para ${neg}`;
  $('#lista').innerHTML = lista.map(cartao).join('');
  $('#nada').hidden = lista.length > 0;
  $('#ver-favoritos').setAttribute('aria-pressed', String(soFavs));
}

busca.addEventListener('change', () => {
  soFavs = false;
  desenharLista();
});
$('#ordem').addEventListener('change', desenharLista);
$('#limpar').addEventListener('click', () => {
  const neg = new FormData(busca).get('negocio');
  busca.reset();
  busca.querySelector(`[value=${neg}]`).checked = true;
  soFavs = false;
  desenharLista();
});
$('#ver-favoritos').addEventListener('click', () => {
  soFavs = !soFavs;
  desenharLista();
  $('#imoveis').scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
});

document.addEventListener('click', e => {
  const fav = e.target.closest('[data-fav]');
  if (fav) {
    const id = fav.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    salvarFavs();
    const ativo = favs.has(id);
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(b => {
      b.classList.toggle('ativo', ativo);
      b.setAttribute('aria-pressed', String(ativo));
      b.setAttribute('aria-label', ativo ? 'Tirar dos salvos' : 'Salvar');
      if (b.dataset.texto) b.lastChild.textContent = ativo ? ' Salvo' : ' Salvar';
    });
    if (soFavs && !dialogo.open) desenharLista();
    return;
  }
  const abrir = e.target.closest('[data-abrir]');
  if (abrir) return abrirDetalhe(abrir.dataset.abrir);
  if (e.target.closest('#sair-favs')) {
    soFavs = false;
    desenharLista();
  }
});

// ---------- detalhe ----------
const dialogo = $('#detalhe');
dialogo.addEventListener('click', e => {
  if (e.target === dialogo || e.target.closest('[data-fechar]')) dialogo.close();
});

function proximosDias() {
  const nomes = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const lista = [];
  const d = new Date();
  while (lista.length < 5) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) lista.push(`${nomes[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}`);
  }
  return lista;
}

function abrirDetalhe(id) {
  const im = IMOVEIS.find(x => x.id === id);
  const fav = favs.has(im.id);
  const linhas = [
    [
      im.negocio === 'alugar' ? 'Aluguel' : 'Parcela estimada*',
      im.negocio === 'alugar' ? im.preco : parcelaEstimada(im)
    ],
    ['Condomínio', im.condominio],
    ['IPTU (por mês)', im.iptu]
  ];
  const dias = proximosDias();
  $('#det-corpo').innerHTML = `
    <div class="det-topo">
      <p class="codigo">Código ${im.id}</p>
      <button class="fechar" data-fechar aria-label="Fechar">×</button>
    </div>
    <div class="det-imagens">${fachada(im)}${planta(im)}</div>
    <div class="det-grade">
      <div>
        <h2 id="det-titulo">${titulo(im)}</h2>
        <p class="rua">${im.rua}, ${im.bairro}${im.andar ? ` · ${im.andar}º andar` : ''} · construído em ${im.ano}</p>
        <ul class="ficha">
          <li><b>${im.area} m²</b>área privativa</li>
          <li><b>${im.quartos}</b>${im.quartos === 1 ? 'quarto' : 'quartos'}${im.suites ? ', 1 suíte' : ''}</li>
          <li><b>${im.banheiros}</b>${im.banheiros === 1 ? 'banheiro' : 'banheiros'}</li>
          <li><b>${im.vagas}</b>${im.vagas === 1 ? 'vaga' : 'vagas'}</li>
        </ul>
        ${im.extras.length ? `<ul class="extras">${im.extras.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
        <button class="botao-linha ${fav ? 'ativo' : ''}" data-fav="${im.id}" data-texto="1" aria-pressed="${fav}">♥ ${fav ? 'Salvo' : 'Salvar'}</button>
      </div>
      <aside class="det-custos">
        <p class="det-preco">${im.negocio === 'alugar' ? `${brl(im.preco)} <small>/mês</small>` : brl(im.preco)}</p>
        <p class="det-m2">${brl(im.negocio === 'alugar' ? im.preco / im.area : im.preco / im.area)}${im.negocio === 'alugar' ? '/m² de aluguel' : ' por m²'}</p>
        <table class="custos">
          ${linhas.map(([n, v]) => `<tr><th scope="row">${n}</th><td>${v ? brl(v) : '—'}</td></tr>`).join('')}
          <tr class="total"><th scope="row">Custo do mês</th><td>${brl(custoMes(im))}</td></tr>
        </table>
        ${im.negocio === 'comprar' ? `<p class="nota">*80% financiado em 30 anos a ${String(JUROS_PADRAO).replace('.', ',')}% ao ano, tabela Price. <button class="botao-linha" data-simular="${im.id}">Simular com outros valores</button></p>` : ''}
        <form class="visita" data-visita="${im.id}">
          <h3>Agendar visita</h3>
          <div class="dias-visita">${dias.map((d, i) => `<label><input type="radio" name="dia" value="${d}" ${i === 0 ? 'checked' : ''}/><span>${d}</span></label>`).join('')}</div>
          <div class="dias-visita">${['Manhã', 'Tarde', 'Noite'].map((p, i) => `<label><input type="radio" name="periodo" value="${p}" ${i === 1 ? 'checked' : ''}/><span>${p}</span></label>`).join('')}</div>
          <button class="botao botao-largo">Pedir visita pelo WhatsApp</button>
        </form>
      </aside>
    </div>`;
  dialogo.showModal();
  $('.fechar', dialogo).focus();
}

dialogo.addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const im = IMOVEIS.find(x => x.id === form.dataset.visita);
  const f = new FormData(form);
  const msg =
    `Olá! Quero visitar o imóvel ${im.id} (${titulo(im)}, ${im.rua}) na ${f.get('dia')}, período da ${f.get('periodo').toLowerCase()}.`.replace(
      'período da noite',
      'à noite'
    );
  window.open(`https://wa.me/5541900000000?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

dialogo.addEventListener('click', e => {
  const b = e.target.closest('[data-simular]');
  if (!b) return;
  const im = IMOVEIS.find(x => x.id === b.dataset.simular);
  formSim.valor.value = milhar(im.preco);
  formSim.entrada.value = milhar(im.preco * 0.2);
  simular();
  dialogo.close();
  $('#simulador').scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  });
});

// ---------- simulador ----------
const formSim = $('#form-sim');
formSim.anos.innerHTML = [10, 15, 20, 25, 30, 35]
  .map(a => `<option value="${a}" ${a === 30 ? 'selected' : ''}>${a} anos</option>`)
  .join('');

function simular() {
  const valor = num(formSim.valor.value);
  const entrada = num(formSim.entrada.value);
  const juros = num(formSim.juros.value);
  const meses = Number(formSim.anos.value) * 12;
  const fin = valor - entrada;
  const cartoes = $('#sim-cartoes');
  if (valor <= 0 || fin <= 0 || juros <= 0) {
    cartoes.innerHTML = `<p class="sim-aviso">Confira os valores: a entrada precisa ser menor que o valor do imóvel e os juros maiores que zero.</p>`;
    $('#sim-grafico').innerHTML = '';
    return;
  }
  const s = sac(fin, meses, juros);
  const p = price(fin, meses, juros);
  const pctEntrada = (entrada / valor) * 100;
  cartoes.innerHTML = `
    <div class="sim-cartao sac">
      <h3>SAC</h3>
      <p class="sim-valor">${brl(s.primeira)}</p>
      <p>primeira parcela, caindo até ${brl(s.ultima)}</p>
      <p>Juros no total: <b>${brl(s.juros)}</b></p>
      <p>Renda mínima: <b>${brl(s.primeira / 0.3)}</b></p>
    </div>
    <div class="sim-cartao price">
      <h3>Price</h3>
      <p class="sim-valor">${brl(p.primeira)}</p>
      <p>todas as parcelas</p>
      <p>Juros no total: <b>${brl(p.juros)}</b></p>
      <p>Renda mínima: <b>${brl(p.primeira / 0.3)}</b></p>
    </div>
    <p class="sim-rodape">Financiando ${brl(fin)} em ${meses} meses. A SAC economiza <b>${brl(p.juros - s.juros)}</b> de juros.
    ${pctEntrada < 20 ? `<br><span class="alerta">A entrada é ${pctEntrada.toFixed(0)}% do valor; a maioria dos bancos pede pelo menos 20%.</span>` : ''}</p>`;
  $('#sim-grafico').innerHTML = grafico(s, p, meses);
}
formSim.addEventListener('input', simular);
for (const campo of [formSim.valor, formSim.entrada]) {
  campo.addEventListener('blur', () => {
    const v = num(campo.value);
    if (v) campo.value = milhar(v);
  });
}

// ---------- anunciar ----------
const formAn = $('#form-anunciar');
function estimar() {
  const area = num(formAn.area.value);
  const b = BAIRROS.find(x => x.nome === formAn.bairro.value);
  const el = $('#estimativa');
  if (!area) {
    el.textContent = 'Informe a área para ver a faixa de preço.';
    return;
  }
  const meio = area * b.m2;
  el.innerHTML =
    `Faixa de venda no ${b.nome}: <b>${brl(Math.round((meio * 0.9) / 5000) * 5000)} a ${brl(Math.round((meio * 1.1) / 5000) * 5000)}</b>`.replace(
      'no Água',
      'na Água'
    );
  $('#anunciar-zap').href =
    `https://wa.me/5541900000000?text=${encodeURIComponent(`Olá! Quero anunciar um imóvel de ${area} m² no ${b.nome}.`)}`;
}
formAn.addEventListener('input', estimar);
formAn.addEventListener('submit', e => e.preventDefault());

salvarFavs();
desenharLista();
simular();
