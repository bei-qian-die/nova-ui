import { withInstall } from '../utils/with-install'
import Drawer from './Drawer.vue'

export const NvDrawer = withInstall(Drawer)
export default NvDrawer

export type DrawerInstance = InstanceType<typeof Drawer>

export type { DrawerProps, DrawerEmits, DrawerDirection } from './drawer'
export { drawerProps, drawerEmits, drawerDirections } from './drawer'