import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NovaUiResolver } from '@nova-ui/resolver'
import { defineConfig } from 'vite'

// 关键：unplugin-vue-components + NovaUiResolver 实现"全局按需引入"
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NovaUiResolver()],
      dts: false
    })
  ]
})