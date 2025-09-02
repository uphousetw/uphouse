'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  projectType?: string
  budget?: string
  message: string
  submittedAt: string
  status: 'new' | 'read' | 'replied'
}

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
  createdAt?: string
  updatedAt?: string
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load contact submissions
      const contactResponse = await fetch('/api/contact')
      if (contactResponse.ok) {
        const contactData = await contactResponse.json()
        setContactSubmissions(contactData.submissions || [])
      }

      // Load projects
      const projectsResponse = await fetch('/api/projects')
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects || [])
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setContactSubmissions(prev =>
          prev.map(submission =>
            submission.id === id ? { ...submission, status } : submission
          )
        )
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('更新狀態失敗')
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('確定要刪除此聯絡訊息嗎？')) return
    
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setContactSubmissions(prev => prev.filter(c => c.id !== contactId))
        alert('聯絡訊息刪除成功')
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Failed to delete contact:', error)
      alert('刪除失敗，請稍後再試')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800'
      case 'read': return 'bg-yellow-100 text-yellow-800'
      case 'replied': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return '新訊息'
      case 'read': return '已讀'
      case 'replied': return '已回覆'
      default: return status
    }
  }

  const handleAddProject = () => {
    setEditingProject(null)
    setShowProjectForm(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setShowProjectForm(true)
  }

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('確定要刪除此作品嗎？')) return
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId))
        alert('作品刪除成功')
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('刪除失敗，請稍後再試')
    }
  }

  const handleSaveProject = async (projectData: any) => {
    try {
      if (editingProject) {
        // Update existing project
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        if (response.ok) {
          const updatedProject = await response.json()
          setProjects(prev => 
            prev.map(p => p.id === editingProject.id ? updatedProject : p)
          )
          alert('作品更新成功')
        }
      } else {
        // Create new project
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        if (response.ok) {
          const newProject = await response.json()
          setProjects(prev => [...prev, newProject])
          alert('作品新增成功')
        }
      }
      
      setShowProjectForm(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('儲存失敗，請稍後再試')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-light text-gray-900 tracking-wide">
                向上建設
              </Link>
              <span className="ml-4 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-light rounded-full">
                管理後台
              </span>
            </div>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-light text-sm tracking-wide transition-colors duration-200"
            >
              回到網站
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: '總覽' },
              { id: 'contacts', name: '聯絡訊息' },
              { id: 'projects', name: '作品管理' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 border-b-2 font-light text-sm tracking-wide transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              管理總覽
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-light text-gray-900">{contactSubmissions.length}</p>
                    <p className="text-sm font-light text-gray-600">聯絡訊息</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-light text-gray-900">{projects.length}</p>
                    <p className="text-sm font-light text-gray-600">作品項目</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-sm shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-light text-gray-900">
                      {contactSubmissions.filter(s => s.status === 'new').length}
                    </p>
                    <p className="text-sm font-light text-gray-600">待處理訊息</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-8">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              聯絡訊息管理
            </h1>
            
            <div className="bg-white shadow-sm rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        聯絡人
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        項目類型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        預算
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        提交時間
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        狀態
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contactSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-light text-gray-900">
                              {submission.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {submission.email}
                            </div>
                            {submission.phone && (
                              <div className="text-sm text-gray-500">
                                {submission.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                          {submission.projectType || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-light">
                          {submission.budget || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-light">
                          {formatDate(submission.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-light rounded-full ${getStatusColor(submission.status)}`}>
                            {getStatusText(submission.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center space-x-3">
                            <select
                              value={submission.status}
                              onChange={(e) => updateContactStatus(submission.id, e.target.value as 'new' | 'read' | 'replied')}
                              className="text-sm border-gray-300 rounded-md font-light"
                            >
                              <option value="new">新訊息</option>
                              <option value="read">已讀</option>
                              <option value="replied">已回覆</option>
                            </select>
                            <button
                              onClick={() => handleDeleteContact(submission.id)}
                              className="px-3 py-1 bg-red-600 text-white font-light text-xs tracking-wide hover:bg-red-700 transition-colors duration-200 rounded-sm"
                            >
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {contactSubmissions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-light">暫無聯絡訊息</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                作品管理
              </h1>
              <button 
                onClick={handleAddProject}
                className="px-6 py-3 bg-gray-900 text-white font-light text-sm tracking-wide hover:bg-gray-800 transition-colors duration-200"
              >
                新增作品
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-sm shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 font-light">專案圖片</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-light text-gray-500 uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-light text-gray-900 mb-2 tracking-wide">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 font-light text-sm mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <p className="text-xs text-gray-500 font-light mb-4">
                      預計完工：{project.completionDate}
                    </p>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleEditProject(project)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-light text-sm tracking-wide hover:bg-gray-50 transition-colors duration-200"
                      >
                        編輯
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-light text-sm tracking-wide hover:bg-red-700 transition-colors duration-200"
                      >
                        刪除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-light">暫無作品項目</p>
              </div>
            )}
          </div>
        )}

        {/* Project Form Modal */}
        {showProjectForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm shadow-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                {editingProject ? '編輯作品' : '新增作品'}
              </h2>
              
              <form onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                
                // Handle file uploads
                const imageFile = formData.get('image') as File
                const galleryFiles = formData.getAll('gallery') as File[]
                
                let imageUrl = editingProject?.image || '/api/placeholder/800/600'
                let galleryUrls = editingProject?.gallery || []
                
                // For now, we'll use placeholder logic since we don't have actual file upload server
                // In production, you'd upload to a file storage service (AWS S3, Cloudinary, etc.)
                if (imageFile && imageFile.size > 0) {
                  // Simulate file upload - in production replace with actual upload
                  imageUrl = `/uploads/projects/${Date.now()}_${imageFile.name}`
                }
                
                if (galleryFiles.length > 0) {
                  // Simulate gallery upload - in production replace with actual upload
                  galleryUrls = galleryFiles.map(file => 
                    file.size > 0 ? `/uploads/gallery/${Date.now()}_${file.name}` : ''
                  ).filter(url => url)
                }
                
                const projectData = {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  fullDescription: formData.get('fullDescription') as string,
                  completionDate: formData.get('completionDate') as string,
                  category: formData.get('category') as string,
                  location: formData.get('location') as string,
                  area: formData.get('area') as string,
                  features: (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f),
                  image: imageUrl,
                  gallery: galleryUrls
                }
                handleSaveProject(projectData)
              }}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-light text-gray-700 mb-2">
                      專案名稱
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      defaultValue={editingProject?.title || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-light text-gray-700 mb-2">
                      專案描述
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={3}
                      defaultValue={editingProject?.description || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                    />
                  </div>

                  <div>
                    <label htmlFor="fullDescription" className="block text-sm font-light text-gray-700 mb-2">
                      詳細描述
                    </label>
                    <textarea
                      id="fullDescription"
                      name="fullDescription"
                      rows={5}
                      defaultValue={editingProject?.fullDescription || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="completionDate" className="block text-sm font-light text-gray-700 mb-2">
                        完工日期
                      </label>
                      <input
                        type="text"
                        id="completionDate"
                        name="completionDate"
                        required
                        placeholder="2024年6月"
                        defaultValue={editingProject?.completionDate || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-light text-gray-700 mb-2">
                        項目類別
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        defaultValue={editingProject?.category || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                      >
                        <option value="">請選擇類別</option>
                        <option value="住宅">住宅</option>
                        <option value="商業">商業</option>
                        <option value="工業">工業</option>
                        <option value="公共建設">公共建設</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="location" className="block text-sm font-light text-gray-700 mb-2">
                        地點
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="台北市大安區"
                        defaultValue={editingProject?.location || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                      />
                    </div>

                    <div>
                      <label htmlFor="area" className="block text-sm font-light text-gray-700 mb-2">
                        面積
                      </label>
                      <input
                        type="text"
                        id="area"
                        name="area"
                        placeholder="280坪"
                        defaultValue={editingProject?.area || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="features" className="block text-sm font-light text-gray-700 mb-2">
                      特色 (用逗號分隔)
                    </label>
                    <input
                      type="text"
                      id="features"
                      name="features"
                      placeholder="大面積玻璃窗, 開放式格局, 進口石材"
                      defaultValue={editingProject?.features?.join(', ') || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-light text-gray-700 mb-2">
                      主要圖片
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                      />
                      {editingProject?.image && (
                        <div className="text-sm text-gray-600 font-light">
                          目前圖片: <span className="font-normal">{editingProject.image}</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 font-light">
                        支援格式: JPG, PNG, WebP (建議尺寸: 800x600 或更高)
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gallery" className="block text-sm font-light text-gray-700 mb-2">
                      作品圖片集 (可選擇多張)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        id="gallery"
                        name="gallery"
                        accept="image/*"
                        multiple
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                      />
                      {editingProject?.gallery && editingProject.gallery.length > 0 && (
                        <div className="text-sm text-gray-600 font-light">
                          目前圖片數量: <span className="font-normal">{editingProject.gallery.length} 張</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 font-light">
                        支援格式: JPG, PNG, WebP | 可同時選擇多張圖片
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProjectForm(false)
                      setEditingProject(null)
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-light text-sm tracking-wide hover:bg-gray-50 transition-colors duration-200"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gray-900 text-white font-light text-sm tracking-wide hover:bg-gray-800 transition-colors duration-200"
                  >
                    {editingProject ? '更新作品' : '新增作品'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}