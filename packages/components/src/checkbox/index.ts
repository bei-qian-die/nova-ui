import { withInstall } from '../utils/with-install'
import Checkbox from './Checkbox.vue'

export const NvCheckbox = withInstall(Checkbox)
export default NvCheckbox

export type CheckboxInstance = InstanceType<typeof Checkbox>

export type { CheckboxProps, CheckboxEmits } from './checkbox'
export { checkboxProps, checkboxEmits } from './checkbox'