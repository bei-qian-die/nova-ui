<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../utils/bem'
import { badgeProps } from './badge'

defineOptions({ name: 'NvBadge' })

const props = defineProps(badgeProps)
const ns = createNamespace('badge')

const show = computed(() => {
  if (props.hidden) return false
  if (props.dot) return true
  if (props.value === '') return false
  const n = Number(props.value)
  if (Number.isNaN(n)) return true
  return props.showZero || n > 0
})

const content = computed(() => {
  if (props.dot) return ''
  const n = Number(props.value)
  if (Number.isNaN(n)) return String(props.value)
  return n > props.max ? `${props.max}+` : String(n)
})
</script>

<template>
  <span class="nv-badge">
    <slot />
    <sup v-if="show" :class="[ns.e('content'), props.dot ? 'is-dot' : '']">{{ content }}</sup>
  </span>
</template>