import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { IMG } from "../src/lib/images";
import { POSTS } from "./seed-posts";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: Number(process.env.DATABASE_POOL_MAX) || undefined }) });

const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri"];

// ---------------------------------------------------------------------------
// Lojas (dados reais do cliente)
// ---------------------------------------------------------------------------
const stores = [
  {
    slug: "loja-1-vila-harmonia",
    name: "Loja 1 — Vila Harmonia",
    address: "R. Henrique Lupo, 1467",
    neighborhood: "Vila Harmonia",
    city: "Araraquara",
    cep: "14802-440",
    phone: "(16) 3322-7191",
    whatsapp: "5516996239413",
    email: "astralenergiasolar@gmail.com",
    // TODO: conferir coordenadas
    lat: -21.7786,
    lng: -48.1629,
    isMain: true,
    order: 1,
    // Fecha às 18h (seg–sex). Abertura e sábado: TODO: confirmar com cliente
    openingHours: [{ days: WEEKDAYS, opens: "08:00", closes: "18:00" }],
    hoursNote: "Matriz. Horário de abertura e sábado a confirmar.",
    image: IMG.poolBackyard,
  },
  {
    slug: "loja-2-vila-ferroviaria",
    name: "Loja 2 — Vila Ferroviária",
    address: "Av. Maria Antonia Camargo de Oliveira, 3185",
    neighborhood: "Vila Ferroviária",
    city: "Araraquara",
    cep: null,
    phone: "(16) 3322-5228",
    whatsapp: "551633225228",
    email: "astralenergiasolar@gmail.com",
    // TODO: conferir coordenadas
    lat: -21.8021,
    lng: -48.1903,
    isMain: false,
    order: 2,
    // TODO: confirmar com cliente
    openingHours: [{ days: WEEKDAYS, opens: "08:00", closes: "18:00" }],
    hoursNote: "Horário a confirmar.",
    image: IMG.poolFront,
  },
  {
    slug: "loja-3-vila-xavier",
    name: "Loja 3 — Vila Xavier",
    address: "Alameda Paulista, 2100",
    neighborhood: "Jardim Paulistano (Vila Xavier)",
    city: "Araraquara",
    cep: null,
    phone: "(16) 3503-1752",
    whatsapp: "551635031752",
    email: "astralenergiasolar@gmail.com",
    // TODO: conferir coordenadas
    lat: -21.7698,
    lng: -48.1561,
    isMain: false,
    order: 3,
    // TODO: confirmar com cliente
    openingHours: [{ days: WEEKDAYS, opens: "08:00", closes: "18:00" }],
    hoursNote: "Horário a confirmar.",
    image: IMG.poolVilla,
  },
  {
    slug: "loja-4-sao-carlos",
    name: "Loja 4 — São Carlos",
    address: "R. Miguel Petroni, 1765 – loja 10",
    neighborhood: "Jardim Bandeirantes",
    city: "São Carlos",
    cep: null,
    phone: "(16) 3307-5459",
    whatsapp: "551633075459",
    email: "astralsaocarlos@gmail.com",
    // TODO: conferir coordenadas
    lat: -21.9993,
    lng: -47.8967,
    isMain: false,
    order: 4,
    // TODO: confirmar com cliente
    openingHours: [{ days: WEEKDAYS, opens: "08:00", closes: "18:00" }],
    hoursNote: "Horário a confirmar.",
    image: IMG.poolModern,
  },
];

// ---------------------------------------------------------------------------
// Categorias e produtos (descrições genéricas, sem preço nem marca)
// ---------------------------------------------------------------------------
type SeedProduct = { name: string; short: string; body: string; specs?: [string, string][]; featured?: boolean };
type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  section: string;
  images: string[];
  products: SeedProduct[];
};

const ORCAMENTO =
  "\n\n**Quer saber qual modelo serve para a sua casa?** Fale com a loja mais perto — a equipe Astral dimensiona sem compromisso.";

