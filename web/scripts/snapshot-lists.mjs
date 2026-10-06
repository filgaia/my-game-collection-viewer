// Build-time step: Deku Deals sends no CORS headers, so the share lists are downloaded here and shipped as static JSON.
// Never fails the build: without a snapshot the app falls back to the live CORS proxy.
import { mkdir, writeFile } from "node:fs/promises";
// Local runs: load web/.env.local (Vite does it for the app, not for node scripts); CI sets real env vars
try {
  process.loadEnvFile(new URL("../.env.local", import.meta.url));
} catch {}

const shareKey = process.env.VITE_DEKUDEALS_KEY;
const outDir = new URL("../public/api/snapshot/", import.meta.url);

if (!shareKey || !/^[A-Za-z0-9]+$/.test(shareKey)) {
  console.log("snapshot: VITE_DEKUDEALS_KEY not set, skipping");
} else {
  await mkdir(outDir, { recursive: true });
  for (const kind of ["collection", "wishlist"]) {
    try {
      const res = await fetch(`https://www.dekudeals.com/${kind}/${shareKey}.json`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(30000),
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.items)) throw new Error(`HTTP ${res.status}`);
      await writeFile(new URL(`${kind}.json`, outDir), JSON.stringify({ items: data.items }));
      console.log(`snapshot: ${kind} saved (${data.items.length} items)`);
    } catch (e) {
      console.warn(`snapshot: ${kind} failed (${e.message}), the app will use the live proxy`);
    }
  }
}
