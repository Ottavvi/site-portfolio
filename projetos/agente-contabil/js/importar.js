// Lê extratos em CSV (de qualquer banco) e OFX. Devolve transações { data, descricao, valor } prontas para importar.
import { id, lerData, lerValor, normalizar } from './util.js';

// ---------- CSV ----------
function separarLinha(linha, separador) {
  const campos = [];
  let atual = '';
  let aspas = false;
  for (let i = 0; i < linha.length; i++) {
    const c = linha[i];
    if (c === '"') {
      if (aspas && linha[i + 1] === '"') {
        atual += '"';
        i++;
      } else aspas = !aspas;
    } else if (c === separador && !aspas) {
      campos.push(atual.trim());
      atual = '';
    } else atual += c;
  }
  campos.push(atual.trim());
  return campos;
}

function adivinharSeparador(linhas) {
  const candidatos = [';', ',', '\t', '|'];
  return candidatos
    .map(s => ({
      s,
      n: Math.min(...linhas.slice(0, 5).map(l => separarLinha(l, s).length))
    }))
    .sort((a, b) => b.n - a.n)[0].s;
}

const COLUNAS = {
  data: ['data', 'date', 'dt', 'data lancamento', 'data da transacao', 'data movimento'],
  descricao: [
    'descricao',
    'historico',
    'hist',
    'memo',
    'lancamento',
    'estabelecimento',
    'title',
    'detalhes',
    'description',
    'identificacao'
  ],
  valor: ['valor', 'value', 'amount', 'quantia', 'valor (r$)', 'valor r$'],
  debito: ['debito', 'saida', 'saidas', 'valor debito'],
  credito: ['credito', 'entrada', 'entradas', 'valor credito']
};

function acharColuna(cabecalho, nomes) {
  const normal = cabecalho.map(normalizar);
  let i = normal.findIndex(c => nomes.includes(c));
  if (i < 0) i = normal.findIndex(c => nomes.some(n => c.startsWith(n)));
  return i;
}

// Devolve { transacoes, pareceFatura, colunas } ou lança um erro com uma explicação para a pessoa
export function lerCSV(texto) {
  const linhas = texto
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter(l => l.trim());
  if (linhas.length < 2) throw new Error('O arquivo está vazio ou tem só uma linha.');
  const separador = adivinharSeparador(linhas);
  // O cabeçalho é a primeira linha que tem uma coluna de data e uma de valor (alguns bancos põem linhas antes)
  let inicio = -1;
  let col = {};
  for (let i = 0; i < Math.min(linhas.length, 15); i++) {
    const cab = separarLinha(linhas[i], separador);
    const c = {
      data: acharColuna(cab, COLUNAS.data),
      descricao: acharColuna(cab, COLUNAS.descricao),
      valor: acharColuna(cab, COLUNAS.valor),
      debito: acharColuna(cab, COLUNAS.debito),
      credito: acharColuna(cab, COLUNAS.credito)
    };
    if (c.data >= 0 && (c.valor >= 0 || c.debito >= 0 || c.credito >= 0)) {
      inicio = i;
      col = c;
      break;
    }
  }
  if (inicio < 0) {
    throw new Error(
      'Não achei as colunas de data e valor. O CSV precisa de um cabeçalho com algo como "Data", "Descrição" e "Valor".'
    );
  }
  const transacoes = [];
  const cabecalho = separarLinha(linhas[inicio], separador);
  for (const linha of linhas.slice(inicio + 1)) {
    const campos = separarLinha(linha, separador);
    const data = lerData(campos[col.data]);
    if (!data) continue;
    let valor;
    if (col.valor >= 0) valor = lerValor(campos[col.valor]);
    else valor = (lerValor(campos[col.credito]) || 0) - Math.abs(lerValor(campos[col.debito]) || 0);
    if (!Number.isFinite(valor) || valor === 0) continue;
    const descricao = (col.descricao >= 0 ? campos[col.descricao] : '') || 'Sem descrição';
    transacoes.push({
      id: id(),
      data,
      descricao: descricao.replace(/\s+/g, ' ').trim(),
      valor: Math.round(valor * 100) / 100,
      conta: 'Importado'
    });
  }
  if (!transacoes.length) throw new Error('Achei o cabeçalho, mas nenhuma linha com data e valor válidos.');
  // Faturas de cartão costumam trazer os gastos como valores positivos
  const positivos = transacoes.filter(t => t.valor > 0).length;
  const pareceFatura =
    positivos / transacoes.length > 0.8 && cabecalho.some(c => /title|estabelecimento|fatura/i.test(normalizar(c)));
  return { transacoes, pareceFatura, colunas: { separador, cabecalho } };
}

// ---------- OFX (o formato "Money" que quase todo banco exporta) ----------
export function lerOFX(texto) {
  const blocos = texto.split(/<STMTTRN>/i).slice(1);
  if (!blocos.length) throw new Error('Não achei transações neste OFX.');
  const campo = (bloco, nome) => bloco.match(new RegExp(`<${nome}>([^<\\r\\n]*)`, 'i'))?.[1]?.trim() || '';
  const transacoes = blocos
    .map(bloco => {
      const data = lerData(campo(bloco, 'DTPOSTED'));
      const valor = Number(campo(bloco, 'TRNAMT').replace(',', '.'));
      const descricao =
        [campo(bloco, 'NAME'), campo(bloco, 'MEMO')].filter(Boolean).join(' ').trim() || 'Sem descrição';
      return {
        id: id(),
        data,
        descricao: descricao.replace(/\s+/g, ' '),
        valor: Math.round(valor * 100) / 100,
        conta: 'Importado'
      };
    })
    .filter(t => t.data && Number.isFinite(t.valor) && t.valor !== 0);
  return { transacoes, pareceFatura: false };
}

export function lerArquivo(nome, texto) {
  if (/\.ofx$/i.test(nome) || /<OFX>/i.test(texto)) return lerOFX(texto);
  return lerCSV(texto);
}

// Arquivos de banco brasileiros às vezes vêm em Latin-1: se o UTF-8 tiver caracteres trocados, lê de novo
export async function lerTextoDoArquivo(arquivo) {
  const bytes = await arquivo.arrayBuffer();
  const utf8 = new TextDecoder('utf-8').decode(bytes);
  return utf8.includes('�') ? new TextDecoder('windows-1252').decode(bytes) : utf8;
}
