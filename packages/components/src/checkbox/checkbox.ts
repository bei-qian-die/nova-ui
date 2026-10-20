import type { ExtractPropTypes, PropType } from 'vue'

export const checkboxProps = {
  modelValue: { type: [Boolean, Array] as PropType<boolean | (string | number)[]>, default: undefined },
  value: { type: [String, Number] as PropType<string | number>, default: '' },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false }
} as const

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>

export const checkboxEmits = {
  'update:modelValue': (value: boolean | (string | number)[]) =>
    typeof value === 'boolean' || Array.isArray(value),
  change: (value: boolean | (string | number)[]) =>
    typeof value === 'boolean' || Array.isArray(value)
} as const

export type CheckboxEmits = typeof checkboxEmits