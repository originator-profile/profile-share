import { ViteUserConfig, defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const tests = {
    test: {
      dir: "tests",
      setupFiles: "tests/setup.ts",
      server: {
        deps: {
          inline: ["@fastify/autoload"],
        },
      },
      pool: "forks",
    },
    e2e: {
      dir: "e2e",
      globalSetup: "e2e/setup.ts",
      testTimeout: 10_000,
      poolOptions: {
        threads: {
          singleThread: true,
        },
      },
    },
  } satisfies Record<string, ViteUserConfig["test"]>;
  const config: ViteUserConfig = {
    ssr: {
      resolve: {
        conditions: ["typescript"],
      },
    },
    test: tests[mode as "test" | "e2e"],
  };
  return config;
});
