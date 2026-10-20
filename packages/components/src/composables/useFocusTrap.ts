import { onBeforeUnmount, type Ref } from 'vue'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

export interface FocusTrapOptions {
  escapeDeactivates?: boolean
  returnFocus?: boolean
  initialFocus?: boolean
  onEscape?: () => void
  /** 返回 false 时忽略本次按键（多层弹层中仅栈顶弹层处理 Esc / Tab） */
  when?: () => boolean
}

export function useFocusTrap(target: Ref<HTMLElement | null | undefined>, options: FocusTrapOptions = {}) {
  const {
    escapeDeactivates = true,
    returnFocus = true,
    initialFocus = true,
    onEscape,
    when
  } = options
  let previouslyFocused: HTMLElement | null = null
  let activated = false

  const getFocusable = (): HTMLElement[] =>
    Array.from(target.value?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    )

  const onKeydown = (e: KeyboardEvent): void => {
    if (when && !when()) return

    if (e.key === 'Escape' && escapeDeactivates) {
      e.preventDefault()
      onEscape?.()
      return
    }
    if (e.key !== 'Tab') return

    const nodes = getFocusable()
    if (nodes.length === 0) {
      e.preventDefault()
      return
    }

    const first = nodes[0]
    const last = nodes[nodes.length - 1]
    const active = document.activeElement as HTMLElement | null
    // 焦点在弹层之外（例如点击遮罩后落回 body）：无论 Shift 与否都拉回面板内
    const outside = active == null || !target.value?.contains(active)

    if (e.shiftKey) {
      if (active === first || outside) {
        e.preventDefault()
        last.focus()
      }
    } else if (active === last || outside) {
      e.preventDefault()
      first.focus()
    }
  }

  function activate(): void {
    if (activated || !target.value) return
    activated = true
    previouslyFocused = document.activeElement as HTMLElement | null
    document.addEventListener('keydown', onKeydown, true)
    if (initialFocus) {
      requestAnimationFrame(() => (getFocusable()[0] ?? target.value)?.focus())
    }
  }

  function deactivate(): void {
    if (!activated) return
    activated = false
    document.removeEventListener('keydown', onKeydown, true)
    if (returnFocus) previouslyFocused?.focus?.()
    previouslyFocused = null
  }

  onBeforeUnmount(deactivate)

  return { activate, deactivate }
}