import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@config": path.resolve(import.meta.dirname, "config"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split big vendors into cacheable chunks (smaller initial public bundle).
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-splide": ["@splidejs/react-splide", "@splidejs/splide-extension-auto-scroll"],
          "vendor-icons": ["lucide-react"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
  server: {
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // In client-only dev (`vite` on :5173) forward API calls to the Express
    // backend on :5001 so the front is wired to the backend. Ignored when the
    // full-stack server runs (Express handles /api before the Vite middleware).
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL || "http://localhost:5001",
        changeOrigin: true,
        secure: true,
        // Rewrite Set-Cookie domain so backend sessions work through the proxy
        // (lets you preview the redesign against the live backend too).
        cookieDomainRewrite: "",
      },
    },
  },
});
