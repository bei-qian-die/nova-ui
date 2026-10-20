<script setup lang="ts">
import { provide, reactive } from 'vue'
import { createNamespace } from '../utils/bem'
import {
  formContextKey,
  formProps,
  type FormContext,
  type FormFieldInstance
} from './form'

defineOptions({ name: 'NvForm' })

const props = defineProps(formProps)
const ns = createNamespace('form')

const fields = new Set<FormFieldInstance>()

const model = reactive<Record<string, unknown>>(props.model ?? {})
const initialModel: Record<string, unknown> = { ...(props.model ?? {}) }

const context: FormContext = {
  model,
  rules: props.rules,
  labelWidth: props.labelWidth,
  registerField(field: FormFieldInstance): void {
    fields.add(field)
  },
  unregisterField(field: FormFieldInstance): void {
    fields.delete(field)
  }
}

provide(formContextKey, context)

async function validate(): Promise<boolean> {
  const results = await Promise.all(
    [...fields].map((field) => Promise.resolve(field.validate()))
  )
  return results.every(Boolean)
}

function resetFields(): void {
  for (const key of Object.keys(initialModel)) {
    model[key] = initialModel[key]
  }
  for (const field of fields) field.clearValidate()
}

function clearValidate(): void {
  for (const field of fields) field.clearValidate()
}

defineExpose({ validate, resetFields, clearValidate })
</script>

<template>
  <form :class="ns.b()" novalidate @submit.prevent>
    <slot />
  </form>
</template>