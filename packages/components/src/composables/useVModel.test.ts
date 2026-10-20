import { nextTick, reactive } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { useVModel } from './useVModel'

describe('useVModel', () => {
  it('controlled: reads the prop and emits update without local change', () => {
    const props = reactive<{ modelValue: string }>({ modelValue: 'a' })
    const emit = vi.fn()
    const v = useVModel(props, 'modelValue', emit)

    expect(v.value).toBe('a')

    v.value = 'b'
    expect(emit).toHaveBeenCalledWith('update:modelValue', 'b')
    expect(v.value).toBe('a')
  })

  it('uncontrolled: falls back to default and updates locally', () => {
    const props = reactive<{ modelValue?: string }>({ modelValue: undefined })
    const emit = vi.fn()
    const v = useVModel(props, 'modelValue', emit, { defaultValue: 'x' })

    expect(v.value).toBe('x')

    v.value = 'y'
    expect(v.value).toBe('y')
    expect(emit).toHaveBeenCalledWith('update:modelValue', 'y')
  })

  it('syncs the internal value when the prop changes externally', async () => {
    const props = reactive<{ modelValue: string }>({ modelValue: 'a' })
    const v = useVModel(props, 'modelValue')

    props.modelValue = 'z'
    await nextTick()
    expect(v.value).toBe('z')
  })

  it('invokes onChange with prev and next values', () => {
    const props = reactive<{ modelValue?: string }>({ modelValue: undefined })
    const onChange = vi.fn()
    const v = useVModel(props, 'modelValue', undefined, { defaultValue: 'x', onChange })

    v.value = 'y'
    expect(onChange).toHaveBeenCalledWith('y', 'x')
  })
})