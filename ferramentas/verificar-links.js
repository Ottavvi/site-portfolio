// Confere os links internos de todas as páginas: arquivo que não existe ou âncora (#id) que não existe na página
// Uso: node ferramentas/verificar-links.js   (sai com erro se achar algum problema; roda também no GitHub Actions)
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
// A 404 usa caminhos absolutos porque o GitHub Pages a mostra em qualquer endereço
const PREFIXO_ABSOLUTO = '/site-portfolio/';
const IGNORAR_PASTAS = new Set(['.git', 'node_modules', 'ferramentas']);
// Âncoras que não são elementos da página, e sim rotas lidas pelo JavaScript (abas da central de tempo e telas dos agentes)
const ROTAS_JS = {
  'projetos/cronometro/index.html': ['cronometro', 'temporizador', 'pomodoro'],
  'projetos/agente-financeiro/index.html': [
    'visao',
    'transacoes',
    'orcamentos',
    'previsao',
    'metas',
    'importar',
    'ajustes'
  ],
  'projetos/agente-contabil/index.html': [
    'painel',
    'lancamentos',
    'diario',
    'razao',
    'balancete',
    'dre',
    'balanco',
    'impostos',
    'obrigacoes',
    'importar',
    'ajustes'
  ]
};

function listarHtml(pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap(item => {
    const caminho = path.join(pasta, item.name);
    if (item.isDirectory()) return IGNORAR_PASTAS.has(item.name) ? [] : listarHtml(caminho);
    return item.name.endsWith('.html') ? [caminho] : [];
  });
}

const cacheIds = new Map();
function idsDaPagina(arquivo) {
  if (!cacheIds.has(arquivo)) {
    const html = fs.readFileSync(arquivo, 'utf8');
    cacheIds.set(arquivo, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
  }
  return cacheIds.get(arquivo);
}

const problemas = [];
let conferidos = 0;
for (const pagina of listarHtml(RAIZ)) {
  const html = fs.readFileSync(pagina, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const relativo = path.relative(RAIZ, pagina).replace(/\\/g, '/');
  for (const [, atributo, valor] of html.matchAll(/\s(href|src)="([^"]*)"/g)) {
    // Externos, e-mail, dados embutidos e valores montados por JavaScript ficam de fora
    if (/^(https?:|mailto:|tel:|data:|javascript:|\$\{)/.test(valor) || valor === '') continue;
    conferidos++;
    const [caminhoBruto, ancora] = valor.split('#');
    const caminho = decodeURIComponent(caminhoBruto.split('?')[0]);
    let destino = pagina;
    if (caminho) {
      destino = caminho.startsWith(PREFIXO_ABSOLUTO)
        ? path.join(RAIZ, caminho.slice(PREFIXO_ABSOLUTO.length))
        : path.resolve(path.dirname(pagina), caminho);
      if (fs.existsSync(destino) && fs.statSync(destino).isDirectory()) destino = path.join(destino, 'index.html');
      if (!fs.existsSync(destino)) {
        problemas.push(`${relativo}: ${atributo}="${valor}" aponta para um arquivo que não existe`);
        continue;
      }
    }
    const rotas = ROTAS_JS[path.relative(RAIZ, destino).replace(/\\/g, '/')] || [];
    if (ancora && destino.endsWith('.html') && !idsDaPagina(destino).has(ancora) && !rotas.includes(ancora)) {
      problemas.push(`${relativo}: ${atributo}="${valor}" aponta para #${ancora}, que não existe na página`);
    }
  }
}

if (problemas.length) {
  console.error(`✖ ${problemas.length} link(s) com problema:\n  ${problemas.join('\n  ')}`);
  process.exit(1);
}
console.log(`✔ ${conferidos} links internos conferidos, nenhum quebrado.`);
