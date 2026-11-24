// Caça-Palavras Bíblico: 30 desafios em três níveis, com gabarito e certificado.
// Os resumos das histórias são textos próprios; a Bíblia aparece só como
// referência de leitura (sem transcrever traduções protegidas).
import { rodape, LOGO_SVG } from '../../lib/render.mjs';
import { cacaPalavras, svgCacaPalavras } from '../../lib/quebra-cabecas.mjs';

export const info = {
  id: 'caca-palavras-biblico',
  arquivo: 'caca-palavras-biblico-loja-do-kiwi',
  ordem: 30,
  nome: 'Caça-Palavras Bíblico',
  subtitulo: '30 Desafios com Gabarito',
  categoria: 'cristao',
  categoriaNome: 'Cristão',
  preco: 9.90,
  imagemAlt: 'Páginas do Caça-Palavras Bíblico com desafios sobre Noé, Davi e o nascimento de Jesus',
  descricao: '30 caça-palavras bíblicos em três níveis de dificuldade, cada um com um resumo da história e a referência para ler na Bíblia. Com gabarito e certificado.',
  descricaoDetalhada: 'Da Criação ao Natal, cada desafio traz uma história da Bíblia contada em poucas linhas, a referência para ler junto e uma grade de letras grandes para encontrar as palavras. Os desafios começam fáceis (só na horizontal e vertical) e terminam com palavras escondidas em todas as direções — dá para usar com crianças a partir de 7 anos, na escola dominical, no culto infantil ou em família.',
  itens: [
    '30 caça-palavras: 10 fáceis, 10 médios e 10 difíceis',
    'Resumo de cada história e a referência para ler na Bíblia',
    'Letras grandes, sem acentos, fáceis de enxergar',
    'Quadro de progresso para colorir a cada desafio vencido',
    'Gabarito completo de todos os desafios',
    'Certificado de "Caçador da Palavra" para o final',
  ],
  idealPara: [
    'Escola bíblica dominical e ministério infantil',
    'Devocional em família e momentos sem tela',
    'Professores e catequistas que precisam de atividade pronta',
    'Crianças a partir de 7 anos, adolescentes e adultos',
  ],
  observacoes: [
    'Imprima só as páginas que for usar: cada desafio ocupa uma folha.',
  ],
  capa: {
    cor: '#2b7bc4', corClara: '#7cc0f2',
    topo: 'PDF PARA IMPRIMIR',
    titulo: 'Caça-Palavras<br><em>Bíblico</em>',
    sub: '30 desafios com gabarito',
    folhas: [13, 23, 5],
  },
  galeria: [5, 13, 23, 33],
};

const NIVEIS = {
  facil: { nome: 'Fácil', estrelas: 1, cor: '#5e8f1c', claro: '#eef7e1', tamanho: 10, dica: 'As palavras estão na horizontal (→) e na vertical (↓).' },
  medio: { nome: 'Médio', estrelas: 2, cor: '#2b7bc4', claro: '#e6f1fb', tamanho: 12, dica: 'Agora também na diagonal (↘ ↗).' },
  dificil: { nome: 'Difícil', estrelas: 3, cor: '#c8611a', claro: '#fdf0e4', tamanho: 14, dica: 'Em todas as direções, inclusive de trás para frente!' },
};

