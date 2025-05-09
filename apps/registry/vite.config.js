// @ts-check
// @ts-expect-error Missing Type Declarations for @fastify/vite/plugin. See https://github.com/fastify/fastify-vite/issues/268 for tracking.
import fastify from "@fastify/vite/plugin";
import generouted from "@generouted/react-router/plugin";
import react from "@vitejs/plugin-react";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultClientConditions, defineConfig } from "vite";

const REGISTRY_UI_ROOT = resolve(
  join(
    dirname(fileURLToPath(new URL(import.meta.url))),
    "../../packages/registry-ui",
  ),
);

const {
  APP_URL = "/",
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  REGISTRY_OPS,
  VITE_AUTH0_AUDIENCE,
  VITE_AUTH0_DOMAIN,
  VITE_AUTH0_CLIENT_ID,
  VITE_REGISTRY_OPS,
} = process.env;

// See also packages/registry-ui/README.md
process.env.VITE_AUTH0_DOMAIN = AUTH0_DOMAIN ?? VITE_AUTH0_DOMAIN;
process.env.VITE_AUTH0_AUDIENCE = APP_URL ?? VITE_AUTH0_AUDIENCE;
process.env.VITE_AUTH0_CLIENT_ID = AUTH0_CLIENT_ID ?? VITE_AUTH0_CLIENT_ID;
process.env.VITE_REGISTRY_OPS = REGISTRY_OPS ?? VITE_REGISTRY_OPS;

export default defineConfig({
  // NOTE: @fastify/vite@6.0.7 以降パス以外を指定するとproductionでの起動に失敗する
  // see https://github.com/fastify/fastify-vite/pull/153
  base: URL.canParse(APP_URL) ? new URL(APP_URL).pathname : APP_URL,
  root: REGISTRY_UI_ROOT,
  resolve: {
    conditions: [...defaultClientConditions, "typescript"],
  },
  plugins: [
    fastify({ spa: true }),
    react(),
    generouted({
      source: {
        routes: `${REGISTRY_UI_ROOT}/src/pages/**/[\\w[-]*.{jsx,tsx}`,
        modals: `${REGISTRY_UI_ROOT}/src/pages/**/[+]*.{jsx,tsx}`,
      },
      output: `${REGISTRY_UI_ROOT}/src/router.ts`,
    }),
  ],
});
