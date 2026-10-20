<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { createNamespace } from '../utils/bem'
import { useFocusTrap } from '../composables/useFocusTrap'
import { useId } from '../composables/useId'
import { NvIcon } from '../icon'
import { drawerEmits, drawerProps } from './drawer'

defineOptions({ name: 'NvDrawer' })

const props = defineProps(drawerProps)
const emit = defineEmits(drawerEmits)

const ns = createNamespace('drawer')
const titleId = useId('nv-drawer-title')
const panelRef = ref<HTMLElement | null>(null)

const trap = useFocusTrap(panelRef, {
  returnFocus: true,
  initialFocus: true,
  escapeDeactivates: true,
  onEscape: () => {
    if (props.closeOnEsc) close()
  }
})

const visible = computed<boolean>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const classes = computed(() => [ns.b(), ns.m(props.direction)])

const sizeStyle = computed(() => {
  const isHorizontal = props.direction === 'ltr' || props.direction === 'rtl'
  return isHorizontal ? { width: props.size } : { height: props.size }
})

function close(): void {
  visible.value = false
}

function onOverlayClick(): void {
  if (props.closeOnClickModal) close()
}

watch(
  visible,
  (val, prev) => {
    if (val) {
      emit('open')
      nextTick(() => trap.activate())
    } else if (prev === true) {
      trap.deactivate()
      emit('close')
    }
  },
  { immediate: true }
)
</script>

<template>
  <teleport to="body">
    <transition name="nv-drawer-fade" @after-leave="trap.deactivate">
      <div v-if="visible" :class="ns.e('overlay')" @click.self="onOverlayClick">
        <div
          ref="panelRef"
          :class="classes"
          :style="sizeStyle"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-label="title ? undefined : 'dialog'"
          tabindex="-1"
        >
          <div :class="ns.e('header')">
            <span :id="titleId" :class="ns.e('title')">{{ title }}</span>
            <button v-if="showClose" :class="ns.e('close')" type="button" aria-label="Close" @click="close">
              <NvIcon name="close" />
            </button>
          </div>
          <div :class="ns.e('body')"><slot /></div>
        </div>
      </div>
    </transition>
  </teleport>
</template>