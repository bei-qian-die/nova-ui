import type { ExtractPropTypes, PropType } from 'vue'

export const dividerDirections = ['horizontal', 'vertical'] as const

export type DividerDirection = (typeof dividerDirections)[number]

export const dividerProps = {
  direction: { type: String as PropType<DividerDirection>, default: 'horizontal' },
  dashed: { type: Boolean, default: false }
} as const

export type DividerProps = ExtractPropTypes<typeof dividerProps>