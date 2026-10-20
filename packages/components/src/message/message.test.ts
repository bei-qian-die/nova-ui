import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { NvMessage, message } from './index'

describe('Message', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('renders content and uses status role for info', () => {
    const wrapper = mount(NvMessage, { props: { type: 'info', content: '消息内容' } })
    const el = wrapper.find('.nv-message')
    expect(el.attributes('role')).toBe('status')
    expect(el.text()).toContain('消息内容')
  })

  it('uses alert role for error and warning', () => {
    const errorWrapper = mount(NvMessage, { props: { type: 'error', content: '错误' } })
    expect(errorWrapper.find('.nv-message').attributes('role')).toBe('alert')

    const warningWrapper = mount(NvMessage, { props: { type: 'warning', content: '警告' } })
    expect(warningWrapper.find('.nv-message').attributes('role')).toBe('alert')
  })

  it('emits close when closable button clicked', async () => {
    const wrapper = mount(NvMessage, { props: { type: 'info', content: '消息', closable: true } })
    await wrapper.find('.nv-message__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('auto closes after duration', async () => {
    vi.useFakeTimers()
    const wrapper = mount(NvMessage, { props: { type: 'info', content: '消息', duration: 1000 } })
    vi.advanceTimersByTime(1000)
    expect(wrapper.emitted('close')).toBeTruthy()
    vi.useRealTimers()
  })

  it('message service mounts and closes', () => {
    const close = message.info('服务消息')
    expect(document.body.querySelector('.nv-message')).toBeTruthy()
    close()
    expect(document.body.querySelector('.nv-message')).toBeNull()
  })

  it('has no a11y violations for warning', async () => {
    const wrapper = mount(NvMessage, { props: { type: 'warning', content: '警告内容' } })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})