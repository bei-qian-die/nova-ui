import { describe, expect, it, vi } from 'vitest'
import type { App } from 'vue'
import { withInstall } from './with-install'

describe('withInstall', () => {
  it('attaches an install function that registers the component', () => {
    const Comp = { name: 'NvTest' }
    const installed = withInstall(Comp)

    expect(installed.install).toBeTypeOf('function')

    const component = vi.fn()
    const app = { component } as unknown as App
    installed.install!(app)

    expect(component).toHaveBeenCalledWith('NvTest', Comp)
  })
})