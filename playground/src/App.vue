<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { message, setTheme, setThemeMode } from '@nova-ui/components'

/* ---------- 主题编辑器 ---------- */
const primary = ref('#1668dc')
const radius = ref(6)
const mode = ref<'light' | 'dark'>('light')
const swatchColors = ['#1668dc', '#7c3aed', '#0f9d58', '#ea580c', '#e11d48', '#0d9488']

function applyTheme(): void {
  setTheme({ 'color-primary': primary.value, 'radius-base': `${radius.value}px` })
  setThemeMode(mode.value)
}
function pickColor(c: string): void {
  primary.value = c
  applyTheme()
}
function setMode(m: 'light' | 'dark'): void {
  mode.value = m
  applyTheme()
}
function onRadiusInput(e: Event): void {
  radius.value = Number((e.target as HTMLInputElement).value)
  applyTheme()
}
const tokenOut = computed(
  () =>
    `:root {\n  --nv-color-primary: ${primary.value};\n  --nv-radius-base: ${radius.value}px;\n}\nhtml[data-theme="${mode.value}"] { /* 语义令牌覆盖 */ }`
)

/* ---------- 表单：受控 / 非受控 ---------- */
const ctrlValue = ref('')
const checked = ref(true)
const city = ref('')

const cities = ['成都', '杭州', '深圳', '西安', '苏州'].map((c) => ({ label: c, value: c }))

/* ---------- Tabs ---------- */
const tab = ref('css')

/* ---------- Modal / Message ---------- */
const modalVisible = ref(false)
function triggerError(): void {
  message.error('删除失败：权限不足')
}
function confirmDelete(): void {
  modalVisible.value = false
  message.success('已删除 1 项')
}

/* ---------- 焦点 / 键盘监视器 ---------- */
const keyLog = ref('—')
const focusLog = ref('body')
const trapLog = ref('false')

function describeEl(el: Element | null): string {
  if (!el || el === document.body) return 'body'
  const id = el.id ? `#${el.id}` : ''
  const get = (n: string) => el.getAttribute?.(n) || ''
  const txt = (el.textContent || get('placeholder') || get('aria-label') || '').trim()
  return `${el.tagName.toLowerCase()}${id}${txt ? ` 「${txt.slice(0, 14)}」` : ''}`
}
function onKeydown(e: KeyboardEvent): void {
  keyLog.value = (e.key === ' ' ? 'Space' : e.key) + (e.shiftKey ? ' + Shift' : '')
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = true
    searchInput.value?.focus()
  }
}
function onFocusin(): void {
  focusLog.value = describeEl(document.activeElement)
  const modal = document.querySelector('.nv-modal')
  trapLog.value = modal && modal.contains(document.activeElement) ? 'true' : 'false'
}

/* ---------- 导航高亮（滚动监听） ---------- */
const sections = ['button', 'form', 'select', 'tabs', 'modal', 'a11y', 'size']
const componentSections = ['button', 'form', 'select', 'tabs', 'modal']
const current = ref('button')
function onScroll(): void {
  const y = window.scrollY + 150
  let id = 'button'
  for (const s of sections) {
    const el = document.getElementById(s)
    if (el && el.getBoundingClientRect().top + window.scrollY <= y) id = s
  }
  current.value = id
}
function isTopActive(t: string): boolean {
  return t === 'button' ? componentSections.includes(current.value) : current.value === t
}
function isSideActive(id: string): boolean {
  return current.value === id
}

