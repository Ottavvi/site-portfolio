// Ambientes do editor ao vivo: transformam o que a pessoa escreveu numa página que roda no resultado (iframe).
// O padrão é HTML puro. As trilhas que não são só HTML escolhem um ambiente com data-linguagem:
// sql (SQLite de verdade, com sql.js), python (Pyodide), react (JSX com import), modulos (vários arquivos .js),
// playwright (um mini Playwright que testa a página do próprio editor), yaml (workflows do GitHub Actions) e
// typescript (o compilador de verdade confere os tipos antes de rodar).
// Todos deixam window.__pronto: uma Promise que os testes dos desafios esperam antes de conferir o resultado.

const SQL_JS = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const REACT = 'https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js';
const REACT_DOM = 'https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js';
const BABEL = 'https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.4/babel.min.js';
const JS_YAML = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';

// O código da pessoa entra na página como JSON dentro de um <script>: assim nenhum </script> escrito por ela fecha
// a tag antes da hora
const comoJson = valor => JSON.stringify(valor).replace(/</g, '\\u003c');

// Separa o código em arquivos pelas linhas "// --- nome.js ---". O que vem antes da primeira é a página (HTML).
const MARCA_ARQUIVO = /^\/\/ -{3} (\S+) -{3}[ \t]*$/m;
function separarArquivos(codigo) {
  const partes = codigo.split(MARCA_ARQUIVO);
  const arquivos = {};
  for (let i = 1; i < partes.length; i += 2) arquivos[partes[i]] = partes[i + 1].replace(/^\n/, '');
  return { pagina: partes[0], arquivos };
}

// ---------- SQLite ----------
// Banco de exemplo de todas as aulas de SQL: uma loja pequena com clientes, produtos, pedidos e os itens de cada pedido
export const BANCO_LOJA = `
CREATE TABLE clientes (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, cidade TEXT, estado TEXT, desde TEXT);
INSERT INTO clientes VALUES
  (1,'Ana Souza','Curitiba','PR','2024-02-10'),(2,'Bruno Lima','São Paulo','SP','2024-05-22'),
  (3,'Carla Dias','Curitiba','PR','2025-01-15'),(4,'Diego Rocha','Recife','PE','2025-03-03'),
  (5,'Elisa Melo','São Paulo','SP','2025-07-19'),(6,'Fábio Nunes','Salvador','BA','2026-01-08'),
  (7,'Gabi Torres','Recife','PE','2026-04-30');
CREATE TABLE produtos (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, categoria TEXT, preco REAL, estoque INTEGER);
INSERT INTO produtos VALUES
  (1,'Café em grãos 1kg','Mercearia',62.9,40),(2,'Caneca de cerâmica','Casa',34.5,25),
  (3,'Moedor manual','Utensílios',149.0,8),(4,'Filtro de papel','Mercearia',9.9,120),
  (5,'Prensa francesa','Utensílios',119.9,0),(6,'Chá verde 100g','Mercearia',22.0,60),
  (7,'Garrafa térmica','Casa',89.0,15),(8,'Balança de precisão','Utensílios',75.5,5);
CREATE TABLE pedidos (id INTEGER PRIMARY KEY, cliente_id INTEGER REFERENCES clientes(id), data TEXT, status TEXT);
INSERT INTO pedidos VALUES
  (1,1,'2026-07-02','entregue'),(2,2,'2026-07-15','entregue'),(3,1,'2026-08-03','entregue'),
  (4,3,'2026-08-21','cancelado'),(5,4,'2026-09-05','entregue'),(6,5,'2026-09-18','entregue'),
  (7,2,'2026-10-01','enviado'),(8,1,'2026-10-12','enviado'),(9,6,'2026-10-20','pago'),(10,4,'2026-10-25','pago');
CREATE TABLE itens (pedido_id INTEGER REFERENCES pedidos(id), produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER, preco REAL);
INSERT INTO itens VALUES
  (1,1,2,62.9),(1,4,3,9.9),(2,3,1,149.0),(2,2,2,34.5),(3,1,1,62.9),(3,6,2,22.0),(4,7,1,89.0),
  (5,5,1,119.9),(5,4,2,9.9),(6,8,1,75.5),(6,1,1,62.9),(7,2,4,34.5),(8,1,3,62.9),(8,3,1,149.0),
  (9,6,1,22.0),(10,7,2,89.0),(10,4,1,9.9);
`;

