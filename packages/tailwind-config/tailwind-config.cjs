import { orange } from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8fdfd",
          100: "#f1fbfb",
          200: "#e6f8f8",
          300: "#cceff0",
          400: "#99dfe1",
          500: "#66cfd2",
          600: "#00afb4",
          700: "#008488",
          800: "#006d73",
          900: "#00585a",
          950: "#003233",
          DEFAULT: "#008488",
        },
        success: {
          extralight: "#f7fee7",
          light: "#84cc16",
          DEFAULT: "#65a30d",
        },
        caution: {
          extralight: "#fefce8",
          light: "#fde047",
          DEFAULT: "#facc15",
        },
        danger: {
          extralight: "#fef2f2",
          light: "#f87171",
          DEFAULT: "#b80000",
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
