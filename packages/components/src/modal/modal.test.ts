import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { NvModal } from './index'

describe('Modal', () => {
  it('renders dialog with correct ARIA when open', () => {
    const wrapper = mount(NvModal, {
      props: { modelValue: true, title: '标题' },
      slots: { default: '<p>内容</p>' }
    })
    const dialog = wrapper.find('[role="dialog"]')
    expect(dialog.exists()).toBe(true)
    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-labelledby')).toBeTruthy()
    expect(wrapper.text()).toContain('标题')
    expect(wrapper.text()).toContain('内容')
  })

  it('emits open on mount when visible', () => {
    const wrapper = mount(NvModal, {
      props: { modelValue: true, title: '标题' }
    })
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('closes via close button and emits update:modelValue', async () => {
    const wrapper = mount(NvModal, {
      props: { modelValue: true, title: '标题' }
    })
    await wrapper.find('.nv-modal__close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    await wrapper.setProps({ modelValue: false })
    await nextTick()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('closes on overlay click when closeOnClickModal', async () => {
    const wrapper = mount(NvModal, {
      props: { modelValue: true, title: '标题' }
    })
    await wrapper.find('.nv-modal__overlay').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('closes on Escape when closeOnEsc', async () => {
    const wrapper = mount(NvModal, {
      props: { modelValue: true, title: '标题' }
    })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvModal, {
      props: { modelValue: true, title: '标题' },
      slots: { default: '<p>内容</p>' }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})