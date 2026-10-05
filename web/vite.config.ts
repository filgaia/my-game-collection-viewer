/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import devApi from "./devApi";

export default defineConfig({
  base: "/my-game-collection-viewer/",
  plugins: [react(), devApi()],
  server: { port: 3000, open: true },
  build: { outDir: "build" },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});

