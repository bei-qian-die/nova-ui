export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export type SelectValue = string | number | boolean | (string | number | boolean)[]

/**
 * Select 是一个泛型组件：`options` 传入什么类型 `T`（`T extends SelectOption`），
 * `modelValue` 的类型就自动收敛为 `T['value']`，`@change` 回调同样拿到精确类型。
 */
export interface SelectProps<T extends SelectOption = SelectOption> {
  modelValue?: T['value'] | T['value'][]
  options: T[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  multiple?: boolean
}

export interface SelectEmits<T extends SelectOption = SelectOption> {
  'update:modelValue': [value: T['value'] | T['value'][] | undefined]
  change: [value: T['value'] | T['value'][] | undefined]
}