import { desenhar } from './camadas.js';
import { BURGERS, ACOMPANHAMENTOS, BEBIDAS, MONTE, BAIRROS, HORARIO, WHATSAPP } from './cardapio.js';

const $ = (s, el = document) => el.querySelector(s);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const brlCurto = v => (Number.isInteger(v) ? `R$ ${v}` : brl(v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const CHAVE = 'brasa47:sacola';
function ler() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || {};
  } catch {
    return {};
  }
}
const salvo = ler();
let sacola = salvo.itens || [];
const entrega = Object.assign(
  { modo: 'entrega', bairro: '', nome: '', endereco: '', pagamento: 'pix', troco: '', obs: '' },
  salvo.entrega
);
function guardar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ itens: sacola, entrega }));
  } catch {
    /* sem armazenamento: a sacola vale só nesta visita */
  }
}

// ---------- aberto ou fechado ----------
const NOMES = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
function situacao(agora = new Date()) {
  const min = agora.getHours() * 60 + agora.getMinutes();
  const dia = agora.getDay();
  if (HORARIO.dias.includes(dia) && min >= HORARIO.abre && min < HORARIO.fecha)
    return { aberto: true, texto: 'Aberto agora · até 23h30' };
  // madrugada depois do fechamento ou antes de abrir
  for (let i = 0; i < 8; i++) {
    const d = (dia + i) % 7;
    if (!HORARIO.dias.includes(d)) continue;
    if (i === 0 && min >= HORARIO.abre) continue;
    const quando = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : NOMES[d];
    return { aberto: false, texto: `Fechado · abre ${quando} às 18h` };
  }
  return { aberto: false, texto: 'Fechado' };
}
function desenharStatus() {
  const s = situacao();
  const el = $('#status');
  el.textContent = s.texto;
  el.classList.toggle('aberto', s.aberto);
}
desenharStatus();
setInterval(desenharStatus, 60000);

// ---------- monte o seu ----------
const padrao = () => ({ pao: 'brioche', carnes: 1, queijo: 'cheddar', extras: [], molho: 'molho-casa' });
let monte = padrao();

function camadasDoMonte(m) {
  const c = [];
  if (m.molho !== 'sem') c.push(m.molho);
  if (m.extras.includes('salada')) c.push('alface', 'tomate');
  if (m.extras.includes('picles')) c.push('picles');
  for (let i = 0; i < m.carnes; i++) {
    c.push('carne');
    if (m.queijo !== 'nenhum') c.push(m.queijo);
  }
  for (const e of ['bacon', 'caramelizada', 'cebola', 'ovo', 'crispy']) if (m.extras.includes(e)) c.push(e);
  return c;
}
function precoMonte(m) {
  return (
    MONTE.base +
    MONTE.paes.find(p => p.id === m.pao).preco +
    MONTE.carnes.find(c => c.qtd === m.carnes).preco +
    m.extras.reduce((s, id) => s + MONTE.extras.find(e => e.id === id).preco, 0)
  );
}
function descreverMonte(m) {
  const partes = [
    MONTE.paes.find(p => p.id === m.pao).nome,
    MONTE.carnes.find(c => c.qtd === m.carnes).nome,
    m.queijo === 'nenhum' ? 'sem queijo' : MONTE.queijos.find(q => q.id === m.queijo).nome.toLowerCase(),
    ...m.extras.map(id => MONTE.extras.find(e => e.id === id).nome.toLowerCase()),
    m.molho === 'sem' ? 'sem molho' : `molho ${MONTE.molhos.find(x => x.id === m.molho).nome.toLowerCase()}`
  ];
  return partes.join(', ');
}

