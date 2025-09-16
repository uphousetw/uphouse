'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import React from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Add padding to body when header is fixed
  React.useEffect(() => {
    document.body.style.paddingTop = '96px'
    return () => {
      document.body.style.paddingTop = '0'
    }
  }, [])

  const navItems = [
    { name: '首頁', href: '/' },
    { name: '關於我們', href: '/about' },
    { name: '建案', href: '/portfolio' },
    { name: '聯絡我們', href: '/contact' },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 fixed w-full top-0 z-50 transition-all duration-300" style={{backgroundColor: 'rgba(249, 241, 236, 0.95)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="flex items-center">
                <Image src="/images/icons/icon_uphouse.jpg" alt="向上建設" width={40} height={40} className="rounded-lg object-cover mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300" />
                <div className="text-3xl font-light text-gray-900 tracking-wide group-hover:text-orange-500 transition-colors duration-300">
                  向上建設
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative text-gray-700 hover:text-gray-900 font-medium text-lg tracking-wide transition-colors duration-300 py-3"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-500 group-hover:w-full transition-all duration-300 ease-out rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-gray-900 hover:text-orange-500 focus:outline-none hover:bg-white/50 rounded-xl transition-all duration-300 shadow-sm"
            >
              <svg className="h-7 w-7 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'}}>
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
          <div className="md:hidden pb-8 border-t border-gray-200 mt-6">
            <div className="space-y-3 pt-6">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-6 py-4 text-gray-700 hover:text-gray-900 hover:bg-white/60 font-medium text-lg tracking-wide transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                  onClick={() => setIsMenuOpen(false)}
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-4 opacity-60"></div>
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