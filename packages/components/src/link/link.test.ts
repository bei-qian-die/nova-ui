import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvLink } from './index'

describe('Link', () => {
  it('renders href and content', () => {
    const wrapper = mount(NvLink, { props: { href: '#/x' }, slots: { default: '链接' } })
    expect(wrapper.text()).toContain('链接')
    expect(wrapper.attributes('href')).toBe('#/x')
  })

  it('removes href when disabled', () => {
    const wrapper = mount(NvLink, { props: { href: '#/x', disabled: true } })
    expect(wrapper.attributes('href')).toBeUndefined()
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvLink, { props: { href: '#/x' }, slots: { default: '链接' } })
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })

  it('handles click for enabled and disabled links', async () => {
    const enabled = mount(NvLink, { props: { href: '#/x' } })
    await enabled.find('a').trigger('click')

    const disabled = mount(NvLink, { props: { disabled: true, href: '#/x' } })
    await disabled.find('a').trigger('click')
  })
})