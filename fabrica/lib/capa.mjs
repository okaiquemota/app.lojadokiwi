// Capa da vitrine: as páginas reais do PDF em leque sobre a cor do produto.
// Mostra exatamente o que o cliente recebe, sem ilustração de banco.
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { FABRICA, LOGO_SVG } from './render.mjs';

const url = (f) => pathToFileURL(f).href;

export function htmlCapa({ cor, corClara, corTexto = '#1f2a10', topo, titulo, sub, selo, folhas }) {
  const [a, b, c] = folhas.map(url);
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${url(path.join(FABRICA, 'fontes', 'fontes.css'))}">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 800px; height: 800px; overflow: hidden; }
  .capa {
    position: relative; width: 800px; height: 800px; overflow: hidden;
    background:
      radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,.35) 1.5px, transparent 0) 0 0 / 22px 22px,
      radial-gradient(120% 90% at 50% 0%, ${corClara} 0%, ${cor} 75%);
    font-family: 'Nunito', sans-serif; color: ${corTexto};
  }
  .cabeca {
    position: absolute; top: 32px; left: 40px; right: 40px;
    display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center;
  }
  .topo {
    background: #fff; color: ${cor}; font: 800 15px 'Nunito'; letter-spacing: .14em;
    padding: 9px 20px; border-radius: 99px; white-space: nowrap;
    box-shadow: 0 4px 14px rgba(0,0,0,.12);
  }
  h1 {
    font: 700 60px/0.98 'Fredoka'; color: #fff; letter-spacing: -.01em;
    text-shadow: 0 3px 0 rgba(0,0,0,.14), 0 10px 30px rgba(0,0,0,.18);
  }
  h1 em { font-style: normal; color: ${corTexto === '#1f2a10' ? '#fff6c9' : corTexto}; }
  .sub { font: 700 22px/1.25 'Nunito'; color: rgba(255,255,255,.95); max-width: 600px; }
  .folha {
    position: absolute; width: 330px; height: 467px; object-fit: cover;
    background: #fff; border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 22px 44px rgba(0,0,0,.28);
  }
  .f1 { left: 56px;  bottom: -20px; transform: rotate(-9deg); }
  .f2 { right: 56px; bottom: -20px; transform: rotate(9deg); }
  .f3 { left: 235px; bottom: 14px; transform: rotate(0deg); z-index: 2; }
  .selo {
    position: absolute; z-index: 3; right: 40px; bottom: 300px; width: 122px; height: 122px;
    border-radius: 50%; background: #ffd23f; color: #3b2a00;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font: 700 40px/0.9 'Fredoka'; transform: rotate(10deg);
    box-shadow: 0 8px 20px rgba(0,0,0,.25); border: 5px solid #fff;
  }
  .selo small { font: 800 14px 'Nunito'; letter-spacing: .06em; text-transform: uppercase; margin-top: 4px; }
  .marca {
    position: absolute; z-index: 4; left: 50%; bottom: 22px; transform: translateX(-50%);
    background: #fff; border-radius: 99px; padding: 10px 22px 8px;
    box-shadow: 0 6px 18px rgba(0,0,0,.2);
  }
  .marca svg { height: 26px; width: auto; display: block; }
</style></head><body>
<div class="capa">
  <div class="cabeca">
    <div class="topo">${topo}</div>
    <h1>${titulo}</h1>
    <p class="sub">${sub}</p>
  </div>
  <img class="folha f1" src="${a}">
  <img class="folha f2" src="${b}">
  <img class="folha f3" src="${c}">
  <div class="selo">${selo}</div>
  <div class="marca">${LOGO_SVG}</div>
</div>
</body></html>`;
}
