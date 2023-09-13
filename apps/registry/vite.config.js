import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import generouted from "@generouted/react-router/plugin";

const REGISTRY_UI_ROOT = resolve(
  join(
    dirname(fileURLToPath(new URL(import.meta.url))),
    "../../packages/registry-ui",
  ),
);

const {
  APP_URL,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  VITE_AUTH0_AUDIENCE,
  VITE_AUTH0_DOMAIN,
  VITE_AUTH0_CLIENT_ID,
} = process.env;

// See also packages/registry-ui/README.md
process.env.VITE_AUTH0_DOMAIN = AUTH0_DOMAIN ?? VITE_AUTH0_DOMAIN;
process.env.VITE_AUTH0_AUDIENCE = APP_URL ?? VITE_AUTH0_AUDIENCE;
process.env.VITE_AUTH0_CLIENT_ID = AUTH0_CLIENT_ID ?? VITE_AUTH0_CLIENT_ID;

/** @type import("vite").UserConfig */
export default defineConfig({
  base: APP_URL,
  root: REGISTRY_UI_ROOT,
  plugins: [
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
