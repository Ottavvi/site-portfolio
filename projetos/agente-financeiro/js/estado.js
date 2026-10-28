// Estado do app, guardado no navegador (localStorage). Nada sai do computador, a não ser que a pessoa ligue o
// modo Claude nos ajustes: aí as perguntas e os números que o agente consultar vão para a API da Anthropic.
import { CATEGORIAS_PADRAO, classificar, aprenderRegra } from './categorias.js';
import { gerarDemo } from './demo.js';

const CHAVE = 'agente-financeiro-v1';
const ouvintes = new Set();

function vazio() {
  return {
    versao: 1,
    nome: '',
    saldoInicial: 0,
    transacoes: [],
    categorias: structuredClone(CATEGORIAS_PADRAO),
    regras: [],
    metas: [],
    conversa: [],
    ajustes: { chaveApi: '', modelo: 'claude-sonnet-5-5', usarClaude: false },
    exemplo: false
  };
}

function ler() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo?.versao === 1)
      return {
        ...vazio(),
        ...salvo,
        ajustes: { ...vazio().ajustes, ...salvo.ajustes }
      };
  } catch {}
  return null;
}

function construirExemplo() {
  const demo = gerarDemo();
  const novo = vazio();
  novo.nome = demo.nome;
  novo.saldoInicial = demo.saldoInicial;
  novo.metas = demo.metas;
  novo.transacoes = demo.transacoes.map(t => ({
    ...t,
    categoria: classificar(t, [])
  }));
  novo.exemplo = true;
  return novo;
}

export const estado = ler() || construirExemplo();

function gravar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // Navegador sem espaço ou em modo privado: o app continua funcionando até fechar a aba
  }
}

// Avisa as telas que algo mudou e salva
export function mudou() {
  gravar();
  ouvintes.forEach(funcao => funcao());
}
export const aoMudar = funcao => ouvintes.add(funcao);

function substituir(novo) {
  const ajustes = estado.ajustes;
  Object.keys(estado).forEach(chave => delete estado[chave]);
  Object.assign(estado, novo, { ajustes });
}

export function carregarExemplo() {
  substituir(construirExemplo());
  mudou();
}

export function comecarDoZero() {
  substituir(vazio());
  mudou();
}

export const categoria = idCategoria =>
  estado.categorias.find(c => c.id === idCategoria) || estado.categorias.find(c => c.id === 'outros');

// Muda a categoria de uma transação e, se a pessoa quiser, de todas do mesmo estabelecimento (e aprende a regra)
export function mudarCategoria(transacao, novaCategoria, todasIguais = true) {
  estado.regras = aprenderRegra(estado.regras, transacao.descricao, novaCategoria);
  if (todasIguais) {
    estado.transacoes.forEach(t => {
      if (classificar(t, estado.regras) === novaCategoria && t.categoria !== novaCategoria && !t.manual)
        t.categoria = novaCategoria;
    });
  }
  transacao.categoria = novaCategoria;
  transacao.manual = true;
  mudou();
}

// Junta transações importadas, ignorando as que já existem (mesma data, valor e descrição)
export function importar(novas) {
  // Primeira importação de verdade: os dados de exemplo saem (a tela de importar avisa antes)
  if (estado.exemplo) substituir(vazio());
  const existentes = new Set(estado.transacoes.map(t => `${t.data}|${t.valor}|${t.descricao}`));
  let adicionadas = 0;
  for (const t of novas) {
    const chave = `${t.data}|${t.valor}|${t.descricao}`;
    if (existentes.has(chave)) continue;
    existentes.add(chave);
    estado.transacoes.push({ ...t, categoria: classificar(t, estado.regras) });
    adicionadas++;
  }
  estado.transacoes.sort((a, b) => a.data.localeCompare(b.data));
  mudou();
  return { adicionadas, repetidas: novas.length - adicionadas };
}

export function salvarBackup() {
  const { ajustes, ...resto } = estado;
  return JSON.stringify({ ...resto, ajustes: { ...ajustes, chaveApi: '' } }, null, 2);
}

export function restaurarBackup(texto) {
  const dados = JSON.parse(texto);
  if (dados.versao !== 1 || !Array.isArray(dados.transacoes))
    throw new Error('Este arquivo não é um backup do Agente Financeiro.');
  substituir({ ...vazio(), ...dados, exemplo: false });
  mudou();
}
