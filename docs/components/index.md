# 组件总览

Nova UI 提供 26 个组件：

| 分类 | 组件 |
| --- | --- |
| 基础 | Button、Icon、Tag、Badge、Avatar、Divider、Link、Space |
| 表单 | Input、Textarea、Checkbox、Radio、Switch、Select、Form |
| 数据 | Slider、Rate、Tabs、Pagination、Empty |
| 反馈 | Tooltip、Modal、Drawer、Message、Loading、Alert |

代码示例：

```vue
<nv-button type="primary">按钮</nv-button>
<nv-input v-model="name" placeholder="请输入" />
<nv-switch v-model="open" />
<nv-modal v-model="visible" title="标题">内容</nv-modal>
```