/* eslint-disable vue/one-component-per-file */
import { defineComponent, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetOverlayStack } from './overlayStack'
import { useModalLock } from './useModalLock'

/** happy-dom 的 rAF 基于 setImmediate，等待一帧让 unlock 的焦点归还回调执行完毕。 */
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

function setup() {
  const active = ref(false)

  const app = document.createElement('div')
  app.id = 'app'
  const trigger = document.createElement('button')
  trigger.textContent = 'trigger'
  app.appendChild(trigger)

  const overlay = document.createElement('div')
  overlay.className = 'overlay'

  document.body.append(app, overlay)
  const rootRef = ref<HTMLElement | null>(overlay)

  const Harness = defineComponent({
    setup() {
      useModalLock(active, rootRef)
      return () => null
    }
  })
  const wrapper = mount(Harness)

  return { active, app, overlay, trigger, wrapper }
}

describe('useModalLock', () => {
  afterEach(() => {
    resetOverlayStack()
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('locks scroll and marks background nodes inert on open', async () => {
    const { active, app } = setup()
    active.value = true
    await nextTick()

    expect(document.body.style.overflow).toBe('hidden')
    expect(app.hasAttribute('inert')).toBe(true)
  })

  it('skips the overlay itself from inert', async () => {
    const { active, overlay } = setup()
    active.value = true
    await nextTick()

    expect(overlay.hasAttribute('inert')).toBe(false)
  })

  it('restores scroll and removes inert on close', async () => {
    const { active, app } = setup()
    active.value = true
    await nextTick()
    active.value = false
    await nextTick()

    expect(document.body.style.overflow).toBe('')
    expect(app.hasAttribute('inert')).toBe(false)
  })

  it('restores focus to the previously focused element after close', async () => {
    const { active, trigger } = setup()
    trigger.focus()
    active.value = true
    await nextTick()

    const focusSpy = vi.spyOn(trigger, 'focus')
    active.value = false
    await nextTick()
    await nextFrame()

    expect(focusSpy).toHaveBeenCalledTimes(1)
  })

  it('does not restore focus when nothing was focused before open', async () => {
    const { active, app } = setup()
    // 不聚焦任何元素，直接开合，不应抛错、也不应误聚焦
    active.value = true
    await nextTick()
    active.value = false
    await nextTick()
    await nextFrame()

    expect(app.hasAttribute('inert')).toBe(false)
  })

  it('restores overflow on unmount when still locked', async () => {
    const { active, wrapper } = setup()
    active.value = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('nested overlays isolate lower layer and restore focus stack-wise', async () => {
    const active1 = ref(false)
    const active2 = ref(false)

    const app = document.createElement('div')
    app.id = 'app'
    const trigger = document.createElement('button')
    app.appendChild(trigger)

    const overlay1 = document.createElement('div')
    overlay1.className = 'overlay1'
    const overlay2 = document.createElement('div')
    overlay2.className = 'overlay2'

    document.body.append(app, overlay1, overlay2)
    const root1 = ref<HTMLElement | null>(overlay1)
    const root2 = ref<HTMLElement | null>(overlay2)

    const Harness = defineComponent({
      setup() {
        useModalLock(active1, root1)
        useModalLock(active2, root2)
        return () => null
      }
    })
    const wrapper = mount(Harness)

    trigger.focus()
    active1.value = true
    await nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    expect(app.hasAttribute('inert')).toBe(true)
    expect(overlay1.hasAttribute('inert')).toBe(false)

    // 打开内层：外层面板也被 inert（仅栈顶可交互），内层保持可交互
    const innerFocus = document.createElement('button')
    overlay1.appendChild(innerFocus)
    innerFocus.focus()
    active2.value = true
    await nextTick()
    expect(overlay1.hasAttribute('inert')).toBe(true)
    expect(overlay2.hasAttribute('inert')).toBe(false)

    // 关闭内层：焦点归还到外层面板内的元素，外层面板恢复可交互，背景仍被隔离
    const innerFocusSpy = vi.spyOn(innerFocus, 'focus')
    active2.value = false
    await nextTick()
    await nextFrame()
    expect(innerFocusSpy).toHaveBeenCalled()
    expect(overlay1.hasAttribute('inert')).toBe(false)
    expect(app.hasAttribute('inert')).toBe(true)

    // 关闭外层：焦点归还到最初触发元素，全部复位
    const triggerSpy = vi.spyOn(trigger, 'focus')
    active1.value = false
    await nextTick()
    await nextFrame()
    expect(triggerSpy).toHaveBeenCalled()
    expect(app.hasAttribute('inert')).toBe(false)
    expect(document.body.style.overflow).toBe('')

    wrapper.unmount()
  })
})