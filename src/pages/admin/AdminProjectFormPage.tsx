import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { mapProject, type ProjectRow, type ProjectStatus } from '@/data/projects'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

interface ProjectFormState {
  name: string
  slug: string
  headline: string
  location: string
  status: ProjectStatus
  areaRange: string
  unitType: string
  priceRange: string
  description: string
  highlights: string
  heroImage: string
  gallery: string
  contactPhone: string
  address: string
  launchDate: string
  isFeatured: boolean
}

const statusOptions: ProjectStatus[] = ['預售', '施工中', '已完工']

const defaultFormState: ProjectFormState = {
  name: '',
  slug: '',
  headline: '',
  location: '',
  status: '預售',
  areaRange: '',
  unitType: '',
  priceRange: '',
  description: '',
  highlights: '',
  heroImage: '',
  gallery: '',
  contactPhone: '',
  address: '',
  launchDate: '',
  isFeatured: false,
}

export const AdminProjectFormPage = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const isEditMode = Boolean(slug)

  const [form, setForm] = useState<ProjectFormState>(defaultFormState)
  const [loading, setLoading] = useState(isSupabaseConfigured && isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditMode || !slug) {
      return
    }

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法載入建案內容。')
      setLoading(false)
      return
    }

    let active = true

    const loadProject = async () => {
      setLoading(true)
      const { data, error: queryError } = await supabase
        .from<ProjectRow>('projects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (!active) {
        return
      }

      if (queryError) {
        setError(queryError.message)
      } else if (!data) {
        setError('找不到建案資料，請確認網址或回列表重新選擇。')
      } else {
        const project = mapProject(data)
        setForm({
          name: project.name,
          slug: project.slug,
          headline: project.headline,
          location: project.location,
          status: project.status,
          areaRange: project.areaRange,
          unitType: project.unitType,
          priceRange: project.priceRange,
          description: project.description,
          highlights: project.highlights.join('\n'),
          heroImage: project.heroImage,
          gallery: project.gallery.join('\n'),
          contactPhone: project.contactPhone,
          address: project.address,
          launchDate: project.launchDate,
          isFeatured: project.isFeatured,
        })
        setError(null)
      }

      setLoading(false)
    }

    void loadProject()

    return () => {
      active = false
    }
  }, [isEditMode, slug])

  const pageTitle = useMemo(() => (isEditMode ? '編輯建案' : '新增建案'), [isEditMode])

  const handleChange =
    (field: keyof ProjectFormState) =>
    (value: string | boolean) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法儲存建案。')
      return
    }

    if (!form.slug.trim()) {
      setError('Slug 為必填欄位，請輸入英數字與連字符。')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    const highlights = form.highlights
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    const gallery = form.gallery
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      headline: form.headline.trim(),
      location: form.location.trim(),
      status: form.status,
      area_range: form.areaRange.trim(),
      unit_type: form.unitType.trim(),
      price_range: form.priceRange.trim(),
      description: form.description.trim(),
      highlights,
      hero_image: form.heroImage.trim(),
      gallery,
      contact_phone: form.contactPhone.trim(),
      address: form.address.trim(),
      launch_date: form.launchDate.trim(),
      is_featured: form.isFeatured,
    }

    const { error: upsertError } = await supabase.from('projects').upsert(payload, {
      onConflict: 'slug',
    })

    if (upsertError) {
      setError(upsertError.message)
      setSaving(false)
      return
    }

    setSuccess(isEditMode ? '建案已更新。' : '建案已新增。')
    setSaving(false)

    setTimeout(() => {
      navigate('/admin/projects')
    }, 1200)
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
        <h1 className="text-2xl font-semibold text-foreground">{pageTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEditMode ? '更新建案資訊，儲存後前台將即時同步。' : '建立新建案，發布後即可在前台顯示。'}
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
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">基本資訊</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                建案名稱
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => handleChange('name')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                Slug
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(event) => handleChange('slug')(event.target.value)}
                  disabled={isEditMode}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                地點
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => handleChange('location')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                建案狀態
                <select
                  value={form.status}
                  onChange={(event) => handleChange('status')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground md:col-span-2">
                標題文案
                <input
                  type="text"
                  value={form.headline}
                  onChange={(event) => handleChange('headline')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                建坪範圍
                <input
                  type="text"
                  value={form.areaRange}
                  onChange={(event) => handleChange('areaRange')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                戶型配置
                <input
                  type="text"
                  value={form.unitType}
                  onChange={(event) => handleChange('unitType')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                價位區間
                <input
                  type="text"
                  value={form.priceRange}
                  onChange={(event) => handleChange('priceRange')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                預計交屋
                <input
                  type="text"
                  value={form.launchDate}
                  onChange={(event) => handleChange('launchDate')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">文案與媒體</h2>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              建案介紹
              <textarea
                rows={4}
                value={form.description}
                onChange={(event) => handleChange('description')(event.target.value)}
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              亮點（每行一項）
              <textarea
                rows={4}
                value={form.highlights}
                onChange={(event) => handleChange('highlights')(event.target.value)}
                placeholder="每行一個亮點，例如：&#10;三面採光 + 270° 市景&#10;義大利 SCIC 客製廚具"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              相簿圖片 URL（每行一個）
              <textarea
                rows={4}
                value={form.gallery}
                onChange={(event) => handleChange('gallery')(event.target.value)}
                placeholder="https://...jpg"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              Hero 圖片 URL
              <input
                type="url"
                value={form.heroImage}
                onChange={(event) => handleChange('heroImage')(event.target.value)}
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">銷售資訊</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                聯絡電話
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(event) => handleChange('contactPhone')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                接待會館地址
                <input
                  type="text"
                  value={form.address}
                  onChange={(event) => handleChange('address')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
            </div>
            <label className="inline-flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => handleChange('isFeatured')(event.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
              />
              設為精選建案（顯示於首頁精選卡片）
            </label>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
              disabled={saving}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? '儲存中…' : '儲存建案'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
