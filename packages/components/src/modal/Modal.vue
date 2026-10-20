<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { createNamespace } from '../utils/bem'
import { useFocusTrap } from '../composables/useFocusTrap'
import { useId } from '../composables/useId'
import { useModalLock } from '../composables/useModalLock'
import { isTopOverlay } from '../composables/overlayStack'
import { NvIcon } from '../icon'
import { modalEmits, modalProps } from './modal'

defineOptions({ name: 'NvModal' })

const props = defineProps(modalProps)
const emit = defineEmits(modalEmits)

const ns = createNamespace('modal')
const titleId = useId('nv-modal-title')
const dialogRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)

const trap = useFocusTrap(dialogRef, {
  // 焦点归还统一交给 useModalLock（它在施加 inert 前记录了真实触发元素）——
  // 此处若 returnFocus:true 会与 useModalLock 形成两套归还机制，且 useFocusTrap 的
  // previouslyFocused 在 nextTick 后才捕获，此时 inert 已让焦点落到 body，属于重复副作用源。
  returnFocus: false,
  initialFocus: true,
  escapeDeactivates: true,
  // 多层弹层中仅栈顶弹层响应 Esc / Tab，避免一次 Esc 关闭所有弹层
  when: () => isTopOverlay(overlayRef.value),
  onEscape: () => {
    if (props.closeOnEsc) close()
  }
})

const visible = computed<boolean>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

useModalLock(visible, overlayRef)

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
    <transition name="nv-modal-fade" @after-leave="emit('closed')">
      <div v-if="visible" ref="overlayRef" :class="ns.e('overlay')" @click.self="onOverlayClick">
        <div
          ref="dialogRef"
          :class="ns.e('dialog')"
          :style="{ width }"
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