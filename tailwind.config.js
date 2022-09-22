/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "archivo-black": ['"Archivo Black"', "sans-serif"],
        "fredoka-one": ['"Fredoka One"', "cursive"],
      },
    },
  },
  plugins: [],
  darkMode: "media",
};
