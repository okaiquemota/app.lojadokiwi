#!/usr/bin/env node
// Fabrica os produtos próprios da loja.
//
//   node fabrica/construir.mjs                 # todos os produtos
//   node fabrica/construir.mjs planner-2027    # só um (ou vários ids)
//
// Para cada produto em fabrica/produtos/<id>/produto.mjs:
//   - gera o PDF em fabrica/saida/<id>/ (fica fora do Git: é o que se vende)
//   - gera a capa e a galeria em imagens/ e imagens/thumbs/
//   - atualiza fabrica/catalogo.json (lido pelo checkout) e produtos-proprios.js (lido pelo site)
//
// Depois rode `node fabrica/publicar.mjs` para enviar os PDFs ao cofre (R2).
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { FABRICA, RAIZ, SAIDA, documento, renderizarPdf, fotografar, paraWebp } from './lib/render.mjs';
import { htmlCapa } from './lib/capa.mjs';

const PASTA_PRODUTOS = path.join(FABRICA, 'produtos');
const CATALOGO = path.join(FABRICA, 'catalogo.json');
const PRODUTOS_SITE = path.join(RAIZ, 'produtos-proprios.js');

const reais = (valor) => 'R$ ' + valor.toFixed(2).replace('.', ',');
const kb = (n) => n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`;

const lerCatalogo = () => existsSync(CATALOGO)
  ? JSON.parse(readFileSync(CATALOGO, 'utf8'))
  : { produtos: {} };

async function construir(id) {
  const modulo = await import(pathToFileURL(path.join(PASTA_PRODUTOS, id, 'produto.mjs')).href);
  const { info, css = '', paginas } = modulo;
  if (info.id !== id) throw new Error(`${id}: info.id (${info.id}) precisa ser igual ao nome da pasta`);

  const t0 = Date.now();
  const html = documento({ titulo: `${info.nome} · Loja do Kiwi`, css, paginas: paginas() });
  const r = await renderizarPdf({ id, arquivo: info.arquivo, html });

  // Capa da vitrine com as páginas reais em leque.
  const capa = info.capa;
  const folhas = capa.folhas.map(n => r.paginas[n - 1]);
  const capaPng = path.join(SAIDA, id, 'capa.png');
  await fotografar({
    html: htmlCapa({ ...capa, selo: capa.selo || `${r.totalPaginas}<small>páginas</small>`, folhas }),
    destino: capaPng, largura: 800, altura: 800,
  });
  paraWebp(capaPng, path.join(RAIZ, 'imagens', `${id}.webp`), 800);
  paraWebp(capaPng, path.join(RAIZ, 'imagens', 'thumbs', `${id}.webp`), 400);

  // Galeria "veja por dentro" com páginas escolhidas.
  const galeria = (info.galeria || []).map(n => {
    const nome = `${id}-p${n}.webp`;
    paraWebp(r.paginas[n - 1], path.join(RAIZ, 'imagens', nome), 800, 80);
    paraWebp(r.paginas[n - 1], path.join(RAIZ, 'imagens', 'thumbs', nome), 400, 80);
    return `imagens/${nome}`;
  });

  // A chave no cofre muda quando o conteúdo muda: o cliente nunca baixa versão velha do cache.
  const versao = createHash('sha256').update(html).digest('hex').slice(0, 10);
  const chave = `produtos/${id}/${info.arquivo}-${versao}.pdf`;

  console.log(`  ✓ ${info.nome}`);
  console.log(`    ${r.totalPaginas} páginas · PDF ${kb(r.bytes)} · ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  return {
    vendas: {
      nome: info.nome,
      precoCentavos: Math.round(info.preco * 100),
      imagem: `https://lojadokiwi.com.br/imagens/${id}.webp`,
      paginas: r.totalPaginas,
      arquivos: [{
        chave,
        nome: `${info.arquivo}.pdf`,
        local: path.relative(RAIZ, r.pdf),
        bytes: r.bytes,
      }],
    },
    site: {
      id,
      checkout: 'loja',
      nome: info.nome,
      subtitulo: info.subtitulo,
      categoria: info.categoria,
      categoriaNome: info.categoriaNome,
      preco: reais(info.preco),
      imagem: `imagens/${id}.webp`,
      imagemAlt: info.imagemAlt,
      galeria,
      paginas: r.totalPaginas,
      mostrarNaInicial: info.mostrarNaInicial !== false,
      textoCompra: info.textoCompra || 'Comprar e baixar agora',
      textoSeguro: 'Pix ou cartão pelo Mercado Pago · download na hora',
      descricao: info.descricao,
      descricaoDetalhada: info.descricaoDetalhada,
      itens: info.itens,
      idealPara: info.idealPara,
      comoUsar: info.comoUsar || [
        'Clique em "Comprar e baixar agora" e pague com Pix ou cartão.',
        'Assim que o pagamento for aprovado, o botão de download aparece na tela.',
        'Imprima em casa ou na gráfica, quantas vezes precisar.',
      ],
      observacoes: [
        ...(info.observacoes || []),
        'Produto digital: nenhum item físico será enviado.',
        `Arquivo PDF tamanho A4 com ${r.totalPaginas} páginas. Abre no celular, no computador e na gráfica.`,
      ],
      ordem: info.ordem ?? 50,
    },
  };
}

