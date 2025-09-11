export interface Project {
  id: number
  title: string
  description: string
  fullDescription?: string
  image?: string
  completionDate: string
  category: string
  location?: string
  area?: string
  features?: string[]
  gallery?: string[]
  createdAt: string
  updatedAt: string
}

// Shared mock database - In production, replace with real database
export const projects: Project[] = [
  {
    id: 1,
    title: "現代簡約別墅",
    description: "位於台北市的現代簡約風格別墅，採用大面積玻璃窗設計，讓自然光線充分進入室內空間。",
    fullDescription: "這是一個位於台北市精華地段的現代簡約風格別墅項目。設計以大面積玻璃窗為特色，讓自然光線充分進入室內空間，創造出開闊明亮的居住環境。",
    image: "/api/placeholder/800/600",
    completionDate: "2024年6月",
    category: "住宅",
    location: "台北市大安區",
    area: "280坪",
    features: ["大面積玻璃窗", "開放式格局", "進口石材", "實木地板", "智慧家居系統"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "都會雅居",
    description: "坐落於新北市的都會住宅設計，強調空間的多功能性與收納效率。",
    fullDescription: "都會雅居項目位於新北市核心區域，是專為現代都會人士打造的精緻住宅。設計特別強調空間的多功能性與收納效率。",
    image: "/api/placeholder/800/600",
    completionDate: "2024年9月",
    category: "住宅",
    location: "新北市板橋區",
    area: "120坪",
    features: ["多功能空間設計", "高效收納系統", "現代簡約風格", "優質建材", "節能環保設計"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]