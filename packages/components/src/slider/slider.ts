import type { ExtractPropTypes, PropType } from 'vue'

export const sliderProps = {
  modelValue: { type: Number as PropType<number> },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
  showTooltip: { type: Boolean, default: false }
} as const

export type SliderProps = ExtractPropTypes<typeof sliderProps>

export const sliderEmits = {
  'update:modelValue': (value: number) => typeof value === 'number',
  change: (value: number) => typeof value === 'number'
} as const

export type SliderEmits = typeof sliderEmits