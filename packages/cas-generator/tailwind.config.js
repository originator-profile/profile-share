/** @type {import('tailwindcss').Config} */
import JumpuUI from "@jumpu-ui/tailwindcss";
export default {
  content: ["./src/**/*.{html,js,ts,jsx,md,mdx,vue}"],
  theme: {
    extend: {
      jumpu: {
        prefix: "",
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [...JumpuUI],
};
