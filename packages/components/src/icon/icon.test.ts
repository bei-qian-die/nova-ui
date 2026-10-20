import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvIcon } from './index'

describe('Icon', () => {
  it('renders an svg', () => {
    const wrapper = mount(NvIcon, { props: { name: 'check' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('is hidden from a11y tree by default', () => {
    const wrapper = mount(NvIcon, { props: { name: 'search' } })
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
  })

  it('exposes image role when label provided', () => {
    const wrapper = mount(NvIcon, { props: { name: 'star', label: '收藏' } })
    expect(wrapper.find('svg').attributes('role')).toBe('img')
    expect(wrapper.find('svg').attributes('aria-label')).toBe('收藏')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvIcon, { props: { name: 'info', label: '信息' } })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})