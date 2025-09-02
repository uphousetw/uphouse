import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-48 h-48 bg-white/3 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="min-h-[85vh] flex items-center">
            <div className="px-4 sm:px-6 lg:px-8 py-32">
              <div className="max-w-4xl">
                {/* Premium Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-light tracking-wider mb-8 border border-white/20">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  專業認證建築團隊
                </div>
                
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-extralight text-white leading-[0.9] tracking-tight mb-6">
                  <span className="block opacity-95">向上</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">建設</span>
                </h1>
                
                <div className="flex items-center mb-8">
                  <div className="h-px w-24 bg-gradient-to-r from-white to-transparent"></div>
                  <div className="w-2 h-2 bg-white rounded-full mx-4 opacity-60"></div>
                  <div className="h-px w-24 bg-gradient-to-l from-white to-transparent"></div>
                </div>
                
                <p className="text-xl lg:text-2xl xl:text-3xl text-white/85 font-light leading-relaxed mb-16 max-w-3xl">
                  專業建築設計服務，致力於創造高品質的住宅空間，
                  <br className="hidden lg:block" />
                  <span className="text-white/70">將創新設計與實用性完美結合。</span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    href="/portfolio"
                    className="group inline-flex items-center px-10 py-5 bg-white text-gray-900 font-medium text-lg tracking-wide hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25"
                  >
                    查看作品集
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center px-10 py-5 border-2 border-white/30 text-white font-medium text-lg tracking-wide hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
                  >
                    聯絡我們
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            {/* Section Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-gray-50 rounded-full text-gray-600 text-sm font-medium tracking-wider mb-8 border border-gray-200">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              我們的專業服務
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-extralight text-gray-900 mb-8 tracking-tight leading-tight">
              建築設計服務
            </h2>
            
            <div className="flex items-center justify-center mb-10">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-gray-300"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full mx-6 opacity-60"></div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
            
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              我們提供全方位的建築設計服務，從概念發想到完工交付，
              <br className="hidden sm:block" />
              每個細節都體現專業與品質。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="mb-10 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-200/50">
                  <svg className="w-10 h-10 text-gray-700 group-hover:text-gray-900 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-wide group-hover:text-gray-800 transition-colors duration-200">
                住宅設計
              </h3>
              <p className="text-gray-600 font-light leading-relaxed text-lg px-4">
                量身訂做的住宅設計，結合美學與機能，
                <br className="hidden sm:block" />
                創造舒適宜人的居住環境。
              </p>
            </div>

            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="mb-10 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-200/50">
                  <svg className="w-10 h-10 text-gray-700 group-hover:text-gray-900 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8h2a2 2 0 012 2v6a2 2 0 01-2 2H9m8-3l3-3-3-3m-12 6l-3-3 3-3" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-wide group-hover:text-gray-800 transition-colors duration-200">
                空間規劃
              </h3>
              <p className="text-gray-600 font-light leading-relaxed text-lg px-4">
                精準的空間配置與動線規劃，
                <br className="hidden sm:block" />
                最大化每個空間的使用價值。
              </p>
            </div>

            <div className="group text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="mb-10 relative">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-200/50">
                  <svg className="w-10 h-10 text-gray-700 group-hover:text-gray-900 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-6 tracking-wide group-hover:text-gray-800 transition-colors duration-200">
                專業施工
              </h3>
              <p className="text-gray-600 font-light leading-relaxed text-lg px-4">
                嚴格的施工管理與品質控制，
                <br className="hidden sm:block" />
                確保每個項目都達到最高標準。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <svg className="absolute top-0 left-0 w-full h-64" viewBox="0 0 1200 200">
            <defs>
              <linearGradient id="wave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f3f4f6" stopOpacity="0"/>
                <stop offset="50%" stopColor="#f3f4f6" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#f3f4f6" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0,100 C300,150 600,50 1200,100 L1200,0 L0,0 Z" fill="url(#wave)"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            {/* Section Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full text-gray-600 text-sm font-medium tracking-wider mb-8 border border-gray-200 shadow-sm">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              最新完工項目
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-extralight text-gray-900 mb-8 tracking-tight leading-tight">
              精選作品
            </h2>
            
            <div className="flex items-center justify-center mb-10">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-gray-300"></div>
              <div className="w-3 h-3 bg-gray-400 rounded-full mx-6 opacity-60"></div>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
            
            <p className="text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              探索我們的最新住宅設計項目，感受專業與創新的完美融合，
              <br className="hidden sm:block" />
              每一個細節都彰顯我們對品質的堅持。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative">
                  <div className="h-72 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <defs>
                          <pattern id={`pattern-${item}`} width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="10" cy="10" r="1" fill="#6b7280" opacity="0.3"/>
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill={`url(#pattern-${item})`} />
                      </svg>
                    </div>
                    <div className="text-center z-10">
                      <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg backdrop-blur-sm">
                        <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-500 font-light text-sm">專案圖片</span>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white">
                      <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                        查看詳情
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-light text-gray-900 tracking-wide group-hover:text-gray-700 transition-colors duration-200">
                      住宅項目 {item}
                    </h3>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-light text-sm">
                      預計完工：2024年 Q{item + 1}
                    </p>
                  </div>
                  
                  <p className="text-gray-600 font-light leading-relaxed">
                    現代簡約風格住宅設計，注重自然光線與空間流動性，
                    打造舒適優雅的生活空間。
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-400">
                      <div className="flex items-center mr-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        進行中
                      </div>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        台北市
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/portfolio"
              className="group inline-flex items-center px-12 py-5 bg-gray-900 text-white font-medium text-lg tracking-wide hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              查看更多作品
              <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="stats-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#stats-grid)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-extralight text-white mb-2">50+</div>
              <div className="text-white/70 font-light tracking-wide">完成項目</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-extralight text-white mb-2">15</div>
              <div className="text-white/70 font-light tracking-wide">年經驗</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-extralight text-white mb-2">100%</div>
              <div className="text-white/70 font-light tracking-wide">客戶滿意</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-extralight text-white mb-2">24/7</div>
              <div className="text-white/70 font-light tracking-wide">專業服務</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
