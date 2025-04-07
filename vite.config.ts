import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import prism from "vite-plugin-prismjs";

export default defineConfig({
  plugins: [
    react(),
    prism({
      languages: ["javascript", "css", "html", "typescript", "python", "java"],
      theme: "tomorrow",
      css: true,
    }),
  ],
  // server: {
  //   proxy: {
  //     "/api": {
  //       // target: "https://inspireink-3lx5.onrender.com", // Change this to your backend URL
  //       target: "https://inspireink-3lx5.onrender.com",
  //       changeOrigin: true,
  //       secure: true,
  //       rewrite: (path) => path.replace(/^\/api/, "/api"),
  //     },
  //   },
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
