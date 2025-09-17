'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Project {
  id: number
  title: string
  description: string
  image?: string
  completionDate: string
  category: string
  location?: string
  area?: string
}

const PROJECTS_PER_PAGE = 3

export default function Portfolio() {
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        console.log('🔄 Fetching projects from API...')
        const response = await fetch('/api/projects')

        if (response.ok) {
          const data = await response.json()
          console.log('📦 API Response:', data)

          if (data && Array.isArray(data.projects)) {
            setProjects(data.projects)
            console.log('✅ Projects loaded:', data.projects.length)
          } else {
            console.warn('⚠️ Invalid data structure')
            setError('Invalid data structure')
          }
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (err) {
        console.error('❌ Error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE
  const currentProjects = projects.slice(startIndex, startIndex + PROJECTS_PER_PAGE)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-light">載入失敗: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重新載入
          </button>
        </div>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-light">目前沒有專案資料</p>
        </div>
      </div>
    )
  }

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
            <p className="text-sm text-gray-400 mt-4">
              顯示 {currentProjects.length} / {projects.length} 個專案
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12">
            {currentProjects.map((project) => {
              console.log('🏠 Rendering project:', project.id, project.title, project.image)

              return (
                <div key={project.id} className="group">
                  <div className="bg-white rounded-sm shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Project Image */}
                    <div style={{ height: '320px', position: 'relative', backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
                      {project.image && project.image !== '/api/placeholder/800/600' ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          onLoad={() => console.log('✅ Portfolio image loaded:', project.image)}
                          onError={() => console.log('❌ Portfolio image failed:', project.image)}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#e5e5e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#666'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{
                              width: '64px',
                              height: '64px',
                              backgroundColor: '#ccc',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 8px'
                            }}>
                              <svg style={{ width: '32px', height: '32px', color: '#888' }} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span style={{ fontSize: '14px', color: '#666' }}>專案圖片</span>
                          </div>
                        </div>
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'transparent',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      ></div>
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
              )
            })}
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