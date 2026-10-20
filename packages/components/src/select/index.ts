import { withInstall } from '../utils/with-install'
import Select from './Select.vue'

export const NvSelect = withInstall(Select)
export default NvSelect

export type SelectInstance = InstanceType<typeof Select>

export type { SelectProps, SelectOption, SelectValue, SelectEmits } from './select'
export { selectProps, selectEmits } from './select'