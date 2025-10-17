import { useEffect, useState } from 'react'

import type { AboutPage, AboutPageRow } from '@/data/about'
import { mapAboutPage } from '@/data/about'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

// Default fallback content
const defaultAboutContent: AboutPage = {
  title: 'Uphouse 的建築哲學：穩健、誠信、貼近生活',
  subtitle: 'Our Story',
  description:
    'Uphouse 建設成立於 2001 年，以「讓家回歸生活本質」為信念。20 餘年來我們專注於住宅開發，從土地評估、規劃設計到售後服務皆由專業團隊親自把關，累計交屋超過 2,800 戶，打造出一座座值得世代傳承的住宅地標。',
  stats: [
    { label: '成立年', value: '2001' },
    { label: '累計交屋戶數', value: '2,800+' },
    { label: '永續建築認證', value: '12 件' },
  ],
  corePractices: [
    {
      title: '城市選地策略',
      description: '鎖定捷運、學區、醫療資源密集的交通門戶區域，結合生活機能與增值潛力。',
    },
    {
      title: '永續建築工法',
      description: '導入循環建材、智慧節能監控與低碳施工流程，追求建築與環境的長期共榮。',
    },
    {
      title: '住戶全程陪伴',
      description: '提供專屬顧問、雲端履約平台、交屋巡檢與保固維修，為住戶建立信任感。',
    },
  ],
  milestones: [
    {
      year: '2005',
      title: '首座北市捷運共構宅完銷',
      description: '推出「擎天匯」系列首案，締造 45 天完銷紀錄。',
    },
    {
      year: '2012',
      title: '導入永續建築標準',
      description: '跨足淡水新市鎮，取得首座 EEWH 銅級綠建築標章。',
    },
    {
      year: '2019',
      title: '數位交屋服務啟動',
      description: '建立雲端履約系統，提供線上選配、保固追蹤與即時客服。',
    },
    {
      year: '2024',
      title: '品牌升級為 Uphouse',
      description: '推出永續品牌策略，強化「建築即生活」品牌定位。',
    },
  ],
}

export const AboutPage = () => {
  const [content, setContent] = useState<AboutPage>(defaultAboutContent)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    let active = true

    const loadAboutPage = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from<AboutPageRow>('about_page')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!active) {
        return
      }

      if (!error && data) {
        setContent(mapAboutPage(data))
      }

      setLoading(false)
    }

    void loadAboutPage()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 md:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="h-8 w-32 animate-pulse rounded-full bg-secondary/60" />
          <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-secondary/60" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-secondary/60" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16 md:px-6 lg:px-8">
      <section className="space-y-6">
        {content.subtitle ? (
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
            {content.subtitle}
          </span>
        ) : null}
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">{content.title}</h1>
        <p className="text-base text-muted-foreground md:text-lg">{content.description}</p>
      </section>

      {content.stats && content.stats.length > 0 ? (
        <section className="grid gap-6 rounded-3xl border border-border bg-secondary/60 p-8 md:grid-cols-3">
          {content.stats.map((item) => (
            <div key={item.label} className="space-y-2 rounded-2xl bg-background p-6 text-center">
              <p className="text-3xl font-semibold text-primary">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </section>
      ) : null}

      {content.corePractices && content.corePractices.length > 0 ? (
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground">三大核心實踐</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {content.corePractices.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-border bg-secondary/50 p-6"
              >
                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {content.milestones && content.milestones.length > 0 ? (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">品牌里程碑</h2>
          <div className="space-y-4 border-l border-border pl-6">
            {content.milestones.map((item) => (
              <div key={item.year} className="relative pl-6">
                <span className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full border border-primary bg-primary" />
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {item.year}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
