#!/usr/bin/env node
// Envia os PDFs fabricados e o catálogo de vendas ao cofre do checkout (R2).
//
//   CLOUDFLARE_API_TOKEN=... node fabrica/publicar.mjs
//
// O token precisa da permissão "R2 Storage: Edit". Só envia o PDF se a versão
// ainda não estiver lá (a chave muda quando o conteúdo do produto muda).
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FABRICA = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.dirname(FABRICA);
const BUCKET = 'lojadokiwi-produtos';

const wrangler = readFileSync(path.join(RAIZ, 'checkout', 'wrangler.toml'), 'utf8');
const CONTA = process.env.CLOUDFLARE_ACCOUNT_ID || wrangler.match(/^account_id\s*=\s*"([^"]+)"/m)?.[1];
const API = `https://api.cloudflare.com/client/v4/accounts/${CONTA}/r2/buckets/${BUCKET}/objects`;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'definido-pelo-proxy';

/** Catálogo enxuto que o Worker lê: preço, nome e onde está cada arquivo. */
export function catalogoCheckout() {
  const completo = JSON.parse(readFileSync(path.join(FABRICA, 'catalogo.json'), 'utf8'));
  const produtos = {};
  for (const [id, p] of Object.entries(completo.produtos)) {
    produtos[id] = {
      nome: p.nome,
      precoCentavos: p.precoCentavos,
      imagem: p.imagem,
      paginas: p.paginas,
      arquivos: p.arquivos.map(({ chave, nome, bytes }) => ({ chave, nome, bytes })),
    };
  }
  return { atualizadoEm: completo.atualizadoEm, produtos };
}

async function existe(chave) {
  const r = await fetch(`${API}/${chave}`, { method: 'GET', headers: { authorization: `Bearer ${TOKEN}`, range: 'bytes=0-0' } });
  await r.body?.cancel();
  return r.ok;
}

async function enviar(chave, corpo, tipo) {
  const r = await fetch(`${API}/${chave}`, {
    method: 'PUT',
    headers: { authorization: `Bearer ${TOKEN}`, 'content-type': tipo },
    body: corpo,
  });
  if (!r.ok) throw new Error(`Falha ao enviar ${chave}: ${r.status} ${await r.text()}`);
}

async function main() {
  if (!CONTA) throw new Error('Conta Cloudflare não encontrada (account_id em checkout/wrangler.toml).');
  const completo = JSON.parse(readFileSync(path.join(FABRICA, 'catalogo.json'), 'utf8'));
  console.log(`\nPublicando no cofre "${BUCKET}"\n`);
  for (const [id, p] of Object.entries(completo.produtos)) {
    for (const a of p.arquivos) {
      const local = path.join(RAIZ, a.local);
      if (await existe(a.chave)) { console.log(`  = ${id}: já publicado`); continue; }
      if (!existsSync(local)) throw new Error(`${id}: PDF não encontrado em ${a.local}. Rode antes: node fabrica/construir.mjs ${id}`);
      await enviar(a.chave, readFileSync(local), 'application/pdf');
      console.log(`  ↑ ${id}: ${a.chave}`);
    }
  }
  await enviar('catalogo.json', JSON.stringify(catalogoCheckout(), null, 2), 'application/json');
  console.log('  ↑ catalogo.json\n\nPronto. O checkout passa a vender a versão nova em até 1 minuto.\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(e => { console.error(`\n${e.message}\n`); process.exit(1); });
}
