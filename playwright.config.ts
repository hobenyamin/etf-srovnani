import { defineConfig } from "@playwright/test";

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
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