const categories: SeedCategory[] = [
  {
    slug: "aquecedores-solares",
    name: "Aquecedores solares",
    description: "Coletores e reservatórios para banho e para piscina — água quente com a energia do sol.",
    icon: "Sun",
    image: IMG.solarGrass,
    section: "aquecimento-solar",
    images: [IMG.solarGrass, IMG.solarRoofSunset, IMG.solarInstall],
    products: [
      {
        name: "Kit aquecedor solar para banho",
        short: "Coletores + reservatório térmico dimensionados para o número de moradores.",
        body: "Conjunto completo para aquecer a água do banho com o sol. Os coletores captam o calor no telhado e o reservatório (boiler) mantém a água quente para usar à noite e de manhã.\n\n- Reduz drasticamente o uso do chuveiro elétrico\n- Pode trabalhar com apoio elétrico ou a gás para dias nublados\n- Instalação feita pela equipe própria da Astral",
        specs: [["Aplicação", "Banho residencial"], ["Dimensionamento", "Conforme nº de moradores"], ["Instalação", "Equipe própria"]],
        featured: true,
      },
      {
        name: "Coletor solar para banho",
        short: "Placa coletora para sistemas de aquecimento de água residencial.",
        body: "Coletor para compor ou ampliar sistemas de aquecimento solar de banho. A quantidade ideal depende do volume do reservatório e da orientação do telhado.",
        specs: [["Aplicação", "Banho"], ["Uso", "Novo sistema ou ampliação"]],
      },
      {
        name: "Reservatório térmico (boiler)",
        short: "Mantém a água aquecida por horas, pronta para o banho.",
        body: "Reservatório isolado termicamente que armazena a água aquecida pelos coletores. Disponível em vários volumes, de baixa ou alta pressão.",
        specs: [["Pressão", "Baixa ou alta"], ["Volume", "Conforme projeto"]],
      },
      {
        name: "Aquecedor solar para piscina",
        short: "Coletores para esquentar a piscina e estender a temporada de banho.",
        body: "Coletores específicos para piscina, que usam a própria bomba do filtro para circular a água pelo sol. Aqui na Morada do Sol, rendem muito o ano todo.",
        specs: [["Aplicação", "Piscinas"], ["Dimensionamento", "Pelo espelho d'água"]],
        featured: true,
      },
    ],
  },
  {
    slug: "energia-fotovoltaica",
    name: "Energia solar fotovoltaica",
    description: "Sistemas on-grid com painéis de alta performance para baixar a conta de luz.",
    icon: "Zap",
    image: IMG.solarRoofSunset,
    section: "energia-solar",
    images: [IMG.solarRoofSunset, IMG.solarRows, IMG.solarHands],
    products: [
      {
        name: "Sistema fotovoltaico residencial",
        short: "Projeto completo para gerar a sua própria energia no telhado.",
        body: "Painéis, inversor, estruturas e homologação junto à distribuidora. O sistema é dimensionado a partir da sua conta de luz.",
        specs: [["Tipo", "On-grid (conectado à rede)"], ["Inclui", "Projeto e homologação [CONFIRMAR]"]],
        featured: true,
      },
      {
        name: "Painel solar de alta performance",
        short: "Módulos fotovoltaicos de alta eficiência para telhados residenciais e comerciais.",
        body: "Módulos de alta potência que geram mais energia em menos área de telhado.",
        specs: [["Potência", "[CONFIRMAR]"], ["Uso", "Residencial e comercial"]],
      },
      {
        name: "Inversor solar",
        short: "Converte a energia dos painéis para uso na sua casa.",
        body: "Equipamento que transforma a corrente contínua dos painéis em energia para a rede elétrica da casa, com monitoramento da geração.",
        specs: [["Monitoramento", "Conforme modelo"]],
      },
      {
        name: "Sistema fotovoltaico comercial",
        short: "Energia solar para comércios, sítios e pequenas indústrias.",
        body: "Projetos de maior porte para quem tem conta de luz alta. Fale com a equipe para um estudo de viabilidade.",
        specs: [["Aplicação", "Comércio, rural e indústria"]],
      },
    ],
  },
  {
    slug: "piscinas",
    name: "Piscinas",
    description: "Piscinas de vinil, fibra e azulejo (pastilha) com projeto e construção.",
    icon: "Waves",
    image: IMG.poolGarden,
    section: "piscinas",
    images: [IMG.poolGarden, IMG.poolWhiteHouse, IMG.poolAerial],
    products: [
      {
        name: "Piscina de vinil",
        short: "Formato livre, acabamento macio e ótimo custo-benefício.",
        body: "A piscina de vinil permite qualquer formato e tamanho, com bolsão de vinil sobre estrutura de alvenaria. A troca do vinil renova o visual depois de anos de uso.",
        specs: [["Formato", "Livre"], ["Manutenção", "Troca de vinil periódica"]],
        featured: true,
      },
      {
        name: "Piscina de fibra",
        short: "Instalação rápida e superfície lisa, fácil de limpar.",
        body: "Peça única pronta, instalada em poucos dias. Superfície lisa que dificulta a fixação de algas.",
        specs: [["Instalação", "Rápida"], ["Formato", "Modelos de fábrica"]],
      },
      {
        name: "Piscina de azulejo (pastilha)",
        short: "Durabilidade máxima e acabamento sofisticado.",
        body: "Construída em alvenaria ou concreto e revestida com pastilhas. Permite bordas infinitas, prainhas e projetos sob medida.",
        specs: [["Durabilidade", "Alta"], ["Projeto", "Sob medida"]],
      },
      {
        name: "Troca de vinil",
        short: "Renove a sua piscina sem quebra-quebra.",
        body: "Medição, fabricação e instalação de um novo bolsão de vinil. Ótimo momento para trocar estampa e acessórios.",
        specs: [["Serviço", "Medição e instalação"]],
      },
    ],
  },
  {
    slug: "automacao-de-piscinas",
    name: "Automação de piscinas",
    description: "Controle de filtragem, aquecimento e iluminação pelo painel ou pelo celular.",
    icon: "Cpu",
    image: IMG.smartHome,
    section: "piscinas",
    images: [IMG.smartHome, IMG.poolSunset],
    products: [
      { name: "Central de automação", short: "Programa filtro, aquecimento e luzes automaticamente.", body: "Painel que liga e desliga equipamentos nos horários certos, economizando energia e trabalho.", specs: [["Controle", "Painel / app (conforme modelo)"]] },
      { name: "Iluminação LED para piscina", short: "Luzes coloridas e econômicas para usar a piscina à noite.", body: "Refletores LED de baixo consumo, com opções de cores e cenas.", specs: [["Tecnologia", "LED"]], featured: true },
      { name: "Gerador de cloro", short: "Produz cloro a partir de sal, com menos manuseio de químicos.", body: "Sistema que gera cloro automaticamente na própria tubulação, deixando a água mais agradável.", specs: [["Tratamento", "Por eletrólise de sal"]] },
      { name: "Timer para filtragem", short: "Liga a bomba nos horários programados.", body: "Solução simples para automatizar a filtragem diária da piscina.", specs: [["Função", "Programação horária"]] },
    ],
  },
  {
    slug: "produtos-quimicos",
    name: "Produtos químicos",
    description: "Tudo para tratar a água da piscina: cloro, algicidas, clarificantes e reguladores.",
    icon: "FlaskConical",
    image: IMG.poolInfinity,
    section: "tratamento",
    images: [IMG.poolInfinity, IMG.poolTiles],
    products: [
      { name: "Cloro para piscina", short: "Desinfecção diária da água.", body: "Diferentes apresentações (granulado, tabletes). A equipe da loja indica a dosagem para o volume da sua piscina.", specs: [["Função", "Desinfecção"]], featured: true },
      { name: "Algicida", short: "Previne e combate algas — o motivo da água verde.", body: "Usado na manutenção preventiva e no tratamento de choque. Consulte a loja para a dosagem correta.", specs: [["Função", "Controle de algas"]] },
      { name: "Clarificante", short: "Ajuda a deixar a água cristalina.", body: "Agrupa partículas finas para que o filtro consiga retê-las.", specs: [["Função", "Clarificação"]] },
      { name: "Reguladores de pH e alcalinidade", short: "Equilibram a água para o cloro funcionar bem.", body: "Com o pH certo, o tratamento rende mais e a água não irrita olhos e pele. Leve uma amostra para testar na loja.", specs: [["Função", "Equilíbrio químico"]] },
    ],
  },
  {
    slug: "acessorios-para-piscinas",
    name: "Acessórios para piscinas",
    description: "Peneiras, aspiradores, escovas, capas térmicas, cascatas e muito mais.",
    icon: "Wrench",
    image: IMG.poolAerial,
    section: "tratamento",
    images: [IMG.poolAerial, IMG.poolDeck],
    products: [
      { name: "Kit limpeza de piscina", short: "Peneira, escova, aspirador e cabo telescópico.", body: "O básico para manter a piscina limpa no dia a dia.", specs: [["Inclui", "Peneira, escova, aspirador, cabo"]] },
      { name: "Capa térmica", short: "Segura o calor da água e reduz a evaporação.", body: "Ideal para quem tem aquecimento: mantém a temperatura por mais tempo e economiza produtos químicos.", specs: [["Benefício", "Retém calor"]], featured: true },
      { name: "Cascata para piscina", short: "Queda d'água decorativa e relaxante.", body: "Diversos modelos e tamanhos para dar um toque especial ao projeto.", specs: [["Tipo", "Decorativa"]] },
      { name: "Escada e corrimão em inox", short: "Segurança e acabamento para entrar na piscina.", body: "Modelos para diferentes tipos de piscina.", specs: [["Material", "Inox"]] },
    ],
  },
  {
    slug: "bombas-filtros-pressurizadores",
    name: "Bombas, filtros e pressurizadores",
    description: "Motobombas e filtros para piscina, além de pressurizadores para o chuveiro.",
    icon: "Gauge",
    image: IMG.poolTiles,
    section: "tratamento",
    images: [IMG.poolTiles, IMG.welding],
    products: [
      { name: "Motobomba para piscina", short: "Coração do sistema de filtragem.", body: "Dimensionada pelo volume da piscina e pela distância até a casa de máquinas.", specs: [["Dimensionamento", "Pelo volume da piscina"]], featured: true },
      { name: "Filtro de areia para piscina", short: "Retém a sujeira e mantém a água transparente.", body: "Filtros em vários tamanhos, com válvula seletora para retrolavagem.", specs: [["Meio filtrante", "Areia"]] },
      { name: "Pressurizador para chuveiro", short: "Mais pressão no banho, inclusive com aquecimento solar.", body: "Indicado para casas com caixa d'água baixa ou banho fraco.", specs: [["Aplicação", "Residencial"]] },
      { name: "Pré-filtro e peças de reposição", short: "Cestos, válvulas, anéis e reparos.", body: "Tenha as peças certas para não ficar com a piscina parada. Leve a peça antiga na loja.", specs: [["Disponibilidade", "Consulte a loja"]] },
    ],
  },
  {
    slug: "aquecedores-a-gas",
    name: "Aquecedores a gás",
    description: "Água quente na hora, para banho e cozinha, com instalação especializada.",
    icon: "Flame",
    image: IMG.showerBathroom,
    section: "banho-e-conforto",
    images: [IMG.showerBathroom, IMG.bathroomModern],
    products: [
      { name: "Aquecedor a gás de passagem", short: "Água quente instantânea em vários pontos da casa.", body: "Aquece a água no momento do uso. Pode servir de apoio ao aquecimento solar.", specs: [["Tipo", "Passagem"], ["Gás", "GLP ou natural (conforme modelo)"]], featured: true },
      { name: "Aquecedor a gás digital", short: "Controle preciso da temperatura.", body: "Modelos com display para ajustar a temperatura do banho.", specs: [["Controle", "Digital"]] },
      { name: "Aquecedor a gás para piscina", short: "Aquecimento rápido, independente do clima.", body: "Para quem quer piscina quente a qualquer hora. Combina bem com o solar.", specs: [["Aplicação", "Piscina"]] },
      { name: "Instalação e manutenção de aquecedor a gás", short: "Instalação segura feita por técnicos.", body: "Instalação, revisão e reparo de aquecedores a gás.", specs: [["Serviço", "Instalação e manutenção"]] },
    ],
  },
  {
    slug: "filtros-residenciais",
    name: "Filtros residenciais",
    description: "Filtro central de água para a casa inteira — e manutenção periódica.",
    icon: "Droplets",
    image: IMG.waterGlass,
    section: "banho-e-conforto",
    images: [IMG.waterGlass],
    products: [
      { name: "Filtro central de água", short: "Água filtrada em todas as torneiras e chuveiros.", body: "Instalado na entrada de água, retém sedimentos e protege encanamento, aquecedores e eletrodomésticos.", specs: [["Instalação", "Entrada de água da casa"]], featured: true },
      { name: "Refil para filtro central", short: "Troca periódica para manter a eficiência.", body: "Elementos filtrantes de reposição.", specs: [["Troca", "Conforme uso"]] },
      { name: "Manutenção de filtro central", short: "Limpeza e troca de elementos feita pela equipe.", body: "Agende a manutenção e garanta a qualidade da água da casa.", specs: [["Serviço", "Manutenção"]] },
      { name: "Filtro para ponto de uso", short: "Filtragem extra para cozinha.", body: "Complemento ao filtro central para água de beber.", specs: [["Aplicação", "Cozinha"]] },
    ],
  },
  {
    slug: "trocadores-de-calor",
    name: "Trocadores de calor",
    description: "Aquecimento eficiente de piscinas e sistemas de água quente.",
    icon: "Thermometer",
    image: IMG.poolSunset,
    section: "banho-e-conforto",
    images: [IMG.poolSunset],
    products: [
      { name: "Trocador de calor para piscina", short: "Aquece a piscina com alta eficiência energética.", body: "Equipamento que transfere calor para a água da piscina com consumo reduzido de energia.", specs: [["Aplicação", "Piscinas"]], featured: true },
      { name: "Trocador de calor para aquecimento central", short: "Integração entre fontes de calor.", body: "Ideal para sistemas híbridos (solar + gás ou elétrico).", specs: [["Aplicação", "Sistemas híbridos"]] },
      { name: "Trocador de calor para spa", short: "Mantém banheiras e spas na temperatura certa.", body: "Modelos compactos para spas e hidromassagens.", specs: [["Aplicação", "Spa"]] },
      { name: "Projeto de aquecimento híbrido", short: "O melhor de cada fonte de calor.", body: "A equipe estuda o uso da casa e indica a combinação mais econômica.", specs: [["Serviço", "Projeto"]] },
    ],
  },
  {
    slug: "saunas",
    name: "Saunas (EcoSauna)",
    description: "Linha EcoSauna: saunas secas e a vapor para casa.",
    icon: "CloudFog",
    image: IMG.spaStones,
    section: "lazer",
    images: [IMG.spaStones, IMG.spaTowels],
    products: [
      { name: "Sauna seca EcoSauna", short: "Calor seco e relaxante na sua casa.", body: "Gerador de sauna seca da linha EcoSauna, dimensionado pelo volume do ambiente.", specs: [["Linha", "EcoSauna"], ["Tipo", "Seca"]], featured: true },
      { name: "Sauna a vapor EcoSauna", short: "Vapor úmido para relaxar e cuidar da pele.", body: "Gerador de vapor da linha EcoSauna.", specs: [["Linha", "EcoSauna"], ["Tipo", "Vapor"]] },
      { name: "Comando digital para sauna", short: "Controle de temperatura e tempo.", body: "Painel para ligar, programar e controlar a sauna com segurança.", specs: [["Controle", "Digital"]] },
      { name: "Acessórios para sauna", short: "Pedras, essências e itens de acabamento.", body: "Complete a experiência da sua sauna.", specs: [["Disponibilidade", "Consulte a loja"]] },
    ],
  },
  {
    slug: "banheiras-spa",
    name: "Banheiras e spas",
    description: "Banheiras, hidromassagens e spas para relaxar em casa.",
    icon: "Bath",
    image: IMG.bathtubWhite,
    section: "lazer",
    images: [IMG.bathtubWhite, IMG.bathtubStone, IMG.spaMassage],
    products: [
      { name: "Spa para área externa", short: "Hidromassagem para a área de lazer.", body: "Spas para varanda e área gourmet, com jatos de hidromassagem e aquecimento.", specs: [["Ambiente", "Externo"]], featured: true },
      { name: "Banheira de hidromassagem", short: "Relaxamento no banheiro da suíte.", body: "Modelos de embutir e de apoio, com ou sem aquecedor.", specs: [["Ambiente", "Interno"]] },
      { name: "Banheira de imersão", short: "Design marcante para banheiros modernos.", body: "Peças de apoio para um banheiro com cara de spa.", specs: [["Tipo", "Imersão"]] },
      { name: "Aquecedor para spa", short: "Mantém a água na temperatura ideal.", body: "Opções elétricas, a gás e solares para spas.", specs: [["Fontes", "Elétrico, gás ou solar"]] },
    ],
  },
  {
    slug: "moveis-outdoor",
    name: "Móveis outdoor",
    description: "Espreguiçadeiras, conjuntos e ombrelones para curtir a área de lazer.",
    icon: "Armchair",
    image: IMG.poolDeck,
    section: "lazer",
    images: [IMG.poolDeck, IMG.outdoorLounge, IMG.resortDeck],
    products: [
      { name: "Espreguiçadeira", short: "Para pegar sol à beira da piscina.", body: "Modelos resistentes ao sol e à água.", specs: [["Uso", "Área externa"]], featured: true },
      { name: "Conjunto de sofá outdoor", short: "Conforto para a área gourmet.", body: "Conjuntos com almofadas próprias para área externa.", specs: [["Uso", "Área gourmet e varanda"]] },
      { name: "Ombrelone", short: "Sombra na medida para os dias de 35 °C.", body: "Ombrelones laterais e centrais em vários tamanhos.", specs: [["Tipo", "Lateral ou central"]] },
      { name: "Mesa e cadeiras outdoor", short: "Para o churrasco de domingo.", body: "Conjuntos de mesa para áreas externas.", specs: [["Uso", "Área externa"]] },
    ],
  },
];

