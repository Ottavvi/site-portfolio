// Telas do Agente Contábil
import * as C from './contabil.js';
import {
  carregarExemplo,
  comecarDoZero,
  contaDe,
  estado,
  importar,
  mudou,
  reclassificar,
  restaurarBackup,
  salvarBackup
} from './estado.js';
import { baixar, csvDoDiario, xlsx } from './exportar.js';
import { ferramenta } from './ferramentas.js';
import { barrasMensais, linhaFatorR } from './graficos.js';
import { ANEXOS, FATOR_R_MINIMO, MEI } from './impostos.js';
import { lerArquivo, lerTextoDoArquivo } from './importar.js';
import { obrigacoes } from './obrigacoes.js';
import { contasDeMovimento } from './plano.js';
import {
  dataCurta,
  dinheiro,
  hojeISO,
  html,
  mesAnterior,
  mesCurto,
  mesDe,
  mesPorExtenso,
  nomeDoMes,
  somar
} from './util.js';

export const avisar = texto => {
  const caixa = document.getElementById('avisoRapido');
  caixa.textContent = texto;
  caixa.hidden = false;
  clearTimeout(avisar.tempo);
  avisar.tempo = setTimeout(() => (caixa.hidden = true), 2800);
};

const valor = (v, classe = '') => `<td class="num ${classe}">${v ? dinheiro(v) : ''}</td>`;
const pct = v => `${(v * 100).toFixed(2).replace('.', ',')}%`;
const nomeConta = id => {
  const c = contaDe(id);
  return c ? `${c.codigo} ${c.nome}` : id;
};

function semDados(titulo) {
  return `<section class="tela"><div class="tela-topo"><h1>${titulo}</h1></div><div class="vazio">
    <p>Ainda não há extrato da empresa.</p>
    <a class="btn btn-primario" href="#importar">Importar extrato</a>
    <button type="button" class="btn" data-acao="exemplo">Ver a empresa de exemplo</button>
  </div></section>`;
}
function ligarSemDados(raiz) {
  raiz.querySelector('[data-acao="exemplo"]')?.addEventListener('click', () => carregarExemplo());
}

// Mês escolhido nas telas com seletor (começa no último mês fechado)
let mesEscolhido = mesAnterior(C.mesAtual());
function seletorDeMes(aoMudar, { incluirAtual = true } = {}) {
  const meses = C.mesesComDados(estado);
  const primeiro = meses[0] || C.mesAtual();
  const ultimo = incluirAtual ? C.mesAtual() : mesAnterior(C.mesAtual());
  if (mesEscolhido > ultimo) mesEscolhido = ultimo;
  if (mesEscolhido < primeiro) mesEscolhido = primeiro;
  return {
    html: `<div class="seletor-mes">
      <button type="button" data-mes="-1" aria-label="Mês anterior" ${mesEscolhido <= primeiro ? 'disabled' : ''}>‹</button>
      <span>${mesPorExtenso(mesEscolhido)}${mesEscolhido === C.mesAtual() ? ' (aberto)' : ''}</span>
      <button type="button" data-mes="1" aria-label="Próximo mês" ${mesEscolhido >= ultimo ? 'disabled' : ''}>›</button>
    </div>`,
    ligar(raiz) {
      raiz.querySelectorAll('[data-mes]').forEach(b =>
        b.addEventListener('click', () => {
          mesEscolhido = mesAnterior(mesEscolhido, b.dataset.mes === '1' ? -1 : 1);
          aoMudar();
        })
      );
    }
  };
}

