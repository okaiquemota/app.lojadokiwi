# Loja do Kiwi

Loja de materiais digitais para imprimir — kits de atividades, materiais pedagógicos,
cursos e lembrancinhas em PDF.

A loja vende de dois jeitos:

- **Produtos próprios** — criados pela fábrica deste repositório (`fabrica/`) e vendidos
  pelo checkout próprio (`checkout/`): o cliente paga com Pix ou cartão no Mercado Pago e
  baixa o PDF na hora, sem ninguém precisar estar online.
- **Produtos parceiros** — cursos e materiais de terceiros, com pagamento e entrega pela
  Kiwify (links de afiliado no `produtos.js`).

**No ar:** <https://lojadokiwi.com.br>

---

## Como o site funciona

São páginas HTML estáticas publicadas pelo **GitHub Pages**. Não há servidor, banco de
dados nem etapa de compilação: o que está na branch `main` é exatamente o que vai ao ar,
poucos segundos depois do envio.

O catálogo mora em dois arquivos: **`produtos.js`** (produtos parceiros, editado à mão) e
**`produtos-proprios.js`** (produtos próprios, gerado pela fábrica — não edite à mão). O
`script.js` lê os dois e monta a vitrine, as categorias, a busca e a página de cada
produto no navegador.

```
cliente ──> lojadokiwi.com.br (GitHub Pages) ──"Comprar"──> checkout (Cloudflare Worker)
                                                              │  cria o pagamento
                                                              ▼
            /pedido/  <──volta──  Mercado Pago (Pix ou cartão)
               │
               └──> checkout confere o pagamento no Mercado Pago e libera o PDF,
                    guardado num cofre privado (Cloudflare R2). Pedidos ficam no D1.
```

## Estrutura

```
index.html            página inicial (carrossel, mais vendidos, categorias)
produtos/             catálogo, busca e página de detalhe de cada produto
duvidas/              perguntas frequentes e canais de atendimento
termos-de-uso/        termos de uso e política de reembolso
404.html              página de endereço não encontrado

pedido/               "Minhas compras": confirma o pagamento e entrega o download

produtos.js           CATÁLOGO dos produtos parceiros e das categorias
produtos-proprios.js  CATÁLOGO dos produtos próprios (gerado pela fábrica)
script.js             monta as vitrines, busca, menu, carrossel, acordeão e compra
style.css             estilos de todo o site

imagens/              imagens de 800px, usadas na página de detalhe
imagens/thumbs/       miniaturas de 400px, usadas nos cards da vitrine
ferramentas/          scripts de apoio (ver abaixo)
divulgacao/           posts, stories e legendas prontos para as redes sociais
fabrica/              fábrica de produtos próprios: gera PDF, capa, galeria e banner
checkout/             checkout próprio (Cloudflare Worker + Mercado Pago)

CNAME                 domínio próprio, lido pelo GitHub Pages
robots.txt            libera a indexação e aponta o sitemap
sitemap.xml           lista de páginas entregue ao Google
```

---

## Produtos próprios: a fábrica

Cada produto próprio é um arquivo `fabrica/produtos/<id>/produto.mjs` com o texto da
vitrine (`info`), o estilo (`css`) e as páginas do PDF (`paginas()`), escritas em HTML.
A fábrica transforma isso em:

- o **PDF A4** que o cliente compra, em `fabrica/saida/` (fora do Git: é o que se vende)
- a **capa** da vitrine, com as páginas reais em leque, e a **galeria** "veja por dentro"
- os catálogos: `fabrica/catalogo.json` (lido pelo checkout) e `produtos-proprios.js` (lido pelo site)

Para criar ou atualizar produtos (precisa de Node 22 e do Chromium do Playwright):

```bash
cd fabrica && npm install && cd ..
node fabrica/construir.mjs                 # todos os produtos
node fabrica/construir.mjs planner-2027    # só um
CLOUDFLARE_API_TOKEN=... node fabrica/publicar.mjs   # envia os PDFs ao cofre
python3 ferramentas/verificar-catalogo.py
```

Depois é só enviar as mudanças (imagens e `produtos-proprios.js`) para a branch `main`.
O PDF novo é vendido assim que o `publicar.mjs` termina; o site atualiza com o envio.

Para um produto novo, copie a pasta de um produto parecido e mude `info.id` para o nome
da pasta. Ilustrações: use `icone('nome')` de `fabrica/lib/icones.mjs` (Fluent Emoji da
Microsoft, licença MIT — o crédito já vai no PDF). Não use imagens de banco sem licença
comercial. O banner da página inicial é gerado por `node fabrica/banner.mjs`.

**Divulgação:** `node fabrica/divulgacao.mjs <id>` cria em `divulgacao/<id>/` o post do
feed (1080×1350), o story (1080×1920) e a legenda com hashtags, prontos para Instagram,
WhatsApp e Pinterest.

**Produto novo toda semana:** uma tarefa agendada no Claude Code cria um produto da
época a cada semana, publica o PDF no cofre e abre um pull request com o produto e as
imagens de divulgação. O produto só vai ao ar quando o pull request é mesclado.

