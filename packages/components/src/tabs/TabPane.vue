<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from 'vue'
import { createNamespace } from '../utils/bem'
import { useId } from '../composables/useId'
import { tabPaneProps, tabsContextKey, type TabPaneMeta } from './tab-pane'

defineOptions({ name: 'NvTabPane' })

const props = defineProps(tabPaneProps)
const ns = createNamespace('tab-pane')

const tabId = useId('nv-tabs-tab')
const panelId = useId('nv-tabs-panel')

const context = inject(tabsContextKey, null)

const name = computed<string | number>(() => (props.name !== undefined ? props.name : props.label))

const activeName = computed(() => context?.activeName.value)

const isActive = computed(() => activeName.value !== undefined && activeName.value === name.value)

let meta: TabPaneMeta | null = null

onMounted(() => {
  if (!context) return
  meta = { name: name.value, label: props.label, disabled: props.disabled, tabId, panelId }
  context.registerPane(meta)
})

onBeforeUnmount(() => {
  if (context && meta) context.unregisterPane(meta)
})
</script>

<template>
  <div
    :id="panelId"
    :class="[ns.b(), isActive ? ns.is('active') : '']"
    role="tabpanel"
    :aria-labelledby="tabId"
    :hidden="!isActive"
  >
    <slot />
  </div>
</template>