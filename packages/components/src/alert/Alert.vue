<script setup lang="ts">
import { createNamespace } from '../utils/bem'
import { NvIcon } from '../icon'
import { alertEmits, alertProps } from './alert'

defineOptions({ name: 'NvAlert' })

defineProps(alertProps)
const emit = defineEmits(alertEmits)

const ns = createNamespace('alert')

function close(): void {
  emit('close')
}
</script>

<template>
  <div :class="[ns.b(), ns.m(type)]" role="alert">
    <span v-if="showIcon" :class="ns.e('icon')" aria-hidden="true"><NvIcon :name="type" /></span>
    <div :class="ns.e('content')">
      <div v-if="title" :class="ns.e('title')">{{ title }}</div>
      <div v-if="description" :class="ns.e('description')">{{ description }}</div>
    </div>
    <button v-if="closable" :class="ns.e('close')" type="button" aria-label="Close" @click="close">
      <NvIcon name="close" />
    </button>
  </div>
</template>