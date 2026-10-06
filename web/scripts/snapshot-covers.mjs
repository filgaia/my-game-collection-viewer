// Build-time step, independent from the lists snapshot: resolves covers from SteamGridDB for the snapshotted lists.
// Only the differences against the previous covers.json (deployed site or local file) are looked up.
// Never fails the build: games without a cover keep using the live Deku Deals lookup in the app.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { coverKey, diffCovers, normalizeName, pickGame } from "./covers-lib.mjs";

// Local runs: load web/.env.local (Vite does it for the app, not for node scripts); CI sets real env vars
try {
  process.loadEnvFile(new URL("../.env.local", import.meta.url));
} catch {}

const apiKey = process.env.SGDB_API_KEY;
const previousUrl = process.env.COVERS_PREVIOUS_URL;
const dir = new URL("../public/api/snapshot/", import.meta.url);
const API = "https://www.steamgriddb.com/api/v2";
const CONCURRENCY = 4;

const readJson = async (path) => JSON.parse(await readFile(new URL(path, dir), "utf8"));

const loadPrevious = async () => {
  if (previousUrl) {
    try {
      const res = await fetch(previousUrl, { signal: AbortSignal.timeout(15000) });
      const data = res.ok && (res.headers.get("content-type") || "").includes("json") ? await res.json() : null;
      if (data?.covers) return data.covers;
    } catch {}
    console.log("covers: no previous covers.json on the deployed site");
  }
  try {
    return (await readJson("covers.json")).covers ?? {};
  } catch {
    return {};
  }
};

const readOverrides = async () => {
  try {
    return JSON.parse(await readFile(new URL("covers.overrides.json", import.meta.url), "utf8"));
  } catch {
    return {};
  }
};

const sgdb = async (path) => {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal: AbortSignal.timeout(15000),
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { data } = await res.json();
  return data ?? [];
};

// Wide grids (closest to the 16:9 card) first, any static grid otherwise; results come sorted by score
const findCover = async (name) => {
  const game = pickGame(await sgdb(`/search/autocomplete/${encodeURIComponent(normalizeName(name))}`), name);
  if (!game) return null;
  const query = "nsfw=false&humor=false&types=static";
  const wide = await sgdb(`/grids/game/${game.id}?${query}&dimensions=920x430,460x215`);
  const grids = wide.length ? wide : await sgdb(`/grids/game/${game.id}?${query}`);
  return grids[0]?.url ?? null;
};

const resolveAll = async (items) => {
  const covers = {};
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const { key, name } = items[next++];
      try {
        const url = await findCover(name);
        if (url) covers[key] = url;
        else console.log(`covers: nothing found for "${name}"`);
      } catch (e) {
        console.warn(`covers: "${name}" failed (${e.message})`);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return covers;
};

try {
  const items = [];
  for (const kind of ["collection", "wishlist"]) {
    try {
      items.push(...(await readJson(`${kind}.json`)).items);
    } catch {
      console.log(`covers: ${kind}.json missing, skipping`);
      process.exit(0);
    }
  }

  const byKey = new Map(items.map((item) => [coverKey(item), item]));
  byKey.delete("");
  const { kept, missing, removed } = diffCovers(await loadPrevious(), [...byKey.keys()]);
  console.log(`covers: ${Object.keys(kept).length} kept, ${removed.length} removed, ${missing.length} new`);

  let found = {};
  if (!missing.length) {
    // nothing to look up
  } else if (!apiKey) {
    console.log("covers: SGDB_API_KEY not set, new games will use the live lookup");
  } else {
    found = await resolveAll(missing.map((key) => ({ key, name: byKey.get(key).name })));
    console.log(`covers: ${Object.keys(found).length}/${missing.length} new covers found`);
  }

  const overrides = await readOverrides();
  const covers = { ...kept, ...found };
  for (const [key, url] of Object.entries(overrides)) if (byKey.has(key)) covers[key] = url;

  await mkdir(dir, { recursive: true });
  await writeFile(new URL("covers.json", dir), JSON.stringify({ covers }));
  console.log(`covers: saved ${Object.keys(covers).length} covers`);
} catch (e) {
  console.warn(`covers: failed (${e.message}), the app will use the live lookup`);
}