const services = [
  { slug: "instalacao-aquecedores", name: "Instalação e reparo de aquecedores", description: "Solares, a gás e elétricos — instalação, revisão e conserto com equipe própria.", icon: "Sun", image: IMG.solarInstall },
  { slug: "construcao-de-piscinas", name: "Construção de piscinas", description: "Piscinas de vinil e azulejo, do projeto à primeira água.", icon: "Waves", image: IMG.poolWhiteHouse },
  { slug: "troca-de-vinil", name: "Troca de vinil", description: "Medição, fabricação e instalação do novo vinil da sua piscina.", icon: "Layers", image: IMG.poolAerial },
  { slug: "limpeza-de-placas-solares", name: "Limpeza de placas solares", description: "Placas limpas aquecem e geram mais. Agende a limpeza periódica.", icon: "Sparkles", image: IMG.solarHands },
  { slug: "manutencao-filtro-central", name: "Manutenção de filtro central", description: "Limpeza e troca de elementos do filtro central de água.", icon: "Droplets", image: IMG.waterGlass },
  { slug: "troca-resistencia-boiler", name: "Troca de resistência de boiler", description: "Água quente de volta rapidinho, com peça certa.", icon: "Thermometer", image: IMG.showerBathroom },
  { slug: "hidraulica-e-eletrica", name: "Hidráulica e elétrica", description: "Serviços hidráulicos e elétricos ligados aos seus equipamentos, aqui na região.", icon: "Plug", image: IMG.technician },
  { slug: "entrega-rapida", name: "Entrega rápida", description: "Estoque amplo nas 4 lojas e entrega ágil em Araraquara, São Carlos e região.", icon: "Truck", image: IMG.poolDeck },
];