// ---------- Painel ----------
export function painel(raiz) {
  if (!estado.movimentos.length) {
    raiz.innerHTML = semDados('Painel');
    return ligarSemDados(raiz);
  }
  const mes = mesAnterior(C.mesAtual());
  const d = C.dre(estado, C.periodoDoMes(mes));
  const ap = C.apuracao(estado, C.mesAtual());
  const apFechado = C.apuracao(estado, mes);
  const meses = C.mesesComDados(estado).slice(-12);
  const serie = meses.map(m => {
    const x = C.dre(estado, C.periodoDoMes(m));
    return { mes: m, entradas: x.receitaBruta, saidas: x.receitaBruta - x.resultado };
  });
  const proximas = obrigacoes(estado, 40).slice(0, 5);
  const aClassificar = estado.movimentos.filter(m => m.conta.endsWith('a-classificar'));
  const alertas = [];
  if (estado.empresa.regime !== 'mei' && estado.empresa.fatorR && ap.anexo === 'V' && ap.alternativa) {
    alertas.push({
      nivel: 'atencao',
      titulo: `Fator R em ${pct(ap.fatorR)}: o DAS deste mês vai para o Anexo V`,
      detalhe: `Pela prévia de ${nomeDoMes(C.mesAtual())}, o DAS sai ${dinheiro(ap.das)} em vez de ${dinheiro(ap.alternativa.das)} no Anexo III.`,
      pergunta: 'Qual o meu Fator R?'
    });
  } else if (
    estado.empresa.fatorR &&
    ap.fatorR &&
    ap.fatorR < FATOR_R_MINIMO + 0.02 &&
    estado.empresa.regime !== 'mei'
  ) {
    alertas.push({
      nivel: 'aviso',
      titulo: `Fator R perto do limite: ${pct(ap.fatorR)}`,
      detalhe: 'Abaixo de 28%, o DAS passa para o Anexo V.',
      pergunta: 'Qual o meu Fator R?'
    });
  }
  if (aClassificar.length) {
    alertas.push({
      nivel: 'aviso',
      titulo: `${aClassificar.length} ${aClassificar.length === 1 ? 'movimento sem conta' : 'movimentos sem conta'}`,
      detalhe: 'Ficaram em "a classificar" e distorcem a DRE. Escolha a conta na tela Extrato e contas.',
      pergunta: 'Tem algo a classificar?'
    });
  }
  const b = C.balancete(estado);
  alertas.push(
    Math.abs(b.totalDebitos - b.totalCreditos) < 0.01
      ? {
          nivel: 'bom',
          titulo: 'O balancete fecha',
          detalhe: `Débitos e créditos somam ${dinheiro(b.totalDebitos)} cada.`
        }
      : { nivel: 'atencao', titulo: 'O balancete não fecha', detalhe: 'Confira os lançamentos.' }
  );
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><p>${html(estado.empresa.nome || 'Sua empresa')} · ${estado.empresa.regime === 'mei' ? 'MEI' : 'Simples Nacional'}</p></div></div>
    <h1 class="manchete">${d.resultado >= 0 ? `${nomeDoMes(mes).replace(/^./, c => c.toUpperCase())} fechou com lucro de <span class="positivo">${dinheiro(d.resultado)}</span>.` : `${nomeDoMes(mes).replace(/^./, c => c.toUpperCase())} fechou com prejuízo de <span class="negativo">${dinheiro(-d.resultado)}</span>.`}</h1>
    <p class="manchete-apoio">Receita de ${dinheiro(d.receitaBruta)}, DAS de ${dinheiro(d.deducoes)} e margem líquida de ${pct(d.margem)}. O DAS de ${nomeDoMes(mes)} vence em ${dataCurta(`${C.mesAtual()}-20`)}.</p>
    <dl class="razao">
      <div><dt>Receita do mês</dt><dd class="entrada">${dinheiro(d.receitaBruta)}</dd></div>
      <div><dt>DAS apurado</dt><dd>${dinheiro(apFechado.das)}</dd></div>
      <div><dt>Lucro líquido</dt><dd class="${d.resultado >= 0 ? 'entrada' : 'saida'}">${dinheiro(d.resultado)}</dd></div>
      <div><dt>Saldo em banco hoje</dt><dd>${dinheiro(C.saldoBanco(estado))}</dd></div>
    </dl>
    <div class="duas-colunas bloco">
      <div>
        <div class="bloco-cabecalho"><h2>O agente notou</h2></div>
        <ul class="alertas">${alertas
          .map(
            a =>
              `<li class="nivel-${a.nivel}"><strong>${html(a.titulo)}</strong><p>${html(a.detalhe)}</p>${a.pergunta ? `<button type="button" class="btn-texto" data-pergunta="${html(a.pergunta)}">Perguntar ao agente</button>` : ''}</li>`
          )
          .join('')}</ul>
      </div>
      <div>
        <div class="bloco-cabecalho"><h2>Próximos vencimentos</h2><a class="btn-texto" href="#obrigacoes">Ver todos</a></div>
        <ul class="eventos">${proximas.map(o => `<li><span class="data">${dataCurta(o.data)}</span><span>${html(o.nome)}</span><span class="valor">${o.valor ? dinheiro(o.valor) : ''}</span></li>`).join('')}</ul>
      </div>
    </div>
    <div class="bloco painel">
      <div class="bloco-cabecalho"><h2>Receita e gastos totais, mês a mês</h2><p>Gastos = tudo o que a DRE desconta, inclusive o DAS</p></div>
      ${barrasMensais(serie)}
      <div class="legenda"><span><i style="background:var(--entrada)"></i>Receita</span><span><i style="background:var(--saida)"></i>Custos, despesas e DAS</span></div>
    </div>
  </section>`;
}

// ---------- Extrato e contas ----------
let filtroMov = { busca: '', conta: '', todos: false, soAClassificar: false };
export function lancamentos(raiz) {
  if (!estado.movimentos.length) {
    raiz.innerHTML = semDados('Extrato e contas');
    return ligarSemDados(raiz);
  }
  const seletor = seletorDeMes(() => lancamentos(raiz));
  const termo = filtroMov.busca.toLowerCase();
  const lista = estado.movimentos
    .filter(
      m =>
        (filtroMov.todos || filtroMov.soAClassificar || mesDe(m.data) === mesEscolhido) &&
        (!filtroMov.conta || m.conta === filtroMov.conta) &&
        (!termo || m.descricao.toLowerCase().includes(termo)) &&
        (!filtroMov.soAClassificar || m.conta.endsWith('a-classificar'))
    )
    .slice()
    .reverse();
  const opcoes = sel =>
    contasDeMovimento(estado.plano)
      .map(c => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${c.codigo} ${html(c.nome)}</option>`)
      .join('');
  const aClassificar = estado.movimentos.filter(m => m.conta.endsWith('a-classificar')).length;
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>Extrato e contas</h1><p>Cada linha do banco vira um lançamento: o banco de um lado e a conta escolhida do outro. Mude a conta e o agente aprende.</p></div>
      ${filtroMov.todos || filtroMov.soAClassificar ? '' : seletor.html}
    </div>
    <div class="filtros">
      <input type="search" id="busca" placeholder="Buscar na descrição" value="${html(filtroMov.busca)}" aria-label="Buscar" />
      <select id="filtroConta" aria-label="Conta"><option value="">Todas as contas</option>${opcoes(filtroMov.conta)}</select>
      <label class="check"><input type="checkbox" id="todos" ${filtroMov.todos ? 'checked' : ''} /> Todos os meses</label>
      ${aClassificar ? `<label class="check"><input type="checkbox" id="soAClassificar" ${filtroMov.soAClassificar ? 'checked' : ''} /> Só os ${aClassificar} a classificar</label>` : ''}
    </div>
    <div class="rolagem"><table class="livro">
      <thead><tr><th>Data</th><th>Descrição no extrato</th><th>Conta (contrapartida do banco)</th><th class="num">Valor</th></tr></thead>
      <tbody>${lista
        .slice(0, 200)
        .map(
          m => `<tr>
          <td class="data">${dataCurta(m.data)}/${m.data.slice(2, 4)}</td>
          <td>${html(m.descricao)}</td>
          <td><select data-id="${m.id}" aria-label="Conta de ${html(m.descricao)}">${opcoes(m.conta)}</select></td>
          <td class="num ${m.valor > 0 ? 'debito' : 'credito'}">${dinheiro(m.valor)}</td>
        </tr>`
        )
        .join('')}</tbody>
    </table></div>
    <div class="tabela-rodape"><span>${lista.length} movimentos · entradas ${dinheiro(
      somar(
        lista.filter(m => m.valor > 0),
        m => m.valor
      )
    )} · saídas ${dinheiro(
      -somar(
        lista.filter(m => m.valor < 0),
        m => m.valor
      )
    )}</span>${lista.length > 200 ? '<span>Mostrando os 200 mais recentes</span>' : ''}</div>
  </section>`;
  seletor.ligar(raiz);
  const redesenhar = () => {
    const foco = document.activeElement?.id;
    lancamentos(raiz);
    if (foco) document.getElementById(foco)?.focus();
  };
  raiz.querySelector('#busca').addEventListener('input', e => {
    filtroMov.busca = e.target.value;
    redesenhar();
  });
  raiz.querySelector('#filtroConta').addEventListener('change', e => {
    filtroMov.conta = e.target.value;
    redesenhar();
  });
  raiz.querySelector('#todos').addEventListener('change', e => {
    filtroMov.todos = e.target.checked;
    redesenhar();
  });
  raiz.querySelector('#soAClassificar')?.addEventListener('change', e => {
    filtroMov.soAClassificar = e.target.checked;
    redesenhar();
  });
  raiz.querySelectorAll('select[data-id]').forEach(sel =>
    sel.addEventListener('change', () => {
      const m = estado.movimentos.find(x => x.id === sel.dataset.id);
      const r = reclassificar(m, sel.value);
      avisar(
        r.alterados > 1
          ? `${r.alterados} movimentos do mesmo lugar foram para ${nomeConta(sel.value)}.`
          : `Conta alterada para ${nomeConta(sel.value)}.`
      );
    })
  );
}

// ---------- Livro diário ----------
export function diario(raiz) {
  if (!estado.movimentos.length) {
    raiz.innerHTML = semDados('Livro diário');
    return ligarSemDados(raiz);
  }
  const seletor = seletorDeMes(() => diario(raiz));
  const lista = C.filtrarLancamentos(estado, { mes: mesEscolhido });
  const totalD = somar(
    lista.flatMap(l => l.partidas.filter(p => p.tipo === 'D')),
    p => p.valor
  );
  const totalC = somar(
    lista.flatMap(l => l.partidas.filter(p => p.tipo === 'C')),
    p => p.valor
  );
  const origem = { banco: '', apuracao: 'apuração', depreciacao: 'depreciação', abertura: 'abertura' };
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>Livro diário</h1><p>Todos os lançamentos em ordem de data. Cada um tem débitos e créditos de valor igual.</p></div>
      ${seletor.html}
    </div>
    <div class="rolagem"><table class="livro">
      <thead><tr><th>Data</th><th>Conta e histórico</th><th class="num col-d">Débito</th><th class="num col-c">Crédito</th></tr></thead>
      <tbody>${lista
        .map(l => {
          const partidas = [...l.partidas].sort((a, b) => (a.tipo === 'D' ? -1 : 1) - (b.tipo === 'D' ? -1 : 1));
          return (
            partidas
              .map(
                (p, i) => `<tr class="partida">
              <td class="data">${i === 0 ? dataCurta(l.data) : ''}</td>
              <td class="${p.tipo === 'C' ? 'conta-c' : ''}"><span class="codigo">${contaDe(p.conta).codigo}</span> ${html(contaDe(p.conta).nome)}</td>
              <td class="num col-d debito">${p.tipo === 'D' ? dinheiro(p.valor) : ''}</td>
              <td class="num col-c credito">${p.tipo === 'C' ? dinheiro(p.valor) : ''}</td>
            </tr>`
              )
              .join('') +
            `<tr class="lancamento-fim"><td></td><td class="historico" colspan="3"><em>${html(l.historico)}</em>${origem[l.origem] ? `<span class="etiqueta">${origem[l.origem]}</span>` : ''}</td></tr>`
          );
        })
        .join('')}</tbody>
      <tfoot><tr><td></td><td>Total de ${mesPorExtenso(mesEscolhido)} (${lista.length} lançamentos)</td><td class="num col-d">${dinheiro(totalD)}</td><td class="num col-c">${dinheiro(totalC)}</td></tr></tfoot>
    </table></div>
  </section>`;
  seletor.ligar(raiz);
}

