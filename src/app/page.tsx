'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from "next/link";
import dynamic from 'next/dynamic'

// Lazy load components that are not immediately visible
const HeroSlider = dynamic(() => import('@/components/HeroSlider'), {
  loading: () => (
    <div className="w-full h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400">載入中...</div>
    </div>
  ),
  ssr: false
})

export default function Home() {
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Memoize the API call to prevent unnecessary re-fetching
  const loadHeroImages = useMemo(() => {
    return async () => {
      try {
        const response = await fetch('/api/hero-images', {
          // Add caching headers
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
          }
        })
        if (response.ok) {
          const data = await response.json()
          setHeroImages(data.images || [])
        }
      } catch (error) {
        console.error('Failed to load hero images:', error)
      } finally {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    loadHeroImages()
  }, [loadHeroImages])

  return (
    <div style={{backgroundColor: '#F9F1EC'}}>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative" style={{backgroundColor: '#F9F1EC'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 leading-tight">
                向上建設<br />
                <span className="text-orange-500 font-normal">向下紮根</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed max-w-xl">
                苗栗高鐵特區 質感美學住宅
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-medium text-lg rounded-lg hover:bg-gray-800 transition-all duration-300"
                >
                  熱銷建案
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 font-medium text-lg rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  聯絡我們
                </Link>
              </div>
            </div>

            {/* Right Content - Image Slider */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {loading ? (
                  <div className="w-full h-[500px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">載入中...</p>
                    </div>
                  </div>
                ) : (
                  <HeroSlider 
                    images={heroImages} 
                    className="w-full h-[500px] lg:h-[600px]" 
                  />
                )}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-orange-100 rounded-full opacity-60 -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-50 rounded-full opacity-40 -z-10"></div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20" style={{backgroundColor: '#F9F1EC'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              精選建案
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              探索我們最新的住宅設計項目，每個細節都體現專業品質
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{backgroundColor: 'rgba(231, 229, 228, 0.5)'}}>
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-500 text-sm">建案圖片</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    住宅建案 {item}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    現代簡約風格設計，注重自然採光與空間流動
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>預計完工：2024 Q{item + 1}</span>
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      進行中
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/portfolio"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium text-lg rounded-lg hover:bg-gray-800 transition-all duration-300"
            >
              查看更多建案
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20" style={{backgroundColor: '#F9F1EC'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              幸福不必遠求
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              家，即是世界上最幸福的地方<br />
              我們致力於創造各具風格的建築作品，以苗栗為起點，讓居住的每個空間都充滿著生命力和獨特性!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 住宅設計 */}
            <div className="group text-center p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-all duration-300" style={{backgroundColor: 'rgba(231, 229, 228, 0.3)'}}>
              <div className="w-20 h-20 mx-auto mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl flex items-center justify-center group-hover:from-stone-600 group-hover:to-stone-700 transition-all duration-300 shadow-sm">
                  <svg className="w-10 h-10 text-stone-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-medium text-stone-800 mb-4 group-hover:text-stone-900 transition-colors duration-300">住宅設計</h3>
              <p className="text-stone-600 leading-relaxed">量身訂做的住宅設計方案，結合美學與實用性</p>
            </div>

            {/* 空間規劃 */}
            <div className="group text-center p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-all duration-300" style={{backgroundColor: 'rgba(231, 229, 228, 0.3)'}}>
              <div className="w-20 h-20 mx-auto mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl flex items-center justify-center group-hover:from-stone-600 group-hover:to-stone-700 transition-all duration-300 shadow-sm">
                  <svg className="w-10 h-10 text-stone-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-medium text-stone-800 mb-4 group-hover:text-stone-900 transition-colors duration-300">空間規劃</h3>
              <p className="text-stone-600 leading-relaxed">精確的空間配置與動線設計，最大化使用效益</p>
            </div>

            {/* 專業施工 */}
            <div className="group text-center p-8 rounded-2xl border border-stone-100 hover:shadow-lg transition-all duration-300" style={{backgroundColor: 'rgba(231, 229, 228, 0.3)'}}>
              <div className="w-20 h-20 mx-auto mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl flex items-center justify-center group-hover:from-stone-600 group-hover:to-stone-700 transition-all duration-300 shadow-sm">
                  <svg className="w-10 h-10 text-stone-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-medium text-stone-800 mb-4 group-hover:text-stone-900 transition-colors duration-300">專業施工</h3>
              <p className="text-stone-600 leading-relaxed">嚴格品質控制與專業施工管理，確保最高標準</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
