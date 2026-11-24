import type { EntityKey } from "@/lib/validations/admin";

/** Configuração das telas de CRUD do painel (rótulos, colunas e campos do formulário). */

export type FieldDef =
  | { name: string; label: string; type: "text" | "textarea" | "markdown" | "number" | "url" | "email" | "datetime"; hint?: string; placeholder?: string; full?: boolean; step?: string }
  | { name: string; label: string; type: "slug"; from: string; hint?: string }
  | { name: string; label: string; type: "boolean"; hint?: string }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[] | "categories"; hint?: string }
  | { name: string; label: string; type: "icon"; hint?: string }
  | { name: string; label: string; type: "image"; hint?: string; folder: string }
  | { name: string; label: string; type: "images"; hint?: string; folder: string }
  | { name: string; label: string; type: "specs"; hint?: string }
  | { name: string; label: string; type: "hours"; hint?: string };

export type ColumnDef = { key: string; label: string; kind?: "image" | "boolean" | "date" | "relation" | "stars" };

export type EntityConfig = {
  key: EntityKey;
  label: string;
  singular: string;
  description: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  /** Página pública para "ver no site" */
  publicPath?: (row: Record<string, unknown>) => string | null;
};

const SECTIONS = [
  { value: "aquecimento-solar", label: "Aquecimento solar" },
  { value: "energia-solar", label: "Energia solar" },
  { value: "piscinas", label: "Piscinas" },
  { value: "tratamento", label: "Tratamento" },
  { value: "lazer", label: "Lazer" },
  { value: "banho-e-conforto", label: "Banho e conforto" },
];

const FAQ_CATEGORIES = [{ value: "geral", label: "Geral" }, ...SECTIONS];

