import { orange } from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F8FDFD",
          100: "#F1FBFB",
          200: "#E6F8F8",
          300: "#CCEFF0",
          400: "#99DFE1",
          500: "#66CFD2",
          600: "#00AFB4",
          700: "#008488",
          800: "#006D73",
          900: "#00585A",
          950: "#003233",
          DEFAULT: "#008488",
        },
        success: {
          extralight: "#F7FEE7",
          light: "#84CC16",
          DEFAULT: "#65A30D",
        },
        caution: {
          extralight: "#FEFCE8",
          light: "#FDE047",
          DEFAULT: "#FACC15",
        },
        danger: {
          extralight: "#FEF2F2",
          light: "#F87171",
          DEFAULT: "#B80000",
        },
        review: orange[700],
      },
    },
  },
  plugins: [
    ...require("@jumpu-ui/tailwindcss"),
    require("@tailwindcss/typography"),
  ],
};
