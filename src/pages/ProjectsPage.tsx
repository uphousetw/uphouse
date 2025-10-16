import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  mapProject,
  type Project,
  type ProjectRow,
  type ProjectStatus,
  sampleProjects,
} from '@/data/projects'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

const STATUS_OPTIONS: Array<{ label: string; value: ProjectStatus | 'all' }> = [
  { label: '全部', value: 'all' },
  { label: '預售', value: '預售' },
  { label: '施工中', value: '施工中' },
  { label: '已完工', value: '已完工' },
]

export const ProjectsPage = () => {
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all')
  const [projects, setProjects] = useState<Project[]>(() =>
    isSupabaseConfigured ? [] : sampleProjects,
  )
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    let isActive = true

    const load = async () => {
      setLoading(true)
      const { data, error: queryError } = await supabase
        .from<ProjectRow>('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (!isActive) {
        return
      }

      if (queryError) {
        setError(queryError.message)
        setProjects(sampleProjects)
      } else if (data) {
        setProjects(data.map(mapProject))
        setError(null)
      }

      setLoading(false)
    }

    void load()

    return () => {
      isActive = false
    }
  }, [])

  const filteredProjects = useMemo(() => {
    if (status === 'all') {
      return projects
    }
    return projects.filter((project) => project.status === status)
  }, [projects, status])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 lg:px-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">建案一覽</h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          Uphouse 以永續建築與完善社區配套為核心，提供從預售、施工中到已完工的多元住宅選擇。
          依照您的購屋需求挑選合適的建案，預約專屬顧問服務。
        </p>
      </header>

      <section className="mt-10 space-y-6">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              className={clsx(
                'rounded-full border px-4 py-2 text-sm transition-colors',
                status === option.value
                  ? 'border-primary bg-primary text-primary-foreground shadow-brand'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            建案資料載入失敗，已顯示範例內容。錯誤訊息：{error}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="h-96 animate-pulse rounded-3xl border border-border bg-secondary/40"
                />
              ))
            : filteredProjects.map((project) => (
                <article
                  key={project.slug}
                  className="flex flex-col overflow-hidden rounded-3xl border border-border bg-secondary/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    to={`/projects/${project.slug}`}
                    className="relative block aspect-[4/3] overflow-hidden"
                  >
                    <img
                      src={project.heroImage}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary">
                      {project.status}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col justify-between px-6 py-6">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {project.location}
                      </p>
                      <h2 className="text-2xl font-semibold text-foreground">{project.name}</h2>
                      <p className="text-sm text-muted-foreground">{project.headline}</p>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-4 rounded-2xl bg-background p-4 text-xs text-muted-foreground">
                      <div>
                        <dt className="font-semibold text-foreground">戶型</dt>
                        <dd className="mt-1">{project.unitType}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">建坪</dt>
                        <dd className="mt-1">{project.areaRange}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">價位帶</dt>
                        <dd className="mt-1">{project.priceRange}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-foreground">預計交屋</dt>
                        <dd className="mt-1">{project.launchDate}</dd>
                      </div>
                    </dl>
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">專線 {project.contactPhone}</p>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="text-sm font-semibold text-primary hover:text-primary/80"
                      >
                        查看建案
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
        </div>
      </section>
    </div>
  )
}
