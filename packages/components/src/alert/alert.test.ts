import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvAlert } from './index'

describe('Alert', () => {
  it('renders title and description with alert role', () => {
    const wrapper = mount(NvAlert, { props: { title: '标题', description: '描述' } })
    const el = wrapper.find('.nv-alert')
    expect(el.attributes('role')).toBe('alert')
    expect(el.text()).toContain('标题')
    expect(el.text()).toContain('描述')
  })

  it('applies type modifier', () => {
    const wrapper = mount(NvAlert, { props: { type: 'success', title: '成功' } })
    expect(wrapper.find('.nv-alert').classes()).toContain('nv-alert--success')
  })

  it('shows icon when showIcon', () => {
    const wrapper = mount(NvAlert, { props: { type: 'info', showIcon: true, title: '提示' } })
    expect(wrapper.find('.nv-alert__icon svg').exists()).toBe(true)
  })

  it('emits close when closable', async () => {
    const wrapper = mount(NvAlert, { props: { title: '标题', closable: true } })
    await wrapper.find('.nv-alert__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvAlert, { props: { type: 'error', title: '错误', description: '描述' } })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})