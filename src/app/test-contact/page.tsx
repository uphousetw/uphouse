'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('訊息已成功傳送！')
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        })
      } else {
        const errorData = await response.json()
        alert(`傳送失敗：${errorData.error || '請稍後再試'}`)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      alert('傳送失敗，請稍後再試。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left Side - Contact Form */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              聯絡我們
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
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="請輸入您的姓名"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  電話號碼 *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="請輸入您的電話號碼"
                  required
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  placeholder="我們會透過此信箱回覆您"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  訊息內容
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors resize-none"
                  placeholder="請告訴我們如何為您服務"
                  required
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all duration-200 ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? '傳送中...' : '傳送訊息'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Contact Information & Map */}
          <div className="space-y-8">

            {/* Contact Information Section */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side - Contact Info */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    聯絡方式
                  </h3>

                  <div className="space-y-6">
                    {/* Phone */}
                    <div className="flex items-center">
                      <div className="w-6 h-6 text-black mr-4 flex-shrink-0">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg">03-777-5355</span>
                    </div>

                    {/* Email */}
                    <div className="flex items-center">
                      <div className="w-6 h-6 text-black mr-4 flex-shrink-0">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg">contact@uphousetw.com</span>
                    </div>

                    {/* Facebook */}
                    <div className="flex items-center">
                      <div className="w-6 h-6 text-black mr-4 flex-shrink-0">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <a href="https://www.facebook.com/uphousetw" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black text-lg transition-colors">
                        facebook.com/uphousetw
                      </a>
                    </div>

                    {/* Address */}
                    <div className="flex items-start">
                      <div className="w-6 h-6 text-black mr-4 mt-0.5 flex-shrink-0">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-lg">苗栗縣竹南鎮康德街71號</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Line Section */}
                <div className="flex flex-col justify-center items-center">
                  <h4 className="text-2xl font-semibold text-gray-900 mb-6">
                    Line 即時聯絡
                  </h4>
                  <div className="flex justify-center mb-4">
                    <img
                      src="/feature/Line 連結.avif"
                      alt="Line 連結 QR Code"
                      className="w-40 h-40 object-contain rounded-lg shadow-sm border border-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Section */}
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="w-full h-80 rounded-lg overflow-hidden shadow-sm">
                <iframe
                  src="https://maps.google.com/maps?q=苗栗縣竹南鎮康德街71號&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}