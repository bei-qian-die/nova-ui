import { createApp, createVNode } from 'vue'
import type { ExtractPropTypes, PropType } from 'vue'
import Message from './Message.vue'

export const messageTypes = ['info', 'success', 'warning', 'error'] as const

export type MessageType = (typeof messageTypes)[number]

export const messageProps = {
  type: { type: String as PropType<MessageType>, default: 'info' },
  content: { type: String, default: '' },
  closable: { type: Boolean, default: false },
  duration: { type: Number, default: 3000 }
} as const

export type MessageProps = ExtractPropTypes<typeof messageProps>

export const messageEmits = {
  close: () => true
} as const

export type MessageEmits = typeof messageEmits

export interface MessageOptions {
  type?: MessageType
  duration?: number
  closable?: boolean
}

export type MessageClose = () => void

export function createMessage(content: string, options: MessageOptions = {}): MessageClose {
  const { type = 'info', duration = 3000, closable = false } = options

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render: () =>
      createVNode(Message, {
        type,
        content,
        closable,
        duration,
        onClose: close
      })
  })

  app.mount(container)

  function close(): void {
    app.unmount()
    if (container.parentNode) container.parentNode.removeChild(container)
  }

  return close
}

export type MessageFn = (content: string, options?: MessageOptions) => MessageClose

function createByType(type: MessageType): MessageFn {
  return (content, options) => createMessage(content, { ...options, type })
}

export const message = {
  info: createByType('info'),
  success: createByType('success'),
  warning: createByType('warning'),
  error: createByType('error')
}