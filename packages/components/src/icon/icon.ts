import type { ExtractPropTypes, PropType } from 'vue'

export const iconNames = [
  'arrow-down',
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'calendar',
  'check',
  'close',
  'delete',
  'edit',
  'error',
  'eye',
  'eye-off',
  'info',
  'loading',
  'minus',
  'plus',
  'refresh',
  'search',
  'star',
  'star-filled',
  'success',
  'user',
  'warning'
] as const

export type IconName = (typeof iconNames)[number]

export const iconProps = {
  name: { type: String, required: true },
  size: { type: [Number, String] as PropType<number | string>, default: '1em' },
  color: { type: String, default: '' },
  spin: { type: Boolean, default: false },
  label: { type: String, default: '' }
} as const

export type IconProps = ExtractPropTypes<typeof iconProps>