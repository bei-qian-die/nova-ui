<script setup lang="ts">
import { computed } from 'vue'
import { useId } from '../composables/useId'
import { useVModel } from '../composables/useVModel'
import { createNamespace } from '../utils/bem'
import { radioEmits, radioProps } from './radio'

defineOptions({ name: 'NvRadio' })

const props = defineProps(radioProps)
const emit = defineEmits(radioEmits)

const ns = createNamespace('radio')
const id = useId('nv-radio')

const model = useVModel(
  props,
  'modelValue',
  emit as unknown as (event: string, ...args: unknown[]) => void
)

const checked = computed(() => model.value === props.value)

const classes = computed(() => [
  ns.b(),
  ns.is('checked', checked.value),
  ns.is('disabled', props.disabled)
])

function handleChange(e: Event): void {
  const target = e.target as HTMLInputElement
  if (target.checked) {
    model.value = props.value
    emit('change', props.value)
  }
}
</script>

<template>
  <label :class="classes" :for="id">
    <input
      :id="id"
      :class="ns.e('input')"
      type="radio"
      :checked="checked"
      :value="value"
      :disabled="disabled"
      @change="handleChange"
    />
    <span :class="ns.e('dot')" aria-hidden="true" />
    <span v-if="label" :class="ns.e('label')">{{ label }}</span>
    <span v-else :class="ns.e('label')"><slot /></span>
  </label>
</template>