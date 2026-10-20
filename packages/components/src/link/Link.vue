<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../utils/bem'
import { linkProps } from './link'

defineOptions({ name: 'NvLink' })

const props = defineProps(linkProps)
const ns = createNamespace('link')

const classes = computed(() => [
  ns.b(),
  ns.m(props.type === 'default' ? '' : props.type),
  props.disabled ? ns.is('disabled') : ''
])

function handleClick(e: MouseEvent): void {
  if (props.disabled) e.preventDefault()
}
</script>

<template>
  <a :class="classes" :href="disabled ? undefined : href" :target="target" @click="handleClick">
    <slot />
  </a>
</template>