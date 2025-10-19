import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  mapProject,
  type Project,
  type ProjectRow,
  sampleFeaturedProjects,
} from '@/data/projects'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

const valuePropositions = [
  {
    title: '特選建材',
    description: '我們選用讓住戶安心的品牌，增加住戶幸福感',
  },
  {
    title: '獨家選地',
    description: '鎖定苗栗高鐵黃金生活圈，串聯學區、商圈與生活機能。',
  },
  {
    title: '客製服務',
    description: '一對一導覽，提供格局微調、智能家居等客製方案建議。',
  },
]

export const HomePage = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>(
    () => (isSupabaseConfigured ? [] : sampleFeaturedProjects),
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
      const { data, error: queryError } = await supabase!
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(2)

      if (!isActive) {
        return
      }

      if (queryError) {
        setError(queryError.message)
        setFeaturedProjects(sampleFeaturedProjects)
      } else if (data) {
        setFeaturedProjects(data.map(mapProject))
        setError(null)
      }

      setLoading(false)
    }

    void load()

    return () => {
      isActive = false
    }
  }, [])

  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/15 via-accent/10 to-transparent" />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-12 pt-16 md:grid-cols-2 md:px-6 lg:px-8 lg:pb-16 lg:pt-24">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              向上建設
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              向上建設 向下扎根
            </h1>
            <p className="text-base text-muted-foreground md:text-lg">
              打造苗栗高鐵特區質感美學
             
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-brand transition hover:-translate-y-0.5 hover:bg-primary/90"
              >
                探索建案
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                預約專屬導覽
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 top-6 h-full w-full rounded-3xl border border-primary/10" />
            <img
              src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1280&q=80"
              alt="向上建設代表建築"
              className="relative z-10 h-full w-full rounded-3xl object-cover shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 md:grid-cols-3 md:px-6 lg:px-8">
          {[
            { label: '專注', value: '100%' },
            { label: '苗栗高鐵建案', value: '3件' },
            { label: '工程團隊', value: '30+ 人' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-secondary/60 p-6 text-center"
            >
              <p className="text-3xl font-semibold text-primary">{item.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-foreground">精選建案</h2>
            <p className="max-w-xl text-base text-muted-foreground">
              以苗栗為起點，創造各具風格的建築作品，讓居住的每個空間都充滿著生命力和獨特性
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
          >
            全部建案
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="ml-1 h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        {error ? (
          <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            精選建案資料載入失敗，已顯示範例內容。錯誤訊息：{error}
          </div>
        ) : null}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {loading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="h-80 animate-pulse rounded-3xl border border-border bg-secondary/40"
                />
              ))
            : featuredProjects.map((project) => (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  className="group overflow-hidden rounded-3xl border border-border bg-secondary/50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={project.heroImage}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary">
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-4 px-6 py-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {project.location}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-foreground">{project.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{project.headline}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="rounded-full bg-background px-3 py-1">
                        戶型 {project.unitType}
                      </span>
                      <span className="rounded-full bg-background px-3 py-1">
                        建坪 {project.areaRange}
                      </span>
                      <span className="rounded-full bg-background px-3 py-1">
                        {project.priceRange}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-secondary/60 px-8 py-12">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold text-foreground">品牌承諾</h2>
            <p className="text-base text-muted-foreground">
              我們相信好宅始於透明與信任。從土地評估到交屋維保，我們與住戶保持緊密溝通，確保每一位成員在社區中安心生活。
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {valuePropositions.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-background p-6">
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-10 rounded-3xl border border-border bg-primary px-8 py-12 text-primary-foreground md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">預約諮詢</h2>
            <p className="text-base text-primary-foreground/90">
              請留下聯絡資訊，我們將盡速與您聯繫，安排建案導覽或客製需求服務。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-background px-6 py-3 text-sm font-semibold text-primary transition hover:bg-background/90"
            >
              填寫聯絡表單
            </Link>
            <a
              href="tel:+886212345678"
              className="inline-flex items-center justify-center rounded-full border-2 border-primary-foreground px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground hover:text-primary"
            >
              直接來電洽詢
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
