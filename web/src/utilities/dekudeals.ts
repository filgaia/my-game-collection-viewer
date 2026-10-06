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

const fetchItems = async (kind: string, key: string): Promise<DekuItem[]> => {
  const file = `${kind}/${key}`;
  const response = await fetch(listUrl(kind, key));
  const type = response.headers.get("content-type") || "";
  if (!response.ok || !type.includes("json")) {
    throw new Error(`Deku Deals ${file} unavailable`);
  }
  const { items } = await response.json();
  if (!Array.isArray(items)) {
    throw new Error(`Deku Deals ${file} has an unexpected shape`);
  }
  return items;
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
  key: string = DEFAULT_SHARE_KEY
): Promise<{
  games: IGame[];
  gamesInWishList: IGame[];
  labels: ILabel[];
  platforms: IPlatform[];
}> => {
  if (!/^[A-Za-z0-9]+$/.test(key)) throw new Error("Invalid share key");
  const [collection, wishlist] = await Promise.all([
    fetchItems("collection", key),
    fetchItems("wishlist", key),
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

// Limits parallel item-page requests so the CORS proxy is not flooded
let running = 0;
const waiting: Array<() => void> = [];
const throttled = async <T>(task: () => Promise<T>): Promise<T> => {
  if (running >= 3) await new Promise<void>((resolve) => waiting.push(resolve));
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

const ITEM_LINK = /^https:\/\/www\.dekudeals\.com\/(items\/[A-Za-z0-9-]+)$/;

// Unlock targets have no link: the first Deku Deals search result for the name is used
const searchItemPath = async (name: string): Promise<string | null> => {
  const response = await fetch(proxied(`search?q=${encodeURIComponent(name)}`));
  if (!response.ok) return null;
  return (await response.text()).match(/href=['"]\/(items\/[A-Za-z0-9-]+)['"]/)?.[1] ?? null;
};

// Cover = og:image of the game's Deku Deals page (hosted on cdn.dekudeals.com, loads in <img> without CORS)
export const fetchGameImage = (link?: string, name?: string): Promise<string | null> => {
  const cacheKey = link || (name ? `search:${name.toLowerCase()}` : "");
  if (!cacheKey) return Promise.resolve(null);
  if (stored[cacheKey]) return Promise.resolve(stored[cacheKey]);
  if (!imageCache.has(cacheKey)) {
    imageCache.set(
      cacheKey,
      throttled(async () => {
        const path = link ? link.match(ITEM_LINK)?.[1] : await searchItemPath(name!);
        if (!path) return null;
        const response = await fetch(proxied(path));
        if (!response.ok) return null;
        const html = await response.text();
        const url = html.match(/<meta[^>]*property=['"]og:image['"][^>]*>/)?.[0].match(/content=['"]([^'"]+)['"]/)?.[1];
        if (url?.startsWith("https://cdn.dekudeals.com/")) {
          stored[cacheKey] = url;
          try {
            localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(stored));
          } catch {}
          return url;
        }
        return null;
      }).catch(() => null)
    );
  }
  return imageCache.get(cacheKey)!;
};