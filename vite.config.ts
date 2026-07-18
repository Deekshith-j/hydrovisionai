import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({
      server: {
        entry: "server",
      },
    }),
    viteReact(),
  ],
  resolve: {
    alias: {
      "@": `${process.cwd().replace(/\\/g, "/")}/src`,
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: true,
        manualChunks(id: string) {
          // Firebase SDK — split separately for caching
          if (id.includes("node_modules/firebase")) {
            return "vendor-firebase";
          }
          // Recharts charting library
          if (id.includes("node_modules/recharts")) {
            return "vendor-recharts";
          }
          // Leaflet map library
          if (id.includes("node_modules/leaflet") || id.includes("node_modules/react-leaflet")) {
            return "vendor-leaflet";
          }
          // Framer Motion
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer";
          }
          // TanStack Router / Query
          if (id.includes("node_modules/@tanstack")) {
            return "vendor-tanstack";
          }
          // React core
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          // Everything else in node_modules → shared vendor chunk
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
});
