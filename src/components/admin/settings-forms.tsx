"use client";

import { useState, useTransition } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Panel } from "@/components/admin/ui";
import { ImageField } from "@/components/admin/image-fields";
import { saveSetting } from "@/server/actions/admin";
import type { CalculatorSettings, GoogleSettings, HeroSettings, InstagramGrid, SettingKey, SocialSettings } from "@/lib/settings-schema";

type Values = { hero: HeroSettings; calculators: CalculatorSettings; social: SocialSettings; google: GoogleSettings; instagramGrid: InstagramGrid };

type SimpleField = { name: string; label: string; hint?: string; type?: "text" | "textarea" | "number" | "image"; step?: string };

const HERO_FIELDS: SimpleField[] = [
  { name: "eyebrow", label: "Linha acima do título" },
  { name: "title", label: "Título principal", hint: "O trecho depois da vírgula ganha o degradê de sol." },
  { name: "subtitle", label: "Subtítulo", type: "textarea" },
  { name: "primaryCta", label: "Texto do botão principal" },
  { name: "secondaryCta", label: "Texto do botão do WhatsApp" },
  { name: "image", label: "Foto de fundo", type: "image" },
  { name: "imageAlt", label: "Descrição da foto (acessibilidade e Google)" },
];

const CALC_FIELDS: SimpleField[] = [
  { name: "kwhPrice", label: "Preço do kWh (R$)", type: "number", step: "0.01", hint: "Com impostos, conforme a conta da CPFL. [CONFIRMAR]" },
  { name: "showerPowerKw", label: "Potência média do chuveiro (kW)", type: "number", step: "0.1" },
  { name: "showerMinutes", label: "Minutos de banho por pessoa/dia", type: "number", step: "1" },
  { name: "solarFraction", label: "Fração coberta pelo solar (0 a 1)", type: "number", step: "0.05", hint: "0,75 = 75% da energia do banho vem do sol." },
  { name: "hotWaterLitersPerPerson", label: "Água quente por pessoa/dia (L)", type: "number" },
  { name: "waterDeltaT", label: "Aquecimento da água (°C)", type: "number" },
  { name: "gasPricePerKg", label: "Preço do gás GLP (R$/kg)", type: "number", step: "0.1", hint: "[CONFIRMAR]" },
  { name: "gasHeaterEfficiency", label: "Rendimento do aquecedor a gás (0 a 1)", type: "number", step: "0.05" },
  { name: "irradiation", label: "Irradiação solar média (kWh/m²/dia)", type: "number", step: "0.1" },
  { name: "performanceRatio", label: "Rendimento do sistema fotovoltaico (0 a 1)", type: "number", step: "0.01" },
  { name: "panelWatt", label: "Potência da placa fotovoltaica (W)", type: "number" },
  { name: "panelAreaM2", label: "Área da placa fotovoltaica (m²)", type: "number", step: "0.1" },
  { name: "systemCostPerKwp", label: "Custo estimado por kWp (R$)", type: "number", hint: "Usado no payback. [CONFIRMAR]" },
  { name: "minimumKwh", label: "Consumo mínimo da distribuidora (kWh)", type: "number" },
  { name: "poolCollectorRatio", label: "Coletor de piscina por m² de espelho d'água", type: "number", step: "0.05" },
  { name: "poolCollectorAreaM2", label: "Área do coletor de piscina (m²)", type: "number", step: "0.1" },
];

const SOCIAL_FIELDS: SimpleField[] = [
  { name: "instagram", label: "Link do Instagram" },
  { name: "instagramHandle", label: "@ do Instagram" },
  { name: "instagramFollowers", label: "Seguidores (texto)", hint: "Ex.: +4,7 mil" },
  { name: "instagramPosts", label: "Publicações (texto)", hint: "Ex.: +1.100" },
  { name: "facebook", label: "Link do Facebook" },
  { name: "googleReviewsUrl", label: "Link das avaliações no Google" },
];

const GOOGLE_FIELDS: SimpleField[] = [
  { name: "rating", label: "Nota no Google", type: "number", step: "0.1" },
  { name: "total", label: "Número de avaliações", type: "number" },
];

function useSave(key: SettingKey) {
  const [pending, start] = useTransition();
  const save = (value: unknown) =>
    start(async () => {
      const r = await saveSetting(key, value);
      if (r.ok) toast.success("Configuração salva — o site já foi atualizado.");
      else toast.error(r.error);
    });
  return { pending, save };
}

