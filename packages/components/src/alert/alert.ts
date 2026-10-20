import type { ExtractPropTypes, PropType } from 'vue'

export const alertTypes = ['info', 'success', 'warning', 'error'] as const

export type AlertType = (typeof alertTypes)[number]

export const alertProps = {
  type: { type: String as PropType<AlertType>, default: 'info' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  closable: { type: Boolean, default: false },
  showIcon: { type: Boolean, default: false }
} as const

export type AlertProps = ExtractPropTypes<typeof alertProps>

export const alertEmits = {
  close: () => true
} as const

export type AlertEmits = typeof alertEmits