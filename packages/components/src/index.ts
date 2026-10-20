import type { App, Plugin } from 'vue'
import { NvButton } from './button'
import { NvIcon } from './icon'
import { NvTag } from './tag'
import { NvBadge } from './badge'
import { NvAvatar } from './avatar'
import { NvDivider } from './divider'
import { NvLink } from './link'
import { NvSpace } from './space'
import { NvInput } from './input'
import { NvTextarea } from './textarea'
import { NvCheckbox } from './checkbox'
import { NvRadio } from './radio'
import { NvSwitch } from './switch'
import { NvSelect } from './select'
import { NvForm, NvFormItem } from './form'
import { NvSlider } from './slider'
import { NvRate } from './rate'
import { NvTabs, NvTabPane } from './tabs'
import { NvPagination } from './pagination'
import { NvEmpty } from './empty'
import { NvTooltip } from './tooltip'
import { NvModal } from './modal'
import { NvDrawer } from './drawer'
import { NvMessage } from './message'
import { NvLoading } from './loading'
import { NvAlert } from './alert'

export * from './button'
export * from './icon'
export * from './tag'
export * from './badge'
export * from './avatar'
export * from './divider'
export * from './link'
export * from './space'
export * from './input'
export * from './textarea'
export * from './checkbox'
export * from './radio'
export * from './switch'
export * from './select'
export * from './form'
export * from './slider'
export * from './rate'
export * from './tabs'
export * from './pagination'
export * from './empty'
export * from './tooltip'
export * from './modal'
export * from './drawer'
export * from './message'
export * from './loading'
export * from './alert'
export * from './theme/runtime'

const components: Plugin[] = [
  NvButton,
  NvIcon,
  NvTag,
  NvBadge,
  NvAvatar,
  NvDivider,
  NvLink,
  NvSpace,
  NvInput,
  NvTextarea,
  NvCheckbox,
  NvRadio,
  NvSwitch,
  NvSelect,
  NvForm,
  NvSlider,
  NvRate,
  NvTabs,
  NvPagination,
  NvEmpty,
  NvTooltip,
  NvModal,
  NvDrawer,
  NvMessage,
  NvLoading,
  NvAlert
]

export const install = (app: App): void => {
  components.forEach((component) => app.use(component))
}

const plugin: Plugin = { install }

export default plugin

declare module 'vue' {
  export interface GlobalComponents {
    NvButton: typeof NvButton
    NvIcon: typeof NvIcon
    NvTag: typeof NvTag
    NvBadge: typeof NvBadge
    NvAvatar: typeof NvAvatar
    NvDivider: typeof NvDivider
    NvLink: typeof NvLink
    NvSpace: typeof NvSpace
    NvInput: typeof NvInput
    NvTextarea: typeof NvTextarea
    NvCheckbox: typeof NvCheckbox
    NvRadio: typeof NvRadio
    NvSwitch: typeof NvSwitch
    NvSelect: typeof NvSelect
    NvForm: typeof NvForm
    NvFormItem: typeof NvFormItem
    NvSlider: typeof NvSlider
    NvRate: typeof NvRate
    NvTabs: typeof NvTabs
    NvTabPane: typeof NvTabPane
    NvPagination: typeof NvPagination
    NvEmpty: typeof NvEmpty
    NvTooltip: typeof NvTooltip
    NvModal: typeof NvModal
    NvDrawer: typeof NvDrawer
    NvMessage: typeof NvMessage
    NvLoading: typeof NvLoading
    NvAlert: typeof NvAlert
  }
}