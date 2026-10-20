import { withInstall } from '../utils/with-install'
import Slider from './Slider.vue'

export const NvSlider = withInstall(Slider)
export default NvSlider

export type SliderInstance = InstanceType<typeof Slider>

export type { SliderProps, SliderEmits } from './slider'
export { sliderProps, sliderEmits } from './slider'