const testimonials = [
  // TODO: substituir pelo texto original do cliente
  { author: "Adriana Galhardo", role: "Cliente", text: "Cumpriram o prazo combinado, o material é de qualidade e a mão de obra foi impecável. O João acompanhou tudo de perto. Recomendo de olhos fechados!", rating: 5, order: 1 },
  // TODO: substituir pelo texto original do cliente
  { author: "Roger Michetti", role: "Grupo Investe", text: "Parabéns a toda a equipe da Astral pelo serviço. Atendimento sério e trabalho muito bem feito.", rating: 5, order: 2 },
  // TODO: substituir pelo texto original do cliente
  { author: "Tatiana Castro", role: "Arquiteta", text: "Sempre disponíveis, explicam tudo com clareza e prestam atenção de verdade no que o cliente precisa. É uma parceria que dá segurança para indicar.", rating: 5, order: 3 },
];

const projects = [
  { title: "Piscina de azulejo com deck", type: "Azulejo", city: "Araraquara", images: [IMG.poolVilla], description: "Projeto com borda em pedra e iluminação LED.", featured: true, order: 1 },
  { title: "Piscina de vinil no jardim", type: "Vinil", city: "Araraquara", images: [IMG.poolGarden], description: "Formato retangular integrado ao paisagismo.", featured: true, order: 2 },
  { title: "Área de lazer completa", type: "Azulejo", city: "São Carlos", images: [IMG.poolWhiteHouse], description: "Piscina, aquecimento solar e móveis outdoor.", featured: true, order: 3 },
  { title: "Piscina com prainha", type: "Fibra", city: "Américo Brasiliense", images: [IMG.poolBackyard], description: "Instalação rápida e prainha para as crianças.", featured: true, order: 4 },
  { title: "Aquecimento solar no telhado", type: "Aquecimento solar", city: "Araraquara", images: [IMG.solarRoofSunset], description: "Coletores para banho e piscina.", featured: true, order: 5 },
  { title: "Piscina moderna com cascata", type: "Azulejo", city: "Matão", images: [IMG.poolModern], description: "Linhas retas e cascata em lâmina.", featured: true, order: 6 },
];

