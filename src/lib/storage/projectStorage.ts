import fs from 'fs'
import path from 'path'
import { Project } from '@/lib/data/projects'

const STORAGE_DIR = path.join(process.cwd(), 'data')
const PROJECTS_FILE = path.join(STORAGE_DIR, 'projects.json')

// Ensure storage directory exists
function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }
}

// Default projects for initial setup
const defaultProjects: Project[] = [
  {
    id: 1,
    title: "現代簡約別墅",
    description: "位於台北市的現代簡約風格別墅，採用大面積玻璃窗設計，讓自然光線充分進入室內空間。",
    fullDescription: "這是一個位於台北市精華地段的現代簡約風格別墅項目。設計以大面積玻璃窗為特色，讓自然光線充分進入室內空間，創造出開闊明亮的居住環境。",
    image: "/api/placeholder/800/600",
    completionDate: "2024年6月",
    category: "透天",
    location: "台北市大安區",
    area: "280坪",
    features: ["大面積玻璃窗", "開放式格局", "進口石材", "實木地板", "智慧家居系統"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    brandLogos: [
      { name: "台灣水泥", category: "水泥製造" },
      { name: "潤泰建材", category: "綜合建材" },
      { name: "三商建材", category: "建築材料" },
      { name: "國產建材實業", category: "建材實業" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "都會雅居",
    description: "坐落於新北市的都會住宅設計，強調空間的多功能性與收納效率。",
    fullDescription: "都會雅居項目位於新北市核心區域，是專為現代都會人士打造的精緻住宅。設計特別強調空間的多功能性與收納效率。",
    image: "/api/placeholder/800/600",
    completionDate: "2024年9月",
    category: "華廈",
    location: "新北市板橋區",
    area: "120坪",
    features: ["多功能空間設計", "高效收納系統", "現代簡約風格", "優質建材", "節能環保設計"],
    gallery: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    brandLogos: [
      { name: "和成建材", category: "衛浴設備" },
      { name: "台塑建材", category: "塑膠建材" },
      { name: "潤泰建材", category: "綜合建材" },
      { name: "國產建材實業", category: "建材實業" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Load projects from file
export function loadProjects(): Project[] {
  try {
    ensureStorageDir()

    if (!fs.existsSync(PROJECTS_FILE)) {
      // Create initial file with default projects
      saveProjects(defaultProjects)
      return defaultProjects
    }

    const data = fs.readFileSync(PROJECTS_FILE, 'utf8')
    const projects = JSON.parse(data)
    return Array.isArray(projects) ? projects : defaultProjects
  } catch (error) {
    console.error('Error loading projects:', error)
    return defaultProjects
  }
}

// Save projects to file
export function saveProjects(projects: Project[]): void {
  try {
    ensureStorageDir()
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf8')
  } catch (error) {
    console.error('Error saving projects:', error)
    throw new Error('Failed to save projects')
  }
}

// Get all projects
export function getAllProjects(): Project[] {
  return loadProjects()
}

// Get project by ID
export function getProjectById(id: number): Project | undefined {
  const projects = loadProjects()
  return projects.find(project => project.id === id)
}

// Add new project
export function addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const projects = loadProjects()
  const newId = Math.max(...projects.map(p => p.id), 0) + 1

  const newProject: Project = {
    ...projectData,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  projects.push(newProject)
  saveProjects(projects)

  return newProject
}

// Update existing project
export function updateProject(id: number, updateData: Partial<Project>): Project | null {
  const projects = loadProjects()
  const projectIndex = projects.findIndex(p => p.id === id)

  if (projectIndex === -1) {
    return null
  }

  const updatedProject: Project = {
    ...projects[projectIndex],
    ...updateData,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  }

  projects[projectIndex] = updatedProject
  saveProjects(projects)

  return updatedProject
}

// Delete project
export function deleteProject(id: number): boolean {
  const projects = loadProjects()
  const initialLength = projects.length
  const filteredProjects = projects.filter(p => p.id !== id)

  if (filteredProjects.length < initialLength) {
    saveProjects(filteredProjects)
    return true
  }

  return false
}