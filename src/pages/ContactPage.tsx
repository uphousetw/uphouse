import { FormEvent, useEffect, useState } from 'react'

import {
  defaultContactPageContent,
  type ContactPageContent,
  type ContactPageContentRow,
  mapContactPageContent,
} from '@/data/contactPage'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  message: '',
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export const ContactPage = () => {
  const [content, setContent] = useState<ContactPageContent>(defaultContactPageContent)
  const [form, setForm] = useState(initialFormState)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    let isActive = true

    const load = async () => {
      const { data, error: queryError } = await supabase!
        .from('contact_page_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!isActive) {
        return
      }

      if (data) {
        setContent(mapContactPageContent(data))
      }
    }

    void load()

    return () => {
      isActive = false
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (status === 'loading') {
      return
    }

    setStatus('loading')
    setError(null)

    if (isSupabaseConfigured && supabase) {
      const { error: insertError } = await supabase.from('leads').insert([
        {
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message || null,
        },
      ])

      if (insertError) {
        setError(insertError.message)
        setStatus('error')
        return
      }
    }

    setStatus('success')
    setForm(initialFormState)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 lg:px-8">
      <div className="grid gap-12 rounded-3xl border border-border bg-secondary/60 p-8 md:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{content.pageTitle}</h1>
          <p className="mt-4 text-base text-muted-foreground">
            {content.pageDescription}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                姓名
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="例：陳小築"
                  className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                聯絡電話
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="例：0912-345-678"
                  className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="example@mail.com"
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              想了解的建案或需求
              <textarea
                rows={4}
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                placeholder="我們可以協助介紹建案特色、格局規劃、付款方案等"
                className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? '送出中…' : '送出表單'}
            </button>
            {status === 'success' ? (
              <div className="rounded-2xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
                已收到您的需求，我們會儘速與您聯繫。
                {!isSupabaseConfigured ? (
                  <span className="ml-1 text-muted-foreground">
                    （目前尚未連線 Supabase，資料未寫入資料庫。）
                  </span>
                ) : null}
              </div>
            ) : null}
            {status === 'error' && error ? (
              <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                送出時發生錯誤：{error}
              </div>
            ) : null}
          </form>
        </div>
        <aside className="space-y-6 rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">
          <div>
            <h2 className="text-base font-semibold text-foreground">{content.addressLabel}</h2>
            <p className="mt-2">{content.addressValue}</p>
            <p>{content.businessHours}</p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">聯絡方式</h2>
            <p className="mt-2">{content.phoneLabel}：{content.phoneValue}</p>
            <p>{content.emailLabel}：{content.emailValue}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
