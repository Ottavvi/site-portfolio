// As telas do app. Cada função recebe o elemento <main> e desenha a tela; os eventos ficam junto do HTML.
import * as A from './analise.js';
import {
  carregarExemplo,
  categoria,
  comecarDoZero,
  estado,
  importar,
  mudarCategoria,
  mudou,
  restaurarBackup,
  salvarBackup
} from './estado.js';
import { baixar, csvDeTransacoes, xlsx } from './exportar.js';
import { barrasCategorias, barrasMensais, linhaPrevisao } from './graficos.js';
import { lerArquivo, lerTextoDoArquivo } from './importar.js';
import {
  dataCurta,
  dataLonga,
  dinheiro,
  hojeISO,
  html,
  id,
  mesAnterior,
  mesPorExtenso,
  nomeDoMes,
  porcento,
  somar
} from './util.js';

export const avisar = texto => {
  const caixa = document.getElementById('avisoRapido');
  caixa.textContent = texto;
  caixa.hidden = false;
  clearTimeout(avisar.tempo);
  avisar.tempo = setTimeout(() => (caixa.hidden = true), 2600);
};

// Mês escolhido na visão geral e nas transações (fica entre as telas)
let mesEscolhido = A.mesAtual();

function seletorDeMes(aoMudar) {
  const meses = A.mesesComDados(estado);
  const primeiro = meses[0] || A.mesAtual();
  return {
    html: `<div class="seletor-mes">
      <button type="button" data-mes="-1" aria-label="Mês anterior" ${mesEscolhido <= primeiro ? 'disabled' : ''}>‹</button>
      <span>${mesPorExtenso(mesEscolhido)}</span>
      <button type="button" data-mes="1" aria-label="Próximo mês" ${mesEscolhido >= A.mesAtual() ? 'disabled' : ''}>›</button>
    </div>`,
    ligar(raiz) {
      raiz.querySelectorAll('[data-mes]').forEach(botao =>
        botao.addEventListener('click', () => {
          mesEscolhido = botao.dataset.mes === '1' ? mesAnterior(mesEscolhido, -1) : mesAnterior(mesEscolhido);
          aoMudar();
        })
      );
    }
  };
}

function semDados() {
  return `<div class="vazio">
    <p>Ainda não há nenhum extrato aqui.</p>
    <a class="btn btn-primario" href="#importar">Importar extrato</a>
    <button type="button" class="btn" data-acao="exemplo">Ver com dados de exemplo</button>
  </div>`;
}
function ligarSemDados(raiz) {
  raiz.querySelector('[data-acao="exemplo"]')?.addEventListener('click', () => carregarExemplo());
}

