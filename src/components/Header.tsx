'use client'

import Link from 'next/link'
import { useState } from 'react'
import React from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Add padding to body when header is fixed
  React.useEffect(() => {
    document.body.style.paddingTop = '80px'
    return () => {
      document.body.style.paddingTop = '0'
    }
  }, [])

  const navItems = [
    { name: '首頁', href: '/' },
    { name: '關於我們', href: '/about' },
    { name: '作品集', href: '/portfolio' },
    { name: '聯絡我們', href: '/contact' },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100/50 fixed w-full top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mr-3 group-hover:from-gray-700 group-hover:to-gray-800 transition-all duration-200">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3z"/>
                  </svg>
                </div>
                <div className="text-2xl font-light text-gray-900 tracking-wide group-hover:text-gray-700 transition-colors duration-200">
                  向上建設
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative text-gray-600 hover:text-gray-900 font-medium text-base tracking-wide transition-colors duration-200 py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none hover:bg-gray-50 rounded-lg transition-all duration-200"
            >
              <svg className="h-6 w-6 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'}}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-gray-100 mt-4">
            <div className="space-y-2 pt-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium text-base tracking-wide transition-all duration-200 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}