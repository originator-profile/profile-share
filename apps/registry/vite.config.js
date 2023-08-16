import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import generouted from "@generouted/react-router/plugin";

const REGISTRY_UI_DIRECTORY = "../../packages/registry-ui"

export default defineConfig({
  root: join(
    dirname(fileURLToPath(new URL(import.meta.url))),
    "../../packages/registry-ui",
  ),
  plugins: [react(), generouted({
    source: { routes: `${REGISTRY_UI_DIRECTORY}/src/pages/**/[\\w[-]*.{jsx,tsx}`,
    modals: `${REGISTRY_UI_DIRECTORY}/src/pages/**/[+]*.{jsx,tsx}` },
    output: `${REGISTRY_UI_DIRECTORY}/src/router.ts`,
  })],
});
