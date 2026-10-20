import type { ExtractPropTypes, PropType } from 'vue'

export const spaceDirections = ['horizontal', 'vertical'] as const
export const spaceAligns = ['start', 'center', 'end', 'baseline'] as const

export type SpaceDirection = (typeof spaceDirections)[number]
export type SpaceAlign = (typeof spaceAligns)[number]

export const spaceProps = {
  direction: { type: String as PropType<SpaceDirection>, default: 'horizontal' },
  size: { type: [String, Number] as PropType<string | number>, default: 'small' },
  wrap: { type: Boolean, default: false },
  align: { type: String as PropType<SpaceAlign>, default: 'center' }
} as const

export type SpaceProps = ExtractPropTypes<typeof spaceProps>