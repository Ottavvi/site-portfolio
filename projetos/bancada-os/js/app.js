import {
  STATUS,
  TIPOS,
  GARANTIA_DIAS,
  carregar,
  salvar,
  recomecar,
  totalOS,
  hojeISO,
  somarDias,
  agoraISO
} from './estado.js';
import { imprimirOS } from './imprimir.js';

const $ = (s, el = document) => el.querySelector(s);
const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s =>
  String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const dataBR = iso => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '');
const statusDe = id => STATUS.find(s => s.id === id);

let estado = carregar();
let busca = '';

function gravar() {
  if (!salvar(estado)) avisar('Não foi possível salvar neste navegador. Baixe um backup pelo menu.');
}

// ---------- resumo ----------
function desenharNumeros() {
  const hoje = hojeISO();
  const mes = hoje.slice(0, 7);
  const abertas = estado.ordens.filter(o => o.status !== 'entregue');
  const aprov = estado.ordens.filter(o => o.status === 'aprovacao');
  const prontas = estado.ordens.filter(o => o.status === 'pronto');
  const atrasadas = abertas.filter(o => o.status !== 'pronto' && o.prazo < hoje);
  const faturado = estado.ordens.filter(o => o.entregue?.startsWith(mes)).reduce((s, o) => s + totalOS(o), 0);
  const cartao = (rotulo, valor, extra = '', classe = '') =>
    `<div class="numero ${classe}"><span>${rotulo}</span><b>${valor}</b>${extra ? `<small>${extra}</small>` : ''}</div>`;
  $('#numeros').innerHTML =
    cartao(
      'Em aberto',
      abertas.length,
      `${atrasadas.length ? `${atrasadas.length} com prazo vencido` : 'nenhuma atrasada'}`,
      atrasadas.length ? 'alerta' : ''
    ) +
    cartao('Aguardando aprovação', aprov.length, brl(aprov.reduce((s, o) => s + totalOS(o), 0)) + ' em orçamentos') +
    cartao('Prontas para retirar', prontas.length, brl(prontas.reduce((s, o) => s + totalOS(o), 0)) + ' a receber') +
    cartao('Entregue no mês', brl(faturado), `${estado.ordens.filter(o => o.entregue?.startsWith(mes)).length} ordens`);
}

// ---------- quadro ----------
function confere(os) {
  if (!busca) return true;
  const alvo =
    `${os.num} ${os.cliente.nome} ${os.cliente.fone} ${os.aparelho.modelo} ${os.aparelho.tipo} ${os.defeito}`.toLowerCase();
  return busca
    .toLowerCase()
    .split(/\s+/)
    .every(p => alvo.includes(p.replace('#', '')));
}

function cartaoOS(os) {
  const hoje = hojeISO();
  const atrasada = !['pronto', 'entregue'].includes(os.status) && os.prazo < hoje;
  const total = totalOS(os);
  const prazo =
    os.status === 'entregue'
      ? `entregue ${dataBR(os.entregue)}`
      : atrasada
        ? `atrasada desde ${dataBR(os.prazo)}`
        : os.prazo === hoje
          ? 'prazo hoje'
          : `prazo ${dataBR(os.prazo)}`;
  return `<li><button class="cartao ${atrasada ? 'atrasada' : ''}" data-os="${os.num}" draggable="true">
    <span class="cartao-num">#${os.num}</span>
    <span class="cartao-cliente">${esc(os.cliente.nome)}</span>
    <span class="cartao-aparelho">${esc(os.aparelho.modelo)}</span>
    <span class="cartao-pe"><span class="prazo">${prazo}</span>${total ? `<b>${brl(total)}</b>` : '<i>sem orçamento</i>'}</span>
  </button></li>`;
}

function desenharQuadro() {
  $('#quadro').innerHTML = STATUS.map(s => {
    let lista = estado.ordens.filter(o => o.status === s.id && confere(o));
    lista.sort((a, b) => (s.id === 'entregue' ? b.entregue.localeCompare(a.entregue) : a.prazo.localeCompare(b.prazo)));
    const extra = s.id === 'entregue' && !busca && lista.length > 6 ? lista.length - 6 : 0;
    if (extra) lista = lista.slice(0, 6);
    return `<section class="coluna" data-status="${s.id}" style="--cor:${s.cor}" aria-labelledby="col-${s.id}">
      <h2 id="col-${s.id}">${s.nome} <span>${estado.ordens.filter(o => o.status === s.id && confere(o)).length}</span></h2>
      <ul>${lista.map(cartaoOS).join('') || '<li class="vazio">Nenhuma OS</li>'}</ul>
      ${extra ? `<p class="mais">e mais ${extra} entregues. Use a busca para achar.</p>` : ''}
    </section>`;
  }).join('');
}

