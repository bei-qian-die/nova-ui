import type { ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue'

export const tabPaneProps = {
  label: { type: String, default: '' },
  name: { type: [String, Number] as PropType<string | number> },
  disabled: { type: Boolean, default: false }
} as const

export type TabPaneProps = ExtractPropTypes<typeof tabPaneProps>

export interface TabPaneMeta {
  name: string | number
  label: string
  disabled: boolean
  tabId: string
  panelId: string
}

export interface TabsContext {
  activeName: Readonly<Ref<string | number>>
  registerPane: (pane: TabPaneMeta) => void
  unregisterPane: (pane: TabPaneMeta) => void
}

export const tabsContextKey = Symbol('nv-tabs-context') as InjectionKey<TabsContext>