"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BatteryCharging, CalendarClock, LayoutGrid, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { calculatePhotovoltaic, ESTIMATE_DISCLAIMER } from "@/lib/calculators";
import type { CalculatorSettings } from "@/lib/settings-schema";
import { brl, num } from "@/lib/format";

export function PvSimulator({ settings }: { settings: CalculatorSettings }) {
  const [bill, setBill] = useState(450);
  const r = useMemo(() => calculatePhotovoltaic(bill, settings), [bill, settings]);

  const quoteHref = `/orcamento?${new URLSearchParams({
    interesse: "FOTOVOLTAICA",
    origem: "simulador-fotovoltaico",
    conta: String(bill),
    placas: String(r.panels),
    kwp: r.systemKwp.toFixed(2),
  })}`;

  const stats = [
    { Icon: LayoutGrid, label: "Placas estimadas", value: `${r.panels}`, sub: `${num(settings.panelWatt)} W cada · ~${num(r.areaM2)} m² de telhado` },
    { Icon: BatteryCharging, label: "Potência do sistema", value: `${num(r.systemKwp, 2)} kWp`, sub: `gera ~${num(r.systemKwp * r.monthlyGenerationPerKwp)} kWh/mês` },
    { Icon: PiggyBank, label: "Economia anual", value: brl(r.yearlySavings), sub: `consumo atual ~${num(r.monthlyKwh)} kWh/mês` },
    {
      Icon: CalendarClock,
      label: "Retorno aproximado",
      value: r.paybackYears ? `${num(r.paybackYears, 1)} anos` : "—",
      sub: `investimento estimado ${brl(r.estimatedCost)}`,
    },
  ];

  return (
    <div className="rounded-[2rem] border bg-white p-6 shadow-[0_30px_60px_-30px_rgb(10_61_98/0.35)] sm:p-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <Label htmlFor="bill" className="text-lg font-bold text-ink">
          Quanto vem a sua conta de luz por mês?
        </Label>
        <output htmlFor="bill" className="font-heading text-4xl font-extrabold text-ocean-900 tabular-nums" aria-live="polite">
          {brl(bill)}
        </output>
      </div>
      <Slider
        id="bill"
        min={100}
        max={3000}
        step={10}
        value={[bill]}
        onValueChange={([v]) => setBill(v)}
        className="mt-6"
        aria-label="Valor médio da conta de luz"
      />
      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>R$ 100</span>
        <span>R$ 3.000+</span>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ Icon, label, value, sub }) => (
          <li key={label} className="rounded-3xl bg-sand p-5">
            <Icon className="size-6 text-sun-600" aria-hidden="true" />
            <p className="mt-3 text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="font-heading mt-1 text-2xl font-extrabold text-ocean-900 tabular-nums sm:text-3xl">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl bg-ocean-900 p-5 text-white sm:flex-row sm:p-6">
        <p className="text-sm text-white/80">
          {ESTIMATE_DISCLAIMER} Considera irradiação média de {num(settings.irradiation, 1)} kWh/m²/dia em Araraquara e o consumo mínimo
          cobrado pela distribuidora.
        </p>
        <Button asChild variant="sun" size="xl" className="w-full shrink-0 sm:w-auto">
          <Link href={quoteHref}>
            Quero esse projeto <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
