import type { ExtractPropTypes, PropType } from 'vue'

export const tagTypes = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const
export const tagSizes = ['small', 'medium', 'large'] as const

export type TagType = (typeof tagTypes)[number]
export type TagSize = (typeof tagSizes)[number]

export const tagProps = {
  type: { type: String as PropType<TagType>, default: 'default' },
  size: { type: String as PropType<TagSize>, default: 'medium' },
  closable: { type: Boolean, default: false },
  round: { type: Boolean, default: false },
  color: { type: String, default: '' }
} as const

export type TagProps = ExtractPropTypes<typeof tagProps>

export const tagEmits = {
  close: (e: MouseEvent) => e instanceof MouseEvent
} as const

export type TagEmits = typeof tagEmits