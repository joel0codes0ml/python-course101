// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // ensure assets are served correctly on Vercel
  plugins: [react()],
  build: {
    rollupOptions: {
      // You DO NOT want to externalize Firebase for browser builds
      // external: []  <-- remove entirely
    }
  }
});



