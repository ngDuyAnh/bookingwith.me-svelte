import adapter from '@sveltejs/adapter-node';
// import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


export default {
  kit: {
    adapter: adapter(),
    // No direct Vite configuration should be inserted here
    // Only SvelteKit compatible configurations
    csrf: {
      checkOrigin: false,
    }
  },
  preprocess: [vitePreprocess({})],
};


// import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
// // import adapter from '@sveltejs/adapter-cloudflare';
// import adapter from '@sveltejs/adapter-node'
//
// import {Server} from "socket.io";
//
// export const webSocketServer = {
//   name: 'webSocketServer',
//   configureServer(server) {
//     const io = new Server(server.httpServer);
//
//     io.on('connect', (socket)=>{
//       socket.emit('eventFromServer', 'Hello World');
//     })
//   }
// }
//
// /** @type {import('@sveltejs/kit').Config} */
// const config = {
//   kit: {
//     // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
//     adapter: adapter(),
//     vite: {
//       plugins: [webSocketServer]
//     },
//     csrf: {
//       checkOrigin: false,
//     }
//   },
//   preprocess: [vitePreprocess({})],
// };
//
// export default config;