function sql(codigo) {
  return `<div id="resultado"><p class="carregando">Carregando o SQLite…</p></div>
<style>
  .carregando, .vazio { color: #66737f; }
  .erro { color: #b42318; font-weight: 600; white-space: pre-wrap; }
  table { margin: 0 0 14px; font-size: 14px; }
  th { background: #eef2f5; text-align: left; }
  caption { text-align: left; color: #66737f; font-size: 12px; padding-bottom: 4px; }
</style>
<script src="${SQL_JS}sql-wasm.js"></script>
<script>
  const CODIGO = ${comoJson(codigo)};
  const BANCO = ${comoJson(BANCO_LOJA)};
  const saida = document.getElementById('resultado');
  const tabela = ({ columns, values }, indice, total) => {
    const t = document.createElement('table');
    if (total > 1) t.createCaption().textContent = 'Resultado ' + (indice + 1);
    t.createTHead().insertRow().append(...columns.map(c => Object.assign(document.createElement('th'), { textContent: c })));
    const corpo = t.createTBody();
    for (const linha of values) {
      const tr = corpo.insertRow();
      for (const valor of linha) tr.insertCell().textContent = valor === null ? 'NULL' : valor;
    }
    return t;
  };
  window.__resultados = [];
  window.__pronto = initSqlJs({ locateFile: arquivo => '${SQL_JS}' + arquivo }).then(SQL => {
    // Um banco novo com os dados de exemplo; __consultar roda um SQL num banco limpo (os testes comparam com ele)
    const novoBanco = () => { const db = new SQL.Database(); db.run(BANCO); return db; };
    window.__db = novoBanco();
    window.__consultar = texto => { const db = novoBanco(); try { return db.exec(texto).at(-1) || null; } finally { db.close(); } };
    saida.replaceChildren();
    try {
      window.__resultados = window.__db.exec(CODIGO);
      window.__resultados.forEach((r, i, todos) => saida.append(tabela(r, i, todos.length)));
      if (!window.__resultados.length) {
        const aviso = document.createElement('p');
        aviso.className = 'vazio';
        const mudou = window.__db.getRowsModified();
        aviso.textContent = CODIGO.trim() ? 'Comandos executados' + (mudou ? ' (' + mudou + ' linha(s) alterada(s) no último).' : '. Nenhuma consulta devolveu linhas.') : 'Escreva uma consulta SQL.';
        saida.append(aviso);
      }
    } catch (erro) {
      window.__erro = erro.message;
      saida.append(Object.assign(document.createElement('p'), { className: 'erro', textContent: 'Erro: ' + erro.message }));
      console.error(erro.message);
    }
  });
</script>`;
}

// ---------- Python ----------
function python(codigo) {
  return `<pre id="terminal"><span class="carregando">Carregando o Python (a primeira vez demora alguns segundos)…</span></pre>
<style>
  body { margin: 0; background: #0f1720; }
  #terminal { margin: 0; min-height: 100vh; padding: 14px 16px; box-sizing: border-box; color: #e6edf3;
    font: 14px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; white-space: pre-wrap; }
  .carregando { color: #8b98a5; }
  .erro { color: #ff8b80; }
</style>
<script src="${PYODIDE}pyodide.js"></script>
<script>
  const CODIGO = ${comoJson(codigo)};
  const terminal = document.getElementById('terminal');
  const escrever = (texto, classe) => {
    const linha = document.createElement('span');
    if (classe) linha.className = classe;
    linha.textContent = texto + '\\n';
    terminal.append(linha);
  };
  window.__saida = window.__saida || [];
  window.__pronto = loadPyodide({ indexURL: '${PYODIDE}' }).then(async py => {
    window.__py = py;
    terminal.replaceChildren();
    py.setStdout({ batched: texto => { window.__saida.push(texto); escrever(texto); } });
    py.setStderr({ batched: texto => escrever(texto, 'erro') });
    try {
      // Bibliotecas que não vêm com o Python (pandas, numpy) são baixadas na primeira vez que aparecem num import
      // (sem os avisos de "Loading...", que iriam para o console e para a __saida que os testes leem)
      await py.loadPackagesFromImports(CODIGO, { messageCallback: () => {} });
      // O pandas avisa, a cada import, que vai exigir o pyarrow no futuro: um aviso em vermelho que só confunde
      py.runPython('import warnings\\nwarnings.filterwarnings("ignore", message="(?s).*Pyarrow", category=DeprecationWarning)');
      await py.runPythonAsync(CODIGO);
      if (!terminal.childNodes.length) escrever('(o programa rodou sem imprimir nada)', 'carregando');
    } catch (erro) {
      // Mostra só o fim do traceback, que é a parte que interessa (o começo são linhas internas do Pyodide)
      const linhas = String(erro.message).trim().split('\\n');
      const inicio = linhas.findIndex(l => l.includes('File "<exec>"'));
      window.__erro = linhas.at(-1);
      escrever(linhas.slice(inicio >= 0 ? inicio : -1).join('\\n'), 'erro');
    }
  });
</script>`;
}

