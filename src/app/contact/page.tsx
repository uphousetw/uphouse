'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [showErrorPopup, setShowErrorPopup] = useState(false)

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.name.trim()) {
      newErrors.name = '請輸入姓名'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入電話號碼'
    } else {
      // Taiwan phone number validation
      const cleanPhone = formData.phone.replace(/[\s-]/g, '')
      const phoneRegex = /^(?:09\d{8}|0[2-8]\d{7,8}|070\d{7}|080[09]\d{6})$/
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = '請輸入有效的台灣電話號碼格式 (例：02-12345678、0912345678、070-1234567、0800123456)'
      }
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '請輸入有效的電子信箱格式'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form first
    if (!validateForm()) {
      setShowErrorPopup(true)
      setTimeout(() => setShowErrorPopup(false), 4000) // Hide after 4 seconds
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit form')
      }

      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        projectType: '',
        message: ''
      })
      setErrors({})
    } catch (error) {
      console.error('Form submission error:', error)
      setShowErrorPopup(true)
      setTimeout(() => setShowErrorPopup(false), 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">
            訊息已成功送出
          </h2>
          <p className="text-gray-600 font-light leading-relaxed mb-8">
            感謝您的聯絡，我們會在24小時內回覆您的詢問。
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-light text-sm tracking-wide hover:bg-gray-800 transition-colors duration-200"
          >
            返回聯絡頁面
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">請完善必填資料</h3>
              </div>
            </div>
            <div className="mb-6">
              {Object.entries(errors).map(([field, message]) => (
                <p key={field} className="text-sm text-red-600 mb-1">• {message}</p>
              ))}
              {Object.keys(errors).length === 0 && (
                <p className="text-sm text-red-600">提交失敗，請稍後再試</p>
              )}
            </div>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors duration-200"
            >
              確定
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
            聯絡我們
          </h1>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            我們專注於提供優質的建築服務，協助您實現理想的居住空間。歡迎與我們聯繫討論您的建案需求。
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left Side - Contact Form */}
            <div className="bg-white">
              <h2 className="text-3xl font-light text-gray-900 mb-8 tracking-tight">
                讓我們談談您的項目
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg font-light text-gray-900 placeholder-gray-500 transition-colors duration-200 ${
                      errors.name
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900'
                    }`}
                    placeholder="請輸入您的姓名"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    電子信箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg font-light text-gray-900 placeholder-gray-500 transition-colors duration-200 ${
                      errors.email
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900'
                    }`}
                    placeholder="請輸入您的電子信箱"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    電話 *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg font-light text-gray-900 placeholder-gray-500 transition-colors duration-200 ${
                      errors.phone
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900'
                    }`}
                    placeholder="請輸入您的電話 (例：02-12345678、0912345678、070-1234567)"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Project Type Field */}
                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                    洽詢類型
                  </label>
                  <input
                    type="text"
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light text-gray-900 placeholder-gray-500"
                    placeholder="例：透天別墅、華廈、其他建案洽詢"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    詳細需求
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light text-gray-900 placeholder-gray-500 resize-none"
                    placeholder="請告訴我們您的詳細需求，包括預算、時程、特殊要求等..."
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-8 py-4 rounded-lg font-medium text-lg tracking-wide transition-colors duration-200 ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isSubmitting ? '送出中...' : '送出詢問'}
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-gray-500 font-light leading-relaxed">
                * 必填欄位。我們重視您的隱私，您的資料僅用於回覆您的詢問。
              </p>
            </div>

            {/* Right Side - Contact Information */}
            <div className="space-y-12">
              {/* Direct Contact Section */}
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">
                  直接聯繫方式
                </h3>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">(03) 777-5355</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">info@uphousetw.com</p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">週一至週五，上午9點至下午6點</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Location */}
              <div>
                <h3 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">
                  造訪我們的辦公室
                </h3>

                {/* Company Image */}
                <div className="mb-8">
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/images/gallery/拾壹間.jpg"
                      alt="向上建設公司形象"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900 mb-2">苗栗縣竹南鎮康德街71號</p>
                    <button className="inline-flex items-center text-gray-600 hover:text-gray-900 font-light text-sm tracking-wide transition-colors duration-200">
                      取得路線指引
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}