/* ---------- 搜索 ---------- */
const searchQuery = ref('')
const searchOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const searchIndex = [
  { id: 'button', label: 'Button 按钮', kw: 'button btn 按钮' },
  { id: 'form', label: 'Input 输入框 / Switch 开关', kw: 'input switch 输入 开关 表单' },
  { id: 'select', label: 'Select 选择器', kw: 'select 选择器 下拉' },
  { id: 'tabs', label: 'Tabs 标签页', kw: 'tabs 标签页' },
  { id: 'modal', label: 'Modal 对话框', kw: 'modal 对话框' },
  { id: 'a11y', label: '无障碍与键盘导航', kw: 'a11y accessibility 无障碍' },
  { id: 'size', label: '包体对比', kw: 'size 包体 体积 按需' },
]
const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return q ? searchIndex.filter((i) => i.label.toLowerCase().includes(q) || i.kw.includes(q)) : searchIndex
})
function jumpTo(id: string): void {
  searchOpen.value = false
  searchQuery.value = ''
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  current.value = id
}
function onSearchKey(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    searchOpen.value = false
    searchInput.value?.blur()
  } else if (e.key === 'Enter' && filtered.value.length) {
    e.preventDefault()
    jumpTo(filtered.value[0].id)
  }
}
function onSearchOutside(e: MouseEvent): void {
  if (!(e.target as HTMLElement).closest('.search')) searchOpen.value = false
}

onMounted(() => {
  applyTheme()
  document.addEventListener('keydown', onKeydown, true)
  document.addEventListener('focusin', onFocusin, true)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onSearchOutside)
  onScroll()
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown, true)
  document.removeEventListener('focusin', onFocusin, true)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onSearchOutside)
})

/* ---------- 代码片段 ---------- */
const buttonTypeSnippet = `export const buttonProps = {
  size: { type: String as PropType<ButtonSize>, default: 'medium' },
  type: { type: String as PropType<ButtonType>, default: 'default' },
  loading: { type: Boolean, default: false },
} as const
export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonInstance = InstanceType<typeof Button>`
const useVModelSnippet = `export function useVModel(props, key, emit, options = {}) {
  const isControlled = () => props[key] !== undefined
  const inner = ref(isControlled() ? props[key] : options.defaultValue)
  watch(() => props[key], v => { if (v !== undefined) inner.value = v })
  return computed({
    get: () => isControlled() ? props[key] : inner.value,
    set: v => {
      if (!isControlled()) inner.value = v
      emit?.(\`update:\${String(key)}\`, v)
    },
  })
}`
const genericSnippet = '<script setup lang="ts" generic="T extends SelectOption, V = T[\'value\']">\n' +
  "defineProps<{ options: T[]; modelValue?: V; multiple?: boolean }>()\n" +
  "defineEmits<{ 'update:modelValue': [value: V]; change: [value: V, option: T] }>()\n" +
  '</' + 'script>'
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div class="logo"><span class="logo-mark">N</span> Nova UI</div>
      <nav class="nav-links">
        <a :class="{ on: isTopActive('button') }" href="#button">组件</a>
        <a :class="{ on: isTopActive('a11y') }" href="#a11y">无障碍</a>
        <a :class="{ on: isTopActive('size') }" href="#size">包体</a>
      </nav>
      <div class="spacer"></div>
      <div class="search">
        <input
          ref="searchInput"
          v-model="searchQuery"
          placeholder="搜索组件…"
          aria-label="搜索组件"
          @focus="searchOpen = true"
          @keydown="onSearchKey"
        />
        <span class="kbd">Ctrl K</span>
        <div v-if="searchOpen" class="search-drop">
          <button v-for="r in filtered" :key="r.id" @mousedown.prevent="jumpTo(r.id)">{{ r.label }}</button>
          <div v-if="!filtered.length" class="search-empty">无匹配结果</div>
        </div>
      </div>
    </header>

    <aside class="sidebar">
      <div class="nav-group">
        <div class="nav-title">指南</div>
        <a class="nav-item" href="#top">快速开始 <span class="en">Getting started</span></a>
        <a class="nav-item">按需引入 <span class="en">On-demand</span></a>
        <a class="nav-item">主题定制 <span class="en">Theme</span></a>
        <a class="nav-item" :class="{ on: isSideActive('a11y') }" href="#a11y">无障碍 <span class="en">A11y</span></a>
      </div>
      <div class="nav-group">
        <div class="nav-title">基础组件 · 8</div>
        <a class="nav-item" :class="{ on: isSideActive('button') }" href="#button">Button 按钮 <span class="en">Button</span></a>
        <a class="nav-item">Icon / Tag / Badge / Avatar / Divider / Link / Space</a>
      </div>
      <div class="nav-group">
        <div class="nav-title">表单组件 · 6</div>
        <a class="nav-item" :class="{ on: isSideActive('form') }" href="#form">Input 输入框 <i class="a11y-dot"></i></a>
        <a class="nav-item" :class="{ on: isSideActive('form') }" href="#form">Switch 开关 <i class="a11y-dot"></i></a>
        <a class="nav-item" :class="{ on: isSideActive('select') }" href="#select">Select 选择器 <i class="a11y-dot"></i></a>
        <a class="nav-item">Checkbox / Radio / Form</a>
      </div>
      <div class="nav-group">
        <div class="nav-title">数据展示 · 5</div>
        <a class="nav-item" :class="{ on: isSideActive('tabs') }" href="#tabs">Tabs 标签页 <i class="a11y-dot"></i></a>
        <a class="nav-item">Table / Pagination / Tooltip / Empty</a>
      </div>
      <div class="nav-group">
        <div class="nav-title">反馈组件 · 5</div>
        <a class="nav-item" :class="{ on: isSideActive('modal') }" href="#modal">Modal 对话框 <i class="a11y-dot"></i></a>
        <a class="nav-item">Drawer / Message / Loading / Alert</a>
      </div>
    </aside>

    <main class="main">
      <section class="hero" id="top">
        <span class="tag ok">v1.2.0 已发布</span>
        <h1 style="margin-top:12px">Nova UI</h1>
        <p class="lead">基于 Vue 3.5 + TypeScript 的企业级组件库。26 个组件，完整的类型推导、受控/非受控状态统一、按需引入、主题定制与无障碍键盘导航。</p>
        <pre style="margin-top:16px">pnpm add @nova-ui/components
