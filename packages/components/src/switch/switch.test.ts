import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvSwitch } from './index'

describe('Switch', () => {
  it('toggles on click', async () => {
    const wrapper = mount(NvSwitch, { props: { modelValue: false } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('toggles with Space key (explicit keyboard support)', async () => {
    const wrapper = mount(NvSwitch, { props: { modelValue: false } })
    await wrapper.find('button').trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(NvSwitch, { props: { modelValue: false, disabled: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('change')).toBeFalsy()
  })

  it('exposes switch role and aria-checked', () => {
    const wrapper = mount(NvSwitch, { props: { modelValue: true } })
    const button = wrapper.find('button')
    expect(button.attributes('role')).toBe('switch')
    expect(button.attributes('aria-checked')).toBe('true')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvSwitch, {
      props: { modelValue: false, activeText: '开', inactiveText: '关' }
    })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})