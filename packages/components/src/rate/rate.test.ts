import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvRate } from './index'

describe('Rate', () => {
  it('renders the configured number of stars', () => {
    const wrapper = mount(NvRate, { props: { modelValue: 2, count: 5 } })
    expect(wrapper.findAll('[role="radio"]').length).toBe(5)
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true)
  })

  it('sets value on click and emits events', async () => {
    const wrapper = mount(NvRate, { props: { modelValue: 0 } })
    await wrapper.findAll('[role="radio"]')[2].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    expect(wrapper.emitted('change')?.[0]).toEqual([3])
  })

  it('increments and decrements with arrow keys', async () => {
    const wrapper = mount(NvRate, { props: { modelValue: 2 } })
    const stars = wrapper.findAll('[role="radio"]')
    await stars[2].trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
    await stars[2].trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([1])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(NvRate, { props: { modelValue: 2, disabled: true } })
    await wrapper.findAll('[role="radio"]')[3].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('supports half star selection', async () => {
    const wrapper = mount(NvRate, { props: { modelValue: 0, allowHalf: true } })
    const star = wrapper.findAll('[role="radio"]')[0]
    const el = star.element as HTMLElement
    el.getBoundingClientRect = () =>
      ({ left: 0, width: 20, right: 20, top: 0, bottom: 20, height: 20, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect
    await star.trigger('click', { clientX: 5 })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0.5])
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvRate, { props: { modelValue: 3 } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})