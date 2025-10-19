import { FormEvent, useEffect, useState } from 'react'

import type { HomePageContentRow } from '@/data/homepage'
import { mapHomePageContent } from '@/data/homepage'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

interface HomePageFormState {
  heroBadge: string
  heroTitle: string
  heroDescription: string
  statsText: string
  featuredSectionTitle: string
  featuredSectionDescription: string
  valuePropositionsText: string
  brandPromiseTitle: string
  brandPromiseDescription: string
  consultationTitle: string
  consultationDescription: string
}

const defaultFormState: HomePageFormState = {
  heroBadge: '',
  heroTitle: '',
  heroDescription: '',
  statsText: '',
  featuredSectionTitle: '',
  featuredSectionDescription: '',
  valuePropositionsText: '',
  brandPromiseTitle: '',
  brandPromiseDescription: '',
  consultationTitle: '',
  consultationDescription: '',
}

export const AdminHomePageContent = () => {
  const [form, setForm] = useState<HomePageFormState>(defaultFormState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [contentId, setContentId] = useState<string | null>(null)

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
      setError('尚未設定 Supabase，無法載入首頁內容。')
      setLoading(false)
      return
    }

    let active = true

    const loadContent = async () => {
      setLoading(true)
      const { data, error: queryError } = await supabase!
        .from('homepage_content')
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
        const content = mapHomePageContent(data)
        setContentId(data.id)
        setForm({
          heroBadge: content.heroBadge,
          heroTitle: content.heroTitle,
          heroDescription: content.heroDescription,
          statsText: JSON.stringify(content.stats, null, 2),
          featuredSectionTitle: content.featuredSectionTitle,
          featuredSectionDescription: content.featuredSectionDescription,
          valuePropositionsText: JSON.stringify(content.valuePropositions, null, 2),
          brandPromiseTitle: content.brandPromiseTitle,
          brandPromiseDescription: content.brandPromiseDescription,
          consultationTitle: content.consultationTitle,
          consultationDescription: content.consultationDescription,
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

  const handleFieldChange = (field: keyof HomePageFormState) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法儲存首頁內容。')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const stats = JSON.parse(form.statsText)
      const valuePropositions = JSON.parse(form.valuePropositionsText)

      const payload = {
        id: contentId,
        hero_badge: form.heroBadge.trim(),
        hero_title: form.heroTitle.trim(),
        hero_description: form.heroDescription.trim(),
        stats,
        featured_section_title: form.featuredSectionTitle.trim(),
        featured_section_description: form.featuredSectionDescription.trim(),
        value_propositions: valuePropositions,
        brand_promise_title: form.brandPromiseTitle.trim(),
        brand_promise_description: form.brandPromiseDescription.trim(),
        consultation_title: form.consultationTitle.trim(),
        consultation_description: form.consultationDescription.trim(),
        updated_at: new Date().toISOString(),
      }

      const { error: upsertError } = await supabase
        .from('homepage_content')
        .upsert(payload, {
          onConflict: 'id',
        })

      if (upsertError) {
        setError(upsertError.message)
        setSaving(false)
        return
      }

      setSuccess('首頁內容已更新。')
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
        <h1 className="text-2xl font-semibold text-foreground">編輯首頁內容</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          更新首頁文案內容，儲存後前台將即時同步。
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
            <h2 className="text-lg font-semibold text-foreground">主視覺區域</h2>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              品牌標籤
              <input
                type="text"
                required
                value={form.heroBadge}
                onChange={(event) => handleFieldChange('heroBadge')(event.target.value)}
                placeholder="向上建設"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              主標題
              <input
                type="text"
                required
                value={form.heroTitle}
                onChange={(event) => handleFieldChange('heroTitle')(event.target.value)}
                placeholder="向上建設 向下扎根"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              主描述
              <textarea
                rows={3}
                required
                value={form.heroDescription}
                onChange={(event) => handleFieldChange('heroDescription')(event.target.value)}
                placeholder="打造苗栗高鐵特區質感美學"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">統計數據區</h2>
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
                placeholder={`[\n  {"label": "專注", "value": "100%"},\n  {"label": "苗栗高鐵建案", "value": "3件"}\n]`}
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 font-mono text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">精選建案區塊</h2>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              區塊標題
              <input
                type="text"
                required
                value={form.featuredSectionTitle}
                onChange={(event) => handleFieldChange('featuredSectionTitle')(event.target.value)}
                placeholder="精選建案"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              區塊描述
              <textarea
                rows={3}
                required
                value={form.featuredSectionDescription}
                onChange={(event) =>
                  handleFieldChange('featuredSectionDescription')(event.target.value)
                }
                placeholder="以苗栗為起點，創造各具風格的建築作品..."
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">品牌價值主張</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                JSON 格式：陣列，每個物件包含 title 和 description 欄位
              </p>
            </div>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              價值主張（JSON）
              <textarea
                rows={12}
                required
                value={form.valuePropositionsText}
                onChange={(event) => handleFieldChange('valuePropositionsText')(event.target.value)}
                placeholder={`[\n  {\n    "title": "特選建材",\n    "description": "我們選用讓住戶安心的品牌..."\n  }\n]`}
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 font-mono text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">品牌承諾區塊</h2>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              區塊標題
              <input
                type="text"
                required
                value={form.brandPromiseTitle}
                onChange={(event) => handleFieldChange('brandPromiseTitle')(event.target.value)}
                placeholder="品牌承諾"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              區塊描述
              <textarea
                rows={4}
                required
                value={form.brandPromiseDescription}
                onChange={(event) =>
                  handleFieldChange('brandPromiseDescription')(event.target.value)
                }
                placeholder="我們相信好宅始於透明與信任..."
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">預約諮詢區塊</h2>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              區塊標題
              <input
                type="text"
                required
                value={form.consultationTitle}
                onChange={(event) => handleFieldChange('consultationTitle')(event.target.value)}
                placeholder="預約諮詢"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              區塊描述
              <textarea
                rows={3}
                required
                value={form.consultationDescription}
                onChange={(event) =>
                  handleFieldChange('consultationDescription')(event.target.value)
                }
                placeholder="請留下聯絡資訊，我們將盡速與您聯繫..."
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
