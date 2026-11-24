// Checkout da Loja do Kiwi — Cloudflare Worker.
//
// Vende os produtos próprios da loja sem ninguém precisar estar online:
//   1. o site chama POST /api/checkout e recebe o link de pagamento do Mercado Pago
//   2. o cliente paga com Pix ou cartão e volta para lojadokiwi.com.br/pedido/
//   3. a página do pedido chama GET /api/pedido, que confirma o pagamento direto
//      no Mercado Pago e devolve os links de download
//   4. GET /download/... entrega o PDF guardado no R2 (nunca fica público)
//
// O preço vem do catálogo no R2 (catalogo.json), nunca do navegador.

const MP = 'https://api.mercadopago.com';
const CACHE_CATALOGO_MS = 60_000;

let catalogoCache = { quando: 0, dados: null };

// ---------------------------------------------------------------- utilidades

const agora = () => new Date().toISOString();

function json(dados, status = 200, extra = {}) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
  });
}

function origensPermitidas(env) {
  return String(env.ORIGENS_PERMITIDAS || env.SITE_URL || '').split(',').map(s => s.trim()).filter(Boolean);
}

function cors(request, env) {
  const origem = request.headers.get('origin');
  if (!origem || !origensPermitidas(env).includes(origem)) return {};
  return {
    'access-control-allow-origin': origem,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'origin',
  };
}

// Código do pedido: 20 caracteres aleatórios (100 bits). Quem tem o código
// baixa o arquivo, então ele precisa ser impossível de adivinhar.
function novoCodigo() {
  const alfabeto = 'abcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return Array.from(bytes, b => alfabeto[b % alfabeto.length]).join('');
}

const codigoValido = (ref) => typeof ref === 'string' && /^[a-z0-9]{20}$/.test(ref);

async function catalogo(env) {
  if (catalogoCache.dados && Date.now() - catalogoCache.quando < CACHE_CATALOGO_MS) return catalogoCache.dados;
  const obj = await env.ARQUIVOS.get('catalogo.json');
  if (!obj) throw new Error('catalogo.json não encontrado no R2');
  catalogoCache = { quando: Date.now(), dados: await obj.json() };
  return catalogoCache.dados;
}

async function mercadoPago(env, caminho, opcoes = {}) {
  if (!env.MP_ACCESS_TOKEN) throw new ErroLoja('O pagamento ainda não foi configurado na loja.', 503);
  const resp = await fetch(MP + caminho, {
    ...opcoes,
    headers: {
      authorization: `Bearer ${env.MP_ACCESS_TOKEN}`,
      'content-type': 'application/json',
      ...(opcoes.headers || {}),
    },
  });
  const texto = await resp.text();
  let dados;
  try { dados = JSON.parse(texto); } catch { dados = { bruto: texto }; }
  if (!resp.ok) {
    console.error('Mercado Pago', resp.status, caminho, texto.slice(0, 500));
    throw new ErroLoja('Não foi possível falar com o Mercado Pago agora. Tente de novo em instantes.', 502);
  }
  return dados;
}

class ErroLoja extends Error {
  constructor(mensagem, status = 400) { super(mensagem); this.status = status; }
}

// ---------------------------------------------------------------- pedidos

// Status do Mercado Pago -> status do pedido.
function traduzirStatus(status) {
  if (status === 'approved') return 'aprovado';
  if (['pending', 'in_process', 'authorized', 'in_mediation'].includes(status)) return 'pendente';
  if (['refunded', 'charged_back'].includes(status)) return 'estornado';
  if (status === 'rejected') return 'recusado';
  if (status === 'cancelled') return 'cancelado';
  return 'pendente';
}

// Entre várias tentativas de pagamento do mesmo pedido, vale a mais "forte".
const PESO = { estornado: 5, aprovado: 4, pendente: 3, recusado: 2, cancelado: 1, criado: 0 };

