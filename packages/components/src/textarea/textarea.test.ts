import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvTextarea } from './index'

describe('Textarea', () => {
  it('renders and updates value', async () => {
    const wrapper = mount(NvTextarea, { props: { modelValue: '' } })
    await wrapper.find('textarea').setValue('hi')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('renders count x/y', () => {
    const wrapper = mount(NvTextarea, {
      props: { modelValue: 'ab', maxlength: 10, showCount: true }
    })
    expect(wrapper.text()).toContain('2/10')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvTextarea, { props: { label: '描述' } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })

  it('exposes focus/blur and emits focus/blur events', async () => {
    const wrapper = mount(NvTextarea, { props: { modelValue: '' } })
    const vm = wrapper.vm as any

    vm.focus()
    vm.blur()

    await wrapper.find('textarea').trigger('focus')
    await wrapper.find('textarea').trigger('blur')
    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.emitted('blur')).toBeTruthy()
  })
})