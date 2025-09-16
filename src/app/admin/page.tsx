'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
  brandLogos?: { name: string; category: string; logoUrl?: string }[]
  createdAt?: string
  updatedAt?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [heroImages, setHeroImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)
  const [showContactDetail, setShowContactDetail] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyForm, setReplyForm] = useState({ subject: '', message: '' })

  const checkAuthentication = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/status')
      const data = await response.json()

      if (data.authenticated) {
        setIsAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/login')
    } finally {
      setAuthLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load all data in parallel for better performance
      const [contactResponse, projectsResponse, heroResponse] = await Promise.all([
        fetch('/api/contact', {
          headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' }
        }),
        fetch('/api/projects', {
          headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' }
        }),
        fetch('/api/hero-images', {
          headers: { 'Cache-Control': 'public, max-age=600, stale-while-revalidate=1200' }
        })
      ])

      // Process responses in parallel
      const dataPromises = []
      
      if (contactResponse.ok) {
        dataPromises.push(
          contactResponse.json().then(data => 
            setContactSubmissions(data.submissions || [])
          )
        )
      }

      if (projectsResponse.ok) {
        dataPromises.push(
          projectsResponse.json().then(data => 
            setProjects(data.projects || [])
          )
        )
      }

      if (heroResponse.ok) {
        dataPromises.push(
          heroResponse.json().then(data => 
            setHeroImages(data.images || [])
          )
        )
      }

      await Promise.all(dataPromises)
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
    console.log('Edit button clicked for project:', project)
    setEditingProject(project)
    setShowProjectForm(true)
    console.log('showProjectForm set to true, editingProject set to:', project)
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

  const handleSaveProject = async (projectData: Record<string, unknown>) => {
    try {
      console.log('Saving project data:', projectData)
      console.log('editingProject:', editingProject)
      
      if (editingProject) {
        // Update existing project
        console.log('Updating project with ID:', editingProject.id)
        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        console.log('Update response status:', response.status)
        if (response.ok) {
          const updatedProject = await response.json()
          console.log('Updated project:', updatedProject)
          setProjects(prev => 
            prev.map(p => p.id === editingProject.id ? updatedProject : p)
          )
          alert('作品更新成功')
        } else {
          const errorText = await response.text()
          console.error('Update failed with status:', response.status)
          console.error('Update failed with statusText:', response.statusText)
          console.error('Update error response:', errorText)
          alert(`更新失敗: ${response.status} - ${errorText}`)
        }
      } else {
        // Create new project
        console.log('Creating new project')
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(projectData),
        })

        console.log('Create response status:', response.status)
        if (response.ok) {
          const newProject = await response.json()
          console.log('New project:', newProject)
          setProjects(prev => [...prev, newProject])
          alert('作品新增成功')
        } else {
          console.error('Create failed:', response.statusText)
          alert('新增失敗')
        }
      }
      
      setShowProjectForm(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('儲存失敗，請稍後再試')
    }
  }

  const handleViewContactDetail = (contact: ContactSubmission) => {
    setSelectedContact(contact)
    setShowContactDetail(true)
    
    // Automatically mark as read when viewing
    if (contact.status === 'new') {
      updateContactStatus(contact.id, 'read')
    }
  }

  const handleSendReply = async () => {
    if (!selectedContact || !replyForm.subject.trim() || !replyForm.message.trim()) {
      alert('請填寫主旨和訊息內容')
      return
    }

    try {
      const response = await fetch('/api/send-reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedContact.email,
          subject: replyForm.subject,
          message: replyForm.message,
          contactId: selectedContact.id
        }),
      })

      if (response.ok) {
        // Update contact status to replied
        await updateContactStatus(selectedContact.id, 'replied')
        setSelectedContact(prev => prev ? { ...prev, status: 'replied' } : null)
        
        alert('回覆郵件發送成功')
        setShowReplyModal(false)
        setReplyForm({ subject: '', message: '' })
      } else {
        throw new Error('Failed to send reply')
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
      alert('發送失敗，請檢查郵件設定')
    }
  }

  const handleStartReply = () => {
    if (selectedContact) {
      setReplyForm({
        subject: `Re: ${selectedContact.projectType || '聯絡諮詢'}`,
        message: `親愛的 ${selectedContact.name}，\n\n感謝您的聯絡。\n\n`
      })
      setShowReplyModal(true)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-light">驗證中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will be redirected to login
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
              <Image src="/images/icons/icon_uphouse.jpg" alt="向上建設" width={32} height={32} className="rounded-lg object-cover mr-3 shadow-lg" />
              <Link href="/" className="text-xl font-light text-gray-900 tracking-wide">
                向上建設
              </Link>
              <span className="ml-4 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-light rounded-full">
                管理後台
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-light text-sm tracking-wide transition-colors duration-200"
              >
                回到網站
              </Link>
              <button
                onClick={async () => {
                  if (confirm('確定要登出嗎？')) {
                    try {
                      const response = await fetch('/api/admin/logout', {
                        method: 'POST'
                      })
                      if (response.ok) {
                        window.location.href = '/admin/login'
                      }
                    } catch (error) {
                      console.error('Logout failed:', error)
                    }
                  }
                }}
                className="text-gray-600 hover:text-gray-900 font-light text-sm tracking-wide transition-colors duration-200"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: '總覽' },
              { id: 'hero', name: '首頁圖片' },
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
              <button 
                onClick={() => setActiveTab('contacts')}
                className="bg-white p-6 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 text-left w-full"
              >
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
              </button>

              <button 
                onClick={() => setActiveTab('projects')}
                className="bg-white p-6 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 text-left w-full"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Image src="/images/icons/icon_uphouse.jpg" alt="作品項目" width={48} height={48} className="rounded-xl object-cover shadow-lg" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-light text-gray-900">{projects.length}</p>
                    <p className="text-sm font-light text-gray-600">作品項目</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('contacts')}
                className="bg-white p-6 rounded-sm shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 text-left w-full"
              >
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
              </button>
            </div>
          </div>
        )}

        {/* Hero Images Tab */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                首頁圖片管理
              </h1>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="hero-upload"
                  className="hidden"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || [])
                    if (files.length === 0) return

                    try {
                      const uploadPromises = files.map(async (file) => {
                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('folder', 'hero')
                        
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData
                        })
                        
                        if (response.ok) {
                          const result = await response.json()
                          return result.url
                        }
                        throw new Error('Upload failed')
                      })

                      const uploadedUrls = await Promise.all(uploadPromises)
                      const updatedImages = [...heroImages, ...uploadedUrls]
                      
                      // Save to API
                      const saveResponse = await fetch('/api/hero-images', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ images: updatedImages })
                      })

                      if (saveResponse.ok) {
                        setHeroImages(updatedImages)
                        alert(`成功上傳 ${uploadedUrls.length} 張圖片`)
                      }
                    } catch (error) {
                      console.error('Upload error:', error)
                      alert('上傳失敗')
                    }
                    
                    // Reset input
                    e.target.value = ''
                  }}
                />
                <label
                  htmlFor="hero-upload"
                  className="px-6 py-3 bg-gray-900 text-white font-light text-sm tracking-wide hover:bg-gray-800 transition-colors duration-200 cursor-pointer inline-block"
                >
                  上傳圖片
                </label>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-sm p-6">
              <p className="text-gray-600 font-light mb-6">
                管理首頁輪播圖片。可以上傳多張圖片，支援 JPG、PNG、WebP 格式。
              </p>
              
              {heroImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {heroImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Hero image ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/placeholder.jpg'
                          }}
                        />
                      </div>
                      
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={async () => {
                            if (!confirm('確定要刪除這張圖片嗎？')) return
                            
                            const updatedImages = heroImages.filter((_, i) => i !== index)
                            
                            try {
                              const response = await fetch('/api/hero-images', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ images: updatedImages })
                              })

                              if (response.ok) {
                                setHeroImages(updatedImages)
                                alert('圖片刪除成功')
                              } else {
                                throw new Error('Delete failed')
                              }
                            } catch (error) {
                              console.error('Delete error:', error)
                              alert('刪除失敗')
                            }
                          }}
                          className="px-3 py-2 bg-red-600 text-white font-light text-xs tracking-wide hover:bg-red-700 transition-colors duration-200 rounded-sm shadow-lg"
                        >
                          刪除
                        </button>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 font-light truncate">
                          圖片 {index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-light mb-4">暫無首頁圖片</p>
                  <p className="text-sm text-gray-400 font-light">點擊上方「上傳圖片」開始新增圖片</p>
                </div>
              )}
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
                        <td 
                          className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-blue-50"
                          onClick={() => handleViewContactDetail(submission)}
                        >
                          <div>
                            <div className="text-sm font-light text-gray-900 hover:text-blue-600">
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
                              className="text-sm border-gray-300 rounded-md font-light text-gray-900 bg-white"
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
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {project.image && project.image !== '/api/placeholder/800/600' ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.parentElement?.querySelector('.placeholder-text');
                          if (placeholder) {
                            placeholder.classList.remove('hidden');
                          }
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center placeholder-text ${project.image && project.image !== '/api/placeholder/800/600' ? 'hidden' : ''}`}>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-500 font-light text-sm">專案圖片</span>
                      </div>
                    </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-lg p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-900">
                  {editingProject ? '編輯作品' : '新增作品'}
                </h2>
                <button
                  onClick={() => {
                    setShowProjectForm(false)
                    setEditingProject(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault()
                console.log('Form submitted')
                const formData = new FormData(e.target as HTMLFormElement)
                
                console.log('FormData entries:')
                for (const [key, value] of formData.entries()) {
                  console.log(`${key}:`, value)
                }
                
                // Handle file uploads
                const imageFile = formData.get('image') as File
                const galleryFiles = formData.getAll('gallery') as File[]
                
                console.log('Image file:', imageFile)
                console.log('Gallery files:', galleryFiles)
                
                let imageUrl = editingProject?.image || '/api/placeholder/800/600'
                let galleryUrls = editingProject?.gallery || []
                let brandLogosData = editingProject?.brandLogos || []
                
                // Handle actual file upload
                if (imageFile && imageFile.size > 0) {
                  try {
                    // Create FormData for file upload
                    const uploadFormData = new FormData()
                    uploadFormData.append('file', imageFile)
                    uploadFormData.append('folder', 'projects')
                    
                    // Upload file to server
                    const uploadResponse = await fetch('/api/upload', {
                      method: 'POST',
                      body: uploadFormData
                    })
                    
                    if (uploadResponse.ok) {
                      const uploadResult = await uploadResponse.json()
                      imageUrl = uploadResult.url
                      console.log('Image uploaded successfully:', imageUrl)
                    } else {
                      console.error('Image upload failed')
                      // Keep existing image if upload fails
                    }
                  } catch (error) {
                    console.error('Error uploading image:', error)
                    // Keep existing image if upload fails
                  }
                }
                
                if (galleryFiles.length > 0) {
                  // Simulate gallery upload - in production replace with actual upload
                  galleryUrls = galleryFiles.map(file => 
                    file.size > 0 ? `/uploads/gallery/${Date.now()}_${file.name}` : ''
                  ).filter(url => url)
                }

                // Handle brand names (simplified)
                const brandNamesText = formData.get('brandNames') as string
                if (brandNamesText && brandNamesText.trim()) {
                  const brandLines = brandNamesText.split('\n')
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                  
                  brandLogosData = brandLines.map((line, index) => {
                    const parts = line.split(',')
                    const name = parts[0] ? parts[0].trim() : `品牌 ${index + 1}`
                    const category = parts[1] ? parts[1].trim() : '建材'
                    
                    return {
                      name,
                      category
                    }
                  })
                } else {
                  // Keep existing brandLogos if no new data provided
                  brandLogosData = editingProject?.brandLogos || []
                }
                
                const projectData = {
                  title: formData.get('title') as string || '',
                  description: formData.get('description') as string || '',
                  fullDescription: formData.get('fullDescription') as string || '',
                  completionDate: formData.get('completionDate') as string || '',
                  category: formData.get('category') as string || '',
                  location: formData.get('location') as string || '',
                  area: formData.get('area') as string || '',
                  features: formData.get('features') ? 
                    (formData.get('features') as string).split(',').map(f => f.trim()).filter(f => f) : 
                    [],
                  image: imageUrl,
                  gallery: galleryUrls,
                  brandLogos: brandLogosData
                }
                console.log('Processed project data:', projectData)
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
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


                  <div>
                    <label htmlFor="brandNames" className="block text-sm font-light text-gray-700 mb-2">
                      品牌名稱與類別 (每行一個，格式：品牌名稱,類別)
                    </label>
                    <textarea
                      id="brandNames"
                      name="brandNames"
                      rows={4}
                      placeholder="台灣水泥,水泥製造&#10;潤泰建材,綜合建材&#10;三商建材,建築材料"
                      defaultValue={editingProject?.brandLogos?.map(logo => `${logo.name},${logo.category}`).join('\n') || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
                    />
                    <div className="text-xs text-gray-500 font-light">
                      每行輸入一個品牌，格式：品牌名稱,類別 (例如：台灣水泥,水泥製造)
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

        {/* Contact Detail Modal */}
        {showContactDetail && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-lg p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-900">
                  聯絡訊息詳情
                </h2>
                <button
                  onClick={() => {
                    setShowContactDetail(false)
                    setSelectedContact(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                      聯絡人姓名
                    </label>
                    <p className="text-lg font-light text-gray-900">{selectedContact.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                      狀態
                    </label>
                    <span className={`inline-flex px-3 py-1 text-sm font-light rounded-full ${getStatusColor(selectedContact.status)}`}>
                      {getStatusText(selectedContact.status)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                      電子郵件
                    </label>
                    <p className="text-gray-900 font-light">{selectedContact.email}</p>
                  </div>
                  
                  {selectedContact.phone && (
                    <div>
                      <label className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                        聯絡電話
                      </label>
                      <p className="text-gray-900 font-light">{selectedContact.phone}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedContact.projectType && (
                    <div>
                      <label className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                        項目類型
                      </label>
                      <p className="text-gray-900 font-light">{selectedContact.projectType}</p>
                    </div>
                  )}
                  
                  {selectedContact.budget && (
                    <div>
                      <label className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                        預算範圍
                      </label>
                      <p className="text-gray-900 font-light">{selectedContact.budget}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                    提交時間
                  </label>
                  <p className="text-gray-900 font-light">{formatDate(selectedContact.submittedAt)}</p>
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                    訊息內容
                  </label>
                  <div className="bg-gray-50 p-4 rounded-sm">
                    <p className="text-gray-900 font-light whitespace-pre-wrap leading-relaxed">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="contactStatus" className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                        更新狀態
                      </label>
                      <select
                        id="contactStatus"
                        value={selectedContact.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as 'new' | 'read' | 'replied'
                          updateContactStatus(selectedContact.id, newStatus)
                          setSelectedContact(prev => prev ? { ...prev, status: newStatus } : null)
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-white"
                      >
                        <option value="new">新訊息</option>
                        <option value="read">已讀</option>
                        <option value="replied">已回覆</option>
                      </select>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleStartReply}
                        className="px-4 py-2 bg-blue-600 text-white font-light text-sm tracking-wide hover:bg-blue-700 transition-colors duration-200 rounded-sm"
                      >
                        回覆郵件
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteContact(selectedContact.id)
                          setShowContactDetail(false)
                          setSelectedContact(null)
                        }}
                        className="px-4 py-2 bg-red-600 text-white font-light text-sm tracking-wide hover:bg-red-700 transition-colors duration-200 rounded-sm"
                      >
                        刪除訊息
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reply Modal */}
        {showReplyModal && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-lg p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-light text-gray-900">
                  回覆 {selectedContact.name}
                </h2>
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setReplyForm({ subject: '', message: '' })
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      收件人
                    </label>
                    <input
                      type="email"
                      value={selectedContact.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm bg-gray-50 text-gray-600 font-light"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-light text-gray-700 mb-2">
                      主旨
                    </label>
                    <input
                      type="text"
                      value={replyForm.subject}
                      onChange={(e) => setReplyForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900"
                      placeholder="請輸入郵件主旨"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-2">
                    回覆內容
                  </label>
                  <textarea
                    value={replyForm.message}
                    onChange={(e) => setReplyForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 resize-none"
                    placeholder="請輸入回覆內容..."
                  />
                </div>

                {/* Original Message Reference */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-light text-gray-500 uppercase tracking-wider mb-4">
                    原始訊息
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-sm">
                    <div className="text-sm text-gray-600 font-light mb-2">
                      來自: {selectedContact.name} ({selectedContact.email})
                    </div>
                    <div className="text-sm text-gray-600 font-light mb-2">
                      時間: {new Date(selectedContact.submittedAt).toLocaleString('zh-TW')}
                    </div>
                    {selectedContact.projectType && (
                      <div className="text-sm text-gray-600 font-light mb-2">
                        項目類型: {selectedContact.projectType}
                      </div>
                    )}
                    <div className="text-sm text-gray-900 font-light whitespace-pre-wrap mt-3 pt-3 border-t border-gray-200">
                      {selectedContact.message}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => {
                    setShowReplyModal(false)
                    setReplyForm({ subject: '', message: '' })
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-light text-sm tracking-wide hover:bg-gray-50 transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  onClick={handleSendReply}
                  className="px-6 py-2 bg-blue-600 text-white font-light text-sm tracking-wide hover:bg-blue-700 transition-colors duration-200"
                >
                  發送回覆
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}