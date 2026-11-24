// Geradores de passatempos. Usam um sorteio com semente fixa: o mesmo
// produto gera sempre o mesmo PDF, então o gabarito nunca diverge da folha.

export function sorteio(semente = 1) {
  let s = semente >>> 0;
  const proximo = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    numero: proximo,
    inteiro: (min, max) => min + Math.floor(proximo() * (max - min + 1)),
    escolher: (lista) => lista[Math.floor(proximo() * lista.length)],
    embaralhar: (lista) => {
      const l = [...lista];
      for (let i = l.length - 1; i > 0; i--) {
        const j = Math.floor(proximo() * (i + 1));
        [l[i], l[j]] = [l[j], l[i]];
      }
      return l;
    },
  };
}

// "Coração" -> "CORACAO": a grade usa só letras sem acento, como nas revistas.
export const normalizar = (palavra) => palavra
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toUpperCase().replace(/[^A-Z]/g, '');

const DIRECOES = {
  facil: [[0, 1], [1, 0]],
  medio: [[0, 1], [1, 0], [1, 1], [-1, 1]],
  dificil: [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]],
};

/**
 * Monta um caça-palavras.
 * Devolve { grade: string[][], posicoes: [{palavra, original, celulas}] }.
 */
export function cacaPalavras({ palavras, tamanho, nivel = 'medio', semente = 1, alfabeto }) {
  const letrasExtras = alfabeto || 'AAAABCCDEEEEFGHIIIJLMMNNOOOOPQRRSSSTTUUVXZ';
  for (let tentativa = 0; tentativa < 400; tentativa++) {
    const r = sorteio(semente * 7919 + tentativa);
    const grade = Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
    const posicoes = [];
    const ordem = [...palavras].sort((a, b) => normalizar(b).length - normalizar(a).length);
    let ok = true;

    for (const original of ordem) {
      const palavra = normalizar(original);
      if (palavra.length > tamanho) throw new Error(`"${original}" não cabe numa grade ${tamanho}x${tamanho}`);
      let colocada = false;
      for (let t = 0; t < 600 && !colocada; t++) {
        const [dl, dc] = r.escolher(DIRECOES[nivel]);
        const l0 = r.inteiro(0, tamanho - 1);
        const c0 = r.inteiro(0, tamanho - 1);
        const lf = l0 + dl * (palavra.length - 1);
        const cf = c0 + dc * (palavra.length - 1);
        if (lf < 0 || lf >= tamanho || cf < 0 || cf >= tamanho) continue;
        const celulas = [];
        let cabe = true;
        for (let k = 0; k < palavra.length; k++) {
          const l = l0 + dl * k, c = c0 + dc * k;
          if (grade[l][c] !== null && grade[l][c] !== palavra[k]) { cabe = false; break; }
          celulas.push([l, c]);
        }
        if (!cabe) continue;
        celulas.forEach(([l, c], k) => { grade[l][c] = palavra[k]; });
        posicoes.push({ palavra, original, celulas });
        colocada = true;
      }
      if (!colocada) { ok = false; break; }
    }
    if (!ok) continue;

    for (let l = 0; l < tamanho; l++)
      for (let c = 0; c < tamanho; c++)
        if (grade[l][c] === null) grade[l][c] = r.escolher(letrasExtras);

    // Garante que nenhuma palavra apareça duas vezes por acaso (gabarito ambíguo).
    if (posicoes.every(p => contarOcorrencias(grade, p.palavra) === 1)) {
      posicoes.sort((a, b) => palavras.indexOf(a.original) - palavras.indexOf(b.original));
      return { grade, posicoes };
    }
  }
  throw new Error('Não consegui montar o caça-palavras; tente outra semente ou uma grade maior.');
}

function contarOcorrencias(grade, palavra) {
  const n = grade.length;
  let total = 0;
  for (const [dl, dc] of DIRECOES.dificil)
    for (let l = 0; l < n; l++)
      for (let c = 0; c < n; c++) {
        let k = 0;
        while (k < palavra.length) {
          const ll = l + dl * k, cc = c + dc * k;
          if (ll < 0 || ll >= n || cc < 0 || cc >= n || grade[ll][cc] !== palavra[k]) break;
          k++;
        }
        if (k === palavra.length) total++;
      }
  // Palíndromos (ex.: "ANA") aparecem nas duas direções da mesma posição.
  const palindromo = palavra === [...palavra].reverse().join('');
  return palindromo ? total / 2 : total;
}

