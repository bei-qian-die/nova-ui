<script setup lang="ts">
import { computed, ref } from 'vue'
import { NvIcon } from '../icon'
import { useClickOutside } from '../composables/useClickOutside'
import { useId } from '../composables/useId'
import { useVModel } from '../composables/useVModel'
import { createNamespace } from '../utils/bem'
import { selectEmits, selectProps, type SelectOption } from './select'

defineOptions({ name: 'NvSelect' })

const props = defineProps(selectProps)
const emit = defineEmits(selectEmits)

const ns = createNamespace('select')
const rootRef = ref<HTMLDivElement | null>(null)
const listboxId = useId('nv-select-listbox')

const model = useVModel(
  props,
  'modelValue',
  emit as unknown as (event: string, ...args: unknown[]) => void,
  { defaultValue: props.multiple ? [] : undefined }
)

const open = ref(false)
const highlightedValue = ref<SelectOption['value'] | undefined>(undefined)

const selectedValues = computed<SelectOption['value'][]>(() => {
  const val = model.value
  if (Array.isArray(val)) return val
  return val === undefined ? [] : [val]
})

const displayText = computed(() =>
  selectedValues.value
    .map((v) => props.options.find((o) => o.value === v)?.label ?? String(v))
    .join(', ')
)

const enabledOptions = computed(() => props.options.filter((o) => !o.disabled))

const showClear = computed(
  () => props.clearable && !props.disabled && selectedValues.value.length > 0
)

const classes = computed(() => [
  ns.b(),
  ns.m(props.multiple ? 'multiple' : ''),
  ns.is('open', open.value),
  ns.is('disabled', props.disabled)
])

function optionId(index: number): string {
  return `${listboxId}-option-${index}`
}

const activeDescendant = computed(() => {
  if (!open.value || highlightedValue.value === undefined) return undefined
  const idx = props.options.findIndex((o) => o.value === highlightedValue.value)
  return idx >= 0 ? optionId(idx) : undefined
})

function isSelected(option: SelectOption): boolean {
  return selectedValues.value.includes(option.value)
}

function toggleOpen(): void {
  if (props.disabled) return
  open.value = !open.value
  if (open.value && highlightedValue.value === undefined) {
    const first = selectedValues.value[0] ?? enabledOptions.value[0]?.value
    highlightedValue.value = first
  }
}

function close(): void {
  open.value = false
  highlightedValue.value = undefined
}

useClickOutside(rootRef, () => {
  if (open.value) close()
})

function moveHighlight(step: number): void {
  const list = enabledOptions.value
  if (list.length === 0) {
    highlightedValue.value = undefined
    return
  }
  const currentIndex = list.findIndex((o) => o.value === highlightedValue.value)
  if (currentIndex === -1) {
    highlightedValue.value = (step > 0 ? list[0] : list[list.length - 1]).value
  } else {
    const nextIndex = (currentIndex + step + list.length) % list.length
    highlightedValue.value = list[nextIndex].value
  }
}

function chooseOption(option: SelectOption): void {
  if (option.disabled) return
  if (props.multiple) {
    const current = model.value
    const list = Array.isArray(current) ? [...current] : []
    const idx = list.indexOf(option.value)
    if (idx >= 0) list.splice(idx, 1)
    else list.push(option.value)
    model.value = list
  } else {
    model.value = option.value
    close()
  }
  emit('change', model.value)
}

function handleOptionClick(option: SelectOption): void {
  chooseOption(option)
}

function handleOptionHover(option: SelectOption): void {
  if (option.disabled) return
  highlightedValue.value = option.value
}

function handleClear(): void {
  model.value = props.multiple ? [] : undefined
  emit('change', model.value)
}

function handleTriggerKeydown(e: KeyboardEvent): void {
  if (props.disabled) return
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      open.value = true
      moveHighlight(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      open.value = true
      moveHighlight(-1)
      break
    case 'Enter':
      e.preventDefault()
      if (!open.value) {
        open.value = true
        highlightedValue.value = enabledOptions.value[0]?.value
        return
      }
      if (highlightedValue.value !== undefined) {
        const opt = enabledOptions.value.find((o) => o.value === highlightedValue.value)
        if (opt) chooseOption(opt)
      }
      break
    case 'Escape':
      if (open.value) {
        e.preventDefault()
        close()
      }
      break
    case 'Home':
      if (open.value) {
        e.preventDefault()
        highlightedValue.value = enabledOptions.value[0]?.value
      }
      break
    case 'End':
      if (open.value) {
        e.preventDefault()
        highlightedValue.value = enabledOptions.value[enabledOptions.value.length - 1]?.value
      }
      break
    default:
      break
  }
}
</script>

<template>
  <div ref="rootRef" :class="classes">
    <div
      role="combobox"
      :class="ns.e('trigger')"
      :tabindex="disabled ? -1 : 0"
      :aria-label="placeholder || '请选择'"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :aria-controls="listboxId"
      :aria-activedescendant="activeDescendant"
      @click="toggleOpen"
      @keydown="handleTriggerKeydown"
    >
      <span :class="[ns.e('value'), ns.is('placeholder', selectedValues.length === 0)]">
        {{ selectedValues.length > 0 ? displayText : placeholder }}
      </span>
      <span
        v-if="showClear"
        :class="ns.e('icon')"
        role="button"
        aria-label="清空"
        tabindex="0"
        @click.stop="handleClear"
        @keydown.enter.stop="handleClear"
        @keydown.space.stop.prevent="handleClear"
      >
        <NvIcon name="close" />
      </span>
      <span :class="[ns.e('icon'), ns.e('arrow'), ns.is('open', open)]" aria-hidden="true">
        <NvIcon name="arrow-down" />
      </span>
    </div>

    <div v-if="open" :id="listboxId" :class="ns.e('dropdown')" role="listbox">
      <div
        v-for="(option, index) in options"
        :id="optionId(index)"
        :key="`${option.value}-${index}`"
        :class="[
          ns.e('option'),
          ns.is('selected', isSelected(option)),
          ns.is('disabled', option.disabled),
          ns.is('active', highlightedValue === option.value)
        ]"
        role="option"
        :aria-selected="isSelected(option)"
        :aria-disabled="option.disabled || undefined"
        @click="handleOptionClick(option)"
        @mousemove="handleOptionHover(option)"
      >
        <span
          v-if="multiple"
          :class="[ns.e('checkbox'), ns.is('checked', isSelected(option))]"
          aria-hidden="true"
        >
          <NvIcon v-if="isSelected(option)" name="check" />
        </span>
        <span :class="ns.e('option-label')">{{ option.label }}</span>
        <NvIcon v-if="!multiple && isSelected(option)" :class="ns.e('check')" name="check" />
      </div>
      <div v-if="options.length === 0" :class="ns.e('empty')">{{ placeholder || '无选项' }}</div>
    </div>
  </div>
</template>