/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vitest/config";

const shouldAnalyze = process.env.BUNDLE_ANALYZE === "true";

export default defineConfig({
  plugins: [
    react(),
    shouldAnalyze &&
      visualizer({
        brotliSize: true,
        filename: "dist/bundle-report.html",
        gzipSize: true,
        open: false,
        template: "treemap",
      }),
  ],
  resolve: {
    alias: {
      "@lumadock/api-client": fileURLToPath(
        new URL("../../packages/api-client/src/index.ts", import.meta.url),
      ),
      "@lumadock/ui": fileURLToPath(new URL("../../packages/ui/src/index.ts", import.meta.url)),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
  test: {
    css: true,
    environment: "jsdom",
    exclude: ["node_modules/**", "dist/**", "e2e/**"],
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