function desenharTudo() {
  desenharNumeros();
  desenharQuadro();
}

$('#busca').addEventListener('input', e => {
  busca = e.target.value.trim();
  desenharQuadro();
});

// arrastar entre colunas
let arrastando = null;
$('#quadro').addEventListener('dragstart', e => {
  const c = e.target.closest('[data-os]');
  if (!c) return;
  arrastando = Number(c.dataset.os);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', String(arrastando));
  c.classList.add('arrastando');
});
$('#quadro').addEventListener('dragend', () => {
  arrastando = null;
  document.querySelectorAll('.sobre').forEach(c => c.classList.remove('sobre'));
});
$('#quadro').addEventListener('dragover', e => {
  const col = e.target.closest('.coluna');
  if (!col || arrastando === null) return;
  e.preventDefault();
  document.querySelectorAll('.sobre').forEach(c => c !== col && c.classList.remove('sobre'));
  col.classList.add('sobre');
});
$('#quadro').addEventListener('drop', e => {
  const col = e.target.closest('.coluna');
  if (!col || arrastando === null) return;
  e.preventDefault();
  const os = estado.ordens.find(o => o.num === arrastando);
  mudarStatus(os, col.dataset.status);
});

$('#quadro').addEventListener('click', e => {
  const c = e.target.closest('[data-os]');
  if (c) abrir(Number(c.dataset.os));
});

function mudarStatus(os, novo) {
  if (!os || os.status === novo) return;
  if (novo === 'entregue') {
    abrir(os.num);
    avisar('Para entregar, confira o pagamento e clique em "Registrar entrega".');
    return;
  }
  if (os.status === 'entregue') {
    delete os.entregue;
    delete os.pagamento;
  }
  os.status = novo;
  os.historico.push({
    quando: agoraISO(),
    texto: `Status: ${statusDe(novo).nome}`
  });
  gravar();
  desenharTudo();
  if (gaveta.open) desenharDetalhe(os);
  avisar(`#${os.num} agora está em "${statusDe(novo).nome}".`);
}

// ---------- detalhe ----------
const gaveta = $('#detalhe');
let atual = null;

function mensagemCliente(os) {
  const primeiro = os.cliente.nome.split(' ')[0];
  const t = brl(totalOS(os));
  const m = {
    recebido: `Olá, ${primeiro}! Recebemos seu ${os.aparelho.modelo} (OS #${os.num}). Vamos analisar e te mandamos o orçamento.`,
    analise: `Olá, ${primeiro}! Seu ${os.aparelho.modelo} (OS #${os.num}) está em análise na bancada.`,
    aprovacao: `Olá, ${primeiro}! O orçamento do seu ${os.aparelho.modelo} (OS #${os.num}) ficou em ${t}:\n${os.itens.map(i => `• ${i.desc}: ${brl(i.qtd * i.valor)}`).join('\n')}${os.desconto ? `\n• Desconto: −${brl(os.desconto)}` : ''}\nPodemos seguir com o conserto?`,
    conserto: `Olá, ${primeiro}! Orçamento aprovado, seu ${os.aparelho.modelo} (OS #${os.num}) já está em conserto.`,
    pronto: `Olá, ${primeiro}! Seu ${os.aparelho.modelo} está pronto (OS #${os.num}). Total: ${t}. Pode retirar das 9h às 18h.`,
    entregue: `Olá, ${primeiro}! Obrigado pela confiança. A garantia do serviço da OS #${os.num} vai até ${dataBR(os.garantiaAte || '')}.`
  };
  return m[os.status];
}

