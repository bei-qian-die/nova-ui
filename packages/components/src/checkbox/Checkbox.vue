<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useId } from '../composables/useId'
import { useVModel } from '../composables/useVModel'
import { createNamespace } from '../utils/bem'
import { checkboxEmits, checkboxProps } from './checkbox'

defineOptions({ name: 'NvCheckbox' })

const props = defineProps(checkboxProps)
const emit = defineEmits(checkboxEmits)

const ns = createNamespace('checkbox')
const inputRef = ref<HTMLInputElement | null>(null)
const id = useId('nv-checkbox')

const model = useVModel(
  props,
  'modelValue',
  emit as unknown as (event: string, ...args: unknown[]) => void,
  { defaultValue: false }
)

const checked = computed({
  get: () => {
    const val = model.value
    if (Array.isArray(val)) return val.includes(props.value)
    return !!val
  },
  set: (next: boolean) => {
    const val = model.value
    if (Array.isArray(val)) {
      const set = new Set(val)
      if (next) set.add(props.value)
      else set.delete(props.value)
      model.value = [...set]
    } else {
      model.value = next
    }
  }
})

onMounted(() => {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate
})

watch(
  () => props.indeterminate,
  (val) => {
    if (inputRef.value) inputRef.value.indeterminate = val
  }
)

const classes = computed(() => [
  ns.b(),
  ns.is('checked', checked.value),
  ns.is('indeterminate', props.indeterminate),
  ns.is('disabled', props.disabled)
])

function handleChange(e: Event): void {
  checked.value = (e.target as HTMLInputElement).checked
  const val = model.value
  if (typeof val === 'boolean' || Array.isArray(val)) {
    emit('change', val)
  }
}
</script>

<template>
  <label :class="classes" :for="id">
    <input
      :id="id"
      ref="inputRef"
      :class="ns.e('input')"
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      :value="value"
      @change="handleChange"
    />
    <span :class="ns.e('box')" aria-hidden="true" />
    <span v-if="label" :class="ns.e('label')">{{ label }}</span>
    <span v-else :class="ns.e('label')"><slot /></span>
  </label>
</template>