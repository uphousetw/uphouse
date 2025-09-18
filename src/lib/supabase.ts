import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if both credentials are available
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database types
export interface SupabaseProject {
  id: number
  title: string
  description: string
  full_description?: string
  image?: string
  completion_date: string
  category: string
  location?: string
  area?: string
  features: string[]
  gallery: string[]
  brand_logos: Array<{
    name: string
    category: string
    logoUrl?: string
  }>
  created_at: string
  updated_at: string
}

export interface SupabaseHeroImage {
  id: number
  title: string
  image: string
  description?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface SupabaseContact {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: '未讀' | '已讀' | '已回覆'
  created_at: string
  updated_at: string
}