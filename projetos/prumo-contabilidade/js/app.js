import { ATIVIDADES, comparar, moeda, pct } from './comparador.js';
import { MEI } from './impostos.js';

const $ = s => document.querySelector(s);
const num = s => Number(String(s).replace(/\D/g, '')) || 0;

// ---------- comparador ----------
const form = $('#comparador');
$('#c-atividade').innerHTML = Object.entries(ATIVIDADES)
  .map(([id, a]) => `<option value="${id}" ${id === 'intelectual' ? 'selected' : ''}>${a.nome}</option>`)
  .join('');

function calcular() {
  const fat = num(form.faturamento.value);
  const folha = num(form.folha.value);
  const res = comparar(form.atividade.value, fat, folha);
  $('#resultado').innerHTML = res
    .map(r => {
      if (!r.disponivel)
        return `<article class="regime indisponivel"><h2>${r.nome}</h2><p class="motivo">${r.motivo}</p></article>`;
      return `<article class="regime ${r.melhor ? 'melhor' : ''}">
        <h2>${r.nome}</h2>
        ${r.melhor ? '<p class="selo">menor imposto</p>' : ''}
        <p class="valor"><mark>${moeda(r.mensal)}</mark><small>/mês</small></p>
        <p class="ano">${moeda(r.mensal * 12)} por ano · ${pct(r.percentual)} do faturamento</p>
        <table class="linhas">${r.linhas.map(([n, v]) => `<tr><th scope="row">${n}</th><td>${moeda(v)}</td></tr>`).join('')}</table>
        ${r.nota ? `<p class="nota">${r.nota}</p>` : ''}
        ${r.fatorR !== undefined ? `<p class="nota">Fator R: ${pct(r.fatorR)} (folha ÷ faturamento)</p>` : ''}
      </article>`;
    })
    .join('');

  const simples = res.find(r => r.id === 'simples');
  const dica = $('#dica');
  if (simples?.dica && simples.dica.economia > 0) {
    dica.innerHTML = `Com mais <b>${moeda(simples.dica.aumento)}</b> de pró-labore por mês, a folha chega a 28% e o DAS vai para o Anexo III: <mark>${moeda(simples.dica.economia)} a menos por mês</mark>, já descontado o INSS do sócio.`;
  } else if (
    fat &&
    fat * 12 <= MEI.limite(2026) * 1.25 &&
    fat * 12 > MEI.limite(2026) * 0.8 &&
    ATIVIDADES[form.atividade.value].mei
  ) {
    dica.innerHTML = `Você está perto do limite do MEI (${moeda(MEI.limite(2026))} em 2026). A partir de 2027 o limite sobe para ${moeda(MEI.limite(2027))}.`;
  } else {
    dica.textContent = '';
  }
}
form.addEventListener('input', calcular);
for (const campo of [form.faturamento, form.folha]) {
  campo.addEventListener('blur', () => {
    campo.value = num(campo.value).toLocaleString('pt-BR');
    calcular();
  });
}
calcular();

// ---------- agenda fiscal ----------
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const util = d => d.getDay() !== 0 && d.getDay() !== 6;
function proximoUtil(d) {
  while (!util(d)) d.setDate(d.getDate() + 1);
  return d;
}
function anteriorUtil(d) {
  while (!util(d)) d.setDate(d.getDate() - 1);
  return d;
}
function agenda(regime) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const lista = [];
  for (let i = 0; i < 4; i++) {
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth() + i;
    const comp = new Date(ano, mes - 1, 1);
    const competencia = `${MESES[comp.getMonth()]}/${comp.getFullYear()}`;
    if (regime === 'mei') {
      lista.push({ data: proximoUtil(new Date(ano, mes, 20)), nome: 'DAS-MEI', det: `Competência ${competencia}` });
    } else {
      lista.push({
        data: proximoUtil(new Date(ano, mes, 20)),
        nome: 'DAS do Simples',
        det: `Competência ${competencia}`
      });
      lista.push({ data: anteriorUtil(new Date(ano, mes, 20)), nome: 'FGTS Digital', det: `Folha de ${competencia}` });
      lista.push({
        data: anteriorUtil(new Date(ano, mes + 1, 0)),
        nome: 'DCTFWeb',
        det: `INSS da folha e do pró-labore de ${competencia}`
      });
    }
  }
  const a = hoje.getFullYear();
  for (const y of [a, a + 1]) {
    if (regime === 'mei')
      lista.push({ data: new Date(y, 4, 31), nome: 'DASN-SIMEI', det: `Declaração anual de ${y - 1}` });
    else lista.push({ data: new Date(y, 2, 31), nome: 'DEFIS', det: `Declaração anual de ${y - 1}` });
  }
  return lista
    .filter(o => o.data >= hoje)
    .sort((x, y) => x.data - y.data)
    .slice(0, 6)
    .map(o => ({ ...o, dias: Math.round((o.data - hoje) / 86400000) }));
}
function desenharAgenda() {
  const regime = document.querySelector('[name=regime]:checked').value;
  $('#lista-agenda').innerHTML = agenda(regime)
    .map(
      o => `<li class="${o.dias <= 7 ? 'perto' : ''}">
      <time datetime="${o.data.toISOString().slice(0, 10)}"><b>${o.data.getDate()}</b>${MESES[o.data.getMonth()]}</time>
      <div><h3>${o.nome}</h3><p>${o.det}</p></div>
      <span class="faltam">${o.dias === 0 ? 'hoje' : o.dias === 1 ? 'amanhã' : `em ${o.dias} dias`}</span>
    </li>`
    )
    .join('');
}
document.querySelectorAll('[name=regime]').forEach(r => r.addEventListener('change', desenharAgenda));
desenharAgenda();

// ---------- contato ----------
$('#form-contato').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (f.nome.value.trim().length < 2) {
    $('#erro-contato').textContent = 'Diga seu nome para a gente saber com quem fala.';
    f.nome.focus();
    return;
  }
  $('#erro-contato').textContent = '';
  const msg = `Olá, sou ${f.nome.value.trim()}. ${f.situacao.value}.${f.msg.value.trim() ? ' ' + f.msg.value.trim() : ''}`;
  window.open(`https://wa.me/5511900001000?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});
