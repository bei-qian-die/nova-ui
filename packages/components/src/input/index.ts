import { withInstall } from '../utils/with-install'
import Input from './Input.vue'

export const NvInput = withInstall(Input)
export default NvInput

export type InputInstance = InstanceType<typeof Input>

export type { InputProps, InputSize, InputType, InputEmits } from './input'
export { inputProps, inputEmits, inputSizes, inputTypes } from './input'