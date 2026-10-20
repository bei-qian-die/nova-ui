import { withInstall } from '../utils/with-install'
import Textarea from './Textarea.vue'

export const NvTextarea = withInstall(Textarea)
export default NvTextarea

export type TextareaInstance = InstanceType<typeof Textarea>

export type { TextareaProps, TextareaEmits } from './textarea'
export { textareaProps, textareaEmits } from './textarea'