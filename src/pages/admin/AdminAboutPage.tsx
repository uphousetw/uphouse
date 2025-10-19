import { FormEvent, useEffect, useState } from 'react'

import type { AboutPageRow } from '@/data/about'
import { mapAboutPage } from '@/data/about'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

interface AboutFormState {
  title: string
  subtitle: string
  description: string
  statsText: string
  corePracticesText: string
  milestonesText: string
}

const defaultFormState: AboutFormState = {
  title: '',
  subtitle: '',
  description: '',
  statsText: '',
  corePracticesText: '',
  milestonesText: '',
}

export const AdminAboutPage = () => {
  const [form, setForm] = useState<AboutFormState>(defaultFormState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [aboutId, setAboutId] = useState<string | null>(null)

  // Auto-dismiss success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, error])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法載入關於我們內容。')
      setLoading(false)
      return
    }

    let active = true

    const loadAboutPage = async () => {
      setLoading(true)
      const { data, error: queryError } = await supabase!
        .from('about_page')
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
        const about = mapAboutPage(data)
        setAboutId(data.id)
        setForm({
          title: about.title,
          subtitle: about.subtitle ?? '',
          description: about.description,
          statsText: JSON.stringify(about.stats, null, 2),
          corePracticesText: JSON.stringify(about.corePractices, null, 2),
          milestonesText: JSON.stringify(about.milestones, null, 2),
        })
        setError(null)
      }

      setLoading(false)
    }

    void loadAboutPage()

    return () => {
      active = false
    }
  }, [])

  const handleFieldChange = (field: keyof AboutFormState) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法儲存關於我們內容。')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const stats = JSON.parse(form.statsText)
      const corePractices = JSON.parse(form.corePracticesText)
      const milestones = JSON.parse(form.milestonesText)

      const payload = {
        id: aboutId,
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        description: form.description.trim(),
        stats,
        core_practices: corePractices,
        milestones,
        updated_at: new Date().toISOString(),
      }

      const { error: upsertError } = await supabase
        .from('about_page')
        .upsert(payload, {
          onConflict: 'id',
        })

      if (upsertError) {
        setError(upsertError.message)
        setSaving(false)
        return
      }

      setSuccess('關於我們內容已更新。')
      setSaving(false)
    } catch (parseError) {
      setError(
        parseError instanceof Error
          ? `JSON 格式錯誤：${parseError.message}`
          : 'JSON 格式錯誤，請檢查輸入內容。',
      )
      setSaving(false)
    }
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
        <h1 className="text-2xl font-semibold text-foreground">編輯關於我們</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          更新關於我們頁面內容，儲存後前台將即時同步。
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">基本資訊</h2>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              頁面標題
              <input
                type="text"
                required
                value={form.title}
                onChange={(event) => handleFieldChange('title')(event.target.value)}
                placeholder="Uphouse 的建築哲學：穩健、誠信、貼近生活"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              副標題（選填）
              <input
                type="text"
                value={form.subtitle}
                onChange={(event) => handleFieldChange('subtitle')(event.target.value)}
                placeholder="Our Story"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              公司介紹
              <textarea
                rows={5}
                required
                value={form.description}
                onChange={(event) => handleFieldChange('description')(event.target.value)}
                placeholder="向上建設成立於 2001 年，以「讓家回歸生活本質」為信念..."
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">統計數據</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                JSON 格式：陣列，每個物件包含 label 和 value 欄位
              </p>
            </div>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              統計數據（JSON）
              <textarea
                rows={8}
                required
                value={form.statsText}
                onChange={(event) => handleFieldChange('statsText')(event.target.value)}
                placeholder={`[\n  {"label": "成立年", "value": "2001"},\n  {"label": "累計交屋戶數", "value": "2,800+"}\n]`}
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 font-mono text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">核心實踐</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                JSON 格式：陣列，每個物件包含 title 和 description 欄位
              </p>
            </div>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              核心實踐（JSON）
              <textarea
                rows={12}
                required
                value={form.corePracticesText}
                onChange={(event) => handleFieldChange('corePracticesText')(event.target.value)}
                placeholder={`[\n  {\n    "title": "城市選地策略",\n    "description": "鎖定捷運、學區..."\n  }\n]`}
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 font-mono text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">品牌里程碑</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                JSON 格式：陣列，每個物件包含 year, title 和 description 欄位
              </p>
            </div>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              里程碑（JSON）
              <textarea
                rows={16}
                required
                value={form.milestonesText}
                onChange={(event) => handleFieldChange('milestonesText')(event.target.value)}
                placeholder={`[\n  {\n    "year": "2005",\n    "title": "首座北市捷運共構宅完銷",\n    "description": "推出「擎天匯」系列..."\n  }\n]`}
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 font-mono text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
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
        </form>
      )}
    </div>
  )
}
