// Dados de exemplo: 13 meses do extrato de uma designer que tem um emprego de meio período e atende clientes
// como MEI. Os estabelecimentos são inventados. O gerador usa uma semente fixa, então o exemplo sai igual sempre,
// e as datas andam com o calendário (o último mês é o atual).
import { hojeISO, id, somarMeses, diasNoMes } from './util.js';

function aleatorio(semente) {
  return () => {
    semente |= 0;
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gerarDemo() {
  const sorte = aleatorio(2026);
  const entre = (min, max) => Math.round((min + sorte() * (max - min)) * 100) / 100;
  const escolher = lista => lista[Math.floor(sorte() * lista.length)];
  const hoje = hojeISO();
  const transacoes = [];
  const lancar = (data, descricao, valor) => {
    if (data <= hoje)
      transacoes.push({
        id: id(),
        data,
        descricao,
        valor: Math.round(valor * 100) / 100,
        conta: 'Conta corrente'
      });
  };

  for (let m = 12; m >= 0; m--) {
    const mes = somarMeses(hoje, -m).slice(0, 7);
    const ano = Number(mes.slice(0, 4));
    const ultimoDia = diasNoMes(mes);
    const dia = d => `${mes}-${String(Math.min(d, ultimoDia)).padStart(2, '0')}`;
    const recente = m <= 2;

    // Entradas
    lancar(dia(5), 'PAGAMENTO DE SALARIO ESTUDIO LINHA FINA', 3200);
    const clientes = [
      'CAFE DO PORTO LTDA',
      'CLINICA SORRISO BELO',
      'ACADEMIA MOVIMENTO',
      'LIVRARIA PAGINA DOIS',
      'MARIA HELENA COSTA',
      'PADARIA TRIGO BOM'
    ];
    const quantosFreelas = Math.floor(sorte() * 3);
    for (let f = 0; f < quantosFreelas; f++) {
      lancar(dia(8 + Math.floor(sorte() * 20)), `PIX RECEBIDO ${escolher(clientes)}`, entre(450, 1700));
    }
    lancar(dia(ultimoDia), 'RENDIMENTO POUPANCA', entre(18, 34));

    // Moradia e contas fixas
    lancar(dia(10), 'PIX ENVIADO IMOBILIARIA CASA NOVA ALUGUEL', -1200);
    lancar(dia(10), 'BOLETO CONDOMINIO RES AGUAS CLARAS', -320);
    const calor = [9, 10, 11, 0, 1].includes(Number(mes.slice(5)) - 1); // meses mais quentes, mais ar-condicionado
    lancar(
      dia(15),
      'DEBITO AUT CIA ENERGIA ELETRICA',
      -(calor ? entre(230, 290) : entre(150, 210)) - (m === 0 ? 120 : 0)
    );
    lancar(dia(16), 'DEBITO AUT CIA AGUA E SANEAMENTO', -entre(62, 88));
    lancar(dia(12), 'DEBITO AUT NETFIBRA INTERNET', -99.9);
    lancar(dia(12), 'RECARGA CELULAR OPERADORA', -49.9);

    // Assinaturas (uma nova começa há dois meses: o agente avisa)
    lancar(dia(7), 'CARTAO STREAMFLIX ASSINATURA', -39.9);
    lancar(dia(9), 'CARTAO MUSICAPLAY PREMIUM', -21.9);
    lancar(dia(21), 'CARTAO NUVEM ARMAZENAMENTO 200GB', -9.9);
    if (m <= 2) lancar(dia(18), 'CARTAO EDITOR PRO ASSINATURA', -59.9);
    lancar(dia(3), 'DEBITO AUT ACADEMIA MOVIMENTO', -99);

    // MEI: DAS no dia 20 (valor de serviços muda com o salário mínimo de cada ano)
    lancar(dia(20), 'PAGAMENTO DAS MEI', ano >= 2026 ? -86.05 : -80.9);
    lancar(dia(1), 'TARIFA CESTA DE SERVICOS', -24.9);

    // Mercado toda semana
    for (const d of [2, 9, 16, 23, 29]) {
      if (d > ultimoDia) continue;
      lancar(
        dia(d),
        escolher(['CARTAO MERCADINHO SAO JORGE', 'CARTAO ATACAREJO BOA COMPRA', 'CARTAO HORTIFRUTI DO BAIRRO']),
        -entre(80, 210)
      );
    }
    // Comer fora
    const refeicoes = recente ? 9 : 6;
    for (let r = 0; r < refeicoes; r++) {
      lancar(
        dia(1 + Math.floor(sorte() * ultimoDia)),
        escolher([
          'CARTAO DELIVERY APP PEDIDO',
          'CARTAO PADARIA TRIGO BOM',
          'CARTAO RESTAURANTE SABOR CASEIRO',
          'CARTAO PIZZARIA FORNO VELHO',
          'CARTAO CAFE DO PORTO'
        ]),
        -entre(18, 92)
      );
    }
    // Transporte
    for (let t = 0; t < 7; t++)
      lancar(dia(1 + Math.floor(sorte() * ultimoDia)), 'CARTAO TRANSPORTE APP CORRIDA', -entre(12, 38));
    lancar(dia(6), 'CARTAO POSTO BOA VIAGEM COMBUSTIVEL', -entre(140, 210));
    // Saúde
    if (sorte() < 0.8)
      lancar(dia(1 + Math.floor(sorte() * ultimoDia)), 'CARTAO FARMACIA VIDA SAUDAVEL', -entre(25, 140));
    // Educação: curso parcelado em 6 vezes, de 8 a 3 meses atrás
    if (m >= 3 && m <= 8) lancar(dia(14), 'CARTAO CURSO ONLINE ILUSTRACAO PARCELA', -89);
    // Lazer e compras de vez em quando
    if (sorte() < 0.6)
      lancar(
        dia(1 + Math.floor(sorte() * ultimoDia)),
        escolher(['CARTAO CINEMA CENTRO', 'CARTAO INGRESSO SHOW', 'CARTAO PARQUE AQUATICO']),
        -entre(40, 180)
      );
    if (sorte() < 0.5)
      lancar(
        dia(1 + Math.floor(sorte() * ultimoDia)),
        escolher(['CARTAO LOJA MODA VIVA', 'CARTAO MARKETPLACE CASA E DECORACAO']),
        -entre(60, 260)
      );
    // Guardar dinheiro: aplicação todo mês
    lancar(dia(6), 'APLICACAO POUPANCA', -200);
  }
  // Um gasto fora do comum no mês atual, para o agente apontar
  lancar(
    `${hoje.slice(0, 7)}-${String(Math.min(4, Number(hoje.slice(8)))).padStart(2, '0')}`,
    'CARTAO LOJA ELETRONICOS TECNO',
    -1890
  );

  transacoes.sort((a, b) => a.data.localeCompare(b.data));
  return {
    transacoes,
    saldoInicial: 3100,
    metas: [
      {
        id: id(),
        nome: 'Reserva de emergência',
        alvo: 15000,
        guardado: 4300,
        prazo: somarMeses(hoje, 14)
      },
      {
        id: id(),
        nome: 'Notebook novo',
        alvo: 6500,
        guardado: 900,
        prazo: somarMeses(hoje, 6)
      }
    ],
    nome: 'Júlia'
  };
}
