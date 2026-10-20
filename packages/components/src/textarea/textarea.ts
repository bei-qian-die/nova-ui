import type { ExtractPropTypes, PropType } from 'vue'

export const textareaProps = {
  modelValue: { type: String as PropType<string> },
  rows: { type: Number, default: 3 },
  maxlength: { type: Number },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  showCount: { type: Boolean, default: false },
  label: { type: String, default: '' }
} as const

export type TextareaProps = ExtractPropTypes<typeof textareaProps>

export const textareaEmits = {
  'update:modelValue': (value: string) => typeof value === 'string',
  input: (value: string) => typeof value === 'string',
  change: (value: string) => typeof value === 'string',
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  blur: (e: FocusEvent) => e instanceof FocusEvent
} as const

export type TextareaEmits = typeof textareaEmits