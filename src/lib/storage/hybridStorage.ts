import { Project } from '@/lib/data/projects'
import { SupabaseHeroImage, SupabaseContact } from '@/lib/supabase'

// File storage functions
import {
  getAllProjects as getFileProjects,
  getProjectById as getFileProjectById,
  addProject as addFileProject,
  updateProject as updateFileProject,
  deleteProject as deleteFileProject
} from './projectStorage'

// Supabase storage functions
import {
  getAllProjectsFromSupabase,
  getProjectByIdFromSupabase,
  addProjectToSupabase,
  updateProjectInSupabase,
  deleteProjectFromSupabase,
  getAllHeroImagesFromSupabase,
  addHeroImageToSupabase,
  getAllContactsFromSupabase,
  addContactToSupabase,
  updateContactInSupabase,
  isSupabaseAvailable
} from './supabaseStorage'

// Environment detection
const isNetlify = () => process.env.NETLIFY === 'true'
const isProduction = () => process.env.NODE_ENV === 'production'

// Hybrid storage functions - automatically choose between file storage and Supabase
export async function getAllProjects(): Promise<Project[]> {
  // Check if Supabase is available first
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    console.log('🗄️ Using Supabase for getAllProjects')
    return await getAllProjectsFromSupabase()
  } else {
    console.log('📁 Using file storage for getAllProjects')
    return getFileProjects()
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    console.log('🗄️ Using Supabase for getProjectById:', id)
    return await getProjectByIdFromSupabase(id)
  } else {
    console.log('📁 Using file storage for getProjectById:', id)
    return getFileProjectById(id) || null
  }
}

export async function addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    console.log('🗄️ Using Supabase for addProject')
    return await addProjectToSupabase(projectData)
  } else {
    console.log('📁 Using file storage for addProject')
    try {
      return addFileProject(projectData)
    } catch (error) {
      console.error('File storage failed:', error)
      return null
    }
  }
}

export async function updateProject(id: number, updateData: Partial<Project>): Promise<Project | null> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    console.log('🗄️ Using Supabase for updateProject:', id)
    return await updateProjectInSupabase(id, updateData)
  } else {
    console.log('📁 Using file storage for updateProject:', id)
    try {
      return updateFileProject(id, updateData)
    } catch (error) {
      console.error('File storage failed:', error)
      return null
    }
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    console.log('🗄️ Using Supabase for deleteProject:', id)
    return await deleteProjectFromSupabase(id)
  } else {
    console.log('📁 Using file storage for deleteProject:', id)
    try {
      return deleteFileProject(id)
    } catch (error) {
      console.error('File storage failed:', error)
      return false
    }
  }
}

// Hero Images (Supabase only for now)
export async function getAllHeroImages(): Promise<SupabaseHeroImage[]> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    return await getAllHeroImagesFromSupabase()
  } else {
    console.warn('Hero images require Supabase - returning empty array')
    return []
  }
}

export async function addHeroImage(heroImageData: Omit<SupabaseHeroImage, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseHeroImage | null> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    return await addHeroImageToSupabase(heroImageData)
  } else {
    console.warn('Hero images require Supabase')
    return null
  }
}

// Contacts (Supabase only for now)
export async function getAllContacts(): Promise<SupabaseContact[]> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    return await getAllContactsFromSupabase()
  } else {
    console.warn('Contacts require Supabase - returning empty array')
    return []
  }
}

export async function addContact(contactData: Omit<SupabaseContact, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseContact | null> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    return await addContactToSupabase(contactData)
  } else {
    console.warn('Contacts require Supabase')
    return null
  }
}

export async function updateContact(id: number, updateData: Partial<SupabaseContact>): Promise<SupabaseContact | null> {
  const supabaseAvailable = await isSupabaseAvailable()

  if (supabaseAvailable) {
    return await updateContactInSupabase(id, updateData)
  } else {
    console.warn('Contacts require Supabase')
    return null
  }
}

// Utility function to check current storage method
export async function getCurrentStorageMethod(): Promise<'supabase' | 'file'> {
  const supabaseAvailable = await isSupabaseAvailable()
  return supabaseAvailable ? 'supabase' : 'file'
}