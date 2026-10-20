import type { ExtractPropTypes, PropType } from 'vue'

export const linkTypes = ['default', 'primary', 'success', 'warning', 'danger'] as const

export type LinkType = (typeof linkTypes)[number]

export const linkProps = {
  type: { type: String as PropType<LinkType>, default: 'default' },
  href: { type: String, default: '' },
  target: { type: String as PropType<'_blank' | '_self' | '_parent' | '_top'>, default: '_self' },
  disabled: { type: Boolean, default: false },
  underline: { type: [Boolean, String] as PropType<boolean | 'always' | 'hover' | 'never'>, default: 'hover' }
} as const

export type LinkProps = ExtractPropTypes<typeof linkProps>