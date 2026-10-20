# Form 表单

> Form

表单容器，配合 FormItem 实现校验。

## 示例

<nv-form :model="{ name: 'Nova' }"><nv-form-item label="名称" prop="name"><nv-input placeholder="请输入名称" /></nv-form-item></nv-form>

## 用法

```vue
<nv-form :model="model" :rules="rules">
  <nv-form-item label="名称" prop="name"><nv-input v-model="model.name" /></nv-form-item>
</nv-form>
```