function melhorPagamento(pagamentos, pedido) {
  const validos = pagamentos.filter(p =>
    p.external_reference === pedido.ref &&
    p.currency_id === 'BRL' &&
    Number(p.transaction_amount) * 100 >= pedido.valor_centavos - 1);
  validos.sort((a, b) => PESO[traduzirStatus(b.status)] - PESO[traduzirStatus(a.status)]);
  return validos[0] || null;
}

async function buscarPedido(env, ref) {
  return env.DB.prepare('SELECT * FROM pedidos WHERE ref = ?').bind(ref).first();
}

async function aplicarPagamento(env, pedido, pagamento) {
  const status = traduzirStatus(pagamento.status);
  if (status === pedido.status && String(pagamento.id) === pedido.pagamento_id) return pedido;
  const email = pagamento.payer?.email || null;
  const aprovadoEm = status === 'aprovado' ? (pedido.aprovado_em || pagamento.date_approved || agora()) : pedido.aprovado_em;
  await env.DB.prepare(`UPDATE pedidos SET status = ?, pagamento_id = ?, metodo = ?, email = COALESCE(?, email),
      aprovado_em = ?, atualizado_em = ? WHERE ref = ?`)
    .bind(status, String(pagamento.id), pagamento.payment_method_id || null, email, aprovadoEm, agora(), pedido.ref)
    .run();
  return { ...pedido, status, pagamento_id: String(pagamento.id), metodo: pagamento.payment_method_id, email: email || pedido.email, aprovado_em: aprovadoEm };
}

// Confere no Mercado Pago (pedido ainda não aprovado, ou aprovado há pouco,
// para pegar estornos). Pedido aprovado e já conferido não gasta chamada.
async function atualizarPedido(env, pedido) {
  if (pedido.status === 'estornado') return pedido;
  if (pedido.status === 'aprovado' && pedido.conferido_em > new Date(Date.now() - 10 * 60_000).toISOString()) return pedido;
  const busca = await mercadoPago(env, `/v1/payments/search?external_reference=${pedido.ref}&sort=date_created&criteria=desc&limit=20`);
  await env.DB.prepare('UPDATE pedidos SET conferido_em = ? WHERE ref = ?').bind(agora(), pedido.ref).run();
  const pagamento = melhorPagamento(busca.results || [], pedido);
  if (!pagamento) return pedido;
  return aplicarPagamento(env, { ...pedido, conferido_em: agora() }, pagamento);
}

async function respostaPedido(env, pedido, origemWorker) {
  const cat = await catalogo(env);
  const produto = cat.produtos[pedido.produto_id];
  const base = {
    ref: pedido.ref,
    status: pedido.status,
    produto: { id: pedido.produto_id, nome: pedido.produto_nome, imagem: produto?.imagem || null },
    valor: pedido.valor_centavos / 100,
    pagamento: pedido.pagamento_id,
  };
  if (pedido.status !== 'aprovado' || !produto) return base;
  const limite = Number(env.LIMITE_DOWNLOADS || 30);
  return {
    ...base,
    downloadsRestantes: Math.max(0, limite - pedido.downloads),
    arquivos: produto.arquivos.map((a, i) => ({
      nome: a.nome,
      bytes: a.bytes,
      paginas: produto.paginas,
      url: `${origemWorker}/download/${pedido.ref}/${i}`,
    })),
  };
}

// ---------------------------------------------------------------- rotas