function SimpleForm<T extends Record<string, unknown>>({ settingKey, initial, fields }: { settingKey: SettingKey; initial: T; fields: SimpleField[] }) {
  const [values, setValues] = useState<Record<string, unknown>>(initial);
  const { pending, save } = useSave(settingKey);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save(values);
      }}
    >
      <Panel className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `${settingKey}-${f.name}`;
          const v = values[f.name];
          const set = (val: unknown) => setValues((cur) => ({ ...cur, [f.name]: val }));
          return (
            <div key={f.name} className={f.type === "textarea" || f.type === "image" ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
              <Label htmlFor={id} className="font-semibold">
                {f.label}
              </Label>
              {f.type === "textarea" ? (
                <Textarea id={id} value={String(v ?? "")} onChange={(e) => set(e.target.value)} rows={3} className="rounded-xl bg-background" />
              ) : f.type === "image" ? (
                <ImageField value={String(v ?? "")} onChange={set} folder="site" />
              ) : (
                <Input
                  id={id}
                  type={f.type === "number" ? "number" : "text"}
                  step={f.step}
                  inputMode={f.type === "number" ? "decimal" : undefined}
                  value={String(v ?? "")}
                  onChange={(e) => set(e.target.value)}
                  className="h-11 rounded-xl bg-background"
                />
              )}
              {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
            </div>
          );
        })}
        <div className="sm:col-span-2">
          <Button type="submit" variant="sun" size="lg" className="rounded-full px-6" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
            Salvar
          </Button>
        </div>
      </Panel>
    </form>
  );
}

function InstagramGridForm({ initial }: { initial: InstagramGrid }) {
  const [items, setItems] = useState(initial);
  const { pending, save } = useSave("instagramGrid");
  const update = (i: number, patch: Partial<InstagramGrid[number]>) => setItems((cur) => cur.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  return (
    <Panel className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Escolha até 6 fotos para a vitrine do Instagram na página inicial. Cada uma pode apontar para um post específico.
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((it, i) => (
          <li key={i} className="space-y-3 rounded-2xl border p-4">
            <ImageField value={it.image} onChange={(v) => update(i, { image: v })} folder="instagram" />
            <Input value={it.alt} onChange={(e) => update(i, { alt: e.target.value })} placeholder="Descrição da foto" aria-label="Descrição da foto" className="h-11 rounded-xl" />
            <Input value={it.href} onChange={(e) => update(i, { href: e.target.value })} placeholder="Link do post" aria-label="Link do post" className="h-11 rounded-xl" />
            <Button type="button" variant="ghost" size="lg" className="text-destructive" onClick={() => setItems((cur) => cur.filter((_, k) => k !== i))}>
              <Trash2 aria-hidden="true" /> Remover
            </Button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        {items.length < 6 && (
          <Button type="button" variant="outline" size="lg" onClick={() => setItems((cur) => [...cur, { image: "", alt: "", href: "https://www.instagram.com/maisastral/" }])}>
            <Plus aria-hidden="true" /> Adicionar foto
          </Button>
        )}
        <Button type="button" variant="sun" size="lg" className="rounded-full px-6" disabled={pending} onClick={() => save(items.filter((it) => it.image))}>
          {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
          Salvar vitrine
        </Button>
      </div>
    </Panel>
  );
}

export function SettingsForms({ values }: { values: Values }) {
  return (
    <Tabs defaultValue="hero">
      <TabsList className="mb-4 h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
        {[
          ["hero", "Página inicial"],
          ["calculators", "Calculadoras"],
          ["social", "Redes sociais"],
          ["google", "Google"],
          ["instagram", "Vitrine do Instagram"],
        ].map(([v, l]) => (
          <TabsTrigger key={v} value={v} className="rounded-full border bg-background px-4 py-2 data-[state=active]:border-ocean-900 data-[state=active]:bg-ocean-900 data-[state=active]:text-white">
            {l}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="hero">
        <SimpleForm settingKey="hero" initial={values.hero} fields={HERO_FIELDS} />
      </TabsContent>
      <TabsContent value="calculators">
        <SimpleForm settingKey="calculators" initial={values.calculators} fields={CALC_FIELDS} />
      </TabsContent>
      <TabsContent value="social">
        <SimpleForm settingKey="social" initial={values.social} fields={SOCIAL_FIELDS} />
      </TabsContent>
      <TabsContent value="google">
        <SimpleForm settingKey="google" initial={values.google} fields={GOOGLE_FIELDS} />
      </TabsContent>
      <TabsContent value="instagram">
        <InstagramGridForm initial={values.instagramGrid} />
      </TabsContent>
    </Tabs>
  );
}
