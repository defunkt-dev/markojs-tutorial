import { defineConfig } from 'vite'
import marko from '@marko/run/vite'
export default defineConfig({
plugins: [
// basePathVar tells the BUILT server which global to read the CDN base path from.
// It is only consulted by production builds; the dev server serves assets itself.
marko({ basePathVar: '__MY_ASSET_BASE_PATH__' }),
],
server: {
allowedHosts: true,
},
})