import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // host: "10.10.7.52",
    port: 3025,
    // host: "195.35.6.13",
    // port: 5005,

    // host: "195.35.6.13", // bayzid
    // port: 5000,
    allowedHosts: ["https://rimaiziza-dashboard.vercel.app", "dashboard.gogreenmatrix.my", "https://api.gogreenmatrix.my"]
  },
})
