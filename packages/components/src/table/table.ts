import type { ExtractPropTypes, PropType } from 'vue'

export type TableAlign = 'left' | 'center' | 'right'
export type TableSortOrder = 'asc' | 'desc'

export interface TableColumn {
  key: string
  title: string
  width?: string | number
  align?: TableAlign
  sortable?: boolean
}

export type TableRow = Record<string, unknown>

export interface TableSortState {
  key: string
  order: TableSortOrder
}

export const tableProps = {
  data: { type: Array as PropType<TableRow[]>, default: () => [] },
  columns: { type: Array as PropType<TableColumn[]>, default: () => [] },
  rowKey: { type: String, default: '' },
  height: { type: [String, Number] as PropType<string | number>, default: '' },
  rowHeight: { type: Number, default: 48 }
} as const

export type TableProps = ExtractPropTypes<typeof tableProps>

export const tableEmits = {
  'sort-change': (_state: TableSortState | null) => true
} as const

export type TableEmits = typeof tableEmits