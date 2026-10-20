// 手动按需场景：只引入 Button + Input + Modal 三个组件及其独立样式，
// 用于验证 tree-shaking 后「含 CSS」的 gzip 体积 < 30KB。
import { NvButton, NvInput, NvModal } from '@nova-ui/components'
import '@nova-ui/components/button/style.css'
import '@nova-ui/components/input/style.css'
import '@nova-ui/components/modal/style.css'

// 引用组件，模拟真实使用（也防止被 tree-shake 掉）
console.log(NvButton.name, NvInput.name, NvModal.name)