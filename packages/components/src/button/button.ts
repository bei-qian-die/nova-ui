import type { ExtractPropTypes, PropType } from 'vue'

export const buttonSizes = ['small', 'medium', 'large'] as const
export const buttonTypes = ['default', 'primary', 'success', 'warning', 'danger', 'text'] as const
export const buttonNativeTypes = ['button', 'submit', 'reset'] as const

export type ButtonSize = (typeof buttonSizes)[number]
export type ButtonType = (typeof buttonTypes)[number]
export type ButtonNativeType = (typeof buttonNativeTypes)[number]

export const buttonProps = {
  type: { type: String as PropType<ButtonType>, default: 'default' },
  size: { type: String as PropType<ButtonSize>, default: 'medium' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  nativeType: { type: String as PropType<ButtonNativeType>, default: 'button' }
} as const

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

export const buttonEmits = {
  click: (e: MouseEvent) => e instanceof MouseEvent
} as const

export type ButtonEmits = typeof buttonEmits