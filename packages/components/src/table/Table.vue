<script setup lang="ts">
import { computed, ref } from 'vue'
import { NvIcon } from '../icon'
import { createNamespace } from '../utils/bem'
import {
  tableEmits,
  tableProps,
  type TableColumn,
  type TableRow,
  type TableSortState
} from './table'

defineOptions({ name: 'NvTable' })

const props = defineProps(tableProps)
const emit = defineEmits(tableEmits)

const ns = createNamespace('table')

const viewportRef = ref<HTMLDivElement | null>(null)
const scrollTop = ref(0)
const sortState = ref<TableSortState | null>(null)

const hasHeight = computed(() => props.height !== '' && props.height != null)

const viewportPx = computed(() => {
  const h = props.height
  if (typeof h === 'number') return h
  return Number.parseFloat(h) || 0
})

const rowPx = computed(() => Math.max(props.rowHeight, 1))
const isVirtualized = computed(() => hasHeight.value && props.data.length > 0)
const overscan = 4

// —— 排序 ——
function compareValues(a: unknown, b: unknown, order: TableSortState['order']): number {
  const factor = order === 'asc' ? 1 : -1
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * factor
  return String(a ?? '').localeCompare(String(b ?? '')) * factor
}

const sortedData = computed<TableRow[]>(() => {
  if (!sortState.value) return props.data
  const { key, order } = sortState.value
  const rows = [...props.data]
  rows.sort((a, b) => compareValues(a[key], b[key], order))
  return rows
})

function toggleSort(column: TableColumn): void {
  if (!column.sortable) return
  const key = column.key
  if (sortState.value?.key === key) {
    sortState.value = sortState.value.order === 'asc' ? { key, order: 'desc' } : null
  } else {
    sortState.value = { key, order: 'asc' }
  }
  emit('sort-change', sortState.value)
}

// —— 虚拟滚动窗口 ——
const startIndex = computed(() =>
  isVirtualized.value ? Math.max(0, Math.floor(scrollTop.value / rowPx.value) - overscan) : 0
)

const endIndex = computed(() => {
  if (!isVirtualized.value) return sortedData.value.length
  const total = sortedData.value.length
  return Math.min(total, Math.ceil((scrollTop.value + viewportPx.value) / rowPx.value) + overscan)
})

const visibleRows = computed<TableRow[]>(() =>
  isVirtualized.value ? sortedData.value.slice(startIndex.value, endIndex.value) : sortedData.value
)

const topPad = computed(() => (isVirtualized.value ? startIndex.value * rowPx.value : 0))

const bottomPad = computed(() =>
  isVirtualized.value ? (sortedData.value.length - endIndex.value) * rowPx.value : 0
)

const viewportStyle = computed(() =>
  hasHeight.value ? { height: toPx(props.height), overflow: 'auto' } : undefined
)

// —— 单元格辅助 ——
function toPx(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

function columnWidth(column: TableColumn): Record<string, string> | undefined {
  if (column.width === undefined || column.width === '') return undefined
  return { width: toPx(column.width) }
}

function cellAlign(column: TableColumn): Record<string, string> | undefined {
  return column.align ? { textAlign: column.align } : undefined
}

function ariaSort(column: TableColumn): 'ascending' | 'descending' | undefined {
  if (!column.sortable || sortState.value?.key !== column.key) return undefined
  return sortState.value.order === 'asc' ? 'ascending' : 'descending'
}

function sortIconName(column: TableColumn): string {
  return sortState.value?.key === column.key && sortState.value.order === 'asc'
    ? 'arrow-up'
    : 'arrow-down'
}

function isSorted(column: TableColumn): boolean {
  return sortState.value?.key === column.key
}

function rowKey(row: TableRow, index: number): string | number {
  if (props.rowKey && row[props.rowKey] !== undefined) return String(row[props.rowKey])
  return isVirtualized.value ? startIndex.value + index : index
}

function cellValue(row: TableRow, key: string): unknown {
  return row[key]
}

function onScroll(): void {
  scrollTop.value = viewportRef.value?.scrollTop ?? 0
}

function scrollTo(offset: number): void {
  scrollTop.value = offset
  if (viewportRef.value) viewportRef.value.scrollTop = offset
}

defineExpose({ scrollTo })
</script>

<template>
  <div :class="ns.b()">
    <div
      ref="viewportRef"
      :class="[ns.e('viewport'), hasHeight ? ns.is('scroll') : '']"
      :style="viewportStyle"
      @scroll="onScroll"
    >
      <table :class="ns.e('el')">
        <thead :class="ns.e('header')">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="ns.e('header-cell')"
              :style="columnWidth(column)"
              scope="col"
              :aria-sort="ariaSort(column)"
            >
              <div :class="ns.e('header-content')">
                <span>{{ column.title }}</span>
                <button
                  v-if="column.sortable"
                  type="button"
                  :class="[ns.e('sort'), isSorted(column) ? ns.is('active') : '']"
                  :aria-label="`按 ${column.title} 排序`"
                  @click="toggleSort(column)"
                >
                  <span
                    :class="[ns.e('sort-icon'), isSorted(column) ? '' : ns.is('idle')]"
                    aria-hidden="true"
                  >
                    <NvIcon :name="sortIconName(column)" />
                  </span>
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody :class="ns.e('body')">
          <tr
            v-if="isVirtualized"
            :class="ns.e('spacer')"
            :style="{ height: `${topPad}px` }"
            aria-hidden="true"
          ></tr>
          <tr
            v-for="(row, index) in visibleRows"
            :key="rowKey(row, index)"
            :class="ns.e('row')"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="ns.e('cell')"
              :style="cellAlign(column)"
            >
              <slot :name="column.key" :row="row" :value="cellValue(row, column.key)">
                {{ cellValue(row, column.key) }}
              </slot>
            </td>
          </tr>
          <tr v-if="visibleRows.length === 0" :class="ns.e('empty-row')">
            <td :class="ns.e('cell')" :colspan="columns.length">
              <slot name="empty">暂无数据</slot>
            </td>
          </tr>
          <tr
            v-if="isVirtualized"
            :class="ns.e('spacer')"
            :style="{ height: `${bottomPad}px` }"
            aria-hidden="true"
          ></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>