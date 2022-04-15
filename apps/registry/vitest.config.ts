import { UserConfig, defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const e2e = mode === "e2e";
  const dir = e2e ? "e2e" : "tests";
  const config: UserConfig = {
    test: {
      dir,
      setupFiles: `${dir}/setup.ts`,
    },
  };
  return config;
});
