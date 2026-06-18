/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: '#05060f',
          card: 'rgba(13, 15, 30, 0.5)',
          cardHover: 'rgba(20, 23, 45, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        neon: {
          red: '#ff2d55',
          pink: '#ff5fa2',
          blue: '#3b82f6',
          blueLight: '#60a5fa',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 45, 85, 0.2), 0 0 10px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(255, 95, 162, 0.5), 0 0 25px rgba(96, 165, 250, 0.5)' }
        }
      }
    },
  },
  plugins: [],
}
