"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, FlaskConical, MapPin, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openWhatsappPanel } from "@/components/site/whatsapp-widget";
import { WhatsappIcon } from "@/components/site/whatsapp-icon";
import { cn } from "@/lib/utils";

type Answer = string;
type Question = { id: "cor" | "cheiro" | "aspecto"; title: string; options: { id: string; label: string; swatch?: string }[] };

const QUESTIONS: Question[] = [
  {
    id: "cor",
    title: "Qual a cor da água?",
    options: [
      { id: "verde", label: "Verde", swatch: "#3f8f4f" },
      { id: "turva", label: "Turva / leitosa", swatch: "#c9d6d8" },
      { id: "marrom", label: "Marrom / amarelada", swatch: "#a67c3d" },
      { id: "cristalina", label: "Cristalina", swatch: "#4fc3f7" },
    ],
  },
  {
    id: "cheiro",
    title: "Como está o cheiro?",
    options: [
      { id: "forte", label: "Cheiro forte de cloro" },
      { id: "ruim", label: "Cheiro ruim / de mofo" },
      { id: "nenhum", label: "Sem cheiro" },
    ],
  },
  {
    id: "aspecto",
    title: "O que mais você percebe?",
    options: [
      { id: "escorregadio", label: "Paredes escorregadias" },
      { id: "manchas", label: "Manchas no revestimento" },
      { id: "espuma", label: "Espuma na superfície" },
      { id: "irritacao", label: "Olhos e pele irritados" },
      { id: "normal", label: "Nada de diferente" },
    ],
  },
];

type Diagnosis = { title: string; text: string; categories: { label: string; href: string }[]; tone: "alert" | "warn" | "ok" };

/** Regras simples e conservadoras — sem dosagens; sempre orienta a falar com a equipe. */
function diagnose(a: Record<string, Answer>): Diagnosis {
  if (a.cor === "verde" || a.aspecto === "escorregadio" || a.cheiro === "ruim") {
    return {
      tone: "alert",
      title: "Provável presença de algas",
      text: "Costuma acontecer com cloro baixo, pH fora do ideal ou filtragem insuficiente — ainda mais com o calor de Araraquara. O caminho geralmente envolve escovação, ajuste do pH e um tratamento de choque, na dose certa para o volume da sua piscina.",
      categories: [
        { label: "Algicidas e cloro", href: "/produtos?categoria=produtos-quimicos" },
        { label: "Escovas e aspiradores", href: "/produtos?categoria=acessorios-para-piscinas" },
      ],
    };
  }
  if (a.cor === "marrom" || a.aspecto === "manchas") {
    return {
      tone: "warn",
      title: "Pode haver metais na água",
      text: "Água amarronzada ou manchas costumam indicar ferro, cobre ou manganês (de poço ou de equipamentos). É importante testar antes de clorar para não piorar as manchas.",
      categories: [
        { label: "Produtos químicos", href: "/produtos?categoria=produtos-quimicos" },
        { label: "Filtros e bombas", href: "/produtos?categoria=bombas-filtros-pressurizadores" },
      ],
    };
  }
  if (a.cor === "turva" || a.aspecto === "espuma") {
    return {
      tone: "warn",
      title: "Água turva: filtragem e equilíbrio",
      text: "Partículas em suspensão, filtro saturado ou pH/alcalinidade desajustados deixam a água leitosa. Revisar a filtragem e usar clarificante costuma resolver.",
      categories: [
        { label: "Clarificantes e reguladores", href: "/produtos?categoria=produtos-quimicos" },
        { label: "Filtros e bombas", href: "/produtos?categoria=bombas-filtros-pressurizadores" },
      ],
    };
  }
  if (a.cheiro === "forte" || a.aspecto === "irritacao") {
    return {
      tone: "warn",
      title: "Cloro “cansado” (cloraminas)",
      text: "Cheiro forte e irritação muitas vezes significam cloro combinado, e não cloro demais. Geralmente pede ajuste de pH e oxidação — a equipe indica o produto certo.",
      categories: [
        { label: "Reguladores de pH", href: "/produtos?categoria=produtos-quimicos" },
        { label: "Automação / gerador de cloro", href: "/produtos?categoria=automacao-de-piscinas" },
      ],
    };
  }
  return {
    tone: "ok",
    title: "Sua piscina parece saudável!",
    text: "Mantenha a filtragem diária e teste a água toda semana. Uma capa térmica ajuda a economizar produtos e manter o calor.",
    categories: [
      { label: "Kit manutenção", href: "/produtos?categoria=acessorios-para-piscinas" },
      { label: "Automação", href: "/produtos?categoria=automacao-de-piscinas" },
    ],
  };
}

