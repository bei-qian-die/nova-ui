# Modal 对话框

> Modal

模态对话框，内置焦点陷阱、Esc 关闭与焦点归还。

## 用法

```vue
<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>

<template>
  <nv-button type="primary" @click="visible = true">打开对话框</nv-button>
  <nv-modal v-model="visible" title="对话框标题">
    <p>对话框内容，按 Esc 或点击遮罩关闭。</p>
  </nv-modal>
</template>
```
