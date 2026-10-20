import type { ExtractPropTypes, PropType } from 'vue'

export const paginationProps = {
  modelValue: { type: Number as PropType<number> },
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 10 },
  pagerCount: { type: Number, default: 7 }
} as const

export type PaginationProps = ExtractPropTypes<typeof paginationProps>

export const paginationEmits = {
  'update:modelValue': (page: number) => typeof page === 'number',
  change: (page: number) => typeof page === 'number'
} as const

export type PaginationEmits = typeof paginationEmits