const DESAFIOS = [
  // ---- Fácil
  ['facil', 'A Criação', 'Gênesis 1 e 2', 'No começo, Deus criou tudo o que existe. Separou a luz da escuridão, fez o céu, os mares e a terra, encheu o mundo de plantas e animais e, por último, criou o ser humano.',
    ['LUZ', 'CÉU', 'MAR', 'TERRA', 'SOL', 'LUA', 'ESTRELAS', 'ANIMAIS']],
  ['facil', 'Adão e Eva', 'Gênesis 2 e 3', 'Deus colocou Adão e Eva num jardim lindo chamado Éden. Eles podiam comer de todas as árvores, menos de uma. A serpente os enganou, e eles desobedeceram.',
    ['ADÃO', 'EVA', 'ÉDEN', 'JARDIM', 'ÁRVORE', 'FRUTO', 'SERPENTE', 'RIO']],
  ['facil', 'A Arca de Noé', 'Gênesis 6 a 9', 'Noé obedeceu a Deus e construiu uma arca enorme. Entrou nela com sua família e casais de animais. Depois do dilúvio, uma pomba trouxe um ramo e Deus colocou o arco-íris no céu.',
    ['NOÉ', 'ARCA', 'CHUVA', 'POMBA', 'ARCO-ÍRIS', 'ANIMAIS', 'DILÚVIO', 'FAMÍLIA']],
  ['facil', 'Abraão', 'Gênesis 12 a 22', 'Deus chamou Abraão para morar numa terra nova e prometeu que sua família seria tão numerosa quanto as estrelas. Mesmo já velhinhos, Abraão e Sara ganharam o filho Isaque.',
    ['ABRAÃO', 'SARA', 'ISAQUE', 'ESTRELAS', 'PROMESSA', 'TENDA', 'CANAÃ', 'FILHO']],
  ['facil', 'José do Egito', 'Gênesis 37 a 50', 'José ganhou uma túnica colorida do pai, Jacó, e tinha sonhos especiais. Os irmãos ficaram com inveja e o venderam. No Egito, José virou governador e perdoou os irmãos.',
    ['JOSÉ', 'JACÓ', 'TÚNICA', 'SONHOS', 'EGITO', 'FARAÓ', 'IRMÃOS', 'PERDÃO']],
  ['facil', 'Moisés', 'Êxodo 2 a 14', 'Ainda bebê, Moisés foi colocado num cesto no rio Nilo. Já adulto, Deus falou com ele numa sarça que pegava fogo. Moisés levou o povo para fora do Egito e o mar se abriu.',
    ['MOISÉS', 'CESTO', 'NILO', 'SARÇA', 'FARAÓ', 'MAR', 'CAJADO', 'POVO']],
  ['facil', 'Davi e Golias', '1 Samuel 17', 'O gigante Golias desafiava o exército do rei Saul. O jovem pastor Davi confiou em Deus, pegou sua funda e uma pedra lisa do riacho e venceu o gigante.',
    ['DAVI', 'GOLIAS', 'FUNDA', 'PEDRA', 'PASTOR', 'OVELHAS', 'CORAGEM', 'SAUL']],
  ['facil', 'Jonas', 'Jonas 1 a 4', 'Deus mandou Jonas ir a Nínive, mas ele fugiu de navio. Veio uma tempestade, Jonas foi jogado ao mar e um grande peixe o engoliu. Lá dentro, ele orou, e Deus lhe deu outra chance.',
    ['JONAS', 'PEIXE', 'NAVIO', 'NÍNIVE', 'MAR', 'ORAÇÃO', 'TEMPESTADE', 'PERDÃO']],
  ['facil', 'Daniel na Cova', 'Daniel 6', 'Daniel orava a Deus três vezes por dia, perto da janela. Por isso foi jogado na cova dos leões. Deus mandou um anjo fechar a boca dos leões, e o rei Dario ficou admirado.',
    ['DANIEL', 'LEÕES', 'COVA', 'ANJO', 'REI', 'DARIO', 'ORAÇÃO', 'JANELA']],
  ['facil', 'O Nascimento de Jesus', 'Lucas 2', 'Maria e José viajaram até Belém. Não havia lugar para eles, e Jesus nasceu e foi deitado numa manjedoura. Anjos anunciaram a boa notícia aos pastores.',
    ['JESUS', 'MARIA', 'JOSÉ', 'BELÉM', 'MANJEDOURA', 'ANJOS', 'PASTORES', 'NATAL']],
  // ---- Médio
  ['medio', 'A Visita dos Magos', 'Mateus 2', 'Magos vindos do Oriente seguiram uma estrela até encontrar o menino Jesus. Eles o adoraram e entregaram presentes: ouro, incenso e mirra. Depois, voltaram por outro caminho para fugir de Herodes.',
    ['MAGOS', 'ESTRELA', 'OURO', 'INCENSO', 'MIRRA', 'HERODES', 'BELÉM', 'ORIENTE', 'PRESENTES', 'MENINO']],
  ['medio', 'Os Doze Apóstolos', 'Mateus 10.1-4', 'Jesus escolheu doze homens para andar com ele, aprender e depois espalhar as boas-novas. Eram pescadores, um cobrador de impostos e outros homens simples.',
    ['PEDRO', 'ANDRÉ', 'TIAGO', 'JOÃO', 'FILIPE', 'BARTOLOMEU', 'TOMÉ', 'MATEUS', 'SIMÃO', 'TADEU']],
  ['medio', 'Os Milagres de Jesus', 'João 2; Marcos 4; João 11', 'Jesus transformou água em vinho, multiplicou pães e peixes, acalmou a tempestade, curou cegos e leprosos e até trouxe Lázaro de volta à vida.',
    ['ÁGUA', 'VINHO', 'PÃES', 'PEIXES', 'CEGO', 'LÁZARO', 'TEMPESTADE', 'LEPROSO', 'CURA', 'MILAGRE']],
  ['medio', 'As Parábolas', 'Lucas 10 e 15; Mateus 13', 'Jesus ensinava com histórias: o semeador e a semente, a ovelha perdida, a moeda achada, o filho que voltou para casa, o bom samaritano e o grão de mostarda.',
    ['SEMEADOR', 'SEMENTE', 'OVELHA', 'MOEDA', 'FILHO', 'PRÓDIGO', 'SAMARITANO', 'MOSTARDA', 'TALENTOS', 'PÉROLA']],
  ['medio', 'O Fruto do Espírito', 'Gálatas 5.22-23', 'O apóstolo Paulo explica que, quando o Espírito Santo age em nós, aparecem qualidades bonitas, como um fruto que cresce numa árvore saudável.',
    ['AMOR', 'ALEGRIA', 'PAZ', 'PACIÊNCIA', 'AMABILIDADE', 'BONDADE', 'FIDELIDADE', 'MANSIDÃO', 'DOMÍNIO', 'ESPÍRITO']],
  ['medio', 'A Páscoa', 'Lucas 23 e 24', 'Jesus morreu na cruz por amor a nós e foi colocado num túmulo fechado com uma pedra. No domingo, as mulheres encontraram o túmulo vazio: um anjo contou que Jesus tinha ressuscitado!',
    ['CRUZ', 'CORDEIRO', 'TÚMULO', 'PEDRA', 'RESSURREIÇÃO', 'MULHERES', 'ANJO', 'VIDA', 'AMOR', 'DOMINGO']],
  ['medio', 'Mulheres da Bíblia', 'Rute 1; Ester 4; Juízes 4', 'A Bíblia conta histórias de mulheres corajosas e fiéis: Rute, que não abandonou a sogra; Ester, que salvou seu povo; Débora, juíza de Israel; e muitas outras.',
    ['SARA', 'REBECA', 'RAQUEL', 'MIRIÃ', 'DÉBORA', 'RUTE', 'ANA', 'ESTER', 'MARIA', 'MARTA']],
  ['medio', 'Reis de Israel e Judá', '1 Samuel a 2 Crônicas', 'Israel teve muitos reis. Saul foi o primeiro, Davi era segundo o coração de Deus e Salomão pediu sabedoria. Josias, ainda menino, reencontrou a Lei de Deus.',
    ['SAUL', 'DAVI', 'SALOMÃO', 'JOSIAS', 'EZEQUIAS', 'ROBOÃO', 'ASA', 'JOSAFÁ', 'ACABE', 'UZIAS']],
  ['medio', 'Os Profetas', 'Isaías 6; 1 Reis 18', 'Profetas eram pessoas que levavam a mensagem de Deus ao povo. Elias orou e caiu fogo do céu; Isaías anunciou a chegada do Salvador; Samuel ouviu a voz de Deus ainda menino.',
    ['ISAÍAS', 'JEREMIAS', 'EZEQUIEL', 'DANIEL', 'ELIAS', 'ELISEU', 'JONAS', 'AMÓS', 'MIQUEIAS', 'SAMUEL']],
  ['medio', 'Animais da Bíblia', 'Gênesis 8; Números 22; 1 Reis 17', 'Muitos animais aparecem nas histórias: a pomba de Noé, o jumento que falou com Balaão, os corvos que levavam comida a Elias e o cordeiro da Páscoa.',
    ['LEÃO', 'OVELHA', 'JUMENTO', 'CAMELO', 'POMBA', 'SERPENTE', 'PEIXE', 'CORVO', 'URSO', 'CORDEIRO']],
  // ---- Difícil
  ['dificil', 'Livros da Lei e da História', 'Gênesis a Ester', 'Os primeiros livros da Bíblia contam a criação, a vida dos patriarcas, a saída do Egito, a chegada à Terra Prometida e a história dos reis de Israel.',
    ['GÊNESIS', 'ÊXODO', 'LEVÍTICO', 'NÚMEROS', 'DEUTERONÔMIO', 'JOSUÉ', 'JUÍZES', 'RUTE', 'SAMUEL', 'REIS', 'CRÔNICAS', 'ESDRAS']],
  ['dificil', 'Poesia e Profetas', 'Salmos a Daniel', 'Salmos é o livro das canções e orações; Provérbios reúne conselhos de sabedoria. Depois vêm os profetas, que anunciaram a vontade de Deus ao povo.',
    ['SALMOS', 'PROVÉRBIOS', 'ECLESIASTES', 'CANTARES', 'ISAÍAS', 'JEREMIAS', 'LAMENTAÇÕES', 'EZEQUIEL', 'DANIEL', 'NEEMIAS', 'ESTER', 'OSEIAS']],
  ['dificil', 'O Novo Testamento', 'Mateus a Tito', 'Os quatro Evangelhos contam a vida de Jesus. Atos mostra o começo da igreja, e as cartas de Paulo ensinavam as primeiras comunidades cristãs.',
    ['MATEUS', 'MARCOS', 'LUCAS', 'JOÃO', 'ATOS', 'ROMANOS', 'CORÍNTIOS', 'GÁLATAS', 'EFÉSIOS', 'FILIPENSES', 'COLOSSENSES', 'TITO']],
  ['dificil', 'Cartas e Apocalipse', 'Timóteo a Apocalipse', 'Além de Paulo, outros apóstolos escreveram cartas para animar e ensinar os cristãos. A Bíblia termina com Apocalipse, que fala da vitória final de Jesus.',
    ['TIMÓTEO', 'FILEMOM', 'HEBREUS', 'TIAGO', 'PEDRO', 'JUDAS', 'APOCALIPSE', 'EPÍSTOLA', 'EVANGELHO', 'CARTAS', 'APÓSTOLO', 'IGREJA']],
  ['dificil', 'A Armadura de Deus', 'Efésios 6.10-18', 'Paulo compara a vida cristã a um soldado bem protegido: cada peça da armadura representa algo que Deus nos dá para ficarmos firmes.',
    ['CINTO', 'VERDADE', 'COURAÇA', 'JUSTIÇA', 'SANDÁLIAS', 'EVANGELHO', 'PAZ', 'ESCUDO', 'CAPACETE', 'SALVAÇÃO', 'ESPADA', 'PALAVRA']],
  ['dificil', 'Heróis do Antigo Testamento', 'Hebreus 11', 'A carta aos Hebreus lembra pessoas que confiaram em Deus mesmo sem ver o fim da história: patriarcas, líderes, juízes e profetas.',
    ['ABRAÃO', 'ISAQUE', 'JACÓ', 'JOSÉ', 'MOISÉS', 'ARÃO', 'JOSUÉ', 'GIDEÃO', 'SANSÃO', 'SAMUEL', 'ELIAS', 'NEEMIAS']],
  ['dificil', 'Gente do Novo Testamento', 'Lucas 19; Atos 9 e 16', 'Zaqueu subiu numa árvore para ver Jesus, Nicodemos o visitou à noite, Paulo mudou de vida no caminho de Damasco e Lídia abriu sua casa para a igreja.',
    ['BATISTA', 'ZACARIAS', 'ISABEL', 'NICODEMOS', 'ZAQUEU', 'LÁZARO', 'MARTA', 'PAULO', 'BARNABÉ', 'ESTÊVÃO', 'TIMÓTEO', 'LÍDIA']],
  ['dificil', 'O Tabernáculo', 'Êxodo 25 a 40', 'No deserto, Deus pediu que o povo montasse uma grande tenda para adoração. Dentro dela ficavam a arca da aliança, o candelabro, a mesa dos pães e o altar.',
    ['ARCA', 'ALIANÇA', 'ALTAR', 'CANDELABRO', 'INCENSO', 'VÉU', 'SACERDOTE', 'TENDA', 'MESA', 'PÃES', 'BACIA', 'PÁTIO']],
  ['dificil', 'Palavras de Fé', 'Salmos e Efésios 2', 'Algumas palavras aparecem o tempo todo na Bíblia e resumem o jeito de Deus cuidar de nós. Quantas você conhece? Converse sobre o significado de cada uma.',
    ['GRAÇA', 'MISERICÓRDIA', 'PERDÃO', 'ESPERANÇA', 'SALVAÇÃO', 'ORAÇÃO', 'LOUVOR', 'ADORAÇÃO', 'GRATIDÃO', 'BÊNÇÃO', 'PROMESSA', 'ALIANÇA']],
  ['dificil', 'A História do Natal', 'Lucas 1 e 2', 'O anjo Gabriel visitou Maria em Nazaré. Por causa de um recenseamento do imperador César Augusto, ela e José foram a Belém, onde nasceu Jesus, o Salvador, chamado Emanuel: Deus conosco.',
    ['GABRIEL', 'NAZARÉ', 'CÉSAR', 'AUGUSTO', 'RECENSEAMENTO', 'HOSPEDARIA', 'MANJEDOURA', 'PASTORES', 'GLÓRIA', 'EMANUEL', 'SALVADOR', 'ANUNCIAÇÃO']],
];

