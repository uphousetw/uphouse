'use client'

import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import BrandLogosSection from '@/components/BrandLogosSection'

interface Project {
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
  brandLogos?: { name: string; category: string; logoUrl?: string }[]
}

interface Props {
  params: Promise<{ id: string }>
}

export default function ProjectDetail({ params }: Props) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loadProject = async () => {
      try {
        const resolvedParams = await params
        const { id } = resolvedParams

        const response = await fetch(`/api/projects/${id}`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })

        if (response.ok) {
          const projectData = await response.json()
          setProject(projectData)
        } else if (response.status === 404) {
          setError(true)
        }
      } catch (error) {
        console.error('Failed to load project:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params])

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

  if (error || !project) {
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
              <div style={{
                aspectRatio: '4/3',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative'
              }}>
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
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center placeholder-fallback">
                    <span className="text-gray-400 font-light text-lg">主要專案圖片</span>
                  </div>
                )}
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
                {project.fullDescription || project.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Section */}
      {project.brandLogos && project.brandLogos.length > 0 && (
        <BrandLogosSection brandLogos={project.brandLogos} />
      )}

    </div>
  )
}