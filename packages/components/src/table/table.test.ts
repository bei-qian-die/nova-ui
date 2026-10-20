import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { NvTable } from './index'

const columns = [
  { key: 'name', title: '姓名' },
  { key: 'age', title: '年龄', sortable: true },
  { key: 'score', title: '分数', sortable: true }
]

const rows = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  age: ((i * 7) % 60) + 18,
  score: 100 - i
}))

describe('Table', () => {
  it('renders header and data rows', () => {
    const wrapper = mount(NvTable, { props: { columns, data: rows.slice(0, 3) } })
    expect(wrapper.findAll('thead th').length).toBe(3)
    expect(wrapper.findAll('tbody tr').length).toBe(3)
    expect(wrapper.text()).toContain('用户1')
    expect(wrapper.text()).toContain('姓名')
  })

  it('renders the empty slot when there is no data', () => {
    const wrapper = mount(NvTable, { props: { columns, data: [] } })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('sorts rows and emits sort-change', async () => {
    const data = [
      { id: 1, name: 'a', age: 30 },
      { id: 2, name: 'b', age: 20 },
      { id: 3, name: 'c', age: 25 }
    ]
    const wrapper = mount(NvTable, {
      props: { columns: [{ key: 'age', title: '年龄', sortable: true }], data }
    })
    const sortBtn = wrapper.find('button[aria-label="按 年龄 排序"]')

    await sortBtn.trigger('click')
    expect(wrapper.emitted('sort-change')?.[0]).toEqual([{ key: 'age', order: 'asc' }])
    expect(wrapper.find('tbody tr td').text()).toBe('20')

    await sortBtn.trigger('click')
    expect(wrapper.emitted('sort-change')?.[1]).toEqual([{ key: 'age', order: 'desc' }])
    expect(wrapper.find('tbody tr td').text()).toBe('30')

    await sortBtn.trigger('click')
    expect(wrapper.emitted('sort-change')?.[2]).toEqual([null])
  })

  it('virtualizes rows when height is set', async () => {
    const wrapper = mount(NvTable, {
      props: { columns, data: rows, height: 200, rowHeight: 50 }
    })
    const dataRows = () =>
      wrapper.findAll('tbody tr').filter((r) => !r.classes().includes('nv-table__spacer'))

    expect(dataRows().length).toBeGreaterThan(0)
    expect(dataRows().length).toBeLessThan(30)
    expect(dataRows()[0].text()).toContain('用户1')

    const vm = wrapper.vm as unknown as { scrollTo: (offset: number) => void }
    vm.scrollTo(500)
    await nextTick()

    expect(dataRows().length).toBeLessThan(30)
    expect(dataRows()[0].text()).toContain('用户7')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvTable, { props: { columns, data: rows.slice(0, 3) } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})