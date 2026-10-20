import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvBadge } from './index'

describe('Badge', () => {
  it('renders value', () => {
    const wrapper = mount(NvBadge, { props: { value: 5 }, slots: { default: '消息' } })
    expect(wrapper.text()).toContain('5')
  })

  it('caps value at max', () => {
    const wrapper = mount(NvBadge, { props: { value: 120, max: 99 } })
    expect(wrapper.text()).toContain('99+')
  })

  it('renders dot', () => {
    const wrapper = mount(NvBadge, { props: { dot: true } })
    expect(wrapper.find('.is-dot').exists()).toBe(true)
  })

  it('hides when hidden', () => {
    const wrapper = mount(NvBadge, { props: { value: 3, hidden: true } })
    expect(wrapper.find('sup').exists()).toBe(false)
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvBadge, { props: { value: 3 }, slots: { default: '通知' } })
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})