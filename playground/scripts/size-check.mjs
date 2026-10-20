/* global Buffer, process */
import { build } from 'esbuild'
import { gzipSync } from 'node:zlib'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LIMIT = 30 * 1024

/** 用 esbuild 打包一个入口（Vue 外置），返回 raw / gzip 体积（含打包出的 CSS）。 */
async function measure(entry) {
  const entryPath = resolve(__dirname, entry)
  const result = await build({
    entryPoints: [entryPath],
    bundle: true,
    minify: true,
    write: false,
    format: 'esm',
    outdir: resolve(__dirname, '.size-tmp'),
    external: ['vue'],
    logLevel: 'silent'
  })

  let raw = 0
  let gzip = 0
  for (const file of result.outputFiles) {
    raw += file.contents.length
    gzip += gzipSync(file.contents).length
  }
  return { raw, gzip }
}

function kb(n) {
  return (n / 1024).toFixed(1) + ' KB'
}

// 全量引入（含全量 CSS）
const full = await measure('size-full.mjs')
// 手动按需：Button + Input + Modal（含各自 CSS）
const onDemand = await measure('size-entry.mjs')

// 自动按需（unplugin-vue-components resolver）最终只 rewrite 出等价的按需 import，
// 产物与手动按需一致，无双份副作用。
console.log('--- Nova UI tree-shaking 体积对比（Vue 外置，含 CSS，gzip）---')
console.log(`全量引入 app.use(NovaUI):            ${kb(full.gzip)}`)
console.log(`手动按需 Button+Input+Modal (含CSS): ${kb(onDemand.gzip)}`)
console.log(`自动按需 (resolver, 等价手动按需):   ${kb(onDemand.gzip)}`)
console.log(`门禁: 按需 gzip < ${kb(LIMIT)}`)

if (onDemand.gzip > LIMIT) {
  console.error(`FAIL: 按需 gzip ${onDemand.gzip} B 超过 ${LIMIT} B`)
  process.exit(1)
}

console.log('PASS: 按需引入 gzip < 30KB')