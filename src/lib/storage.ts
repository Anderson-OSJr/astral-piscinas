import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

/**
 * Abstração de armazenamento de arquivos. Em desenvolvimento salvamos em /public/uploads.
 * Para produção (Vercel), implemente esta interface com Vercel Blob, S3 ou Cloudinary e troque
 * a exportação `storage` abaixo — o resto do código não muda.
 */
export interface StorageProvider {
  upload(file: File, folder?: string): Promise<{ url: string }>;
}

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
]);
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export class LocalStorageProvider implements StorageProvider {
  constructor(private baseDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads")) {}

  async upload(file: File, folder = "geral") {
    const ext = ALLOWED.get(file.type);
    if (!ext) throw new Error("Formato não suportado. Use JPG, PNG, WEBP ou AVIF.");
    if (file.size > MAX_UPLOAD_BYTES) throw new Error("Imagem muito grande (máx. 5 MB).");
    const safeFolder = folder.replace(/[^a-z0-9-]/gi, "") || "geral";
    const dir = path.join(/*turbopackIgnore: true*/ this.baseDir, safeFolder);
    await mkdir(dir, { recursive: true });
    const name = `${randomUUID()}.${ext}`;
    await writeFile(path.join(/*turbopackIgnore: true*/ dir, name), Buffer.from(await file.arrayBuffer()));
    return { url: `/uploads/${safeFolder}/${name}` };
  }
}

export const storage: StorageProvider = new LocalStorageProvider();
