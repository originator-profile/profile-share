// vite.config.ts
import { defineConfig } from "vite";
import path from "path";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [imagetools()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        "ja/index": path.resolve(__dirname, "ja/index.html"),
        "en/index": path.resolve(__dirname, "en/index.html"),
      },
      output: {
        // assets/images の中に元のファイル名で出力
        assetFileNames: "assets/images/[name].[ext]",
      },
    },
  },
});
