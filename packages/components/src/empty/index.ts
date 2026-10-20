import { withInstall } from '../utils/with-install'
import Empty from './Empty.vue'

export const NvEmpty = withInstall(Empty)
export default NvEmpty

export type EmptyInstance = InstanceType<typeof Empty>

export type { EmptyProps } from './empty'
export { emptyProps } from './empty'