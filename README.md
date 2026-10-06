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

Deku Deals and SteamGridDB don't send CORS headers, so the browser can't call them directly:

- **Dev (`npm start`)**: a Vite middleware ([web/devApi.ts](web/devApi.ts)) proxies Deku Deals and SteamGridDB (keeping the SteamGridDB key out of the browser).
- **Production (GitHub Pages)**: Deku Deals lists go through the public CORS proxy `api.allorigins.win`. Cover images are resolved at build time by [web/scripts/prefetch-images.mjs](web/scripts/prefetch-images.mjs) into a static `api/steamgriddb.json` map, so covers only appear for games in the default collection/wishlist, not for custom ones loaded at runtime.

### Local setup

Create a git-ignored `web/.env.local`:

```
VITE_DEKUDEALS_KEY=<your Deku Deals share key>
STEAMGRIDDB_API_KEY=<your SteamGridDB API key>
```

You can generate your SteamGridDB API key here: https://www.steamgriddb.com/profile/preferences
