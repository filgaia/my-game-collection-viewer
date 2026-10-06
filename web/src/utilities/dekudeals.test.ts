import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDekuDealsGames, fetchGameImage } from "./dekudeals";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("dekudeals", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects an invalid share key without fetching", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchDekuDealsGames("bad key!")).rejects.toThrow("Invalid share key");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps collection and wishlist items into games, platforms and labels", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve(
          jsonResponse({
            items: url.includes("/collection/")
              ? [
                  { name: "Game A", platform: "Switch", status: "playing", note: "hi", link: "l1" },
                  { name: "Game B", platform: "Switch", status: "Playing" },
                ]
              : [{ name: "Game C", platform: "PS5" }],
          })
        )
      )
    );

    const { games, gamesInWishList, labels, platforms } = await fetchDekuDealsGames("abc123");

    expect(games).toHaveLength(2);
    expect(games[0]).toMatchObject({ name: "Game A", is_wishlist_item: false, description_short: "hi", link: "l1" });
    expect(gamesInWishList[0]).toMatchObject({ name: "Game C", is_wishlist_item: true });
    expect(platforms.map((p) => p.name)).toEqual(["Switch", "PS5"]);
    expect(labels).toHaveLength(1);
    expect(labels[0].name).toBe("Playing");
    expect(games[1].labels).toEqual([labels[0]]);
    expect(gamesInWishList[0].labels).toEqual([]);
  });

  it("fails fast with a not found error on a 404", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response("", { status: 404 })));
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchDekuDealsGames("missing")).rejects.toThrow("not found");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries a failed list request before succeeding", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockImplementation(() => Promise.resolve(jsonResponse({ items: [] })));
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchDekuDealsGames("retrykey");

    expect(result.games).toEqual([]);
    expect(fetchMock.mock.calls.length).toBeGreaterThan(2);
  });

  it("resolves the cover from og:image and returns null without a link or name", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(`<meta property="og:image" content="https://cdn.dekudeals.com/img/cover.jpg">`, {
            status: 200,
          })
        )
      )
    );

    expect(await fetchGameImage("https://www.dekudeals.com/items/some-game")).toBe(
      "https://cdn.dekudeals.com/img/cover.jpg"
    );
    expect(await fetchGameImage()).toBeNull();
  });
});
