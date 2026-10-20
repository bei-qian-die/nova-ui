/* eslint-disable vue/one-component-per-file */
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useFocusTrap, type FocusTrapOptions } from './useFocusTrap'

const press = (key: string, shiftKey = false): KeyboardEvent => {
  const ev = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true })
  document.dispatchEvent(ev)
  return ev
}

const q = (sel: string) => document.querySelector<HTMLElement>(sel)!

function mountTrap(options: FocusTrapOptions = {}) {
  const target = ref<HTMLElement | null>(null)
  let trap!: ReturnType<typeof useFocusTrap>
  const Harness = defineComponent({
    setup() {
      trap = useFocusTrap(target, { initialFocus: false, ...options })
      return { target }
    },
    template:
      '<div><button type="button" class="outside">outside</button><div ref="target"><button type="button" class="a">a</button><button type="button" class="b">b</button></div></div>'
  })
  const wrapper = mount(Harness, { attachTo: document.body })
  return { wrapper, trap }
}

describe('useFocusTrap', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('wraps Tab from last focusable back to first', () => {
    const { trap } = mountTrap()
    trap.activate()
    q('.b').focus()
    press('Tab')
    expect(document.activeElement).toBe(q('.a'))
  })

  it('wraps Shift+Tab from first focusable back to last', () => {
    const { trap } = mountTrap()
    trap.activate()
    q('.a').focus()
    press('Tab', true)
    expect(document.activeElement).toBe(q('.b'))
  })

  it('pulls focus back into the panel when focus is outside', () => {
    const { trap } = mountTrap()
    trap.activate()
    q('.outside').focus()
    press('Tab')
    expect(document.activeElement).toBe(q('.a'))
  })

  it('does nothing on Tab when no focusable element exists', () => {
    // 单独挂一个空的 target（无 focusable 子节点），验证空态不抛错
    const empty = ref<HTMLElement | null>(null)
    let trap!: ReturnType<typeof useFocusTrap>
    const Harness = defineComponent({
      setup() {
        trap = useFocusTrap(empty, { initialFocus: false })
        return { empty }
      },
      template: '<div><div ref="empty"></div></div>'
    })
    mount(Harness, { attachTo: document.body })
    trap.activate()
    const ev = press('Tab')
    expect(ev.defaultPrevented).toBe(true)
  })

  it('invokes onEscape and prevents default on Escape', () => {
    const onEscape = vi.fn()
    const { trap } = mountTrap({ onEscape })
    trap.activate()
    const ev = press('Escape')
    expect(onEscape).toHaveBeenCalledTimes(1)
    expect(ev.defaultPrevented).toBe(true)
  })

  it('restores focus to previously focused element when returnFocus is true', () => {
    const { trap } = mountTrap({ returnFocus: true })
    q('.outside').focus()
    trap.activate()
    q('.a').focus()
    trap.deactivate()
    expect(document.activeElement).toBe(q('.outside'))
  })

  it('does not restore focus when returnFocus is false', () => {
    // A-1 契约：焦点归还由 useModalLock 统一负责，useFocusTrap 不再重复归还
    const { trap } = mountTrap({ returnFocus: false })
    q('.outside').focus()
    trap.activate()
    q('.a').focus()
    trap.deactivate()
    expect(document.activeElement).toBe(q('.a'))
  })

  it('removes the keydown listener on deactivate', () => {
    const { trap } = mountTrap()
    trap.activate()
    trap.deactivate()
    q('.a').focus()
    press('Tab')
    // 监听已移除，Tab 不再触发焦点循环
    expect(document.activeElement).toBe(q('.a'))
  })

  it('is idempotent when deactivating twice', () => {
    const { trap } = mountTrap()
    trap.activate()
    trap.deactivate()
    expect(() => trap.deactivate()).not.toThrow()
  })
})