# 或配合自动按需
pnpm add -D unplugin-vue-components @nova-ui/resolver</pre>
        <div class="metrics">
          <div class="metric">
            <div class="k">按需引入包体（gzip · 含 CSS）</div>
            <div class="v">5.6<small>KB</small></div>
            <div class="bar"><i style="width:19%"></i></div>
          </div>
          <div class="metric">
            <div class="k">全量引入（gzip · 含 CSS）</div>
            <div class="v">20.5<small>KB</small></div>
            <div class="bar"><i style="width:68%"></i></div>
          </div>
          <div class="metric">
            <div class="k">单测覆盖 / CI 全流程</div>
            <div class="v">93<small>% · &lt;3min</small></div>
            <div class="bar"><i style="width:93%;background:var(--nv-color-success)"></i></div>
          </div>
          <div class="metric">
            <div class="k">axe 无障碍违规</div>
            <div class="v">0<small>项</small></div>
            <div class="bar"><i style="width:100%;background:var(--nv-color-success)"></i></div>
          </div>
        </div>
      </section>

      <section class="section" id="button">
        <h2>Button 按钮 <span class="en">Button</span></h2>
        <p class="lead">props 常量化 + <code>ExtractPropTypes</code>，<code>size</code> / <code>type</code> 全部有字面量联合提示。</p>
        <div class="demo" style="margin-top:14px">
          <nv-button type="primary">主要按钮</nv-button>
          <nv-button>次要按钮</nv-button>
          <nv-button type="danger">危险按钮</nv-button>
          <nv-button type="text">文字按钮</nv-button>
          <nv-button type="primary" size="large">大号</nv-button>
          <nv-button size="small">小号</nv-button>
          <nv-button disabled>禁用</nv-button>
          <nv-button type="primary" loading>加载中</nv-button>
        </div>
        <details>
          <summary>查看类型定义</summary>
          <pre>{{ buttonTypeSnippet }}</pre>
        </details>
      </section>

      <section class="section" id="form">
        <h2>Input 输入框 <span class="en">受控 / 非受控统一</span></h2>
        <p class="lead">同一个组件，传 <code>v-model</code> 即受控；不传 <code>modelValue</code> 时内部 <code>useVModel</code> 自治（非受控）。</p>
        <div class="demo" style="margin-top:14px;align-items:flex-end">
          <div class="field">
            <label>受控模式（v-model）</label>
            <nv-input v-model="ctrlValue" placeholder="输入后看下方回显" />
          </div>
          <div class="field">
            <label>非受控模式（内部自治）</label>
            <nv-input placeholder="不绑定 v-model，组件自己管状态" />
          </div>
          <div class="field">
            <label>双向值回显</label>
            <div class="card" style="padding:8px 12px;font-size:12px">
              受控：<code class="mono">{{ ctrlValue || '—' }}</code>
            </div>
          </div>
        </div>
        <details>
          <summary>查看 useVModel 实现</summary>
          <pre>{{ useVModelSnippet }}</pre>
        </details>

        <h3>Switch 开关 · role="switch" + Space 切换</h3>
        <div class="demo">
          <nv-switch v-model="checked" aria-label="接收通知" />
          <span style="font-size:13px;color:var(--nv-text-soft)">{{ checked ? '已开启' : '已关闭' }}</span>
          <span style="font-size:13px;color:var(--nv-text-mute)">用 Tab 聚焦后按 <span class="kbd">Space</span></span>
        </div>
      </section>

      <section class="section" id="select">
        <h2>Select 选择器 <span class="en">泛型 + 键盘导航</span></h2>
        <p class="lead">泛型组件：<code>options</code> 传什么类型，<code>@change</code> 回调就是什么类型。键盘 <span class="kbd">↑</span> <span class="kbd">↓</span> 移动、<span class="kbd">Enter</span> 选中、<span class="kbd">Esc</span> 关闭并归还焦点。</p>
        <div class="demo" style="margin-top:14px">
          <nv-select v-model="city" :options="cities" placeholder="请选择城市" />
          <span style="font-size:12px;color:var(--nv-text-mute)">当前值：<code class="mono">{{ city ? `"${city}"` : 'undefined' }}</code></span>
        </div>
        <details>
          <summary>查看泛型签名</summary>
          <pre>{{ genericSnippet }}</pre>
        </details>
      </section>

      <section class="section" id="tabs">
        <h2>Tabs 标签页 <span class="en">roving tabindex</span></h2>
        <p class="lead">整个 tablist 只占一个 Tab 停靠点，<span class="kbd">←</span> <span class="kbd">→</span> 在内部移动，<span class="kbd">Home</span> / <span class="kbd">End</span> 跳首尾。</p>
        <div class="card" style="margin-top:14px">
          <nv-tabs v-model="tab">
            <nv-tab-pane label="CSS 变量" name="css">
              运行时换肤：<code>setTheme({ 'color-primary': v })</code>，零请求、零重排代价，适合做主题编辑器。
            </nv-tab-pane>
            <nv-tab-pane label="SCSS 变量" name="scss">
              组件样式统一写作 <code>color: var(--nv-x, $nv-x)</code>：CSS 变量被运行时覆盖，SCSS 变量在构建期被替换，两套方案共存。
            </nv-tab-pane>
            <nv-tab-pane label="构建期覆盖" name="build">
              用户提供 <code>@use '@nova-ui/theme' with ($nv-color-primary: #7c3aed)</code>，由 Vite 插件注入到每个组件样式。
            </nv-tab-pane>
          </nv-tabs>
        </div>
      </section>

      <section class="section" id="modal">
        <h2>Modal 对话框 <span class="en">焦点陷阱 · Esc · 焦点归还</span></h2>
        <p class="lead">打开时焦点进入面板并被困住，背景设为 inert，<span class="kbd">Esc</span> 关闭后焦点自动回到触发按钮。下方监视器会实时记录焦点变化。</p>
        <div class="demo" style="margin-top:14px">
          <nv-button type="primary" @click="modalVisible = true">打开对话框</nv-button>
          <nv-button @click="triggerError">触发错误提示</nv-button>
          <span class="tag ok">role="dialog" + aria-modal="true"</span>
          <span class="tag">aria-labelledby 关联标题</span>
        </div>
      </section>

      <section class="section" id="a11y">
        <h2>无障碍与键盘导航 <span class="en">Accessibility</span></h2>
        <div class="a11y-card" style="margin-top:14px">
          <div class="a11y-head">
            <strong style="font-size:14px">实时焦点 / 键盘监视器</strong>
            <span class="tag ok">axe: 0 violations</span>
            <span class="tag">eslint-plugin-vuejs-accessibility</span>
          </div>
          <dl class="monitor">
            <dt>最近按键</dt><dd id="keyLog">{{ keyLog }}</dd>
            <dt>当前焦点</dt><dd id="focusLog">{{ focusLog }}</dd>
            <dt>焦点在弹层内</dt><dd id="trapLog">{{ trapLog }}</dd>
          </dl>
          <div class="checklist">
            <div><span class="tick">✓</span> Tab / Shift+Tab 边界循环</div>
            <div><span class="tick">✓</span> Esc 关闭并归还焦点</div>
            <div><span class="tick">✓</span> roving tabindex（Tabs/Select）</div>
            <div><span class="tick">✓</span> aria-expanded / aria-controls</div>
            <div><span class="tick">✓</span> useId() 关联 label 与错误提示</div>
            <div><span class="tick">✓</span> aria-live 播报异步状态</div>
            <div><span class="tick">✓</span> 背景 inert + aria-modal</div>
            <div><span class="tick">✓</span> 焦点环可见（focus-visible）</div>
          </div>
        </div>
      </section>

      <section class="section" id="size">
        <h2>包体对比 <span class="en">Tree-shaking</span></h2>
        <div class="card" style="margin-top:14px">
          <div class="sizebars">
            <div class="sizebar">
              <div class="row"><span>全量引入 <code>app.use(NovaUI)</code></span><span class="mono">20.5 KB</span></div>
              <div class="track"><i style="width:100%;background:var(--nv-color-danger)"></i></div>
            </div>
            <div class="sizebar">
              <div class="row"><span>手动按需 · Button + Input + Modal（含 CSS）</span><span class="mono">5.6 KB</span></div>
              <div class="track"><i style="width:27%;background:var(--nv-color-success)"></i></div>
            </div>
            <div class="sizebar">
              <div class="row"><span>自动按需（resolver 解析）</span><span class="mono">5.6 KB</span></div>
              <div class="track"><i style="width:27%;background:var(--nv-color-primary)"></i></div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--nv-text-mute);margin-top:14px">
            口径：生产构建 + gzip，Vue 外置（peer 依赖）、含组件 CSS。由 <code>scripts/size-check.mjs</code> 在 CI 中卡口，超过 30 KB 直接失败。
          </p>
        </div>
      </section>

      <div class="foot">Nova UI · Vue 3.5 + TypeScript · 26 components · MIT License</div>
    </main>

    <aside class="panel">
      <div class="panel-block">
        <h3>主题编辑器</h3>
        <div class="hint">运行时换肤，实时写 CSS 变量</div>
        <div class="swatches">
          <button
            v-for="c in swatchColors"
            :key="c"
            class="swatch"
            :style="{ background: c }"
            :data-on="String(primary === c)"
            :aria-label="c"
            @click="pickColor(c)"
          ></button>
        </div>
      </div>
      <div class="panel-block">
        <h3>圆角</h3>
        <div class="slider-row">
          <span>2</span><input type="range" min="2" max="16" :value="radius" @input="onRadiusInput"><span>16</span>
          <code class="mono" style="width:32px;text-align:right">{{ radius }}px</code>
        </div>
      </div>
      <div class="panel-block">
        <h3>模式</h3>
        <div class="mode-toggle">
          <button :data-on="String(mode === 'light')" @click="setMode('light')">浅色</button>
          <button :data-on="String(mode === 'dark')" @click="setMode('dark')">深色</button>
        </div>
      </div>
      <div class="panel-block">
        <h3>输出变量</h3>
        <div class="hint">可直接复制到你的项目</div>
        <pre class="token-out">{{ tokenOut }}</pre>
      </div>
      <div class="panel-block">
        <h3>文档站</h3>
        <div class="hint" style="margin:0">VitePress · 26 页 · demo 即代码 · Props/Events/Slots/Exposes 五张表自动生成</div>
      </div>
    </aside>
  </div>

  <nv-modal v-model="modalVisible" title="删除确认">
    <p>此操作不可撤销。按 <span class="kbd">Tab</span> 体验焦点陷阱，按 <span class="kbd">Esc</span> 关闭并观察焦点归还。</p>
    <div style="margin-top:16px;display:flex;flex-direction:column;gap:10px">
      <nv-input placeholder="可聚焦元素 1" />
      <nv-input placeholder="可聚焦元素 2" />
    </div>
    <div style="margin-top:20px;display:flex;justify-content:flex-end;gap:10px">
      <nv-button @click="modalVisible = false">取消</nv-button>
      <nv-button type="danger" @click="confirmDelete">确认删除</nv-button>
    </div>
  </nv-modal>
