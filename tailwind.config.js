/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canton: {
          dark: '#0a0e1a',
          darker: '#060910',
          card: '#0f1629',
          border: '#1e2d4a',
          accent: '#3b82f6',
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
          text: '#e2e8f0',
          muted: '#64748b',
        }
      }
    },
  },
  plugins: [],
}