function pilula(tipo, nome, valor, rotulo, preco, marcado) {
  const extra = preco ? `<small>+${brlCurto(preco)}</small>` : '';
  return `<label class="pilula"><input type="${tipo}" name="${nome}" value="${valor}" ${marcado ? 'checked' : ''}/><span>${rotulo}${extra}</span></label>`;
}
function desenharOpcoes() {
  $('#op-pao').innerHTML = MONTE.paes
    .map(p => pilula('radio', 'pao', p.id, p.nome, p.preco, monte.pao === p.id))
    .join('');
  $('#op-carne').innerHTML = MONTE.carnes
    .map(c => pilula('radio', 'carnes', c.qtd, c.nome, c.preco, monte.carnes === c.qtd))
    .join('');
  $('#op-queijo').innerHTML = MONTE.queijos
    .map(q => pilula('radio', 'queijo', q.id, q.nome, 0, monte.queijo === q.id))
    .join('');
  $('#op-extras').innerHTML = MONTE.extras
    .map(e => pilula('checkbox', 'extras', e.id, e.nome, e.preco, monte.extras.includes(e.id)))
    .join('');
  $('#op-molho').innerHTML = MONTE.molhos
    .map(x => pilula('radio', 'molho', x.id, x.nome, 0, monte.molho === x.id))
    .join('');
}
function desenharMonte() {
  $('#burger-grande').innerHTML = desenhar(
    camadasDoMonte(monte),
    { pao: monte.pao },
    `Seu burger: ${descreverMonte(monte)}`
  );
  $('#monte-preco').textContent = brlCurto(precoMonte(monte));
}

const formMonte = $('#form-monte');
formMonte.addEventListener('change', e => {
  const { name, value } = e.target;
  if (name === 'extras') monte.extras = [...formMonte.querySelectorAll('[name=extras]:checked')].map(i => i.value);
  else if (name === 'carnes') monte.carnes = Number(value);
  else monte[name] = value;
  desenharMonte();
});
formMonte.addEventListener('submit', e => {
  e.preventDefault();
  adicionar({
    chave: 'monte:' + JSON.stringify(monte),
    nome: 'Monte o seu',
    detalhe: descreverMonte(monte),
    preco: precoMonte(monte),
    camadas: camadasDoMonte(monte),
    pao: monte.pao
  });
});
$('#monte-limpar').addEventListener('click', () => {
  monte = padrao();
  desenharOpcoes();
  desenharMonte();
});

// ---------- cardápio ----------
function controle(chave) {
  const item = sacola.find(i => i.chave === chave);
  if (!item) return `<button class="botao-add" data-add="${chave}">Adicionar</button>`;
  return `<div class="passo" role="group" aria-label="Quantidade">
    <button data-menos="${chave}" aria-label="Tirar um">−</button><output>${item.qtd}</output><button data-mais="${chave}" aria-label="Mais um">+</button>
  </div>`;
}
function desenharCardapio() {
  $('#lista-burgers').innerHTML = BURGERS.map(
    b => `
    <article class="card-burger">
      <div class="mini">${desenhar(b.camadas, { pao: b.pao })}</div>
      <h4>${b.nome}</h4>
      <p>${b.desc}</p>
      <div class="card-pe"><span class="preco">${brlCurto(b.preco)}</span>${controle('b:' + b.id)}</div>
    </article>`
  ).join('');
  const lista = (itens, prefixo) =>
    itens
      .map(
        i =>
          `<li><div><h4>${i.nome}</h4><p>${i.desc}</p></div><span class="preco">${brlCurto(i.preco)}</span>${controle(prefixo + i.id)}</li>`
      )
      .join('');
  $('#lista-acomp').innerHTML = lista(ACOMPANHAMENTOS, 'a:');
  $('#lista-bebidas').innerHTML = lista(BEBIDAS, 'd:');
}

function itemDoCardapio(chave) {
  const [tipo, id] = chave.split(':');
  const fonte = { b: BURGERS, a: ACOMPANHAMENTOS, d: BEBIDAS }[tipo];
  const x = fonte.find(i => i.id === id);
  return { chave, nome: x.nome, preco: x.preco, camadas: x.camadas, pao: x.pao };
}

function adicionar(novo) {
  const existe = sacola.find(i => i.chave === novo.chave);
  if (existe) existe.qtd++;
  else sacola.push({ ...novo, qtd: 1 });
  atualizar();
  avisar(`${novo.nome} na sacola.`, true);
}
function mudar(chave, delta) {
  const item = sacola.find(i => i.chave === chave);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) sacola = sacola.filter(i => i !== item);
  atualizar();
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) return adicionar(itemDoCardapio(add.dataset.add));
  const mais = e.target.closest('[data-mais]');
  if (mais) return mudar(mais.dataset.mais, 1);
  const menos = e.target.closest('[data-menos]');
  if (menos) return mudar(menos.dataset.menos, -1);
});

// ---------- sacola ----------
const dialogo = $('#sacola');
$('#abrir-sacola').addEventListener('click', () => {
  desenharSacola();
  dialogo.showModal();
});
dialogo.addEventListener('click', e => {
  if (e.target === dialogo) dialogo.close();
});

