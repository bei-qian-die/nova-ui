import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@nova-ui/components': fileURLToPath(new URL('./src/index.ts', import.meta.url))
    }
  },
  test: {
    typecheck: {
      enabled: true,
      only: true,
      checker: 'vue-tsc',
      tsconfig: './tsconfig.json',
      include: ['type-tests/**/*.test-d.ts']
    }
  }
})