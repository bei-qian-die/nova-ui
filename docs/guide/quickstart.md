# 快速上手

## 安装

```bash
pnpm add @nova-ui/components
```

## 完整引入

```ts
import { createApp } from 'vue'
import NovaUI from '@nova-ui/components'
import '@nova-ui/components/style.css'

const app = createApp(App)
app.use(NovaUI)
```

## 按需引入（unplugin-vue-components）

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { NovaUiResolver } from '@nova-ui/resolver'

export default {
  plugins: [
    Components({ resolvers: [NovaUiResolver()] })
  ]
}
```

模板中直接写 `<nv-button>` 即可自动导入组件与样式。

## 受控 / 非受控

```vue
<template>
  <nv-input v-model="value" />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
</script>
```

同一个 `v-model` 同时支持受控（父组件显式传入 `modelValue`）与非受控（组件内部兜底）两种用法。