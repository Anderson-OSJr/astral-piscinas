import type { ReactNode } from "react";
import { STATUS_LABELS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-ocean-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border bg-background p-5 shadow-sm", className)}>{children}</div>;
}

const STATUS_STYLES: Record<keyof typeof STATUS_LABELS, string> = {
  NOVO: "bg-sun-100 text-sun-600 ring-sun-300",
  EM_ATENDIMENTO: "bg-ocean-100 text-ocean-700 ring-ocean-500/30",
  FECHADO: "bg-[#e6f6ec] text-[#11743e] ring-[#11743e]/30",
  PERDIDO: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({ status }: { status: keyof typeof STATUS_LABELS }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
