import { withInstall } from '../utils/with-install'
import Tooltip from './Tooltip.vue'

export const NvTooltip = withInstall(Tooltip)
export default NvTooltip

export type TooltipInstance = InstanceType<typeof Tooltip>

export type { TooltipProps, TooltipPlacement, TooltipTrigger } from './tooltip'
export { tooltipProps, tooltipPlacements, tooltipTriggers } from './tooltip'