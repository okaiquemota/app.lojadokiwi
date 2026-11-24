// --- Checkout próprio (Cloudflare Worker + Mercado Pago) ---
// Produtos com `checkout: 'loja'` (gerados pela fábrica em produtos-proprios.js)
// são vendidos aqui mesmo: Pix ou cartão e download automático na página /pedido/.
const CHECKOUT_URL = 'https://lojadokiwi-checkout.okaiquemota.workers.dev';
const CHAVE_PEDIDOS = 'kiwi-pedidos';

// O navegador lembra os pedidos feitos neste aparelho (só o código e o nome:
// quem baixa é o checkout, que confere o pagamento no Mercado Pago).
const lerPedidos = () => {
  try { return JSON.parse(localStorage.getItem(CHAVE_PEDIDOS)) || []; } catch (e) { return []; }
};
const salvarPedido = (pedido) => {
  try {
    const outros = lerPedidos().filter(p => p.ref !== pedido.ref);
    const anterior = lerPedidos().find(p => p.ref === pedido.ref) || {};
    localStorage.setItem(CHAVE_PEDIDOS, JSON.stringify([{ ...anterior, ...pedido }, ...outros].slice(0, 30)));
  } catch (e) { /* navegação privada: segue sem lembrar */ }
};

const escaparHtml = (texto) => String(texto ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// --- Lógica Auxiliar: Criador de Slugs e Formatador de Caminho Absoluto ---
const criarSlug = (produto) => {
  return String(produto.slug || `${produto.nome}-${produto.subtitulo}`)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Garante que a imagem sempre seja buscada da raiz do site
const fixPath = (caminho) => {
  if (!caminho) return '';
  if (caminho.startsWith('http') || caminho.startsWith('/')) return caminho;
  return `/${caminho}`;
};

// Caminho da miniatura de 400px usada nos cards (a imagem grande fica para a
// página de detalhe). Se a miniatura faltar, o srcset cai na imagem original.
const caminhoThumb = (caminho) => {
  if (!caminho || caminho.startsWith('http')) return fixPath(caminho);
  const partes = fixPath(caminho).split('/');
  const arquivo = partes.pop();
  return `${partes.join('/')}/thumbs/${arquivo}`;
};

// Só entram na vitrine os produtos publicados. Um produto com
// `publicado: false` fica cadastrado em produtos.js mas não aparece na loja —
// é assim que se prepara um lançamento sem expor card sem imagem nem link.
const catalogo = () => (window.produtosLojadoKiwi || []).filter(p => p.publicado !== false);

// Monta o card de produto. Existe uma única vez para que lazy loading,
// dimensões e srcset valham para todas as vitrines do site.
const montarCard = (produto, { classeExtra = '', prioridade = false } = {}) => {
  const [reais, centavos = '00'] = String(produto.preco).replace('R$ ', '').split(',');
  const thumb = caminhoThumb(produto.imagem);
  const cheia = fixPath(produto.imagem);
  const alt = produto.imagemAlt || `${produto.nome} - ${produto.subtitulo}`;
  return `
    <a href="/produtos/?produto=${criarSlug(produto)}" class="card-kiwi ${classeExtra}">
      <div class="img-kiwi">
        <img src="${thumb}" srcset="${thumb} 400w, ${cheia} 800w" sizes="(max-width: 768px) 45vw, 200px"
             alt="${alt}" width="400" height="400"
             loading="${prioridade ? 'eager' : 'lazy'}" decoding="async"
             onerror="this.onerror=null; this.src='${cheia}'">
      </div>
      <div class="info-kiwi">
        <span class="preco-kiwi">R$ ${reais}<span class="centavos-kiwi">${centavos}</span></span>
        <span class="titulo-kiwi">${produto.nome} - ${produto.subtitulo}</span>
        ${produto.checkout === 'loja' ? '<span class="selo-card">✓ Download na hora</span>' : ''}
      </div>
    </a>`;
};

// --- Lógica do Carrossel ---
const track = document.getElementById('track');

if (track) {
  const slides = Array.from(track.children);
  const btnDir = document.getElementById('btn-dir');
  const btnEsq = document.getElementById('btn-esq');
  const bolinhas = Array.from(document.querySelectorAll('.bolinha'));

  let indexAtual = 0;
  let intervaloAuto;

  const moverParaSlide = (index) => {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    track.style.transform = 'translateX(-' + index * 100 + '%)';

    bolinhas.forEach(b => b.classList.remove('ativa'));
    bolinhas[index].classList.add('ativa');
    indexAtual = index;
  };

  btnDir.addEventListener('click', () => moverParaSlide(indexAtual + 1));
  btnEsq.addEventListener('click', () => moverParaSlide(indexAtual - 1));

  bolinhas.forEach((bolinha, index) => {
    bolinha.addEventListener('click', () => moverParaSlide(index));
  });

  const iniciarAutoPlay = () => {
    intervaloAuto = setInterval(() => moverParaSlide(indexAtual + 1), 5000);
  };

  const containerCarrossel = document.querySelector('.carrossel-container');
  if (containerCarrossel) {
    containerCarrossel.addEventListener('mouseenter', () => clearInterval(intervaloAuto));
    containerCarrossel.addEventListener('mouseleave', iniciarAutoPlay);
  }
  iniciarAutoPlay();
}

// --- Lógica do Header Mobile ---
const btnMenu = document.getElementById('btn-menu');
const menuNav = document.getElementById('menu-navegacao');
const btnDropdown = document.getElementById('btn-dropdown');
const linkDropdown = document.querySelector('.link-dropdown');

if (btnMenu && menuNav && linkDropdown) {
  btnMenu.addEventListener('click', () => {
    const aberto = btnMenu.classList.toggle('ativo');
    menuNav.classList.toggle('ativo', aberto);
    btnMenu.setAttribute('aria-expanded', String(aberto));
  });

  linkDropdown.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const aberto = btnDropdown.classList.toggle('aberto');
      linkDropdown.setAttribute('aria-expanded', String(aberto));
    }
  });
}

