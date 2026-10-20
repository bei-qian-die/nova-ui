<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../utils/bem'
import { tagEmits, tagProps } from './tag'

defineOptions({ name: 'NvTag' })

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)
const ns = createNamespace('tag')

const classes = computed(() => [
  ns.b(),
  ns.m(props.type === 'default' ? '' : props.type),
  ns.m(props.size === 'medium' ? '' : props.size),
  props.round ? ns.m('round') : ''
])

const style = computed(() =>
  props.color ? { '--nv-tag-bg': props.color, '--nv-tag-color': '#fff' } : undefined
)

function handleClose(e: MouseEvent): void {
  emit('close', e)
}
</script>

<template>
  <span :class="classes" :style="style">
    <span class="nv-tag__content"><slot /></span>
    <button
      v-if="closable"
      type="button"
      class="nv-tag__close"
      aria-label="关闭"
      @click.stop="handleClose"
    >
      ×
    </button>
  </span>
</template>