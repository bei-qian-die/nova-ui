import { withInstall } from '../utils/with-install'
import Radio from './Radio.vue'

export const NvRadio = withInstall(Radio)
export default NvRadio

export type RadioInstance = InstanceType<typeof Radio>

export type { RadioProps, RadioEmits, RadioValue } from './radio'
export { radioProps, radioEmits } from './radio'