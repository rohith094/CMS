/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plat: "#EBECE9",
        plat1: "#d3d3d3",
        plat2: "#dee2e6",
        d0: "#6881A1",
        d1: "#2a6f97",
        d2: "#415A77",
        d3: "#1A2438",
        d4: "#1d3557",
        d5: "#1c2541",
      },
      screens: {
        xs: { max: "350px" },
      },
    },
  },
  plugins: [
  ],
}