import { IGame, ILabel, IPlatform } from "../models/gamesModel";

interface DekuItem {
  name: string;
  link?: string;
  added_at?: string;
  status?: string;
  note?: string;
  platform?: string;
}

const API_BASE = `${import.meta.env.BASE_URL}api`;

const LABEL_COLORS = [0x64b5f6, 0x81c784, 0xffb74d, 0xba68c8, 0xe57373, 0x4db6ac, 0xf06292];

// One pill per distinct status value; items without a status get no pill
const getStatusLabel = (status: string | undefined, labels: ILabel[]): ILabel | undefined => {
  const name = status?.trim();
  if (!name) return undefined;
  let label = labels.find((l) => l.name?.toLowerCase() === name.toLowerCase());
  if (!label) {
    label = {
      id: labels.length + 1,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      background_color: LABEL_COLORS[labels.length % LABEL_COLORS.length],
    };
    labels.push(label);
  }
  return label;
};

export const DEFAULT_SHARE_KEY: string = import.meta.env.VITE_DEKUDEALS_KEY || "";

// Deku Deals sends no CORS headers: dev uses the Vite proxy, production a public CORS proxy
const listUrl = (kind: string, key: string) =>
  import.meta.env.DEV
    ? `${API_BASE}/dekudeals/${kind}/${key}.json`
    : `https://api.allorigins.win/raw?url=${encodeURIComponent(
        `https://www.dekudeals.com/${kind}/${key}.json`
      )}`;

// The public proxy is flaky: a few retries instead of hanging. The full collection list can take ~10s
// through the proxy, so the timeout must be generous.
const fetchLive = async (kind: string, key: string): Promise<DekuItem[]> => {
  let lastError: unknown = new Error(`Deku Deals ${kind}/${key} unavailable`);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(listUrl(kind, key), { signal: AbortSignal.timeout(45000) });
      const type = response.headers.get("content-type") || "";
      if (response.status === 404) throw new Error(`Deku Deals ${kind}/${key} not found`);
      if (response.ok && type.includes("json")) {
        const { items } = await response.json();
        if (Array.isArray(items)) return items;
      }
    } catch (e) {
      lastError = e;
      if (e instanceof Error && e.message.includes("not found")) throw e;
    }
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
  }
  throw lastError;
};

// The default share key is snapshotted at build time (static, instant); anything else goes through the live proxy
const fetchSnapshot = async (kind: string): Promise<DekuItem[] | null> => {
  try {
    const response = await fetch(`${API_BASE}/snapshot/${kind}.json`);
    if (!response.ok || !(response.headers.get("content-type") || "").includes("json")) return null;
    const { items } = await response.json();
    return Array.isArray(items) ? items : null;
  } catch {
    return null;
  }
};

const fetchItems = async (kind: string, key: string, live = false): Promise<DekuItem[]> => {
  if (!live && !import.meta.env.DEV && DEFAULT_SHARE_KEY && key === DEFAULT_SHARE_KEY) {
    const snapshot = await fetchSnapshot(kind);
    if (snapshot) return snapshot;
  }
  return fetchLive(kind, key);
};

const toGame = (
  item: DekuItem,
  id: number,
  isWishlist: boolean,
  platforms: IPlatform[],
  labels: ILabel[]
): IGame => {
  let platform_id: number | undefined;
  if (item.platform) {
    let platform = platforms.find((p) => p.name === item.platform);
    if (!platform) {
      platform = { id: platforms.length + 1, name: item.platform };
      platforms.push(platform);
    }
    platform_id = platform.id;
  }
  const label = getStatusLabel(item.status, labels);

  return {
    id,
    name: item.name,
    is_wishlist_item: isWishlist,
    created_on: item.added_at,
    description_short: item.note,
    platform_id,
    labels: label ? [label] : [],
    link: item.link,
  };
};

// Loads the public Deku Deals collection and wishlist for a share key. Rejects when either is unavailable.
export const fetchDekuDealsGames = async (
  key: string = DEFAULT_SHARE_KEY,
  live = false // skip the build-time snapshot
): Promise<{
  games: IGame[];
  gamesInWishList: IGame[];
  labels: ILabel[];
  platforms: IPlatform[];
}> => {
  if (!/^[A-Za-z0-9]+$/.test(key)) throw new Error("Invalid share key");
  const [collection, wishlist] = await Promise.all([
    fetchItems("collection", key, live),
    fetchItems("wishlist", key, live),
  ]);
  const platforms: IPlatform[] = [];
  const labels: ILabel[] = [];

  return {
    games: collection.map((item, i) => toGame(item, i + 1, false, platforms, labels)),
    gamesInWishList: wishlist.map((item, i) => toGame(item, i + 1, true, platforms, labels)),
    labels,
    platforms,
  };
};

const IMAGE_STORAGE_KEY = "dekudeals-covers";
const imageCache = new Map<string, Promise<string | null>>();
const stored: Record<string, string> = (() => {
  try {
    return JSON.parse(localStorage.getItem(IMAGE_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
})();

// Build-time covers (SteamGridDB), keyed by item link or `search:<name>`. Missing or broken: every game uses the live lookup.
let coverSnapshot: Promise<Record<string, string>> | undefined;
const loadCoverSnapshot = (): Promise<Record<string, string>> => {
  coverSnapshot ??= (async () => {
    try {
      const response = await fetch(`${API_BASE}/snapshot/covers.json`);
      if (!response.ok || !(response.headers.get("content-type") || "").includes("json")) return {};
      const { covers } = await response.json();
      return covers && typeof covers === "object" ? covers : {};
    } catch {
      return {};
    }
  })();
  return coverSnapshot;
};

// Limits parallel requests so the public CORS proxy is not flooded
let running = 0;
const waiting: Array<() => void> = [];
const throttled = async <T>(task: () => Promise<T>): Promise<T> => {
  if (running >= 4) await new Promise<void>((resolve) => waiting.push(resolve));
  running++;
  try {
    return await task();
  } finally {
    running--;
    waiting.shift()?.();
  }
};

const proxied = (path: string) =>
  import.meta.env.DEV
    ? `${API_BASE}/dekudeals/${path}`
    : `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.dekudeals.com/${path}`)}`;

