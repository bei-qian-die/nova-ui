import { onBeforeUnmount, type Ref } from 'vue'

export function useClickOutside(
  target: Ref<HTMLElement | null | undefined>,
  handler: (e: MouseEvent) => void
): void {
  const onClick = (e: MouseEvent): void => {
    const el = target.value
    if (el && !el.contains(e.target as Node)) handler(e)
  }
  document.addEventListener('click', onClick, true)
  onBeforeUnmount(() => document.removeEventListener('click', onClick, true))
}