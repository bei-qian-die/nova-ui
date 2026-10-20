export type Mods = Record<string, string | number | boolean | null | undefined>

function appendModifier(name: string, modifier: string, value: string | number | boolean): string {
  return `${name}--${modifier}${value === true ? '' : `-${value}`}`
}

function genModifiers(name: string, mods: Mods | string | null | undefined): string {
  if (!mods) return ''
  if (typeof mods === 'string') return appendModifier(name, mods, true)
  return Object.entries(mods)
    .filter(([, v]) => v !== null && v !== undefined && v !== false)
    .map(([k, v]) => appendModifier(name, k, v!))
    .join(' ')
}

const prefix = 'nv'

export function createNamespace(name: string) {
  const block = `${prefix}-${name}`

  const b = () => block
  const e = (element?: string) => (element ? `${block}__${element}` : block)
  const m = (mods?: Mods | string) => (mods ? genModifiers(block, mods) : '')
  const em = (element: string, mods?: Mods | string) => {
    const el = e(element)
    return mods ? `${el} ${genModifiers(el, mods)}` : el
  }
  const is = (name: string, state?: boolean) => (state ? `is-${name}` : '')

  return { b, e, m, em, is }
}

export type Namespace = ReturnType<typeof createNamespace>