/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:    { 950: '#030712', 900: '#0F172A', 800: '#1E293B', 700: '#334155', 600: '#475569', 500: '#64748B', 400: '#94A3B8', 300: '#CBD5E1' },
        blue:    { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A' },
        cyan:    { 50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63' },
        slate:   { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
        success: { 50: '#EFF6FF', 100: '#DBEAFE', 500: '#2563EB', 600: '#1D4ED8', 700: '#1E40AF' }, // Remapped to professional enterprise blue
        warning: { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 600: '#D97706', 700: '#B45309' },
        error:   { 50: '#FEF2F2', 100: '#FEE2E2', 500: '#EF4444', 600: '#DC2626', 700: '#B91C1C' },
        amber:   { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 600: '#D97706' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'xs':          '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'sm':          '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card':        '0 1px 3px 0 rgb(15 23 42 / 0.05), 0 1px 2px -1px rgb(15 23 42 / 0.05)',
        'card-hover':  '0 8px 24px -4px rgb(15 23 42 / 0.10), 0 4px 8px -2px rgb(15 23 42 / 0.06)',
        'button':      '0 1px 2px 0 rgb(15 23 42 / 0.06)',
        'button-hover':'0 4px 14px -2px rgb(37 99 235 / 0.35)',
        'sidebar':     '1px 0 0 0 #E2E8F0',
        'modal':       '0 20px 60px -10px rgb(15 23 42 / 0.25)',
        'dropdown':    '0 8px 24px -4px rgb(15 23 42 / 0.12), 0 2px 8px -2px rgb(15 23 42 / 0.06)',
        'glow-navy':   '0 0 20px -4px rgb(15 23 42 / 0.35)',
        'glow-blue':   '0 0 20px -2px rgba(37, 99, 235, 0.40)',
        'glow-cyan':   '0 0 20px -2px rgba(6, 182, 212, 0.40)',
        'inner-sm':    'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '2xs':         '0 1px 2px 0 rgb(0 0 0 / 0.03)',
      },
      borderRadius: {
        'xs':   '0.125rem',
        'sm':   '0.25rem',
        DEFAULT:'0.375rem',
        'md':   '0.5rem',
        'lg':   '0.75rem',
        'xl':   '1rem',
        '2xl':  '1.25rem',
        '3xl':  '1.5rem',
      },
      animation: {
        'fade-in':        'fadeIn 0.4s ease-out both',
        'slide-up':       'slideUp 0.4s ease-out both',
        'slide-down':     'slideDown 0.3s ease-out both',
        'slide-in-right': 'slideInRight 0.4s ease-out both',
        'scale-in':       'scaleIn 0.3s ease-out both',
        'shimmer':        'shimmer 1.6s linear infinite',
        'pulse-soft':     'pulseSoft 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'progress-fill':  'progressFill 1s ease-out both',
        'bounce-subtle':  'bounceSubtle 0.6s ease-out both',
        'count-up':       'countUp 0.8s ease-out both',
        'spin-slow':      'spin 3s linear infinite',
        'dot-pulse':      'dotPulse 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--target-width, 100%)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dotPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.7' },
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        'gradient-card': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        'gradient-blue': 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
        'gradient-navy': 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      },
    },
  },
  plugins: [],
}
