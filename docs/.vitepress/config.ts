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
        {
          text: '基础',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Badge 徽标', link: '/components/badge' },
            { text: 'Avatar 头像', link: '/components/avatar' },
            { text: 'Divider 分割线', link: '/components/divider' },
            { text: 'Link 链接', link: '/components/link' },
            { text: 'Space 间距', link: '/components/space' }
          ]
        },
        {
          text: '表单',
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'Textarea 文本域', link: '/components/textarea' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'Form 表单', link: '/components/form' }
          ]
        },
        {
          text: '数据',
          items: [
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'Rate 评分', link: '/components/rate' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Empty 空状态', link: '/components/empty' }
          ]
        },
        {
          text: '反馈',
          items: [
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Modal 对话框', link: '/components/modal' },
            { text: 'Drawer 抽屉', link: '/components/drawer' },
            { text: 'Message 消息提示', link: '/components/message' },
            { text: 'Loading 加载', link: '/components/loading' },
            { text: 'Alert 警告', link: '/components/alert' }
          ]
        }
      ]
    }
  }
})