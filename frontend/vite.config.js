import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || "5173", 10);
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || "5000", 10);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: FRONTEND_PORT,
    proxy: {
      "/api": {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
});
