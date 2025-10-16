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
  launchDate: row.launch_date ?? fallbackText,
  isFeatured: row.is_featured ?? false,
  heroImageDeleteToken: row.hero_image_delete_token,
  galleryDeleteTokens: row.gallery_delete_tokens ?? [],
})

export const sampleProjects: Project[] = [
  {
    slug: 'emerald-lane',
    name: '琢翠大道',
    headline: '信義南軸 28 層環景制震宅',
    location: '台北市信義區吳興街 88 號',
    status: '預售',
    areaRange: '32-58 坪',
    unitType: '2-4 房',
    priceRange: '每坪 120 - 150 萬',
    description:
      '琢翠大道以永續建築為核心，採用 Low-E 玻璃與節能外殼設計，結合 28 樓景觀會所與空中花園，打造信義南軸新地標。',
    highlights: [
      '三面採光 + 270° 市景',
      '義大利 SCIC 客製廚具',
      'B1-B3 雙向平面車道',
      '全棟 AI 智慧安防系統',
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
    launchDate: '2025 Q2',
    isFeatured: true,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
  {
    slug: 'forest-harbor',
    name: '森匯港灣',
    headline: '林口 A7 中心 68% 綠覆率共感社區',
    location: '新北市林口區文化一路三段',
    status: '施工中',
    areaRange: '28-46 坪',
    unitType: '2-3 房',
    priceRange: '每坪 52 - 68 萬',
    description:
      '森匯港灣以森林系景觀中庭串聯公共設施，導入英國 BREEAM 永續認證顧問，打造低碳節能、共享共感的社區生活。',
    highlights: [
      '740 坪森活中庭',
      '24 小時 AI 門禁巡檢',
      'Sky Lounge 雙層挑高',
      '步行 6 分鐘抵達機捷 A7',
    ],
    heroImage:
      'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1467803738586-46b7eb7b16cf?auto=format&fit=crop&w=1080&q=80',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1080&q=80',
    ],
    contactPhone: '(02) 2987-1122',
    address: '新北市林口區仁愛路 88 號',
    launchDate: '2024 Q4',
    isFeatured: true,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
  {
    slug: 'harborline',
    name: '澄海界',
    headline: '淡海新市鎮濱海生活制震地標',
    location: '新北市淡水區濱海路二段',
    status: '已完工',
    areaRange: '35-72 坪',
    unitType: '3-5 房',
    priceRange: '每坪 45 - 55 萬',
    description:
      '澄海界以海景第一排視野與 360° 環景玻璃打造北海岸最具辨識度的建築量體，結合飯店式管理與高規格制震結構。',
    highlights: [
      '高鐵級制震阻尼',
      '三代同堂複合式格局',
      '一層兩戶雙電梯',
      '五星級飯店式管理',
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
    launchDate: '2023 Q3',
    isFeatured: false,
    heroImageDeleteToken: null,
    galleryDeleteTokens: [],
  },
]

export const sampleFeaturedProjects = sampleProjects.filter((project) => project.isFeatured).slice(0, 2)