const taxa = () => (entrega.modo === 'entrega' ? BAIRROS.find(b => b.nome === entrega.bairro)?.taxa || 0 : 0);
const subtotal = () => sacola.reduce((s, i) => s + i.preco * i.qtd, 0);

function desenharSacola() {
  const corpo = $('#sacola-corpo');
  if (!sacola.length) {
    corpo.innerHTML = `<div class="vazia"><p>A sacola está vazia.</p><a href="#cardapio" class="botao" data-fechar>Ver o cardápio</a></div>`;
    return;
  }
  const sit = situacao();
  corpo.innerHTML = `
    <ul class="itens-sacola">${sacola
      .map(
        i => `<li>
        ${i.camadas ? `<div class="mini-sacola">${desenhar(i.camadas, { pao: i.pao })}</div>` : '<div class="mini-sacola"></div>'}
        <div class="item-info"><b>${esc(i.nome)}</b>${i.detalhe ? `<small>${esc(i.detalhe)}</small>` : ''}<span>${brl(i.preco * i.qtd)}</span></div>
        <div class="passo"><button data-menos="${i.chave}" aria-label="Tirar um ${esc(i.nome)}">−</button><output>${i.qtd}</output><button data-mais="${i.chave}" aria-label="Mais um ${esc(i.nome)}">+</button></div>
      </li>`
      )
      .join('')}</ul>
    <form id="form-pedido" class="form-pedido" novalidate>
      <div class="alternar" role="radiogroup" aria-label="Como receber">
        <label><input type="radio" name="modo" value="entrega" ${entrega.modo === 'entrega' ? 'checked' : ''}/><span>Entrega</span></label>
        <label><input type="radio" name="modo" value="retirada" ${entrega.modo === 'retirada' ? 'checked' : ''}/><span>Retirar no balcão</span></label>
      </div>
      <label>Seu nome <input name="nome" autocomplete="name" value="${esc(entrega.nome)}" required/></label>
      ${
        entrega.modo === 'entrega'
          ? `<label>Bairro
          <select name="bairro" required><option value="">Escolha o bairro</option>${BAIRROS.map(
            b =>
              `<option ${b.nome === entrega.bairro ? 'selected' : ''} value="${b.nome}">${b.nome} · taxa ${brlCurto(b.taxa)}</option>`
          ).join('')}</select></label>
        <label>Endereço com número <input name="endereco" autocomplete="street-address" value="${esc(entrega.endereco)}" required/></label>`
          : '<p class="nota">Retire na Rua Aspicuelta, 47. Fica pronto em uns 15 minutos.</p>'
      }
      <fieldset class="pagamento"><legend>Pagamento</legend>
        ${[
          ['pix', 'Pix'],
          ['cartao', 'Cartão na entrega'],
          ['dinheiro', 'Dinheiro']
        ]
          .map(
            ([v, r]) =>
              `<label class="pilula"><input type="radio" name="pagamento" value="${v}" ${entrega.pagamento === v ? 'checked' : ''}/><span>${r}</span></label>`
          )
          .join('')}
      </fieldset>
      ${entrega.pagamento === 'dinheiro' ? `<label>Troco para <input name="troco" inputmode="decimal" placeholder="R$ 100" value="${esc(entrega.troco)}"/></label>` : ''}
      <label>Observação <input name="obs" placeholder="Sem cebola, ponto da carne, interfone..." value="${esc(entrega.obs)}"/></label>
      <dl class="totais">
        <div><dt>Subtotal</dt><dd>${brl(subtotal())}</dd></div>
        ${entrega.modo === 'entrega' ? `<div><dt>Entrega</dt><dd>${entrega.bairro ? brl(taxa()) : 'escolha o bairro'}</dd></div>` : ''}
        <div class="total"><dt>Total</dt><dd>${brl(subtotal() + taxa())}</dd></div>
      </dl>
      ${sit.aberto ? '' : `<p class="nota">${sit.texto}. Você pode mandar o pedido agora e ele sai assim que a chapa esquentar.</p>`}
      <p id="erro-pedido" class="erro" role="alert"></p>
      <button class="botao botao-largo" type="submit">Enviar pedido no WhatsApp</button>
    </form>`;
}

