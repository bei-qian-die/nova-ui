<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { createNamespace } from '../utils/bem'
import { NvIcon } from '../icon'
import { messageEmits, messageProps } from './message'

defineOptions({ name: 'NvMessage' })

const props = defineProps(messageProps)
const emit = defineEmits(messageEmits)

const ns = createNamespace('message')

const role = computed(() => (props.type === 'error' || props.type === 'warning' ? 'alert' : 'status'))

let timer: ReturnType<typeof setTimeout> | undefined

function clearTimer(): void {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
}

function close(): void {
  clearTimer()
  emit('close')
}

onMounted(() => {
  if (props.duration > 0) timer = setTimeout(close, props.duration)
})

onBeforeUnmount(clearTimer)
</script>

<template>
  <div :class="[ns.b(), ns.m(type)]" :role="role">
    <span :class="ns.e('icon')" aria-hidden="true"><NvIcon :name="type" /></span>
    <span :class="ns.e('content')">{{ content }}</span>
    <button v-if="closable" :class="ns.e('close')" type="button" aria-label="Close" @click="close">
      <NvIcon name="close" />
    </button>
  </div>
</template>