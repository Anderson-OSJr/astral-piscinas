/**
 * Fórmulas das calculadoras do site. Todas são ESTIMATIVAS simplificadas, pensadas para dar
 * uma ordem de grandeza ao cliente — o orçamento real é feito pela equipe Astral.
 * Os parâmetros (preço do kWh, irradiação etc.) são editáveis no admin → Configurações.
 */
import type { CalculatorSettings } from "@/lib/settings-schema";

const DAYS_PER_MONTH = 30;
/** Energia para aquecer 1 litro de água em 1 °C (kWh) */
const KWH_PER_LITER_DEGREE = 0.001163;
/** Poder calorífico do GLP (kWh/kg) */
const GLP_KWH_PER_KG = 12.8;

// ---------------------------------------------------------------------------
// 1) Aquecimento solar para banho
// ---------------------------------------------------------------------------
export type ShowerType = "eletrico" | "gas";

export type SolarBathInput = {
  people: number;
  showerType: ShowerType;
  kwhPrice?: number;
};

export type SolarBathResult = {
  monthlyCost: number;
  monthlySavings: number;
  yearlySavings: number;
  /** Consumo mensal atual: kWh (elétrico) ou kg de GLP (gás) */
  monthlyConsumption: number;
  consumptionUnit: "kWh" | "kg de gás";
  savingsPercent: number;
};

/**
 * Elétrico: kWh/mês = pessoas × potência do chuveiro (kW) × minutos/60 × 30.
 * Gás: energia térmica = pessoas × litros × ΔT × 0,001163 kWh; kg de GLP = energia ÷ (12,8 × rendimento).
 * Economia = custo atual × fração solar.
 */
export function calculateSolarBath(input: SolarBathInput, s: CalculatorSettings): SolarBathResult {
  const people = Math.max(1, Math.round(input.people));
  const kwhPrice = input.kwhPrice ?? s.kwhPrice;

  if (input.showerType === "eletrico") {
    const monthlyKwh = people * s.showerPowerKw * (s.showerMinutes / 60) * DAYS_PER_MONTH;
    const monthlyCost = monthlyKwh * kwhPrice;
    const monthlySavings = monthlyCost * s.solarFraction;
    return {
      monthlyCost,
      monthlySavings,
      yearlySavings: monthlySavings * 12,
      monthlyConsumption: monthlyKwh,
      consumptionUnit: "kWh",
      savingsPercent: s.solarFraction * 100,
    };
  }

  const thermalKwhPerDay = people * s.hotWaterLitersPerPerson * s.waterDeltaT * KWH_PER_LITER_DEGREE;
  const monthlyKg = (thermalKwhPerDay * DAYS_PER_MONTH) / (GLP_KWH_PER_KG * s.gasHeaterEfficiency);
  const monthlyCost = monthlyKg * s.gasPricePerKg;
  const monthlySavings = monthlyCost * s.solarFraction;
  return {
    monthlyCost,
    monthlySavings,
    yearlySavings: monthlySavings * 12,
    monthlyConsumption: monthlyKg,
    consumptionUnit: "kg de gás",
    savingsPercent: s.solarFraction * 100,
  };
}

// ---------------------------------------------------------------------------
// 2) Energia solar fotovoltaica
// ---------------------------------------------------------------------------
export type PhotovoltaicResult = {
  monthlyKwh: number;
  /** kWh/mês que o sistema precisa gerar (consumo − mínimo da distribuidora) */
  targetKwh: number;
  systemKwp: number;
  panels: number;
  areaM2: number;
  monthlyGenerationPerKwp: number;
  yearlySavings: number;
  estimatedCost: number;
  paybackYears: number;
};

/**
 * kWh/mês = conta ÷ preço do kWh.
 * Geração por kWp/mês = irradiação × 30 × rendimento (PR).
 * kWp = (consumo − mínimo) ÷ geração por kWp.  Placas = ⌈kWp × 1000 ÷ potência da placa⌉.
 * Economia anual = kWh compensados × preço × 12.  Payback = custo estimado ÷ economia anual.
 */
export function calculatePhotovoltaic(monthlyBill: number, s: CalculatorSettings): PhotovoltaicResult {
  const monthlyKwh = Math.max(0, monthlyBill) / s.kwhPrice;
  const targetKwh = Math.max(0, monthlyKwh - s.minimumKwh);
  const monthlyGenerationPerKwp = s.irradiation * DAYS_PER_MONTH * s.performanceRatio;
  const rawKwp = targetKwh / monthlyGenerationPerKwp;
  const panels = targetKwh > 0 ? Math.max(1, Math.ceil((rawKwp * 1000) / s.panelWatt)) : 0;
  const systemKwp = (panels * s.panelWatt) / 1000;
  const compensated = Math.min(targetKwh, systemKwp * monthlyGenerationPerKwp);
  const yearlySavings = compensated * s.kwhPrice * 12;
  const estimatedCost = systemKwp * s.systemCostPerKwp;
  return {
    monthlyKwh,
    targetKwh,
    systemKwp,
    panels,
    areaM2: panels * s.panelAreaM2,
    monthlyGenerationPerKwp,
    yearlySavings,
    estimatedCost,
    paybackYears: yearlySavings > 0 ? estimatedCost / yearlySavings : 0,
  };
}

// ---------------------------------------------------------------------------
// 3) Piscina: volume e aquecimento solar
// ---------------------------------------------------------------------------
export type PoolDimensions = { length: number; width: number; depth: number };

export const POOL_PRESETS = [
  { id: "pequena", label: "Pequena", description: "Ideal para quintais compactos", length: 5, width: 2.5, depth: 1.3 },
  { id: "media", label: "Média", description: "A queridinha das famílias", length: 7, width: 3.5, depth: 1.4 },
  { id: "grande", label: "Grande", description: "Para receber a turma toda", length: 10, width: 5, depth: 1.5 },
] as const;

export type PoolResult = {
  surfaceM2: number;
  volumeLiters: number;
  collectorAreaM2: number;
  collectors: number;
};

/**
 * Volume (L) = comprimento × largura × profundidade média × 1000.
 * Coletores = ⌈espelho d'água × proporção ÷ área do coletor⌉ (regra prática; varia com
 * sombreamento, uso de capa térmica e temperatura desejada).
 */
export function calculatePool(d: PoolDimensions, s: CalculatorSettings): PoolResult {
  const surfaceM2 = Math.max(0, d.length) * Math.max(0, d.width);
  const volumeLiters = surfaceM2 * Math.max(0, d.depth) * 1000;
  const collectorAreaM2 = surfaceM2 * s.poolCollectorRatio;
  return {
    surfaceM2,
    volumeLiters,
    collectorAreaM2,
    collectors: surfaceM2 > 0 ? Math.ceil(collectorAreaM2 / s.poolCollectorAreaM2) : 0,
  };
}

export const ESTIMATE_DISCLAIMER = "Estimativa — faça um orçamento para valores reais.";
