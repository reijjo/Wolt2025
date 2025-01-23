import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**/*", "**/node_modules/**/*", "**/dist/**"],
    coverage: {
      exclude: [
        "e2e/**/*",
        "**/node_modules/**/*",
        "**/dist/**",
        "eslint.config.js",
        "vite.config.ts",
        "src/main.tsx",
      ],
    },
  },
});
