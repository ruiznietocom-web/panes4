/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Fuente elegante
      },
      colors: {
        brandOrange: '#F97316', // Puedes usarlo para botones, headers
        brandAmber: '#F59E0B',  // Para destacar elementos
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // Si quieres animaciones elegantes
  ],
}
