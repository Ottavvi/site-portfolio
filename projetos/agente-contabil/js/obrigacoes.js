// Calendário de obrigações da empresa. Datas sem feriados (só fins de semana são ajustados): confirme na agenda
// tributária oficial ou com a contabilidade.
//   DAS (Simples e MEI): dia 20 do mês seguinte; se não for dia útil, vai para o próximo dia útil.
//   FGTS Digital: dia 20 do mês seguinte; se não for dia útil, é antecipado para o dia útil anterior.
//   DCTFWeb (empresas com empregados ou pró-labore): até o último dia útil do mês seguinte.
//   DEFIS (Simples): até 31 de março, sobre o ano anterior.
//   DASN-SIMEI (MEI): até 31 de maio, sobre o ano anterior.
import { apuracao } from './contabil.js';
import { diasNoMes, hojeISO, mesAnterior, mesDe, paraData, somarDias } from './util.js';

const fimDeSemana = iso => [0, 6].includes(paraData(iso).getDay());
function proximoDiaUtil(iso) {
  while (fimDeSemana(iso)) iso = somarDias(iso, 1);
  return iso;
}
function diaUtilAnterior(iso) {
  while (fimDeSemana(iso)) iso = somarDias(iso, -1);
  return iso;
}
const competencia = mes => `${mes.slice(5)}/${mes.slice(0, 4)}`;

export function obrigacoes(estado, dias = 60) {
  const hoje = hojeISO();
  const limite = somarDias(hoje, dias);
  const temFolha = estado.movimentos.some(m => ['salarios', 'prolabore'].includes(m.conta));
  const mei = estado.empresa.regime === 'mei';
  const lista = [];
  // Mês de competência = mês anterior ao vencimento
  for (let i = -1; i <= Math.ceil(dias / 28) + 1; i++) {
    const mesVencimento = mesAnterior(mesDe(hoje), -i);
    const comp = mesAnterior(mesVencimento);
    const ap = estado.movimentos.length ? apuracao(estado, comp) : null;
    lista.push({
      data: proximoDiaUtil(`${mesVencimento}-20`),
      nome: mei ? `DAS-MEI de ${competencia(comp)}` : `DAS do Simples Nacional de ${competencia(comp)}`,
      valor: ap?.das || null,
      detalhe: mei
        ? 'Valor fixo do MEI'
        : ap
          ? `Anexo ${ap.anexo}, alíquota efetiva de ${(ap.efetiva * 100).toFixed(2).replace('.', ',')}%`
          : '',
      tipo: 'imposto'
    });
    if (!mei && temFolha) {
      lista.push({
        data: diaUtilAnterior(`${mesVencimento}-20`),
        nome: `FGTS Digital de ${competencia(comp)}`,
        tipo: 'folha'
      });
      lista.push({
        data: diaUtilAnterior(`${mesVencimento}-${String(diasNoMes(mesVencimento)).padStart(2, '0')}`),
        nome: `DCTFWeb de ${competencia(comp)} (INSS da folha e do pró-labore)`,
        tipo: 'declaracao'
      });
    }
  }
  const ano = Number(hoje.slice(0, 4));
  for (const a of [ano, ano + 1]) {
    if (mei)
      lista.push({ data: `${a}-05-31`, nome: `DASN-SIMEI de ${a - 1} (declaração anual do MEI)`, tipo: 'declaracao' });
    else
      lista.push({ data: `${a}-03-31`, nome: `DEFIS de ${a - 1} (declaração anual do Simples)`, tipo: 'declaracao' });
  }
  return lista
    .filter(o => o.data >= hoje && o.data <= limite)
    .sort((a, b) => a.data.localeCompare(b.data))
    .map(o => ({ ...o, emDias: Math.round((paraData(o.data) - paraData(hoje)) / 86400000) }));
}
