import { withInstall } from '../utils/with-install'
import Avatar from './Avatar.vue'

export const NvAvatar = withInstall(Avatar)
export default NvAvatar

export type AvatarInstance = InstanceType<typeof Avatar>

export type { AvatarProps, AvatarSize, AvatarShape } from './avatar'
export { avatarProps, avatarSizes, avatarShapes } from './avatar'