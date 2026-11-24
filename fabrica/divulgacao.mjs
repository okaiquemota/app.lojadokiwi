#!/usr/bin/env node
// Imagens e legenda para divulgar um produto no Instagram, WhatsApp e Pinterest.
//
//   node fabrica/divulgacao.mjs kit-amigo-secreto     # um produto
//   node fabrica/divulgacao.mjs                       # todos
//
// Gera em divulgacao/<id>/:
//   post.jpg     1080x1350 (feed do Instagram, 4:5)
//   story.jpg    1080x1920 (stories, status do WhatsApp, Pinterest)
//   legenda.txt  texto pronto para colar, com hashtags
//
// Usa as páginas já renderizadas: rode antes node fabrica/construir.mjs <id>.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FABRICA, RAIZ, SAIDA, fotografar, LOGO_SVG } from './lib/render.mjs';

const url = (f) => pathToFileURL(f).href;
const CATALOGO = JSON.parse(readFileSync(path.join(FABRICA, 'catalogo.json'), 'utf8'));

const HASHTAGS = {
  festas: '#amigosecreto #amigooculto #confraternizacao #festadefimdeano #imprimiveis #kitfesta',
  educacao: '#atividadesinfantis #atividadesparaimprimir #educacaoinfantil #professora #maternidade #semtela',
  organizacao: '#planner #planner2027 #organizacao #planejamento #financaspessoais #imprimiveis',
  cristao: '#escolabiblica #ministerioinfantil #atividadesbiblicas #criancascristas #devocional',
};

function html({ largura, altura, story, info, site, folhas }) {
  const [a, b, c] = folhas.map(url);
  const k = story ? 1.12 : 1;
  const [reais, centavos] = site.preco.replace('R$ ', '').split(',');
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${url(path.join(FABRICA, 'fontes', 'fontes.css'))}">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${largura}px; height: ${altura}px; overflow: hidden; }
  .p { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: 'Nunito'; color: #fff;
    background: radial-gradient(circle at 2px 2px, rgba(255,255,255,.22) 2px, transparent 0) 0 0 / 30px 30px,
                radial-gradient(120% 80% at 50% 0%, ${info.capa.corClara} 0%, ${info.capa.cor} 70%); }
  .topo { position: absolute; top: ${story ? 170 : 70}px; left: 70px; right: 70px; text-align: center; }
  .selo { display: inline-block; background: #fff; color: ${info.capa.cor}; font: 800 ${26 * k}px 'Nunito'; letter-spacing: .12em; padding: 12px 28px; border-radius: 99px; }
  h1 { font: 700 ${(story ? 118 : 104)}px/0.95 'Fredoka'; margin-top: ${26 * k}px; text-shadow: 0 5px 0 rgba(0,0,0,.12), 0 14px 40px rgba(0,0,0,.2); }
  h1 em { font-style: normal; color: #fff6c9; }
  .sub { font: 700 ${34 * k}px/1.25 'Nunito'; margin-top: ${20 * k}px; opacity: .95; }
  .folha { position: absolute; width: ${story ? 470 : 400}px; aspect-ratio: 794 / 1123; object-fit: cover; background: #fff; border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,.12), 0 30px 60px rgba(0,0,0,.3); }
  .f1 { left: ${story ? 40 : 60}px; bottom: ${story ? 600 : 150}px; transform: rotate(-9deg); }
  .f2 { right: ${story ? 40 : 60}px; bottom: ${story ? 600 : 150}px; transform: rotate(9deg); }
  .f3 { left: 50%; margin-left: -${story ? 235 : 200}px; bottom: ${story ? 650 : 200}px; z-index: 2; }
  .preco { position: absolute; z-index: 3; right: ${story ? 70 : 50}px; bottom: ${story ? 1140 : 620}px; width: ${200 * k}px; height: ${200 * k}px; border-radius: 50%;
    background: #ffd23f; color: #3b2a00; border: 8px solid #fff; transform: rotate(10deg); box-shadow: 0 12px 30px rgba(0,0,0,.25);
    display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .preco small { font: 800 ${22 * k}px 'Nunito'; letter-spacing: .06em; }
  .preco b { font: 700 ${64 * k}px/1 'Fredoka'; }
  .preco b sup { font-size: .45em; vertical-align: .9em; margin-left: 2px; }
  .base { position: absolute; z-index: 4; left: 0; right: 0; bottom: 0; background: #fff; color: #2b2b2b; padding: ${story ? '46px 70px 150px' : '34px 60px'};
    display: flex; align-items: center; justify-content: space-between; gap: 30px; }
  .base .logo-loja { height: ${story ? 58 : 50}px; width: auto; flex: 0 0 auto; }
  .base div { text-align: right; font: 800 ${story ? 32 : 28}px/1.3 'Nunito'; }
  .base div span { display: block; font-weight: 700; font-size: .8em; color: #4d7215; }
</style></head><body><div class="p">
  <div class="topo">
    <span class="selo">PDF PARA IMPRIMIR · ${site.paginas} PÁGINAS</span>
    <h1>${info.capa.titulo}</h1>
    <p class="sub">${info.capa.sub}</p>
  </div>
  <img class="folha f1" src="${a}"><img class="folha f2" src="${b}"><img class="folha f3" src="${c}">
  <div class="preco"><small>SÓ</small><b>R$${reais}<sup>,${centavos}</sup></b></div>
  <div class="base">${LOGO_SVG}<div>Download na hora · Pix ou cartão<span>lojadokiwi.com.br · link na bio</span></div></div>
</div></body></html>`;
}

function legenda(info, site) {
  const itens = (site.itens || []).slice(0, 5).map(i => `✅ ${i}`).join('\n');
  return `${site.nome} 🖨️
${site.descricao}

O que vem no arquivo:
${itens}

📄 PDF com ${site.paginas} páginas, tamanho A4
⚡ Download na hora, com Pix ou cartão
💚 Só ${site.preco}

Compre pelo link na bio ou em lojadokiwi.com.br

${HASHTAGS[site.categoria] || ''} #lojadokiwi #pdfparaimprimir
`;
}

function paraJpg(origem, destino) {
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], 'JPEG', quality=88, optimize=True, progressive=True)
`, origem, destino]);
}

async function gerar(id) {
  const site = CATALOGO.produtos[id]?.site;
  if (!site) throw new Error(`${id} não está em fabrica/catalogo.json — rode node fabrica/construir.mjs ${id}`);
  const { info } = await import(pathToFileURL(path.join(FABRICA, 'produtos', id, 'produto.mjs')).href);
  const folhas = info.capa.folhas.map(n => path.join(SAIDA, id, 'paginas', `p${String(n).padStart(2, '0')}.png`));
  if (!folhas.every(existsSync)) throw new Error(`${id}: páginas não renderizadas — rode node fabrica/construir.mjs ${id}`);

  const pasta = path.join(RAIZ, 'divulgacao', id);
  mkdirSync(pasta, { recursive: true });
  for (const [nome, largura, altura, story] of [['post', 1080, 1350, false], ['story', 1080, 1920, true]]) {
    const png = path.join(SAIDA, id, `${nome}.png`);
    await fotografar({ html: html({ largura, altura, story, info, site, folhas }), destino: png, largura, altura, escala: 1 });
    paraJpg(png, path.join(pasta, `${nome}.jpg`));
  }
  writeFileSync(path.join(pasta, 'legenda.txt'), legenda(info, site));
  console.log(`  ✓ divulgacao/${id}/  (post.jpg, story.jpg, legenda.txt)`);
}

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(CATALOGO.produtos);
console.log('');
for (const id of ids) await gerar(id);
console.log('');
