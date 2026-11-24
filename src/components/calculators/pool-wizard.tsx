"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Droplets, Lightbulb, Cpu, Sun, Waves, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SmartImage } from "@/components/site/smart-image";
import { LeadContactForm, type LeadStoreOption } from "@/components/forms/lead-contact-form";
import { calculatePool, ESTIMATE_DISCLAIMER, POOL_PRESETS } from "@/lib/calculators";
import type { CalculatorSettings } from "@/lib/settings-schema";
import { IMG } from "@/lib/images";
import { num } from "@/lib/format";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "vinil", label: "Vinil", text: "Formato livre e ótimo custo-benefício", image: IMG.poolGarden },
  { id: "fibra", label: "Fibra", text: "Instalação rápida, pronta em poucos dias", image: IMG.poolBackyard },
  { id: "azulejo", label: "Azulejo (pastilha)", text: "Durabilidade máxima e acabamento sofisticado", image: IMG.poolVilla },
] as const;

const EXTRAS = [
  { id: "aquecimentoSolar", label: "Aquecimento solar", text: "Piscina gostosa o ano inteiro", Icon: Sun },
  { id: "automacao", label: "Automação", text: "Filtro e luzes no automático", Icon: Cpu },
  { id: "led", label: "Iluminação LED", text: "Para curtir à noite", Icon: Lightbulb },
  { id: "cascata", label: "Cascata", text: "Charme e relaxamento", Icon: Droplets },
] as const;

type ExtraId = (typeof EXTRAS)[number]["id"];
const STEPS = ["Tipo", "Tamanho", "Extras", "Contato"];