/** Caça-palavras em SVG. Com `gabarito`, destaca as palavras. */
export function svgCacaPalavras({ grade, posicoes }, { lado = 170, gabarito = false, cor = '#72a325', fonte = 'Fredoka' } = {}) {
  const n = grade.length;
  const passo = 100 / n;
  const letras = grade.flatMap((linha, l) => linha.map((ch, c) =>
    `<text x="${(c + 0.5) * passo}" y="${(l + 0.5) * passo}" dy="0.36em">${ch}</text>`)).join('');
  const marcas = gabarito ? posicoes.map(p => {
    const [l0, c0] = p.celulas[0];
    const [l1, c1] = p.celulas[p.celulas.length - 1];
    return `<line x1="${(c0 + 0.5) * passo}" y1="${(l0 + 0.5) * passo}" x2="${(c1 + 0.5) * passo}" y2="${(l1 + 0.5) * passo}"
      stroke="${cor}" stroke-opacity="0.35" stroke-width="${passo * 0.78}" stroke-linecap="round"/>`;
  }).join('') : '';
  return `<svg viewBox="0 0 100 100" width="${lado}mm" height="${lado}mm" xmlns="http://www.w3.org/2000/svg">
    ${marcas}
    <g font-family="${fonte}" font-weight="600" font-size="${passo * 0.62}" text-anchor="middle" fill="#2b2b2b">${letras}</g>
  </svg>`;
}

/**
 * Labirinto retangular perfeito (um único caminho), por busca em profundidade.
 * Devolve { colunas, linhas, paredes, solucao } para desenhar em SVG.
 */
export function labirinto({ colunas, linhas, semente = 1 }) {
  const r = sorteio(semente);
  const visit = Array.from({ length: linhas }, () => Array(colunas).fill(false));
  // paredes[l][c] = { n, s, e (leste), o (oeste) }
  const paredes = Array.from({ length: linhas }, () =>
    Array.from({ length: colunas }, () => ({ n: true, s: true, e: true, o: true })));
  const pilha = [[0, 0]];
  visit[0][0] = true;
  const viz = [[-1, 0, 'n', 's'], [1, 0, 's', 'n'], [0, 1, 'e', 'o'], [0, -1, 'o', 'e']];
  while (pilha.length) {
    const [l, c] = pilha[pilha.length - 1];
    const opcoes = r.embaralhar(viz).filter(([dl, dc]) => {
      const ll = l + dl, cc = c + dc;
      return ll >= 0 && ll < linhas && cc >= 0 && cc < colunas && !visit[ll][cc];
    });
    if (!opcoes.length) { pilha.pop(); continue; }
    const [dl, dc, a, b] = opcoes[0];
    paredes[l][c][a] = false;
    paredes[l + dl][c + dc][b] = false;
    visit[l + dl][c + dc] = true;
    pilha.push([l + dl, c + dc]);
  }
  // Entrada no canto superior esquerdo, saída no inferior direito.
  paredes[0][0].n = false;
  paredes[linhas - 1][colunas - 1].s = false;

  // Solução por busca em largura.
  const ant = new Map();
  const fila = [[0, 0]];
  const chave = (l, c) => l * colunas + c;
  ant.set(0, null);
  while (fila.length) {
    const [l, c] = fila.shift();
    if (l === linhas - 1 && c === colunas - 1) break;
    for (const [dl, dc, a] of viz) {
      const ll = l + dl, cc = c + dc;
      if (paredes[l][c][a] || ll < 0 || ll >= linhas || cc < 0 || cc >= colunas) continue;
      if (ant.has(chave(ll, cc))) continue;
      ant.set(chave(ll, cc), [l, c]);
      fila.push([ll, cc]);
    }
  }
  const solucao = [];
  let atual = [linhas - 1, colunas - 1];
  while (atual) { solucao.unshift(atual); atual = ant.get(chave(...atual)); }
  return { colunas, linhas, paredes, solucao };
}

export function svgLabirinto(lab, { largura = 170, gabarito = false, cor = '#72a325', espessura = 0.9 } = {}) {
  const { colunas, linhas, paredes, solucao } = lab;
  const p = 10;
  const W = colunas * p, H = linhas * p;
  const seg = [];
  for (let l = 0; l < linhas; l++)
    for (let c = 0; c < colunas; c++) {
      const x = c * p, y = l * p, w = paredes[l][c];
      if (w.n) seg.push(`M${x} ${y}h${p}`);
      if (w.o) seg.push(`M${x} ${y}v${p}`);
      if (l === linhas - 1 && w.s) seg.push(`M${x} ${y + p}h${p}`);
      if (c === colunas - 1 && w.e) seg.push(`M${x + p} ${y}v${p}`);
    }
  const caminho = gabarito
    ? `<polyline points="${p / 2},${-p / 2} ${solucao.map(([l, c]) => `${c * p + p / 2},${l * p + p / 2}`).join(' ')} ${W - p / 2},${H + p / 2}"
        fill="none" stroke="${cor}" stroke-width="${p * 0.32}" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`
    : '';
  const altura = largura * (H + 2 * p) / (W + 2 * p);
  return `<svg viewBox="${-p} ${-p} ${W + 2 * p} ${H + 2 * p}" width="${largura}mm" height="${altura}mm" xmlns="http://www.w3.org/2000/svg">
    ${caminho}
    <path d="${seg.join('')}" stroke="#2b2b2b" stroke-width="${espessura}" stroke-linecap="round" fill="none"/>
  </svg>`;
}
