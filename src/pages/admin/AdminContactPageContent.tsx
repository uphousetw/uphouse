import { FormEvent, useEffect, useState } from 'react'

import type { ContactPageContentRow } from '@/data/contactPage'
import { mapContactPageContent } from '@/data/contactPage'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

interface ContactPageFormState {
  pageTitle: string
  pageDescription: string
  addressLabel: string
  addressValue: string
  businessHours: string
  phoneLabel: string
  phoneValue: string
  emailLabel: string
  emailValue: string
}

const defaultFormState: ContactPageFormState = {
  pageTitle: '',
  pageDescription: '',
  addressLabel: '',
  addressValue: '',
  businessHours: '',
  phoneLabel: '',
  phoneValue: '',
  emailLabel: '',
  emailValue: '',
}

export const AdminContactPageContent = () => {
  const [form, setForm] = useState<ContactPageFormState>(defaultFormState)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [contentId, setContentId] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法載入聯絡頁面內容。')
      setLoading(false)
      return
    }

    let active = true

    const loadContent = async () => {
      setLoading(true)
      const { data, error: queryError } = await supabase!
        .from('contact_page_content')
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
        const content = mapContactPageContent(data)
        setContentId(data.id)
        setForm({
          pageTitle: content.pageTitle,
          pageDescription: content.pageDescription,
          addressLabel: content.addressLabel,
          addressValue: content.addressValue,
          businessHours: content.businessHours,
          phoneLabel: content.phoneLabel,
          phoneValue: content.phoneValue,
          emailLabel: content.emailLabel,
          emailValue: content.emailValue,
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

  const handleFieldChange = (field: keyof ContactPageFormState) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法儲存聯絡頁面內容。')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    const payload = {
      id: contentId,
      page_title: form.pageTitle.trim(),
      page_description: form.pageDescription.trim(),
      address_label: form.addressLabel.trim(),
      address_value: form.addressValue.trim(),
      business_hours: form.businessHours.trim(),
      phone_label: form.phoneLabel.trim(),
      phone_value: form.phoneValue.trim(),
      email_label: form.emailLabel.trim(),
      email_value: form.emailValue.trim(),
      updated_at: new Date().toISOString(),
    }

    const { error: upsertError } = await supabase
      .from('contact_page_content')
      .upsert(payload, {
        onConflict: 'id',
      })

    if (upsertError) {
      setError(upsertError.message)
      setSaving(false)
      return
    }

    setSuccess('聯絡頁面內容已更新。')
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
        <h1 className="text-2xl font-semibold text-foreground">編輯聯絡頁面內容</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          更新聯絡頁面文案與資訊，儲存後前台將即時同步。
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
          {Array.from({ length: 4 }).map((_, index) => (
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
                placeholder="聯絡我們"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              頁面描述
              <textarea
                rows={3}
                required
                value={form.pageDescription}
                onChange={(event) => handleFieldChange('pageDescription')(event.target.value)}
                placeholder="填寫表單後，我們將盡速與您聯繫"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">聯絡資訊</h2>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              地址標籤
              <input
                type="text"
                required
                value={form.addressLabel}
                onChange={(event) => handleFieldChange('addressLabel')(event.target.value)}
                placeholder="地址"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              地址內容
              <input
                type="text"
                required
                value={form.addressValue}
                onChange={(event) => handleFieldChange('addressValue')(event.target.value)}
                placeholder="台北市信義區松仁路 123 號 10 樓"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              營業時間
              <input
                type="text"
                required
                value={form.businessHours}
                onChange={(event) => handleFieldChange('businessHours')(event.target.value)}
                placeholder="營業時間：週一至週日 10:00-20:00"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              電話標籤
              <input
                type="text"
                required
                value={form.phoneLabel}
                onChange={(event) => handleFieldChange('phoneLabel')(event.target.value)}
                placeholder="服務專線"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              電話號碼
              <input
                type="tel"
                required
                value={form.phoneValue}
                onChange={(event) => handleFieldChange('phoneValue')(event.target.value)}
                placeholder="(02) 1234-5678"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Email 標籤
              <input
                type="text"
                required
                value={form.emailLabel}
                onChange={(event) => handleFieldChange('emailLabel')(event.target.value)}
                placeholder="客服信箱"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Email 地址
              <input
                type="email"
                required
                value={form.emailValue}
                onChange={(event) => handleFieldChange('emailValue')(event.target.value)}
                placeholder="contact@uphouse.tw"
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
