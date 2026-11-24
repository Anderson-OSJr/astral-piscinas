import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/site/logo";
import { Caustics } from "@/components/site/decor";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");
  return (
    <main className="bg-ocean relative flex min-h-dvh items-center justify-center p-4">
      <Caustics opacity={0.15} />
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <Logo />
        <h1 className="mt-8 text-2xl font-extrabold text-ocean-900">Painel da Astral</h1>
        <p className="mt-1 text-sm text-muted-foreground">Entre para ver os pedidos de orçamento e editar o site.</p>
        <LoginForm />
      </div>
    </main>
  );
}
