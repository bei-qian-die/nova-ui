import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvSpace } from './index'

describe('Space', () => {
  it('renders slot content', () => {
    const wrapper = mount(NvSpace, { slots: { default: '<span>1</span><span>2</span>' } })
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.classes()).toContain('nv-space--horizontal')
  })

  it('supports vertical direction', () => {
    const wrapper = mount(NvSpace, { props: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('nv-space--vertical')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvSpace, { slots: { default: '内容' } })
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})