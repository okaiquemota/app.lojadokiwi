// Ambiente de teste do Worker no Node: banco D1 em memória (node:sqlite), cofre R2
// lendo os PDFs de fabrica/saida e pagamentos do Mercado Pago simulados. A
// criação do link de pagamento continua indo ao Mercado Pago de verdade.
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { catalogoCheckout } from '../fabrica/publicar.mjs';
export { default as worker } from './src/index.js';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.dirname(AQUI);
const MP = 'https://api.mercadopago.com';
const TOKEN = process.env.MP_ACCESS_TOKEN || 'TEST-definido-pelo-proxy';

// --- D1 simulado
const sqlite = new DatabaseSync(':memory:');
sqlite.exec(readFileSync(path.join(AQUI, 'schema.sql'), 'utf8'));
const DB = {
  prepare(sql) {
    let args = [];
    const stmt = sqlite.prepare(sql);
    const api = {
      bind: (...a) => { args = a; return api; },
      first: async () => stmt.get(...args) ?? null,
      run: async () => stmt.run(...args),
      all: async () => ({ results: stmt.all(...args) }),
    };
    return api;
  },
};

// --- R2 simulado: catálogo gerado na hora e PDFs da pasta fabrica/saida
const catalogo = catalogoCheckout();
const locais = Object.fromEntries(Object.values(JSON.parse(readFileSync(path.join(RAIZ, 'fabrica', 'catalogo.json'), 'utf8')).produtos)
  .flatMap(p => p.arquivos).map(a => [a.chave, path.join(RAIZ, a.local)]));
const ARQUIVOS = {
  async get(chave) {
    if (chave === 'catalogo.json') return { json: async () => catalogo };
    if (!locais[chave]) return null;
    const dados = readFileSync(locais[chave]);
    return { body: dados, size: dados.length };
  },
};

export const env = { DB, ARQUIVOS, MP_ACCESS_TOKEN: TOKEN, SITE_URL: 'https://lojadokiwi.com.br', ORIGENS_PERMITIDAS: 'https://lojadokiwi.com.br', LIMITE_DOWNLOADS: '3', CHAVE_PAINEL: 'teste' };
// Pagamentos simulados no formato da API do Mercado Pago. A criação do link de
// pagamento e a busca vão ao Mercado Pago de verdade; o pagamento em si é
// simulado porque a conta de teste não pode pagar pela API.
const pagamentos = [];
let proximoId = 90000000001;
const fetchReal = globalThis.fetch;
globalThis.fetch = async (entrada, opcoes) => {
  const url = new URL(typeof entrada === 'string' ? entrada : entrada.url);
  if (url.origin === MP && url.pathname === '/v1/payments/search') {
    const ref = url.searchParams.get('external_reference');
    const achados = pagamentos.filter(p => p.external_reference === ref);
    if (!achados.length) return fetchReal(entrada, opcoes); // pedido sem pagamento simulado: busca real
    return Response.json({ results: [...achados].reverse(), paging: { total: achados.length } });
  }
  const m = url.pathname.match(/^\/v1\/payments\/(\d+)$/);
  if (url.origin === MP && m) {
    const p = pagamentos.find(p => String(p.id) === m[1]);
    return p ? Response.json(p) : fetchReal(entrada, opcoes);
  }
  return fetchReal(entrada, opcoes);
};

export function pagar(ref, valor, status, metodo = 'pix') {
  const p = {
    id: proximoId++, status, status_detail: status === 'approved' ? 'accredited' : 'cc_rejected_other_reason',
    external_reference: ref, transaction_amount: valor, currency_id: 'BRL', payment_method_id: metodo,
    date_approved: status === 'approved' ? new Date().toISOString() : null,
    payer: { email: 'comprador.teste@exemplo.com' },
  };
  pagamentos.push(p);
  return p;
}

