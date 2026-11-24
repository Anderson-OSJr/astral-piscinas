import "server-only";

/**
 * Rate limit simples por chave (ex.: IP). Implementação em memória — suficiente para uma
 * instância. Para várias instâncias/serverless, troque por Redis/Upstash mantendo a interface.
 */
export interface RateLimiter {
  check(key: string): Promise<{ ok: boolean; remaining: number }>;
}

export function createMemoryRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return {
    async check(key) {
      const now = Date.now();
      const entry = hits.get(key);
      if (!entry || entry.resetAt < now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        if (hits.size > 5000) {
          for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
        }
        return { ok: true, remaining: limit - 1 };
      }
      entry.count++;
      return { ok: entry.count <= limit, remaining: Math.max(0, limit - entry.count) };
    },
  };
}

export const leadRateLimiter = createMemoryRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
