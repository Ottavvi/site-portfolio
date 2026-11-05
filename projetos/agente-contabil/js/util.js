// Funções pequenas usadas em todo o app: dinheiro, datas, textos e HTML seguro

const MOEDA = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
const MOEDA_CURTA = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0
});
const NUMERO = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
const PORCENTO = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  maximumFractionDigits: 0
});

export const dinheiro = valor => MOEDA.format(valor || 0);
export const dinheiroCurto = valor => MOEDA_CURTA.format(Math.round(valor || 0));
export const numero = valor => NUMERO.format(valor || 0);
export const porcento = valor => PORCENTO.format(Number.isFinite(valor) ? valor : 0);

// Datas sempre como texto AAAA-MM-DD (sem fuso), que ordena certo e compara com < e >
export const hojeISO = () => new Date().toLocaleDateString('sv-SE');
export const paraData = iso => new Date(`${iso}T12:00:00`);
export const paraISO = data => data.toLocaleDateString('sv-SE');
export function somarDias(iso, dias) {
  const data = paraData(iso);
  data.setDate(data.getDate() + dias);
  return paraISO(data);
}
export function somarMeses(iso, meses) {
  const data = paraData(iso);
  const dia = data.getDate();
  data.setDate(1);
  data.setMonth(data.getMonth() + meses);
  const ultimo = new Date(data.getFullYear(), data.getMonth() + 1, 0).getDate();
  data.setDate(Math.min(dia, ultimo));
  return paraISO(data);
}
export const mesDe = iso => iso.slice(0, 7); // "2026-10"
export const diasNoMes = mes => new Date(Number(mes.slice(0, 4)), Number(mes.slice(5, 7)), 0).getDate();
export const diasEntre = (a, b) => Math.round((paraData(b) - paraData(a)) / 86400000);

const NOMES_MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro'
];
export const nomeDoMes = mes => NOMES_MESES[Number(mes.slice(5, 7)) - 1];
export const mesPorExtenso = mes => `${nomeDoMes(mes)} de ${mes.slice(0, 4)}`;
export const mesCurto = mes => `${nomeDoMes(mes).slice(0, 3)}/${mes.slice(2, 4)}`;
export const indiceDoMes = nome => NOMES_MESES.findIndex(m => normalizar(m).startsWith(normalizar(nome).slice(0, 3)));
export const dataCurta = iso =>
  paraData(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });
