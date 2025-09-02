'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Project {
  id: number
  title: string
  description: string
  image: string
  completionDate: string
  category: string
}

const sampleProjects: Project[] = [
  {
    id: 1,
    title: "現代簡約別墅",
    description: "位於台北市的現代簡約風格別墅，採用大面積玻璃窗設計，讓自然光線充分進入室內空間。開放式格局結合精緻的建材選擇，創造出優雅而舒適的居住環境。",
    image: "/api/placeholder/400/300",
    completionDate: "2024年6月",
    category: "住宅"
  },
  {
    id: 2,
    title: "都會雅居",
    description: "坐落於新北市的都會住宅設計，強調空間的多功能性與收納效率。透過巧妙的格局規劃，在有限的空間內創造出寬敞明亮的居住感受。",
    image: "/api/placeholder/400/300",
    completionDate: "2024年9月",
    category: "住宅"
  },
  {
    id: 3,
    title: "自然風格住宅",
    description: "融合自然元素的住宅設計，大量運用木質材料與石材，搭配綠意植栽，營造出與自然和諧共生的居住空間。",
    image: "/api/placeholder/400/300",
    completionDate: "2024年12月",
    category: "住宅"
  },
  {
    id: 4,
    title: "城市景觀住宅",
    description: "充分利用城市景觀優勢的高樓住宅設計，透過大片落地窗將城市美景引入室內，同時注重隱私保護與生活品質。",
    image: "/api/placeholder/400/300",
    completionDate: "2025年3月",
    category: "住宅"
  },
  {
    id: 5,
    title: "極簡主義住宅",
    description: "貫徹極簡主義理念的住宅設計，以簡潔的線條與純淨的色彩為主軸，創造出寧靜而富有詩意的生活空間。",
    image: "/api/placeholder/400/300",
    completionDate: "2025年6月",
    category: "住宅"
  },
  {
    id: 6,
    title: "智慧環保住宅",
    description: "結合智慧家居系統與環保建材的前瞻性住宅設計，實現節能減碳的同時，提供便利舒適的現代生活體驗。",
    image: "/api/placeholder/400/300",
    completionDate: "2025年9月",
    category: "住宅"
  }
]

const PROJECTS_PER_PAGE = 3

export default function Portfolio() {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(sampleProjects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const currentProjects = sampleProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              作品集
            </h1>
            <div className="h-1 w-16 bg-gray-900 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              探索我們的住宅設計項目，每個作品都體現了對細節的執著與對品質的追求。
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
            {currentProjects.map((project) => (
              <div key={project.id} className="group">
                <div className="bg-white rounded-sm shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Project Image */}
                  <div className="relative h-80 bg-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 font-light">專案圖片</span>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>
                  
                  {/* Project Info */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-light text-gray-500 uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="text-xs font-light text-gray-500">
                        預計完工：{project.completionDate}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-light text-gray-900 mb-4 tracking-wide">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 font-light leading-relaxed text-sm mb-6">
                      {project.description}
                    </p>
                    
                    <Link
                      href={`/portfolio/${project.id}`}
                      className="inline-flex items-center text-gray-700 font-light text-sm tracking-wide hover:text-gray-900 transition-colors duration-200"
                    >
                      查看詳情
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-16 space-x-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-6 py-3 font-light tracking-wide transition-colors duration-200 ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                上一頁
              </button>
              
              <div className="flex space-x-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-12 h-12 font-light tracking-wide transition-colors duration-200 ${
                      currentPage === i + 1
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-6 py-3 font-light tracking-wide transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                下一頁
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}