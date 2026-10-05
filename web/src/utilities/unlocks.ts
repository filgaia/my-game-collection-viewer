import { IGame } from "../models/gamesModel";

export interface UnlockTarget {
  name: string;
  platform?: string;
}

export interface UnlockGroup {
  game: IGame;
  inWishlist: boolean;
  targets: UnlockTarget[];
}

const PLATFORM_SUFFIX =
  /^(.*?)\s+on\s+(Xbox|PlayStation|PS[45]|Steam|PC|Nintendo Switch(?: 2)?|Switch(?: 2)?|Epic|GOG)$/i;

const toTarget = (text: string, defaultPlatform?: string): UnlockTarget => {
  const match = text.match(PLATFORM_SUFFIX);
  return match
    ? { name: match[1].trim(), platform: match[2] }
    : { name: text, platform: defaultPlatform };
};

// "Ryza 2, 3 & Yumia" -> Ryza 2, Ryza 3, Yumia
const splitInline = (text: string, defaultPlatform?: string): UnlockTarget[] => {
  const parts = text.split(/\s*[,&;]\s*/).filter(Boolean);
  const names: string[] = [];
  parts.forEach((part, i) => {
    const prefix = i > 0 ? names[i - 1].match(/^(.*?)\s*\d+$/)?.[1] : undefined;
    names.push(/^\d+$/.test(part) && prefix ? `${prefix} ${part}` : part);
  });
  return names.map((name) => toTarget(name, defaultPlatform));
};

export const parseUnlocks = (note?: string): UnlockTarget[] => {
  if (!note) return [];
  const lines = note.split(/\r?\n/).map((line) => line.trim());
  const targets: UnlockTarget[] = [];

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^unlocks(?:\s+on\s+([^:]+?))?\s*:\s*(.*)$/i);
    if (!match) continue;
    const platform = match[1]?.trim();
    if (match[2]) {
      targets.push(...splitInline(match[2], platform));
      continue;
    }
    // Header only: the targets are the following lines until a blank line
    while (i + 1 < lines.length && lines[i + 1] && !/^unlocks/i.test(lines[i + 1])) {
      targets.push(toTarget(lines[++i], platform));
    }
  }

  const seen = new Set<string>();
  return targets.filter((t) => {
    const key = `${t.name.toLowerCase()}|${t.platform ?? ""}`;
    return !seen.has(key) && seen.add(key);
  });
};

export const buildUnlockGroups = (collection: IGame[], wishlist: IGame[]): UnlockGroup[] =>
  [
    ...collection.map((game) => ({ game, inWishlist: false })),
    ...wishlist.map((game) => ({ game, inWishlist: true })),
  ]
    .map((entry) => ({ ...entry, targets: parseUnlocks(entry.game.description_short) }))
    .filter((group) => group.targets.length > 0);
