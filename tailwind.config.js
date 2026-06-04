/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./client/index.html',
		'./client/src/**/*.{js,jsx}',
	],
	theme: {
		extend: {
			colors: {
				brand: {
					black: '#0a0a0a',
					white: '#ffffff',
					soft: '#f6f6f4',
				},
			},
			boxShadow: {
				card: '0 22px 44px rgba(0,0,0,0.18)',
			},
		},
	},
	plugins: [],
};
