<script setup lang="ts">
import { computed, ref } from 'vue'
import { createNamespace } from '../utils/bem'
import { buttonEmits, buttonProps } from './button'

defineOptions({ name: 'NvButton' })

const props = defineProps(buttonProps)
const emit = defineEmits(buttonEmits)

const ns = createNamespace('button')
const btnRef = ref<HTMLButtonElement | null>(null)

const classes = computed(() => [
  ns.b(),
  ns.m(props.type === 'default' ? '' : props.type),
  ns.m(props.size === 'medium' ? '' : props.size),
  ns.m(props.round ? 'round' : ''),
  ns.m(props.block ? 'block' : ''),
  props.loading ? ns.is('loading') : ''
])

function handleClick(e: MouseEvent): void {
  if (props.disabled || props.loading) {
    e.preventDefault()
    return
  }
  emit('click', e)
}

defineExpose({
  focus: () => btnRef.value?.focus(),
  blur: () => btnRef.value?.blur()
})
</script>

<template>
  <button
    ref="btnRef"
    :type="nativeType"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    @click="handleClick"
  >
    <span v-if="loading" class="nv-button__loading" aria-hidden="true" />
    <slot v-else name="icon" />
    <span class="nv-button__content"><slot /></span>
  </button>
</template>