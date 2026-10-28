import { MODALIDADES, EQUIPE, AULAS, DIAS, PLANOS, PERIODOS } from './dados.js';

const $ = (s, el = document) => el.querySelector(s);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

let reservas = [];
try {
  reservas = JSON.parse(localStorage.getItem('alento:reservas')) || [];
} catch {
  /* sem armazenamento */
}
function salvar() {
  try {
    localStorage.setItem('alento:reservas', JSON.stringify(reservas));
  } catch {
    /* ignora */
  }
}

// ---------- modalidades ----------
$('#lista-mod').innerHTML = Object.entries(MODALIDADES)
  .map(
    ([id, m]) => `<li style="--cor:${m.cor}">
      <h3>${m.nome}</h3><p>${m.desc}</p>
      <button class="link" data-filtrar="${id}">Ver horários</button>
    </li>`
  )
  .join('');

// ---------- grade ----------
let filtro = 'todas';
const ehReservada = id => reservas.some(r => r.aula === id);
const hora = h => h.replace(/^0/, '').replace(':', 'h').replace('h00', 'h');
const vagas = a => a.cap - a.ocupadas - (ehReservada(a.id) ? 1 : 0);

$('#filtros').innerHTML = [
  ['todas', 'Todas', '#3d2a4a'],
  ...Object.entries(MODALIDADES).map(([id, m]) => [id, m.nome, m.cor])
]
  .map(
    ([id, nome, cor]) =>
      `<button data-filtro="${id}" style="--cor:${cor}" aria-pressed="${id === filtro}">${nome}</button>`
  )
  .join('');

function botaoAula(a, comDia = false) {
  const m = MODALIDADES[a.mod];
  const res = ehReservada(a.id);
  const v = vagas(a);
  const estado = res ? 'Reservada' : v <= 0 ? 'Lotada' : `${v} ${v === 1 ? 'vaga' : 'vagas'}`;
  const esconder = filtro !== 'todas' && filtro !== a.mod;
  return `<button class="aula ${res ? 'reservada' : ''} ${v <= 0 && !res ? 'lotada' : ''}" style="--cor:${m.cor}" data-aula="${a.id}"
      ${v <= 0 && !res ? 'disabled' : ''} ${esconder ? 'hidden' : ''}
      aria-label="${DIAS[a.dia]} às ${hora(a.hora)}: ${m.nome} com ${a.prof}, ${estado}">
      ${comDia ? `<span class="aula-hora">${hora(a.hora)}</span>` : ''}
      <span class="aula-nome">${m.nome}</span>
      <span class="aula-prof">${a.prof} · ${a.nivel}</span>
      <span class="aula-vagas">${estado}</span>
    </button>`;
}

function desenharGrade() {
  const horas = [...new Set(AULAS.map(a => a.hora))].sort();
  let html =
    `<div class="g-canto"></div>` +
    DIAS.slice(1)
      .map(d => `<div class="g-dia">${d}</div>`)
      .join('');
  for (const h of horas) {
    html += `<div class="g-hora">${hora(h)}</div>`;
    for (let d = 1; d <= 6; d++) {
      const a = AULAS.find(x => x.dia === d && x.hora === h);
      html += `<div class="g-celula">${a ? botaoAula(a) : ''}</div>`;
    }
  }
  $('#grade-tabela').innerHTML = html;

  $('#grade-lista').innerHTML = DIAS.slice(1)
    .map((d, i) => {
      const aulas = AULAS.filter(a => a.dia === i + 1 && (filtro === 'todas' || a.mod === filtro));
      if (!aulas.length) return '';
      return `<h3>${d}</h3><div class="dia-aulas">${aulas.map(a => botaoAula(a, true)).join('')}</div>`;
    })
    .join('');

  document
    .querySelectorAll('[data-filtro]')
    .forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filtro === filtro)));
}

document.addEventListener('click', e => {
  const f = e.target.closest('[data-filtro]');
  if (f) {
    filtro = f.dataset.filtro;
    desenharGrade();
    return;
  }
  const fm = e.target.closest('[data-filtrar]');
  if (fm) {
    filtro = fm.dataset.filtrar;
    desenharGrade();
    $('#grade').scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
    return;
  }
  const a = e.target.closest('[data-aula]');
  if (a) abrirReserva(a.dataset.aula);
});

// ---------- reserva ----------
const dialogo = $('#reserva');
const form = $('#form-reserva');
let aulaAtual = null;

