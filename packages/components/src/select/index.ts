import type { ComponentPublicInstance } from 'vue'
import { withInstall } from '../utils/with-install'
import Select from './Select.vue'

export const NvSelect = withInstall(Select)
export default NvSelect

// Select 是泛型组件（<script setup generic>），其 SFC 类型为泛型函数，
// 无法直接 `InstanceType<typeof Select>`；其未暴露任何公共方法，故以 ComponentPublicInstance 标识实例类型。
export type SelectInstance = ComponentPublicInstance

export type { SelectProps, SelectOption, SelectValue, SelectEmits } from './select'