// Exporta os dados em CSV e em Excel (.xlsx). O .xlsx é montado aqui mesmo, sem biblioteca: um ZIP sem
// compressão com as planilhas em XML. Cada aba vira uma tabela do Excel (tbTransacoes, tbCategorias...), que é
// o que o projeto do Power BI (pasta powerbi/) lê.
import * as A from './analise.js';

// ---------- Dados em linhas ----------
export function tabelas(estado) {
  const nomeCategoria = idCat => estado.categorias.find(c => c.id === idCat)?.nome || idCat;
  const tipoNome = {
    saida: 'Gasto',
    entrada: 'Entrada',
    neutra: 'Guardado/transferência'
  };
  const prev = A.previsao(estado, 90);
  return [
    {
      nome: 'Transacoes',
      tabela: 'tbTransacoes',
      colunas: [
        ['Data', 'data'],
        ['Descrição', 'texto'],
        ['Valor', 'moeda'],
        ['Tipo', 'texto'],
        ['Categoria', 'texto'],
        ['Conta', 'texto']
      ],
      linhas: estado.transacoes.map(t => [
        t.data,
        t.descricao,
        t.valor,
        tipoNome[A.tipoDe(estado, t)],
        nomeCategoria(t.categoria),
        t.conta || ''
      ])
    },
    {
      nome: 'Categorias',
      tabela: 'tbCategorias',
      colunas: [
        ['Categoria', 'texto'],
        ['Tipo', 'texto'],
        ['Orçamento mensal', 'moeda'],
        ['Cor', 'texto']
      ],
      linhas: estado.categorias.map(c => [c.nome, tipoNome[c.tipo], c.orcamento || 0, c.cor])
    },
    {
      nome: 'Metas',
      tabela: 'tbMetas',
      colunas: [
        ['Meta', 'texto'],
        ['Alvo', 'moeda'],
        ['Guardado', 'moeda'],
        ['Prazo', 'data']
      ],
      linhas: estado.metas.map(m => [m.nome, m.alvo, m.guardado, m.prazo])
    },
    {
      nome: 'Previsao',
      tabela: 'tbPrevisao',
      colunas: [
        ['Data', 'data'],
        ['Saldo previsto', 'moeda']
      ],
      linhas: prev.serie.map(p => [p.data, Math.round(p.saldo * 100) / 100])
    }
  ];
}

// ---------- CSV ----------
export function csvDeTransacoes(estado) {
  const [t] = tabelas(estado);
  const celula = v =>
    typeof v === 'number'
      ? v.toFixed(2).replace('.', ',')
      : /^\d{4}-\d{2}-\d{2}$/.test(v)
        ? v.split('-').reverse().join('/')
        : `"${String(v).replace(/"/g, '""')}"`;
  // Ponto e vírgula e vírgula decimal: é o que o Excel em português abre direto
  return '﻿' + [t.colunas.map(c => c[0]).join(';'), ...t.linhas.map(l => l.map(celula).join(';'))].join('\r\n');
}

// ---------- XLSX ----------
const xml = texto =>
  String(texto).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const letra = n => {
  let s = '';
  for (n += 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
};
// Data AAAA-MM-DD para o número de série do Excel (dias desde 30/12/1899)
const serial = iso =>
  Math.round((Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) - Date.UTC(1899, 11, 30)) / 86400000);

