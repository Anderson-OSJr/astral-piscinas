import { IMG } from "@/lib/images";

export const POOL_TYPES = [
  {
    slug: "vinil",
    name: "Piscina de vinil",
    short: "Formato livre, toque macio e ótimo custo-benefício.",
    image: IMG.poolGarden,
    imageAlt: "Piscina de vinil retangular em jardim tropical",
    intro:
      "A piscina de vinil é feita com estrutura de alvenaria revestida por um bolsão de vinil sob medida. É a escolha de quem quer liberdade de formato sem estourar o orçamento.",
    pros: ["Formato e tamanho livres", "Toque macio, ótimo para crianças", "Bom custo-benefício", "Visual renovável com a troca do vinil"],
    cons: ["O vinil tem vida útil e precisa ser trocado um dia", "Objetos pontiagudos podem furar o revestimento"],
    idealFor: "Famílias que querem um projeto personalizado com investimento equilibrado.",
  },
  {
    slug: "fibra",
    name: "Piscina de fibra",
    short: "Pronta em poucos dias e muito fácil de limpar.",
    image: IMG.poolBackyard,
    imageAlt: "Piscina de fibra em quintal residencial",
    intro:
      "A piscina de fibra chega pronta de fábrica, em peça única, e é instalada no buraco preparado. É a opção mais rápida para quem quer mergulhar logo.",
    pros: ["Instalação rápida", "Superfície lisa que dificulta algas", "Menos obra no quintal", "Manutenção simples"],
    cons: ["Formatos limitados aos modelos de fábrica", "Precisa de acesso para o caminhão e a peça"],
    idealFor: "Quem tem pressa e prefere menos obra em casa.",
  },
  {
    slug: "azulejo",
    name: "Piscina de azulejo (pastilha)",
    short: "Durabilidade máxima e acabamento sofisticado.",
    image: IMG.poolVilla,
    imageAlt: "Piscina revestida de pastilhas em casa de alto padrão",
    intro:
      "Construída em alvenaria ou concreto e revestida com pastilhas, a piscina de azulejo permite qualquer projeto — de borda infinita a prainha com hidro.",
    pros: ["Durabilidade muito alta", "Acabamento sofisticado", "Projetos especiais: borda infinita, prainha, bancos", "Infinitas combinações de cores"],
    cons: ["Obra mais longa", "Rejunte pede atenção na manutenção"],
    idealFor: "Projetos de alto padrão e quem pensa em décadas de uso.",
  },
] as const;

export type PoolTypeSlug = (typeof POOL_TYPES)[number]["slug"];
