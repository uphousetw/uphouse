'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        budget: '',
        message: ''
      })
    } catch (error) {
      console.error('Form submission error:', error)
      alert('提交失敗，請稍後再試')
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
      {/* Hero Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
              聯絡我們
            </h1>
            <div className="h-1 w-16 bg-gray-900 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
              讓我們一起討論您的建築設計需求，
              為您打造理想的居住空間。
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-8 tracking-tight">
                取得聯繫
              </h2>
              <div className="h-1 w-16 bg-gray-900 mb-8"></div>
              
              <p className="text-lg text-gray-600 font-light leading-relaxed mb-12">
                無論您是想要新建住宅、改建現有空間，或是有任何建築設計相關的問題，
                我們的專業團隊都很樂意為您提供諮詢服務。
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-light text-gray-900 mb-2 tracking-wide">
                      電話
                    </h3>
                    <p className="text-gray-600 font-light">
                      (02) 2xxx-xxxx
                    </p>
                    <p className="text-gray-500 font-light text-sm mt-1">
                      週一至週五 9:00-18:00
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-light text-gray-900 mb-2 tracking-wide">
                      電子信箱
                    </h3>
                    <p className="text-gray-600 font-light">
                      info@uphouse.com.tw
                    </p>
                    <p className="text-gray-500 font-light text-sm mt-1">
                      24小時內回覆
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-lg font-light text-gray-900 mb-2 tracking-wide">
                      辦公地址
                    </h3>
                    <p className="text-gray-600 font-light">
                      台北市大安區 xxx路 xxx號 x樓
                    </p>
                    <p className="text-gray-500 font-light text-sm mt-1">
                      近捷運xxx站
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-8 tracking-tight">
                聯絡表單
              </h2>
              <div className="h-1 w-16 bg-gray-900 mb-8"></div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light text-gray-900 placeholder-gray-500"
                      placeholder="請輸入您的姓名"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                      電話
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light text-gray-900 placeholder-gray-500"
                      placeholder="請輸入您的電話"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                    電子信箱 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light text-gray-900 placeholder-gray-500"
                    placeholder="請輸入您的電子信箱"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                      項目類型
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light text-gray-900"
                    >
                      <option value="">請選擇項目類型</option>
                      <option value="新建住宅">新建住宅</option>
                      <option value="住宅改建">住宅改建</option>
                      <option value="室內設計">室內設計</option>
                      <option value="諮詢服務">諮詢服務</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                      預算範圍
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light text-gray-900"
                    >
                      <option value="">請選擇預算範圍</option>
                      <option value="500萬以下">500萬以下</option>
                      <option value="500-1000萬">500-1000萬</option>
                      <option value="1000-2000萬">1000-2000萬</option>
                      <option value="2000萬以上">2000萬以上</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-light text-gray-700 mb-2 tracking-wide">
                    詳細需求 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 font-light text-gray-900 placeholder-gray-500 resize-none"
                    placeholder="請詳細描述您的建築設計需求，包括地點、坪數、風格偏好等..."
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-8 py-4 font-light text-lg tracking-wide transition-colors duration-200 ${
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
          </div>
        </div>
      </section>
    </div>
  )
}