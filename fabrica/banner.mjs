#!/usr/bin/env node
// Banner do carrossel da página inicial com as capas reais dos produtos.
//
//   node fabrica/banner.mjs
//
// Gera imagens/banner-fim-de-ano.webp (1600x533) e a versão de celular (800x267,
// com letras maiores). Para outra campanha, copie BANNER e troque textos e produtos.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FABRICA, RAIZ, SAIDA, fotografar, paraWebp } from './lib/render.mjs';
import { icone } from './lib/icones.mjs';

const BANNER = {
  nome: 'banner-fim-de-ano',
  selo: 'NOVIDADE · DOWNLOAD NA HORA',
  titulo: 'Fim de ano<br><em>pronto para imprimir</em>',
  sub: 'Amigo secreto, atividades de Natal e o Planner 2027',
  chamada: 'Ver os kits',
  preco: 'Pix ou cartão · a partir de R$ 9,90',
  produtos: ['kit-amigo-secreto', 'kit-atividades-natal', 'planner-2027'],
  enfeites: ['floco', 'estrela', 'presente', 'floco', 'brilho', 'estrela'],
};

const url = (f) => pathToFileURL(f).href;

function html({ largura, altura, celular }) {
  const capas = BANNER.produtos.map(id => url(path.join(RAIZ, 'imagens', `${id}.webp`)));
  const k = celular ? 0.5 : 1; // celular: 800x267
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${url(path.join(FABRICA, 'fontes', 'fontes.css'))}">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: ${largura}px; height: ${altura}px; overflow: hidden; }
  .b { position: relative; width: 100%; height: 100%; overflow: hidden; font-family: 'Nunito';
    background: radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,.13) 1.5px, transparent 0) 0 0 / ${22 * k}px ${22 * k}px,
                radial-gradient(120% 140% at 20% 0%, #3aa257 0%, #1f6a35 60%, #154d26 100%); }
  .txt { position: absolute; left: ${celular ? 150 : 70}px; top: 50%; transform: translateY(-50%); width: ${celular ? 235 : 720}px; color: #fff; }
  .selo { display: inline-block; background: #ffd23f; color: #3b2a00; font: 800 ${celular ? 11 : 17}px 'Nunito'; letter-spacing: .12em; padding: ${8 * k + 2}px ${16 * k + 4}px; border-radius: 99px; }
  h1 { font: 700 ${celular ? 34 : 78}px/0.98 'Fredoka'; margin-top: ${celular ? 10 : 18}px; text-shadow: 0 4px 18px rgba(0,0,0,.18); }
  h1 em { font-style: normal; color: #ffe27a; }
  .sub { font: 700 ${celular ? 0 : 25}px/1.3 'Nunito'; margin-top: 14px; opacity: .95; display: ${celular ? 'none' : 'block'}; }
  .cta { display: inline-flex; align-items: center; gap: 12px; margin-top: ${celular ? 14 : 26}px; background: #fff; color: #1f6a35; font: 800 ${celular ? 15 : 24}px 'Nunito'; padding: ${celular ? '8px 16px' : '15px 30px'}; border-radius: 14px; box-shadow: 0 8px 22px rgba(0,0,0,.2); }
  .preco { display: ${celular ? 'none' : 'inline-block'}; margin-left: 18px; font: 700 19px 'Nunito'; opacity: .9; }
  .capa { position: absolute; width: ${celular ? 165 : 330}px; height: ${celular ? 165 : 330}px; border-radius: ${16 * k + 4}px; box-shadow: 0 ${20 * k}px ${44 * k}px rgba(0,0,0,.35); border: ${6 * k + 2}px solid #fff; }
  .c1 { right: ${celular ? 196 : 560}px; top: ${celular ? 62 : 120}px; transform: rotate(-8deg); }
  .c3 { right: ${celular ? 18 : 70}px; top: ${celular ? 62 : 120}px; transform: rotate(8deg); }
  .c2 { right: ${celular ? 106 : 300}px; top: ${celular ? 44 : 80}px; z-index: 2; }
  .enf { position: absolute; opacity: .9; }
</style></head><body><div class="b">
  ${BANNER.enfeites.map((n, i) => `<div class="enf" style="left:${[46, 40, 60, 52, 34, 92][i]}%;top:${[8, 76, 84, 4, 30, 6][i]}%;transform:rotate(${i * 23 - 30}deg)">${icone(n, { tamanho: `${(celular ? 26 : 44) - i * 2}px` })}</div>`).join('')}
  <div class="txt">
    <span class="selo">${celular ? BANNER.selo.split(" · ").pop() : BANNER.selo}</span>
    <h1>${BANNER.titulo}</h1>
    <p class="sub">${BANNER.sub}</p>
    <span class="cta">${BANNER.chamada} →</span><span class="preco">${BANNER.preco}</span>
  </div>
  <img class="capa c1" src="${capas[0]}"><img class="capa c2" src="${capas[1]}"><img class="capa c3" src="${capas[2]}">
</div></body></html>`;
}

const grande = await fotografar({ html: html({ largura: 1600, altura: 533 }), destino: path.join(SAIDA, 'banner', `${BANNER.nome}.png`), largura: 1600, altura: 533, escala: 2 });
const celular = await fotografar({ html: html({ largura: 800, altura: 267, celular: true }), destino: path.join(SAIDA, 'banner', `${BANNER.nome}-mobile.png`), largura: 800, altura: 267, escala: 2 });
paraWebp(grande, path.join(RAIZ, 'imagens', `${BANNER.nome}.webp`), 1600, 82);
paraWebp(celular, path.join(RAIZ, 'imagens', `${BANNER.nome}-mobile.webp`), 800, 82);
console.log(`\n  ✓ imagens/${BANNER.nome}.webp e imagens/${BANNER.nome}-mobile.webp\n`);
