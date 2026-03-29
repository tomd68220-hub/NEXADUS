import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: '#c0db26',
        dark: '#1a1a1a',
        dark2: '#222222',
        mid: '#444444',
        grey: '#888888',
        light: '#f2f2f0',
      },
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '0',
      },
      fontSize: {
        label: ['0.72rem', { letterSpacing: '0.18em', fontWeight: '700' }],
        overline: ['0.68rem', { letterSpacing: '0.22em', fontWeight: '600' }],
      },
      letterSpacing: {
        widest: '0.22em',
        wider: '0.18em',
      },
    },
  },
  plugins: [],
};

export default config;
