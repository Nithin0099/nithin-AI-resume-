import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss({
      // Add custom Tailwind configuration here
      config: {
        theme: {
          extend: {
            // Ensure background opacity utilities are available
            backgroundOpacity: ['responsive', 'hover', 'focus'],
          },
        },
        variants: {
          // Enable background opacity for different states
          backgroundOpacity: ['responsive', 'hover', 'focus'],
        },
      },
    }),
    react(),
  ],
})