async function criarCheckout(request, env, origemWorker) {
  const corpo = await request.json().catch(() => ({}));
  const cat = await catalogo(env);
  const produto = cat.produtos[corpo.produto];
  if (!produto) throw new ErroLoja('Produto não encontrado.', 404);

  const ref = novoCodigo();
  const site = env.SITE_URL || 'https://lojadokiwi.com.br';
  const voltar = `${site}/pedido/?ref=${ref}`;
  const preferencia = await mercadoPago(env, '/checkout/preferences', {
    method: 'POST',
    headers: { 'x-idempotency-key': ref },
    body: JSON.stringify({
      items: [{
        id: corpo.produto,
        title: produto.nome,
        description: `PDF para imprimir · ${produto.paginas} páginas · download imediato`,
        picture_url: produto.imagem,
        category_id: 'learnings',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: produto.precoCentavos / 100,
      }],
      external_reference: ref,
      back_urls: { success: voltar, pending: voltar, failure: voltar },
      auto_return: 'approved',
      notification_url: `${origemWorker}/webhook/mercadopago`,
      statement_descriptor: 'LOJADOKIWI',
      metadata: { produto_id: corpo.produto, ref },
      // Boleto leva dias para compensar: para arquivo digital, só Pix e cartão.
      payment_methods: { excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }] },
    }),
  });

  await env.DB.prepare(`INSERT INTO pedidos (ref, produto_id, produto_nome, valor_centavos, status, preferencia_id, criado_em, atualizado_em)
      VALUES (?, ?, ?, ?, 'criado', ?, ?, ?)`)
    .bind(ref, corpo.produto, produto.nome, produto.precoCentavos, preferencia.id, agora(), agora())
    .run();

  return json({ ref, url: preferencia.init_point });
}

async function consultarPedido(url, env, origemWorker) {
  const ref = url.searchParams.get('ref');
  if (!codigoValido(ref)) throw new ErroLoja('Código de pedido inválido.', 400);
  let pedido = await buscarPedido(env, ref);
  if (!pedido) throw new ErroLoja('Pedido não encontrado.', 404);
  pedido = await atualizarPedido(env, pedido);
  return json(await respostaPedido(env, pedido, origemWorker));
}

// O cliente perdeu o link: informa o número do pagamento (vem no e-mail do
// Mercado Pago) e o e-mail usado na compra.
async function recuperarPedido(request, env) {
  const corpo = await request.json().catch(() => ({}));
  const numero = String(corpo.pagamento || '').replace(/\D/g, '');
  const email = String(corpo.email || '').trim().toLowerCase();
  if (!numero || !email.includes('@')) throw new ErroLoja('Informe o número do pagamento e o e-mail da compra.');
  let pagamento;
  try {
    pagamento = await mercadoPago(env, `/v1/payments/${numero}`);
  } catch {
    throw new ErroLoja('Não encontramos esse pagamento. Confira o número e tente de novo.', 404);
  }
  const confere = String(pagamento.payer?.email || '').toLowerCase() === email;
  const pedido = pagamento.external_reference && await buscarPedido(env, pagamento.external_reference);
  if (!confere || !pedido) throw new ErroLoja('Não encontramos uma compra com esses dados. Confira o número e o e-mail.', 404);
  await aplicarPagamento(env, pedido, pagamento);
  return json({ ref: pedido.ref });
}

async function baixar(url, env) {
  const [, , ref, indice] = url.pathname.split('/');
  if (!codigoValido(ref)) return new Response('Link inválido.', { status: 404 });
  let pedido = await buscarPedido(env, ref);
  if (!pedido) return new Response('Pedido não encontrado.', { status: 404 });
  if (pedido.status !== 'aprovado') pedido = await atualizarPedido(env, pedido);
  if (pedido.status !== 'aprovado') {
    return Response.redirect(`${env.SITE_URL || 'https://lojadokiwi.com.br'}/pedido/?ref=${ref}`, 302);
  }
  const limite = Number(env.LIMITE_DOWNLOADS || 30);
  if (pedido.downloads >= limite) {
    return new Response('Este pedido atingiu o limite de downloads. Fale com a loja pelo WhatsApp que liberamos de novo.', { status: 429 });
  }
  const cat = await catalogo(env);
  const arquivo = cat.produtos[pedido.produto_id]?.arquivos[Number(indice)];
  if (!arquivo) return new Response('Arquivo não encontrado.', { status: 404 });
  const obj = await env.ARQUIVOS.get(arquivo.chave);
  if (!obj) return new Response('Arquivo indisponível no momento. Fale com a loja.', { status: 503 });

  await env.DB.prepare('UPDATE pedidos SET downloads = downloads + 1 WHERE ref = ?').bind(ref).run();
  return new Response(obj.body, {
    headers: {
      'content-type': 'application/pdf',
      'content-length': String(obj.size),
      'content-disposition': `attachment; filename="${arquivo.nome}"`,
      'cache-control': 'private, no-store',
    },
  });
}

