// Kit Amigo Secreto: tudo para organizar a brincadeira de fim de ano.
import { rodape, LOGO_SVG } from '../../lib/render.mjs';
import { icone, CREDITOS } from '../../lib/icones.mjs';

export const info = {
  id: 'kit-amigo-secreto',
  arquivo: 'kit-amigo-secreto-loja-do-kiwi',
  ordem: 10,
  nome: 'Kit Amigo Secreto',
  subtitulo: 'Sorteio, Lista de Desejos e Tags',
  categoria: 'festas',
  categoriaNome: 'Festas e Eventos',
  preco: 9.90,
  imagemAlt: 'Páginas do Kit Amigo Secreto: papeletas de sorteio, lista de desejos, tags de presente e plaquinhas para foto',
  descricao: 'Kit completo para organizar o amigo secreto da família, da escola ou do trabalho: regras, papeletas de sorteio, lista de desejos, tags de presente, Amigo Doce e plaquinhas divertidas para fotos.',
  descricaoDetalhada: 'Organize o amigo secreto sem dor de cabeça. O kit tem o cartaz de regras para preencher (valor, data e local), a lista de participantes, 24 papeletas de sorteio, fichas de lista de desejos para ninguém errar o presente, tags "Para/De", cartões de pistas para a revelação, o calendário do Amigo Doce e plaquinhas engraçadas que rendem as melhores fotos da festa. É só imprimir, recortar e brincar.',
  itens: [
    'Cartaz de regras para preencher (valor, data, local e organizador)',
    'Lista de participantes com controle de quem já entregou',
    '24 papeletas de sorteio para recortar e dobrar',
    'Fichas de lista de desejos (tamanho, cor favorita, gostos)',
    '24 tags de presente "Para / De: seu amigo secreto"',
    'Cartões de pistas para a revelação',
    'Calendário e etiquetas do Amigo Doce (5 dias)',
    '6 ideias de brincadeiras para a hora da revelação',
    '4 plaquinhas divertidas para fotos',
  ],
  idealPara: [
    'Confraternização da firma e do escritório',
    'Amigo secreto da família no Natal',
    'Turmas da escola, igrejas e grupos de amigos',
    'Quem organiza e quer tudo pronto em minutos',
  ],
  observacoes: [
    'Imprima as papeletas e as tags quantas vezes precisar.',
  ],
  capa: {
    cor: '#c8342b', corClara: '#ff8a7a',
    topo: 'PDF PARA IMPRIMIR',
    titulo: 'Kit Amigo<br><em>Secreto</em>',
    sub: 'Sorteio, lista de desejos, tags e plaquinhas',
    folhas: [9, 14, 5],
  },
  galeria: [3, 5, 7, 9, 14],
};

const VERM = '#c8342b', VERDE = '#2f8a46', OURO = '#e0a826', CREME = '#fff7ec';

