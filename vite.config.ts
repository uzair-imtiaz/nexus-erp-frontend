import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@ant-design/plots"],
    exclude: ["@ant-design/plots/es"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          antd: ["antd"],
          lodash: ["lodash"],
        },
      },
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
