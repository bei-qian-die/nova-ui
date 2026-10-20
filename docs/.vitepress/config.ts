import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Nova UI',
  description: 'Vue 3.5 + TypeScript 企业级组件库',
  lang: 'zh-CN',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/' }
    ],
    sidebar: {
      '/guide/': [
        { text: '介绍', link: '/guide/introduction' },
        { text: '快速上手', link: '/guide/quickstart' },
        { text: '主题定制', link: '/guide/theming' },
        { text: '无障碍', link: '/guide/a11y' }
      ],
      '/components/': [
        { text: '总览', link: '/components/' },
        { text: 'Button 按钮', link: '/components/button' },
        { text: 'Input 输入框', link: '/components/input' },
        { text: 'Switch 开关', link: '/components/switch' },
        { text: 'Modal 对话框', link: '/components/modal' }
      ]
    }
  }
})