// ---------- Razão ----------
let contaRazao = 'banco';
export function razao(raiz) {
  if (!estado.movimentos.length) {
    raiz.innerHTML = semDados('Razão');
    return ligarSemDados(raiz);
  }
  const r = C.razao(estado, contaRazao);
  const c = r.conta;
  const totalD = somar(r.linhas, l => l.debito);
  const totalC = somar(r.linhas, l => l.credito);
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>Razão</h1><p>O histórico de uma conta, com o saldo depois de cada lançamento.</p></div>
      <label class="campo">Conta<select id="contaRazao">${estado.plano
        .filter(x => x.id)
        .map(
          x => `<option value="${x.id}" ${x.id === contaRazao ? 'selected' : ''}>${x.codigo} ${html(x.nome)}</option>`
        )
        .join('')}</select></label>
    </div>
    <div class="duas-colunas">
      <div>
        <h1 class="manchete" style="font-size:clamp(1.6rem,3vw,2.3rem)">${html(c.nome)}: saldo ${c.natureza === 'devedora' ? 'devedor' : 'credor'} de ${dinheiro(r.saldoFinal)}</h1>
        <p class="manchete-apoio">Conta de natureza ${c.natureza}: ${c.natureza === 'devedora' ? 'aumenta com débitos e diminui com créditos' : 'aumenta com créditos e diminui com débitos'}.</p>
      </div>
      <div class="razonetes">
        <div class="razonete">
          <p class="razonete-nome">${c.codigo} ${html(c.nome)}</p>
          <div class="razonete-corpo">
            <div class="razonete-d"><span>${dinheiro(totalD)}</span><span class="razonete-total">${c.natureza === 'devedora' ? dinheiro(r.saldoFinal) : ''}</span></div>
            <div class="razonete-c"><span>${dinheiro(totalC)}</span><span class="razonete-total">${c.natureza === 'credora' ? dinheiro(r.saldoFinal) : ''}</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="rolagem bloco"><table class="livro">
      <thead><tr><th>Data</th><th>Histórico</th><th class="num col-d">Débito</th><th class="num col-c">Crédito</th><th class="num">Saldo</th></tr></thead>
      <tbody>${r.linhas
        .slice()
        .reverse()
        .slice(0, 250)
        .map(
          l =>
            `<tr><td class="data">${dataCurta(l.data)}/${l.data.slice(2, 4)}</td><td>${html(l.historico)}</td>${valor(l.debito, 'col-d debito')}${valor(l.credito, 'col-c credito')}<td class="num">${dinheiro(l.saldo)}</td></tr>`
        )
        .join('')}</tbody>
      <tfoot><tr><td></td><td>Totais (${r.linhas.length} lançamentos)</td><td class="num col-d">${dinheiro(totalD)}</td><td class="num col-c">${dinheiro(totalC)}</td><td class="num">${dinheiro(r.saldoFinal)}</td></tr></tfoot>
    </table></div>
  </section>`;
  raiz.querySelector('#contaRazao').addEventListener('change', e => {
    contaRazao = e.target.value;
    razao(raiz);
  });
}
export const abrirRazao = id => (contaRazao = id);

// ---------- Balancete ----------
let dataBalancete = null;
export function balancete(raiz) {
  if (!estado.movimentos.length) {
    raiz.innerHTML = semDados('Balancete');
    return ligarSemDados(raiz);
  }
  const ate = dataBalancete || hojeISO();
  const b = C.balancete(estado, { ate });
  const ok = Math.abs(b.totalDebitos - b.totalCreditos) < 0.01;
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>Balancete de verificação</h1><p>Saldo de cada conta. A soma dos débitos tem que ser igual à dos créditos.</p></div>
      <label class="campo">Até<input type="date" id="ate" value="${ate}" /></label>
    </div>
    <div class="rolagem"><table class="livro">
      <thead><tr><th>Código</th><th>Conta</th><th class="num col-d">Débitos</th><th class="num col-c">Créditos</th><th class="num">Saldo</th></tr></thead>
      <tbody>${b.linhas
        .map(l => {
          const nivel = l.conta.codigo.split('.').length;
          return `<tr class="${l.conta.grupo ? 'grupo' : ''} nivel-${nivel}" ${l.conta.id ? `data-conta="${l.conta.id}"` : ''}>
            <td class="codigo">${l.conta.codigo}</td>
            <td>${l.conta.id ? `<a href="#razao" data-razao="${l.conta.id}">${html(l.conta.nome)}</a>` : html(l.conta.nome)}</td>
            ${valor(l.debitos, 'col-d')}${valor(l.creditos, 'col-c')}
            <td class="num">${dinheiro(l.final)} <small>${l.conta.grupo ? '' : l.final ? (l.conta.natureza === 'devedora' ? 'D' : 'C') : ''}</small></td>
          </tr>`;
        })
        .join('')}</tbody>
      <tfoot><tr><td></td><td>Totais</td><td class="num col-d">${dinheiro(b.totalDebitos)}</td><td class="num col-c">${dinheiro(b.totalCreditos)}</td><td></td></tr></tfoot>
    </table></div>
    <p class="confere ${ok ? '' : 'erro-texto'}">${ok ? '✓ Débitos e créditos batem.' : '✕ Débitos e créditos não batem.'}</p>
  </section>`;
  raiz.querySelector('#ate').addEventListener('change', e => {
    dataBalancete = e.target.value || null;
    balancete(raiz);
  });
  raiz.querySelectorAll('[data-razao]').forEach(a => a.addEventListener('click', () => abrirRazao(a.dataset.razao)));
}

