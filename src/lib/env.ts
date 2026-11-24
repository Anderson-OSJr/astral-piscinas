import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.url({ message: "DATABASE_URL precisa ser uma URL do Postgres" }),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET precisa ter pelo menos 16 caracteres"),
  /** Tamanho do pool de conexões. Use 1 com o Postgres embutido do "prisma dev". */
  DATABASE_POOL_MAX: z.coerce.number().int().positive().optional(),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:", z.treeifyError(parsed.error));
  throw new Error("Variáveis de ambiente inválidas — confira o .env (veja .env.example).");
}

export const env = parsed.data;