// Confere a assinatura do aviso (quando a chave secreta do webhook estiver configurada).
async function assinaturaValida(request, env, idPagamento) {
  if (!env.MP_WEBHOOK_SECRET) return true;
  const cabecalho = request.headers.get('x-signature') || '';
  const partes = Object.fromEntries(cabecalho.split(',').map(p => p.trim().split('=')));
  if (!partes.ts || !partes.v1) return false;
  const manifesto = `id:${String(idPagamento).toLowerCase()};request-id:${request.headers.get('x-request-id') || ''};ts:${partes.ts};`;
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.MP_WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const assinatura = await crypto.subtle.sign('HMAC', chave, new TextEncoder().encode(manifesto));
  const hex = Array.from(new Uint8Array(assinatura), b => b.toString(16).padStart(2, '0')).join('');
  return hex === partes.v1;
}

async function webhook(request, url, env) {
  const corpo = await request.json().catch(() => ({}));
  const tipo = url.searchParams.get('type') || url.searchParams.get('topic') || corpo.type || corpo.topic;
  const id = url.searchParams.get('data.id') || corpo.data?.id || (tipo === 'payment' ? url.searchParams.get('id') : null);
  if (tipo !== 'payment' || !id) return json({ ok: true, ignorado: true });
  if (!(await assinaturaValida(request, env, id))) return json({ ok: false }, 401);

  // O aviso só diz "algo mudou": o status verdadeiro vem do próprio Mercado Pago.
  const pagamento = await mercadoPago(env, `/v1/payments/${id}`);
  const pedido = pagamento.external_reference && await buscarPedido(env, pagamento.external_reference);
  if (pedido && melhorPagamento([pagamento], pedido)) await aplicarPagamento(env, pedido, pagamento);
  return json({ ok: true });
}

