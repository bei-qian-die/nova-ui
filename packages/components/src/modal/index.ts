import { withInstall } from '../utils/with-install'
import Modal from './Modal.vue'

export const NvModal = withInstall(Modal)
export default NvModal

export type ModalInstance = InstanceType<typeof Modal>

export type { ModalProps, ModalEmits } from './modal'
export { modalProps, modalEmits } from './modal'