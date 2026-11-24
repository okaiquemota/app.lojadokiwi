// Motor da fábrica: transforma as páginas HTML de um produto em PDF A4 e em
// imagens (prévia das páginas, capa e galeria da vitrine).
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

export const FABRICA = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
export const RAIZ = path.dirname(FABRICA);
export const SAIDA = path.join(FABRICA, 'saida');

const url = (arquivo) => pathToFileURL(arquivo).href;

// Logo da loja embutido (os PDFs não dependem de internet para abrir).
export const LOGO_SVG = readFileSync(path.join(RAIZ, 'imagens', 'logo.svg'), 'utf8')
  .replace(/<svg /, '<svg class="logo-loja" ');
export const KIWI_SVG = readFileSync(path.join(RAIZ, 'imagens', 'kiwi.svg'), 'utf8')
  .replace(/<svg /, '<svg class="kiwi-loja" ');

export const rodape = (numero, extra = '') => `
  <div class="rodape-loja">
    <span><span class="kiwi">Loja do Kiwi</span> · lojadokiwi.com.br${extra ? ' · ' + extra : ''}</span>
    <span>Uso pessoal e em sala de aula · ${numero}</span>
  </div>`;

export function documento({ titulo, css = '', paginas }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>${titulo}</title>
<link rel="stylesheet" href="${url(path.join(FABRICA, 'fontes', 'fontes.css'))}">
<link rel="stylesheet" href="${url(path.join(FABRICA, 'base.css'))}">
<style>${css}</style>
</head>
<body>
${paginas.join('\n')}
</body>
</html>`;
}

const esperarFontes = (page) => page.evaluate(() => document.fonts.ready.then(() => true));

// Converte um PNG em WebP no tamanho pedido (reaproveita o Pillow, que a loja já usa).
export function paraWebp(origem, destino, largura, qualidade = 84) {
  mkdirSync(path.dirname(destino), { recursive: true });
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
o, d, w, q = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
im = Image.open(o).convert('RGB')
if im.width > w:
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
im.save(d, 'WEBP', quality=q, method=6)
`, origem, destino, String(largura), String(qualidade)]);
  return statSync(destino).size;
}

/**
 * Gera o PDF e a prévia (PNG) de cada página.
 * Devolve { pdf, paginas: [png...], totalPaginas, bytes }.
 */
export async function renderizarPdf({ id, arquivo, html }) {
  const pasta = path.join(SAIDA, id);
  const pastaPaginas = path.join(pasta, 'paginas');
  mkdirSync(pastaPaginas, { recursive: true });

  const htmlPath = path.join(pasta, `${arquivo}.html`);
  writeFileSync(htmlPath, html);
  const pdfPath = path.join(pasta, `${arquivo}.pdf`);

  const browser = await chromium.launch();
  try {
    // Prévias: A4 a 96 dpi (794 x 1123) com fator 1,5 -> ~1190 px de largura.
    const page = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1.5 });
    await page.goto(url(htmlPath), { waitUntil: 'load' });
    await esperarFontes(page);
    await page.emulateMedia({ media: 'print' });

    await page.pdf({ path: pdfPath, preferCSSPageSize: true, printBackground: true });

    const elementos = await page.$$('.pagina');
    const paginas = [];
    for (let i = 0; i < elementos.length; i++) {
      const png = path.join(pastaPaginas, `p${String(i + 1).padStart(2, '0')}.png`);
      await elementos[i].screenshot({ path: png });
      paginas.push(png);
    }
    return { pdf: pdfPath, paginas, totalPaginas: elementos.length, bytes: statSync(pdfPath).size };
  } finally {
    await browser.close();
  }
}

/** Fotografa um HTML qualquer (capa, banner) em PNG. */
export async function fotografar({ html, destino, largura, altura, escala = 2 }) {
  mkdirSync(path.dirname(destino), { recursive: true });
  const tmp = destino.replace(/\.png$/, '.html');
  writeFileSync(tmp, html);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: largura, height: altura }, deviceScaleFactor: escala });
    await page.goto(url(tmp), { waitUntil: 'load' });
    await esperarFontes(page);
    await page.screenshot({ path: destino, clip: { x: 0, y: 0, width: largura, height: altura } });
  } finally {
    await browser.close();
  }
  return destino;
}

export const existe = existsSync;
