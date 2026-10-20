import { withInstall } from '../utils/with-install'
import Link from './Link.vue'

export const NvLink = withInstall(Link)
export default NvLink

export type LinkInstance = InstanceType<typeof Link>

export type { LinkProps, LinkType } from './link'
export { linkProps, linkTypes } from './link'