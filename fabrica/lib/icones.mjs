// Ilustrações dos produtos: Fluent Emoji, da Microsoft (licença MIT — uso comercial
// liberado, com crédito). Versão colorida ("flat") e versão em contorno preto e
// branco ("high contrast"), ótima para páginas de colorir.
//
//   icone('arvore', { tamanho: '20mm' })                     colorido
//   icone('arvore', { tamanho: '60mm', estilo: 'contorno' }) para colorir
//
// Para um ícone novo, procure o nome em inglês em https://icon-sets.iconify.design/fluent-emoji-flat/
// e acrescente-o em NOMES com um apelido em português.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const COR = require('@iconify-json/fluent-emoji-flat/icons.json');
const CONTORNO = require('@iconify-json/fluent-emoji-high-contrast/icons.json');

export const CREDITOS = 'Ilustrações: Fluent Emoji © Microsoft Corporation, licença MIT.';

const NOMES = {
  estrela: 'star', 'estrela-brilho': 'glowing-star', brilho: 'sparkles',
  arvore: 'christmas-tree', presente: 'wrapped-gift', sino: 'bell', vela: 'candle',
  floco: 'snowflake', biscoito: 'cookie', meia: 'socks', 'papai-noel': 'santa-claus',
  'mamae-noel': 'mrs-claus', 'boneco-neve': 'snowman', rena: 'deer', treno: 'sled',
  bala: 'candy', pirulito: 'lollipop', chocolate: 'chocolate-bar', cupcake: 'cupcake',
  bolo: 'shortcake', 'bolo-aniversario': 'birthday-cake', 'chocolate-quente': 'hot-beverage',
  leite: 'glass-of-milk', coracao: 'red-heart', laco: 'ribbon', luvas: 'gloves',
  cachecol: 'scarf', ursinho: 'teddy-bear', festa: 'party-popper', confete: 'confetti-ball',
  balao: 'balloon', fogos: 'fireworks', segredo: 'shushing-face', musica: 'musical-notes',
  camera: 'camera', anjo: 'baby-angel', ovelha: 'ewe', pomba: 'dove', casa: 'house',
  pinguim: 'penguin', envelope: 'envelope', carta: 'love-letter', lapis: 'pencil',
  giz: 'crayon', tesoura: 'scissors', prancheta: 'clipboard', calendario: 'spiral-calendar',
  dinheiro: 'money-bag', cedula: 'dollar-banknote', grafico: 'chart-increasing',
  check: 'check-mark-button', lampada: 'light-bulb', livros: 'books', relogio: 'alarm-clock',
  broto: 'seedling', sol: 'sun', 'arco-iris': 'rainbow', sacolas: 'shopping-bags', coroa: 'crown',
};

let contador = 0;

/** Corpo SVG do ícone (quadro 32x32), com ids únicos para poder repetir na mesma página. */
export function corpo(nome, estilo = 'cor') {
  const original = NOMES[nome] || nome;
  const conjunto = estilo === 'contorno' ? CONTORNO : COR;
  const dados = conjunto.icons[original];
  if (!dados) throw new Error(`Ícone não encontrado: ${nome} (${original}) no estilo ${estilo}`);
  const sufixo = `i${++contador}`;
  return dados.body
    .replace(/id="([^"]+)"/g, `id="$1-${sufixo}"`)
    .replace(/url\(#([^)]+)\)/g, `url(#$1-${sufixo})`)
    .replace(/href="#([^"]+)"/g, `href="#$1-${sufixo}"`);
}

export function icone(nome, { tamanho = '20mm', classe = '', estilo = 'cor' } = {}) {
  return `<svg class="icone ${classe}" viewBox="0 0 32 32" width="${tamanho}" height="${tamanho}" xmlns="http://www.w3.org/2000/svg">${corpo(nome, estilo)}</svg>`;
}

export const NOMES_ICONES = Object.keys(NOMES);
