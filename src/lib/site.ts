import type { LeadInterest } from "@/generated/prisma/enums";

export const BRAND = {
  name: "Astral",
  tagline: "Solar | Piscinas | Lazer",
  searchName: "Astral Energia Solar e Piscinas",
  domain: "astralsolarepiscinas.com.br",
  founder: "João Luiz Ambrósio, o Joãozinho",
  foundedYear: 1986,
  firstStoreYear: 2010,
  description:
    "Aquecimento solar, energia fotovoltaica, piscinas e lazer em Araraquara e São Carlos. Quase 40 anos levando conforto, economia e lazer com trabalho transparente e sólido.",
  positioning:
    "Uma empresa com experiência, que busca levar conforto, economia e lazer aos nossos clientes através de um trabalho transparente e sólido.",
  emails: { araraquara: "astralenergiasolar@gmail.com", saoCarlos: "astralsaocarlos@gmail.com" },
  cnpj: "[CONFIRMAR]",
} as const;

export const YEARS_IN_BUSINESS = new Date().getFullYear() - BRAND.foundedYear;

export type NavLink = { href: string; label: string; description?: string; icon?: string };

/** Páginas de solução — usadas no menu, no footer e nos cards da home. */
export const SOLUTIONS: (NavLink & { section: string; image?: string })[] = [
  { href: "/aquecimento-solar", label: "Aquecimento solar", description: "Banho e piscina aquecidos pelo sol", icon: "Sun", section: "aquecimento-solar" },
  { href: "/energia-solar", label: "Energia solar", description: "Painéis fotovoltaicos para baixar a conta", icon: "Zap", section: "energia-solar" },
  { href: "/piscinas", label: "Piscinas", description: "Vinil, fibra e azulejo + automação", icon: "Waves", section: "piscinas" },
  { href: "/tratamento", label: "Tratamento e acessórios", description: "Químicos, bombas, filtros e peças", icon: "FlaskConical", section: "tratamento" },
  { href: "/lazer", label: "Lazer", description: "Saunas, spas e móveis outdoor", icon: "Armchair", section: "lazer" },
  { href: "/banho-e-conforto", label: "Banho e conforto", description: "Aquecedor a gás, filtro central e mais", icon: "ShowerHead", section: "banho-e-conforto" },
];

export const MAIN_NAV: NavLink[] = [
  { href: "/servicos", label: "Serviços" },
  { href: "/lojas", label: "Lojas" },
  { href: "/sobre", label: "Sobre" },
  { href: "/dicas", label: "Dicas" },
];

export const INTEREST_LABELS: Record<LeadInterest, string> = {
  AQUECIMENTO_SOLAR: "Aquecimento solar",
  FOTOVOLTAICA: "Energia solar fotovoltaica",
  PISCINA: "Piscina",
  TRATAMENTO: "Tratamento de piscina",
  LAZER: "Lazer (sauna, spa, móveis)",
  BANHO_CONFORTO: "Banho e conforto",
  SERVICO: "Serviço / assistência técnica",
  OUTRO: "Outro assunto",
};

export const STATUS_LABELS = {
  NOVO: "Novo",
  EM_ATENDIMENTO: "Em atendimento",
  FECHADO: "Fechado",
  PERDIDO: "Perdido",
} as const;

export const SERVICE_AREA = ["Araraquara", "São Carlos", "Américo Brasiliense", "Matão"];
