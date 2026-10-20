import type { ExtractPropTypes, PropType } from 'vue'

export const drawerDirections = ['ltr', 'rtl', 'ttb', 'btt'] as const

export type DrawerDirection = (typeof drawerDirections)[number]

export const drawerProps = {
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  direction: { type: String as PropType<DrawerDirection>, default: 'rtl' },
  size: { type: String, default: '300px' },
  showClose: { type: Boolean, default: true },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnEsc: { type: Boolean, default: true }
} as const

export type DrawerProps = ExtractPropTypes<typeof drawerProps>

export const drawerEmits = {
  'update:modelValue': (val: boolean) => typeof val === 'boolean',
  open: () => true,
  close: () => true
} as const

export type DrawerEmits = typeof drawerEmits