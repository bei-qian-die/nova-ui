import type { ExtractPropTypes } from 'vue'

export const modalProps = {
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '520px' },
  showClose: { type: Boolean, default: true },
  closeOnClickModal: { type: Boolean, default: true },
  closeOnEsc: { type: Boolean, default: true }
} as const

export type ModalProps = ExtractPropTypes<typeof modalProps>

export const modalEmits = {
  'update:modelValue': (val: boolean) => typeof val === 'boolean',
  open: () => true,
  close: () => true,
  closed: () => true
} as const

export type ModalEmits = typeof modalEmits