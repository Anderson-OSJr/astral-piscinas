"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ConsentLabel, Field, Honeypot, inputClass } from "@/components/forms/fields";
import { getLeadContext, saveThanks } from "@/components/forms/lead-context";
import { createLead } from "@/server/actions/leads";
import { leadFormSchema, type LEAD_INTERESTS } from "@/lib/validations/lead";
import { maskPhone } from "@/lib/format";
import { leadSummaryMessage } from "@/lib/whatsapp";
import { INTEREST_LABELS } from "@/lib/site";

export type LeadStoreOption = { id: string; shortName: string; city: string; whatsapp: string };

const formSchema = leadFormSchema.extend({ website: z.string().optional() });
type FormValues = z.input<typeof formSchema>;

export function LeadContactForm({
  interest,
  payload,
  summary,
  stores,
  sourcePage,
  submitLabel = "Enviar pedido de orçamento",
  showMessage = true,
  messagePlaceholder = "Conte um pouco do que você precisa (opcional)",
  defaultMessage,
}: {
  interest: (typeof LEAD_INTERESTS)[number];
  payload?: Record<string, string | number | boolean>;
  /** Linhas legíveis que vão no resumo do WhatsApp */
  summary?: Record<string, string | number | boolean | undefined>;
  stores: LeadStoreOption[];
  sourcePage: string;
  submitLabel?: string;
  showMessage?: boolean;
  messagePlaceholder?: string;
  defaultMessage?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { interest, name: "", phone: "", email: "", city: "", storeId: stores[0]?.id ?? "", message: defaultMessage ?? "" },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const result = await createLead({ ...values, interest, payload, ...getLeadContext(sourcePage) });
      if (!result.ok) {
        for (const [field, msgs] of Object.entries(result.fieldErrors ?? {})) {
          if (msgs?.[0]) setError(field as keyof FormValues, { message: msgs[0] });
        }
        toast.error(result.error);
        return;
      }
      const store = stores.find((s) => s.id === values.storeId) ?? stores[0];
      saveThanks({
        name: values.name.split(" ")[0],
        storeName: store?.shortName,
        whatsapp: store?.whatsapp,
        message: leadSummaryMessage({
          name: values.name,
          interestLabel: INTEREST_LABELS[interest],
          details: { ...summary, Cidade: values.city || undefined },
          message: values.message || undefined,
        }),
      });
      router.push("/obrigado");
    } catch {
      toast.error("Não foi possível enviar agora. Tente de novo ou chame no WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-4 sm:grid-cols-2">
      <Honeypot register={register("website")} />
      <Field id="lead-name" label="Seu nome" error={errors.name?.message}>
        <Input id="lead-name" autoComplete="name" className={inputClass} aria-invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field id="lead-phone" label="WhatsApp / telefone" error={errors.phone?.message}>
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Input
              id="lead-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(16) 99999-9999"
              className={inputClass}
              aria-invalid={!!errors.phone}
              value={field.value}
              onChange={(e) => field.onChange(maskPhone(e.target.value))}
              onBlur={field.onBlur}
              ref={field.ref}
            />
          )}
        />
      </Field>
      <Field id="lead-email" label="E-mail" optional error={errors.email?.message}>
        <Input id="lead-email" type="email" autoComplete="email" className={inputClass} {...register("email")} />
      </Field>
      <Field id="lead-city" label="Cidade / bairro" optional>
        <Input id="lead-city" autoComplete="address-level2" placeholder="Ex.: Vila Xavier, Araraquara" className={inputClass} {...register("city")} />
      </Field>
      <Field id="lead-store" label="Loja de preferência" className="sm:col-span-2">
        <select
          id="lead-store"
          className="h-12 w-full rounded-xl border bg-white px-3 text-base focus-visible:ring-2 focus-visible:ring-ocean-500"
          {...register("storeId")}
        >
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.shortName} — {s.city}
            </option>
          ))}
        </select>
      </Field>
      {showMessage && (
        <Field id="lead-message" label="Mensagem" optional className="sm:col-span-2">
          <Textarea id="lead-message" rows={4} placeholder={messagePlaceholder} className="rounded-xl bg-white text-base" {...register("message")} />
        </Field>
      )}
      <div className="sm:col-span-2">
        <Controller
          control={control}
          name="consentLgpd"
          render={({ field }) => (
            <label htmlFor="lead-consent" className="flex items-start gap-3 text-sm text-muted-foreground">
              <Checkbox
                id="lead-consent"
                checked={field.value === true}
                onCheckedChange={(v) => field.onChange(v === true ? true : undefined)}
                aria-invalid={!!errors.consentLgpd}
                className="mt-0.5 size-5"
              />
              <span>
                <ConsentLabel />
              </span>
            </label>
          )}
        />
        {errors.consentLgpd && (
          <p role="alert" className="mt-1.5 text-sm font-medium text-destructive">
            {errors.consentLgpd.message}
          </p>
        )}
      </div>
      <Button type="submit" variant="sun" size="xl" disabled={submitting} className="sm:col-span-2">
        {submitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
        {submitting ? "Enviando…" : submitLabel}
      </Button>
    </form>
  );
}
