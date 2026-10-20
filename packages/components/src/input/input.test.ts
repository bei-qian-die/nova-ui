import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvInput } from './index'

describe('Input', () => {
  it('renders with placeholder', () => {
    const wrapper = mount(NvInput, { props: { placeholder: '请输入' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入')
    expect(wrapper.classes()).toContain('nv-input')
  })

  it('updates modelValue on input', async () => {
    const wrapper = mount(NvInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('emits clear when clearable and has value', async () => {
    const wrapper = mount(NvInput, { props: { modelValue: 'abc', clearable: true } })
    await wrapper.find('button[aria-label="清空"]').trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
  })

  it('toggles password visibility', async () => {
    const wrapper = mount(NvInput, {
      props: { type: 'password', showPassword: true, modelValue: 'secret' }
    })
    expect(wrapper.find('input').attributes('type')).toBe('password')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvInput, { props: { label: '用户名', modelValue: '' } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })

  it('exposes focus/blur/select/clear methods and emits focus/blur', async () => {
    const wrapper = mount(NvInput, { props: { modelValue: 'abc' } })
    const vm = wrapper.vm as any

    vm.focus()
    vm.select()
    vm.clear()
    expect(wrapper.emitted('clear')).toBeTruthy()

    await wrapper.find('input').trigger('focus')
    await wrapper.find('input').trigger('blur')
    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.emitted('blur')).toBeTruthy()
    vm.blur()
  })
})