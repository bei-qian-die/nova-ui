import { withInstall } from '../utils/with-install'
import Divider from './Divider.vue'

export const NvDivider = withInstall(Divider)
export default NvDivider

export type DividerInstance = InstanceType<typeof Divider>

export type { DividerProps, DividerDirection } from './divider'
export { dividerProps, dividerDirections } from './divider'