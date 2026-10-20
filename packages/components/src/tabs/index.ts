import { withInstall } from '../utils/with-install'
import Tabs from './Tabs.vue'
import TabPane from './TabPane.vue'

export const NvTabs = withInstall(Tabs)
export const NvTabPane = withInstall(TabPane)
export default NvTabs

export type TabsInstance = InstanceType<typeof Tabs>
export type TabPaneInstance = InstanceType<typeof TabPane>

export type { TabsProps, TabsType, TabsEmits } from './tabs'
export { tabsProps, tabsEmits, tabsTypes } from './tabs'
export type { TabPaneProps } from './tab-pane'
export { tabPaneProps } from './tab-pane'