</template>

<style>
:root {
  --nv-color-primary: #1668dc;
  --nv-color-success: #23a55a;
  --nv-color-danger: #e54545;
  --nv-color-warning: #ff9f1a;
  --nv-bg: #ffffff;
  --nv-bg-soft: #f7f8fa;
  --nv-bg-hover: #f2f3f5;
  --nv-border: #e4e6eb;
  --nv-text: #1d2129;
  --nv-text-soft: #4e5969;
  --nv-text-mute: #86909c;
  --nv-radius-base: 6px;
  --nv-font-md: 14px;
  --nv-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
html[data-theme='dark'] {
  --nv-bg: #17171a;
  --nv-bg-soft: #1f1f22;
  --nv-bg-hover: #2a2a2e;
  --nv-border: #2e2e32;
  --nv-text: #e8e8ea;
  --nv-text-soft: #b0b0b6;
  --nv-text-mute: #7a7a82;
  --nv-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: var(--nv-bg-soft);
  color: var(--nv-text);
  font-size: var(--nv-font-md);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
code, .mono { font-family: 'SFMono-Regular', Menlo, Consolas, monospace; }

.app {
  display: grid;
  grid-template-rows: 56px 1fr;
  grid-template-columns: 236px 1fr 288px;
  grid-template-areas: 'top top top' 'side main panel';
  min-height: 100vh;
}
.topbar {
  grid-area: top; background: var(--nv-bg); border-bottom: 1px solid var(--nv-border);
  display: flex; align-items: center; padding: 0 20px; gap: 24px; position: sticky; top: 0; z-index: 40;
}
.sidebar {
  grid-area: side; background: var(--nv-bg); border-right: 1px solid var(--nv-border);
  padding: 20px 12px; overflow-y: auto; position: sticky; top: 56px; height: calc(100vh - 56px);
}
.main { grid-area: main; padding: 28px 32px 80px; max-width: 920px; }
.panel {
  grid-area: panel; background: var(--nv-bg); border-left: 1px solid var(--nv-border);
  padding: 20px 18px; overflow-y: auto; position: sticky; top: 56px; height: calc(100vh - 56px);
}

.logo { display: flex; align-items: center; gap: 9px; font-size: 16px; font-weight: 600; letter-spacing: 0.2px; }
.logo-mark {
  width: 26px; height: 26px; border-radius: 7px; background: var(--nv-color-primary);
  display: grid; place-items: center; color: #fff; font-size: 13px; font-weight: 700;
}
.nav-links { display: flex; gap: 18px; margin-left: 12px; }
.nav-links a { color: var(--nv-text-soft); text-decoration: none; font-size: 13px; padding: 4px 0; }
.nav-links a.on { color: var(--nv-color-primary); font-weight: 500; box-shadow: inset 0 -2px 0 var(--nv-color-primary); }
.spacer { flex: 1; }
.search {
  position: relative;
  width: 220px; height: 32px; border: 1px solid var(--nv-border); border-radius: var(--nv-radius-base);
  background: var(--nv-bg-soft); display: flex; align-items: center; padding: 0 10px;
  color: var(--nv-text-mute); font-size: 12px; gap: 6px;
}
.search input {
  flex: 1; min-width: 0; border: none; background: transparent; outline: none;
  font-size: 12px; font-family: inherit; color: var(--nv-text);
}
.search input::placeholder { color: var(--nv-text-mute); }
.search-drop {
  position: absolute; top: calc(100% + 6px); right: 0; left: 0; z-index: 60;
  background: var(--nv-bg); border: 1px solid var(--nv-border); border-radius: 8px;
  box-shadow: var(--nv-shadow); padding: 5px; overflow: hidden;
}
.search-drop button {
  display: block; width: 100%; text-align: left; padding: 7px 10px; border: none;
  background: transparent; color: var(--nv-text-soft); font-size: 12.5px; font-family: inherit;
  border-radius: 5px; cursor: pointer;
}
.search-drop button:hover { background: var(--nv-bg-hover); color: var(--nv-text); }
.search-empty { padding: 8px 10px; font-size: 12px; color: var(--nv-text-mute); }
.kbd {
  font-size: 11px; border: 1px solid var(--nv-border); border-bottom-width: 2px; border-radius: 4px;
  padding: 0 4px; background: var(--nv-bg); color: var(--nv-text-mute); font-family: monospace;
}

.nav-group { margin-bottom: 18px; }
.nav-title { font-size: 11px; font-weight: 600; color: var(--nv-text-mute); letter-spacing: 0.6px; padding: 0 10px; margin-bottom: 6px; }
.nav-item {
  display: flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: var(--nv-radius-base);
  color: var(--nv-text-soft); font-size: 13px; cursor: pointer; text-decoration: none;
}
.nav-item:hover { background: var(--nv-bg-hover); }
.nav-item.on { background: color-mix(in srgb, var(--nv-color-primary) 10%, transparent); color: var(--nv-color-primary); font-weight: 500; }
.nav-item .en { font-size: 11px; color: var(--nv-text-mute); margin-left: auto; }
.nav-item.on .en { color: var(--nv-color-primary); }
.a11y-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--nv-color-success); flex: none; }

