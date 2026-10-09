import type { NextConfig } from "next";

// PostHog přes vlastní doménu (doporučení PostHogu pro Next.js). Prohlížeč posílá eventy na /ingest,
// server je přepošle do EU Cloud. Ochrana proti sledování ve Firefoxu (výchozí v anonymním okně)
// jinak blokuje eu.i.posthog.com i u návštěvníků, kteří s měřením souhlasili. Souhlas to neobchází:
// knihovna se dál načte až po něm (lib/analytics.ts). Viz README, rozhodnutí 40.
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    // static/ a array/ nepotřebujeme: další skripty z PostHogu nenačítáme (disable_external_dependency_loading)
    return [{ source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` }];
  },
  // PostHog volá cesty s lomítkem na konci (/ingest/e/); přesměrování by POST rozbilo
  skipTrailingSlashRedirect: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
