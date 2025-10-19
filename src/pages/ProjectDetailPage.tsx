import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { MapEmbed } from '@/components/MapEmbed'
import {
  mapProject,
  type Project,
  type ProjectRow,
  sampleProjects,
} from '@/data/projects'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

export const ProjectDetailPage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()

  const sampleProject = slug ? sampleProjects.find((item) => item.slug === slug) : undefined

  const [project, setProject] = useState<Project | null>(sampleProject ?? null)
  const [otherProjects, setOtherProjects] = useState<Project[]>(
    sampleProject
      ? sampleProjects.filter((item) => item.slug !== sampleProject.slug).slice(0, 2)
      : [],
  )
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug || !isSupabaseConfigured || !supabase) {
      return
    }

    let isActive = true

    const load = async () => {
      setLoading(true)

      const [{ data: projectRow, error: projectError }, { data: othersRows }] = await Promise.all([
        supabase!.from('projects').select('*').eq('slug', slug).maybeSingle(),
        supabase!
          .from('projects')
          .select('*')
          .neq('slug', slug)
          .order('created_at', { ascending: false })
          .limit(2),
      ])

      if (!isActive) {
        return
      }

      if (projectError) {
        setError(projectError.message)
      }

      if (projectRow) {
        setProject(mapProject(projectRow))
        setError(null)
      } else if (!projectError && !projectRow) {
        setProject(null)
      }

      if (othersRows) {
        setOtherProjects(othersRows.map(mapProject))
      }

      setLoading(false)
    }

    void load()

    return () => {
      isActive = false
    }
  }, [slug])

  if (!slug) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-foreground">缺少建案資訊</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          無法取得建案識別碼，請返回建案一覽頁面重新選擇。
        </p>
        <Link
          to="/projects"
          className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          建案一覽
        </Link>
      </div>
    )
  }

  if (!project && !loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-foreground">找不到建案</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          您要查看的建案不存在或已下架，請返回建案一覽瀏覽其他精選建案。
        </p>
        <div className="mt-6 inline-flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-primary hover:text-primary"
          >
            返回上一頁
          </button>
          <Link
            to="/projects"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            建案一覽
          </Link>
        </div>
      </div>
    )
  }

  if (!project && loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 md:px-6 lg:px-8">
        <div className="h-64 animate-pulse rounded-3xl bg-secondary/40" />
      </div>
    )
  }

  if (!project) {
    return null
  }

  return (
    <div className="pb-24">
      {error ? (
        <div className="mx-auto max-w-6xl px-4 pt-8 md:px-6 lg:px-8">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            建案資料載入時發生錯誤，已顯示暫存內容。錯誤訊息：{error}
          </div>
        </div>
      ) : null}

      <section className="relative mt-6 md:mt-0">
        <div className="absolute inset-0">
          <img
            src={project.heroImage}
            alt={project.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-24 pt-48 md:flex-row md:items-end md:px-6 lg:px-8">
          <div className="flex-1 space-y-4">
            <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {project.status}
            </span>
            <h1 className="text-4xl font-semibold text-foreground md:text-5xl">{project.name}</h1>
            <p className="text-lg text-muted-foreground">{project.headline}</p>
          </div>
          <div className="grid gap-3 rounded-3xl bg-background/90 p-6 text-sm text-muted-foreground md:w-80">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">基地位置</p>
              <p className="mt-1 font-semibold text-foreground">{project.location}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">戶型</p>
                <p className="mt-1 text-foreground">{project.unitType}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">建坪</p>
                <p className="mt-1 text-foreground">{project.areaRange}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">價位帶</p>
                <p className="mt-1 text-foreground">{project.priceRange}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em]">交屋</p>
                <p className="mt-1 text-foreground">{project.launchDate}</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              預約賞屋
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-16 grid max-w-6xl gap-12 px-4 md:grid-cols-[2fr_1fr] md:px-6 lg:px-8">
        <article className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">建案介紹</h2>
            <p className="text-base text-muted-foreground">{project.description}</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">亮點規劃</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-secondary/60 p-4 text-sm text-muted-foreground"
                >
                  <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-primary" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">建築影像</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {project.gallery.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt={`${project.name} 建築影像`}
                  className="h-48 w-full rounded-3xl object-cover"
                  loading="lazy"
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">基地位置</h2>
            <MapEmbed
              latitude={project.latitude}
              longitude={project.longitude}
              address={project.address}
              className="h-96 w-full"
            />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">地址：</span>
              {project.address}
            </p>
          </section>
        </article>

        <aside className="space-y-6 rounded-3xl border border-border bg-secondary/60 p-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground">銷售中心資訊</h2>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">電話：</span>
                {project.contactPhone}
              </p>
              <p>
                <span className="font-semibold text-foreground">接待會館：</span>
                {project.address}
              </p>
              <p>
                <span className="font-semibold text-foreground">參觀時段：</span>
                週一至週日 10:00-20:00
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              預約專屬導覽
            </Link>
          </section>

          {otherProjects.length ? (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                推薦建案
              </h3>
              <div className="mt-4 space-y-4">
                {otherProjects.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/projects/${item.slug}`}
                    className="block rounded-2xl border border-border bg-background p-4 transition hover:border-primary/50"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {item.location}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{item.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.unitType}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
