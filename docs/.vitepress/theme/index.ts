import DefaultTheme from 'vitepress/theme'
import NovaUI from '@nova-ui/components'
import '@nova-ui/components/style.css'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(NovaUI)
  }
} satisfies Theme