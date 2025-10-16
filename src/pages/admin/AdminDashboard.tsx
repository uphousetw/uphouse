import { useEffect, useState } from 'react'

import { mapProject, type Project, type ProjectRow } from '@/data/projects'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  created_at: string
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    leads: 0,
    featured: 0,
  })
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return
    }

    let active = true

    const load = async () => {
      setLoading(true)
      const [{ data: projectRows }, { data: leadRows }] = await Promise.all([
        supabase.from<ProjectRow>('projects').select('*'),
        supabase.from<Lead>('leads').select('id'),
      ])

      if (!active) {
        return
      }

      if (projectRows) {
        const projects = projectRows.map(mapProject)
        setStats({
          projects: projects.length,
          leads: leadRows?.length ?? 0,
          featured: projects.filter((project) => project.isFeatured).length,
        })
      }

      setLoading(false)
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">管理儀表板</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          快速掌握建案與潛在客戶狀態。
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground">建案總數</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{stats.projects}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground">精選建案</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{stats.featured}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6">
            <p className="text-sm text-muted-foreground">潛在客戶</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{stats.leads}</p>
          </div>
        </div>
      )}

      {!isSupabaseConfigured ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          尚未設定 Supabase 環境變數，數據僅作展示。
        </div>
      ) : null}
    </div>
  )
}
