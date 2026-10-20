import { withInstall } from '../utils/with-install'
import Table from './Table.vue'

export const NvTable = withInstall(Table)
export default NvTable

export type TableInstance = InstanceType<typeof Table>

export type {
  TableProps,
  TableEmits,
  TableColumn,
  TableRow,
  TableAlign,
  TableSortOrder,
  TableSortState
} from './table'
export { tableProps, tableEmits } from './table'