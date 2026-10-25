// Datas no formato "AAAA-MM-DD", sempre no fuso do próprio aparelho (nunca em UTC).

const DIAS_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function iso(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export const hojeISO = () => iso(new Date());

export function paraData(textoIso) {
  const [ano, mes, dia] = textoIso.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function somarDias(textoIso, dias) {
  const data = paraData(textoIso);
  data.setDate(data.getDate() + dias);
  return iso(data);
}

// Quantos dias de "de" até "ate" (negativo se "ate" já passou)
export function diasEntre(de, ate) {
  return Math.round((paraData(ate) - paraData(de)) / 86400000);
}

export const formatarCurta = textoIso => textoIso.split('-').reverse().slice(0, 2).join('/');

// Texto do prazo como aparece na tarefa: "Atrasada · 23/10", "Hoje", "Amanhã", "Sexta", "15/11"
export function rotuloPrazo(prazo, hora) {
  const dias = diasEntre(hojeISO(), prazo);
  const sufixo = hora ? ` · ${hora}` : '';
  if (dias < 0) return { texto: `Atrasada · ${formatarCurta(prazo)}${sufixo}`, classe: 'atrasada' };
  if (dias === 0) return { texto: `Hoje${sufixo}`, classe: 'hoje' };
  if (dias === 1) return { texto: `Amanhã${sufixo}`, classe: 'amanha' };
  if (dias < 7) {
    const nome = DIAS_SEMANA[paraData(prazo).getDay()];
    return { texto: nome.charAt(0).toUpperCase() + nome.slice(1) + sufixo, classe: 'semana' };
  }
  return { texto: formatarCurta(prazo) + sufixo, classe: '' };
}

// Seção da visão "Próximos dias" em que a tarefa aparece
export const GRUPOS = [
  ['atrasadas', 'Atrasadas'],
  ['hoje', 'Hoje'],
  ['amanha', 'Amanhã'],
  ['semana', 'Próximos 7 dias'],
  ['depois', 'Mais adiante'],
  ['sem-prazo', 'Sem prazo']
];
export function grupoDoPrazo(prazo) {
  if (!prazo) return 'sem-prazo';
  const dias = diasEntre(hojeISO(), prazo);
  if (dias < 0) return 'atrasadas';
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'amanha';
  if (dias < 7) return 'semana';
  return 'depois';
}

// Próxima data de uma tarefa repetida, a partir do prazo (ou de hoje, se não tiver prazo)
export function proximaData(prazo, repetir) {
  const base = prazo || hojeISO();
  if (repetir === 'diaria') return somarDias(base, 1);
  if (repetir === 'semanal') return somarDias(base, 7);
  if (repetir === 'dias-uteis') {
    let data = somarDias(base, 1);
    while ([0, 6].includes(paraData(data).getDay())) data = somarDias(data, 1);
    return data;
  }
  if (repetir === 'mensal') {
    const atual = paraData(base);
    const dia = atual.getDate();
    // 31/01 -> 28/02 (ou 29): usa o último dia do mês quando o dia não existe
    const ultimoDia = new Date(atual.getFullYear(), atual.getMonth() + 2, 0).getDate();
    return iso(new Date(atual.getFullYear(), atual.getMonth() + 1, Math.min(dia, ultimoDia)));
  }
  return null;
}

// Próxima data de um dia da semana, a partir de amanhã ("sexta" numa sexta = a da semana que vem)
export function proximoDiaDaSemana(indice) {
  let data = somarDias(hojeISO(), 1);
  while (paraData(data).getDay() !== indice) data = somarDias(data, 1);
  return data;
}

export { DIAS_SEMANA };
