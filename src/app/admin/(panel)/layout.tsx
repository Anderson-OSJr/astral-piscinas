import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const newLeads = await db.lead.count({ where: { status: "NOVO" } });
  return (
    <TooltipProvider delayDuration={200}>
    <SidebarProvider>
      <AdminSidebar newLeads={newLeads} userName={session.user.name?.split(" ")[0] ?? "admin"} />
      <SidebarInset className="bg-muted/40">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur md:hidden">
          <SidebarTrigger className="size-10" aria-label="Abrir menu do painel" />
          <span className="font-heading font-bold text-ocean-900">Painel Astral</span>
        </header>
        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  );
}
