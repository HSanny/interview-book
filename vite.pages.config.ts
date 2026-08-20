import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "static",
  base: "/interview-book/",
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../site-dist",
    emptyOutDir: true,
  },
});
