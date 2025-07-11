import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // assets/images の中に元のファイル名で出力
        assetFileNames: "assets/images/[name].[ext]",
      },
    },
  },
});
