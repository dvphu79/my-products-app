import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcssPlugin from '@tailwindcss/vite';
import viteConfigPaths from 'vite-tsconfig-paths';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcssPlugin(),
    viteConfigPaths(),
  ],
})
