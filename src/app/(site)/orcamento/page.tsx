import type { Metadata } from "next";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { Breadcrumbs } from "@/components/site/page-blocks";
import { QuoteWizard, type QuotePrefill } from "@/components/forms/quote-wizard";
import { getLeadStoreOptions } from "@/server/queries/stores";
import { LEAD_INTERESTS } from "@/lib/validations/lead";
import { pageMetadata } from "@/lib/seo";
import { brl } from "@/lib/format";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Orçamento sem Compromisso",
    description: "Peça um orçamento de aquecimento solar, energia fotovoltaica, piscina ou serviço. A loja Astral mais perto responde rapidinho.",
    path: "/orcamento",
  }),
  robots: { index: true, follow: true },
};

const text = z.string().trim().max(120).optional().catch(undefined);
const numeric = z.coerce.number().nonnegative().max(1_000_000).optional().catch(undefined);

const searchSchema = z.object({
  interesse: z.enum(LEAD_INTERESTS).optional().catch(undefined),
  origem: text,
  moradores: numeric,
  chuveiro: z.enum(["eletrico", "gas"]).optional().catch(undefined),
  economiaMensal: numeric,
  conta: numeric,
  placas: numeric,
  kwp: numeric,
  produto: text,
  tipo: text,
});

function buildPrefill(sp: z.infer<typeof searchSchema>): QuotePrefill {
  const details: Record<string, string> = {};
  if (sp.moradores) details["Moradores"] = String(sp.moradores);
  if (sp.chuveiro) details["Aquece hoje com"] = sp.chuveiro === "gas" ? "Aquecedor a gás" : "Chuveiro elétrico";
  if (sp.economiaMensal) details["Economia estimada"] = `${brl(sp.economiaMensal)}/mês`;
  if (sp.conta) details["Conta de luz"] = brl(sp.conta);
  if (sp.placas) details["Placas estimadas"] = String(sp.placas);
  if (sp.kwp) details["Potência estimada"] = `${sp.kwp} kWp`;
  if (sp.produto) details["Produto"] = sp.produto;
  if (sp.tipo) details["Tipo de piscina"] = sp.tipo;
  if (sp.origem) details["Origem"] = sp.origem;
  return {
    interest: sp.interesse,
    details,
    message: sp.produto ? `Tenho interesse em: ${sp.produto}` : undefined,
  };
}

export default async function QuotePage({ searchParams }: PageProps<"/orcamento">) {
  const [sp, stores] = await Promise.all([searchParams, getLeadStoreOptions()]);
  const prefill = buildPrefill(searchSchema.parse(sp));

  return (
    <section className="bg-sand">
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[0.75fr_1.25fr] lg:py-16">
        <div>
          <Breadcrumbs tone="light" items={[{ name: "Orçamento", path: "/orcamento" }]} />
          <h1 className="mt-8 text-4xl leading-[1.05] font-extrabold text-ocean-900 sm:text-5xl">
            Seu orçamento, <span className="text-sun-600">sem compromisso.</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">Leva menos de 1 minuto. A loja mais perto de você responde pelo WhatsApp.</p>
          <ul className="mt-8 space-y-4">
            {[
              { Icon: Clock, text: "Resposta rápida em horário comercial" },
              { Icon: MessageCircle, text: "Continue a conversa direto no WhatsApp da loja" },
              { Icon: ShieldCheck, text: "Seus dados protegidos, conforme a LGPD" },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 font-medium">
                <span className="grid size-10 place-items-center rounded-2xl bg-white text-sun-600 shadow-sm">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <QuoteWizard stores={stores} prefill={prefill} />
      </div>
    </section>
  );
}
