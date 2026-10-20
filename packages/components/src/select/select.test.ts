import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvSelect } from './index'

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橘子', value: 'orange' }
]

describe('Select', () => {
  it('opens dropdown and selects an option', async () => {
    const wrapper = mount(NvSelect, { props: { options, placeholder: '请选择' } })
    await wrapper.find('.nv-select__trigger').trigger('click')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    await wrapper.findAll('[role="option"]')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('supports multiple selection', async () => {
    const wrapper = mount(NvSelect, { props: { options, multiple: true } })
    await wrapper.find('.nv-select__trigger').trigger('click')
    await wrapper.findAll('[role="option"]')[0].trigger('click')
    await wrapper.findAll('[role="option"]')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['apple', 'banana']])
  })

  it('navigates with keyboard and selects with Enter', async () => {
    const wrapper = mount(NvSelect, { props: { options, placeholder: '请选择' } })
    const trigger = wrapper.find('.nv-select__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['apple'])
  })

  it('clears the value when clearable', async () => {
    const wrapper = mount(NvSelect, {
      props: { options, modelValue: 'apple', clearable: true, placeholder: '请选择' }
    })
    await wrapper.find('[aria-label="清空"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('closes the dropdown on Escape', async () => {
    const wrapper = mount(NvSelect, { props: { options } })
    const trigger = wrapper.find('.nv-select__trigger')
    await trigger.trigger('click')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    await trigger.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
  })

  it('does not select a disabled option', async () => {
    const opts = [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana', disabled: true }
    ]
    const wrapper = mount(NvSelect, { props: { options: opts } })
    await wrapper.find('.nv-select__trigger').trigger('click')
    await wrapper.findAll('[role="option"]')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('clears a multiple selection back to an empty array', async () => {
    const wrapper = mount(NvSelect, {
      props: { options, modelValue: ['apple', 'banana'], multiple: true, clearable: true }
    })
    await wrapper.find('[aria-label="清空"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([[]])
  })

  it('supports Home and End keys', async () => {
    const wrapper = mount(NvSelect, { props: { options } })
    const trigger = wrapper.find('.nv-select__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'End' })
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['orange'])
  })

  it('renders an empty state when there are no options', async () => {
    const wrapper = mount(NvSelect, { props: { options: [], placeholder: '无选项' } })
    await wrapper.find('.nv-select__trigger').trigger('click')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    expect(wrapper.find('.nv-select__empty').exists()).toBe(true)
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvSelect, { props: { options, placeholder: '请选择' } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})