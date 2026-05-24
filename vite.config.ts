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
    port: 5093,
    host: "http://195.35.6.13",
    // port: 5005,

    // host: "195.35.6.13", // bayzid
    // port: 5000,
    allowedHosts: ["http://195.35.6.13:4177","http://195.35.6.13:5093"]
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'recharts']
        }
      }
    }
  }
})
