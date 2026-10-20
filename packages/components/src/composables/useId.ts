import { useId as vueUseId } from 'vue'

export function useId(prefix = 'nv-id'): string {
  return `${prefix}-${vueUseId()}`
}