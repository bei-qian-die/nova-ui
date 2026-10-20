import { withInstall } from '../utils/with-install'
import Badge from './Badge.vue'

export const NvBadge = withInstall(Badge)
export default NvBadge

export type BadgeInstance = InstanceType<typeof Badge>

export type { BadgeProps, BadgeType } from './badge'
export { badgeProps, badgeTypes } from './badge'