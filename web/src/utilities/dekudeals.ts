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

const fetchItems = async (file: string): Promise<DekuItem[]> => {
  const response = await fetch(`${API_BASE}/dekudeals/${file}`, { credentials: "include" });
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

// Loads the logged-in Deku Deals collection and wishlist. Rejects when either is unavailable.
export const fetchDekuDealsGames = async (): Promise<{
  games: IGame[];
  gamesInWishList: IGame[];
  labels: ILabel[];
  platforms: IPlatform[];
}> => {
  const [collection, wishlist] = await Promise.all([
    fetchItems("collection.json"),
    fetchItems("wishlist.json"),
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

export const fetchGameImage = (name: string): Promise<string | null> => {
  if (!imageCache.has(name)) {
    imageCache.set(
      name,
      fetch(`${API_BASE}/steamgriddb/grid?name=${encodeURIComponent(name)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data?.url ?? null)
        .catch(() => null)
    );
  }
  return imageCache.get(name)!;
};


