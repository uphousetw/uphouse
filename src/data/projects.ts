export type ProjectStatus = "預售" | "施工中" | "已完工"

export interface Project {
  id?: string
  slug: string
  name: string
  headline: string
  location: string
  status: ProjectStatus
  areaRange: string
  unitType: string
  priceRange: string
  description: string
  highlights: string[]
  heroImage: string
  gallery: string[]
  contactPhone: string
  address: string
  latitude: number
  longitude: number
  launchDate: string
  isFeatured: boolean
  heroImageDeleteToken?: string | null
  galleryDeleteTokens?: string[]
}

export interface ProjectRow {
  id: string
  slug: string
  name: string
  headline: string | null
  location: string | null
  status: ProjectStatus
  area_range: string | null
  unit_type: string | null
  price_range: string | null
  description: string | null
  highlights: string[] | null
  hero_image: string | null
  gallery: string[] | null
  contact_phone: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  launch_date: string | null
  is_featured: boolean | null
  hero_image_delete_token: string | null
  gallery_delete_tokens: string[] | null
  created_at: string
}

const fallbackText = '資訊待更新'

export const mapProject = (row: ProjectRow): Project => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  headline: row.headline ?? fallbackText,
  location: row.location ?? fallbackText,
  status: row.status,
  areaRange: row.area_range ?? fallbackText,
  unitType: row.unit_type ?? fallbackText,
  priceRange: row.price_range ?? fallbackText,
  description: row.description ?? fallbackText,
  highlights: row.highlights ?? [],
  heroImage: row.hero_image ?? '',
  gallery: row.gallery ?? [],
  contactPhone: row.contact_phone ?? fallbackText,
  address: row.address ?? fallbackText,
  latitude: row.latitude ?? 25.0330,
  longitude: row.longitude ?? 121.5654,
  launchDate: row.launch_date ?? fallbackText,
  isFeatured: row.is_featured ?? false,
  heroImageDeleteToken: row.hero_image_delete_token,
  galleryDeleteTokens: row.gallery_delete_tokens ?? [],
})

export const sampleProjects: Project[] = [
  {
    slug: 'emerald-lane',
    name: '翠華大道',
    headline: '信義計畫區 28 坪起複合型豪宅',
    location: '台北市信義區松仁路 88 號',
    status: '預售',
    areaRange: '32-58 坪',
    unitType: '2-4 房',
    priceRange: '每坪 120 - 150 萬',
    description:
      '翠華大道以都會綠洲為核心，採用 Low-E 玻璃與智能採光設計，融合 28 項綠建材標章與永續工法，重塑信義計畫區新地標。',
    highlights: [
      '雙捷運採光 + 270度 視野',
      '義大利 SCIC 廚具標配',
      'B1-B3 恆溫紅酒儲藏室',
      '整合 AI 智慧安防系統',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1529429617124-aee747d3a7e2?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1080&q=80',
    ],
    contactPhone: '(02) 2345-8765',
    address: '台北市信義區信義路五段 150 號',
    latitude: 25.0330,
    longitude: 121.5654,
    launchDate: '2025 Q2',
    isFeatured: true,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
  {
    slug: 'forest-harbor',
    name: '林港匯聚',
    headline: '林口 A7 重劃區 68% 綠覆率生態社區',
    location: '新北市林口區文化一路八段',
    status: '施工中',
    areaRange: '28-46 坪',
    unitType: '2-3 房',
    priceRange: '每坪 52 - 68 萬',
    description:
      '林港匯聚以林口水岸綠帶為設計核心，導入英國 BREEAM 綠建築標準，打造低碳節能、共生共榮的都市生活圈。',
    highlights: [
      '740 坪森林會館',
      '24 小時 AI 保全巡邏',
      'Sky Lounge 空中俱樂部',
      '步行 6 分鐘直達機捷 A7',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1467803738586-46b7eb7b16cf?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1080&q=80',
    ],
    contactPhone: '(02) 2987-1122',
    address: '新北市林口區文明路 88 號',
    latitude: 25.0777,
    longitude: 121.3581,
    launchDate: '2024 Q4',
    isFeatured: true,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
  {
    slug: 'harborline',
    name: '港線灣',
    headline: '淡水捷運紅樹林站首排河岸宅',
    location: '新北市淡水區紅樹林二段',
    status: '已完工',
    areaRange: '35-72 坪',
    unitType: '3-5 房',
    priceRange: '每坪 45 - 55 萬',
    description:
      '港線灣以河岸第一排視野與 360度 觀音山景，打造北台灣最具指標性綠建築社區，結合物業管理與雲端履約服務。',
    highlights: [
      '無敵河岸景觀',
      '雙車位複合式停車場',
      '一坪綠地規劃',
      '智慧雲端物業管理',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1496302662116-35cc4f36df92?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1494527492857-66e29fb2926e?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=1080&q=80',
    ],
    contactPhone: '(02) 2626-5566',
    address: '新北市淡水區中正東路一段 26 號',
    latitude: 25.1537,
    longitude: 121.4595,
    launchDate: '2023 Q3',
    isFeatured: false,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
]

export const sampleFeaturedProjects = sampleProjects.filter((project) => project.isFeatured).slice(0, 2)
