import { FormEvent, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/providers/AuthProvider'

export const AdminLoginPage = () => {
  const { session } = useAuth()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: Location })?.from ?? { pathname: '/admin' }

  if (session) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase 環境變數，無法登入。')
      return
    }

    setLoading(true)
    setError(null)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-foreground">Uphouse 後台登入</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          請輸入管理員帳號與密碼。
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="flex flex-col gap-2 text-sm text-muted-foreground">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-muted-foreground">
            密碼
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? '登入中…' : '登入'}
          </button>
        </form>

        {error ? (
          <div className="mt-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {!isSupabaseConfigured ? (
          <div className="mt-4 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
            尚未設定 `VITE_SUPABASE_URL` 與 `VITE_SUPABASE_ANON_KEY`，登入將無法成功。
          </div>
        ) : null}
      </div>
    </div>
  )
}
