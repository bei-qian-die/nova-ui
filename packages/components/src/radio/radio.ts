import type { ExtractPropTypes, PropType } from 'vue'

export type RadioValue = string | number | boolean

export const radioProps = {
  modelValue: { type: [String, Number, Boolean] as PropType<RadioValue>, default: undefined },
  value: { type: [String, Number, Boolean] as PropType<RadioValue>, required: true },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
} as const

export type RadioProps = ExtractPropTypes<typeof radioProps>

export const radioEmits = {
  'update:modelValue': (value: RadioValue) =>
    typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean',
  change: (value: RadioValue) =>
    typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
} as const

export type RadioEmits = typeof radioEmits