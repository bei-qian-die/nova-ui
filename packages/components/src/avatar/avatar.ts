import type { ExtractPropTypes, PropType } from 'vue'

export const avatarSizes = ['small', 'medium', 'large'] as const
export const avatarShapes = ['circle', 'square'] as const

export type AvatarSize = (typeof avatarSizes)[number]
export type AvatarShape = (typeof avatarShapes)[number]

export const avatarProps = {
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  size: { type: [String, Number] as PropType<AvatarSize | number>, default: 'medium' },
  shape: { type: String as PropType<AvatarShape>, default: 'circle' },
  fit: {
    type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
    default: 'cover'
  }
} as const

export type AvatarProps = ExtractPropTypes<typeof avatarProps>