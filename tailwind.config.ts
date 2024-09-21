import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      animation: {
        blink: 'blink 1s infinite',
        blinkReverse: 'blinkReverse 1s infinite',
      },
      keyframes: {
        blink: {
          '0%': { opacity: '1' },
          '49%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        blinkReverse: {
          '0%': { color: 'black' },
          '49%': { color: 'black' },
          '50%': { color: '#bcbec4' },
          '100%': { color: '#bcbec4' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
