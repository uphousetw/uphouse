import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react'
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
  highlightsText: string
  contactPhone: string
  address: string
  launchDate: string
  isFeatured: boolean
}

interface HeroMedia {
  url: string
  deleteToken?: string | null
}

interface GalleryItem {
  url: string
  deleteToken?: string | null
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
  highlightsText: '',
  contactPhone: '',
  address: '',
  launchDate: '',
  isFeatured: false,
}

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

const sanitizeName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')

const uploadImage = async (file: File, folder?: string, publicId?: string) => {
  if (!cloudName || !uploadPreset) {
    throw new Error('尚未設定 Cloudinary 環境變數。')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  if (folder?.trim()) {
    formData.append('folder', folder.trim())
  }
  if (publicId?.trim()) {
    formData.append('public_id', publicId.trim())
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const payload = await response.json()
    throw new Error(payload.error?.message ?? '上傳失敗，請稍後再試。')
  }

  return response.json() as Promise<{
    secure_url: string
    delete_token?: string
    public_id: string
  }>
}

export const AdminProjectFormPage = () => {
  const navigate = useNavigate()
  const { slug } = useParams()
  const isEditMode = Boolean(slug)

  const [form, setForm] = useState<ProjectFormState>(defaultFormState)
  const [hero, setHero] = useState<HeroMedia>({ url: '', deleteToken: null })
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured && isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [heroImageName, setHeroImageName] = useState('')
  const [galleryImageBase, setGalleryImageBase] = useState('')

  const heroInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)

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
      const { data, error: queryError } = await supabase!
        .from('projects')
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
          highlightsText: project.highlights.join('\n'),
          contactPhone: project.contactPhone,
          address: project.address,
          launchDate: project.launchDate,
          isFeatured: project.isFeatured,
        })
        setHero({
          url: project.heroImage,
          deleteToken: project.heroImageDeleteToken ?? null,
        })

        const combinedGallery: GalleryItem[] = project.gallery.map((url, index) => ({
          url,
          deleteToken: project.galleryDeleteTokens?.[index] ?? null,
        }))
        setGalleryItems(combinedGallery)
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

  const handleFieldChange =
    (field: keyof ProjectFormState) =>
    (value: string | boolean) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

  const handleHeroInputChange = (value: string) => {
    setHero({ url: value, deleteToken: undefined })
  }

  const handleGalleryTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const lines = event.target.value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    setGalleryItems((prev) =>
      lines.map((url) => {
        const existing = prev.find((item) => item.url === url)
        return existing ?? { url }
      }),
    )
  }

  const handleHeroUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    try {
      const folder = form.slug ? `projects/${form.slug}/hero` : undefined
      const publicId = sanitizeName(heroImageName) || undefined
      const result = await uploadImage(file, folder, publicId)
      setHero({ url: result.secure_url, deleteToken: result.delete_token ?? null })
      setError(null)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '上傳失敗，請稍後再試。')
    } finally {
      if (heroInputRef.current) {
        heroInputRef.current.value = ''
      }
    }
  }

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) {
      return
    }

    try {
      const folder = form.slug ? `projects/${form.slug}/gallery` : undefined
      const base = sanitizeName(galleryImageBase)
      const queue = Array.from(files)
      for (let index = 0; index < queue.length; index += 1) {
        const file = queue[index]
        const name = base ? `${base}-${index + 1}` : undefined
        const result = await uploadImage(file, folder, name)
        setGalleryItems((prev) => [
          ...prev,
          { url: result.secure_url, deleteToken: result.delete_token ?? null },
        ])
      }
      setError(null)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : '上傳失敗，請稍後再試。')
    } finally {
      if (galleryInputRef.current) {
        galleryInputRef.current.value = ''
      }
    }
  }

  const removeGalleryItem = (index: number) => {
    setGalleryItems((prev) => prev.filter((_, idx) => idx !== index))
  }

  const galleryTextareaValue = useMemo(
    () => galleryItems.map((item) => item.url).join('\n'),
    [galleryItems],
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法儲存建案。')
      return
    }

    if (!form.slug.trim()) {
      setError('Slug 為必填欄位，請輸入英數字或連字符。')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    const galleryUrls = galleryItems
      .map((item) => item.url.trim())
      .filter(Boolean)

    const galleryDeleteTokens = galleryItems.map((item) => item.deleteToken ?? null)

    const highlights = form.highlightsText
      .split('\n')
      .map((line) => line.trim())
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
      hero_image: hero.url.trim(),
      hero_image_delete_token: hero.deleteToken ?? null,
      gallery: galleryUrls,
      gallery_delete_tokens: galleryDeleteTokens,
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
                  onChange={(event) => handleFieldChange('name')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                Slug
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(event) => handleFieldChange('slug')(event.target.value)}
                  disabled={isEditMode}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                地點
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => handleFieldChange('location')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                建案狀態
                <select
                  value={form.status}
                  onChange={(event) => handleFieldChange('status')(event.target.value)}
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
                  onChange={(event) => handleFieldChange('headline')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                建坪範圍
                <input
                  type="text"
                  value={form.areaRange}
                  onChange={(event) => handleFieldChange('areaRange')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                戶型配置
                <input
                  type="text"
                  value={form.unitType}
                  onChange={(event) => handleFieldChange('unitType')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                價位區間
                <input
                  type="text"
                  value={form.priceRange}
                  onChange={(event) => handleFieldChange('priceRange')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                預計交屋
                <input
                  type="text"
                  value={form.launchDate}
                  onChange={(event) => handleFieldChange('launchDate')(event.target.value)}
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
                onChange={(event) => handleFieldChange('description')(event.target.value)}
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-muted-foreground">
              亮點（每行一項）
              <textarea
                rows={4}
                value={form.highlightsText}
                onChange={(event) => handleFieldChange('highlightsText')(event.target.value)}
                placeholder="每行一個亮點，例如：&#10;三面採光 + 270° 市景&#10;義大利 SCIC 客製廚具"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </label>

            <div className="space-y-3 rounded-2xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Hero 圖片</p>
                  <p className="text-xs text-muted-foreground">
                    可直接貼入 URL，或上傳後自動填入。設定圖片名稱可方便於 Cloudinary 追蹤。
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary">
                  上傳圖片
                  <input
                    ref={heroInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleHeroUpload}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-xs text-muted-foreground">
                Hero 圖片名稱（選填，用於 Cloudinary public id）
                <input
                  type="text"
                  value={heroImageName}
                  onChange={(event) => setHeroImageName(event.target.value)}
                  placeholder="例：emerald-hero"
                  className="rounded-xl border border-input bg-secondary/20 px-3 py-2 text-xs text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              {hero.url ? (
                <img
                  src={hero.url}
                  alt="Hero"
                  className="h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  尚未設定圖片
                </div>
              )}
              <input
                type="url"
                value={hero.url}
                onChange={(event) => handleHeroInputChange(event.target.value)}
                placeholder="https://..."
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
            </div>

            <div className="space-y-3 rounded-2xl border border-border bg-secondary/40 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">相簿圖片</p>
                  <p className="text-xs text-muted-foreground">
                    上傳圖片後會自動加入列表，也可直接貼入 URL。設定基底名稱會依序產生 public id。
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary hover:text-primary">
                  上傳圖片
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                </label>
              </div>
              <label className="flex flex-col gap-2 text-xs text-muted-foreground">
                相簿圖片名稱前綴（選填）
                <input
                  type="text"
                  value={galleryImageBase}
                  onChange={(event) => setGalleryImageBase(event.target.value)}
                  placeholder="例：emerald-gallery"
                  className="rounded-xl border border-input bg-secondary/20 px-3 py-2 text-xs text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <textarea
                rows={6}
                value={galleryTextareaValue}
                onChange={handleGalleryTextareaChange}
                placeholder="每行輸入一個圖片 URL"
                className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
              />
              {galleryItems.length ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {galleryItems.map((item, index) => (
                    <div
                      key={`${item.url}-${index}`}
                      className="space-y-2 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground"
                    >
                      <img
                        src={item.url}
                        alt={`Gallery ${index + 1}`}
                        className="h-28 w-full rounded-lg object-cover"
                      />
                      <p className="break-all">{item.url}</p>
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(index)}
                        className="inline-flex items-center rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground transition hover:border-destructive hover:text-destructive"
                      >
                        移除此圖片
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <section className="space-y-6 rounded-3xl border border-border bg-background p-6">
            <h2 className="text-lg font-semibold text-foreground">銷售資訊</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                聯絡電話
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(event) => handleFieldChange('contactPhone')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted-foreground">
                接待會館地址
                <input
                  type="text"
                  value={form.address}
                  onChange={(event) => handleFieldChange('address')(event.target.value)}
                  className="rounded-xl border border-input bg-secondary/20 px-4 py-3 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring focus:ring-primary/20"
                />
              </label>
            </div>
            <label className="inline-flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => handleFieldChange('isFeatured')(event.target.checked)}
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
