import type { Config } from 'tailwindcss';
const colors = require('tailwindcss/colors');

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          light: colors.blue[50],
          DEFAULT: colors.blue[800],
        },
        error: {
          DEFAULT: colors.red[700],
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
