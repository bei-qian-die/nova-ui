import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvPagination } from './index'

describe('Pagination', () => {
  it('renders prev/next and page buttons', () => {
    const wrapper = mount(NvPagination, { props: { modelValue: 1, total: 100, pageSize: 10 } })
    expect(wrapper.find('[aria-label="上一页"]').exists()).toBe(true)
    expect(wrapper.find('[aria-label="下一页"]').exists()).toBe(true)
    expect(wrapper.findAll('button').length).toBeGreaterThanOrEqual(3)
  })

  it('emits update:modelValue and change on page click', async () => {
    const wrapper = mount(NvPagination, { props: { modelValue: 1, total: 100 } })
    const page2 = wrapper.findAll('button').find((b) => b.text() === '2')
    await page2!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    expect(wrapper.emitted('change')?.[0]).toEqual([2])
  })

  it('disables prev on first page and next on last page', () => {
    const first = mount(NvPagination, { props: { modelValue: 1, total: 100 } })
    expect(first.find('[aria-label="上一页"]').attributes('disabled')).toBeDefined()
    const last = mount(NvPagination, { props: { modelValue: 10, total: 100 } })
    expect(last.find('[aria-label="下一页"]').attributes('disabled')).toBeDefined()
  })

  it('renders ellipsis for large page counts', () => {
    const wrapper = mount(NvPagination, { props: { modelValue: 5, total: 200, pageSize: 10 } })
    expect(wrapper.find('.nv-pagination__more').exists()).toBe(true)
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvPagination, { props: { modelValue: 3, total: 100 } })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})