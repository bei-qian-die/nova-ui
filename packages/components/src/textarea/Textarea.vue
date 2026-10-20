<script setup lang="ts">
import { computed, ref } from 'vue'
import { useId } from '../composables/useId'
import { useVModel } from '../composables/useVModel'
import { createNamespace } from '../utils/bem'
import { textareaEmits, textareaProps } from './textarea'

defineOptions({ name: 'NvTextarea' })

const props = defineProps(textareaProps)
const emit = defineEmits(textareaEmits)

const ns = createNamespace('textarea')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const id = useId('nv-textarea')

const textareaValue = useVModel(
  props,
  'modelValue',
  emit as unknown as (event: string, ...args: unknown[]) => void,
  { defaultValue: '' }
)

const count = computed(() => String(textareaValue.value ?? '').length)

const countText = computed(() =>
  props.maxlength != null ? `${count.value}/${props.maxlength}` : `${count.value}`
)

const classes = computed(() => [
  ns.b(),
  ns.is('disabled', props.disabled),
  ns.is('readonly', props.readonly)
])

function handleInput(e: Event): void {
  const value = (e.target as HTMLTextAreaElement).value
  textareaValue.value = value
  emit('input', value)
}

function handleChange(e: Event): void {
  emit('change', (e.target as HTMLTextAreaElement).value)
}

function handleFocus(e: FocusEvent): void {
  emit('focus', e)
}

function handleBlur(e: FocusEvent): void {
  emit('blur', e)
}

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur()
})
</script>

<template>
  <div :class="classes">
    <textarea
      :id="id"
      ref="textareaRef"
      :class="ns.e('inner')"
      :value="textareaValue"
      :rows="rows"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :aria-label="label || undefined"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span v-if="showCount" :class="ns.e('count')">{{ countText }}</span>
  </div>
</template>