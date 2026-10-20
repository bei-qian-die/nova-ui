import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvRadio } from './index'

describe('Radio', () => {
  it('selects and emits value', async () => {
    const wrapper = mount(NvRadio, { props: { modelValue: 'b', value: 'a' } })
    await wrapper.find('input').setValue(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['a'])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('reflects checked state from modelValue', () => {
    const wrapper = mount(NvRadio, { props: { modelValue: 'a', value: 'a' } })
    expect(wrapper.classes()).toContain('nv-radio')
    expect(wrapper.classes()).toContain('is-checked')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvRadio, { props: { value: 'a', label: '选项 A' } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})