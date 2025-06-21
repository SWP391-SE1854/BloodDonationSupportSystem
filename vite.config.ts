import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 8080,
    strictPort: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5081',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://localhost:8080');
            proxyReq.setHeader('Access-Control-Request-Method', 'GET,POST,PUT,DELETE,OPTIONS');
            proxyReq.setHeader('Access-Control-Request-Headers', 'Content-Type,Authorization');
          });
        }
      }
    },
    hmr: {
      overlay: true
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    minify: "esbuild",
    target: "esnext",
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ["react", "react-dom"]
  }
});