export const ENTITIES: Record<EntityKey, EntityConfig> = {
  produtos: {
    key: "produtos",
    label: "Produtos",
    singular: "produto",
    description: "Itens do catálogo. Produtos inativos somem do site.",
    columns: [
      { key: "images", label: "Foto", kind: "image" },
      { key: "name", label: "Nome" },
      { key: "category", label: "Categoria", kind: "relation" },
      { key: "featured", label: "Destaque", kind: "boolean" },
      { key: "active", label: "Ativo", kind: "boolean" },
    ],
    fields: [
      { name: "name", label: "Nome do produto", type: "text" },
      { name: "slug", label: "Endereço na web", type: "slug", from: "name", hint: "Gerado a partir do nome. Ex.: /produtos/kit-aquecedor-solar" },
      { name: "categoryId", label: "Categoria", type: "select", options: "categories" },
      { name: "shortDescription", label: "Resumo (aparece nos cards)", type: "textarea" },
      { name: "description", label: "Descrição completa", type: "markdown", hint: "Use **negrito**, listas com - e linhas em branco entre parágrafos." },
      { name: "images", label: "Fotos", type: "images", folder: "produtos", hint: "A primeira foto é a principal." },
      { name: "specs", label: "Ficha técnica", type: "specs" },
      { name: "featured", label: "Destaque", type: "boolean", hint: "Aparece primeiro e com selo de destaque." },
      { name: "active", label: "Ativo no site", type: "boolean" },
      { name: "order", label: "Ordem", type: "number", hint: "Menor aparece primeiro." },
    ],
    defaults: { name: "", slug: "", categoryId: "", shortDescription: "", description: "", images: [], specs: [], featured: false, active: true, order: 0 },
    publicPath: (r) => (r.active ? `/produtos/${String(r.slug)}` : null),
  },
  categorias: {
    key: "categorias",
    label: "Categorias",
    singular: "categoria",
    description: "Organizam o catálogo e as páginas de solução.",
    columns: [
      { key: "image", label: "Foto", kind: "image" },
      { key: "name", label: "Nome" },
      { key: "section", label: "Página" },
      { key: "order", label: "Ordem" },
    ],
    fields: [
      { name: "name", label: "Nome", type: "text" },
      { name: "slug", label: "Endereço na web", type: "slug", from: "name" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "section", label: "Aparece na página", type: "select", options: SECTIONS },
      { name: "icon", label: "Ícone", type: "icon" },
      { name: "image", label: "Foto", type: "image", folder: "categorias" },
      { name: "order", label: "Ordem", type: "number" },
    ],
    defaults: { name: "", slug: "", description: "", section: "", icon: "", image: "", order: 0 },
    publicPath: (r) => `/produtos?categoria=${String(r.slug)}`,
  },
  servicos: {
    key: "servicos",
    label: "Serviços",
    singular: "serviço",
    description: "Lista da página de serviços e da home.",
    columns: [
      { key: "name", label: "Nome" },
      { key: "active", label: "Ativo", kind: "boolean" },
      { key: "order", label: "Ordem" },
    ],
    fields: [
      { name: "name", label: "Nome", type: "text" },
      { name: "slug", label: "Identificador", type: "slug", from: "name" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "icon", label: "Ícone", type: "icon" },
      { name: "image", label: "Foto", type: "image", folder: "servicos" },
      { name: "active", label: "Ativo no site", type: "boolean" },
      { name: "order", label: "Ordem", type: "number" },
    ],
    defaults: { name: "", slug: "", description: "", icon: "", image: "", active: true, order: 0 },
    publicPath: (r) => `/servicos#${String(r.slug)}`,
  },
  lojas: {
    key: "lojas",
    label: "Lojas",
    singular: "loja",
    description: "Endereços, telefones, WhatsApp e horários das lojas.",
    columns: [
      { key: "name", label: "Loja" },
      { key: "city", label: "Cidade" },
      { key: "phone", label: "Telefone" },
      { key: "isMain", label: "Matriz", kind: "boolean" },
    ],
    fields: [
      { name: "name", label: "Nome", type: "text", placeholder: "Loja 1 — Vila Harmonia" },
      { name: "slug", label: "Endereço na web", type: "slug", from: "name" },
      { name: "address", label: "Endereço (rua e número)", type: "text" },
      { name: "neighborhood", label: "Bairro", type: "text" },
      { name: "city", label: "Cidade", type: "text" },
      { name: "cep", label: "CEP", type: "text" },
      { name: "phone", label: "Telefone", type: "text", placeholder: "(16) 3322-7191" },
      { name: "whatsapp", label: "WhatsApp (com 55 + DDD)", type: "text", placeholder: "5516996239413" },
      { name: "email", label: "E-mail", type: "email" },
      { name: "openingHours", label: "Horário de funcionamento", type: "hours" },
      { name: "hoursNote", label: "Observação do horário", type: "text", placeholder: "Ex.: fechado em feriados" },
      { name: "lat", label: "Latitude", type: "number", step: "any", hint: "No Google Maps: clique com o botão direito no local → copie os números." },
      { name: "lng", label: "Longitude", type: "number", step: "any" },
      { name: "mapsUrl", label: "Link do Google Maps (opcional)", type: "url" },
      { name: "image", label: "Foto", type: "image", folder: "lojas" },
      { name: "isMain", label: "É a matriz", type: "boolean" },
      { name: "order", label: "Ordem", type: "number" },
    ],
    defaults: { name: "", slug: "", address: "", neighborhood: "", city: "Araraquara", cep: "", phone: "", whatsapp: "", email: "", lat: -21.7845, lng: -48.178, mapsUrl: "", openingHours: [], hoursNote: "", image: "", isMain: false, order: 0 },
    publicPath: (r) => `/lojas/${String(r.slug)}`,
  },
  depoimentos: {
    key: "depoimentos",
    label: "Depoimentos",
    singular: "depoimento",
    description: "Avaliações de clientes exibidas na home.",
    columns: [
      { key: "author", label: "Cliente" },
      { key: "role", label: "Descrição" },
      { key: "rating", label: "Nota", kind: "stars" },
      { key: "active", label: "Ativo", kind: "boolean" },
    ],
    fields: [
      { name: "author", label: "Nome do cliente", type: "text" },
      { name: "role", label: "Quem é (ex.: Arquiteta, Cliente)", type: "text" },
      { name: "text", label: "Depoimento", type: "textarea" },
      { name: "rating", label: "Nota (1 a 5)", type: "number" },
      { name: "active", label: "Mostrar no site", type: "boolean" },
      { name: "order", label: "Ordem", type: "number" },
    ],
    defaults: { author: "", role: "", text: "", rating: 5, active: true, order: 0 },
  },
  projetos: {
    key: "projetos",
    label: "Projetos (galeria)",
    singular: "projeto",
    description: "Obras e piscinas mostradas na galeria.",
    columns: [
      { key: "images", label: "Foto", kind: "image" },
      { key: "title", label: "Título" },
      { key: "type", label: "Tipo" },
      { key: "city", label: "Cidade" },
      { key: "featured", label: "Na home", kind: "boolean" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "type", label: "Tipo", type: "text", placeholder: "Vinil, Fibra, Azulejo, Aquecimento solar…" },
      { name: "city", label: "Cidade", type: "text" },
      { name: "images", label: "Fotos", type: "images", folder: "projetos" },
      { name: "description", label: "Descrição", type: "textarea" },
      { name: "featured", label: "Mostrar na home", type: "boolean" },
      { name: "order", label: "Ordem", type: "number" },
    ],
    defaults: { title: "", type: "", city: "", images: [], description: "", featured: true, order: 0 },
  },
  promocoes: {
    key: "promocoes",
    label: "Faixa de campanha",
    singular: "campanha",
    description: "Faixa no topo do site. Aparece só entre a data de início e de fim.",
    columns: [
      { key: "title", label: "Título" },
      { key: "startsAt", label: "Início", kind: "date" },
      { key: "endsAt", label: "Fim", kind: "date" },
      { key: "active", label: "Ativa", kind: "boolean" },
    ],
    fields: [
      { name: "title", label: "Título (em destaque)", type: "text", placeholder: "Verão 2027" },
      { name: "text", label: "Texto", type: "text", placeholder: "Aqueça sua piscina e aproveite o ano todo." },
      { name: "ctaLabel", label: "Texto do link", type: "text", placeholder: "Simular agora" },
      { name: "ctaHref", label: "Link", type: "url", placeholder: "/piscinas#monte-sua-piscina" },
      { name: "startsAt", label: "Começa em", type: "datetime" },
      { name: "endsAt", label: "Termina em", type: "datetime" },
      { name: "active", label: "Ativa", type: "boolean" },
    ],
    defaults: { title: "", text: "", ctaLabel: "", ctaHref: "", startsAt: "", endsAt: "", active: true },
  },
  posts: {
    key: "posts",
    label: "Dicas (blog)",
    singular: "artigo",
    description: "Artigos da seção Dicas. Sem data de publicação = rascunho.",
    columns: [
      { key: "coverImage", label: "Capa", kind: "image" },
      { key: "title", label: "Título" },
      { key: "publishedAt", label: "Publicado em", kind: "date" },
    ],
    fields: [
      { name: "title", label: "Título", type: "text" },
      { name: "slug", label: "Endereço na web", type: "slug", from: "title" },
      { name: "excerpt", label: "Resumo", type: "textarea" },
      { name: "content", label: "Conteúdo", type: "markdown", hint: "Use ## para subtítulos, **negrito**, listas com - e links [texto](/pagina)." },
      { name: "coverImage", label: "Imagem de capa", type: "image", folder: "posts" },
      { name: "publishedAt", label: "Publicar em", type: "datetime", hint: "Deixe vazio para manter como rascunho." },
      { name: "seoTitle", label: "Título para o Google (opcional)", type: "text", hint: "Até 60 caracteres." },
      { name: "seoDescription", label: "Descrição para o Google (opcional)", type: "textarea", hint: "Até 160 caracteres." },
    ],
    defaults: { title: "", slug: "", excerpt: "", content: "", coverImage: "", publishedAt: "", seoTitle: "", seoDescription: "" },
    publicPath: (r) => (r.publishedAt ? `/dicas/${String(r.slug)}` : null),
  },
  faqs: {
    key: "faqs",
    label: "Perguntas frequentes",
    singular: "pergunta",
    description: "Dúvidas exibidas nas páginas (com marcação para o Google).",
    columns: [
      { key: "question", label: "Pergunta" },
      { key: "category", label: "Página" },
      { key: "order", label: "Ordem" },
    ],
    fields: [
      { name: "question", label: "Pergunta", type: "text" },
      { name: "answer", label: "Resposta", type: "textarea" },
      { name: "category", label: "Aparece em", type: "select", options: FAQ_CATEGORIES },
      { name: "order", label: "Ordem", type: "number" },
    ],
    defaults: { question: "", answer: "", category: "geral", order: 0 },
  },
};