function gravarSite(catalogo) {
  const entradas = Object.values(catalogo.produtos)
    .map(p => p.site)
    .sort((a, b) => a.ordem - b.ordem);
  const js = `// GERADO por fabrica/construir.mjs — não edite à mão: mude o produto em
// fabrica/produtos/<id>/produto.mjs e rode a fábrica de novo.
//
// Produtos próprios da Loja do Kiwi: vendidos pelo checkout da loja (Mercado Pago)
// com entrega automática do PDF. Entram na frente dos produtos do produtos.js.
window.produtosLojadoKiwi = ${JSON.stringify(entradas, null, 2)}.concat(window.produtosLojadoKiwi || []);
`;
  writeFileSync(PRODUTOS_SITE, js);
}

async function main() {
  const todos = readdirSync(PASTA_PRODUTOS)
    .filter(d => existsSync(path.join(PASTA_PRODUTOS, d, 'produto.mjs')));
  const pedidos = process.argv.slice(2);
  const ids = pedidos.length ? pedidos : todos;
  const desconhecidos = ids.filter(id => !todos.includes(id));
  if (desconhecidos.length) {
    console.error(`Produto(s) não encontrado(s): ${desconhecidos.join(', ')}\nDisponíveis: ${todos.join(', ')}`);
    process.exit(1);
  }

  const catalogo = lerCatalogo();
  // Produto cuja pasta foi apagada sai do catálogo.
  for (const id of Object.keys(catalogo.produtos)) if (!todos.includes(id)) delete catalogo.produtos[id];

  console.log(`\nFabricando ${ids.length} produto(s)\n`);
  for (const id of ids) {
    const { vendas, site } = await construir(id);
    catalogo.produtos[id] = { ...vendas, site };
  }

  catalogo.atualizadoEm = new Date().toISOString();
  writeFileSync(CATALOGO, JSON.stringify(catalogo, null, 2) + '\n');
  gravarSite(catalogo);

  const faltando = Object.entries(catalogo.produtos)
    .flatMap(([, p]) => p.arquivos)
    .filter(a => !existsSync(path.join(RAIZ, a.local)) || statSync(path.join(RAIZ, a.local)).size !== a.bytes);
  console.log(`\nCatálogo: ${Object.keys(catalogo.produtos).length} produto(s) próprio(s).`);
  if (faltando.length) console.log(`Atenção: ${faltando.length} PDF(s) do catálogo não estão nesta máquina.`);
  console.log('Próximo passo: node fabrica/publicar.mjs  (envia os PDFs e o catálogo ao checkout)\n');
}

main().catch(e => { console.error(e); process.exit(1); });
