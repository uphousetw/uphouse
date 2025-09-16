import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface NetlifyCMSProject {
  title: string
  description: string
  fullDescription?: string
  image: string
  completionDate: string
  category: string
  location: string
  area: string
  features: string[]
  gallery: string[]
  brandLogos: Array<{
    name: string
    category: string
    logoUrl?: string
  }>
}

export interface NetlifyCMSHeroImage {
  title: string
  image: string
  description?: string
  order: number
}

export interface NetlifyCMSContact {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: '未讀' | '已讀' | '已回覆'
  createdAt: string
}

const CONTENT_DIR = path.join(process.cwd(), 'content')
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects')
const HERO_IMAGES_DIR = path.join(CONTENT_DIR, 'hero-images')
const CONTACT_DIR = path.join(CONTENT_DIR, 'contact')

// Ensure directories exist
function ensureDirectories() {
  [CONTENT_DIR, PROJECTS_DIR, HERO_IMAGES_DIR, CONTACT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

// Create markdown file with frontmatter
function createMarkdownFile(filePath: string, data: Record<string, unknown>, content: string = '') {
  const frontmatter = matter.stringify(content, data)
  fs.writeFileSync(filePath, frontmatter, 'utf8')
}

// Read markdown file and parse frontmatter
function readMarkdownFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return null
  }
  const fileContent = fs.readFileSync(filePath, 'utf8')
  return matter(fileContent)
}

// Projects
export function getAllNetlifyProjects(): NetlifyCMSProject[] {
  ensureDirectories()

  try {
    const files = fs.readdirSync(PROJECTS_DIR).filter(file => file.endsWith('.md'))
    return files.map(file => {
      const filePath = path.join(PROJECTS_DIR, file)
      const parsed = readMarkdownFile(filePath)
      return parsed?.data as NetlifyCMSProject
    }).filter(Boolean)
  } catch (error) {
    console.error('Error reading Netlify CMS projects:', error)
    return []
  }
}

export function getNetlifyProjectBySlug(slug: string): NetlifyCMSProject | null {
  ensureDirectories()

  const filePath = path.join(PROJECTS_DIR, `${slug}.md`)
  const parsed = readMarkdownFile(filePath)
  return parsed?.data as NetlifyCMSProject || null
}

export function createNetlifyProject(data: NetlifyCMSProject): void {
  ensureDirectories()

  const slug = data.title.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const fileName = `${new Date().toISOString().split('T')[0]}-${slug}.md`
  const filePath = path.join(PROJECTS_DIR, fileName)

  createMarkdownFile(filePath, data as unknown as Record<string, unknown>, data.description)
}

// Hero Images
export function getAllNetlifyHeroImages(): NetlifyCMSHeroImage[] {
  ensureDirectories()

  try {
    const files = fs.readdirSync(HERO_IMAGES_DIR).filter(file => file.endsWith('.md'))
    return files.map(file => {
      const filePath = path.join(HERO_IMAGES_DIR, file)
      const parsed = readMarkdownFile(filePath)
      return parsed?.data as NetlifyCMSHeroImage
    }).filter(Boolean).sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error reading Netlify CMS hero images:', error)
    return []
  }
}

export function createNetlifyHeroImage(data: NetlifyCMSHeroImage): void {
  ensureDirectories()

  const slug = data.title.toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const fileName = `${slug}.md`
  const filePath = path.join(HERO_IMAGES_DIR, fileName)

  createMarkdownFile(filePath, data as unknown as Record<string, unknown>, data.description || '')
}

// Contact
export function getAllNetlifyContacts(): NetlifyCMSContact[] {
  ensureDirectories()

  try {
    const files = fs.readdirSync(CONTACT_DIR).filter(file => file.endsWith('.md'))
    return files.map(file => {
      const filePath = path.join(CONTACT_DIR, file)
      const parsed = readMarkdownFile(filePath)
      return parsed?.data as NetlifyCMSContact
    }).filter(Boolean).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('Error reading Netlify CMS contacts:', error)
    return []
  }
}

export function createNetlifyContact(data: NetlifyCMSContact): void {
  ensureDirectories()

  const date = new Date(data.createdAt)
  const dateStr = date.toISOString().slice(0, 16).replace('T', '-').replace(':', '-')
  const fileName = `${dateStr}.md`
  const filePath = path.join(CONTACT_DIR, fileName)

  createMarkdownFile(filePath, data as unknown as Record<string, unknown>, data.message)
}

// Migration utilities
export function migrateToNetlifyCMS() {
  // This function would migrate existing data to Netlify CMS format
  // Implementation would depend on your existing data structure
  console.log('Migration to Netlify CMS completed')
}