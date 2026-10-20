import { expectTypeOf, test } from 'vitest'
import type { SelectEmits, SelectOption, SelectProps } from '../src/select'

interface City extends SelectOption {
  value: 'beijing' | 'shanghai'
}

test('SelectProps<T> 将 modelValue 收敛为 T["value"]', () => {
  expectTypeOf<SelectProps<City>['modelValue']>().toEqualTypeOf<
    'beijing' | 'shanghai' | ('beijing' | 'shanghai')[] | undefined
  >()
})

test('SelectProps 默认泛型为 SelectOption', () => {
  expectTypeOf<SelectProps['options']>().toEqualTypeOf<SelectOption[]>()
})

test('SelectEmits<T> 收敛 change 回调参数类型', () => {
  expectTypeOf<SelectEmits<City>['change']>().toEqualTypeOf<
    ['beijing' | 'shanghai' | ('beijing' | 'shanghai')[] | undefined]
  >()
})