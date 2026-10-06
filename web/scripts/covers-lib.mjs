// Same key the app uses to look a cover up (see fetchGameImage)
export const coverKey = (item) => item.link || (item.name ? `search:${item.name.toLowerCase()}` : "");

// Strips what SteamGridDB titles don't have: trademarks, bracketed tags, platform and edition suffixes
export const normalizeName = (name) =>
  name
    .replace(/[™®©]/g, "")
    .replace(/\(.*?\)|\[.*?\]/g, " ")
    .replace(/\s+[-–:]\s+(?:[\w' ]+\s)?(?:edition|version|bundle|collection pack)\s*$/i, "")
    .replace(/\b(?:nintendo switch|switch|ps[45]|xbox(?: one| series [xs])?)\s*(?:edition|version)?\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();

const simplify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

// Exact (normalized) title match first, otherwise SteamGridDB's top result
export const pickGame = (results, name) => {
  const wanted = simplify(normalizeName(name));
  return results.find((r) => simplify(r.name) === wanted) ?? results[0];
};

// Only the differences are resolved: games already covered are kept, games no longer listed are dropped
export const diffCovers = (previous, wantedKeys) => {
  const wanted = new Set(wantedKeys);
  const kept = {};
  for (const [key, url] of Object.entries(previous)) if (wanted.has(key)) kept[key] = url;
  return {
    kept,
    missing: [...wanted].filter((key) => !(key in kept)),
    removed: Object.keys(previous).filter((key) => !wanted.has(key)),
  };
};
