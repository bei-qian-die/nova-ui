import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvCheckbox } from './index'

describe('Checkbox', () => {
  it('toggles boolean modelValue', async () => {
    const wrapper = mount(NvCheckbox, { props: { modelValue: false } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('adds and removes value in array mode', async () => {
    const wrapper = mount(NvCheckbox, { props: { modelValue: ['a'], value: 'a' } })
    await wrapper.find('input').setValue(false)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('sets indeterminate on the native input', () => {
    const wrapper = mount(NvCheckbox, { props: { indeterminate: true } })
    expect((wrapper.find('input').element as HTMLInputElement).indeterminate).toBe(true)
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvCheckbox, { props: { label: '同意条款' } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})