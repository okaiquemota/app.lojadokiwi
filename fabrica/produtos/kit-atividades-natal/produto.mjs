// Kit de Atividades de Natal (4 a 9 anos): passatempos, matemática,
// coordenação e jogos para imprimir. Sem tema religioso, para qualquer família ou escola.
import { rodape, LOGO_SVG } from '../../lib/render.mjs';
import { icone, corpo, CREDITOS } from '../../lib/icones.mjs';
import { cacaPalavras, svgCacaPalavras, labirinto, svgLabirinto, sorteio } from '../../lib/quebra-cabecas.mjs';

export const info = {
  id: 'kit-atividades-natal',
  arquivo: 'kit-atividades-natal-loja-do-kiwi',
  ordem: 20,
  nome: 'Kit de Atividades de Natal',
  subtitulo: '24 Páginas para Crianças de 4 a 9 Anos',
  categoria: 'educacao',
  categoriaNome: 'Educação',
  preco: 12.90,
  imagemAlt: 'Páginas do Kit de Atividades de Natal: labirinto, pinte pelo código, jogo dos 7 erros e bingo',
  descricao: 'Kit com 24 páginas de atividades de Natal para imprimir: caça-palavras, labirintos, contas, pinte pelo código, jogo dos 7 erros, jogo da memória, bingo, enfeites para colorir e carta ao Papai Noel.',
  descricaoDetalhada: 'Diversão sem tela para as férias e para a última semana de aula. São atividades de vários níveis, que trabalham leitura, contagem, raciocínio lógico, atenção e coordenação motora, além de jogos para brincar em família: jogo da memória com 12 pares e bingo de Natal com 6 cartelas. Tudo com gabarito para o adulto conferir.',
  itens: [
    'Carta ao Papai Noel e página de desenho',
    '2 caça-palavras (fácil e médio) e 2 labirintos',
    'Ligue às sombras, conte e escreva, continhas e sequências',
    'Pinte pelo código (pixel art) e desenho de simetria',
    'Jogo dos 7 erros',
    'Jogo da memória com 12 pares para recortar',
    'Bingo de Natal: 6 cartelas e fichas de sorteio',
    'Enfeites para colorir, recortar e pendurar na árvore',
    'Certificado de Ajudante Oficial do Papai Noel e gabarito',
  ],
  idealPara: [
    'Crianças de 4 a 9 anos em casa ou nas férias',
    'Professores de educação infantil e fundamental I',
    'Festas de fim de ano e cantinho das crianças na ceia',
    'Viagens e dias de chuva, sem tela',
  ],
  observacoes: [
    'Para o jogo da memória e o bingo, prefira papel mais grosso (180 g).',
  ],
  capa: {
    cor: '#2f8a46', corClara: '#8fd49f',
    topo: 'PDF PARA IMPRIMIR',
    titulo: 'Atividades<br><em>de Natal</em>',
    sub: 'Para crianças de 4 a 9 anos',
    folhas: [11, 14, 16],
  },
  galeria: [5, 11, 13, 14, 16],
};

const VERM = '#c8342b', VERDE = '#2f8a46', OURO = '#e0a826', AZUL = '#2f7fc0';

