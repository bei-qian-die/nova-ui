import { expectTypeOf } from 'vitest'
import type { Ref } from 'vue'
import type {
  ButtonInstance,
  ButtonProps,
  ButtonSize,
  ButtonType,
  InputInstance,
  InputProps,
  SelectInstance,
  SwitchInstance,
  TabsInstance,
  TabPaneInstance,
  FormInstance,
  FormItemInstance,
  ModalInstance
} from '../src'
import { useVModel } from '../src/composables/useVModel'

/**
 * 编译期类型测试（由 `vue-tsc --noEmit` 校验）。
 * 覆盖硬骨头 1（类型推导 + InstanceType）与硬骨头 2（useVModel 受控/非受控统一）。
 */

// ── 硬骨头 1：导出组件实例类型（InstanceType<typeof SFC>）──
expectTypeOf<ButtonInstance>().toHaveProperty('focus')
expectTypeOf<ButtonInstance>().toHaveProperty('blur')
expectTypeOf<InputInstance>().toHaveProperty('focus')
expectTypeOf<InputInstance>().toHaveProperty('blur')
expectTypeOf<InputInstance>().toHaveProperty('clear')
expectTypeOf<InputInstance>().toHaveProperty('select')

// 组合式组件（Form/FormItem、Tabs/TabPane）同样导出实例类型
expectTypeOf<FormInstance>().toBeObject()
expectTypeOf<FormItemInstance>().toBeObject()
expectTypeOf<TabsInstance>().toBeObject()
expectTypeOf<TabPaneInstance>().toBeObject()
expectTypeOf<SelectInstance>().toBeObject()
expectTypeOf<SwitchInstance>().toBeObject()
expectTypeOf<ModalInstance>().toBeObject()

// ── 硬骨头 1：props 从运行时常量完整推导（ExtractPropTypes）──
expectTypeOf<ButtonProps['type']>().toEqualTypeOf<ButtonType>()
expectTypeOf<ButtonProps['type']>().toEqualTypeOf<
  'default' | 'primary' | 'success' | 'warning' | 'danger' | 'text'
>()
expectTypeOf<ButtonProps['size']>().toEqualTypeOf<ButtonSize>()
expectTypeOf<ButtonProps['size']>().toEqualTypeOf<'small' | 'medium' | 'large'>()
expectTypeOf<InputProps['modelValue']>().toEqualTypeOf<string | number | undefined>()

// ── 硬骨头 2：useVModel 返回统一的 Ref，受控/非受控共用一个类型 ──
interface Model { modelValue?: boolean }

expectTypeOf(
  useVModel({ modelValue: false } as Model, 'modelValue')
).toEqualTypeOf<Ref<boolean | undefined>>()

expectTypeOf(
  useVModel({} as Model, 'modelValue', undefined, { defaultValue: true })
).toEqualTypeOf<Ref<boolean | undefined>>()