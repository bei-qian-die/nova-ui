# Button 按钮

## 类型

<nv-space>
  <nv-button>默认</nv-button>
  <nv-button type="primary">主要</nv-button>
  <nv-button type="success">成功</nv-button>
  <nv-button type="warning">警告</nv-button>
  <nv-button type="danger">危险</nv-button>
</nv-space>

## 尺寸

<nv-space>
  <nv-button size="small">小</nv-button>
  <nv-button size="medium">中</nv-button>
  <nv-button size="large">大</nv-button>
</nv-space>

## 状态

<nv-space>
  <nv-button disabled>禁用</nv-button>
  <nv-button loading>加载中</nv-button>
  <nv-button round>圆角</nv-button>
  <nv-button block>块级</nv-button>
</nv-space>

## 类型推导

```ts
import type { ButtonInstance, ButtonProps } from '@nova-ui/components'

// props 完整提示
const props: ButtonProps = { type: 'primary', size: 'large' }

// 实例类型（暴露 focus/blur）
const btn = ref<ButtonInstance>()
btn.value?.focus()
```