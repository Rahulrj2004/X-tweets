/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./front/**/*.{html,js}", "./src/**/*.{html}"],
  safelist: [
  "bg-gradient-to-r",
  "from-fuchsia-500",
  "via-pink-500",
  "to-rose-500",
  "ring-2",
  "ring-white/30"
],
  theme: {
    extend: {},
  },
  plugins: [],
}

   