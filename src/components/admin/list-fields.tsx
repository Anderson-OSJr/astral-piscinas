"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DAY_KEYS, DAY_LABELS, type OpeningHours } from "@/lib/hours";
import { cn } from "@/lib/utils";

export function SpecsField({ value, onChange }: { value: { label: string; value: string }[]; onChange: (v: { label: string; value: string }[]) => void }) {
  const update = (i: number, patch: Partial<{ label: string; value: string }>) => onChange(value.map((row, k) => (k === i ? { ...row, ...patch } : row)));
  return (
    <div className="space-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex gap-2">
          <Input value={row.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Ex.: Potência" aria-label={`Item ${i + 1}`} className="h-11 rounded-xl bg-background" />
          <Input value={row.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="Ex.: 580 W" aria-label={`Valor ${i + 1}`} className="h-11 rounded-xl bg-background" />
          <Button type="button" variant="ghost" size="icon-lg" className="h-11 shrink-0" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remover linha">
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="lg" onClick={() => onChange([...value, { label: "", value: "" }])}>
        <Plus aria-hidden="true" /> Adicionar linha
      </Button>
    </div>
  );
}

export function HoursField({ value, onChange }: { value: OpeningHours; onChange: (v: OpeningHours) => void }) {
  const update = (i: number, patch: Partial<OpeningHours[number]>) => onChange(value.map((row, k) => (k === i ? { ...row, ...patch } : row)));
  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div key={i} className="rounded-2xl border bg-background p-3">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Dias do horário ${i + 1}`}>
            {DAY_KEYS.map((d) => {
              const on = row.days.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={on}
                  onClick={() => update(i, { days: on ? row.days.filter((x) => x !== d) : [...row.days, d] })}
                  className={cn("h-9 min-w-11 rounded-lg border px-2 text-sm font-semibold", on ? "border-ocean-900 bg-ocean-900 text-white" : "hover:bg-muted")}
                >
                  {DAY_LABELS[d].short}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <label className="flex items-center gap-2">
              Abre
              <Input type="time" value={row.opens} onChange={(e) => update(i, { opens: e.target.value })} className="h-10 w-32 rounded-lg" />
            </label>
            <label className="flex items-center gap-2">
              Fecha
              <Input type="time" value={row.closes} onChange={(e) => update(i, { closes: e.target.value })} className="h-10 w-32 rounded-lg" />
            </label>
            <Button type="button" variant="ghost" size="lg" className="ml-auto text-destructive" onClick={() => onChange(value.filter((_, k) => k !== i))}>
              <Trash2 aria-hidden="true" /> Remover
            </Button>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="lg" onClick={() => onChange([...value, { days: ["sat"], opens: "08:00", closes: "12:00" }])}>
        <Plus aria-hidden="true" /> Adicionar horário
      </Button>
    </div>
  );
}
