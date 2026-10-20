import { mount } from '@vue/test-utils'
import { h, reactive } from 'vue'
import { axe } from 'vitest-axe'
import { describe, expect, it } from 'vitest'
import { NvForm, NvFormItem } from './index'

describe('Form', () => {
  it('validates required fields and clears errors', async () => {
    const model = reactive<Record<string, unknown>>({ name: '' })
    const wrapper = mount(NvForm, {
      props: {
        model,
        rules: { name: [{ required: true, message: '请输入姓名' }] }
      },
      global: { components: { NvFormItem } },
      slots: { default: `<NvFormItem label="姓名" prop="name"><input /></NvFormItem>` }
    })

    const vm = wrapper.vm as unknown as {
      validate: () => Promise<boolean>
      resetFields: () => void
      clearValidate: () => void
    }

    expect(await vm.validate()).toBe(false)
    expect(wrapper.html()).toContain('请输入姓名')

    model.name = '张三'
    expect(await vm.validate()).toBe(true)
    expect(wrapper.html()).not.toContain('请输入姓名')
  })

  it('supports pattern rules', async () => {
    const model = reactive<Record<string, unknown>>({ code: 'abc' })
    const wrapper = mount(NvForm, {
      props: {
        model,
        rules: { code: [{ pattern: /^[0-9]+$/, message: '只能为数字' }] }
      },
      global: { components: { NvFormItem } },
      slots: { default: `<NvFormItem label="编码" prop="code"><input /></NvFormItem>` }
    })

    const vm = wrapper.vm as unknown as { validate: () => Promise<boolean> }
    expect(await vm.validate()).toBe(false)
    expect(wrapper.html()).toContain('只能为数字')
  })

  it('has no a11y violations', async () => {
    const wrapper = mount(NvForm, { slots: { default: '内容' } })
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})

describe('FormItem', () => {
  it('labels its control through the scoped slot id', async () => {
    const wrapper = mount(NvFormItem, {
      props: { label: '姓名', required: true },
      slots: {
        default: ({ id }: { id: string }) => h('input', { id })
      }
    })
    expect(wrapper.find('label').attributes('for')).toBeTruthy()
    // region 为页面级规则：组件单测以组件作为整页内容、无地标包裹，故关闭该项
    expect(await axe(wrapper.element, { rules: { region: { enabled: false } } })).toHaveNoViolations()
  })
})