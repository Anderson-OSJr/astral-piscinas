import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/site/section";
import { SolarBathCalculator } from "@/components/calculators/solar-bath-calculator";
import { SunRays } from "@/components/site/decor";
import type { CalculatorSettings } from "@/lib/settings-schema";

export function SolarHighlight({ settings }: { settings: CalculatorSettings }) {
  return (
    <section className="relative overflow-hidden bg-sand py-20 sm:py-28" aria-labelledby="solar-title">
      <SunRays className="absolute -top-24 -left-24 size-80 opacity-40" />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Aquecimento solar"
            title={
              <span id="solar-title">
                O sol de Araraquara é de graça. <span className="text-sun-600">A conta de luz não precisa ser.</span>
              </span>
            }
            description="O chuveiro elétrico é um dos maiores vilões da conta. Com aquecimento solar, a Morada do Sol esquenta a sua água — e você vê a diferença já na primeira fatura."
          />
          <ul className="mt-8 space-y-3">
            {["Dimensionado para o número de moradores", "Apoio elétrico ou a gás para dias nublados", "Instalação feita pela equipe própria da Astral"].map((t) => (
              <li key={t} className="flex items-center gap-3 font-medium">
                <span className="grid size-6 place-items-center rounded-full bg-ocean-900 text-sun-300">
                  <Check className="size-4" aria-hidden="true" />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link href="/aquecimento-solar#calculadora" className="mt-8 inline-flex items-center gap-2 font-bold text-ocean-700 hover:text-ocean-900">
            Ver a calculadora completa <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <SolarBathCalculator settings={settings} compact />
      </div>
    </section>
  );
}
