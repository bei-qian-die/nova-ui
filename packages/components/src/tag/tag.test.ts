import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvTag } from './index'

describe('Tag', () => {
  it('renders content and type modifier', () => {
    const wrapper = mount(NvTag, { props: { type: 'success' }, slots: { default: '完成' } })
    expect(wrapper.text()).toContain('完成')
    expect(wrapper.classes()).toContain('nv-tag--success')
  })

  it('emits close when closable', async () => {
    const wrapper = mount(NvTag, { props: { closable: true } })
    await wrapper.find('.nv-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvTag, { slots: { default: '标签' } })
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})