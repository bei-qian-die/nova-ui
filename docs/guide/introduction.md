# 介绍

Nova UI 是一套从 0 到 1 的 Vue 3.5 + TypeScript 组件库，聚焦企业级需求的以下几个"硬骨头"：

1. **组件类型推导** — 用 TS 泛型 + `defineProps<T>()` 让 props 有完整提示，导出组件实例类型 `InstanceType`。
2. **受控 / 非受控统一** — `v-model` 实现 + `useVModel` 组合式封装。
3. **全局按需引入** — `unplugin-vue-components` 自动导入 + 独立构建（每个组件单独 chunk）。
4. **主题定制** — CSS 变量 + SCSS 变量双方案，支持运行时换肤与构建期覆盖。
5. **无障碍 & 键盘导航** — 焦点管理、ARIA 属性、Esc 关闭、焦点陷阱。

## 技术栈

Vue 3.5 · TypeScript · Vite · pnpm monorepo · Vitest · Playwright · VitePress · Changesets · GitHub Actions