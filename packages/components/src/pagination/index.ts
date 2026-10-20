import { withInstall } from '../utils/with-install'
import Pagination from './Pagination.vue'

export const NvPagination = withInstall(Pagination)
export default NvPagination

export type PaginationInstance = InstanceType<typeof Pagination>

export type { PaginationProps, PaginationEmits } from './pagination'
export { paginationProps, paginationEmits } from './pagination'