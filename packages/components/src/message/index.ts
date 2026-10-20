import { withInstall } from '../utils/with-install'
import Message from './Message.vue'

export const NvMessage = withInstall(Message)
export default NvMessage

export type MessageInstance = InstanceType<typeof Message>

export { message } from './message'
export type { MessageProps, MessageEmits, MessageType, MessageOptions, MessageFn, MessageClose } from './message'
export { messageProps, messageEmits, messageTypes } from './message'