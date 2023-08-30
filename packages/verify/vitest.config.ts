import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // TODO: ほんとはPlaywrightを使うような時間のかかるテストはユニットテストから切り出すのがよいかもしれないが未対応。
    hookTimeout: 20_0000,
  },
});
