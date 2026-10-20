<script setup lang="ts">
import { computed, ref } from 'vue'
import { NvIcon } from '../icon'
import { useId } from '../composables/useId'
import { useVModel } from '../composables/useVModel'
import { createNamespace } from '../utils/bem'
import { inputEmits, inputProps } from './input'

defineOptions({ name: 'NvInput' })

const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)

const ns = createNamespace('input')
const inputRef = ref<HTMLInputElement | null>(null)
const inputId = useId('nv-input')

const inputValue = useVModel(
  props,
  'modelValue',
  emit as unknown as (event: string, ...args: unknown[]) => void,
  { defaultValue: '' }
)

const passwordVisible = ref(false)

const mergedType = computed<string>(() => {
  if (props.type === 'password' && props.showPassword) {
    return passwordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const canClear = computed(
  () =>
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    String(inputValue.value ?? '') !== ''
)

const classes = computed(() => [
  ns.b(),
  ns.m(props.size === 'medium' ? '' : props.size),
  ns.is('disabled', props.disabled),
  ns.is('readonly', props.readonly),
  ns.is('clearable', canClear.value)
])

function handleInput(e: Event): void {
  const value = (e.target as HTMLInputElement).value
  inputValue.value = value
  emit('input', value)
}

function handleChange(e: Event): void {
  emit('change', (e.target as HTMLInputElement).value)
}

function handleFocus(e: FocusEvent): void {
  emit('focus', e)
}

function handleBlur(e: FocusEvent): void {
  emit('blur', e)
}

function handleClear(): void {
  inputValue.value = ''
  emit('clear')
  emit('change', '')
}

function togglePassword(): void {
  passwordVisible.value = !passwordVisible.value
}

function focus(): void {
  inputRef.value?.focus()
}

function blur(): void {
  inputRef.value?.blur()
}

function clear(): void {
  handleClear()
}

function select(): void {
  inputRef.value?.select()
}

defineExpose({ focus, blur, clear, select })
</script>

<template>
  <div :class="classes">
    <input
      :id="inputId"
      ref="inputRef"
      :class="ns.e('inner')"
      :type="mergedType"
      :value="inputValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :aria-label="label || undefined"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="showPassword && type === 'password'"
      type="button"
      :class="ns.e('suffix')"
      :aria-label="passwordVisible ? '隐藏密码' : '显示密码'"
      @mousedown.prevent
      @click="togglePassword"
    >
      <NvIcon :name="passwordVisible ? 'eye-off' : 'eye'" />
    </button>
    <button
      v-if="canClear"
      type="button"
      :class="ns.e('suffix')"
      aria-label="清空"
      @mousedown.prevent
      @click="handleClear"
    >
      <NvIcon name="close" />
    </button>
  </div>
</template>