import { UserConfig, defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const tests = {
    test: {
      dir: "tests",
      setupFiles: "tests/setup.ts",
    },
    e2e: {
      dir: "e2e",
      setupFiles: "e2e/setup.ts",
      testTimeout: 20_000,
    },
  };
  const config: UserConfig = {
    test: tests[mode as "test" | "e2e"],
  };
  return config;
});
