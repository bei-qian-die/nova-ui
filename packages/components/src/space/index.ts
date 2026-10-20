import { withInstall } from '../utils/with-install'
import Space from './Space.vue'

export const NvSpace = withInstall(Space)
export default NvSpace

export type SpaceInstance = InstanceType<typeof Space>

export type { SpaceProps, SpaceDirection, SpaceAlign } from './space'
export { spaceProps, spaceDirections, spaceAligns } from './space'