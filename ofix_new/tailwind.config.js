/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
      },
      // Z-Index scale padronizado — usar APENAS esses tokens
      zIndex: {
        'base': '0',
        'raised': '10',
        'sticky': '20',
        'header': '30',
        'sidebar': '25',
        'fab': '40',
        'dropdown': '50',
        'modal-backdrop': '60',
        'modal': '70',
        'toast': '80',
        'max': '9999',
      },
      colors: {
        'primary-blue': '#2563eb',
        'primary-blue-light': '#3b82f6',
        'primary-blue-dark': '#1d4ed8',
        'accent-orange': '#f59e0b',
        // Cores baseadas nas variáveis do index.css
        'background-gradient-start': '#f8fafc',
        'background-gradient-end': '#e0f2fe',
        'card-shadow-color-1': 'rgba(0, 0, 0, 0.1)',
        'card-shadow-color-2': 'rgba(0, 0, 0, 0.06)',
        'card-shadow-hover-color-1': 'rgba(0, 0, 0, 0.1)',
        'card-shadow-hover-color-2': 'rgba(0, 0, 0, 0.05)',
        'nav-item-active-start': '#dbeafe',
        'nav-item-active-end': '#bfdbfe',
        'nav-item-hover-start': '#f8fafc',
        'nav-item-hover-end': '#f1f5f9',
        'blue-gradient-start': '#2563eb',
        'blue-gradient-end': '#1d4ed8',
        'orange-gradient-start': '#f59e0b',
        'orange-gradient-end': '#fbbf24',
        'green-gradient-start': '#22c55e',
        'green-gradient-end': '#16a34a',
        'purple-gradient-start': '#8b5cf6',
        'purple-gradient-end': '#7c3aed',
        'red-gradient-start': '#ef4444',
        'red-gradient-end': '#dc2626',
        'slate-gradient-start': '#64748b',
        'slate-gradient-end': '#475569',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
  ],
}