function abrirReserva(id) {
  const a = AULAS.find(x => x.id === id);
  const m = MODALIDADES[a.mod];
  aulaAtual = a;
  const r = reservas.find(x => x.aula === id);
  $('#reserva-tag').textContent = `${DIAS[a.dia]}, ${hora(a.hora)}`;
  $('#reserva-tag').style.setProperty('--cor', m.cor);
  $('#reserva-titulo').textContent = m.nome;
  $('#reserva-erro').textContent = '';
  if (r) {
    $('#reserva-info').innerHTML =
      `Reservada para <b>${esc(r.nome)}</b>. Chegue 10 minutos antes, com roupa confortável e meia antiderrapante.`;
    form.classList.add('ja-reservada');
    form.querySelector('.botao').textContent = 'Cancelar reserva';
  } else {
    $('#reserva-info').textContent =
      `Com ${a.prof} · nível ${a.nivel.toLowerCase()} · ${vagas(a)} ${vagas(a) === 1 ? 'vaga' : 'vagas'}`;
    form.classList.remove('ja-reservada');
    form.querySelector('.botao').textContent = 'Reservar aula experimental';
  }
  dialogo.showModal();
}

dialogo.addEventListener('click', e => {
  if (e.target === dialogo || e.target.closest('[data-fechar]')) dialogo.close();
});
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
  const a = aulaAtual;
  if (form.classList.contains('ja-reservada')) {
    reservas = reservas.filter(r => r.aula !== a.id);
    salvar();
    dialogo.close();
    desenharGrade();
    avisar('Reserva cancelada. A vaga voltou para a turma.');
    return;
  }
  const erro = $('#reserva-erro');
  if (form.nome.value.trim().length < 3) {
    form.nome.focus();
    return (erro.textContent = 'Escreva seu nome.');
  }
  if (form.fone.value.replace(/\D/g, '').length < 10) {
    form.fone.focus();
    return (erro.textContent = 'Confira o WhatsApp com DDD.');
  }
  // uma aula experimental por pessoa: troca a anterior
  const antiga = reservas.length;
  reservas = [{ aula: a.id, nome: form.nome.value.trim(), fone: form.fone.value, obs: form.obs.value.trim() }];
  salvar();
  dialogo.close();
  desenharGrade();
  avisar(
    `${antiga ? 'Trocamos sua aula experimental para' : 'Reservado:'} ${MODALIDADES[a.mod].nome.toLowerCase()}, ${DIAS[a.dia].toLowerCase()} às ${hora(a.hora)}.`
  );
});

// ---------- planos ----------
let periodo = 'mensal';
$('#periodos').innerHTML = PERIODOS.map(
  p =>
    `<label><input type="radio" name="periodo" value="${p.id}" ${p.id === periodo ? 'checked' : ''}/><span>${p.nome}${p.desconto ? ` <small>−${p.desconto * 100}%</small>` : ''}</span></label>`
).join('');

function desenharPlanos() {
  const tipo = document.querySelector('[name=tipo]:checked').value;
  const per = PERIODOS.find(p => p.id === periodo);
  $('#lista-planos').innerHTML = PLANOS.map(p => {
    const cheio = p[tipo];
    const mes = Math.round(cheio * (1 - per.desconto));
    const porAula = mes / (p.vezes * 4.3);
    return `<article class="plano ${p.vezes === 2 ? 'destaque' : ''}">
      <h3>${p.vezes}× por semana</h3>
      <p class="plano-preco">${brl(mes)}<small>/mês</small></p>
      ${per.desconto ? `<p class="plano-de"><s>${brl(cheio)}</s> no mensal</p>` : '<p class="plano-de">sem fidelidade</p>'}
      <p class="plano-aula">${brl(porAula)} por aula</p>
      ${p.vezes === 2 ? '<p class="plano-selo">o mais escolhido</p>' : ''}
    </article>`;
  }).join('');
}
$('#periodos').addEventListener('change', e => {
  periodo = e.target.value;
  desenharPlanos();
});
document.querySelectorAll('[name=tipo]').forEach(i => i.addEventListener('change', desenharPlanos));

// ---------- equipe ----------
$('#lista-equipe').innerHTML = EQUIPE.map(
  (p, i) => `<li>
    <svg viewBox="0 0 100 100" aria-hidden="true" class="avatar"><circle cx="50" cy="50" r="50" fill="${['#f2a65a', '#9cc5b9', '#c9a7d8'][i]}"/>
    <text x="50" y="62" text-anchor="middle" font-family="Italiana" font-size="40" fill="#3d2a4a">${p.nome[0]}</text></svg>
    <div><h3>${p.nome}</h3><p class="papel">${p.papel}</p><p>${p.sobre}</p></div>
  </li>`
).join('');

let tempo;
function avisar(t) {
  const el = $('#aviso');
  el.textContent = t;
  el.classList.add('visivel');
  clearTimeout(tempo);
  tempo = setTimeout(() => el.classList.remove('visivel'), 4200);
}

desenharGrade();
desenharPlanos();
