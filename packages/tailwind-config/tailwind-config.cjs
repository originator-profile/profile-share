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
          600: "#33bfc3",
          700: "#00afb4",
          800: "#008387",
          900: "#00585a",
          DEFAULT: "#000afb4",
        },
        success: {
          extralight: "#f7fee7",
          light: "#84cc16",
          DEFAULT: "#65a30d",
        },
        caution: {
          extralight: "#f9fafb",
          light: "#f9fafb",
          DEFAULT: "#f3f4f6",
        },
        danger: {
          extralight: "#fef2f2",
          light: "#f87171",
          DEFAULT: "#dc2626",
        },
      },
    },
  },
  plugins: [
    ...require("@jumpu-ui/tailwindcss"),
    require("@tailwindcss/typography"),
  ],
};
