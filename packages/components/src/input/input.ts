import type { ExtractPropTypes, PropType } from 'vue'

export const inputSizes = ['small', 'medium', 'large'] as const
export const inputTypes = ['text', 'password', 'number'] as const

export type InputSize = (typeof inputSizes)[number]
export type InputType = (typeof inputTypes)[number]

export const inputProps = {
  modelValue: { type: [String, Number] as PropType<string | number> },
  type: { type: String as PropType<InputType>, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  showPassword: { type: Boolean, default: false },
  size: { type: String as PropType<InputSize>, default: 'medium' },
  maxlength: { type: Number },
  label: { type: String, default: '' }
} as const

export type InputProps = ExtractPropTypes<typeof inputProps>

export const inputEmits = {
  'update:modelValue': (value: string | number) =>
    typeof value === 'string' || typeof value === 'number',
  input: (value: string | number) => typeof value === 'string' || typeof value === 'number',
  change: (value: string | number) => typeof value === 'string' || typeof value === 'number',
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  clear: () => true
} as const

export type InputEmits = typeof inputEmits