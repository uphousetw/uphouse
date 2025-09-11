import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200/60 relative">
      {/* Subtle geometric accent */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto py-12 px-6">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {/* Brand */}
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <img src="/images/icons/icon_uphouse.jpg" alt="向上建設" className="w-10 h-10 rounded-lg object-cover shadow-sm" />
            <div className="text-2xl font-light text-stone-800 tracking-wide">向上建設</div>
            <div className="hidden sm:block w-px h-7 bg-stone-200 mx-4"></div>
            <div className="hidden sm:block text-base text-stone-600 font-light">Building Excellence</div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-8">
            <Link href="/about" className="text-stone-600 hover:text-stone-800 font-light text-base tracking-wide transition-all duration-300 hover:translate-y-[-1px] relative group">
              關於我們
              <div className="absolute -bottom-1 left-0 w-0 h-px bg-stone-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/portfolio" className="text-stone-600 hover:text-stone-800 font-light text-base tracking-wide transition-all duration-300 hover:translate-y-[-1px] relative group">
              作品集
              <div className="absolute -bottom-1 left-0 w-0 h-px bg-stone-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link href="/contact" className="text-stone-600 hover:text-stone-800 font-light text-base tracking-wide transition-all duration-300 hover:translate-y-[-1px] relative group">
              聯絡我們
              <div className="absolute -bottom-1 left-0 w-0 h-px bg-stone-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
          </nav>
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="flex items-center space-x-6">
            <p className="text-stone-500 font-light text-sm tracking-wide">
              © 2024 向上建設
            </p>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full"></div>
              <span className="text-stone-400 font-light text-sm">專業建築設計</span>
            </div>
          </div>

          {/* Contact Info - Minimal */}
          <div className="flex items-center space-x-6 text-sm text-stone-500 font-light">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-stone-500 rounded-full"></div>
              </div>
              <span>info@uphouse.com.tw</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-stone-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-stone-500 rounded-full"></div>
              </div>
              <span>(02) 2xxx-xxxx</span>
            </div>
          </div>
        </div>

        {/* Subtle bottom accent */}
        <div className="absolute bottom-0 right-8 w-20 h-px bg-gradient-to-r from-stone-300 to-transparent"></div>
      </div>
    </footer>
  )
}