// ---------- DRE ----------
let periodoDRE = 'mes';
export function dre(raiz) {
  if (!estado.movimentos.length) {
    raiz.innerHTML = semDados('DRE');
    return ligarSemDados(raiz);
  }
  const seletor = seletorDeMes(() => dre(raiz));
  const ano = Number(mesEscolhido.slice(0, 4));
  const atual =
    periodoDRE === 'mes'
      ? C.periodoDoMes(mesEscolhido)
      : periodoDRE === 'ano'
        ? { de: `${ano}-01-01`, ate: ano === Number(hojeISO().slice(0, 4)) ? hojeISO() : `${ano}-12-31` }
        : { de: `${mesAnterior(C.mesAtual(), 12)}-01`, ate: C.fimDoMes(mesAnterior(C.mesAtual())) };
  const anterior =
    periodoDRE === 'mes'
      ? C.periodoDoMes(mesAnterior(mesEscolhido))
      : periodoDRE === 'ano'
        ? { de: `${ano - 1}-01-01`, ate: `${ano - 1}-${atual.ate.slice(5)}` }
        : { de: `${mesAnterior(C.mesAtual(), 24)}-01`, ate: C.fimDoMes(mesAnterior(C.mesAtual(), 13)) };
  const d = C.dre(estado, atual);
  const dAnt = C.dre(estado, anterior);
  const rotulos = {
    mes: [mesPorExtenso(mesEscolhido), mesPorExtenso(mesAnterior(mesEscolhido))],
    ano: [`${ano}${atual.ate < `${ano}-12-31` ? ' até hoje' : ''}`, `${ano - 1} (mesmo período)`],
    doze: ['Últimos 12 meses fechados', '12 meses antes']
  }[periodoDRE];
  const celula = v => `<td class="num ${v < 0 ? 'negativo' : ''}">${dinheiro(v)}</td>`;
  const av = v => (d.receitaBruta ? `${((v / d.receitaBruta) * 100).toFixed(1).replace('.', ',')}%` : '');
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>DRE</h1><p>Demonstração do resultado: da receita ao lucro.</p></div>
      <div class="linha-campos">
        <div class="opcoes" role="group" aria-label="Período">
          <button type="button" data-periodo="mes" aria-pressed="${periodoDRE === 'mes'}">Mês</button>
          <button type="button" data-periodo="ano" aria-pressed="${periodoDRE === 'ano'}">Ano</button>
          <button type="button" data-periodo="doze" aria-pressed="${periodoDRE === 'doze'}">12 meses</button>
        </div>
        ${periodoDRE === 'doze' ? '' : seletor.html}
      </div>
    </div>
    <p class="manchete-apoio">${html(rotulos[0])}: lucro de <strong>${dinheiro(d.resultado)}</strong> sobre receita de <strong>${dinheiro(d.receitaBruta)}</strong> (margem de ${pct(d.margem)}). ${dAnt.receitaBruta ? `No período anterior, ${dinheiro(dAnt.resultado)} (${pct(dAnt.margem)}).` : ''}</p>
    <div class="rolagem bloco"><table class="livro dre">
      <thead><tr><th></th><th class="num">${html(rotulos[0])}</th><th class="num">% da receita</th><th class="num">${html(rotulos[1])}</th></tr></thead>
      <tbody>${d.linhas
        .map((l, i) => {
          const la = dAnt.linhas[i];
          const principal = `<tr class="${l.total ? 'total' : ''} ${l.final ? 'final' : ''}"><td>${html(l.rotulo)}</td>${celula(l.valor)}<td class="num">${av(l.valor)}</td>${celula(la.valor)}</tr>`;
          const detalhe = (l.detalhe || [])
            .map(x => {
              const ant = la.detalhe?.find(y => y.conta.id === x.conta.id)?.valor || 0;
              const sinal = x.conta.natureza === 'credora' ? 1 : -1; // receitas positivas, custos e despesas negativos
              return `<tr class="detalhe"><td>${x.conta.codigo} ${html(x.conta.nome)}</td>${celula(sinal * x.valor)}<td class="num">${av(sinal * x.valor)}</td>${celula(sinal * ant)}</tr>`;
            })
            .join('');
          return principal + detalhe;
        })
        .join('')}</tbody>
    </table></div>
  </section>`;
  if (periodoDRE !== 'doze') seletor.ligar(raiz);
  raiz.querySelectorAll('[data-periodo]').forEach(b =>
    b.addEventListener('click', () => {
      periodoDRE = b.dataset.periodo;
      dre(raiz);
    })
  );
}

// ---------- Balanço ----------
let dataBalanco = null;
export function balanco(raiz) {
  if (!estado.movimentos.length) {
    raiz.innerHTML = semDados('Balanço');
    return ligarSemDados(raiz);
  }
  const data = dataBalanco || hojeISO();
  const b = C.balanco(estado, data);
  const lado = (titulo, grupos, total) => `<div>
    <h3>${titulo}</h3>
    <table class="livro"><tbody>${grupos
      .map(
        ([nome, linhas]) =>
          `<tr class="grupo"><td>${nome}</td><td class="num">${dinheiro(somar(linhas, l => l.valor))}</td></tr>` +
          linhas
            .map(
              l =>
                `<tr class="nivel-2"><td style="padding-left:28px">${html(l.rotulo)}</td><td class="num">${dinheiro(l.valor)}</td></tr>`
            )
            .join('')
      )
      .join('')}</tbody>
      <tfoot><tr><td>Total</td><td class="num">${dinheiro(total)}</td></tr></tfoot></table>
  </div>`;
  const agrupar = linhas => Object.entries(linhas.reduce((g, l) => ((g[l.grupo] ||= []).push(l), g), {}));
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>Balanço patrimonial</h1><p>O que a empresa tem (ativo), o que deve (passivo) e o que é dos sócios (patrimônio líquido).</p></div>
      <label class="campo">Em<input type="date" id="dataBalanco" value="${data}" /></label>
    </div>
    <div class="balanco">
      ${lado('Ativo', agrupar(b.ativo), b.totalAtivo)}
      ${lado('Passivo e patrimônio líquido', [...agrupar(b.passivo), ...agrupar(b.pl)], b.totalPassivo + b.totalPL)}
    </div>
    <p class="confere ${b.fecha ? '' : 'erro-texto'}">${b.fecha ? `✓ Ativo = passivo + patrimônio líquido = ${dinheiro(b.totalAtivo)}` : '✕ O balanço não fecha.'}</p>
    <p class="manchete-apoio">O resultado do ano aparece direto no patrimônio líquido, sem lançamento de encerramento. Os lucros já distribuídos aos sócios entram com sinal negativo.</p>
  </section>`;
  raiz.querySelector('#dataBalanco').addEventListener('change', e => {
    dataBalanco = e.target.value || null;
    balanco(raiz);
  });
}