Produtos no ar: Kit Amigo Secreto, Kit de Atividades de Natal, Planner 2027 e
Caça-Palavras Bíblico.

## Checkout próprio (Mercado Pago + Cloudflare)

O `checkout/` é um Cloudflare Worker publicado em
<https://lojadokiwi-checkout.okaiquemota.workers.dev>. Ele usa:

| Recurso | Nome | Para quê |
|---|---|---|
| R2 (cofre) | `lojadokiwi-produtos` | PDFs e `catalogo.json`. Privado: só o Worker lê |
| D1 (banco) | `lojadokiwi` | pedidos (`checkout/schema.sql`) |
| Segredo | `MP_ACCESS_TOKEN` | Access Token de **produção** do Mercado Pago |
| Segredo | `CHAVE_PAINEL` | senha do painel de vendas |
| Segredo (opcional) | `MP_WEBHOOK_SECRET` | confere a assinatura dos avisos do Mercado Pago |

O preço cobrado vem sempre do `catalogo.json` do cofre, nunca do navegador. Pagamento com
valor menor que o do produto não libera o download, e um estorno ou chargeback bloqueia
o link. Cada pedido pode ser baixado até 30 vezes.

**Configurar o Mercado Pago (uma vez):** no Mercado Pago, abra *Suas integrações →
Credenciais de produção* e copie o *Access Token*. No painel da Cloudflare, abra *Workers
& Pages → lojadokiwi-checkout → Settings → Variables and Secrets → Add*, escolha o tipo
*Secret*, nome `MP_ACCESS_TOKEN`, cole o token e salve. Ou, pelo terminal:

```bash
cd checkout && npx wrangler secret put MP_ACCESS_TOKEN
```

**Ver as vendas:** `https://lojadokiwi-checkout.okaiquemota.workers.dev/painel?chave=<CHAVE_PAINEL>`
mostra vendas do dia, da semana e do mês, por produto, e os últimos pedidos.

**Testar e publicar o Worker:**

```bash
node checkout/teste-local.mjs      # banco e cofre simulados; precisa de MP_ACCESS_TOKEN de teste
cd checkout && npx wrangler deploy # publica (os segredos são mantidos)
```

**Cliente perdeu o link?** Em *Minhas Compras* (`/pedido/`) ele recupera o pedido com o
número do pagamento (vem no e-mail do Mercado Pago) e o e-mail da compra.

---

## Tarefas do dia a dia

### Adicionar um produto parceiro (Kiwify)

Produto próprio é feito pela fábrica (veja acima). Para um produto parceiro:

**1. Prepare a imagem.** O script gera os dois tamanhos que a loja usa:

```bash
python3 ferramentas/otimizar-imagens.py minha-foto.png --nome cartao-dos-votos
```

Ele cria `imagens/cartao-dos-votos.webp` (800px, página de detalhe) e
`imagens/thumbs/cartao-dos-votos.webp` (400px, card). **Nunca coloque a imagem original
direto na pasta** — foi o que fez a página inicial chegar a 19 MB.

**2. Copie um produto parecido no `produtos.js`** e ajuste os campos. Só `nome`,
`subtitulo`, `categoria`, `categoriaNome`, `preco`, `imagem` e `descricao` são
obrigatórios; o resto enriquece a página de detalhe.

**3. Confira antes de enviar:**

```bash
python3 ferramentas/verificar-catalogo.py
```

### Publicar um produto que estava em rascunho

Um produto com `publicado: false` fica cadastrado no `produtos.js` mas **não aparece na
loja**. Serve para preparar um lançamento sem deixar card sem imagem e botão de compra
quebrado no ar.

Para publicar, três coisas precisam estar prontas:

```js
imagem: "imagens/cartao-dos-votos.webp",   // gerada pelo otimizar-imagens.py
linkCompra: "https://pay.kiwify.com.br/…", // link real do checkout
publicado: true,                            // ou apague a linha
```

A categoria do produto volta sozinha ao menu quando ele for publicado.

### Criar uma categoria

Acrescente uma entrada em `categoriasLojadoKiwi`, no fim do `produtos.js`:

```js
festas: {
    nome: "Festas e Eventos",       // aparece no menu e nas abas
    titulo: "Kits Festas e Eventos", // título da página da categoria
    descricao: "Convites, topos de bolo e decorações para comemorações."
},
```

A **chave** (`festas`) é o que vai no campo `categoria` de cada produto e no endereço
(`/produtos/?cat=festas`). Ela precisa bater exatamente — uma diferença de uma letra já
fez um produto sumir do catálogo. O verificador avisa quando isso acontece.

Categorias sem nenhum produto publicado ficam ocultas no menu, nas abas e na home, e
reaparecem sozinhas ao receber o primeiro produto. Um ícone para a categoria pode ser
acrescentado em `iconesCategorias`, no `script.js`.

### Trocar um banner do carrossel

```bash
python3 ferramentas/otimizar-imagens.py banner-novo.png --banner 1
```

