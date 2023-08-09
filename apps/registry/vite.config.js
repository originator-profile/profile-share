import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: join(dirname(fileURLToPath(new URL(import.meta.url))), '../ui'),
  plugins: [react()],
});
