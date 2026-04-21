/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy:     { DEFAULT: '#0E3B43', dark: '#0A2D34', mid: '#18525C' },
        teal:     { DEFAULT: '#028090', dark: '#156064' },
        mint:     '#00A896',
        gold:     { DEFAULT: '#C9A961', dark: '#A58A43' },
        offwhite: '#F8F9FA',
        cream:    '#F4F1EA',
        success:  '#16A34A',
        warn:     '#F59E0B',
        danger:   '#DC2626',
        slate2:   '#64748B',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(14, 59, 67, 0.08)',
      },
      borderRadius: {
        card: '12px',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.55', transform: 'scale(1.2)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(-4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.8s ease-in-out infinite',
        fadeIn: 'fadeIn 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
