import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvTooltip } from './index'

describe('Tooltip', () => {
  it('renders slot and hides content by default', () => {
    const wrapper = mount(NvTooltip, {
      props: { content: '提示内容' },
      slots: { default: '<button>触发</button>' }
    })
    expect(wrapper.text()).toContain('触发')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('shows content on hover', async () => {
    const wrapper = mount(NvTooltip, {
      props: { content: '提示内容' },
      slots: { default: '<button>触发</button>' }
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('[role="tooltip"]').text()).toBe('提示内容')
    await wrapper.trigger('mouseleave')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('toggles content on click trigger', async () => {
    const wrapper = mount(NvTooltip, {
      props: { content: '提示内容', trigger: 'click' },
      slots: { default: '<button>触发</button>' }
    })
    await wrapper.trigger('click')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(true)
    await wrapper.trigger('click')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('binds aria-describedby when visible', async () => {
    const wrapper = mount(NvTooltip, {
      props: { content: '提示内容', trigger: 'click' },
      slots: { default: '<button>触发</button>' }
    })
    await wrapper.trigger('click')
    const id = wrapper.find('[role="tooltip"]').attributes('id')
    expect(wrapper.attributes('aria-describedby')).toBe(id)
  })

  it('does not show when disabled', async () => {
    const wrapper = mount(NvTooltip, {
      props: { content: '提示内容', disabled: true },
      slots: { default: '<button>触发</button>' }
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false)
  })

  it('has no a11y violations when visible', async () => {
    const wrapper = mount(NvTooltip, {
      props: { content: '提示内容', trigger: 'click' },
      slots: { default: '<button>触发</button>' }
    })
    await wrapper.trigger('click')
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})