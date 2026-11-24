"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> (opcional)</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClass = "h-12 rounded-xl bg-white text-base";

/** Campo invisível que só robôs preenchem. */
export function Honeypot({ register }: { register: object }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Não preencha este campo
        <input type="text" tabIndex={-1} autoComplete="off" {...register} />
      </label>
    </div>
  );
}

export function ConsentLabel() {
  return (
    <>
      Autorizo a Astral a entrar em contato pelo telefone/WhatsApp informado e concordo com a{" "}
      <Link href="/politica-de-privacidade" target="_blank" className="font-semibold text-ocean-700 underline underline-offset-2">
        política de privacidade
      </Link>
      .
    </>
  );
}
