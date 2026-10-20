import { computed, ref, watch, type Ref } from 'vue'

type EmitFn = (event: string, ...args: unknown[]) => void

export interface UseVModelOptions<T> {
  defaultValue?: T
  onChange?: (value: T, prev: T) => void
}

export function useVModel<P extends object, K extends keyof P>(
  props: P,
  key: K,
  emit?: EmitFn,
  options: UseVModelOptions<P[K]> = {}
): Ref<P[K]> {
  const { defaultValue, onChange } = options
  const isControlled = (): boolean => props[key] !== undefined

  const innerValue = ref(isControlled() ? props[key] : defaultValue) as Ref<P[K]>

  watch(
    () => props[key],
    (val) => {
      if (val !== undefined) innerValue.value = val
    }
  )

  return computed<P[K]>({
    get: () => (isControlled() ? props[key] : innerValue.value),
    set: (next) => {
      const prev = isControlled() ? props[key] : innerValue.value
      if (Object.is(next, prev)) return
      onChange?.(next, prev)
      if (!isControlled()) innerValue.value = next
      emit?.(`update:${String(key)}`, next)
    }
  })
}