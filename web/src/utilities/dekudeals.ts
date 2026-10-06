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

const imageCache = new Map<string, Promise<string | null>>();

// Production: name -> image URL map generated at build time (scripts/prefetch-images.mjs)
let staticImages: Promise<Record<string, string>> | null = null;
const getStaticImages = () => {
  staticImages ??= fetch(`${API_BASE}/steamgriddb.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({}));
  return staticImages;
};

export const fetchGameImage = (name: string): Promise<string | null> => {
  if (!imageCache.has(name)) {
    imageCache.set(
      name,
      import.meta.env.DEV
        ? fetch(`${API_BASE}/steamgriddb/grid?name=${encodeURIComponent(name)}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => data?.url ?? null)
            .catch(() => null)
        : getStaticImages().then((map) => map[name] ?? null)
    );
  }
  return imageCache.get(name)!;
};


