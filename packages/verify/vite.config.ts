import { defaultClientConditions, defineConfig } from "vite";

export default defineConfig({
  resolve: {
    conditions: [...defaultClientConditions, "typescript"],
  },
});