// ---------- Impostos ----------
export function impostos(raiz) {
  if (!estado.movimentos.length) {
    raiz.innerHTML = semDados('Impostos');
    return ligarSemDados(raiz);
  }
  const e = estado.empresa;
  if (e.regime === 'mei') return impostosMei(raiz);
  const meses = C.mesesComDados(estado);
  const atual = C.apuracao(estado, C.mesAtual());
  const fr = ferramenta('fator_r').executar(estado, {});
  const serieFator = meses.map(m => ({ mes: m, valor: C.apuracao(estado, m).fatorR * 100 }));
  const posicao = Math.min((atual.fatorR || 0) / (FATOR_R_MINIMO * 2), 1) * 100;
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><h1>Simples Nacional</h1><p>${html(ANEXOS[e.anexo].nome)}${e.fatorR ? ', com Fator R' : ''}. Apuração mês a mês pela receita recebida.</p></div></div>
    <h1 class="manchete" style="font-size:clamp(1.7rem,3.4vw,2.6rem)">O DAS de ${nomeDoMes(C.mesAtual())} deve ficar em <span class="${atual.anexo === 'V' && e.fatorR ? 'negativo' : 'positivo'}">${dinheiro(atual.das)}</span>.</h1>
    <p class="manchete-apoio">Prévia com a receita recebida até hoje (${dinheiro(atual.receita)}). Vence em ${dataCurta(`${mesAnterior(C.mesAtual(), -1)}-20`)}.</p>
    <dl class="destaque-imposto bloco">
      <div><dt>Receita de 12 meses (RBT12)</dt><dd>${dinheiro(atual.rbt12)}</dd></div>
      <div><dt>Anexo e faixa</dt><dd>${atual.anexo}, ${atual.faixa}ª faixa</dd></div>
      <div><dt>Alíquota efetiva</dt><dd>${pct(atual.efetiva)}</dd></div>
    </dl>
    ${
      e.fatorR
        ? `<div class="bloco painel">
        <div class="bloco-cabecalho"><h2>Fator R: ${pct(atual.fatorR)}</h2><p>Folha de 12 meses ÷ receita de 12 meses</p></div>
        <div class="regua-fator" role="img" aria-label="Fator R de ${pct(atual.fatorR)}; o mínimo para o Anexo III é 28%"><span style="left:${posicao}%"></span></div>
        <div class="regua-legenda"><span>Anexo V</span><span>Anexo III</span></div>
        <p class="manchete-apoio">${
          atual.anexo === 'V'
            ? `Abaixo de 28%, o DAS sai pelo Anexo V: ${dinheiro(atual.das)} em vez de ${dinheiro(atual.alternativa.das)}. Faltam ${dinheiro(fr.folha_que_falta_em_12_meses)} de folha nos 12 meses, ou cerca de ${dinheiro(fr.aumento_mensal_de_pro_labore_por_12_meses)} a mais de pró-labore por mês. Confirme a estratégia com a contabilidade.`
            : `Acima de 28%: o DAS sai pelo Anexo III, o mais barato para a atividade. Se a receita crescer mais rápido que a folha, ele cai.`
        }</p>
        ${linhaFatorR(serieFator)}
      </div>`
        : ''
    }
    <div class="bloco">
      <div class="bloco-cabecalho"><h2>Apuração de cada mês</h2></div>
      <div class="rolagem"><table class="livro">
        <thead><tr><th>Mês</th><th class="num">Receita</th><th class="num">RBT12</th>${e.fatorR ? '<th class="num">Fator R</th>' : ''}<th>Anexo</th><th class="num">Alíquota efetiva</th><th class="num">DAS</th></tr></thead>
        <tbody>${meses
          .slice()
          .reverse()
          .map(m => {
            const a = C.apuracao(estado, m);
            return `<tr><td>${mesCurto(m)}${m === C.mesAtual() ? ' <span class="etiqueta">prévia</span>' : ''}${a.proporcional ? ' <span class="etiqueta" title="Empresa com menos de 12 meses: RBT12 proporcional">prop.</span>' : ''}</td><td class="num">${dinheiro(a.receita)}</td><td class="num">${dinheiro(a.rbt12)}</td>${e.fatorR ? `<td class="num">${pct(a.fatorR)}</td>` : ''}<td>${a.anexo}</td><td class="num">${pct(a.efetiva)}</td><td class="num"><strong>${dinheiro(a.das)}</strong></td></tr>`;
          })
          .join('')}</tbody>
      </table></div>
    </div>
    <form class="bloco painel" id="simulador">
      <h2>Simular</h2>
      <p class="manchete-apoio">Quanto seria o DAS com outra receita ou outra folha (usa a receita dos últimos 12 meses atual).</p>
      <div class="linha-campos" style="margin-top:12px">
        <label class="campo">Receita no mês<input name="receita" type="number" min="0" step="1000" value="${Math.round(atual.receita || 50000)}" /></label>
        <label class="campo">Folha por mês<small>salários + pró-labore + encargos</small><input name="folha" type="number" min="0" step="100" value="${Math.round((atual.folha12 || 0) / 12)}" /></label>
        <output class="campo" id="resultadoSimulacao" aria-live="polite"></output>
      </div>
    </form>
  </section>`;
  const form = raiz.querySelector('#simulador');
  const simular = () => {
    const d = Object.fromEntries(new FormData(form));
    const r = ferramenta('simular_das').executar(estado, {
      receita_mensal: Number(d.receita) || 0,
      folha_mensal: Number(d.folha) || 0
    });
    raiz.querySelector('#resultadoSimulacao').innerHTML =
      `DAS estimado<strong style="font-family:var(--titulo);font-size:1.5rem">${dinheiro(r.das)}</strong><small>Anexo ${r.anexo}, Fator R ${String(r.fator_r_pct).replace('.', ',')}%, alíquota ${String(r.aliquota_efetiva_pct).replace('.', ',')}%</small>`;
  };
  form.addEventListener('input', simular);
  form.addEventListener('submit', ev => ev.preventDefault());
  simular();
}

function impostosMei(raiz) {
  const r = ferramenta('situacao_mei').executar(estado, {});
  const uso = Math.min(r.faturamento_no_ano / r.limite, 1.3);
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><h1>MEI</h1><p>DAS fixo de ${dinheiro(r.das_mei_mensal)} por mês em ${r.ano} e limite de faturamento de ${dinheiro(r.limite)}.</p></div></div>
    <h1 class="manchete">Você já usou <span class="${uso > 0.8 ? 'negativo' : 'positivo'}">${(uso * 100).toFixed(0)}%</span> do limite do ano.</h1>
    <p class="manchete-apoio">Faturamento de ${dinheiro(r.faturamento_no_ano)} até agora. No ritmo atual, o ano fecha em ${dinheiro(r.projecao_ate_dezembro)}.</p>
    <div class="medidor bloco" style="height:16px"><span style="width:${Math.min(uso, 1) * 100}%;background:${uso > 1 ? 'var(--saida)' : uso > 0.8 ? 'var(--aviso)' : 'var(--entrada)'}"></span></div>
    <p class="manchete-apoio">${html(r.regras)}</p>
    <div class="bloco painel"><h2>Limites por ano</h2><ul class="eventos">${Object.entries(MEI.limitePorAno)
      .map(
        ([a, l]) =>
          `<li><span class="data">${a}</span><span>${a === '2028' ? 'Depende da lei orçamentária' : 'Limite anual'}</span><span class="valor">${dinheiro(l)}</span></li>`
      )
      .join('')}</ul></div>
  </section>`;
}

