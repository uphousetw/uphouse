export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  projectType?: string
  budget?: string
  message: string
  submittedAt: string
  status: 'new' | 'read' | 'replied'
}

// Shared mock database - In production, replace with real database
export const contactSubmissions: ContactSubmission[] = [
  {
    id: 'contact_1',
    name: '張先生',
    email: 'zhang@example.com',
    phone: '0912345678',
    projectType: '新建住宅',
    budget: '1000-2000萬',
    message: '我想要建造一間現代風格的住宅，地點在台北市，預計明年開始施工。',
    submittedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    status: 'new'
  }
]