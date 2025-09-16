import { memo } from 'react'

interface BrandLogo {
  name: string
  category: string
  logoUrl?: string
}

interface BrandLogosSectionProps {
  brandLogos: BrandLogo[]
}

// Memoize the component to prevent unnecessary re-renders
const BrandLogosSection = memo(function BrandLogosSection({ brandLogos }: BrandLogosSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-light text-gray-900 mb-12 tracking-tight">
          合作品牌
        </h2>

        {/* Responsive Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {brandLogos.map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition-shadow duration-300">
              <div className="w-full aspect-[3/2] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden mb-3">
                {logo.logoUrl ? (
                  <img
                    src={logo.logoUrl}
                    alt={logo.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `
                          <div class="bg-red-500 text-white p-2 rounded text-xs font-medium text-center leading-tight">
                            ${logo.name}<br />LOGO
                          </div>
                        `
                      }
                    }}
                  />
                ) : (
                  <div className="bg-red-500 text-white p-2 rounded text-xs font-medium text-center leading-tight">
                    {logo.name}<br />LOGO
                  </div>
                )}
              </div>
              <div className="text-sm font-medium text-gray-900 mb-1">{logo.name}</div>
              <div className="text-xs text-gray-500">{logo.category}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

export default BrandLogosSection