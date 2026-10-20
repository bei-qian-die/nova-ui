import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { useClickOutside } from './useClickOutside'

const Harness = defineComponent({
  setup() {
    const target = ref<HTMLElement | null>(null)
    const outside = ref(0)
    useClickOutside(target, () => {
      outside.value++
    })
    return { target, outside }
  },
  template:
    '<div><div ref="target" class="target"><button>inner</button></div><div class="other">outer</div></div>'
})

describe('useClickOutside', () => {
  it('triggers the handler when clicking outside', () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    const other = wrapper.find('.other').element
    other.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect((wrapper.vm as any).outside).toBe(1)
    wrapper.unmount()
  })

  it('does not trigger the handler when clicking inside', () => {
    const wrapper = mount(Harness, { attachTo: document.body })
    const button = wrapper.find('button').element
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect((wrapper.vm as any).outside).toBe(0)
    wrapper.unmount()
  })
})