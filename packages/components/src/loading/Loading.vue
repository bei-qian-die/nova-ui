<script setup lang="ts">
import { createNamespace } from '../utils/bem'
import { NvIcon } from '../icon'
import { loadingProps } from './loading'

defineOptions({ name: 'NvLoading' })

defineProps(loadingProps)

const ns = createNamespace('loading')
</script>

<template>
  <div :class="ns.b()">
    <slot v-if="!fullscreen" />
    <teleport to="body" :disabled="!fullscreen">
      <transition name="nv-loading-fade">
        <div
          v-if="loading"
          :class="ns.em('mask', fullscreen ? 'fullscreen' : '')"
          role="status"
          aria-live="polite"
          :aria-label="text || 'Loading'"
        >
          <span :class="ns.e('spinner')"><NvIcon name="loading" spin /></span>
          <span v-if="text" :class="ns.e('text')">{{ text }}</span>
        </div>
      </transition>
    </teleport>
  </div>
</template>