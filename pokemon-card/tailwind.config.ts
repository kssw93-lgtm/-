import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pokeblue: '#3B4CCA',
        pokeyellow: '#FFDE00',
        pokered: '#FF0000',
      },
    },
  },
  plugins: [],
};

export default config;
