import { EQUIPE, TRATAMENTOS, EXPEDIENTE } from './dados.js';
import {
  carregarConsultas,
  salvarConsultas,
  horariosLivres,
  proximosLivres,
  tratamento,
  profissional,
  isoDia,
  deIso,
  hora,
  diaCurto,
  diaRelativo
} from './agenda.js';

const $ = s => document.querySelector(s);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

let consultas = carregarConsultas();
const estado = { trat: 'avaliacao', prof: 'qualquer', inicio: 0, dia: null, slot: null };

// ---------- menu ----------
const botaoMenu = $('.menu-botao');
botaoMenu.addEventListener('click', () => {
  const aberto = botaoMenu.getAttribute('aria-expanded') === 'true';
  botaoMenu.setAttribute('aria-expanded', String(!aberto));
  $('#menu').classList.toggle('aberto', !aberto);
});
$('#menu').addEventListener('click', e => {
  if (e.target.closest('a')) {
    botaoMenu.setAttribute('aria-expanded', 'false');
    $('#menu').classList.remove('aberto');
  }
});

// ---------- tratamentos e equipe ----------
$('#lista-tratamentos').innerHTML = TRATAMENTOS.map(
  t => `
  <article class="tratamento">
    <h3>${t.nome}</h3>
    <p>${t.desc}</p>
    <dl>
      <div><dt>A partir de</dt><dd>${brl(t.preco)}</dd></div>
      <div><dt>Duração</dt><dd>${t.min} min</dd></div>
    </dl>
    <button class="link-forte" data-agendar="${t.id}">Agendar ${t.nome.toLowerCase()}</button>
  </article>`
).join('');

function retrato(p) {
  const iniciais = p.nome
    .replace(/^Dra?\.\s*/, '')
    .split(' ')
    .map(s => s[0])
    .join('');
  return `<svg viewBox="0 0 120 140" aria-hidden="true" class="retrato">
    <rect width="120" height="140" rx="60" fill="${p.cor}"/>
    <path d="M0 104c20-14 40-18 60-18s40 4 60 18v36H0z" fill="#f4f6f1" opacity=".14"/>
    <text x="60" y="78" text-anchor="middle" font-family="Young Serif" font-size="38" fill="#f4f6f1">${iniciais}</text>
  </svg>`;
}

const NOMES_DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
$('#lista-equipe').innerHTML = EQUIPE.map(
  p => `
  <article class="pessoa">
    ${retrato(p)}
    <div>
      <h3>${p.nome}</h3>
      <p class="area">${p.area} · ${p.cro}</p>
      <p>${p.sobre}</p>
      <p class="dias-atende">Atende ${p.dias.map(d => NOMES_DIAS[d]).join(', ')}</p>
    </div>
  </article>`
).join('');

// ---------- próximos horários (abertura) ----------
function desenharProximos() {
  const lista = proximosLivres('avaliacao', 4, consultas);
  $('#proximos').innerHTML = lista
    .map(
      h => `
    <li><button data-dia="${h.dia}" data-minuto="${h.minuto}" data-prof="${h.prof}">
      <span class="quando">${diaRelativo(deIso(h.dia))}, ${hora(h.minuto)}</span>
      <span class="com">${profissional(h.prof).nome}</span>
    </button></li>`
    )
    .join('');
}

$('#proximos').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  estado.trat = 'avaliacao';
  estado.prof = 'qualquer';
  escolherDia(deIso(b.dataset.dia));
  estado.slot = { minuto: Number(b.dataset.minuto), prof: b.dataset.prof };
  desenharFormulario();
  irPara('#agendar');
  setTimeout(() => $('#form-agenda [name=nome]').focus({ preventScroll: true }), 400);
});

document.addEventListener('click', e => {
  const b = e.target.closest('[data-agendar]');
  if (!b) return;
  estado.trat = b.dataset.agendar;
  estado.prof = 'qualquer';
  estado.slot = null;
  desenharFormulario();
  irPara('#agendar');
});

function irPara(sel) {
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $(sel).scrollIntoView({ behavior: reduz ? 'auto' : 'smooth', block: 'start' });
}