// ---------- Visão geral ----------
export function visao(raiz) {
  if (!estado.transacoes.length) {
    raiz.innerHTML = `<section class="tela"><div class="tela-topo"><h1>Visão geral</h1></div>${semDados()}</section>`;
    return ligarSemDados(raiz);
  }
  const r = A.resumoDoMes(estado, mesEscolhido);
  const corrente = mesEscolhido === A.mesAtual();
  const nomeMes = nomeDoMes(mesEscolhido);
  const manchete =
    r.resultado >= 0
      ? `${corrente ? 'Até agora, ' : 'Em '}${nomeMes} ${corrente ? 'está' : 'fechou'} <span class="positivo">${dinheiro(r.resultado)}</span> no azul.`
      : `${corrente ? 'Até agora, ' : 'Em '}${nomeMes} ${corrente ? 'está' : 'fechou'} <span class="negativo">${dinheiro(-r.resultado)}</span> no vermelho.`;
  const maior = r.porCategoria[0];
  const apoio = maior
    ? `O que mais pesou foi ${html(maior.categoria.nome.toLowerCase())}: ${dinheiro(maior.total)}${maior.mediaAnterior ? `, contra ${dinheiro(maior.mediaAnterior)} na média dos 3 meses anteriores` : ''}.`
    : 'Nenhum gasto neste mês ainda.';
  const alertas = corrente ? A.alertas(estado, mesEscolhido) : [];
  const prev = A.previsao(estado, 45);
  const seletor = seletorDeMes(() => visao(raiz));
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div>
        <p>${estado.nome ? `Olá, ${html(estado.nome)}.` : ''} Resumo de ${mesPorExtenso(mesEscolhido)}</p>
      </div>
      ${seletor.html}
    </div>
    <h1 class="manchete">${manchete}</h1>
    <p class="manchete-apoio">${apoio}</p>
    <dl class="razao">
      <div><dt>${corrente ? 'Saldo hoje' : 'Saldo no fim do mês'}</dt><dd>${dinheiro(corrente ? A.saldoEm(estado) : r.saldoFinal)}</dd></div>
      <div><dt>Entrou</dt><dd class="entrada">${dinheiro(r.entradas)}</dd></div>
      <div><dt>Saiu</dt><dd class="saida">${dinheiro(r.saidas)}</dd></div>
      <div><dt>Guardado</dt><dd>${dinheiro(r.guardado)}</dd></div>
    </dl>

    <div class="duas-colunas bloco">
      <div>
        <div class="bloco-cabecalho"><h2>Para onde foi</h2><p>O traço é o orçamento</p></div>
        ${r.porCategoria.length ? barrasCategorias(r.porCategoria.filter(l => l.total > 0)) : '<p>Sem gastos neste mês.</p>'}
      </div>
      <div>
        <div class="bloco-cabecalho"><h2>${corrente ? 'O agente notou' : 'Como foi'}</h2></div>
        ${
          corrente
            ? alertas.length
              ? `<ul class="alertas">${alertas
                  .slice(0, 5)
                  .map(
                    a => `<li class="nivel-${a.nivel}"><strong>${html(a.titulo)}</strong><p>${html(a.detalhe)}</p></li>`
                  )
                  .join('')}</ul>`
              : '<p>Nada fora do normal este mês.</p>'
            : `<ul class="alertas"><li class="nivel-${r.resultado >= 0 ? 'bom' : 'atencao'}"><strong>${r.resultado >= 0 ? 'Sobrou' : 'Faltou'} ${dinheiro(Math.abs(r.resultado))}</strong><p>Entraram ${dinheiro(r.entradas)} e saíram ${dinheiro(r.saidas)} em ${r.quantidade} lançamentos.</p></li></ul>`
        }
        <button type="button" class="btn-texto" data-pergunta="Onde posso economizar?">Perguntar onde dá para economizar</button>
      </div>
    </div>

    <div class="bloco painel">
      <div class="bloco-cabecalho"><h2>Entradas e saídas nos últimos 12 meses</h2></div>
      ${barrasMensais(A.serieMensal(estado, 12, A.mesAtual()))}
      <div class="legenda"><span><i style="background:var(--entrada)"></i>Entrou</span><span><i style="background:var(--saida)"></i>Saiu</span></div>
    </div>

    <div class="bloco painel">
      <div class="bloco-cabecalho">
        <h2>Saldo previsto para os próximos 45 dias</h2>
        <p>Menor saldo: ${dinheiro(prev.menor.saldo)} em ${dataCurta(prev.menor.data)}</p>
      </div>
      ${linhaPrevisao(prev.serie, { menor: prev.menor })}
      <a class="btn-texto" href="#previsao">Ver a previsão completa</a>
    </div>
  </section>`;
  seletor.ligar(raiz);
}

// ---------- Transações ----------
let filtros = { busca: '', categoria: '', limite: 120 };
export function transacoes(raiz) {
  if (!estado.transacoes.length) {
    raiz.innerHTML = `<section class="tela"><div class="tela-topo"><h1>Transações</h1></div>${semDados()}</section>`;
    return ligarSemDados(raiz);
  }
  const seletor = seletorDeMes(() => transacoes(raiz));
  const todosOsMeses = filtros.todosOsMeses;
  const lista = A.filtrar(estado, {
    mes: todosOsMeses ? undefined : mesEscolhido,
    busca: filtros.busca || undefined,
    categoria: filtros.categoria || undefined
  }).reverse();
  const opcoesCategoria = (selecionada, comTodas) =>
    (comTodas ? `<option value="">Todas as categorias</option>` : '') +
    ['saida', 'entrada', 'neutra']
      .map(
        tipo =>
          `<optgroup label="${{ saida: 'Gastos', entrada: 'Entradas', neutra: 'Outras' }[tipo]}">${estado.categorias
            .filter(c => c.tipo === tipo)
            .map(c => `<option value="${c.id}" ${c.id === selecionada ? 'selected' : ''}>${html(c.nome)}</option>`)
            .join('')}</optgroup>`
      )
      .join('');
  const total = somar(lista, t => t.valor);
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>Transações</h1><p>Mude a categoria de uma linha e o agente aprende para as próximas do mesmo lugar.</p></div>
      ${todosOsMeses ? '' : seletor.html}
    </div>
    <div class="filtros">
      <label class="sr" for="busca">Buscar</label>
      <input type="search" id="busca" placeholder="Buscar na descrição" value="${html(filtros.busca)}" />
      <label class="sr" for="filtroCategoria">Categoria</label>
      <select id="filtroCategoria">${opcoesCategoria(filtros.categoria, true)}</select>
      <label class="check"><input type="checkbox" id="todosOsMeses" ${todosOsMeses ? 'checked' : ''} /> Todos os meses</label>
    </div>
    <div class="rolagem">
      <table class="tabela">
        <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th class="num">Valor</th></tr></thead>
        <tbody>${lista
          .slice(0, filtros.limite)
          .map(t => {
            const tipo = categoria(t.categoria).tipo;
            return `<tr>
              <td class="data">${dataCurta(t.data)}${todosOsMeses ? `/${t.data.slice(2, 4)}` : ''}</td>
              <td>${html(t.descricao)}</td>
              <td><label class="sr" for="cat-${t.id}">Categoria de ${html(t.descricao)}</label><select id="cat-${t.id}" data-id="${t.id}">${opcoesCategoria(t.categoria)}</select></td>
              <td class="num ${tipo === 'entrada' ? 'valor-entrada' : tipo === 'neutra' ? 'valor-neutro' : 'valor-saida'}">${dinheiro(t.valor)}</td>
            </tr>`;
          })
          .join('')}</tbody>
      </table>
    </div>
    <div class="tabela-rodape">
      <span>${lista.length} ${lista.length === 1 ? 'transação' : 'transações'} · soma ${dinheiro(total)}</span>
      ${lista.length > filtros.limite ? `<button type="button" class="btn-texto" id="mostrarMais">Mostrar mais</button>` : ''}
    </div>
  </section>`;
  seletor.ligar(raiz);
  const redesenhar = () => {
    const foco = document.activeElement?.id;
    const posicao = document.activeElement?.selectionStart;
    transacoes(raiz);
    if (foco) {
      const el = document.getElementById(foco);
      el?.focus();
      if (posicao != null && el?.setSelectionRange) el.setSelectionRange(posicao, posicao);
    }
  };
  raiz.querySelector('#busca').addEventListener('input', e => {
    filtros.busca = e.target.value;
    filtros.limite = 120;
    redesenhar();
  });
  raiz.querySelector('#filtroCategoria').addEventListener('change', e => {
    filtros.categoria = e.target.value;
    redesenhar();
  });
  raiz.querySelector('#todosOsMeses').addEventListener('change', e => {
    filtros.todosOsMeses = e.target.checked;
    redesenhar();
  });
  raiz.querySelector('#mostrarMais')?.addEventListener('click', () => {
    filtros.limite += 200;
    redesenhar();
  });
  raiz.querySelectorAll('select[data-id]').forEach(select =>
    select.addEventListener('change', () => {
      const t = estado.transacoes.find(x => x.id === select.dataset.id);
      const antes = estado.transacoes.filter(x => x.categoria === select.value).length;
      mudarCategoria(t, select.value);
      const depois = estado.transacoes.filter(x => x.categoria === select.value).length;
      avisar(
        depois - antes > 1
          ? `${depois - antes} transações do mesmo lugar foram para ${categoria(select.value).nome}.`
          : `Categoria alterada para ${categoria(select.value).nome}.`
      );
    })
  );
}

