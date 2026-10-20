import type { ExtractPropTypes, PropType } from 'vue'

export const tooltipPlacements = ['top', 'bottom', 'left', 'right'] as const
export const tooltipTriggers = ['hover', 'click', 'focus'] as const

export type TooltipPlacement = (typeof tooltipPlacements)[number]
export type TooltipTrigger = (typeof tooltipTriggers)[number]

export const tooltipProps = {
  content: { type: String, default: '' },
  placement: { type: String as PropType<TooltipPlacement>, default: 'top' },
  trigger: { type: String as PropType<TooltipTrigger>, default: 'hover' },
  disabled: { type: Boolean, default: false }
} as const

export type TooltipProps = ExtractPropTypes<typeof tooltipProps>