const fecharMenuMobile = () => {
  if (menuNav && menuNav.classList.contains('ativo')) {
    btnMenu.classList.remove('ativo');
    menuNav.classList.remove('ativo');
    btnDropdown.classList.remove('aberto');
    btnMenu.setAttribute('aria-expanded', 'false');
    if (linkDropdown) linkDropdown.setAttribute('aria-expanded', 'false');
  }
};

// Fecha o menu só depois de uma rolagem de verdade. Antes fechava a qualquer
// evento de scroll, e o próprio gesto de abrir o menu já bastava para fechá-lo.
let posicaoAoAbrir = window.scrollY;
window.addEventListener('scroll', () => {
  if (!menuNav || !menuNav.classList.contains('ativo')) {
    posicaoAoAbrir = window.scrollY;
    return;
  }
  if (Math.abs(window.scrollY - posicaoAoAbrir) > 60) fecharMenuMobile();
}, { passive: true });

// Esc fecha o menu, como se espera de qualquer painel sobreposto
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharMenuMobile();
});

document.addEventListener('click', (e) => {
  if (menuNav && !menuNav.contains(e.target) && btnMenu && !btnMenu.contains(e.target)) {
    fecharMenuMobile();
  }
});

// --- Lógica do Slider de Produtos ---
document.querySelectorAll('.bloco-categoria').forEach(bloco => {
  const slider = bloco.querySelector('.slider-produtos, .slider-categorias');
  const btnEsq = bloco.querySelector('.btn-seta-esq');
  const btnDir = bloco.querySelector('.btn-seta-dir');

  if (btnEsq && btnDir && slider) {
    btnDir.addEventListener('click', () => {
      slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
    });
    btnEsq.addEventListener('click', () => {
      slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
    });
  }
});

// --- Lógica de Scroll Suave da Logo ---
const logoLink = document.querySelector('.logo');
const logoRodape = document.querySelector('.logo-rodape');

const scrollToTop = (e) => {
  const taNaHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
  if (taNaHome) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

if (logoLink) logoLink.addEventListener('click', scrollToTop);
if (logoRodape) logoRodape.addEventListener('click', scrollToTop);

// --- Lógica da Barra de Busca ---
const inputBusca = document.querySelector('.input-busca');
const btnBuscaBotao = document.querySelector('.btn-busca');

const realizarBusca = () => {
  const termo = inputBusca.value.trim();
  if (termo !== '') {
    window.location.href = `/produtos/?busca=${encodeURIComponent(termo)}`;
  }
};

if (btnBuscaBotao && inputBusca) {
  btnBuscaBotao.addEventListener('click', (e) => {
    e.preventDefault();
    realizarBusca();
  });

  inputBusca.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      realizarBusca();
    }
  });
}

