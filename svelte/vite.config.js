import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { Server } from 'socket.io';


export default defineConfig({
	plugins: [sveltekit(),
		{
			name: 'websocket-plugin',
			configureServer(server) {
				const io = new Server(server.httpServer);
				io.on('connect', socket => {
					socket.emit('eventFromServer', 'Hello World');
				});
			}
		}
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});