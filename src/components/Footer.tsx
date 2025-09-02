import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-light text-gray-900 tracking-wide mb-6">
              向上建設
            </div>
            <p className="text-gray-600 font-light leading-relaxed mb-4">
              專業建築設計服務，致力於創造高品質的住宅空間，
              將創新設計與實用性完美結合。
            </p>
            <p className="text-sm text-gray-500 font-light">
              建築設計 · 住宅規劃 · 專業施工
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-light text-gray-900 mb-6 tracking-wide">
              快速連結
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 font-light transition-colors duration-200">
                  關於我們
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-600 hover:text-gray-900 font-light transition-colors duration-200">
                  作品集
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-light transition-colors duration-200">
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-light text-gray-900 mb-6 tracking-wide">
              聯絡資訊
            </h3>
            <div className="space-y-4 text-gray-600 font-light">
              <div>
                <p>電話：(02) 2xxx-xxxx</p>
              </div>
              <div>
                <p>信箱：info@uphouse.com.tw</p>
              </div>
              <div>
                <p>地址：台北市 xxx區 xxx路 xxx號</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500 font-light">
            © 2024 向上建設. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}