// Título, descrição e tags de compartilhamento seguem o produto aberto, para
// que um link de produto colado no WhatsApp mostre o produto certo.
const definirMeta = (seletor, atributo, valor) => {
  let tag = document.head.querySelector(seletor);
  if (!tag) {
    tag = document.createElement('meta');
    const [chave, nome] = seletor.replace(/[[\]"']/g, '').split('meta ')[1].split('=');
    tag.setAttribute(chave, nome);
    document.head.appendChild(tag);
  }
  tag.setAttribute(atributo, valor);
};

const META_PADRAO = {
  titulo: document.title,
  descricao: document.head.querySelector('meta[name="description"]')?.content || '',
  imagem: document.head.querySelector('meta[property="og:image"]')?.content || '',
  url: document.head.querySelector('link[rel="canonical"]')?.href || '',
};

const aplicarMetaDoProduto = (produto) => {
  const titulo = produto ? `${produto.nome} - ${produto.subtitulo} | Loja do Kiwi` : META_PADRAO.titulo;
  const descricao = produto ? String(produto.descricao || '').slice(0, 300) : META_PADRAO.descricao;
  const imagem = produto ? new URL(fixPath(produto.imagem), location.origin).href : META_PADRAO.imagem;
  const url = produto
    ? `${location.origin}/produtos/?produto=${criarSlug(produto)}`
    : META_PADRAO.url;

  document.title = titulo;
  definirMeta('meta[name="description"]', 'content', descricao);
  definirMeta('meta[property="og:title"]', 'content', titulo);
  definirMeta('meta[property="og:description"]', 'content', descricao);
  definirMeta('meta[property="og:image"]', 'content', imagem);
  definirMeta('meta[property="og:url"]', 'content', url);
  definirMeta('meta[name="twitter:title"]', 'content', titulo);
  definirMeta('meta[name="twitter:description"]', 'content', descricao);
  definirMeta('meta[name="twitter:image"]', 'content', imagem);

  const canonica = document.head.querySelector('link[rel="canonical"]');
  if (canonica) canonica.href = url;

  let ld = document.getElementById('ld-produto');
  if (!produto) { if (ld) ld.remove(); return; }
  if (!ld) {
    ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'ld-produto';
    document.head.appendChild(ld);
  }
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produto.nome,
    description: produto.descricao,
    image: imagem,
    url,
    brand: { '@type': 'Brand', name: 'Loja do Kiwi' },
    offers: {
      '@type': 'Offer',
      price: String(produto.preco).replace(/[^\d,]/g, '').replace(',', '.'),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url,
    },
  });
};

// --- Lógica da Página de Produtos (Vitrine e Detalhes Dinâmicos SPA) ---
const vitrine = document.getElementById('vitrine-produtos');

