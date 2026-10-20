import { withInstall } from '../utils/with-install'
import Alert from './Alert.vue'

export const NvAlert = withInstall(Alert)
export default NvAlert

export type AlertInstance = InstanceType<typeof Alert>

export type { AlertProps, AlertEmits, AlertType } from './alert'
export { alertProps, alertEmits, alertTypes } from './alert'