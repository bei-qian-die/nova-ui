<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { createNamespace } from '../utils/bem'
import { spaceProps } from './space'

defineOptions({ name: 'NvSpace' })

const props = defineProps(spaceProps)
const ns = createNamespace('space')

const sizes = { small: '8px', medium: '16px', large: '24px' } as const

const gap = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  return sizes[props.size as keyof typeof sizes] ?? props.size
})

const style = computed<CSSProperties>(() => ({
  gap: gap.value,
  flexWrap: props.wrap ? 'wrap' : 'nowrap',
  alignItems: props.align
}))
</script>

<template>
  <div :class="[ns.b(), ns.m(props.direction)]" :style="style">
    <slot />
  </div>
</template>