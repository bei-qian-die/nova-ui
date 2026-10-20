<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../utils/bem'
import { useVModel } from '../composables/useVModel'
import { NvIcon } from '../icon'
import { paginationEmits, paginationProps } from './pagination'

defineOptions({ name: 'NvPagination' })

const props = defineProps(paginationProps)
const emit = defineEmits(paginationEmits)

const ns = createNamespace('pagination')

const current = useVModel(props, 'modelValue', emit as (event: string, ...args: unknown[]) => void, {
  defaultValue: 1
})

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const currentPage = computed(() => Math.min(Math.max(current.value ?? 1, 1), pageCount.value))

interface PageItem {
  type: 'page' | 'prev-more' | 'next-more'
  page: number
}

const items = computed<PageItem[]>(() => {
  const total = pageCount.value
  const cur = currentPage.value
  if (total <= props.pagerCount) {
    const result: PageItem[] = []
    for (let i = 1; i <= total; i++) result.push({ type: 'page', page: i })
    return result
  }
  const half = Math.floor(props.pagerCount / 2)
  let start = Math.max(1, cur - half)
  let end = Math.min(total, cur + half)
  if (end - start + 1 < props.pagerCount) {
    if (start === 1) end = Math.min(total, start + props.pagerCount - 1)
    else if (end === total) start = Math.max(1, end - props.pagerCount + 1)
  }
  const result: PageItem[] = []
  if (start > 1) result.push({ type: 'page', page: 1 })
  if (start > 2) result.push({ type: 'prev-more', page: -1 })
  for (let p = start; p <= end; p++) result.push({ type: 'page', page: p })
  if (end < total - 1) result.push({ type: 'next-more', page: -1 })
  if (end < total) result.push({ type: 'page', page: total })
  return result
})

const isFirst = computed(() => currentPage.value <= 1)
const isLast = computed(() => currentPage.value >= pageCount.value)

function changePage(page: number): void {
  const next = Math.min(Math.max(page, 1), pageCount.value)
  if (next === currentPage.value) return
  current.value = next
  emit('change', next)
}

function prev(): void {
  changePage(currentPage.value - 1)
}

function next(): void {
  changePage(currentPage.value + 1)
}
</script>

<template>
  <nav :class="ns.b()" aria-label="pagination">
    <button type="button" :class="ns.em('btn', 'prev')" :disabled="isFirst" aria-label="上一页" @click="prev">
      <NvIcon name="arrow-left" />
    </button>
    <template v-for="item in items" :key="item.type === 'page' ? item.page : item.type">
      <button
        v-if="item.type === 'page'"
        type="button"
        :class="[ns.e('btn'), item.page === currentPage ? ns.is('active') : '']"
        :aria-current="item.page === currentPage ? 'page' : undefined"
        @click="changePage(item.page)"
      >
        {{ item.page }}
      </button>
      <span v-else :class="ns.e('more')">…</span>
    </template>
    <button type="button" :class="ns.em('btn', 'next')" :disabled="isLast" aria-label="下一页" @click="next">
      <NvIcon name="arrow-right" />
    </button>
  </nav>
</template>