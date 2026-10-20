<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../utils/bem'
import { useVModel } from '../composables/useVModel'
import { NvIcon } from '../icon'
import { rateEmits, rateProps } from './rate'

defineOptions({ name: 'NvRate' })

const props = defineProps(rateProps)
const emit = defineEmits(rateEmits)

const ns = createNamespace('rate')

const currentValue = useVModel(props, 'modelValue', emit as (event: string, ...args: unknown[]) => void, {
  defaultValue: 0
})
const value = computed(() => currentValue.value ?? 0)

function isFull(index: number): boolean {
  return value.value >= index + 1
}

function isHalf(index: number): boolean {
  return props.allowHalf && value.value >= index + 0.5 && value.value < index + 1
}

function isChecked(index: number): boolean {
  return value.value >= (props.allowHalf ? index + 0.5 : index + 1)
}

function setValue(nextRaw: number): void {
  let next = Math.max(0, Math.min(props.count, nextRaw))
  if (!props.allowHalf) next = Math.round(next)
  if (next === value.value) return
  currentValue.value = next
  emit('change', next)
}

function onStarClick(index: number, e: MouseEvent): void {
  if (props.disabled || props.readonly) return
  let next = index + 1
  if (props.allowHalf) {
    const target = e.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const x = typeof e.clientX === 'number' ? e.clientX - rect.left : e.offsetX
    if (x < rect.width / 2) next = index + 0.5
  }
  setValue(next)
}

function onStarKeydown(e: KeyboardEvent): void {
  if (props.disabled || props.readonly) return
  const step = props.allowHalf ? 0.5 : 1
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
    e.preventDefault()
    setValue(value.value - step)
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
    e.preventDefault()
    setValue(value.value + step)
  }
}
</script>

<template>
  <div
    :class="[ns.b(), disabled ? ns.is('disabled') : '', readonly ? ns.is('readonly') : '']"
    role="radiogroup"
    aria-label="rate"
  >
    <span
      v-for="i in count"
      :key="i"
      :class="ns.e('item')"
      role="radio"
      :aria-checked="isChecked(i - 1)"
      :aria-label="`${i} 星`"
      :tabindex="disabled || readonly ? -1 : 0"
      @click="onStarClick(i - 1, $event)"
      @keydown="onStarKeydown($event)"
    >
      <NvIcon :name="isFull(i - 1) ? 'star-filled' : 'star'" :class="[ns.e('icon'), isFull(i - 1) ? ns.em('icon', 'active') : '']" />
      <span v-if="isHalf(i - 1)" :class="ns.e('half')">
        <NvIcon name="star-filled" :class="ns.e('icon')" />
      </span>
    </span>
  </div>
</template>