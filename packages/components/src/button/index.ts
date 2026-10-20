import { withInstall } from '../utils/with-install'
import Button from './Button.vue'

export const NvButton = withInstall(Button)
export default NvButton

export type ButtonInstance = InstanceType<typeof Button>

export type { ButtonProps, ButtonSize, ButtonType, ButtonNativeType, ButtonEmits } from './button'
export { buttonProps, buttonEmits, buttonSizes, buttonTypes } from './button'