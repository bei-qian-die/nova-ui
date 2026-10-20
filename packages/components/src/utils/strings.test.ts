import { describe, expect, it } from 'vitest'
import { kebabCase } from './strings'

describe('strings', () => {
  it('converts PascalCase to kebab-case', () => {
    expect(kebabCase('NvButton')).toBe('nv-button')
  })

  it('converts multi-capital names', () => {
    expect(kebabCase('NvFormItem')).toBe('nv-form-item')
  })

  it('keeps single lowercase words intact', () => {
    expect(kebabCase('button')).toBe('button')
  })
})