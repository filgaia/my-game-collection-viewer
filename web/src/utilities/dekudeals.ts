import { IGame, ILabel, IPlatform } from "../models/gamesModel";

interface DekuItem {
  name: string;
  link?: string;
  added_at?: string;
  format?: string;
  note?: string;
  platform?: string;
}

const API_BASE = `${import.meta.env.BASE_URL}api`;

const FORMAT_LABELS: Record<string, ILabel> = {
  digital: { id: 1, name: "Digital", background_color: 0x64b5f6 },
  physical: { id: 2, name: "Physical", background_color: 0x81c784 },
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
  platforms: IPlatform[]
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
  const label = item.format ? FORMAT_LABELS[item.format.toLowerCase()] : undefined;

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

  return {
    games: collection.map((item, i) => toGame(item, i + 1, false, platforms)),
    gamesInWishList: wishlist.map((item, i) => toGame(item, i + 1, true, platforms)),
    labels: Object.values(FORMAT_LABELS),
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

