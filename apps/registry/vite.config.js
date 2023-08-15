import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import generouted from "@generouted/react-router/plugin";

export default defineConfig({
  root: join(
    dirname(fileURLToPath(new URL(import.meta.url))),
    "../../packages/registry-ui",
  ),
  plugins: [react(), generouted()],
});
