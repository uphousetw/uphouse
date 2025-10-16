import { useEffect } from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { applyTheme, getPreferredTheme } from '@/lib/theme'

export const MainLayout = () => {
  useEffect(() => {
    applyTheme(getPreferredTheme())
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  )
}
