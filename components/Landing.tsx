import { Hero } from "@/components/Hero";
import { PageView } from "@/components/PageView";
import type { AdVariant } from "@/lib/track";

export function Landing({ variant }: { variant: AdVariant }) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1">
      <PageView variant={variant} />
      <Hero variant={variant} />
    </main>
  );
}
