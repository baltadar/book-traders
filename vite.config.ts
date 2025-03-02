import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Ensure defineConfig is used correctly
export default defineConfig({
  plugins: [react()],
});