export const css = `
  .pagina { background: ${CREME}; }
  .em-linha { vertical-align: -0.2em; }
  .creditos { position: absolute; left: 15mm; right: 15mm; bottom: 13mm; font-size: 7pt; color: #aaa; }
  .titulo-pg { font-size: 26pt; color: ${VERM}; display: flex; align-items: center; gap: 4mm; }
  .titulo-pg + .lead { font-size: 11.5pt; color: #555; margin: 2mm 0 6mm; line-height: 1.45; }

  .capa-int { display: flex; flex-direction: column; align-items: center; text-align: center;
    background: radial-gradient(circle at 50% 0%, #ffe3dd 0%, ${CREME} 60%); }
  .capa-int .logo-loja { height: 11mm; width: auto; margin-top: 4mm; }
  .capa-int h1 { font-size: 58pt; color: ${VERM}; margin-top: 20mm; line-height: .95; }
  .capa-int h1 span { display: block; color: ${VERDE}; font-size: 70pt; }
  .capa-int .shh { font: 700 16pt var(--texto); color: #555; margin-top: 7mm; }
  .capa-int .icones { display: flex; gap: 6mm; margin-top: 18mm; }
  .capa-int .conteudo { margin-top: 16mm; display: grid; grid-template-columns: repeat(2, 1fr); gap: 3mm 12mm; text-align: left; font: 700 11.5pt var(--texto); color: #444; }
  .capa-int .conteudo li { list-style: none; display: flex; gap: 2.5mm; align-items: center; }
  .capa-int .conteudo li::before { content: '✓'; color: #fff; background: ${VERDE}; width: 5.5mm; height: 5.5mm; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 8pt; }

  .passos { display: grid; gap: 4mm; }
  .passo { display: flex; gap: 5mm; align-items: flex-start; background: #fff; border-radius: 5mm; padding: 5mm 6mm; border: 1.2px solid #f1dccb; }
  .passo .n { flex: 0 0 12mm; height: 12mm; border-radius: 50%; background: ${VERM}; color: #fff; font: 700 17pt/12mm var(--titulo); text-align: center; }
  .passo h3 { font-size: 14pt; color: #333; margin-bottom: 1mm; }
  .passo p { font-size: 10.5pt; line-height: 1.45; color: #555; }
  .dica-box { margin-top: 6mm; background: #fff3cf; border-radius: 5mm; padding: 5mm 6mm; font-size: 10.5pt; line-height: 1.5; }

  .cartaz { height: 100%; border-radius: 8mm; background: #fff; border: 2.5mm solid ${VERM}; padding: 12mm 14mm; display: flex; flex-direction: column; position: relative; }
  .cartaz h2 { font-size: 34pt; color: ${VERM}; text-align: center; }
  .cartaz .da { text-align: center; font: 700 15pt var(--texto); color: #555; margin-top: 3mm; }
  .cartaz .da span { display: inline-block; width: 90mm; border-bottom: 1.5px solid #999; }
  .campos { margin-top: 9mm; display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 10mm; }
  .campo { background: ${CREME}; border-radius: 4mm; padding: 4mm 5mm; }
  .campo b { display: block; font: 600 12pt var(--titulo); color: ${VERDE}; margin-bottom: 7mm; }
  .campo i { display: block; border-bottom: 1.5px solid #c9b8a6; }
  .regras { margin-top: 9mm; }
  .regras h3 { font-size: 16pt; color: ${VERM}; margin-bottom: 3mm; }
  .regras li { font-size: 11.5pt; line-height: 1.5; margin: 0 0 2.2mm 5mm; }
  .cartaz .canto { position: absolute; }

  table.lista { width: 100%; border-collapse: separate; border-spacing: 0; background: #fff; border-radius: 4mm; overflow: hidden; font-size: 10.5pt; }
  table.lista th { background: ${VERM}; color: #fff; font: 600 11pt var(--titulo); padding: 3mm; text-align: left; }
  table.lista td { border-bottom: 1px solid #f0e2d4; height: 10.4mm; padding: 0 3mm; color: #999; }
  table.lista td.ck { width: 24mm; text-align: center; }
  table.lista td.ck::after { content: ''; display: inline-block; width: 4.5mm; height: 4.5mm; border: 1.4px solid #c9b8a6; border-radius: 1mm; }
  table.lista tr:nth-child(even) td { background: #fffaf3; }

  .grade-corte { display: grid; height: 248mm; }
  .peca { border: 1px dashed #c4b2a0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4mm; background: #fff; }
  .tesoura-topo { font: 600 8pt var(--texto); color: #9a8a7a; margin-bottom: 2mm; }

  .papeleta { gap: 2.5mm; }
  .papeleta .rotulo { font: 800 8.5pt var(--texto); letter-spacing: .12em; text-transform: uppercase; color: ${VERDE}; }
  .papeleta .nome { width: 85%; border-bottom: 1.5px solid #bbb; height: 10mm; }
  .papeleta small { font-size: 8pt; color: #999; }

  .desejos { display: grid; grid-template-rows: 1fr 1fr; height: 248mm; gap: 0; }
  .ficha { border: 1px dashed #c4b2a0; background: #fff; padding: 7mm 9mm; display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 9mm; align-content: start; position: relative; }
  .ficha h3 { grid-column: 1 / -1; font-size: 21pt; display: flex; align-items: center; gap: 3mm; }
  .ficha .f { font: 700 10pt var(--texto); color: #555; }
  .ficha .f i { display: block; border-bottom: 1.3px solid #c9b8a6; height: 7mm; }
  .ficha .f.larga { grid-column: 1 / -1; }
  .ficha .num { display: flex; gap: 2mm; align-items: flex-end; font: 700 12pt var(--titulo); color: ${VERM}; height: 8mm; }
  .ficha .num i { flex: 1; height: auto; }

  .tag { position: relative; gap: 1.5mm; }
  .tag .furo { position: absolute; top: 4mm; width: 5mm; height: 5mm; border-radius: 50%; border: 1.3px solid #bbb; background: ${CREME}; }
  .tag .linha { width: 85%; display: flex; gap: 2mm; align-items: flex-end; font: 700 10pt var(--texto); color: #555; }
  .tag .linha i { flex: 1; border-bottom: 1.3px solid #bbb; height: 6mm; }
  .tag .de { font: 600 11pt var(--titulo); color: ${VERM}; }

  .pista { padding: 8mm; align-items: stretch; text-align: left; }
  .pista h3 { font-size: 17pt; color: ${VERDE}; display: flex; align-items: center; gap: 2mm; margin-bottom: 3mm; }
  .pista .p { font: 700 10pt var(--texto); color: #555; margin-top: 2.5mm; }
  .pista .p i { display: block; border-bottom: 1.3px solid #c9b8a6; height: 7mm; }

  .doce-dias { display: grid; grid-template-columns: repeat(5, 1fr); gap: 3mm; margin: 2mm 0 7mm; }
  .doce-dia { background: #fff; border-radius: 4mm; border: 1.2px solid #f1dccb; padding: 4mm 3mm; text-align: center; }
  .doce-dia b { display: block; font: 700 20pt var(--titulo); color: ${VERM}; }
  .doce-dia span { font: 700 9.5pt var(--texto); color: #555; line-height: 1.35; display: block; margin-top: 1.5mm; }
  .etq-doce { height: 168mm; grid-template-columns: repeat(5, 1fr); grid-template-rows: 1fr 1fr; }
  .etq-doce .peca { gap: 1mm; padding: 2mm; }
  .etq-doce b { font: 700 16pt var(--titulo); color: ${VERM}; }
  .etq-doce small { font: 800 7pt var(--texto); letter-spacing: .1em; text-transform: uppercase; color: ${VERDE}; }
  .etq-doce i { width: 80%; border-bottom: 1.2px solid #bbb; height: 5mm; }

  .ideias { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
  .ideia { background: #fff; border-radius: 5mm; padding: 6mm; border: 1.2px solid #f1dccb; }
  .ideia h3 { font-size: 14pt; color: ${VERM}; margin: 2mm 0 1.5mm; }
  .ideia p { font-size: 10.3pt; line-height: 1.5; color: #555; }

  .placas { display: grid; grid-template-rows: 1fr 1fr; gap: 8mm; height: 252mm; }
  .placa { border-radius: 10mm; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 10mm; position: relative; }
  .placa p { font: 700 34pt/1.08 var(--titulo); color: #fff; text-shadow: 0 1mm 0 rgba(0,0,0,.12); }
  .placa .ic { position: absolute; }
`;

