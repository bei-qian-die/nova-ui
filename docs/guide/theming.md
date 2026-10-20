# 主题定制

Nova UI 采用"双变量"主题体系：

## 1. 运行时换肤（CSS 变量）

所有组件样式基于 `--nv-*` 语义变量，可运行时覆盖：

```ts
import { setTheme, setThemeMode } from '@nova-ui/components'

// 覆盖主色
setTheme({ 'color-primary': '#1668dc' })

// 暗色模式
setThemeMode('dark')
```

内置 `html[data-theme='dark']` 暗色令牌。

## 2. 构建期覆盖（SCSS 变量）

```scss
@use '@nova-ui/components/theme' with (
  $nv-color-primary: #00a86b
);
```

所有 SCSS 变量均以 `!default` 声明，便于编译期主题化。