export function PoolWizard({ settings, stores }: { settings: CalculatorSettings; stores: LeadStoreOption[] }) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>("vinil");
  const [sizeId, setSizeId] = useState<string>("media");
  const [custom, setCustom] = useState({ length: 8, width: 4, depth: 1.4 });
  const [extras, setExtras] = useState<ExtraId[]>(["aquecimentoSolar"]);
  const reduce = useReducedMotion();

  const dims = useMemo(() => {
    const preset = POOL_PRESETS.find((p) => p.id === sizeId);
    return preset ? { length: preset.length, width: preset.width, depth: preset.depth } : custom;
  }, [sizeId, custom]);
  const result = useMemo(() => calculatePool(dims, settings), [dims, settings]);

  const typeLabel = TYPES.find((t) => t.id === type)!.label;
  const extrasLabels = EXTRAS.filter((e) => extras.includes(e.id)).map((e) => e.label);

  const toggleExtra = (id: ExtraId) => setExtras((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <div className="overflow-hidden rounded-[2rem] border bg-white shadow-[0_30px_60px_-30px_rgb(10_61_98/0.35)]">
      {/* Progresso */}
      <ol className="grid grid-cols-4 border-b bg-sand/60" aria-label="Etapas">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined}>
            <button
              type="button"
              disabled={i > step}
              onClick={() => setStep(i)}
              className={cn(
                "flex w-full flex-col items-center gap-1 px-2 py-4 text-xs font-semibold transition sm:flex-row sm:justify-center sm:gap-2 sm:text-sm",
                i === step ? "text-ocean-900" : i < step ? "text-ocean-700 hover:bg-white/60" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full text-xs font-bold",
                  i < step ? "bg-ocean-900 text-white" : i === step ? "bg-sun text-ink" : "bg-white text-muted-foreground ring-1 ring-border",
                )}
              >
                {i < step ? <Check className="size-4" aria-hidden="true" /> : i + 1}
              </span>
              {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="grid lg:grid-cols-[1fr_20rem]">
        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <fieldset>
                  <legend className="font-heading text-2xl font-bold text-ocean-900">Qual tipo de piscina você imagina?</legend>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {TYPES.map((t) => (
                      <label
                        key={t.id}
                        className={cn(
                          "group cursor-pointer overflow-hidden rounded-3xl border-2 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                          type === t.id ? "border-sun-500 shadow-lg" : "border-border hover:border-sun-300",
                        )}
                      >
                        <input type="radio" name="pool-type" className="sr-only" checked={type === t.id} onChange={() => setType(t.id)} />
                        <div className="relative aspect-[4/3]">
                          <SmartImage src={t.image} alt={`Exemplo de piscina de ${t.label.toLowerCase()}`} fill sizes="(min-width:640px) 20vw, 100vw" />
                          {type === t.id && (
                            <span className="bg-sun absolute top-3 right-3 grid size-8 place-items-center rounded-full text-ink">
                              <Check className="size-5" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-bold text-ocean-900">{t.label}</p>
                          <p className="text-sm text-muted-foreground">{t.text}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <fieldset>
                  <legend className="font-heading text-2xl font-bold text-ocean-900">Qual o tamanho aproximado?</legend>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[...POOL_PRESETS, { id: "custom", label: "Personalizado", description: "Informe as medidas", length: 0, width: 0, depth: 0 }].map((p) => (
                      <label
                        key={p.id}
                        className={cn(
                          "cursor-pointer rounded-3xl border-2 p-5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                          sizeId === p.id ? "border-sun-500 bg-sun-100" : "border-border hover:border-sun-300",
                        )}
                      >
                        <input type="radio" name="pool-size" className="sr-only" checked={sizeId === p.id} onChange={() => setSizeId(p.id)} />
                        {p.id === "custom" ? <Ruler className="size-7 text-ocean-700" aria-hidden="true" /> : <Waves className="size-7 text-ocean-700" aria-hidden="true" />}
                        <p className="mt-3 font-bold text-ocean-900">{p.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {p.id === "custom" ? p.description : `${num(p.length, 1)} × ${num(p.width, 1)} m · ${num(p.depth, 1)} m prof.`}
                        </p>
                      </label>
                    ))}
                  </div>
                  {sizeId === "custom" && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {(
                        [
                          ["length", "Comprimento (m)"],
                          ["width", "Largura (m)"],
                          ["depth", "Profundidade média (m)"],
                        ] as const
                      ).map(([key, label]) => (
                        <div key={key}>
                          <Label htmlFor={`pool-${key}`} className="font-semibold">
                            {label}
                          </Label>
                          <Input
                            id={`pool-${key}`}
                            type="number"
                            inputMode="decimal"
                            min={0.5}
                            max={30}
                            step={0.1}
                            value={custom[key]}
                            onChange={(e) => setCustom((c) => ({ ...c, [key]: Math.max(0, Number(e.target.value)) }))}
                            className="mt-1.5 h-12 rounded-xl text-base"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </fieldset>
              )}

              {step === 2 && (
                <fieldset>
                  <legend className="font-heading text-2xl font-bold text-ocean-900">Quer turbinar a sua piscina?</legend>
                  <p className="mt-1 text-muted-foreground">Escolha quantos quiser.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {EXTRAS.map(({ id, label, text, Icon }) => (
                      <label
                        key={id}
                        className={cn(
                          "flex cursor-pointer items-center gap-4 rounded-3xl border-2 p-5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                          extras.includes(id) ? "border-sun-500 bg-sun-100" : "border-border hover:border-sun-300",
                        )}
                      >
                        <input type="checkbox" className="sr-only" checked={extras.includes(id)} onChange={() => toggleExtra(id)} />
                        <span className={cn("grid size-12 shrink-0 place-items-center rounded-2xl", extras.includes(id) ? "bg-sun text-ink" : "bg-ocean-100 text-ocean-900")}>
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block font-bold text-ocean-900">{label}</span>
                          <span className="block text-sm text-muted-foreground">{text}</span>
                        </span>
                        {extras.includes(id) && <Check className="ml-auto size-5 text-sun-600" aria-hidden="true" />}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <div>
                  <h3 className="font-heading text-2xl font-bold text-ocean-900">Quase lá! Para quem enviamos o projeto?</h3>
                  <p className="mt-1 mb-6 text-muted-foreground">A equipe da loja escolhida entra em contato para combinar a visita técnica.</p>
                  <LeadContactForm
                    interest="PISCINA"
                    stores={stores}
                    sourcePage="/piscinas#monte-sua-piscina"
                    submitLabel="Quero meu projeto de piscina"
                    payload={{
                      origem: "monte-sua-piscina",
                      tipo: type,
                      tamanho: sizeId,
                      comprimento: dims.length,
                      largura: dims.width,
                      profundidade: dims.depth,
                      volumeLitros: Math.round(result.volumeLiters),
                      coletoresSolares: result.collectors,
                      extras: extras.join(","),
                    }}
                    summary={{
                      "Tipo de piscina": typeLabel,
                      Medidas: `${num(dims.length, 1)} × ${num(dims.width, 1)} × ${num(dims.depth, 1)} m`,
                      Volume: `${num(result.volumeLiters)} litros`,
                      Extras: extrasLabels.join(", ") || undefined,
                      "Coletores solares estimados": extras.includes("aquecimentoSolar") ? result.collectors : undefined,
                    }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" size="lg" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft aria-hidden="true" /> Voltar
              </Button>
              <Button type="button" variant="ocean" size="xl" onClick={() => setStep((s) => s + 1)}>
                Continuar <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>

        {/* Resumo ao vivo */}
        <aside className="bg-ocean relative overflow-hidden p-6 text-white sm:p-8" aria-live="polite">
          <p className="eyebrow text-sun-300">Sua piscina</p>
          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-sm text-white/70">Tipo</dt>
              <dd className="font-heading text-xl font-bold">{typeLabel}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/70">Medidas</dt>
              <dd className="font-heading text-xl font-bold tabular-nums">
                {num(dims.length, 1)} × {num(dims.width, 1)} m
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/70">Volume aproximado</dt>
              <dd className="font-heading text-sun text-3xl font-extrabold tabular-nums">{num(result.volumeLiters)} L</dd>
            </div>
            <div>
              <dt className="text-sm text-white/70">Coletores solares para aquecer</dt>
              <dd className="font-heading text-xl font-bold tabular-nums">
                ~{result.collectors} placas{" "}
                <span className="text-sm font-normal text-white/70">({num(result.collectorAreaM2, 1)} m²)</span>
              </dd>
            </div>
            {extrasLabels.length > 0 && (
              <div>
                <dt className="text-sm text-white/70">Extras</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {extrasLabels.map((e) => (
                    <span key={e} className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                      {e}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          <p className="mt-6 text-xs text-white/60">{ESTIMATE_DISCLAIMER}</p>
        </aside>
      </div>
    </div>
  );
}
