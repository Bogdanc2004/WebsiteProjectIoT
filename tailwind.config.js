/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        planta: {
          dark: '#0a0f0d',
          darker: '#060a08',
          surface: '#111916',
          surfaceLight: '#172019',
          card: 'rgba(17, 25, 22, 0.75)',
          cardHover: 'rgba(23, 32, 25, 0.9)',
          glass: 'rgba(17, 25, 22, 0.55)',
          input: 'rgba(10, 15, 13, 0.75)',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        sensor: {
          temp: '#f97316',
          air: '#38bdf8',
          soil: '#a78bfa',
          relay: '#22c55e',
        },
        status: {
          good: '#22c55e',
          warn: '#f59e0b',
          danger: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 25px rgba(34, 197, 94, 0.18)',
        'glow-temp': '0 0 25px rgba(249, 115, 22, 0.22)',
        'glow-air': '0 0 25px rgba(56, 189, 248, 0.22)',
        'glow-soil': '0 0 25px rgba(167, 139, 250, 0.22)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      borderColor: {
        subtle: 'rgba(34, 197, 94, 0.12)',
        medium: 'rgba(34, 197, 94, 0.22)',
        strong: 'rgba(34, 197, 94, 0.38)',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        contentShow: {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        slideDownAndFade: {
          from: { opacity: '0', transform: 'translateY(-4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUpAndFade: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        overlayShow: 'overlayShow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
