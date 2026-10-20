import { createApp, createVNode } from 'vue'
import type { ExtractPropTypes } from 'vue'
import Loading from './Loading.vue'

export const loadingProps = {
  loading: { type: Boolean, default: true },
  text: { type: String, default: '' },
  fullscreen: { type: Boolean, default: false }
} as const

export type LoadingProps = ExtractPropTypes<typeof loadingProps>

export interface LoadingOptions {
  text?: string
  fullscreen?: boolean
}

export type LoadingClose = () => void

export function createLoading(options: LoadingOptions = {}): LoadingClose {
  const { text = '', fullscreen = true } = options

  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    render: () => createVNode(Loading, { loading: true, text, fullscreen })
  })

  app.mount(container)

  function close(): void {
    app.unmount()
    if (container.parentNode) container.parentNode.removeChild(container)
  }

  return close
}

export function loading(options?: LoadingOptions): LoadingClose {
  return createLoading(options)
}