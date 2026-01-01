import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "firebase/app",
      "firebase/auth",
      "firebase/firestore"
    ]
  },
  build: {
    rollupOptions: {
      // treat firebase modules as external
      external: [
        "firebase/app",
        "firebase/auth",
        "firebase/firestore"
      ]
    }
  }
});


