# Table 表格

> Table

用于展示结构化数据的表格，支持列配置、排序与大数据量虚拟滚动。

## 示例

<nv-table
  :columns="[{ key: 'name', title: '姓名' }, { key: 'age', title: '年龄', sortable: true }]"
  :data="[{ name: '张三', age: 20 }, { name: '李四', age: 25 }, { name: '王五', age: 18 }]"
/>

## 虚拟滚动

设置 `height` 与 `rowHeight` 后，仅渲染可视区域内的行，适合大数据量场景：

```vue
<nv-table
  :columns="columns"
  :data="rows"
  height="320"
  :row-height="48"
/>
```

## 用法

```vue
<nv-table :columns="columns" :data="rows" @sort-change="onSort" />
```