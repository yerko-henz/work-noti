import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/work-noti/",
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