// Painel simples de vendas, protegido por senha (CHAVE_PAINEL).
async function painel(url, env) {
  if (!env.CHAVE_PAINEL || url.searchParams.get('chave') !== env.CHAVE_PAINEL) return new Response('Não encontrado.', { status: 404 });
  const desde = (dias) => new Date(Date.now() - dias * 86_400_000).toISOString();
  const soma = async (dias) => env.DB.prepare(`SELECT COUNT(*) AS vendas, COALESCE(SUM(valor_centavos), 0) AS centavos
      FROM pedidos WHERE status = 'aprovado' AND aprovado_em >= ?`).bind(desde(dias)).first();
  const [hoje, semana, mes, total] = await Promise.all([soma(1), soma(7), soma(30), soma(36500)]);
  const porProduto = await env.DB.prepare(`SELECT produto_nome, COUNT(*) AS vendas, SUM(valor_centavos) AS centavos
      FROM pedidos WHERE status = 'aprovado' GROUP BY produto_nome ORDER BY vendas DESC`).all();
  const ultimos = await env.DB.prepare(`SELECT produto_nome, valor_centavos, status, metodo, criado_em, downloads
      FROM pedidos WHERE status != 'criado' ORDER BY criado_em DESC LIMIT 30`).all();
  const funil = await env.DB.prepare(`SELECT status, COUNT(*) AS n FROM pedidos WHERE criado_em >= ? GROUP BY status`).bind(desde(30)).all();

  const reais = (c) => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cartao = (rotulo, d) => `<div class="c"><small>${rotulo}</small><b>${reais(d.centavos)}</b><span>${d.vendas} venda(s)</span></div>`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Vendas · Loja do Kiwi</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#f4f6f1;color:#222}main{max-width:900px;margin:0 auto;padding:16px}
h1{font-size:22px}h2{font-size:16px;margin-top:28px}.g{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.c{background:#fff;border-radius:12px;padding:14px;box-shadow:0 1px 3px #0001}.c small{display:block;color:#666}.c b{display:block;font-size:22px;color:#4d7215;margin:4px 0}
table{width:100%;border-collapse:collapse;background:#fff;border-radius:12px;overflow:hidden;font-size:14px}td,th{padding:8px 10px;border-bottom:1px solid #eee;text-align:left}
.s-aprovado{color:#2f7a1f;font-weight:600}.s-estornado,.s-recusado{color:#b3261e}.s-pendente{color:#a86b00}.wrap{overflow-x:auto}
</style></head><body><main><h1>Vendas da Loja do Kiwi</h1>
<div class="g">${cartao('Últimas 24 h', hoje)}${cartao('7 dias', semana)}${cartao('30 dias', mes)}${cartao('Desde o início', total)}</div>
<h2>Por produto</h2><div class="wrap"><table><tr><th>Produto</th><th>Vendas</th><th>Total</th></tr>
${porProduto.results.map(p => `<tr><td>${esc(p.produto_nome)}</td><td>${p.vendas}</td><td>${reais(p.centavos)}</td></tr>`).join('') || '<tr><td colspan="3">Nenhuma venda ainda.</td></tr>'}</table></div>
<h2>Funil (30 dias)</h2><p>${funil.results.map(f => `${esc(f.status)}: <b>${f.n}</b>`).join(' · ') || 'Sem pedidos.'}</p>
<p style="color:#666;font-size:13px">"criado" = clicou em comprar e não concluiu o pagamento.</p>
<h2>Últimos pedidos</h2><div class="wrap"><table><tr><th>Quando</th><th>Produto</th><th>Valor</th><th>Status</th><th>Meio</th><th>Downloads</th></tr>
${ultimos.results.map(p => `<tr><td>${new Date(p.criado_em).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td><td>${esc(p.produto_nome)}</td><td>${reais(p.valor_centavos)}</td>
<td class="s-${esc(p.status)}">${esc(p.status)}</td><td>${esc(p.metodo || '')}</td><td>${p.downloads}</td></tr>`).join('') || '<tr><td colspan="6">Nenhum pedido ainda.</td></tr>'}</table></div>
</main></body></html>`;
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

// ---------------------------------------------------------------- entrada

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origemWorker = url.origin;
    const cabecalhosCors = cors(request, env);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cabecalhosCors });

    try {
      let resposta;
      if (url.pathname === '/api/checkout' && request.method === 'POST') resposta = await criarCheckout(request, env, origemWorker);
      else if (url.pathname === '/api/pedido' && request.method === 'GET') resposta = await consultarPedido(url, env, origemWorker);
      else if (url.pathname === '/api/recuperar' && request.method === 'POST') resposta = await recuperarPedido(request, env);
      else if (url.pathname.startsWith('/download/') && request.method === 'GET') return await baixar(url, env);
      else if (url.pathname === '/webhook/mercadopago' && request.method === 'POST') return await webhook(request, url, env);
      else if (url.pathname === '/painel' && request.method === 'GET') return await painel(url, env);
      else if (url.pathname === '/') resposta = json({ loja: 'Loja do Kiwi', servico: 'checkout', ok: true });
      else resposta = json({ erro: 'Rota não encontrada.' }, 404);

      for (const [k, v] of Object.entries(cabecalhosCors)) resposta.headers.set(k, v);
      return resposta;
    } catch (erro) {
      const status = erro instanceof ErroLoja ? erro.status : 500;
      if (!(erro instanceof ErroLoja)) console.error(erro);
      const mensagem = erro instanceof ErroLoja ? erro.message : 'Erro inesperado. Tente de novo em instantes.';
      // O Mercado Pago reenvia o aviso enquanto não receber 2xx: erro de verdade devolve 500.
      return json({ erro: mensagem }, status, cabecalhosCors);
    }
  },
};
