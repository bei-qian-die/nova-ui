import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { NvDrawer } from './index'

describe('Drawer', () => {
  it('renders dialog with direction class and size', () => {
    const wrapper = mount(NvDrawer, {
      props: { modelValue: true, title: '标题', direction: 'rtl', size: '300px' },
      slots: { default: '<p>内容</p>' }
    })
    const panel = wrapper.find('[role="dialog"]')
    expect(panel.exists()).toBe(true)
    expect(panel.classes()).toContain('nv-drawer--rtl')
    expect(panel.attributes('style')).toContain('width: 300px')
    expect(panel.attributes('aria-modal')).toBe('true')
  })

  it('emits open on mount when visible', () => {
    const wrapper = mount(NvDrawer, { props: { modelValue: true, title: '标题' } })
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('closes via close button', async () => {
    const wrapper = mount(NvDrawer, { props: { modelValue: true, title: '标题' } })
    await wrapper.find('.nv-drawer__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('closes on Escape when closeOnEsc', async () => {
    const wrapper = mount(NvDrawer, { props: { modelValue: true, title: '标题' } })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvDrawer, {
      props: { modelValue: true, title: '标题' },
      slots: { default: '<p>内容</p>' }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})