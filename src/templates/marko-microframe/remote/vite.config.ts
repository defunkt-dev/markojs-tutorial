import { defineConfig } from 'vite'
import marko from '@marko/run/vite'

// runtimeId isolates the remote app's Marko runtime from the host's, so the two can
// coexist on the same page once the remote's HTML is transcluded in. @marko/vite would
// auto-derive one from the package name; we set it explicitly here (as micro-frame setups do).
export default defineConfig({
  plugins: [marko({ runtimeId: 'mr' })],
  server: { allowedHosts: true },
})
