import { describe, expect, it } from 'vitest'
import { createNamespace } from './bem'

describe('bem', () => {
  const ns = createNamespace('button')

  it('builds block, element and is classes', () => {
    expect(ns.b()).toBe('nv-button')
    expect(ns.e('label')).toBe('nv-button__label')
    expect(ns.e()).toBe('nv-button')
    expect(ns.is('disabled', true)).toBe('is-disabled')
    expect(ns.is('disabled', false)).toBe('')
  })

  it('builds string modifiers', () => {
    expect(ns.m('large')).toBe('nv-button--large')
    expect(ns.m('')).toBe('')
    expect(ns.m(undefined)).toBe('')
  })

  it('builds object modifiers and filters falsy values', () => {
    expect(
      ns.m({ primary: true, large: false, size: 'big', ghost: null, plain: undefined })
    ).toBe('nv-button--primary nv-button--size-big')
  })

  it('builds element modifiers', () => {
    expect(ns.em('icon', { active: true })).toBe('nv-button__icon nv-button__icon--active')
    expect(ns.em('icon')).toBe('nv-button__icon')
  })
})