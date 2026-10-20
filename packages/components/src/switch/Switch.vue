<script setup lang="ts">
import { computed } from 'vue'
import { useVModel } from '../composables/useVModel'
import { createNamespace } from '../utils/bem'
import { switchEmits, switchProps } from './switch'

defineOptions({ name: 'NvSwitch' })

const props = defineProps(switchProps)
const emit = defineEmits(switchEmits)

const ns = createNamespace('switch')

const model = useVModel(
  props,
  'modelValue',
  emit as unknown as (event: string, ...args: unknown[]) => void,
  { defaultValue: false }
)

const classes = computed(() => [
  ns.b(),
  ns.m(props.size === 'medium' ? '' : props.size),
  ns.is('checked', model.value),
  ns.is('loading', props.loading),
  ns.is('disabled', props.disabled)
])

function toggle(): void {
  if (props.disabled || props.loading) return
  const next = !model.value
  model.value = next
  emit('change', next)
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  toggle()
}

function handleKeyup(e: KeyboardEvent): void {
  // 阻止 Space 在 keyup 阶段触发的原生 click，避免与 keydown 重复切换
  if (e.key === ' ') e.preventDefault()
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :class="classes"
    :aria-checked="model"
    :disabled="disabled || loading"
    @click="toggle"
    @keydown="handleKeydown"
    @keyup="handleKeyup"
  >
    <span :class="ns.e('dot')" aria-hidden="true" />
    <span v-if="activeText || inactiveText" :class="ns.e('text')">
      {{ model ? activeText : inactiveText }}
    </span>
  </button>
</template>