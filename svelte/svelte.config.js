import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    adapter: adapter({
      routes: {
        include: ['/*'],
        //exclude: ['<all>']
      }
    }),

    /*
    csrf: {
      checkOrigin: false,
    }
    */
  },

  preprocess: [vitePreprocess({})],
};

export default config;
