import Link from "next/link";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";

export default function NotFound() {
  return (
    <main className="bg-ocean flex min-h-dvh flex-col items-center justify-center px-4 text-center text-white">
      <Link href="/">
        <Logo inverted />
      </Link>
      <Sun className="mt-12 size-16 animate-float text-sun-300" aria-hidden="true" />
      <h1 className="mt-6 text-4xl font-extrabold sm:text-5xl">Essa página tomou sol demais e sumiu.</h1>
      <p className="mt-4 max-w-md text-lg text-white/80">O endereço pode ter mudado. Que tal voltar para o início ou falar com a gente?</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="sun" size="xl">
          <Link href="/">Ir para o início</Link>
        </Button>
        <Button asChild variant="glass" size="xl">
          <Link href="/lojas">Ver lojas e contatos</Link>
        </Button>
      </div>
    </main>
  );
}
