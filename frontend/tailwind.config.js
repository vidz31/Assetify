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
        background: '#070709',
        surface: {
          DEFAULT: '#111115',
          elevated: '#1a1a22',
          card: 'rgba(22, 22, 28, 0.45)',
          glass: 'rgba(18, 18, 24, 0.65)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.07)',
          glowing: 'rgba(16, 185, 129, 0.25)',
          gold: 'rgba(212, 175, 55, 0.25)',
        },
        luxury: {
          gold: '#dfb75c',
          emerald: '#10b981',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          charcoal: '#18181b',
        },
        text: {
          primary: '#f4f4f7',
          secondary: '#a1a1aa',
          muted: '#71717a',
          gold: '#dfb75c',
          emerald: '#34d399',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-radial': 'radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(223,183,92,0.15) 0%, rgba(0,0,0,0) 70%)',
        'emerald-glow': 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(0,0,0,0) 70%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
        'neon-emerald': '0 0 15px rgba(16, 185, 129, 0.45)',
        'neon-gold': '0 0 15px rgba(223, 183, 92, 0.45)',
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 5px rgba(16, 185, 129, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