// The public proxy is flaky: short timeout and a few retries. Returns null on a definitive 404.
const fetchText = async (path: string): Promise<string> => {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(proxied(path), { signal: AbortSignal.timeout(8000) });
      if (response.ok) return await response.text();
      if (response.status === 404) throw new NotFound();
      lastError = new Error(String(response.status));
    } catch (e) {
      if (e instanceof NotFound) throw e;
      lastError = e;
    }
    await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
  }
  throw lastError;
};

class NotFound extends Error {}

const ITEM_LINK = /^https:\/\/www\.dekudeals\.com\/(items\/[A-Za-z0-9-]+)$/;

// Unlock targets have no link: the first Deku Deals search result for the name is used
const searchItemPath = async (name: string): Promise<string | null> =>
  (await fetchText(`search?q=${encodeURIComponent(name)}`)).match(/href=['"]\/(items\/[A-Za-z0-9-]+)['"]/)?.[1] ?? null;

const lookupCover = async (cacheKey: string, link?: string, name?: string): Promise<string | null> => {
  const path = link ? link.match(ITEM_LINK)?.[1] : await searchItemPath(name!);
  if (!path) return null;
  const html = await fetchText(path);
  const tag = html.match(/<meta[^>]*property=['"]og:image['"][^>]*>/)?.[0];
  const url = tag?.match(/content=['"]([^'"]+)['"]/)?.[1];
  if (!url?.startsWith("https://cdn.dekudeals.com/")) return null;
  stored[cacheKey] = url;
  try {
    localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(stored));
  } catch {}
  return url;
};

// Cover = og:image of the game's Deku Deals page (hosted on cdn.dekudeals.com, loads in <img> without CORS).
// Resolves null when the game has no cover; rejects on transient failures (not cached), so callers can retry.
export const fetchGameImage = async (link?: string, name?: string): Promise<string | null> => {
  const cacheKey = link || (name ? `search:${name.toLowerCase()}` : "");
  if (!cacheKey) return null;
  const snapshotCover = (await loadCoverSnapshot())[cacheKey];
  if (snapshotCover) return snapshotCover;
  if (stored[cacheKey]) return stored[cacheKey];
  if (!imageCache.has(cacheKey)) {
    const result = throttled(() => lookupCover(cacheKey, link, name)).catch((e) => {
      if (e instanceof NotFound) return null;
      imageCache.delete(cacheKey);
      throw e;
    });
    imageCache.set(cacheKey, result);
  }
  return imageCache.get(cacheKey)!;
};