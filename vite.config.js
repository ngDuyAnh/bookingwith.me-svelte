import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from "path"
import removeConsole from "vite-plugin-svelte-console-remover";

export default defineConfig({
	plugins: [sveltekit(), removeConsole()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	build: {
		chunkSizeWarningLimit: 1000,
	},

	resolve: {
		alias: {
			'$lib': path.resolve('./src/lib/')
		},
	}
});
