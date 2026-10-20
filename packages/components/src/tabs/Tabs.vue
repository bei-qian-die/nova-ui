<script setup lang="ts">
import { computed, nextTick, provide, ref, type ComponentPublicInstance } from 'vue'
import { createNamespace } from '../utils/bem'
import { useVModel } from '../composables/useVModel'
import { tabsContextKey, type TabPaneMeta } from './tab-pane'
import { tabsEmits, tabsProps } from './tabs'

defineOptions({ name: 'NvTabs' })

const props = defineProps(tabsProps)
const emit = defineEmits(tabsEmits)

const ns = createNamespace('tabs')

const model = useVModel(props, 'modelValue', emit as (event: string, ...args: unknown[]) => void)
const panes = ref<TabPaneMeta[]>([])
const tabEls = new Map<string | number, HTMLElement>()

const activeName = computed<string | number>(() => {
  const value = model.value
  if (value !== undefined && value !== null) return value
  const first = panes.value.find((p) => !p.disabled)
  return first ? first.name : ''
})

function registerPane(pane: TabPaneMeta): void {
  panes.value.push(pane)
}

function unregisterPane(pane: TabPaneMeta): void {
  const index = panes.value.indexOf(pane)
  if (index !== -1) panes.value.splice(index, 1)
}

provide(tabsContextKey, { activeName, registerPane, unregisterPane })

function isActive(name: string | number): boolean {
  return activeName.value === name
}

function select(name: string | number): void {
  const pane = panes.value.find((p) => p.name === name)
  if (!pane || pane.disabled) return
  if (name === activeName.value) return
  model.value = name
  emit('change', name)
}

function setTabRef(el: Element | ComponentPublicInstance | null, name: string | number): void {
  if (el instanceof HTMLElement) tabEls.set(name, el)
  else tabEls.delete(name)
}

function enabledPanes(): TabPaneMeta[] {
  return panes.value.filter((p) => !p.disabled)
}

function onTablistKeydown(e: KeyboardEvent): void {
  const enabled = enabledPanes()
  if (enabled.length === 0) return
  const currentIndex = enabled.findIndex((p) => isActive(p.name))
  let nextIndex = currentIndex
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    nextIndex = currentIndex <= 0 ? enabled.length - 1 : currentIndex - 1
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    nextIndex = currentIndex === -1 || currentIndex >= enabled.length - 1 ? 0 : currentIndex + 1
  } else if (e.key === 'Home') {
    e.preventDefault()
    nextIndex = 0
  } else if (e.key === 'End') {
    e.preventDefault()
    nextIndex = enabled.length - 1
  } else {
    return
  }
  const target = enabled[nextIndex]
  if (!target) return
  select(target.name)
  nextTick(() => tabEls.get(target.name)?.focus())
}
</script>

<template>
  <div :class="[ns.b(), ns.m(type)]">
    <div :class="ns.e('nav')" role="tablist" @keydown="onTablistKeydown">
      <button
        v-for="pane in panes"
        :id="pane.tabId"
        :key="String(pane.name)"
        :ref="(el) => setTabRef(el, pane.name)"
        type="button"
        :class="[ns.e('nav-item'), isActive(pane.name) ? ns.is('active') : '', pane.disabled ? ns.is('disabled') : '']"
        role="tab"
        :aria-selected="isActive(pane.name)"
        :aria-controls="pane.panelId"
        :tabindex="isActive(pane.name) ? 0 : -1"
        :disabled="pane.disabled"
        @click="select(pane.name)"
      >
        {{ pane.label }}
      </button>
    </div>
    <div :class="ns.e('content')"><slot /></div>
  </div>
</template>