import { parseUnlocks } from "./unlocks";

describe("parseUnlocks", () => {
  it("expands shorthand numbers", () => {
    expect(parseUnlocks("Unlocks: Ryza 2, 3 & Yumia").map((t) => t.name)).toEqual([
      "Ryza 2",
      "Ryza 3",
      "Yumia",
    ]);
  });

  it("reads inline platform after a note line", () => {
    expect(parseUnlocks("Family\nUnlocks: ACE COMBAT 8 on Xbox")).toEqual([
      { name: "ACE COMBAT 8", platform: "Xbox" },
    ]);
  });

  it("reads one target per line under a header", () => {
    expect(parseUnlocks("Unlocks on Xbox:\nAC Shadows Premium\nAC Black Flag Resynced\n")).toEqual([
      { name: "AC Shadows Premium", platform: "Xbox" },
      { name: "AC Black Flag Resynced", platform: "Xbox" },
    ]);
  });

  it("ignores notes without unlocks", () => {
    expect(parseUnlocks("Family")).toEqual([]);
    expect(parseUnlocks("Unlocks on Xbox:")).toEqual([]);
    expect(parseUnlocks(undefined)).toEqual([]);
  });
});
