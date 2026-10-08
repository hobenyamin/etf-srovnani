// Jednoduchý limit pokusů v paměti instance (posuvné okno). Klíč (IP) se drží jen v paměti,
// nikam se neukládá. Na serverless má každá instance vlastní paměť – je to jen první pojistka,
// silnější ochrana (Vercel WAF, Upstash) je v README „Co chybí“.

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return {
    /** Zaznamená pokus; vrátí false, pokud klíč v okně překročil limit. */
    hit(key: string, now = Date.now()): boolean {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > 10_000) {
        for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      return recent.length <= limit;
    },
  };
}
