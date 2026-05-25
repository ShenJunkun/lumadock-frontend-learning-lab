/// <reference types="vitest" />
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vitest/config";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const shouldAnalyze = process.env.BUNDLE_ANALYZE === "true";

export default defineConfig({
  plugins: [
    vue(),
    shouldAnalyze &&
      visualizer({
        brotliSize: true,
        filename: "dist/bundle-report.html",
        gzipSize: true,
        open: false,
        template: "treemap",
      }),
  ],
  root: appRoot,
  resolve: {
    alias: {
      "@lumadock/api-client": fileURLToPath(
        new URL("../../packages/api-client/src/index.ts", import.meta.url),
      ),
      "@lumadock/ui-vue": fileURLToPath(
        new URL("../../packages/ui-vue/src/index.ts", import.meta.url),
      ),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5174,
  },
  preview: {
    host: "127.0.0.1",
    port: 4174,
  },
  test: {
    css: true,
    environment: "jsdom",
    exclude: ["node_modules/**", "dist/**", "e2e/**"],
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
