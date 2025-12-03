import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@config": "/src/config",
      "@constants": "/src/constants",
      "@context": "/src/context",
      "@features": "/src/features",
      "@hooks": "/src/hooks",
      "@layouts": "/src/layouts",
      "@pages": "/src/pages",
      "@styles": "/src/styles",
      // "@types": "/src/types",
      "@utils": "/src/utils",
    },
  },
});