.section { margin-bottom: 38px; scroll-margin-top: 76px; }
h1 { font-size: 28px; font-weight: 600; letter-spacing: -0.3px; }
h2 { font-size: 19px; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
h2 .en { font-size: 13px; font-weight: 400; color: var(--nv-text-mute); }
h3 { font-size: 14px; font-weight: 600; margin: 22px 0 10px; color: var(--nv-text-soft); }
.lead { color: var(--nv-text-soft); margin-top: 8px; max-width: 660px; }
.card { background: var(--nv-bg); border: 1px solid var(--nv-border); border-radius: 12px; padding: 18px; }
.demo {
  background: var(--nv-bg); border: 1px solid var(--nv-border); border-radius: 12px;
  padding: 20px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
}
.demo + details { margin-top: 10px; }
summary { cursor: pointer; font-size: 12px; color: var(--nv-text-mute); padding: 4px 0; }
summary:hover { color: var(--nv-color-primary); }
pre {
  background: var(--nv-bg-soft); border: 1px solid var(--nv-border); border-radius: 8px;
  padding: 12px 14px; overflow-x: auto; font-size: 12px; line-height: 1.75; margin-top: 8px; color: var(--nv-text-soft);
}
.tag {
  display: inline-flex; align-items: center; gap: 4px; font-size: 11px; padding: 2px 8px; border-radius: 20px;
  background: color-mix(in srgb, var(--nv-color-primary) 12%, transparent); color: var(--nv-color-primary);
}
.tag.ok { background: color-mix(in srgb, var(--nv-color-success) 14%, transparent); color: var(--nv-color-success); }

.hero { background: var(--nv-bg); border: 1px solid var(--nv-border); border-radius: 14px; padding: 26px 28px; margin-bottom: 34px; }
.metrics { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
.metric {
  flex: 1; min-width: 150px; border: 1px solid var(--nv-border); border-radius: 10px; padding: 14px 16px;
  background: var(--nv-bg-soft);
}
.metric .k { font-size: 12px; color: var(--nv-text-mute); }
.metric .v { font-size: 22px; font-weight: 600; letter-spacing: -0.5px; margin-top: 2px; }
.metric .v small { font-size: 12px; font-weight: 400; color: var(--nv-text-mute); margin-left: 2px; }
.metric .bar { height: 4px; border-radius: 2px; background: var(--nv-border); margin-top: 10px; overflow: hidden; }
.metric .bar i { display: block; height: 100%; background: var(--nv-color-primary); border-radius: 2px; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 12px; color: var(--nv-text-soft); font-weight: 500; }

.panel h3 { margin: 0 0 4px; color: var(--nv-text); font-size: 14px; }
.panel .hint { font-size: 12px; color: var(--nv-text-mute); margin-bottom: 14px; }
.panel-block { margin-bottom: 24px; }
.swatches { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.swatch { width: 28px; height: 28px; border-radius: 8px; border: 2px solid transparent; cursor: pointer; transition: 0.15s; padding: 0; }
.swatch[data-on='true'] { border-color: var(--nv-text); transform: scale(1.08); }
.slider-row { display: flex; align-items: center; gap: 10px; margin-top: 10px; font-size: 12px; color: var(--nv-text-soft); }
input[type='range'] { flex: 1; accent-color: var(--nv-color-primary); }
.mode-toggle { display: flex; border: 1px solid var(--nv-border); border-radius: 8px; overflow: hidden; margin-top: 10px; }
.mode-toggle button { flex: 1; padding: 7px 0; border: none; background: var(--nv-bg); color: var(--nv-text-soft); font-family: inherit; font-size: 13px; cursor: pointer; }
.mode-toggle button[data-on='true'] { background: var(--nv-color-primary); color: #fff; }
.token-out { font-size: 11px; line-height: 1.8; }

.a11y-card { border: 1px solid var(--nv-border); border-radius: 12px; overflow: hidden; background: var(--nv-bg); }
.a11y-head { display: flex; align-items: center; gap: 8px; padding: 14px 18px; border-bottom: 1px solid var(--nv-border); }
.monitor { display: grid; grid-template-columns: 88px 1fr; gap: 8px 12px; padding: 14px 18px; font-size: 12px; }
.monitor dt { color: var(--nv-text-mute); }
.monitor dd { color: var(--nv-text); font-family: monospace; font-size: 11.5px; word-break: break-all; }
#keyLog { color: var(--nv-color-primary); font-weight: 500; }
.checklist { padding: 4px 18px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; font-size: 12.5px; color: var(--nv-text-soft); }
.checklist div { display: flex; align-items: center; gap: 7px; }
.tick { width: 14px; height: 14px; border-radius: 50%; background: var(--nv-color-success); color: #fff; display: grid; place-items: center; font-size: 9px; flex: none; }

.sizebars { display: flex; flex-direction: column; gap: 12px; margin-top: 6px; }
.sizebar { font-size: 12px; }
.sizebar .row { display: flex; justify-content: space-between; margin-bottom: 5px; color: var(--nv-text-soft); }
.sizebar .track { height: 8px; border-radius: 4px; background: var(--nv-bg-hover); overflow: hidden; }
.sizebar .track i { display: block; height: 100%; border-radius: 4px; }
.foot { text-align: center; color: var(--nv-text-mute); font-size: 12px; padding: 30px 0 10px; }

@media (max-width: 1180px) {
  .app { grid-template-columns: 236px 1fr; grid-template-areas: 'top top' 'side main'; }
  .panel { display: none; }
}
</style>