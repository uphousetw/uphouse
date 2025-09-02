import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Project {
  id: number
  title: string
  description: string
  fullDescription: string
  image: string
  completionDate: string
  category: string
  location: string
  area: string
  features: string[]
  gallery: string[]
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "現代簡約別墅",
    description: "位於台北市的現代簡約風格別墅",
    fullDescription: "這是一個位於台北市精華地段的現代簡約風格別墅項目。設計以大面積玻璃窗為特色，讓自然光線充分進入室內空間，創造出開闊明亮的居住環境。開放式格局的規劃，結合精緻的建材選擇，包括進口石材、實木地板以及高品質的金屬配件，營造出優雅而舒適的現代居住空間。整體設計強調簡潔的線條與功能性的平衡，為居住者提供了一個既美觀又實用的生活環境。",
    image: "/api/placeholder/800/600",
    completionDate: "2024年6月",
    category: "住宅",
    location: "台北市大安區",
    area: "280坪",
    features: ["大面積玻璃窗", "開放式格局", "進口石材", "實木地板", "智慧家居系統"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"]
  },
  {
    id: 2,
    title: "都會雅居",
    description: "坐落於新北市的都會住宅設計",
    fullDescription: "都會雅居項目位於新北市核心區域，是專為現代都會人士打造的精緻住宅。設計特別強調空間的多功能性與收納效率，透過巧妙的格局規劃和創新的儲物解決方案，在有限的空間內創造出寬敞明亮的居住感受。運用了現代設計語彙，結合溫潤的材質選擇，營造出既時尚又溫馨的居住氛圍。每個空間都經過精心計算，確保最佳的動線流暢性和使用便利性。",
    image: "/api/placeholder/800/600",
    completionDate: "2024年9月",
    category: "住宅",
    location: "新北市板橋區",
    area: "120坪",
    features: ["多功能空間設計", "高效收納系統", "現代簡約風格", "優質建材", "節能環保設計"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"]
  },
  {
    id: 3,
    title: "自然風格住宅",
    description: "融合自然元素的住宅設計",
    fullDescription: "自然風格住宅項目致力於創造一個與自然和諧共生的居住空間。設計大量運用天然木質材料與天然石材，搭配精心規劃的綠意植栽，營造出清新自然的居住氛圍。室內空間設計注重與戶外環境的連結，透過大型窗戶和露台設計，將自然景觀引入室內。整體色調以大地色系為主，配合自然材質的質感，創造出寧靜舒適的生活環境，為居住者提供遠離城市喧囂的寧靜港灣。",
    image: "/api/placeholder/800/600",
    completionDate: "2024年12月",
    category: "住宅",
    location: "桃園市龍潭區",
    area: "350坪",
    features: ["天然木質材料", "石材運用", "綠意植栽設計", "大型景觀窗", "戶外露台"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"]
  },
  {
    id: 4,
    title: "城市景觀住宅",
    description: "充分利用城市景觀優勢的高樓住宅設計",
    fullDescription: "城市景觀住宅是一個充分利用都市景觀優勢的高層住宅項目。設計透過大片落地窗將壯麗的城市美景引入室內，同時巧妙地處理隱私保護與生活品質的平衡。室內設計採用現代極簡風格，以簡潔的線條和中性色調為主，讓城市景觀成為空間中最重要的裝飾元素。高品質的隔音材料和智能窗簾系統確保了居住的舒適性和私密性。",
    image: "/api/placeholder/800/600",
    completionDate: "2025年3月",
    category: "住宅",
    location: "台中市西屯區",
    area: "150坪",
    features: ["全景落地窗", "城市景觀視野", "隱私保護設計", "智能窗簾系統", "隔音材料"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"]
  },
  {
    id: 5,
    title: "極簡主義住宅",
    description: "貫徹極簡主義理念的住宅設計",
    fullDescription: "極簡主義住宅項目完美詮釋了「少即是多」的設計哲學。整體設計以簡潔的線條、純淨的色彩和精選的材質為主軸，創造出寧靜而富有詩意的生活空間。每個設計元素都經過精心挑選，確保功能性與美學的完美平衡。空間配置強調開放性和流暢性，運用自然光線的變化來豐富空間層次。高品質的建材和精工細作確保了住宅的品質和耐久性。",
    image: "/api/placeholder/800/600",
    completionDate: "2025年6月",
    category: "住宅",
    location: "高雄市左營區",
    area: "200坪",
    features: ["極簡設計語彙", "純淨色彩搭配", "開放式空間", "自然光線運用", "高品質建材"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"]
  },
  {
    id: 6,
    title: "智慧環保住宅",
    description: "結合智慧家居系統與環保建材的前瞻性住宅設計",
    fullDescription: "智慧環保住宅代表了未來居住的新趨勢，結合了先進的智慧家居系統與環保建材，實現了節能減碳與現代便利生活的完美結合。住宅採用太陽能發電系統、雨水回收系統以及智慧空調控制，大幅降低環境足跡。室內設計使用環保建材，包括無甲醛裝修材料和可回收材料。智慧家居系統整合照明、安全、溫控等功能，為居住者提供便利舒適的未來生活體驗。",
    image: "/api/placeholder/800/600",
    completionDate: "2025年9月",
    category: "住宅",
    location: "新竹市東區",
    area: "180坪",
    features: ["智慧家居系統", "太陽能發電", "雨水回收系統", "環保建材", "節能設計"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"]
  }
]

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProjectDetail({ params }: Props) {
  const { id } = await params
  const project = projectsData.find(p => p.id === parseInt(id))

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-light text-sm tracking-wide transition-colors duration-200"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            返回作品集
          </Link>
        </div>
      </div>

      {/* Project Hero */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Project Image */}
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] bg-gray-200 rounded-sm overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 font-light text-lg">主要專案圖片</span>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="order-1 lg:order-2">
              <div className="mb-6">
                <span className="text-sm font-light text-gray-500 uppercase tracking-wider">
                  {project.category}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-8 tracking-tight">
                {project.title}
              </h1>
              <div className="h-1 w-16 bg-gray-900 mb-8"></div>
              
              {/* Project Details */}
              <div className="space-y-4 mb-8">
                <div className="flex">
                  <span className="text-gray-500 font-light w-24">位置：</span>
                  <span className="text-gray-900 font-light">{project.location}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 font-light w-24">坪數：</span>
                  <span className="text-gray-900 font-light">{project.area}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 font-light w-24">完工：</span>
                  <span className="text-gray-900 font-light">{project.completionDate}</span>
                </div>
              </div>

              <p className="text-lg text-gray-600 font-light leading-relaxed">
                {project.fullDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-tight">
            項目特色
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {project.features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-sm shadow-sm">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-light text-gray-900 mb-2 tracking-wide">
                  {feature}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-tight">
            項目圖集
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {project.gallery.map((image, index) => (
              <div key={index} className="aspect-[4/3] bg-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 font-light">圖片 {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    id: project.id.toString(),
  }))
}