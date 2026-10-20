import { expect } from 'vitest'
import { toHaveNoViolations } from 'vitest-axe/dist/matchers.js'
import { config } from '@vue/test-utils'

expect.extend({ toHaveNoViolations })

config.global.stubs = {
  transition: false,
  'transition-group': false,
  teleport: true
}