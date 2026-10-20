import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as sass from 'sass'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgDir = resolve(__dirname, '..')
const srcDir = resolve(pkgDir, 'src')
const esDir = resolve(pkgDir, 'es')
const distDir = resolve(pkgDir, 'dist')
const themeDir = resolve(pkgDir, 'theme')

const ignored = new Set(['composables', 'utils', 'theme'])

function compileCss(file) {
  return sass.compile(file, { style: 'compressed' }).css
}

const components = readdirSync(srcDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !ignored.has(d.name))
  .map((d) => d.name)

// 1) 逐个组件编译 SCSS -> es/<name>/style/index.css
const componentCss = []
for (const name of components) {
  const scssFile = resolve(srcDir, name, 'style', 'index.scss')
  const outFile = resolve(esDir, name, 'style', 'index.css')
  const css = compileCss(scssFile)
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, css)
  componentCss.push(css)
}

// 2) 主题令牌单独编译 -> theme/index.css
const themeCss = compileCss(resolve(srcDir, 'theme', 'index.scss'))
mkdirSync(themeDir, { recursive: true })
writeFileSync(resolve(themeDir, 'index.css'), themeCss)

// 3) 全量 CSS：直接拼接已编译的 CSS，避免 @use 命名空间冲突
mkdirSync(distDir, { recursive: true })
writeFileSync(resolve(distDir, 'index.css'), [themeCss, ...componentCss].join('\n'))

// 4) 暴露主题 SCSS 源码，供构建期 `@use '@nova-ui/components/theme' with (...)` 覆盖
copyFileSync(resolve(srcDir, 'theme', 'index.scss'), resolve(themeDir, 'index.scss'))
copyFileSync(resolve(srcDir, 'theme', 'variables.scss'), resolve(themeDir, 'variables.scss'))

console.log(`[css] done: ${components.length} components + dist/index.css + theme/`)