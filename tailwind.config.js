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
        christmasRed: '#B91C1C',
        christmasGreen: '#15803D',
        christmasGold: '#B45309',
        snowWhite: '#F8FAFC',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
