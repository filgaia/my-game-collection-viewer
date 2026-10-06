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

Game covers come from each game's Deku Deals page (its `og:image`, hosted on `cdn.dekudeals.com`) and need no API key:

- **Default share key**: covers (including games only mentioned in "Unlocks" notes) are resolved at build time by [web/scripts/prefetch-covers.mjs](web/scripts/prefetch-covers.mjs) into a static `covers.json`, so they load instantly. The build step takes a few minutes because Deku Deals rate-limits requests.
- **Custom keys** (Load your own): covers are looked up in the browser as cards appear, through the public CORS proxy, with a timeout, retries, and a `localStorage` cache. This is slower and can fail when the proxy is down; failures are retried on the next render.

Games Deku Deals doesn't have show a placeholder.

### Local setup

Create a git-ignored `web/.env.local`:

```
VITE_DEKUDEALS_KEY=<your Deku Deals share key>
```
