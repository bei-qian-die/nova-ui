import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvDivider } from './index'

describe('Divider', () => {
  it('renders horizontal by default', () => {
    const wrapper = mount(NvDivider)
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
  })

  it('renders content slot', () => {
    const wrapper = mount(NvDivider, { slots: { default: '分割' } })
    expect(wrapper.text()).toContain('分割')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvDivider)
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})