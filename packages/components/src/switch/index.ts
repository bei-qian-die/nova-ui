import { withInstall } from '../utils/with-install'
import Switch from './Switch.vue'

export const NvSwitch = withInstall(Switch)
export default NvSwitch

export type SwitchInstance = InstanceType<typeof Switch>

export type { SwitchProps, SwitchSize, SwitchEmits } from './switch'
export { switchProps, switchEmits, switchSizes } from './switch'