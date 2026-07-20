import { defineConfig } from 'vite'
import marko from '@marko/run/vite'
export default defineConfig({
  plugins: [marko()],
  server: { allowedHosts: true },
  // Minification OFF so `node inspect.mjs`'s build produces readable client code.
  // Only affects `build`; the dev preview is untouched. (Config lives here in the
  // template on purpose — a vite.config write during Solve would restart vite and
  // drop marko-run's dev router.)
  build: { minify: false },
})
