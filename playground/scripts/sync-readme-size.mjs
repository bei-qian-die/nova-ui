/* global process */
/**
 * 把 size-report.json 里的实测体积同步回 README，杜绝文档数字与真实产物漂移。
 *
 * 用法（需先构建出 dist，否则测量的是过期产物）：
 *   pnpm build:components && pnpm size:sync
 *
 * 只替换三处：顶部 gzip badge、"可量化指标"下的全量/按需体积。
 * 数字已经一致时直接输出提示并不改动文件（可安全地在 CI 里做漂移检查）。
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const reportPath = resolve(__dirname, 'size-report.json')
const readmePath = resolve(__dirname, '../../README.md')

if (!existsSync(reportPath)) {
  console.error('找不到 size-report.json，请先执行：pnpm build:components && pnpm size-check')
  process.exit(1)
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'))
// 统一保留一位小数（22.4 / 6.0），与 README 既有排版一致
const fullKb = report.full.kb.toFixed(1)
const onDemandKb = report.onDemand.kb.toFixed(1)

let readme = readFileSync(readmePath, 'utf8')
const before = readme

// 冒号统一用 [:：]（半角 U+003A / 全角 U+FF1A），避免手写全角字符在编辑器里被吞掉
const COLON = '[:\\uFF1A]'

const replacements = [
  // 顶部 badge：![gzip](...gzip-5.8%20kB-brightgreen)
  [/(gzip-)[\d.]+(%20kB-brightgreen)/, `$1${onDemandKb}$2`],
  // 全量引入 app.use(NovaUI)：**22.2 KB**
  [new RegExp('(全量引入 `app\\.use\\(NovaUI\\)`' + COLON + '\\*\\*)[\\d.]+ KB(\\*\\*)'), `$1${fullKb} KB$2`],
  // 手动/自动按需（Button + Input + Modal 三组件）：**5.8 KB**
  [new RegExp('(手动/自动按需（Button \\+ Input \\+ Modal 三组件）' + COLON + '\\*\\*)[\\d.]+ KB(\\*\\*)'), `$1${onDemandKb} KB$2`]
]

const missed = []
for (const [pattern] of replacements) {
  if (!pattern.test(readme)) missed.push(pattern.source)
}
if (missed.length > 0) {
  console.error('README 中未匹配到待替换的体积数字，可能排版已变化：')
  missed.forEach((m) => console.error('  - ' + m))
  process.exit(1)
}

for (const [pattern, replacement] of replacements) {
  readme = readme.replace(pattern, replacement)
}

if (readme === before) {
  console.log(`README 体积数字已是最新（全量 ${fullKb} KB / 按需 ${onDemandKb} KB），无需改动。`)
  process.exit(0)
}

writeFileSync(readmePath, readme, 'utf8')
console.log(`已同步 README 体积数字：全量 ${fullKb} KB / 按需 ${onDemandKb} KB`)
console.log(`（报告生成于 ${report.generatedAt}，门禁 ${report.pass ? 'PASS' : 'FAIL'}）`)