// ---------- formulário ----------
const selTrat = $('#campo-tratamento');
selTrat.innerHTML = TRATAMENTOS.map(t => `<option value="${t.id}">${t.nome} · ${t.min} min</option>`).join('');
selTrat.addEventListener('change', () => {
  estado.trat = selTrat.value;
  if (estado.prof !== 'qualquer' && !tratamento(estado.trat).profs.includes(estado.prof)) estado.prof = 'qualquer';
  estado.slot = null;
  desenharFormulario();
});

function diasAbertos() {
  const hoje = new Date();
  const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const lista = [];
  while (lista.length < 30) {
    if (EXPEDIENTE[d.getDay()]) lista.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return lista;
}
const DIAS = diasAbertos();
const POR_PAGINA = 6;

function escolherDia(d) {
  estado.dia = isoDia(d);
  const i = DIAS.findIndex(x => isoDia(x) === estado.dia);
  if (i >= 0) estado.inicio = Math.floor(i / POR_PAGINA) * POR_PAGINA;
}

function primeiroDiaComVaga() {
  for (const d of DIAS) if (horariosLivres(estado.trat, estado.prof, d, consultas).length) return d;
  return DIAS[0];
}

function desenharFormulario() {
  const trat = tratamento(estado.trat);
  selTrat.value = estado.trat;

  const opcoes = [{ id: 'qualquer', nome: 'Primeiro disponível' }, ...trat.profs.map(profissional)];
  $('#campo-profissional').innerHTML = opcoes
    .map(
      p => `
    <label class="chip"><input type="radio" name="prof" value="${p.id}" ${p.id === estado.prof ? 'checked' : ''}/>
    <span>${p.nome}</span></label>`
    )
    .join('');

  if (!estado.dia || !horariosLivres(estado.trat, estado.prof, deIso(estado.dia), consultas).length) {
    if (!estado.slot) escolherDia(primeiroDiaComVaga());
  }

  const pagina = DIAS.slice(estado.inicio, estado.inicio + POR_PAGINA);
  $('#campo-dia').innerHTML = pagina
    .map(d => {
      const iso = isoDia(d);
      const n = horariosLivres(estado.trat, estado.prof, d, consultas).length;
      return `<label class="dia ${n ? '' : 'lotado'}">
        <input type="radio" name="dia" value="${iso}" ${iso === estado.dia ? 'checked' : ''} ${n ? '' : 'disabled'}/>
        <span class="dia-nome">${diaRelativo(d)}</span>
        <span class="dia-vagas">${n ? `${n} ${n === 1 ? 'horário' : 'horários'}` : 'lotado'}</span>
      </label>`;
    })
    .join('');
  $('#dias-antes').disabled = estado.inicio === 0;
  $('#dias-depois').disabled = estado.inicio + POR_PAGINA >= DIAS.length;

  const livres = horariosLivres(estado.trat, estado.prof, deIso(estado.dia), consultas);
  if (estado.slot && !livres.some(h => h.minuto === estado.slot.minuto && h.prof === estado.slot.prof)) {
    const mesmo = livres.find(h => h.minuto === estado.slot.minuto);
    estado.slot = mesmo || null;
  }
  $('#campo-hora').innerHTML = livres.length
    ? livres
        .map(
          h => `<label class="hora"><input type="radio" name="hora" value="${h.minuto}|${h.prof}"
        ${estado.slot && estado.slot.minuto === h.minuto ? 'checked' : ''}/><span>${hora(h.minuto)}</span></label>`
        )
        .join('')
    : '<p class="vazio">Nenhum horário neste dia. Escolha outro dia acima.</p>';

  desenharResumo();
}

function desenharResumo() {
  const trat = tratamento(estado.trat);
  if (!estado.slot) {
    $('#resumo-texto').innerHTML = `<b>${trat.nome}</b>, ${trat.min} min. Escolha um horário.`;
    return;
  }
  $('#resumo-texto').innerHTML = `<b>${trat.nome}</b> com ${profissional(estado.slot.prof).nome},
    ${diaCurto(deIso(estado.dia))} às ${hora(estado.slot.minuto)}.`;
}

$('#campo-profissional').addEventListener('change', e => {
  estado.prof = e.target.value;
  estado.slot = null;
  desenharFormulario();
});
$('#campo-dia').addEventListener('change', e => {
  estado.dia = e.target.value;
  estado.slot = null;
  desenharFormulario();
});
$('#campo-hora').addEventListener('change', e => {
  const [m, p] = e.target.value.split('|');
  estado.slot = { minuto: Number(m), prof: p };
  $('#erro-agenda').textContent = '';
  desenharResumo();
});
$('#dias-antes').addEventListener('click', () => {
  estado.inicio = Math.max(0, estado.inicio - POR_PAGINA);
  desenharFormulario();
});
$('#dias-depois').addEventListener('click', () => {
  estado.inicio += POR_PAGINA;
  desenharFormulario();
});

const form = $('#form-agenda');
form.fone.addEventListener('input', () => {
  const n = form.fone.value.replace(/\D/g, '').slice(0, 11);
  form.fone.value =
    n.length > 6
      ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
      : n.length > 2
        ? `(${n.slice(0, 2)}) ${n.slice(2)}`
        : n;
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const erro = $('#erro-agenda');
  const nome = form.nome.value.trim();
  const fone = form.fone.value.replace(/\D/g, '');
  if (!estado.slot) return (erro.textContent = 'Escolha um horário para continuar.');
  if (nome.split(/\s+/).length < 2) {
    form.nome.focus();
    return (erro.textContent = 'Escreva nome e sobrenome.');
  }
  if (fone.length < 10) {
    form.fone.focus();
    return (erro.textContent = 'Confira o WhatsApp com DDD.');
  }
  erro.textContent = '';
  const consulta = {
    id: Date.now().toString(36),
    trat: estado.trat,
    prof: estado.slot.prof,
    dia: estado.dia,
    minuto: estado.slot.minuto,
    nome,
    fone: form.fone.value,
    obs: form.obs.value.trim()
  };
  consultas.push(consulta);
  salvarConsultas(consultas);
  form.obs.value = '';
  estado.slot = null;
  desenharTudo();
  avisar(`Agendado: ${diaCurto(deIso(consulta.dia))} às ${hora(consulta.minuto)}.`);
  irPara('#minhas');
});

// ---------- minhas consultas ----------
function desenharMinhas() {
  const hoje = isoDia(new Date());
  const futuras = consultas
    .filter(c => c.dia >= hoje)
    .sort((a, b) => (a.dia + a.minuto).localeCompare(b.dia + b.minuto));
  $('#minhas').hidden = !futuras.length;
  $('.menu-minhas').hidden = !futuras.length;
  $('#qtd-minhas').textContent = futuras.length;
  $('#lista-minhas').innerHTML = futuras
    .map(c => {
      const t = tratamento(c.trat);
      const msg = encodeURIComponent(
        `Olá! Agendei ${t.nome} para ${diaCurto(deIso(c.dia))} às ${hora(c.minuto)} com ${profissional(c.prof).nome}. Nome: ${c.nome}.`
      );
      return `<li>
        <div class="minha-data"><b>${diaRelativo(deIso(c.dia))}</b><span>${hora(c.minuto)}</span></div>
        <div class="minha-info"><b>${t.nome}</b><span>${profissional(c.prof).nome} · ${esc(c.nome)}</span></div>
        <div class="minha-acoes">
          <a class="link-forte" href="https://wa.me/5511900000000?text=${msg}" rel="noopener">Avisar no WhatsApp</a>
          <button class="link-sutil" data-cancelar="${c.id}">Cancelar</button>
        </div>
      </li>`;
    })
    .join('');
}

$('#lista-minhas').addEventListener('click', e => {
  const b = e.target.closest('[data-cancelar]');
  if (!b) return;
  const c = consultas.find(x => x.id === b.dataset.cancelar);
  if (b.dataset.confirmar !== 'sim') {
    b.dataset.confirmar = 'sim';
    b.textContent = 'Confirmar cancelamento';
    return;
  }
  consultas = consultas.filter(x => x !== c);
  salvarConsultas(consultas);
  desenharTudo();
  avisar('Consulta cancelada. O horário voltou para a agenda.');
});

let tempoAviso;
function avisar(texto) {
  const el = $('#aviso');
  el.textContent = texto;
  el.classList.add('visivel');
  clearTimeout(tempoAviso);
  tempoAviso = setTimeout(() => el.classList.remove('visivel'), 4000);
}

function desenharTudo() {
  desenharProximos();
  desenharFormulario();
  desenharMinhas();
}
desenharTudo();
