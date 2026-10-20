import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvSlider } from './index'

describe('Slider', () => {
  it('renders with slider role and aria attributes', () => {
    const wrapper = mount(NvSlider, { props: { modelValue: 20, min: 0, max: 100 } })
    const slider = wrapper.find('[role="slider"]')
    expect(slider.exists()).toBe(true)
    expect(slider.attributes('aria-valuemin')).toBe('0')
    expect(slider.attributes('aria-valuemax')).toBe('100')
    expect(slider.attributes('aria-valuenow')).toBe('20')
  })

  it('increments value with ArrowRight and emits events', async () => {
    const wrapper = mount(NvSlider, { props: { modelValue: 10 } })
    const slider = wrapper.find('[role="slider"]')
    await slider.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([11])
    expect(wrapper.emitted('change')?.[0]).toEqual([11])
  })

  it('decrements value with ArrowLeft', async () => {
    const wrapper = mount(NvSlider, { props: { modelValue: 10 } })
    await wrapper.find('[role="slider"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([9])
  })

  it('jumps to min/max with Home/End', async () => {
    const wrapper = mount(NvSlider, { props: { modelValue: 50, min: 0, max: 100 } })
    const slider = wrapper.find('[role="slider"]')
    await slider.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
    await slider.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([100])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mount(NvSlider, { props: { modelValue: 10, disabled: true } })
    const slider = wrapper.find('[role="slider"]')
    await slider.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(slider.attributes('tabindex')).toBe('-1')
  })

  it('updates value when clicking the track', async () => {
    const wrapper = mount(NvSlider, { props: { modelValue: 0, min: 0, max: 100 } })
    const runway = wrapper.find('.nv-slider__runway').element as HTMLElement
    runway.getBoundingClientRect = () =>
      ({ left: 0, width: 100, right: 100, top: 0, bottom: 10, height: 10, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect
    await wrapper.find('.nv-slider__runway').trigger('click', { clientX: 50 })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([50])
  })

  it('renders tooltip when showTooltip', () => {
    const wrapper = mount(NvSlider, { props: { modelValue: 30, showTooltip: true } })
    expect(wrapper.find('.nv-slider__tooltip').text()).toBe('30')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvSlider, { props: { modelValue: 30 } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})