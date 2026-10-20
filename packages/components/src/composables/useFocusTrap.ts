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
}

export function useFocusTrap(target: Ref<HTMLElement | null | undefined>, options: FocusTrapOptions = {}) {
  const { escapeDeactivates = true, returnFocus = true, initialFocus = true, onEscape } = options
  let previouslyFocused: HTMLElement | null = null
  let activated = false

  const getFocusable = (): HTMLElement[] =>
    Array.from(target.value?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    )

  const onKeydown = (e: KeyboardEvent): void => {
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

    if (e.shiftKey && (active === first || !target.value?.contains(active))) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
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