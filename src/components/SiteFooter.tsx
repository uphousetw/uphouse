import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  { label: '首頁', to: '/' },
  { label: '關於我們', to: '/about' },
  { label: '建案一覽', to: '/projects' },
  { label: '聯絡我們', to: '/contact' },
]

export const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        <div>
          <p className="text-lg font-semibold text-foreground">Uphouse 建設</p>
          <p className="mt-2 text-sm text-muted-foreground">
            匯聚建築、美學與生活價值，為家庭打造值得信任的居住選擇。
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border bg-secondary/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Uphouse Construction. All rights reserved.</p>
          <p>台北市信義區松仁路 123 號 10 樓｜(02) 1234-5678</p>
        </div>
      </div>
    </footer>
  )
}
