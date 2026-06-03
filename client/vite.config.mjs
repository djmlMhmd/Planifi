import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendTarget = process.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default defineConfig({
	root: __dirname,
	base: '/app/',
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: 5173,
		proxy: {
			'/api': backendTarget,
			'/auth': backendTarget,
			'/connexion': backendTarget,
			'/confirm-registration': backendTarget,
			'/forgot-password': backendTarget,
			'/inscription': backendTarget,
			'/profil': backendTarget,
			'/reservation': backendTarget,
			'/resend-registration-mail': backendTarget,
			'/service': backendTarget,
			'/services': backendTarget,
			'/disponibilite': backendTarget,
			'/profile-images': backendTarget,
		},
	},
	build: {
		outDir: path.resolve(__dirname, 'dist'),
		emptyOutDir: true,
	},
});
