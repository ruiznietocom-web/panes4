/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brandOrange: '#F97316',
        brandAmber: '#F59E0B',
        brandDark: '#1E293B',
        brandDarker: '#0F172A',
        bakery: {
          50: '#FDFBF7',
          100: '#F7F2E8',
          200: '#EFE4CE',
          300: '#E2CEAA',
          400: '#D4B483',
          500: '#B8860B',
          600: '#9A6B08',
          700: '#7B4F06',
          800: '#5C3804',
          900: '#3D2403',
          crust: '#8B4513',
          dark: '#1C1917',
          warmGray: '#292524',
        },
        christmasRed: '#B91C1C',
        christmasGreen: '#15803D',
        christmasGold: '#B45309',
        snowWhite: '#F8FAFC',
      },
      boxShadow: {
        'artisan': '0 10px 30px -5px rgba(184, 134, 11, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'artisan-hover': '0 20px 35px -8px rgba(184, 134, 11, 0.2), 0 8px 12px -3px rgba(0, 0, 0, 0.08)',
        'ticket': '0 12px 32px -4px rgba(120, 53, 15, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
