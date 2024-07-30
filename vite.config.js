import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from "path"

export default defineConfig({
	plugins: [sveltekit()],

	// https://github.com/vitejs/vite/discussions/7920
	esbuild: {
		pure: ['console.log', "console.warn"]
	},

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
