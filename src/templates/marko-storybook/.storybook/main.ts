import type { StorybookConfig } from "@storybook/marko-vite";

const config: StorybookConfig = {
  framework: { name: "@storybook/marko-vite", options: {} },
  stories: ["../src/**/*.stories.ts"],

  async viteFinal(config) {
    // Storybook's preview is a Vite dev server, and in this tutorial it is
    // reached through a sandboxed host rather than localhost. Vite blocks
    // unknown hosts by default, so it has to be told this one is fine.
    config.server = { ...config.server, allowedHosts: true };
    return config;
  },
};

export default config;
