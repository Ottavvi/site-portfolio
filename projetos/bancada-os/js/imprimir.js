// Monta a OS para impressão em A4: via da loja e via do cliente na mesma folha.
import { STATUS, totalOS, GARANTIA_DIAS } from './estado.js';

const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = s =>
  String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const dataBR = iso => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '');

function via(os, loja, titulo) {
  const status = STATUS.find(s => s.id === os.status).nome;
  return `<section class="via">
    <header>
      <div><b>${esc(loja.nome)}</b><br>${esc(loja.endereco)} · ${esc(loja.fone)}</div>
      <div class="via-num">OS #${os.num}<small>${titulo}</small></div>
    </header>
    <table class="via-dados">
      <tr><th>Cliente</th><td>${esc(os.cliente.nome)} · ${esc(os.cliente.fone)}</td><th>Entrada</th><td>${dataBR(os.criada)}</td></tr>
      <tr><th>Aparelho</th><td>${esc(os.aparelho.tipo)} ${esc(os.aparelho.modelo)}${os.aparelho.serie ? ` · ${esc(os.aparelho.serie)}` : ''}</td><th>Prazo</th><td>${dataBR(os.prazo)}</td></tr>
      <tr><th>Acessórios</th><td>${esc(os.acessorios) || 'nenhum'}</td><th>Status</th><td>${status}</td></tr>
      <tr><th>Defeito</th><td colspan="3">${esc(os.defeito)}</td></tr>
    </table>
    ${
      os.itens.length
        ? `<table class="via-itens"><thead><tr><th>Item</th><th>Qtd</th><th>Unitário</th><th>Total</th></tr></thead><tbody>
      ${os.itens.map(i => `<tr><td>${esc(i.desc)}</td><td>${i.qtd}</td><td>${brl(i.valor)}</td><td>${brl(i.qtd * i.valor)}</td></tr>`).join('')}
      ${os.desconto ? `<tr><td colspan="3">Desconto</td><td>−${brl(os.desconto)}</td></tr>` : ''}
      <tr class="via-total"><td colspan="3">Total</td><td>${brl(totalOS(os))}</td></tr></tbody></table>`
        : '<p>Orçamento a definir após análise. Nenhum serviço é feito sem aprovação do cliente.</p>'
    }
    <p class="via-termos">Garantia de ${GARANTIA_DIAS} dias para o serviço e as peças trocadas, a partir da entrega. A loja não se responsabiliza por dados: faça backup antes.</p>
    <div class="via-assinaturas"><span>Assinatura do cliente</span><span>Responsável técnico</span></div>
  </section>`;
}

export function imprimirOS(os, loja) {
  const area = document.getElementById('impressao');
  area.innerHTML =
    via(os, loja, 'via da loja') + '<div class="corte">corte aqui</div>' + via(os, loja, 'via do cliente');
  window.print();
}
