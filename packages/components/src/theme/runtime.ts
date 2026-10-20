export type ThemeTokens = Record<string, string>

export function setTheme(tokens: ThemeTokens, el: HTMLElement = document.documentElement): void {
  for (const [key, value] of Object.entries(tokens)) {
    const varName = key.startsWith('--') ? key : `--nv-${key}`
    el.style.setProperty(varName, value)
  }
}

export type ThemeMode = 'light' | 'dark'

export function setThemeMode(mode: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', mode)
}

export function getThemeMode(): ThemeMode {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

export function toggleThemeMode(): ThemeMode {
  const next = getThemeMode() === 'dark' ? 'light' : 'dark'
  setThemeMode(next)
  return next
}