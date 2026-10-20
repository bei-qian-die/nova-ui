<script setup lang="ts">
import { computed, ref } from 'vue'
import { createNamespace } from '../utils/bem'
import { useClickOutside } from '../composables/useClickOutside'
import { useId } from '../composables/useId'
import { tooltipProps } from './tooltip'

defineOptions({ name: 'NvTooltip' })

const props = defineProps(tooltipProps)
const ns = createNamespace('tooltip')

const rootRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const contentId = useId('nv-tooltip')

const classes = computed(() => [ns.b(), ns.m(props.placement)])

function show(): void {
  if (props.disabled) return
  visible.value = true
}

function hide(): void {
  visible.value = false
}

function toggle(): void {
  if (props.disabled) return
  visible.value = !visible.value
}

function onMouseEnter(): void {
  if (props.trigger === 'hover') show()
}

function onMouseLeave(): void {
  if (props.trigger === 'hover') hide()
}

function onClick(): void {
  if (props.trigger === 'click') toggle()
}

function onFocusIn(): void {
  if (props.trigger === 'focus') show()
}

function onFocusOut(): void {
  if (props.trigger === 'focus') hide()
}

useClickOutside(rootRef, () => {
  if (props.trigger === 'click') hide()
})
</script>

<template>
  <span
    ref="rootRef"
    :class="classes"
    :aria-describedby="visible ? contentId : undefined"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <slot />
    <div v-if="visible" :id="contentId" :class="ns.e('content')" role="tooltip">{{ content }}</div>
  </span>
</template>