const faqs = [
  { question: "Aquecedor solar funciona em dia nublado?", answer: "Funciona com rendimento menor. Por isso o sistema pode ter apoio elétrico ou a gás, que entra só quando necessário. Aqui na Morada do Sol, a grande maioria dos dias é de sol forte.", category: "aquecimento-solar", order: 1 },
  { question: "Quanto tempo leva para construir uma piscina?", answer: "Depende do tipo e do tamanho. Piscinas de fibra são as mais rápidas; vinil e azulejo exigem obra de alvenaria. Na visita técnica passamos um prazo realista para o seu caso.", category: "piscinas", order: 2 },
  { question: "Vocês fazem a instalação?", answer: "Sim. A Astral tem equipe própria de instalação para aquecedores, piscinas e sistemas fotovoltaicos em Araraquara, São Carlos e região.", category: "geral", order: 3 },
  { question: "Minha piscina ficou verde. O que faço?", answer: "Geralmente é alga causada por falta de cloro, pH desequilibrado ou filtragem insuficiente. Leve uma amostra da água em uma das nossas lojas: testamos e indicamos o tratamento certo para o volume da sua piscina.", category: "tratamento", order: 4 },
  { question: "Energia solar fotovoltaica zera a conta de luz?", answer: "Reduz muito, mas sempre existe o custo mínimo da distribuidora (taxa de disponibilidade) e eventuais tarifas. O simulador do site mostra uma estimativa; o projeto real considera o seu histórico de consumo.", category: "energia-solar", order: 5 },
  { question: "Vocês atendem quais cidades?", answer: "Temos 3 lojas em Araraquara e 1 em São Carlos, e atendemos também cidades da região central como Américo Brasiliense, Matão e arredores. Consulte a loja mais próxima.", category: "geral", order: 6 },
];

