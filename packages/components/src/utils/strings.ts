export function kebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, (_, c: string, i: number) => (i ? '-' : '') + c.toLowerCase())
    .replace(/^-/, '')
}