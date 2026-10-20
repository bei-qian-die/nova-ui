import type { ExtractPropTypes, InjectionKey, PropType } from 'vue'

export interface FormRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  validator?: (value: unknown) => boolean | string
}

export type FormRules = Record<string, FormRule[]>

export interface FormFieldInstance {
  prop: string
  validate: () => Promise<boolean>
  clearValidate: () => void
}

export interface FormContext {
  model: Record<string, unknown>
  rules: FormRules
  labelWidth: string
  registerField: (field: FormFieldInstance) => void
  unregisterField: (field: FormFieldInstance) => void
}

export const formContextKey: InjectionKey<FormContext> = Symbol('nv-form-context')

export const formProps = {
  model: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
  rules: { type: Object as PropType<FormRules>, default: () => ({}) },
  labelWidth: { type: String, default: '' }
} as const

export type FormProps = ExtractPropTypes<typeof formProps>

export const formItemProps = {
  label: { type: String, default: '' },
  prop: { type: String, default: '' },
  required: { type: Boolean, default: false },
  rules: { type: Array as PropType<FormRule[]>, default: () => [] }
} as const

export type FormItemProps = ExtractPropTypes<typeof formItemProps>