Gera a versão de computador e a de celular. Os banners são aplicados pelo `style.css` e
o destino de cada um está no `index.html`; nada mais precisa mudar.

### Editar textos

As dúvidas ficam em `duvidas/index.html` e os termos em `termos-de-uso/index.html`,
escritos direto no HTML. Ao acrescentar uma pergunta nova, copie um bloco
`item-accordion` inteiro — o `script.js` cuida da abertura e dos atributos de
acessibilidade sozinho.

---

## Antes de publicar

```bash
python3 ferramentas/verificar-catalogo.py
```

Confere link de compra ainda no texto de exemplo, imagem que não existe, categoria
inexistente, endereço repetido, preço fora do padrão e campo obrigatório em falta.
Produtos em rascunho aparecem como aviso; produtos no ar, como erro.

## Rodar na sua máquina

Abrir o `index.html` com dois cliques **não funciona** — os endereços começam com `/` e
o navegador bloqueia parte do JavaScript. Suba um servidor local na pasta do projeto:

```bash
python3 -m http.server 8000
```

E acesse <http://localhost:8000>.

---

## Campos de um produto

| Campo | Obrigatório | Para que serve |
|---|---|---|
| `nome` | sim | Título do produto |
| `subtitulo` | sim | Linha de apoio; entra no endereço do produto |
| `categoria` | sim | Chave da categoria, exatamente como em `categoriasLojadoKiwi` |
| `categoriaNome` | sim | Etiqueta exibida na página de detalhe |
| `preco` | sim | No formato `"R$ 19,99"` |
| `imagem` | sim | Caminho da imagem de 800px em `imagens/` |
| `descricao` | sim | Texto curto; vira a descrição da página no Google |
| `publicado` | não | `false` esconde o produto da loja. Ausente = publicado |
| `linkCompra` | não | Checkout da Kiwify. Sem ele, o botão não leva a lugar nenhum |
| `mostrarNaInicial` | não | `true` coloca o produto em "Mais Vendidos" |
| `imagemAlt` | não | Descrição da imagem para leitores de tela e busca |
| `descricaoDetalhada` | não | Texto longo da página de detalhe |
| `itens` | não | Lista "O que vem no arquivo" |
| `idealPara` | não | Lista "Ideal para" |
| `comoUsar` | não | Lista numerada "Como usar" |
| `observacoes` | não | Lista "Observações" |
| `textoCompra` | não | Texto do botão. Padrão: "Adquirir Material" |
| `slug` | não | Endereço fixo do produto, se não quiser o gerado automaticamente |

---

## Detalhes que vale conhecer antes de mexer

**Dois tamanhos por imagem.** O card mostra a imagem a 200px e a página de detalhe a
400px. Servir o arquivo original de 2000px nos dois lugares custava megabytes por card.
O `script.js` monta o `srcset` sozinho e acha a miniatura pelo caminho — por isso o
nome do arquivo em `imagens/` e em `imagens/thumbs/` precisa ser o mesmo.

**Dois verdes.** `--verde-kiwi` (`#72a325`) é a cor da marca e só aparece em uso
decorativo: bordas, bolinhas, traços. Texto e botões usam `--verde-texto` e
`--verde-botao` (`#4d7215`), porque o verde da marca sobre branco tem contraste de
3,01:1 e a norma de acessibilidade pede 4,5:1. Ao criar um estilo novo com texto verde,
use `--verde-texto`.

**Cabeçalho e rodapé são copiados nas quatro páginas.** É proposital: montá-los por
JavaScript esconderia os links de navegação do Google. Ao mudar o menu, o telefone ou
um link do rodapé, **mude nos quatro arquivos** (`index.html`, `produtos/index.html`,
`duvidas/index.html`, `termos-de-uso/index.html`) e também no `404.html`.

**Todo produto tem página, mas não tem endereço próprio.** As páginas de produto são
montadas no navegador em `/produtos/?produto=nome-do-produto`. O título, a descrição e
a imagem de compartilhamento acompanham o produto aberto — então o link colado no
WhatsApp aparece certo. O que ainda falta é uma pasta de verdade por produto, para cada
um ter a própria entrada no Google.

## Em aberto

- **Endereço próprio por produto** no Google (gerar uma pasta por produto a partir do
  `produtos.js`, de preferência com automação no envio).
- **Ferramenta de medição** — o site não tem Google Analytics nem pixel. O painel do
  checkout já mostra o funil dos produtos próprios (quem clicou em comprar e quem pagou),
  mas não o número de visitas.
- **E-mail com o link de download** — hoje o cliente baixa na página do pedido e recupera
  pelo número do pagamento. Mandar o link por e-mail exige um serviço de envio (ex.: Resend)
  e o domínio configurado nele.
- **Quatro produtos em rascunho** aguardando link de compra e imagem.

---

© Loja do Kiwi. Os textos, imagens e materiais deste repositório são de uso exclusivo da
Loja do Kiwi e não estão licenciados para reuso. Desenvolvido pela
[MovCode](https://movcode.com.br/).
