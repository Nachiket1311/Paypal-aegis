/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paypal: {
          dark: '#001435',
          navy: '#001C48',
          deep: '#003087',
          blue: '#0070BA',
          light: '#009CDE',
          subtle: '#F0F5FF',
          accent: '#2979FF',
        },
        aegis: {
          slate: '#0F172A',
          dark: '#0B1120',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          electric: '#00D2FF',
          cyan: '#06B6D4',
          emerald: '#10B981',
          emeraldLight: '#ECFDF5',
          amber: '#F59E0B',
          amberLight: '#FFFBEB',
          rose: '#EF4444',
          roseLight: '#FEF2F2',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 48, 135, 0.08), 0 8px 10px -6px rgba(0, 48, 135, 0.04)',
        glow: '0 0 20px -3px rgba(0, 112, 186, 0.25)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.25)',
        'glow-rose': '0 0 20px -3px rgba(239, 68, 68, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