$('#sacola-corpo').addEventListener('input', e => {
  const { name, value } = e.target;
  if (name && name in entrega) {
    entrega[name] = value;
    guardar();
  }
});
$('#sacola-corpo').addEventListener('change', e => {
  const { name } = e.target;
  if (['modo', 'pagamento', 'bairro'].includes(name)) {
    entrega[name] = e.target.value;
    guardar();
    const foco = name;
    desenharSacola();
    $(`#sacola-corpo [name=${foco}]${foco === 'bairro' ? '' : ':checked'}`)?.focus();
  }
});
$('#sacola-corpo').addEventListener('click', e => {
  if (e.target.closest('[data-fechar]')) dialogo.close();
});
$('#sacola-corpo').addEventListener('submit', e => {
  e.preventDefault();
  const erro = $('#erro-pedido');
  const falta = !entrega.nome.trim()
    ? 'nome'
    : entrega.modo === 'entrega' && !entrega.bairro
      ? 'bairro'
      : entrega.modo === 'entrega' && entrega.endereco.trim().length < 6
        ? 'endereco'
        : null;
  if (falta) {
    erro.textContent = {
      nome: 'Diga seu nome.',
      bairro: 'Escolha o bairro para calcular a entrega.',
      endereco: 'Escreva o endereço com número.'
    }[falta];
    $(`#sacola-corpo [name=${falta}]`).focus();
    return;
  }
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem())}`, '_blank', 'noopener');
  avisar('Abrimos o WhatsApp com o pedido. É só enviar.');
});

function mensagem() {
  const linhas = ['*Pedido Brasa 47*', ''];
  for (const i of sacola) {
    linhas.push(`${i.qtd}x ${i.nome} — ${brl(i.preco * i.qtd)}`);
    if (i.detalhe) linhas.push(`   (${i.detalhe})`);
  }
  linhas.push('', `Subtotal: ${brl(subtotal())}`);
  if (entrega.modo === 'entrega') linhas.push(`Entrega (${entrega.bairro}): ${brl(taxa())}`);
  linhas.push(`*Total: ${brl(subtotal() + taxa())}*`, '');
  linhas.push(`Nome: ${entrega.nome.trim()}`);
  linhas.push(
    entrega.modo === 'entrega' ? `Endereço: ${entrega.endereco.trim()} — ${entrega.bairro}` : 'Vou retirar no balcão'
  );
  const pag = { pix: 'Pix', cartao: 'Cartão na entrega', dinheiro: 'Dinheiro' }[entrega.pagamento];
  linhas.push(
    `Pagamento: ${pag}${entrega.pagamento === 'dinheiro' && entrega.troco ? ` (troco para ${entrega.troco})` : ''}`
  );
  if (entrega.obs.trim()) linhas.push(`Obs: ${entrega.obs.trim()}`);
  return linhas.join('\n');
}

// ---------- geral ----------
function atualizar() {
  guardar();
  const qtd = sacola.reduce((s, i) => s + i.qtd, 0);
  $('#sacola-qtd').textContent = qtd;
  $('#sacola-total').textContent = qtd ? brl(subtotal()) : '';
  $('#abrir-sacola').classList.toggle('cheia', qtd > 0);
  const foco = document.activeElement?.dataset;
  const chaveFoco = foco && (foco.mais || foco.menos || foco.add);
  const tipoFoco = foco && (foco.mais ? 'mais' : foco.menos ? 'menos' : foco.add ? 'add' : null);
  desenharCardapio();
  if (dialogo.open) desenharSacola();
  if (chaveFoco) {
    const sel = t => `[data-${t}="${CSS.escape(chaveFoco)}"]`;
    const raiz = dialogo.open ? dialogo : document;
    (raiz.querySelector(sel(tipoFoco)) || raiz.querySelector(sel('mais')) || raiz.querySelector(sel('add')))?.focus();
  }
}

let tempo;
function avisar(texto, comBotao = false) {
  const el = $('#aviso');
  el.innerHTML = esc(texto) + (comBotao && !dialogo.open ? ' <button data-ver-sacola>Ver sacola</button>' : '');
  el.classList.add('visivel');
  clearTimeout(tempo);
  tempo = setTimeout(() => el.classList.remove('visivel'), 3500);
}
$('#aviso').addEventListener('click', e => {
  if (e.target.closest('[data-ver-sacola]')) $('#abrir-sacola').click();
});

desenharOpcoes();
desenharMonte();
atualizar();
