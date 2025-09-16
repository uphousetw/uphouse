'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-sm shadow-sm p-8">
        <div className="text-center mb-8">
          <Link href="/admin/login" className="inline-block mb-6">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-white font-light text-xl">W.</span>
            </div>
          </Link>
          <h1 className="text-2xl font-light text-gray-900 mb-2">Forgot Password</h1>
          <p className="text-gray-600 font-light text-sm">
            Enter your email address and we&apos;ll send you a reset link
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uphouse.com"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-gray-50 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white font-light text-sm tracking-wide hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200 rounded-sm disabled:opacity-50"
            >
              {loading ? '發送中...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-light text-gray-900">Email Sent!</h2>
            <p className="text-gray-600 font-light text-sm">
              We&apos;ve sent password reset instructions to {email}
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/admin/login"
            className="text-sm text-gray-600 hover:text-gray-900 underline font-light"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}