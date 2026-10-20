import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { afterEach, describe, expect, it } from 'vitest'
import { NvLoading, loading } from './index'

describe('Loading', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders mask with status role when loading', () => {
    const wrapper = mount(NvLoading, {
      props: { loading: true, text: '加载中' },
      slots: { default: '<div>内容</div>' }
    })
    const mask = wrapper.find('.nv-loading__mask')
    expect(mask.exists()).toBe(true)
    expect(mask.attributes('role')).toBe('status')
    expect(wrapper.text()).toContain('加载中')
  })

  it('does not render mask when not loading', () => {
    const wrapper = mount(NvLoading, { props: { loading: false } })
    expect(wrapper.find('.nv-loading__mask').exists()).toBe(false)
  })

  it('renders spinner icon', () => {
    const wrapper = mount(NvLoading, { props: { loading: true } })
    expect(wrapper.find('.nv-loading__spinner svg').exists()).toBe(true)
  })

  it('loading service mounts fullscreen mask and closes', () => {
    const close = loading({ text: '加载中' })
    const mask = document.body.querySelector('.nv-loading__mask--fullscreen')
    expect(mask).toBeTruthy()
    expect(mask?.textContent).toContain('加载中')
    close()
    expect(document.body.querySelector('.nv-loading__mask')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvLoading, { props: { loading: true, text: '加载中' } })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})