const instagramGrid = [
  { image: IMG.poolGarden, alt: "Piscina azul cercada de jardim tropical", href: "https://www.instagram.com/maisastral/" },
  { image: IMG.solarRoofSunset, alt: "Placas solares em telhado ao entardecer", href: "https://www.instagram.com/maisastral/" },
  { image: IMG.poolDeck, alt: "Deck de madeira com espreguiçadeiras à beira da piscina", href: "https://www.instagram.com/maisastral/" },
  { image: IMG.spaStones, alt: "Momento de relaxamento em spa com pedras quentes", href: "https://www.instagram.com/maisastral/" },
  { image: IMG.poolAerial, alt: "Vista aérea de piscina com água turquesa", href: "https://www.instagram.com/maisastral/" },
  { image: IMG.solarInstall, alt: "Técnico instalando placa solar no telhado", href: "https://www.instagram.com/maisastral/" },
];

async function main() {
  console.log("🌞 Semeando banco da Astral...");

  for (const s of stores) {
    await db.store.upsert({ where: { slug: s.slug }, update: s, create: s });
  }

  let catOrder = 0;
  for (const c of categories) {
    catOrder++;
    const data = { slug: c.slug, name: c.name, description: c.description, icon: c.icon, image: c.image, section: c.section, order: catOrder };
    const category = await db.category.upsert({ where: { slug: c.slug }, update: data, create: data });
    let pOrder = 0;
    for (const p of c.products) {
      pOrder++;
      const slug = p.name
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const productData = {
        slug,
        name: p.name,
        shortDescription: p.short,
        description: p.body + ORCAMENTO,
        specs: (p.specs ?? []).map(([label, value]) => ({ label, value })),
        images: [c.images[(pOrder - 1) % c.images.length], ...c.images.filter((_, i) => i !== (pOrder - 1) % c.images.length)].slice(0, 3),
        categoryId: category.id,
        featured: p.featured ?? false,
        order: pOrder,
      };
      await db.product.upsert({ where: { slug }, update: productData, create: productData });
    }
  }

  for (const [i, s] of services.entries()) {
    const data = { ...s, order: i + 1 };
    await db.service.upsert({ where: { slug: s.slug }, update: data, create: data });
  }

  await db.testimonial.deleteMany();
  await db.testimonial.createMany({ data: testimonials });

  await db.project.deleteMany();
  await db.project.createMany({ data: projects });

  await db.faq.deleteMany();
  await db.faq.createMany({ data: faqs });

  await db.promotion.deleteMany();
  await db.promotion.create({
    data: {
      title: "Verão 2027",
      text: "Aqueça sua piscina com o sol e aproveite o ano todo.",
      ctaLabel: "Simular agora",
      ctaHref: "/piscinas#monte-sua-piscina",
      startsAt: new Date("2026-11-01T00:00:00-03:00"),
      endsAt: new Date("2027-03-20T23:59:59-03:00"),
      active: true,
    },
  });

  for (const p of POSTS) {
    await db.post.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  await db.siteSetting.upsert({
    where: { key: "instagramGrid" },
    update: { value: instagramGrid },
    create: { key: "instagramGrid", value: instagramGrid },
  });

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 12);
    await db.adminUser.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash, name: "Administrador", role: "OWNER" },
    });
    console.log(`👤 Admin: ${email}`);
  } else {
    console.warn("⚠️  ADMIN_EMAIL/ADMIN_PASSWORD não definidos — nenhum usuário admin criado.");
  }

  console.log("✅ Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
