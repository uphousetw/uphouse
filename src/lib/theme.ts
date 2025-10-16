export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'uphouse-theme'

export const getStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return null
}

export const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const stored = getStoredTheme()
  if (stored) {
    return stored
  }

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const applyTheme = (theme: Theme) => {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }

  window.localStorage.setItem(STORAGE_KEY, theme)
}
