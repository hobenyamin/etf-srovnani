// Produkční server pro měřicí skripty (page-height.mjs, screens.mjs). Sestaví a spustí ho sám se stejnými
// testovacími proměnnými jako E2E (e2e/test-env.mjs), nikdy s .env.local. Na cizí běžící server se nepřipojí.
import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { assertSafeTestEnv, TEST_ENV } from "../e2e/test-env.mjs";

const portBusy = (port) =>
  new Promise((resolve) => {
    const socket = createConnection(port, "127.0.0.1");
    socket.once("connect", () => resolve(socket.end() && true));
    socket.once("error", () => resolve(false));
  });

/** Spustí server na portu a vrátí jeho adresu a funkci na zastavení. */
export async function startTestServer(port) {
  if (await portBusy(port)) throw new Error(`Port ${port} je obsazený, cizí server neměříme.`);
  const env = { ...process.env, ...TEST_ENV };
  assertSafeTestEnv(env);

  const server = spawn("sh", ["-c", `npm run build && npx next start -p ${port}`], {
    env,
    detached: true,
    stdio: "ignore",
  });
  const stop = () => {
    try {
      process.kill(-server.pid); // celá skupina procesů, i next-server
    } catch {
      // už neběží
    }
  };
  process.on("exit", stop);
  for (let i = 0; ; i++) {
    if (i > 300) throw new Error("Server se nespustil do 5 minut.");
    if (await portBusy(port)) break;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return { base: `http://localhost:${port}`, stop };
}
