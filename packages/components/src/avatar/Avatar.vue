<script setup lang="ts">
import { computed, ref } from 'vue'
import { createNamespace } from '../utils/bem'
import { avatarProps, type AvatarSize } from './avatar'

defineOptions({ name: 'NvAvatar' })

const props = defineProps(avatarProps)
const ns = createNamespace('avatar')
const hasError = ref(false)

const sizeMap: Record<AvatarSize, string> = { small: '28px', medium: '40px', large: '56px' }

const sizeStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : sizeMap[props.size]
  return { width: size, height: size }
})

const classes = computed(() => [ns.b(), props.shape !== 'circle' ? ns.m('square') : ''])
</script>

<template>
  <span :class="classes" :style="sizeStyle">
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      class="nv-avatar__img"
      :style="{ objectFit: fit }"
      @error="hasError = true"
    />
    <span v-else class="nv-avatar__fallback"><slot /></span>
  </span>
</template>