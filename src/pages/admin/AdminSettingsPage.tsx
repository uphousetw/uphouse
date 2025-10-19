import { FormEvent, useState } from 'react'

import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/providers/AuthProvider'

export const AdminSettingsPage = () => {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email ?? '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法發送重設信。')
      return
    }

    if (!email.trim()) {
      setError('請輸入 Email。')
      return
    }

    setLoading(true)
    setError(null)
    setMessage(null)

    const redirectURL =
      import.meta.env.VITE_SUPABASE_RESET_REDIRECT ??
      `${window.location.origin}/admin/login`

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectURL,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setMessage('已發送重設密碼連結，請至信箱查收。')
    }

    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-border bg-background p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">帳號設定</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          發送 Supabase 密碼重設信件，使用者可透過郵件連結設定新密碼。
        </p>
      </div>

      {message ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleReset} className="space-y-4">
        <label className="flex flex-col gap-2 text-sm text-muted-foreground">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
          />
        </label>
        <p className="text-xs text-muted-foreground">
          重設連結會指向 `VITE_SUPABASE_RESET_REDIRECT`（若未設定則使用當前網域的 `/admin/login`）。請先在
          Supabase Auth 設定允許的 Redirect URLs。
        </p>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? '發送中…' : '發送重設密碼信'}
        </button>
      </form>
    </div>
  )
}
