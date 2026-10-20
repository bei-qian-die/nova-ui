<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../utils/bem'
import { dividerProps } from './divider'

defineOptions({ name: 'NvDivider' })

const props = defineProps(dividerProps)
const ns = createNamespace('divider')

const classes = computed(() => [ns.b(), ns.m(props.direction), props.dashed ? ns.is('dashed') : ''])
</script>

<template>
  <div :class="classes" role="separator" :aria-orientation="direction">
    <span v-if="direction === 'horizontal' && $slots.default" class="nv-divider__text">
      <slot />
    </span>
  </div>
</template>