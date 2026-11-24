#!/usr/bin/env node
// Testa o Worker de ponta a ponta no Node (veja ambiente-teste.mjs).
//
//   MP_ACCESS_TOKEN=TEST-... node checkout/teste-local.mjs
import { worker, env, pagar } from './ambiente-teste.mjs';

const ORIGEM = 'https://lojadokiwi-checkout.exemplo.workers.dev';
const chamar = (caminho, opcoes = {}) => worker.fetch(new Request(ORIGEM + caminho, {
  ...opcoes, headers: { origin: 'https://lojadokiwi.com.br', 'content-type': 'application/json', ...(opcoes.headers || {}) },
}), env);

let falhas = 0;
const confere = (cond, msg) => { console.log(`  ${cond ? '✓' : '✗'} ${msg}`); if (!cond) falhas++; };

async function main() {
  console.log('\n1. Checkout');
  let r = await chamar('/api/checkout', { method: 'POST', body: JSON.stringify({ produto: 'kit-amigo-secreto' }) });
  const checkout = await r.json();
  confere(r.status === 200 && checkout.url?.includes('mercadopago'), `link de pagamento criado (${checkout.url?.slice(0, 60)}…)`);
  confere(r.headers.get('access-control-allow-origin') === 'https://lojadokiwi.com.br', 'CORS liberado para o site');
  const ref = checkout.ref;

  r = await chamar('/api/checkout', { method: 'POST', body: JSON.stringify({ produto: 'nao-existe' }) });
  confere(r.status === 404, 'produto inexistente é recusado');

  console.log('\n2. Pedido antes de pagar');
  r = await chamar(`/api/pedido?ref=${ref}`);
  let pedido = await r.json();
  confere(pedido.status === 'criado' && !pedido.arquivos, `status "${pedido.status}", sem arquivos`);
  r = await chamar(`/download/${ref}/0`);
  confere(r.status === 302, 'download bloqueado e redireciona para a página do pedido');

  console.log('\n3. Pagamento recusado');
  pagar(ref, 9.90, 'rejected', 'master');
  pedido = await (await chamar(`/api/pedido?ref=${ref}`)).json();
  confere(pedido.status === 'recusado' && !pedido.arquivos, `pedido "${pedido.status}", sem arquivos`);

  console.log('\n4. Pix pendente e depois aprovado');
  const pix = pagar(ref, 9.90, 'pending');
  pedido = await (await chamar(`/api/pedido?ref=${ref}`)).json();
  confere(pedido.status === 'pendente' && !pedido.arquivos, `Pix gerado e não pago: pedido "${pedido.status}"`);
  pix.status = 'approved'; pix.date_approved = new Date().toISOString();
  const pago = pix;
  pedido = await (await chamar(`/api/pedido?ref=${ref}`)).json();
  confere(pedido.status === 'aprovado' && pedido.arquivos?.length === 1, `pedido "${pedido.status}", ${pedido.arquivos?.length} arquivo liberado`);

  console.log('\n5. Download');
  r = await chamar(`/download/${ref}/0`);
  const pdf = Buffer.from(await r.arrayBuffer());
  confere(r.status === 200 && pdf.subarray(0, 4).toString() === '%PDF', `PDF entregue (${Math.round(pdf.length / 1024)} KB, ${r.headers.get('content-disposition')})`);
  await chamar(`/download/${ref}/0`); await chamar(`/download/${ref}/0`);
  r = await chamar(`/download/${ref}/0`);
  confere(r.status === 429, 'limite de downloads respeitado');

  console.log('\n6. Recuperar compra pelo número do pagamento');
  r = await chamar('/api/recuperar', { method: 'POST', body: JSON.stringify({ pagamento: String(pago.id), email: 'Comprador.Teste@Exemplo.com' }) });
  confere((await r.json()).ref === ref, 'número + e-mail certos devolvem o pedido');
  r = await chamar('/api/recuperar', { method: 'POST', body: JSON.stringify({ pagamento: String(pago.id), email: 'outra@pessoa.com' }) });
  confere(r.status === 404, 'e-mail errado não devolve nada');

  console.log('\n7. Aviso do Mercado Pago (webhook)');
  r = await chamar(`/webhook/mercadopago?type=payment&data.id=${pago.id}`, { method: 'POST', body: JSON.stringify({ type: 'payment', data: { id: String(pago.id) } }) });
  confere(r.status === 200, 'aviso processado');

  console.log('\n8. Pedido com valor adulterado não libera');
  const ref2 = (await (await chamar('/api/checkout', { method: 'POST', body: JSON.stringify({ produto: 'planner-2027' }) })).json()).ref;
  pagar(ref2, 1.00, 'approved');
  pedido = await (await chamar(`/api/pedido?ref=${ref2}`)).json();
  confere(pedido.status === 'criado' && !pedido.arquivos, `pagou R$ 1,00 por um produto de R$ 16,90: pedido continua "${pedido.status}"`);

  console.log('\n9. Estorno bloqueia o download');
  const ref3 = (await (await chamar('/api/checkout', { method: 'POST', body: JSON.stringify({ produto: 'kit-atividades-natal' }) })).json()).ref;
  const p3 = pagar(ref3, 12.90, 'approved', 'visa');
  r = await chamar(`/download/${ref3}/0`);
  confere(r.status === 200, 'baixou enquanto estava pago');
  p3.status = 'refunded';
  await chamar(`/webhook/mercadopago?type=payment&data.id=${p3.id}`, { method: 'POST', body: '{}' });
  r = await chamar(`/download/${ref3}/0`);
  confere(r.status === 302, 'depois do estorno, o download é bloqueado');

  console.log('\n10. Painel');
  r = await chamar('/painel?chave=teste');
  const html = await r.text();
  confere(r.status === 200 && html.includes('Kit Amigo Secreto') && html.includes('R$'), 'painel mostra a venda');
  r = await chamar('/painel?chave=errada');
  confere(r.status === 404, 'painel escondido sem a senha');

  console.log(falhas ? `\n${falhas} verificação(ões) falharam.\n` : '\nTudo certo.\n');
  process.exit(falhas ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
