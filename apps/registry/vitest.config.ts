import { UserConfig, defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const tests = {
    test: {
      dir: "tests",
      setupFiles: "tests/setup.ts",
      deps: {
        inline: ["@fastify/autoload"],
      },
    },
    e2e: {
      dir: "e2e",
      setupFiles: "e2e/setup.ts",
      testTimeout: 10_000,
      singleThread: true,
    },
  } satisfies Record<string, UserConfig["test"]>;
  const config: UserConfig = {
    test: tests[mode as "test" | "e2e"],
  };
  return config;
});
