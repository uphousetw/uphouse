import clsx from 'clsx'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { label: '首頁', to: '/' },
  { label: '關於我們', to: '/about' },
  { label: '建案一覽', to: '/projects' },
  { label: '聯絡我們', to: '/contact' },
]

export const SiteHeader = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              UH
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Uphouse 建設
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-brand transition-transform hover:-translate-y-0.5 hover:bg-primary/90 md:inline-flex"
          >
            預約賞屋
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-border p-2 text-sm text-muted-foreground md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label="主選單"
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 text-base font-medium">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2 hover:bg-secondary hover:text-secondary-foreground',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-primary px-3 py-2 text-center text-primary-foreground"
            >
              預約賞屋
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
