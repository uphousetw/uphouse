import { supabase, SupabaseProject, SupabaseHeroImage, SupabaseContact } from '@/lib/supabase'
import { Project } from '@/lib/data/projects'

// Helper function to convert Supabase project to internal Project type
function convertSupabaseProject(supabaseProject: SupabaseProject): Project {
  return {
    id: supabaseProject.id,
    title: supabaseProject.title,
    description: supabaseProject.description,
    fullDescription: supabaseProject.full_description,
    image: supabaseProject.image,
    completionDate: supabaseProject.completion_date,
    category: supabaseProject.category,
    location: supabaseProject.location,
    area: supabaseProject.area,
    features: supabaseProject.features || [],
    gallery: supabaseProject.gallery || [],
    brandLogos: supabaseProject.brand_logos || [],
    createdAt: supabaseProject.created_at,
    updatedAt: supabaseProject.updated_at
  }
}

// Helper function to convert internal Project to Supabase format
function convertToSupabaseProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Omit<SupabaseProject, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: project.title,
    description: project.description,
    full_description: project.fullDescription,
    image: project.image,
    completion_date: project.completionDate,
    category: project.category,
    location: project.location,
    area: project.area,
    features: project.features || [],
    gallery: project.gallery || [],
    brand_logos: project.brandLogos || []
  }
}

// Projects
export async function getAllProjectsFromSupabase(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects from Supabase:', error)
      return []
    }

    return data?.map(convertSupabaseProject) || []
  } catch (error) {
    console.error('Error in getAllProjectsFromSupabase:', error)
    return []
  }
}

export async function getProjectByIdFromSupabase(id: number): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching project by ID from Supabase:', error)
      return null
    }

    return data ? convertSupabaseProject(data) : null
  } catch (error) {
    console.error('Error in getProjectByIdFromSupabase:', error)
    return null
  }
}

export async function addProjectToSupabase(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  try {
    const supabaseProject = convertToSupabaseProject(projectData)

    const { data, error } = await supabase
      .from('projects')
      .insert([supabaseProject])
      .select()
      .single()

    if (error) {
      console.error('Error adding project to Supabase:', error)
      return null
    }

    return data ? convertSupabaseProject(data) : null
  } catch (error) {
    console.error('Error in addProjectToSupabase:', error)
    return null
  }
}

export async function updateProjectInSupabase(id: number, updateData: Partial<Project>): Promise<Project | null> {
  try {
    // Convert update data to Supabase format
    const supabaseUpdate: any = {}

    if (updateData.title !== undefined) supabaseUpdate.title = updateData.title
    if (updateData.description !== undefined) supabaseUpdate.description = updateData.description
    if (updateData.fullDescription !== undefined) supabaseUpdate.full_description = updateData.fullDescription
    if (updateData.image !== undefined) supabaseUpdate.image = updateData.image
    if (updateData.completionDate !== undefined) supabaseUpdate.completion_date = updateData.completionDate
    if (updateData.category !== undefined) supabaseUpdate.category = updateData.category
    if (updateData.location !== undefined) supabaseUpdate.location = updateData.location
    if (updateData.area !== undefined) supabaseUpdate.area = updateData.area
    if (updateData.features !== undefined) supabaseUpdate.features = updateData.features
    if (updateData.gallery !== undefined) supabaseUpdate.gallery = updateData.gallery
    if (updateData.brandLogos !== undefined) supabaseUpdate.brand_logos = updateData.brandLogos

    const { data, error } = await supabase
      .from('projects')
      .update(supabaseUpdate)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project in Supabase:', error)
      return null
    }

    return data ? convertSupabaseProject(data) : null
  } catch (error) {
    console.error('Error in updateProjectInSupabase:', error)
    return null
  }
}

export async function deleteProjectFromSupabase(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project from Supabase:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteProjectFromSupabase:', error)
    return false
  }
}

// Hero Images
export async function getAllHeroImagesFromSupabase(): Promise<SupabaseHeroImage[]> {
  try {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching hero images from Supabase:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllHeroImagesFromSupabase:', error)
    return []
  }
}

export async function addHeroImageToSupabase(heroImageData: Omit<SupabaseHeroImage, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseHeroImage | null> {
  try {
    const { data, error } = await supabase
      .from('hero_images')
      .insert([heroImageData])
      .select()
      .single()

    if (error) {
      console.error('Error adding hero image to Supabase:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in addHeroImageToSupabase:', error)
    return null
  }
}

// Contacts
export async function getAllContactsFromSupabase(): Promise<SupabaseContact[]> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contacts from Supabase:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllContactsFromSupabase:', error)
    return []
  }
}

export async function addContactToSupabase(contactData: Omit<SupabaseContact, 'id' | 'created_at' | 'updated_at'>): Promise<SupabaseContact | null> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single()

    if (error) {
      console.error('Error adding contact to Supabase:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in addContactToSupabase:', error)
    return null
  }
}

export async function updateContactInSupabase(id: number, updateData: Partial<SupabaseContact>): Promise<SupabaseContact | null> {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating contact in Supabase:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updateContactInSupabase:', error)
    return null
  }
}

// Check if Supabase is available
export async function isSupabaseAvailable(): Promise<boolean> {
  try {
    // Try to access Supabase environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return false
    }

    // Test connection with a simple query
    const { error } = await supabase
      .from('projects')
      .select('id')
      .limit(1)

    return !error
  } catch (error) {
    console.error('Supabase not available:', error)
    return false
  }
}