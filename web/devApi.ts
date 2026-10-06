import type { Plugin } from "vite";

const DEKU_ORIGIN = "https://www.dekudeals.com";

// Dev-only middleware: proxies public Deku Deals lists and item pages (no CORS headers on the site).
export default function devApi(): Plugin {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server) {
      const send = (res: any, status: number) => {
        res.statusCode = status;
        res.end();
      };

      server.middlewares.use(async (req: any, res: any, next) => {
        const url = new URL(req.url || "", "http://localhost");
        const match = url.pathname.match(/\/api\/dekudeals\/(.+)$/);
        if (!match) return next();

        const allowed = /^(?:(?:collection|wishlist)\/[A-Za-z0-9]+\.json|items\/[A-Za-z0-9-]+|search)$/;
        if (!allowed.test(match[1])) return send(res, 404);

        try {
          const response = await fetch(`${DEKU_ORIGIN}/${match[1]}${match[1] === "search" ? url.search : ""}`);
          res.statusCode = response.status;
          res.setHeader("Content-Type", response.headers.get("content-type") || "text/plain");
          res.end(await response.text());
        } catch {
          send(res, 502);
        }
      });
    },
  };
}
