/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*,{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pasti: "#8257e6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
