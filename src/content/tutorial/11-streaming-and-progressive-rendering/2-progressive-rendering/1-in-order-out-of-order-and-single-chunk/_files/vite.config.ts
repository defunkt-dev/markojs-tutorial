import type { Request, Response } from "express";
import { defineConfig } from "vite";
import marko from "@marko/vite";

export default defineConfig({
  build: {
    ssr: "./src/index.ts",
    sourcemap: true,
    emptyOutDir: false,
  },
  server: {
    port: 3000,
    allowedHosts: true, // accept the WebContainer preview host
  },
  plugins: [
    marko(),
    {
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
