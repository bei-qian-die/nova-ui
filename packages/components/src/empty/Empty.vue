<script setup lang="ts">
import { createNamespace } from '../utils/bem'
import { emptyProps } from './empty'

defineOptions({ name: 'NvEmpty' })

defineProps(emptyProps)
const ns = createNamespace('empty')
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('image')">
      <img v-if="image" :src="image" alt="" />
      <svg
        v-else
        :class="ns.e('svg')"
        viewBox="0 0 64 41"
        width="64"
        height="41"
        aria-hidden="true"
        focusable="false"
      >
        <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
          <path
            d="M54 6a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4h46Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
          <path d="M1 14h60" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <path d="M27 22h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </g>
      </svg>
    </div>
    <div :class="ns.e('description')">{{ description }}</div>
    <div v-if="$slots.default" :class="ns.e('footer')"><slot /></div>
  </div>
</template>