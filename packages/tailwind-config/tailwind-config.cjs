/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    ...require("@jumpu-ui/tailwindcss"),
    require("@tailwindcss/typography"),
  ],
};
