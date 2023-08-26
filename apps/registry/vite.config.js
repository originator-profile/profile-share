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

/** @type import("vite").UserConfig */
export default defineConfig({
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