export const css = `
  .capa-interna { background: linear-gradient(170deg, #e6f1fb 0%, #ffffff 55%); display: flex; flex-direction: column; align-items: center; text-align: center; }
  .capa-interna .logo-loja { height: 11mm; width: auto; margin-top: 4mm; }
  .capa-interna h1 { font-size: 46pt; color: #1d5f9e; margin-top: 18mm; }
  .capa-interna h1 span { display: block; color: #c8611a; font-size: 56pt; }
  .capa-interna .lema { font: 700 15pt var(--texto); color: #4a4a4a; margin-top: 6mm; }
  .capa-grade { margin-top: 12mm; display: grid; grid-template-columns: repeat(8, 15mm); gap: 2mm; }
  .capa-grade b { height: 15mm; border-radius: 3mm; background: #fff; border: 1.2px solid #cfe2f5; font: 600 20pt/15mm var(--titulo); color: #9cbad6; }
  .capa-grade b.on { background: #ffd23f; border-color: #ffd23f; color: #3b2a00; }
  .capa-interna .niveis { display: flex; gap: 5mm; margin-top: 14mm; }
  .capa-interna .niveis span { padding: 2.5mm 6mm; border-radius: 99px; font: 800 11pt var(--texto); color: #fff; }
  .inclui { list-style: none; display: flex; gap: 6mm; margin-top: 14mm; }
  .inclui li { width: 30mm; font: 700 10pt var(--texto); color: #4a4a4a; display: flex; flex-direction: column; align-items: center; gap: 1.5mm; }
  .inclui b { width: 16mm; height: 16mm; border-radius: 50%; background: #fff; border: 1.5px solid #cfe2f5; display: flex; align-items: center; justify-content: center; font: 700 17pt var(--titulo); color: #1d5f9e; }
  .capa-interna .nome-dono { margin-top: auto; margin-bottom: 14mm; width: 120mm; border-bottom: 1.5px solid #9cbad6; padding-bottom: 2mm; font: 700 11pt var(--texto); color: #6b6b6b; text-align: left; }

  .como h2 { font-size: 26pt; color: #1d5f9e; }
  .como .intro { font-size: 12pt; line-height: 1.55; margin: 4mm 0 6mm; }
  .passos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; }
  .passo { border-radius: 4mm; padding: 5mm; font-size: 10.5pt; line-height: 1.45; }
  .passo b { display: block; font: 600 14pt var(--titulo); margin-bottom: 1.5mm; }
  .progresso { margin-top: 9mm; }
  .progresso h3 { font-size: 17pt; color: #1d5f9e; margin-bottom: 1mm; }
  .progresso p { font-size: 10.5pt; color: var(--cinza); margin-bottom: 4mm; }
  .estrelas { display: grid; grid-template-columns: repeat(10, 1fr); gap: 3mm 2mm; }
  .estrela { position: relative; height: 15mm; display: flex; align-items: center; justify-content: center; }
  .estrela svg { position: absolute; inset: 0; width: 100%; height: 100%; }
  .estrela span { position: relative; font: 600 10pt var(--titulo); color: #555; margin-top: 1.2mm; }

  .desafio { padding-top: 13mm; }
  .faixa { display: flex; align-items: center; gap: 4mm; border-radius: 5mm; padding: 4mm 5mm; }
  .faixa .num { flex: 0 0 auto; width: 19mm; height: 19mm; border-radius: 50%; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; font: 700 20pt/1 var(--titulo); }
  .faixa .num small { font: 800 6pt var(--texto); letter-spacing: .08em; text-transform: uppercase; margin-bottom: .6mm; }
  .faixa h2 { font-size: 22pt; color: #fff; }
  .faixa .ref { font: 700 10pt var(--texto); color: rgba(255,255,255,.92); margin-top: 1mm; }
  .faixa .nivel { margin-left: auto; text-align: right; color: #fff; font: 800 9pt var(--texto); letter-spacing: .06em; text-transform: uppercase; }
  .faixa .nivel i { font-style: normal; font-size: 14pt; letter-spacing: .1em; display: block; }
  .historia { font-size: 11pt; line-height: 1.5; margin: 4.5mm 1mm 4mm; }
  .historia b { color: inherit; }
  .grade-box { display: flex; justify-content: center; border-radius: 5mm; padding: 4mm; }
  .grade-box svg { background: #fff; border-radius: 3mm; }
  .palavras { margin-top: 5mm; }
  .palavras h3 { font-size: 13pt; margin-bottom: 2.5mm; }
  .palavras ul { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm 3mm; }
  .palavras li { display: flex; align-items: center; gap: 2mm; font: 700 11pt var(--texto); text-transform: uppercase; letter-spacing: .02em; }
  .palavras li::before { content: ''; flex: 0 0 auto; width: 3.6mm; height: 3.6mm; border-radius: 1mm; border: 1.4px solid currentColor; opacity: .6; }
  .dica { margin-top: 4mm; font-size: 9.5pt; color: var(--cinza); }

  .gabarito h2 { font-size: 24pt; color: #1d5f9e; margin-bottom: 5mm; }
  .gab-grade { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm 8mm; justify-items: center; }
  .gab-item h3 { font: 600 11pt var(--titulo); margin-bottom: 1.5mm; display: flex; gap: 2mm; align-items: center; }
  .gab-item h3 span { display: inline-flex; width: 7mm; height: 7mm; border-radius: 50%; color: #fff; align-items: center; justify-content: center; font-size: 9pt; }

  .certificado { padding: 14mm; }
  .cert-moldura { height: 100%; border: 3mm double #2b7bc4; border-radius: 6mm; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 16mm 14mm; background: radial-gradient(circle at 50% 0%, #e6f1fb, #fff 60%); }
  .cert-moldura .logo-loja { height: 9mm; width: auto; }
  .cert-moldura h2 { font-size: 40pt; color: #1d5f9e; margin-top: 14mm; }
  .cert-moldura h3 { font-size: 22pt; color: #c8611a; margin-top: 2mm; }
  .cert-moldura p { font-size: 13pt; line-height: 1.6; max-width: 140mm; margin-top: 10mm; }
  .cert-linha { width: 140mm; border-bottom: 1.5px solid #555; height: 16mm; margin-top: 10mm; }
  .cert-medalha { margin-top: 12mm; }
  .cert-assin { margin-top: auto; display: flex; gap: 20mm; width: 100%; justify-content: center; }
  .cert-assin div { flex: 0 0 60mm; border-top: 1.2px solid #777; padding-top: 2mm; font: 700 10pt var(--texto); color: #555; }
`;

