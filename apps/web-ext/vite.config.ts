import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  // publicDir を playwright フォルダに
  root: "playwright",
  publicDir: path.resolve(__dirname, "playwright/public"),
  server: {
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
});