export const dataLonga = iso =>
  paraData(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
export function mesAnterior(mes, quantos = 1) {
  return somarMeses(`${mes}-01`, -quantos).slice(0, 7);
}

// Texto sem acento e em minúsculas, para comparar e buscar
export const normalizar = texto =>
  String(texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

// Nome do estabelecimento sem números, datas e códigos do banco ("PIX ENVIADO 12/10 MERCADINHO 123" -> "mercadinho")
export function chaveDoEstabelecimento(descricao) {
  return normalizar(descricao)
    .replace(
      /\b(pix|ted|doc|compra|cartao|credito|debito|pagamento|pagto|enviado|recebido|transferencia|parcela|boleto|deb|aut|elo|visa|master)\b/g,
      ' '
    )
    .replace(/[0-9*#/\\.:,-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .slice(0, 3)
    .join(' ');
}

export const id = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

// Escapa texto para entrar em HTML montado com template string
export const html = texto =>
  String(texto ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

export const somar = (lista, campo = v => v) => lista.reduce((total, item) => total + campo(item), 0);
export const media = lista => (lista.length ? somar(lista) / lista.length : 0);
export function mediana(lista) {
  if (!lista.length) return 0;
  const ordenada = [...lista].sort((a, b) => a - b);
  const meio = Math.floor(ordenada.length / 2);
  return ordenada.length % 2 ? ordenada[meio] : (ordenada[meio - 1] + ordenada[meio]) / 2;
}
export function desvio(lista) {
  if (lista.length < 2) return 0;
  const m = media(lista);
  return Math.sqrt(somar(lista, v => (v - m) ** 2) / (lista.length - 1));
}
export const agrupar = (lista, chave) =>
  lista.reduce((grupos, item) => {
    const k = chave(item);
    (grupos[k] ||= []).push(item);
    return grupos;
  }, {});

// Lê um valor em reais escrito de vários jeitos: "1.234,56", "1234.56", "-R$ 10,00", "(10,00)"
export function lerValor(texto) {
  if (typeof texto === 'number') return texto;
  let t = String(texto || '').trim();
  if (!t) return NaN;
  const negativo = /^\(.*\)$/.test(t) || /^-|-$/.test(t.replace(/\s/g, '')) || /\bD$/i.test(t);
  t = t.replace(/[^\d.,]/g, '');
  if (t.includes(',') && t.includes('.')) {
    t = t.lastIndexOf(',') > t.lastIndexOf('.') ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, '');
  } else if (t.includes(',')) {
    t = t.replace(',', '.');
  } else if ((t.match(/\./g) || []).length > 1) {
    t = t.replace(/\./g, '');
  }
  const valor = Number(t);
  return negativo ? -Math.abs(valor) : valor;
}

// Lê datas "31/12/2026", "31/12/26", "2026-12-31" ou "20261231" e devolve AAAA-MM-DD
export function lerData(texto) {
  const t = String(texto || '').trim();
  let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^(\d{4})(\d{2})(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/);
  if (m) {
    const ano = m[3].length === 2 ? `20${m[3]}` : m[3];
    return `${ano}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  }
  return null;
}

// ---------- Perguntas digitadas com pressa ----------
// Abreviações comuns de quem digita no celular
const ABREVIACOES = {
  q: 'que',
  oq: 'o que',
  qto: 'quanto',
  qnto: 'quanto',
  qnt: 'quanto',
  qt: 'quanto',
  qts: 'quantos',
  vc: 'voce',
  tb: 'tambem',
  tbm: 'tambem',
  pq: 'porque',
  mt: 'muito',
  mto: 'muito',
  msm: 'mesmo',
  td: 'tudo',
  hj: 'hoje'
};
// Palavras comuns que nunca devem ser "corrigidas" para um termo parecido do vocabulário
const COMUNS = new Set(
  'quero minha minhas estou estao sobre agora ainda porque tenho temos fazer mostra mostre quais foram ficou ficar fica posso preciso tambem muito mesmo tudo voce qual quanto quantos ultimo ultimos ultima proximo proximos depois antes sempre nunca entre desde durante contra deste desse neste nesse nessa nesta essa esse isso isto gostaria seria saber dinheiro empresa conta contas valor total media pagar receber mostrar explica explicar comigo vamos maior maiores menor menores melhor melhores pior quando onde tanto todos todas outro outra outros mesma pessoa pessoas tempo semana ganho ganhar valores banco cartao venda vendas vendi preco precos lucros geral nossa nosso nossos ontem amanha queria precisa poderia deveria devemos podemos ficam fique falta faltam pagou pague pagando recebeu entrou saiu sair sobrou sobra acima abaixo socio socios negocio servico servicos produto produtos compra compras comprar gastar mensal mensais anual anuais junto juntos diga certo errado normal comum alto altos baixo baixos grande pequeno caro barato'.split(
    ' '
  )
);

// Distância de edição em que trocar duas letras vizinhas conta como um erro só ("setmebro" -> "setembro")
function distancia(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + custo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}

// Troca uma palavra desconhecida pela do vocabulário mais próxima, só se houver uma única candidata clara:
// um erro em palavras de 5 a 7 letras, até dois em palavras maiores
function corrigir(palavra, vocabulario) {
  if (palavra.length < 5 || !/^[a-z]+$/.test(palavra) || vocabulario.has(palavra) || COMUNS.has(palavra))
    return palavra;
  const limite = palavra.length >= 8 ? 2 : 1;
  let melhor = null;
  let menor = limite + 1;
  let empate = false;
  for (const termo of vocabulario) {
    if (Math.abs(termo.length - palavra.length) > limite) continue;
    // Erro de digitação quase nunca troca a primeira letra ("venda" não deve virar "renda")
    if (termo[0] !== palavra[0]) continue;
    const dist = distancia(palavra, termo);
    if (dist < menor) [melhor, menor, empate] = [termo, dist, false];
    else if (dist === menor && termo !== melhor) empate = true;
  }
  return melhor && !empate ? melhor : palavra;
}

// Deixa a pergunta pronta para as regras do agente: sem acentos, em minúsculas, sem pontuação (mas mantendo
// "1.234,56"), com abreviações expandidas e erros de digitação corrigidos. Sempre com espaço nas pontas.
export function limparPergunta(pergunta, vocabulario = []) {
  const conhecidas = vocabulario instanceof Set ? vocabulario : new Set(vocabulario);
  const palavras = normalizar(pergunta)
    .replace(/[?!;:"()]+/g, ' ')
    .replace(/[.,](?!\d)|(?<!\d)[.,]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map(w => ABREVIACOES[w] || w)
    .map(w => corrigir(w, conhecidas));
  return ` ${palavras.join(' ')} `;
}