export const css = `
  .pagina { padding-top: 14mm; }
  .topo-ativ { display: flex; align-items: center; gap: 4mm; margin-bottom: 4mm; }
  .topo-ativ .ic { flex: 0 0 auto; }
  .topo-ativ h2 { font-size: 24pt; color: ${VERDE}; }
  .topo-ativ p { font: 600 11pt var(--texto); color: #555; margin-top: 1mm; line-height: 1.35; }
  .nome-data { display: flex; gap: 6mm; margin-bottom: 5mm; font: 700 9.5pt var(--texto); color: #888; }
  .nome-data span { flex: 1; border-bottom: 1.2px solid #ccc; padding-bottom: 1mm; }
  .nome-data span:last-child { flex: 0 0 40mm; }
  .caixa { border-radius: 5mm; padding: 5mm; }
  .creditos { position: absolute; left: 15mm; right: 15mm; bottom: 13mm; font-size: 7pt; color: #aaa; }

  .capa-k { display: flex; flex-direction: column; align-items: center; text-align: center;
    background: radial-gradient(circle at 50% 0%, #e3f5e7, #fff 62%); }
  .capa-k .logo-loja { height: 11mm; width: auto; margin-top: 4mm; }
  .capa-k h1 { font-size: 52pt; color: ${VERDE}; margin-top: 16mm; line-height: .95; }
  .capa-k h1 span { display: block; color: ${VERM}; font-size: 66pt; }
  .capa-k .sub { font: 700 15pt var(--texto); color: #555; margin-top: 6mm; }
  .capa-k .cena { margin-top: 12mm; display: flex; align-items: flex-end; gap: 2mm; }
  .capa-k .dono { margin-top: auto; margin-bottom: 14mm; width: 130mm; text-align: left; font: 700 11pt var(--texto); color: #777; border-bottom: 1.5px solid #bbb; padding-bottom: 2mm; }

  .carta { border: 2mm solid ${VERM}; border-radius: 6mm; height: 252mm; padding: 10mm 12mm; position: relative; background: repeating-linear-gradient(180deg, transparent 0 10.4mm, #e9d9d9 10.4mm 10.7mm); background-position: 0 41mm; }
  .carta h2 { font-size: 28pt; color: ${VERM}; background: #fff; display: inline-block; padding-right: 4mm; }
  .carta .canto { position: absolute; right: 8mm; top: 6mm; }
  .carta .desenho { position: absolute; left: 12mm; right: 12mm; bottom: 10mm; height: 70mm; border: 1.5px dashed #c9a; border-radius: 4mm; background: #fff; display: flex; align-items: flex-start; justify-content: center; padding-top: 3mm; font: 700 10pt var(--texto); color: #a88; }

  .lista-palavras { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2.5mm; margin-top: 5mm; }
  .lista-palavras span { font: 700 11.5pt var(--texto); text-transform: uppercase; display: flex; align-items: center; gap: 2mm; }
  .lista-palavras span::before { content: ''; width: 4mm; height: 4mm; border: 1.5px solid #aaa; border-radius: 1mm; }

  .lab-wrap { position: relative; display: flex; justify-content: center; }
  .lab-wrap .ini, .lab-wrap .fim { position: absolute; text-align: center; font: 800 9pt var(--texto); color: #555; }

  .sombras { display: grid; grid-template-columns: 1fr 1fr; row-gap: 3mm; column-gap: 60mm; padding: 0 8mm; }
  .sombras div { height: 33mm; display: flex; align-items: center; }
  .sombras div.dir { justify-content: flex-end; }
  .sombras .pt { width: 4mm; height: 4mm; border-radius: 50%; background: #333; margin: 0 3mm; }
  .sombra * { fill: #3a3a3a !important; stroke: #3a3a3a !important; }

  .conte { display: grid; gap: 4mm; }
  .conte .linha { display: flex; align-items: center; gap: 4mm; border-radius: 4mm; padding: 3mm 5mm; }
  .conte .grupo { flex: 1; display: flex; flex-wrap: wrap; gap: 1.5mm; }
  .conte .resp { flex: 0 0 22mm; height: 18mm; border: 2px dashed #999; border-radius: 3mm; background: #fff; }

  .contas { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 8mm; }
  .conta { display: flex; align-items: center; gap: 2mm; font: 700 18pt var(--titulo); color: #444; background: #f6faf3; border-radius: 4mm; padding: 3mm 4mm; min-height: 22mm; }
  .conta .q { width: 16mm; height: 14mm; border: 2px dashed #999; border-radius: 3mm; background: #fff; }
  .conta.num { font-size: 22pt; justify-content: center; }
  .subt { font: 600 15pt var(--titulo); color: ${AZUL}; margin: 6mm 0 3mm; }

  .seq { display: grid; gap: 5mm; }
  .seq .linha { display: flex; align-items: center; gap: 3mm; background: #fdf6e6; border-radius: 4mm; padding: 3mm 4mm; }
  .seq .vazio { width: 22mm; height: 22mm; border: 2px dashed #b99; border-radius: 3mm; background: #fff; }

  .pixel { border-collapse: collapse; margin: 0 auto; }
  .pixel td { width: 9.6mm; height: 9.6mm; border: 0.8px solid #bdbdbd; text-align: center; font: 700 9pt var(--texto); color: #666; }
  .legenda { display: flex; justify-content: center; gap: 4mm; margin-top: 6mm; flex-wrap: wrap; }
  .legenda span { display: flex; align-items: center; gap: 1.8mm; font: 700 11pt var(--texto); }
  .legenda i { width: 7mm; height: 7mm; border-radius: 1.5mm; display: inline-flex; align-items: center; justify-content: center; font-style: normal; color: #fff; font-size: 9pt; }

  .simetria { display: flex; flex-direction: column; align-items: center; gap: 8mm; }
  .simetria table { border-collapse: collapse; }
  .simetria td { width: 8.6mm; height: 8.6mm; border: 0.8px solid #c8c8c8; }
  .simetria td.eixo { border-right: 2px dashed ${VERM}; }

  .cenas { display: flex; flex-direction: column; align-items: center; gap: 5mm; }
  .cenas svg { border-radius: 4mm; border: 1.5px solid #cfe3d4; }
  .erros-cont { display: flex; gap: 3mm; justify-content: center; margin-top: 2mm; }
  .erros-cont i { width: 9mm; height: 9mm; border-radius: 50%; border: 2px solid ${VERM}; font: 700 10pt/8.5mm var(--titulo); color: ${VERM}; text-align: center; font-style: normal; }

  .cartas { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(4, 1fr); height: 250mm; }
  .carta-mem { border: 1px dashed #bbb; display: flex; align-items: center; justify-content: center; background: #fff; }
  .carta-mem div { width: 82%; height: 82%; border-radius: 4mm; display: flex; align-items: center; justify-content: center; }

  .bingos { display: grid; grid-template-rows: 1fr 1fr; gap: 8mm; height: 250mm; }
  .cartela { border-radius: 6mm; padding: 5mm 7mm; display: flex; flex-direction: column; }
  .cartela h3 { font-size: 22pt; color: #fff; text-align: center; letter-spacing: .3em; margin-bottom: 3mm; }
  .cartela .g { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr); gap: 2.5mm; }
  .cartela .g div { background: #fff; border-radius: 3mm; display: flex; align-items: center; justify-content: center; }
  .fichas { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); height: 226mm; }
  .ficha-b { border: 1px dashed #bbb; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2mm; font: 700 10pt var(--texto); color: #444; }

  .enfeites { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); height: 238mm; }
  .enfeite { border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center; position: relative; }
  .enfeite::before { content: ''; position: absolute; top: 4mm; left: 50%; width: 4mm; height: 4mm; margin-left: -2mm; border: 1.3px solid #999; border-radius: 50%; }

  .moldura { height: 220mm; border: 2.5mm solid ${OURO}; border-radius: 6mm; position: relative; background: #fff; }
  .moldura .ic { position: absolute; }

  .cert { height: 262mm; border: 3mm double ${VERM}; border-radius: 6mm; padding: 14mm; display: flex; flex-direction: column; align-items: center; text-align: center; background: radial-gradient(circle at 50% 0%, #fdeceb, #fff 60%); }
  .cert .logo-loja { height: 9mm; width: auto; }
  .cert h2 { font-size: 34pt; color: ${VERM}; margin-top: 10mm; }
  .cert h3 { font-size: 20pt; color: ${VERDE}; }
  .cert p { font-size: 13pt; line-height: 1.6; max-width: 140mm; margin-top: 8mm; }
  .cert .l { width: 140mm; border-bottom: 1.5px solid #555; height: 14mm; }
  .cert .assin { margin-top: auto; display: flex; gap: 20mm; }
  .cert .assin div { width: 60mm; border-top: 1.2px solid #777; padding-top: 2mm; font: 700 10pt var(--texto); color: #555; }

  .gab { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 8mm; }
  .gab h3 { font-size: 12pt; color: ${VERDE}; margin-bottom: 2mm; }
  .gab .txt { font-size: 10.5pt; line-height: 1.6; }
`;

