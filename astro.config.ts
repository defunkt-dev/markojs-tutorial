import tutorialkit from '@tutorialkit/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [tutorialkit()],
  vite: {
    optimizeDeps: {
      // codemirror-lang-marko is a local file: package under active
      // development. Excluding it from vite's dependency pre-bundling
      // means edits to it are picked up in dev without deleting
      // node_modules/.vite (the pre-bundle cache is keyed by lockfile,
      // not dependency file contents). Dev-only; production builds are
      // unaffected.
      exclude: ['codemirror-lang-marko'],
    },
  },
});
