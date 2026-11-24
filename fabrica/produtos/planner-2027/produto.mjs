// Planner 2027: calendário com feriados brasileiros, planejamento mensal,
// semanal, diário e finanças. Datas calculadas (Páscoa pelo algoritmo de Gauss).
import { rodape } from '../../lib/render.mjs';

const ANO = 2027;

export const info = {
  id: 'planner-2027',
  arquivo: 'planner-2027-loja-do-kiwi',
  ordem: 15,
  nome: 'Planner 2027',
  subtitulo: 'Calendário, Metas e Finanças',
  categoria: 'organizacao',
  categoriaNome: 'Organização',
  preco: 16.90,
  imagemAlt: 'Páginas do Planner 2027: visão do ano, calendário mensal com feriados e controle financeiro',
  descricao: 'Planner 2027 completo para imprimir: calendário anual e mensal com os feriados do Brasil, metas, roda da vida, planejamento semanal e diário, controle financeiro e rastreador de hábitos.',
  descricaoDetalhada: 'Comece 2027 com a vida organizada. São 12 meses com calendário e página de planejamento (metas, contas a pagar, hábitos e aniversários), visão do ano, todos os feriados nacionais e datas comemorativas de 2027, roda da vida e metas por área, além de páginas sem data para imprimir quantas vezes quiser: semana, dia, controle financeiro, orçamento anual e listas. Design limpo, que economiza tinta e fica lindo encadernado ou em fichário.',
  itens: [
    'Visão do ano 2027 e lista de feriados e datas comemorativas',
    '12 calendários mensais com feriados marcados',
    '12 páginas de planejamento mensal (metas, contas, hábitos)',
    'Metas do ano por área da vida e roda da vida',
    'Planejamento semanal e diário (sem data, reutilizáveis)',
    'Controle financeiro mensal e orçamento anual',
    'Aniversários do ano, listas de leitura e filmes, tarefas e anotações',
  ],
  idealPara: [
    'Quem quer começar 2027 com metas claras',
    'Organizar contas, gastos e rotina da casa',
    'Estudantes, professores e profissionais autônomos',
    'Encadernar, usar em fichário ou imprimir só as páginas que precisar',
  ],
  observacoes: [
    'Tamanho A4: também pode ser impresso em A5 (duas páginas por folha) nas opções da impressora.',
    'Feriados estaduais e municipais não estão incluídos: há espaço para anotá-los.',
  ],
  capa: {
    cor: '#6f8f6b', corClara: '#b9cfb2',
    topo: 'PDF PARA IMPRIMIR',
    titulo: 'Planner<br><em>2027</em>',
    sub: 'Calendário, metas, finanças e rotina',
    folhas: [2, 7, 6],
  },
  galeria: [2, 6, 7, 32, 34],
};

// ---------- datas

function pascoa(ano) {
  const a = ano % 19, b = Math.floor(ano / 100), c = ano % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}
const somarDias = (data, n) => new Date(data.getFullYear(), data.getMonth(), data.getDate() + n);
const enesimoDomingo = (mes, n) => { const d = new Date(ANO, mes, 1); const pd = (7 - d.getDay()) % 7; return new Date(ANO, mes, 1 + pd + 7 * (n - 1)); };
function blackFriday() {
  const nov = new Date(ANO, 10, 1);
  const primeiraQuinta = 1 + ((4 - nov.getDay() + 7) % 7);
  return new Date(ANO, 10, primeiraQuinta + 21 + 1);
}