// ---------- Orçamentos ----------
export function orcamentos(raiz) {
  const lista = A.orcamentos(estado);
  const semLimite = estado.categorias.filter(c => c.tipo === 'saida' && !c.orcamento);
  const totalLimite = somar(lista, o => o.limite);
  const totalGasto = somar(lista, o => o.gasto);
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>Orçamentos de ${nomeDoMes(A.mesAtual())}</h1><p>Um limite por categoria. A faixa clara é a projeção até o fim do mês.</p></div>
    </div>
    <p class="manchete-apoio">Você já usou <strong>${dinheiro(totalGasto)}</strong> de <strong>${dinheiro(totalLimite)}</strong> (${porcento(totalLimite ? totalGasto / totalLimite : 0)}) dos orçamentos do mês.</p>
    <ul class="orc-lista bloco">${lista
      .map(
        o => `<li>
        <div>
          <div class="orc-nome">
            <span><strong>${html(o.categoria.nome)}</strong> · <span class="orc-situacao situacao-${o.situacao}">${{ ok: 'dentro do limite', risco: 'deve passar', estourou: 'passou do limite' }[o.situacao]}</span></span>
            <span>${dinheiro(o.gasto)} · projeção ${dinheiro(o.projecao)}</span>
          </div>
          <div class="medidor" role="img" aria-label="${Math.round(o.uso * 100)}% do orçamento usado">
            <span class="projecao" style="width:${Math.min((o.projecao / o.limite) * 100, 100)}%;background:${o.categoria.cor}"></span>
            <span style="width:${Math.min(o.uso * 100, 100)}%;background:${o.categoria.cor}"></span>
          </div>
        </div>
        <label class="orc-limite">Limite por mês
          <input type="number" min="0" step="10" inputmode="numeric" value="${o.limite}" data-categoria="${o.categoria.id}" />
        </label>
      </li>`
      )
      .join('')}</ul>
    ${
      semLimite.length
        ? `<div class="bloco"><h2>Sem orçamento</h2><ul class="orc-lista">${semLimite
            .map(
              c =>
                `<li><div><strong>${html(c.nome)}</strong></div><label class="orc-limite">Limite por mês<input type="number" min="0" step="10" placeholder="Sem limite" data-categoria="${c.id}" /></label></li>`
            )
            .join('')}</ul></div>`
        : ''
    }
  </section>`;
  raiz.querySelectorAll('input[data-categoria]').forEach(campo =>
    campo.addEventListener('change', () => {
      const c = estado.categorias.find(x => x.id === campo.dataset.categoria);
      c.orcamento = Math.max(0, Math.round(Number(campo.value) || 0));
      mudou();
      avisar(
        c.orcamento ? `Orçamento de ${c.nome}: ${dinheiro(c.orcamento)} por mês.` : `${c.nome} ficou sem orçamento.`
      );
    })
  );
}

// ---------- Previsão ----------
let cenarioConservador = false;
export function previsao(raiz) {
  if (!estado.transacoes.length) {
    raiz.innerHTML = `<section class="tela"><div class="tela-topo"><h1>Previsão</h1></div>${semDados()}</section>`;
    return ligarSemDados(raiz);
  }
  const p = A.previsao(estado, 90, {
    comEntradasVariaveis: !cenarioConservador
  });
  const fixos = p.fixos;
  const gastosFixos = fixos.filter(f => !f.entrada);
  const entradasFixas = fixos.filter(f => f.entrada);
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo">
      <div><h1>Previsão de saldo</h1><p>Os próximos 90 dias, a partir do saldo de hoje.</p></div>
      <div class="opcoes" role="group" aria-label="Cenário">
        <button type="button" data-cenario="esperado" aria-pressed="${!cenarioConservador}">Esperado</button>
        <button type="button" data-cenario="conservador" aria-pressed="${cenarioConservador}">Sem entradas extras</button>
      </div>
    </div>
    <h1 class="manchete">${
      p.menor.saldo < 0
        ? `O saldo pode ficar <span class="negativo">${dinheiro(p.menor.saldo)}</span> em ${dataLonga(p.menor.data).replace(/ de \d{4}$/, '')}.`
        : `O saldo não fica negativo. O ponto mais baixo é <span class="positivo">${dinheiro(p.menor.saldo)}</span>, em ${dataLonga(p.menor.data).replace(/ de \d{4}$/, '')}.`
    }</h1>
    <p class="manchete-apoio">Contas fixas no dia de costume, ${dinheiro(p.gastoVariavelMensal)} de gastos variáveis por mês (média dos últimos 3 meses)${
      cenarioConservador
        ? ' e nenhuma entrada além das fixas'
        : ` e ${dinheiro(p.entradaVariavelMensal)} de entradas extras por mês (mediana dos últimos 6)`
    }.</p>
    <div class="bloco painel">${linhaPrevisao(p.serie, { menor: p.menor, altura: 260 })}</div>

    <div class="duas-colunas bloco">
      <div>
        <div class="bloco-cabecalho"><h2>Próximos lançamentos fixos</h2></div>
        <ul class="eventos">${p.eventos
          .slice(0, 14)
          .map(
            e =>
              `<li><span class="data">${dataCurta(e.data)}</span><span>${html(e.nome)}</span><span class="${e.valor > 0 ? 'valor-entrada' : ''}">${dinheiro(e.valor)}</span></li>`
          )
          .join('')}</ul>
      </div>
      <div>
        <div class="bloco-cabecalho"><h2>Contas que se repetem</h2><p>${dinheiro(somar(gastosFixos, f => f.valorMedio))} por mês</p></div>
        <ul class="eventos">${gastosFixos
          .map(
            f =>
              `<li><span class="data">dia ${f.diaTipico}</span><span>${html(f.nome)}${f.nova ? ' <strong class="situacao-risco">nova</strong>' : ''}</span><span>${dinheiro(f.valorMedio)}</span></li>`
          )
          .join('')}</ul>
        ${entradasFixas.length ? `<p class="manchete-apoio">Entradas fixas: ${entradasFixas.map(f => `${html(f.nome)} (${dinheiro(f.valorMedio)}, dia ${f.diaTipico})`).join(', ')}.</p>` : ''}
      </div>
    </div>
  </section>`;
  raiz.querySelectorAll('[data-cenario]').forEach(b =>
    b.addEventListener('click', () => {
      cenarioConservador = b.dataset.cenario === 'conservador';
      previsao(raiz);
    })
  );
}

