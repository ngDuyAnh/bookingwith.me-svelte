import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from 'amplify-adapter';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    adapter: adapter(),

    csrf: {
      checkOrigin: false,
    }
  },

  preprocess: [vitePreprocess({})],
};

export default config;
