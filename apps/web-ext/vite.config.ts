import { defineConfig } from "vite";

export default defineConfig({
  root: "playwright",
  server: {
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
});
