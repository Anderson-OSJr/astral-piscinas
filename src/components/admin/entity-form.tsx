"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldValues, type Resolver } from "react-hook-form";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/admin/ui";
import { ImageField, ImagesField } from "@/components/admin/image-fields";
import { HoursField, SpecsField } from "@/components/admin/list-fields";
import { ENTITIES, type FieldDef } from "@/lib/admin/entities";
import { ADMIN_SCHEMAS, type EntityKey } from "@/lib/validations/admin";
import { ICON_NAMES, DynamicIcon } from "@/components/site/icon";
import { saveEntity } from "@/server/actions/admin";
import { slugify } from "@/lib/format";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

/** Resolver que valida com o mesmo schema Zod do servidor e devolve erros por campo. */
function zodFieldResolver(entity: EntityKey): Resolver<FieldValues> {
  return async (values) => {
    const parsed = ADMIN_SCHEMAS[entity].safeParse(values);
    if (parsed.success) return { values, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "root");
      errors[key] ??= { type: issue.code, message: issue.message };
    }
    return { values: {}, errors };
  };
}

export function EntityForm({
  entity,
  id,
  initialValues,
  categories,
}: {
  entity: EntityKey;
  id: string | null;
  initialValues: Record<string, unknown>;
  categories: Option[];
}) {
  const config = ENTITIES[entity];
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isDirty },
  } = useForm<FieldValues>({ defaultValues: initialValues, resolver: zodFieldResolver(entity) });

  const onSubmit = (values: FieldValues) =>
    startTransition(async () => {
      const r = await saveEntity(entity, id, values);
      if (!r.ok) {
        for (const [field, msgs] of Object.entries(r.fieldErrors ?? {})) if (msgs?.[0]) setError(field, { message: msgs[0] });
        toast.error(r.error);
        return;
      }
      toast.success("Salvo! O site já foi atualizado.");
      if (!id && r.id) router.replace(`/admin/${entity}/${r.id}`);
      router.refresh();
    });

  const slugField = config.fields.find((f): f is Extract<FieldDef, { type: "slug" }> => f.type === "slug");

  const errorOf = (name: string) => {
    const e = errors[name];
    return e && typeof e.message === "string" ? e.message : undefined;
  };

  function renderField(f: FieldDef) {
    const err = errorOf(f.name);
    const inputId = `f-${f.name}`;
    const common = { id: inputId, "aria-invalid": !!err, className: "h-11 rounded-xl bg-background" };

    switch (f.type) {
      case "text":
      case "url":
      case "email":
      case "number":
      case "datetime":
        return (
          <Input
            {...common}
            type={f.type === "datetime" ? "datetime-local" : f.type === "url" ? "text" : f.type}
            step={f.type === "number" ? (f.step ?? "1") : undefined}
            inputMode={f.type === "number" ? "decimal" : undefined}
            placeholder={f.placeholder}
            {...register(f.name, {
              onChange:
                slugField && slugField.from === f.name && !slugTouched
                  ? (e: React.ChangeEvent<HTMLInputElement>) => setValue(slugField.name, slugify(e.target.value), { shouldDirty: true })
                  : undefined,
            })}
          />
        );
      case "slug":
        return (
          <Input
            {...common}
            {...register(f.name, { onChange: () => setSlugTouched(true) })}
            className={cn(common.className, "font-mono text-sm")}
          />
        );
      case "textarea":
        return <Textarea id={inputId} aria-invalid={!!err} rows={4} className="rounded-xl bg-background" {...register(f.name)} />;
      case "markdown":
        return <Textarea id={inputId} aria-invalid={!!err} rows={16} className="rounded-xl bg-background font-mono text-sm leading-relaxed" {...register(f.name)} />;
      case "boolean":
        return (
          <Controller
            control={control}
            name={f.name}
            render={({ field }) => <Switch id={inputId} checked={Boolean(field.value)} onCheckedChange={field.onChange} />}
          />
        );
      case "select": {
        const options = f.options === "categories" ? categories : f.options;
        return (
          <select id={inputId} aria-invalid={!!err} className="h-11 w-full rounded-xl border bg-background px-3" {...register(f.name)}>
            <option value="">Selecione…</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      }
      case "icon":
        return (
          <Controller
            control={control}
            name={f.name}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={`${inputId}-label`}>
                {ICON_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    role="radio"
                    aria-checked={field.value === name}
                    aria-label={name}
                    onClick={() => field.onChange(name)}
                    className={cn(
                      "grid size-11 place-items-center rounded-xl border transition",
                      field.value === name ? "border-ocean-900 bg-ocean-900 text-sun-300" : "bg-background hover:bg-muted",
                    )}
                  >
                    <DynamicIcon icon={name} className="size-5" />
                  </button>
                ))}
              </div>
            )}
          />
        );
      case "image":
        return (
          <Controller
            control={control}
            name={f.name}
            render={({ field }) => <ImageField value={(field.value as string) ?? ""} onChange={field.onChange} folder={f.folder} />}
          />
        );
      case "images":
        return (
          <Controller
            control={control}
            name={f.name}
            render={({ field }) => <ImagesField value={(field.value as string[]) ?? []} onChange={field.onChange} folder={f.folder} />}
          />
        );
      case "specs":
        return (
          <Controller
            control={control}
            name={f.name}
            render={({ field }) => <SpecsField value={(field.value as { label: string; value: string }[]) ?? []} onChange={field.onChange} />}
          />
        );
      case "hours":
        return (
          <Controller
            control={control}
            name={f.name}
            render={({ field }) => <HoursField value={(field.value as never[]) ?? []} onChange={field.onChange} />}
          />
        );
    }
  }

  const wide = (f: FieldDef) =>
    ["textarea", "markdown", "images", "specs", "hours", "icon", "image"].includes(f.type) || ("full" in f && f.full);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 pb-24">
      <Panel className="grid gap-5 sm:grid-cols-2">
        {config.fields.map((f) => (
          <div key={f.name} className={cn("space-y-1.5", wide(f) && "sm:col-span-2", f.type === "boolean" && "flex items-center justify-between gap-4 space-y-0 rounded-xl border p-3")}>
            <div>
              <Label id={`f-${f.name}-label`} htmlFor={`f-${f.name}`} className="font-semibold">
                {f.label}
              </Label>
              {f.hint && f.type === "boolean" && <p className="text-xs text-muted-foreground">{f.hint}</p>}
            </div>
            {renderField(f)}
            {f.hint && f.type !== "boolean" && <p className="text-xs text-muted-foreground">{f.hint}</p>}
            {errorOf(f.name) && (
              <p role="alert" className="text-sm font-medium text-destructive">
                {errorOf(f.name)}
              </p>
            )}
          </div>
        ))}
      </Panel>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur md:left-[var(--sidebar-width)]">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-3 px-1 sm:px-4">
          {isDirty && <span className="hidden text-sm text-muted-foreground sm:inline">Alterações não salvas</span>}
          <Button type="button" variant="ghost" size="lg" onClick={() => router.push(`/admin/${entity}`)}>
            Voltar
          </Button>
          <Button type="submit" variant="sun" size="lg" className="rounded-full px-6" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Save aria-hidden="true" />}
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}
