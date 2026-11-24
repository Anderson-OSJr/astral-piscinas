"use client";

import dynamic from "next/dynamic";

// Os avisos (toasts) só aparecem depois de uma ação do usuário: carregamos o código sob demanda,
// fora do caminho crítico da página.
const Toaster = dynamic(() => import("@/components/ui/sonner").then((m) => m.Toaster), { ssr: false });

export function LazyToaster() {
  return <Toaster position="top-center" richColors />;
}
