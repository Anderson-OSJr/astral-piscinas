"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Minus, Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateSolarBath, ESTIMATE_DISCLAIMER, type ShowerType } from "@/lib/calculators";
import type { CalculatorSettings } from "@/lib/settings-schema";
import { brl, num } from "@/lib/format";
import { cn } from "@/lib/utils";

export function SolarBathCalculator({
  settings,
  compact = false,
  className,
}: {
  settings: CalculatorSettings;
  compact?: boolean;
  className?: string;
}) {
  const [people, setPeople] = useState(4);
  const [showerType, setShowerType] = useState<ShowerType>("eletrico");
  const [kwhPrice, setKwhPrice] = useState(settings.kwhPrice);

  const result = useMemo(
    () => calculateSolarBath({ people, showerType, kwhPrice: kwhPrice > 0 ? kwhPrice : settings.kwhPrice }, settings),
    [people, showerType, kwhPrice, settings],
  );

  const quoteHref = `/orcamento?${new URLSearchParams({
    interesse: "AQUECIMENTO_SOLAR",
    origem: "calculadora-banho",
    moradores: String(people),
    chuveiro: showerType,
    economiaMensal: String(Math.round(result.monthlySavings)),
  })}`;

  const barPercent = Math.min(100, result.savingsPercent);

  return (
    <div className={cn("rounded-[2rem] border bg-white p-6 shadow-[0_30px_60px_-30px_rgb(10_61_98/0.35)] sm:p-8", className)}>
      <div className={cn("grid gap-8", !compact && "lg:grid-cols-2 lg:gap-12")}>
        <div className="space-y-6">
          <div>
            <Label id="people-label" className="text-base font-semibold text-ink">
              Quantas pessoas moram na casa?
            </Label>
            <div className="mt-3 flex items-center gap-3" role="group" aria-labelledby="people-label">
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className="rounded-full"
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                aria-label="Diminuir moradores"
              >
                <Minus />
              </Button>
              <output className="font-heading w-16 text-center text-4xl font-extrabold text-ocean-900 tabular-nums" aria-live="polite">
                {people}
              </output>
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className="rounded-full"
                onClick={() => setPeople((p) => Math.min(12, p + 1))}
                aria-label="Aumentar moradores"
              >
                <Plus />
              </Button>
            </div>
          </div>

          <fieldset>
            <legend className="text-base font-semibold text-ink">Como você esquenta a água hoje?</legend>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {(
                [
                  { id: "eletrico", label: "Chuveiro elétrico", Icon: Zap },
                  { id: "gas", label: "Aquecedor a gás", Icon: Flame },
                ] as const
              ).map(({ id, label, Icon }) => (
                <label
                  key={id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-2xl border-2 px-4 py-3 font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                    showerType === id ? "border-sun-500 bg-sun-100 text-ink" : "border-border hover:border-sun-300",
                  )}
                >
                  <input
                    type="radio"
                    name={`shower-${compact ? "c" : "f"}`}
                    value={id}
                    checked={showerType === id}
                    onChange={() => setShowerType(id)}
                    className="sr-only"
                  />
                  <Icon className="size-5 text-sun-600" aria-hidden="true" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {showerType === "eletrico" && !compact && (
            <div>
              <Label htmlFor="kwh" className="text-base font-semibold text-ink">
                Valor do kWh na sua conta (R$)
              </Label>
              <Input
                id="kwh"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.1"
                value={kwhPrice}
                onChange={(e) => setKwhPrice(Number(e.target.value))}
                className="mt-2 h-12 max-w-40 rounded-xl text-lg"
              />
              <p className="mt-1.5 text-sm text-muted-foreground">Está na sua conta de luz, com impostos. Padrão: {brl(settings.kwhPrice, 2)}.</p>
            </div>
          )}
        </div>

        <div className="bg-ocean relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-white sm:p-7">
          <div aria-live="polite">
            <p className="text-sm font-semibold text-white/75">Economia estimada com aquecimento solar</p>
            <p className="font-heading mt-2 text-5xl font-extrabold tabular-nums sm:text-6xl">
              <span className="text-sun">{brl(result.monthlySavings)}</span>
              <span className="text-xl font-bold text-white/70">/mês</span>
            </p>
            <p className="mt-2 text-lg">
              ≈ <strong className="tabular-nums">{brl(result.yearlySavings)}</strong> por ano
            </p>
            <div className="mt-6">
              <div className="flex justify-between text-xs font-semibold text-white/70">
                <span>Gasto atual com banho: {brl(result.monthlyCost)}/mês</span>
                <span>{num(result.savingsPercent)}% menos</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/15" aria-hidden="true">
                <div className="bg-sun h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${barPercent}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/60">
                Consumo atual estimado: {num(result.monthlyConsumption, 1)} {result.consumptionUnit}/mês
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild variant="sun" size="xl" className="w-full">
              <Link href={quoteHref}>
                Quero esse orçamento <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-white/65">{ESTIMATE_DISCLAIMER}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