// ---------- utilidades

const cab = (ic, titulo, texto, cor = VERDE) => `
  <div class="topo-ativ">
    <div class="ic">${icone(ic, { tamanho: '16mm' })}</div>
    <div><h2 style="color:${cor}">${titulo}</h2><p>${texto}</p></div>
  </div>
  <div class="nome-data"><span>Nome:</span><span>Data:</span></div>`;

// Ícone dentro de uma cena SVG maior.
const noSvg = (nome, x, y, t, extra = '') => `<svg x="${x}" y="${y}" width="${t}" height="${t}" viewBox="0 0 32 32" ${extra}>${corpo(nome)}</svg>`;

// ---------- jogo dos 7 erros

const CENA = [
  ['arvore', 52, 18, 92], ['presente', 38, 98, 30], ['presente', 88, 104, 24], ['estrela', 152, 8, 18],
  ['sino', 150, 36, 24], ['meia', 160, 70, 26], ['vela', 128, 94, 24], ['laco', 14, 26, 22],
  ['biscoito', 172, 106, 24], ['ursinho', 112, 112, 22], ['floco', 26, 70, 14],
];
// Cada erro: índice do item e o que muda na cena B.
const ERROS = [
  { i: 2, tipo: 'some' },
  { i: 7, tipo: 'cor' },
  { i: 5, tipo: 'espelho' },
  { i: 4, tipo: 'tamanho', t: 32 },
  { i: 8, tipo: 'troca', nome: 'coracao' },
  { i: 3, tipo: 'move', x: 178, y: 14 },
  { tipo: 'extra', item: ['floco', 104, 16, 16] },
];

