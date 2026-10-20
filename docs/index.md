---
layout: home

hero:
  name: Nova UI
  text: Vue 3.5 + TypeScript 组件库
  tagline: 类型完备 · 受控/非受控统一 · 按需引入 · 无障碍
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/quickstart
    - theme: alt
      text: 组件总览
      link: /components/

features:
  - title: 完整类型推导
    details: TS 泛型 + defineProps 运行时常量，导出组件实例类型 InstanceType，IDE 提示完备。
  - title: 受控/非受控统一
    details: useVModel 组合式封装，同一 v-model 同时支持受控与非受控用法。
  - title: 按需引入
    details: unplugin-vue-components 自动导入 + 每个组件独立 chunk，tree-shaking 后 gzip &lt; 30KB。
  - title: 双层主题定制
    details: SCSS 变量（构建期覆盖）+ CSS 变量（运行时换肤与暗色模式）。
  - title: 无障碍 & 键盘导航
    details: 焦点陷阱、ARIA 属性、Esc 关闭、Tab/方向键导航，覆盖 Modal/Drawer/Select/Tabs。
  - title: 单测 & E2E & CI
    details: Vitest + axe + Playwright + Changesets + GitHub Actions，覆盖率 &gt; 80%。
---