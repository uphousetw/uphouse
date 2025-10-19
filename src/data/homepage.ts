export interface Stat {
  label: string
  value: string
}

export interface ValueProposition {
  title: string
  description: string
}

export interface HomePageContent {
  heroBadge: string
  heroTitle: string
  heroDescription: string
  stats: Stat[]
  featuredSectionTitle: string
  featuredSectionDescription: string
  valuePropositions: ValueProposition[]
  brandPromiseTitle: string
  brandPromiseDescription: string
  consultationTitle: string
  consultationDescription: string
}

export interface HomePageContentRow {
  id: string
  hero_badge: string
  hero_title: string
  hero_description: string
  stats: Stat[]
  featured_section_title: string
  featured_section_description: string
  value_propositions: ValueProposition[]
  brand_promise_title: string
  brand_promise_description: string
  consultation_title: string
  consultation_description: string
  updated_at: string
  updated_by: string | null
}

export const mapHomePageContent = (row: HomePageContentRow): HomePageContent => ({
  heroBadge: row.hero_badge,
  heroTitle: row.hero_title,
  heroDescription: row.hero_description,
  stats: row.stats,
  featuredSectionTitle: row.featured_section_title,
  featuredSectionDescription: row.featured_section_description,
  valuePropositions: row.value_propositions,
  brandPromiseTitle: row.brand_promise_title,
  brandPromiseDescription: row.brand_promise_description,
  consultationTitle: row.consultation_title,
  consultationDescription: row.consultation_description,
})

export const defaultHomePageContent: HomePageContent = {
  heroBadge: '向上建設',
  heroTitle: '向上建設 向下扎根',
  heroDescription: '打造苗栗高鐵特區質感美學',
  stats: [
    { label: '專注', value: '100%' },
    { label: '苗栗高鐵建案', value: '3件' },
    { label: '工程團隊', value: '30+ 人' },
  ],
  featuredSectionTitle: '精選建案',
  featuredSectionDescription:
    '以苗栗為起點，創造各具風格的建築作品，讓居住的每個空間都充滿著生命力和獨特性',
  valuePropositions: [
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
  ],
  brandPromiseTitle: '品牌承諾',
  brandPromiseDescription:
    '我們相信好宅始於透明與信任。從土地評估到交屋維保，我們與住戶保持緊密溝通，確保每一位成員在社區中安心生活。',
  consultationTitle: '預約諮詢',
  consultationDescription:
    '請留下聯絡資訊，我們將盡速與您聯繫，安排建案導覽或客製需求服務。',
}
