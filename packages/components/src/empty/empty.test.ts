import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvEmpty } from './index'

describe('Empty', () => {
  it('renders description', () => {
    const wrapper = mount(NvEmpty, { props: { description: '暂无数据' } })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('renders image when provided', () => {
    const wrapper = mount(NvEmpty, { props: { image: 'https://example.com/empty.png' } })
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/empty.png')
  })

  it('renders default illustration when no image', () => {
    const wrapper = mount(NvEmpty)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders action slot content', () => {
    const wrapper = mount(NvEmpty, { slots: { default: '<button>重试</button>' } })
    expect(wrapper.find('button').text()).toBe('重试')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvEmpty, {
      props: { description: '暂无数据' },
      slots: { default: '<button>刷新</button>' }
    })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})