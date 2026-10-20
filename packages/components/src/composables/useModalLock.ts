import { onBeforeUnmount, watchEffect, type Ref } from 'vue'
import { popOverlay, pushOverlay } from './overlayStack'

/**
 * 浮层（Modal / Drawer）打开期间的三个副作用：
 * 1. 滚动锁定 —— 锁定 document.body 的 overflow，关闭时恢复，避免背景滚动穿透；
 * 2. 背景 inert —— 将 body 下除「当前栈顶弹层」之外的直接子节点标记为 `inert`，
 *    使背景（以及被覆盖的下层弹层）无法被聚焦 / 点击 / 屏幕阅读器访问；
 * 3. 焦点归还 —— 施加 inert 会让背景的当前焦点元素立即失焦，因此在失焦前记录它，
 *    关闭时将焦点归还给触发元素（多层时栈顶优先，归还到下层弹层内的焦点元素）。
 *
 * 以上三条统一委托给全局弹层栈 overlayStack 协调，以保证多层弹层嵌套下的正确行为。
 *
 * 使用 watchEffect 而非 watch(active)：浮层的根节点由 `v-if` 条件渲染，模板 ref
 * 的绑定时机晚于首帧 post-flush，单纯监听 active 会在 rootRef 仍为 null 时提前返回。
 * watchEffect 同时追踪 active 与 rootRef，rootRef 一旦挂载便会重新触发并推栈。
 */
export function useModalLock(active: Ref<boolean>, rootRef: Ref<HTMLElement | null>): void {
  let pushed: HTMLElement | null = null

  const restore = (el: HTMLElement | null): void => {
    // 延迟到 inert 全部移除、DOM 稳定后再归还，避免被即时失焦逻辑打断
    if (el && el.isConnected) requestAnimationFrame(() => el.focus?.())
  }

  watchEffect(
    () => {
      const root = rootRef.value
      if (active.value && root) {
        if (pushed !== root) {
          // 必须在施加 inert 前记录当前焦点，否则 inert 生效后焦点会落到 body
          const restoreFocusEl = document.activeElement as HTMLElement | null
          pushOverlay(root, restoreFocusEl)
          pushed = root
        }
      } else if (pushed) {
        const restoreFocusEl = popOverlay(pushed)
        pushed = null
        restore(restoreFocusEl)
      }
    },
    { flush: 'post' }
  )

  onBeforeUnmount(() => {
    if (pushed) {
      const restoreFocusEl = popOverlay(pushed)
      pushed = null
      restore(restoreFocusEl)
    }
  })
}