import { withInstall } from '../utils/with-install'
import Form from './Form.vue'
import FormItem from './FormItem.vue'

export const NvForm = withInstall(Form)
export const NvFormItem = withInstall(FormItem)

export default NvForm

export type FormInstance = InstanceType<typeof Form>
export type FormItemInstance = InstanceType<typeof FormItem>

export type { FormProps, FormItemProps, FormRule, FormRules, FormContext } from './form'
export { formProps, formItemProps, formContextKey } from './form'