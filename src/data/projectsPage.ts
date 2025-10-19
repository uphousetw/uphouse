export interface ProjectsPageContent {
  pageTitle: string
  pageDescription: string
}

export interface ProjectsPageContentRow {
  id: string
  page_title: string
  page_description: string
  updated_at: string
  updated_by: string | null
}

export const mapProjectsPageContent = (row: ProjectsPageContentRow): ProjectsPageContent => ({
  pageTitle: row.page_title,
  pageDescription: row.page_description,
})

export const defaultProjectsPageContent: ProjectsPageContent = {
  pageTitle: '建案一覽',
  pageDescription: '我們提供從預售、施工中到已完工的多元住宅選擇。請依照您的購屋需求挑選合適的建案，並來電預約。',
}
