import type { ExtractPropTypes, PropType } from 'vue'

export const tabsTypes = ['line', 'card'] as const

export type TabsType = (typeof tabsTypes)[number]

export const tabsProps = {
  modelValue: { type: [String, Number] as PropType<string | number> },
  type: { type: String as PropType<TabsType>, default: 'line' }
} as const

export type TabsProps = ExtractPropTypes<typeof tabsProps>

export const tabsEmits = {
  'update:modelValue': (name: string | number) => typeof name === 'string' || typeof name === 'number',
  change: (name: string | number) => typeof name === 'string' || typeof name === 'number'
} as const

export type TabsEmits = typeof tabsEmits