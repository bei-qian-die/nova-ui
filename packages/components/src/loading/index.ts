import { withInstall } from '../utils/with-install'
import Loading from './Loading.vue'

export const NvLoading = withInstall(Loading)
export default NvLoading

export type LoadingInstance = InstanceType<typeof Loading>

export { loading } from './loading'
export type { LoadingProps, LoadingOptions, LoadingClose } from './loading'
export { loadingProps } from './loading'