import type { Request, Response } from "express";
import { defineConfig } from "vite";
import marko from "@marko/vite";

export default defineConfig({
  build: {
    ssr: "./src/index.ts",
    sourcemap: true, // Generate sourcemaps for all builds.
    emptyOutDir: false, // Avoid server & client deleting files from each other.
  },
  server: {
    port: 3000,
    allowedHosts: true, // accept the WebContainer preview host
  },
  plugins: [
    marko(),
    {
      // Mount the Express router into Vite's own dev server (no marko-run).
      name: "express-dev-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          try {
            const { router } = (await server.ssrLoadModule(
              "./src/index.ts",
            )) as typeof import("./src/index.ts");
            router(req as Request, res as Response, next);
          } catch (err) {
            next(err);
          }
        });
      },
    },
  ],
});