function cena(versaoB, gabarito = false) {
  const itens = CENA.map(([nome, x, y, t], i) => {
    const e = versaoB ? ERROS.find(e => e.i === i) : null;
    if (!e) return noSvg(nome, x, y, t);
    if (e.tipo === 'some') return '';
    if (e.tipo === 'cor') return noSvg(nome, x, y, t, 'filter="url(#matiz)"');
    if (e.tipo === 'espelho') return `<g transform="translate(${2 * x + t} 0) scale(-1 1)">${noSvg(nome, x, y, t)}</g>`;
    if (e.tipo === 'tamanho') return noSvg(nome, x - (e.t - t) / 2, y - (e.t - t) / 2, e.t);
    if (e.tipo === 'troca') return noSvg(e.nome, x, y, t);
    if (e.tipo === 'move') return noSvg(nome, e.x, e.y, t);
    return '';
  }).join('');
  const extra = versaoB ? ERROS.filter(e => e.tipo === 'extra').map(e => noSvg(...e.item)).join('') : '';
  const marcas = gabarito ? ERROS.map(e => {
    const [, x, y, t] = e.tipo === 'extra' ? e.item : CENA[e.i];
    const cx = (e.tipo === 'move' ? e.x : x) + t / 2, cy = (e.tipo === 'move' ? e.y : y) + t / 2;
    return `<circle cx="${cx}" cy="${cy}" r="${Math.max(t, e.t || 0) * 0.68}" fill="none" stroke="${VERM}" stroke-width="2.2"/>`;
  }).join('') : '';
  return `<svg viewBox="0 0 200 140" width="${gabarito ? 80 : 150}mm" height="${gabarito ? 56 : 105}mm" xmlns="http://www.w3.org/2000/svg">
    <defs><filter id="matiz"><feColorMatrix type="hueRotate" values="200"/></filter></defs>
    <rect width="200" height="140" fill="#eaf4fb"/>
    <path d="M0 112 Q50 100 100 110 T200 106 V140 H0 Z" fill="#fff"/>
    <path d="M0 112 Q50 100 100 110 T200 106" fill="none" stroke="#cfe3f2" stroke-width="1.5"/>
    ${itens}${extra}${marcas}
  </svg>`;
}

// ---------- pinte pelo código (árvore em pixel art)

const ARVORE_PIXEL = ['y', 'yyy', 'y', 'ggg', 'ggrgg', 'gaggggg', 'gggggyggg', 'ggggg', 'gggrggg', 'ggyggggag',
  'gggggggrggg', 'ggggggg', 'gaggggrgg', 'ggggyggggag', 'gggrgggggggyg', 'bbb', 'bbb', 'rrrrrrr'];
const CORES_PIXEL = { g: [1, '#2f8a46', 'verde'], y: [2, '#f2b632', 'amarelo'], r: [3, '#c8342b', 'vermelho'], a: [4, '#2f7fc0', 'azul'], b: [5, '#8a5a35', 'marrom'] };