const ESTRELA = (cor = '#2b7bc4') => `<svg viewBox="0 0 24 24"><path d="M12 2.2l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.3l-6 3.3 1.3-6.7-5-4.7 6.8-.8z" fill="none" stroke="${cor}" stroke-width="1.3" stroke-linejoin="round"/></svg>`;

// Estrela vazia como ★ apagada: o ☆ cai numa fonte reserva que o desenha cheio.
const estrelasNivel = (n) => '★'.repeat(n) + `<span style="opacity:.35">${'★'.repeat(3 - n)}</span>`;

function montar() {
  return DESAFIOS.map(([nivel, titulo, ref, historia, palavras], i) => {
    const N = NIVEIS[nivel];
    const jogo = cacaPalavras({ palavras, tamanho: N.tamanho, nivel, semente: 1000 + i * 37 });
    return { numero: i + 1, nivel, N, titulo, ref, historia, palavras, jogo };
  });
}

export function paginas() {
  const jogos = montar();
  const total = 1 + 1 + jogos.length + Math.ceil(jogos.length / 6) + 1;
  let n = 0;
  const pg = (classe, conteudo, comRodape = true) => {
    n++;
    return `<section class="pagina ${classe}">${conteudo}${comRodape ? rodape(`${n}/${total}`) : ''}</section>`;
  };

  const out = [];

  // Capa interna
  // Grade da capa com palavras "encontradas", cada uma de uma cor.
  const linhasCapa = [['PALAVRA', 0, '#ffd23f'], ['QJESUSBT', 2, '#a8d8ff', 5], ['AMORXFEZ', 0, '#ffc49b', 4], ['GHLUZDIV', 2, '#c8eb9c', 3]];
  const capaGrade = linhasCapa.map(([letras, ini, cor, tam = 7]) => letras.padEnd(8, 'D').split('')
    .map((l, i) => `<b ${i >= ini && i < ini + tam ? `class="on" style="background:${cor};border-color:${cor}"` : ''}>${l}</b>`).join('')).join('');
  out.push(pg('capa-interna', `
    ${LOGO_SVG}
    <h1>Caça-Palavras <span>Bíblico</span></h1>
    <p class="lema">30 desafios para encontrar a Palavra</p>
    <div class="capa-grade">${capaGrade}</div>
    <div class="niveis">
      ${Object.values(NIVEIS).map(v => `<span style="background:${v.cor}">${estrelasNivel(v.estrelas)} ${v.nome}</span>`).join('')}
    </div>
    <ul class="inclui">
      <li><b>30</b>histórias</li><li><b>3</b>níveis</li><li><b>✓</b>gabarito</li><li><b>★</b>certificado</li>
    </ul>
    <div class="nome-dono">Este livro pertence a:</div>
  `, false));

  // Como jogar + progresso
  out.push(pg('como', `
    <h2>Como jogar</h2>
    <p class="intro">Cada desafio conta, em poucas linhas, uma história da Bíblia. Leia o resumo (ou, melhor ainda, a passagem indicada na sua Bíblia) e depois procure as palavras escondidas na grade. Quando achar, pinte ou circule a palavra e marque o quadradinho da lista.</p>
    <div class="passos">
      ${Object.values(NIVEIS).map(v => `<div class="passo" style="background:${v.claro}"><b style="color:${v.cor}">${estrelasNivel(v.estrelas)} ${v.nome}</b>Grade ${v.tamanho}×${v.tamanho}. ${v.dica}</div>`).join('')}
    </div>
    <p class="intro" style="margin-top:6mm">As palavras aparecem <b>sem acento e sem espaço</b>: “Arco-íris” vira ARCOIRIS e “Coração” vira CORACAO. O gabarito está no final do livro — vale espiar só depois de tentar!</p>
    <div class="progresso">
      <h3>Meu quadro de progresso</h3>
      <p>Pinte uma estrela a cada desafio vencido.</p>
      <div class="estrelas">
        ${jogos.map(j => `<div class="estrela">${ESTRELA(j.N.cor)}<span>${j.numero}</span></div>`).join('')}
      </div>
    </div>
  `));

  // Desafios
  for (const j of jogos) {
    const lado = j.nivel === 'facil' ? 150 : j.nivel === 'medio' ? 156 : 162;
    out.push(pg('desafio', `
      <div class="faixa" style="background:${j.N.cor}">
        <div class="num" style="color:${j.N.cor}"><small>Desafio</small>${j.numero}</div>
        <div><h2>${j.titulo}</h2><div class="ref">Leia: ${j.ref}</div></div>
        <div class="nivel"><i>${estrelasNivel(j.N.estrelas)}</i>${j.N.nome}</div>
      </div>
      <p class="historia">${j.historia}</p>
      <div class="grade-box" style="background:${j.N.claro}">${svgCacaPalavras(j.jogo, { lado })}</div>
      <div class="palavras" style="color:${j.N.cor}">
        <h3>Encontre ${j.palavras.length} palavras:</h3>
        <ul>${j.palavras.map(p => `<li><span style="color:#2b2b2b">${p}</span></li>`).join('')}</ul>
      </div>
      <p class="dica">${j.N.dica}</p>
    `));
  }

  // Gabarito, 6 por página
  for (let i = 0; i < jogos.length; i += 6) {
    const bloco = jogos.slice(i, i + 6);
    out.push(pg('gabarito', `
      <h2>Gabarito ${i === 0 ? '' : '(continuação)'}</h2>
      <div class="gab-grade">
        ${bloco.map(j => `<div class="gab-item">
          <h3><span style="background:${j.N.cor}">${j.numero}</span>${j.titulo}</h3>
          ${svgCacaPalavras(j.jogo, { lado: 66, gabarito: true, cor: j.N.cor })}
        </div>`).join('')}
      </div>
    `));
  }

  // Certificado
  out.push(pg('certificado', `
    <div class="cert-moldura">
      ${LOGO_SVG}
      <h2>Certificado</h2>
      <h3>Caçador(a) da Palavra</h3>
      <p>Certificamos que</p>
      <div class="cert-linha"></div>
      <p>completou os 30 desafios do Caça-Palavras Bíblico, conheceu histórias incríveis da Bíblia e mostrou muita atenção e perseverança!</p>
      <svg class="cert-medalha" width="34mm" height="34mm" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#ffd23f" stroke="#e0a800" stroke-width="4"/><path d="M50 18l9.4 19.1 21 3.1-15.2 14.8 3.6 20.9L50 66.1 31.2 76l3.6-20.9L19.6 40.2l21-3.1z" fill="#fff"/></svg>
      <div class="cert-assin"><div>Data</div><div>Assinatura</div></div>
    </div>
  `, false));

  return out;
}
