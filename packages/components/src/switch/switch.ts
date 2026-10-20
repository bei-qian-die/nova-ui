import type { ExtractPropTypes, PropType } from 'vue'

export const switchSizes = ['small', 'medium', 'large'] as const
export type SwitchSize = (typeof switchSizes)[number]

export const switchProps = {
  modelValue: { type: Boolean as PropType<boolean>, default: undefined },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  activeText: { type: String, default: '' },
  inactiveText: { type: String, default: '' },
  size: { type: String as PropType<SwitchSize>, default: 'medium' }
} as const

export type SwitchProps = ExtractPropTypes<typeof switchProps>

export const switchEmits = {
  'update:modelValue': (value: boolean) => typeof value === 'boolean',
  change: (value: boolean) => typeof value === 'boolean'
} as const

export type SwitchEmits = typeof switchEmits