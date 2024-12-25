import { defineConfig } from "vite";

/** @type import("vite").UserConfig */
export default defineConfig({
  resolve: { conditions: ["browser", "typescript"] },
});
