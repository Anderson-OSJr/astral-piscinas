"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Armchair, Check, FlaskConical, Hammer, HelpCircle, ShowerHead, Sun, Waves, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadContactForm, type LeadStoreOption } from "@/components/forms/lead-contact-form";
import type { LEAD_INTERESTS } from "@/lib/validations/lead";
import { INTEREST_LABELS } from "@/lib/site";
import { cn } from "@/lib/utils";

type Interest = (typeof LEAD_INTERESTS)[number];

const OPTIONS: { id: Interest; Icon: typeof Sun; hint: string }[] = [
  { id: "AQUECIMENTO_SOLAR", Icon: Sun, hint: "Banho ou piscina" },
  { id: "FOTOVOLTAICA", Icon: Zap, hint: "Baixar a conta de luz" },
  { id: "PISCINA", Icon: Waves, hint: "Construir ou reformar" },
  { id: "TRATAMENTO", Icon: FlaskConical, hint: "Químicos, bombas, filtros" },
  { id: "LAZER", Icon: Armchair, hint: "Sauna, spa, móveis" },
  { id: "BANHO_CONFORTO", Icon: ShowerHead, hint: "Gás, filtro, pressurizador" },
  { id: "SERVICO", Icon: Hammer, hint: "Instalação ou conserto" },
  { id: "OUTRO", Icon: HelpCircle, hint: "Outro assunto" },
];

const DETAIL_QUESTIONS: Partial<Record<Interest, { key: string; label: string; options: string[] }[]>> = {
  AQUECIMENTO_SOLAR: [
    { key: "Uso", label: "Para que você quer o aquecimento?", options: ["Banho", "Piscina", "Banho e piscina"] },
    { key: "Moradores", label: "Quantas pessoas moram na casa?", options: ["1–2", "3–4", "5–6", "7 ou mais"] },
  ],
  FOTOVOLTAICA: [
    { key: "Imóvel", label: "Tipo de imóvel", options: ["Casa", "Comércio", "Sítio / rural", "Indústria"] },
    { key: "Conta de luz", label: "Valor médio da conta", options: ["Até R$ 300", "R$ 300–600", "R$ 600–1.000", "Acima de R$ 1.000"] },
  ],
  PISCINA: [
    { key: "Tipo", label: "Qual tipo de piscina?", options: ["Vinil", "Fibra", "Azulejo", "Ainda não sei"] },
    { key: "Momento", label: "Em que momento você está?", options: ["Só pesquisando", "Quero começar logo", "Reforma / troca de vinil"] },
  ],
  SERVICO: [{ key: "Serviço", label: "Que tipo de serviço?", options: ["Instalação", "Conserto", "Manutenção", "Limpeza de placas"] }],
};

export type QuotePrefill = {
  interest?: Interest;
  details: Record<string, string>;
  message?: string;
};

export function QuoteWizard({ stores, prefill }: { stores: LeadStoreOption[]; prefill: QuotePrefill }) {
  const [step, setStep] = useState(prefill.interest ? 1 : 0);
  const [interest, setInterest] = useState<Interest>(prefill.interest ?? "AQUECIMENTO_SOLAR");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const reduce = useReducedMotion();
  const questions = DETAIL_QUESTIONS[interest] ?? [];
  const steps = ["Assunto", "Detalhes", "Contato"];

  const summary = { ...prefill.details, ...answers };

  return (
    <div className="overflow-hidden rounded-[2rem] border bg-white shadow-[0_30px_60px_-30px_rgb(10_61_98/0.35)]">
      <ol className="grid grid-cols-3 border-b bg-sand/60" aria-label="Etapas do orçamento">
        {steps.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className="flex items-center justify-center gap-2 px-2 py-4 text-sm font-semibold">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full text-xs font-bold",
                i < step ? "bg-ocean-900 text-white" : i === step ? "bg-sun text-ink" : "bg-white text-muted-foreground ring-1 ring-border",
              )}
            >
              {i < step ? <Check className="size-4" aria-hidden="true" /> : i + 1}
            </span>
            <span className={i === step ? "text-ocean-900" : "text-muted-foreground"}>{label}</span>
          </li>
        ))}
      </ol>
      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {step === 0 && (
              <fieldset>
                <legend className="font-heading text-2xl font-bold text-ocean-900">Sobre o que é o seu orçamento?</legend>
                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {OPTIONS.map(({ id, Icon, hint }) => (
                    <label
                      key={id}
                      className={cn(
                        "flex cursor-pointer flex-col gap-2 rounded-3xl border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                        interest === id ? "border-sun-500 bg-sun-100" : "border-border hover:border-sun-300",
                      )}
                    >
                      <input
                        type="radio"
                        name="quote-interest"
                        className="sr-only"
                        checked={interest === id}
                        onChange={() => {
                          setInterest(id);
                          setAnswers({});
                        }}
                      />
                      <Icon className="size-7 text-sun-600" aria-hidden="true" />
                      <span className="font-bold text-ocean-900">{INTEREST_LABELS[id]}</span>
                      <span className="text-xs text-muted-foreground">{hint}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-ocean-900">{INTEREST_LABELS[interest]}: conte um pouco mais</h2>
                {Object.keys(prefill.details).length > 0 && (
                  <div className="mt-4 rounded-2xl bg-sand p-4 text-sm">
                    <p className="font-bold text-ink">Dados que você já informou:</p>
                    <ul className="mt-1 grid gap-0.5 text-muted-foreground sm:grid-cols-2">
                      {Object.entries(prefill.details).map(([k, v]) => (
                        <li key={k}>
                          {k}: <strong className="text-ink">{v}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {questions.length ? (
                  <div className="mt-6 space-y-6">
                    {questions.map((q) => (
                      <fieldset key={q.key}>
                        <legend className="mb-3 font-semibold text-ink">{q.label}</legend>
                        <div className="flex flex-wrap gap-2">
                          {q.options.map((o) => (
                            <label
                              key={o}
                              className={cn(
                                "cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                                answers[q.key] === o ? "border-ocean-900 bg-ocean-900 text-white" : "border-border hover:border-ocean-500",
                              )}
                            >
                              <input
                                type="radio"
                                name={`q-${q.key}`}
                                className="sr-only"
                                checked={answers[q.key] === o}
                                onChange={() => setAnswers((a) => ({ ...a, [q.key]: o }))}
                              />
                              {o}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-muted-foreground">Perfeito! No próximo passo você pode escrever os detalhes na mensagem.</p>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-ocean-900">Para quem enviamos o orçamento?</h2>
                <p className="mt-1 mb-6 text-muted-foreground">Sem compromisso. A loja escolhida responde pelo WhatsApp ou telefone.</p>
                <LeadContactForm
                  interest={interest}
                  stores={stores}
                  sourcePage="/orcamento"
                  payload={summary}
                  summary={summary}
                  defaultMessage={prefill.message}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < 2 && (
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
    </div>
  );
}
