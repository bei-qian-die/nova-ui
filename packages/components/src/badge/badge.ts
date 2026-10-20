import type { ExtractPropTypes, PropType } from 'vue'

export const badgeTypes = ['danger', 'primary', 'success', 'warning', 'info'] as const

export type BadgeType = (typeof badgeTypes)[number]

export const badgeProps = {
  value: { type: [Number, String] as PropType<number | string>, default: '' },
  max: { type: Number, default: 99 },
  type: { type: String as PropType<BadgeType>, default: 'danger' },
  dot: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },
  showZero: { type: Boolean, default: true }
} as const

export type BadgeProps = ExtractPropTypes<typeof badgeProps>