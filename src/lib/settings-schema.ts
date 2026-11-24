import { z } from "zod";

/**
 * Configurações editáveis no admin (tabela SiteSetting, uma linha por chave).
 * Cada schema tem valores padrão — se a linha não existir no banco, o site usa o padrão.
 */

export const heroSettingsSchema = z.object({
  eyebrow: z.string().default("Araraquara · São Carlos · desde 1986"),
  title: z.string().default("Na Morada do Sol, o calor trabalha para você."),
  subtitle: z
    .string()
    .default("Aquecimento solar, energia fotovoltaica e piscinas — há quase 40 anos em Araraquara e São Carlos."),
  image: z
    .string()
    .default("https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=2000&q=80"),
  imageAlt: z.string().default("Piscina residencial azul-turquesa sob o sol forte, com área de lazer ao redor"),
  primaryCta: z.string().default("Fazer orçamento"),
  secondaryCta: z.string().default("Falar no WhatsApp"),
});

export const calculatorSettingsSchema = z.object({
  /** R$/kWh com impostos. [CONFIRMAR] com a tarifa CPFL vigente */
  kwhPrice: z.coerce.number().positive().default(0.95),
  /** Potência média de chuveiro elétrico (kW) */
  showerPowerKw: z.coerce.number().positive().default(5.5),
  /** Minutos de banho por pessoa por dia */
  showerMinutes: z.coerce.number().positive().default(8),
  /** Fração do aquecimento coberta pelo solar (0–1) */
  solarFraction: z.coerce.number().min(0).max(1).default(0.75),
  /** Consumo de água quente por pessoa/dia (litros) */
  hotWaterLitersPerPerson: z.coerce.number().positive().default(50),
  /** Elevação de temperatura da água (°C) */
  waterDeltaT: z.coerce.number().positive().default(20),
  /** R$/kg de GLP. [CONFIRMAR] */
  gasPricePerKg: z.coerce.number().positive().default(8.5),
  /** Rendimento do aquecedor a gás (0–1) */
  gasHeaterEfficiency: z.coerce.number().min(0.1).max(1).default(0.8),
  /** Irradiação solar média diária em Araraquara (kWh/m²/dia) */
  irradiation: z.coerce.number().positive().default(5.3),
  /** Rendimento global do sistema fotovoltaico (0–1) */
  performanceRatio: z.coerce.number().min(0.1).max(1).default(0.78),
  /** Potência de cada placa fotovoltaica (W) */
  panelWatt: z.coerce.number().positive().default(580),
  /** Área de cada placa fotovoltaica (m²) */
  panelAreaM2: z.coerce.number().positive().default(2.6),
  /** Custo estimado do sistema por kWp instalado (R$). [CONFIRMAR] */
  systemCostPerKwp: z.coerce.number().positive().default(3800),
  /** Consumo mínimo cobrado pela distribuidora (kWh/mês) */
  minimumKwh: z.coerce.number().min(0).default(50),
  /** Área de coletor solar de piscina por m² de espelho d'água */
  poolCollectorRatio: z.coerce.number().positive().default(0.8),
  /** Área de cada coletor solar de piscina (m²) */
  poolCollectorAreaM2: z.coerce.number().positive().default(2),
});

export const socialSettingsSchema = z.object({
  instagram: z.string().default("https://www.instagram.com/maisastral/"),
  instagramHandle: z.string().default("@maisastral"),
  facebook: z.string().default("https://www.facebook.com/maisastral"),
  googleReviewsUrl: z
    .string()
    .default("https://www.google.com/maps/search/?api=1&query=Astral+Energia+Solar+e+Piscinas+Araraquara"),
  instagramFollowers: z.string().default("+4,7 mil"),
  instagramPosts: z.string().default("+1.100"),
});

export const googleSettingsSchema = z.object({
  rating: z.coerce.number().min(0).max(5).default(4.6),
  total: z.coerce.number().int().min(0).default(30),
});

export const instagramGridSchema = z
  .array(
    z.object({
      image: z.string(),
      alt: z.string(),
      href: z.string().default("https://www.instagram.com/maisastral/"),
    }),
  )
  .default([]);

export const SETTINGS = {
  hero: heroSettingsSchema,
  calculators: calculatorSettingsSchema,
  social: socialSettingsSchema,
  google: googleSettingsSchema,
  instagramGrid: instagramGridSchema,
} as const;

export type SettingKey = keyof typeof SETTINGS;

/** Entrada "vazia" que faz o schema preencher todos os padrões. */
export function settingEmptyInput(key: SettingKey) {
  return key === "instagramGrid" ? [] : {};
}
export type SettingValue<K extends SettingKey> = z.infer<(typeof SETTINGS)[K]>;
export type HeroSettings = SettingValue<"hero">;
export type CalculatorSettings = SettingValue<"calculators">;
export type SocialSettings = SettingValue<"social">;
export type GoogleSettings = SettingValue<"google">;
export type InstagramGrid = SettingValue<"instagramGrid">;

export const DEFAULT_CALCULATOR_SETTINGS: CalculatorSettings = calculatorSettingsSchema.parse({});
