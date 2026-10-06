// Build-time step: resolves Deku Deals covers for the default share key into public/covers.json
// (Node has no CORS restrictions, so the browser doesn't need slow public proxies for these games).
import { mkdir, writeFile } from "node:fs/promises";
import { parseUnlocks } from "../src/utilities/unlocks.ts";

const ORIGIN = "https://www.dekudeals.com";
const shareKey = process.env.VITE_DEKUDEALS_KEY;
const out = new URL("../public/covers.json", import.meta.url);

const get = async (path, tries = 5) => {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`${ORIGIN}/${path}`, { signal: AbortSignal.timeout(15000) });
      if (res.ok) return await res.text();
      if (res.status === 404) return null;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000 * 2 ** i)); // backs off on 429/5xx
  }
  return null;
};

const coverOf = async (path) => {
  const html = await get(path);
  const tag = html?.match(/<meta[^>]*property=['"]og:image['"][^>]*>/)?.[0];
  const url = tag?.match(/content=['"]([^'"]+)['"]/)?.[1];
  return url?.startsWith("https://cdn.dekudeals.com/") ? url : null;
};

const covers = {};

try {
  if (!shareKey) throw new Error("VITE_DEKUDEALS_KEY missing");
  const items = [];
  for (const kind of ["collection", "wishlist"]) {
    const json = await get(`${kind}/${shareKey}.json`);
    items.push(...(JSON.parse(json ?? "{}").items ?? []));
  }

  // key (same format the app uses) -> page path or search term to read the cover from
  const jobs = new Map();
  const known = new Set(items.map((i) => i.name.toLowerCase()));
  for (const item of items) {
    const path = item.link?.match(/^https:\/\/www\.dekudeals\.com\/(items\/[A-Za-z0-9-]+)$/)?.[1];
    if (path) jobs.set(item.link, { path });
    for (const target of parseUnlocks(item.note)) {
      if (!known.has(target.name.toLowerCase())) {
        jobs.set(`search:${target.name.toLowerCase()}`, { search: target.name });
      }
    }
  }

  const queue = [];
  const worker = async () => {
    for (let job; (job = queue.shift()); ) {
      const [key, { path, search }] = job;
      let page = path;
      if (search) {
        const html = await get(`search?q=${encodeURIComponent(search)}`);
        page = html?.match(/href=['"]\/(items\/[A-Za-z0-9-]+)['"]/)?.[1];
      }
      const url = page ? await coverOf(page) : null;
      if (url) covers[key] = url;
    }
  };
  // Two passes: the second retries whatever the first one lost to rate limiting
  for (let pass = 0; pass < 2; pass++) {
    queue.push(...[...jobs].filter(([key]) => !covers[key]));
    await Promise.all(Array.from({ length: 4 }, worker));
  }
  console.log(`Covers resolved: ${Object.keys(covers).length}/${jobs.size}`);
} catch (e) {
  console.warn("Cover prefetch skipped:", e.message);
}

await mkdir(new URL("./", out), { recursive: true });
await writeFile(out, JSON.stringify(covers));
