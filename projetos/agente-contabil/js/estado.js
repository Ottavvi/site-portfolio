// Estado do app, salvo no navegador. versaoDados muda a cada alteração e invalida os cálculos guardados em cache.
import { limparCache } from './contabil.js';
import { EMPRESA_DEMO, gerarDemo } from './demo.js';
import { aprender, classificar, PLANO_PADRAO } from './plano.js';
import { hojeISO } from './util.js';

const CHAVE = 'agente-contabil-v1';
const ouvintes = new Set();

function vazio() {
  return {
    versao: 1,
    versaoDados: Date.now(),
    empresa: {
      ...EMPRESA_DEMO,
      nome: '',
      cnpj: '',
      atividade: '',
      capitalInicial: 0,
      inicio: hojeISO().slice(0, 8) + '01'
    },
    plano: structuredClone(PLANO_PADRAO),
    movimentos: [],
    regras: [],
    conversa: [],
    ajustes: { chaveApi: '', modelo: 'claude-sonnet-5-5', usarClaude: false },
    exemplo: false
  };
}

function construirExemplo() {
  const demo = gerarDemo();
  return { ...vazio(), empresa: demo.empresa, movimentos: demo.movimentos, exemplo: true, versaoDados: Date.now() };
}

function ler() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo?.versao === 1) return { ...vazio(), ...salvo, ajustes: { ...vazio().ajustes, ...salvo.ajustes } };
  } catch {}
  return null;
}

export const estado = ler() || construirExemplo();

export function mudou() {
  estado.versaoDados = Date.now() + Math.random();
  limparCache();
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {}
  ouvintes.forEach(f => f());
}
export const aoMudar = f => ouvintes.add(f);

function substituir(novo) {
  const ajustes = estado.ajustes;
  Object.keys(estado).forEach(k => delete estado[k]);
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

export const contaDe = id => estado.plano.find(c => c.id === id);

// Muda a conta de um movimento; com todosIguais, aplica aos outros do mesmo lugar e aprende a regra
export function reclassificar(movimento, novaConta, todosIguais = true) {
  const antes = movimento.conta;
  estado.regras = aprender(estado.regras, movimento, novaConta);
  let alterados = 1;
  movimento.conta = novaConta;
  movimento.manual = true;
  if (todosIguais) {
    for (const m of estado.movimentos) {
      if (m === movimento || m.manual) continue;
      if (classificar(m, estado.regras, estado.plano) === novaConta && m.conta !== novaConta) {
        m.conta = novaConta;
        alterados++;
      }
    }
  }
  mudou();
  return { antes, alterados };
}

export function importar(novos) {
  if (estado.exemplo) {
    const empresa = { ...vazio().empresa, inicio: novos.map(n => n.data).sort()[0] };
    substituir({ ...vazio(), empresa });
  }
  const existentes = new Set(estado.movimentos.map(m => `${m.data}|${m.valor}|${m.descricao}`));
  let adicionados = 0;
  for (const m of novos) {
    const k = `${m.data}|${m.valor}|${m.descricao}`;
    if (existentes.has(k)) continue;
    existentes.add(k);
    estado.movimentos.push({ ...m, conta: classificar(m, estado.regras, estado.plano) });
    adicionados++;
  }
  estado.movimentos.sort((a, b) => a.data.localeCompare(b.data));
  if (!estado.empresa.inicio || estado.movimentos[0]?.data < estado.empresa.inicio)
    estado.empresa.inicio = estado.movimentos[0]?.data.slice(0, 8) + '01';
  mudou();
  return { adicionados, repetidos: novos.length - adicionados };
}

export function salvarBackup() {
  return JSON.stringify({ ...estado, ajustes: { ...estado.ajustes, chaveApi: '' } }, null, 2);
}
export function restaurarBackup(texto) {
  const dados = JSON.parse(texto);
  if (dados.versao !== 1 || !Array.isArray(dados.movimentos))
    throw new Error('Este arquivo não é um backup do Agente Contábil.');
  substituir({ ...vazio(), ...dados, exemplo: false });
  mudou();
}
