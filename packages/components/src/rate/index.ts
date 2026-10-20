import { withInstall } from '../utils/with-install'
import Rate from './Rate.vue'

export const NvRate = withInstall(Rate)
export default NvRate

export type RateInstance = InstanceType<typeof Rate>

export type { RateProps, RateEmits } from './rate'
export { rateProps, rateEmits } from './rate'