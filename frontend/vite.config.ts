import { defineConfig } from 'vite'

export default defineConfig({
  server: {
	port: 4269,
	host: '0.0.0.0',
	hmr: true,
	watch: {
	  ignored: ['**/node_modules/**', '**/dist/**', '**.json'],
	  usePolling: true,
	},
	proxy: {
	  // Proxy PHP files to PHP server
	  '^/.*\\.php$': {
		target: 'http://localhost:8080',
		changeOrigin: true,
		rewrite: (path) => path
	  }
	}
  },
  preview: {
	port: 4269,
	host: '0.0.0.0'
  },
  optimizeDeps: {
	exclude: []
  },
});