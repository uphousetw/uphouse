import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/providers/AuthProvider'

type Role = 'editor' | 'admin'

const rolePriority: Record<Role, number> = {
  editor: 1,
  admin: 2,
}

interface RequireAuthProps {
  children: React.ReactElement
  role?: Role
}

export const RequireAuth = ({ children, role }: RequireAuthProps) => {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">載入中…</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  if (role && !profile?.role) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center md:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-foreground">權限不足</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          無法取得帳號權限資訊，請重新登入或聯繫系統管理員。
        </p>
      </div>
    )
  }

  if (
    role &&
    profile?.role &&
    rolePriority[profile.role as Role] < rolePriority[role]
  ) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center md:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-foreground">權限不足</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          您的帳號沒有存取此區域的權限，如需協助請聯繫系統管理員。
        </p>
      </div>
    )
  }

  return children
}
