import type { App, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export function withInstall<T extends { name: string }>(component: T): SFCWithInstall<T> {
  ;(component as SFCWithInstall<T>).install = (app: App) => {
    app.component(component.name, component as unknown as never)
  }
  return component as SFCWithInstall<T>
}