function tabelaPixel() {
  const L = 15;
  return `<table class="pixel">${ARVORE_PIXEL.map(linha => {
    if (linha.length % 2 === 0 || linha.length > L) throw new Error(`linha de pixel inválida: ${linha}`);
    const pad = (L - linha.length) / 2;
    const cel = '.'.repeat(pad) + linha + '.'.repeat(pad);
    return `<tr>${[...cel].map(c => `<td>${c === '.' ? '' : CORES_PIXEL[c][0]}</td>`).join('')}</tr>`;
  }).join('')}</table>`;
}

// ---------- simetria

const CORACAO_META = ['..rr..', '.rrrr.', 'rrrrrr', 'rrrrrr', 'rrrrrr', '.rrrrr', '..rrrr', '...rrr', '....rr', '.....r'];
const ARVORE_META = ['.....y', '....yy', '.....g', '....gg', '...ggg', '....gg', '..gggg', '.ggggg', '.....b', '.....b'];
function tabelaSimetria(meta, cor) {
  return `<table>${meta.map(l => `<tr>${[...l].map((c, i) => `<td class="${i === 5 ? 'eixo' : ''}" style="${c !== '.' ? `background:${c === 'y' ? OURO : c === 'b' ? '#8a5a35' : cor}` : ''}"></td>`).join('')}${'<td></td>'.repeat(6)}</tr>`).join('')}</table>`;
}

// ---------- página principal

