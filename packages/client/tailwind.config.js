/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bunker: {
          950: '#07080c',
          900: '#0b0d12',
          850: '#11141c',
          800: '#171b26',
          700: '#23293a',
          600: '#333b52',
          500: '#4a5573',
          400: '#717f9e'
        },
        hazard: {
          orange: '#ff4c29',
          orangeDark: '#cc3414',
          yellow: '#f59e0b',
          glow: 'rgba(255, 76, 41, 0.4)'
        },
        cyber: {
          cyan: '#06b6d4',
          gold: '#f59e0b',
          green: '#10b981',
          red: '#ef4444'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'hazard-sm': '0 0 10px rgba(255, 76, 41, 0.25)',
        'hazard-lg': '0 0 25px rgba(255, 76, 41, 0.45)',
        'cyber-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'card-glow': '0 10px 30px -10px rgba(0,0,0,0.8)'
      },
      backgroundImage: {
        'hazard-stripes': 'repeating-linear-gradient(45deg, #ff4c29, #ff4c29 10px, #12151f 10px, #12151f 20px)',
        'girih-pattern': 'radial-gradient(circle at 50% 50%, rgba(255,76,41,0.05) 0%, transparent 60%)'
      }
    },
  },
  plugins: [],
}