// ---------- Obrigações ----------
export function obrigacoesTela(raiz) {
  const lista = obrigacoes(estado, 400);
  const porMes = lista.reduce((g, o) => ((g[mesDe(o.data)] ||= []).push(o), g), {});
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><h1>Obrigações</h1><p>Vencimentos e declarações dos próximos 12 meses.</p></div></div>
    ${Object.entries(porMes)
      .map(
        ([mes, itens]) => `<div class="bloco"><h2>${mesPorExtenso(mes).replace(/^./, c => c.toUpperCase())}</h2>
      <ul class="eventos">${itens.map(o => `<li><span class="data">${dataCurta(o.data)}</span><span>${html(o.nome)}${o.detalhe ? `<br><small>${html(o.detalhe)}</small>` : ''}</span><span class="valor">${o.valor ? dinheiro(o.valor) : ''}</span></li>`).join('')}</ul></div>`
      )
      .join('')}
    <p class="manchete-apoio bloco">Datas ajustadas só para fins de semana (o DAS vai para o próximo dia útil; o FGTS é antecipado). Confira feriados na agenda tributária oficial e com a contabilidade.</p>
  </section>`;
}

// ---------- Importar ----------
let lido = null;
export function importarTela(raiz) {
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><h1>Importar extrato da empresa</h1><p>CSV ou OFX da conta PJ. O arquivo é lido aqui no navegador.</p></div></div>
    <label class="soltar" id="soltar"><strong>Solte o arquivo aqui ou clique para escolher</strong><p>.csv ou .ofx</p><input type="file" id="arquivo" accept=".csv,.ofx,.txt" class="sr" /></label>
    <div id="previa"></div>
    <ol class="passos">
      <li>No internet banking da conta PJ, exporte o extrato em <strong>CSV</strong> ou <strong>OFX</strong>.</li>
      <li>O agente classifica cada linha numa conta do plano (receita de serviços, salários, aluguel...). O que ele não reconhecer fica "a classificar".</li>
      <li>Depois, confira os dados da empresa em <a href="#ajustes">Empresa e ajustes</a> (anexo do Simples, Fator R, capital inicial).</li>
    </ol>
  </section>`;
  const previa = raiz.querySelector('#previa');
  const soltar = raiz.querySelector('#soltar');
  const entrada = raiz.querySelector('#arquivo');
  async function ler(arquivo) {
    try {
      lido = { nome: arquivo.name, ...lerArquivo(arquivo.name, await lerTextoDoArquivo(arquivo)) };
      mostrar();
    } catch (erro) {
      previa.innerHTML = `<p class="erro">${html(erro.message)}</p>`;
    }
  }
  function mostrar() {
    const lista = lido.transacoes;
    previa.innerHTML = `<div class="painel bloco">
      <div class="bloco-cabecalho"><h2>${html(lido.nome)}</h2><p>${lista.length} movimentos</p></div>
      <div class="rolagem"><table class="livro"><tbody>${lista
        .slice(0, 8)
        .map(
          t =>
            `<tr><td class="data">${dataCurta(t.data)}</td><td>${html(t.descricao)}</td><td class="num">${dinheiro(t.valor)}</td></tr>`
        )
        .join('')}</tbody></table></div>
      ${estado.exemplo ? '<p class="erro">A empresa de exemplo será apagada e substituída por este extrato.</p>' : ''}
      <div class="linha-campos bloco"><button type="button" class="btn btn-primario" id="confirmar">Importar ${lista.length} movimentos</button><button type="button" class="btn" id="cancelar">Cancelar</button></div>
    </div>`;
    previa.querySelector('#cancelar').addEventListener('click', () => {
      lido = null;
      previa.innerHTML = '';
    });
    previa.querySelector('#confirmar').addEventListener('click', () => {
      const r = importar(lista);
      lido = null;
      avisar(`${r.adicionados} movimentos importados${r.repetidos ? `, ${r.repetidos} já existiam` : ''}.`);
      location.hash = '#lancamentos';
    });
  }
  entrada.addEventListener('change', () => entrada.files[0] && ler(entrada.files[0]));
  soltar.addEventListener('dragover', e => {
    e.preventDefault();
    soltar.classList.add('arrastando');
  });
  soltar.addEventListener('dragleave', () => soltar.classList.remove('arrastando'));
  soltar.addEventListener('drop', e => {
    e.preventDefault();
    soltar.classList.remove('arrastando');
    if (e.dataTransfer.files[0]) ler(e.dataTransfer.files[0]);
  });
}

