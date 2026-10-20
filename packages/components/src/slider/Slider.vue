<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { createNamespace } from '../utils/bem'
import { useVModel } from '../composables/useVModel'
import { sliderEmits, sliderProps } from './slider'

defineOptions({ name: 'NvSlider' })

const props = defineProps(sliderProps)
const emit = defineEmits(sliderEmits)

const ns = createNamespace('slider')

const currentValue = useVModel(props, 'modelValue', emit as (event: string, ...args: unknown[]) => void, {
  defaultValue: 0
})

const trackRef = ref<HTMLDivElement | null>(null)
const dragging = ref(false)

const value = computed(() => currentValue.value ?? props.min)

function clamp(raw: number): number {
  return Math.min(props.max, Math.max(props.min, raw))
}

function snap(raw: number): number {
  const steps = Math.round((raw - props.min) / props.step)
  return clamp(props.min + steps * props.step)
}

const percent = computed(() => ((value.value - props.min) / (props.max - props.min)) * 100)

function setValue(raw: number): void {
  const next = snap(raw)
  if (next === value.value) return
  currentValue.value = next
  emit('change', next)
}

function positionFromClientX(clientX: number): number {
  const track = trackRef.value
  if (!track) return value.value
  const rect = track.getBoundingClientRect()
  const ratio = (clientX - rect.left) / rect.width
  return props.min + ratio * (props.max - props.min)
}

function onTrackClick(e: MouseEvent): void {
  if (props.disabled) return
  setValue(positionFromClientX(e.clientX))
}

function handleKeydown(e: KeyboardEvent): void {
  if (props.disabled) return
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    setValue(value.value - props.step)
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    setValue(value.value + props.step)
  } else if (e.key === 'Home') {
    e.preventDefault()
    setValue(props.min)
  } else if (e.key === 'End') {
    e.preventDefault()
    setValue(props.max)
  }
}

function handlePointerMove(e: PointerEvent): void {
  if (!dragging.value) return
  setValue(positionFromClientX(e.clientX))
}

function handlePointerUp(): void {
  dragging.value = false
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', handlePointerUp)
}

function onThumbPointerDown(e: PointerEvent): void {
  if (props.disabled) return
  e.preventDefault()
  dragging.value = true
  document.addEventListener('pointermove', handlePointerMove)
  document.addEventListener('pointerup', handlePointerUp)
}

onBeforeUnmount(() => {
  document.removeEventListener('pointermove', handlePointerMove)
  document.removeEventListener('pointerup', handlePointerUp)
})
</script>

<template>
  <div :class="[ns.b(), disabled ? ns.is('disabled') : '']">
    <div ref="trackRef" :class="ns.e('runway')" @click="onTrackClick">
      <div :class="ns.e('bar')" :style="{ width: `${percent}%` }" />
      <div
        :class="ns.e('button')"
        :style="{ left: `${percent}%` }"
        role="slider"
        aria-label="Slider"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="value"
        :aria-disabled="disabled"
        :tabindex="disabled ? -1 : 0"
        @keydown="handleKeydown"
        @pointerdown="onThumbPointerDown"
      >
        <div v-if="showTooltip" :class="ns.e('tooltip')">{{ value }}</div>
      </div>
    </div>
  </div>
</template>