// ---------- Metas ----------
export function metas(raiz) {
  const lista = A.metas(estado);
  const sobra = A.serieMensal(estado, 6, mesAnterior(A.mesAtual())).map(m => m.resultado);
  const sobraMedia = sobra.length ? somar(sobra) / sobra.length : 0;
  const totalMensal = somar(lista, m => m.porMes);
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><h1>Metas</h1><p>Quanto separar por mês para chegar lá no prazo.</p></div></div>
    ${
      lista.length
        ? `<p class="manchete-apoio">Suas metas pedem <strong>${dinheiro(totalMensal)}</strong> por mês. Nos últimos 6 meses sobraram, em média, <strong>${dinheiro(sobraMedia)}</strong>.</p>`
        : ''
    }
    <div class="metas bloco">${lista
      .map(
        m => `<article class="painel meta">
        <h3>${html(m.nome)}</h3>
        <div class="meta-valores"><span><strong>${dinheiro(m.guardado)}</strong></span><span>de ${dinheiro(m.alvo)}</span></div>
        <div class="medidor"><span style="width:${Math.min(m.progresso * 100, 100)}%;background:var(--entrada)"></span></div>
        <p>Faltam ${dinheiro(m.falta)} até ${dataLonga(m.prazo)}: <strong>${dinheiro(m.porMes)} por mês</strong>.</p>
        <p class="${m.cabe ? 'cabe' : 'nao-cabe'}">${m.cabe ? 'Cabe na sua sobra média.' : 'Não cabe na sobra média: alongue o prazo ou corte gastos.'}</p>
        <form class="acoes" data-meta="${m.id}">
          <label class="sr" for="guardar-${m.id}">Valor guardado para ${html(m.nome)}</label>
          <input id="guardar-${m.id}" type="number" min="0" step="50" placeholder="R$" class="campo-valor" required />
          <button class="btn" type="submit">Guardei</button>
          <button class="btn btn-perigo" type="button" data-excluir="${m.id}" aria-label="Excluir a meta ${html(m.nome)}">Excluir</button>
        </form>
      </article>`
      )
      .join('')}</div>
    <form class="painel bloco" id="novaMeta">
      <h2>Nova meta</h2>
      <div class="linha-campos" style="margin-top:14px">
        <label class="campo">Nome<input name="nome" required placeholder="Ex.: viagem de férias" /></label>
        <label class="campo">Valor<input name="alvo" type="number" min="1" step="50" required /></label>
        <label class="campo">Já tenho<input name="guardado" type="number" min="0" step="50" value="0" /></label>
        <label class="campo">Prazo<input name="prazo" type="date" required min="${hojeISO()}" /></label>
        <button class="btn btn-primario" type="submit">Criar meta</button>
      </div>
    </form>
  </section>`;
  raiz.querySelectorAll('form[data-meta]').forEach(form =>
    form.addEventListener('submit', e => {
      e.preventDefault();
      const meta = estado.metas.find(m => m.id === form.dataset.meta);
      const valor = Number(form.querySelector('input').value);
      if (!(valor > 0)) return;
      meta.guardado += valor;
      mudou();
      avisar(`${dinheiro(valor)} somados à meta ${meta.nome}.`);
    })
  );
  raiz.querySelectorAll('[data-excluir]').forEach(b =>
    b.addEventListener('click', () => {
      const meta = estado.metas.find(m => m.id === b.dataset.excluir);
      if (!confirm(`Excluir a meta "${meta.nome}"?`)) return;
      estado.metas = estado.metas.filter(m => m.id !== meta.id);
      mudou();
    })
  );
  raiz.querySelector('#novaMeta').addEventListener('submit', e => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(e.target));
    estado.metas.push({
      id: id(),
      nome: dados.nome.trim(),
      alvo: Number(dados.alvo),
      guardado: Number(dados.guardado) || 0,
      prazo: dados.prazo
    });
    mudou();
    avisar('Meta criada.');
  });
}

// ---------- Importar ----------
let lido = null;
export function importarTela(raiz) {
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><h1>Importar extrato</h1><p>CSV ou OFX, de qualquer banco. O arquivo é lido aqui no navegador e não é enviado para lugar nenhum.</p></div></div>
    <label class="soltar" id="soltar">
      <strong>Solte o arquivo aqui ou clique para escolher</strong>
      <p>.csv ou .ofx</p>
      <input type="file" id="arquivo" accept=".csv,.ofx,.txt,text/csv" class="sr" />
    </label>
    <div id="previa"></div>
    <ol class="passos">
      <li>No app ou site do banco, procure "Extrato" e a opção de exportar ou baixar em <strong>CSV</strong>, <strong>Excel/CSV</strong> ou <strong>OFX (Money)</strong>.</li>
      <li>Escolha o período (dá para importar vários meses de uma vez). Arquivos repetidos não duplicam lançamentos.</li>
      <li>Fatura de cartão em CSV costuma trazer gastos como valores positivos: o app percebe e pergunta antes de inverter.</li>
    </ol>
  </section>`;
  const soltar = raiz.querySelector('#soltar');
  const entrada = raiz.querySelector('#arquivo');
  const previa = raiz.querySelector('#previa');
  async function ler(arquivo) {
    try {
      const texto = await lerTextoDoArquivo(arquivo);
      lido = { nome: arquivo.name, ...lerArquivo(arquivo.name, texto) };
      mostrarPrevia();
    } catch (erro) {
      previa.innerHTML = `<p class="erro">${html(erro.message)}</p>`;
    }
  }
  function mostrarPrevia() {
    const { transacoes: lista, pareceFatura } = lido;
    const inverter = previa.querySelector('#inverter')?.checked ?? pareceFatura;
    const ajustadas = lista.map(t => ({
      ...t,
      valor: inverter ? -t.valor : t.valor
    }));
    const datas = ajustadas.map(t => t.data).sort();
    previa.innerHTML = `<div class="painel bloco">
      <div class="bloco-cabecalho"><h2>${html(lido.nome)}</h2><p>${lista.length} lançamentos, de ${dataCurta(datas[0])}/${datas[0].slice(2, 4)} a ${dataCurta(datas.at(-1))}/${datas.at(-1).slice(2, 4)}</p></div>
      <div class="rolagem"><table class="tabela"><thead><tr><th>Data</th><th>Descrição</th><th class="num">Valor</th></tr></thead><tbody>
        ${ajustadas
          .slice(0, 8)
          .map(
            t =>
              `<tr><td class="data">${dataCurta(t.data)}</td><td>${html(t.descricao)}</td><td class="num ${t.valor > 0 ? 'valor-entrada' : ''}">${dinheiro(t.valor)}</td></tr>`
          )
          .join('')}
      </tbody></table></div>
      <label class="check bloco"><input type="checkbox" id="inverter" ${inverter ? 'checked' : ''} /> Inverter os sinais (marque se for fatura de cartão: os gastos devem aparecer negativos)</label>
      ${estado.exemplo ? '<p class="erro">Os dados de exemplo serão apagados e substituídos pelo seu extrato.</p>' : ''}
      <div class="linha-campos bloco"><button type="button" class="btn btn-primario" id="confirmar">Importar ${lista.length} lançamentos</button><button type="button" class="btn" id="cancelar">Cancelar</button></div>
    </div>`;
    previa.querySelector('#inverter').addEventListener('change', mostrarPrevia);
    previa.querySelector('#cancelar').addEventListener('click', () => {
      lido = null;
      previa.innerHTML = '';
    });
    previa.querySelector('#confirmar').addEventListener('click', () => {
      const r = importar(ajustadas);
      lido = null;
      avisar(`${r.adicionadas} lançamentos importados${r.repetidas ? `, ${r.repetidas} já existiam` : ''}.`);
      location.hash = '#transacoes';
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

// ---------- Ajustes ----------
export function ajustes(raiz) {
  const a = estado.ajustes;
  raiz.innerHTML = `<section class="tela">
    <div class="tela-topo"><div><h1>Ajustes</h1></div></div>
    <form class="painel" id="formPerfil">
      <h2>Você</h2>
      <div class="linha-campos" style="margin-top:14px">
        <label class="campo">Seu nome<input name="nome" value="${html(estado.nome)}" autocomplete="given-name" /></label>
        <label class="campo">Saldo antes do primeiro lançamento<input name="saldoInicial" type="number" step="0.01" value="${estado.saldoInicial}" /><small>Para o saldo bater com o do banco</small></label>
        <button class="btn" type="submit">Salvar</button>
      </div>
    </form>

    <form class="painel bloco" id="formClaude">
      <h2>Modo Claude (opcional)</h2>
      <p class="manchete-apoio">Por padrão o agente responde sozinho, aqui no navegador. Com uma chave da API da Anthropic, as perguntas passam a ser respondidas pelo Claude, que entende perguntas mais abertas. Só a pergunta e os números que ele consultar saem do computador.</p>
      <label class="check" style="margin-top:12px"><input type="checkbox" name="usarClaude" ${a.usarClaude ? 'checked' : ''} /> Usar o Claude para responder</label>
      <div class="linha-campos" style="margin-top:12px">
        <label class="campo">Chave da API<input name="chaveApi" type="password" value="${html(a.chaveApi)}" placeholder="sk-ant-..." autocomplete="off" /><small>Fica salva só neste navegador. Crie em console.anthropic.com.</small></label>
        <label class="campo">Modelo<select name="modelo">
          ${[
            ['claude-sonnet-5-5', 'Claude Sonnet 5.5 (equilibrado)'],
            ['claude-haiku-5-5', 'Claude Haiku 5.5 (mais rápido)'],
            ['claude-opus-5-5', 'Claude Opus 5.5 (mais capaz)']
          ]
            .map(([v, n]) => `<option value="${v}" ${a.modelo === v ? 'selected' : ''}>${n}</option>`)
            .join('')}
        </select></label>
        <button class="btn" type="submit">Salvar</button>
      </div>
    </form>

    <div class="painel bloco">
      <h2>Seus dados</h2>
      <p class="manchete-apoio">Tudo fica guardado neste navegador. Exporte para abrir no Excel ou no Power BI, ou faça um backup para levar para outro computador.</p>
      <div class="linha-campos" style="margin-top:12px">
        <button type="button" class="btn" data-acao="xlsx">Exportar para Excel (.xlsx)</button>
        <button type="button" class="btn" data-acao="csv">Exportar transações (.csv)</button>
        <button type="button" class="btn" data-acao="backup">Baixar backup</button>
        <label class="btn">Restaurar backup<input type="file" accept=".json" class="sr" id="restaurar" /></label>
      </div>
      <div class="linha-campos" style="margin-top:12px">
        <button type="button" class="btn" data-acao="exemplo">Carregar dados de exemplo</button>
        <button type="button" class="btn btn-perigo" data-acao="zerar">Apagar tudo e começar do zero</button>
      </div>
    </div>
  </section>`;
  raiz.querySelector('#formPerfil').addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    estado.nome = d.nome.trim();
    estado.saldoInicial = Number(d.saldoInicial) || 0;
    mudou();
    avisar('Salvo.');
  });
  raiz.querySelector('#formClaude').addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(e.target);
    estado.ajustes.usarClaude = d.get('usarClaude') === 'on';
    estado.ajustes.chaveApi = String(d.get('chaveApi') || '').trim();
    estado.ajustes.modelo = d.get('modelo');
    if (estado.ajustes.usarClaude && !estado.ajustes.chaveApi) {
      estado.ajustes.usarClaude = false;
      avisar('Informe a chave da API para usar o Claude.');
    } else
      avisar(
        estado.ajustes.usarClaude
          ? 'O agente vai responder com o Claude.'
          : 'O agente vai responder sozinho, sem internet.'
      );
    mudou();
  });
  const hoje = hojeISO();
  raiz
    .querySelector('[data-acao="xlsx"]')
    .addEventListener('click', () => baixar(xlsx(estado), `agente-financeiro-${hoje}.xlsx`));
  raiz
    .querySelector('[data-acao="csv"]')
    .addEventListener('click', () => baixar(csvDeTransacoes(estado), `transacoes-${hoje}.csv`, 'text/csv'));
  raiz
    .querySelector('[data-acao="backup"]')
    .addEventListener('click', () =>
      baixar(salvarBackup(), `agente-financeiro-backup-${hoje}.json`, 'application/json')
    );
  raiz.querySelector('#restaurar').addEventListener('change', async e => {
    try {
      restaurarBackup(await e.target.files[0].text());
      avisar('Backup restaurado.');
    } catch (erro) {
      avisar(erro.message);
    }
  });
  raiz.querySelector('[data-acao="exemplo"]').addEventListener('click', () => {
    if (
      estado.transacoes.length &&
      !estado.exemplo &&
      !confirm('Isso apaga as suas transações e carrega os dados de exemplo. Continuar?')
    )
      return;
    carregarExemplo();
    avisar('Dados de exemplo carregados.');
  });
  raiz.querySelector('[data-acao="zerar"]').addEventListener('click', () => {
    if (!confirm('Apagar todas as transações, metas e a conversa deste navegador?')) return;
    comecarDoZero();
    avisar('Tudo apagado.');
  });
}
