import { defineConfig } from "@playwright/test";
import { assertSafeTestEnv, TEST_ENV } from "./e2e/test-env.mjs";

// Pojistka před během: server dostane jen testovací proměnné, jinak testy vůbec nezačnou.
assertSafeTestEnv({ ...process.env, ...TEST_ENV });

// Mobile first: všechny testy na šířce 375 px (iPhone SE / mini) proti produkčnímu buildu.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
    locale: "cs-CZ",
  },
  projects: [{ name: "mobile-375", use: { browserName: "chromium" } }],
  webServer: {
    command: "npm run build && npx next start -p 3100",
    url: "http://localhost:3100",
    // Nikdy cizí server: ten na portu 3100 mohl běžet s .env.local (ostrá Supabase a Resend).
    // Když je port obsazený, Playwright skončí chybou ještě před prvním testem.
    reuseExistingServer: false,
    timeout: 180_000,
    env: TEST_ENV,
  },
});
