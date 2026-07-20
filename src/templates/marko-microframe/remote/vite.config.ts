import { defineConfig } from 'vite'
import marko from '@marko/run/vite'

// runtimeId isolates the remote's Marko runtime from the host's.
// basePathVar makes the remote's built asset URLs come from a variable we set below,
// so we can point them at a path the host serves (see +middleware.js + the host proxy).
export default defineConfig({
  plugins: [marko({ runtimeId: 'mr', basePathVar: '__MY_ASSET_BASE_PATH__' })],
  server: { allowedHosts: true },
})
