/// <reference types="vitest" />
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    alias: {
      "@": path.resolve("."),
    },
    bail: 1,
    exclude: ["./node_modules"],
  },
});
