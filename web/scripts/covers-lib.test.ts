import { describe, expect, it } from "vitest";
// @ts-expect-error plain .mjs build script
import { coverKey, diffCovers, normalizeName, pickGame } from "./covers-lib.mjs";

describe("covers-lib", () => {
  it("builds the same key as the app", () => {
    expect(coverKey({ name: "Zelda", link: "https://www.dekudeals.com/items/zelda" })).toBe(
      "https://www.dekudeals.com/items/zelda"
    );
    expect(coverKey({ name: "Zelda" })).toBe("search:zelda");
  });

  it("normalizes names for the SteamGridDB search", () => {
    expect(normalizeName("Hades™ (Nintendo Switch)")).toBe("Hades");
    expect(normalizeName("Celeste - Deluxe Edition")).toBe("Celeste");
    expect(normalizeName("Doom Eternal")).toBe("Doom Eternal");
  });

  it("prefers the exact title and falls back to the first result", () => {
    const results = [{ name: "Hades II" }, { name: "Hades" }];
    expect(pickGame(results, "Hades™")).toEqual({ name: "Hades" });
    expect(pickGame(results, "Something else")).toEqual({ name: "Hades II" });
  });

  it("keeps known covers, drops removed games and lists the new ones", () => {
    expect(diffCovers({ a: "1", b: "2" }, ["b", "c"])).toEqual({
      kept: { b: "2" },
      missing: ["c"],
      removed: ["a"],
    });
  });
});
