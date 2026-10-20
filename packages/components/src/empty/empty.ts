import type { ExtractPropTypes } from 'vue'

export const emptyProps = {
  description: { type: String, default: '' },
  image: { type: String, default: '' }
} as const

export type EmptyProps = ExtractPropTypes<typeof emptyProps>