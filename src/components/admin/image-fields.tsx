"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Link2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmartImage } from "@/components/site/smart-image";
import { uploadImage } from "@/server/actions/admin";

function useUpload(folder: string) {
  const [busy, setBusy] = useState(false);
  async function upload(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", folder);
      const r = await uploadImage(fd);
      if (!r.ok || !r.url) {
        toast.error(r.ok ? "Falha no upload." : r.error);
        return null;
      }
      return r.url;
    } finally {
      setBusy(false);
    }
  }
  return { busy, upload };
}

function UrlAdder({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState("");
  const add = () => {
    const v = url.trim();
    if (!v) return;
    if (!/^https:\/\/|^\//.test(v)) {
      toast.error("Cole um link começando com https://");
      return;
    }
    onAdd(v);
    setUrl("");
  };
  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Link2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="…ou cole o link de uma imagem"
          aria-label="Link da imagem"
          className="h-11 rounded-xl bg-background pl-9"
        />
      </div>
      <Button type="button" variant="outline" size="lg" className="h-11" onClick={add}>
        Usar link
      </Button>
    </div>
  );
}

export function ImageField({ value, onChange, folder }: { value: string; onChange: (v: string) => void; folder: string }) {
  const input = useRef<HTMLInputElement>(null);
  const { busy, upload } = useUpload(folder);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border bg-muted">
          {value ? <SmartImage src={value} alt="Pré-visualização" fill sizes="7rem" /> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="ocean" size="lg" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <ImagePlus aria-hidden="true" />}
            {value ? "Trocar foto" : "Enviar foto"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="lg" onClick={() => onChange("")}>
              <X aria-hidden="true" /> Remover
            </Button>
          )}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) {
            const url = await upload(file);
            if (url) onChange(url);
          }
        }}
      />
      <UrlAdder onAdd={onChange} />
    </div>
  );
}

export function ImagesField({ value, onChange, folder }: { value: string[]; onChange: (v: string[]) => void; folder: string }) {
  const input = useRef<HTMLInputElement>(null);
  const { busy, upload } = useUpload(folder);
  const move = (i: number, dir: -1 | 1) => {
    const next = [...value];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((src, i) => (
          <li key={`${src}-${i}`} className="group relative aspect-square overflow-hidden rounded-2xl border bg-muted">
            <SmartImage src={src} alt={`Foto ${i + 1}`} fill sizes="12rem" />
            {i === 0 && <span className="bg-sun absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-bold text-ink">Principal</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent p-2">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid size-8 place-items-center rounded-lg bg-white/90 disabled:opacity-40" aria-label="Mover para a esquerda">
                  <ArrowLeft className="size-4" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="grid size-8 place-items-center rounded-lg bg-white/90 disabled:opacity-40" aria-label="Mover para a direita">
                  <ArrowRight className="size-4" />
                </button>
              </div>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="grid size-8 place-items-center rounded-lg bg-white/90 text-destructive" aria-label="Remover foto">
                <X className="size-4" />
              </button>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-sm font-semibold text-muted-foreground hover:border-ocean-500 hover:text-ocean-700"
          >
            {busy ? <Loader2 className="size-6 animate-spin" aria-hidden="true" /> : <ImagePlus className="size-6" aria-hidden="true" />}
            Adicionar fotos
          </button>
        </li>
      </ul>
      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        tabIndex={-1}
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          const urls: string[] = [];
          for (const file of files) {
            const url = await upload(file);
            if (url) urls.push(url);
          }
          if (urls.length) onChange([...value, ...urls]);
        }}
      />
      <UrlAdder onAdd={(url) => onChange([...value, url])} />
    </div>
  );
}
