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

The web app loads your collection and wishlist from the original [Deku Deals](https://www.dekudeals.com/) site:

- https://www.dekudeals.com/collection.json
- https://www.dekudeals.com/wishlist.json

These URLs only work if you are **logged in to Deku Deals**, so the app needs your session cookie to load them. Requests go through a dev-only proxy (`npm start`), which forwards the cookie. If the data cannot be loaded (not logged in, expired session, no cookie), the app falls back to `web/src/data/db.json` and the **Unlocks** tab is disabled.

Create a git-ignored `web/.env.local`:

```
DEKUDEALS_COOKIE=rack.session=<value from your logged-in browser>
STEAMGRIDDB_API_KEY=<your SteamGridDB API key>
```

You can generate your SteamGridDB API key here: https://www.steamgriddb.com/profile/preferences