function desenharDetalhe(os) {
  const total = totalOS(os);
  const fone = os.cliente.fone.replace(/\D/g, '');
  const entregue = os.status === 'entregue';
  $('#det-corpo').innerHTML = `
    <div class="det-topo">
      <h2 id="det-titulo">OS #${os.num}</h2>
      <button class="fechar" data-fechar aria-label="Fechar">×</button>
    </div>
    <label class="det-status" style="--cor:${statusDe(os.status).cor}">Status
      <select id="det-status">${STATUS.map(s => `<option value="${s.id}" ${s.id === os.status ? 'selected' : ''}>${s.nome}</option>`).join('')}</select>
    </label>

    <div class="det-bloco det-duas">
      <div><h3>Cliente</h3><p><b>${esc(os.cliente.nome)}</b><br>${esc(os.cliente.fone)}</p>
        <a class="botao-linha" target="_blank" rel="noopener" href="https://wa.me/55${fone}?text=${encodeURIComponent(mensagemCliente(os))}">Avisar no WhatsApp</a></div>
      <div><h3>Aparelho</h3><p><b>${esc(os.aparelho.modelo)}</b><br>${esc(os.aparelho.tipo)}${os.aparelho.serie ? ` · ${esc(os.aparelho.serie)}` : ''}</p>
        ${os.acessorios ? `<p class="miudo">Acessórios: ${esc(os.acessorios)}</p>` : ''}</div>
    </div>
    <div class="det-bloco">
      <h3>Defeito relatado</h3><p>${esc(os.defeito)}</p>
      <p class="miudo">Aberta em ${dataBR(os.criada)} · prazo ${dataBR(os.prazo)}</p>
    </div>

    <div class="det-bloco">
      <h3>Orçamento</h3>
      <table class="itens">
        <thead><tr><th>Descrição</th><th>Qtd</th><th>Valor</th><th>Total</th><th><span class="sr">Remover</span></th></tr></thead>
        <tbody>${os.itens
          .map(
            (i, k) => `<tr data-item="${k}">
          <td><input data-campo="desc" value="${esc(i.desc)}" aria-label="Descrição" ${entregue ? 'disabled' : ''}/></td>
          <td><input data-campo="qtd" inputmode="numeric" value="${i.qtd}" aria-label="Quantidade" ${entregue ? 'disabled' : ''}/></td>
          <td><input data-campo="valor" inputmode="decimal" value="${Number.isInteger(i.valor) ? i.valor : i.valor.toFixed(2).replace('.', ',')}" aria-label="Valor unitário" ${entregue ? 'disabled' : ''}/></td>
          <td class="item-total">${brl(i.qtd * i.valor)}</td>
          <td>${entregue ? '' : `<button class="remover" data-remover="${k}" aria-label="Remover ${esc(i.desc)}">×</button>`}</td>
        </tr>`
          )
          .join('')}</tbody>
      </table>
      ${
        entregue
          ? ''
          : `<div class="add-item">
        <button class="botao-linha" data-add="peca">+ Peça</button>
        <button class="botao-linha" data-add="servico">+ Serviço</button>
      </div>`
      }
      <dl class="totais">
        <div><dt>Desconto</dt><dd><input id="det-desconto" inputmode="decimal" value="${String(os.desconto || 0).replace('.', ',')}" aria-label="Desconto em reais" ${entregue ? 'disabled' : ''}/></dd></div>
        <div class="total"><dt>Total</dt><dd id="det-total">${brl(total)}</dd></div>
      </dl>
    </div>

    <div class="det-bloco">
      <label class="obs"><h3>Anotações da bancada</h3><textarea id="det-obs" rows="2" placeholder="Testes feitos, peça encomendada, senha conferida com o cliente...">${esc(os.obs)}</textarea></label>
    </div>

    ${
      os.status === 'pronto'
        ? `<div class="det-bloco entrega">
      <h3>Entrega</h3>
      <label>Pagamento <select id="det-pagamento">${['Pix', 'Dinheiro', 'Cartão de débito', 'Cartão de crédito'].map(p => `<option>${p}</option>`).join('')}</select></label>
      <button class="botao" id="det-entregar">Registrar entrega de ${brl(total)}</button>
      <p class="miudo">A garantia de ${GARANTIA_DIAS} dias começa hoje.</p>
    </div>`
        : ''
    }
    ${entregue ? `<div class="det-bloco"><p>Entregue em <b>${dataBR(os.entregue)}</b>, pago com ${esc(os.pagamento)}. Garantia até <b>${dataBR(os.garantiaAte)}</b>.</p></div>` : ''}

    <div class="det-bloco">
      <h3>Histórico</h3>
      <ol class="historico">${[...os.historico]
        .reverse()
        .map(h => `<li><time>${dataBR(h.quando)} ${h.quando.slice(11, 16)}</time>${esc(h.texto)}</li>`)
        .join('')}</ol>
    </div>

    <div class="det-acoes">
      <button class="botao-linha" id="det-imprimir">Imprimir OS</button>
      <button class="botao-texto perigo" id="det-excluir">Excluir OS</button>
    </div>`;
}

