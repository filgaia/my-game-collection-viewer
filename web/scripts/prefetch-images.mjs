// Build-time step: SteamGridDB has no CORS support, so cover URLs are resolved here and shipped as a static map.
import { mkdir, writeFile } from "node:fs/promises";
import SGDB from "steamgriddb";

const apiKey = process.env.STEAMGRIDDB_API_KEY;
const shareKey = process.env.VITE_DEKUDEALS_KEY;
const out = new URL("../public/api/steamgriddb.json", import.meta.url);

const names = async () => {
  const all = new Set();
  for (const kind of ["collection", "wishlist"]) {
    const res = await fetch(`https://www.dekudeals.com/${kind}/${shareKey}.json`);
    for (const item of (await res.json()).items ?? []) all.add(item.name);
  }
  return [...all];
};

const map = {};
if (apiKey && shareKey) {
  try {
    const grid = new SGDB(apiKey);
    const list = await names();
    for (let i = 0; i < list.length; i += 5) {
      await Promise.all(
        list.slice(i, i + 5).map(async (name) => {
          try {
            const [game] = await grid.searchGame(name);
            if (!game) return;
            const [image] = await grid.getGrids({ type: "game", id: game.id, dimensions: ["460x215", "920x430"] });
            if (image) map[name] = String(image.url);
          } catch {}
        })
      );
    }
  } catch (e) {
    console.warn("Image prefetch failed:", e.message);
  }
} else {
  console.warn("STEAMGRIDDB_API_KEY or VITE_DEKUDEALS_KEY missing: skipping image prefetch");
}

await mkdir(new URL("./", out), { recursive: true });
await writeFile(out, JSON.stringify(map));
console.log(`Prefetched ${Object.keys(map).length} images`);