const P = pascoa(ANO);
// tipo: 'feriado' (nacional), 'facultativo' (ponto facultativo nacional), 'data' (comemorativa)
const DATAS = [
  [new Date(ANO, 0, 1), 'Confraternização Universal', 'feriado'],
  [somarDias(P, -48), 'Carnaval', 'facultativo'],
  [somarDias(P, -47), 'Carnaval', 'facultativo'],
  [somarDias(P, -46), 'Quarta-feira de Cinzas', 'facultativo'],
  [new Date(ANO, 2, 8), 'Dia Internacional da Mulher', 'data'],
  [somarDias(P, -2), 'Sexta-feira Santa', 'feriado'],
  [P, 'Páscoa', 'data'],
  [new Date(ANO, 3, 21), 'Tiradentes', 'feriado'],
  [new Date(ANO, 4, 1), 'Dia do Trabalho', 'feriado'],
  [enesimoDomingo(4, 2), 'Dia das Mães', 'data'],
  [somarDias(P, 60), 'Corpus Christi', 'facultativo'],
  [new Date(ANO, 5, 12), 'Dia dos Namorados', 'data'],
  [new Date(ANO, 5, 24), 'São João', 'data'],
  [enesimoDomingo(7, 2), 'Dia dos Pais', 'data'],
  [new Date(ANO, 8, 7), 'Independência do Brasil', 'feriado'],
  [new Date(ANO, 9, 12), 'N. Sra. Aparecida · Dia das Crianças', 'feriado'],
  [new Date(ANO, 9, 15), 'Dia do Professor', 'data'],
  [new Date(ANO, 10, 2), 'Finados', 'feriado'],
  [new Date(ANO, 10, 15), 'Proclamação da República', 'feriado'],
  [new Date(ANO, 10, 20), 'Consciência Negra', 'feriado'],
  [blackFriday(), 'Black Friday', 'data'],
  [new Date(ANO, 11, 24), 'Véspera de Natal', 'data'],
  [new Date(ANO, 11, 25), 'Natal', 'feriado'],
  [new Date(ANO, 11, 31), 'Véspera de Ano Novo', 'data'],
];
const chave = (d) => `${d.getMonth()}-${d.getDate()}`;
const PORDATA = new Map();
for (const [d, nome, tipo] of DATAS) {
  const k = chave(d);
  PORDATA.set(k, [...(PORDATA.get(k) || []), { nome, tipo }]);
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const SEMANA_LONGA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const FRASES = [
  'Um ano novo, uma página em branco.', 'Pequenos passos todos os dias.', 'Planeje o essencial, viva o resto.',
  'Faça hoje o que o seu eu do futuro vai agradecer.', 'Cuide de você com a mesma atenção que dá às tarefas.',
  'Metade do ano: hora de rever a rota.', 'Descanso também faz parte do plano.', 'Constância vence intensidade.',
  'Celebre o que já deu certo.', 'Menos pressa, mais presença.', 'Feche ciclos com gratidão.', 'O melhor do ano é quem esteve com você.',
];

function semanasDoMes(mes) {
  const primeiro = new Date(ANO, mes, 1).getDay();
  const dias = new Date(ANO, mes + 1, 0).getDate();
  const celulas = [...Array(primeiro).fill(null), ...Array.from({ length: dias }, (_, i) => i + 1)];
  while (celulas.length % 7) celulas.push(null);
  return Array.from({ length: celulas.length / 7 }, (_, s) => celulas.slice(s * 7, s * 7 + 7));
}

// ---------- estilo

const SALVIA = '#6f8f6b', TERRA = '#c4704f', AREIA = '#f4eee5', TINTA = '#34302b', LINHA = '#d9d0c3';

export const css = `
  :root { --titulo: 'DM Serif Display', serif; }
  .pagina { color: ${TINTA}; padding: 15mm 15mm 18mm; }
  h1, h2 { font-family: 'DM Serif Display', serif; font-weight: 400; }
  .cab { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 1.4px solid ${TINTA}; padding-bottom: 3mm; margin-bottom: 6mm; }
  .cab h2 { font-size: 34pt; line-height: 1; }
  .cab span { font: 700 10pt var(--texto); letter-spacing: .25em; text-transform: uppercase; color: ${SALVIA}; }
  .rot { font: 800 8pt var(--texto); letter-spacing: .18em; text-transform: uppercase; color: ${SALVIA}; margin-bottom: 2mm; display: block; }
  .linhas i { display: block; border-bottom: 1px solid ${LINHA}; height: 7.5mm; }
  .caixa { border: 1px solid ${LINHA}; border-radius: 3mm; padding: 4mm; }
  .ck i { display: flex; align-items: flex-end; gap: 2.5mm; border-bottom: 1px solid ${LINHA}; height: 7.5mm; }
  .ck i::before { content: ''; flex: 0 0 auto; width: 3.4mm; height: 3.4mm; border: 1.2px solid #b8ad9e; border-radius: .8mm; margin-bottom: 1.4mm; }

  .capa-p { background: ${AREIA}; display: flex; flex-direction: column; justify-content: center; padding: 25mm; }
  .capa-p .ano { font: 400 150pt/0.85 'DM Serif Display'; color: ${TINTA}; }
  .capa-p .ano em { color: ${SALVIA}; font-style: italic; }
  .capa-p h1 { font-size: 30pt; letter-spacing: .02em; margin-top: 6mm; }
  .capa-p .sub { font: 600 12pt var(--texto); color: #6a6258; margin-top: 3mm; letter-spacing: .04em; }
  .capa-p .barra { width: 40mm; height: 3px; background: ${TERRA}; margin: 12mm 0; }
  .capa-p .dono { margin-top: 40mm; width: 120mm; border-bottom: 1.2px solid #8a8175; padding-bottom: 2mm; font: 700 10pt var(--texto); color: #6a6258; letter-spacing: .08em; text-transform: uppercase; }
  .capa-p .marca { position: absolute; bottom: 16mm; left: 25mm; font: 700 9pt var(--texto); color: #8a8175; letter-spacing: .1em; }

  .ano-grade { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7mm 8mm; }
  .mini h3 { font: 400 15pt 'DM Serif Display'; margin-bottom: 1.5mm; }
  .mini table { width: 100%; border-collapse: collapse; font: 600 8.6pt var(--texto); text-align: center; }
  .mini th { font-weight: 800; color: ${SALVIA}; font-size: 7pt; padding-bottom: 1mm; }
  .mini td { height: 5.6mm; }
  .mini td.f { background: ${TERRA}; color: #fff; border-radius: 50%; }
  .mini td.p { color: ${TERRA}; font-weight: 800; }
  .legenda-ano { margin-top: 7mm; display: flex; gap: 8mm; font: 700 9pt var(--texto); color: #6a6258; }
  .legenda-ano b { display: inline-block; width: 4mm; height: 4mm; border-radius: 50%; vertical-align: -0.6mm; margin-right: 1.5mm; }

  .datas { width: 100%; border-collapse: collapse; font-size: 10.5pt; }
  .datas td { padding: 1.9mm 2mm; border-bottom: 1px solid ${LINHA}; }
  .datas td:first-child { width: 22mm; font-weight: 800; }
  .datas td:nth-child(2) { width: 25mm; color: #8a8175; }
  .datas .tag { font: 800 7pt var(--texto); letter-spacing: .1em; text-transform: uppercase; padding: 1mm 2mm; border-radius: 2mm; }

  .areas { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
  .area h3 { font: 400 15pt 'DM Serif Display'; color: ${TERRA}; margin-bottom: 1mm; }

  .mes table.cal { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .mes .cal th { font: 800 8pt var(--texto); letter-spacing: .15em; text-transform: uppercase; color: ${SALVIA}; padding-bottom: 2mm; text-align: left; }
  .mes .cal td { border: 1px solid ${LINHA}; vertical-align: top; padding: 1.6mm 2mm; }
  .mes .cal td .n { font: 700 11pt var(--texto); }
  .mes .cal td.fora { background: #faf7f2; }
  .mes .cal td .ev { display: block; font: 700 6.6pt/1.2 var(--texto); margin-top: 1mm; }
  .mes .cal td.feriado .n { color: ${TERRA}; }
  .mes .cal td.dom .n { color: #8a8175; }
  .mes .rodape-mes { display: grid; grid-template-columns: 1.4fr 1fr; gap: 6mm; margin-top: 6mm; }
  .frase { font: italic 400 14pt 'DM Serif Display'; color: ${SALVIA}; }

  .plan { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm 7mm; }
  .contas { width: 100%; border-collapse: collapse; font-size: 9pt; }
  .contas th { text-align: left; font: 800 7pt var(--texto); letter-spacing: .12em; text-transform: uppercase; color: #8a8175; padding-bottom: 1.5mm; }
  .contas td { border-bottom: 1px solid ${LINHA}; height: 7mm; }
  .habitos { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .habitos td { border: 0.8px solid ${LINHA}; height: 6.2mm; font: 700 6.5pt var(--texto); color: #8a8175; text-align: center; }
  .habitos td.nome { width: 34mm; text-align: left; padding-left: 1.5mm; }

  .semana { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, 1fr); gap: 4mm; height: 236mm; }
  .semana .dia { border: 1px solid ${LINHA}; border-radius: 3mm; padding: 3mm 4mm; background: repeating-linear-gradient(180deg, transparent 0 7mm, ${LINHA} 7mm 7.25mm); background-origin: content-box; background-position: 0 8mm; }
  .semana .dia b { font: 400 14pt 'DM Serif Display'; background: #fff; padding-right: 2mm; }

  .diario { display: grid; grid-template-columns: 1.1fr 1fr; gap: 6mm; }
  .horas div { display: flex; border-bottom: 1px solid ${LINHA}; height: 11.5mm; align-items: flex-start; padding-top: 1mm; font: 700 8.5pt var(--texto); color: #8a8175; }
  .agua { display: flex; gap: 2mm; }
  .agua i { width: 8mm; height: 10mm; border: 1.3px solid #9fb6cc; border-radius: 0 0 2mm 2mm; }

  .fin { width: 100%; border-collapse: collapse; font-size: 9pt; }
  .fin th { background: ${AREIA}; font: 800 7.5pt var(--texto); letter-spacing: .1em; text-transform: uppercase; padding: 2mm; text-align: left; }
  .fin td { border-bottom: 1px solid ${LINHA}; height: 7.4mm; padding: 0 2mm; color: #8a8175; }
  .fin td.total { font-weight: 800; color: ${TINTA}; background: #faf7f2; }
  .orc th, .orc td { text-align: center; }
  .orc td:first-child, .orc th:first-child { text-align: left; }

  .anivers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
  .anivers .caixa h3 { font: 400 14pt 'DM Serif Display'; color: ${TERRA}; margin-bottom: 1mm; }
  .anivers .caixa i { height: 7mm; }

  .pontos { height: 230mm; background-image: radial-gradient(circle, #c9bfb1 0.5mm, transparent 0.55mm); background-size: 5mm 5mm; }
`;

const linhas = (n) => `<div class="linhas">${'<i></i>'.repeat(n)}</div>`;
const checks = (n) => `<div class="ck">${'<i></i>'.repeat(n)}</div>`;
const cab = (titulo, dir = ANO) => `<div class="cab"><h2>${titulo}</h2><span>${dir}</span></div>`;

function miniMes(m) {
  return `<div class="mini"><h3>${MESES[m]}</h3><table>
    <tr>${SEMANA.map(d => `<th>${d[0]}</th>`).join('')}</tr>
    ${semanasDoMes(m).map(s => `<tr>${s.map(d => {
      if (!d) return '<td></td>';
      const ev = PORDATA.get(`${m}-${d}`) || [];
      const cls = ev.some(e => e.tipo === 'feriado') ? 'f' : ev.some(e => e.tipo === 'facultativo') ? 'p' : '';
      return `<td class="${cls}">${d}</td>`;
    }).join('')}</tr>`).join('')}
  </table></div>`;
}

function calendarioMes(m) {
  const semanas = semanasDoMes(m);
  const altura = semanas.length === 6 ? 27 : 32;
  return `${cab(MESES[m])}
    <table class="cal">
      <tr>${SEMANA.map(d => `<th>${d}</th>`).join('')}</tr>
      ${semanas.map(s => `<tr>${s.map((d, i) => {
        if (!d) return `<td class="fora" style="height:${altura}mm"></td>`;
        const ev = PORDATA.get(`${m}-${d}`) || [];
        const cls = [ev.some(e => e.tipo === 'feriado') ? 'feriado' : '', i === 0 ? 'dom' : ''].join(' ');
        return `<td class="${cls}" style="height:${altura}mm"><span class="n">${d}</span>${ev.map(e => `<span class="ev" style="color:${e.tipo === 'data' ? SALVIA : TERRA}">${e.nome}</span>`).join('')}</td>`;
      }).join('')}</tr>`).join('')}
    </table>
    <div class="rodape-mes">
      <div><span class="rot">Anotações</span>${linhas(semanas.length === 6 ? 4 : 3)}</div>
      <div><span class="rot">Foco do mês</span><div class="caixa" style="height:${semanas.length === 6 ? 26 : 19}mm;display:flex;align-items:center"><p class="frase">${FRASES[m]}</p></div></div>
    </div>`;
}

function planejamentoMes(m) {
  const dias = new Date(ANO, m + 1, 0).getDate();
  return `${cab(`Planejamento de ${MESES[m].toLowerCase()}`)}
    <div class="plan">
      <div><span class="rot">Metas do mês</span>${checks(5)}</div>
      <div><span class="rot">Prioridades</span>${checks(5)}</div>
      <div style="grid-column:1/-1"><span class="rot">Contas a pagar</span>
        <table class="contas"><tr><th>Conta</th><th style="width:28mm">Vencimento</th><th style="width:30mm">Valor</th><th style="width:14mm">Pago</th></tr>
        ${'<tr><td></td><td></td><td></td><td></td></tr>'.repeat(7)}</table></div>
      <div style="grid-column:1/-1"><span class="rot">Rastreador de hábitos</span>
        <table class="habitos"><tr><td class="nome" style="border:none"></td>${Array.from({ length: dias }, (_, i) => `<td style="border:none">${i + 1}</td>`).join('')}</tr>
        ${`<tr><td class="nome"></td>${'<td></td>'.repeat(dias)}</tr>`.repeat(6)}</table></div>
      <div><span class="rot">Aniversários e datas</span>${linhas(5)}</div>
      <div><span class="rot">Reflexão do mês</span>${linhas(5)}</div>
    </div>`;
}

export function paginas() {
  const out = [];
  const pg = (conteudo, classe = '', comRodape = true) =>
    out.push(`<section class="pagina ${classe}">${conteudo}${comRodape ? rodape(`${out.length + 1}/@@TOTAL@@`) : ''}</section>`);

  // Capa
  pg(`<div class="ano">20<em>27</em></div>
    <h1>Planner</h1>
    <p class="sub">Calendário · Metas · Finanças · Rotina</p>
    <div class="barra"></div>
    <div class="dono">Este planner pertence a</div>
    <div class="marca">LOJA DO KIWI · lojadokiwi.com.br</div>`, 'capa-p', false);

  // Visão do ano
  pg(`${cab('Visão do ano')}
    <div class="ano-grade">${MESES.map((_, m) => miniMes(m)).join('')}</div>
    <div class="legenda-ano"><span><b style="background:${TERRA}"></b>Feriado nacional</span><span><b style="border:1.5px solid ${TERRA}"></b>Ponto facultativo</span></div>`);

  // Feriados e datas
  pg(`${cab('Feriados e datas')}
    <table class="datas">${DATAS.map(([d, nome, tipo]) => `<tr>
      <td>${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}</td>
      <td>${SEMANA_LONGA[d.getDay()]}</td>
      <td>${nome}</td>
      <td style="text-align:right">${tipo === 'data' ? '' : `<span class="tag" style="background:${tipo === 'feriado' ? TERRA : '#f3e2d9'};color:${tipo === 'feriado' ? '#fff' : TERRA}">${tipo === 'feriado' ? 'Feriado nacional' : 'Ponto facultativo'}</span>`}</td>
    </tr>`).join('')}</table>
    <p style="margin-top:5mm;font-size:9pt;color:#8a8175">Feriados estaduais e municipais variam conforme a cidade: anote os da sua região no calendário de cada mês.</p>`);

  // Metas por área
  pg(`${cab('Metas para 2027')}
    <div class="areas">${['Saúde e bem-estar', 'Finanças', 'Carreira e estudos', 'Família', 'Relacionamentos', 'Casa', 'Lazer e viagens', 'Crescimento pessoal'].map(a => `<div class="area caixa"><h3>${a}</h3>${checks(4)}</div>`).join('')}</div>`);

  // Roda da vida
  const areasRoda = ['Saúde', 'Finanças', 'Carreira', 'Família', 'Amor', 'Amizades', 'Lazer', 'Propósito'];
  const roda = (() => {
    const R = 90, cx = 100, cy = 100;
    const aneis = Array.from({ length: 10 }, (_, i) => `<circle cx="${cx}" cy="${cy}" r="${R * (i + 1) / 10}" fill="none" stroke="${LINHA}" stroke-width="${i === 9 ? 1.2 : 0.5}"/>`).join('');
    const raios = areasRoda.map((_, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / areasRoda.length;
      return `<line x1="${cx}" y1="${cy}" x2="${cx + R * Math.cos(a)}" y2="${cy + R * Math.sin(a)}" stroke="#b8ad9e" stroke-width="0.8"/>`;
    }).join('');
    const nomes = areasRoda.map((n, i) => {
      const a = -Math.PI / 2 + (i + 0.5) * 2 * Math.PI / areasRoda.length;
      return `<text x="${cx + (R + 9) * Math.cos(a)}" y="${cy + (R + 9) * Math.sin(a)}" text-anchor="middle" dominant-baseline="middle" font-family="Nunito" font-weight="800" font-size="6" fill="${TINTA}">${n}</text>`;
    }).join('');
    return `<svg viewBox="-10 -10 220 220" width="150mm" height="150mm">${aneis}${raios}${nomes}</svg>`;
  })();
  pg(`${cab('Roda da vida')}
    <p style="font-size:10.5pt;line-height:1.5;color:#6a6258;margin-bottom:4mm">Dê uma nota de 1 (centro) a 10 (borda) para cada área e pinte as fatias. As mais vazias mostram onde colocar energia em 2027. Refaça no meio do ano e compare.</p>
    <div style="display:flex;justify-content:center">${roda}</div>
    <div class="plan" style="margin-top:4mm"><div><span class="rot">O que quero melhorar</span>${linhas(4)}</div><div><span class="rot">Primeiro passo</span>${linhas(4)}</div></div>`);

  // 12 meses: calendário + planejamento
  for (let m = 0; m < 12; m++) {
    pg(calendarioMes(m), 'mes');
    pg(planejamentoMes(m));
  }

  // Semana
  pg(`${cab('Minha semana', 'de ___/___ a ___/___')}
    <div class="semana">${['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(d => `<div class="dia"><b>${d}</b></div>`).join('')}
      <div class="dia" style="background:#faf7f2"><b style="background:#faf7f2">Prioridades</b></div></div>`);

  // Dia
  pg(`${cab('Meu dia', '___/___/2027')}
    <div class="diario">
      <div><span class="rot">Agenda</span><div class="horas">${Array.from({ length: 17 }, (_, i) => `<div>${String(i + 6).padStart(2, '0')}h</div>`).join('')}</div></div>
      <div>
        <span class="rot">As 3 mais importantes</span>${checks(3)}
        <span class="rot" style="margin-top:6mm">Tarefas</span>${checks(8)}
        <span class="rot" style="margin-top:6mm">Água</span><div class="agua">${'<i></i>'.repeat(8)}</div>
        <span class="rot" style="margin-top:6mm">Hoje sou grata(o) por</span>${linhas(3)}
        <span class="rot" style="margin-top:6mm">Anotações</span>${linhas(4)}
      </div>
    </div>`);

  // Controle financeiro mensal
  pg(`${cab('Controle financeiro', 'mês: __________')}
    <div class="plan">
      <div><span class="rot">Entradas</span><table class="fin"><tr><th>Descrição</th><th style="width:28mm">Valor</th></tr>${'<tr><td></td><td></td></tr>'.repeat(7)}<tr><td class="total">Total</td><td class="total"></td></tr></table></div>
      <div><span class="rot">Resumo</span><table class="fin">${['Total de entradas', 'Total de saídas', 'Saldo do mês', 'Guardado / investido'].map(t => `<tr><td>${t}</td><td style="width:28mm"></td></tr>`).join('')}</table>
        <span class="rot" style="margin-top:5mm">Meta de economia</span><div class="caixa" style="height:24mm"></div></div>
      <div style="grid-column:1/-1"><span class="rot">Saídas</span><table class="fin"><tr><th style="width:18mm">Data</th><th>Descrição</th><th style="width:36mm">Categoria</th><th style="width:28mm">Valor</th></tr>${'<tr><td></td><td></td><td></td><td></td></tr>'.repeat(15)}<tr><td class="total" colspan="3">Total</td><td class="total"></td></tr></table></div>
    </div>`);

  // Orçamento anual
  const cats = ['Moradia', 'Contas da casa', 'Mercado', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Assinaturas', 'Cartão de crédito', 'Outros', 'Total de saídas', 'Entradas', 'Saldo'];
  pg(`${cab('Orçamento anual')}
    <table class="fin orc" style="font-size:8pt"><tr><th>Categoria</th>${MESES.map(m => `<th>${m.slice(0, 3)}</th>`).join('')}</tr>
    ${cats.map((c, i) => `<tr><td class="${i >= 10 ? 'total' : ''}" style="color:${TINTA};font-weight:700">${c}</td>${`<td class="${i >= 10 ? 'total' : ''}"></td>`.repeat(12)}</tr>`).join('')}</table>
    <div class="plan" style="margin-top:7mm"><div><span class="rot">Dívidas para quitar</span>${checks(5)}</div><div><span class="rot">Sonhos para juntar dinheiro</span>${checks(5)}</div></div>`);

  // Aniversários
  pg(`${cab('Aniversários')}
    <div class="anivers">${MESES.map(m => `<div class="caixa"><h3>${m}</h3>${linhas(4)}</div>`).join('')}</div>`);

  // Leituras e filmes
  pg(`${cab('Livros e filmes')}
    <div class="plan">
      <div><span class="rot">Quero ler</span>${checks(14)}</div>
      <div><span class="rot">Quero assistir</span>${checks(14)}</div>
      <div style="grid-column:1/-1"><span class="rot">Lugares que quero conhecer</span>${checks(6)}</div>
    </div>`);

  // Tarefas
  pg(`${cab('Lista de tarefas')}
    <div class="plan"><div>${checks(28)}</div><div>${checks(28)}</div></div>`);

  // Anotações
  pg(`${cab('Anotações')}<div class="pontos"></div>`);

  return out.map(p => p.replace('@@TOTAL@@', out.length));
}