// ---------- React ----------
// O código é um módulo como o main.jsx de um projeto com Vite: import de 'react' e 'react-dom/client', JSX e
// createRoot(...).render(...). O Babel converte para JavaScript comum e o require falso entrega o React.
function react(codigo) {
  return `<div id="root"></div>
<script src="${REACT}"></script>
<script src="${REACT_DOM}"></script>
<script src="${BABEL}"></script>
<script>
  window.__pronto = new Promise(pronto => {
    const modulos = { react: React, 'react-dom': ReactDOM, 'react-dom/client': ReactDOM };
    const require = nome => {
      if (nome in modulos) return modulos[nome];
      throw new Error('Neste editor só dá para importar react e react-dom/client (pediu "' + nome + '").');
    };
    try {
      const js = Babel.transform(${comoJson(codigo)}, {
        presets: [['react', { runtime: 'classic' }]],
        plugins: ['transform-modules-commonjs'],
        filename: 'main.jsx'
      }).code;
      new Function('require', 'module', 'exports', 'React', js)(require, { exports: {} }, {}, React);
    } catch (erro) {
      console.error(erro.message);
    }
    setTimeout(pronto, 50);
  });
</script>`;
}

// ---------- Vários arquivos com import/export ----------
// Cada arquivo vira um Blob com URL própria. Os './nome.js' do código são trocados por essas URLs, começando pelos
// arquivos que não importam nenhum outro.
function modulos(codigo) {
  const { pagina, arquivos } = separarArquivos(codigo);
  const urls = {};
  const trocar = texto =>
    texto.replace(/(['"])\.\/([\w.-]+\.js)\1/g, (todo, aspas, nome) =>
      urls[nome] ? aspas + urls[nome] + aspas : todo
    );
  const dependencias = nome => [...arquivos[nome].matchAll(/['"]\.\/([\w.-]+\.js)['"]/g)].map(m => m[1]);
  let faltam = Object.keys(arquivos);
  while (faltam.length) {
    const prontos = faltam.filter(nome =>
      dependencias(nome).every(dep => urls[dep] || !(dep in arquivos) || dep === nome)
    );
    // Importação circular: cria os que sobraram assim mesmo (o navegador mostra o erro)
    for (const nome of prontos.length ? prontos : faltam) {
      urls[nome] = URL.createObjectURL(new Blob([trocar(arquivos[nome])], { type: 'text/javascript' }));
    }
    faltam = faltam.filter(nome => !urls[nome]);
  }
  // __arquivos: o código de cada arquivo, para os testes conferirem os import e export
  return `<script>
  window.__arquivos = ${comoJson(arquivos)};
  window.__pronto = new Promise(pronto => addEventListener('load', () => setTimeout(pronto, 50)));
  addEventListener('error', e => {
    if (e.target !== window && e.target.tagName === 'SCRIPT') console.error('Não foi possível carregar um módulo. Confira os nomes dos arquivos nos import.');
  }, true);
</script>
${trocar(pagina)}`;
}

// ---------- Playwright ----------
// A página fica na primeira parte e o teste no arquivo "// --- nome.spec.js ---". Um Playwright de mentira, com as
// partes mais usadas da API de verdade (getByRole, getByLabel, fill, click, expect...), roda o teste na própria página.
const MINI_PLAYWRIGHT = String.raw`
(() => {
  const ESPERA = 1000;
  const dormir = ms => new Promise(r => setTimeout(r, ms));
  const visivel = el => !!el && el.isConnected && !el.closest('[hidden]') && getComputedStyle(el).visibility !== 'hidden' && el.getClientRects().length > 0;
  const PAPEIS = { A: 'link', BUTTON: 'button', H1: 'heading', H2: 'heading', H3: 'heading', H4: 'heading', H5: 'heading', H6: 'heading',
    UL: 'list', OL: 'list', LI: 'listitem', NAV: 'navigation', MAIN: 'main', TEXTAREA: 'textbox', SELECT: 'combobox',
    IMG: 'img', TABLE: 'table', TR: 'row', TD: 'cell', TH: 'columnheader', FORM: 'form', DIALOG: 'dialog', ARTICLE: 'article' };
  const papel = el => {
    if (el.getAttribute('role')) return el.getAttribute('role');
    if (el.tagName === 'A' && !el.hasAttribute('href')) return null;
    if (el.tagName === 'INPUT') {
      const tipo = (el.type || 'text').toLowerCase();
      return { checkbox: 'checkbox', radio: 'radio', button: 'button', submit: 'button', reset: 'button', range: 'slider', number: 'spinbutton' }[tipo] || (tipo === 'hidden' ? null : 'textbox');
    }
    return PAPEIS[el.tagName] || null;
  };
  // innerText deixa de fora o conteúdo de <script> e <style>, como o Playwright de verdade
  const textoDe = el => (el.innerText ?? el.textContent ?? '').replace(/\s+/g, ' ').trim();
  const nomeAcessivel = el => {
    if (el.getAttribute('aria-label')) return el.getAttribute('aria-label').trim();
    if (el.getAttribute('aria-labelledby')) return el.getAttribute('aria-labelledby').split(' ').map(id => textoDe(document.getElementById(id) || document.createElement('i'))).join(' ').trim();
    if (el.labels && el.labels.length) return textoDe(el.labels[0]);
    if (el.tagName === 'IMG') return el.alt || '';
    if (el.tagName === 'INPUT' && ['submit', 'button', 'reset'].includes(el.type)) return el.value;
    if (['textbox', 'combobox', 'checkbox', 'radio', 'slider', 'spinbutton'].includes(papel(el))) return el.placeholder || el.title || '';
    return textoDe(el) || el.title || '';
  };
  const combina = (texto, alvo, exato) => alvo instanceof RegExp ? alvo.test(texto) : exato ? texto === alvo : texto.toLowerCase().includes(String(alvo).toLowerCase());
  const descrever = r => r.descricao;

  class Locator {
    constructor(buscar, descricao) { this.buscar = buscar; this.descricao = descricao; }
    todos() { return this.buscar(); }
    _filho(buscarDentro, descricao) {
      return new Locator(() => this.todos().flatMap(raiz => buscarDentro(raiz)), this.descricao + '.' + descricao);
    }
    getByRole(p, o) { return this._filho(raiz => porPapel(raiz, p, o), 'getByRole(' + JSON.stringify(p) + ')'); }
    getByText(t, o) { return this._filho(raiz => porTexto(raiz, t, o), 'getByText(' + t + ')'); }
    getByLabel(t, o) { return this._filho(raiz => porRotulo(raiz, t, o), 'getByLabel(' + t + ')'); }
    getByPlaceholder(t, o) { return this._filho(raiz => [...raiz.querySelectorAll('[placeholder]')].filter(el => combina(el.placeholder, t, o && o.exact)), 'getByPlaceholder(' + t + ')'); }
    getByTestId(id) { return this._filho(raiz => [...raiz.querySelectorAll('[data-testid="' + id + '"]')], 'getByTestId(' + id + ')'); }
    locator(css) { return this._filho(raiz => [...raiz.querySelectorAll(css)], 'locator(' + css + ')'); }
    first() { return new Locator(() => this.todos().slice(0, 1), this.descricao + '.first()'); }
    last() { return new Locator(() => this.todos().slice(-1), this.descricao + '.last()'); }
    nth(i) { return new Locator(() => this.todos().slice(i, i + 1), this.descricao + '.nth(' + i + ')'); }
    filter({ hasText, hasNotText } = {}) {
      return new Locator(() => this.todos().filter(el => (hasText === undefined || combina(textoDe(el), hasText)) && (hasNotText === undefined || !combina(textoDe(el), hasNotText))), this.descricao + '.filter()');
    }
    async _um() {
      const fim = Date.now() + ESPERA;
      for (;;) {
        const achados = this.todos();
        if (achados.length === 1) return achados[0];
        if (Date.now() > fim) {
          throw new Error(achados.length ? descrever(this) + ' achou ' + achados.length + ' elementos (precisa ser 1). Use um nome mais exato, .first() ou .filter().' : descrever(this) + ' não achou nenhum elemento.');
        }
        await dormir(30);
      }
    }
    async click() { const el = await this._um(); el.click(); await dormir(20); }
    async fill(valor) {
      const el = await this._um();
      el.focus(); el.value = valor;
      el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
      await dormir(20);
    }
    async press(tecla) {
      const el = await this._um();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: tecla, bubbles: true }));
      if (tecla === 'Enter' && el.form) el.form.requestSubmit();
      el.dispatchEvent(new KeyboardEvent('keyup', { key: tecla, bubbles: true }));
      await dormir(20);
    }
    async check() { const el = await this._um(); if (!el.checked) el.click(); await dormir(20); }
    async uncheck() { const el = await this._um(); if (el.checked) el.click(); await dormir(20); }
    async selectOption(valor) {
      const el = await this._um();
      el.value = valor; el.dispatchEvent(new Event('change', { bubbles: true })); await dormir(20);
    }
    async textContent() { return (await this._um()).textContent; }
    async innerText() { return textoDe(await this._um()); }
    async inputValue() { return (await this._um()).value; }
    async isVisible() { const achados = this.todos(); return achados.length > 0 && visivel(achados[0]); }
    async count() { return this.todos().length; }
  }

  const porPapel = (raiz, p, { name, exact, level } = {}) => [...raiz.querySelectorAll('*')].filter(el =>
    papel(el) === p && visivel(el) && (name === undefined || combina(nomeAcessivel(el), name, exact)) &&
    (level === undefined || el.tagName === 'H' + level));
  const porTexto = (raiz, t, { exact } = {}) => {
    const todos = [...raiz.querySelectorAll('*')].filter(el => visivel(el) && combina(textoDe(el), t, exact));
    // Fica com o elemento mais interno que tem o texto (como o Playwright faz)
    return todos.filter(el => !todos.some(outro => outro !== el && el.contains(outro)));
  };
  const porRotulo = (raiz, t, { exact } = {}) => [...raiz.querySelectorAll('input, textarea, select')].filter(el =>
    combina((el.labels && el.labels[0] ? textoDe(el.labels[0]) : el.getAttribute('aria-label') || ''), t, exact));

  const raizDocumento = () => [document];
  const page = {
    async goto() {},
    async title() { return document.title; },
    getByRole: (p, o) => new Locator(() => porPapel(document, p, o), 'getByRole(' + JSON.stringify(p) + (o && o.name ? ', { name: ' + JSON.stringify(String(o.name)) + ' }' : '') + ')'),
    getByText: (t, o) => new Locator(() => porTexto(document, t, o), 'getByText(' + JSON.stringify(String(t)) + ')'),
    getByLabel: (t, o) => new Locator(() => porRotulo(document, t, o), 'getByLabel(' + JSON.stringify(String(t)) + ')'),
    getByPlaceholder: (t, o) => new Locator(raizDocumento, 'page').getByPlaceholder(t, o),
    getByTestId: id => new Locator(raizDocumento, 'page').getByTestId(id),
    locator: css => new Locator(() => [...document.querySelectorAll(css)], 'locator(' + JSON.stringify(css) + ')'),
    keyboard: { async press(tecla) { const el = document.activeElement; el.dispatchEvent(new KeyboardEvent('keydown', { key: tecla, bubbles: true })); if (tecla === 'Enter' && el.form) el.form.requestSubmit(); await dormir(20); } }
  };

  const expect = (alvo, mensagem) => {
    const montar = negado => {
      const conferir = async (ok, texto) => {
        const fim = Date.now() + (alvo instanceof Locator || alvo === page ? ESPERA : 0);
        for (;;) {
          let passou = false;
          try { passou = (await ok()) !== negado; } catch { passou = false; }
          if (passou) return;
          if (Date.now() >= fim) throw new Error((mensagem ? mensagem + ': ' : '') + (negado ? 'não era para ' : '') + texto());
          await dormir(30);
        }
      };
      const textoAtual = async () => alvo.todos().map(textoDe).join(' | ');
      return {
        toBeVisible: () => conferir(async () => alvo.todos().length === 1 && visivel(alvo.todos()[0]), () => descrever(alvo) + ' estar visível'),
        toBeHidden: () => conferir(async () => !alvo.todos().some(visivel), () => descrever(alvo) + ' estar escondido'),
        toHaveText: esperado => conferir(async () => combina(await textoAtual(), esperado, !(esperado instanceof RegExp)), () => descrever(alvo) + ' ter o texto ' + esperado),
        toContainText: esperado => conferir(async () => combina(await textoAtual(), esperado), () => descrever(alvo) + ' conter o texto ' + esperado),
        toHaveValue: esperado => conferir(async () => combina(alvo.todos()[0].value, esperado, !(esperado instanceof RegExp)), () => descrever(alvo) + ' ter o valor ' + esperado),
        toHaveCount: n => conferir(async () => alvo.todos().length === n, () => descrever(alvo) + ' achar ' + n + ' elemento(s), achou ' + alvo.todos().length),
        toBeChecked: () => conferir(async () => alvo.todos()[0].checked === true, () => descrever(alvo) + ' estar marcado'),
        toBeDisabled: () => conferir(async () => alvo.todos()[0].disabled === true, () => descrever(alvo) + ' estar desabilitado'),
        toBeEnabled: () => conferir(async () => alvo.todos()[0].disabled === false, () => descrever(alvo) + ' estar habilitado'),
        toHaveClass: esperado => conferir(async () => combina(alvo.todos()[0].className, esperado), () => descrever(alvo) + ' ter a classe ' + esperado),
        toHaveTitle: esperado => conferir(async () => combina(document.title, esperado, !(esperado instanceof RegExp)), () => 'o título ser ' + esperado),
        toBe: esperado => conferir(async () => Object.is(alvo, esperado), () => 'ser ' + JSON.stringify(esperado) + ' (veio ' + JSON.stringify(alvo) + ')'),
        toEqual: esperado => conferir(async () => JSON.stringify(alvo) === JSON.stringify(esperado), () => 'ser igual a ' + JSON.stringify(esperado) + ' (veio ' + JSON.stringify(alvo) + ')'),
        toBeTruthy: () => conferir(async () => !!alvo, () => 'ser verdadeiro (veio ' + JSON.stringify(alvo) + ')'),
        toContain: esperado => conferir(async () => alvo.includes(esperado), () => 'conter ' + JSON.stringify(esperado))
      };
    };
    const asserts = montar(false);
    asserts.not = montar(true);
    return asserts;
  };

  const testes = [];
  const antes = [];
  const test = (nome, fn) => testes.push({ nome, fn });
  test.beforeEach = fn => antes.push(fn);
  test.describe = (nome, fn) => fn();
  test.skip = () => {};
  window.__testes = [];
  window.__rodarTestes = async () => {
    if (!testes.length) console.warn('Nenhum test(...) encontrado no arquivo de teste.');
    for (const t of testes) {
      const inicio = performance.now();
      try {
        for (const fn of antes) await fn({ page });
        await t.fn({ page });
        window.__testes.push({ nome: t.nome, passou: true });
        console.log('✓ ' + t.nome + ' (' + Math.round(performance.now() - inicio) + ' ms)');
      } catch (erro) {
        window.__testes.push({ nome: t.nome, passou: false, erro: erro.message });
        console.error('✗ ' + t.nome + ': ' + erro.message);
      }
    }
    const ok = window.__testes.filter(t => t.passou).length;
    if (testes.length) console.info(ok + ' de ' + testes.length + ' teste(s) passaram.');
  };
  window.__playwright = { test, expect, page };
})();`;

function playwright(codigo) {
  const { pagina, arquivos } = separarArquivos(codigo);
  const nomeDoTeste = Object.keys(arquivos).find(nome => nome.endsWith('.spec.js'));
  // import { test, expect } from '@playwright/test' vira uma desestruturação do mini Playwright
  const teste = (nomeDoTeste ? arquivos[nomeDoTeste] : '').replace(
    /import\s*\{([^}]*)\}\s*from\s*['"]@playwright\/test['"];?/g,
    'const {$1} = window.__playwright;'
  );
  return `${pagina}
<script>${MINI_PLAYWRIGHT}</script>
<script>
  window.__pronto = new Promise(pronto => addEventListener('load', async () => {
    try {
      await new Function(${comoJson(`return (async () => {\n${teste}\n})();`)})();
      await window.__rodarTestes();
    } catch (erro) {
      console.error(erro.message);
    }
    pronto();
  }));
</script>`;
}

// ---------- YAML (GitHub Actions) ----------
// Lê o YAML com o js-yaml e mostra o workflow como o GitHub entenderia: gatilhos, jobs e passos
function yaml(codigo) {
  return `<div id="resultado"></div>
<style>
  .erro { color: #b42318; font-weight: 600; white-space: pre-wrap; }
  .job { border: 1px solid #c5ced6; border-radius: 10px; padding: 10px 14px; margin: 10px 0; }
  .job h3 { margin: 0 0 4px; font-size: 15px; }
  .rotulo { color: #66737f; font-size: 13px; }
  ol { margin: 6px 0 0; padding-left: 22px; }
  code { background: #eef2f5; padding: 1px 5px; border-radius: 4px; }
</style>
<script src="${JS_YAML}"></script>
<script>
  const saida = document.getElementById('resultado');
  const el = (tag, texto, classe) => Object.assign(document.createElement(tag), { textContent: texto, className: classe || '' });
  window.__pronto = Promise.resolve();
  try {
    const wf = (window.__yaml = jsyaml.load(${comoJson(codigo)}));
    if (!wf || typeof wf !== 'object') throw new Error('O arquivo está vazio ou não é um mapa de chaves.');
    saida.append(el('h2', wf.name || '(workflow sem name)'));
    const on = wf.on ?? wf[true];
    const gatilhos = typeof on === 'string' ? [on] : Array.isArray(on) ? on : Object.keys(on || {});
    saida.append(el('p', 'Roda quando: ' + (gatilhos.join(', ') || '(nenhum gatilho em on)'), 'rotulo'));
    for (const [id, job] of Object.entries(wf.jobs || {})) {
      const caixa = el('div', '', 'job');
      caixa.append(el('h3', 'Job ' + id + (job.name ? ' · ' + job.name : '')));
      caixa.append(el('p', 'Máquina: ' + (job['runs-on'] || '(falta runs-on)') + (job.needs ? ' · depois de: ' + [].concat(job.needs).join(', ') : ''), 'rotulo'));
      const passos = el('ol');
      for (const passo of job.steps || []) {
        const li = el('li', (passo.name ? passo.name + ': ' : ''));
        li.append(el('code', passo.uses ? 'uses ' + passo.uses : 'run ' + String(passo.run || '').trim()));
        passos.append(li);
      }
      caixa.append(passos);
      saida.append(caixa);
    }
  } catch (erro) {
    window.__erro = erro.message;
    saida.append(el('p', 'O YAML não é válido: ' + erro.message, 'erro'));
  }
</script>`;
}

// ---------- TypeScript ----------
// O compilador de verdade confere os tipos (modo strict) e mostra os erros como o tsc mostraria; depois o código,
// sem os tipos, roda como um <script> comum, mesmo com erro de tipo (o tsc também gera o JavaScript nesse caso).
// Em vez da lib.dom inteira (pesada), um arquivo pequeno declara console, setTimeout e fetch.
// Para os testes: __erros (os erros de tipo), __codigo (o texto original) e __checar(trecho), que confere o código com
// um trecho a mais no fim e devolve os erros (serve para ver se uma chamada errada é barrada).
const TYPESCRIPT = 'https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/';
const LIBS_TS = [
  'es5',
  'es2015.core',
  'es2015.collection',
  'es2015.iterable',
  'es2015.generator',
  'es2015.promise',
  'es2015.proxy',
  'es2015.reflect',
  'es2015.symbol',
  'es2015.symbol.wellknown',
  'es2016.array.include',
  'es2017.object',
  'es2017.string',
  'es2018.promise',
  'es2019.array',
  'es2019.object',
  'es2019.string',
  'es2020.intl',
  'es2020.string',
  'es2020.symbol.wellknown',
  'es2021.promise',
  'es2021.string',
  'es2022.array',
  'es2022.object',
  'es2022.error',
  'es2023.array',
  'decorators',
  'decorators.legacy'
];
const GLOBAIS_TS = `
declare var console: { log(...dados: any[]): void; info(...dados: any[]): void; warn(...dados: any[]): void;
  error(...dados: any[]): void; table(dados: any): void };
declare function setTimeout(funcao: () => void, ms?: number): number;
declare function clearTimeout(id: number | undefined): void;
interface Response { ok: boolean; status: number; json(): Promise<any>; text(): Promise<string> }
declare function fetch(url: string, opcoes?: { method?: string; headers?: Record<string, string>; body?: string }): Promise<Response>;
declare var document: any;
`;

function typescript(codigo) {
  return `<div id="tipos"><p class="carregando">Carregando o TypeScript…</p></div>
<style>
  #tipos { font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  .carregando { color: #66737f; }
  .ok { color: #0b7a6f; font-weight: 600; }
  .erro { color: #b42318; margin: 0 0 6px; white-space: pre-wrap; }
</style>
<script src="${TYPESCRIPT}typescript.js"></script>
<script>
  const CODIGO = ${comoJson(codigo)};
  const LIBS = ${comoJson(LIBS_TS.map(nome => `lib.${nome}.d.ts`))};
  const caixa = document.getElementById('tipos');
  window.__codigo = CODIGO;
  window.__erros = [];
  window.__pronto = (async () => {
    const textos = { 'globais.d.ts': ${comoJson(GLOBAIS_TS)} };
    await Promise.all(LIBS.map(async nome => {
      textos[nome] = await (await fetch('${TYPESCRIPT}' + nome)).text();
    }));
    const opcoes = { target: ts.ScriptTarget.ES2022, strict: true, noLib: true, noEmit: true, types: [] };
    const arquivosFixos = {};
    for (const nome in textos) arquivosFixos[nome] = ts.createSourceFile(nome, textos[nome], ts.ScriptTarget.ES2022);
    const conferir = texto => {
      const principal = ts.createSourceFile('main.ts', texto, ts.ScriptTarget.ES2022, true);
      const achar = nome => (nome = nome.replace(/^\\//, '')) === 'main.ts' ? principal : arquivosFixos[nome];
      const host = {
        getSourceFile: achar,
        getDefaultLibFileName: () => 'lib.es5.d.ts',
        writeFile: () => {},
        getCurrentDirectory: () => '/',
        getDirectories: () => [],
        fileExists: nome => !!achar(nome),
        readFile: () => undefined,
        getCanonicalFileName: nome => nome,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => '\\n'
      };
      const programa = ts.createProgram(['main.ts', ...Object.keys(textos)], opcoes, host);
      // Só os erros do código da pessoa (os das bibliotecas internas não interessam)
      return ts.getPreEmitDiagnostics(programa).filter(d => d.file === principal).map(d => ({
        linha: principal.getLineAndCharacterOfPosition(d.start).line + 1,
        codigo: d.code,
        mensagem: ts.flattenDiagnosticMessageText(d.messageText, '\\n')
      }));
    };
    window.__checar = trecho => conferir(CODIGO + '\\n' + trecho);
    window.__erros = conferir(CODIGO);
    caixa.replaceChildren();
    if (!window.__erros.length) {
      caixa.append(Object.assign(document.createElement('p'), { className: 'ok', textContent: '✓ Sem erros de tipo' }));
    }
    for (const erro of window.__erros) {
      caixa.append(Object.assign(document.createElement('p'), { className: 'erro', textContent: 'Linha ' + erro.linha + ': ' + erro.mensagem }));
    }
    // Roda o JavaScript gerado num <script>, para as funções e constantes ficarem visíveis aos testes
    const js = ts.transpileModule(CODIGO, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
    const script = document.createElement('script');
    script.textContent = js;
    document.body.append(script);
    await new Promise(r => setTimeout(r, 30));
  })().catch(erro => console.error(erro.message));
</script>`;
}

// Quanto esperar depois da última tecla para rodar de novo: Python, React e TypeScript carregam bibliotecas grandes
export const ATRASO = { python: 900, react: 600, typescript: 900 };

export const AMBIENTES = { sql, python, react, modulos, playwright, yaml, typescript };
