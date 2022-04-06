import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
    copy({
      hook: "writeBundle",
      targets: [{ src: "manifest.json", dest: "dist" }],
    }),
  ],
  build: {
    watch: isDev ? {} : undefined,
    sourcemap: isDev,
    target: "es2015",
  },
});
