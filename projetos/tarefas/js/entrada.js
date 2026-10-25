// Atalhos ao digitar uma tarefa nova: "Prova de cálculo sexta 14:00 !alta #faculdade *semanal"
import { DIAS_SEMANA, hojeISO, iso, proximoDiaDaSemana, somarDias } from './datas.js';
import { normalizar } from './estado.js';

const PRIORIDADES = { alta: 3, '!!!': 3, media: 2, '!!': 2, baixa: 1, '!': 1 };
const REPETICOES = {
  diaria: 'diaria',
  diario: 'diaria',
  'dias-uteis': 'dias-uteis',
  semanal: 'semanal',
  mensal: 'mensal'
};
const DIAS = DIAS_SEMANA.map(normalizar); // ['domingo', 'segunda', 'terca', ...]

// Devolve { texto, prazo, hora, prioridade, categoria (nome), repetir } e deixa no texto só o que sobrou
export function lerEntrada(entrada) {
  const resultado = { texto: '', prazo: null, hora: null, prioridade: 0, categoria: null, repetir: null };
  const sobra = [];

  for (const palavra of entrada.trim().split(/\s+/)) {
    const p = normalizar(palavra);
    if (p === 'hoje') resultado.prazo = hojeISO();
    else if (p === 'amanha') resultado.prazo = somarDias(hojeISO(), 1);
    else if (DIAS.includes(p)) resultado.prazo = proximoDiaDaSemana(DIAS.indexOf(p));
    else if (/^\d{1,2}\/\d{1,2}$/.test(p)) resultado.prazo = dataDoDiaMes(p) ?? resultado.prazo;
    else if (/^([01]?\d|2[0-3]):[0-5]\d$/.test(p)) resultado.hora = p.padStart(5, '0');
    else if (p.startsWith('!') && PRIORIDADES[p.slice(1)] !== undefined) resultado.prioridade = PRIORIDADES[p.slice(1)];
    else if (/^!{1,3}$/.test(p)) resultado.prioridade = PRIORIDADES[p];
    else if (palavra.length > 1 && palavra.startsWith('#')) resultado.categoria = palavra.slice(1).replace(/_/g, ' ');
    else if (p.startsWith('*') && REPETICOES[p.slice(1)]) resultado.repetir = REPETICOES[p.slice(1)];
    else sobra.push(palavra);
  }

  resultado.texto = sobra.join(' ');
  // Hora sem data: é para hoje
  if (resultado.hora && !resultado.prazo) resultado.prazo = hojeISO();
  return resultado;
}

// "25/12" -> o próximo 25 de dezembro (este ano ou o que vem, se já passou)
function dataDoDiaMes(texto) {
  const [dia, mes] = texto.split('/').map(Number);
  const hoje = new Date();
  let data = new Date(hoje.getFullYear(), mes - 1, dia);
  if (data.getMonth() !== mes - 1) return null; // 31/02 e parecidos
  if (iso(data) < hojeISO()) data = new Date(hoje.getFullYear() + 1, mes - 1, dia);
  return iso(data);
}
