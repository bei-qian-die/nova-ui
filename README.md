# Nova UI

> Vue 3.5 + TypeScript 企业级组件库 monorepo，含 26 个组件、文档站、单元测试、E2E 测试与自动发布。

## 技术栈

- **Vue 3.5** + **TypeScript**（strict）
- **Vite**（library mode 多入口构建 + 按需 chunk）
- **pnpm** monorepo + `catalog:` 统一版本
- **Vitest** + **@vue/test-utils** + **vitest-axe**（单测 + 无障碍 + 覆盖率）
- **Playwright**（E2E）
- **VitePress**（文档站）
- **unplugin-vue-components** + 自研 resolver（全局按需引入）
- **Changesets** + **GitHub Actions**（自动发版）

## 五大核心特性（面试考点）

1. **组件类型推导** — `defineProps<T>()` + 运行时 props 常量（`as const` + `PropType`）+ `ExtractPropTypes`，导出组件实例类型 `InstanceType<typeof NvButton>`。
2. **受控 / 非受控统一** — `useVModel` composable 封装，一套 `v-model` 同时支持受控与非受控。
3. **全局按需引入** — `unplugin-vue-components` + `NovaUiResolver`，每个组件独立 chunk 单独构建。
4. **主题定制** — SCSS 变量（构建期覆盖）+ CSS 变量体系（运行时换肤 `data-theme`）双方案。
5. **无障碍 & 键盘导航** — 焦点管理、ARIA 属性、Esc 关闭、焦点陷阱（`useFocusTrap`）。

## 目录结构

```
nova-ui/
├── packages/
│   ├── components/        # 组件库核心包（26 个组件 + composables + utils + theme）
│   │   └── src/
│   │       ├── button/ icon/ input/ ...   # 每个组件目录：props 常量 + .vue + 单测 + 样式
│   │       ├── composables/               # useVModel / useFocusTrap / useClickOutside / useId
│   │       ├── utils/                     # bem / withInstall / strings
│   │       └── theme/                     # SCSS + CSS 变量主题体系
│   └── resolver/          # unplugin-vue-components 按需引入 resolver
├── docs/                  # VitePress 文档站
├── playground/            # 组件演示（开发服务器）
├── e2e/                   # Playwright E2E 测试
├── .github/workflows/     # CI / 发布
├── start.ps1 / start.bat  # Windows 一键启动
├── start.sh               # macOS/Linux 一键启动
└── pnpm-workspace.yaml    # workspace + catalog 版本
```

## 环境要求

| 依赖 | 版本 |
| --- | --- |
| Node.js | `>= 18.18`（推荐 20+） |
| pnpm | `>= 9` |

安装 pnpm（二选一）：

```bash
corepack enable && corepack prepare pnpm@9 --activate
# 或
npm install -g pnpm@9
```

## 快速开始

### 方式一：一键启动（推荐）

Windows（双击运行，或在 PowerShell 中 `./start.ps1`）：

```powershell
./start.ps1
# 或双击 start.bat
```

macOS / Linux：

```bash
chmod +x start.sh && ./start.sh
```

脚本会依次执行：`pnpm install` → 构建组件库与 resolver → 启动 Playground 开发服务器。

启动后浏览器访问 **http://localhost:5173** 查看组件演示效果。

### 方式二：手动命令

```bash
# 1. 安装依赖
pnpm install

# 2. 构建组件库 + resolver（Playground 依赖构建产物，首次或改动后必须执行）
pnpm --filter @nova-ui/components build
pnpm --filter @nova-ui/resolver build

# 3. 启动 Playground 开发服务器
pnpm dev            # http://localhost:5173
```

> 也可以一步构建全部包：`pnpm build`（turbo 并行构建 components / resolver / playground / docs）。

## 常用命令详解

| 命令 | 说明 |
| --- | --- |
| `pnpm install` | 安装所有依赖（workspace 联动） |
| `pnpm build` | turbo 并行构建所有包 |
| `pnpm build:components` | 只构建组件库 |
| `pnpm dev` | 启动 Playground 开发服务器（组件演示，:5173） |
| `pnpm dev:docs` | 启动 VitePress 文档站（:5173） |
| `pnpm build:docs` | 构建文档站 |
| `pnpm test` | 运行单元测试（turbo） |
| `pnpm test:coverage` | 生成覆盖率报告（阈值 80%） |
| `pnpm e2e` | 运行 Playwright E2E 测试 |
| `pnpm lint` | ESLint 静态检查 |
| `pnpm type-check` | vue-tsc / tsc 类型检查（含类型推导测试） |
| `pnpm size-check` | tree-shaking 后 gzip 体积校验（< 30KB） |

### 主题换肤

Playground 右上角提供一个暗色模式开关，运行时切换 `document.documentElement` 的 `data-theme` 属性即可换肤：

```ts
document.documentElement.setAttribute('data-theme', 'dark') // light 恢复
```

### 按需引入

配合 `unplugin-vue-components` 使用，模板中直接写 `<nv-button>` 即可自动导入，样式按需加载：

```ts
import Components from 'unplugin-vue-components/vite'
import { NovaUiResolver } from '@nova-ui/resolver'

export default {
  plugins: [Components({ resolvers: [NovaUiResolver()] })]
}
```

## 组件列表（26 个）

**基础**：Button、Icon、Tag、Badge、Avatar、Divider、Link、Space
**表单**：Input、Textarea、Checkbox、Radio、Switch、Select、Form + FormItem、Slider、Rate
**数据展示**：Tabs + TabPane、Pagination、Empty
**反馈**：Tooltip、Modal、Drawer、Message、Loading、Alert

## CI / CD

- `.github/workflows/ci.yml`：type-check → lint → 单测 → 构建 → E2E → 体积校验，全流程 < 3min。
- `.github/workflows/release.yml`：Changesets 检测变更、发版并发布到 npm。

## 可量化指标

- tree-shaking 后 gzip 体积 **< 30KB**（`pnpm size-check` 校验）
  - 口径：**Vue 外置（peer 依赖）、含组件 CSS**，生产环境打包后 gzip
  - 全量引入 `app.use(NovaUI)`：**20.5 KB**
  - 手动/自动按需（Button + Input + Modal 三组件）：**5.6 KB**
- 单测覆盖率 **> 80%**（`pnpm test:coverage` 校验）
- CI 全流程 **< 3min**