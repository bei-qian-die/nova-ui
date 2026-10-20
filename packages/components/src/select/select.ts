import type { ExtractPropTypes, PropType } from 'vue'

export interface SelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export type SelectValue = string | number | boolean | (string | number | boolean)[]

export const selectProps = {
  modelValue: { type: [String, Number, Boolean, Array] as PropType<SelectValue>, default: undefined },
  options: { type: Array as PropType<SelectOption[]>, default: () => [] },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false }
} as const

export type SelectProps = ExtractPropTypes<typeof selectProps>

export const selectEmits = {
  'update:modelValue': (_value: SelectValue | undefined) => true,
  change: (_value: SelectValue | undefined) => true
} as const

export type SelectEmits = typeof selectEmits