import { withInstall } from '../utils/with-install'
import Icon from './Icon.vue'

export const NvIcon = withInstall(Icon)
export default NvIcon

export type IconInstance = InstanceType<typeof Icon>

export type { IconProps, IconName } from './icon'
export { iconProps, iconNames } from './icon'