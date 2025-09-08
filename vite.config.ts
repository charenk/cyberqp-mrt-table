import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base for GitHub Pages when deploying to /cyberqp-mrt-table
  base: process.env.GITHUB_ACTIONS ? '/cyberqp-mrt-table/' : '/',
})