export function PoolDiagnosis() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const done = QUESTIONS.every((q) => answers[q.id]);
  const result = useMemo(() => (done ? diagnose(answers) : null), [answers, done]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6 rounded-[2rem] border bg-white p-6 sm:p-8">
        {QUESTIONS.map((q, qi) => (
          <fieldset key={q.id} disabled={qi > 0 && !answers[QUESTIONS[qi - 1].id]} className="transition disabled:opacity-40">
            <legend className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-ocean-900">
              <span className="grid size-7 place-items-center rounded-full bg-ocean-900 text-sm text-white">{qi + 1}</span>
              {q.title}
            </legend>
            <div className="flex flex-wrap gap-2">
              {q.options.map((o) => (
                <label
                  key={o.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ocean-500",
                    answers[q.id] === o.id ? "border-ocean-900 bg-ocean-900 text-white" : "border-border hover:border-ocean-500",
                  )}
                >
                  <input
                    type="radio"
                    name={`diag-${q.id}`}
                    className="sr-only"
                    checked={answers[q.id] === o.id}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                  />
                  {o.swatch && <span className="size-4 rounded-full ring-2 ring-white" style={{ background: o.swatch }} aria-hidden="true" />}
                  {o.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div aria-live="polite" className="lg:sticky lg:top-28 lg:self-start">
        {result ? (
          <div className="overflow-hidden rounded-[2rem] border bg-white">
            <div
              className={cn(
                "p-6 sm:p-8",
                result.tone === "alert" ? "bg-[#e9f6ec]" : result.tone === "warn" ? "bg-sun-100" : "bg-aqua-100",
              )}
            >
              <p className="eyebrow text-ocean-700">Primeira orientação</p>
              <h3 className="mt-2 font-heading text-2xl font-extrabold text-ocean-900">{result.title}</h3>
              <p className="mt-3 text-ink/85">{result.text}</p>
            </div>
            <div className="space-y-5 p-6 sm:p-8">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-ink">
                  <FlaskConical className="size-4 text-sun-600" aria-hidden="true" /> Categorias que podem ajudar
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {result.categories.map((c) => (
                    <li key={c.label}>
                      <Link href={c.href} className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1.5 text-sm font-semibold text-ocean-900 hover:bg-sun-100">
                        {c.label} <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="flex gap-2 rounded-2xl bg-muted p-4 text-sm text-ink/80">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-sun-600" aria-hidden="true" />
                Não indicamos dosagens pela internet: a quantidade certa depende do volume e do estado da água. Nunca misture produtos
                químicos entre si.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button asChild variant="ocean" size="xl">
                  <Link href="/lojas">
                    <MapPin aria-hidden="true" /> Leve uma amostra
                  </Link>
                </Button>
                <Button type="button" variant="whatsapp" size="xl" onClick={() => openWhatsappPanel()}>
                  <WhatsappIcon /> Falar com a loja
                </Button>
              </div>
              <button type="button" onClick={() => setAnswers({})} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-ink">
                <RotateCcw className="size-4" aria-hidden="true" /> Refazer diagnóstico
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-ocean flex min-h-72 flex-col justify-center rounded-[2rem] p-8 text-white">
            <p className="font-heading text-2xl font-bold">Responda as 3 perguntas</p>
            <p className="mt-2 text-white/80">Em segundos você recebe uma primeira orientação e sabe que tipo de produto procurar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
