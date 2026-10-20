/**
 * 全局弹层栈 —— 统一管理多层 Modal / Drawer 打开期间的「滚动锁定 / 背景 inert / 焦点归还」。
 *
 * 为什么需要全局栈（而不是每个实例各管各的）：
 * 1. inert 需要引用计数 —— 内层关闭时若按 per-instance 逻辑"删掉自己加过的 inert"，
 *    会误删外层仍在生效的 inert，导致背景在外层还开着时提前暴露；
 * 2. 焦点归还要"栈顶优先" —— 只有栈顶弹层的背景 inert 被移除、才能安全地归还焦点；
 * 3. 供焦点陷阱判断"谁才是当前栈顶"，避免多层时 Esc 一次性关闭所有弹层。
 */

export interface OverlayEntry {
  root: HTMLElement
  /** 打开该弹层前拥有焦点的元素，关闭时归还给它 */
  restoreFocusEl: HTMLElement | null
}

const overlayStack: OverlayEntry[] = []
let initialBodyOverflow = ''

/** 让除了栈顶弹层之外的所有 body 直接子节点都 inert，栈空时全部解除 inert */
function applyInert(): void {
  const top = overlayStack[overlayStack.length - 1]?.root
  Array.from(document.body.children).forEach((el) => {
    if (!(el instanceof HTMLElement)) return
    if (!top || el === top) el.removeAttribute('inert')
    else el.setAttribute('inert', '')
  })
}

export function pushOverlay(root: HTMLElement, restoreFocusEl: HTMLElement | null): void {
  if (overlayStack.length === 0) {
    initialBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  overlayStack.push({ root, restoreFocusEl })
  applyInert()
}

export function popOverlay(root: HTMLElement): HTMLElement | null {
  const index = overlayStack.findIndex((entry) => entry.root === root)
  if (index === -1) return null
  const [entry] = overlayStack.splice(index, 1)
  if (overlayStack.length === 0) document.body.style.overflow = initialBodyOverflow
  applyInert()
  return entry.restoreFocusEl
}

export function isTopOverlay(root: HTMLElement | null | undefined): boolean {
  if (!root) return false
  return overlayStack[overlayStack.length - 1]?.root === root
}

/** 清空栈并复位 body 状态（测试 / 应用整体卸载时使用） */
export function resetOverlayStack(): void {
  overlayStack.length = 0
  initialBodyOverflow = ''
  document.body.style.overflow = ''
  applyInert()
}