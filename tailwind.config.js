/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["'Bebas Neue'", "sans-serif"],
        sans: ["'Bebas Neue'", "sans-serif"],
      },
      colors: {
        primary: "#1F3044", // Azul escuro
      }
    },
  },
  plugins: [],
}