export function paginas() {
  const r = sorteio(2026);
  const out = [];
  const pg = (classe, conteudo, comRodape = true) =>
    out.push(`<section class="pagina ${classe}">${conteudo}${comRodape ? rodape(`${out.length + 1}/@@TOTAL@@`) : ''}</section>`);

  // 1 — capa
  pg('capa-k', `
    ${LOGO_SVG}
    <h1>Atividades <span>de Natal</span></h1>
    <p class="sub">Brincar, pensar e criar até a noite de Natal</p>
    <div class="cena">${icone('presente', { tamanho: '28mm' })}${icone('papai-noel', { tamanho: '40mm' })}${icone('arvore', { tamanho: '58mm' })}${icone('boneco-neve', { tamanho: '36mm' })}</div>
    <div class="dono">Este kit pertence a:</div>
  `, false);

  // 2 — carta ao Papai Noel
  pg('', `<div class="carta">
      <div class="canto">${icone('papai-noel', { tamanho: '24mm' })}</div>
      <h2>Querido Papai Noel,</h2>
      <div class="desenho">Desenhe aqui o presente dos seus sonhos</div>
    </div>`);

  // 3 e 4 — caça-palavras
  const cp1 = ['NATAL', 'ESTRELA', 'SINO', 'PRESENTE', 'RENA', 'VELA', 'BOLA', 'GORRO'];
  const cp2 = ['PAPAI NOEL', 'TRENÓ', 'BISCOITO', 'PISCA-PISCA', 'GUIRLANDA', 'CEIA', 'PANETONE', 'FAMÍLIA', 'ENFEITE', 'ALEGRIA'];
  const j1 = cacaPalavras({ palavras: cp1, tamanho: 10, nivel: 'facil', semente: 11 });
  const j2 = cacaPalavras({ palavras: cp2, tamanho: 12, nivel: 'medio', semente: 23 });
  pg('', `${cab('estrela', 'Caça-palavras de Natal', 'Encontre as 8 palavras. Elas estão na horizontal (→) e na vertical (↓).')}
    <div class="caixa" style="background:#eef7e1;display:flex;justify-content:center">${svgCacaPalavras(j1, { lado: 150 })}</div>
    <div class="lista-palavras">${cp1.map(p => `<span>${p}</span>`).join('')}</div>`);
  pg('', `${cab('arvore', 'Caça-palavras desafio', 'Agora são 10 palavras, também na diagonal. Sem espaço e sem acento: PAPAINOEL, TRENO...')}
    <div class="caixa" style="background:#e6f1fb;display:flex;justify-content:center">${svgCacaPalavras(j2, { lado: 156 })}</div>
    <div class="lista-palavras">${cp2.map(p => `<span>${p}</span>`).join('')}</div>`);

  // 5 e 6 — labirintos
  const l1 = labirinto({ colunas: 8, linhas: 9, semente: 5 });
  const l2 = labirinto({ colunas: 13, linhas: 16, semente: 9 });
  pg('', `${cab('papai-noel', 'Ajude o Papai Noel', 'Trace o caminho do Papai Noel até o presente sem atravessar as paredes.', VERM)}
    <div class="lab-wrap">${svgLabirinto(l1, { largura: 160, espessura: 1.2 })}
      <div class="ini" style="left:6mm;top:-2mm">${icone('papai-noel', { tamanho: '15mm' })}</div>
      <div class="fim" style="right:6mm;bottom:-2mm">${icone('presente', { tamanho: '15mm' })}</div>
    </div>`);
  pg('', `${cab('biscoito', 'Labirinto do biscoito', 'Leve o biscoito até o copo de leite do Papai Noel! Este é mais difícil: vá com calma.', '#8a5a35')}
    <div class="lab-wrap">${svgLabirinto(l2, { largura: 150, espessura: 1 })}
      <div class="ini" style="left:2mm;top:-4mm">${icone('biscoito', { tamanho: '14mm' })}</div>
      <div class="fim" style="right:2mm;bottom:-4mm">${icone('leite', { tamanho: '14mm' })}</div>
    </div>`);

  // 7 — ligue às sombras
  const sombrasItens = ['sino', 'rena', 'arvore', 'boneco-neve', 'treno', 'presente'];
  const sombrasDir = r.embaralhar(sombrasItens);
  pg('', `${cab('sino', 'Ligue cada desenho à sua sombra', 'Observe o formato com atenção e trace uma linha de um ponto até o outro.', OURO)}
    <div class="sombras">
      ${sombrasItens.map((n, i) => `<div>${icone(n, { tamanho: '30mm' })}<span class="pt"></span></div>
        <div class="dir"><span class="pt"></span>${icone(sombrasDir[i], { tamanho: '30mm', classe: 'sombra' })}</div>`).join('')}
    </div>`);

  // 8 — conte e escreva
  const contagem = [['estrela', 3], ['pirulito', 5], ['sino', 2], ['presente', 6], ['biscoito', 4], ['vela', 7]];
  pg('', `${cab('pirulito', 'Conte e escreva', 'Quantos desenhos há em cada fileira? Escreva o número no quadrinho.', VERM)}
    <div class="conte">${contagem.map(([n, q], i) => `<div class="linha" style="background:${i % 2 ? '#fdf2f1' : '#f2f8ee'}">
      <div class="grupo">${Array(q).fill(icone(n, { tamanho: '17mm' })).join('')}</div><div class="resp"></div></div>`).join('')}</div>`);

  // 9 — continhas
  const somasIcone = [['presente', 2, 1], ['estrela', 3, 2], ['bala', 1, 4], ['sino', 2, 2]];
  const contas = [[4, 3, '+'], [6, 2, '+'], [5, 5, '+'], [9, 4, '-'], [8, 3, '-'], [7, 6, '+'], [10, 7, '-'], [12, 5, '-']];
  pg('', `${cab('presente', 'Matemática de Natal', 'Conte os desenhos e resolva as continhas.', AZUL)}
    <div class="contas" style="grid-template-columns:1fr">${somasIcone.map(([n, a, b]) => `<div class="conta">
      ${Array(a).fill(icone(n, { tamanho: '13mm' })).join('')} + ${Array(b).fill(icone(n, { tamanho: '13mm' })).join('')} = <span class="q"></span></div>`).join('')}</div>
    <div class="subt">Agora só com números:</div>
    <div class="contas">${contas.map(([a, b, op]) => `<div class="conta num">${a} ${op === '-' ? '−' : '+'} ${b} = <span class="q"></span></div>`).join('')}</div>`);

  // 10 — sequências
  const seqs = [['estrela', 'laco'], ['arvore', 'arvore', 'sino'], ['presente', 'meia', 'papai-noel'], ['vela', 'estrela', 'estrela'], ['biscoito', 'leite'], ['floco', 'rena', 'sino', 'rena']];
  pg('', `${cab('arvore', 'Complete a sequência', 'Descubra o padrão e desenhe o que vem no lugar do quadrinho vazio.')}
    <div class="seq">${seqs.map(s => {
      const itens = Array.from({ length: 6 }, (_, i) => s[i % s.length]);
      return `<div class="linha">${itens.map(n => icone(n, { tamanho: '22mm' })).join('')}<span class="vazio"></span></div>`;
    }).join('')}</div>`);

  // 11 — pinte pelo código
  pg('', `${cab('arvore', 'Pinte pelo código', 'Pinte cada quadrinho com a cor do número. Os quadrinhos sem número ficam brancos.')}
    ${tabelaPixel()}
    <div class="legenda">${Object.values(CORES_PIXEL).map(([n, cor, nome]) => `<span><i style="background:${cor}">${n}</i>${nome}</span>`).join('')}</div>`);

  // 12 — simetria
  pg('', `${cab('coracao', 'Desenho espelhado', 'Pinte os quadrinhos do lado direito para completar o desenho, como num espelho.', VERM)}
    <div class="simetria">${tabelaSimetria(CORACAO_META, VERM)}${tabelaSimetria(ARVORE_META, VERDE)}</div>`);

  // 13 — 7 erros
  pg('', `${cab('meia', 'Jogo dos 7 erros', 'As duas cenas parecem iguais, mas há 7 diferenças. Circule-as na cena de baixo!', VERM)}
    <div class="cenas">${cena(false)}${cena(true)}
      <div class="erros-cont">${[1, 2, 3, 4, 5, 6, 7].map(n => `<i>${n}</i>`).join('')}</div></div>`);

  // 14 e 15 — jogo da memória
  const memoria = ['estrela', 'arvore', 'presente', 'sino', 'vela', 'floco', 'pirulito', 'rena', 'meia', 'biscoito', 'papai-noel', 'boneco-neve'];
  const fundos = ['#fdecea', '#eaf6ee', '#fff5dc', '#e8f1fb'];
  for (let p = 0; p < 2; p++) {
    pg('', `<div class="tesoura">✂ Jogo da memória: recorte as 24 cartas (12 pares) nas linhas tracejadas. Folha ${p + 1} de 2.</div>
      <div class="cartas">${r.embaralhar(memoria).map((n, i) => `<div class="carta-mem"><div style="background:${fundos[i % 4]}">${icone(n, { tamanho: '36mm' })}</div></div>`).join('')}</div>`);
  }

  // 16 a 18 — bingo (6 cartelas) e 19 — fichas
  const bingo = [['estrela', 'Estrela'], ['arvore', 'Árvore'], ['presente', 'Presente'], ['sino', 'Sino'], ['vela', 'Vela'], ['floco', 'Floco de neve'],
    ['pirulito', 'Pirulito'], ['rena', 'Rena'], ['meia', 'Meias'], ['biscoito', 'Biscoito'], ['papai-noel', 'Papai Noel'], ['boneco-neve', 'Boneco de neve'],
    ['treno', 'Trenó'], ['luvas', 'Luvas'], ['cachecol', 'Cachecol'], ['ursinho', 'Ursinho']];
  const coresBingo = [VERM, VERDE, AZUL, OURO, '#8a4fd8', '#d1457f'];
  const cartelas = [];
  const vistas = new Set();
  while (cartelas.length < 6) {
    const c = r.embaralhar(bingo).slice(0, 9);
    const chave = c.map(x => x[0]).sort().join();
    if (!vistas.has(chave)) { vistas.add(chave); cartelas.push(c); }
  }
  for (let p = 0; p < 3; p++) {
    pg('', `<div class="tesoura">✂ Bingo de Natal: recorte as cartelas. Use feijões ou botões para marcar.</div>
      <div class="bingos">${cartelas.slice(p * 2, p * 2 + 2).map((c, k) => `<div class="cartela" style="background:${coresBingo[p * 2 + k]}">
        <h3>BINGO</h3><div class="g">${c.map(([n]) => `<div>${icone(n, { tamanho: '24mm' })}</div>`).join('')}</div></div>`).join('')}</div>`);
  }
  pg('', `${cab('sino', 'Fichas do bingo', 'Recorte as fichas, dobre e coloque num saquinho. Sorteie uma de cada vez e diga o nome em voz alta. Quem completar a cartela grita BINGO!', OURO)}
    <div class="fichas">${bingo.map(([n, nome]) => `<div class="ficha-b">${icone(n, { tamanho: '24mm' })}${nome}</div>`).join('')}</div>`);

  // 20 — enfeites para colorir
  pg('', `${cab('sino', 'Enfeites para a árvore', 'Pinte, recorte, faça um furinho no círculo e pendure com uma linha.', VERM)}
    <div class="enfeites">${['sino', 'presente', 'boneco-neve', 'luvas', 'laco', 'vela'].map(n => `<div class="enfeite">${icone(n, { tamanho: '58mm', estilo: 'contorno' })}</div>`).join('')}</div>`);

  // 21 — desenhe
  pg('', `${cab('estrela', 'Meu Natal', 'Desenhe como vai ser o seu Natal: quem vai estar com você, a comida, a decoração...', OURO)}
    <div class="moldura">
      <div class="ic" style="top:-8mm;left:-8mm">${icone('estrela', { tamanho: '20mm' })}</div>
      <div class="ic" style="bottom:-8mm;right:-8mm">${icone('presente', { tamanho: '20mm' })}</div>
    </div>`);

  // 22 — certificado
  pg('', `<div class="cert">
      ${LOGO_SVG}
      <h2>Certificado</h2>
      <h3>Ajudante Oficial do Papai Noel</h3>
      <p>Este certificado é entregue a</p>
      <div class="l"></div>
      <p>por completar o Kit de Atividades de Natal com muita atenção, criatividade e alegria!</p>
      <div style="margin-top:10mm">${icone('papai-noel', { tamanho: '34mm' })}</div>
      <div class="assin"><div>Data</div><div>Papai Noel</div></div>
    </div>`, false);

  // 23 e 24 — gabarito
  const respSombras = sombrasItens.map((n, i) => `${i + 1}ª figura → ${sombrasDir.indexOf(n) + 1}ª sombra`).join('<br>');
  const respSeq = seqs.map((s, i) => `${i + 1}) ${{ estrela: 'estrela', laco: 'laço', arvore: 'árvore', sino: 'sino', presente: 'presente', meia: 'meia', 'papai-noel': 'Papai Noel', vela: 'vela', biscoito: 'biscoito', leite: 'copo de leite', floco: 'floco de neve', rena: 'rena' }[s[6 % s.length]]}`).join(' · ');
  pg('', `${cab('estrela', 'Gabarito', 'Para o adulto conferir (sem espiar antes, combinado?).')}
    <div class="gab">
      <div><h3>Caça-palavras de Natal</h3>${svgCacaPalavras(j1, { lado: 80, gabarito: true })}</div>
      <div><h3>Caça-palavras desafio</h3>${svgCacaPalavras(j2, { lado: 80, gabarito: true, cor: AZUL })}</div>
      <div><h3>Ajude o Papai Noel</h3>${svgLabirinto(l1, { largura: 72, gabarito: true, espessura: 1.4 })}</div>
      <div><h3>Labirinto do biscoito</h3>${svgLabirinto(l2, { largura: 66, gabarito: true, espessura: 1.2 })}</div>
    </div>`);
  pg('', `${cab('presente', 'Gabarito (continuação)', 'Respostas das demais atividades.')}
    <div class="gab">
      <div><h3>Jogo dos 7 erros</h3>${cena(true, true)}</div>
      <div><h3>Conte e escreva</h3><p class="txt">${contagem.map(([, q], i) => `${i + 1}ª fileira: ${q}`).join('<br>')}</p></div>
      <div><h3>Ligue às sombras</h3><p class="txt">${respSombras}</p></div>
      <div><h3>Matemática de Natal</h3><p class="txt">${somasIcone.map(([, a, b]) => a + b).join(' · ')}<br>${contas.map(([a, b, op]) => `${a} ${op === '-' ? '−' : '+'} ${b} = ${op === '-' ? a - b : a + b}`).join('<br>')}</p></div>
      <div style="grid-column:1/-1"><h3>Complete a sequência</h3><p class="txt">${respSeq}</p></div>
    </div>
    <p class="creditos">${CREDITOS}</p>`);

  return out.map(p => p.replace('@@TOTAL@@', out.length));
}
