# Select 选择器

> Select

泛型下拉选择器，支持单选 / 多选与键盘导航。

## 示例

<nv-select :options="[{ label: '苹果', value: 'apple' }, { label: '香蕉', value: 'banana' }]" placeholder="请选择" />

## 用法

```vue
<nv-select v-model="value" :options="options" placeholder="请选择" />
```
