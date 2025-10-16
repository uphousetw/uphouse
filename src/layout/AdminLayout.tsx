import { Link, Outlet } from 'react-router-dom'

import { useAuth } from '@/providers/AuthProvider'

const adminNav = [
  { label: '儀表板', to: '/admin' },
  { label: '建案管理', to: '/admin/projects' },
  { label: '帳號設定', to: '/admin/settings', role: 'admin' },
  { label: '潛在客戶', to: '/admin/leads', role: 'admin' },
]

export const AdminLayout = () => {
  const { profile, user, signOut } = useAuth()
  const currentRole = profile?.role === 'admin' ? 'admin' : 'editor'

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="hidden w-64 flex-col border-r border-border bg-background/80 p-6 md:flex">
        <Link to="/" className="text-lg font-semibold text-foreground">
          Uphouse Admin
        </Link>
        <nav className="mt-8 space-y-2 text-sm text-muted-foreground">
          {adminNav
            .filter((item) => !item.role || item.role === currentRole)
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block rounded-lg px-3 py-2 transition hover:bg-secondary hover:text-secondary-foreground"
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <div className="mt-auto rounded-xl border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">{profile?.full_name ?? user?.email}</p>
          <p className="mt-1 uppercase tracking-[0.2em]">{profile?.role ?? '未設定'}</p>
          <button
            type="button"
            onClick={() => signOut()}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            登出
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 px-4 py-4 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="text-base font-semibold text-foreground">
              Uphouse Admin
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground"
            >
              登出
            </button>
          </div>
        </header>
        <main className="flex-1 px-4 py-10 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