function abrir(num) {
  atual = estado.ordens.find(o => o.num === num);
  if (!atual) return;
  desenharDetalhe(atual);
  if (!gaveta.open) gaveta.showModal();
}

gaveta.addEventListener('click', e => {
  if (e.target === gaveta || e.target.closest('[data-fechar]')) return gaveta.close();
  const os = atual;
  const add = e.target.closest('[data-add]');
  if (add) {
    os.itens.push({
      desc: add.dataset.add === 'peca' ? 'Peça' : 'Serviço',
      qtd: 1,
      valor: 0,
      tipo: add.dataset.add
    });
    gravar();
    desenharDetalhe(os);
    const linhas = gaveta.querySelectorAll('[data-campo=desc]');
    linhas[linhas.length - 1].select();
    return;
  }
  const rem = e.target.closest('[data-remover]');
  if (rem) {
    os.itens.splice(Number(rem.dataset.remover), 1);
    gravar();
    desenharDetalhe(os);
    desenharTudo();
    return;
  }
  if (e.target.closest('#det-imprimir')) return imprimirOS(os, estado.loja);
  if (e.target.closest('#det-entregar')) {
    os.status = 'entregue';
    os.entregue = hojeISO();
    os.garantiaAte = somarDias(os.entregue, GARANTIA_DIAS);
    os.pagamento = $('#det-pagamento').value;
    os.historico.push({
      quando: agoraISO(),
      texto: `Entregue ao cliente · ${os.pagamento} · ${brl(totalOS(os))}`
    });
    gravar();
    desenharDetalhe(os);
    desenharTudo();
    avisar(`#${os.num} entregue. Garantia até ${dataBR(os.garantiaAte)}.`);
    return;
  }
  const exc = e.target.closest('#det-excluir');
  if (exc) {
    if (exc.dataset.confirmar !== 'sim') {
      exc.dataset.confirmar = 'sim';
      exc.textContent = 'Clique de novo para excluir';
      return;
    }
    estado.ordens = estado.ordens.filter(o => o !== os);
    gravar();
    gaveta.close();
    desenharTudo();
    avisar(`OS #${os.num} excluída.`);
  }
});

const numero = s => Number(String(s).replace(/\./g, '').replace(',', '.')) || 0;

gaveta.addEventListener('input', e => {
  const os = atual;
  const campo = e.target.dataset.campo;
  if (campo) {
    const k = Number(e.target.closest('[data-item]').dataset.item);
    const item = os.itens[k];
    if (campo === 'desc') item.desc = e.target.value;
    if (campo === 'qtd') item.qtd = Math.max(0, Math.round(numero(e.target.value)));
    if (campo === 'valor') item.valor = numero(e.target.value);
    e.target.closest('tr').querySelector('.item-total').textContent = brl(item.qtd * item.valor);
  }
  if (e.target.id === 'det-desconto') os.desconto = numero(e.target.value);
  if (e.target.id === 'det-obs') os.obs = e.target.value;
  const t = $('#det-total');
  if (t) t.textContent = brl(totalOS(os));
  gravar();
});
gaveta.addEventListener('change', e => {
  if (e.target.id === 'det-status') return mudarStatus(atual, e.target.value);
  if (e.target.dataset.campo || e.target.id === 'det-desconto') desenharTudo();
});
gaveta.addEventListener('close', desenharTudo);

