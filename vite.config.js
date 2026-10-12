import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Existing CRA sources use JSX inside .js files
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("/node_modules/")) return undefined;

          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
            return "react-vendor";
          }
          if (/\/node_modules\/(react-router|react-router-dom|@remix-run\/router)\//.test(id)) {
            return "router-vendor";
          }
          if (/\/node_modules\/(?:@radix-ui|cmdk|react-day-picker)\//.test(id)) {
            return "ui-vendor";
          }
          if (/\/node_modules\/(?:recharts|d3-[^/]+)\//.test(id)) {
            return "charts-vendor";
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
});

