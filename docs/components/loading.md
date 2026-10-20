# Loading 加载

> Loading

加载中状态，支持组件与函数式调用。

## 示例

<nv-loading text="加载中" />

## 用法

```ts
import { loading } from '@nova-ui/components'

const close = loading({ text: '加载中…' })
close() // 关闭
```
