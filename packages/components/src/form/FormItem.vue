<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { useId } from '../composables/useId'
import { createNamespace } from '../utils/bem'
import { formContextKey, formItemProps, type FormRule } from './form'

defineOptions({ name: 'NvFormItem' })

const props = defineProps(formItemProps)
const ns = createNamespace('form-item')
const id = useId('nv-form-item')

const formContext = inject(formContextKey, undefined)

const errorMessage = ref('')

const mergedRules = computed<FormRule[]>(() => {
  const fromForm = props.prop ? formContext?.rules[props.prop] ?? [] : []
  return [...props.rules, ...fromForm]
})

const isRequired = computed(
  () => props.required || mergedRules.value.some((rule) => rule.required)
)

const labelWidth = computed(() => formContext?.labelWidth ?? '')

function getValue(): unknown {
  if (!props.prop || !formContext) return undefined
  return formContext.model[props.prop]
}

function validateRule(rule: FormRule, value: unknown): string {
  if (
    rule.required &&
    (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0))
  ) {
    return rule.message ?? '该字段为必填项'
  }
  if (value === undefined || value === null || value === '') return ''
  if (rule.pattern && !rule.pattern.test(String(value))) {
    return rule.message ?? '格式不正确'
  }
  if (rule.validator) {
    const result = rule.validator(value)
    if (result === false) return rule.message ?? '校验未通过'
    if (typeof result === 'string') return result
  }
  return ''
}

function getError(): string {
  const value = getValue()
  for (const rule of mergedRules.value) {
    const message = validateRule(rule, value)
    if (message) return message
  }
  return ''
}

async function validate(): Promise<boolean> {
  const message = getError()
  errorMessage.value = message
  return message === ''
}

function clearValidate(): void {
  errorMessage.value = ''
}

function handleValidationTrigger(): void {
  void validate()
}

const field = { prop: props.prop, validate, clearValidate }

onMounted(() => formContext?.registerField(field))
onBeforeUnmount(() => formContext?.unregisterField(field))
</script>

<template>
  <div :class="[ns.b(), ns.is('error', !!errorMessage)]">
    <label
      v-if="label"
      :class="ns.e('label')"
      :for="id"
      :style="labelWidth ? { width: labelWidth } : undefined"
    >
      <span v-if="isRequired" :class="ns.e('required')" aria-hidden="true">*</span>
      <span>{{ label }}</span>
    </label>
    <div :class="ns.e('content')" @input="handleValidationTrigger" @change="handleValidationTrigger">
      <slot :id="id" />
    </div>
    <div v-if="errorMessage" :class="ns.e('error')" role="alert">{{ errorMessage }}</div>
  </div>
</template>