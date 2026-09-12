/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0F2040', 800: '#162B52', 700: '#1E3A6E', 600: '#2D5099', 500: '#3B6CC7' },
        blue: { 50: '#EFF6FF', 100: '#DBEAFE', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB' },
        success: { 50: '#F0FDF4', 500: '#22C55E', 700: '#15803D' },
        warning: { 50: '#FFFBEB', 500: '#F59E0B', 700: '#B45309' },
        error: { 50: '#FEF2F2', 500: '#EF4444', 700: '#B91C1C' },
      }
    },
  },
  plugins: [],
}