function planilha(t) {
  const estilo = { texto: 0, data: 1, moeda: 2 };
  const linhaXml = (valores, r, cabecalho) =>
    `<row r="${r}">${valores
      .map((v, c) => {
        const ref = `${letra(c)}${r}`;
        const tipo = cabecalho ? 'texto' : t.colunas[c][1];
        if (cabecalho) return `<c r="${ref}" t="inlineStr" s="3"><is><t>${xml(v)}</t></is></c>`;
        if (v === '' || v == null) return `<c r="${ref}"/>`;
        if (tipo === 'data') return `<c r="${ref}" s="1"><v>${serial(v)}</v></c>`;
        if (tipo === 'moeda') return `<c r="${ref}" s="2"><v>${Number(v)}</v></c>`;
        return `<c r="${ref}" t="inlineStr" s="${estilo.texto}"><is><t xml:space="preserve">${xml(v)}</t></is></c>`;
      })
      .join('')}</row>`;
  const larguras = t.colunas.map(([nome, tipo]) =>
    tipo === 'data' ? 12 : tipo === 'moeda' ? 16 : nome === 'Descrição' ? 46 : 22
  );
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<cols>${larguras.map((l, i) => `<col min="${i + 1}" max="${i + 1}" width="${l}" customWidth="1"/>`).join('')}</cols>
<sheetData>${linhaXml(
    t.colunas.map(c => c[0]),
    1,
    true
  )}${t.linhas.map((l, i) => linhaXml(l, i + 2, false)).join('')}</sheetData>
<tableParts count="1"><tablePart r:id="rId1"/></tableParts>
</worksheet>`;
}

function tabelaXml(t, indice) {
  const fim = `${letra(t.colunas.length - 1)}${Math.max(t.linhas.length + 1, 2)}`;
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="${indice + 1}" name="${t.tabela}" displayName="${t.tabela}" ref="A1:${fim}" totalsRowShown="0">
<autoFilter ref="A1:${fim}"/>
<tableColumns count="${t.colunas.length}">${t.colunas.map((c, i) => `<tableColumn id="${i + 1}" name="${xml(c[0])}"/>`).join('')}</tableColumns>
<tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/>
</table>`;
}

export function xlsx(estado) {
  const abas = tabelas(estado);
  const arquivos = {
    '[Content_Types].xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
${abas
  .map(
    (
      _,
      i
    ) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/tables/table${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>`
  )
  .join('\n')}
</Types>`,
    '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    'xl/workbook.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>${abas.map((a, i) => `<sheet name="${a.nome}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>
</workbook>`,
    'xl/_rels/workbook.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${abas.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('\n')}
<Relationship Id="rId${abas.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,
    'xl/styles.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="2"><numFmt numFmtId="164" formatCode="dd/mm/yyyy"/><numFmt numFmtId="165" formatCode="&quot;R$&quot; #,##0.00;[Red]-&quot;R$&quot; #,##0.00"/></numFmts>
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`
  };
  abas.forEach((a, i) => {
    arquivos[`xl/worksheets/sheet${i + 1}.xml`] = planilha(a);
    arquivos[`xl/worksheets/_rels/sheet${i + 1}.xml.rels`] = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table${i + 1}.xml"/></Relationships>`;
    arquivos[`xl/tables/table${i + 1}.xml`] = tabelaXml(a, i);
  });
  return zip(arquivos);
}

// ---------- ZIP sem compressão ----------
const TABELA_CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = TABELA_CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zip(arquivos) {
  const codificador = new TextEncoder();
  const partes = [];
  const central = [];
  let deslocamento = 0;
  for (const [nome, conteudo] of Object.entries(arquivos)) {
    const nomeBytes = codificador.encode(nome);
    const dados = typeof conteudo === 'string' ? codificador.encode(conteudo) : conteudo;
    const crc = crc32(dados);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // nomes em UTF-8
    local.setUint16(8, 0, true); // sem compressão
    local.setUint32(14, crc, true);
    local.setUint32(18, dados.length, true);
    local.setUint32(22, dados.length, true);
    local.setUint16(26, nomeBytes.length, true);
    partes.push(new Uint8Array(local.buffer), nomeBytes, dados);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x0800, true);
    c.setUint32(16, crc, true);
    c.setUint32(20, dados.length, true);
    c.setUint32(24, dados.length, true);
    c.setUint16(28, nomeBytes.length, true);
    c.setUint32(42, deslocamento, true);
    central.push(new Uint8Array(c.buffer), nomeBytes);
    deslocamento += 30 + nomeBytes.length + dados.length;
  }
  const tamanhoCentral = central.reduce((s, p) => s + p.length, 0);
  const fim = new DataView(new ArrayBuffer(22));
  fim.setUint32(0, 0x06054b50, true);
  fim.setUint16(8, Object.keys(arquivos).length, true);
  fim.setUint16(10, Object.keys(arquivos).length, true);
  fim.setUint32(12, tamanhoCentral, true);
  fim.setUint32(16, deslocamento, true);
  return new Blob([...partes, ...central, new Uint8Array(fim.buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

export function baixar(conteudo, nome, tipo = 'text/plain') {
  const blob = conteudo instanceof Blob ? conteudo : new Blob([conteudo], { type: tipo });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = nome;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 2000);
}
