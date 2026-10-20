import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const srcDir = resolve(__dirname, 'src')

// 非组件目录（不参与"每个组件单独 chunk"的构建）
const ignored = new Set(['composables', 'utils', 'theme'])

const entries: Record<string, string> = {
  index: resolve(srcDir, 'index.ts')
}

for (const dirent of readdirSync(srcDir, { withFileTypes: true })) {
  if (dirent.isDirectory() && !ignored.has(dirent.name)) {
    entries[dirent.name] = resolve(srcDir, dirent.name, 'index.ts')
  }
}

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
      entryRoot: 'src',
      outDir: 'es',
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['src/**/*.test.ts', 'test/**'],
      insertTypesEntry: true
    })
  ],
  build: {
    lib: { entry: entries, formats: ['es'] },
    minify: 'esbuild',
    outDir: 'es',
    cssCodeSplit: true,
    rollupOptions: {
      external: ['vue'],
      output: {
        // 关键：保留模块结构，保证 tree-shaking 与按需引入
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name].mjs',
        assetFileNames: '[name][extname]'
      }
    }
  }
})