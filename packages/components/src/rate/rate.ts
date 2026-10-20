import type { ExtractPropTypes, PropType } from 'vue'

export const rateProps = {
  modelValue: { type: Number as PropType<number> },
  count: { type: Number, default: 5 },
  disabled: { type: Boolean, default: false },
  allowHalf: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false }
} as const

export type RateProps = ExtractPropTypes<typeof rateProps>

export const rateEmits = {
  'update:modelValue': (value: number) => typeof value === 'number',
  change: (value: number) => typeof value === 'number'
} as const

export type RateEmits = typeof rateEmits