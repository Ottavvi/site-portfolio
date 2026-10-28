// Trilha de Web Audio. Os exemplos rodam no editor comum (HTML) e tocam som ao clicar. Os testes do último desafio
// "escutam" o resultado: renderizam o som num OfflineAudioContext e conferem silêncio, volume e frequência.
// Atenção: corpo, inicial e solucao são template strings; crases e ${ dos exemplos precisam de barra invertida.
// Depois de editar, rode `node ferramentas/gerar-estudos.js`.
const { codigo, trecho, dica } = require('./ajuda');

module.exports = {
  id: 'web-audio',
  area: 'Desenvolvimento web',
  titulo: 'Web Audio',
  sigla: 'WA',
  resumo: 'Gerar e tocar sons pelo navegador: alarmes, efeitos e sintetizadores.',
  niveis: [
    {
      titulo: 'Iniciante',
      resumo: 'O primeiro som: contexto, osciladores e volume.',
      modulos: [
        {
          titulo: 'Primeiros sons',
          itens: [
            {
              id: 'primeiro-som',
              titulo: 'O primeiro som',
              resumo: 'AudioContext, osciladores e o grafo de áudio.',
              minutos: 9,
              corpo: `
<p>A <strong>Web Audio API</strong> cria e processa som direto no navegador, sem arquivo nenhum. Ela funciona como um estúdio de cabos: você cria <strong>nós</strong> (um gerador de som, um controle de volume, um filtro) e <strong>conecta</strong> um no outro até chegar na saída, que é a caixa de som.</p>

<h2>Contexto, oscilador e saída</h2>
${codigo(`<button id="tocar">Tocar um lá (440 Hz)</button>

<script>
  let ctx;
  document.querySelector('#tocar').addEventListener('click', () => {
    ctx ??= new AudioContext();               // o "estúdio": cria uma vez só
    const osc = ctx.createOscillator();      // gerador de onda
    osc.frequency.value = 440;               // 440 vibrações por segundo
    osc.connect(ctx.destination);            // liga na caixa de som
    osc.start();
    osc.stop(ctx.currentTime + 0.5);         // para meio segundo depois
  });
</script>`)}
<ul>
  <li><code>AudioContext</code> é o ambiente onde tudo acontece. Crie um só e reaproveite.</li>
  <li><code>createOscillator()</code> gera uma onda numa frequência. Quanto maior a frequência, mais agudo.</li>
  <li><code>connect</code> liga um nó no próximo. <code>ctx.destination</code> é a saída de som.</li>
  <li>Um oscilador toca uma vez só: depois do <code>stop</code>, crie outro para tocar de novo.</li>
</ul>
${dica('Navegadores só deixam a página fazer som depois de uma ação da pessoa (um clique ou uma tecla). Por isso o contexto é criado dentro do clique. Se ele foi criado antes, chame <code>ctx.resume()</code> no clique.')}

<h2>Tipos de onda</h2>
<p>A forma da onda muda o timbre. <code>sine</code> é suave, <code>square</code> lembra videogame antigo, <code>sawtooth</code> é áspera e <code>triangle</code> fica entre a senoide e a quadrada:</p>
${codigo(`<button data-tipo="sine">sine</button>
<button data-tipo="square">square</button>
<button data-tipo="sawtooth">sawtooth</button>
<button data-tipo="triangle">triangle</button>

<script>
  let ctx;
  document.querySelectorAll('button').forEach(botao => {
    botao.addEventListener('click', () => {
      ctx ??= new AudioContext();
      const osc = new OscillatorNode(ctx, { type: botao.dataset.tipo, frequency: 330 });
      const volume = new GainNode(ctx, { gain: 0.2 });
      osc.connect(volume).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    });
  });
</script>`)}
<p>Repare na outra forma de criar nós, com <code>new OscillatorNode(ctx, opções)</code>, e no <code>connect</code> encadeado: ele devolve o nó de destino, então dá para seguir ligando.</p>
`,
              quiz: [
                {
                  pergunta: 'Por que criar o AudioContext dentro de um clique?',
                  opcoes: [
                    'É mais rápido',
                    'Os navegadores só liberam som depois de uma ação da pessoa',
                    'O contexto expira em 1 segundo'
                  ],
                  certa: 1,
                  explicacao: 'É a política de autoplay: nada de página que começa a fazer barulho sozinha.'
                },
                {
                  pergunta: 'O que é ctx.destination?',
                  opcoes: ['A saída de som (as caixas)', 'O primeiro oscilador', 'Um arquivo de áudio'],
                  certa: 0,
                  explicacao: 'Todo som precisa chegar nele para ser ouvido.'
                },
                {
                  pergunta: 'Dá para chamar start() duas vezes no mesmo oscilador?',
                  opcoes: ['Sim', 'Não: cada oscilador toca uma vez; crie outro', 'Só depois de stop()'],
                  certa: 1,
                  explicacao: 'Osciladores são descartáveis e baratos de criar.'
                }
              ]
            },
            {
              id: 'volume-e-envelope',
              titulo: 'Volume e envelope',
              resumo: 'GainNode e rampas para um som sem estalos.',
              minutos: 10,
              corpo: `
<p>Começar e parar um oscilador de uma vez costuma fazer um <strong>estalo</strong>: a onda é cortada no meio. A solução é controlar o volume com um <code>GainNode</code> e fazer ele subir e descer suavemente. Esse desenho do volume no tempo se chama <strong>envelope</strong>.</p>

<h2>Parâmetros que mudam no tempo</h2>
<p><code>frequency</code> e <code>gain</code> não são números comuns: são <code>AudioParam</code>, que podem ser programados com precisão de amostra usando o relógio do contexto (<code>ctx.currentTime</code>, em segundos):</p>
${codigo(`<button id="bip">Bip suave</button>
<button id="seco">Bip seco (com estalo)</button>

<script>
  let ctx;
  function tocar(suave) {
    ctx ??= new AudioContext();
    const agora = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { frequency: 660 });
    const volume = new GainNode(ctx, { gain: 0 });
    osc.connect(volume).connect(ctx.destination);

    if (suave) {
      volume.gain.setValueAtTime(0, agora);
      volume.gain.linearRampToValueAtTime(0.3, agora + 0.02);  // ataque
      volume.gain.linearRampToValueAtTime(0, agora + 0.3);     // queda
    } else {
      volume.gain.setValueAtTime(0.3, agora);
      volume.gain.setValueAtTime(0, agora + 0.3);
    }
    osc.start(agora);
    osc.stop(agora + 0.3);
  }
  document.querySelector('#bip').addEventListener('click', () => tocar(true));
  document.querySelector('#seco').addEventListener('click', () => tocar(false));
</script>`)}
<ul>
  <li><code>setValueAtTime(valor, tempo)</code>: muda de uma vez naquele instante.</li>
  <li><code>linearRampToValueAtTime(valor, tempo)</code>: vai mudando em linha reta até chegar ao valor naquele tempo.</li>
  <li><code>exponentialRampToValueAtTime</code>: curva mais natural para volume e frequência (não aceita chegar a 0; use 0.0001).</li>
</ul>

<h2>Um volume geral</h2>
<p>Ligue todos os sons num <code>GainNode</code> "mestre" antes da saída. Assim, um controle de volume da página muda tudo de uma vez:</p>
${codigo(`<label>Volume <input id="vol" type="range" min="0" max="1" step="0.01" value="0.3"></label>
<button id="som">Tocar</button>

<script>
  let ctx, mestre;
  document.querySelector('#som').addEventListener('click', () => {
    if (!ctx) {
      ctx = new AudioContext();
      mestre = new GainNode(ctx, { gain: 0.3 });
      mestre.connect(ctx.destination);
    }
    const osc = new OscillatorNode(ctx, { type: 'triangle', frequency: 523.25 });
    osc.connect(mestre);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  });
  document.querySelector('#vol').addEventListener('input', e => {
    mestre?.gain.setTargetAtTime(Number(e.target.value), ctx.currentTime, 0.02);
  });
</script>`)}
${dica('Volume 1 já é bem alto para uma onda quadrada. Valores entre 0.1 e 0.3 são mais confortáveis, principalmente com fone de ouvido.')}
`,
              quiz: [
                {
                  pergunta: 'Por que usar um envelope de volume?',
                  opcoes: [
                    'Para economizar bateria',
                    'Para evitar o estalo de cortar a onda de repente',
                    'Para mudar a frequência'
                  ],
                  certa: 1,
                  explicacao: 'Subir e descer o volume suavemente elimina o clique no começo e no fim.'
                },
                {
                  pergunta: 'Em que unidade está ctx.currentTime?',
                  opcoes: ['Milissegundos', 'Segundos', 'Amostras'],
                  certa: 1,
                  explicacao: 'O relógio de áudio conta em segundos, com casas decimais.'
                },
                {
                  pergunta: 'Por que exponentialRampToValueAtTime não pode chegar a 0?',
                  opcoes: ['Por causa da matemática da curva exponencial', 'Porque 0 é mudo', 'Pode sim'],
                  certa: 0,
                  explicacao:
                    'Uma curva exponencial nunca chega exatamente a zero. Use um valor bem pequeno, como 0.0001.'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      titulo: 'Intermediário',
      resumo: 'Notas musicais, frequências e sequências programadas.',
      modulos: [
        {
          titulo: 'Notas e sequências',
          itens: [
            {
              id: 'notas-e-tempo',
              titulo: 'Notas e tempo',
              resumo: 'De nota para frequência e como agendar uma melodia.',
              minutos: 12,
              corpo: `
<h2>De nota para frequência</h2>
<p>Na afinação usada hoje, o lá central (A4) vibra a 440 Hz, e cada semitom acima multiplica a frequência por <code>2^(1/12)</code>. Doze semitons dobram a frequência: uma oitava. Numerando as teclas do piano como o padrão MIDI faz (A4 é a 69), a fórmula fica:</p>
${trecho(`frequência = 440 × 2 ^ ((número MIDI − 69) / 12)`)}
${codigo(`<script>
  const midiParaHz = n => 440 * 2 ** ((n - 69) / 12);
  console.log('A4 (69):', midiParaHz(69));
  console.log('A5 (81):', midiParaHz(81));
  console.log('C4 (60):', midiParaHz(60).toFixed(2));
</script>`)}

<h2>Agendar em vez de esperar</h2>
<p>Tocar uma melodia com <code>setTimeout</code> parece natural, mas o relógio do JavaScript atrasa quando a página está ocupada e o ritmo sai torto. O jeito certo é <strong>agendar</strong> cada nota no relógio do áudio, que é preciso:</p>
${codigo(`<button id="tocar">Tocar escala</button>

<script>
  let ctx;
  const midiParaHz = n => 440 * 2 ** ((n - 69) / 12);

  function nota(midi, inicio, duracao) {
    const osc = new OscillatorNode(ctx, { type: 'triangle', frequency: midiParaHz(midi) });
    const vol = new GainNode(ctx, { gain: 0 });
    osc.connect(vol).connect(ctx.destination);
    vol.gain.setValueAtTime(0, inicio);
    vol.gain.linearRampToValueAtTime(0.25, inicio + 0.01);
    vol.gain.linearRampToValueAtTime(0, inicio + duracao);
    osc.start(inicio);
    osc.stop(inicio + duracao);
  }

  document.querySelector('#tocar').addEventListener('click', () => {
    ctx ??= new AudioContext();
    const escala = [60, 62, 64, 65, 67, 69, 71, 72]; // dó maior
    const agora = ctx.currentTime + 0.05;
    escala.forEach((midi, i) => nota(midi, agora + i * 0.25, 0.22));
  });
</script>`)}
<p>As oito notas são agendadas de uma vez, cada uma no seu instante. O navegador cuida do resto, mesmo que o JavaScript fique ocupado.</p>
${dica('Para sequências longas ou infinitas (um metrônomo, por exemplo), agende só um pouco à frente (uns 100 ms) e vá agendando mais com um timer. É o padrão conhecido como "lookahead scheduler".')}

<h2>Mudar a frequência no tempo</h2>
<p>A frequência também é um <code>AudioParam</code>. Uma rampa nela faz sirenes e efeitos de "laser":</p>
${codigo(`<button id="laser">Laser</button>
<script>
  let ctx;
  document.querySelector('#laser').addEventListener('click', () => {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { type: 'square' });
    const vol = new GainNode(ctx, { gain: 0.15 });
    osc.frequency.setValueAtTime(1500, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.3);
    osc.connect(vol).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'O que acontece com a frequência uma oitava acima?',
                  opcoes: ['Soma 12 Hz', 'Dobra', 'Aumenta 10%'],
                  certa: 1,
                  explicacao: 'Uma oitava (12 semitons) multiplica a frequência por 2: A4 é 440 Hz e A5, 880 Hz.'
                },
                {
                  pergunta: 'Por que agendar as notas com ctx.currentTime em vez de setTimeout?',
                  opcoes: [
                    'setTimeout não existe em áudio',
                    'O relógio de áudio é preciso; o setTimeout atrasa quando a página está ocupada',
                    'É obrigatório'
                  ],
                  certa: 1,
                  explicacao: 'Ritmo depende de precisão de milissegundos, que só o relógio de áudio garante.'
                },
                {
                  pergunta: 'Qual o número MIDI do lá central (A4)?',
                  opcoes: ['60', '69', '440'],
                  certa: 1,
                  explicacao: 'O dó central (C4) é 60 e o lá central é 69.'
                }
              ]
            },
            {
              id: 'desafio-teclado',
              tipo: 'desafio',
              titulo: 'Desafio: teclado musical',
              resumo: 'Converta nomes de notas em frequências e monte um teclado.',
              minutos: 22,
              enunciado: `
<p>Faça um pequeno teclado musical:</p>
<ul>
  <li><code>frequencia(nota)</code> recebe um nome como <code>'A4'</code>, <code>'C4'</code>, <code>'F#3'</code> ou <code>'Bb5'</code> e devolve a frequência em Hz (com a fórmula da aula). As notas são C, D, E, F, G, A e B; <code>#</code> sobe um semitom e <code>b</code> desce um. O número é a oitava: o C4 é o MIDI 60.</li>
  <li>Cada botão com <code>data-nota</code> toca aquela nota quando é clicado (com <code>frequencia</code>).</li>
</ul>
<p>Os testes conferem os valores com até 0,01 Hz de diferença.</p>`,
              inicial: `<div id="teclado">
  <button data-nota="C4">Dó</button>
  <button data-nota="D4">Ré</button>
  <button data-nota="E4">Mi</button>
  <button data-nota="F4">Fá</button>
  <button data-nota="G4">Sol</button>
  <button data-nota="A4">Lá</button>
  <button data-nota="B4">Si</button>
  <button data-nota="C5">Dó</button>
</div>

<script>
  let ctx;

  function frequencia(nota) {
    // 'A4' → 440
  }

  function tocar(hz) {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { type: 'triangle', frequency: hz });
    const vol = new GainNode(ctx, { gain: 0 });
    osc.connect(vol).connect(ctx.destination);
    vol.gain.linearRampToValueAtTime(0.25, t + 0.01);
    vol.gain.linearRampToValueAtTime(0, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  // Ligue os botões aqui
</script>
`,
              testes: [
                [
                  "frequencia('A4') é 440 e frequencia('A5') é 880",
                  doc => {
                    const f = doc.defaultView.eval('frequencia');
                    return Math.abs(f('A4') - 440) < 0.01 && Math.abs(f('A5') - 880) < 0.01;
                  }
                ],
                [
                  "frequencia('C4') é 261,63",
                  doc => Math.abs(doc.defaultView.eval('frequencia')('C4') - 261.63) < 0.01
                ],
                [
                  'Sustenido e bemol funcionam (F#3 e Bb5)',
                  doc => {
                    const f = doc.defaultView.eval('frequencia');
                    return Math.abs(f('F#3') - 185.0) < 0.01 && Math.abs(f('Bb5') - 932.33) < 0.01;
                  }
                ],
                [
                  'Clicar num botão toca a frequência daquela nota',
                  doc => {
                    const w = doc.defaultView;
                    const tocadas = [];
                    const original = w.eval('tocar');
                    w.eval('tocar = hz => window.__tocadas.push(hz)');
                    w.__tocadas = tocadas;
                    doc.querySelector('[data-nota="E4"]').click();
                    w.__restaurar = original;
                    w.eval('tocar = window.__restaurar');
                    return tocadas.length === 1 && Math.abs(tocadas[0] - 329.63) < 0.01;
                  }
                ]
              ],
              solucao: `<div id="teclado">
  <button data-nota="C4">Dó</button>
  <button data-nota="D4">Ré</button>
  <button data-nota="E4">Mi</button>
  <button data-nota="F4">Fá</button>
  <button data-nota="G4">Sol</button>
  <button data-nota="A4">Lá</button>
  <button data-nota="B4">Si</button>
  <button data-nota="C5">Dó</button>
</div>

<script>
  let ctx;
  const SEMITONS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

  function frequencia(nota) {
    const [, letra, acidente, oitava] = nota.match(/^([A-G])([#b]?)(-?\\d)$/);
    const ajuste = acidente === '#' ? 1 : acidente === 'b' ? -1 : 0;
    const midi = 12 * (Number(oitava) + 1) + SEMITONS[letra] + ajuste;
    return 440 * 2 ** ((midi - 69) / 12);
  }

  function tocar(hz) {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { type: 'triangle', frequency: hz });
    const vol = new GainNode(ctx, { gain: 0 });
    osc.connect(vol).connect(ctx.destination);
    vol.gain.linearRampToValueAtTime(0.25, t + 0.01);
    vol.gain.linearRampToValueAtTime(0, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  document.querySelectorAll('[data-nota]').forEach(botao => {
    botao.addEventListener('click', () => tocar(frequencia(botao.dataset.nota)));
  });
</script>`
            }
          ]
        }
      ]
    },
    {
      titulo: 'Avançado',
      resumo: 'Arquivos de áudio, análise, filtros e renderização offline.',
      modulos: [
        {
          titulo: 'Processar e analisar',
          itens: [
            {
              id: 'arquivos-filtros-e-analise',
              titulo: 'Arquivos, filtros e análise',
              resumo: 'AudioBuffer, BiquadFilter, AnalyserNode e OfflineAudioContext.',
              minutos: 14,
              corpo: `
<h2>Tocar um arquivo</h2>
<p>Para efeitos curtos (cliques, moedas, alertas), carregue o arquivo uma vez, decodifique e toque quantas vezes quiser com um <code>AudioBufferSourceNode</code>:</p>
${trecho(`const resposta = await fetch('sons/moeda.mp3');
const buffer = await ctx.decodeAudioData(await resposta.arrayBuffer());

function tocarMoeda() {
  const fonte = new AudioBufferSourceNode(ctx, { buffer });
  fonte.connect(ctx.destination);
  fonte.start();
}`)}
<p>Um <code>AudioBuffer</code> também pode ser criado do zero. Este gera um segundo de <strong>ruído branco</strong> (valores aleatórios entre −1 e 1), a matéria-prima de sons de vento, chuva e percussão:</p>
${codigo(`<button id="ruido">Ruído</button>
<label><input id="filtro" type="checkbox" checked> Passar por um filtro passa-baixa</label>

<script>
  let ctx;
  document.querySelector('#ruido').addEventListener('click', () => {
    ctx ??= new AudioContext();
    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const amostras = buffer.getChannelData(0);
    for (let i = 0; i < amostras.length; i++) amostras[i] = Math.random() * 2 - 1;

    const fonte = new AudioBufferSourceNode(ctx, { buffer });
    const vol = new GainNode(ctx, { gain: 0.15 });
    let saida = fonte;
    if (document.querySelector('#filtro').checked) {
      saida = saida.connect(new BiquadFilterNode(ctx, { type: 'lowpass', frequency: 600 }));
    }
    saida.connect(vol).connect(ctx.destination);
    fonte.start();
  });
</script>`)}
<p>O <code>BiquadFilterNode</code> corta ou realça faixas de frequência: <code>lowpass</code> deixa passar os graves (som abafado, como do outro lado da parede), <code>highpass</code> os agudos e <code>bandpass</code> uma faixa no meio.</p>

<h2>Visualizar com o AnalyserNode</h2>
<p>O <code>AnalyserNode</code> não muda o som: ele deixa você espiar a onda ou o espectro a cada quadro, para desenhar visualizadores e medidores de volume:</p>
${codigo(`<button id="ligar">Ligar</button>
<canvas id="tela" width="300" height="100" style="background:#111;display:block;margin-top:8px"></canvas>

<script>
  document.querySelector('#ligar').addEventListener('click', () => {
    const ctx = new AudioContext();
    const osc = new OscillatorNode(ctx, { type: 'sawtooth', frequency: 110 });
    const analisador = new AnalyserNode(ctx, { fftSize: 1024 });
    const vol = new GainNode(ctx, { gain: 0.05 });
    osc.connect(analisador).connect(vol).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2);

    const tela = document.querySelector('#tela').getContext('2d');
    const dados = new Uint8Array(analisador.fftSize);
    function desenhar() {
      analisador.getByteTimeDomainData(dados);
      tela.clearRect(0, 0, 300, 100);
      tela.strokeStyle = '#5eead4';
      tela.beginPath();
      dados.forEach((v, i) => tela.lineTo((i / dados.length) * 300, (v / 255) * 100));
      tela.stroke();
      if (ctx.currentTime < 2) requestAnimationFrame(desenhar);
    }
    desenhar();
  });
</script>`)}

<h2>Renderizar sem tocar</h2>
<p>O <code>OfflineAudioContext</code> processa o som o mais rápido possível, sem enviar para as caixas, e devolve um <code>AudioBuffer</code>. Serve para gerar arquivos, aplicar efeitos em lote e, como no próximo desafio, <strong>testar</strong> se o som saiu como deveria:</p>
${codigo(`<script>
  const ctx = new OfflineAudioContext(1, 44100, 44100); // 1 canal, 1 segundo
  const osc = new OscillatorNode(ctx, { frequency: 440 });
  osc.connect(ctx.destination);
  osc.start(0.5);

  ctx.startRendering().then(buffer => {
    const dados = buffer.getChannelData(0);
    const pico = (de, ate) => Math.max(...dados.slice(de * 44100, ate * 44100).map(Math.abs));
    console.log('pico antes de 0,5 s:', pico(0, 0.5));
    console.log('pico depois de 0,5 s:', pico(0.5, 1).toFixed(2));
  });
</script>`)}
`,
              quiz: [
                {
                  pergunta: 'Que filtro deixa o som abafado, como do outro lado de uma parede?',
                  opcoes: ['highpass', 'lowpass', 'bandpass'],
                  certa: 1,
                  explicacao: 'O passa-baixa deixa passar os graves e corta os agudos.'
                },
                {
                  pergunta: 'O AnalyserNode altera o som que passa por ele?',
                  opcoes: ['Sim, deixa mais alto', 'Não: só permite ler a onda e o espectro', 'Sim, aplica um filtro'],
                  certa: 1,
                  explicacao: 'Ele é um ponto de observação; o som sai igual.'
                },
                {
                  pergunta: 'Para que serve o OfflineAudioContext?',
                  opcoes: [
                    'Tocar sem internet',
                    'Processar o som sem tocar, o mais rápido possível, e receber o resultado',
                    'Gravar o microfone'
                  ],
                  certa: 1,
                  explicacao: 'Ótimo para gerar arquivos e para testes automáticos de áudio.'
                }
              ]
            },
            {
              id: 'desafio-alarme',
              tipo: 'desafio',
              titulo: 'Desafio: som de alarme',
              resumo: 'Crie um bip com envelope e um alarme de bips repetidos.',
              minutos: 25,
              enunciado: `
<p>Escreva o som do alarme de um app de cronômetro. As funções recebem o contexto (que pode ser um <code>AudioContext</code> ou um <code>OfflineAudioContext</code>) e o momento de início, em segundos:</p>
<ul>
  <li><code>bip(ctx, inicio)</code>: um bip de <strong>880 Hz</strong> que começa em <code>inicio</code>, sobe até volume 0,3 em 10 ms, desce até 0 e termina em <strong>0,2 s</strong>. O oscilador precisa parar no fim.</li>
  <li><code>alarme(ctx, inicio, vezes)</code>: toca <code>vezes</code> bips, um a cada <strong>0,4 s</strong> (começando em <code>inicio</code>).</li>
</ul>
<p>Os testes "escutam" o resultado renderizando o som com um <code>OfflineAudioContext</code>: conferem silêncio onde não deve haver som, o volume máximo e a frequência.</p>`,
              inicial: `<button id="testar">Ouvir o alarme</button>

<script>
  function bip(ctx, inicio) {
  }

  function alarme(ctx, inicio, vezes) {
  }

  let ctx;
  document.querySelector('#testar').addEventListener('click', () => {
    ctx ??= new AudioContext();
    alarme(ctx, ctx.currentTime + 0.05, 3);
  });
</script>
`,
              testes: [
                [
                  'bip toca entre inicio e inicio + 0,2 s, com silêncio fora',
                  async doc => {
                    const w = doc.defaultView;
                    const ctx = new w.OfflineAudioContext(1, 44100, 44100);
                    w.eval('bip')(ctx, 0.3);
                    const d = (await ctx.startRendering()).getChannelData(0);
                    const pico = (a, b) => d.slice(a * 44100, b * 44100).reduce((m, v) => Math.max(m, Math.abs(v)), 0);
                    return pico(0, 0.29) < 0.001 && pico(0.32, 0.45) > 0.05 && pico(0.52, 1) < 0.001;
                  }
                ],
                [
                  'O volume máximo fica perto de 0,3',
                  async doc => {
                    const w = doc.defaultView;
                    const ctx = new w.OfflineAudioContext(1, 44100, 44100);
                    w.eval('bip')(ctx, 0);
                    const d = (await ctx.startRendering()).getChannelData(0);
                    const pico = d.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
                    return pico > 0.25 && pico <= 0.31;
                  }
                ],
                [
                  'A frequência é 880 Hz',
                  async doc => {
                    const w = doc.defaultView;
                    const ctx = new w.OfflineAudioContext(1, 44100, 44100);
                    w.eval('bip')(ctx, 0);
                    const d = (await ctx.startRendering()).getChannelData(0).slice(441, 441 + 4410);
                    let cruzamentos = 0;
                    for (let i = 1; i < d.length; i++) if (d[i - 1] < 0 && d[i] >= 0) cruzamentos++;
                    const hz = cruzamentos / 0.1;
                    return Math.abs(hz - 880) <= 20;
                  }
                ],
                [
                  'alarme toca os bips a cada 0,4 s',
                  async doc => {
                    const w = doc.defaultView;
                    const ctx = new w.OfflineAudioContext(1, 2 * 44100, 44100);
                    w.eval('alarme')(ctx, 0.1, 3);
                    const d = (await ctx.startRendering()).getChannelData(0);
                    const pico = (a, b) => d.slice(a * 44100, b * 44100).reduce((m, v) => Math.max(m, Math.abs(v)), 0);
                    const tocou = [0.12, 0.52, 0.92].every(t => pico(t, t + 0.1) > 0.05);
                    const calado = [0.32, 0.72, 1.12].every(t => pico(t, t + 0.15) < 0.001);
                    return tocou && calado;
                  }
                ]
              ],
              solucao: `<button id="testar">Ouvir o alarme</button>

<script>
  function bip(ctx, inicio) {
    const fim = inicio + 0.2;
    const osc = new OscillatorNode(ctx, { frequency: 880 });
    const vol = new GainNode(ctx, { gain: 0 });
    osc.connect(vol).connect(ctx.destination);
    vol.gain.setValueAtTime(0, inicio);
    vol.gain.linearRampToValueAtTime(0.3, inicio + 0.01);
    vol.gain.linearRampToValueAtTime(0, fim);
    osc.start(inicio);
    osc.stop(fim);
  }

  function alarme(ctx, inicio, vezes) {
    for (let i = 0; i < vezes; i++) bip(ctx, inicio + i * 0.4);
  }

  let ctx;
  document.querySelector('#testar').addEventListener('click', () => {
    ctx ??= new AudioContext();
    alarme(ctx, ctx.currentTime + 0.05, 3);
  });
</script>`
            }
          ]
        },
        {
          titulo: 'Efeitos e microfone',
          itens: [
            {
              id: 'efeitos',
              titulo: 'Eco, panorâmica e distorção',
              resumo: 'DelayNode com realimentação, StereoPannerNode e WaveShaperNode.',
              minutos: 12,
              corpo: `
<h2>Eco</h2>
<p>O <code>DelayNode</code> atrasa o som. Sozinho, faz uma repetição. Ligando a saída dele de volta na entrada, passando por um volume menor que 1, cada repetição sai mais baixa que a anterior: é o <strong>eco</strong>. Esse caminho de volta se chama <strong>realimentação</strong> (<em>feedback</em>):</p>
${codigo(`<button id="tocar">Bip com eco</button>
<label>Atraso <input id="atraso" type="range" min="0.05" max="0.6" step="0.05" value="0.25"></label>
<label>Retorno <input id="retorno" type="range" min="0" max="0.8" step="0.1" value="0.5"></label>

<script>
  let ctx;
  document.querySelector('#tocar').addEventListener('click', () => {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { frequency: 660 });
    const envelope = new GainNode(ctx, { gain: 0 });
    envelope.gain.linearRampToValueAtTime(0.3, t + 0.01);
    envelope.gain.linearRampToValueAtTime(0, t + 0.12);

    const atraso = new DelayNode(ctx, { delayTime: Number(document.querySelector('#atraso').value), maxDelayTime: 1 });
    const retorno = new GainNode(ctx, { gain: Number(document.querySelector('#retorno').value) });

    osc.connect(envelope);
    envelope.connect(ctx.destination);   // o som original
    envelope.connect(atraso);            // e uma cópia atrasada...
    atraso.connect(retorno);
    retorno.connect(ctx.destination);
    retorno.connect(atraso);             // ...que volta para o atraso, cada vez mais baixa

    osc.start(t);
    osc.stop(t + 0.12);
  });
</script>`)}
${dica('Com o retorno em 1 ou mais, o eco nunca diminui, e o som cresce até distorcer. Mantenha a realimentação sempre abaixo de 1.')}

<h2>Panorâmica</h2>
<p><code>StereoPannerNode</code> posiciona o som entre o lado esquerdo (<code>-1</code>) e o direito (<code>1</code>). Use fone de ouvido:</p>
${codigo(`<button id="passar">Som passando da esquerda para a direita</button>
<script>
  let ctx;
  document.querySelector('#passar').addEventListener('click', () => {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { type: 'sawtooth', frequency: 220 });
    const vol = new GainNode(ctx, { gain: 0.1 });
    const pan = new StereoPannerNode(ctx, { pan: -1 });
    pan.pan.linearRampToValueAtTime(1, t + 2);
    osc.connect(vol).connect(pan).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 2);
  });
</script>`)}

<h2>Distorção</h2>
<p>O <code>WaveShaperNode</code> passa cada amostra por uma curva. Uma curva que "achata" os picos produz a distorção das guitarras:</p>
${trecho(`function curvaDeDistorcao(intensidade = 50) {
  const curva = new Float32Array(1024);
  for (let i = 0; i < curva.length; i++) {
    const x = (i * 2) / curva.length - 1;
    curva[i] = ((3 + intensidade) * x * 20 * (Math.PI / 180)) / (Math.PI + intensidade * Math.abs(x));
  }
  return curva;
}
const distorcao = new WaveShaperNode(ctx, { curve: curvaDeDistorcao(80), oversample: '4x' });`)}
<p>Para reverberação realista (o som de uma igreja, de um banheiro), existe o <code>ConvolverNode</code>, que aplica a "impressão acústica" de um ambiente gravada num arquivo de áudio.</p>
`,
              quiz: [
                {
                  pergunta: 'O que transforma um atraso simples num eco com várias repetições?',
                  opcoes: [
                    'Um filtro',
                    'Ligar a saída do atraso de volta na entrada, com volume menor que 1',
                    'Dois osciladores'
                  ],
                  certa: 1,
                  explicacao: 'É a realimentação: cada volta sai mais baixa.'
                },
                {
                  pergunta: 'Que valor de pan põe o som todo no lado direito?',
                  opcoes: ['-1', '0', '1'],
                  certa: 2,
                  explicacao: '-1 é esquerda, 0 é centro e 1 é direita.'
                },
                {
                  pergunta: 'O que acontece com realimentação em 1,2?',
                  opcoes: ['O eco some', 'O eco cresce a cada volta até distorcer', 'Nada'],
                  certa: 1,
                  explicacao: 'Cada repetição sai mais alta que a anterior.'
                }
              ]
            },
            {
              id: 'microfone-e-gravacao',
              titulo: 'Microfone e gravação',
              resumo: 'getUserMedia, medidor de volume e MediaRecorder.',
              minutos: 11,
              corpo: `
<p>O microfone entra no Web Audio como mais um nó. Como envolve privacidade, o navegador sempre pede permissão, e a página precisa estar em HTTPS (ou <code>localhost</code>). Dentro do editor desta trilha (um iframe), o pedido costuma ser bloqueado, então os exemplos são para testar numa página sua.</p>

<h2>Medidor de volume</h2>
${trecho(`const fluxo = await navigator.mediaDevices.getUserMedia({ audio: true });
const ctx = new AudioContext();
const microfone = ctx.createMediaStreamSource(fluxo);
const analisador = new AnalyserNode(ctx, { fftSize: 2048 });
microfone.connect(analisador);           // não ligue no destination: faria microfonia

const amostras = new Float32Array(analisador.fftSize);
function medir() {
  analisador.getFloatTimeDomainData(amostras);
  const rms = Math.sqrt(amostras.reduce((soma, a) => soma + a * a, 0) / amostras.length);
  const db = 20 * Math.log10(rms || 1e-8);          // decibéis em relação ao máximo (dBFS)
  barra.style.width = Math.max(0, 100 + db * 2) + '%';
  requestAnimationFrame(medir);
}
medir();`)}
<p>O <strong>RMS</strong> (raiz da média dos quadrados) é a medida de volume mais comum: considera todas as amostras, não só o pico. Convertido em <strong>dBFS</strong>, 0 é o máximo possível e o silêncio fica em torno de -60 a -90.</p>

<h2>Gravar</h2>
<p>O <code>MediaRecorder</code> grava um fluxo de áudio (ou vídeo) num arquivo:</p>
${trecho(`const gravador = new MediaRecorder(fluxo);
const pedacos = [];
gravador.addEventListener('dataavailable', e => pedacos.push(e.data));
gravador.addEventListener('stop', () => {
  const audio = new Blob(pedacos, { type: gravador.mimeType });
  player.src = URL.createObjectURL(audio);         // <audio controls id="player">
});

gravador.start();
setTimeout(() => gravador.stop(), 5000);           // 5 segundos`)}
${dica('Quando terminar, desligue o microfone com <code>fluxo.getTracks().forEach(t =&gt; t.stop())</code>. Enquanto ele estiver aberto, o navegador mostra o ícone de gravação, e a pessoa tem razão de desconfiar se ele continuar aceso.')}

<h2>Áudio e privacidade</h2>
<ul>
  <li>Peça o microfone só quando a pessoa clicar em algo como "Gravar", nunca ao abrir a página.</li>
  <li>Diga o que acontece com o áudio: fica no aparelho ou vai para um servidor?</li>
  <li>Gravação de voz é dado pessoal, e voz usada para identificar alguém é dado biométrico (sensível), segundo a LGPD.</li>
</ul>
`,
              quiz: [
                {
                  pergunta: 'Por que não ligar o microfone direto em ctx.destination num medidor?',
                  opcoes: ['Dá erro', 'O som do alto-falante volta para o microfone e vira microfonia', 'Fica mudo'],
                  certa: 1,
                  explicacao: 'O analisador não precisa estar ligado na saída para medir.'
                },
                {
                  pergunta: 'O que o RMS mede?',
                  opcoes: ['O pico mais alto', 'O volume médio considerando todas as amostras', 'A frequência'],
                  certa: 1,
                  explicacao: 'É a raiz da média dos quadrados das amostras.'
                },
                {
                  pergunta: 'Como desligar o microfone ao terminar?',
                  opcoes: [
                    'ctx.close()',
                    'Parar as faixas do fluxo: fluxo.getTracks().forEach(t => t.stop())',
                    'Recarregar a página'
                  ],
                  certa: 1,
                  explicacao: 'Fechar o contexto não libera o microfone.'
                }
              ]
            },
            {
              id: 'desafio-eco',
              tipo: 'desafio',
              titulo: 'Desafio: efeito de eco',
              resumo: 'Monte um eco com DelayNode e realimentação, conferido pelo som.',
              minutos: 22,
              enunciado: `
<p>Escreva <code>eco(ctx, entrada, atraso, retorno)</code>. Ela recebe um nó de entrada e devolve um nó de <strong>saída</strong> (um <code>GainNode</code>) com:</p>
<ul>
  <li>o som original, sem mudança;</li>
  <li>uma repetição depois de <code>atraso</code> segundos, com volume <code>retorno</code>;</li>
  <li>outra depois de <code>2 × atraso</code>, com volume <code>retorno²</code>, e assim por diante (realimentação).</li>
</ul>
<p>Os testes tocam um único "clique" (uma amostra de valor 1) por dentro do seu eco num <code>OfflineAudioContext</code> e medem o que sai: 1 no começo, 0,5 depois do atraso, 0,25 depois de dois atrasos... Curiosidade: num ciclo de realimentação, o navegador acrescenta um bloco de 128 amostras (cerca de 3 ms) a cada volta, então a segunda repetição sai um pouquinho depois de 2 × atraso. Os testes contam com isso.</p>`,
              inicial: `<button id="ouvir">Ouvir</button>

<script>
  function eco(ctx, entrada, atraso, retorno) {
    // devolva o nó de saída
  }

  let ctx;
  document.querySelector('#ouvir').addEventListener('click', () => {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { frequency: 520 });
    const env = new GainNode(ctx, { gain: 0 });
    env.gain.linearRampToValueAtTime(0.3, t + 0.01);
    env.gain.linearRampToValueAtTime(0, t + 0.1);
    osc.connect(env);
    eco(ctx, env, 0.2, 0.5).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  });
</script>
`,
              testes: [
                [
                  'eco devolve um nó de áudio',
                  doc => {
                    const w = doc.defaultView;
                    const ctx = new w.OfflineAudioContext(1, 4410, 44100);
                    const saida = w.eval('eco')(ctx, new w.GainNode(ctx), 0.05, 0.5);
                    return saida instanceof w.AudioNode;
                  }
                ],
                [
                  'O som original passa (pico 1 no começo) e há silêncio antes do primeiro eco',
                  async doc => {
                    const w = doc.defaultView;
                    const ctx = new w.OfflineAudioContext(1, 44100, 44100);
                    const buffer = ctx.createBuffer(1, 1, 44100);
                    buffer.getChannelData(0)[0] = 1;
                    const fonte = new w.AudioBufferSourceNode(ctx, { buffer });
                    w.eval('eco')(ctx, fonte, 0.1, 0.5).connect(ctx.destination);
                    fonte.start(0);
                    const d = (await ctx.startRendering()).getChannelData(0);
                    const pico = (a, b) => d.slice(a, b).reduce((m, v) => Math.max(m, Math.abs(v)), 0);
                    return Math.abs(pico(0, 5) - 1) < 0.01 && pico(50, 4400) < 0.001;
                  }
                ],
                [
                  'Repetições com volume 0,5 e 0,25 depois de 1 e 2 atrasos',
                  async doc => {
                    const w = doc.defaultView;
                    const ctx = new w.OfflineAudioContext(1, 44100, 44100);
                    const buffer = ctx.createBuffer(1, 1, 44100);
                    buffer.getChannelData(0)[0] = 1;
                    const fonte = new w.AudioBufferSourceNode(ctx, { buffer });
                    w.eval('eco')(ctx, fonte, 0.1, 0.5).connect(ctx.destination);
                    fonte.start(0);
                    const d = (await ctx.startRendering()).getChannelData(0);
                    const pico = (a, b) => d.slice(a, b).reduce((m, v) => Math.max(m, Math.abs(v)), 0);
                    // Num ciclo, o navegador soma um bloco de 128 amostras a cada volta: a 2ª repetição sai em ~8.948
                    return (
                      Math.abs(pico(4405, 4416) - 0.5) < 0.02 &&
                      Math.abs(pico(8815, 8960) - 0.25) < 0.02 &&
                      Math.abs(pico(13225, 13500) - 0.125) < 0.02
                    );
                  }
                ]
              ],
              solucao: `<button id="ouvir">Ouvir</button>

<script>
  function eco(ctx, entrada, atraso, retorno) {
    const saida = new GainNode(ctx);
    const linha = new DelayNode(ctx, { delayTime: atraso, maxDelayTime: 2 });
    const volta = new GainNode(ctx, { gain: retorno });

    entrada.connect(saida);     // som original
    entrada.connect(linha);
    linha.connect(volta);
    volta.connect(saida);       // cada repetição sai...
    volta.connect(linha);       // ...e volta para ser atrasada de novo
    return saida;
  }

  let ctx;
  document.querySelector('#ouvir').addEventListener('click', () => {
    ctx ??= new AudioContext();
    const t = ctx.currentTime;
    const osc = new OscillatorNode(ctx, { frequency: 520 });
    const env = new GainNode(ctx, { gain: 0 });
    env.gain.linearRampToValueAtTime(0.3, t + 0.01);
    env.gain.linearRampToValueAtTime(0, t + 0.1);
    osc.connect(env);
    eco(ctx, env, 0.2, 0.5).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  });
</script>`
            }
          ]
        }
      ]
    }
  ]
};
