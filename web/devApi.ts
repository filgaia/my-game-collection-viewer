import type { Plugin } from "vite";
import { loadEnv } from "vite";
import SGDB from "steamgriddb";

const DEKU_ORIGIN = "https://www.dekudeals.com";

// Dev-only middleware: proxies the public Deku Deals lists (no CORS) and hides the SteamGridDB key.
export default function devApi(): Plugin {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir || server.config.root, "");
      const grid = env.STEAMGRIDDB_API_KEY ? new SGDB(env.STEAMGRIDDB_API_KEY) : null;
      const imageCache = new Map<string, string | null>();

      const send = (res: any, status: number, body: unknown) => {
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      };

      server.middlewares.use(async (req: any, res: any, next) => {
        const url = new URL(req.url || "", "http://localhost");
        const match = url.pathname.match(/\/api\/(dekudeals|steamgriddb)\/(.+)$/);
        if (!match) return next();

        try {
          if (match[1] === "dekudeals") {
            const deku = match[2].match(/^(collection|wishlist)\/([A-Za-z0-9]+)\.json$/);
            if (!deku) return send(res, 404, {});
            const response = await fetch(`${DEKU_ORIGIN}/${deku[1]}/${deku[2]}.json`, {
              headers: { Accept: "application/json" },
            });
            const type = response.headers.get("content-type") || "";
            if (!response.ok || !type.includes("json")) return send(res, response.status === 404 ? 404 : 502, {});
            res.setHeader("Content-Type", "application/json");
            res.end(await response.text());
            return;
          }

          const name = url.searchParams.get("name");
          if (!grid || !name) return send(res, 404, {});
          if (!imageCache.has(name)) {
            const [game] = await grid.searchGame(name);
            const [image] = game
              ? await grid.getGrids({ type: "game", id: game.id, dimensions: ["460x215", "920x430"] })
              : [];
            imageCache.set(name, image ? String(image.url) : null);
          }
          const imageUrl = imageCache.get(name);
          return send(res, imageUrl ? 200 : 404, { url: imageUrl });
        } catch {
          send(res, 502, {});
        }
      });
    },
  };
}