const cantos = (a, b) => `
  <div class="canto" style="top:-9mm;left:-9mm">${icone(a, { tamanho: '24mm' })}</div>
  <div class="canto" style="bottom:-9mm;right:-9mm">${icone(b, { tamanho: '24mm' })}</div>`;

export function paginas() {
  const out = [];
  const total = 15;
  const pg = (classe, conteudo, comRodape = true) => {
    out.push(`<section class="pagina ${classe}">${conteudo}${comRodape ? rodape(`${out.length + 1}/${total}`) : ''}</section>`);
  };

  // 1 — Capa interna
  pg('capa-int', `
    ${LOGO_SVG}
    <h1>Kit Amigo <span>Secreto</span></h1>
    <p class="shh">Tudo pronto para a brincadeira. Shhh... é segredo! ${icone('segredo', { tamanho: '1.15em', classe: 'em-linha' })}</p>
    <div class="icones">${['presente', 'papai-noel', 'segredo', 'laco', 'estrela'].map(n => icone(n, { tamanho: '24mm' })).join('')}</div>
    <ul class="conteudo">
      <li>Cartaz de regras</li><li>Lista de participantes</li>
      <li>24 papeletas de sorteio</li><li>Fichas de lista de desejos</li>
      <li>24 tags de presente</li><li>Cartões de pistas</li>
      <li>Amigo Doce (5 dias)</li><li>Ideias para a revelação</li>
      <li>Plaquinhas para fotos</li><li>Muita diversão</li>
    </ul>
  `, false);

  // 2 — Passo a passo
  pg('', `
    <h2 class="titulo-pg">Como organizar em 5 passos</h2>
    <p class="lead">Imprima só as páginas que for usar. Papel sulfite comum funciona bem; para as tags e as plaquinhas, um papel mais grosso (180 g) deixa tudo mais bonito.</p>
    <div class="passos">
      ${[
        ['Combine as regras', 'Preencha o cartaz com o valor do presente, a data e o local da revelação. Tire uma foto e mande no grupo da turma.'],
        ['Monte a lista de participantes', 'Anote quem vai participar e acompanhe quem já entregou a lista de desejos e quem já comprou o presente.'],
        ['Faça o sorteio', 'Escreva cada nome numa papeleta, dobre e coloque num pote. Quem tirar o próprio nome devolve e sorteia de novo.'],
        ['Troque as listas de desejos', 'Cada pessoa preenche a sua ficha. Assim ninguém erra o tamanho, a cor ou o gosto do amigo secreto.'],
        ['Revele com estilo', 'Use os cartões de pistas e as brincadeiras da página 13. As plaquinhas garantem as fotos mais engraçadas da festa.'],
      ].map(([t, p], i) => `<div class="passo"><div class="n">${i + 1}</div><div><h3>${t}</h3><p>${p}</p></div></div>`).join('')}
    </div>
    <p class="creditos">${CREDITOS}</p>
    <div class="dica-box"><b>Dica de organizador:</b> para grupos grandes ou à distância, faça o sorteio por vídeo e mande a papeleta por foto, só para a pessoa sorteada. As tags e a ficha de desejos também funcionam muito bem enviadas por WhatsApp.</div>
  `);

  // 3 — Cartaz de regras
  pg('', `
    <div class="cartaz">
      ${cantos('presente', 'estrela')}
      <h2>Amigo Secreto</h2>
      <p class="da">da <span>&nbsp;</span></p>
      <div class="campos">
        ${['Data da revelação', 'Horário', 'Local', 'Valor do presente (R$)', 'Entregar a lista de desejos até', 'Organizador(a)'].map(c => `<div class="campo"><b>${c}</b><i></i></div>`).join('')}
      </div>
      <div class="regras">
        <h3>Combinados da brincadeira</h3>
        <ol>
          <li>Quem tirar o próprio nome devolve o papel e sorteia de novo.</li>
          <li>É segredo! Não conte para ninguém quem você tirou.</li>
          <li>Respeite o valor combinado — nem muito acima, nem abaixo.</li>
          <li>Consulte a lista de desejos do seu amigo secreto antes de comprar.</li>
          <li>Leve o presente embrulhado e com a tag preenchida.</li>
          <li>Na revelação, dê pistas antes de dizer o nome. Vale caprichar!</li>
        </ol>
      </div>
    </div>
  `);

  // 4 — Lista de participantes
  pg('', `
    <h2 class="titulo-pg">${icone('estrela', { tamanho: '12mm' })} Lista de participantes</h2>
    <p class="lead">Acompanhe quem já entregou a lista de desejos e quem já está com o presente.</p>
    <table class="lista">
      <tr><th style="width:12mm">Nº</th><th>Nome</th><th style="width:24mm;text-align:center">Lista</th><th style="width:24mm;text-align:center">Presente</th></tr>
      ${Array.from({ length: 20 }, (_, i) => `<tr><td>${i + 1}</td><td></td><td class="ck"></td><td class="ck"></td></tr>`).join('')}
    </table>
  `);

  // 5 e 6 — Papeletas de sorteio (24)
  const iconesPapeleta = ['presente', 'estrela', 'laco', 'sino', 'papai-noel', 'pirulito'];
  for (let p = 0; p < 2; p++) {
    pg('', `
      <div class="tesoura-topo">✂ Recorte nas linhas tracejadas, escreva um nome em cada papeleta, dobre e coloque no pote.</div>
      <div class="grade-corte" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);height:252mm">
        ${Array.from({ length: 12 }, (_, i) => `<div class="peca papeleta">
          ${icone(iconesPapeleta[(i + p * 3) % iconesPapeleta.length], { tamanho: '17mm' })}
          <span class="rotulo">Seu amigo secreto é</span>
          <div class="nome"></div>
          <small>Shhh... é segredo! ${icone('segredo', { tamanho: '1.15em', classe: 'em-linha' })}</small>
        </div>`).join('')}
      </div>
    `);
  }

  // 7 e 8 — Lista de desejos (2 por página)
  const ficha = (cor, ic) => `<div class="ficha">
      <h3 style="color:${cor}">${icone(ic, { tamanho: '13mm' })} Minha lista de desejos</h3>
      <div class="f larga">Meu nome<i></i></div>
      <div class="f larga"><span style="color:${cor}">Eu adoraria ganhar...</span>
        ${[1, 2, 3].map(n => `<div class="num">${n}<i style="border-bottom:1.3px solid #c9b8a6"></i></div>`).join('')}
      </div>
      <div class="f">Tamanho de roupa<i></i></div>
      <div class="f">Número do calçado<i></i></div>
      <div class="f">Minha cor favorita<i></i></div>
      <div class="f">Meu doce favorito<i></i></div>
      <div class="f">Eu gosto de<i></i></div>
      <div class="f">Eu não gosto de<i></i></div>
    </div>`;
  pg('', `<div class="tesoura-topo">✂ Duas fichas por folha. Recorte, preencha e entregue ao organizador.</div>
    <div class="desejos">${ficha(VERM, 'presente')}${ficha(VERDE, 'arvore')}</div>`);
  pg('', `<div class="tesoura-topo">✂ Duas fichas por folha. Recorte, preencha e entregue ao organizador.</div>
    <div class="desejos">${ficha(OURO, 'estrela')}${ficha(VERM, 'meia')}</div>`);

  // 9 e 10 — Tags de presente (24)
  const tags = (cores, ics) => `
    <div class="tesoura-topo">✂ Recorte, faça um furinho no círculo e amarre no presente com uma fita.</div>
    <div class="grade-corte" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);height:252mm">
      ${Array.from({ length: 12 }, (_, i) => `<div class="peca tag" style="border-top:3mm solid ${cores[i % cores.length]}">
        <span class="furo"></span>
        <div style="margin-top:6mm">${icone(ics[i % ics.length], { tamanho: '14mm' })}</div>
        <div class="linha">Para:<i></i></div>
        <div class="de">De: seu amigo secreto ${icone('segredo', { tamanho: '1.15em', classe: 'em-linha' })}</div>
      </div>`).join('')}
    </div>`;
  pg('', tags([VERM, VERDE, OURO], ['presente', 'arvore', 'estrela', 'laco']));
  pg('', tags([VERDE, OURO, VERM], ['sino', 'papai-noel', 'biscoito', 'boneco-neve']));

  // 11 — Cartões de pistas (4)
  pg('', `
    <div class="tesoura-topo">✂ Preencha antes da festa e leia as pistas uma de cada vez na hora da revelação.</div>
    <div class="grade-corte" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;height:252mm">
      ${['estrela', 'presente', 'sino', 'laco'].map((ic, i) => `<div class="peca pista">
        <h3>${icone(ic, { tamanho: '11mm' })} Adivinha quem é?</h3>
        <div class="p">Pista 1 — Meu amigo secreto...<i></i><i></i></div>
        <div class="p">Pista 2 — Ele(a) adora...<i></i><i></i></div>
        <div class="p">Pista 3 — Uma coisa que só ele(a) faz...<i></i><i></i></div>
        <div class="p" style="color:${VERM}">E o meu amigo secreto é...<i></i></div>
      </div>`).join('')}
    </div>
  `);

  // 12 — Amigo Doce
  const dias = [['Dia 1', 'Um bombom com bilhetinho'], ['Dia 2', 'Um pirulito ou bala divertida'], ['Dia 3', 'Uma barra de chocolate'], ['Dia 4', 'Um doce caseiro ou especial'], ['Dia 5', 'O presente e a grande revelação!']];
  pg('', `
    <h2 class="titulo-pg">${icone('biscoito', { tamanho: '13mm' })} Amigo Doce</h2>
    <p class="lead">Na semana antes da revelação, deixe um docinho por dia para o seu amigo secreto, sem ser visto. As etiquetas abaixo vão coladas em cada doce.</p>
    <div class="doce-dias">${dias.map(([d, t]) => `<div class="doce-dia"><b>${d}</b><span>${t}</span></div>`).join('')}</div>
    <div class="tesoura-topo">✂ Etiquetas para colar nos doces (2 jogos)</div>
    <div class="grade-corte etq-doce">
      ${[0, 1].flatMap(() => dias.map(([d], i) => `<div class="peca">
        ${icone(['pirulito', 'bala', 'chocolate', 'biscoito', 'presente'][i], { tamanho: '20mm' })}
        <small>Amigo Doce</small><b>${d}</b><i></i>
      </div>`)).join('')}
    </div>
  `);

  // 13 — Brincadeiras
  pg('', `
    <h2 class="titulo-pg">${icone('sino', { tamanho: '13mm' })} 6 ideias para a revelação</h2>
    <p class="lead">Escolha uma para deixar a revelação mais divertida (ou faça uma rodada de cada).</p>
    <div class="ideias">
      ${[
        ['estrela', 'Três pistas', 'Leia as pistas do cartão uma de cada vez. Quem acertar primeiro ganha o direito de revelar o próximo.'],
        ['papai-noel', 'Mímica', 'Sem dizer uma palavra, imite algo que o seu amigo secreto faz sempre. O grupo tenta adivinhar.'],
        ['segredo', 'Sim ou não', 'O grupo faz perguntas que só podem ser respondidas com "sim" ou "não" até descobrir quem é.'],
        ['camera', 'Retrato falado', 'Desenhe o seu amigo secreto em 1 minuto e mostre a obra de arte. Risadas garantidas.'],
        ['coracao', 'Elogio secreto', 'Conte uma qualidade do seu amigo secreto e uma lembrança boa do ano com ele(a).'],
        ['musica', 'Trilha sonora', 'Cante ou toque no celular uma música que combina com o seu amigo secreto. Quem descobre?'],
      ].map(([ic, t, p]) => `<div class="ideia">${icone(ic, { tamanho: '12mm' })}<h3>${t}</h3><p>${p}</p></div>`).join('')}
    </div>
  `);

  // 14 e 15 — Plaquinhas para fotos
  const placa = (texto, fundo, a, b) => `<div class="placa" style="background:${fundo}">
      <div class="ic" style="top:6mm;left:8mm">${icone(a, { tamanho: '20mm' })}</div>
      <div class="ic" style="bottom:6mm;right:8mm">${icone(b, { tamanho: '20mm' })}</div>
      <p>${texto}</p>
    </div>`;
  pg('', `<div class="placas">
      ${placa('Eu tirei<br>a pessoa certa!', VERM, 'estrela', 'presente')}
      ${placa('Adivinha<br>quem me tirou?', VERDE, 'segredo', 'presente')}
    </div>`);
  pg('', `<div class="placas">
      ${placa('Tomara que não<br>seja meia de novo!', OURO, 'meia', 'segredo')}
      ${placa('Melhor amigo<br>secreto do ano!', '#8a4fd8', 'coracao', 'festa')}
    </div>`);

  return out;
}
