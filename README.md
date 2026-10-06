# My Game Collection Viewer

![Cover](web/public/images/cover.png)

## Visiting the Site

See the site [online](https://filgaia.github.io/my-game-collection-viewer).

## Development

The web app is a React, TypeScript, and Vite application in `web/`. Use Node.js 22 and npm.

```sh
cd web
npm ci
npm start
```

Run the tests and production build with:

```sh
npm test -- --run
npm run build
```

The GitHub Pages workflow builds `web/` and deploys its `build/` directory.

## Data sources (web)

The web app loads your collection and wishlist from the public share links of [Deku Deals](https://www.dekudeals.com/). With your share key:

You can find the sahre key under your collection or wishlist as Share: https://www.dekudeals.com/wishlist/<key> or https://www.dekudeals.com/collection/<key>

No login or cookie is needed. If the data cannot be loaded (no key, invalid key), the app falls back to `web/src/data/db.json` and the **Unlocks** tab is disabled.

Next to the **Total** count there is a **Load your own collection** field: paste a share key (or a Deku Deals collection/wishlist URL) and press **Load!** to view someone else's lists. If it fails, the current data stays.


Deku Deals sends no CORS headers, so the browser can't call it directly:

- **Dev (`npm start`)**: a Vite middleware ([web/devApi.ts](web/devApi.ts)) proxies the Deku Deals lists and item pages.
- **Production (GitHub Pages)**: requests go through the public CORS proxy `api.allorigins.win`.

Covers are resolved in two layers. At build time, `npm run snapshot:covers` ([web/scripts/snapshot-covers.mjs](web/scripts/snapshot-covers.mjs)) looks them up on SteamGridDB for the snapshotted lists and ships `covers.json`; it runs as its own workflow step, reuses the `covers.json` of the deployed site and only looks up new games (removed ones are dropped). It needs the `SGDB_API_KEY` repository secret, which is only used in the Action and never reaches the bundle; manual fixes go in [web/scripts/covers.overrides.json](web/scripts/covers.overrides.json) (`{ "<item link or search:name>": "<image url>" }`). Any game without a build-time cover (and every game of another share key) falls back to the Deku Deals lookup: its `og:image` (hosted on `cdn.dekudeals.com`), looked up in the browser as cards appear (for games only mentioned in "Unlocks" notes, the first Deku Deals search result is used), through the public CORS proxy, with a timeout, a few automatic retries, and a `localStorage` cache. The proxy is free and can be flaky: when a lookup fails, the card shows a **retry** button over the cover. Games Deku Deals doesn't have show a placeholder.

### Local setup

Create a git-ignored `web/.env.local`:

```
VITE_DEKUDEALS_KEY=<your Deku Deals share key>
```