// ---------- Empresa e ajustes ----------
export function ajustes(raiz) {
  const e = estado.empresa;
  const a = estado.ajustes;
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><h1>Empresa e ajustes</h1></div></div>
    <form class="painel" id="formEmpresa">
      <h2>Empresa</h2>
      <div class="linha-campos" style="margin-top:14px">
        <label class="campo">Razão social<input name="nome" value="${html(e.nome)}" /></label>
        <label class="campo">CNPJ<input name="cnpj" value="${html(e.cnpj)}" /></label>
        <label class="campo">Atividade<input name="atividade" value="${html(e.atividade)}" /></label>
      </div>
      <div class="linha-campos" style="margin-top:12px">
        <label class="campo">Regime<select name="regime"><option value="simples" ${e.regime === 'simples' ? 'selected' : ''}>Simples Nacional</option><option value="mei" ${e.regime === 'mei' ? 'selected' : ''}>MEI</option></select></label>
        <label class="campo">Anexo do Simples<select name="anexo">${Object.entries(ANEXOS)
          .map(([k, v]) => `<option value="${k}" ${e.anexo === k ? 'selected' : ''}>${html(v.nome)}</option>`)
          .join('')}</select></label>
        <label class="campo">Atividade do MEI<select name="atividadeMei">${[
          ['servicos', 'Serviços (ISS)'],
          ['comercio', 'Comércio ou indústria (ICMS)'],
          ['ambos', 'Comércio e serviços']
        ]
          .map(([k, v]) => `<option value="${k}" ${e.atividadeMei === k ? 'selected' : ''}>${v}</option>`)
          .join('')}</select></label>
      </div>
      <div class="linha-campos" style="margin-top:12px">
        <label class="check"><input type="checkbox" name="fatorR" ${e.fatorR ? 'checked' : ''} /> Atividade sujeita ao Fator R (Anexo III ou V conforme a folha)</label>
      </div>
      <div class="linha-campos" style="margin-top:12px">
        <label class="campo">Capital social integralizado<input name="capitalInicial" type="number" min="0" step="100" value="${e.capitalInicial || 0}" /><small>Entra no primeiro dia como saldo do banco</small></label>
        <label class="campo">Início da contabilidade<input name="inicio" type="date" value="${e.inicio || ''}" /></label>
        <button class="btn btn-primario" type="submit">Salvar</button>
      </div>
    </form>
    <form class="painel bloco" id="formClaude">
      <h2>Modo Claude (opcional)</h2>
      <p class="manchete-apoio">Por padrão o agente responde sozinho, aqui no navegador. Com uma chave da API da Anthropic, as perguntas passam a ser respondidas pelo Claude. Só a pergunta e os resultados das consultas que ele fizer saem do computador.</p>
      <label class="check" style="margin-top:12px"><input type="checkbox" name="usarClaude" ${a.usarClaude ? 'checked' : ''} /> Usar o Claude para responder</label>
      <div class="linha-campos" style="margin-top:12px">
        <label class="campo">Chave da API<input name="chaveApi" type="password" value="${html(a.chaveApi)}" placeholder="sk-ant-..." autocomplete="off" /><small>Fica salva só neste navegador.</small></label>
        <label class="campo">Modelo<select name="modelo">${[
          ['claude-sonnet-5-5', 'Claude Sonnet 5.5 (equilibrado)'],
          ['claude-haiku-5-5', 'Claude Haiku 5.5 (mais rápido)'],
          ['claude-opus-5-5', 'Claude Opus 5.5 (mais capaz)']
        ]
          .map(([v, n]) => `<option value="${v}" ${a.modelo === v ? 'selected' : ''}>${n}</option>`)
          .join('')}</select></label>
        <button class="btn" type="submit">Salvar</button>
      </div>
    </form>
    <div class="painel bloco">
      <h2>Dados</h2>
      <p class="manchete-apoio">Exporte o livro diário, o plano de contas e a apuração para o Excel ou o Power BI.</p>
      <div class="linha-campos" style="margin-top:12px">
        <button type="button" class="btn" data-acao="xlsx">Exportar para Excel (.xlsx)</button>
        <button type="button" class="btn" data-acao="csv">Livro diário (.csv)</button>
        <button type="button" class="btn" data-acao="backup">Baixar backup</button>
        <label class="btn">Restaurar backup<input type="file" accept=".json" class="sr" id="restaurar" /></label>
      </div>
      <div class="linha-campos" style="margin-top:12px">
        <button type="button" class="btn" data-acao="exemplo">Carregar a empresa de exemplo</button>
        <button type="button" class="btn btn-perigo" data-acao="zerar">Apagar tudo</button>
      </div>
    </div>
  </section>`;
  raiz.querySelector('#formEmpresa').addEventListener('submit', ev => {
    ev.preventDefault();
    const d = new FormData(ev.target);
    Object.assign(estado.empresa, {
      nome: String(d.get('nome')).trim(),
      cnpj: String(d.get('cnpj')).trim(),
      atividade: String(d.get('atividade')).trim(),
      regime: d.get('regime'),
      anexo: d.get('anexo'),
      atividadeMei: d.get('atividadeMei'),
      fatorR: d.get('fatorR') === 'on',
      capitalInicial: Number(d.get('capitalInicial')) || 0,
      inicio: d.get('inicio') || estado.empresa.inicio
    });
    mudou();
    avisar('Dados da empresa salvos. Os relatórios foram refeitos.');
  });
  raiz.querySelector('#formClaude').addEventListener('submit', ev => {
    ev.preventDefault();
    const d = new FormData(ev.target);
    estado.ajustes.usarClaude = d.get('usarClaude') === 'on' && Boolean(String(d.get('chaveApi')).trim());
    estado.ajustes.chaveApi = String(d.get('chaveApi') || '').trim();
    estado.ajustes.modelo = d.get('modelo');
    mudou();
    avisar(
      estado.ajustes.usarClaude
        ? 'O agente vai responder com o Claude.'
        : 'O agente vai responder sozinho, sem internet.'
    );
  });
  const hoje = hojeISO();
  raiz
    .querySelector('[data-acao="xlsx"]')
    .addEventListener('click', () => baixar(xlsx(estado), `agente-contabil-${hoje}.xlsx`));
  raiz
    .querySelector('[data-acao="csv"]')
    .addEventListener('click', () => baixar(csvDoDiario(estado), `livro-diario-${hoje}.csv`, 'text/csv'));
  raiz
    .querySelector('[data-acao="backup"]')
    .addEventListener('click', () => baixar(salvarBackup(), `agente-contabil-backup-${hoje}.json`, 'application/json'));
  raiz.querySelector('#restaurar').addEventListener('change', async ev => {
    try {
      restaurarBackup(await ev.target.files[0].text());
      avisar('Backup restaurado.');
    } catch (erro) {
      avisar(erro.message);
    }
  });
  raiz.querySelector('[data-acao="exemplo"]').addEventListener('click', () => {
    if (
      estado.movimentos.length &&
      !estado.exemplo &&
      !confirm('Isso apaga os dados da sua empresa e carrega a de exemplo. Continuar?')
    )
      return;
    carregarExemplo();
    avisar('Empresa de exemplo carregada.');
  });
  raiz.querySelector('[data-acao="zerar"]').addEventListener('click', () => {
    if (!confirm('Apagar todos os dados desta empresa neste navegador?')) return;
    comecarDoZero();
    avisar('Tudo apagado.');
  });
}
