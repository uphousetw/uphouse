import { useEffect, useState } from 'react'

import { applyTheme, getPreferredTheme, type Theme } from '@/lib/theme'

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const initialTheme = getPreferredTheme()
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'

  const handleToggle = () => {
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm text-muted-foreground transition-colors hover:bg-secondary"
      aria-label={`切換為${nextTheme === 'dark' ? '深色' : '淺色'}主題`}
    >
      {theme === 'light' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1.5M12 19.5V21M6.364 6.364l1.06 1.06M16.576 16.577l1.06 1.06M3 12h1.5M19.5 12H21M6.364 17.637l1.06-1.06M16.576 7.424l1.06-1.06"
          />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
          />
        </svg>
      )}
    </button>
  )
}
