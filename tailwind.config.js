/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0f0f0f",
        darknav: "#181818"
      }
    }
  },
  plugins: []
};
