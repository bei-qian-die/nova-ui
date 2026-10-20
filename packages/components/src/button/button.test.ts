import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvButton } from './index'

describe('Button', () => {
  it('renders slot content', () => {
    const wrapper = mount(NvButton, { slots: { default: '确定' } })
    expect(wrapper.text()).toContain('确定')
    expect(wrapper.classes()).toContain('nv-button')
  })

  it('applies type/size modifiers', () => {
    const wrapper = mount(NvButton, { props: { type: 'primary', size: 'large' } })
    expect(wrapper.classes()).toContain('nv-button--primary')
    expect(wrapper.classes()).toContain('nv-button--large')
  })

  it('emits click event', async () => {
    const wrapper = mount(NvButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(NvButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(NvButton, { props: { loading: true } })
    expect(wrapper.attributes('aria-busy')).toBe('true')
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvButton, { slots: { default: '按钮' } })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  it('exposes focus and blur methods', () => {
    const wrapper = mount(NvButton)
    const vm = wrapper.vm as any
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
    vm.focus()
    vm.blur()
  })
})