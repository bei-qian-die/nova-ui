import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvAvatar } from './index'

describe('Avatar', () => {
  it('renders image when src provided', () => {
    const wrapper = mount(NvAvatar, { props: { src: 'a.png', alt: 'A' } })
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('falls back to slot content', () => {
    const wrapper = mount(NvAvatar, { slots: { default: 'QZ' } })
    expect(wrapper.text()).toContain('QZ')
  })

  it('falls back to slot when image errors', async () => {
    const wrapper = mount(NvAvatar, { props: { src: 'a.png' }, slots: { default: 'QZ' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('QZ')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvAvatar, { props: { src: 'a.png', alt: '头像' } })
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})