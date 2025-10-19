import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { mapProject, type Project, type ProjectRow } from '@/data/projects'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined

const deleteCloudinaryAssets = async (tokens: (string | null | undefined)[]) => {
  if (!cloudName) {
    return
  }

  const validTokens = tokens.filter((token): token is string => Boolean(token))
  await Promise.all(
    validTokens.map(async (token) => {
      const form = new FormData()
      form.append('token', token)
      try {
        await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/delete_by_token`, {
          method: 'POST',
          body: form,
        })
      } catch {
        // 若刪除失敗（token 已使用或過期），忽略即可。
      }
    }),
  )
}

export const AdminProjectsPage = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    setLoading(true)
    const { data, error: queryError } = await supabase!
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
    } else if (data) {
      setProjects(data.map(mapProject))
      setError(null)
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchProjects()
  }, [fetchProjects])

  const handleDelete = async (slug: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setError('尚未設定 Supabase，無法刪除建案。')
      return
    }

    const target = projects.find((project) => project.slug === slug)
    const confirmed = window.confirm('確定要刪除這個建案嗎？此操作無法復原。')
    if (!confirmed) {
      return
    }

    setSaving(true)
    setError(null)

    if (target) {
      const tokens = [
        target.heroImageDeleteToken,
        ...(target.galleryDeleteTokens ?? []),
      ]
      await deleteCloudinaryAssets(tokens)
    }

    const { error: deleteError } = await supabase.from('projects').delete().eq('slug', slug)

    if (deleteError) {
      setError(deleteError.message)
      setSaving(false)
      return
    }

    setFeedback('建案已刪除。')
    setSaving(false)
    void fetchProjects()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">建案管理</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            管理建案內容、精選狀態與前台顯示資訊。
          </p>
        </div>
        <Link
          to="/admin/projects/new"
          className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:bg-primary/90"
        >
          新增建案
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          無法載入建案資料：{error}
        </div>
      ) : null}

      {feedback ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {feedback}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">
              目前還沒有建案，點擊右上角「新增建案」即可建立第一筆內容。
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.slug}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {project.status}
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">{project.name}</h2>
                  <p className="text-sm text-muted-foreground">{project.location || '尚未設定地點'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">
                    精選：{project.isFeatured ? '是' : '否'}
                  </span>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    查看前台
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/projects/${project.slug}/edit`)}
                    className="rounded-full border border-border px-3 py-1 text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    編輯
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleDelete(project.slug)}
                    className="rounded-full border border-destructive px-3 py-1 text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    刪除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isSupabaseConfigured ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          尚未設定 Supabase 環境變數，暫時無法透過後台管理建案。
        </div>
      ) : null}
    </div>
  )
}
