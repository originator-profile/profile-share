import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";

export default defineConfig({
  plugins: [
    react(),
    copy({
      hook: "writeBundle",
      targets: [{ src: "manifest.json", dest: "dist" }],
    }),
  ],
  build: {
    sourcemap: process.env.NODE_ENV === "development",
    target: "es2015",
  },
});
