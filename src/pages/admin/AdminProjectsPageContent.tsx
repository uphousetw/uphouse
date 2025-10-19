import { FormEvent, useEffect, useState } from 'react'

import type { ProjectsPageContentRow } from '@/data/projectsPage'
import { mapProjectsPageContent } from '@/data/projectsPage'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

interface ProjectsPageFormState {
  pageTitle: string
  pageDescription: string
}

const defaultFormState: ProjectsPageFormState = {
  pageTitle: '',
  pageDescription: '',
}

export const AdminProjectsPageContent = () => {
  const [form, setForm] = useState<ProjectsPageFormState>(defaultFormState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [contentId, setContentId] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法載入建案頁面內容。')
      setLoading(false)
      return
    }

    let active = true

    const loadContent = async () => {
      setLoading(true)
      const { data, error: queryError} = await supabase!
        .from('projects_page_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!active) {
        return
      }

      if (queryError) {
        setError(queryError.message)
      } else if (data) {
        const content = mapProjectsPageContent(data)
        setContentId(data.id)
        setForm({
          pageTitle: content.pageTitle,
          pageDescription: content.pageDescription,
        })
        setError(null)
      }

      setLoading(false)
    }

    void loadContent()

    return () => {
      active = false
    }
  }, [])

  const handleFieldChange = (field: keyof ProjectsPageFormState) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法儲存建案頁面內容。')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    const payload = {
      id: contentId,
      page_title: form.pageTitle.trim(),
      page_description: form.pageDescription.trim(),
      updated_at: new Date().toISOString(),
    }

    const { error: upsertError } = await supabase
      .from('projects_page_content')
      .upsert(payload, {
        onConflict: 'id',
      })

    if (upsertError) {
      setError(upsertError.message)
      setSaving(false)
      return
    }

    setSuccess('建案頁面內容已更新。')
    setSaving(false)
  }

  if (!isSupabaseConfigured || !supabase) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 rounded-3xl border border-border bg-background p-8">
        <h1 className="text-2xl font-semibold text-foreground">尚未連線 Supabase</h1>
        <p className="text-sm text-muted-foreground">
          請於 `.env.local` 設定 `VITE_SUPABASE_URL` 與 `VITE_SUPABASE_ANON_KEY` 後重新整理頁面。
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">編輯建案頁面內容</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          更新建案一覽頁面文案，儲存後前台將即時同步。
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {success}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">頁面標題與描述</h2>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              頁面標題
              <input
                type="text"
                required
                value={form.pageTitle}
                onChange={(event) => handleFieldChange('pageTitle')(event.target.value)}
                placeholder="建案一覽"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              頁面描述
              <textarea
                rows={4}
                required
                value={form.pageDescription}
                onChange={(event) => handleFieldChange('pageDescription')(event.target.value)}
                placeholder="我們提供從預售、施工中到已完工的多元住宅選擇。請依照您的購屋需求挑選合適的建案，並來電預約。"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? '儲存中…' : '儲存變更'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