if (vitrine) {
  const parametrosInicial = new URLSearchParams(window.location.search);
  let categoriaAtiva = parametrosInicial.get('cat');
  let termoAtivo = parametrosInicial.get('busca');
  let produtoAtivo = parametrosInicial.get('produto');

  const tituloPagina = document.getElementById('titulo-pagina');
  const subtituloPagina = document.getElementById('subtitulo-pagina');
  const mensagemVazia = document.getElementById('mensagem-vazia');
  const containerAbas = document.getElementById('abas-categorias');
  const blocoHeaderInterno = document.querySelector('.bloco-header');

  const atualizarVitrine = (catKey, termo, prodSlug, acaoHistory = 'push') => {
    const novaUrl = new URL(window.location.href);

    if (prodSlug) {
      novaUrl.searchParams.set('produto', prodSlug);
      novaUrl.searchParams.delete('cat');
      novaUrl.searchParams.delete('busca');
    } else if (catKey) {
      novaUrl.searchParams.set('cat', catKey);
      novaUrl.searchParams.delete('busca');
      novaUrl.searchParams.delete('produto');
    } else if (termo) {
      novaUrl.searchParams.set('busca', termo);
      novaUrl.searchParams.delete('cat');
      novaUrl.searchParams.delete('produto');
    } else {
      novaUrl.searchParams.delete('cat');
      novaUrl.searchParams.delete('busca');
      novaUrl.searchParams.delete('produto');
    }

    try {
      if (acaoHistory === 'push') {
        window.history.pushState({}, '', novaUrl.href);
      } else if (acaoHistory === 'replace') {
        window.history.replaceState({}, '', novaUrl.href);
      }
    } catch (e) {
      console.warn("History API bloqueada localmente via file://. Utilize a extensão Live Server.");
    }

    if (containerAbas) {
      const abas = containerAbas.querySelectorAll('.aba-item');
      abas.forEach(aba => {
        const urlAba = new URL(aba.href, window.location.origin);
        const catAba = urlAba.searchParams.get('cat');
        if (!prodSlug && ((!catKey && !catAba) || (catKey === catAba))) {
          aba.classList.add('ativa');
        } else {
          aba.classList.remove('ativa');
        }
      });
    }

    if (prodSlug) {
      const produto = catalogo().find(p => criarSlug(p) === prodSlug);

      if (produto) {
        // O <h1> da página passa a nomear o produto: antes ficava escondido com
        // "Todos os Produtos", deixando dois <h1> no mesmo documento.
        if (tituloPagina) tituloPagina.innerText = `${produto.nome} - ${produto.subtitulo}`;
        aplicarMetaDoProduto(produto);
        if (blocoHeaderInterno) blocoHeaderInterno.style.display = 'none';
        if (mensagemVazia) mensagemVazia.style.display = 'none';

        const relacionados = catalogo()
          .filter(p => p.categoria === produto.categoria && criarSlug(p) !== prodSlug)
          .slice(0, 2);

        vitrine.className = "grade-produtos-detalhe";
        vitrine.innerHTML = `
          <div class="produto-detalhe-wrapper">
            <a href="/produtos/" class="btn-voltar-catalogo">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Voltar ao catálogo
            </a>

            <div class="detalhe-hero">
              <div class="detalhe-galeria">
                <img src="${fixPath(produto.imagem)}" alt="${produto.imagemAlt || produto.nome}"
                     width="800" height="800" decoding="async" id="imagem-principal">
                ${produto.galeria && produto.galeria.length ? `
                  <div class="galeria-miniaturas" aria-label="Veja as páginas por dentro">
                    ${[produto.imagem, ...produto.galeria].map((img, i) => `
                      <button type="button" class="miniatura ${i === 0 ? 'ativa' : ''}" data-imagem="${fixPath(img)}"
                              aria-label="${i === 0 ? 'Capa' : `Página de dentro ${i}`}">
                        <img src="${caminhoThumb(img)}" alt="" width="80" height="${i === 0 ? 80 : 113}" loading="lazy" decoding="async">
                      </button>`).join('')}
                  </div>
                  <p class="galeria-legenda">Veja as páginas por dentro</p>` : ''}
              </div>
              <div class="detalhe-resumo">
                <span class="detalhe-categoria-tag">${produto.categoriaNome}</span>
                <h2 class="detalhe-titulo-main">${produto.nome}</h2>
                <p class="detalhe-subtitulo-main">${produto.subtitulo}</p>
                <p class="detalhe-desc-main">${produto.descricaoDetalhada || produto.descricao}</p>
                <div class="detalhe-preco-box">
                  <span class="detalhe-preco-tag">${produto.preco}</span>
                </div>
                ${produto.checkout === 'loja' ? `
                  <button type="button" class="btn-checkout-kiwify btn-comprar-loja" data-produto="${produto.id}">
                    ${produto.textoCompra || 'Comprar agora'}
                  </button>
                  <p class="aviso-compra" role="status" aria-live="polite"></p>
                  <ul class="formas-pagamento" aria-label="Formas de pagamento">
                    <li>Pix</li><li>Cartão de crédito</li><li>PDF de ${produto.paginas} páginas</li>
                  </ul>
                ` : `
                  <a href="${produto.linkCompra || '#'}" target="_blank" rel="noopener noreferrer" class="btn-checkout-kiwify">
                    ${produto.textoCompra || 'Adquirir Material'}
                  </a>
                `}
                <p class="detalhe-seguro-tag">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  ${produto.textoSeguro || 'Pagamento 100% seguro'}
                </p>
              </div>
            </div>

            <div class="detalhe-grid-conteudo">
              <div class="detalhe-col">
                ${produto.itens && produto.itens.length ? `
                  <div class="detalhe-bloco-info">
                    <h3>O que vem no arquivo:</h3>
                    <ul>
                      ${produto.itens.map(item => `<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${item}</span></li>`).join('')}
                    </ul>
                  </div>
                ` : ''}

                ${produto.idealPara && produto.idealPara.length ? `
                  <div class="detalhe-bloco-info">
                    <h3>Ideal para:</h3>
                    <ul>
                      ${produto.idealPara.map(item => `<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${item}</span></li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>

              <div class="detalhe-col">
                ${produto.comoUsar && produto.comoUsar.length ? `
                  <div class="detalhe-bloco-info">
                    <h3>Como usar:</h3>
                    <div class="detalhe-passos-wrapper">
                      ${produto.comoUsar.map((passo, i) => `
                        <div class="detalhe-passo-linha">
                          <span class="passo-numero">${i + 1}</span>
                          <p>${passo}</p>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                ` : ''}

                ${produto.observacoes && produto.observacoes.length ? `
                  <div class="detalhe-bloco-obs">
                    <h3>Observações:</h3>
                    <ul>
                      ${produto.observacoes.map(obs => `<li>• ${obs}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>

            ${relacionados.length ? `
              <div class="detalhe-secao-relacionados">
                <h3 class="relacionados-titulo-secao">Você também pode gostar:</h3>
                <div class="grade-produtos">
                  ${relacionados.map(p => montarCard(p, { classeExtra: 'card-detalhe-link' })).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
        return;
      }
    }

    vitrine.className = "grade-produtos";

    aplicarMetaDoProduto(null);
    if (blocoHeaderInterno) blocoHeaderInterno.style.display = 'flex';
    let produtosFiltrados = catalogo();

    if (catKey) {
      produtosFiltrados = produtosFiltrados.filter(p => p.categoria === catKey);
      const infoCat = window.categoriasLojadoKiwi && window.categoriasLojadoKiwi[catKey];
      if (tituloPagina) tituloPagina.innerText = infoCat ? infoCat.titulo : "Categoria";
      if (subtituloPagina) subtituloPagina.innerText = infoCat ? infoCat.descricao : `Explorando produtos.`;
    }
    else if (termo) {
      const termoMin = termo.toLowerCase();
      produtosFiltrados = produtosFiltrados.filter(p =>
        p.nome.toLowerCase().includes(termoMin) ||
        p.descricao.toLowerCase().includes(termoMin) ||
        p.subtitulo.toLowerCase().includes(termoMin)
      );
      if (tituloPagina) tituloPagina.innerText = "Resultados da Busca";
      if (subtituloPagina) subtituloPagina.innerText = `Mostrando resultados para: "${termo}"`;
    }
    else {
      if (tituloPagina) tituloPagina.innerText = "Todos os Produtos";
      if (subtituloPagina) subtituloPagina.innerText = "Explore nosso catálogo completo de materiais e recursos.";
    }

    vitrine.innerHTML = '';

    if (produtosFiltrados.length === 0) {
      if (mensagemVazia) mensagemVazia.style.display = 'flex';
    } else {
      if (mensagemVazia) mensagemVazia.style.display = 'none';

      // Uma única escrita no DOM: antes cada produto remontava a vitrine inteira.
      vitrine.innerHTML = produtosFiltrados
        .map((produto, i) => montarCard(produto, {
          classeExtra: 'card-detalhe-link',
          prioridade: i < 4,
        }))
        .join('');
    }
  };

  if (containerAbas && window.categoriasLojadoKiwi) {
    // Só entram as categorias com pelo menos um produto publicado. Antes, sete
    // das dez abas levavam a "Nenhum produto encontrado".
    const abas = [`<a href="/produtos/" class="aba-item ${!categoriaAtiva && !produtoAtivo ? 'ativa' : ''}">Todos</a>`];
    Object.keys(window.categoriasLojadoKiwi).forEach(chave => {
      if (!catalogo().some(p => p.categoria === chave)) return;
      const cat = window.categoriasLojadoKiwi[chave];
      const classeAtiva = (categoriaAtiva === chave && !produtoAtivo) ? 'ativa' : '';
      abas.push(`<a href="/produtos/?cat=${chave}" class="aba-item ${classeAtiva}">${cat.nome}</a>`);
    });
    containerAbas.innerHTML = abas.join('');

    containerAbas.addEventListener('click', (e) => {
      const link = e.target.closest('.aba-item');
      if (link) {
        e.preventDefault();
        const urlClicada = new URL(link.href);
        atualizarVitrine(urlClicada.searchParams.get('cat'), null, null, 'push');
      }
    });
  }

  const comprar = async (botao) => {
    const aviso = botao.parentElement.querySelector('.aviso-compra');
    const produto = catalogo().find(p => p.id === botao.dataset.produto);
    const textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = 'Abrindo o pagamento seguro…';
    if (aviso) aviso.textContent = '';
    try {
      const resposta = await fetch(`${CHECKOUT_URL}/api/checkout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ produto: botao.dataset.produto }),
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok || !dados.url) throw new Error(dados.erro || 'Não foi possível abrir o pagamento.');
      salvarPedido({ ref: dados.ref, produto: produto.id, nome: produto.nome, url: dados.url, criadoEm: Date.now(), status: 'criado' });
      window.location.href = dados.url;
    } catch (erro) {
      botao.disabled = false;
      botao.textContent = textoOriginal;
      if (aviso) {
        aviso.innerHTML = `${escaparHtml(erro.message)} Tente de novo ou <a href="https://wa.me/5516982157266?text=${encodeURIComponent(`Oi! Quero comprar: ${produto.nome}`)}" target="_blank" rel="noopener noreferrer">compre pelo WhatsApp</a>.`;
      }
    }
  };

  vitrine.addEventListener('click', (e) => {
    const botaoCompra = e.target.closest('.btn-comprar-loja');
    if (botaoCompra) {
      comprar(botaoCompra);
      return;
    }
    const miniatura = e.target.closest('.miniatura');
    if (miniatura) {
      const principal = document.getElementById('imagem-principal');
      if (principal) principal.src = miniatura.dataset.imagem;
      vitrine.querySelectorAll('.miniatura').forEach(m => m.classList.toggle('ativa', m === miniatura));
      return;
    }
    const voltar = e.target.closest('.btn-voltar-catalogo');
    if (voltar) {
      e.preventDefault();
      atualizarVitrine(null, null, null, 'push');
      return;
    }
    const rel = e.target.closest('.card-detalhe-link');
    if (rel) {
      e.preventDefault();
      const urlRel = new URL(rel.href);
      atualizarVitrine(null, null, urlRel.searchParams.get('produto'), 'push');
    }
  });

  atualizarVitrine(categoriaAtiva, termoAtivo, produtoAtivo, 'replace');

  window.addEventListener('popstate', () => {
    const paramsPop = new URLSearchParams(window.location.search);
    atualizarVitrine(paramsPop.get('cat'), paramsPop.get('busca'), paramsPop.get('produto'), 'none');
  });
}

const objCategorias = window.categoriasLojadoKiwi;

if (objCategorias) {
  const iconesCategorias = {
    educacao: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    presentes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>`,
    cursos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>`,
    cristao: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="5" y1="7" x2="19" y2="7"></line></svg>`,
    diaDosNamorados: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    arteDecoracao: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
    festas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
    etiquetas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
    organizacao: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  };

  // Categorias sem nenhum produto publicado não entram no menu nem na vitrine:
  // voltam sozinhas assim que o primeiro produto delas for publicado.
  const categoriasComProduto = Object.keys(objCategorias)
    .filter(chave => catalogo().some(p => p.categoria === chave));

  const conteudosDropdown = document.querySelectorAll('.conteudo-dropdown');
  conteudosDropdown.forEach(dropdown => {
    dropdown.innerHTML = categoriasComProduto
      .map(chave => `<a href="/produtos/?cat=${chave}">${objCategorias[chave].nome}</a>`)
      .join('');
  });

  const vitrineCatHome = document.getElementById('vitrine-categorias-home');
  if (vitrineCatHome) {
    vitrineCatHome.innerHTML = categoriasComProduto.map(chave => {
      const cat = objCategorias[chave];
      const meuIconeHtml = iconesCategorias[chave] || `<span>${cat.nome.split(' ')[0]}</span>`;
      return `
        <a href="/produtos/?cat=${chave}" class="card-categoria">
          <div class="img-categoria" aria-hidden="true">${meuIconeHtml}</div>
          <span class="titulo-categoria">${cat.nome}</span>
        </a>`;
    }).join('');
  }
}

const vitrineMaisVendidos = document.getElementById('produtos-mais-vendidos');

if (vitrineMaisVendidos && window.produtosLojadoKiwi) {
  // Os quatro primeiros cards são os únicos visíveis de imediato: carregam
  // com prioridade; o resto entra sob demanda ao rolar.
  vitrineMaisVendidos.innerHTML = catalogo()
    .filter(p => p.mostrarNaInicial === true)
    .map((produto, i) => montarCard(produto, { prioridade: i < 4 }))
    .join('');
}

const containerDinamico = document.getElementById('container-categorias-dinamicas');

if (containerDinamico && window.categoriasLojadoKiwi && window.produtosLojadoKiwi) {
  Object.keys(window.categoriasLojadoKiwi).forEach(catKey => {
    const catInfo = window.categoriasLojadoKiwi[catKey];
    const produtosDaCat = catalogo().filter(p => p.categoria === catKey);

    if (produtosDaCat.length > 0) {
      const secao = document.createElement('section');
      secao.className = 'bloco-categoria';
      secao.innerHTML = `
        <div class="bloco-header">
          <h2 class="bloco-titulo">${catInfo.titulo || catInfo.nome}</h2>
          <a href="/produtos/?cat=${catKey}" class="ver-tudo">Ver tudo</a>
        </div>
        <div class="slider-produtos-container">
          <div class="slider-produtos">
            ${produtosDaCat.map(produto => montarCard(produto)).join('')}
          </div>
        </div>
      `;
      containerDinamico.appendChild(secao);
    }
  });
}

document.querySelectorAll('.botao-accordion').forEach((botao, i) => {
  const itemAtual = botao.parentElement;
  const painel = itemAtual.querySelector('.painel-resposta');

  // Leitores de tela precisam saber se a resposta está aberta e qual painel
  // o botão controla.
  const idPainel = `resposta-faq-${i + 1}`;
  painel.id = idPainel;
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-controls', idPainel);

  botao.addEventListener('click', () => {
    document.querySelectorAll('.item-accordion.ativo').forEach(outroItem => {
      if (outroItem !== itemAtual) {
        outroItem.classList.remove('ativo');
        outroItem.querySelector('.painel-resposta').style.maxHeight = null;
        outroItem.querySelector('.botao-accordion').setAttribute('aria-expanded', 'false');
      }
    });

    const aberto = itemAtual.classList.toggle('ativo');
    botao.setAttribute('aria-expanded', String(aberto));
    painel.style.maxHeight = aberto ? painel.scrollHeight + 'px' : null;
  });
});

// Ao girar o celular o texto reflui e fica mais alto: sem recalcular, a
// resposta aberta era cortada.
window.addEventListener('resize', () => {
  document.querySelectorAll('.item-accordion.ativo .painel-resposta').forEach(painel => {
    painel.style.maxHeight = painel.scrollHeight + 'px';
  });
});

// --- Página do pedido (/pedido/): confirma o pagamento e entrega o PDF ---
const areaPedido = document.getElementById('area-pedido');

if (areaPedido) {
  const params = new URLSearchParams(window.location.search);
  const refAtual = params.get('ref');
  const WHATSAPP = 'https://wa.me/5516982157266';
  const formatarBytes = (n) => n > 1048576 ? `${(n / 1048576).toFixed(1).replace('.', ',')} MB` : `${Math.round(n / 1024)} KB`;
  const linkProduto = (id) => {
    const produto = catalogo().find(p => p.id === id);
    return produto ? `/produtos/?produto=${criarSlug(produto)}` : '/produtos/';
  };

  // O Mercado Pago devolve vários parâmetros; fica só o código, que é o link para guardar.
  if (refAtual && params.toString() !== `ref=${refAtual}`) {
    try { history.replaceState({}, '', `/pedido/?ref=${refAtual}`); } catch (e) { /* segue */ }
  }

  const desenhar = (html) => { areaPedido.innerHTML = html; };
  let tentativas = 0;
  let relogio;

  const estados = {
    carregando: () => `
      <div class="pedido-icone carregando" aria-hidden="true"></div>
      <h1>Conferindo o seu pedido…</h1>
      <p>Só um instante.</p>`,

    aprovado: (d) => `
      <div class="pedido-icone ok" aria-hidden="true">✓</div>
      <h1>Pagamento aprovado!</h1>
      <p>Obrigado pela compra. Seu arquivo está pronto para baixar:</p>
      <div class="pedido-produto">
        ${d.produto.imagem ? `<img src="${escaparHtml(d.produto.imagem.replace('https://lojadokiwi.com.br', ''))}" alt="" width="88" height="88">` : ''}
        <div>
          <strong>${escaparHtml(d.produto.nome)}</strong>
          ${d.arquivos.map(a => `
            <a class="btn-download" href="${escaparHtml(a.url)}" download>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Baixar PDF <small>${a.paginas} páginas · ${formatarBytes(a.bytes)}</small>
            </a>`).join('')}
        </div>
      </div>
      <ul class="pedido-dicas">
        <li><b>Guarde este link</b> (favoritos ou print da tela): ele vale para baixar de novo quando precisar.</li>
        <li>No celular, o PDF vai para a pasta <b>Downloads</b> ou <b>Arquivos</b>.</li>
        <li>Imprima em papel A4, em casa ou na gráfica, quantas vezes quiser.</li>
      </ul>
      <p class="pedido-miudo">Pedido ${escaparHtml(d.ref)} · pagamento ${escaparHtml(d.pagamento || '')}</p>`,

    pendente: () => `
      <div class="pedido-icone carregando" aria-hidden="true"></div>
      <h1>Aguardando a confirmação do pagamento</h1>
      <p>Se você pagou com Pix, a confirmação costuma levar poucos segundos. <b>Esta página atualiza sozinha</b> e o botão de download aparece aqui.</p>
      <button type="button" class="btn-secundario" data-acao="verificar">Já paguei, verificar agora</button>`,

    criado: (d) => {
      const salvo = lerPedidos().find(p => p.ref === d.ref);
      return `
        <div class="pedido-icone espera" aria-hidden="true">…</div>
        <h1>Ainda não recebemos o pagamento</h1>
        <p>Pagou agora há pouco? Aguarde alguns segundos: esta página confere sozinha.</p>
        <div class="pedido-acoes">
          ${salvo && salvo.url ? `<a class="btn-checkout-kiwify" href="${escaparHtml(salvo.url)}">Continuar para o pagamento</a>` : ''}
          <button type="button" class="btn-secundario" data-acao="verificar">Verificar de novo</button>
        </div>`;
    },

    recusado: (d) => `
      <div class="pedido-icone erro" aria-hidden="true">!</div>
      <h1>O pagamento não foi aprovado</h1>
      <p>Nenhum valor foi cobrado por este pedido. Você pode tentar de novo com Pix ou com outro cartão.</p>
      <div class="pedido-acoes"><a class="btn-checkout-kiwify" href="${linkProduto(d.produto.id)}">Tentar de novo</a></div>`,

    estornado: () => `
      <div class="pedido-icone erro" aria-hidden="true">!</div>
      <h1>Este pedido foi estornado</h1>
      <p>O valor foi devolvido e o download não está mais disponível. Alguma dúvida? <a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">Fale com a gente no WhatsApp</a>.</p>`,

    erro: (mensagem) => `
      <div class="pedido-icone erro" aria-hidden="true">!</div>
      <h1>Não conseguimos abrir este pedido</h1>
      <p>${escaparHtml(mensagem)}</p>
      <p>Se você já pagou, fique tranquilo: use o formulário abaixo ou <a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">chame no WhatsApp</a> que enviamos o arquivo.</p>`,

    semPedido: () => `
      <h1>Minhas compras</h1>
      <p>As compras feitas neste aparelho aparecem logo abaixo. Comprou em outro celular ou computador? Recupere pelo número do pagamento.</p>`,
  };
  estados.cancelado = estados.recusado;

  const consultar = async () => {
    clearTimeout(relogio);
    try {
      const resposta = await fetch(`${CHECKOUT_URL}/api/pedido?ref=${encodeURIComponent(refAtual)}`);
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.erro || 'Tente de novo em instantes.');
      desenhar((estados[dados.status] || estados.pendente)(dados));
      salvarPedido({ ref: dados.ref, produto: dados.produto.id, nome: dados.produto.nome, status: dados.status });
      listarCompras();
      // Pix e pedido recém-criado: confere a cada 5 s por até 10 min.
      if ((dados.status === 'pendente' || dados.status === 'criado') && ++tentativas < 120) {
        relogio = setTimeout(consultar, 5000);
      }
    } catch (erro) {
      desenhar(estados.erro(erro.message));
    }
  };

  areaPedido.addEventListener('click', (e) => {
    if (e.target.closest('[data-acao="verificar"]')) {
      tentativas = 0;
      desenhar(estados.carregando());
      consultar();
    }
  });

  const listaCompras = document.getElementById('lista-compras');
  const blocoCompras = document.getElementById('minhas-compras');
  const nomesStatus = { aprovado: 'Pago · baixar', pendente: 'Aguardando pagamento', criado: 'Pagamento não concluído', recusado: 'Não aprovado', cancelado: 'Cancelado', estornado: 'Estornado' };
  const listarCompras = () => {
    const pedidos = lerPedidos();
    if (!listaCompras || !pedidos.length) return;
    blocoCompras.hidden = false;
    listaCompras.innerHTML = pedidos.map(p => `
      <li><a href="/pedido/?ref=${encodeURIComponent(p.ref)}" class="${p.ref === refAtual ? 'atual' : ''}">
        <span>${escaparHtml(p.nome)}</span>
        <small class="st-${escaparHtml(p.status || 'criado')}">${nomesStatus[p.status] || 'Ver pedido'}</small>
      </a></li>`).join('');
  };

  const form = document.getElementById('form-recuperar');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const aviso = form.querySelector('.aviso-form');
      const botao = form.querySelector('button');
      botao.disabled = true;
      aviso.textContent = 'Procurando a sua compra…';
      try {
        const resposta = await fetch(`${CHECKOUT_URL}/api/recuperar`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ pagamento: form.pagamento.value, email: form.email.value }),
        });
        const dados = await resposta.json().catch(() => ({}));
        if (!resposta.ok) throw new Error(dados.erro || 'Não encontramos essa compra.');
        window.location.href = `/pedido/?ref=${encodeURIComponent(dados.ref)}`;
      } catch (erro) {
        aviso.textContent = erro.message;
        botao.disabled = false;
      }
    });
  }

  if (refAtual) {
    desenhar(estados.carregando());
    consultar();
  } else {
    desenhar(estados.semPedido());
  }
  listarCompras();
}
