import { withInstall } from '../utils/with-install'
import Tag from './Tag.vue'

export const NvTag = withInstall(Tag)
export default NvTag

export type TagInstance = InstanceType<typeof Tag>

export type { TagProps, TagType, TagSize, TagEmits } from './tag'
export { tagProps, tagEmits, tagTypes, tagSizes } from './tag'