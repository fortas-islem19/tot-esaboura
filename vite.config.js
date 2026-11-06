import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the build works on Vercel, Netlify,
// GitHub Pages (project sub-path) or any static host without changes.
export default defineConfig({
  base: './',
  plugins: [react()],
})
