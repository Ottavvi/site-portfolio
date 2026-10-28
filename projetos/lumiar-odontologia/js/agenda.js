// Motor de horários: gera a grade do dia, marca o que está ocupado e encontra os horários livres.
import { EQUIPE, TRATAMENTOS, EXPEDIENTE, ALMOCO, PASSO } from './dados.js';

const CHAVE = 'lumiar:consultas';

export function carregarConsultas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch {
    return [];
  }
}

export function salvarConsultas(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    /* navegador sem armazenamento: a consulta vale só nesta visita */
  }
}

export const tratamento = id => TRATAMENTOS.find(t => t.id === id);
export const profissional = id => EQUIPE.find(p => p.id === id);

export function isoDia(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function deIso(s) {
  const [a, m, d] = s.split('-').map(Number);
  return new Date(a, m - 1, d);
}

// Pseudoaleatório estável: a mesma data mostra sempre a mesma agenda "ocupada".
function sorte(texto) {
  let h = 2166136261;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 1000) / 1000;
}

function minutosDoDia(dia) {
  const exp = EXPEDIENTE[dia.getDay()];
  if (!exp) return [];
  const lista = [];
  for (let m = exp[0] * 60; m < exp[1] * 60; m += PASSO) {
    if (m >= ALMOCO[0] * 60 && m < ALMOCO[1] * 60) continue;
    lista.push(m);
  }
  return lista;
}

function ocupado(profId, iso, minuto, consultas) {
  if (sorte(`${profId}|${iso}|${minuto}`) < 0.42) return true;
  return consultas.some(c => {
    if (c.prof !== profId || c.dia !== iso) return false;
    const fim = c.minuto + Math.ceil(tratamento(c.trat).min / PASSO) * PASSO;
    return minuto >= c.minuto && minuto < fim;
  });
}

// Horários em que o profissional consegue atender o tratamento inteiro (blocos seguidos livres).
export function horariosLivres(tratId, profId, dia, consultas, agora = new Date()) {
  const trat = tratamento(tratId);
  const iso = isoDia(dia);
  const blocos = Math.ceil(trat.min / PASSO);
  const grade = minutosDoDia(dia);
  const profs = profId === 'qualquer' ? trat.profs : [profId];
  const hoje = isoDia(agora) === iso;
  const minAgora = agora.getHours() * 60 + agora.getMinutes() + 60; // pelo menos 1h de antecedência
  const saida = [];
  for (let i = 0; i < grade.length; i++) {
    const inicio = grade[i];
    if (hoje && inicio < minAgora) continue;
    const exp = EXPEDIENTE[dia.getDay()];
    if (inicio + trat.min > exp[1] * 60) continue;
    for (const p of profs) {
      if (!profissional(p).dias.includes(dia.getDay())) continue;
      let ok = true;
      for (let b = 0; b < blocos; b++) {
        const m = inicio + b * PASSO;
        if (grade[i + b] !== m || ocupado(p, iso, m, consultas)) {
          ok = false;
          break;
        }
      }
      if (ok) {
        saida.push({ minuto: inicio, prof: p });
        break;
      }
    }
  }
  return saida;
}

export function proximosLivres(tratId, quantos, consultas, agora = new Date()) {
  const saida = [];
  const d = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  for (let i = 0; i < 21 && saida.length < quantos; i++) {
    for (const h of horariosLivres(tratId, 'qualquer', d, consultas, agora)) {
      saida.push({ ...h, dia: isoDia(d) });
      if (saida.length >= quantos) break;
    }
    d.setDate(d.getDate() + 1);
  }
  return saida;
}

export const hora = m => `${Math.floor(m / 60)}h${m % 60 ? String(m % 60).padStart(2, '0') : ''}`;

const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function diaCurto(d) {
  return `${SEMANA[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]}`;
}

export function diaRelativo(d, agora = new Date()) {
  const a = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const dif = Math.round((d - a) / 86400000);
  if (dif === 0) return 'Hoje';
  if (dif === 1) return 'Amanhã';
  return diaCurto(d);
}
