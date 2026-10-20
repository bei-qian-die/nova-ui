import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { NvTabPane, NvTabs } from './index'

async function renderTabs(props: Record<string, unknown> = {}) {
  const wrapper = mount(NvTabs, {
    props,
    slots: {
      default: () => [
        h(NvTabPane, { name: 'a', label: '标签 A' }, () => '内容 A'),
        h(NvTabPane, { name: 'b', label: '标签 B' }, () => '内容 B'),
        h(NvTabPane, { name: 'c', label: '标签 C', disabled: true }, () => '内容 C')
      ]
    }
  })
  await nextTick()
  return wrapper
}

describe('Tabs', () => {
  it('renders tablist, tabs and tabpanels', async () => {
    const wrapper = await renderTabs()
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    expect(wrapper.findAll('[role="tab"]').length).toBe(3)
    expect(wrapper.findAll('[role="tabpanel"]').length).toBe(3)
  })

  it('activates the first tab by default', async () => {
    const wrapper = await renderTabs()
    const tabs = wrapper.findAll('[role="tab"]')
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(tabs[1].attributes('aria-selected')).toBe('false')
  })

  it('switches active tab on click and emits events', async () => {
    const wrapper = await renderTabs()
    await wrapper.findAll('[role="tab"]')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    expect(wrapper.emitted('change')?.[0]).toEqual(['b'])
    expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true')
  })

  it('moves selection with arrow keys and skips disabled tabs', async () => {
    const wrapper = await renderTabs()
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b'])
    await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['a'])
  })

  it('does not select a disabled tab', async () => {
    const wrapper = await renderTabs()
    await wrapper.findAll('[role="tab"]')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('has no a11y violations', async () => {
    const wrapper = await renderTabs()
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})