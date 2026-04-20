/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        felt: {
          DEFAULT: '#0d4f2a',
          light: '#1a6b3a',
          dark: '#083520',
        },
        card: {
          bg: '#fdf6e3',
          border: '#c9a84c',
          shadow: '#8b6914',
        },
        token: {
          gold: '#f0c040',
          shine: '#fae07a',
          dark: '#b8860b',
        },
        ink: {
          dark: '#1a0e00',
          mid: '#5c3d1e',
          light: '#c9a87a',
        },
      },
      keyframes: {
        'card-in': {
          '0%': { opacity: '0', transform: 'translateY(-40px) rotate(-6deg) scale(0.85)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotate(0deg) scale(1)' },
        },
        'token-drop': {
          '0%': { transform: 'translateY(-20px) scale(1.3)', opacity: '0' },
          '60%': { transform: 'translateY(4px) scale(0.95)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(240,192,64,0)' },
          '50%': { boxShadow: '0 0 0 8px rgba(240,192,64,0.3)' },
        },
        'winner-glow': {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(240,192,64,0.4)' },
          '50%': { boxShadow: '0 0 40px 12px rgba(240,192,64,0.7)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'card-in': 'card-in 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        'token-drop': 'token-drop 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'shake': 'shake 0.4s ease',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'winner-glow': 'winner-glow 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
