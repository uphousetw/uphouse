'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          rememberMe: formData.rememberMe
        }),
      })

      if (response.ok) {
        router.push('/admin')
      } else {
        const errorData = await response.json()
        setError(errorData.message || '登入失敗，請檢查帳號密碼')
      }
    } catch {
      setError('登入失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{backgroundColor: 'hsl(30, 3%, 91%)'}}>
      {/* Left side - Welcome */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">
            Welcome!
          </h1>
          
          {/* Logo with smiley face */}
          <div className="relative mb-8">
            <div className="text-9xl font-black text-gray-900 mb-4">
              W.
            </div>
            <div className="absolute -top-4 -right-8">
              <div className="w-24 h-24 bg-green-300 rounded-full border-4 border-blue-600 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="flex space-x-2 mb-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="w-8 h-4 border-b-2 border-blue-600 rounded-b-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 font-light mb-8">
            Not a member yet?{' '}
            <Link href="/" className="text-gray-900 underline font-normal hover:no-underline">
              Register now
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-light text-gray-900 mb-2">Log in</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                EMAIL OR USERNAME
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Email or Username"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-gray-50 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-light text-gray-500 uppercase tracking-wider mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light text-gray-900 bg-gray-50 placeholder-gray-400"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm font-light text-gray-600">
                Keep me logged in
              </label>
            </div>

            {error && (
              <div className="text-red-600 text-sm font-light bg-red-50 p-3 rounded-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white font-light text-sm tracking-wide hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors duration-200 rounded-sm disabled:opacity-50"
            >
              {loading ? '登入中...' : 'Log in now'}
            </button>

            <div className="text-center">
              <Link 
                href="/admin/forgot-password" 
                className="text-sm text-gray-600 hover:text-gray-900 underline font-light"
              >
                Forgot your password?
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm font-light text-gray-500 mb-4">
              Or sign in with
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-light text-gray-700">Google</span>
              </button>
              
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-4 h-4 mr-2 fill-blue-600" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-light text-gray-700">Facebook</span>
              </button>
              
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors duration-200">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm font-light text-gray-700">Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}