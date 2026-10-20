import type { ComponentResolver } from 'unplugin-vue-components'

/**
 * Nova UI 组件名 -> 构建产物入口目录 的映射。
 * 子组件（FormItem/TabPane）映射到其父组件目录（`form`/`tabs`），
 * 因为父组件的 index.ts 同时导出了子组件。
 */
const components: Record<string, string> = {
  button: 'button',
  icon: 'icon',
  tag: 'tag',
  badge: 'badge',
  avatar: 'avatar',
  divider: 'divider',
  link: 'link',
  space: 'space',
  input: 'input',
  textarea: 'textarea',
  checkbox: 'checkbox',
  radio: 'radio',
  switch: 'switch',
  select: 'select',
  form: 'form',
  'form-item': 'form',
  slider: 'slider',
  rate: 'rate',
  tabs: 'tabs',
  'tab-pane': 'tabs',
  pagination: 'pagination',
  empty: 'empty',
  tooltip: 'tooltip',
  modal: 'modal',
  drawer: 'drawer',
  message: 'message',
  loading: 'loading',
  alert: 'alert'
}

export interface NovaUiResolverOptions {
  /** 组件名前缀，默认 `Nv` */
  prefix?: string
  /** 包名，默认 `@nova-ui/components` */
  package?: string
}

function kebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * unplugin-vue-components resolver：
 * 把 `<nv-button />` 之类的模板标签自动解析为
 * `import { NvButton } from '@nova-ui/components/button'`，
 * 并附带 `sideEffects` 使每个组件的样式按需加载。
 */
export function NovaUiResolver(options: NovaUiResolverOptions = {}): ComponentResolver {
  const prefix = options.prefix ?? 'Nv'
  const pkg = options.package ?? '@nova-ui/components'

  return {
    type: 'component',
    resolve(name: string) {
      if (!name.startsWith(prefix)) return
      const dir = components[kebabCase(name.slice(prefix.length))]
      if (!dir) return
      return {
        name,
        from: `${pkg}/${dir}`,
        sideEffects: `${pkg}/${dir}/style.css`
      }
    }
  }
}

export default NovaUiResolver