// ---------- nova OS ----------
const modal = $('#nova-os');
const formNova = $('#form-nova');
$('#nova-tipo').innerHTML = TIPOS.map(t => `<option>${t}</option>`).join('');
$('#nova').addEventListener('click', () => {
  formNova.reset();
  formNova.prazo.value = somarDias(hojeISO(), 3);
  $('#erro-nova').textContent = '';
  modal.showModal();
  formNova.nome.focus();
});
modal.addEventListener('click', e => {
  if (e.target === modal || e.target.closest('[data-fechar]')) modal.close();
});
formNova.fone.addEventListener('input', () => {
  const n = formNova.fone.value.replace(/\D/g, '').slice(0, 11);
  formNova.fone.value =
    n.length > 6
      ? `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
      : n.length > 2
        ? `(${n.slice(0, 2)}) ${n.slice(2)}`
        : n;
});
formNova.addEventListener('submit', e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(formNova));
  const faltando = !f.nome.trim()
    ? 'nome'
    : f.fone.replace(/\D/g, '').length < 10
      ? 'fone'
      : !f.modelo.trim()
        ? 'modelo'
        : !f.defeito.trim()
          ? 'defeito'
          : !f.prazo
            ? 'prazo'
            : null;
  if (faltando) {
    $('#erro-nova').textContent = {
      nome: 'Falta o nome do cliente.',
      fone: 'Confira o WhatsApp com DDD.',
      modelo: 'Falta a marca e o modelo do aparelho.',
      defeito: 'Descreva o defeito que o cliente relatou.',
      prazo: 'Escolha o prazo.'
    }[faltando];
    formNova[faltando].focus();
    return;
  }
  estado.seq += 1;
  const os = {
    num: estado.seq,
    criada: agoraISO(),
    cliente: { nome: f.nome.trim(), fone: f.fone },
    aparelho: { tipo: f.tipo, modelo: f.modelo.trim(), serie: f.serie.trim() },
    defeito: f.defeito.trim(),
    acessorios: f.acessorios.trim(),
    prazo: f.prazo,
    status: 'recebido',
    itens: [],
    desconto: 0,
    historico: [{ quando: agoraISO(), texto: 'OS aberta no balcão' }],
    obs: ''
  };
  estado.ordens.push(os);
  gravar();
  modal.close();
  desenharTudo();
  avisar(`OS #${os.num} aberta.`);
  abrir(os.num);
});

// ---------- menu ----------
function baixar(nome, conteudo, tipo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: nome
  });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelector('.menu-itens').addEventListener('click', e => {
  const acao = e.target.closest('[data-acao]')?.dataset.acao;
  if (!acao) return;
  document.querySelector('.menu').open = false;
  if (acao === 'csv') {
    const cab = [
      'OS',
      'Aberta',
      'Cliente',
      'Telefone',
      'Tipo',
      'Aparelho',
      'Defeito',
      'Status',
      'Prazo',
      'Entregue',
      'Pagamento',
      'Peças',
      'Serviços',
      'Desconto',
      'Total'
    ];
    const linhas = estado.ordens.map(o => {
      const soma = t => o.itens.filter(i => i.tipo === t).reduce((s, i) => s + i.qtd * i.valor, 0);
      return [
        o.num,
        dataBR(o.criada),
        o.cliente.nome,
        o.cliente.fone,
        o.aparelho.tipo,
        o.aparelho.modelo,
        o.defeito,
        statusDe(o.status).nome,
        dataBR(o.prazo),
        dataBR(o.entregue),
        o.pagamento || '',
        soma('peca'),
        soma('servico'),
        o.desconto || 0,
        totalOS(o)
      ];
    });
    const csv = [cab, ...linhas]
      .map(l =>
        l
          .map(v => (typeof v === 'number' ? String(v).replace('.', ',') : `"${String(v).replace(/"/g, '""')}"`))
          .join(';')
      )
      .join('\r\n');
    baixar(`ordens-de-servico-${hojeISO()}.csv`, '﻿' + csv, 'text/csv;charset=utf-8');
  }
  if (acao === 'backup')
    baixar(`bancada-backup-${hojeISO()}.json`, JSON.stringify(estado, null, 2), 'application/json');
  if (acao === 'exemplo') {
    const b = e.target.closest('[data-acao]');
    if (b.dataset.confirmar !== 'sim') {
      b.dataset.confirmar = 'sim';
      b.textContent = 'Clique de novo: isso apaga as OS atuais';
      document.querySelector('.menu').open = true;
      return;
    }
    estado = recomecar();
    gravar();
    desenharTudo();
    avisar('Dados de exemplo restaurados.');
  }
});
$('#restaurar').addEventListener('change', async e => {
  const arq = e.target.files[0];
  if (!arq) return;
  try {
    const novo = JSON.parse(await arq.text());
    if (!Array.isArray(novo.ordens)) throw new Error('formato');
    estado = novo;
    gravar();
    desenharTudo();
    avisar(`Backup restaurado: ${novo.ordens.length} ordens.`);
  } catch {
    avisar('Esse arquivo não é um backup do Bancada.');
  }
  e.target.value = '';
  document.querySelector('.menu').open = false;
});

let tempo;
function avisar(t) {
  const el = $('#aviso');
  el.textContent = t;
  el.classList.add('visivel');
  clearTimeout(tempo);
  tempo = setTimeout(() => el.classList.remove('visivel'), 4000);
}

desenharTudo();
